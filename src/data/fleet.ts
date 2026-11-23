export type FleetCategory = 'long-haul' | 'rigid' | 'last-mile' | 'container' | 'handling';

export interface FleetSpec {
  label: string;
  value: string;
}

export interface FleetUnit {
  slug: string;
  name: string;
  category: FleetCategory;
  image: string;
  imageAlt: string;
  /** One line under the title. */
  summary: string;
  /**
   * Specs are qualitative by design.
   *
   * [TODO-CLIENT] Supply publishable capacities. Until then no capacity figure
   * is invented and no placeholder string is rendered — add a
   * `{ label: 'Capacity', value: '…' }` row here when the client confirms.
   * Never a unit count: see the note above FLEET_FILTERS.
   */
  specs: FleetSpec[];
  /** Lightbox set for this unit type. */
  gallery: { src: string; alt: string }[];
}

/*
 * [TODO-CLIENT] Confirm which of these vehicle and equipment types the business
 * operates, and delete any it does not. These are the types the four services
 * call for, described in general terms — not an inventory.
 *
 * Owned, not hired in: the client has confirmed that its vehicles are owned
 * and operated by Fegeh Logistics, so /fleet states them as its own fleet.
 *
 * Each photograph is named after its vehicle type's slug (fleet-<slug>.jpg);
 * HANDOVER.md says what each one should show.
 */

/*
 * No fleet size, anywhere on the site. The client asked (2026-11-23) for the
 * site to say nothing about how many vehicles the business runs — no total,
 * no per-type count, no "27+" — so /fleet and the "why us" band describe the
 * fleet as owned and operated without numbering it. Do not add a count back
 * unless the client asks for one.
 */

export const FLEET_FILTERS: { value: FleetCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'long-haul', label: 'Long-haul' },
  { value: 'rigid', label: 'Rigid trucks' },
  { value: 'last-mile', label: 'Last-mile' },
  { value: 'container', label: 'Container' },
  { value: 'handling', label: 'Warehouse handling' },
];

export const FLEET: FleetUnit[] = [
  {
    slug: 'articulated-truck',
    name: 'Articulated trucks',
    category: 'long-haul',
    image: '/images/fleet/fleet-articulated-truck.jpg',
    imageAlt: 'A tractor unit pulling a tipper trailer',
    summary: 'Full loads over long distances, from Afienya to the regions.',
    specs: [
      { label: 'Type', value: 'Tractor unit and semi-trailer' },
      { label: 'Typical load', value: 'Full truckloads of palletised or bagged goods' },
      { label: 'Typical route', value: 'Afienya to Kumasi, Takoradi and Tamale' },
      { label: 'Availability', value: 'Per consignment, or planned under an arrangement' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-articulated-truck.jpg', alt: 'A tractor unit pulling a tipper trailer' },
      { src: '/images/gallery/gallery-morning-dispatch.jpg', alt: 'Trucks ready for dispatch' },
    ],
  },
  {
    slug: 'rigid-truck',
    name: 'Rigid box and curtain-side trucks',
    category: 'rigid',
    image: '/images/fleet/fleet-rigid-truck.jpg',
    imageAlt: 'A white rigid flatbed truck',
    summary: 'Enclosed vehicles for part loads and distribution runs.',
    specs: [
      { label: 'Type', value: 'Rigid truck, box or curtain-side body' },
      { label: 'Typical load', value: 'Part loads, cartons and mixed consignments' },
      { label: 'Typical route', value: 'Tema and Greater Accra, and regional runs' },
      { label: 'Availability', value: 'Per consignment, or on a scheduled run' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-rigid-truck.jpg', alt: 'A white rigid flatbed truck' },
      { src: '/images/gallery/gallery-pallet-loading.jpg', alt: 'Goods being loaded for delivery' },
    ],
  },
  {
    slug: 'delivery-vehicle',
    name: 'Light delivery vehicles',
    category: 'last-mile',
    image: '/images/fleet/fleet-delivery-vehicle.jpg',
    imageAlt: 'A light delivery vehicle at a retail drop',
    summary: 'Last-mile and multi-drop delivery to shops and trade customers.',
    specs: [
      { label: 'Type', value: 'Van and light commercial vehicle' },
      { label: 'Typical load', value: 'Orders for individual delivery points' },
      { label: 'Typical route', value: 'Multi-drop runs in and around Accra and Tema' },
      { label: 'Availability', value: 'Scheduled runs or per order' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-delivery-vehicle.jpg', alt: 'Light delivery vehicle on a distribution run' },
      { src: '/images/gallery/gallery-multi-drop-loading.jpg', alt: 'A person packing a cardboard box at a desk' },
    ],
  },
  {
    slug: 'container-trailer',
    name: 'Container trailers',
    category: 'container',
    image: '/images/fleet/fleet-container-trailer.jpg',
    imageAlt: 'An empty container chassis trailer',
    summary: 'Containers between Tema Port, Afienya and inland.',
    specs: [
      { label: 'Type', value: 'Flatbed or skeletal container trailer' },
      { label: 'Typical load', value: 'Import and export containers' },
      { label: 'Typical route', value: 'Tema Port to Afienya and inland' },
      { label: 'Availability', value: 'Per container, booked against release' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-container-trailer.jpg', alt: 'An empty container chassis trailer' },
      { src: '/images/gallery/gallery-port-collection.jpg', alt: 'A reach stacker beside a train of containers in a port yard' },
    ],
  },
  {
    slug: 'handling-equipment',
    name: 'Warehouse handling equipment',
    category: 'handling',
    image: '/images/fleet/fleet-handling-equipment.jpg',
    imageAlt: 'A forklift parked beside a concrete wall',
    summary: 'Equipment for receiving, storing and loading goods in the warehouse.',
    specs: [
      { label: 'Type', value: 'Forklifts and pallet trucks' },
      { label: 'Typical use', value: 'Receiving, put-away, picking and loading' },
      { label: 'Location', value: 'Warehouse at Afienya, near Tema' },
    ],
    gallery: [
      { src: '/images/fleet/fleet-handling-equipment.jpg', alt: 'A forklift parked beside a concrete wall' },
      { src: '/images/gallery/gallery-pallet-put-away.jpg', alt: 'Pallets being moved inside a warehouse' },
    ],
  },
];

/** /fleet, dark band. [TODO-CLIENT: review wording] */
export const MAINTENANCE_PILLARS: { title: string; lines: string[]; icon: string }[] = [
  {
    title: 'Preventive maintenance',
    lines: [
      'Servicing is scheduled to interval rather than triggered by a breakdown.',
      'The aim is a vehicle that turns up when it was booked, which is what a client is buying.',
    ],
    icon: 'Wrench',
  },
  {
    title: 'Safety compliance',
    lines: [
      'Roadworthiness, insurance and licensing are kept current per vehicle.',
      'A vehicle outside its compliance window does not carry goods.',
    ],
    icon: 'ShieldCheck',
  },
  {
    title: 'Dispatch supervision',
    lines: [
      'Every movement is assigned, checked and supervised against the agreed window.',
      'Route and load are confirmed before departure, not after.',
    ],
    icon: 'ClipboardCheck',
  },
  {
    title: 'Driver standards',
    lines: [
      'Drivers are taken on for experience and a clean record.',
      'How they drive and how they hand over goods is supervised, not assumed.',
    ],
    icon: 'GraduationCap',
  },
];
