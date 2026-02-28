## Overview

You are implementing the project described in @.agent/prd/SUMMARY.md

## Required Setup

Run `npm run dev` (as background process) in `src` directory.
App will be running at http://localhost:3000

## Before Starting

Check @.agent/STEERING.md for critical work. Complete items in sequence, remove when done. Only proceed to implement tasks if no critical work pending.

## Task Flow

Tasks are listed in @.agent/tasks.json

1. Pick highest-priority task with `passes: false` in `tasks.json`
2. Read full spec: `.agent/tasks/TASK-${ID}.json`
3. Check existing dir structure in @.agent/STRUCTURE.md
4. Implement steps by step according to spec and write unit test
5. **UI tasks only:** do a Playwright smoke test
   - Check console for errors
   - Write minimal e2e test (happy path only)
   - Skip e2e if unit test already covers functionality
   - Save UI Screenshot to `.agent/screenshots/TASK-${ID}-{index}.png`, verify UI correctness. If debugging, use previous screenshots as reference.
6. Run `eslint --fix`, `prettier --write` and end to end tests for affected files.
7. Run `tsc` and unit tests project-wide
8. All tests must pass. Broke unrelated test? Fix it before proceeding.
9. **Integration gate (MANDATORY before marking complete):**
   - Start the dev server (`npm run dev`) if not already running
   - Verify the feature works **in the running app**, not just in isolation
   - For **API/data tasks**: call the endpoint or function from the running app and confirm it returns real data (not just unit-test mocks)
   - For **UI tasks**: navigate to the relevant page in the browser and confirm the component renders with real data from the API (not just storybook/isolated render)
   - For **pipeline/service tasks**: trigger the flow end-to-end through the UI or API and confirm status transitions work
   - If the task depends on previously completed tasks, verify those integrations still work (e.g., if you built an API route, confirm the UI page that calls it still renders)
   - If integration fails: fix it before marking complete. Do NOT mark a task as done if it only works in isolation.
10. When tests AND integration gate pass, set `passes: true` in `tasks.json` for the task you completed.
10. Log entry → `.agent/logs/LOG.md` (date, brief summary, screenshot path)
11. Update `.agent/STRUCTURE.md` if dirs changed. Exclude dotfiles, tests and config.
12. Commit changes, using the Conventional Commit format.

## Rules

- **CRITICAL**: Only work on **ONE task per invocation**. After committing the task, output `<promise>TASK-{ID}:DONE</promise>` and **STOP immediately**. Do NOT read the next task. Do NOT continue working. Your response **must END** after the promise tag. Any output after it is a violation.
- No git init/remote changes. **No git push**.
- Check the last 5 tasks in `.agent/logs/LOG.md` for past work
- **CRITICAL**: When **ALL** tasks pass → output `<promise>COMPLETE</promise>` and **nothing else**.

## Help Tags

Try solving tasks yourself first.
When stuck after all possible solutions exhausted, output one of the following tags:

1. **BLOCKED** — technical issues: Playwright broken, dev server not working, deps won't install, env issues, no network, service outages, invalid/missing credentials. Output:

```
<promise>BLOCKED:brief description</promise>
```

2. **DECIDE** — need human input: lib choices, architecture, unclear requirements, breaking changes. Output:

```
<promise>DECIDE:question (Option A vs B)</promise>
```
