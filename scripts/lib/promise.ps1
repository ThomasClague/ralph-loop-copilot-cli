# Promise module for ralph.ps1
# Detect and extract promise tags from agent output

function Test-CompleteTag {
    <#
    .SYNOPSIS
    Check if text contains <promise>COMPLETE</promise>.
    #>
    param([string]$Text)
    if (-not $Text) { return $false }
    return $Text -match '<promise>\s*COMPLETE\s*</promise>'
}

function Test-BlockedTag {
    <#
    .SYNOPSIS
    Check if text contains <promise>BLOCKED:...</promise>.
    #>
    param([string]$Text)
    if (-not $Text) { return $false }
    return $Text -match '<promise>\s*BLOCKED:'
}

function Test-DecideTag {
    <#
    .SYNOPSIS
    Check if text contains <promise>DECIDE:...</promise>.
    #>
    param([string]$Text)
    if (-not $Text) { return $false }
    return $Text -match '<promise>\s*DECIDE:'
}

function Get-BlockedReason {
    <#
    .SYNOPSIS
    Extract the reason from a BLOCKED promise tag.
    #>
    param([string]$Text)
    if (-not $Text) { return "" }
    if ($Text -match '<promise>\s*BLOCKED:([^<]*)</promise>') {
        return $Matches[1].Trim()
    }
    return ""
}

function Get-DecideQuestion {
    <#
    .SYNOPSIS
    Extract the question from a DECIDE promise tag.
    #>
    param([string]$Text)
    if (-not $Text) { return "" }
    if ($Text -match '<promise>\s*DECIDE:([^<]*)</promise>') {
        return $Matches[1].Trim()
    }
    return ""
}
