import { useState, useRef } from 'react';
import { callClaude } from '../lib/claude';
import type { Entry, Prompt } from '../types';

const PROMPTS: Prompt[] = [
  { id: 'surprise',   icon: '✦', q: "What surprised you today that you wouldn't find at home?", why: 'Cultural contrast' },
  { id: 'senses',     icon: '◈', q: 'Describe a sound or smell you want to remember.',           why: 'Sensory memory' },
  { id: 'food',       icon: '◉', q: 'What did you eat, and what did it remind you of?',           why: 'Food + emotion' },
  { id: 'human',      icon: '◎', q: 'Who did you talk to today? What did they teach you?',        why: 'Human connection' },
  { id: 'notice',     icon: '◆', q: 'What did you notice that tourists usually miss?',            why: 'Slow attention' },
  { id: 'body',       icon: '◐', q: 'How did your body feel in this place?',                      why: 'Physical presence' },
  { id: 'recommend',  icon: '◑', q: 'What would you tell someone who asked if they should come here?', why: 'Your verdict' },
];

// Animated illustrations
function MemoirIllustration({ seed, locations }: { seed: number; locations: string[] }) {
  const s = seed % 6;
  const loc = locations[0] || '';
  const illustrations = [
    <svg key="0" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'auto' }}>
      <defs><linearGradient id="sky0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0a0a"/><stop offset="100%" stopColor="#1a2a1a"/></linearGradient><style>{`.m0s{animation:mTw 2s ease-in-out infinite alternate}.m0b{animation:mBd 3s ease-in-out infinite}@keyframes mTw{0%{opacity:.2}100%{opacity:1}}@keyframes mBd{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style></defs>
      <rect width="400" height="200" fill="url(#sky0)"/>
      {[{x:40,y:20,r:1.5,d:.3},{x:80,y:35,r:1,d:.8},{x:130,y:15,r:2,d:.1},{x:200,y:28,r:1.5,d:.5},{x:260,y:12,r:1,d:1.2},{x:320,y:30,r:2,d:.7},{x:370,y:18,r:1.5,d:.4},{x:60,y:50,r:1,d:.9},{x:170,y:42,r:1.5,d:.2},{x:340,y:45,r:1,d:1.4}].map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r={p.r} fill={i%2===0?"#2e7d32":"white"} opacity=".7" className="m0s" style={{animationDelay:`${p.d}s`}}/>))}
      <circle cx="340" cy="40" r="22" fill="#f5f0e8" opacity=".9"/><circle cx="350" cy="34" r="18" fill="#1a2a1a"/>
      <path d="M0,140 L60,70 L120,110 L180,50 L240,95 L300,60 L360,90 L400,70 L400,200 L0,200Z" fill="#0f1f0f" opacity=".8"/>
      <path d="M0,170 L80,110 L140,145 L220,90 L280,130 L350,100 L400,120 L400,200 L0,200Z" fill="#0a150a"/>
      <g className="m0b"><path d="M100,65 Q108,59 116,65" fill="none" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" opacity=".6"/></g>
      <g className="m0b" style={{animationDelay:'.8s'}}><path d="M130,52 Q140,45 150,52" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/></g>
      <text x="200" y="192" fontFamily="Georgia,serif" fontSize="11" fill="rgba(255,255,255,.25)" textAnchor="middle" fontStyle="italic">{loc}</text>
    </svg>,
    <svg key="1" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'auto' }}>
      <defs><linearGradient id="oc1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d1f1a"/><stop offset="100%" stopColor="#051510"/></linearGradient><style>{`.m1w{animation:m1W 4s ease-in-out infinite}.m1b{animation:m1B 2.5s ease-in-out infinite}.m1s{animation:m1S 2s infinite alternate}@keyframes m1W{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes m1B{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes m1S{0%{opacity:.2}100%{opacity:.9}}`}</style></defs>
      <rect width="400" height="200" fill="url(#oc1)"/>
      {[{x:30,y:25,d:.1},{x:90,y:15,d:.5},{x:160,y:30,d:.9},{x:230,y:10,d:.3},{x:310,y:22,d:.7},{x:380,y:18,d:1.1}].map((st,i)=>(<circle key={i} cx={st.x} cy={st.y} r="1.5" fill={i%2===0?"#2e7d32":"white"} className="m1s" style={{animationDelay:`${st.d}s`}} opacity=".6"/>))}
      <circle cx="200" cy="30" r="16" fill="#f5f0e8" opacity=".85"/><circle cx="208" cy="25" r="13" fill="#0d1f1a"/>
      <g className="m1w"><path d="M0,120 Q50,108 100,120 Q150,132 200,120 Q250,108 300,120 Q350,132 400,120 L400,200 L0,200Z" fill="#0a2218" opacity=".8"/></g>
      <g className="m1w" style={{animationDelay:'1s'}}><path d="M0,140 Q40,128 80,140 Q120,152 160,140 Q200,128 240,140 Q280,152 320,140 Q360,128 400,140 L400,200 L0,200Z" fill="#071810"/></g>
      <g className="m1b"><path d="M120,55 Q128,49 136,55" fill="none" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round" opacity=".7"/></g>
      <g className="m1b" style={{animationDelay:'.6s'}}><path d="M150,42 Q160,35 170,42" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/></g>
      <text x="200" y="192" fontFamily="Georgia,serif" fontSize="11" fill="rgba(255,255,255,.25)" textAnchor="middle" fontStyle="italic">{loc}</text>
    </svg>,
    <svg key="2" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'auto' }}>
      <defs><linearGradient id="dk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0a12"/><stop offset="100%" stopColor="#0a0a0a"/></linearGradient><style>{`.m2w{animation:m2W 3s ease-in-out infinite alternate}@keyframes m2W{0%{opacity:.15}100%{opacity:.55}}`}</style></defs>
      <rect width="400" height="200" fill="url(#dk2)"/>
      <ellipse cx="200" cy="130" rx="180" ry="30" fill="#2e7d32" opacity=".06"/>
      <rect x="10" y="100" width="30" height="100" fill="#0a0a0a"/><rect x="15" y="80" width="20" height="30" fill="#0a0a0a"/>
      <rect x="50" y="110" width="40" height="90" fill="#0f0f0f"/><rect x="100" y="85" width="25" height="115" fill="#0a0a0a"/>
      <rect x="180" y="70" width="20" height="130" fill="#0a0a0a"/><rect x="210" y="90" width="45" height="110" fill="#0f0f0f"/>
      <rect x="305" y="85" width="40" height="115" fill="#0f0f0f"/><rect x="375" y="80" width="25" height="120" fill="#0f0f0f"/>
      {[{x:18,y:105,d:.2},{x:58,y:98,d:.7},{x:102,y:92,d:.4},{x:183,y:78,d:.9},{x:215,y:97,d:.1},{x:308,y:92,d:1.1}].map((w,i)=>(<rect key={i} x={w.x} y={w.y} width="5" height="4" fill="#2e7d32" className="m2w" style={{animationDelay:`${w.d}s`}} rx=".5" opacity=".4"/>))}
      <circle cx="320" cy="30" r="14" fill="#f5f0e8" opacity=".7"/><circle cx="327" cy="26" r="11" fill="#0a0a12"/>
      <text x="200" y="193" fontFamily="Georgia,serif" fontSize="11" fill="rgba(255,255,255,.2)" textAnchor="middle" fontStyle="italic">{loc}</text>
    </svg>,
    <svg key="3" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'auto' }}>
      <defs><linearGradient id="fr3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#060d06"/><stop offset="100%" stopColor="#0a160a"/></linearGradient><style>{`.m3g{animation:m3G 2s ease-in-out infinite}@keyframes m3G{0%,100%{opacity:.05}50%{opacity:.5}}`}</style></defs>
      <rect width="400" height="200" fill="url(#fr3)"/>
      <path d="M0,200 L30,80 L60,200Z" fill="#0a140a"/><path d="M20,200 L55,60 L90,200Z" fill="#0d180d"/>
      <path d="M380,200 L345,60 L310,200Z" fill="#0d180d"/><path d="M350,200 L320,90 L290,200Z" fill="#0a140a"/>
      <path d="M160,200 Q180,140 195,100 Q200,80 205,100 Q220,140 240,200Z" fill="#111a11"/>
      {[{x:200,y:15},{x:185,y:30},{x:215,y:25},{x:195,y:50},{x:205,y:45}].map((st,i)=>(<circle key={i} cx={st.x} cy={st.y} r="1.5" fill="#2e7d32" opacity=".7" className="m3g" style={{animationDelay:`${i*.3}s`}}/>))}
      {[{x:100,y:130},{x:270,y:120},{x:300,y:140},{x:80,y:150}].map((f,i)=>(<circle key={i} cx={f.x} cy={f.y} r="2.5" fill="#2e7d32" className="m3g" style={{animationDelay:`${i*.5}s`}} opacity=".6"/>))}
      <text x="200" y="193" fontFamily="Georgia,serif" fontSize="11" fill="rgba(255,255,255,.2)" textAnchor="middle" fontStyle="italic">{loc}</text>
    </svg>,
    <svg key="4" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'auto' }}>
      <defs><linearGradient id="ds4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#05050f"/><stop offset="100%" stopColor="#150e05"/></linearGradient><style>{`.m4s{animation:m4S 2s infinite alternate}.m4c{animation:m4C 4s ease-in-out infinite}.m4sh{animation:m4Sh 5s linear infinite}@keyframes m4S{0%{opacity:.1}100%{opacity:.9}}@keyframes m4C{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}@keyframes m4Sh{0%{transform:translate(0,0);opacity:1}80%{transform:translate(-80px,40px);opacity:0}100%{transform:translate(0,0);opacity:0}}`}</style></defs>
      <rect width="400" height="200" fill="url(#ds4)"/>
      {Array.from({length:25}).map((_,i)=>({x:Math.abs(Math.sin(i*137)*380),y:Math.max(5,Math.abs(Math.cos(i*97)*70)+5)})).map((st,i)=>(<circle key={i} cx={st.x} cy={st.y} r={i%5===0?2:1} fill={i%3===0?"#2e7d32":"white"} className="m4s" style={{animationDelay:`${(i*.25)%3}s`}} opacity=".4"/>))}
      <line x1="320" y1="20" x2="340" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".6" className="m4sh"/>
      <circle cx="200" cy="35" r="18" fill="#f5f0e8" opacity=".85"/><circle cx="211" cy="29" r="14" fill="#05050f"/>
      <path d="M0,160 Q100,130 200,155 Q300,175 400,150 L400,200 L0,200Z" fill="#150e05"/>
      <g className="m4c" style={{transformOrigin:'70px 160px'}}><rect x="67" y="125" width="6" height="35" fill="#0d1a0d" rx="3"/><rect x="55" y="138" width="14" height="5" fill="#0d1a0d" rx="2"/></g>
      <text x="200" y="194" fontFamily="Georgia,serif" fontSize="11" fill="rgba(255,255,255,.2)" textAnchor="middle" fontStyle="italic">{loc}</text>
    </svg>,
    <svg key="5" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%',height:'auto' }}>
      <defs><linearGradient id="rf5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#050510"/><stop offset="100%" stopColor="#0a0a18"/></linearGradient><style>{`.m5s{animation:m5S 2s infinite alternate}.m5l{animation:m5L 3s ease-in-out infinite}@keyframes m5S{0%{opacity:.1}100%{opacity:.8}}@keyframes m5L{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}`}</style></defs>
      <rect width="400" height="200" fill="url(#rf5)"/>
      {[{x:50,y:20},{x:140,y:25},{x:200,y:12},{x:310,y:15},{x:360,y:25}].map((st,i)=>(<circle key={i} cx={st.x} cy={st.y} r={i%2===0?1.8:1} fill={i%2===0?"#2e7d32":"white"} className="m5s" style={{animationDelay:`${i*.2}s`}} opacity=".5"/>))}
      <circle cx="80" cy="35" r="20" fill="#f5f0e8" opacity=".75"/><circle cx="90" cy="28" r="16" fill="#050510"/>
      <rect x="0" y="155" width="400" height="45" fill="#0d0d1a"/>
      <line x1="0" y1="158" x2="400" y2="158" stroke="#1a1a2a" strokeWidth="2"/>
      {[0,80,160,240,320,400].map((x,i)=>(<line key={i} x1={x} y1="158" x2={x} y2="185" stroke="#141422" strokeWidth="1.5"/>))}
      <g className="m5l" style={{transformOrigin:'160px 155px'}}><ellipse cx="160" cy="155" rx="8" ry="10" fill="#2e7d32" opacity=".15"/><circle cx="160" cy="150" r="4" fill="#2e7d32" opacity=".3"/></g>
      <path d="M0,155 L20,130 L35,145 L60,115 L75,130 L155,140 L400,140 L400,155Z" fill="#08081a"/>
      <text x="200" y="197" fontFamily="Georgia,serif" fontSize="10" fill="rgba(255,255,255,.2)" textAnchor="middle" fontStyle="italic">{loc}</text>
    </svg>,
  ];
  return illustrations[s];
}

interface MemoirViewProps {
  entries: Entry[];
  showToast: (msg: string) => void;
}

export default function MemoirView({ entries, showToast }: MemoirViewProps) {
  const [memoir, setMemoir] = useState('');
  const [memoirLoading, setMemoirLoading] = useState(false);
  const [memoirOpen, setMemoirOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [illustrationSeed, setIllustrationSeed] = useState(0);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleEntry = (id: number) => {
    setSelectedIds(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const entriesToUse = selectMode && selectedIds.size > 0
    ? entries.filter(e => selectedIds.has(e.id)) : entries;

  const locations = entriesToUse.map(e => e.location);
  const primaryLocation = entriesToUse[0]?.location || '';
  const allLocations = [...new Set(locations)].join(' · ');

  const generateMemoir = async () => {
    if (entries.length === 0) { showToast('Add some entries first'); return; }
    if (entriesToUse.length === 0) { showToast('Select at least one entry'); return; }
    setMemoirOpen(true);
    setMemoirLoading(true);
    setShowSharePanel(false);
    setIllustrationSeed(Date.now() % 6);

    const entrySummary = entriesToUse.slice(0, 8).map((e) => {
      const prompt = PROMPTS.find((p) => p.id === e.prompt);
      return `📍 ${e.location} (${e.date})\n"${prompt?.q}"\n→ ${e.text}`;
    }).join('\n\n');

    try {
      const text = await callClaude({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        system: `You are a poet and travel diarist writing for Instagram and WhatsApp — not a literary journal.

RULES:
- Use the traveller's EXACT words and phrases. Lift them directly. Do not replace.
- SHORT: 120-160 words. This is a social media caption, not an essay.
- 3-4 short paragraphs. Each should work as a standalone quote.
- Open with the most visceral sensory detail from their entries.
- End with one plain-spoken line that hits like a quiet revelation.
- Tone: earthen, warm, like a letter written by firelight.
- Include 📍 location naturally in the text.

BANNED: vibrant, bustling, hidden gem, tapestry, mosaic, wanderlust, breathtaking, stunning, picturesque, off the beaten path.

OUTPUT: plain prose only. No headers. No bullet points. No hashtags.`,
        messages: [{ role: 'user', content: `My travel journal entries:\n\n${entrySummary}\n\nWrite my travel diary. Short. Poetic. Shareable. Use my exact words.` }],
      });
      setMemoir(text || 'Could not generate. Please try again.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      setMemoir(msg.includes('VITE_CLOUDFLARE') ? 'AI proxy not configured. Check your .env file.' : 'Something went wrong. Try again.');
    } finally {
      setMemoirLoading(false);
    }
  };

  // Capture card as image and share
  const captureAndShare = async (shareTarget?: string) => {
    if (!cardRef.current) return;
    setCapturing(true);
    showToast('Preparing image...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#111110',
        scale: 2, // retina quality
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) { showToast('Could not capture card'); setCapturing(false); return; }
        const file = new File([blob], 'safarnama-memoir.png', { type: 'image/png' });

        // Try native share with image file (works on mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Safarnama — ${primaryLocation}`,
              text: `📍 ${allLocations}\n\n#traveldiary #slowtravel`,
            });
            showToast('Shared!');
          } catch { /* cancelled */ }
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'safarnama-memoir.png';
          a.click();
          URL.revokeObjectURL(url);
          showToast('Image saved — share from your photos');
        }
        setCapturing(false);
      }, 'image/png');
    } catch {
      showToast('Could not capture. Try copying text instead.');
      setCapturing(false);
    }
  };

  // Platform-specific: copy text + open app
  const shareText = (platform: string) => {
    const text = `${memoir}\n\n📍 ${allLocations}\n\n#traveldiary #slowtravel #travelwriting #safarnama`;
    navigator.clipboard.writeText(text);

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://neha-rani-r.github.io/safarnama/')}&quote=${encodeURIComponent(memoir.slice(0, 300))}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(memoir.slice(0, 220) + '...\n\n📍 ' + primaryLocation + '\n\n#traveldiary #slowtravel')}`,
      instagram: 'https://www.instagram.com/',
      messages: `sms:?body=${encodeURIComponent(text)}`,
    };

    if (platform === 'instagram') {
      showToast('Caption copied — paste in Instagram');
    } else if (platform === 'messages') {
      showToast('Opening Messages...');
    } else {
      showToast('Text copied!');
    }

    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  const postText = `${memoir}\n\n📍 ${allLocations}\n\n#traveldiary #slowtravel #travelwriting #safarnama`;

  const STARS = [
    { top: '12%', left: '4%', size: 2.5, dur: '2.8s', delay: '0s' },
    { top: '65%', left: '10%', size: 2, dur: '3.5s', delay: '0.4s' },
    { top: '25%', left: '80%', size: 3, dur: '2.2s', delay: '0.9s' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 40, textAlign: 'center', padding: '40px 0 0', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {STARS.map((s, i) => (<div key={i} style={{ position: 'absolute', top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: '50%', background: '#2e7d32', animation: `starFloat ${s.dur} ease-in-out infinite ${s.delay}` }}/>))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="48" height="48" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" className="compass-needle" style={{ transformOrigin: '36px 36px' }}>
            <circle cx="36" cy="36" r="32" fill="none" stroke="#e8e6e1" strokeWidth="2"/>
            <line x1="36" y1="4" x2="36" y2="10" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4"/>
            <line x1="36" y1="62" x2="36" y2="68" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4"/>
            <line x1="4" y1="36" x2="10" y2="36" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4"/>
            <line x1="62" y1="36" x2="68" y2="36" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.4"/>
            <path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32"/>
            <circle cx="36" cy="14" r="2.5" fill="#2e7d32"/>
            <path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity="0.4"/>
            <circle cx="36" cy="36" r="4" fill="#1a1a1a"/>
            <circle cx="36" cy="36" r="2" fill="#2e7d32"/>
          </svg>
        </div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 400, fontStyle: 'italic', color: 'var(--text)', marginBottom: 8, lineHeight: 1.2 }}>Your Travel Diary</div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {entries.length} {entries.length === 1 ? 'moment' : 'moments'} · poetic · shareable as image
        </div>
      </div>

      {/* Entry selector */}
      {entries.length > 1 && (
        <div style={{ marginBottom: 24 }}>
          <button onClick={() => { setSelectMode(!selectMode); setSelectedIds(new Set()); }} style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, background: selectMode ? '#111110' : 'transparent', color: selectMode ? '#fff' : 'var(--muted)', border: '1px solid var(--border)', padding: '8px 18px', borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{selectMode ? '✕' : '◈'}</span>
            {selectMode ? 'Cancel' : 'Choose which entries to weave'}
          </button>
          {selectMode && selectedIds.size > 0 && (<div style={{ marginTop: 8, fontFamily: 'var(--sans)', fontSize: 11, color: '#2e7d32', fontWeight: 500 }}>{selectedIds.size} selected</div>)}
        </div>
      )}

      {selectMode && (
        <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {entries.map((entry) => {
            const selected = selectedIds.has(entry.id);
            const prompt = PROMPTS.find(p => p.id === entry.prompt);
            return (
              <button key={entry.id} onClick={() => toggleEntry(entry.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: `1.5px solid ${selected ? '#2e7d32' : 'var(--border)'}`, background: selected ? '#f0f7f0' : 'var(--surface)', borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected ? '#2e7d32' : '#ccc'}`, background: selected ? '#2e7d32' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selected && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontStyle: 'italic', color: 'var(--text)' }}>{entry.location}</span>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: '#2e7d32', background: '#e8f5e9', padding: '1px 8px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{prompt?.why}</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, color: 'var(--text)', opacity: 0.65, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>{entry.text}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Generate CTA */}
      <button onClick={generateMemoir} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', background: 'linear-gradient(135deg,#111110 0%,#1a2a1a 100%)', border: 'none', borderRadius: 12, cursor: 'pointer', marginBottom: 4, boxShadow: '0 4px 24px rgba(46,125,50,.12)' }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: 'italic', color: '#fff', marginBottom: 4 }}>{memoir && !memoirLoading ? 'Write a new version' : 'Generate my travel diary'}</div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'rgba(255,255,255,.4)', fontWeight: 300 }}>short · poetic · share as image or text</div>
        </div>
        <svg width="28" height="28" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="30" fill="none" stroke="#2e7d32" strokeWidth="2.5"/>
          <path d="M36,14 L30,32 L36,28 L42,32 Z" fill="#2e7d32"/>
          <circle cx="36" cy="14" r="3" fill="#2e7d32"/>
          <circle cx="36" cy="36" r="4" fill="rgba(255,255,255,.2)"/>
          <circle cx="36" cy="36" r="2" fill="#2e7d32"/>
        </svg>
      </button>

      {/* Output */}
      {memoirOpen && (
        <div style={{ marginTop: 16, animation: 'fadeUp 0.5s ease' }}>
          {memoirLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '60px 20px', background: 'var(--surface)', borderRadius: 16 }}>
              <svg width="52" height="52" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                <circle cx="36" cy="36" r="32" fill="none" stroke="#e8e6e1" strokeWidth="2"/>
                <g className="compass-needle-spin"><path d="M36,12 L30,33 L36,28 L42,33 Z" fill="#2e7d32"/><circle cx="36" cy="14" r="2.5" fill="#2e7d32"/><path d="M36,60 L30,39 L36,44 L42,39 Z" fill="#1a1a1a" opacity=".3"/></g>
                <circle cx="36" cy="36" r="4" fill="#1a1a1a"/><circle cx="36" cy="36" r="2" fill="#2e7d32"/>
              </svg>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontStyle: 'italic', color: 'var(--text)', marginBottom: 6 }}>Weaving your words...</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--muted)' }}>lifting your exact moments into poetry</div>
              </div>
            </div>
          ) : (
            <div>
              {/* The shareable card — captured as image */}
              <div ref={cardRef}>
                <div style={{ borderRadius: '16px 16px 0 0', overflow: 'hidden', lineHeight: 0 }}>
                  <MemoirIllustration seed={illustrationSeed} locations={locations} />
                </div>
                <div style={{ background: '#111110', borderRadius: '0 0 16px 16px', padding: '28px 28px 24px', borderTop: '3px solid #2e7d32' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <svg width="14" height="14" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#2e7d32" strokeWidth="3"/>
                      <path d="M36,14 L30,32 L36,28 L42,32 Z" fill="#2e7d32"/>
                      <circle cx="36" cy="36" r="4" fill="#2e7d32"/>
                    </svg>
                    <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: '#2e7d32', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>{allLocations}</span>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 400, lineHeight: 2, color: 'rgba(255,255,255,.88)', whiteSpace: 'pre-wrap', marginBottom: 24 }}>{memoir}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 16 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 900, letterSpacing: '0.12em', color: '#2e7d32' }}>SAFARNAMA</div>
                      <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: 'rgba(255,255,255,.2)', marginTop: 2 }}>सफ़रनामा · travel journal</div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" opacity=".4">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#2e7d32" strokeWidth="3"/>
                      <path d="M36,14 L30,32 L36,28 L42,32 Z" fill="#2e7d32"/>
                      <circle cx="36" cy="36" r="4" fill="#2e7d32"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button
                  onClick={() => captureAndShare()}
                  disabled={capturing}
                  style={{ flex: 2, padding: '13px', background: capturing ? 'var(--muted)' : '#2e7d32', color: 'white', border: 'none', borderRadius: 10, cursor: capturing ? 'default' : 'pointer', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  {capturing ? 'Preparing...' : 'Share as Image'}
                </button>
                <button
                  onClick={() => setShowSharePanel(!showSharePanel)}
                  style={{ flex: 1, padding: '13px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500 }}
                >
                  Text ↗
                </button>
              </div>

              {/* Text share panel */}
              {showSharePanel && (
                <div style={{ marginTop: 10, background: 'var(--surface)', borderRadius: 16, padding: '20px', animation: 'fadeUp 0.2s ease' }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Share as text</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    {/* WhatsApp */}
                    <button onClick={() => shareText('whatsapp')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#25D366', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </button>

                    {/* Instagram */}
                    <button onClick={() => shareText('instagram')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Instagram
                    </button>

                    {/* Facebook */}
                    <button onClick={() => shareText('facebook')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#1877F2', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </button>

                    {/* Messages */}
                    <button onClick={() => shareText('messages')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#34C759', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      Messages
                    </button>
                  </div>

                  {/* Copy text */}
                  <button onClick={() => { navigator.clipboard.writeText(postText); showToast('Copied to clipboard!'); }} style={{ width: '100%', padding: '11px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    Copy text
                  </button>

                  <button onClick={generateMemoir} style={{ width: '100%', marginTop: 8, padding: '10px', background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 12 }}>↺ Regenerate</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!memoirOpen && entries.length === 0 && (
        <div className="empty" style={{ paddingTop: 40 }}>
          <div className="empty-text">No entries yet.</div>
          <div className="empty-sub">Write a few journal entries, then come back here.</div>
        </div>
      )}
    </div>
  );
}
