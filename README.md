# A Ralph Wiggum Loop for GitHub Copilot CLI

[![@pageai/ralph-loop version](https://img.shields.io/npm/v/@pageai/ralph-loop?label=npm&style=flat)](https://github.com/pageai-pro/ralph-loop)

Ralph is a long-running AI agent loop. Ralph automates software development tasks by iteratively working through a task list until completion. This allows for long running agent loops, effectively enabling AI to code for days at a time.

This is an implementation adapted for **GitHub Copilot CLI** running in **headless autopilot mode**. It contains a hackable script so you can configure it to your env and favorite settings. No Docker sandbox required — runs directly on your local machine.

#### 👉 [Watch the original video](https://www.youtube.com/watch?v=3TL8Ez66I3o) for an in-depth walkthrough of the Ralph loop concept.

- [Getting Started](#getting-started)
  - [(Optional) Set up code base](#optional-set-up-code-base)
  - [1️⃣ Step 1: Install Ralph](#1️⃣-step-1-install-ralph)
  - [2️⃣ Step 2: Install GitHub Copilot CLI](#2️⃣-step-2-install-github-copilot-cli)
  - [3️⃣ Step 3: Create a PRD + task list](#3️⃣-step-3-create-a-prd--task-list)
  - [4️⃣ Step 4: Run Ralph](#4️⃣-step-4-run-ralph)
- [Running the Ralph Loop with custom options](#running-the-ralph-loop-with-custom-options)
  - [(Optional) Adjusting to your language/framework](#optional-adjusting-to-your-languageframework)
- [How It Works](#how-it-works)
- [Steering the Agent](#steering-the-agent)
- [Support](#support)
  - [Promise Tags](#promise-tags)
  - [Exit Codes](#exit-codes)
- [Structure](#structure)
- [Skills](#skills)
  - [Available Skills](#available-skills)
  - [Skills Directory Structure](#skills-directory-structure)
- [Custom Agents](#custom-agents)
- [MCP Servers](#mcp-servers)
- [Reference](#reference)
  - [Copilot CLI Headless Mode](#copilot-cli-headless-mode)
  - [Authentication](#authentication)
  - [Running with a different agentic CLI](#running-with-a-different-agentic-cli)
  - [Starting from scratch](#starting-from-scratch)
- [License](#license)

---------------------------------

## Getting Started

### (Optional) Set up code base

I recommend using a CLI to bootstrap your project with the necessary tools and dependencies, e.g.:

```bash
npx @tanstack/cli@v0.59.0 create lib --add-ons eslint,form,tanstack-query,nitro --no-git
```

> If you must start from a blank slate, which is not recommended, see [Starting from scratch](#starting-from-scratch). You can also go for a more barebone start by running `npx create-vite@latest src --template react-ts`

### 1️⃣ Step 1: Install Ralph

Run this in your project's directory to install Ralph.

```bash
npx @pageai/ralph-loop
```

### 2️⃣ Step 2: Install GitHub Copilot CLI

Install the Copilot CLI using one of these methods:

**npm (all platforms — requires Node.js 22+):**
```bash
npm install -g @github/copilot
```

**WinGet (Windows):**
```powershell
winget install GitHub.Copilot
```

**Homebrew (macOS/Linux):**
```bash
brew install copilot-cli
```

**Install script (macOS/Linux):**
```bash
curl -fsSL https://gh.io/copilot-install | bash
```

Then authenticate:

```bash
copilot
# Use /login command and follow the instructions
```

Or set a personal access token (with "Copilot Requests" permission):
```bash
export COPILOT_GITHUB_TOKEN=your_token_here
```

### 3️⃣ Step 3: Create a PRD + task list

Use the `prd-creator` skill to generate a PRD from your requirements.
Open up Copilot CLI and prompt it with **your requirements**:

```bash
copilot
```

Then enter:
```
Use the prd-creator skill to help me create a PRD and task list for the below requirements.

An app is already set up with React, Tailwind CSS and TypeScript.

Requirements:

- A SaaS product that helps users manage their finances.
- Target audience: Small business owners and freelancers.
- Core features:
  - Track income and expenses.
  - Create and send invoices.
  - Track payments and receipts.
  - Generate reports and insights.
- Use the shadcn/ui library for components.
- Integrate with Stripe for payments.
- Use Supabase for database.

// etc.
```

<details>
<summary><strong>✨ Pro tips</strong></summary>

- mention libraries and frameworks you want to use
- mention env variables, e.g. for DB, 3rd party API keys, etc. Store them in `.env` and add it to **.gitignore**
- describe user flows and journeys
- add relevant docs and UI references if applicable inside `/docs` and mention them in the requirements
- be as descriptive as possible
- *it's fine to write in your own language*

</details>
<br/>

Then, follow the Skill's instructions and verify the PRD and then tasks.
**It is highly recommended that you review individual task requirements before starting the loop. Review EACH TASK INDIVIDUALLY.**

### 4️⃣ Step 4: Run Ralph

```bash
./ralph.sh -n 50 # Run Ralph Loop with 50 iterations
```

## Running the Ralph Loop with custom options

```bash
# Run the agent loop (default: 10 iterations)
./ralph.sh

# Run with custom iteration limit
./ralph.sh 5
./ralph.sh -n 5
./ralph.sh --max-iterations 5

# Run exactly one iteration
./ralph.sh --once

# Show help
./ralph.sh --help
```

> NB: you might need to run `chmod +x ralph.sh` to make the script executable.

> The default "mode" is "implementation". Depending on your use case, you might want to change `.agent/PROMPT.md` to a different mode, e.g. "refactor", "review", "test" etc.

⚠️ If you want to use a different language or testing framework, see below.

### (Optional) Adjusting to your language/framework

This script assumes the following are installed:
- [Playwright](https://playwright.dev/) for e2e testing
- [Vitest](https://vitest.dev/) for unit testing
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io/) for formatting

If you'd like to use a different language, testing framework etc. please adjust `.agent/PROMPT.md` to reflect your setup, server ports and startup commands etc.

👉 The loop is controlled by this prompt, which will be sent to the agent each iteration.

---------------------------------

## How It Works

Each iteration, Ralph will:
1. Find the highest-priority incomplete task from `.agent/tasks.json`
2. Work through the task steps defined in `.agent/tasks/TASK-{ID}.json`
3. Run tests, linting, and type checking
4. Complete task, take screenshot, update task status and commit changes
5. Repeat until all tasks pass or max iterations reached

The key difference is this runs via **Copilot CLI autopilot mode** — no Docker sandbox needed. Copilot CLI runs locally with `--autopilot --yolo` flags, granting full permissions for autonomous operation.

<details>
<summary><strong>✨ Features</strong></summary>

- **PRD generation** - Creates a PRD and task list from requirements
- **Task lookup table generation** - Creates a task lookup table from the PRD
- **Task breakdown + step generation** - Breaks down each task into manageable steps
- **Iteration tracking** - Shows progress through iterations with timing
- **Stream preview** - Shows live output from the Agent
- **Step detection** - Identifies current activity (Thinking, Implementing, Testing, etc.)
- **Screenshot capture** - Captures a screenshot of the current screen
- **Notifications** - Alerts when human input is needed
- **History logging** - Saves clean output from each iteration
- **Timing** - Shows timing metrics for each iteration and total time
- **Steering** - Allows prioritizing critical work that needs to be done before the loop can continue
- **Custom Agents** - Specialized agent profiles for implementation and code review
- **Skills** - Reusable knowledge modules for specialized tasks
- **MCP Servers** - Extended tool capabilities via Model Context Protocol
</details>

## Steering the Agent

In some cases, you might notice the agent is having trouble, slowed down or struggling to overcome a blocker.

While the loop is running, you can edit the `.agent/STEERING.md` file to add critical work that needs to be done before the loop can continue.

The agent will check this file each iteration and if it finds any critical work, it will skip tasks and complete the critical work first.

## Support

The `ralph.sh` script is designed to be hackable.
It is configured to use **GitHub Copilot CLI in headless autopilot mode** by default.

Check the `ralph.sh` script around `# This is the main command loop.` for the main command loop.

> NB: skills are supported natively by Copilot CLI via `.github/skills/` directory.

### Promise Tags

Ralph uses semantic tags to communicate status:
- `<promise>COMPLETE</promise>` - All tasks finished successfully
- `<promise>BLOCKED:reason</promise>` - Agent needs human help
- `<promise>DECIDE:question</promise>` - Agent needs a decision

### Exit Codes

| Code | Meaning                        |
| ---- | ------------------------------ |
| 0    | COMPLETE - All tasks finished  |
| 1    | MAX_ITERATIONS - Reached limit |
| 2    | BLOCKED - Needs human help     |
| 3    | DECIDE - Needs human decision  |
| 4    | CLI_ERROR - Copilot CLI issue  |
| 5    | AUTH_ERROR - Not authenticated |

## Structure

```
.agent/
├── PROMPT.md           # Prompt sent to Copilot CLI each iteration
├── STEERING.md         # Critical work / overrides
├── tasks.json          # Task lookup table (required)
├── tasks/              # Individual task specs (TASK-{ID}.json)
├── prd/
│   ├── PRD.md          # Product requirements document
│   └── SUMMARY.md      # Short project overview
├── logs/
│   └── LOG.md          # Progress log (auto-created)
├── history/            # Iteration output logs
├── screenshots/        # Task screenshots
└── skills/             # Shared skills (source of truth)

.github/
├── copilot-instructions.md  # Repository-wide Copilot instructions
├── agents/                  # Custom agent profiles
│   ├── ralph-implementer.md
│   └── ralph-reviewer.md
└── skills/             # Symlink → .agent/skills/

.copilot/
├── mcp-config.json     # MCP server configuration
└── settings.json       # Project-level Copilot CLI settings
```

## Skills

Skills are reusable agent capabilities that provide specialized knowledge and workflows. The canonical source is `.agent/skills/`, symlinked to `.github/skills/` for Copilot CLI compatibility.

Copilot CLI loads skills from these locations (priority order):
1. `.github/skills/` (project)
2. `.agents/skills/` (project)
3. `.claude/skills/` (project, for Claude-compatible skills)
4. `~/.copilot/skills/` (personal)

### Available Skills

| Skill                         | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `component-refactoring`       | Patterns for splitting and refactoring React components |
| `e2e-tester`                  | End-to-end testing workflows                            |
| `frontend-code-review`        | Code quality and performance review guidelines          |
| `frontend-testing`            | Unit and integration testing patterns                   |
| `prd-creator`                 | Create PRDs and task breakdowns for Ralph               |
| `skill-creator`               | Create new skills                                       |
| `vercel-react-best-practices` | React/Next.js performance patterns                      |
| `mysql`                       | MySQL/InnoDB schema, indexing, query tuning, and ops    |
| `postgres`                    | PostgreSQL best practices and query optimization        |
| `web-design-guidelines`       | UI/UX design principles                                 |
| `vitest-best-practices`       | Vitest testing patterns and configuration               |

### Skills Directory Structure

Skills are symlinked from `.agent/skills/` (source of truth) to Copilot CLI's search paths:

```
 # Source of truth
.agent/skills/
    ├── component-refactoring/
    ├── e2e-tester/
    ├── postgres/
    ├── ...

# Symlink → .agent/skills/
.github/skills/
```

## Custom Agents

Copilot CLI supports custom agent profiles defined in Markdown files. This repo includes:

| Agent | Description |
| ----- | ----------- |
| `ralph-implementer` | Implements tasks from the Ralph queue following the loop protocol |
| `ralph-reviewer` | Reviews code changes for bugs, security, and quality |

Custom agents are stored in `.github/agents/` and are automatically available to Copilot CLI.

Copilot CLI also includes built-in agents: **explore** (fast codebase search), **task** (command execution), **code-review** (change analysis), and **general-purpose** (complex multi-step tasks).

You can invoke agents via:
- `/agent` slash command in interactive mode
- `--agent=NAME` command-line flag
- Copilot auto-delegates to the appropriate agent

## MCP Servers

MCP (Model Context Protocol) servers extend Copilot CLI with additional tools. Configuration is in `.copilot/mcp-config.json`.

**Configured servers:**

| Server | Description |
| ------ | ----------- |
| `playwright` | Browser automation for testing and screenshots |
| `context7` | Context retrieval via Upstash |
| `sequential-thinking` | Step-by-step reasoning |

Copilot CLI also includes built-in MCP servers: **github-mcp-server** (GitHub API), **playwright**, **fetch** (HTTP), and **time**.

Add new MCP servers via:
- Edit `.copilot/mcp-config.json` for project-level servers
- Edit `~/.copilot/mcp-config.json` for personal servers
- Use `/mcp add` in interactive mode
- Use `--additional-mcp-config` flag for session-only servers

## Reference

### Copilot CLI Headless Mode

The Ralph loop uses Copilot CLI in **autopilot mode** programmatically:

```bash
copilot --autopilot --yolo --no-ask-user --max-autopilot-continues 50 -s -p "PROMPT"
```

Key flags:
| Flag | Description |
| ---- | ----------- |
| `--autopilot` | Autonomous continuation until task complete |
| `--yolo` / `--allow-all` | Grant all permissions (tools, paths, URLs) |
| `--no-ask-user` | Suppress clarifying questions |
| `--max-autopilot-continues N` | Limit continuation steps |
| `-s` / `--silent` | Output only agent response (for scripting) |
| `-p PROMPT` | Pass prompt programmatically (exits after completion) |
| `--model MODEL` | Set AI model (default: Claude Sonnet 4.5) |
| `--agent AGENT` | Use a specific custom agent |

### Authentication

Copilot CLI requires GitHub authentication. Options:

1. **Interactive login:** Run `copilot` → use `/login`
2. **Personal Access Token:** Create a fine-grained PAT with "Copilot Requests" permission:
   ```bash
   export COPILOT_GITHUB_TOKEN=your_token
   ```
3. **GitHub CLI token:** If `gh` is authenticated, `GH_TOKEN` or `GITHUB_TOKEN` env vars work too

### Running with a different agentic CLI

If you want to use a different agentic CLI, edit `ralph.sh` around `# This is the main command loop.`.

Replace the `copilot` command with your CLI of choice:

```bash
# For Claude Code (with Docker sandbox):
docker sandbox run claude . -- --model opus --output-format stream-json --verbose -p "$PROMPT_CONTENT"

# For Codex CLI:
docker sandbox run codex . -- -p "$PROMPT_CONTENT"

# For Gemini CLI:
docker sandbox run gemini . -- -p "$PROMPT_CONTENT"
```

Docker supports: `claude`, `codex`, `opencode`, `copilot`, `gemini`, `cagent`, `kiro` and more.
See all supported agentic AI CLIs in [Docker's docs](https://docs.docker.com/ai/sandboxes/agents/).

### Starting from scratch

For AI to actually verify its implementation and for the loop to work, you need a way to verify it.

To that end, at the minimum you'll need an end-to-end test framework and a unit test framework.

For example, you can use the following commands to install Playwright and Vitest:

```bash
npm i @playwright/test vitest jsdom typescript eslint prettier -D

# If using React, also recommend installing:
npm i @vitejs/plugin-react @testing-library/dom @testing-library/jest-dom @testing-library/react @testing-library/user-event -D
```

It is recommended that you add skills for your specific language and framework. See [skills.sh](https://skills.sh) to discover existing skills.

## License

MIT
