## 2026-10-18

**Asked Claude to:** pick up step 0 (repo setup) after I lost our previous session, and check what already existed before changing anything.

**What I changed:**

- Added `.gitignore` for `reference/`, `.DS_Store` and `node_modules/`, and checked that `reference/` can't be committed.
- Renamed the branch from `master` to `main`.
- Installed MJML 5.4.1, pinned to that exact version, with an `npm run build` script.
- Renamed the images to `assets/biscuit.jpg` and `assets/header.png`.
- Created `NOTES.md` and the folders `src/layout/`, `text/`, `dist/` and `screenshots/`.
- Turned on GitHub Pages and merged step 0 (pull request #1).
- Claude keeps a readable copy of its memory in `reference/claude-memory.md`. It isn't in Git, but it means a lost session can't set me back again.

**Decisions I made:**

- Photos can be up to about 255KB, because Biscuit's photo looks blurry any smaller.
- Kept Node 20 instead of upgrading. My Mac runs Monterey, MJML works fine, and changing tools before the deadline is the bigger risk. I'll upgrade after I submit.
- The site's main address shows 404 until `index.html` exists in step 2. That's expected.

### Later on 2026-10-18

**Asked Claude to:** check how Engaging Networks marks editable blocks, then build the shared layout, the appeal and `build.js` (step 1).

**What I changed:**

- Checked the EN example against 4Site's public MJML templates and EN's own docs, and updated CLAUDE.md with:
  - `{preview_text}` for the preheader, filled from EN's Preview Text field
  - text blocks get `en__component--textblock`, and images get `en__component--imageblock` (the example wrongly uses textblock on images)
  - the letter is in a droppable area, and each section is repeatable so editors can duplicate it
  - one "Manage your email preferences or unsubscribe" link, because EN recommends sending unsubscribe links to a subscription management page
- Created `src/layout/` (head, header, footer) and `src/appeal.mjml` with the final copy word for word.
- Created `build.js`. It builds the EN version and the preview ("Hi Jordan"), checks every merge field before saving anything, and warns above 100KB.
- Changed the background around the email to navy and the footer to teal, to match the header.
- Added browser screenshots at 600px, 320px and with images off.

**Decisions I made:**

- The EN classes are set once in `head.mjml`, the same way 4Site does it, instead of on every block.
- The header and footer have no EN classes, so editors can't remove the unsubscribe link or the postal address.
- `en_og_source` only goes in the README. It's EN's Origin Source, and it only works on EN pages whose code already exists in the account. My donation page is on GitHub Pages.
- The unsubscribe link uses the fake ID `00000` and `act.fernhollow.example`, a domain reserved so it can never belong to anyone.
- The images are plain `<img>` tags inside text blocks. MJML's image tag fixes the height in pixels, which squashes images on phones.
- Kept `header.png` as one image instead of a teal background plus a transparent logo. Outlook and some Gmail apps don't show background images, and a transparent logo could end up on the wrong color in dark mode.
- Where my design and CLAUDE.md disagreed, I followed CLAUDE.md:
  - Nunito Sans and Atkinson Hyperlegible fonts
  - an orange stripe above the impact box, because orange is for lines and amber for buttons
  - 16px for the smaller body text and 13px for the footer
- If the receipt's EN fields can't be confirmed in step 3, the EN version will use clearly marked placeholders like `[GIFT_AMOUNT]`, and the README will say they need connecting.
- I chose teal for the header and footer so they match the brand, and navy for the background so the whole email and the impact box stand out.

**Tested:**

- `npm run build` passes all merge-field checks, and both files are 26.7KB.
- Broke a copy of the project on purpose: a typo, a changed ID and an unlisted field each stopped the build with a plain message, and a 144KB file gave the Gmail warning.
- Looked at it at 600px, at 320px and with images off: the header's alt text shows as peach text on teal.
- At 320px the logo looks quite small, but it's still readable. For now I'm keeping the logo and its teal background as one image, so dark mode can't change its colors.

**Still to do:**

- Commit step 1 on `fernhollow/step-1-appeal` and open a pull request. ✅
- Step 2: the plain-text appeal, the GitHub Pages preview page, test sends and inbox screenshots.
- Look up EN's receipt fields before step 3.
- README notes: `en_og_source`, the locked header and footer, the Marketing Tools editor and the A/B subject lines.

## 2026-10-19

**Asked Claude to:** build step 2: the plain-text appeal, the GitHub Pages project page, and help me with test sends and inbox screenshots.

**What I changed:**

- Created `text/appeal.txt`: the same words as the HTML, with every link written out in full and the EN merge fields kept in.
- `build.js` now also makes `dist/appeal-preview.txt` and runs the same merge-field checks on the plain text. `{preview_text}` is only expected in the HTML, because plain text has no hidden preheader.
- Created `index.html`, a small project page that links to the previews and screenshots. It fixed the GitHub Pages 404.
- The preview's unsubscribe link now goes to a short note on `index.html` explaining that it's a demo.
- Set up Mailgun and an Outlook.com account, and sent test emails with the HTML and the plain text together, the way real platforms send.
- Added 16 inbox screenshots: Gmail (web and iPhone app), Apple Mail (Mac and iPhone) and Outlook.com, in light, dark and with images off.

**Decisions I made:**

- Wrote the plain text by hand. EN has a "Generate plain text from HTML" button, but it doesn't update when the HTML changes, and writing it myself means I choose the wording and the order of the links.
- EN's docs don't say how merge fields like `{unsubscribe_action~…}` come out in plain text, so the README will say to check that with one EN test send.
- No Gmail images-off screenshot, because Apple Mail and Outlook.com already show it.

**Tested:**

- The plain text matches the HTML word for word (17 lines), and the links are the same and in the same order.
- Images off: the header's alt text shows as big peach text on teal in Apple Mail and Outlook.com.
- Outlook.com only shows the navy background when the reading pane is wider than 600px. In a narrow pane there's no room for it. That's not a bug.
- Dark mode:
  - Apple Mail keeps my design exactly as it is.
  - Gmail and Outlook.com darken the email themselves. The button turns dark orange with light text, which is still readable.
  - In the Gmail app, the teal footer turns light blue with dark text, which is still readable.
- The header looks the same everywhere, because the logo and its teal are one image.

**Still to do:**

- Step 3: the receipt email, with a copy draft first.
- Email on Acid for classic Outlook on Windows, once both emails are done.
- README.
