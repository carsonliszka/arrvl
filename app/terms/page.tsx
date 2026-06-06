import { LegalPage } from '../components/legal-page'

export const metadata = {
  title: 'Terms of Use · ARRVL',
  description:
    'The terms that govern your access to and use of ARRVL Studio’s website and services.',
}

export default function TermsPage() {
  return <LegalPage file="legal/arrvl-terms-of-use.md" />
}
