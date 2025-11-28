// Centralized configuration - prevents regenerating constants
export const siteConfig = {
  name: 'Web Design Initiative',
  tagline: 'Professional Websites. Student Prices.',
  description: 'High-quality web design and development services at affordable rates. We empower students, nonprofits, and small businesses with professional online presence.',
  url: 'https://webdesigninitiative.org',

  contact: {
    email: 'hello@webdesigninitiative.org',
    phone: '+1 (555) 123-4567',
    responseTime: 'Within 24 hours',
    address: 'Remote-first team serving clients nationwide'
  },

  team: [
    {
      name: 'Alex Johnson',
      role: 'Founder & Lead Developer',
      bio: 'Full-stack developer with 5+ years of experience building modern web applications.',
      image: '/images/team/alex.svg',
      linkedin: 'https://linkedin.com/in/alexjohnson'
    },
    {
      name: 'Sarah Chen',
      role: 'UI/UX Designer',
      bio: 'Passionate about creating beautiful, accessible user experiences that drive results.',
      image: '/images/team/sarah.svg',
      linkedin: 'https://linkedin.com/in/sarahchen'
    },
    {
      name: 'Marcus Williams',
      role: 'Project Manager',
      bio: 'Ensuring every project is delivered on time, on budget, and exceeds expectations.',
      image: '/images/team/marcus.svg',
      linkedin: 'https://linkedin.com/in/marcuswilliams'
    }
  ],

  pricing: {
    student: { price: 5, name: 'Student Plan' },
    business: { price: 10, name: 'Business Plan' },
    premium: { price: 20, name: 'Premium Plan' }
  },

  features: [
    { title: 'Custom Design', icon: 'PaintBrushIcon' },
    { title: 'Mobile Responsive', icon: 'DevicePhoneMobileIcon' },
    { title: 'Fast Delivery', icon: 'BoltIcon' },
    { title: 'SEO Optimized', icon: 'MagnifyingGlassIcon' },
    { title: 'Full Hosting', icon: 'ServerIcon' },
    { title: 'Ongoing Support', icon: 'LifebuoyIcon' }
  ],

  testimonials: [
    {
      name: 'Sarah Johnson',
      company: 'CPFA',
      role: 'Executive Director',
      quote: 'WDI transformed our online presence completely. Their team delivered a professional, modern website that perfectly represents our mission. The value is unmatched.',
      avatar: '/images/testimonials/sarah.svg',
      rating: 5
    },
    {
      name: 'Mike Chen',
      company: 'DHS CS Club',
      role: 'President',
      quote: 'As a student organization, we needed a professional site without breaking the bank. WDI delivered exactly what we needed with incredible turnaround time.',
      avatar: '/images/testimonials/mike.svg',
      rating: 5
    },
    {
      name: 'Priya Patel',
      company: 'Anushma LLC',
      role: 'Founder & CEO',
      quote: 'Fast, responsive, and exactly what we needed. The team really understands small business needs and delivers results that drive real growth.',
      avatar: '/images/testimonials/priya.svg',
      rating: 5
    }
  ],

  clients: [
    { name: 'CPFA', logo: '/logos/cpfa.svg' },
    { name: 'DHS CS Club', logo: '/logos/dhs.svg' },
    { name: 'Anushma LLC', logo: '/logos/anushma.svg' }
  ],

  process: [
    {
      step: 1,
      title: 'Consultation',
      description: 'We discuss your needs and vision for the perfect website.'
    },
    {
      step: 2,
      title: 'Design & Build',
      description: 'Our team creates your custom site with modern technologies.'
    },
    {
      step: 3,
      title: 'Launch',
      description: 'We deploy your site and provide ongoing support.'
    }
  ]
} as const

export type SiteConfig = typeof siteConfig
