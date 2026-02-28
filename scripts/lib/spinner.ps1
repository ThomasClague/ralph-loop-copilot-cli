# Spinner module for ralph.ps1
# Background spinner using a runspace (shares console, no file-lock issues)

$script:SPINNER_RUNSPACE = $null
$script:SPINNER_POWERSHELL = $null
$script:SPINNER_HANDLE = $null
$script:SPINNER_CHARS = @('⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏')

# Thread-safe shared state between main thread and spinner runspace
$script:SPINNER_STATE = [hashtable]::Synchronized(@{
    Step    = "Starting"
    Preview = ""
    Running = $true
})

function Start-RalphSpinner {
    <#
    .SYNOPSIS
    Start a background spinner using a runspace that writes directly to the console.
    Uses a synchronized hashtable for thread-safe communication (no temp files).
    #>
    $script:SPINNER_STATE.Step = "Starting"
    $script:SPINNER_STATE.Preview = ""
    $script:SPINNER_STATE.Running = $true

    $spinChars = $script:SPINNER_CHARS
    $state = $script:SPINNER_STATE

    $script:SPINNER_POWERSHELL = [PowerShell]::Create()
    $script:SPINNER_RUNSPACE = [runspacefactory]::CreateRunspace()
    $script:SPINNER_RUNSPACE.Open()
    $script:SPINNER_POWERSHELL.Runspace = $script:SPINNER_RUNSPACE

    $null = $script:SPINNER_POWERSHELL.AddScript({
        param($State, $SpinChars)

        $esc = [char]27
        $idx = 0
        $Y = "$esc[33m"; $C = "$esc[36m"; $D = "$esc[90m"; $R = "$esc[0m"

        while ($State.Running) {
            $char = $SpinChars[$idx % $SpinChars.Count]
            $idx++

            $step = $State.Step
            $preview = $State.Preview
            if (-not $step) { $step = "Working" }

            # Build display line
            $line = "  $Y$char$R ${C}$step${R}"
            if ($preview) {
                $line += " ${D}| $preview${R}"
            }

            # Truncate to terminal width
            $width = 80
            try { $width = [Console]::WindowWidth } catch {}
            $plain = $line -replace "$([char]27)\[[0-9;]*m", ''
            if ($plain.Length -gt ($width - 2)) {
                $line = $plain.Substring(0, $width - 3) + [char]0x2026
            }

            # Overwrite current line
            [Console]::Write("`r$esc[2K$line")

            [System.Threading.Thread]::Sleep(100)
        }

        # Clear spinner line on exit
        [Console]::Write("`r$esc[2K")
    })

    $null = $script:SPINNER_POWERSHELL.AddArgument($state)
    $null = $script:SPINNER_POWERSHELL.AddArgument($spinChars)
    $script:SPINNER_HANDLE = $script:SPINNER_POWERSHELL.BeginInvoke()
}

function Stop-RalphSpinner {
    <#
    .SYNOPSIS
    Stop the spinner runspace and clear the line.
    #>
    if ($script:SPINNER_STATE) {
        $script:SPINNER_STATE.Running = $false
    }

    if ($script:SPINNER_POWERSHELL -and $script:SPINNER_HANDLE) {
        try {
            # Give the spinner time to clear its line
            Start-Sleep -Milliseconds 200
            $script:SPINNER_POWERSHELL.EndInvoke($script:SPINNER_HANDLE)
        } catch { }
        $script:SPINNER_POWERSHELL.Dispose()
    }
    if ($script:SPINNER_RUNSPACE) {
        try { $script:SPINNER_RUNSPACE.Close() } catch { }
        $script:SPINNER_RUNSPACE.Dispose()
    }

    $script:SPINNER_POWERSHELL = $null
    $script:SPINNER_RUNSPACE = $null
    $script:SPINNER_HANDLE = $null

    # Ensure line is clear
    Write-Host "`r$([char]27)[2K" -NoNewline
}

function Update-SpinnerState {
    <#
    .SYNOPSIS
    Update spinner step and/or preview via the synchronized hashtable.
    Called from the main thread — no file I/O needed.
    #>
    param(
        [string]$Step,
        [string]$Preview
    )
    if ($Step -and $script:SPINNER_STATE) {
        $script:SPINNER_STATE.Step = $Step
    }
    if ($Preview -and $script:SPINNER_STATE) {
        $script:SPINNER_STATE.Preview = $Preview
    }
}
