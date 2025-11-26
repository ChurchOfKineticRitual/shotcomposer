---
description: Analyze project state, update docs if needed, and continue with next logical steps
---

# Resume Development Session

You are resuming work on this project. Follow these steps:

## 1. Assess Current State

**Read key project files:**
- Read CLAUDE.md for project context and architecture
- Read TODO.md (if exists) for current task status
- Check package.json for dependencies

**Check project health:**
- Run `npm run dev` briefly to verify the build works
- Note any errors that need fixing first

## 2. Update Documentation (if needed)

If CLAUDE.md is missing, outdated, or incomplete:
- Analyze the codebase structure
- Document commands, architecture, and key patterns
- Keep it concise - focus on non-obvious information

If TODO.md needs updating:
- Mark completed items
- Add any new tasks discovered
- Prioritize blocking issues

## 3. Determine Next Steps

Based on TODO.md and project state, identify what to work on next:
- Fix any blocking issues first (build errors, missing deps)
- Then proceed with the highest priority incomplete task
- If unclear, ask the user what they'd like to focus on

## 4. Execute

**Use available MCP servers:**
- `context7` - For current library documentation (R3F, Drei, Three.js, Leva)
- `sequential-thinking` - For complex architectural decisions
- `playwright` - To verify UI changes work correctly

**Proceed with implementation:**
- Create a todo list to track progress
- Implement incrementally, testing as you go
- Update TODO.md as tasks complete

## 5. Report

After completing a logical chunk of work:
- Summarize what was accomplished
- Note any issues encountered
- Suggest next steps or ask for direction
