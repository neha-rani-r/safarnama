import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import type { Entry, Prompt } from '../types';

const PROMPTS: Prompt[] = [
  { id: 'surprise',   icon: '✦', q: "What surprised you today?", why: 'Cultural contrast' },
  { id: 'senses',     icon: '◈', q: 'Describe a sound or smell.', why: 'Sensory memory' },
  { id: 'food',       icon: '◉', q: 'What did you eat?',          why: 'Food + emotion' },
  { id: 'human',      icon: '◎', q: 'Who did you talk to?',       why: 'Human connection' },
  { id: 'notice',     icon: '◆', q: 'What did tourists miss?',    why: 'Slow attention' },
  { id: 'body',       icon: '◐', q: 'How did your body feel?',    why: 'Physical presence' },
  { id: 'recommend',  icon: '◑', q: 'Should someone come here?',  why: 'Your verdict' },
];

const MARKER_SVG = '<svg width="32" height="32" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg"><circle cx="36" cy="36" r="32" fill="white" stroke="#2e7d32" stroke-width="3.5"/><path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32"/><circle cx="36" cy="14" r="3" fill="#2e7d32"/><path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity="0.4"/><circle cx="36" cy="36" r="5" fill="#1a1a1a"/><circle cx="36" cy="36" r="2.5" fill="#2e7d32"/></svg>';

interface MapViewProps {
  entries: Entry[];
  onReadFull: (entry: Entry) => void;
}

export default function MapView({ entries, onReadFull }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null);

  const entriesWithCoords = entries.filter(
    (e): e is Entry & { lat: number; lng: number } =>
      typeof e.lat === 'number' && typeof e.lng === 'number'
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((leaflet) => {
      const L = leaflet.default;
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, { center: [20, 0], zoom: 2 });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      mapInstanceRef.current = map;

      const compassIcon = L.divIcon({ html: MARKER_SVG, className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -18] });
      const bounds: [number, number][] = [];

      entriesWithCoords.forEach((entry) => {
        const prompt = PROMPTS.find((p) => p.id === entry.prompt);
        const preview = entry.text.slice(0, 120) + (entry.text.length > 120 ? '…' : '');
        const popupContent = `<div style="font-family:system-ui;min-width:200px;max-width:280px;"><div style="font-family:Georgia,serif;font-style:italic;font-size:17px;margin-bottom:4px;color:#111110;">${entry.location}</div><div style="font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:0.06em;color:#2e7d32;background:#e8f5e9;padding:2px 8px;border-radius:100px;display:inline-block;margin-bottom:10px;">${prompt?.why ?? entry.prompt}</div><p style="font-family:Georgia,serif;font-size:13px;line-height:1.7;color:#111110;opacity:0.8;margin:0 0 12px;">${preview}</p><button data-entry-id="${entry.id}" style="font-family:system-ui;font-size:11px;font-weight:500;color:#2e7d32;background:none;border:1px solid #2e7d32;padding:5px 12px;border-radius:4px;cursor:pointer;">Read full →</button></div>`;

        const marker = L.marker([entry.lat, entry.lng], { icon: compassIcon });
        marker.bindPopup(popupContent, { maxWidth: 300 });
        marker.addTo(map);
        marker.on('popupopen', () => {
          setTimeout(() => {
            const btn = document.querySelector<HTMLButtonElement>(`[data-entry-id="${entry.id}"]`);
            if (btn) btn.addEventListener('click', () => { onReadFull(entry); marker.closePopup(); });
          }, 50);
        });
        bounds.push([entry.lat, entry.lng]);
      });

      if (bounds.length === 1) map.setView(bounds[0], 10);
      else if (bounds.length > 1) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    });

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, []);

  if (entriesWithCoords.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20, color: 'var(--muted)', background: 'var(--surface)' }}>
        <svg width="64" height="64" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.2 }}>
          <circle cx="36" cy="36" r="32" fill="none" stroke="#1a1a1a" strokeWidth="2" />
          <path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32" />
          <path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity="0.3" />
          <circle cx="36" cy="36" r="4" fill="#1a1a1a" /><circle cx="36" cy="36" r="2" fill="#2e7d32" />
        </svg>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontStyle: 'italic' }}>No entries with location data yet</div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)', maxWidth: 300, textAlign: 'center', lineHeight: 1.6 }}>
          Save a new entry and allow location access to pin it here
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 400, pointerEvents: 'none', opacity: 0.35 }}>
        <svg width="100%" height="24" viewBox="0 0 400 24" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,18 Q25,18 35,10 Q45,2 55,10 Q62,15 70,12 Q78,8 85,2 Q93,0 100,4 Q107,8 115,4 Q123,0 130,4 Q140,10 150,6 Q157,3 165,6 Q175,10 185,4 Q192,0 200,4 Q210,8 218,2 Q225,0 233,4 Q240,8 248,12 Q255,15 263,10 Q273,2 283,10 Q293,18 318,18 Q340,18 360,14 Q375,11 400,18" fill="none" stroke="#2e7d32" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1200" style={{ animation: 'drawLine 2.5s ease forwards' }} />
        </svg>
      </div>
      <div ref={mapRef} className="map-container" />
    </div>
  );
}
