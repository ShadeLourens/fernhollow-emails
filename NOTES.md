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

### Later on 2026-10-19

**Asked Claude to:** restyle the project page, look up EN's receipt fields, draft the receipt copy, then build and test the receipt.

**What I changed:**

- Restyled `index.html` from my design: a white header with the logo, a campaign tag, cards for each email's versions, inbox cards with orange ➜ arrows instead of underlines, and a navy footer.
- Found EN's real receipt fields on its "Receipt Data Tags" page, so no placeholders were needed: `{receipt_data~amount~[en]}`, `{receipt_data~createdOn~[yyyy-MM-dd]}` and `{receipt_data~txId}`, plus `{user_data~Email}`.
- Built `src/receipt.mjml` and `text/receipt.txt`. They reuse the shared header, styles and footer, and the receipt details sit in the same cream box as the appeal's impact box.
- Added the receipt to `build.js`, so the same merge-field checks run on it. The receipt HTML is 21.7KB.
- Added Biscuit's sofa photo as `assets/biscuit-sofa.jpg`.
- Did a test send and added the receipt's screenshots to the project page.

**Decisions I made:**

- Changed Claude's draft so it works as a real US receipt:
  - "receipt" in the subject, because donors search for it at tax time
  - 501(c)(3) wording instead of "registered charity"
  - a sentence telling monthly donors they get one receipt each January
  - "Receipt sent to:"
  - a plain-number sample reference
- Kept the receipt transactional: no unsubscribe link and no marketing links. The photo thanks the donor without asking for anything.
- The date uses `yyyy-MM-dd`, the only format EN's docs show. I wanted "October 19, 2026", but couldn't confirm that pattern, so the README will say to choose a US format in EN's insert tool instead of guessing.
- Removed Biscuit's photo from the project page, because the page is a signpost to the emails.

**Tested:**

- Gmail app (light, dark and before images loaded) and Outlook.com: the receipt box and photo look right everywhere.
- Gmail turns the donor's email address into a blue link, and with images off it shows an empty frame for the photo instead of the alt text. Neither breaks anything.

**Still to do:**

- Email on Acid for classic Outlook on Windows (about an hour).
- Write the README.

## 2026-10-20

**Asked Claude to:** go through the Email on Acid (now Mailgun Inspect) results with me, fix what it found, and write reusable guides for future email projects.

**What I changed:**

- Ran both emails through Email on Acid on the Premium free trial: classic Outlook on Windows, accessibility, links, images and spam.
- Fixed the images being cropped in classic Outlook. The image blocks had a 28px line height, and Outlook cut both photos and the header down to a 28px strip. Those blocks now use a normal line height.
- Fixed the impact line and button showing in Arial Black in Outlook. Weight 800 plus Arial on Windows switches to Arial Black, so headings and the button now use weight 700.
- Added an `<h1>` (the header logo) and `<h2>`s (the impact line and "Your receipt") for screen readers. They look the same as before.
- Re-exported both photos from the originals to get them under 200KB (151KB and 175KB), and changed the rule in CLAUDE.md to match.
- Added "Outlook on Windows" screenshots to the project page, including a "before the fix" one for the appeal.
- Wrote two reusable guides for future projects: email-building lessons and Engaging Networks tips.

**Decisions I made:**

- Chose the Premium trial over Basic for its accessibility, link, image and spam checks, which match what the job asks for.
- Kept the button without an underline. It's a filled button, so it clearly looks clickable, and CLAUDE.md allows this exception.
- Showed the cropped "before" screenshot next to the fixed ones, because finding, fixing and proving a bug is part of QA.
- Kept the two guides as separate documents, so a future project only gets the one it needs.

**Tested:**

- The retest in classic Outlook (light and dark) shows both emails in full, with normal bold headings.
- The "heading one" warning is gone. The only accessibility note left is the button's missing underline.
- Spam: everything passes except Yahoo, which is about the sandbox sender's reputation, not the content.
- "Missing SSL certificate" on the unsubscribe link is a false alarm. I checked, and its HTTPS works.

**Still to do:**

- Write the README, including "How I worked with Claude Code".
- Petition page, GitHub profile, LinkedIn, then the cover letter. Submit on Oct 24.
