# Stay Automatic AI Operator Field Manual

This folder contains the editable source, rendering scripts, final PDF, and QA previews for the Stay Automatic owner-operator field manual.

## Build

```bash
node field-manual/render-manual.cjs
mkdir -p field-manual/qa/pages
pdftoppm -png -r 110 field-manual/dist/Stay-Automatic-AI-Operator-Field-Manual.pdf field-manual/qa/pages/page
python3 field-manual/make-contact-sheet.py
```

## Outputs

- Editable source: `Stay-Automatic-AI-Operator-Field-Manual.html`
- Final PDF: `dist/Stay-Automatic-AI-Operator-Field-Manual.pdf`
- Reprintable worksheets: `dist/Stay-Automatic-AI-Operator-Worksheet-Pack.pdf`
- Page previews: `qa/pages/`
- QA contact sheet: `qa/Stay-Automatic-Field-Manual-contact-sheet.jpg`

All copy is original Stay Automatic material. The manual does not reproduce Tony Simons' article text, sequence, screenshots, or branding.
