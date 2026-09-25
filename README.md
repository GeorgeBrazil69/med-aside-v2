# Cash Demo — standalone HTML

A local, interactive product demonstration modeled on the supplied Cash App screenshots. No framework, package installation, CDN, login, payment API, analytics, or external server is required. All payments are simulated. This is a product prototype, not an official Cash App application.

## Open it

**One file:** Download `cash-demo-standalone.html` and open it in a browser. It contains its own CSS and JavaScript. No internet connection is required after downloading it.

**Editable source:** Download and extract `cash-demo.zip`, then open `index.html`. Keep `styles.css`, `config.js`, and `app.js` beside it. Do not open the HTML inside the unextracted ZIP.

GitHub stores the source; this project does **not** enable GitHub Pages or deploy a website. The old Superdesign preview is not used by this version.

## Use the demo

1. Tap the yellow profile button to open **Demo Settings**.
2. Set the recipient name, $cashtag, amount, sample balance, and payment result.
3. For the requested warning, choose **Show Send Payment Failed**. Set **Warning name**, or leave it blank to use the recipient's $cashtag.
4. Optionally choose a PNG, JPG, or WebP image under 3 MB. It appears on the review screen.
5. Save. Enter an amount on the keypad → Pay → select the recipient → add a note → Review → Pay.
6. The failed result displays **Send Payment Failed** and **You have never sent cash to [editable name]**. It does not deduct money or add a successful activity entry.
7. Choose **Show simulated success** to demonstrate a successful payment. Requests create a pending-style simulated activity and do not deduct the balance.

Settings are saved to this browser's local storage where available. They are not uploaded or synced. Opening the app from a different path, browser, or device can create a separate set of settings. File-opening behavior and storage support vary on phones; use the local-network option below if the phone's file viewer does not run JavaScript.

## Open on your phone without third-party hosting

The most reliable option is to serve the folder from your own computer while your phone is on the same local network:

```bash
cd med-aside-v2
python3 -m http.server 8080 --bind 0.0.0.0
```

Find your computer's local Wi-Fi IP address in its network settings. On your phone, open `http://YOUR-COMPUTER-IP:8080` in Safari or Chrome. For example, `http://192.168.1.25:8080` if that is your computer's actual address. Keep the computer and server running. Stop it with Ctrl+C. `localhost` on your phone refers to the phone, not your computer.

For Chromebook Linux, forward port 8080 to the Linux environment in ChromeOS settings if needed. The server exposes the contents of the current folder on your network, so run it from this project folder. This is local hosting on your own device, not a company-hosted preview.

You can also transfer `cash-demo-standalone.html` directly to the phone and open it in a browser that supports local HTML scripts. Some phone file previewers display HTML without running its JavaScript. A browser shortcut can be added through the phone's share/menu options when supported; this project does not include an installable offline PWA.

## Edit it

See **[EDITING-GUIDE.md](EDITING-GUIDE.md)** for the screen map and “change this → changes that” tables.

After source edits, rebuild the single-file copy and ZIP:

```bash
python3 build.py
```

No real purchase flow is implemented. The artwork upload demonstrates where a purchased design could appear. Pool and scanning are clearly identified placeholders. Custom artwork placement remains editable in the HTML/CSS.
