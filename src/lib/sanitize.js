import sanitize from "sanitize-html";

/**
 * Parse HTML rather than trying to remove dangerous markup with regexes.
 * An explicit allowlist protects stored content, including encoded/unquoted
 * URLs and malformed tags. Browser-side DOMPurify remains defence in depth.
 * Active embeds, inline styles, SVG and data URLs are deliberately unsupported.
 */
export function sanitizeHtml(html) {
    if (typeof html !== "string") return "";

    return sanitize(html, {
        allowedTags: [
            "p", "br", "hr", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6",
            "strong", "b", "em", "i", "u", "s", "del", "sub", "sup",
            "blockquote", "pre", "code", "ul", "ol", "li", "a", "img",
            "figure", "figcaption", "table", "thead", "tbody", "tfoot", "tr", "th", "td",
        ],
        allowedAttributes: {
            a: ["href", "title"],
            img: ["src", "alt", "title", "width", "height"],
            ol: ["start", "reversed"],
            li: ["value"],
            th: ["colspan", "rowspan", "scope"],
            td: ["colspan", "rowspan"],
        },
        allowedSchemes: ["https", "http", "mailto"],
        allowedSchemesByTag: { img: ["https", "http"] },
        allowProtocolRelative: false,
    });
}

export default sanitizeHtml;
