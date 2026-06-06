import { LegalPage } from '../components/legal-page'

export const metadata = {
  title: 'Privacy Policy · ARRVL',
  description:
    'How ARRVL Studio collects, uses, shares, and protects your information.',
}

export default function PrivacyPolicyPage() {
  return <LegalPage file="legal/arrvl-privacy-policy.md" />
}
