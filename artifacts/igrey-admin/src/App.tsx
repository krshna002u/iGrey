import { useEffect, useMemo, useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react';
import { Check, ClipboardList, ExternalLink, FileText, LayoutGrid, Menu, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

const queryClient = new QueryClient();

type Property = {
  id: string;
  label: string;
  title: string;
  meta: string;
  images: string[];
  tone: string;
  details: string;
  features: string[];
};

type CareerOpening = {
  role: string;
  meta: string;
  copy: string;
};

const defaultProperties: Property[] = [
  { id: 'indiranagar', label: 'LEASED', title: 'Sunlit three-bed in Indiranagar', meta: '3 BHK · 2,140 sq ft · Lease terms on request', images: ['property-living.jpg', 'property-courtyard.jpg', 'property-terrace.jpg'], tone: 'text-[#eddca9] bg-[#19382f]', details: 'A bright, considered home close to the everyday rhythm of Indiranagar.', features: ['3 bedrooms', '2,140 sq ft', 'Lease terms on request'] },
  { id: 'whitefield', label: 'FOR SALE', title: 'A quiet villa in Whitefield', meta: '4 BHK · 3,860 sq ft · ₹4.25 Cr', images: ['property-villa.jpg', 'property-courtyard.jpg', 'property-living.jpg'], tone: 'text-[#19382f] bg-[#e8c979]', details: 'A generous family villa with calm outdoor spaces and room to grow.', features: ['4 bedrooms', '3,860 sq ft', '₹4.25 Cr'] },
  { id: 'koramangala', label: 'NEW LISTING', title: 'Terrace home, Koramangala', meta: '3 BHK · 2,480 sq ft · Lease terms on request', images: ['property-terrace.jpg', 'property-living.jpg', 'property-villa.jpg'], tone: 'text-[#f6f1e5] bg-[#bd674e]', details: 'An easy, light-filled terrace home in the middle of Koramangala.', features: ['3 bedrooms', '2,480 sq ft', 'Lease terms on request'] },
];

const defaultCareers: CareerOpening[] = [
  { role: 'Relationship Manager', meta: 'Bangalore · Full-time', copy: 'Build trusted relationships with owners, buyers and tenants from first conversation to handover.' },
  { role: 'Business Development Manager', meta: 'Bangalore · Full-time', copy: 'Grow our owner and partner network with a thoughtful, consistent approach.' },
  { role: 'Business Development Executive', meta: 'Bangalore · Full-time', copy: 'Bring energy and curiosity to new conversations across Bangalore.' },
  { role: 'Team Lead', meta: 'Bangalore · Full-time', copy: 'Support a high-performing team and keep every client journey moving clearly.' },
  { role: 'Sales Manager', meta: 'Bangalore · Full-time', copy: 'Lead property sales with local insight, calm follow-through and strong commercial judgement.' },
  { role: 'Videographer', meta: 'Bangalore · Full-time', copy: 'Make the character of homes and neighbourhoods visible through considered film.' },
  { role: 'Video Editor', meta: 'Bangalore · Full-time', copy: 'Shape property stories into clear, engaging visual experiences.' },
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
      // Keep editing in memory when browser storage is unavailable.
    }
  }, [key, value]);

  useEffect(() => {
    const sync = () => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) setValue(JSON.parse(stored) as T);
      } catch {
        // Keep the current value if another tab contains invalid data.
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key]);

  return [value, setValue];
}

function Brand() {
  return (
    <div className="brand-mark" aria-label="iGrey Admin">
      <img className="brand-asset" src={`${import.meta.env.BASE_URL}assets/igrey-horizontal-logo.png`} alt="iGrey Holdings" />
      <span className="brand-word">Admin <small>private workspace</small></span>
    </div>
  );
}

function Sidebar({ tab, setTab, open, close }: { tab: Tab; setTab: (tab: Tab) => void; open: boolean; close: () => void }) {
  return (
    <>
      {open && <button className="mobile-overlay" onClick={close} aria-label="Close navigation" />}
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div style={{ padding: '28px 20px 31px' }}><Brand /></div>
        <div className="font-mono-label" style={{ padding: '0 20px 12px', color: 'rgba(247,240,223,.34)', fontSize: 9 }}>Content control</div>
        <nav aria-label="Workspace navigation">
          <button className={`nav-item ${tab === 'properties' ? 'active' : ''}`} onClick={() => { setTab('properties'); close(); }}>
            <LayoutGrid size={16} strokeWidth={1.5} /> Properties <span style={{ marginLeft: 'auto', opacity: .55 }}>{tab === 'properties' ? '●' : ''}</span>
          </button>
          <button className={`nav-item ${tab === 'careers' ? 'active' : ''}`} onClick={() => { setTab('careers'); close(); }}>
            <ClipboardList size={16} strokeWidth={1.5} /> Careers <span style={{ marginLeft: 'auto', opacity: .55 }}>{tab === 'careers' ? '●' : ''}</span>
          </button>
        </nav>
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(247,240,223,.12)', padding: '19px 20px 22px' }}>
          <div className="font-mono-label" style={{ color: 'rgba(247,240,223,.4)', fontSize: 8 }}>Local content store</div>
          <p style={{ margin: '8px 0 0', color: 'rgba(247,240,223,.62)', fontSize: 11, lineHeight: 1.45 }}>Changes save to this browser automatically.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 15, color: '#f0db97', fontFamily: 'var(--app-font-mono)', fontSize: 9, letterSpacing: '.07em', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f0db97' }} /> Ready to edit
          </div>
        </div>
      </aside>
    </>
  );
}

type Tab = 'properties' | 'careers';
type EditorState = { kind: Tab; item?: Property | CareerOpening };
type DeleteState = { kind: Tab; item: Property | CareerOpening } | null;

function Header({ tab, onMenu }: { tab: Tab; onMenu: () => void }) {
  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <button className="mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={18} /></button>
        <div className="topbar-context" style={{ color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--app-font-mono)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase' }}>
          iGrey / <span style={{ color: 'hsl(var(--primary))' }}>{tab === 'properties' ? 'Properties' : 'Careers'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <span className="font-mono-label" style={{ color: 'hsl(var(--muted-foreground))', fontSize: 8 }}>Private workspace</span>
        <span style={{ display: 'grid', width: 31, height: 31, placeItems: 'center', borderRadius: '50%', background: 'hsl(var(--secondary))', color: 'hsl(var(--primary))', fontFamily: 'var(--app-font-serif)', fontSize: 17 }}>I</span>
      </div>
    </header>
  );
}

function Stats({ properties, careers }: { properties: Property[]; careers: CareerOpening[] }) {
  return (
    <div className="stat-grid">
      <div className="stat-card"><div className="font-mono-label" style={{ color: 'hsl(var(--muted-foreground))', fontSize: 8 }}>Live property entries</div><div className="stat-number">{String(properties.length).padStart(2, '0')}</div><div className="stat-detail">Available to the public app</div></div>
      <div className="stat-card"><div className="font-mono-label" style={{ color: 'hsl(var(--muted-foreground))', fontSize: 8 }}>Career openings</div><div className="stat-number">{String(careers.length).padStart(2, '0')}</div><div className="stat-detail">Roles currently in the workspace</div></div>
      <div className="stat-card"><div className="font-mono-label" style={{ color: 'hsl(var(--muted-foreground))', fontSize: 8 }}>Storage status</div><div className="stat-number" style={{ fontSize: 34, paddingTop: 7 }}>LOCAL</div><div className="stat-detail">Saved in this browser</div></div>
    </div>
  );
}

function PropertyCard({ property, onEdit, onDelete }: { property: Property; onEdit: () => void; onDelete: () => void }) {
  const toneParts = property.tone.match(/text-\[#([a-fA-F0-9]+)\]\s+bg-\[#([a-fA-F0-9]+)\]/);
  return (
    <article className="property-card">
      <div className="property-card-top">
        <span className="tone-pill" style={toneParts ? { color: `#${toneParts[1]}`, background: `#${toneParts[2]}` } : undefined}>{property.label || 'UNLABELLED'}</span>
        <div className="property-card-title">{property.title || 'Untitled property'}</div>
      </div>
      <div className="property-card-body">
        <div className="property-meta">{property.meta || 'No property metadata yet'}</div>
        <p className="property-details">{property.details || 'Add a short description for this listing.'}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 13 }}>
          {property.features.slice(0, 3).map((feature) => <span key={feature} style={{ border: '1px solid hsl(var(--border))', padding: '4px 6px', color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--app-font-mono)', fontSize: 8 }}>{feature}</span>)}
        </div>
      </div>
      <div className="card-actions">
        <button className="icon-button" onClick={onEdit} aria-label={`Edit ${property.title}`} title="Edit property"><Pencil size={14} /></button>
        <button className="icon-button danger" onClick={onDelete} aria-label={`Delete ${property.title}`} title="Delete property"><Trash2 size={14} /></button>
      </div>
    </article>
  );
}

function PropertyManager({ properties, onEdit, onDelete, onAdd }: { properties: Property[]; onEdit: (property: Property) => void; onDelete: (property: Property) => void; onAdd: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => properties.filter((property) => `${property.title} ${property.meta} ${property.label}`.toLowerCase().includes(search.toLowerCase())), [properties, search]);
  return (
    <section className="content-panel">
      <div className="content-panel-header">
        <div><div className="section-title">Property listings</div><div style={{ marginTop: 6, color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>Keep the public-facing inventory current.</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div className="search-wrap"><Search size={15} /><input className="search-input" type="search" placeholder="Search listings" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
          <button className="button button-primary" onClick={onAdd}><Plus size={14} /> Add property</button>
        </div>
      </div>
      {filtered.length ? <div className="property-grid">{filtered.map((property) => <PropertyCard key={property.id} property={property} onEdit={() => onEdit(property)} onDelete={() => onDelete(property)} />)}</div> : <EmptyState kind="property" hasSearch={Boolean(search)} onAdd={onAdd} />}
    </section>
  );
}

function CareerManager({ careers, onEdit, onDelete, onAdd }: { careers: CareerOpening[]; onEdit: (career: CareerOpening) => void; onDelete: (career: CareerOpening) => void; onAdd: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => careers.filter((career) => `${career.role} ${career.meta} ${career.copy}`.toLowerCase().includes(search.toLowerCase())), [careers, search]);
  return (
    <section className="content-panel">
      <div className="content-panel-header">
        <div><div className="section-title">Career roles</div><div style={{ marginTop: 6, color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>Shape the next conversation with iGrey.</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div className="search-wrap"><Search size={15} /><input className="search-input" type="search" placeholder="Search roles" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
          <button className="button button-primary" onClick={onAdd}><Plus size={14} /> Add role</button>
        </div>
      </div>
      {filtered.length ? <div className="career-list">{filtered.map((career, index) => <div className="career-row" key={`${career.role}-${index}`}><div className="row-number">{String(index + 1).padStart(2, '0')}</div><div><div className="career-role">{career.role || 'Untitled role'}</div><div className="career-meta" style={{ marginTop: 8 }}>{career.meta || 'No role metadata yet'}</div></div><div className="career-copy">{career.copy || 'Add a short description for this role.'}</div><div className="row-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}><button className="icon-button" onClick={() => onEdit(career)} aria-label={`Edit ${career.role}`} title="Edit role"><Pencil size={14} /></button><button className="icon-button danger" onClick={() => onDelete(career)} aria-label={`Delete ${career.role}`} title="Delete role"><Trash2 size={14} /></button></div></div>)}</div> : <EmptyState kind="career" hasSearch={Boolean(search)} onAdd={onAdd} />}
    </section>
  );
}

function EmptyState({ kind, hasSearch, onAdd }: { kind: Tab | 'property' | 'career'; hasSearch: boolean; onAdd: () => void }) {
  const isProperties = kind === 'properties' || kind === 'property';
  return (
    <div className="empty-state">
      <div className="empty-orbit">{hasSearch ? <Search size={20} /> : isProperties ? <LayoutGrid size={20} /> : <ClipboardList size={20} />}</div>
      <div className="section-title">{hasSearch ? 'No matching entries' : `No ${isProperties ? 'properties' : 'career roles'} yet`}</div>
      <p style={{ maxWidth: 330, margin: '10px auto 19px', color: 'hsl(var(--muted-foreground))', fontSize: 12, lineHeight: 1.5 }}>{hasSearch ? 'Try another search term or clear the filter.' : `Start the ${isProperties ? 'property' : 'career'} collection with the first entry.`}</p>
      {!hasSearch && <button className="button button-gold" onClick={onAdd}><Plus size={14} /> Add {isProperties ? 'property' : 'role'}</button>}
    </div>
  );
}

function Field({ label, children, full = false }: { label: string; children: ReactNode; full?: boolean }) {
  return <label className={`field ${full ? 'full' : ''}`}><span className="field-label">{label}</span>{children}</label>;
}

function PropertyEditor({ initial, onClose, onSave }: { initial?: Property; onClose: () => void; onSave: (property: Property) => void }) {
  const [form, setForm] = useState<Property>(initial ? { ...initial, images: [...initial.images], features: [...initial.features] } : { id: '', label: 'NEW LISTING', title: '', meta: '', images: [], tone: 'text-[#19382f] bg-[#e8c979]', details: '', features: [] });
  const set = (key: keyof Property, value: string | string[]) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const id = form.id.trim() || form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `property-${Date.now()}`;
    onSave({ ...form, id, title: form.title.trim(), images: form.images.filter(Boolean), features: form.features.filter(Boolean) });
  };
  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal-card" onSubmit={submit}>
        <div className="modal-head"><div><div className="eyebrow">Property record</div><h2 className="modal-title">{initial ? 'Edit listing' : 'New listing'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close editor"><X size={18} /></button></div>
        <div className="form-body">
          <div className="form-grid">
            <Field label="Listing title" full><input required className="field-input" value={form.title} onChange={(event) => set('title', event.target.value)} placeholder="Sunlit three-bed in Indiranagar" /></Field>
            <Field label="Status label"><input required className="field-input" value={form.label} onChange={(event) => set('label', event.target.value)} placeholder="NEW LISTING" /></Field>
            <Field label="Visual tone"><select className="field-select" value={form.tone} onChange={(event) => set('tone', event.target.value)}><option value="text-[#eddca9] bg-[#19382f]">Pale on pine</option><option value="text-[#19382f] bg-[#e8c979]">Pine on saffron</option><option value="text-[#f6f1e5] bg-[#bd674e]">Paper on terracotta</option></select></Field>
            <Field label="Metadata" full><input required className="field-input" value={form.meta} onChange={(event) => set('meta', event.target.value)} placeholder="3 BHK · 2,140 sq ft · Lease terms on request" /></Field>
            <Field label="Details" full><textarea required className="field-textarea" value={form.details} onChange={(event) => set('details', event.target.value)} placeholder="A short, considered description of the home." /></Field>
            <Field label="Features" full><input className="field-input" value={form.features.join(' · ')} onChange={(event) => set('features', event.target.value.split('·').map((item) => item.trim()).filter(Boolean))} placeholder="3 bedrooms · 2,140 sq ft · Lease terms on request" /></Field>
            <Field label="Image filenames" full><textarea className="field-textarea" value={form.images.join('\n')} onChange={(event) => set('images', event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} placeholder={'property-living.jpg\nproperty-courtyard.jpg'} /></Field>
          </div>
        </div>
        <div className="form-footer"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Check size={14} /> Save listing</button></div>
      </form>
    </div>
  );
}

function CareerEditor({ initial, onClose, onSave }: { initial?: CareerOpening; onClose: () => void; onSave: (career: CareerOpening) => void }) {
  const [form, setForm] = useState<CareerOpening>(initial ? { ...initial } : { role: '', meta: 'Bangalore · Full-time', copy: '' });
  const set = (key: keyof CareerOpening, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return (
    <div className="modal-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form className="modal-card" onSubmit={(event) => { event.preventDefault(); onSave({ role: form.role.trim(), meta: form.meta.trim(), copy: form.copy.trim() }); }}>
        <div className="modal-head"><div><div className="eyebrow">Career record</div><h2 className="modal-title">{initial ? 'Edit role' : 'New role'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close editor"><X size={18} /></button></div>
        <div className="form-body"><div className="form-grid">
          <Field label="Role title" full><input required className="field-input" value={form.role} onChange={(event) => set('role', event.target.value)} placeholder="Relationship Manager" /></Field>
          <Field label="Location and terms" full><input required className="field-input" value={form.meta} onChange={(event) => set('meta', event.target.value)} placeholder="Bangalore · Full-time" /></Field>
          <Field label="Role description" full><textarea required className="field-textarea" value={form.copy} onChange={(event) => set('copy', event.target.value)} placeholder="What will this person make possible at iGrey?" /></Field>
        </div></div>
        <div className="form-footer"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button type="submit" className="button button-primary"><Check size={14} /> Save role</button></div>
      </form>
    </div>
  );
}

function DeleteDialog({ state, onCancel, onConfirm }: { state: DeleteState; onCancel: () => void; onConfirm: () => void }) {
  if (!state) return null;
  const title = state.kind === 'properties' ? (state.item as Property).title : (state.item as CareerOpening).role;
  return <div className="modal-scrim" role="presentation"><div className="modal-card" style={{ width: 'min(440px, 100%)' }}><div className="modal-head"><div><div className="eyebrow" style={{ color: 'hsl(var(--destructive))' }}>Remove record</div><h2 className="modal-title">Delete this {state.kind === 'properties' ? 'listing' : 'role'}?</h2></div><button className="icon-button" onClick={onCancel} aria-label="Close delete confirmation"><X size={18} /></button></div><div style={{ padding: '22px 25px 6px', color: 'hsl(var(--muted-foreground))', fontSize: 13, lineHeight: 1.55 }}>You are about to remove <strong style={{ color: 'hsl(var(--primary))' }}>{title || 'this record'}</strong>. This change will be saved to the local content store.</div><div className="form-footer"><button className="button button-quiet" onClick={onCancel}>Keep it</button><button className="button button-danger" onClick={onConfirm}><Trash2 size={14} /> Delete</button></div></div></div>;
}

function Workspace() {
  const [tab, setTab] = useState<Tab>('properties');
  const [properties, setProperties] = useStoredContent<Property[]>('igrey-properties', defaultProperties);
  const [careers, setCareers] = useStoredContent<CareerOpening[]>('igrey-careers', defaultCareers);
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [deletion, setDeletion] = useState<DeleteState>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const saveProperty = (property: Property) => {
    setProperties((current) => {
      const index = current.findIndex((item) => item.id === property.id);
      if (index < 0) return [...current, property];
      return current.map((item) => item.id === property.id ? property : item);
    });
    setEditor(null);
    setNotice('Property listing saved');
  };
  const saveCareer = (career: CareerOpening) => {
    const initial = editor?.item as CareerOpening | undefined;
    setCareers((current) => {
      if (!initial) return [...current, career];
      return current.map((item) => item === initial ? career : item);
    });
    setEditor(null);
    setNotice('Career role saved');
  };
  const confirmDelete = () => {
    if (!deletion) return;
    if (deletion.kind === 'properties') {
      const item = deletion.item as Property;
      setProperties((current) => current.filter((property) => property.id !== item.id));
      setNotice('Property listing removed');
    } else {
      const item = deletion.item as CareerOpening;
      setCareers((current) => current.filter((career) => career !== item));
      setNotice('Career role removed');
    }
    setDeletion(null);
  };
  const add = () => setEditor({ kind: tab });
  return (
    <div className="admin-shell noise">
      <Sidebar tab={tab} setTab={setTab} open={mobileOpen} close={() => setMobileOpen(false)} />
      <div className="admin-main">
        <Header tab={tab} onMenu={() => setMobileOpen(true)} />
        <main className="workspace">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
            <div><div className="eyebrow">Content workspace / 01</div><h1 className="page-title">Make the <em>details</em><br />easy to find.</h1></div>
            <a href="/" className="button button-quiet" style={{ whiteSpace: 'nowrap' }}><ExternalLink size={13} /> View public site</a>
          </div>
          <Stats properties={properties} careers={careers} />
          {tab === 'properties' ? <PropertyManager properties={properties} onAdd={add} onEdit={(property) => setEditor({ kind: 'properties', item: property })} onDelete={(property) => setDeletion({ kind: 'properties', item: property })} /> : <CareerManager careers={careers} onAdd={add} onEdit={(career) => setEditor({ kind: 'careers', item: career })} onDelete={(career) => setDeletion({ kind: 'careers', item: career })} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, color: 'hsl(var(--muted-foreground))', fontFamily: 'var(--app-font-mono)', fontSize: 9, letterSpacing: '.05em' }}><FileText size={13} /> Changes persist in <strong style={{ color: 'hsl(var(--primary))', fontWeight: 500 }}>{tab === 'properties' ? 'igrey-properties' : 'igrey-careers'}</strong></div>
        </main>
      </div>
      {editor?.kind === 'properties' && <PropertyEditor initial={editor.item as Property | undefined} onClose={() => setEditor(null)} onSave={saveProperty} />}
      {editor?.kind === 'careers' && <CareerEditor initial={editor.item as CareerOpening | undefined} onClose={() => setEditor(null)} onSave={saveCareer} />}
      <DeleteDialog state={deletion} onCancel={() => setDeletion(null)} onConfirm={confirmDelete} />
      {notice && <div className="toast-note"><Check size={14} /> {notice}</div>}
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Workspace} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;