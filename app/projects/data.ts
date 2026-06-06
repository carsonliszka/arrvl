export interface Project {
  id: string
  number: string
  title: string
  client: string
  year: string
  categories: string[]
  description: string
  services: string[]
  image: string
  url: string
}

export const PROJECTS: Project[] = [
  {
    id: 'redshyft',
    number: '01',
    title: 'Redshyft',
    client: 'NoFlipGang',
    year: '2026',
    categories: ['Motion', 'Brand', 'Digital'],
    description:
      'A launch site and content hub for a video-editing collective. Boot-sequence motion, neon-on-chrome, system-terminal type.',
    services: ['Brand identity', 'Web design', 'Motion'],
    image: '/projects/redshyft.png',
    url: 'https://redshyft-green.vercel.app',
  },
  {
    id: 'black-wing-squadron',
    number: '02',
    title: 'Black Wing Squadron',
    client: 'Black Wing Squadron',
    year: '2026',
    categories: ['Digital', 'Brand', 'Community'],
    description:
      'Faction identity and recruitment platform for a Star Citizen squadron. Classified-file aesthetics with fleet operations front and center.',
    services: ['Identity', 'Web platform', 'Community'],
    image: '/projects/black-wing-squadron.png',
    url: 'https://blackwing-org.vercel.app',
  },
  {
    id: 'cta',
    number: '03',
    title: 'CTA',
    client: 'CTA Inc.',
    year: '2026',
    categories: ['Digital', 'Brand'],
    description:
      'Corporate site for a defense electronic-warfare manufacturer. Institutional precision over four decades of mission-critical systems.',
    services: ['Web design', 'Development', 'Content'],
    image: '/projects/cta.png',
    url: 'https://cta-sigma.vercel.app',
  },
  {
    id: 'liszka-construction',
    number: '04',
    title: 'Liszka Construction',
    client: 'Liszka Construction Group',
    year: '2026',
    categories: ['Brand', 'Web'],
    description:
      'Brand and marketing site for a Southern California custom-home builder. Built-right confidence, transparent process, and a project portfolio.',
    services: ['Brand identity', 'Web design', 'Development'],
    image: '/projects/liszka-construction.png',
    url: 'https://liszkaconstruction.com',
  },
]
