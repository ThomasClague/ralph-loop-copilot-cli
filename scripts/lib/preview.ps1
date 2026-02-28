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

    # Update spinner preview directly (thread-safe synchronized hashtable)
    $truncated = Get-TruncatedLine $Line 20
    if ($script:SPINNER_STATE) {
        $script:SPINNER_STATE.Preview = $truncated
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
