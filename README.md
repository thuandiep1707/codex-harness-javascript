# Codex Frontend Agent Base

Reusable Codex rules and skills for governed frontend work.

## Contents

- `AGENTS.md`: Codex entry point, skill routing, approval gates, and repository conventions.
- `.agents/rules/`: frontend coding, testing, accessibility, styling, runtime, assets, and async-state rules.
- `.agents/skills/`: Codex skills with OpenAI metadata, references, scripts, assets, and evals.
- `.docs/agents/`: human-facing documentation for the rule, skill, and progress systems.
- `.analysis/`: audits and design notes for the agent system itself.
- `.codex/config.toml`: GPT-5.6 Sol primary-agent and multi-agent orchestration settings.
- `.codex/agents/`: GPT-5.5 coding, GPT-5.6 Luna design, and GPT-5.4 testing workers.

The source repository's Claude, Cursor, Gemini, and Antigravity adapters are intentionally excluded.
Project-specific task plans, runtime progress logs, and application architecture analyses are also
excluded because they are not reusable Codex configuration.

## Install and run Codex CLI with Git Bash

Make sure Node.js and npm are available:

```bash
node --version
npm --version
```

Install Codex CLI globally:

```bash
npm install --global @openai/codex
```

Add the Windows npm global directory to the current Git Bash session, refresh command discovery,
verify the installation, and start Codex:

```bash
export PATH="$PATH:/c/Users/teran/AppData/Roaming/npm"
hash -r
codex --version
codex
```

When opening the repository from another directory, use Git Bash path syntax:

```bash
cd /c/Users/teran/Documents/GitHub/subagent-for-frontend-base
```

Inside the new Codex session, confirm that the project configuration and primary model were loaded:

```text
/debug-config
/status
```
