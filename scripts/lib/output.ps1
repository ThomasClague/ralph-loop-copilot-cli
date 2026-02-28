# Output module for ralph.ps1
# Parse copilot CLI output (JSON stream or plain text), strip ANSI, extract summary

function ConvertFrom-JsonContent {
    <#
    .SYNOPSIS
    Parse a line of copilot CLI output. Handles JSON-streamed output or plain text.
    Returns the extracted text content, or the original line if not JSON.
    #>
    param([string]$Line)

    if (-not $Line) { return "" }
    $trimmed = $Line.Trim()
    if (-not $trimmed) { return "" }

    # Try JSON parse
    if ($trimmed.StartsWith('{')) {
        try {
            $obj = $trimmed | ConvertFrom-Json -ErrorAction Stop

            # Handle {"type":"...", "content":"..."} format
            if ($obj.content) {
                return [string]$obj.content
            }
            # Handle {"type":"result", "result":"..."} format
            if ($obj.result) {
                return [string]$obj.result
            }
            # Handle {"type":"...", "text":"..."} format
            if ($obj.text) {
                return [string]$obj.text
            }
            # Handle tool_use or other structured types — skip
            if ($obj.type -and -not $obj.content -and -not $obj.result -and -not $obj.text) {
                return ""
            }
        }
        catch {
            # Not valid JSON, treat as plain text
        }
    }

    return $trimmed
}

function Remove-AnsiCodes {
    <#
    .SYNOPSIS
    Strip ANSI escape codes from a string.
    #>
    param([string]$Text)
    return $Text -replace "$([char]27)\[[0-9;]*[A-Za-z]", '' -replace "$([char]27)\][^\a]*\a", ''
}

function Remove-AnsiFromFile {
    <#
    .SYNOPSIS
    Strip ANSI codes from source file and write clean output to destination.
    #>
    param(
        [string]$SourcePath,
        [string]$DestPath
    )
    if (-not (Test-Path $SourcePath)) { return }
    $content = Get-Content $SourcePath -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $clean = Remove-AnsiCodes $content
        Set-Content -Path $DestPath -Value $clean -Encoding UTF8
    }
}

function Get-FinalSummary {
    <#
    .SYNOPSIS
    Extract the final result/summary from copilot CLI output file.
    Looks for the last "result" type JSON message.
    #>
    param([string]$FilePath)

    if (-not (Test-Path $FilePath)) { return "" }

    $lines = Get-Content $FilePath -ErrorAction SilentlyContinue
    if (-not $lines) { return "" }

    $lastResult = ""

    foreach ($line in $lines) {
        $trimmed = $line.Trim()
        if ($trimmed.StartsWith('{')) {
            try {
                $obj = $trimmed | ConvertFrom-Json -ErrorAction Stop
                if ($obj.type -eq 'result' -and $obj.result) {
                    $lastResult = [string]$obj.result
                }
            }
            catch { }
        }
    }

    return $lastResult
}

function Show-FinalSummary {
    <#
    .SYNOPSIS
    Display the final summary with a box around it (last N lines).
    #>
    param(
        [string]$Summary,
        [int]$MaxLines = 10
    )
    if (-not $Summary) { return }

    $lines = $Summary -split "`n" | Select-Object -Last $MaxLines

    Write-Host ""
    Write-Host "${script:B}┌─── Summary ──────────────────────────────────────────┐${script:R}"
    foreach ($l in $lines) {
        $clean = $l.TrimEnd()
        if ($clean) {
            Write-Host "${script:B}│${script:R} $clean"
        }
    }
    Write-Host "${script:B}└──────────────────────────────────────────────────────┘${script:R}"
    Write-Host ""
}
