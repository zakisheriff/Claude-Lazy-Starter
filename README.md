# <div align="center">Claude Lazy Starter</div>

<div align="center">
<strong>Start your Claude usage window while you sleep. Wake up to time already waiting.</strong>
</div>

<br />

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.180-000000?style=for-the-badge&logo=three.js&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Hourly-2088ff?style=for-the-badge&logo=githubactions&logoColor=white)
![Claude Code](https://img.shields.io/badge/Claude%20Code-Headless-d97757?style=for-the-badge&logo=anthropic&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br />

<a href="https://claudelazystarter.theatom.lk">
<img src="https://img.shields.io/badge/View%20Live%20Site-Click%20Here-d97757?style=for-the-badge&logo=safari&logoColor=white" height="50" />
</a>

<br />
<br />

**[Visit Live Site: https://claudelazystarter.theatom.lk](https://claudelazystarter.theatom.lk)**

</div>

<br />

> **"Your usage limit resets at 3:00 am. You wake up at 7:00 am. Those hours should not be wasted."**
>
> Claude Lazy Starter isn't a scheduler you babysit; it's one tiny GitHub Actions workflow.  
> Every hour it sends a single "Hi" through Claude Code, so a fresh five hour window starts while you sleep and a full new one opens right behind it.

---

## 🌟 Vision

Claude Lazy Starter's mission is to be:

- **Completely free** — runs on GitHub Actions, no server, no subscription
- **Official tools only** — Claude Code with your own subscription, no browser automation or scraped sessions
- **Set up in one prompt** — paste it into Claude Code and it does the rest

---

## ✨ Why Claude Lazy Starter?

Claude Pro and Max meter usage in five hour windows, and a window only starts when you send your first message.  
If your limit resets in the middle of the night, the clock sits idle until you wake up and type. Claude Lazy Starter starts that window for you, so **the hours you sleep through are hours you get back**.

---

## 🌙 How a Night Looks

- **11:00 pm**  
  You hit your usage limit and go to sleep.

- **3:00 am**  
  The window ends. Nothing is running.

- **3:07 am**  
  The hourly run sends "Hi". A new five hour window starts in the dark.

- **7:00 am**  
  You wake up with an hour already waiting and use it.

- **8:07 am**  
  That window ends and a full new five hour window opens right behind it.

---

## 🎬 A Film Drawn in Code

- **Low Poly Room in Three.js**  
  A developer at his desk, a small Claude styled bot, a window that turns from night to sunrise, and a ticking wall clock.

- **A Live Laptop Screen**  
  Drawn on a canvas texture: the chat that hits the limit, the terminal sending the Hi, and the morning session.

- **Usage That Tells the Story**  
  He works up to 90 percent of the window, then it resets to zero at 8:07 am with a "+5 hours" moment.

- **Cinematic and Accessible**  
  Wide and over the shoulder camera moves, captions, a scrubber, and a still frame under reduced motion.

---

## 🔐 Private by Design

- **Your Token, Your Repository**  
  The Claude Code token lives only as an encrypted Actions secret in your own private repository.

- **Never Pasted Into Chat**  
  The setup prompt has you create and save the token yourself in your own terminal.

- **No Shared Server**  
  Nobody else holds your account. Each person runs their own copy.

- **Minimal Usage**  
  One "Hi" on Haiku, the smallest model, uses as little of your window as possible.

---

## 📁 Project Structure

```
Claude-Lazy-Starter/
├── .github/
│   └── workflows/
│       └── lazy-start.yml        # The product: hourly Hi through Claude Code
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Fonts, metadata, site wide JSON-LD
│   ├── page.tsx                  # The single landing page
│   ├── globals.css               # Design tokens and article styles
│   ├── llms.txt/route.ts         # Generated summary for AI engines
│   ├── robots.ts                 # Search and AI crawler rules
│   ├── sitemap.ts
│   └── manifest.ts
│
├── components/
│   ├── home/                     # Page sections
│   │   ├── Hero.tsx              # Horizon artwork and contents
│   │   ├── Introduction.tsx
│   │   ├── HowItWorks.tsx        # Film, timelines, comparison table
│   │   ├── SetItUp.tsx           # One prompt setup (embeds the workflow)
│   │   ├── Faq.tsx
│   │   ├── Cta.tsx
│   │   └── film/
│   │       ├── story.ts          # Pure script: clock, captions, poses, camera
│   │       ├── screen.ts         # Laptop screen drawn on a canvas
│   │       └── WorkflowFilm.tsx  # Three.js scene and overlays
│   ├── layout/                   # Navbar, mobile menu, footer
│   ├── motion/                   # Scroll reveals
│   └── ui/                       # Button, CodeBlock, WindowTimeline
│
├── content/
│   └── faq.ts                    # FAQ copy (page, schema, and llms.txt)
│
└── lib/
    ├── seo/                      # Site config and JSON-LD graph
    └── utils/
```

---

## 🚀 Quick Start

### Prerequisites

- **A Claude Pro or Max plan**
- **A GitHub account** (free)
- **Claude Code** installed on your computer

Everything else, including the GitHub CLI, is installed and checked by the setup prompt.

### 1. Open Claude Code

Open Claude Code in any folder.

### 2. Paste the Setup Prompt

Copy the prompt from the **[Set it up](https://claudelazystarter.theatom.lk/#set-it-up)** section of the website and paste it in. Claude will:

```text
1. Check your computer and install the GitHub CLI if it is missing
2. Have you sign in to GitHub in your browser (with the workflow scope)
3. Create a private repository named claude-lazy-starter
4. Add .github/workflows/lazy-start.yml through the GitHub API (no git needed)
5. Ask you to run claude setup-token in your own terminal
6. Ask you to save it with gh secret set CLAUDE_CODE_OAUTH_TOKEN
7. Run the workflow once, fix anything that fails, and confirm it passed
```

### 3. That's It

From then on it runs every hour by itself. 🎉

### Setting It Up by Hand

```bash
# 1. Create a token for your subscription
claude setup-token

# 2. Save it as a secret in your own private repository
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo OWNER/claude-lazy-starter

# 3. Copy .github/workflows/lazy-start.yml into that repository, then run it once
gh workflow run lazy-start.yml --repo OWNER/claude-lazy-starter
```

### Running the Website Locally

```bash
git clone https://github.com/zakisheriff/Claude-Lazy-Starter.git
cd Claude-Lazy-Starter
npm install
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🎯 Key Features

### For Claude Users

✅ **Overnight Windows** — A fresh window starts within an hour of the last one ending  
✅ **Runs While You Sleep** — GitHub's servers do the work, your laptop can be closed  
✅ **One Prompt Setup** — Claude Code creates and configures everything  
✅ **Tiny Footprint** — One "Hi" on Haiku per hour  
✅ **Configurable** — Change the message or model with repository variables  
✅ **Free** — No server, no subscription, no cost  

### For the Website

✅ **Animated Workflow Film** — Built entirely in code with three.js  
✅ **Editorial Design** — Serif reading column, horizon hero, full height footer  
✅ **Responsive** — Separate art direction and camera framing for phones  
✅ **Static and Fast** — One prerendered page  

---

## 🔧 Tech Stack

### Automation
- **GitHub Actions** — Hourly cron, runs on GitHub's servers
- **Claude Code** — Headless `claude -p` with a subscription token
- **Haiku** — The smallest model, for the lightest possible ping

### Website
- **Next.js 15** — App Router, fully static
- **TypeScript** — End to end
- **Tailwind CSS v4** — Design tokens and utilities
- **Three.js** — The low poly workflow film
- **GSAP** — Scroll reveals and the mobile menu
- **Source Serif 4, Inter, JetBrains Mono** — Typography

---

## ⚙️ Workflow Configuration

### Required Secret
- `CLAUDE_CODE_OAUTH_TOKEN` — Long lived token from `claude setup-token`

### Optional Repository Variables
- `LAZY_MESSAGE` — The message to send (default `Hi`)
- `LAZY_MODEL` — The model to use (default `haiku`)

### Schedule
- `7 * * * *` — Minute 7 of every hour
- If the window is still exhausted, the run exits cleanly and tries again next hour

---

## 🔍 SEO, AEO, and GEO

✅ **Linked JSON-LD Graph** — Organization, WebSite, WebPage, SoftwareApplication, HowTo, FAQPage  
✅ **Speakable Sections** — For voice assistants  
✅ **llms.txt** — A generated plain text summary for AI engines  
✅ **AI Crawler Friendly** — robots rules welcome search and AI crawlers  
✅ **Open Graph and Twitter Cards** — Cut from the hero artwork  

---

## 🌐 Deployment

### Website (Vercel)
1. Import the repository
2. Set `NEXT_PUBLIC_SITE_URL` to your domain
3. Deploy, everything is static

### Workflow (GitHub Actions)
1. Add the `CLAUDE_CODE_OAUTH_TOKEN` secret
2. Run **Lazy start** once from the Actions tab
3. GitHub pauses scheduled workflows after 60 days without commits; re enable it from the Actions tab if needed

---

## ⚠️ Disclaimer

Claude Lazy Starter is an independent project built by The Atom. It is not affiliated with or endorsed by Anthropic. Claude and Claude Code are trademarks of Anthropic.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License — 100% Free and Open Source

---

## ☕️ Support the Project

If Claude Lazy Starter gave you back a few hours of Claude every morning:

- Consider buying me a coffee
- It keeps development alive and motivates future updates

<div align="center">
<a href="https://buymeacoffee.com/theoneatom">
<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="60" width="217">
</a>
</div>

---

<p align="center">
Made by <strong>Zaki Sheriff</strong> at <a href="https://theatom.lk">The Atom</a>
</p>

<p align="center">
<em>Because the hours you sleep through should still be yours.</em>
</p>
