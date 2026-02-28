# Timing module for ralph.ps1
# Step detection and timing for agent iterations

# Step definitions — label, icon, regex pattern
$script:STEP_DEFINITIONS = @(
    @{ Label = "Thinking";       Icon = "🤔"; Pattern = 'thinking|reasoning|analyzing|considering' }
    @{ Label = "Planning";       Icon = "📋"; Pattern = 'planning|creating plan|task plan|breaking down' }
    @{ Label = "Reading code";   Icon = "📖"; Pattern = 'reading file|read_file|scanning|examining|checking file' }
    @{ Label = "Searching";      Icon = "🔍"; Pattern = 'searching|grep|finding|looking for|search_files|ripgrep' }
    @{ Label = "Writing code";   Icon = "✍";  Pattern = 'writing|creating file|editing|implementing|write_to_file|create_file|replace_in_file' }
    @{ Label = "Testing";        Icon = "🧪"; Pattern = 'running test|npm test|vitest|playwright|jest|test result' }
    @{ Label = "Building";       Icon = "🏗";  Pattern = 'building|compiling|bundling|npm run build|next build' }
    @{ Label = "Installing";     Icon = "📦"; Pattern = 'installing|npm install|adding package|dependencies' }
    @{ Label = "Git";            Icon = "🔀"; Pattern = 'git commit|git add|git push|committing|staging' }
    @{ Label = "Linting";        Icon = "🧹"; Pattern = 'linting|eslint|prettier|formatting|tsc|type.check' }
    @{ Label = "Terminal";       Icon = "💻"; Pattern = 'run_in_terminal|executing command|running command|terminal|shell' }
    @{ Label = "Reviewing";      Icon = "👀"; Pattern = 'reviewing|checking|verifying|validating|inspecting' }
    @{ Label = "Debugging";      Icon = "🐛"; Pattern = 'debugging|fixing|error|traceback|stack trace|troubleshoot' }
    @{ Label = "Documenting";    Icon = "📝"; Pattern = 'documenting|writing docs|updating readme|adding comment' }
)

# Per-iteration step time tracking
$script:CURRENT_STEP = ""
$script:STEP_START_TIME = $null
$script:ITERATION_STEP_TIMES = @{}

# Session-level cumulative step totals
$script:SESSION_STEP_TOTALS = @{}

function Initialize-IterationStepTimes {
    <#
    .SYNOPSIS
    Reset per-iteration step counters at the start of each iteration.
    #>
    $script:ITERATION_STEP_TIMES = @{}
    $script:CURRENT_STEP = ""
    $script:STEP_START_TIME = $null
}

function Save-StepTime {
    <#
    .SYNOPSIS
    Record elapsed time for the current step and switch to a new one.
    #>
    param([string]$NewStep)

    if ($script:CURRENT_STEP -and $script:STEP_START_TIME) {
        $elapsed = ((Get-Date) - $script:STEP_START_TIME).TotalSeconds
        $elapsed = [math]::Round($elapsed)

        if (-not $script:ITERATION_STEP_TIMES.ContainsKey($script:CURRENT_STEP)) {
            $script:ITERATION_STEP_TIMES[$script:CURRENT_STEP] = 0
        }
        $script:ITERATION_STEP_TIMES[$script:CURRENT_STEP] += $elapsed

        # Accumulate to session totals
        if (-not $script:SESSION_STEP_TOTALS.ContainsKey($script:CURRENT_STEP)) {
            $script:SESSION_STEP_TOTALS[$script:CURRENT_STEP] = 0
        }
        $script:SESSION_STEP_TOTALS[$script:CURRENT_STEP] += $elapsed
    }

    $script:CURRENT_STEP = $NewStep
    $script:STEP_START_TIME = Get-Date
}

function Find-Step {
    <#
    .SYNOPSIS
    Detect which step a line of output corresponds to.
    Returns step label or empty string.
    #>
    param([string]$Line)
    $lower = $Line.ToLower()
    foreach ($def in $script:STEP_DEFINITIONS) {
        if ($lower -match $def.Pattern) {
            return $def.Label
        }
    }
    return ""
}

function Update-SpinnerStep {
    <#
    .SYNOPSIS
    Detect step from output line and update the step file for the spinner.
    #>
    param([string]$Line)
    $detected = Find-Step $Line
    if ($detected -and $detected -ne $script:CURRENT_STEP) {
        Save-StepTime $detected
        # Write step to temp file for spinner to read
        if ($script:STEP_FILE -and (Test-Path $script:STEP_FILE)) {
            Set-Content -Path $script:STEP_FILE -Value $detected -NoNewline
        }
    }
}

function Format-Duration {
    <#
    .SYNOPSIS
    Format seconds to human-readable duration string.
    #>
    param([int]$Seconds)
    if ($Seconds -lt 60) { return "${Seconds}s" }
    $m = [math]::Floor($Seconds / 60)
    $s = $Seconds % 60
    if ($m -lt 60) { return "${m}m ${s}s" }
    $h = [math]::Floor($m / 60)
    $m = $m % 60
    return "${h}h ${m}m ${s}s"
}

function Format-Delta {
    <#
    .SYNOPSIS
    Format relative change between current and previous duration.
    #>
    param([int]$Current, [int]$Previous)
    if ($Previous -eq 0) { return "" }
    $diff = $Current - $Previous
    if ($diff -eq 0) { return "${script:D}±0s${script:R}" }
    if ($diff -gt 0) {
        return "${script:RD}+$(Format-Duration $diff)${script:R}"
    } else {
        return "${script:GR}-$(Format-Duration ([math]::Abs($diff)))${script:R}"
    }
}

function Format-StepTimes {
    <#
    .SYNOPSIS
    Format step times table for display.
    #>
    param([string]$Scope) # "ITERATION" or "SESSION"

    $data = if ($Scope -eq "SESSION") { $script:SESSION_STEP_TOTALS } else { $script:ITERATION_STEP_TIMES }
    if (-not $data -or $data.Count -eq 0) { return "" }

    $parts = @()
    # Sort by time descending
    $sorted = $data.GetEnumerator() | Sort-Object -Property Value -Descending
    foreach ($entry in $sorted) {
        if ($entry.Value -gt 0) {
            # Find icon for step
            $icon = ""
            foreach ($def in $script:STEP_DEFINITIONS) {
                if ($def.Label -eq $entry.Key) {
                    $icon = $def.Icon
                    break
                }
            }
            $dur = Format-Duration $entry.Value
            $parts += "$icon $($entry.Key): ${script:Y}$dur${script:R}"
        }
    }
    return ($parts -join " ${script:D}|${script:R} ")
}

function Show-SessionStepTotals {
    <#
    .SYNOPSIS
    Display cumulative step totals for the entire session.
    #>
    if ($script:SESSION_STEP_TOTALS.Count -gt 0) {
        $output = Format-StepTimes "SESSION"
        if ($output) {
            Write-Host "  ${script:D}Session step totals:${script:R}"
            Write-Host "  $output"
        }
    }
}
