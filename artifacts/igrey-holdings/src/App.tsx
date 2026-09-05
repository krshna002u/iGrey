import { useEffect, useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock3, Compass, Facebook, Home, Instagram, Linkedin, Menu, MessageCircle, Pencil, Plus, Quote, Save, ShieldCheck, Sparkles, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const logo = asset('igrey-logo.png');

const defaultProperties = [
  { id: 'indiranagar', label: 'LEASED', title: 'Sunlit three-bed in Indiranagar', meta: '3 BHK · 2,140 sq ft · Lease terms on request', images: ['property-living.jpg', 'property-courtyard.jpg', 'property-terrace.jpg'], tone: 'text-[#eddca9] bg-[#19382f]', details: 'A bright, considered home close to the everyday rhythm of Indiranagar.', features: ['3 bedrooms', '2,140 sq ft', 'Lease terms on request'] },
  { id: 'whitefield', label: 'FOR SALE', title: 'A quiet villa in Whitefield', meta: '4 BHK · 3,860 sq ft · ₹4.25 Cr', images: ['property-villa.jpg', 'property-courtyard.jpg', 'property-living.jpg'], tone: 'text-[#19382f] bg-[#e8c979]', details: 'A generous family villa with calm outdoor spaces and room to grow.', features: ['4 bedrooms', '3,860 sq ft', '₹4.25 Cr'] },
  { id: 'koramangala', label: 'NEW LISTING', title: 'Terrace home, Koramangala', meta: '3 BHK · 2,480 sq ft · Lease terms on request', images: ['property-terrace.jpg', 'property-living.jpg', 'property-villa.jpg'], tone: 'text-[#f6f1e5] bg-[#bd674e]', details: 'An easy, light-filled terrace home in the middle of Koramangala.', features: ['3 bedrooms', '2,480 sq ft', 'Lease terms on request'] },
];
type Property = typeof defaultProperties[number];

const faqs = [
  ['How does iGrey verify a property?', 'We review ownership documents, match details across records, visit the property, and speak with the people who manage it. You receive the useful facts before you spend time on a viewing.'],
  ['Do you work with owners and tenants?', 'Both. We help owners position, price and protect their property, while giving tenants a clear route from shortlist to move-in and beyond.'],
  ['Which parts of Bangalore do you cover?', 'Our home ground is Bangalore, with an active network across Indiranagar, Koramangala, HSR, Whitefield, Hebbal and the neighbourhoods in between.'],
  ['Can iGrey help with a property I already own?', 'Yes. Our advisory and property care teams can step in at any stage—from a first rental assessment to ongoing tenant coordination and renewal support.'],
];

const clientTypes = [
  ['01', 'Property owners', 'Rent out with confidence.', 'We connect owners with verified tenants with good backgrounds, support on-time rent and provide long-term property maintenance until the contract ends. Structured paperwork, with zero service charges.'],
  ['02', 'Property buyers', 'Purchase with perspective.', 'For people looking to purchase a new property, we bring local insight, clear comparisons and steady guidance from the first shortlist through to the next set of keys.'],
  ['03', 'Tenants', 'Find the right fit.', 'Choose from properties that match your budget, preferred surroundings and requirements. We help you move through verification, agreement and possession with clarity, subject to the agreed terms and conditions.'],
];

const ownerSteps = [
  ['01', 'Visit and understand', 'We visit the property and collect the details.'],
  ['02', 'Share the opportunity', 'We show the property details to interested tenants from our client network.'],
  ['03', 'Arrange the viewing', 'We coordinate a property visit at a time that works for everyone.'],
  ['04', 'Share client details', 'We send the relevant client details to the property owner.'],
  ['05', 'Agree the terms', 'The agreement starts with the terms both sides have approved.'],
  ['06', 'Begin property care', 'We start PMS right after iGrey takes over, with flexible agreement terms.'],
];

const tenantSteps = [
  ['01', 'Start with your brief', 'We show properties that match your requirements and budget.'],
  ['02', 'Complete verification', 'Once you find a property you like, we collect the relevant documents for verification.'],
  ['03', 'Agree the terms', 'The agreement starts with flexible terms agreed by both sides.'],
  ['04', 'Take possession', 'We coordinate the handover so you can start living in your new space.'],
  ['05', 'Stay assured', 'Investment assurance begins within three months after the agreement, subject to the agreed terms and conditions.'],
];

type CareerOpening = [string, string, string];
const defaultCareerOpenings: CareerOpening[] = [
  ['Relationship Manager', 'Bangalore · Full-time', 'Build trusted relationships with owners, buyers and tenants from first conversation to handover.'],
  ['Business Development Manager', 'Bangalore · Full-time', 'Grow our owner and partner network with a thoughtful, consistent approach.'],
  ['Business Development Executive', 'Bangalore · Full-time', 'Bring energy and curiosity to new conversations across Bangalore.'],
  ['Team Lead', 'Bangalore · Full-time', 'Support a high-performing team and keep every client journey moving clearly.'],
  ['Sales Manager', 'Bangalore · Full-time', 'Lead property sales with local insight, calm follow-through and strong commercial judgement.'],
  ['Videographer', 'Bangalore · Full-time', 'Make the character of homes and neighbourhoods visible through considered film.'],
  ['Video Editor', 'Bangalore · Full-time', 'Shape property stories into clear, engaging visual experiences.'],
];

function useStoredContent<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the current in-memory edit if storage is unavailable.
    }
  }, [key, value]);

  useEffect(() => {
    const sync = () => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) setValue(JSON.parse(stored) as T);
      } catch {
        // Keep the current in-memory value if another tab has invalid data.
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key]);

  return [value, setValue];
}

function Logo({ invert = false }: { invert?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
      <img src={logo} alt="iGrey Holdings" className={`h-20 w-20 scale-125 object-contain ${invert ? 'brightness-0 contrast-150 invert drop-shadow-[0_0_1px_rgba(246,241,229,0.95)]' : ''}`} data-testid="img-brand-logo" />
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [
    ['Home', '/'],
    ['Services', location === '/' ? '#services' : '/#services'],
    ['Properties', location === '/' ? '#properties' : '/#properties'],
    ['Careers', '/careers'],
    ['Admin', '/admin'],
  ];
  const close = () => setOpen(false);
  return (
    <header className="absolute left-0 right-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 lg:px-10">
        <Logo invert />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {nav.map(([label, href]) => href.startsWith('#') ? (
            <a key={href} href={href} className="text-[11px] font-mono-label text-[#f6f1e5]/80 transition-colors hover:text-[#e8c979]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>
          ) : (
            <Link key={href} href={href} className="text-[11px] font-mono-label text-[#f6f1e5]/80 transition-colors hover:text-[#e8c979]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>
          ))}
          <a href="#contact" className="rounded-full border border-[#f6f1e5]/40 px-5 py-3 text-[10px] font-mono-label text-[#f6f1e5] transition-all hover:border-[#e8c979] hover:bg-[#e8c979] hover:text-[#19382f]" data-testid="link-nav-contact">Start a conversation <ArrowRight className="ml-2 inline h-3 w-3" /></a>
        </nav>
        <button className="rounded-full border border-[#f6f1e5]/35 p-3 text-[#f6f1e5] md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && <div className="mx-4 rounded-2xl border border-[#f6f1e5]/15 bg-[#19382f]/95 p-5 shadow-xl md:hidden">
        <div className="flex flex-col gap-5">
          {nav.map(([label, href]) => href.startsWith('#') ? <a key={href} href={href} onClick={close} className="font-mono-label text-xs text-[#f6f1e5]" data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a> : <Link key={href} href={href} onClick={close} className="font-mono-label text-xs text-[#f6f1e5]" data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
          <a href="#contact" onClick={close} className="font-mono-label text-xs text-[#e8c979]" data-testid="link-mobile-contact">Start a conversation →</a>
        </div>
      </div>}
    </header>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`flex items-center gap-3 font-mono-label text-[10px] tracking-[.2em] ${light ? 'text-[#e8c979]' : 'text-[#bd674e]'}`}><span className={`h-px w-8 ${light ? 'bg-[#e8c979]' : 'bg-[#bd674e]'}`} />{children}</div>;
}

function ArrowLink({ children, href = '#contact', light = false }: { children: ReactNode; href?: string; light?: boolean }) {
  return <a href={href} className={`group inline-flex items-center gap-3 border-b pb-2 font-mono-label text-[10px] tracking-[.13em] transition-colors ${light ? 'border-[#e8c979]/50 text-[#e8c979] hover:text-[#f6f1e5]' : 'border-[#19382f]/30 text-[#19382f] hover:border-[#bd674e] hover:text-[#bd674e]'}`} data-testid={`link-${String(children).toLowerCase().replaceAll(' ', '-')}`}>
    {children}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
  </a>;
}

function ProcessColumn({ title, steps }: { title: string; steps: string[][] }) {
  return <div className="border-t border-[#19382f]/25 pt-6" data-testid={`process-${title.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="flex items-start justify-between gap-5"><h3 className="font-display text-4xl text-[#19382f]">{title}</h3><span className="font-mono-label text-[9px] text-[#bd674e]">STEP BY STEP</span></div>
    <div className="mt-8">{steps.map(([number, label, copy]) => <div key={number} className="grid grid-cols-[38px_1fr] gap-4 border-t border-[#19382f]/15 py-5"><span className="font-mono-label text-[10px] text-[#bd674e]">{number}</span><div><h4 className="font-display text-2xl leading-none text-[#19382f]">{label}</h4><p className="mt-2 max-w-[360px] text-sm leading-6 text-[#19382f]/60">{copy}</p></div></div>)}</div>
  </div>;
}

function HomePage() {
  const [activeFlow, setActiveFlow] = useState<'owners' | 'tenants'>('owners');
  const [properties] = useStoredContent<Property[]>('igrey-properties', defaultProperties);
  return <div className="min-h-[100dvh] overflow-hidden bg-[#f6f1e5]">
    <section className="grain relative min-h-[760px] overflow-hidden bg-[#19382f] text-[#f6f1e5]">
      <Header />
      <div className="mx-auto grid min-h-[760px] max-w-[1320px] items-end gap-12 px-5 pb-16 pt-36 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-10 lg:pb-20">
        <div className="relative z-10 max-w-[700px]">
          <div className="reveal"><Eyebrow light>PROPERTY, WITH PERSPECTIVE</Eyebrow></div>
          <h1 className="reveal delay-1 mt-8 max-w-[680px] font-display text-[clamp(4rem,9vw,8.4rem)] leading-[.82] tracking-[-.045em] text-[#f6f1e5]">A better<br /><em className="text-[#e8c979]">perspective.</em></h1>
          <p className="reveal delay-2 mt-9 max-w-[410px] text-[15px] leading-7 text-[#f6f1e5]/70">A clearer way to rent, lease and buy in Bangalore. Human guidance, verified homes, and no fog around the fine print.</p>
          <div className="reveal delay-3 mt-10 flex flex-wrap items-center gap-6"><ArrowLink href="#properties" light>Explore properties</ArrowLink><a href="#how-it-works" className="text-[11px] font-mono-label text-[#f6f1e5]/60 transition-colors hover:text-[#f6f1e5]" data-testid="link-hero-how-it-works">How it works <ArrowDownRight className="ml-2 inline h-3.5 w-3.5" /></a></div>
        </div>
        <div className="relative z-10 ml-auto w-full max-w-[560px] self-center lg:mt-20">
          <div className="reveal delay-2 relative aspect-[.88] overflow-hidden rounded-[180px_180px_14px_14px] border border-[#e8c979]/20 bg-[#31594a]">
            <img src={asset('property-courtyard.jpg')} alt="A sunlit Bangalore courtyard home" className="image-wash h-full w-full object-cover opacity-85" data-testid="img-hero-property" />
            <div className="absolute inset-0 bg-[#19382f]/10" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div className="rounded-full bg-[#f6f1e5]/90 px-4 py-2 text-[9px] font-mono-label text-[#19382f]">BENGALURU / 12.9716° N</div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8c979] text-[#19382f]"><Compass className="h-5 w-5" /></div>
            </div>
          </div>
          <div className="absolute -left-7 top-14 hidden h-28 w-28 rounded-full border border-[#e8c979]/50 lg:block" />
          <div className="absolute -bottom-7 -right-7 hidden h-24 w-24 rounded-full border border-[#e8c979]/40 lg:block" />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 h-20 w-20 bg-[#e8c979] lg:h-32 lg:w-32" />
    </section>

    <section className="border-b border-[#d9d1c0] bg-[#e8c979] px-5 py-9 lg:px-10">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-7">
        <p className="max-w-[370px] text-[15px] leading-6 text-[#19382f]">For every threshold crossed, there is a story behind it. We make the next step feel considered.</p>
        <div className="flex flex-wrap gap-x-12 gap-y-5 text-[#19382f]">
          <div><strong className="font-display text-4xl">01+</strong><span className="ml-3 font-mono-label text-[9px]">years in Bangalore</span></div>
          <div><strong className="font-display text-4xl">100</strong><span className="ml-3 font-mono-label text-[9px]">homes placed</span></div>
          <div><strong className="font-display text-4xl">4.9</strong><span className="ml-3 font-mono-label text-[9px]">client rating</span></div>
        </div>
      </div>
    </section>

    <section id="services" className="bg-[#f6f1e5] px-5 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><Eyebrow>WHAT WE DO</Eyebrow><h2 className="mt-7 max-w-[380px] font-display text-6xl leading-[.9] text-[#19382f] lg:text-8xl">The right move starts here.</h2><p className="mt-8 max-w-[300px] text-sm leading-6 text-[#19382f]/65">Whether you are opening a door or handing over the keys, our people stay close to the detail.</p></div>
          <div className="grid gap-x-12 gap-y-0 md:grid-cols-2">
            {[
              ['01', 'Rent & lease', 'Well-matched homes for the way Bangalore actually lives. Clear terms, thoughtful viewings, zero pressure.'],
              ['02', 'Buy with clarity', 'Local insight and steady counsel for a decision that deserves more than a sales pitch.'],
              ['03', 'Owner services', 'Protect the value of your property with careful positioning, tenant care and responsive stewardship.'],
              ['04', 'Property advisory', 'A second opinion on a building, a neighbourhood or the next chapter of your portfolio.'],
            ].map(([no, title, body]) => <div key={no} className="group border-t border-[#d9d1c0] py-7 transition-colors hover:border-[#bd674e]">
              <div className="flex items-start justify-between gap-4"><span className="font-mono-label text-[10px] text-[#bd674e]">{no}</span><ArrowUpRightIcon /></div>
              <h3 className="mt-9 font-display text-4xl text-[#19382f]">{title}</h3><p className="mt-4 max-w-[260px] text-sm leading-6 text-[#19382f]/60">{body}</p>
            </div>)}
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" className="bg-[#e9e1cf] px-5 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div><Eyebrow>HOW IT WORKS</Eyebrow><h2 className="mt-7 max-w-[450px] font-display text-6xl leading-[.9] text-[#19382f] lg:text-8xl">One clear process.<br /><em>Three ways in.</em></h2><p className="mt-8 max-w-[330px] text-sm leading-6 text-[#19382f]/65">Whether you own a property, want to buy one or are looking for a place to rent, we make the next step easier to understand.</p></div>
          <div className="grid gap-x-10 gap-y-0 md:grid-cols-3">
            {clientTypes.map(([number, title, heading, copy]) => <article key={number} className="border-t border-[#19382f]/25 py-6" data-testid={`card-client-type-${number}`}><div className="flex items-start justify-between gap-4"><span className="font-mono-label text-[10px] text-[#bd674e]">{number}</span><ArrowUpRightIcon /></div><p className="mt-9 font-mono-label text-[9px] tracking-[.14em] text-[#bd674e]">{title}</p><h3 className="mt-3 font-display text-3xl leading-none text-[#19382f]">{heading}</h3><p className="mt-4 text-sm leading-6 text-[#19382f]/60">{copy}</p></article>)}
          </div>
        </div>
        <div className="mt-24 border-t border-[#19382f]/25 pt-8">
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>FROM FIRST STEP TO HANDOVER</Eyebrow><h3 className="mt-6 max-w-[390px] font-display text-5xl leading-[.92] text-[#19382f] lg:text-6xl">Thoughtful at every step.</h3><p className="mt-6 max-w-[330px] text-sm leading-6 text-[#19382f]/60">We keep the paperwork structured, the communication clear and the care active until the agreement ends.</p></div><div><div className="mb-8 inline-flex border border-[#19382f]/25 p-1" role="tablist" aria-label="Choose a client journey"><button type="button" role="tab" aria-selected={activeFlow === 'owners'} onClick={() => setActiveFlow('owners')} className={`px-5 py-3 font-mono-label text-[10px] transition-colors ${activeFlow === 'owners' ? 'bg-[#19382f] text-[#f6f1e5]' : 'text-[#19382f]/60 hover:text-[#19382f]'}`} data-testid="tab-how-it-works-owners">Owners</button><button type="button" role="tab" aria-selected={activeFlow === 'tenants'} onClick={() => setActiveFlow('tenants')} className={`px-5 py-3 font-mono-label text-[10px] transition-colors ${activeFlow === 'tenants' ? 'bg-[#19382f] text-[#f6f1e5]' : 'text-[#19382f]/60 hover:text-[#19382f]'}`} data-testid="tab-how-it-works-tenants">Tenants</button></div><ProcessColumn title={activeFlow === 'owners' ? 'For owners' : 'For tenants'} steps={activeFlow === 'owners' ? ownerSteps : tenantSteps} /></div></div>
        </div>
      </div>
    </section>

    <section id="about" className="bg-[#19382f] px-5 py-24 text-[#f6f1e5] lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div className="relative max-w-[560px]">
          <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full border border-[#e8c979]/50" />
          <img src={asset('property-courtyard.jpg')} alt="A considered home in Bangalore" className="image-wash aspect-[.88] w-full rounded-[12px_160px_12px_12px] object-cover opacity-85" data-testid="img-about-home" />
          <div className="absolute -bottom-8 right-7 bg-[#e8c979] px-5 py-4 text-[#19382f]"><span className="block font-display text-3xl">Since 2025</span><span className="font-mono-label text-[9px]">Bangalore, India</span></div>
        </div>
        <div><Eyebrow light>OUR POINT OF VIEW</Eyebrow><h2 className="mt-7 max-w-[580px] font-display text-6xl leading-[.92] lg:text-8xl">Property is personal.</h2><p className="mt-9 max-w-[510px] text-[17px] leading-8 text-[#f6f1e5]/70">A home is not a line item. A lease is not a formality. We built iGrey around the moments where property touches real life—with the patience to listen and the rigour to get things right.</p><p className="mt-5 max-w-[510px] text-[17px] leading-8 text-[#f6f1e5]/70">Our role is simple: make the path legible, then walk it with you.</p></div>
      </div>
    </section>

    <section className="bg-[#f6f1e5] px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-8"><div><Eyebrow>IN GOOD COMPANY</Eyebrow><h2 className="mt-6 font-display text-6xl leading-none text-[#19382f] lg:text-8xl">Built on trust.</h2></div><p className="max-w-[300px] text-sm leading-6 text-[#19382f]/60">We work with people and partners who care about the long game, from first viewing to final handover.</p></div>
        <div className="mt-20 grid grid-cols-2 border-y border-[#d9d1c0] md:grid-cols-4">
          {['Godrej Properties', 'Prestige', 'Sobha', 'Brigade'].map((name, i) => <div key={name} className={`flex h-28 items-center justify-center border-[#d9d1c0] px-4 text-center font-display text-xl text-[#19382f]/70 ${i > 0 ? 'border-l' : ''}`} data-testid={`text-partner-${i}`}>{name}</div>)}
        </div>
      </div>
    </section>

    <section id="properties" className="bg-[#e9e1cf] px-5 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-8"><div><Eyebrow>LISTED PROPERTIES</Eyebrow><h2 className="mt-6 max-w-[650px] font-display text-6xl leading-[.88] text-[#19382f] lg:text-8xl">Available<br /><em>now.</em></h2></div><Link href="/properties" className="group inline-flex items-center gap-4 rounded-sm border border-[#19382f]/25 px-6 py-4 font-mono-label text-[10px] tracking-[.13em] text-[#19382f] transition-colors hover:border-[#bd674e] hover:text-[#bd674e]" data-testid="link-view-all-properties">View all properties <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div>
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
          <PropertyCard property={properties[0]} large />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"><PropertyCard property={properties[1]} /><PropertyCard property={properties[2]} /></div>
        </div>
      </div>
    </section>

    <section className="bg-[#bd674e] px-5 py-20 text-[#f6f1e5] lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1320px]"><div className="grid gap-12 lg:grid-cols-[1.12fr_.88fr]"><div><Eyebrow light>CLIENT NOTES</Eyebrow><Quote className="mt-8 h-10 w-10 text-[#e8c979]" /><blockquote className="mt-7 max-w-[820px] font-display text-4xl leading-[.98] lg:text-6xl">“They did not just find us a home. They helped us understand the decision.”</blockquote><p className="mt-7 font-mono-label text-[10px] tracking-[.16em] text-[#f6f1e5]/70">— ANANYA & RAHUL / INDIRANAGAR</p></div><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1"><article className="border-t border-[#f6f1e5]/35 pt-5"><Quote className="h-6 w-6 text-[#e8c979]" /><blockquote className="mt-5 font-display text-3xl leading-none">“Every question was answered before we had to ask it.”</blockquote><p className="mt-5 font-mono-label text-[10px] tracking-[.16em] text-[#f6f1e5]/65">— MEERA S. / WHITEFIELD</p></article><article className="border-t border-[#f6f1e5]/35 pt-5"><Quote className="h-6 w-6 text-[#e8c979]" /><blockquote className="mt-5 font-display text-3xl leading-none">“A calm, thoughtful team from first visit to handover.”</blockquote><p className="mt-5 font-mono-label text-[10px] tracking-[.16em] text-[#f6f1e5]/65">— ARJUN K. / KORAMANGALA</p></article></div></div></div>
    </section>

    <ContactAndFaq />
    <Footer />
  </div>;
}

function ArrowUpRightIcon() {
  return <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#19382f]/25 text-[#19382f] transition-all group-hover:border-[#bd674e] group-hover:bg-[#bd674e] group-hover:text-[#f6f1e5]"><ArrowUpRight className="h-4 w-4" /></span>;
}

function PropertyCarousel({ property }: { property: Property }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (property.images.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % property.images.length), 4200);
    return () => window.clearInterval(timer);
  }, [property.id, property.images.length]);

  const move = (direction: number) => setActive((current) => (current + direction + property.images.length) % property.images.length);

  return <div className="absolute inset-0 z-[3]" aria-label={`${property.title} image gallery`}>
    {property.images.map((image, index) => <img key={image} src={asset(image)} alt={`${property.title}, view ${index + 1}`} className={`absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity duration-1000 ${index === active ? 'opacity-85' : 'opacity-0'}`} />)}
    {property.images.length > 1 && <div className="absolute right-4 top-4 flex items-center gap-1.5">
      <button type="button" onClick={() => move(-1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f1e5]/85 text-[#19382f] transition-colors hover:bg-[#e8c979]" aria-label={`Previous image of ${property.title}`}><ChevronLeft className="h-4 w-4" /></button>
      <span className="rounded-full bg-[#f6f1e5]/85 px-3 py-2 font-mono-label text-[9px] text-[#19382f]">{String(active + 1).padStart(2, '0')} / {String(property.images.length).padStart(2, '0')}</span>
      <button type="button" onClick={() => move(1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f1e5]/85 text-[#19382f] transition-colors hover:bg-[#e8c979]" aria-label={`Next image of ${property.title}`}><ChevronRight className="h-4 w-4" /></button>
    </div>}
  </div>;
}

function PropertyCard({ property, large = false }: { property: Property; large?: boolean }) {
  return <article className={`group relative overflow-hidden bg-[#19382f] ${large ? 'min-h-[570px]' : 'min-h-[285px]'}`} data-testid={`card-property-${property.id}`}>
    <PropertyCarousel property={property} />
    <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#19382f]/95 via-[#19382f]/15 to-transparent pointer-events-none" />
    <div className="relative z-[4] flex h-full min-h-[inherit] flex-col justify-between p-5 lg:p-7"><div><span className={`px-3 py-2 font-mono-label text-[9px] ${property.tone}`}>{property.label}</span></div><div className="flex items-end justify-between gap-5"><div><h3 className={`max-w-[430px] font-display leading-[.95] text-[#f6f1e5] ${large ? 'text-5xl lg:text-6xl' : 'text-3xl'}`}>{property.title}</h3><p className="mt-3 font-mono-label text-[9px] text-[#f6f1e5]/65">{property.meta}</p></div><a href="#contact" className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-sm bg-[#e8c979] px-4 font-mono-label text-[10px] text-[#19382f] transition-colors hover:bg-[#f6f1e5]" aria-label={`Enquire about ${property.title}`} data-testid={`link-enquire-${property.id}`}>Enquire <ArrowUpRight className="h-4 w-4" /></a></div></div>
  </article>;
}

function PropertyGallery({ property }: { property: Property }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" data-testid={`gallery-property-${property.id}`}>
    {property.images.map((image, index) => <img key={image} src={asset(image)} alt={`${property.title}, gallery image ${index + 1}`} className={`h-48 w-full object-cover sm:h-64 ${index === 0 ? 'col-span-2 sm:col-span-2' : ''}`} />)}
  </div>;
}

function PropertiesPage() {
  const [properties] = useStoredContent<Property[]>('igrey-properties', defaultProperties);
  return <div className="min-h-[100dvh] bg-[#f6f1e5] text-[#19382f]">
    <section className="bg-[#19382f] text-[#f6f1e5]">
      <Header />
      <div className="mx-auto max-w-[1320px] px-5 pb-24 pt-44 lg:px-10 lg:pb-32"><Eyebrow light>ALL LISTED PROPERTIES</Eyebrow><h1 className="mt-8 max-w-[900px] font-display text-[clamp(4rem,10vw,9rem)] leading-[.82] tracking-[-.04em]">Find your<br /><em className="text-[#e8c979]">place.</em></h1><p className="mt-10 max-w-[520px] text-lg leading-8 text-[#f6f1e5]/70">Explore the homes currently on our list, with the details and context you need before you enquire.</p></div>
    </section>
    <main className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-28">
      <div className="space-y-24">{properties.map((property, index) => <article key={property.id} id={property.id} className="border-t border-[#d9d1c0] pt-8" data-testid={`property-detail-${property.id}`}><div className="mb-10 flex flex-wrap items-start justify-between gap-6"><div><span className={`inline-flex px-3 py-2 font-mono-label text-[9px] ${property.tone}`}>{property.label}</span><h2 className="mt-6 max-w-[720px] font-display text-5xl leading-[.9] lg:text-7xl">{property.title}</h2></div><span className="font-mono-label text-[10px] text-[#19382f]/55">0{index + 1} / 0{properties.length}</span></div><div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-start"><PropertyGallery property={property} /><div className="lg:pt-4"><p className="font-mono-label text-[10px] tracking-[.14em] text-[#bd674e]">{property.meta}</p><p className="mt-7 text-lg leading-8 text-[#19382f]/70">{property.details}</p><div className="mt-8 grid grid-cols-1 border-y border-[#d9d1c0]">{property.features.map((feature) => <div key={feature} className="border-b border-[#d9d1c0] py-4 font-mono-label text-[10px] text-[#19382f]/70 last:border-b-0">{feature}</div>)}</div><a href="/#contact" className="group mt-9 inline-flex items-center gap-4 bg-[#19382f] px-6 py-4 font-mono-label text-[10px] text-[#f6f1e5] transition-colors hover:bg-[#bd674e]" data-testid={`link-enquire-detail-${property.id}`}>Enquire about this property <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a></div></div></article>)}</div>
    </main>
    <Footer />
  </div>;
}

function ContactAndFaq() {
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <section id="contact" className="bg-[#f6f1e5] px-5 py-24 lg:px-10 lg:py-36">
    <div className="mx-auto grid max-w-[1320px] gap-20 lg:grid-cols-[.82fr_1.18fr]">
      <div><Eyebrow>LET'S TALK PROPERTY</Eyebrow><h2 className="mt-7 max-w-[480px] font-display text-6xl leading-[.88] text-[#19382f] lg:text-8xl">A good<br /><em>conversation</em><br />starts here.</h2><p className="mt-8 max-w-[330px] text-sm leading-6 text-[#19382f]/65">Tell us what you are looking for. A home, a tenant, a second opinion—we will take it from there.</p><div className="mt-12 flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8c979] text-[#19382f]"><Clock3 className="h-4 w-4" /></div><div><p className="font-mono-label text-[9px] text-[#19382f]">RESPONSE TIME</p><p className="mt-1 text-sm text-[#19382f]/60">Usually within one working day</p></div></div></div>
      <div className="border-t border-[#d9d1c0] pt-7">
        {sent ? <div className="flex min-h-[390px] flex-col justify-center bg-[#19382f] p-8 text-[#f6f1e5] lg:p-12" data-testid="status-contact-success"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8c979] text-[#19382f]"><Check className="h-7 w-7" /></div><h3 className="mt-8 font-display text-5xl leading-none">We have your note.</h3><p className="mt-5 max-w-[370px] text-sm leading-6 text-[#f6f1e5]/70">Thank you for reaching out. Someone from our Bangalore team will be in touch within one working day.</p><button onClick={() => setSent(false)} className="mt-9 w-fit border-b border-[#e8c979] pb-2 font-mono-label text-[10px] text-[#e8c979]" data-testid="button-send-another">Send another note</button></div> :
          <form onSubmit={submit} className="grid gap-7" data-testid="form-contact"><div className="grid gap-7 md:grid-cols-3"><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">YOUR NAME</span><input required name="name" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none transition-colors placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="How should we call you?" data-testid="input-contact-name" /></label><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">MOBILE NUMBER</span><input required type="tel" name="mobile" inputMode="tel" autoComplete="tel" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none transition-colors placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="+91 98765 43210" data-testid="input-contact-mobile" /></label><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">EMAIL ADDRESS</span><input required type="email" name="email" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none transition-colors placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="you@example.com" data-testid="input-contact-email" /></label></div><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">I AM LOOKING TO</span><select name="intent" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none focus:border-[#bd674e]" data-testid="select-contact-intent"><option>Rent or lease a home</option><option>Buy a property</option><option>List my property</option><option>Talk to an advisor</option></select></label><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">A LITTLE MORE</span><textarea name="message" rows={3} className="resize-none border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="Neighbourhood, budget, a property you have in mind…" data-testid="textarea-contact-message" /></label><button type="submit" className="group flex w-fit items-center gap-4 bg-[#19382f] px-6 py-4 font-mono-label text-[10px] text-[#f6f1e5] transition-colors hover:bg-[#bd674e]" data-testid="button-submit-contact">Send enquiry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></form>}
      </div>
    </div>
    <div className="mx-auto mt-28 grid max-w-[1320px] gap-10 border-t border-[#d9d1c0] pt-20 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>GOOD TO KNOW</Eyebrow><h2 className="mt-6 font-display text-6xl leading-none text-[#19382f]">Questions,<br /><em>answered.</em></h2></div><div>{faqs.map(([question, answer], index) => <div key={question} className="border-t border-[#d9d1c0] py-5"><button onClick={() => setExpanded(expanded === index ? null : index)} className="flex w-full items-center justify-between gap-6 text-left" data-testid={`button-faq-${index}`}><span className="font-display text-2xl text-[#19382f]">{question}</span>{expanded === index ? <ChevronUp className="h-5 w-5 shrink-0 text-[#bd674e]" /> : <ChevronDown className="h-5 w-5 shrink-0 text-[#bd674e]" />}</button>{expanded === index && <p className="max-w-[600px] pt-4 text-sm leading-6 text-[#19382f]/60" data-testid={`text-faq-answer-${index}`}>{answer}</p>}</div>)}</div></div>
  </section>;
}

function Footer() {
  return <footer className="bg-[#19382f] px-5 pb-8 pt-16 text-[#f6f1e5] lg:px-10"><div className="mx-auto max-w-[1320px]"><div className="grid gap-12 border-b border-[#f6f1e5]/15 pb-14 lg:grid-cols-[1.3fr_.7fr_.7fr]"><div><Logo invert /><p className="mt-8 max-w-[280px] text-sm leading-6 text-[#f6f1e5]/55">Property, with perspective.<br />Bangalore and beyond.</p></div><div><p className="font-mono-label text-[9px] text-[#e8c979]">EXPLORE</p><div className="mt-5 flex flex-col gap-3 text-sm text-[#f6f1e5]/70"><Link href="/" data-testid="link-footer-home">Home</Link><a href="#services" data-testid="link-footer-services">Services</a><Link href="/properties" data-testid="link-footer-properties">Properties</Link><Link href="/careers" data-testid="link-footer-careers">Careers</Link><Link href="/admin" data-testid="link-footer-admin">Admin</Link></div></div><div><p className="font-mono-label text-[9px] text-[#e8c979]">FIND US</p><div className="mt-5 flex flex-col gap-3 text-sm text-[#f6f1e5]/70"><a href="mailto:hello@igreyholdings.com" data-testid="link-footer-email">hello@igreyholdings.com</a><span>Indiranagar, Bangalore</span><div className="flex items-center gap-4 pt-2"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-testid="link-footer-linkedin"><Linkedin className="h-4 w-4 transition-colors hover:text-[#e8c979]" /></a><a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="link-footer-instagram"><Instagram className="h-4 w-4 transition-colors hover:text-[#e8c979]" /></a><a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" data-testid="link-footer-facebook"><Facebook className="h-4 w-4 transition-colors hover:text-[#e8c979]" /></a></div></div></div></div><div className="flex flex-wrap items-center justify-between gap-4 pt-7 font-mono-label text-[9px] text-[#f6f1e5]/35"><span>© 2025</span><div className="flex flex-wrap gap-x-6 gap-y-2"><a href="#terms-and-conditions" data-testid="link-footer-terms">Terms &amp; Conditions</a><a href="#privacy-policy" data-testid="link-footer-privacy">Privacy Policy</a><a href="#refund-replacement" data-testid="link-footer-refund">Refund &amp; Replacement</a></div><span>A BETTER PERSPECTIVE</span></div></div></footer>;
}

function LegacyCareersPage() {
  const openings = [
    ['Property Relationship Lead', 'Bangalore · Full-time', 'Own the conversations that turn a first enquiry into a lasting relationship.'],
    ['Real Estate Advisor', 'Bangalore · Full-time', 'Bring curiosity, local knowledge and a clear point of view to every search.'],
    ['Property Care Coordinator', 'Bangalore · Full-time', 'Make the everyday experience of owning and renting feel remarkably looked after.'],
  ];
  return <div className="min-h-[100dvh] bg-[#f6f1e5] text-[#19382f]"><div className="bg-[#19382f] text-[#f6f1e5]"><Header /><div className="mx-auto max-w-[1320px] px-5 pb-24 pt-44 lg:px-10 lg:pb-32"><Eyebrow light>COME BUILD THE LONG VIEW</Eyebrow><h1 className="mt-8 max-w-[950px] font-display text-[clamp(4rem,10vw,9rem)] leading-[.82] tracking-[-.04em]">Make property<br /><em className="text-[#e8c979]">feel human.</em></h1><div className="mt-12 flex max-w-[700px] items-end justify-between gap-8"><p className="text-lg leading-8 text-[#f6f1e5]/70">We are building a more thoughtful property company for Bangalore. If you notice the small things and care about the outcome, there may be a place for you here.</p><div className="hidden h-20 w-20 shrink-0 rounded-full border border-[#e8c979]/50 sm:flex sm:items-center sm:justify-center"><ArrowDownRight className="h-6 w-6 text-[#e8c979]" /></div></div></div></div><main><section className="mx-auto max-w-[1320px] px-5 py-24 lg:px-10 lg:py-32"><div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>WHY IGREY</Eyebrow><h2 className="mt-7 font-display text-6xl leading-[.9] lg:text-8xl">Work with<br /><em>weight.</em></h2></div><div className="grid gap-8 sm:grid-cols-2"><div className="border-t border-[#d9d1c0] pt-5"><ShieldCheck className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Do the honest work</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">We say what we know, what we do not, and what happens next.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Sparkles className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Stay curious</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">Every neighbourhood, home and person has more to teach us.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Home className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Leave things better</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">We measure ourselves by the care that remains after the deal.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Compass className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Think local, look far</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">Bangalore is our context. Better property is our ambition.</p></div></div></div></section><section className="bg-[#e8c979] px-5 py-24 lg:px-10"><div className="mx-auto max-w-[1320px]"><div className="flex items-end justify-between gap-8"><div><Eyebrow>OPEN POSITIONS</Eyebrow><h2 className="mt-6 font-display text-6xl leading-none lg:text-8xl">Find your<br /><em>place.</em></h2></div><span className="hidden font-mono-label text-[10px] text-[#19382f]/60 md:block">03 ROLES / BANGALORE</span></div><div className="mt-16 border-t border-[#19382f]/25">{openings.map(([role, meta, copy], index) => <div key={role} className="group grid gap-5 border-b border-[#19382f]/25 py-8 md:grid-cols-[1fr_.65fr_auto] md:items-center" data-testid={`card-opening-${index}`}><div><h3 className="font-display text-3xl lg:text-4xl">{role}</h3><p className="mt-2 font-mono-label text-[9px] text-[#19382f]/60">{meta}</p></div><p className="max-w-[270px] text-sm leading-6 text-[#19382f]/65">{copy}</p><a href="mailto:careers@igreyholdings.com?subject=Joining iGrey" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#19382f]/35 transition-all group-hover:bg-[#19382f] group-hover:text-[#f6f1e5]" aria-label={`Apply for ${role}`} data-testid={`link-apply-${index}`}><ArrowUpRight className="h-5 w-5" /></a></div>)}</div></div></section><section className="bg-[#bd674e] px-5 py-24 text-[#f6f1e5] lg:px-10"><div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-10"><div><p className="font-mono-label text-[10px] tracking-[.2em] text-[#e8c979]">NO PERFECT FIT?</p><h2 className="mt-6 max-w-[700px] font-display text-6xl leading-[.88] lg:text-8xl">Tell us what<br /><em>you see.</em></h2></div><a href="mailto:careers@igreyholdings.com" className="group flex items-center gap-4 border-b border-[#e8c979] pb-3 font-mono-label text-[10px] text-[#e8c979]" data-testid="link-careers-general">careers@igreyholdings.com <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a></div></section></main><Footer /></div>;
}

function CareersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [careerOpenings] = useStoredContent<CareerOpening[]>('igrey-careers', defaultCareerOpenings);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); };

  return <div className="min-h-[100dvh] bg-[#f6f1e5] text-[#19382f]">
    <div className="bg-[#19382f] text-[#f6f1e5]"><Header /><div className="mx-auto max-w-[1320px] px-5 pb-24 pt-44 lg:px-10 lg:pb-32"><Eyebrow light>COME BUILD THE LONG VIEW</Eyebrow><h1 className="mt-8 max-w-[950px] font-display text-[clamp(4rem,10vw,9rem)] leading-[.82] tracking-[-.04em]">Make property<br /><em className="text-[#e8c979]">feel human.</em></h1><p className="mt-12 max-w-[700px] text-lg leading-8 text-[#f6f1e5]/70">We are building a more thoughtful property company for Bangalore. If you notice the small things and care about the outcome, there may be a place for you here.</p></div></div>
    <main>
      <section className="mx-auto max-w-[1320px] px-5 py-24 lg:px-10 lg:py-32"><div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>WHY IGREY</Eyebrow><h2 className="mt-7 font-display text-6xl leading-[.9] lg:text-8xl">Work with<br /><em>weight.</em></h2></div><div className="grid gap-8 sm:grid-cols-2"><div className="border-t border-[#d9d1c0] pt-5"><ShieldCheck className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Do the honest work</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">We say what we know, what we do not, and what happens next.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Sparkles className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Stay curious</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">Every neighbourhood, home and person has more to teach us.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Home className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Leave things better</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">We measure ourselves by the care that remains after the deal.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Compass className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Think local, look far</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">Bangalore is our context. Better property is our ambition.</p></div></div></div></section>
      <section className="bg-[#e8c979] px-5 py-24 lg:px-10"><div className="mx-auto max-w-[1320px]"><div className="flex items-end justify-between gap-8"><div><Eyebrow>OPEN POSITIONS</Eyebrow><h2 className="mt-6 font-display text-6xl leading-none lg:text-8xl">Find your<br /><em>place.</em></h2></div><span className="hidden font-mono-label text-[10px] text-[#19382f]/60 md:block">{careerOpenings.length.toString().padStart(2, '0')} ROLES / BANGALORE</span></div><div className="mt-16 border-t border-[#19382f]/25">{careerOpenings.map(([role, meta, copy], index) => <div key={role} className="grid gap-5 border-b border-[#19382f]/25 py-8 md:grid-cols-[1fr_.8fr]" data-testid={`card-opening-${index}`}><div><h3 className="font-display text-3xl lg:text-4xl">{role}</h3><p className="mt-2 font-mono-label text-[9px] text-[#19382f]/60">{meta}</p></div><p className="max-w-[340px] text-sm leading-6 text-[#19382f]/65">{copy}</p></div>)}</div></div></section>
      <section id="apply" className="bg-[#f6f1e5] px-5 py-24 lg:px-10 lg:py-32"><div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>MAKE YOUR MOVE</Eyebrow><h2 className="mt-7 max-w-[430px] font-display text-6xl leading-[.9] lg:text-8xl">Apply to<br /><em>join us.</em></h2><p className="mt-8 max-w-[330px] text-sm leading-6 text-[#19382f]/65">Tell us what you do well and where you want to grow. Our Bangalore team will review your details and get back to you.</p></div><div className="border-t border-[#d9d1c0] pt-7">{submitted ? <div className="flex min-h-[450px] flex-col justify-center bg-[#19382f] p-8 text-[#f6f1e5] lg:p-12" data-testid="status-careers-success"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8c979] text-[#19382f]"><Check className="h-7 w-7" /></div><h3 className="mt-8 font-display text-5xl leading-none">Application received.</h3><p className="mt-5 max-w-[390px] text-sm leading-6 text-[#f6f1e5]/70">Thank you for sharing your details. The iGrey team will be in touch if your experience is a fit for one of our roles.</p><button type="button" onClick={() => setSubmitted(false)} className="mt-9 w-fit border-b border-[#e8c979] pb-2 font-mono-label text-[10px] text-[#e8c979]" data-testid="button-submit-another-application">Submit another application</button></div> : <form onSubmit={submit} className="grid gap-7" data-testid="form-careers-application"><div className="grid gap-7 md:grid-cols-2"><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">FULL NAME</span><input required name="name" autoComplete="name" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 outline-none placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="Your name" data-testid="input-application-name" /></label><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">EMAIL ADDRESS</span><input required type="email" name="email" autoComplete="email" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 outline-none placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="you@example.com" data-testid="input-application-email" /></label></div><div className="grid gap-7 md:grid-cols-2"><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">MOBILE NUMBER</span><input required type="tel" name="mobile" inputMode="tel" autoComplete="tel" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 outline-none placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="+91 98765 43210" data-testid="input-application-mobile" /></label><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">ROLE OF INTEREST</span><select required name="role" defaultValue="" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 outline-none focus:border-[#bd674e]" data-testid="select-application-role"><option value="" disabled>Select a role</option>{careerOpenings.map(([role]) => <option key={role}>{role}</option>)}</select></label></div><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">TELL US ABOUT YOURSELF</span><textarea required name="message" rows={5} className="resize-none border-b border-[#19382f]/25 bg-transparent px-0 py-3 outline-none placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="A little about your experience, interests and what you would bring to iGrey…" data-testid="textarea-application-message" /></label><button type="submit" className="group flex w-fit items-center gap-4 bg-[#19382f] px-6 py-4 font-mono-label text-[10px] text-[#f6f1e5] transition-colors hover:bg-[#bd674e]" data-testid="button-submit-application">Submit application <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></form>}</div></div></section>
    </main>
    <Footer />
  </div>;
}

const adminInputClass = 'w-full border-b border-[#19382f]/20 bg-transparent px-0 py-3 text-sm text-[#19382f] outline-none transition-colors placeholder:text-[#19382f]/35 focus:border-[#bd674e]';
const adminLabelClass = 'font-mono-label text-[9px] tracking-[.15em] text-[#19382f]/55';

function emptyProperty(): Property {
  return { id: '', label: 'NEW LISTING', title: '', meta: '', images: [], tone: 'text-[#f6f1e5] bg-[#bd674e]', details: '', features: [] };
}

function makePropertyId(title: string, existingIds: string[]) {
  const base = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'property';
  if (!existingIds.includes(base)) return base;
  let suffix = 2;
  while (existingIds.includes(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function AdminPage() {
  const [properties, setProperties] = useStoredContent<Property[]>('igrey-properties', defaultProperties);
  const [careerOpenings, setCareerOpenings] = useStoredContent<CareerOpening[]>('igrey-careers', defaultCareerOpenings);
  const [section, setSection] = useState<'properties' | 'careers'>('properties');
  const [propertyForm, setPropertyForm] = useState<Property>(emptyProperty);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [careerForm, setCareerForm] = useState({ role: '', meta: 'Bangalore · Full-time', copy: '' });
  const [editingCareerIndex, setEditingCareerIndex] = useState<number | null>(null);
  const [savedMessage, setSavedMessage] = useState('');

  const startNewProperty = () => {
    setEditingPropertyId(null);
    setPropertyForm(emptyProperty());
    setSavedMessage('');
  };

  const editProperty = (property: Property) => {
    setEditingPropertyId(property.id);
    setPropertyForm({ ...property, images: [...property.images], features: [...property.features] });
    setSavedMessage('');
  };

  const saveProperty = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextProperty = { ...propertyForm, id: editingPropertyId ?? makePropertyId(propertyForm.title, properties.map((item) => item.id)) };
    setProperties((current) => editingPropertyId ? current.map((item) => item.id === editingPropertyId ? nextProperty : item) : [...current, nextProperty]);
    setEditingPropertyId(nextProperty.id);
    setPropertyForm(nextProperty);
    setSavedMessage('Property saved');
  };

  const editCareer = (index: number) => {
    const [role, meta, copy] = careerOpenings[index];
    setEditingCareerIndex(index);
    setCareerForm({ role, meta, copy });
    setSavedMessage('');
  };

  const startNewCareer = () => {
    setEditingCareerIndex(null);
    setCareerForm({ role: '', meta: 'Bangalore · Full-time', copy: '' });
    setSavedMessage('');
  };

  const saveCareer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextCareer: CareerOpening = [careerForm.role.trim(), careerForm.meta.trim(), careerForm.copy.trim()];
    setCareerOpenings((current) => editingCareerIndex === null ? [...current, nextCareer] : current.map((item, index) => index === editingCareerIndex ? nextCareer : item));
    setSavedMessage('Career role saved');
  };

  return <div className="min-h-[100dvh] bg-[#f6f1e5] text-[#19382f]">
    <div className="bg-[#19382f] text-[#f6f1e5]"><Header /><div className="mx-auto max-w-[1320px] px-5 pb-20 pt-40 lg:px-10"><Eyebrow light>PRIVATE WORKSPACE</Eyebrow><div className="mt-7 flex flex-wrap items-end justify-between gap-8"><div><h1 className="font-display text-6xl leading-[.88] lg:text-8xl">Manage the<br /><em className="text-[#e8c979]">details.</em></h1><p className="mt-8 max-w-[490px] text-sm leading-6 text-[#f6f1e5]/65">Add and edit the property listings and career roles shown across the public site.</p></div><span className="font-mono-label text-[9px] text-[#e8c979]">ADMIN / CONTENT</span></div></div></div>
    <main className="mx-auto max-w-[1320px] px-5 py-12 lg:px-10 lg:py-20">
      <div className="mb-12 flex flex-wrap items-center justify-between gap-5 border-b border-[#d9d1c0] pb-5"><div className="flex gap-2" role="tablist" aria-label="Admin content type"><button type="button" role="tab" aria-selected={section === 'properties'} onClick={() => setSection('properties')} className={`px-4 py-3 font-mono-label text-[10px] ${section === 'properties' ? 'bg-[#19382f] text-[#f6f1e5]' : 'border border-[#19382f]/20 text-[#19382f]/65'}`} data-testid="tab-admin-properties">Properties</button><button type="button" role="tab" aria-selected={section === 'careers'} onClick={() => setSection('careers')} className={`px-4 py-3 font-mono-label text-[10px] ${section === 'careers' ? 'bg-[#19382f] text-[#f6f1e5]' : 'border border-[#19382f]/20 text-[#19382f]/65'}`} data-testid="tab-admin-careers">Careers</button></div><span className="text-sm text-[#19382f]/55">{savedMessage}</span></div>
      {section === 'properties' ? <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div><div className="flex items-center justify-between gap-4"><div><Eyebrow>LISTINGS</Eyebrow><p className="mt-2 text-sm text-[#19382f]/55">{properties.length} properties</p></div><button type="button" onClick={startNewProperty} className="inline-flex items-center gap-2 border border-[#19382f]/25 px-4 py-3 font-mono-label text-[10px] hover:border-[#bd674e] hover:text-[#bd674e]" data-testid="button-add-property"><Plus className="h-3.5 w-3.5" /> Add property</button></div><div className="mt-8 divide-y divide-[#d9d1c0] border-y border-[#d9d1c0]">{properties.map((property) => <div key={property.id} className={`flex items-center justify-between gap-4 py-5 ${editingPropertyId === property.id ? 'bg-[#e8c979]/20' : ''}`}><div className="min-w-0"><p className="font-mono-label text-[9px] text-[#bd674e]">{property.label}</p><h2 className="mt-2 truncate font-display text-2xl">{property.title || 'Untitled property'}</h2><p className="mt-1 truncate text-xs text-[#19382f]/55">{property.meta}</p></div><button type="button" onClick={() => editProperty(property)} className="inline-flex shrink-0 items-center gap-2 border-b border-[#19382f]/30 pb-1 font-mono-label text-[9px] hover:border-[#bd674e] hover:text-[#bd674e]" data-testid={`button-edit-property-${property.id}`}><Pencil className="h-3 w-3" /> Edit</button></div>)}</div></div>
        <form onSubmit={saveProperty} className="border-t border-[#d9d1c0] pt-5" data-testid="form-admin-property"><div className="flex items-start justify-between gap-5"><div><Eyebrow>{editingPropertyId ? 'EDIT PROPERTY' : 'NEW PROPERTY'}</Eyebrow><h2 className="mt-4 font-display text-4xl">{editingPropertyId ? propertyForm.title || 'Untitled property' : 'Add a listing'}</h2></div>{editingPropertyId && <button type="button" onClick={startNewProperty} className="font-mono-label text-[9px] text-[#19382f]/60 hover:text-[#bd674e]" data-testid="button-new-property">+ New property</button>}</div><div className="mt-9 grid gap-7"><label className="grid gap-2"><span className={adminLabelClass}>PROPERTY TITLE</span><input required value={propertyForm.title} onChange={(event) => setPropertyForm((current) => ({ ...current, title: event.target.value }))} className={adminInputClass} placeholder="Sunlit three-bed in Indiranagar" data-testid="input-admin-property-title" /></label><div className="grid gap-7 md:grid-cols-2"><label className="grid gap-2"><span className={adminLabelClass}>STATUS LABEL</span><input required value={propertyForm.label} onChange={(event) => setPropertyForm((current) => ({ ...current, label: event.target.value }))} className={adminInputClass} placeholder="NEW LISTING" data-testid="input-admin-property-label" /></label><label className="grid gap-2"><span className={adminLabelClass}>META / PRICE</span><input required value={propertyForm.meta} onChange={(event) => setPropertyForm((current) => ({ ...current, meta: event.target.value }))} className={adminInputClass} placeholder="3 BHK · 2,140 sq ft · Lease terms on request" data-testid="input-admin-property-meta" /></label></div><label className="grid gap-2"><span className={adminLabelClass}>DESCRIPTION</span><textarea required rows={3} value={propertyForm.details} onChange={(event) => setPropertyForm((current) => ({ ...current, details: event.target.value }))} className={`${adminInputClass} resize-none`} placeholder="A considered home close to the everyday rhythm of Bangalore." data-testid="textarea-admin-property-details" /></label><label className="grid gap-2"><span className={adminLabelClass}>IMAGE FILENAMES</span><input value={propertyForm.images.join(', ')} onChange={(event) => setPropertyForm((current) => ({ ...current, images: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className={adminInputClass} placeholder="property-living.jpg, property-villa.jpg" data-testid="input-admin-property-images" /><span className="text-xs text-[#19382f]/45">Use files already in public/assets, separated by commas.</span></label><label className="grid gap-2"><span className={adminLabelClass}>FEATURES</span><input required value={propertyForm.features.join(', ')} onChange={(event) => setPropertyForm((current) => ({ ...current, features: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className={adminInputClass} placeholder="3 bedrooms, 2,140 sq ft, Lease terms on request" data-testid="input-admin-property-features" /></label><label className="grid gap-2"><span className={adminLabelClass}>COLOUR TREATMENT</span><select value={propertyForm.tone} onChange={(event) => setPropertyForm((current) => ({ ...current, tone: event.target.value }))} className={adminInputClass} data-testid="select-admin-property-tone"><option value="text-[#eddca9] bg-[#19382f]">Green / cream</option><option value="text-[#19382f] bg-[#e8c979]">Gold / green</option><option value="text-[#f6f1e5] bg-[#bd674e]">Terracotta / cream</option></select></label><button type="submit" className="inline-flex w-fit items-center gap-3 bg-[#19382f] px-5 py-4 font-mono-label text-[10px] text-[#f6f1e5] hover:bg-[#bd674e]" data-testid="button-save-property"><Save className="h-4 w-4" /> Save property</button></div></form>
      </div> : <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div><div className="flex items-center justify-between gap-4"><div><Eyebrow>OPEN ROLES</Eyebrow><p className="mt-2 text-sm text-[#19382f]/55">{careerOpenings.length} roles</p></div><button type="button" onClick={startNewCareer} className="inline-flex items-center gap-2 border border-[#19382f]/25 px-4 py-3 font-mono-label text-[10px] hover:border-[#bd674e] hover:text-[#bd674e]" data-testid="button-add-career"><Plus className="h-3.5 w-3.5" /> Add role</button></div><div className="mt-8 divide-y divide-[#d9d1c0] border-y border-[#d9d1c0]">{careerOpenings.map(([role, meta, copy], index) => <div key={`${role}-${index}`} className={`flex items-center justify-between gap-4 py-5 ${editingCareerIndex === index ? 'bg-[#e8c979]/20' : ''}`}><div className="min-w-0"><h2 className="truncate font-display text-2xl">{role || 'Untitled role'}</h2><p className="mt-1 truncate text-xs text-[#19382f]/55">{meta}</p></div><button type="button" onClick={() => editCareer(index)} className="inline-flex shrink-0 items-center gap-2 border-b border-[#19382f]/30 pb-1 font-mono-label text-[9px] hover:border-[#bd674e] hover:text-[#bd674e]" data-testid={`button-edit-career-${index}`}><Pencil className="h-3 w-3" /> Edit</button></div>)}</div></div>
        <form onSubmit={saveCareer} className="border-t border-[#d9d1c0] pt-5" data-testid="form-admin-career"><div className="flex items-start justify-between gap-5"><div><Eyebrow>{editingCareerIndex === null ? 'NEW ROLE' : 'EDIT ROLE'}</Eyebrow><h2 className="mt-4 font-display text-4xl">{careerForm.role || 'Add a role'}</h2></div>{editingCareerIndex !== null && <button type="button" onClick={startNewCareer} className="font-mono-label text-[9px] text-[#19382f]/60 hover:text-[#bd674e]" data-testid="button-new-career">+ New role</button>}</div><div className="mt-9 grid gap-7"><label className="grid gap-2"><span className={adminLabelClass}>ROLE TITLE</span><input required value={careerForm.role} onChange={(event) => setCareerForm((current) => ({ ...current, role: event.target.value }))} className={adminInputClass} placeholder="Relationship Manager" data-testid="input-admin-career-role" /></label><label className="grid gap-2"><span className={adminLabelClass}>LOCATION / TYPE</span><input required value={careerForm.meta} onChange={(event) => setCareerForm((current) => ({ ...current, meta: event.target.value }))} className={adminInputClass} placeholder="Bangalore · Full-time" data-testid="input-admin-career-meta" /></label><label className="grid gap-2"><span className={adminLabelClass}>ROLE DESCRIPTION</span><textarea required rows={5} value={careerForm.copy} onChange={(event) => setCareerForm((current) => ({ ...current, copy: event.target.value }))} className={`${adminInputClass} resize-none`} placeholder="Describe the kind of work this person will own." data-testid="textarea-admin-career-copy" /></label><button type="submit" className="inline-flex w-fit items-center gap-3 bg-[#19382f] px-5 py-4 font-mono-label text-[10px] text-[#f6f1e5] hover:bg-[#bd674e]" data-testid="button-save-career"><Save className="h-4 w-4" /> Save role</button></div></form>
      </div>}
    </main>
    <Footer />
  </div>;
}

function WhatsAppButton() {
  const message = encodeURIComponent("Hi iGrey Holdings, I would like to know more about your properties.");
  return <a href={`https://wa.me/?text=${message}`} target="_blank" rel="noreferrer" aria-label="Chat with iGrey Holdings on WhatsApp" title="Chat on WhatsApp" className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:scale-105 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3" data-testid="link-whatsapp"><MessageCircle className="h-6 w-6" /><span className="hidden font-mono-label text-[10px] sm:inline">Chat on WhatsApp</span></a>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={HomePage} /><Route path="/properties" component={PropertiesPage} /><Route path="/careers" component={CareersPage} /><Route path="/admin" component={AdminPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><WhatsAppButton /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;