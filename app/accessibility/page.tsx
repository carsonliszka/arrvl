import { LegalPage } from '../components/legal-page'

export const metadata = {
  title: 'Accessibility · ARRVL',
  description:
    'ARRVL Studio’s commitment to making our website accessible and usable for as many people as possible.',
}

export default function AccessibilityPage() {
  return <LegalPage file="legal/arrvl-accessibility.md" />
}
