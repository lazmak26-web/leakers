# Shop products

Everything in the Shop comes from this folder. No code to touch.

## 1. Names, descriptions, prices → `products.json`

Each `{ ... }` block is one product, in the order they appear on the site.

```json
{
  "name": "Web App Pentest",
  "category": "Service",
  "description": "Text shown under the name.",
  "price": "$49",
  "badge": "New"
}
```

- To add a product: copy a block, paste it after the last one, put a comma `,` between blocks.
- To remove one: delete its block (and the extra comma).
- `badge` is the small red label. Leave it `""` for none.

## 2. Images → `icon.png`, `icon1.png`, `icon2.png` …

Put the images in this same folder:

| Product in products.json | Image file |
|---|---|
| 1st | `icon.png`  |
| 2nd | `icon1.png` |
| 3rd | `icon2.png` |
| 4th | `icon3.png` |
| … | … |

If an image is missing, the site shows a generated cover instead.
Best size: 1200 × 900 px (4:3), PNG.

After editing, commit and push to `main`: Railway redeploys automatically.
