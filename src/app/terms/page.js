'use client';
import React from 'react';
import LegalLayout from '@/components/ui/LegalLayout';
import Button from '@/components/Button';

const SECTIONS = [
  {
    id: 'accept',
    heading: 'Accepting these terms',
    paragraphs: [
      'By creating an account or publishing anything on Frame & Phrase you agree to these terms. If you cannot agree with them, the honest move is to not sign up — we would rather lose the visit than argue later.',
    ],
  },
  {
    id: 'accounts',
    heading: 'Your account',
    paragraphs: [
      'You are responsible for everything that happens under your sign-in. Keep your Clerk session and two-factor to yourself. If you find someone else writing as you, tell us and we will lock the shelf while we sort it out.',
    ],
    list: [
      'One human or one newsroom per account',
      'No shared logins sold around',
      'Tell us promptly about a compromise',
    ],
  },
  {
    id: 'ownership',
    heading: 'Who owns the writing',
    paragraphs: [
      'You do. Every sentence and every frame. By publishing you grant us only the licence we need to do the job: store it, show it to readers, render thumbnails, and back it up. Revoke it any time by deleting the post.',
    ],
  },
  {
    id: 'conduct',
    heading: 'What will not be tolerated',
    paragraphs: [
      'This is a quiet place by design. We remove content and, when needed, accounts, without a debate when any of the following shows up.',
    ],
    list: [
      'Unlawful material, or material that endangers a person',
      'Harassment, hate, or targeted abuse',
      'Work you do not have the right to publish',
      'Spam, scams, or automated posting designed to game reach',
      'Attempts to break, scrape or overload the platform',
    ],
  },
  {
    id: 'service',
    heading: 'Availability and changes',
    paragraphs: [
      'The service is offered as-is and as-available. We will try to tell you before maintenance, and we may change features, pricing or limits as the product grows — the free tier will stay free, but we cannot promise the exact shape of it forever.',
    ],
  },
  {
    id: 'liability',
    heading: 'Limits of our liability',
    paragraphs: [
      'To the extent the law allows, we are not liable for lost profits or for content deleted after an account is closed. If something goes wrong on our side, our responsibility is capped at what you paid us in the twelve months before it happened — and on the free tier, that is a heartfelt apology.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      kicker="terms"
      title="The rules of the shelf."
      updated="February 15, 2026"
      intro="Short enough to read, written to be read. These terms exist so that both sides know what to expect when something goes wrong."
      sections={SECTIONS}
      aside={
        <>
          <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
            Something here is unclear?
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            That is a bug in the writing, not in the reading. Tell us which line and we will
            rewrite it.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button href="/contact" size="sm" variant="primary">
              Ask us a question
            </Button>
            <Button href="/privacy" size="sm" variant="ghost">
              Read the privacy policy
            </Button>
          </div>
        </>
      }
    />
  );
}
