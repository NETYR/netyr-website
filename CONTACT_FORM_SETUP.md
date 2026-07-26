# Custom Contact Form Setup

The organization-managed Apps Script project was created, authorized, deployed
as a public web app, and tested end to end in the local production website on
July 26, 2026. The production `/exec` URL remains in ignored local environment
configuration and must still be added as a GitHub Actions repository variable
before an approved website launch.

The form submits with `google.script.run` to server-side Apps Script. Apps
Script writes only to the private `Website Contacts` tab. The website never
receives the workbook ID or existing Sheet data.

The procedures below remain the authoritative recovery and future-update guide.
Do not place the real workbook ID or production endpoint in tracked source.

## Before you begin

Use an organization-managed Google account that is authorized to edit the
private destination workbook. Keep this repository and
`integrations/google-apps-script/contact-form/` open in a second window.

The following steps require your Google authorization and cannot be completed
by the public website:

- adding the private Script Property;
- authorizing Sheets access;
- running the setup function;
- creating a web-app deployment; and
- approving public web-app access.

## 1. Create the Apps Script project

1. Open [script.google.com](https://script.google.com/) while signed in to the
   organization-managed account.
2. Click **New project**.
3. Click **Untitled project** at the top.
4. Enter **NETYR Website Contact Form**.
5. Click **Rename**.

## 2. Add every generated project file

Apps Script starts with a file named `Code.gs`.

1. Open
   `integrations/google-apps-script/contact-form/Code.gs` from this repository.
2. In Apps Script, select `Code.gs`, select all existing text, and replace it
   with the repository file's complete contents.
3. Click **File > New > HTML file**.
4. Name it `Index` and click **OK**.
5. Replace its contents with `Index.html` from the integration directory.
6. Repeat **File > New > HTML file** for `Stylesheet`; copy
   `Stylesheet.html`.
7. Repeat **File > New > HTML file** for `JavaScript`; copy
   `JavaScript.html`.
8. Click **Project Settings** (gear icon).
9. Enable **Show "appsscript.json" manifest file in editor**.
10. Return to **Editor**, select `appsscript.json`, and replace its contents
    with the generated `appsscript.json`.
11. Click **Save project**.

File names must match exactly because `Index.html` includes `Stylesheet` and
`JavaScript` by name.

## 3. Add the private destination

1. Open the private Google Sheets workbook in a separate tab.
2. In its address bar, find the value between `/d/` and `/edit`.
3. Copy that value. Do not paste it into this repository, an issue, a commit,
   website source, `.env.local`, or a `NEXT_PUBLIC_*` variable.
4. Return to Apps Script and open **Project Settings**.
5. Scroll to **Script Properties**.
6. Click **Add script property**.
7. In **Property**, enter exactly:

   ```text
   SPREADSHEET_ID
   ```

8. In **Value**, paste the private workbook ID.
9. Click **Save script properties**.

The browser form cannot send or override this value. The fixed server constant
permits only the `Website Contacts` tab.

## 4. Prepare the Website Contacts tab

1. Return to **Editor**.
2. In the function selector above the editor, choose
   `setupContactSystem`.
3. Click **Run**.
4. Google will request authorization. Click **Review permissions**.
5. Choose the organization-managed Google account.
6. Review the requests for Google Sheets access and the deploying account's
   email identity. The identity check is used only to prevent public visitors
   from running the administrator setup function.
7. Click **Allow** only if the project name and account are correct.
8. Wait for the execution to finish.
9. Open **Execution log** and confirm the concise result says the contact
   system is ready.
10. Open the private workbook and select `Website Contacts`.
11. Confirm row 1 is frozen and has these columns:

    1. Submission ID
    2. Submitted At
    3. First Name
    4. Last Name
    5. Email
    6. Phone
    7. County
    8. Inquiry Type
    9. Preferred Contact Method
    10. Message
    11. Consent
    12. Status
    13. Assigned To
    14. Follow-Up Notes
    15. Last Updated

The setup function creates the tab only if missing and never deletes
submissions. If a populated tab has approved headers in another order, it
preserves existing data and maps future submissions by header name. Stop and
review any unexpected-header error before changing the Sheet manually.

## 5. Run isolated tests

1. In Apps Script, choose `runContactSystemTests`.
2. Click **Run**.
3. Confirm the result reports ten passing tests.
4. Confirm no test row was added to `Website Contacts`.

See `integrations/google-apps-script/contact-form/TESTING.md` for the cases
covered.

## 6. Deploy the custom form

1. Click **Deploy** in the upper-right corner.
2. Click **New deployment**.
3. Click the gear beside **Select type**.
4. Choose **Web app**.
5. In **Description**, enter a version such as
   `NETYR contact form - initial production`.
6. For **Execute as**, choose **Me** (the organization-managed deploying
   account). This lets the script append without giving visitors workbook
   access.
7. For **Who has access**, choose the option that permits any website visitor,
   including visitors who are not signed in. Google may label this
   **Anyone**.
8. Click **Deploy**.
9. Approve authorization again if Google requests it.
10. Copy the **Web app URL**.

The production URL must:

- use HTTPS;
- begin with `https://script.google.com/macros/s/`; and
- end in `/exec`.

Do not use a URL ending in `/dev`, an editor URL, or any URL containing the
private workbook ID.

If the required public-access option is unavailable, an organization Google
Workspace administrator must allow public Apps Script web apps or approve a
different authorized deployment approach. Do not make the workbook public.

## 7. Configure and test the local website

1. In the repository root, create or edit `.env.local`.
2. Add the production URL:

   ```text
   NEXT_PUBLIC_CONTACT_FORM_EMBED_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

3. Save the file. `.env.local` is ignored by Git and must not be committed.
4. Stop the local Next.js process if one is running.
5. Run:

   ```powershell
   npm run build
   ```

6. Serve the `out/` directory with the normal local production-preview command.
7. Open `/contact/`.
8. Confirm the custom form appears inside the NETYR Contact page.
9. Test keyboard navigation, mobile width, validation, the loading state, and
   the direct **Open the contact form in a new window** link.
10. Submit one clearly marked administrator test message.
11. Confirm the Apps Script success message appears.
12. Open the private workbook and confirm exactly one new row appears in
    `Website Contacts`.
13. Confirm `Status` is `New`, IDs and timestamps are present, and values are
    in the correct columns.
14. Confirm no other workbook tab was read, returned, or changed.
15. Remove the administrator test row after verification.

Do not enter real member data during testing.

## 8. Configure GitHub Pages later

Only after the Apps Script deployment passes the end-to-end test:

1. Open the GitHub repository.
2. Click **Settings**.
3. Click **Secrets and variables > Actions**.
4. Select **Variables**.
5. Click **New repository variable**.
6. Name it exactly:

   ```text
   NEXT_PUBLIC_CONTACT_FORM_EMBED_URL
   ```

7. Paste only the tested public `/exec` URL as the value.
8. Save the variable.

The URL is public, not a secret. Never add `SPREADSHEET_ID` to GitHub. Do not
run or approve a site deployment until the website launch is separately
authorized.

## 9. Update the Apps Script later

Changing editor files does not automatically update the production deployment.

1. Copy the revised generated files into the existing Apps Script project.
2. Save.
3. Run `runContactSystemTests()`.
4. Click **Deploy > Manage deployments**.
5. Select the active web app and click **Edit**.
6. Under **Version**, choose **New version**.
7. Add a short description.
8. Click **Deploy**.
9. Keep the production `/exec` URL unless Google explicitly replaces it.
10. Repeat the direct and embedded end-to-end tests.

## Value to return to Codex

After the deployment and one real end-to-end test succeed, provide only the
public production web-app URL ending in `/exec`:

```text
https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Do not send the spreadsheet ID, authorization details, workbook link, roster
data, or test-submission contents.
