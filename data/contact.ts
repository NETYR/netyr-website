export const contactConfig = {
  contactFormEmbedUrl:
    process.env.NEXT_PUBLIC_CONTACT_FORM_EMBED_URL?.trim() ?? "",
} as const;

export function isAppsScriptContactFormUrl(value: string) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "script.google.com" &&
      /^\/macros\/s\/[^/]+\/exec\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}
