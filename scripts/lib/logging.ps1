# Logging module for ralph.ps1
# Colored log output functions

function Write-LogInfo {
    param([string]$Message)
    Write-Host "${script:B}[INFO]${script:R} $Message"
}

function Write-LogSuccess {
    param([string]$Message)
    Write-Host "${script:GR}[OK]${script:R} $Message"
}

function Write-LogWarn {
    param([string]$Message)
    Write-Host "${script:Y}[WARN]${script:R} $Message"
}

function Write-LogError {
    param([string]$Message)
    Write-Host "${script:RD}[ERROR]${script:R} $Message"
}
