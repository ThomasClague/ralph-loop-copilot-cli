# **Critical Steering Work**

## Ensure the local environment is running correctly

This runs on your local machine via GitHub Copilot CLI. Apply as needed:

- **Node >= 22 (if required):** Ensure Node.js 22+ is installed. Use `nvm` if managing multiple versions.

- **Install dependencies:** Run `npm install` in the project directory.

## Main Tasks

Install project dependencies, then install Playwright system dependencies:

```bash
npx playwright install chromium
```

Start the dev server and take a screenshot. Save it to the `.agent/screenshots` directory.

---

After you finish this work, exit with message `Steering complete`.
