# Cowork Prompt Versioning System

This folder contains versioned handoff prompts for continuing work on richardangelomclean.com in Claude Cowork sessions. Each prompt is a self-contained snapshot that gives a new session everything it needs to pick up where the last one left off.

## Structure

```
cowork-prompts/
├── README.md           You're reading this
├── CHANGELOG.md        What changed between versions (newest first)
└── snapshots/
    ├── v1.0.0.md       Initial build snapshot
    ├── v1.1.0.md       (future — after deployment, for example)
    └── ...
```

## How to use

1. Open the latest snapshot in `snapshots/` (highest version number).
2. Copy everything below the `---` line.
3. Paste it as the first message in a new Cowork session.
4. Mount the `richardangelomclean/` folder so Claude has file access.

The YAML frontmatter at the top of each snapshot is for your reference — it tells you the version, date, project status, and what's next. You don't need to include it in the prompt (but it won't hurt if you do).

## When to create a new version

Create a new snapshot when a session produces meaningful changes to the project state. Not every session needs one — only when something changes that a future session would need to know about.

**Bump the version like this:**

- **Patch (1.0.x):** Small updates — copy edits, fixing a JSON entry, swapping an asset. The project architecture and open decisions haven't changed.
- **Minor (1.x.0):** Meaningful progress — a feature shipped, a decision resolved, deployment completed, new section added. The prompt needs new information.
- **Major (x.0.0):** Structural change — site redesign, new page added, architecture overhaul, or enough has changed that the old prompt wouldn't be useful anymore.

## How to create a new version

1. Duplicate the latest snapshot file and rename it (e.g., `v1.0.0.md` → `v1.1.0.md`).
2. Update the YAML frontmatter: bump `version`, update `created` date, rewrite `session_context` and `next_actions`.
3. Edit the body to reflect the current project state. Move resolved items out of "Known Issues." Add anything new.
4. Add an entry to `CHANGELOG.md` describing what changed and why.

Or just tell Claude: "Update the cowork prompt to reflect what we did today" and it'll handle the diff.

## Versioning convention

Follows semver-style numbering applied to prompt content, not code:

| Bump  | When                                         | Example                        |
|-------|----------------------------------------------|--------------------------------|
| Patch | Copy fix, asset swap, minor JSON edit        | 1.0.0 → 1.0.1                 |
| Minor | Feature complete, decision resolved, deploy  | 1.0.1 → 1.1.0                 |
| Major | Redesign, new page, architecture change      | 1.1.0 → 2.0.0                 |
