'use client';
import React, { useState } from 'react';
import { Mail, MessageSquareQuote, Github, MapPin, Send, Check } from 'lucide-react';
import Container from '@/components/container/Container';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Reveal from '@/components/motion/Reveal';
import { DrawSvg } from '@/components/motion/Effects';

const CHANNELS = [
  { Icon: Mail, label: 'hello@framephrase.app', note: 'anything at all', href: 'mailto:hello@framephrase.app' },
  { Icon: MessageSquareQuote, label: 'Feature requests', note: 'we read every one', href: '/features' },
  { Icon: Github, label: '@amank736836', note: 'the source lives here', href: 'https://github.com/amank736836' },
  { Icon: MapPin, label: 'Bengaluru, IN', note: 'GMT+5, mostly awake', href: null },
];

const TOPICS = ['A bug', 'A idea', 'Billing', 'Something else'];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (values.name.trim().length < 2) next.name = 'Tell us who is writing';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) next.email = 'That address will not reach you';
    if (values.message.trim().length < 12) next.message = 'A little more context, please';
    return next;
  };

  // BUG-010 fix: wire the form to /api/contact so messages actually reach the backend.
  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          topic,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong');
      }
      setSent(true);
      setValues({ name: '', email: '', message: '' });
    } catch (err) {
      setErrors({ message: err.message || 'Could not send your message. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative pb-24">
      <PageHeader
        align="center"
        kicker="contact"
        title="Say the quiet part out loud."
        accent="quiet part"
        body="Bugs, ideas, or a photo you think belongs here. One human reads this inbox, usually within a day."
      />

      <Container size="md">
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          {/* channels */}
          <Reveal y={24} className="space-y-3">
            {CHANNELS.map(({ Icon, label, note, href }, i) => {
              const inner = (
                <div className="card group flex items-center gap-3.5 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
                    <Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.95rem] font-semibold text-fg">{label}</span>
                    <span className="block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                      {note}
                    </span>
                  </span>
                </div>
              );
              return href ? (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener" className="block">
                  {inner}
                </a>
              ) : (
                <div key={label} className="block">{inner}</div>
              );
            })}
          </Reveal>

          {/* form / success */}
          <Reveal y={28} delay={0.08}>
            <div className="card relative overflow-hidden p-6 sm:p-8">
              <span aria-hidden className="rule-draw absolute inset-x-6 top-0" />

              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <DrawSvg
                    viewBox="0 0 56 56"
                    play="auto"
                    duration={0.75}
                    stagger={0.25}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-16 w-16 text-accent"
                    aria-hidden
                  >
                    <circle cx="28" cy="28" r="25" stroke="currentColor" opacity="0.35" />
                    <path d="M17 29l7.5 7L39 20" stroke="currentColor" />
                  </DrawSvg>

                  <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-fg">
                    Message sent
                  </h2>
                  <p className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-muted">
                    Thank you for reaching out. A reply usually lands within a day — check
                    the same address you wrote from.
                  </p>
                  <Button
                    className="mt-7"
                    size="md"
                    variant="ghost"
                    onClick={() => setSent(false)}
                    iconLeft={<Send className="h-3.5 w-3.5" />}
                  >
                    Write another
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="field-label !mb-0">I am writing about</span>
                    <div className="ml-auto flex flex-wrap gap-1.5">
                      {TOPICS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          aria-pressed={topic === t}
                          className={`rounded-full border px-3 py-1 text-[0.72rem] font-semibold transition-all duration-300 ${
                            topic === t
                              ? 'border-accent bg-accent/12 text-accent'
                              : 'border-line text-muted hover:border-accent/40 hover:text-fg'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      float
                      label="Your name"
                      value={values.name}
                      onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <Input
                      float
                      label="Email"
                      type="email"
                      value={values.email}
                      onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="field-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="5"
                      value={values.message}
                      onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                      placeholder="What broke, what you wish existed, or the photo you want to send."
                      className={`field resize-y ${errors.message ? 'field-error shake' : ''}`}
                      aria-invalid={errors.message ? 'true' : undefined}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs font-medium text-[#e5484d]">{errors.message}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <Button type="submit" size="lg" loading={busy} iconRight={!busy ? <Check className="h-4 w-4" /> : null}>
                      {busy ? 'Sending' : 'Send message'}
                    </Button>
                    <p className="text-xs leading-relaxed text-faint">
                      No account needed. We keep it in a thread, not a CRM.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
