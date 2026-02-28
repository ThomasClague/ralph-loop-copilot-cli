# Preflight module for ralph.ps1
# Pre-flight checks before starting the loop

function Test-GitRepo {
    <#
    .SYNOPSIS
    Verify we're inside a git repository.
    #>
    if (-not (Test-Path (Join-Path $script:SCRIPT_DIR ".git"))) {
        Write-LogError "Not a git repository. Run from project root."
        exit $script:EXIT_CLI_ERROR
    }
    Write-LogSuccess "Git repository detected"
}

function Test-CopilotCli {
    <#
    .SYNOPSIS
    Verify the copilot CLI is available on PATH.
    #>
    $cmd = Get-Command "copilot" -ErrorAction SilentlyContinue
    if (-not $cmd) {
        Write-LogError "Copilot CLI not found. Install: npm install -g @anthropic-ai/claude-code"
        exit $script:EXIT_CLI_ERROR
    }
    Write-LogSuccess "Copilot CLI found"
}

function Test-HistoryDir {
    <#
    .SYNOPSIS
    Ensure .agent/history directory exists.
    #>
    $histDir = Join-Path $script:SCRIPT_DIR ".agent" "history"
    if (-not (Test-Path $histDir)) {
        New-Item -ItemType Directory -Path $histDir -Force | Out-Null
        Write-LogInfo "Created history directory"
    }
}

function Test-RequiredFiles {
    <#
    .SYNOPSIS
    Check that required .agent files exist.
    #>
    $required = @(
        (Join-Path $script:SCRIPT_DIR ".agent" "PROMPT.md"),
        (Join-Path $script:SCRIPT_DIR ".agent" "tasks.json")
    )
    foreach ($f in $required) {
        if (-not (Test-Path $f)) {
            Write-LogError "Required file missing: $f"
            exit $script:EXIT_CLI_ERROR
        }
    }
    Write-LogSuccess "Required files present"
}
