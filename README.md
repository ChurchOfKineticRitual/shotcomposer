# ShotComposer Handover Package

This directory contains everything needed to continue development of ShotComposer in Claude Code.

## What is ShotComposer?

A 3D camera sandbox for filmmakers to compose shots and generate AI image prompts. Position cameras, place posable human figures and entity volumes, then export reference images + auto-generated cinematographic prompts for use with generative AI models (especially NanoBanana/Gemini 2.5 Flash Image).

## Quick Start

1. **Open this directory in Claude Code:**
   ```bash
   cd shotcomposer-handover
   claude
   ```

2. **Use the setup command to initialize the project:**
   ```
   /setup
   ```

3. **Start implementing features:**
   ```
   /implement dual viewport system
   ```

## Directory Structure

```
shotcomposer-handover/
├── CLAUDE.md              # Main project memory (Claude Code reads this automatically)
├── README.md              # This file
├── .claude/
│   └── commands/          # Custom slash commands
│       ├── setup.md       # Initialize the project
│       ├── implement.md   # Implement a new feature
│       ├── add-pose.md    # Create a pose preset
│       └── test-prompts.md # Test prompt generation
└── docs/
    ├── RESEARCH.md        # Complete research findings
    ├── TECHNICAL_SPEC.md  # Detailed implementation specs
    └── MANNEQUIN_INTEGRATION.md  # Mannequin.js API reference
```

## Key Files

### CLAUDE.md
The main project memory file. Claude Code automatically reads this at the start of each session. Contains:
- Tech stack decisions
- Project structure
- Architecture decisions
- Code style guidelines
- Do's and don'ts

### docs/RESEARCH.md
Complete research findings from the Claude.ai session, including:
- How NanoBanana interprets reference images (semantic, not mechanical)
- Why Mannequin.js was chosen over IK solutions
- How to handle non-humanoid characters (labelled volumes)
- Prompting best practices for AI image generation

### docs/TECHNICAL_SPEC.md
Detailed implementation patterns including:
- Dual viewport implementation with R3F Views
- Mannequin.js wrapper component code
- Generic volume component for creatures
- PNG export implementation
- Auto-prompt generation logic
- State management patterns

### docs/MANNEQUIN_INTEGRATION.md
Complete Mannequin.js API reference:
- Body part hierarchy
- Rotation properties and their meanings
- Example poses
- R3F integration patterns
- Pose preset format

## Custom Slash Commands

| Command | Description |
|---------|-------------|
| `/resume` | **Start here** - Assess state, update docs, continue with next steps |
| `/setup` | Initialize the project from scratch |
| `/implement <feature>` | Implement a new feature following architecture |
| `/add-pose <name>` | Create a new pose preset |
| `/test-prompts` | Test and refine prompt generation |

## Development Workflow

1. Read CLAUDE.md for context (automatic)
2. Consult docs/ for specific implementation details
3. Use slash commands for common tasks
4. Clear context after completing features (keeps things fresh)

## Key Architecture Decisions

1. **Dual Viewport**: Scene overview (orbit camera) + Director's frame (16:9 fixed)
2. **Mannequin.js for humans**: Forward kinematics, simple API, proven in production
3. **Labelled volumes for creatures**: NanoBanana is semantic, not mechanical
4. **Leva for controls**: Debug panels during development
5. **Context + useReducer**: Simple state management for MVP

## What This Package Provides

- ✅ Complete research on spatial control for AI image generation
- ✅ Evaluated multiple posing solutions (chose Mannequin.js)
- ✅ Architecture decisions documented
- ✅ Implementation patterns with code examples
- ✅ Slash commands for common workflows
- ✅ Pose preset format defined

## What Claude Code Will Build

- [ ] Vite + React project setup
- [ ] Dual viewport system
- [ ] Director camera with frustum visualization
- [ ] Mannequin.js integration and pose controls
- [ ] Generic volume components for non-humans
- [ ] Entity management (add, select, position)
- [ ] PNG export from director camera
- [ ] Auto-prompt generation
- [ ] Pose preset library

---

*This handover package was created from a Claude.ai research session on November 26, 2025.*
