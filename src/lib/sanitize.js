/**
 * Server-side HTML sanitisation for post content (defence in depth).
 *
 * The authoritative sanitisation happens at render time in the browser with
 * DOMPurify (see `src/app/post/[slug]/page.js`). This module is the
 * write-time layer: it strips the obviously dangerous constructs before they
 * ever reach the database, so stored content is safer everywhere it appears
 * (previews, RSS-like consumers, future server renderers).
 *
 * Regex sanitisation is inherently best-effort — it exists to shrink the
 * attack surface, not to be the last line of defence. Known weaknesses of the
 * previous inline version that this one closes:
 *
 *   - slash-delimited event handlers:      <svg/onload=alert(1)>
 *   - whitespace before a scheme in URLs:  href=" javascript:..."
 *   - vbscript:/data:text/html schemes
 *   - <style>, <svg>, <math>, <template>, <link>, <meta>, <base> elements
 *   - unclosed <script> tags
 */

const DANGEROUS_PAIRED = ["script", "style", "template", "svg", "math", "iframe", "object", "embed", "form"];
const DANGEROUS_VOID = ["link", "meta", "base"];

export function sanitizeHtml(html) {
    if (!html || typeof html !== "string") return html;

    let clean = html;

    // Paired dangerous elements, then any unclosed/self-closing leftovers.
    for (const tag of DANGEROUS_PAIRED) {
        clean = clean.replace(new RegExp(`<${tag}\\b[\\s\\S]*?<\\/${tag}\\s*>`, "gi"), "");
        clean = clean.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
        clean = clean.replace(new RegExp(`<\\/${tag}\\s*>`, "gi"), "");
    }
    for (const tag of DANGEROUS_VOID) {
        clean = clean.replace(new RegExp(`<${tag}\\b[^>]*\\/?>`, "gi"), "");
    }

    // Event-handler attributes. `[\s/]` also catches <svg/onload=...>, where
    // the slash plays the role of whitespace. Quoted and unquoted values.
    clean = clean.replace(/[\s/]on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, " ");

    // Dangerous URL schemes in URL-bearing attributes. Tolerates whitespace
    // (browsers strip it when resolving URLs) between the quote and scheme.
    clean = clean.replace(
        /(href|src|action|formaction|xlink:href)\s*=\s*(["'])\s*(javascript|vbscript)\s*:/gi,
        "$1=$2#"
    );
    // data: is only dangerous as a navigable/document type; keep data: images.
    clean = clean.replace(
        /(href|src|action|formaction)\s*=\s*(["'])\s*data\s*:\s*text\/html/gi,
        "$1=$2#"
    );

    return clean;
}

export default sanitizeHtml;
