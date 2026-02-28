# Cleanup module for ralph.ps1
# Process cleanup and interrupt handling

$script:CTRL_C_COUNT = 0

function Invoke-Cleanup {
    <#
    .SYNOPSIS
    Clean up background processes and temporary files on exit.
    #>

    # Stop spinner
    Stop-RalphSpinner

    # Kill agent process if still running
    if ($script:AGENT_PROCESS -and -not $script:AGENT_PROCESS.HasExited) {
        try {
            $script:AGENT_PROCESS.Kill($true)
            $script:AGENT_PROCESS.WaitForExit(5000)
        } catch { }
    }
    $script:AGENT_PROCESS = $null

    # Remove temp files
    foreach ($f in @($script:OUTPUT_FILE, $script:FULL_OUTPUT_FILE)) {
        if ($f -and (Test-Path $f -ErrorAction SilentlyContinue)) {
            Remove-Item $f -Force -ErrorAction SilentlyContinue
        }
    }
}

function Register-InterruptHandler {
    <#
    .SYNOPSIS
    Register Ctrl+C handler. First press stops gracefully, second press force-exits.
    #>
    [Console]::TreatControlCAsInput = $false

    # Use try/finally in the main loop rather than a global handler,
    # since PowerShell doesn't have a direct `trap SIGINT` equivalent
    # that works well in all cases. The main script wraps in try/finally
    # and checks $script:CTRL_C_COUNT.
}
