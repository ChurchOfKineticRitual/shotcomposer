# Recommended MCP Servers for Claude Code

This document covers MCP servers that enhance the Claude Code development workflow, particularly for React Three Fiber projects like ShotComposer.

## TL;DR - Essential Stack

For ShotComposer development, install these 3 core servers:

```bash
# 1. Browser automation - verify UI without screenshots
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest

# 2. Up-to-date library docs (R3F, Drei, Three.js, Leva)
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp@latest

# 3. Structured problem-solving for complex decisions
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking
```

---

## 1. Playwright MCP (Microsoft Official) ⭐ ESSENTIAL

**What it solves:** Eliminates the need to screenshot → paste → describe cycle. Claude can see and interact with your running app directly.

### Installation
```bash
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest
```

### Key Capabilities
- **Browser navigation** - Navigate to localhost:5173 (Vite dev server)
- **Screenshot capture** - Takes screenshots and feeds them back to Claude
- **Element interaction** - Click, fill forms, test UI interactions
- **Accessibility snapshots** - Semantic understanding without visual analysis
- **State persistence** - Browser state persists across interactions in a session

### Usage for ShotComposer
```
"Use playwright to open localhost:5173 and check if the dual viewport is rendering correctly"

"Navigate to my app and test clicking on a figure in the scene - does it select properly?"

"Take a screenshot of the Director's Frame viewport and tell me if the camera frustum is visible"
```

### Why Playwright over Puppeteer?
- **Official Microsoft support** - actively maintained, better documentation
- **Cross-browser** - Chromium, Firefox, WebKit
- **Accessibility trees** - Claude understands page structure semantically
- **Modern API** - Better async handling, auto-waiting

### Two Modes
1. **Default (Accessibility)** - Uses structured snapshots, faster, works without vision
2. **Vision Mode** - Add `--vision` flag for screenshot-based interaction
   ```bash
   claude mcp add playwright-vision -s user -- npx -y @playwright/mcp@latest --vision
   ```

---

## 2. Context7 MCP ⭐ ESSENTIAL

**What it solves:** Claude's training data may be outdated for fast-moving libraries. Context7 fetches current, version-specific documentation.

### Installation
```bash
# Free tier (rate limited but sufficient for most projects)
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp@latest

# With API key for higher limits (optional)
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp@latest --api-key YOUR_KEY
```

### How to Use
Add `use context7` to your prompts when working with libraries:
```
"Create a camera-controls setup in React Three Fiber. use context7"

"How do I use Leva folders for organizing pose controls? use context7"

"Show me current Drei View component usage for split viewports. use context7"
```

### Libraries Particularly Relevant to ShotComposer
- `@react-three/fiber` - Core R3F patterns
- `@react-three/drei` - View, CameraControls, helpers
- `three` - Three.js core API
- `leva` - Control panel library
- `camera-controls` - Advanced camera controls

### Pro Tip: Auto-Invoke Rule
Add to your project's `.claude/rules.md`:
```markdown
Always use context7 when I ask about:
- React Three Fiber patterns
- Three.js geometry or materials
- Drei components
- Leva control panels
- camera-controls library
```

---

## 3. Sequential Thinking MCP ⭐ ESSENTIAL

**What it solves:** Complex architectural decisions benefit from structured, step-by-step reasoning with ability to revise.

### Installation
```bash
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking
```

### When to Use
- **Architecture decisions** - "Think through the best way to structure the scene state"
- **Complex debugging** - "Work through why the camera frustum isn't rendering"
- **Trade-off analysis** - "Compare approaches for storing pose data"
- **Refactoring plans** - "Plan how to split this component into smaller pieces"

### Usage Pattern
```
"Use sequential thinking to analyze the architecture for handling multiple figures in the scene"

"Think through step by step: should we use React context or a state library for scene state?"
```

---

## 4. Figma MCP (Optional but Powerful)

**What it solves:** If you have UI designs in Figma, Claude can read them directly and generate matching code.

### Installation (Remote Server - No Desktop App Required)
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```
Then authenticate via `/mcp` command in Claude Code.

### Alternatively (Desktop App Required)
Enable MCP server in Figma Desktop → Settings, then:
```bash
# Connect to local server
claude mcp add --transport http figma-desktop http://127.0.0.1:3845/mcp
```

### Key Capabilities
- Extract design tokens (colors, spacing, typography)
- Generate React/Tailwind components from frames
- Access component library and variables
- Read FigJam diagrams for flow documentation

### When Useful for ShotComposer
- If you create UI mockups for the control panels
- Designing the viewport layout
- Icon and button styling

---

## 5. GitHub MCP (For Team Collaboration)

**What it solves:** Manage PRs, issues, and CI/CD without leaving the terminal.

### Installation
```bash
# Requires GITHUB_TOKEN environment variable
export GITHUB_TOKEN=ghp_your_token_here
claude mcp add github -s user -- npx -y @modelcontextprotocol/server-github
```

### Key Capabilities
- Read and create issues
- Review and manage PRs
- Analyze commit history
- Trigger CI/CD workflows

---

## Configuration Reference

### Project-Level Configuration
Create `.mcp.json` in project root for project-specific servers:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

### User-Level Configuration
Located at `~/.claude.json` - applies across all projects.

### Verify Installation
```bash
claude mcp list
# Or inside Claude Code:
/mcp
```

---

## Best Practices

### 1. Don't Overload
> "Choose 2-3 MCPs that match your primary development tasks rather than installing everything. Too many MCPs can slow down Claude Code startup."

For ShotComposer, the essential three (Playwright, Context7, Sequential Thinking) cover most needs.

### 2. Scope Appropriately
- `-s user` - Available across all projects (recommended for general tools)
- `-s project` - Only available in current project
- `-s local` - Stored in local config, not synced

### 3. Explicit Invocation
First time using an MCP, be explicit:
```
"Use playwright mcp to open localhost:5173"
```
After that, Claude will remember to use it automatically.

### 4. Combine Tools
The real power comes from combining:
```
"Use sequential thinking to plan how to implement the pose controls, 
then use context7 to get the latest Leva folder API,
then implement it and use playwright to verify it works"
```

---

## MCPs NOT Recommended for This Project

| MCP | Why Skip |
|-----|----------|
| **Puppeteer** | Playwright is more modern, better maintained |
| **Memory Bank** | CLAUDE.md handles project memory well |
| **Notion/Slack** | Not needed for solo development |
| **Database MCPs** | No database in ShotComposer MVP |

---

## Troubleshooting

### "Not connected" Error
1. Check server is installed: `npm list -g @playwright/mcp`
2. Restart Claude Code
3. Verify with `/mcp` command

### Server Slow to Start
MCPs run via `npx` download on first use. Subsequent starts are faster.

### Context7 Rate Limiting
Free tier has limits. For heavy usage, get API key at context7.com/dashboard.

---

## Summary

For ShotComposer development, this minimal but powerful stack:

1. **Playwright** - Visual verification without screenshots
2. **Context7** - Current R3F/Drei/Three.js docs
3. **Sequential Thinking** - Complex architectural decisions

Optional additions based on workflow:
- **Figma** - If you design UIs in Figma
- **GitHub** - For PR/issue management
