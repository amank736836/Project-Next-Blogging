'use client';
import { SignUp } from '@clerk/nextjs';
import AuthShell from '@/components/AuthShell';

const appearance = {
  variables: {
    colorPrimary: 'var(--accent)',
    colorText: 'var(--fg)',
    colorTextSecondary: 'var(--fg-muted)',
    colorBackground: 'var(--surface-1)',
    colorInputBackground: 'var(--surface-2)',
    colorInputText: 'var(--fg)',
    colorShade: 'var(--color-ink-900)',
    borderRadius: '0.85rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
  },
  elements: {
    card: 'shadow-none border-0 bg-transparent',
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none',
    footer: 'hidden',
    formButtonPrimary:
      'font-semibold shadow-none transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]',
    socialButtonsBlockButton: 'transition-transform duration-300 hover:-translate-y-0.5',
    dividerLine: 'bg-line',
  },
};

function Signup() {
  return (
    <AuthShell mode="signup">
      <div className="clerk-card p-1">
        <SignUp
          routing="hash"
          signInUrl="/login"
          appearance={appearance}
        />
      </div>
    </AuthShell>
  );
}

export default Signup;
