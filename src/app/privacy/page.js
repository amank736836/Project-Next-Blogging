'use client';
import React from 'react';
import LegalLayout from '@/components/ui/LegalLayout';
import Button from '@/components/Button';

const SECTIONS = [
  {
    id: 'collect',
    heading: 'What we collect',
    paragraphs: [
      'Only what a shelf of writing needs: your name and email from Clerk, the posts you publish, and the images you upload. No behavioural profiles, no ad identifiers, no keyboard logging.',
    ],
    list: [
      'Account details — name, email, avatar, from your Clerk session',
      'Content — title, slug, body and featured image of each post',
      'Uploads — images stored with Cloudinary, referenced by URL',
      'Anonymous traffic counts — pages hit, no cross-site fingerprinting',
    ],
  },
  {
    id: 'use',
    heading: 'How we use it',
    paragraphs: [
      'To render your archive, keep drafts private, and answer you when you write to us. We do not sell personal data, and we do not train models on your prose. Your words stay yours in every sense the law allows.',
    ],
  },
  {
    id: 'security',
    heading: 'How it is protected',
    paragraphs: [
      'Authentication and sessions are handled by Clerk, including two-factor. Transport is HTTPS everywhere, the database is access-restricted to the application, and image URLs are unguessable rather than sequential. Editors may only modify their own posts.',
    ],
  },
  {
    id: 'third-parties',
    heading: 'The three parties involved',
    paragraphs: [
      'We deliberately keep this list short. Each one has its own privacy policy, and each one is only there because you opted into the feature it powers.',
    ],
    list: [
      'Clerk — sign-in, sessions, user management',
      'Cloudinary — image upload, transformation, delivery',
      'MongoDB Atlas — where your posts are stored',
    ],
  },
  {
    id: 'rights',
    heading: 'Your rights, in practice',
    paragraphs: [
      'Export, correct or delete: all three are one click in the editor or one email away. Deleting a post removes it from the database and the archive immediately; cached copies fall off within a day. Ask for account deletion and Clerk forgets you too.',
    ],
  },
  {
    id: 'changes',
    heading: 'If this changes',
    paragraphs: [
      'Material changes get an email before they take effect, and this page keeps its date in the header. Minor clarifications may not be announced — we will try to be boring about it and honest about the difference.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      kicker="privacy"
      title="What we know about you is short enough to print on one page."
      updated="February 15, 2026"
      intro="The plain-English version is below, and it is the version we actually follow. Where the two disagree, the shorter one wins."
      sections={SECTIONS}
      aside={
        <>
          <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
            Want a copy of your data?
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            Log in and read your shelf — everything we hold is right there. For the raw
            records, write to us and we will send them as JSON.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button href="/contact" size="sm" variant="primary">
              Request an export
            </Button>
            <Button href="/terms" size="sm" variant="ghost">
              Read the terms
            </Button>
          </div>
        </>
      }
    />
  );
}
