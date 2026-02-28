# Args module for ralph.ps1
# CLI argument parsing (handled via param block in main script)
# This file provides the Parse-Arguments helper for non-param usage.

function Parse-RalphArguments {
    <#
    .SYNOPSIS
    Parse ralph CLI arguments. Sets script-scope $MaxIterations and $OnceFlag.
    Normally the main script uses [CmdletBinding()] params, but this is a fallback.
    #>
    param([string[]]$Arguments)

    $script:MaxIterations = 10
    $script:OnceFlag = $false

    $i = 0
    while ($i -lt $Arguments.Count) {
        switch -Regex ($Arguments[$i]) {
            '^(-h|--help|-Help)$' {
                Show-RalphHelp
                exit 0
            }
            '^(-Once|--once)$' {
                $script:OnceFlag = $true
            }
            '^(-n|--max-iterations|-MaxIterations)$' {
                $i++
                if ($i -lt $Arguments.Count) {
                    $script:MaxIterations = [int]$Arguments[$i]
                }
            }
            '^--max-iterations=(.+)$' {
                $script:MaxIterations = [int]$Matches[1]
            }
            '^\d+$' {
                $script:MaxIterations = [int]$Arguments[$i]
            }
        }
        $i++
    }

    # --once overrides max-iterations
    if ($script:OnceFlag) {
        $script:MaxIterations = 1
    }
}
