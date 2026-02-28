# Display module for ralph.ps1
# ASCII art, blocked/decide messages, help display

function Show-BlockedMessage {
    <#
    .SYNOPSIS
    Display BLOCKED message with reason.
    #>
    param(
        [string]$Reason,
        [string]$Iteration
    )
    Write-Host ""
    Write-Host "${script:RD}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
    Write-Host "  🛑 ${script:RD}Ralph is BLOCKED and needs help${script:R}"
    Write-Host "  Stopped at iteration ${script:Y}$Iteration${script:R}"
    Write-Host ""
    Write-Host "  ${script:Y}Reason:${script:R} $Reason"
    Write-Host ""
    Write-Host "  ${script:C}What to do:${script:R}"
    Write-Host "  1. Fix the issue described above"
    Write-Host "  2. Re-run Ralph: ${script:G}.\ralph.ps1${script:R}"
    Write-Host "${script:RD}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
}

function Show-DecideMessage {
    <#
    .SYNOPSIS
    Display DECIDE message with question.
    #>
    param(
        [string]$Question,
        [string]$Iteration
    )
    Write-Host ""
    Write-Host "${script:M}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
    Write-Host "  🤔 ${script:M}Ralph needs a decision${script:R}"
    Write-Host "  Stopped at iteration ${script:Y}$Iteration${script:R}"
    Write-Host ""
    Write-Host "  ${script:Y}Question:${script:R} $Question"
    Write-Host ""
    Write-Host "  ${script:C}What to do:${script:R}"
    Write-Host "  1. Make your decision"
    Write-Host "  2. Add your answer to the STEERING.md file or modify relevant files"
    Write-Host "  3. Re-run Ralph: ${script:G}.\ralph.ps1${script:R}"
    Write-Host "${script:M}░░▒▒▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒▒░░${script:R}"
}

function Show-Ralph {
    <#
    .SYNOPSIS
    Display the Ralph ASCII art banner and a random catchphrase.
    #>
    $catchphrases = @(
        "  `"Me fail English? That's unpossible!`""
        "  `"I'm learnding!`""
        "  `"Hi, Super Nintendo Chalmers!`""
        "  `"I bent my Wookiee.`""
        "  `"My cat's breath smells like cat food.`""
        "  `"I'm a unitard!`""
        "  `"The doctor said I wouldn't have so many nosebleeds if I kept my finger outta there.`""
        "  `"When I grow up, I'm going to Bovine University!`""
        "  `"That's where I saw the Leprechaun. He tells me to burn things!`""
        "  `"I found a moonrock in my nose!`""
        "  `"My knob tastes funny.`""
        "  `"Even I knew that. And I'm as dumb as a post.`""
        "  `"And I want a bike! And a monkey! And a friend for the monkey!`""
    )

    $phrase = $catchphrases | Get-Random

    Write-Host ""
    Write-Host "${script:Y}═══════════════════════════════════════════════════════════${script:R}"
    Write-Host "${script:Y}■■▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓■${script:R}"
    Write-Host "${script:Y}                                                           ${script:R}"
    Write-Host "${script:Y}  ██████╗  █████╗ ██╗     ██████╗ ██╗  ██╗                 ${script:R}"
    Write-Host "${script:Y}  ██╔══██╗██╔══██╗██║     ██╔══██╗██║  ██║                 ${script:R}"
    Write-Host "${script:Y}  ██████╔╝███████║██║     ██████╔╝███████║                 ${script:R}"
    Write-Host "${script:Y}  ██╔══██╗██╔══██║██║     ██╔═══╝ ██╔══██║                 ${script:R}"
    Write-Host "${script:Y}  ██║  ██║██║  ██║███████╗██║     ██║  ██║                 ${script:R}"
    Write-Host "${script:Y}  ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝                 ${script:R}"
    Write-Host "${script:Y}                                                           ${script:R}"
    Write-Host "${script:D}$phrase${script:R}"
    Write-Host "${script:Y}■■▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒▓■${script:R}"
    Write-Host "${script:Y}═══════════════════════════════════════════════════════════${script:R}"
    Write-Host " Ralph Wiggum Loop $([char]0x30FB) Long-running AI agents"
}

function Show-RalphHelp {
    <#
    .SYNOPSIS
    Display usage/help information.
    #>
    Show-Ralph
    Write-Host ""
    Write-Host "${script:Y}Usage:${script:R} .\ralph.ps1 [options] [max_iterations]"
    Write-Host ""
    Write-Host "${script:Y}Options:${script:R}"
    Write-Host "  -MaxIterations N, -n N      Set maximum iterations (default: 10)"
    Write-Host "  -Once                       Run exactly 1 iteration (overrides -MaxIterations)"
    Write-Host "  -Help, -h                   Show this help message and exit"
    Write-Host ""
    Write-Host "${script:Y}Examples:${script:R}"
    Write-Host "  .\ralph.ps1                       Run with default 10 iterations"
    Write-Host "  .\ralph.ps1 5                     Run with 5 iterations max"
    Write-Host "  .\ralph.ps1 -n 5                  Run with 5 iterations max"
    Write-Host "  .\ralph.ps1 -MaxIterations 5      Same as above"
    Write-Host "  .\ralph.ps1 -Once                 Run exactly 1 iteration"
    Write-Host ""
    Write-Host "${script:Y}Files:${script:R}"
    Write-Host "  📁 .agent/history/         Iteration output logs"
    Write-Host "  📋 .agent/logs/LOG.md      Progress log file"
    Write-Host "  📄 .agent/prd/PRD.md       PRD file with task definitions"
    Write-Host "  📄 .agent/tasks/           Detailed task descriptions"
    Write-Host "  📝 .agent/PROMPT.md        Prompt sent each iteration"
    Write-Host "  📄 .agent/tasks.json       Task lookup table"
    Write-Host ""
    Write-Host "${script:Y}Behavior:${script:R}"
    Write-Host "  🤔 Decides on what tasks to pick from .agent/tasks.json"
    Write-Host "  📋 Logs progress to .agent/logs/LOG.md"
    Write-Host "  🎉 Exits early if agent outputs <promise>COMPLETE</promise>"
    Write-Host ""
}
