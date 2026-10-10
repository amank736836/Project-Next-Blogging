'use client';
import { SignIn } from '@clerk/nextjs';
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
    formFieldInput: 'transition-shadow duration-300',
    socialButtonsBlockButton: 'transition-transform duration-300 hover:-translate-y-0.5',
    dividerLine: 'bg-line',
    formFooter: 'text-xs',
  },
};

function Login() {
  return (
    <AuthShell mode="signin">
      <div className="clerk-card p-1">
        <SignIn
          routing="hash"
          signUpUrl="/signup"
          appearance={appearance}
        />
      </div>
    </AuthShell>
  );
}

export default Login;
