# Notify module for ralph.ps1
# Desktop notifications and sounds (Windows-native)

function Send-NotificationSound {
    <#
    .SYNOPSIS
    Play a notification beep/sound.
    #>
    try {
        [Console]::Beep(800, 300)
        Start-Sleep -Milliseconds 100
        [Console]::Beep(1000, 300)
    } catch {
        # Fallback — system bell
        Write-Host "`a" -NoNewline
    }
}

function Send-DesktopNotification {
    <#
    .SYNOPSIS
    Show a Windows toast notification.
    #>
    param(
        [string]$Title,
        [string]$Message
    )

    try {
        # Use BurntToast module if available
        $bt = Get-Module -ListAvailable -Name BurntToast -ErrorAction SilentlyContinue
        if ($bt) {
            Import-Module BurntToast -ErrorAction SilentlyContinue
            New-BurntToastNotification -Text $Title, $Message -ErrorAction SilentlyContinue
            return
        }
    } catch { }

    # Fallback: simple balloon tip via .NET
    try {
        Add-Type -AssemblyName System.Windows.Forms -ErrorAction SilentlyContinue
        $notify = New-Object System.Windows.Forms.NotifyIcon
        $notify.Icon = [System.Drawing.SystemIcons]::Information
        $notify.BalloonTipTitle = $Title
        $notify.BalloonTipText = $Message
        $notify.Visible = $true
        $notify.ShowBalloonTip(5000)

        # Clean up after display
        Start-Job -ScriptBlock {
            Start-Sleep -Seconds 6
        } | Out-Null
        Register-ObjectEvent $notify BalloonTipClosed -Action {
            $notify.Dispose()
        } | Out-Null
    } catch {
        # Last resort — just beep
        Write-Host "`a" -NoNewline
    }
}
