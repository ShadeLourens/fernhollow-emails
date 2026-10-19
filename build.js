// build.js turns the MJML emails in src/ into email-ready HTML in dist/,
// and makes preview copies of the HTML and the plain text with sample data.
// Run it with: npm run build

const fs = require("fs");
const mjml2html = require("mjml");

// The emails to build. Each one lists its Engaging Networks merge fields,
// with the sample data that replaces them in the preview versions.
const emails = [
  {
    name: "appeal",
    sampleData: {
      "{user_data~First Name~Friend}": "Jordan",
      "{preview_text}": "He was five months old when we found him. Here's what happened next.",
      // The preview's unsubscribe link goes to a short demo note on the project page
      "{unsubscribe_action~00000~https://act.fernhollow.example/page/00000/subscriptions/1}":
        "https://shadelourens.github.io/fernhollow-emails/#unsubscribe",
    },
  },
  {
    name: "receipt",
    sampleData: {
      "{user_data~First Name~Friend}": "Jordan",
      "{preview_text}": "Thank you. Biscuit has something to show you.",
      // The receipt fields come from EN's "Receipt Data Tags" page
      "{receipt_data~amount~[en]}": "$51.75",
      "{receipt_data~createdOn~[yyyy-MM-dd]}": "2026-10-19",
      "{receipt_data~txId}": "1234567",
      "{user_data~Email}": "jordan@example.com",
    },
  },
];

// What a merge field looks like: a name in curly brackets, sometimes with
// extra parts after a ~, like {preview_text} or {user_data~Email}
const mergeFieldPattern = /\{[a-z_]+(~[^{}]*)?\}/g;

// Gmail cuts off emails whose HTML is bigger than about 102KB, so we warn a bit before that
const sizeLimitKB = 100;

// Swaps every merge field for its sample data
function fillInSampleData(content, sampleData) {
  for (const [field, sample] of Object.entries(sampleData)) {
    content = content.replaceAll(field, sample);
  }
  return content;
}

// Checks one pair of files (Engaging Networks version and preview).
// Stops the build with a plain message if anything is wrong.
function checkMergeFields(enName, enContent, previewName, previewContent, mergeFields) {
  // The Engaging Networks version needs every field on the list, written exactly right...
  for (const field of mergeFields) {
    if (!enContent.includes(field)) {
      throw new Error(`${enName} is missing this merge field, or it has been changed:\n  ${field}`);
    }
  }
  // ...and no fields that aren't on the list, which would usually be a typo
  for (const field of enContent.match(mergeFieldPattern) || []) {
    if (!mergeFields.includes(field)) {
      throw new Error(
        `${enName} has a merge field that isn't on the list in build.js:\n  ${field}\n` +
          `Check it for typos, or add it to the list with its sample data.`
      );
    }
  }
  // The preview must have none left, so test sends never show a raw field
  const leftOver = previewContent.match(mergeFieldPattern);
  if (leftOver) {
    throw new Error(`${previewName} still has merge fields in it:\n  ${leftOver.join("\n  ")}`);
  }
}

async function build() {
  for (const email of emails) {
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

    // 2. Make the previews by swapping the merge fields for sample data.
    //    The plain text in text/ is written by hand and already is the Engaging Networks version.
    const textPath = `text/${email.name}.txt`;
    const enText = fs.readFileSync(textPath, "utf8");
    const previewHtml = fillInSampleData(enHtml, email.sampleData);
    const previewText = fillInSampleData(enText, email.sampleData);

    // 3. Check the merge fields in the HTML and the plain text before saving anything
    const enPath = `dist/${email.name}.html`;
    const previewPath = `dist/${email.name}-preview.html`;
    const previewTextPath = `dist/${email.name}-preview.txt`;
    //    Plain text has no hidden preheader, so {preview_text} is only expected in the HTML
    const textFields = mergeFields.filter((field) => field !== "{preview_text}");
    checkMergeFields(enPath, enHtml, previewPath, previewHtml, mergeFields);
    checkMergeFields(textPath, enText, previewTextPath, previewText, textFields);

    // All checks passed, so save the files
    fs.writeFileSync(enPath, enHtml);
    fs.writeFileSync(previewPath, previewHtml);
    fs.writeFileSync(previewTextPath, previewText);

    // 4. Print each HTML file's size, with a warning if Gmail might cut it off
    for (const [path, html] of [[enPath, enHtml], [previewPath, previewHtml]]) {
      const sizeKB = Buffer.byteLength(html) / 1024;
      const warning = sizeKB > sizeLimitKB ? `  WARNING: over ${sizeLimitKB}KB, so Gmail may cut it off` : "";
      console.log(`${path}  ${sizeKB.toFixed(1)}KB${warning}`);
    }
    console.log(`${previewTextPath}  made from ${textPath}`);
  }
  console.log("\nAll merge-field checks passed.");
}

// If anything goes wrong, say what in plain words and stop
build().catch((error) => {
  console.error(`\nThe build stopped:\n${error.message}\n`);
  process.exit(1);
});
