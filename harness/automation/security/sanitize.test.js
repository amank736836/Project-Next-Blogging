// @vitest-environment node
import { describe, expect, it } from 'vitest';
import sanitizeHtml from '@/lib/sanitize';

describe('stored HTML sanitization', () => {
  it.each([
    '<a href=javascript:alert(1)>link</a>',
    '<a href="jav&#x61;script:alert(1)">link</a>',
    '<a href="java&#x09;script:alert(1)">link</a>',
    '<a href="data:text/html,<script>alert(1)</script>">link</a>',
    '<a href="//untrusted.example">link</a>',
  ])('removes unsafe URL attributes: %s', (html) => {
    expect(sanitizeHtml(html)).toBe('<a>link</a>');
  });

  it('removes active elements, event attributes, styles and srcdoc', () => {
    const html = '<script>alert(1)</script><iframe srcdoc="bad"></iframe>' +
      '<img src="https://example.com/image.png" onerror=alert(1)>' +
      '<p style="background:url(javascript:alert(1))" onclick="bad()">Text</p>';
    expect(sanitizeHtml(html)).toBe('<img src="https://example.com/image.png" /><p>Text</p>');
  });

  it('preserves supported rich text and safe links', () => {
    const html = '<h2>Heading</h2><p><strong>Bold</strong> <em>Italic</em></p>' +
      '<ul><li>Item</li></ul><a href="https://example.com">Link</a>' +
      '<pre><code>&lt;script&gt;</code></pre>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('fails closed for non-string content', () => {
    for (const value of [null, undefined, {}, [], 12]) expect(sanitizeHtml(value)).toBe('');
  });
});
