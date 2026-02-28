# Terminal module for ralph.ps1
# Terminal capability detection

function Test-AnsiSupport {
    <#
    .SYNOPSIS
    Check if terminal supports ANSI escape codes. Sets $script:SUPPORTS_ANSI.
    #>
    # PowerShell 7+ / Windows Terminal generally support ANSI
    if ($PSVersionTable.PSVersion.Major -ge 7 -or $env:WT_SESSION -or $env:TERM_PROGRAM) {
        $script:SUPPORTS_ANSI = $true
    } else {
        # Try enabling VT processing on older Windows consoles
        try {
            $null = [Console]::OutputEncoding
            $script:SUPPORTS_ANSI = $true
        } catch {
            $script:SUPPORTS_ANSI = $false
        }
    }

    if (-not $script:SUPPORTS_ANSI) {
        # Disable colors
        $script:R = ""; $script:B = ""; $script:G = ""; $script:GR = ""
        $script:Y = ""; $script:RD = ""; $script:C = ""; $script:M = ""
        $script:D = ""; $script:W = ""
    }
}

function Get-TermWidth {
    <#
    .SYNOPSIS
    Get terminal width, defaulting to 80.
    #>
    try {
        return [Console]::WindowWidth
    } catch {
        return 80
    }
}

function Get-TruncatedLine {
    <#
    .SYNOPSIS
    Truncate a line to fit terminal width (minus padding).
    #>
    param(
        [string]$Line,
        [int]$Padding = 4
    )
    $width = Get-TermWidth
    $maxLen = $width - $Padding
    if ($maxLen -lt 10) { $maxLen = 10 }

    # Strip ANSI for length calculation
    $plain = $Line -replace "$([char]27)\[[0-9;]*m", ''
    if ($plain.Length -le $maxLen) {
        return $Line
    }
    # Truncate the plain text and add ellipsis
    return $plain.Substring(0, $maxLen - 1) + "…"
}
