# ROCKN Frontend V3 - Upload Instructions

## What's Fixed:
✅ Source logos (Clearbit) with fallback
✅ Working thumbs up/down (saves to database)
✅ Clean design
✅ All sources mapped

## How to Upload:

1. Go to: github.com/brianfurano-cpu/rockn-frontend
2. Delete the `app` folder (click it → ... → Delete directory → Commit)
3. Delete `package.json`, `tailwind.config.js`, etc.
4. Click "Add file" → "Upload files"
5. Drag ALL files from this folder
6. Commit changes
7. Wait 1-2 min for Vercel
8. Refresh rockn.com

## Files included:
- app/page.js
- app/layout.js
- app/globals.css
- app/components/ArticlesFeed.js
- app/api/vote/route.js (NEW - handles thumbs voting)
- package.json
- tailwind.config.js
- postcss.config.js
- next.config.js
- .gitignore
