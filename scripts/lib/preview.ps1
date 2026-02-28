# Preview module for ralph.ps1
# Rolling preview buffer for output display

$script:PREVIEW_BUFFER = [System.Collections.Generic.List[string]]::new()
$script:PREVIEW_MAX_LINES = 50
$script:PREVIEW_VISIBLE_LINES = 3
$script:PREVIEW_ACTIVE = $false

function Initialize-RollingPreview {
    <#
    .SYNOPSIS
    Reset the rolling preview buffer.
    #>
    $script:PREVIEW_BUFFER = [System.Collections.Generic.List[string]]::new()
    $script:PREVIEW_ACTIVE = $true
}

function Update-PreviewLine {
    <#
    .SYNOPSIS
    Add a line to preview buffer and write to preview file for spinner.
    #>
    param([string]$Line)

    if (-not $Line) { return }

    # Add to buffer
    $script:PREVIEW_BUFFER.Add($Line)

    # Trim buffer to max
    while ($script:PREVIEW_BUFFER.Count -gt $script:PREVIEW_MAX_LINES) {
        $script:PREVIEW_BUFFER.RemoveAt(0)
    }

    # Write last line to preview file for spinner to read
    if ($script:PREVIEW_LINE_FILE -and (Test-Path $script:PREVIEW_LINE_FILE)) {
        $truncated = Get-TruncatedLine $Line 20
        Set-Content -Path $script:PREVIEW_LINE_FILE -Value $truncated -NoNewline
    }
}

function Clear-RollingPreview {
    <#
    .SYNOPSIS
    Clear the preview display area.
    #>
    $script:PREVIEW_ACTIVE = $false
    $script:PREVIEW_BUFFER = [System.Collections.Generic.List[string]]::new()
}
