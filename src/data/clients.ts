export interface Client {
  name: string;
  /** null when the sector is not known: nothing is shown under the name. */
  sector: string | null;
  /**
   * Logo file path. If the file is not supplied, ClientTile renders the company
   * name as a wordmark in the utility typeface — a third-party logo is never
   * invented or downloaded.
   */
  logo: string | null;
}

/**
 * Clients the business may name publicly — the companies it works with. The
 * client confirmed permission to name Bel Aqua, Wilmar and Olam, and on
 * 2026-11-23 removed Guinness and added Keda, Peak Steel, Sunda and Sankofa.
 * [TODO-CLIENT] Confirm permission to name the four added.
 *
 * Describe them as clients — customers of Fegeh Logistics. Never "partners",
 * "in partnership with", or anything implying endorsement or a relationship
 * beyond being a customer.
 *
 * `logo` stays null. A third-party logo is never downloaded, recreated or
 * traced: it goes on the site only if that company supplies the file together
 * with permission to use it. Until then each renders as a text wordmark.
 *
 * [TODO-CLIENT] Confirm the sectors. They were inferred, not supplied: Keda is
 * taken to be Keda (Ghana) Ceramics, the tile maker trading as Twyford, and
 * Sunda to be Sunda International, the consumer-goods manufacturer. Peak
 * Steel's is read from its name. Sankofa has none: the name alone does not
 * say which company it is.
 *
 * If this array is ever emptied again, /clients returns a 404 and drops out of
 * the navigation, footer and homepage marquee by itself; add '/clients' back
 * to the `exclude` array in next-sitemap.config.js by hand.
 */
export const CLIENTS: Client[] = [
  { name: 'Bel Aqua', sector: 'Beverages', logo: null },
  { name: 'Wilmar', sector: 'Agribusiness', logo: null },
  { name: 'Olam', sector: 'Agribusiness', logo: null },
  { name: 'Keda', sector: 'Ceramics', logo: null },
  { name: 'Peak Steel', sector: 'Steel', logo: null },
  { name: 'Sunda', sector: 'Consumer goods', logo: null },
  { name: 'Sankofa', sector: null, logo: null },
];

export const CLIENTS_PUBLISHED = CLIENTS.length > 0;

/**
 * [TODO-CLIENT] Real testimonials with named people, companies and written
 * permission to publish. The TestimonialRail component is built and wired, but
 * stays unrendered while this array is empty. Nothing is ever invented here.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const TESTIMONIALS: Testimonial[] = [];

/*
 * Supporting copy for /clients. Generic by design — it describes how an
 * ongoing arrangement works, and names no client and claims no outcome.
 * [TODO-CLIENT: review wording] before /clients is switched on.
 */
export const PARTNERSHIP_COPY = {
  intro:
    'Most of the work worth doing in logistics is repeat work: the same goods, on the same routes, for the same customers, week after week. These are the companies Fegeh Logistics works with.',
  development:
    'An ongoing arrangement means capacity is planned around your programme rather than sold consignment by consignment — vehicles and storage space set aside against your expected volume, and a rate agreed in advance.',
  compliance:
    'Where goods cross a border or pass through the port, documentation is prepared before they move. You can see how a consignment was received, stored and delivered.',
};

/* ------------------------------------------------------------------ *
 * How we support each sector — /clients.
 *
 * Service patterns, not case studies: no client is named against an
 * outcome, and no volume, saving or performance figure appears.
 * ------------------------------------------------------------------ */

export const SECTOR_SUPPORT: { title: string; description: string }[] = [];

/* ------------------------------------------------------------------ *
 * What an ongoing arrangement looks like — /clients, dark band.
 * ------------------------------------------------------------------ */

export const PARTNERSHIP_POINTS: { title: string; description: string }[] = [
  { title: 'Agreed rates', description: 'A rate schedule instead of consignment-by-consignment quoting.' },
  { title: 'Planned capacity', description: 'Vehicles and space reserved against your calendar.' },
  { title: 'One contact', description: 'A named person in operations who knows your account.' },
  { title: 'Records', description: 'Delivery records you can reconcile against invoices.' },
];
