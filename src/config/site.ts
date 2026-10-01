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
}

export const site: SiteConfig = {
  name: 'William Chan Wing Hong',
  shortName: 'William Chan',
  headline: 'I build things for the web.',
  tagline:
    "I'm a developer and Swinburne Computer Science grad. This is my little corner of the internet — what I'm working on, what I've made, and what I'm into.", // TODO

  photo: null, // TODO: drop a photo in /public and put its path here, e.g. '/me.jpg'
  about: [
    "I'm William. I like building things, experimenting with new tech, and turning random ideas into something that actually works.", // TODO
    'Most of my projects start with a simple “wouldn’t it be cool if…” — this is where I keep track of what I’m building, learning, and messing around with.', // TODO
  ],
  facts: {
    Currently: 'Building side projects & learning Astro', // TODO
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
    Strava: 'https://www.strava.com/athletes/185667676', // TODO — empty hides it
  },

  cv: null, // e.g. '/William-Chan-CV.pdf' (put the PDF in /public)
};

/** Helpers used by components */
export const firstName = site.shortName.split(' ')[0];
export const initials = site.shortName
  .split(' ')
  .slice(0, 2)
  .map((word) => word[0])
  .join('');
export const activeSocials = Object.entries(site.socials).filter(([, url]) => url !== '');
