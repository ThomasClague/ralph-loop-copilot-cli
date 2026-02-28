# Copilot CLI Custom Instructions

You are working in a Ralph Wiggum Loop — a long-running AI agent loop for automated software development.

## Project Context

- This project uses the Ralph loop controller to iteratively complete tasks from a PRD
- Tasks are defined in `.agent/tasks.json` with detailed specs in `.agent/tasks/TASK-{ID}.json`
- Progress is logged in `.agent/logs/LOG.md`
- The loop controller reads your output and checks for promise tags

## Communication Protocol

Use promise tags to signal status to the loop controller:

- `<promise>COMPLETE</promise>` — All tasks finished successfully
- `<promise>BLOCKED:reason</promise>` — You are stuck and need human help
- `<promise>DECIDE:question</promise>` — You need a human decision
- `<promise>TASK-{ID}:DONE</promise>` — Single task completed

## Rules

- Only work on ONE task per invocation
- After completing a task, output `<promise>TASK-{ID}:DONE</promise>` and STOP
- When ALL tasks pass → output `<promise>COMPLETE</promise>`
- No git push. No git init/remote changes.
- Run tests to verify your work
- **Integration gate**: before marking any task done, verify it works in the running app — not just in isolated unit tests. Start the dev server, hit real endpoints, navigate to real pages. If a feature only passes mocks but fails when integrated, fix it first.
- Commit changes using Conventional Commit format
