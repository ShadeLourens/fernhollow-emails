# CLAUDE.md

Owner: Shade Lourens. I want to understand and be able to explain how every part of this project works.

## What this is

Two emails for **Fernhollow Animal Alliance**, a fictional animal charity, built as a portfolio piece. They go with the donation page at https://shadelourens.github.io/fernhollow-portfolio/.

1. **The appeal:** a Second Chances campaign email that links to the donation page.
2. **The receipt:** the email a donor gets after giving.

The emails are written in MJML and built into email-safe HTML. There are two versions of each: one with Engaging Networks merge fields, ready to paste into the platform, and one with sample data for previews and test sends.

Fernhollow is fictional. Never use a real organization's name, logo, branding or code.

## Files

```
CLAUDE.md          these rules
README.md
NOTES.md           my notes (I write these myself)
package.json       MJML is the only dependency
build.js           builds both emails and checks the results
src/
  layout/          shared pieces: head and styles, header, footer
  appeal.mjml      email 1
  receipt.mjml     email 2
text/
  appeal.txt       plain-text versions, written by hand
  receipt.txt
dist/              built HTML (generated, never edit by hand)
assets/            header image and Biscuit's photos
screenshots/       test-send screenshots from real inboxes
index.html         GitHub Pages page linking to the previews
reference/         my reference files (on my computer only, never in Git)
```

Don't add new files or folders without asking me first.

## Reference files

- `reference/` is listed in `.gitignore` and must never be committed. It contains a real organization's emails and code.
- Use the Engaging Networks example in `reference/` **only** to see how merge fields are written. Never copy its layout, code, copy or styles.
- The appeal copy is final. Use it word for word unless I change it.
- I approve the receipt copy before it goes in.
- Brand colors, fonts and impact lines come from the donation page, so the emails and the page match.

## Keep it simple

- MJML is the only npm package. No other packages, frameworks, build tools or third-party scripts.
- Write code a beginner could read. Choose clear over clever.
- If something can't be explained in two sentences, suggest a simpler way first.
- `build.js` stays short and readable, with a comment above each part.
- Never edit anything in `dist/` by hand. Change `src/` and build again.

## The build

`npm run build` runs `build.js`, which:

1. turns each `.mjml` file into `dist/appeal.html` and `dist/receipt.html` (the Engaging Networks versions)
2. makes `dist/appeal-preview.html` and `dist/receipt-preview.html` by swapping each merge field for sample data
3. checks that every merge field is still exactly right in the Engaging Networks versions, and that none are left in the previews
4. prints the size of each HTML file and warns above 100KB, because Gmail cuts off emails whose HTML is larger than about 102KB (images don't count).

If a check fails, the build stops and says what's wrong in plain words.

## Engaging Networks merge fields

Copy these exactly, as written in the reference example:

- `{user_data~First Name~Friend}`: first name, with "Friend" if it's missing
- `{user_data~Email}`: email address
- `{preview_text}`: the hidden preheader, filled from the Preview Text field in EN's settings
- `{unsubscribe_action~ID~URL}`: unsubscribe link. It goes to a subscription management page, where people can change their preferences or leave. Use the fake ID `00000` and `https://act.fernhollow.example/page/00000/subscriptions/1`.
- `{campaignpage_url~ID~URL~label}`: tracked link to a campaign page

Editable blocks (from EN's "Email templates editable regions" page). The template is for EN's Marketing Tools editor.

- Text blocks: `en__component en__component--textblock`
- Images: `en__component en__component--imageblock` (not textblock, even though the example uses it)
- Groups an editor can duplicate: `en__component en__component--repeatable`
- The letter's body sits in one droppable area: `en__component en__component--droppable ui-sortable`
- The header and footer have no classes, so they're locked. Editors can't remove the unsubscribe link or the postal address.

The receipt's fields come from EN's "Receipt Data Tags" page (they work in thank-you emails):

- `{receipt_data~amount~[en]}`: gift amount
- `{receipt_data~createdOn~[yyyy-MM-dd]}`: gift date. `yyyy-MM-dd` is the only format EN's docs show, so the README says to pick a US format in EN's insert tool.
- `{receipt_data~txId}`: transaction ID, used as the reference

**Never guess a field.** If you can't confirm one, tell me.

Sample data for the previews: first name "Jordan", email "jordan@example.com", gift "$51.75" one-time, date "2026-10-19", reference "1234567" (a plain number, because EN's docs don't show what its transaction IDs look like).

## Email coding rules

Emails work differently from web pages, so some donation-page rules change here.

- **Inline CSS is allowed** in this project only, because many email clients ignore stylesheets. MJML moves the CSS inline for us.
- 600px wide, and it must work on a 320px phone.
- **Images:**
  - always full addresses, starting `https://shadelourens.github.io/fernhollow-emails/assets/`
  - twice the size they're shown at, with width and height set
  - JPG or PNG only, never SVG (Gmail and Outlook don't show SVG)
  - photos under 200KB (Email on Acid flags anything bigger). Compress from the original photo: re-compressing a JPEG makes it blockier, not smaller.
- **Alt text** on every image. The header image's alt text is styled (font, size, color), so it still looks like a heading when images are blocked.
- Real text, never text inside images, apart from the logo in the header.
- **Fonts:** Nunito Sans for headings and buttons, Atkinson Hyperlegible for body text, with Arial as the backup. Gmail and Outlook will show Arial, so check that it still looks right.
- **Text sizes:** body text 16px or larger, footer 13px or larger.
- Links are underlined (apart from the button) and say where they go. Never "click here".
- `lang="en"`, a `<title>`, and a hidden preheader in every email.
- **Dark mode:** no separate dark design. The design must survive email clients changing its colors: the header image carries its own background, nothing is see-through, and the button text stays readable.

## Brand rules

The same as the donation page:

- Navy text on light backgrounds. Orange is only for decoration (lines and stripes), never text.
- Buttons are amber with **navy** text. Never use white text on orange or amber.
- Teal is for secondary text, like the signature title.
- Use the same color values as the donation page's `styles.css`.

## Links and tracking

- Every link to the donation page gets UTM tags:
  `?utm_source=email&utm_medium=email&utm_campaign=second-chances&utm_content=...`
- `utm_content` is different for each link, so reports show which one was clicked: `give-50-button`, `own-amount-link` and `ps-link`.
- In Engaging Networks these links would usually be wrapped in `{campaignpage_url~...}`, with an underscore label and `en_og_source` (Origin Source). We don't add those here, because the donation page isn't an EN page, so they wouldn't work. The README explains this.

## The two kinds of email

**The appeal is a marketing email.** Its footer has:

- why you're receiving it
- one link: "Manage your email preferences or unsubscribe"
- the fictional postal address
- the fictional-organization line.

**The receipt is a transactional email.** It's only about the gift, so it has no unsubscribe link. Because of that:

- no marketing links in it, like the petition or "give again"
- the footer says "You're receiving this because you made a gift"
- the tax note uses "EIN 00-0000000 (fictional)"
- monthly gifts say how to change or cancel.

**Every email's footer says** Fernhollow is fictional, no donations are processed, and Biscuit's photos are AI-generated.

**Plain-text versions** in `text/` have the same words as the HTML, with links written out in full.

## Test sends (Mailgun sandbox)

- I run every test send myself.
- **Never ask for, print, log or write down the Mailgun API key**, in any file, the chat or a commit. It lives only in an environment variable on my computer (`MAILGUN_API_KEY`).
- Only send the preview versions, and only to my verified test inboxes.
- The README shows the one `curl` command I use.
- Screenshots go in `screenshots/`, named like `inbox-appeal-gmail-app-dark.png`:
  - Gmail on the web, plus one with images off (Settings → "Ask before displaying external images"). Gmail on the web doesn't change email colors in its dark theme, so it needs no dark screenshot.
  - the Gmail phone app, light and dark
  - Apple Mail in dark mode
  - Outlook.com, light and dark (its dark mode changes colors differently from Gmail's)
- Sandbox emails often land in Spam or Promotions, especially in Outlook.com. That's how sandbox sending works, not a problem with the email: mark them "not spam" and carry on.
- Classic Outlook on Windows: we only start the Email on Acid trial once both emails are finished. If it isn't tested, the README says so.

## Comments

Add short, plain-English comments that anyone could understand. Say what a section is for, or why it's done that way. Don't describe every line.

## How to work with me

1. Explain your plan in plain words before writing code, and wait for my OK.
2. Work in small steps, one part at a time, each on its own branch.
3. After a change, tell me simply what you changed and why.
4. If I ask how something works, explain it line by line, without jargon.
5. Ask before creating, moving or deleting files.
6. Commit and push only when I've said OK.
7. At the end of a session, remind me to add a line to `NOTES.md`. I write those notes myself.

## Done means

- `npm run build` runs with no errors, and all its checks pass.
- Both emails look right at 600px and 320px, in light and dark mode.
- They still make sense with images turned off.
- The plain-text versions match the HTML.
- Each HTML file is under 100KB.
- Test-send screenshots are in `screenshots/`.
- The Engaging Networks versions are ready to paste into the platform.
- I can explain how it works.
