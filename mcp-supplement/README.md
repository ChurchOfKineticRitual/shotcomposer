# MCP Server Supplement for ShotComposer

Add these files to your existing ShotComposer project to enable recommended MCP servers.

## Files to Add

```
Your project/
├── .mcp.json                      # Project-level MCP config (root)
├── .claude/commands/setup-mcp.md  # Slash command to install MCPs
└── docs/MCP_SERVERS.md            # Full documentation
```

## Quick Start

1. Copy these files to your project
2. Run `/setup-mcp` in Claude Code (or run the commands manually)
3. Verify with `/mcp`

## The Three Essential MCPs

```bash
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp@latest
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking
```

| Server | What It Does |
|--------|--------------|
| **Playwright** | Claude can see your running app - no more screenshot pasting |
| **Context7** | Current R3F/Drei/Three.js/Leva docs injected into prompts |
| **Sequential Thinking** | Structured reasoning for complex decisions |

## Usage Examples

**Playwright:**
```
Use playwright to open localhost:5173 and verify the dual viewport renders correctly
```

**Context7:**
```
How do I use Leva folders for nested controls? use context7
```

**Sequential Thinking:**
```
Use sequential thinking to plan how to structure the entity selection system
```
