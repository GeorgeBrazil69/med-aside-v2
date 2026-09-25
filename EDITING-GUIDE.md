# What to edit → what changes

## Which file does what?

| File | Responsibility | Editing it changes |
| --- | --- | --- |
| `index.html` | All nine screen layouts and visible labels | Text, buttons, fields, and where elements appear |
| `styles.css` | Colors, typography, spacing, mobile layout | The appearance of every screen |
| `config.js` | Starting sample values | Initial amount, recipient, balance, warning name, and payment result after Reset demo |
| `app.js` | Interactions and data | Navigation, keypad behavior, image upload, saving, payment outcomes, activity |
| `cash-demo-standalone.html` | Generated all-in-one HTML | Portable copy that opens without companion files |
| `build.py` | Packaging | Regenerates the standalone HTML and ZIP from source |

Edit the four source files, then run `python3 build.py`. Direct edits to the standalone file are overwritten by the next build. Browser settings override `config.js`; use **Reset demo** after changing defaults.

## Screens (all are sections inside index.html)

These are not separate web pages. `app.js` calls `show('name')` to switch between sections.

| Section ID in index.html | Screen | Main control |
| --- | --- | --- |
| `screen-pay` | Green amount keypad | `digit()`, `start()` |
| `screen-recipient` | Recipient $cashtag search | `updateRecipient()`, `selectRecipient()` |
| `screen-note` | Payment note | `note-input`, Review action |
| `screen-review` | Amount, recipient, artwork, note, sample balance | `render()`, `complete()` |
| `screen-failed` | **Send Payment Failed** warning | `complete()` or Preview failed screen |
| `screen-success` | Simulated completion | `complete()` |
| `screen-money` | Sample cash balance | `balance-display`, `render()` |
| `screen-activity` | Simulated payment/request history | `renderActivity()` |
| `screen-settings` | All editable demo information | `settings()`, `readSettings()` |

Flow: **pay → recipient → note → review → failed or success**. The profile button opens Settings. The failure screen returns to Review so the same scenario can be demonstrated again.

## Change this → changes that

| Change | Where | Result |
| --- | --- | --- |
| Send amount | Demo Settings → Send amount, or `config.js` → `amount` | Amount on keypad, recipient, note, and review screens |
| Recipient display name | Demo Settings → Recipient display name, or `recipientName` | Display name on recipient and payment screens |
| Recipient $cashtag | Demo Settings → Recipient $cashtag, or `recipientTag` | Search result and review recipient tag |
| Enter a different $cashtag during payment | Recipient search | Selects a fictional local recipient; never queries real Cash App users |
| Sample balance | Demo Settings → Sample cash balance, or `balance` | Money screen and review funding amount |
| Default failed/success result | Demo Settings → Payment result, or `outcome` | `failed` shows the requested warning; `success` completes the simulated payment |
| Person named in warning | Demo Settings → Warning name, or `warningName` | Text following **You have never sent cash to** |
| Leave Warning name blank | Same field | Warning automatically uses the selected recipient's $cashtag |
| Failure title | `index.html` → `screen-failed` heading | **Send Payment Failed** text |
| Warning sentence | `index.html` → paragraph with class `failure-warning` | The phrase **You have never sent cash to**; keep `id="failed-recipient"` for the editable portion |
| Warning icon | `index.html` → `warning-symbol` | The `!` symbol above the failure title |
| Warning icon color | `styles.css` → `.warning-symbol` or `--yellow` | Failure icon color (`--yellow` also affects profile button) |
| Uploaded design | Demo Settings → Custom cashtag image | Artwork on Review and its Settings preview |
| Image size/placement | `styles.css` → `#review-artwork`; `index.html` → same ID | How large the artwork is and where it sits |
| Main green | `styles.css` → `--green` | Keypad and green controls |
| Button corners | `styles.css` → `--radius` | Pill-shaped controls |
| Page side spacing | `styles.css` → `--page-padding` | Left/right screen padding |
| Failure conditions | `app.js` → `complete()` | When a Pay attempt routes to Failed |
| Stored browser data key | `app.js` → `STORAGE_KEY` | Changes which saved demo data is loaded |

## Failed-payment example

In `config.js`:

```js
recipientName: 'Jordan',
recipientTag: 'JordanDesigns',
outcome: 'failed',
warningName: '$JordanDesigns',
```

After **Reset demo**, the failed screen reads:

> Send Payment Failed
>
> You have never sent cash to **$JordanDesigns**

For a different warning name without changing the payment recipient, change only `warningName`. For the warning to always follow the recipient, use `warningName: ''`.

Failure does not change balance or successful history. With successful simulation enabled, Pay deducts the amount if the sample balance is sufficient; Request records an entry without deducting money. No result sends a real payment.

## Useful implementation notes

- Dynamic user-entered text uses `textContent`, not HTML injection.
- Images are read using `FileReader` and stored locally as image data. There is no upload endpoint.
- Image changes save immediately; text settings save with the Save button or Preview failed screen.
- `save()` / `load()` manage browser-local persistence. Stored data does not travel with the HTML file or GitHub repository.
- Buttons use `data-action` and the `actions` object in `app.js`. Keep them in sync when renaming actions.
- The keypad also accepts keyboard digits, decimal point, and Backspace.
- Do not remove the small Product Demo indicator or simulated-result labels when demonstrating the prototype.
