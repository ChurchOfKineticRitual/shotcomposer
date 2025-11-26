---
description: Install recommended MCP servers for ShotComposer development
---

## MCP Server Setup

Install these essential MCP servers for the best development experience.

### Step 1: Install Core MCPs

Run these commands to add the recommended servers:

```bash
# Playwright - browser automation for visual verification
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest

# Context7 - up-to-date library documentation
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp@latest

# Sequential Thinking - structured problem-solving
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking
```

### Step 2: Verify Installation

```bash
claude mcp list
```

Or use `/mcp` command in Claude Code to see connected servers.

### Step 3: Test Each Server

**Playwright:**
```
Use playwright mcp to open a browser to example.com
```

**Context7:**
```
What's the current API for @react-three/drei View component? use context7
```

**Sequential Thinking:**
```
Use sequential thinking to analyze the trade-offs between useReducer and Zustand for state management
```

### Reference

See `docs/MCP_SERVERS.md` for detailed documentation on each server and advanced configuration options.

### Why These Three?

1. **Playwright** - Verify UI changes without manual screenshots
2. **Context7** - Get current React Three Fiber, Drei, Leva, Three.js docs
3. **Sequential Thinking** - Complex architectural decisions

This minimal stack covers 90% of development needs without slowing down startup.
