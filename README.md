# Claude Lazy Starter

A Claude usage window lasts five hours and only starts when you send your first
message. If your limit resets at 3:00 am while you sleep, those hours are gone.
Claude Lazy Starter sends one tiny "Hi" through Claude Code every hour from
GitHub Actions, so a fresh window starts in the night. You wake up to time
already waiting, and a full new window opens right behind it.

## How it works

- `.github/workflows/lazy-start.yml` runs every hour on GitHub's servers.
- It installs Claude Code and runs `claude -p "Hi" --model haiku`, signed in
  with your subscription through a `CLAUDE_CODE_OAUTH_TOKEN` secret.
- Claude Pro and Max share one usage window across claude.ai and Claude Code,
  so that one message starts your window everywhere. If a window is already
  running, the Hi just uses a sliver of it.

## Set it up

The website gives you one prompt to paste into Claude Code. It creates a private
repository, adds the workflow, has you save your token yourself (never through
the chat), and runs it once to check. By hand:

1. Create a private GitHub repository and add `.github/workflows/lazy-start.yml`.
2. Run `claude setup-token` and save the token as the repository secret
   `CLAUDE_CODE_OAUTH_TOKEN`.
3. Run the Lazy start workflow once from the Actions tab.

Optional repository variables: `LAZY_MESSAGE` (default `Hi`) and `LAZY_MODEL`
(default `haiku`). GitHub pauses scheduled workflows after 60 days without
commits; re enable it from the Actions tab if that happens.

## The website

A single static page: Next.js App Router, TypeScript, Tailwind CSS v4, GSAP for
reveals, and a three.js workflow film drawn entirely in code.

```bash
npm install
npm run dev
```

- `NEXT_PUBLIC_SITE_URL` sets the canonical origin for metadata and the sitemap.
