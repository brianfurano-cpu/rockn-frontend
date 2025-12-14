# 🎸 ROCKN Frontend V2 - Upload Guide

## What's New in V2:
- 🔍 **Search bar** - Find articles by keyword
- 📊 **Sort buttons** - By Date, Score, Source, or Title
- 📰 **Source filter** - Show only specific sources
- 🏷️ **Category filter** - Filter by category
- ⭐ **Score filter** - Show only high-scoring articles
- ⭐ **Top Stories** - Highlighted section for 80+ scores
- 📱 **Mobile responsive** - Works on all devices

---

## 🚀 HOW TO UPDATE YOUR SITE (5 minutes)

### Step 1: Go to Your GitHub Repo
Open: https://github.com/brianfurano-cpu/rockn-frontend

### Step 2: Delete Old Files
1. Click on `app` folder
2. Click the `...` menu (top right of file list)
3. Click "Delete directory"
4. Commit the deletion

### Step 3: Upload New Files
1. Click "Add file" → "Upload files"
2. Drag the ENTIRE `app` folder from this package
3. Also drag these files (replace existing):
   - package.json
   - tailwind.config.js
   - globals.css (inside app folder)
4. Commit changes

### Step 4: Wait for Auto-Deploy
Vercel will automatically redeploy. Takes ~1 minute.

### Step 5: Refresh Your Site
Go to rockn.com and see the new features!

---

## 📁 Files to Upload:

```
app/
  ├── page.js          (main page)
  ├── layout.js        (layout wrapper)
  ├── globals.css      (styles)
  └── components/
      └── ArticlesFeed.js  (interactive component)

package.json
tailwind.config.js
postcss.config.js
next.config.js
.gitignore
```

---

## 🎨 Customization

### Change Colors
Edit `app/globals.css`:
```css
:root {
  --accent: #dc2626;  /* Change this for different accent color */
}
```

### Change Header Text
Edit `app/page.js`, find:
```jsx
<h1>ROCKN</h1>
```

---

## Your DATABASE_URL is Already Set!
You don't need to change anything in Vercel - the environment variable is already there.

---

Enjoy your upgraded ROCKN site! 🎸
