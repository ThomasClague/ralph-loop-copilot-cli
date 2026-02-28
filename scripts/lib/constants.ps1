# Constants module for ralph.ps1
# Defines colors, version, and exit codes

# Version
$script:VERSION = "1.0.0"

# ANSI Color codes
$script:ESC = [char]27
$script:R  = "$ESC[0m"       # Reset
$script:B  = "$ESC[1;34m"    # Bold Blue
$script:G  = "$ESC[32m"      # Green
$script:GR = "$ESC[1;32m"    # Bold Green
$script:Y  = "$ESC[33m"      # Yellow
$script:RD = "$ESC[1;31m"    # Bold Red
$script:C  = "$ESC[36m"      # Cyan
$script:M  = "$ESC[35m"      # Magenta
$script:D  = "$ESC[90m"      # Dim/Gray
$script:W  = "$ESC[97m"      # White

# Exit codes
$script:EXIT_COMPLETE       = 0
$script:EXIT_MAX_ITERATIONS = 1
$script:EXIT_BLOCKED        = 2
$script:EXIT_DECIDE         = 3
$script:EXIT_CLI_ERROR      = 4
$script:EXIT_AUTH_ERROR     = 5
