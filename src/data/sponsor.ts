/**
 * Shared content for the sponsor page variants.
 *
 * Every number and post here was verified against the live public profiles
 * on 2026-08-21. To feature different X posts, replace entries in `xPosts`
 * with the real text/metrics and paste the exact status permalink into `url`.
 */

export interface XPost {
  author: string;
  handle: string;
  /** Filename under src/img/people/, or null to use the show artwork. */
  avatar: string | null;
  date: string;
  text: string;
  replies?: string;
  reposts?: string;
  likes?: string;
  views: string;
  url: string;
}

export const xPosts: Array<XPost> = [
  {
    author: 'Whiskey Web and Whatnot',
    handle: 'whiskeywebfm',
    avatar: null,
    date: 'Dec 29, 2023',
    text: 'Are you team inferred types or team explicit types? @kenwheeler knows where he stands.',
    replies: '6',
    reposts: '12',
    likes: '178',
    views: '284.8K',
    url: 'https://x.com/whiskeywebfm/status/1740841143670280596'
  },
  {
    author: 'Whiskey Web and Whatnot',
    handle: 'whiskeywebfm',
    avatar: null,
    date: 'Feb 20, 2024',
    text: "Is there anything Microsoft doesn't own these days? We discuss the powerful reach of our Microsoft overlords with @chriscoyier on the latest WWW episode.",
    replies: '9',
    reposts: '7',
    likes: '201',
    views: '148.9K',
    url: 'https://x.com/whiskeywebfm/status/1760098830463148485'
  },
  {
    author: 'Robbie Wagner',
    handle: 'RobbieWagner',
    avatar: 'robbiethewagner.jpg',
    date: 'Sep 27, 2023',
    text: 'React was a mistake',
    replies: '122',
    reposts: '38',
    likes: '483',
    views: '127.4K',
    url: 'https://x.com/RobbieWagner/status/1707128750746243477'
  },
  {
    author: 'Adam Argyle',
    handle: 'argyleink',
    avatar: 'argyleink.jpg',
    date: 'Feb 3, 2026',
    text: 'Wild how far you can push "customizable select" with just #CSS',
    replies: '45',
    reposts: '74',
    likes: '1.6K',
    views: '100K',
    url: 'https://x.com/argyleink/status/2018737944622944378'
  },
];

export interface ReachStat {
  value: string;
  /** For the count-up animation: numeric target and suffix. */
  target: number;
  suffix: string;
  label: string;
  detail: string;
}

export const reachStats: Array<ReachStat> = [
  {
    value: '100K+',
    target: 100,
    suffix: 'K+',
    label: 'Monthly impressions',
    detail: 'Across audio, video, and social'
  },
  {
    value: '76K+',
    target: 76,
    suffix: 'K+',
    label: 'Combined X followers',
    detail: '@argyleink 58.5K · @whiskeywebfm 10.9K · @RobbieWagner 7.1K'
  },
  {
    value: '10.9K',
    target: 10.9,
    suffix: 'K',
    label: 'YouTube subscribers',
    detail: '339 videos and counting'
  },
  {
    value: '10K',
    target: 10,
    suffix: 'K',
    label: 'Downloads per episode',
    detail: '3–10K, top 10% of podcasts'
  }
];

export interface HostProfile {
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  role: string;
  creds: Array<string>;
  url: string;
}

export const hostProfiles: Array<HostProfile> = [
  {
    name: 'Robbie Wagner',
    handle: 'RobbieWagner',
    avatar: 'robbiethewagner.jpg',
    followers: '7.1K',
    role: 'Co-host · Whiskey buyer-in-chief',
    creds: [
      'Slings JavaScript at HashiCorp',
      'Previously Amazon, Netflix, and Apple',
      'Founder of Ship Shape'
    ],
    url: 'https://x.com/RobbieWagner'
  },
  {
    name: 'Adam Argyle',
    handle: 'argyleink',
    avatar: 'argyleink.jpg',
    followers: '58.5K',
    role: 'Co-host · Resident CSS dork',
    creds: [
      'Design engineer at Shopify, prior Google Chrome',
      'CSS Working Group · co-hosted The CSS Podcast',
      'Maker of Open Props and gradient.style'
    ],
    url: 'https://x.com/argyleink'
  }
];

export interface Partner {
  id: string;
  name: string;
  img: string;
  url: string;
  blurb: string;
  caseStudy?: string;
}

export const partners: Array<Partner> = [
  {
    id: 'warp',
    name: 'Warp',
    img: 'warp.svg',
    url: 'https://warp.dev/',
    blurb:
      'The AI-first terminal. Ran 90 days of host-read spots across audio, video, and social.',
    caseStudy: '/sponsors/warp'
  },
  {
    id: 'code-rabbit',
    name: 'CodeRabbit',
    img: 'code-rabbit.svg',
    url: 'http://coderabbit.link/whiskey',
    blurb: 'AI code review on every pull request, read to the devs who ship them.'
  },
  {
    id: 'gitkraken',
    name: 'GitKraken',
    img: 'gitkraken.svg',
    url: 'https://gitkraken.com/whiskeyfm',
    blurb: 'Git tooling developers actually like — a natural fit for our audience.'
  },
  {
    id: 'norlan',
    name: 'Norlan',
    img: 'norlan.svg',
    url: 'https://norlanglass.com/',
    blurb: 'Design-forward whiskey glassware. Literally the glass on our table.'
  },
  {
    id: 'cascadiajs',
    name: 'CascadiaJS',
    img: 'cascadiajs.svg',
    url: 'https://cascadiajs.com',
    blurb: 'The Pacific Northwest web conference — where we emceed on stage in 2026.'
  }
];

export const adPackages = [
  {
    bullets: [
      'Have a bottle of whiskey or software product reviewed',
      'Honest, positive mention during Whiskey and/or Whatnot segments'
    ],
    heading: 'The Drop',
    price: '$250',
    envKey: 'POLAR_BOTTLEDROP_PRODUCT_ID'
  },
  {
    bullets: [
      'Ad on our website or in the show notes',
      'Placed prominently on main page and show notes',
      'Consistent exposure outside of the audio feed'
    ],
    heading: 'The Label',
    price: '$250',
    envKey: 'POLAR_LABEL_PRODUCT_ID'
  },
  {
    bullets: ['A baked in, high-trust host read pre-roll ad', '30-seconds'],
    heading: "The Distiller's Cut",
    price: '$500',
    envKey: 'POLAR_30SEC_PRODUCT_ID'
  },
  {
    bullets: ['A baked in, high-trust host read pre-roll ad', '60-seconds'],
    heading: "The Spirit Maker's Cut",
    price: '$1k',
    envKey: 'POLAR_60SEC_PRODUCT_ID'
  },
  {
    bullets: [
      '4x 30-second host-read ads',
      '4x website & show notes placements',
      'Perfect for consistent monthly presence'
    ],
    heading: 'The Crate',
    price: '$2.4k',
    period: 'per month',
    envKey: 'POLAR_CRATE_PRODUCT_ID'
  },
  {
    bullets: [
      'Our flagship monthly sponsorship',
      '4x 60-second host-read ads',
      '4x website & show notes placements',
      '"Presented By [Your Company]" in episode titles',
      'Social media mentions for each episode'
    ],
    heading: 'The Full Barrel',
    price: '$4k',
    period: 'per month',
    envKey: 'POLAR_FULLBARREL_PRODUCT_ID'
  }
];
