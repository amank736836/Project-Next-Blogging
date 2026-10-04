'use client';
import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

/**
 * TinyMCE, tuned down to what a writer uses. The editor body is styled to
 * match the published article so what you see is what readers get.
 */
export default function RTE({ name, control, label, defaultValue = "" }) {
    return (
        <div className='w-full'>
            {label && <label className='field-label'>{label}</label>}

            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        initialValue={defaultValue}
                        init={{
                            initialValue: defaultValue,
                            height: 520,
                            menubar: true,
                            branding: false,
                            promotion: false,
                            statusbar: true,
                            resize: 'both',
                            convert_urls: false,
                            end_container_on_empty_block: true,
                            powerpaste_word_import: 'clean',
                            default_link_target: '_blank',
                            placeholder: 'Start with the sentence you keep re-typing…',
                            plugins: [
                                "advlist", "autolink", "lists", "link", "image", "charmap",
                                "preview", "anchor", "searchreplace", "visualblocks", "code",
                                "fullscreen", "insertdatetime", "media", "table", "help", "wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | image media | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | blockquote code | hr link | removeformat help",
                            toolbar_mode: 'sliding',
                            content_style: `
                body {
                  font-family: Inter, 'Inter Variable', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.8;
                  color: #16283c;
                  max-width: 46rem;
                  margin-inline: auto;
                  padding-inline: 0.5rem;
                }
                body.dark-content { color: #dfe9f4; }
                body h1, body h2, body h3 { font-family: Fraunces, Georgia, serif; letter-spacing: -0.02em; line-height: 1.2; }
                body h1 { font-size: 2rem; } body h2 { font-size: 1.6rem; } body h3 { font-size: 1.3rem; }
                body p { margin-block: 0.9em; }
                body blockquote { border-left: 2px solid #22c6ea; margin-left: 0; padding-left: 1rem; font-family: Fraunces, Georgia, serif; font-style: italic; }
                body img { border-radius: 12px; max-width: 100%; }
                body a { color: #08a8ce; }
                body ::selection { background: rgba(34,198,234,.28); }
              `,
                            body_class: 'fp-editor-body',
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
        </div>
    )
}
