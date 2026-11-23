/**
 * ✏️ EDIT ME — all the text on the homepage lives here.
 * Projects live in src/content/projects/ (one Markdown file each).
 *
 * TypeScript tip: the `SiteConfig` type below describes the shape of this object.
 * If you mistype a key or forget one, your editor (and `npm run build`) will flag it.
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  headline: string;
  tagline: string;
  photo: string | null; // path in /public, e.g. '/me.jpg'
  about: string[];
  facts: Record<string, string>; // empty values are hidden
  interests: string[];
  toolkit: Record<string, string[]>;
  email: string;
  socials: Record<string, string>; // empty values are hidden
  cv: string | null;
  /** The big statement section. Words wrapped in *stars* are set in the blue serif. */
  statement: string;
  /** Closing line at the foot of the page. */
  slogan: string;
  /**
   * Photos for the "life" collage. Leave `src` as null to show a placeholder;
   * drop the photo in /public and put its path in, e.g. '/life/kl.jpg'.
   * `shape` sets the frame: 'tall' for portrait photos, 'square', or 'wide' for landscape.
   */
  gallery: { src: string | null; alt: string; caption: string; shape: 'tall' | 'square' | 'wide' }[];
  studio: {
    name: string;
    url: string;
    enquireUrl: string; // where project enquiries should go
    role: string;
    intro: string[];
    facts: Record<string, string>;
    services: string[];
    concepts: { name: string; note: string; url: string }[]; // design concepts I helped with
  };
}

export const site: SiteConfig = {
  name: 'William Chan Wing Hong',
  shortName: 'William Chan',
  headline: 'I build things for the web.',
  tagline:
    "Co-founder & CEO of Nextform Studios. Here's what I've been building.",

  photo: '/william.jpg',
  about: [
    "I'm William. I like building things, experimenting with new tech, and turning random ideas into something that actually works.", // TODO
    'Most of my projects start with a simple “wouldn’t it be cool if…” — this is where I keep track of what I’m building, learning, and messing around with.', // TODO
  ],
  facts: {
    Currently: 'Building Nextform Studios',
    'Based in': 'Kuala Lumpur', // TODO e.g. 'Kuala Lumpur'
    Studied: 'Computer Science, Swinburne University',
  },
  interests: ['Coding', 'Tech', 'Sports', 'Building'], // TODO

  toolkit: {
    Frontend: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Astro'],
    Backend: ['PHP', 'MySQL', 'REST APIs'],
    Tools: ['Git & GitHub', 'Linux', 'VS Code', 'Figma'], // TODO
  },

  email: 'williamchan388@gmail.com', // TODO: a real inbox
  socials: {
    GitHub: 'https://github.com/williamchan24', // TODO
    LinkedIn: 'https://www.linkedin.com/in/william-chan-wing-hong/', // TODO
  },

  cv: null, // e.g. '/William-Chan-CV.pdf' (put the PDF in /public)

  // TODO: say it in your own words; *starred* words turn blue and serif
  statement: 'Turning *random* ideas into software that actually *works*, for clients, for friends, and sometimes just because I *can*.',
  slogan: 'Always building the next thing.',

  gallery: [
    { src: '/life/uni-graduation.jpg', alt: 'William in his graduation gown holding flowers by a bridge in Melbourne', caption: 'Graduation, Melbourne, Apr 2025', shape: 'tall' },
    { src: '/life/work-desk.jpg', alt: 'A desk with a laptop showing code, an iced kopi and the KL skyline out the window', caption: 'Kuala Lumpur', shape: 'tall' },
    { src: '/life/travel-sydney.jpg', alt: 'William smiling in front of the Sydney Opera House', caption: 'Sydney, Sep 2023', shape: 'square' },
    { src: '/life/sport-hyrox.jpg', alt: 'William carrying two 24 kg kettlebells during a HYROX race', caption: 'HYROX, Dec 2025', shape: 'tall' },
  ],

  // The "Now building" section. Project enquiries are sent to the studio, not this site.
  studio: {
    name: 'Nextform Studios',
    url: 'https://www.nextformstudios.dev/',
    enquireUrl: 'https://www.nextformstudios.dev/contact/',
    role: 'Co-founder & CEO',
    intro: [
      "I'm the co-founder and CEO of Nextform Studios, a two-person software studio in Kuala Lumpur. We design and build websites, business systems and apps for Malaysian businesses.",
      // TODO: rewrite in your own words if you like
      'A lot of businesses still run on WhatsApp threads, spreadsheets and tools that almost fit. Nextform exists to build the software they actually need, and to stay on and look after it after launch.',
    ],
    facts: {
      Role: 'Co-founder & CEO',
      Based: 'Kuala Lumpur',
      Stage: 'Early days, first client on board',
    },
    services: ['Websites', 'Web systems', 'Mobile apps', 'Payments', 'Custom software', 'POS & inventory'],
    concepts: [
      {
        name: "Francesco's Barber Club",
        note: 'Design concept', // TODO: one line on what you designed
        url: 'https://www.nextformstudios.dev/portfolio/#francescos',
      },
      {
        name: 'DNA Tuning Malaysia',
        note: 'Design concept', // TODO: one line on what you designed
        url: 'https://www.nextformstudios.dev/portfolio/#dna-tuning',
      },
    ],
  },
};

/** Helpers used by components */
export const firstName = site.shortName.split(' ')[0];
export const initials = site.shortName
  .split(' ')
  .slice(0, 2)
  .map((word) => word[0])
  .join('');
export const activeSocials = Object.entries(site.socials).filter(([, url]) => url !== '');
