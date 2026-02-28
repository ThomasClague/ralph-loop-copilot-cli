# Spinner module for ralph.ps1
# Background spinner with step display using a runspace/job

$script:SPINNER_JOB = $null
$script:SPINNER_CHARS = @('⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏')

function Start-RalphSpinner {
    <#
    .SYNOPSIS
    Start a background spinner that reads step from $script:STEP_FILE
    and preview line from $script:PREVIEW_LINE_FILE.
    #>

    # Ensure step file exists with initial value
    if ($script:STEP_FILE -and (Test-Path $script:STEP_FILE)) {
        Set-Content -Path $script:STEP_FILE -Value "Starting" -NoNewline
    }

    $stepFile = $script:STEP_FILE
    $previewFile = $script:PREVIEW_LINE_FILE
    $spinChars = $script:SPINNER_CHARS

    $script:SPINNER_JOB = Start-Job -ScriptBlock {
        param($StepFile, $PreviewFile, $SpinChars)

        $esc = [char]27
        $idx = 0
        $Y = "$esc[33m"; $C = "$esc[36m"; $D = "$esc[90m"; $R = "$esc[0m"

        while ($true) {
            $char = $SpinChars[$idx % $SpinChars.Count]
            $idx++

            # Read step
            $step = "Working"
            if (Test-Path $StepFile) {
                $s = Get-Content $StepFile -Raw -ErrorAction SilentlyContinue
                if ($s) { $step = $s.Trim() }
            }

            # Read preview line
            $preview = ""
            if (Test-Path $PreviewFile) {
                $p = Get-Content $PreviewFile -Raw -ErrorAction SilentlyContinue
                if ($p) { $preview = $p.Trim() }
            }

            # Build display: spinner char + step + optional preview
            $line = "  $Y$char$R ${C}$step${R}"
            if ($preview) {
                $line += " ${D}| $preview${R}"
            }

            # Truncate to terminal width
            $width = 80
            try { $width = [Console]::WindowWidth } catch {}
            $plain = $line -replace "$([char]27)\[[0-9;]*m", ''
            if ($plain.Length -gt ($width - 2)) {
                $line = $plain.Substring(0, $width - 3) + "…"
            }

            # Move to start of line and clear
            Write-Host "`r$esc[2K$line" -NoNewline

            Start-Sleep -Milliseconds 100
        }
    } -ArgumentList $stepFile, $previewFile, $spinChars
}

function Stop-RalphSpinner {
    <#
    .SYNOPSIS
    Stop the background spinner job and clear the spinner line.
    #>
    if ($script:SPINNER_JOB) {
        Stop-Job -Job $script:SPINNER_JOB -ErrorAction SilentlyContinue
        Remove-Job -Job $script:SPINNER_JOB -Force -ErrorAction SilentlyContinue
        $script:SPINNER_JOB = $null
    }
    # Clear the spinner line
    Write-Host "`r$([char]27)[2K" -NoNewline
}
