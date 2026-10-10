import DemoPreview from '@/components/demo/DemoPreview';

export const metadata = {
  title: 'Design preview',
  description:
    'Component and layout preview rendered from fixture data — no database attached.',
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return <DemoPreview />;
}
