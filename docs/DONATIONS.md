# Setting up the PayPal donation button

RunZones Lab uses a plain **link** to PayPal. It does not load PayPal's scripts, never sees payment details, and unlocks nothing for donors. The whole setup is: get a PayPal link, then give it to the site in one setting, `VITE_PAYPAL_DONATION_URL`. There are no passwords or secrets involved, and the link is public by nature.

## 1. Choose the kind of PayPal link

| | **A. PayPal Donate link** (recommended) | **B. PayPal.Me link** |
| --- | --- | --- |
| Account needed | A PayPal **Business** account is the full-featured route (free to open or to upgrade to). PayPal also lets a personal account create a Donate button, with limited features. | Any PayPal account. |
| Made for | Donations. | Getting paid by anyone: friends, family or customers. |
| Looks like | `https://www.paypal.com/donate/?hosted_button_id=XXXXXXXX` | `https://www.paypal.me/YourName` |
| Watch out for | Fees on received money (see below). | PayPal asks you to choose **Personal** (friends and family) or **Commercial** use. Its terms say a Personal link may not be used to receive payments for commercial purposes, and PayPal may reclassify the link and charge fees retroactively. A Business account's PayPal.Me link accepts goods-and-services payments only. The public PayPal.Me page shows your name and profile picture. |

**Recommendation: use option A.** A donation to a website project is neither a payment between friends nor a sale, which is exactly the gap PayPal's Donate buttons exist to fill. If you are unsure which applies to you, ask PayPal support before going live.

Two things this guide cannot decide for you:
- **Fees.** PayPal charges fees on money you receive, and reduced charity rates apply only to confirmed charities. Check PayPal's current fee page for your country.
- **Tax.** Donations to an individual or a small project are generally not tax-deductible for the donor and may count as income for you. This is not tax advice: check the rules where you live.

Availability of Donate buttons and the exact menu names depend on your country and change over time, so follow what PayPal shows you.

## 2. Create the link

### Option A: Donate link
1. Sign in to PayPal (or create a Business account: sign up and choose *Business*, or upgrade your personal account in its settings).
2. Open **paypal.com/donate/buttons** and sign in. Create a new button or campaign, name it *RunZones Lab*, and choose the options you want (for example suggested amounts or one-time versus recurring).
3. PayPal then shows button code and, usually, a **link** and a QR code. **Copy the link**, the web address that starts with `https://www.paypal.com/donate/`. You do not need the HTML or script code.
   - With a Business account the link contains a `hosted_button_id`. With a personal account PayPal uses a `business` value instead.
   - Prefer a link that does not show your email address, to avoid spam.
4. Paste the link into a private browser window to check that PayPal's page opens with your project's name.

### Option B: PayPal.Me link
1. Go to **paypal.com/paypalme**, sign in, and choose your link name.
2. Choose Personal or Commercial use as described above.
3. Copy the link, for example `https://www.paypal.me/YourName`.

The site accepts any `https` link on `paypal.com` or `paypal.me` (including their sub-domains). It does not accept links to other sites.

## 3. Give the link to the site

### On your computer (to test)
In the project folder, in PowerShell (one line):

```powershell
Set-Content -Path .env.local -Value "VITE_PAYPAL_DONATION_URL=https://www.paypal.com/donate/?hosted_button_id=YOUR_ID"
```

Then:
1. Stop the dev server (Ctrl+C) and start it again with `npm run dev`. Vite reads this setting only when it starts.
2. Open `/about`. The **Donate via PayPal** button should now be active and the footer shows **Support RunZones Lab via PayPal**. Both open PayPal in a new tab.
3. Run `npm run preflight`. It checks the link and warns if it is missing, rejected, or still a sandbox (test) link.
4. If the button stays disabled, open the browser console (F12). The site prints the exact reason the link was rejected.

`.env.local` is ignored by Git, so it is never uploaded.

To run the donation tests: `$env:VITE_PAYPAL_DONATION_URL = "your link"; npm run test:e2e`.

### Testing safely before going live
PayPal provides a sandbox at **sandbox.paypal.com** with test accounts. A sandbox link such as `https://www.sandbox.paypal.com/donate/?hosted_button_id=TEST123` is accepted by the site, so you can test the full flow with fake money. `npm run preflight` reminds you to swap in the live link.

### On the live site (Vercel)
The setting must also exist on Vercel, because `.env.local` stays on your computer.
1. Vercel dashboard, your project, **Settings**, **Environment Variables**.
2. Name `VITE_PAYPAL_DONATION_URL`, value your **live** link. Tick Production (and Preview if you want it there). Save.
3. **Redeploy** (Deployments, the latest deployment, Redeploy). Vite bakes the value into the site when it builds, so a change only appears after a new deployment.
4. Open the live `/about` page, click the button, and check that it opens your PayPal page. If you can, have a friend make a small real donation to confirm it reaches your account (you cannot donate to yourself).

To change the link later, edit the value on Vercel and redeploy.

## 4. What the site does and does not do

- The button opens PayPal's own page in a new tab. The site sends nothing to PayPal and loads no PayPal scripts.
- No calculator or article is ever restricted. Donating unlocks nothing.
- Until a valid link is configured, the button is disabled and says so. Nothing links to PayPal.
- Never put a PayPal **client secret**, API key or password in any setting of this project. Only the public link is needed.

## 5. Troubleshooting

| Problem | Likely cause |
| --- | --- |
| Button is disabled locally | `.env.local` not created in the project root, dev server not restarted, or the link was rejected (see the console message). |
| Works locally but disabled on the live site | The variable is not set on Vercel, or you did not redeploy after adding it. |
| Console says "not a PayPal domain" | The link is not on paypal.com or paypal.me. |
| Console says "not a valid web address" | The `https://` at the start is missing, or there is a stray space or quote. |
| PayPal's page says the button or link is not found | The `hosted_button_id` was mistyped, or the button was deleted or created in sandbox but used on live. |
