# Deploying the Avodah Kitchen Website
### A step-by-step guide — no coding experience needed

This walks you through getting the website live on the internet, connected to GitHub and Netlify, with a staff-friendly admin page for making edits without touching any code.

**The big picture:** GitHub stores your website's files. Netlify takes those files and makes them into a real, live website — and automatically updates the live site every time something changes in GitHub. The `/admin` page lets staff edit content, which saves back to GitHub, which triggers Netlify to update the site. One connected chain, no manual re-uploading ever needed.

---

## Part 1: Put the website on GitHub

### 1.1 Create a GitHub account (skip if you already have one)
1. Go to [github.com](https://github.com)
2. Click **Sign up**, follow the prompts

### 1.2 Create a new repository
1. Once logged in, click the **+** icon (top right) → **New repository**
2. Name it something like `avodah-kitchen-website`
3. Set it to **Public** (Netlify's free tier works with public repos most simply — private repos work too, just a couple extra clicks later)
4. Do **not** check "Add a README" — leave it empty
5. Click **Create repository**

### 1.3 Upload the website files
GitHub will show you a page with upload instructions. The simplest way, no command line needed:
1. On that page, click **uploading an existing file**
2. Drag in every file and folder from the website package you were given (`index.html`, `menu.html`, `css`, `js`, `img`, `content`, `admin`, `netlify.toml` — everything)
3. Scroll down, click **Commit changes**

Your website's code now lives on GitHub.

---

## Part 2: Connect Netlify to GitHub

### 2.1 Create a Netlify account
1. Go to [netlify.com](https://netlify.com)
2. Click **Sign up** — choosing "Sign up with GitHub" is easiest, since it links the two accounts automatically

### 2.2 Create a new site from your repository
1. From your Netlify dashboard, click **Add new site** → **Import an existing project**
2. Choose **GitHub**, authorize Netlify to access your repositories if prompted
3. Select your `avodah-kitchen-website` repository
4. Netlify will detect the settings automatically from the `netlify.toml` file already included — you shouldn't need to change anything. Click **Deploy site**

### 2.3 Wait for it to go live
Within a minute or two, Netlify gives you a live URL, something like `https://random-name-12345.netlify.app`. Click it — your website should now be visible to anyone on the internet.

### 2.4 (Optional) Rename your Netlify site
1. In Netlify, go to **Site settings** → **Change site name**
2. Pick something recognizable, like `avodah-kitchen` — this changes your URL to `https://avodah-kitchen.netlify.app`

### 2.5 (Optional, later) Connect your own domain
If you buy a real domain (e.g. `avodahkitchen.ph`), Netlify's **Domain management** section walks you through pointing it at your site. Not required to get started — the free `.netlify.app` address works fine while you're testing.

---

## Part 3: Set up the staff admin page (DecapBridge)

This is what lets non-technical staff log in and edit the website's logo, contact info, reservation form link, and menu — without ever opening a code file.

### 3.1 Create a DecapBridge account
1. Go to [decapbridge.com](https://decapbridge.com)
2. Sign up for a free account

### 3.2 Create a GitHub access token (a one-time technical step — only needs to be done once, by whoever sets this up)
1. Log into GitHub, click your profile picture (top right) → **Settings**
2. Scroll down, click **Developer settings** (bottom of the left sidebar)
3. Click **Personal access tokens** → **Fine-grained tokens**
4. Click **Generate new token**
5. Fill in:
   - **Token name:** DecapBridge Access
   - **Expiration:** No expiration
   - **Repository access:** Only select repositories → choose `avodah-kitchen-website`
   - Under **Permissions**, set:
     - **Contents:** Read and write
     - **Pull requests:** Read and write
6. Click **Generate token**
7. **Copy the token immediately** — GitHub only shows it once

### 3.3 Register your site in DecapBridge
1. In your DecapBridge dashboard, click **Create New Site**
2. Fill in:
   - **GitHub Repository:** `your-github-username/avodah-kitchen-website`
   - **GitHub Personal Access Token:** paste the token from step 3.2
   - **Decap CMS URL:** `https://your-site-name.netlify.app/admin/` (use your actual Netlify URL from Part 2)
3. Submit — DecapBridge will show you two values you'll need next: a **site ID** and confirmation of your repo path

### 3.4 Update the config file with your real values
1. Go back to your GitHub repository in the browser
2. Open `admin/config.yml`, click the pencil (✏️) icon to edit it
3. Find these three lines near the top and replace the placeholder text with your real values from DecapBridge:
   ```yaml
   repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME
   identity_url: https://auth.decapbridge.com/sites/YOUR_SITE_ID
   ```
   and further down:
   ```yaml
   site_url: https://YOUR_SITE_NAME.netlify.app
   ```
4. Scroll down, click **Commit changes** — Netlify will automatically rebuild your site within a minute or two

### 3.5 Log in and test
1. Go to `https://your-site-name.netlify.app/admin/`
2. Click **Login with DecapBridge**
3. Log in with the DecapBridge account you created in step 3.1
4. You should now see two editable sections: **Site Settings** and **Menu Items**

---

## Part 4: Invite staff to edit the site (no GitHub account needed for them)

1. In your DecapBridge dashboard, click on your site
2. Go to **Manage Collaborators**
3. Enter the staff member's name and email address
4. Click **Send Invitation Email**

They'll receive an email, create a simple DecapBridge login (just an email + password — no GitHub knowledge required), and can then log into `your-site.netlify.app/admin/` to make edits themselves.

---

## What staff can edit from the admin page

| Section | What it controls |
|---|---|
| **Site Settings → Logo Image** | The logo shown in the header and footer |
| **Site Settings → Restaurant Name** | The big heading on the homepage |
| **Site Settings → Hero Tagline** | The subtitle under the restaurant name |
| **Site Settings → Reservation Section Heading/Blurb** | The text above the "Reserve a Table" button |
| **Site Settings → Tally Reservation Form URL** | Where the "Reserve a Table" button links to |
| **Site Settings → Phone / Email / Address** | Contact details shown across the site |
| **Menu Items** | Every dish, its category, description, and price |

Every save takes about 1–2 minutes to appear on the live site (Netlify needs a moment to rebuild) — this is normal, not a bug.

## What still requires a developer
Layout, colors, fonts, adding new sections, or changing anything not listed in the table above — those live in the actual code files (`index.html`, `css/style.css`) and would need a small code edit, not something the admin page covers.

---

## Quick troubleshooting

**"I published a change and the site didn't update"**
Give it 1–2 minutes — Netlify needs to rebuild. If it's been longer than 5 minutes, check your Netlify dashboard's **Deploys** tab for an error message.

**"I can't log into /admin"**
Double-check the three placeholder values in `admin/config.yml` were actually replaced with your real DecapBridge values (Part 3.4) — this is the most common setup mistake.

**"The Reserve button doesn't do anything"**
Check that the **Tally Reservation Form URL** field in Site Settings is your real, published Tally form link, not left as a placeholder.
