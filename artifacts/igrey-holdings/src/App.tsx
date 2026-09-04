import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronUp, Clock3, Compass, Home, Linkedin, Menu, Plus, Quote, ShieldCheck, Sparkles, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;
const logo = asset('igrey-logo.png');

const properties = [
  { id: 'indiranagar', label: 'LEASED', title: 'Sunlit three-bed in Indiranagar', meta: '3 BHK · 2,140 sq ft · ₹1.8L / month', image: 'property-living.jpg', tone: 'text-[#eddca9] bg-[#19382f]' },
  { id: 'whitefield', label: 'FOR SALE', title: 'A quiet villa in Whitefield', meta: '4 BHK · 3,860 sq ft · ₹4.25 Cr', image: 'property-villa.jpg', tone: 'text-[#19382f] bg-[#e8c979]' },
  { id: 'koramangala', label: 'NEW LISTING', title: 'Terrace home, Koramangala', meta: '3 BHK · 2,480 sq ft · ₹2.35L / month', image: 'property-terrace.jpg', tone: 'text-[#f6f1e5] bg-[#bd674e]' },
];

const faqs = [
  ['How does iGrey verify a property?', 'We review ownership documents, match details across records, visit the property, and speak with the people who manage it. You receive the useful facts before you spend time on a viewing.'],
  ['Do you work with owners and tenants?', 'Both. We help owners position, price and protect their property, while giving tenants a clear route from shortlist to move-in and beyond.'],
  ['Which parts of Bangalore do you cover?', 'Our home ground is Bangalore, with an active network across Indiranagar, Koramangala, HSR, Whitefield, Hebbal and the neighbourhoods in between.'],
  ['Can iGrey help with a property I already own?', 'Yes. Our advisory and property care teams can step in at any stage—from a first rental assessment to ongoing tenant coordination and renewal support.'],
];

function Logo({ invert = false }: { invert?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${invert ? 'brightness-0 invert' : ''}`} data-testid="link-brand">
      <img src={logo} alt="iGrey Holdings" className="h-12 w-12 object-contain" data-testid="img-brand-logo" />
      <span className="hidden text-[10px] font-mono-label leading-tight tracking-[.18em] sm:block">IGREY<br />HOLDINGS</span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [
    ['Our approach', location === '/' ? '#about' : '/#about'],
    ['Services', location === '/' ? '#services' : '/#services'],
    ['Properties', location === '/' ? '#properties' : '/#properties'],
    ['Careers', '/careers'],
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
            <Link key={href} href={href} className="text-[11px] font-mono-label text-[#f6f1e5]/80 transition-colors hover:text-[#e8c979]" data-testid="link-nav-careers">{label}</Link>
          ))}
          <a href="#contact" className="rounded-full border border-[#f6f1e5]/40 px-5 py-3 text-[10px] font-mono-label text-[#f6f1e5] transition-all hover:border-[#e8c979] hover:bg-[#e8c979] hover:text-[#19382f]" data-testid="link-nav-contact">Start a conversation <ArrowRight className="ml-2 inline h-3 w-3" /></a>
        </nav>
        <button className="rounded-full border border-[#f6f1e5]/35 p-3 text-[#f6f1e5] md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation" data-testid="button-mobile-menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && <div className="mx-4 rounded-2xl border border-[#f6f1e5]/15 bg-[#19382f]/95 p-5 shadow-xl md:hidden">
        <div className="flex flex-col gap-5">
          {nav.map(([label, href]) => href.startsWith('#') ? <a key={href} href={href} onClick={close} className="font-mono-label text-xs text-[#f6f1e5]" data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a> : <Link key={href} href={href} onClick={close} className="font-mono-label text-xs text-[#f6f1e5]" data-testid="link-mobile-careers">{label}</Link>)}
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

function HomePage() {
  return <div className="min-h-[100dvh] overflow-hidden bg-[#f6f1e5]">
    <section className="grain relative min-h-[760px] overflow-hidden bg-[#19382f] text-[#f6f1e5]">
      <Header />
      <div className="mx-auto grid min-h-[760px] max-w-[1320px] items-end gap-12 px-5 pb-16 pt-36 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-10 lg:pb-20">
        <div className="relative z-10 max-w-[700px]">
          <div className="reveal"><Eyebrow light>PROPERTY, WITH PERSPECTIVE</Eyebrow></div>
          <h1 className="reveal delay-1 mt-8 max-w-[680px] font-display text-[clamp(4rem,9vw,8.4rem)] leading-[.82] tracking-[-.045em] text-[#f6f1e5]">A better<br /><em className="text-[#e8c979]">perspective.</em></h1>
          <p className="reveal delay-2 mt-9 max-w-[410px] text-[15px] leading-7 text-[#f6f1e5]/70">A clearer way to rent, lease and buy in Bangalore. Human guidance, verified homes, and no fog around the fine print.</p>
          <div className="reveal delay-3 mt-10 flex flex-wrap items-center gap-6"><ArrowLink href="#properties" light>Explore properties</ArrowLink><a href="#about" className="text-[11px] font-mono-label text-[#f6f1e5]/60 transition-colors hover:text-[#f6f1e5]" data-testid="link-hero-approach">How we work <ArrowDownRight className="ml-2 inline h-3.5 w-3.5" /></a></div>
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
      <div className="absolute bottom-6 left-5 font-mono-label text-[9px] tracking-[.18em] text-[#f6f1e5]/40 lg:left-10">SCROLL TO SEE MORE <ArrowDownRight className="ml-2 inline h-3 w-3" /></div>
      <div className="absolute bottom-0 right-0 h-20 w-20 bg-[#e8c979] lg:h-32 lg:w-32" />
    </section>

    <section className="border-b border-[#d9d1c0] bg-[#e8c979] px-5 py-9 lg:px-10">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-7">
        <p className="max-w-[370px] text-[15px] leading-6 text-[#19382f]">For every threshold crossed, there is a story behind it. We make the next step feel considered.</p>
        <div className="flex flex-wrap gap-x-12 gap-y-5 text-[#19382f]">
          <div><strong className="font-display text-4xl">08</strong><span className="ml-3 font-mono-label text-[9px]">years in Bangalore</span></div>
          <div><strong className="font-display text-4xl">1.2k</strong><span className="ml-3 font-mono-label text-[9px]">homes placed</span></div>
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

    <section id="about" className="bg-[#19382f] px-5 py-24 text-[#f6f1e5] lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div className="relative max-w-[560px]">
          <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full border border-[#e8c979]/50" />
          <img src={asset('property-courtyard.jpg')} alt="A considered home in Bangalore" className="image-wash aspect-[.88] w-full rounded-[12px_160px_12px_12px] object-cover opacity-85" data-testid="img-about-home" />
          <div className="absolute -bottom-8 right-7 bg-[#e8c979] px-5 py-4 text-[#19382f]"><span className="block font-display text-3xl">Since 2017</span><span className="font-mono-label text-[9px]">Bangalore, India</span></div>
        </div>
        <div><Eyebrow light>OUR POINT OF VIEW</Eyebrow><h2 className="mt-7 max-w-[580px] font-display text-6xl leading-[.92] lg:text-8xl">Property is personal.</h2><p className="mt-9 max-w-[510px] text-[17px] leading-8 text-[#f6f1e5]/70">A home is not a line item. A lease is not a formality. We built iGrey around the moments where property touches real life—with the patience to listen and the rigour to get things right.</p><p className="mt-5 max-w-[510px] text-[17px] leading-8 text-[#f6f1e5]/70">Our role is simple: make the path legible, then walk it with you.</p><div className="mt-10"><ArrowLink light href="#contact">Meet the team</ArrowLink></div></div>
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
        <div className="flex flex-wrap items-end justify-between gap-8"><div><Eyebrow>THE SHORTLIST</Eyebrow><h2 className="mt-6 max-w-[650px] font-display text-6xl leading-[.88] text-[#19382f] lg:text-8xl">Places with<br /><em>a point of view.</em></h2></div><ArrowLink href="#contact">See all availability</ArrowLink></div>
        <div className="mt-16 grid gap-6 lg:grid-cols-[1.12fr_.88fr]">
          <PropertyCard property={properties[0]} large />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"><PropertyCard property={properties[1]} /><PropertyCard property={properties[2]} /></div>
        </div>
      </div>
    </section>

    <section className="bg-[#bd674e] px-5 py-20 text-[#f6f1e5] lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[1fr_auto]"><div><Quote className="h-10 w-10 text-[#e8c979]" /><blockquote className="mt-7 max-w-[820px] font-display text-4xl leading-[.98] lg:text-6xl">“They did not just find us a home. They helped us understand the decision.”</blockquote><p className="mt-7 font-mono-label text-[10px] tracking-[.16em] text-[#f6f1e5]/70">— ANANYA & RAHUL / INDIRANAGAR</p></div><div className="hidden h-32 w-32 rounded-full border border-[#f6f1e5]/40 lg:block"><div className="flex h-full items-center justify-center"><ArrowDownRight className="h-8 w-8" /></div></div></div>
    </section>

    <ContactAndFaq />
    <Footer />
  </div>;
}

function ArrowUpRightIcon() {
  return <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#19382f]/25 text-[#19382f] transition-all group-hover:border-[#bd674e] group-hover:bg-[#bd674e] group-hover:text-[#f6f1e5]"><ArrowUpRight className="h-4 w-4" /></span>;
}

function PropertyCard({ property, large = false }: { property: typeof properties[number]; large?: boolean }) {
  return <article className={`group relative overflow-hidden bg-[#19382f] ${large ? 'min-h-[570px]' : 'min-h-[285px]'}`} data-testid={`card-property-${property.id}`}>
    <img src={asset(property.image)} alt={property.title} className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105" data-testid={`img-property-${property.id}`} />
    <div className="absolute inset-0 bg-gradient-to-t from-[#19382f]/95 via-[#19382f]/15 to-transparent" />
    <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-5 lg:p-7"><div className="flex justify-between"><span className={`px-3 py-2 font-mono-label text-[9px] ${property.tone}`}>{property.label}</span><button className="rounded-full bg-[#f6f1e5]/90 p-3 text-[#19382f] transition-colors hover:bg-[#e8c979]" aria-label={`Save ${property.title}`} data-testid={`button-save-${property.id}`}><Plus className="h-4 w-4" /></button></div><div className="flex items-end justify-between gap-5"><div><h3 className={`max-w-[430px] font-display leading-[.95] text-[#f6f1e5] ${large ? 'text-5xl lg:text-6xl' : 'text-3xl'}`}>{property.title}</h3><p className="mt-3 font-mono-label text-[9px] text-[#f6f1e5]/65">{property.meta}</p></div><button className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e8c979] text-[#19382f] transition-transform hover:rotate-[-45deg] sm:flex" aria-label={`View ${property.title}`} data-testid={`button-view-${property.id}`}><ArrowUpRight className="h-5 w-5" /></button></div></div>
  </article>;
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
          <form onSubmit={submit} className="grid gap-7" data-testid="form-contact"><div className="grid gap-7 md:grid-cols-2"><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">YOUR NAME</span><input required name="name" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none transition-colors placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="How should we call you?" data-testid="input-contact-name" /></label><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">EMAIL ADDRESS</span><input required type="email" name="email" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none transition-colors placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="you@example.com" data-testid="input-contact-email" /></label></div><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">I AM LOOKING TO</span><select name="intent" className="border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none focus:border-[#bd674e]" data-testid="select-contact-intent"><option>Rent or lease a home</option><option>Buy a property</option><option>List my property</option><option>Talk to an advisor</option></select></label><label className="grid gap-2"><span className="font-mono-label text-[9px] text-[#19382f]/60">A LITTLE MORE</span><textarea name="message" rows={3} className="resize-none border-b border-[#19382f]/25 bg-transparent px-0 py-3 text-[#19382f] outline-none placeholder:text-[#19382f]/30 focus:border-[#bd674e]" placeholder="Neighbourhood, budget, a property you have in mind…" data-testid="textarea-contact-message" /></label><button type="submit" className="group flex w-fit items-center gap-4 bg-[#19382f] px-6 py-4 font-mono-label text-[10px] text-[#f6f1e5] transition-colors hover:bg-[#bd674e]" data-testid="button-submit-contact">Send enquiry <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></form>}
      </div>
    </div>
    <div className="mx-auto mt-28 grid max-w-[1320px] gap-10 border-t border-[#d9d1c0] pt-20 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>GOOD TO KNOW</Eyebrow><h2 className="mt-6 font-display text-6xl leading-none text-[#19382f]">Questions,<br /><em>answered.</em></h2></div><div>{faqs.map(([question, answer], index) => <div key={question} className="border-t border-[#d9d1c0] py-5"><button onClick={() => setExpanded(expanded === index ? null : index)} className="flex w-full items-center justify-between gap-6 text-left" data-testid={`button-faq-${index}`}><span className="font-display text-2xl text-[#19382f]">{question}</span>{expanded === index ? <ChevronUp className="h-5 w-5 shrink-0 text-[#bd674e]" /> : <ChevronDown className="h-5 w-5 shrink-0 text-[#bd674e]" />}</button>{expanded === index && <p className="max-w-[600px] pt-4 text-sm leading-6 text-[#19382f]/60" data-testid={`text-faq-answer-${index}`}>{answer}</p>}</div>)}</div></div>
  </section>;
}

function Footer() {
  return <footer className="bg-[#19382f] px-5 pb-8 pt-16 text-[#f6f1e5] lg:px-10"><div className="mx-auto max-w-[1320px]"><div className="grid gap-12 border-b border-[#f6f1e5]/15 pb-14 lg:grid-cols-[1.3fr_.7fr_.7fr]"><div><Logo invert /><p className="mt-8 max-w-[280px] text-sm leading-6 text-[#f6f1e5]/55">Property, with perspective.<br />Bangalore and beyond.</p></div><div><p className="font-mono-label text-[9px] text-[#e8c979]">EXPLORE</p><div className="mt-5 flex flex-col gap-3 text-sm text-[#f6f1e5]/70"><a href="#about" data-testid="link-footer-about">Our approach</a><a href="#services" data-testid="link-footer-services">Services</a><a href="#properties" data-testid="link-footer-properties">Properties</a><Link href="/careers" data-testid="link-footer-careers">Careers</Link></div></div><div><p className="font-mono-label text-[9px] text-[#e8c979]">FIND US</p><div className="mt-5 flex flex-col gap-3 text-sm text-[#f6f1e5]/70"><a href="mailto:hello@igreyholdings.com" data-testid="link-footer-email">hello@igreyholdings.com</a><span>Indiranagar, Bangalore</span><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-testid="link-footer-linkedin"><Linkedin className="h-4 w-4" /></a></div></div></div><div className="flex flex-wrap justify-between gap-4 pt-7 font-mono-label text-[9px] text-[#f6f1e5]/35"><span>© 2025 IGREY HOLDINGS</span><span>A BETTER PERSPECTIVE</span><span>MADE FOR THE LONG VIEW</span></div></div></footer>;
}

function CareersPage() {
  const openings = [
    ['Property Relationship Lead', 'Bangalore · Full-time', 'Own the conversations that turn a first enquiry into a lasting relationship.'],
    ['Real Estate Advisor', 'Bangalore · Full-time', 'Bring curiosity, local knowledge and a clear point of view to every search.'],
    ['Property Care Coordinator', 'Bangalore · Full-time', 'Make the everyday experience of owning and renting feel remarkably looked after.'],
  ];
  return <div className="min-h-[100dvh] bg-[#f6f1e5] text-[#19382f]"><div className="bg-[#19382f] text-[#f6f1e5]"><Header /><div className="mx-auto max-w-[1320px] px-5 pb-24 pt-44 lg:px-10 lg:pb-32"><Eyebrow light>COME BUILD THE LONG VIEW</Eyebrow><h1 className="mt-8 max-w-[950px] font-display text-[clamp(4rem,10vw,9rem)] leading-[.82] tracking-[-.04em]">Make property<br /><em className="text-[#e8c979]">feel human.</em></h1><div className="mt-12 flex max-w-[700px] items-end justify-between gap-8"><p className="text-lg leading-8 text-[#f6f1e5]/70">We are building a more thoughtful property company for Bangalore. If you notice the small things and care about the outcome, there may be a place for you here.</p><div className="hidden h-20 w-20 shrink-0 rounded-full border border-[#e8c979]/50 sm:flex sm:items-center sm:justify-center"><ArrowDownRight className="h-6 w-6 text-[#e8c979]" /></div></div></div></div><main><section className="mx-auto max-w-[1320px] px-5 py-24 lg:px-10 lg:py-32"><div className="grid gap-16 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>WHY IGREY</Eyebrow><h2 className="mt-7 font-display text-6xl leading-[.9] lg:text-8xl">Work with<br /><em>weight.</em></h2></div><div className="grid gap-8 sm:grid-cols-2"><div className="border-t border-[#d9d1c0] pt-5"><ShieldCheck className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Do the honest work</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">We say what we know, what we do not, and what happens next.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Sparkles className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Stay curious</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">Every neighbourhood, home and person has more to teach us.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Home className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Leave things better</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">We measure ourselves by the care that remains after the deal.</p></div><div className="border-t border-[#d9d1c0] pt-5"><Compass className="h-6 w-6 text-[#bd674e]" /><h3 className="mt-7 font-display text-3xl">Think local, look far</h3><p className="mt-3 text-sm leading-6 text-[#19382f]/60">Bangalore is our context. Better property is our ambition.</p></div></div></div></section><section className="bg-[#e8c979] px-5 py-24 lg:px-10"><div className="mx-auto max-w-[1320px]"><div className="flex items-end justify-between gap-8"><div><Eyebrow>OPEN POSITIONS</Eyebrow><h2 className="mt-6 font-display text-6xl leading-none lg:text-8xl">Find your<br /><em>place.</em></h2></div><span className="hidden font-mono-label text-[10px] text-[#19382f]/60 md:block">03 ROLES / BANGALORE</span></div><div className="mt-16 border-t border-[#19382f]/25">{openings.map(([role, meta, copy], index) => <div key={role} className="group grid gap-5 border-b border-[#19382f]/25 py-8 md:grid-cols-[1fr_.65fr_auto] md:items-center" data-testid={`card-opening-${index}`}><div><h3 className="font-display text-3xl lg:text-4xl">{role}</h3><p className="mt-2 font-mono-label text-[9px] text-[#19382f]/60">{meta}</p></div><p className="max-w-[270px] text-sm leading-6 text-[#19382f]/65">{copy}</p><a href="mailto:careers@igreyholdings.com?subject=Joining iGrey" className="flex h-12 w-12 items-center justify-center rounded-full border border-[#19382f]/35 transition-all group-hover:bg-[#19382f] group-hover:text-[#f6f1e5]" aria-label={`Apply for ${role}`} data-testid={`link-apply-${index}`}><ArrowUpRight className="h-5 w-5" /></a></div>)}</div></div></section><section className="bg-[#bd674e] px-5 py-24 text-[#f6f1e5] lg:px-10"><div className="mx-auto flex max-w-[1320px] flex-wrap items-end justify-between gap-10"><div><p className="font-mono-label text-[10px] tracking-[.2em] text-[#e8c979]">NO PERFECT FIT?</p><h2 className="mt-6 max-w-[700px] font-display text-6xl leading-[.88] lg:text-8xl">Tell us what<br /><em>you see.</em></h2></div><a href="mailto:careers@igreyholdings.com" className="group flex items-center gap-4 border-b border-[#e8c979] pb-3 font-mono-label text-[10px] text-[#e8c979]" data-testid="link-careers-general">careers@igreyholdings.com <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a></div></section></main><Footer /></div>;
}

function Router() {
  return <ErrorBoundary><Switch><Route path="/" component={HomePage} /><Route path="/careers" component={CareersPage} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;