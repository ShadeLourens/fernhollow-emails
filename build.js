// build.js turns the MJML emails in src/ into email-ready HTML in dist/.
// Run it with: npm run build

const fs = require("fs");
const mjml2html = require("mjml");

// The emails to build. Each one lists its Engaging Networks merge fields,
// with the sample data that replaces them in the preview version.
const emails = [
  {
    name: "appeal",
    sampleData: {
      "{user_data~First Name~Friend}": "Jordan",
      "{preview_text}": "He was five months old when we found him. Here's what happened next.",
      "{unsubscribe_action~00000~https://act.fernhollow.example/page/00000/subscriptions/1}": "#",
    },
  },
];

// What a merge field looks like: a name in curly brackets, sometimes with
// extra parts after a ~, like {preview_text} or {user_data~Email}
const mergeFieldPattern = /\{[a-z_]+(~[^{}]*)?\}/g;

// Gmail cuts off emails whose HTML is bigger than about 102KB, so we warn a bit before that
const sizeLimitKB = 100;

async function build() {
  for (const email of emails) {
    const enPath = `dist/${email.name}.html`;
    const previewPath = `dist/${email.name}-preview.html`;
    const mergeFields = Object.keys(email.sampleData);

    // 1. Turn the MJML into HTML. This is the Engaging Networks version.
    //    MJML 5 skips <mj-include> unless we switch it on, and "strict"
    //    makes it stop on any mistake instead of guessing.
    const sourcePath = `src/${email.name}.mjml`;
    const result = await mjml2html(fs.readFileSync(sourcePath, "utf8"), {
      filePath: sourcePath,
      ignoreIncludes: false,
      keepComments: false,
      validationLevel: "strict",
    });
    const enHtml = result.html;

    // 2. Make the preview version by swapping every merge field for its sample data
    let previewHtml = enHtml;
    for (const field of mergeFields) {
      previewHtml = previewHtml.replaceAll(field, email.sampleData[field]);
    }

    // 3. Check the merge fields before saving anything.
    //    The Engaging Networks version needs every field on the list, written exactly right...
    for (const field of mergeFields) {
      if (!enHtml.includes(field)) {
        throw new Error(`${enPath} is missing this merge field, or it has been changed:\n  ${field}`);
      }
    }
    //    ...and no fields that aren't on the list, which would usually be a typo
    for (const field of enHtml.match(mergeFieldPattern) || []) {
      if (!mergeFields.includes(field)) {
        throw new Error(
          `${enPath} has a merge field that isn't on the list in build.js:\n  ${field}\n` +
            `Check it for typos, or add it to the list with its sample data.`
        );
      }
    }
    //    The preview must have none left, so test sends never show a raw field
    const leftOver = previewHtml.match(mergeFieldPattern);
    if (leftOver) {
      throw new Error(`${previewPath} still has merge fields in it:\n  ${leftOver.join("\n  ")}`);
    }

    // All checks passed, so save both versions
    fs.writeFileSync(enPath, enHtml);
    fs.writeFileSync(previewPath, previewHtml);

    // 4. Print each file's size, with a warning if Gmail might cut it off
    for (const [path, html] of [[enPath, enHtml], [previewPath, previewHtml]]) {
      const sizeKB = Buffer.byteLength(html) / 1024;
      const warning = sizeKB > sizeLimitKB ? `  WARNING: over ${sizeLimitKB}KB, so Gmail may cut it off` : "";
      console.log(`${path}  ${sizeKB.toFixed(1)}KB${warning}`);
    }
  }
  console.log("\nAll merge-field checks passed.");
}

// If anything goes wrong, say what in plain words and stop
build().catch((error) => {
  console.error(`\nThe build stopped:\n${error.message}\n`);
  process.exit(1);
});
