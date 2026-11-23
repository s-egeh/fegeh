/**
 * COMPANY — single source of truth for every phone number, address, email and
 * route rendered anywhere on the site. Change a number here and it changes
 * everywhere: header, footer, contact page, quote page, schema.org, tel: links.
 *
 * Do not hardcode contact details in a component. Ever.
 */

export interface Phone {
  /** Mono label shown beside the number. */
  label: string;
  /** Display form, spaced for readability. */
  display: string;
  /** tel: form, digits only with country code. */
  tel: string;
}

export interface Address {
  label: string;
  lines: string[];
  locality: string;
  region: string;
  country: string;
  countryCode: string;
  mapsQuery: string;
  /** Switch a second office card on by flipping this to true. */
  active: boolean;
}

export interface Social {
  label: string;
  href: string;
  /** lucide-react icon name; the footer renders only known icons. */
  icon: 'facebook' | 'linkedin' | 'instagram' | 'twitter' | 'youtube';
}

export interface BusinessHours {
  days: string;
  hours: string;
}

export const COMPANY = {
  name: 'Fegeh Logistics',
  /** Registered legal name, confirmed by the client. */
  legalName: 'Fegeh Logistics',
  /** Descriptor. Not in the Fegeh logo, which reads "FEGEH LOGISTICS" only. */
  descriptor: 'Logistics & Distribution',
  tagline:
    'Logistics and distribution from Afienya, near the Tema industrial hub — nationwide and across West Africa.',
  shortTagline: 'Logistics and distribution, Ghana-wide.',

  /**
   * "Last updated" date on /privacy and /terms — the day their wording was
   * drafted for this site. [TODO-CLIENT] Set to the date the reviewed policies
   * are published.
   */
  policiesUpdated: '22 November 2026',

  /**
   * [TODO-CLIENT] Confirm before launch. This address is assumed from the new
   * domain, fegehlogistics.com — it was not supplied, and no mailbox exists for
   * it yet. It appears on every page and receives the contact and quote forms,
   * so the mailbox must be created, or this address changed, before launch.
   */
  email: 'info@fegehlogistics.com',

  /**
   * Operations first: PRIMARY_PHONE is phones[0], and the header, top bar,
   * call-to-action band and floating action stack show that one number. The
   * footer, drawer, contact page and contact block list every entry.
   */
  phones: [
    { label: 'Operations', display: '024 454 6668', tel: '+233244546668' },
    { label: 'Managing Proprietor', display: '025 611 3380', tel: '+233256113380' },
  ] satisfies Phone[],

  /**
   * Postal lines only. The Ghana Post GPS code is kept separately in
   * digitalAddress and is not part of the schema.org streetAddress.
   */
  addresses: [
    {
      label: 'Head office',
      lines: ['Charles Borkor Lane', 'Emmanuel Estate, Mateheko'],
      locality: 'Afienya',
      region: 'Greater Accra',
      country: 'Ghana',
      countryCode: 'GH',
      mapsQuery: 'Emmanuel Estate, Afienya, Greater Accra, Ghana',
      active: true,
    },
  ] satisfies Address[],

  /** Ghana Post GPS. The practical way to find the premises. */
  digitalAddress: 'GN-1103-1168',

  /**
   * Read from NEXT_PUBLIC_WHATSAPP so it can be swapped without a code change;
   * the default is the operations number.
   */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '233244546668',
  whatsappPrefill: 'Hello Fegeh Logistics, I would like to enquire about ',

  /**
   * [TODO-CLIENT] Social accounts. The footer and top bar render nothing at all
   * when this array is empty — no dead links are ever shipped.
   */
  socials: [] satisfies Social[],

  /** [TODO-CLIENT] Confirm business hours. */
  hours: [
    { days: 'Monday – Friday', hours: '08:00 – 17:00 GMT' },
    { days: 'Saturday', hours: '08:00 – 13:00 GMT' },
    { days: 'Sunday', hours: 'Closed' },
  ] satisfies BusinessHours[],

  /**
   * Corridor strip (signature element 1) and the coverage copy. Mirrors
   * CORRIDORS in src/data/coverage.ts.
   */
  routes: [
    'Tema Port → Afienya',
    'Afienya → Accra',
    'Afienya → Kumasi',
    'Afienya → Takoradi',
    'Afienya → Tamale',
    'Nationwide distribution',
  ],

  /**
   * Google Maps embed and directions, both built from mapsQuery above.
   *
   * Checked by eye on 2026-11-22: the query resolves to "Emmanuel Estate first
   * junct" (plus code QXHW+MRC), beside the Tema–Akosombo road in Afienya, at
   * about 5.7792, -0.0030. The Ghana Post GPS code does not resolve reliably
   * in Google Maps, so it is not used as the query. The pin is a place Google
   * users created, not the business's own listing; if it ever moves, fall back
   * to 'Afienya, Greater Accra, Ghana', which lands on the town centre.
   */
  mapEmbedUrl:
    'https://www.google.com/maps?q=Emmanuel%20Estate%2C%20Afienya%2C%20Greater%20Accra%2C%20Ghana&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Emmanuel%20Estate%2C%20Afienya%2C%20Greater%20Accra%2C%20Ghana',
} as const;

export const PRIMARY_PHONE = COMPANY.phones[0];

export const WHATSAPP_HREF = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(
  COMPANY.whatsappPrefill,
)}`;

export const ACTIVE_ADDRESSES = COMPANY.addresses.filter((address) => address.active);

/* ------------------------------------------------------------------ *
 * [TODO-CLIENT: review wording] — everything from here to the end of
 * the file.
 *
 * Written for a logistics and distribution operator based at Afienya,
 * near Tema, and kept to positioning, capability and intent. The only
 * figures and dates are the ones the client supplied — the registration
 * date and number in GOVERNANCE. The client should read every line and
 * either approve it or replace it with their own.
 * ------------------------------------------------------------------ */

export const VISION =
  'To be the logistics and distribution partner that businesses in Ghana and the wider sub-region can plan around — dependable on every consignment, and straightforward to deal with.';

export const MISSION =
  "To move, store and deliver our clients' goods with care and on schedule, with clear communication from the first enquiry to the final handover.";

/*
 * The registration number is published so the claim can be checked. The TIN
 * is deliberately NOT published — it is recorded in HANDOVER.md for invoices,
 * contracts and filings only.
 */
export const GOVERNANCE =
  'Fegeh Logistics is a business name registered in Ghana on 15 April 2022 under the Registration of Business Names Act, 1962 (Act 151), registration number BN452260422. The business is committed to running its operations with clear lines of responsibility, honest communication with clients, and compliance with the regulatory requirements that apply to transport, warehousing and trade in Ghana.';

export interface CoreValue {
  title: string;
  short: string;
  full: string;
  icon: 'ShieldCheck' | 'Award' | 'Clock' | 'Lightbulb' | 'Leaf' | 'Handshake';
}

export const CORE_VALUES: CoreValue[] = [
  {
    title: 'Integrity',
    short: 'We conduct business honestly and transparently.',
    full: 'We conduct business honestly and transparently. Rates, timelines and capacity are stated plainly, and if something changes on a consignment, the client hears it from us first.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Professionalism',
    short: 'We uphold high operational standards and work ethics.',
    full: 'We uphold high operational standards — in how goods are received, stored, handled and handed over, and in how our people represent the business at a client’s premises.',
    icon: 'Award',
  },
  {
    title: 'Reliability',
    short: 'We deliver on time, every time.',
    full: 'We deliver on time, every time. Commitments are made against the vehicles, storage space and people actually available, so that a delivery date, once agreed, can be kept.',
    icon: 'Clock',
  },
  {
    title: 'Innovation',
    short: 'We look for better ways to plan, store and move goods.',
    full: 'We look for better ways to plan loads, routes and storage, and adopt the tools that make a consignment easier for the client to follow.',
    icon: 'Lightbulb',
  },
  {
    title: 'Sustainability',
    short: 'We prioritise environmental protection and social responsibility.',
    full: 'We prioritise environmental protection and social responsibility: planning loads and routes to cut wasted journeys, storing and handling goods so that less is damaged or thrown away, and respecting the communities we work in.',
    icon: 'Leaf',
  },
  {
    title: 'Customer Commitment',
    short: 'We build long-term relationships based on trust and mutual success.',
    full: 'We build long-term relationships based on trust and mutual success — learning how a client’s supply chain works and fitting our service around it, rather than the other way round.',
    icon: 'Handshake',
  },
];

/*
 * Strategic pillars, market drivers and future plans.
 *
 * [TODO-CLIENT] All three are empty. The previous site's lists were another
 * company's strategy and are not carried over. The /about sections and the
 * homepage market-outlook band that read these arrays render nothing while
 * they are empty; supply the client's own and they appear with no code change.
 */

export interface StrategicPillar {
  index: string;
  title: string;
  description: string;
}

export const STRATEGIC_PILLARS: StrategicPillar[] = [];

/** Market drivers — stated as drivers, never as statistics. */
export const MARKET_DRIVERS: { title: string; description: string }[] = [];

export const FUTURE_PLANS: { index: string; title: string; description: string }[] = [];

/** The company paragraphs, used on home and about. */
export const COMPANY_OVERVIEW_PARAGRAPHS = [
  'Fegeh Logistics is a logistics and distribution business based at Mateheko, Afienya, near the Tema industrial hub, within reach of Tema Port and the trunk roads that carry goods inland and along the coast.',
  'The business moves, stores and distributes goods for companies that import, manufacture and trade: road freight across Ghana, warehousing and inventory handling, scheduled and last-mile distribution, and support with the documentation that import and export movements depend on.',
  'The aim is simple — to be the partner a client can plan around, with clear quotes, realistic timelines and one point of contact from collection to delivery.',
];

export const BUSINESS_MODEL_PARAGRAPH =
  'Clients engage Fegeh Logistics per consignment or under an ongoing arrangement. Each piece of work is quoted against the service, the volume, the route and the timing, so the price is agreed before anything moves.';
