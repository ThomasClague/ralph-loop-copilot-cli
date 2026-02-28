<#
.SYNOPSIS
Ralph Wiggum - Long-running AI agent loop (PowerShell)
.DESCRIPTION
Iteratively runs GitHub Copilot CLI in autopilot mode, parsing output for
promise tags to detect completion, blocked states, or decision requests.
.PARAMETER MaxIterations
Maximum number of iterations (default: 10)
.PARAMETER Once
Run exactly 1 iteration
.PARAMETER Help
Show help message
.EXAMPLE
.\ralph.ps1
.\ralph.ps1 -MaxIterations 5
.\ralph.ps1 -Once
.\ralph.ps1 -n 3
#>

param(
    [Alias("n")]
    [int]$MaxIterations = 0,
    [switch]$Once,
    [Alias("h")]
    [switch]$Help
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Resolve script directory and set as working directory
$script:SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $script:SCRIPT_DIR

# Key paths
$script:PRD_FILE      = Join-Path $script:SCRIPT_DIR ".agent" "prd" "PRD.md"
$script:PROGRESS_FILE = Join-Path $script:SCRIPT_DIR ".agent" "logs" "LOG.md"
$script:HISTORY_DIR   = Join-Path $script:SCRIPT_DIR ".agent" "history"

# Source all library modules
$libDir = Join-Path $script:SCRIPT_DIR "scripts" "lib"
. (Join-Path $libDir "constants.ps1")
. (Join-Path $libDir "logging.ps1")
. (Join-Path $libDir "terminal.ps1")
. (Join-Path $libDir "preflight.ps1")
. (Join-Path $libDir "timing.ps1")
. (Join-Path $libDir "spinner.ps1")
. (Join-Path $libDir "preview.ps1")
. (Join-Path $libDir "output.ps1")
. (Join-Path $libDir "cleanup.ps1")
. (Join-Path $libDir "promise.ps1")
. (Join-Path $libDir "notify.ps1")
. (Join-Path $libDir "display.ps1")
. (Join-Path $libDir "args.ps1")

# Handle arguments
if ($Help) {
    Show-RalphHelp
    exit 0
}

# If MaxIterations wasn't set via param, check for positional arg or default
if ($MaxIterations -eq 0) {
    # Check if there are remaining args that look like a number
    if ($args.Count -gt 0 -and $args[0] -match '^\d+$') {
        $MaxIterations = [int]$args[0]
    } else {
        $MaxIterations = 10
    }
}

if ($Once) {
    $MaxIterations = 1
}

# Timing
$script:START_TIME = Get-Date
$script:ITERATION_TIMES = [System.Collections.Generic.List[int]]::new()
$script:TOTAL_ITERATION_TIME = 0
$script:PREV_ITERATION_TIME = 0

# Session ID for unique history file naming
$script:SESSION_ID = (Get-Date).ToString("yyyyMMdd-HHmmss")

# Temporary files for spinner communication
$script:STEP_FILE = [System.IO.Path]::GetTempFileName()
$script:PREVIEW_LINE_FILE = [System.IO.Path]::GetTempFileName()

# Background process tracking
$script:AGENT_PROCESS = $null
$script:OUTPUT_FILE = $null
$script:FULL_OUTPUT_FILE = $null

# Initialize progress file if it doesn't exist
if (-not (Test-Path $script:PROGRESS_FILE)) {
    $logDir = Split-Path $script:PROGRESS_FILE -Parent
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    @(
        "# Ralph Progress Log"
        "Started: $(Get-Date)"
        "---"
    ) | Set-Content $script:PROGRESS_FILE
}

# Pre-flight checks
Test-AnsiSupport
Test-GitRepo
Test-CopilotCli
Test-RequiredFiles
Test-HistoryDir

Show-Ralph
Write-Host " ${script:C}Starting Ralph${script:R} $([char]0x30FB) ${script:Y}v$script:VERSION${script:R} $([char]0x30FB) Max iterations: ${script:Y}$MaxIterations${script:R}"
Write-Host ""

# Main loop wrapped in try/finally for cleanup
try {
    for ($i = 1; $i -le $MaxIterations; $i++) {
        $iterStart = Get-Date

        # Initialize step timing for this iteration
        Initialize-IterationStepTimes

        Write-Host "${script:B}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
        Write-Host "  ↪ Iteration ${script:Y}$i${script:R} of ${script:Y}$MaxIterations${script:R}"
        Write-Host "${script:B}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
        Write-Host ""

        # Build prompt content
        $promptPath = Join-Path $script:SCRIPT_DIR ".agent" "PROMPT.md"
        $promptContent = "PROJECT_ROOT=$($script:SCRIPT_DIR)`n`n$(Get-Content $promptPath -Raw)"

        # Start spinner
        Start-RalphSpinner

        # Initialize rolling preview
        Initialize-RollingPreview

        # Create temp files for output
        $script:OUTPUT_FILE = [System.IO.Path]::GetTempFileName()
        $script:FULL_OUTPUT_FILE = [System.IO.Path]::GetTempFileName()

        # Run Copilot CLI in background
        $env:PROMPT_CONTENT = $promptContent

        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "copilot"
        $psi.Arguments = "--autopilot --yolo --no-ask-user --max-autopilot-continues $MaxIterations -s -p `"$($promptContent -replace '"','\"')`""
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.UseShellExecute = $false
        $psi.CreateNoWindow = $true
        $psi.WorkingDirectory = $script:SCRIPT_DIR

        $script:AGENT_PROCESS = [System.Diagnostics.Process]::Start($psi)
        $agentPid = $script:AGENT_PROCESS.Id

        # Read output asynchronously
        $outputBuilder = [System.Text.StringBuilder]::new()
        $fullOutputBuilder = [System.Text.StringBuilder]::new()

        # Async output reading
        $stdoutTask = $script:AGENT_PROCESS.StandardOutput.ReadToEndAsync()
        $stderrTask = $script:AGENT_PROCESS.StandardError.ReadToEndAsync()

        # Poll until process exits, reading output incrementally
        # We use ReadToEnd since copilot output comes as a stream
        while (-not $script:AGENT_PROCESS.HasExited) {
            Start-Sleep -Milliseconds 200

            # Check if output file exists and has new content
            # (Some copilot versions write to stdout, we capture via redirect)
        }

        # Wait for process to fully exit
        $script:AGENT_PROCESS.WaitForExit()

        # Get all output
        $rawOutput = $stdoutTask.Result
        $rawStderr = $stderrTask.Result

        # Save raw output to file for processing
        if ($rawOutput) {
            Set-Content -Path $script:OUTPUT_FILE -Value $rawOutput -Encoding UTF8
        }
        if ($rawStderr) {
            Add-Content -Path $script:OUTPUT_FILE -Value $rawStderr -Encoding UTF8
        }

        # Parse output lines
        $outputLines = ($rawOutput + "`n" + $rawStderr) -split "`n"
        $parsedLines = @()

        foreach ($line in $outputLines) {
            if (-not $line.Trim()) { continue }
            $parsed = ConvertFrom-JsonContent $line
            if ($parsed) {
                $parsedLines += $parsed
                $null = $fullOutputBuilder.AppendLine($parsed)

                # Update spinner step
                Update-SpinnerStep $parsed
                # Update preview
                Update-PreviewLine $parsed
            }
        }

        # Write parsed output
        $fullOutput = $fullOutputBuilder.ToString()
        Set-Content -Path $script:FULL_OUTPUT_FILE -Value $fullOutput -Encoding UTF8

        $OUTPUT = $fullOutput
        $script:AGENT_PROCESS = $null

        # Check for Copilot CLI not found error
        if ($rawOutput -match 'copilot: command not found|copilot: not found' -or
            $rawStderr -match 'copilot: command not found|copilot: not found|is not recognized') {
            Stop-RalphSpinner
            Clear-RollingPreview
            Write-Host ""
            Write-Host "${script:RD}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
            Write-Host "  ❌ ${script:RD}Copilot CLI Not Found${script:R}"
            Write-Host "  Install: ${script:C}npm install -g @github/copilot${script:R}"
            Write-Host "  Or: ${script:C}winget install GitHub.Copilot${script:R}"
            Write-Host "${script:RD}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
            exit $script:EXIT_CLI_ERROR
        }

        # Check for authentication error
        if ($rawOutput -match 'Invalid API key|not authenticated|login required|COPILOT_GITHUB_TOKEN' -or
            $rawStderr -match 'Invalid API key|not authenticated|login required|COPILOT_GITHUB_TOKEN') {
            Stop-RalphSpinner
            Clear-RollingPreview
            Write-Host ""
            Write-Host "${script:RD}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
            Write-Host "  ❌ ${script:RD}Authentication Error${script:R}"
            Write-Host "  Authenticate: ${script:C}copilot${script:R} then use ${script:C}/login${script:R}"
            Write-Host "  Or set ${script:C}COPILOT_GITHUB_TOKEN${script:R} env var"
            Write-Host "${script:RD}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
            exit $script:EXIT_AUTH_ERROR
        }

        # Save cleaned output to history (session ID prevents overwrites)
        $historyFile = Join-Path $script:HISTORY_DIR "ITERATION-$($script:SESSION_ID)-$i.txt"
        Remove-AnsiFromFile $script:OUTPUT_FILE $historyFile

        # Extract final summary
        $finalSummary = Get-FinalSummary $script:OUTPUT_FILE

        # Clean up temp output files
        Remove-Item $script:FULL_OUTPUT_FILE -Force -ErrorAction SilentlyContinue
        $script:FULL_OUTPUT_FILE = $null

        # Stop spinner
        Stop-RalphSpinner

        # Record final step time
        Save-StepTime ""

        # Clear rolling preview
        Clear-RollingPreview

        # Display final summary
        if ($finalSummary) {
            Show-FinalSummary $finalSummary 10
        } else {
            # Fallback: show last 10 lines
            $fallback = ($OUTPUT -split "`n" | Select-Object -Last 10) -join "`n"
            if ($fallback.Trim()) {
                Show-FinalSummary $fallback 10
            }
        }

        # Clean up raw output file
        Remove-Item $script:OUTPUT_FILE -Force -ErrorAction SilentlyContinue
        $script:OUTPUT_FILE = $null

        # Calculate iteration duration
        $iterEnd = Get-Date
        $iterDuration = [int]($iterEnd - $iterStart).TotalSeconds
        $script:ITERATION_TIMES.Add($iterDuration)
        $script:TOTAL_ITERATION_TIME += $iterDuration
        $iterAvg = [int]($script:TOTAL_ITERATION_TIME / $script:ITERATION_TIMES.Count)
        $iterStr = Format-Duration $iterDuration
        $avgStr = Format-Duration $iterAvg
        $deltaStr = Format-Delta $iterDuration $script:PREV_ITERATION_TIME
        $script:PREV_ITERATION_TIME = $iterDuration

        # Check for COMPLETE tag
        if ((Test-CompleteTag $OUTPUT) -or (Test-CompleteTag $finalSummary)) {
            $elapsed = [int]((Get-Date) - $script:START_TIME).TotalSeconds
            $elapsedStr = Format-Duration $elapsed
            Write-Host ""
            Write-Host "${script:GR}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
            Write-Host "  🎉 ${script:GR}Ralph completed all tasks!${script:R}"
            Write-Host "  ✅ Finished at iteration ${script:GR}$i${script:R} of ${script:GR}$MaxIterations${script:R}"
            if ($deltaStr) {
                Write-Host "  ⏱️  Iteration $i`: ${script:Y}$iterStr${script:R} ($deltaStr) ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R}"
            } else {
                Write-Host "  ⏱️  Iteration $i`: ${script:Y}$iterStr${script:R} ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R}"
            }
            Write-Host "  ⏱️  Total time: ${script:Y}$elapsedStr${script:R}"
            Show-SessionStepTotals
            Write-Host "${script:GR}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
            exit $script:EXIT_COMPLETE
        }

        # Check for BLOCKED tag
        if ((Test-BlockedTag $OUTPUT) -or (Test-BlockedTag $finalSummary)) {
            $blockedReason = Get-BlockedReason $OUTPUT
            if (-not $blockedReason) { $blockedReason = Get-BlockedReason $finalSummary }
            $elapsed = [int]((Get-Date) - $script:START_TIME).TotalSeconds
            $elapsedStr = Format-Duration $elapsed
            Send-NotificationSound
            Send-DesktopNotification "Ralph - BLOCKED" $blockedReason
            Show-BlockedMessage $blockedReason $i
            if ($deltaStr) {
                Write-Host "  ⏱️  Iteration $i`: ${script:Y}$iterStr${script:R} ($deltaStr) ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R}"
            } else {
                Write-Host "  ⏱️  Iteration $i`: ${script:Y}$iterStr${script:R} ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R}"
            }
            Write-Host "  ⏱️  Total time: ${script:Y}$elapsedStr${script:R}"
            Show-SessionStepTotals
            exit $script:EXIT_BLOCKED
        }

        # Check for DECIDE tag
        if ((Test-DecideTag $OUTPUT) -or (Test-DecideTag $finalSummary)) {
            $decideQuestion = Get-DecideQuestion $OUTPUT
            if (-not $decideQuestion) { $decideQuestion = Get-DecideQuestion $finalSummary }
            $elapsed = [int]((Get-Date) - $script:START_TIME).TotalSeconds
            $elapsedStr = Format-Duration $elapsed
            Send-NotificationSound
            Send-DesktopNotification "Ralph - Decision Needed" $decideQuestion
            Show-DecideMessage $decideQuestion $i
            if ($deltaStr) {
                Write-Host "  ⏱️  Iteration $i`: ${script:Y}$iterStr${script:R} ($deltaStr) ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R}"
            } else {
                Write-Host "  ⏱️  Iteration $i`: ${script:Y}$iterStr${script:R} ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R}"
            }
            Write-Host "  ⏱️  Total time: ${script:Y}$elapsedStr${script:R}"
            Show-SessionStepTotals
            exit $script:EXIT_DECIDE
        }

        # Normal iteration complete
        $elapsed = [int]((Get-Date) - $script:START_TIME).TotalSeconds
        $elapsedStr = Format-Duration $elapsed

        if ($deltaStr) {
            Write-Host "${script:G}  └── ✓ Iteration $i complete${script:R} ${script:C}│${script:R} Iteration: ${script:Y}$iterStr${script:R} ($deltaStr) ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R} ${script:C}│${script:R} Total: ${script:Y}$elapsedStr${script:R}"
        } else {
            Write-Host "${script:G}  └── ✓ Iteration $i complete${script:R} ${script:C}│${script:R} Iteration: ${script:Y}$iterStr${script:R} ${script:C}│${script:R} Average: ${script:Y}$avgStr${script:R} ${script:C}│${script:R} Total: ${script:Y}$elapsedStr${script:R}"
        }

        # Display per-iteration step times
        $stepTimesOutput = Format-StepTimes "ITERATION"
        if ($stepTimesOutput) {
            Write-Host "${script:G}      └──${script:R} $stepTimesOutput"
        }
        Start-Sleep -Seconds 2
    }

    # Reached max iterations
    $elapsed = [int]((Get-Date) - $script:START_TIME).TotalSeconds
    $elapsedStr = Format-Duration $elapsed
    $finalAvgStr = ""
    if ($script:ITERATION_TIMES.Count -gt 0) {
        $finalAvg = [int]($script:TOTAL_ITERATION_TIME / $script:ITERATION_TIMES.Count)
        $finalAvgStr = Format-Duration $finalAvg
    }

    Write-Host ""
    Write-Host "${script:Y}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
    Write-Host "  ⚠️  ${script:Y}Ralph reached max iterations${script:R} (${script:M}$MaxIterations${script:R})"
    if ($finalAvgStr) {
        Write-Host "  ⏱️  Average iteration time: ${script:Y}$finalAvgStr${script:R}"
    }
    Write-Host "  ⏱️  Total time: ${script:Y}$elapsedStr${script:R}"
    Show-SessionStepTotals
    Write-Host "  📋 Check progress: ${script:G}$($script:PROGRESS_FILE)${script:R}"
    Write-Host "${script:Y}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
    exit $script:EXIT_MAX_ITERATIONS
}
finally {
    Invoke-Cleanup
}
