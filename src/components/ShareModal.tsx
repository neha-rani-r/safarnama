import { useState } from 'react';
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

// Animated SVG scenes - each prompt type gets its own scene
const SCENES: Record<string, string> = {
  senses: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050510"/><stop offset="100%" stop-color="#0a1a0a"/></linearGradient>
        <style>
          .s-star{animation:sTwinkle 2s ease-in-out infinite alternate}
          .s-wave1{animation:sWave 4s ease-in-out infinite}
          .s-wave2{animation:sWave 4s ease-in-out infinite 1s}
          .s-wave3{animation:sWave 4s ease-in-out infinite 2s}
          .s-bird1{animation:sBird 6s ease-in-out infinite}
          .s-bird2{animation:sBird 6s ease-in-out infinite 1.5s}
          .s-bird3{animation:sBird 6s ease-in-out infinite 3s}
          .s-needle{transform-origin:200px 90px;animation:sNeedle 4s ease-in-out infinite}
          @keyframes sTwinkle{0%{opacity:.3}100%{opacity:1}}
          @keyframes sWave{0%,100%{d:path("M0,110 Q50,98 100,110 Q150,122 200,110 Q250,98 300,110 Q350,122 400,110")}50%{d:path("M0,115 Q50,103 100,115 Q150,127 200,115 Q250,103 300,115 Q350,127 400,115")}}
          @keyframes sBird{0%{transform:translate(0,0)}25%{transform:translate(8px,-5px)}50%{transform:translate(0,-2px)}75%{transform:translate(-5px,-6px)}100%{transform:translate(0,0)}}
          @keyframes sNeedle{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
        </style>
      </defs>
      <rect width="400" height="180" fill="url(#sg1)"/>
      <circle cx="50" cy="25" r="1.5" fill="#2e7d32" opacity=".7" class="s-star" style="animation-delay:.3s"/>
      <circle cx="120" cy="15" r="1" fill="white" opacity=".5" class="s-star" style="animation-delay:.8s"/>
      <circle cx="200" cy="20" r="2" fill="#2e7d32" opacity=".6" class="s-star" style="animation-delay:.1s"/>
      <circle cx="280" cy="12" r="1.5" fill="white" opacity=".4" class="s-star" style="animation-delay:1.2s"/>
      <circle cx="350" cy="28" r="1" fill="#2e7d32" opacity=".8" class="s-star" style="animation-delay:.5s"/>
      <circle cx="90" cy="40" r="1" fill="white" opacity=".3" class="s-star" style="animation-delay:.9s"/>
      <circle cx="320" cy="35" r="1.5" fill="#2e7d32" opacity=".5" class="s-star" style="animation-delay:1.5s"/>
      <circle cx="170" cy="45" r="1" fill="white" opacity=".4" class="s-star" style="animation-delay:.2s"/>
      <circle cx="240" cy="32" r="1.2" fill="#2e7d32" opacity=".6" class="s-star" style="animation-delay:.7s"/>
      <circle cx="60" cy="55" r="1" fill="white" opacity=".3" class="s-star" style="animation-delay:1.1s"/>
      <!-- Moon -->
      <circle cx="340" cy="35" r="18" fill="#f5f0e8" opacity=".8"/>
      <circle cx="350" cy="29" r="14" fill="#050510"/>
      <!-- Ocean -->
      <path class="s-wave1" d="M0,110 Q50,98 100,110 Q150,122 200,110 Q250,98 300,110 Q350,122 400,110 L400,180 L0,180Z" fill="#0a1f18" opacity=".9"/>
      <path class="s-wave2" d="M0,125 Q40,113 80,125 Q120,137 160,125 Q200,113 240,125 Q280,137 320,125 Q360,113 400,125 L400,180 L0,180Z" fill="#071510"/>
      <path class="s-wave3" d="M0,140 Q60,132 120,140 Q180,148 240,140 Q300,132 360,140 Q380,136 400,140 L400,180 L0,180Z" fill="#050e0a"/>
      <!-- Birds -->
      <g class="s-bird1"><path d="M100,65 Q108,59 116,65" fill="none" stroke="#2e7d32" stroke-width="1.8" stroke-linecap="round" opacity=".7"/></g>
      <g class="s-bird2"><path d="M130,52 Q140,45 150,52" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity=".4"/></g>
      <g class="s-bird3"><path d="M80,75 Q87,69 94,75" fill="none" stroke="#2e7d32" stroke-width="1.2" stroke-linecap="round" opacity=".5"/></g>
      <g class="s-bird1" style="animation-delay:2s"><path d="M170,58 Q179,51 188,58" fill="none" stroke="white" stroke-width="1.6" stroke-linecap="round" opacity=".35"/></g>
      <!-- Compass -->
      <g class="s-needle">
        <circle cx="200" cy="90" r="22" fill="none" stroke="#2e7d32" stroke-width="1.2" opacity=".3"/>
        <path d="M200,72 L196,88 L200,85 L204,88Z" fill="#2e7d32" opacity=".6"/>
        <path d="M200,108 L196,92 L200,95 L204,92Z" fill="white" opacity=".2"/>
        <circle cx="200" cy="90" r="3" fill="#2e7d32" opacity=".5"/>
      </g>
    </svg>`,

  food: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0507"/><stop offset="100%" stop-color="#150a05"/></linearGradient>
        <style>
          .f-steam1{animation:fSteam 2.5s ease-in-out infinite}
          .f-steam2{animation:fSteam 2.5s ease-in-out infinite .6s}
          .f-steam3{animation:fSteam 2.5s ease-in-out infinite 1.2s}
          .f-star{animation:fTwinkle 2s ease-in-out infinite alternate}
          .f-lantern{animation:fSway 3s ease-in-out infinite}
          .f-lantern2{animation:fSway 3s ease-in-out infinite 1s}
          .f-chop{animation:fChop .8s ease-in-out infinite alternate}
          @keyframes fSteam{0%{transform:translateY(0) scaleX(1);opacity:.6}50%{transform:translateY(-15px) scaleX(1.3);opacity:.3}100%{transform:translateY(-28px) scaleX(.8);opacity:0}}
          @keyframes fTwinkle{0%{opacity:.2}100%{opacity:.9}}
          @keyframes fSway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
          @keyframes fChop{0%{transform:rotate(-15deg) translate(5px,-5px)}100%{transform:rotate(5deg) translate(0,0)}}
        </style>
      </defs>
      <rect width="400" height="180" fill="url(#fg1)"/>
      <!-- Stars -->
      <circle cx="40" cy="20" r="1.5" fill="#2e7d32" opacity=".6" class="f-star" style="animation-delay:.2s"/>
      <circle cx="100" cy="12" r="1" fill="white" opacity=".4" class="f-star" style="animation-delay:.7s"/>
      <circle cx="300" cy="18" r="1.5" fill="#2e7d32" opacity=".5" class="f-star" style="animation-delay:1s"/>
      <circle cx="360" cy="25" r="1" fill="white" opacity=".4" class="f-star" style="animation-delay:.4s"/>
      <circle cx="160" cy="30" r="1.2" fill="#2e7d32" opacity=".7" class="f-star" style="animation-delay:.9s"/>
      <circle cx="240" cy="15" r="1" fill="white" opacity=".3" class="f-star" style="animation-delay:1.3s"/>
      <!-- Lanterns -->
      <g class="f-lantern" style="transform-origin:100px 0">
        <line x1="100" y1="0" x2="100" y2="30" stroke="rgba(255,200,100,.2)" stroke-width="1"/>
        <ellipse cx="100" cy="45" rx="12" ry="18" fill="#2e7d32" opacity=".25"/>
        <ellipse cx="100" cy="45" rx="8" ry="14" fill="#2e7d32" opacity=".15"/>
        <circle cx="100" cy="38" r="3" fill="#f5d76e" opacity=".3"/>
      </g>
      <g class="f-lantern2" style="transform-origin:300px 0">
        <line x1="300" y1="0" x2="300" y2="25" stroke="rgba(255,200,100,.2)" stroke-width="1"/>
        <ellipse cx="300" cy="40" rx="10" ry="15" fill="#2e7d32" opacity=".2"/>
        <circle cx="300" cy="34" r="2.5" fill="#f5d76e" opacity=".25"/>
      </g>
      <!-- Bowl -->
      <ellipse cx="200" cy="130" rx="55" ry="15" fill="#1a0f08"/>
      <path d="M145,120 Q200,155 255,120" fill="#1a0f08" stroke="#2a1a0a" stroke-width="1.5"/>
      <ellipse cx="200" cy="120" rx="55" ry="12" fill="#251508"/>
      <!-- Noodles in bowl -->
      <path d="M162,118 Q175,112 188,118 Q200,124 212,118 Q225,112 238,118" fill="none" stroke="#8B6914" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
      <path d="M165,122 Q178,116 191,122 Q204,128 217,122 Q228,116 237,122" fill="none" stroke="#A07820" stroke-width="2" stroke-linecap="round" opacity=".6"/>
      <!-- Steam -->
      <g class="f-steam1"><path d="M180,105 Q176,95 180,85 Q184,75 180,65" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2" stroke-linecap="round"/></g>
      <g class="f-steam2"><path d="M200,100 Q196,90 200,80 Q204,70 200,60" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="2" stroke-linecap="round"/></g>
      <g class="f-steam3"><path d="M220,105 Q216,95 220,85 Q224,75 220,65" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2" stroke-linecap="round"/></g>
      <!-- Chopsticks -->
      <g class="f-chop" style="transform-origin:200px 100px">
        <line x1="185" y1="85" x2="215" y2="125" stroke="#8B5E2A" stroke-width="3" stroke-linecap="round"/>
        <line x1="195" y1="80" x2="225" y2="120" stroke="#A0722A" stroke-width="3" stroke-linecap="round"/>
      </g>
      <!-- Table surface -->
      <rect x="0" y="155" width="400" height="25" fill="#0d0805" opacity=".8"/>
      <!-- Small garnish -->
      <circle cx="270" cy="148" r="4" fill="#2e7d32" opacity=".4"/>
      <circle cx="130" cy="150" r="3" fill="#2e7d32" opacity=".3"/>
    </svg>`,

  human: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050a14"/><stop offset="100%" stop-color="#0a0f1a"/></linearGradient>
        <style>
          .h-star{animation:hTwinkle 2s ease-in-out infinite alternate}
          .h-fire{animation:hFire .6s ease-in-out infinite alternate}
          .h-fire2{animation:hFire .6s ease-in-out infinite alternate .3s}
          .h-person1{animation:hBob 3s ease-in-out infinite}
          .h-person2{animation:hBob 3s ease-in-out infinite .8s}
          .h-smoke{animation:hSmoke 3s ease-in-out infinite}
          @keyframes hTwinkle{0%{opacity:.2}100%{opacity:.9}}
          @keyframes hFire{0%{transform:scaleY(1) scaleX(1)}100%{transform:scaleY(1.2) scaleX(.85)}}
          @keyframes hBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
          @keyframes hSmoke{0%{transform:translateY(0);opacity:.4}100%{transform:translateY(-20px);opacity:0}}
        </style>
      </defs>
      <rect width="400" height="180" fill="url(#hg1)"/>
      <!-- Stars -->
      <circle cx="30" cy="18" r="1.5" fill="#2e7d32" class="h-star" style="animation-delay:.1s" opacity=".7"/>
      <circle cx="80" cy="8" r="1" fill="white" class="h-star" style="animation-delay:.5s" opacity=".5"/>
      <circle cx="150" cy="22" r="1.2" fill="#2e7d32" class="h-star" style="animation-delay:.9s" opacity=".6"/>
      <circle cx="260" cy="14" r="1.5" fill="white" class="h-star" style="animation-delay:.3s" opacity=".4"/>
      <circle cx="340" cy="20" r="1" fill="#2e7d32" class="h-star" style="animation-delay:1.2s" opacity=".7"/>
      <circle cx="380" cy="35" r="1.3" fill="white" class="h-star" style="animation-delay:.7s" opacity=".4"/>
      <circle cx="200" cy="30" r="1" fill="#2e7d32" class="h-star" style="animation-delay:.4s" opacity=".5"/>
      <!-- Moon -->
      <circle cx="60" cy="38" r="16" fill="#f5f0e8" opacity=".75"/>
      <circle cx="68" cy="32" r="13" fill="#050a14"/>
      <!-- Ground + campfire -->
      <rect x="0" y="148" width="400" height="32" fill="#080a08"/>
      <!-- Campfire logs -->
      <line x1="175" y1="148" x2="205" y2="138" stroke="#5c3d1e" stroke-width="5" stroke-linecap="round"/>
      <line x1="225" y1="148" x2="195" y2="138" stroke="#6b4522" stroke-width="5" stroke-linecap="round"/>
      <!-- Fire -->
      <g class="h-fire" style="transform-origin:200px 138px">
        <path d="M192,138 Q196,125 200,118 Q204,125 208,138Z" fill="#c0392b" opacity=".8"/>
        <path d="M195,138 Q199,128 200,122 Q201,128 205,138Z" fill="#e67e22" opacity=".9"/>
      </g>
      <g class="h-fire2" style="transform-origin:200px 138px">
        <path d="M196,138 Q199,130 200,125 Q201,130 204,138Z" fill="#f39c12" opacity=".7"/>
      </g>
      <!-- Fire glow -->
      <ellipse cx="200" cy="142" rx="30" ry="8" fill="#c0392b" opacity=".08"/>
      <!-- Smoke -->
      <g class="h-smoke"><path d="M198,115 Q194,105 198,95 Q202,85 198,75" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="2" stroke-linecap="round"/></g>
      <!-- Person 1 (sitting left) -->
      <g class="h-person1">
        <circle cx="140" cy="128" r="9" fill="#1a1208" stroke="#2a1e0a" stroke-width="1"/>
        <path d="M130,137 Q135,148 140,148 Q145,148 150,137" fill="#1a1208" stroke="#2a1e0a" stroke-width="1"/>
        <line x1="135" y1="140" x2="120" y2="148" stroke="#1a1208" stroke-width="4" stroke-linecap="round"/>
        <line x1="145" y1="140" x2="158" y2="148" stroke="#1a1208" stroke-width="4" stroke-linecap="round"/>
      </g>
      <!-- Person 2 (sitting right) -->
      <g class="h-person2">
        <circle cx="260" cy="126" r="9" fill="#1a1208" stroke="#2a1e0a" stroke-width="1"/>
        <path d="M250,135 Q255,148 260,148 Q265,148 270,135" fill="#1a1208" stroke="#2a1e0a" stroke-width="1"/>
        <line x1="255" y1="138" x2="242" y2="148" stroke="#1a1208" stroke-width="4" stroke-linecap="round"/>
        <line x1="265" y1="138" x2="278" y2="148" stroke="#1a1208" stroke-width="4" stroke-linecap="round"/>
      </g>
      <!-- Trees silhouette -->
      <path d="M0,148 L20,100 L40,148Z" fill="#080a08"/>
      <path d="M360,148 L380,95 L400,148Z" fill="#080a08"/>
      <path d="M350,148 L370,110 L390,148Z" fill="#0a0c0a"/>
    </svg>`,

  notice: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="ng1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#060a06"/><stop offset="100%" stop-color="#0a140a"/></linearGradient>
        <style>
          .n-star{animation:nTwinkle 2s ease-in-out infinite alternate}
          .n-leaf1{animation:nLeaf 4s ease-in-out infinite}
          .n-leaf2{animation:nLeaf 4s ease-in-out infinite 1s}
          .n-leaf3{animation:nLeaf 4s ease-in-out infinite 2s}
          .n-bird{animation:nBird 5s ease-in-out infinite}
          .n-glow{animation:nGlow 3s ease-in-out infinite}
          .n-ray{animation:nRay 4s ease-in-out infinite}
          @keyframes nTwinkle{0%{opacity:.2}100%{opacity:1}}
          @keyframes nLeaf{0%,100%{transform:rotate(-5deg) translateX(0)}50%{transform:rotate(5deg) translateX(4px)}}
          @keyframes nBird{0%{transform:translate(0,0)}30%{transform:translate(15px,-8px)}70%{transform:translate(30px,-4px)}100%{transform:translate(0,0)}}
          @keyframes nGlow{0%,100%{opacity:.06}50%{opacity:.12}}
          @keyframes nRay{0%,100%{opacity:.04;transform:scaleX(.8)}50%{opacity:.09;transform:scaleX(1)}}
        </style>
      </defs>
      <rect width="400" height="180" fill="url(#ng1)"/>
      <!-- Stars through canopy -->
      <circle cx="200" cy="15" r="2" fill="#2e7d32" class="n-star" opacity=".9" style="animation-delay:.1s"/>
      <circle cx="185" cy="30" r="1.5" fill="white" class="n-star" opacity=".6" style="animation-delay:.5s"/>
      <circle cx="215" cy="25" r="1.2" fill="#2e7d32" class="n-star" opacity=".7" style="animation-delay:.9s"/>
      <circle cx="195" cy="48" r="1" fill="white" class="n-star" opacity=".5" style="animation-delay:.3s"/>
      <circle cx="205" cy="42" r="1.3" fill="#2e7d32" class="n-star" opacity=".6" style="animation-delay:.7s"/>
      <!-- Forest trees -->
      <path d="M0,180 L25,70 L50,180Z" fill="#060c06"/>
      <path d="M15,180 L45,55 L75,180Z" fill="#09110a"/>
      <path d="M40,180 L65,80 L90,180Z" fill="#060c06"/>
      <path d="M400,180 L375,70 L350,180Z" fill="#060c06"/>
      <path d="M385,180 L355,55 L325,180Z" fill="#09110a"/>
      <path d="M360,180 L335,80 L310,180Z" fill="#060c06"/>
      <!-- Light beam in centre -->
      <g class="n-ray">
        <path d="M160,0 L240,0 L210,180 L190,180Z" fill="#2e7d32"/>
      </g>
      <!-- Path -->
      <path d="M170,180 Q188,120 196,80 Q200,55 204,80 Q212,120 230,180Z" fill="#0d150d"/>
      <!-- Floating leaves -->
      <g class="n-leaf1" style="transform-origin:120px 80px">
        <ellipse cx="120" cy="80" rx="8" ry="4" fill="#2e7d32" opacity=".5" transform="rotate(-30,120,80)"/>
      </g>
      <g class="n-leaf2" style="transform-origin:280px 100px">
        <ellipse cx="280" cy="100" rx="6" ry="3" fill="#2e7d32" opacity=".4" transform="rotate(20,280,100)"/>
      </g>
      <g class="n-leaf3" style="transform-origin:150px 130px">
        <ellipse cx="150" cy="130" rx="7" ry="3.5" fill="#2e7d32" opacity=".35" transform="rotate(-15,150,130)"/>
      </g>
      <!-- Fireflies -->
      <circle cx="110" cy="110" r="2.5" fill="#2e7d32" class="n-glow" opacity=".7"/>
      <circle cx="290" cy="95" r="2" fill="#2e7d32" class="n-glow" opacity=".6" style="animation-delay:1s"/>
      <circle cx="170" cy="140" r="2.5" fill="#2e7d32" class="n-glow" opacity=".5" style="animation-delay:.5s"/>
      <circle cx="240" cy="125" r="2" fill="#2e7d32" class="n-glow" opacity=".7" style="animation-delay:1.5s"/>
      <!-- Bird -->
      <g class="n-bird">
        <path d="M240,60 Q248,54 256,60" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5" stroke-linecap="round"/>
      </g>
    </svg>`,

  body: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#05050f"/><stop offset="60%" stop-color="#0a0808"/><stop offset="100%" stop-color="#150e05"/></linearGradient>
        <style>
          .b-star{animation:bTwinkle 2s ease-in-out infinite alternate}
          .b-dune{animation:bDune 6s ease-in-out infinite}
          .b-cactus{animation:bSway 4s ease-in-out infinite}
          .b-shoot{animation:bShoot 4s linear infinite}
          @keyframes bTwinkle{0%{opacity:.15}100%{opacity:.95}}
          @keyframes bDune{0%,100%{transform:translateX(0)}50%{transform:translateX(3px)}}
          @keyframes bSway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
          @keyframes bShoot{0%{transform:translate(0,0);opacity:1}80%{transform:translate(-80px,40px);opacity:0}100%{transform:translate(0,0);opacity:0}}
        </style>
      </defs>
      <rect width="400" height="180" fill="url(#bg1)"/>
      <!-- Milky way -->
      <path d="M50,0 Q200,55 350,0" fill="none" stroke="rgba(255,255,255,.03)" stroke-width="35"/>
      <!-- Stars -->
      ${Array.from({length:25}).map((_,i)=>`<circle cx="${Math.abs(Math.sin(i*137)*380)}" cy="${Math.abs(Math.cos(i*97)*70)+5}" r="${i%5===0?2:i%3===0?1.5:1}" fill="${i%3===0?'#2e7d32':'white'}" class="b-star" style="animation-delay:${(i*0.3)%3}s" opacity="${.2+i%4*.15}"/>`).join('')}
      <!-- Shooting star -->
      <line x1="320" y1="20" x2="340" y2="15" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity=".6" class="b-shoot"/>
      <!-- Moon -->
      <circle cx="200" cy="38" r="20" fill="#f5f0e8" opacity=".85"/>
      <circle cx="211" cy="31" r="16" fill="#05050f"/>
      <!-- Dunes -->
      <g class="b-dune">
        <path d="M0,148 Q100,118 200,140 Q300,162 400,138 L400,180 L0,180Z" fill="#150e05"/>
      </g>
      <path d="M0,162 Q80,148 180,158 Q280,168 400,155 L400,180 L0,180Z" fill="#0f0a03"/>
      <!-- Cactus left -->
      <g class="b-cactus" style="transform-origin:70px 148px">
        <rect x="67" y="115" width="6" height="33" fill="#0d1a0d" rx="3"/>
        <rect x="55" y="128" width="14" height="5" fill="#0d1a0d" rx="2"/>
        <rect x="69" y="122" width="5" height="13" fill="#0d1a0d" rx="2"/>
      </g>
      <!-- Cactus right -->
      <g class="b-cactus" style="transform-origin:330px 148px;animation-delay:.5s">
        <rect x="327" y="120" width="5" height="28" fill="#0d1a0d" rx="2"/>
        <rect x="318" y="132" width="11" height="4" fill="#0d1a0d" rx="2"/>
      </g>
      <!-- Compass on ground -->
      <circle cx="200" cy="162" r="12" fill="none" stroke="#2e7d32" stroke-width="1" opacity=".25"/>
      <path d="M200,152 L198,161 L200,159 L202,161Z" fill="#2e7d32" opacity=".4"/>
    </svg>`,

  surprise: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="spg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#050510"/><stop offset="100%" stop-color="#0a0a18"/></linearGradient>
        <style>
          .sp-star{animation:spTwinkle 2s ease-in-out infinite alternate}
          .sp-build{animation:spLight 3s ease-in-out infinite alternate}
          .sp-bird{animation:spBird 7s linear infinite}
          .sp-lantern{animation:spSway 4s ease-in-out infinite}
          @keyframes spTwinkle{0%{opacity:.1}100%{opacity:.9}}
          @keyframes spLight{0%{opacity:.2}100%{opacity:.5}}
          @keyframes spBird{0%{transform:translateX(-50px)}100%{transform:translateX(500px)}}
          @keyframes spSway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
        </style>
      </defs>
      <rect width="400" height="180" fill="url(#spg1)"/>
      <!-- Stars -->
      <circle cx="40" cy="15" r="1.5" fill="#2e7d32" class="sp-star" opacity=".7" style="animation-delay:.2s"/>
      <circle cx="90" cy="8" r="1" fill="white" class="sp-star" opacity=".5" style="animation-delay:.6s"/>
      <circle cx="180" cy="20" r="1.5" fill="#2e7d32" class="sp-star" opacity=".6" style="animation-delay:1s"/>
      <circle cx="300" cy="12" r="1" fill="white" class="sp-star" opacity=".4" style="animation-delay:.4s"/>
      <circle cx="360" cy="22" r="1.5" fill="#2e7d32" class="sp-star" opacity=".7" style="animation-delay:.8s"/>
      <circle cx="130" cy="35" r="1" fill="white" class="sp-star" opacity=".3" style="animation-delay:1.4s"/>
      <circle cx="230" cy="28" r="1.2" fill="#2e7d32" class="sp-star" opacity=".5" style="animation-delay:.3s"/>
      <!-- City skyline -->
      <rect x="0" y="95" width="30" height="85" fill="#08081a"/>
      <rect x="5" y="75" width="20" height="25" fill="#08081a"/>
      <rect x="30" y="105" width="40" height="75" fill="#0c0c22"/>
      <rect x="38" y="82" width="24" height="28" fill="#0c0c22"/>
      <rect x="80" y="80" width="25" height="100" fill="#08081a"/>
      <rect x="115" y="100" width="35" height="80" fill="#0a0a1e"/>
      <rect x="160" y="65" width="22" height="115" fill="#08081a"/>
      <rect x="192" y="88" width="40" height="92" fill="#0c0c22"/>
      <rect x="242" y="95" width="28" height="85" fill="#08081a"/>
      <rect x="280" y="82" width="38" height="98" fill="#0a0a1e"/>
      <rect x="328" y="90" width="25" height="90" fill="#08081a"/>
      <rect x="363" y="78" width="37" height="102" fill="#0c0c22"/>
      <!-- Windows lit up -->
      <rect class="sp-build" x="12" y="80" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".4"/>
      <rect class="sp-build" x="42" y="88" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".35" style="animation-delay:.5s"/>
      <rect class="sp-build" x="42" y="100" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".5" style="animation-delay:1s"/>
      <rect class="sp-build" x="85" y="86" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".4" style="animation-delay:.3s"/>
      <rect class="sp-build" x="85" y="100" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".3" style="animation-delay:1.5s"/>
      <rect class="sp-build" x="165" y="72" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".45" style="animation-delay:.7s"/>
      <rect class="sp-build" x="165" y="86" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".35" style="animation-delay:1.2s"/>
      <rect class="sp-build" x="197" y="94" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".5" style="animation-delay:.2s"/>
      <rect class="sp-build" x="215" y="94" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".3" style="animation-delay:.9s"/>
      <rect class="sp-build" x="285" y="88" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".45" style="animation-delay:.6s"/>
      <rect class="sp-build" x="335" y="96" width="5" height="4" fill="#2e7d32" rx=".5" opacity=".4" style="animation-delay:1.3s"/>
      <!-- Lanterns strung across -->
      <line x1="0" y1="62" x2="400" y2="68" stroke="rgba(255,200,80,.12)" stroke-width="1"/>
      <g class="sp-lantern" style="transform-origin:80px 62px"><ellipse cx="80" cy="72" rx="6" ry="9" fill="#2e7d32" opacity=".18"/><circle cx="80" cy="67" r="2" fill="#f5d76e" opacity=".2"/></g>
      <g class="sp-lantern" style="transform-origin:200px 64px;animation-delay:1s"><ellipse cx="200" cy="74" rx="7" ry="10" fill="#2e7d32" opacity=".15"/><circle cx="200" cy="69" r="2.5" fill="#f5d76e" opacity=".18"/></g>
      <g class="sp-lantern" style="transform-origin:320px 66px;animation-delay:.5s"><ellipse cx="320" cy="76" rx="5" ry="8" fill="#2e7d32" opacity=".16"/><circle cx="320" cy="71" r="2" fill="#f5d76e" opacity=".17"/></g>
      <!-- Flying bird -->
      <g class="sp-bird">
        <path d="M0,55 Q8,49 16,55" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <!-- Moon -->
      <circle cx="340" cy="32" r="16" fill="#f5f0e8" opacity=".7"/>
      <circle cx="349" cy="26" r="13" fill="#050510"/>
    </svg>`,

  recommend: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;">
      <defs>
        <linearGradient id="rg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#060a06"/><stop offset="100%" stop-color="#0a100a"/></linearGradient>
        <style>
          .r-star{animation:rTwinkle 2s ease-in-out infinite alternate}
          .r-mtn{animation:rFloat 6s ease-in-out infinite}
          .r-bird1{animation:rBirdFly 8s linear infinite}
          .r-bird2{animation:rBirdFly 8s linear infinite 2s}
          .r-shine{animation:rShine 4s ease-in-out infinite}
          @keyframes rTwinkle{0%{opacity:.2}100%{opacity:.9}}
          @keyframes rFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
          @keyframes rBirdFly{0%{transform:translate(-100px,0)}100%{transform:translate(500px,-20px)}}
          @keyframes rShine{0%,100%{opacity:.05}50%{opacity:.12}}
        </style>
      </defs>
      <rect width="400" height="180" fill="url(#rg1)"/>
      <!-- Stars -->
      <circle cx="30" cy="20" r="1.5" fill="#2e7d32" class="r-star" opacity=".7" style="animation-delay:.2s"/>
      <circle cx="80" cy="10" r="1" fill="white" class="r-star" opacity=".5" style="animation-delay:.7s"/>
      <circle cx="150" cy="25" r="1.5" fill="#2e7d32" class="r-star" opacity=".6" style="animation-delay:1.1s"/>
      <circle cx="250" cy="15" r="1" fill="white" class="r-star" opacity=".4" style="animation-delay:.4s"/>
      <circle cx="320" cy="22" r="1.5" fill="#2e7d32" class="r-star" opacity=".7" style="animation-delay:.9s"/>
      <circle cx="370" cy="30" r="1" fill="white" class="r-star" opacity=".3" style="animation-delay:.6s"/>
      <circle cx="110" cy="38" r="1.2" fill="#2e7d32" class="r-star" opacity=".5" style="animation-delay:1.3s"/>
      <!-- Aurora/horizon glow -->
      <g class="r-shine">
        <ellipse cx="200" cy="100" rx="200" ry="40" fill="#2e7d32"/>
      </g>
      <!-- Far mountains -->
      <path d="M0,120 L60,55 L120,90 L180,40 L240,80 L300,50 L360,75 L400,55 L400,180 L0,180Z" fill="#0a120a" opacity=".7"/>
      <!-- Snow caps -->
      <path d="M180,40 L168,62 L192,62Z" fill="rgba(255,255,255,.12)"/>
      <path d="M300,50 L290,68 L310,68Z" fill="rgba(255,255,255,.1)"/>
      <!-- Near mountains -->
      <path d="M0,148 L70,98 L130,125 L200,85 L270,118 L340,95 L400,110 L400,180 L0,180Z" fill="#060e06"/>
      <!-- Moon/sun rising -->
      <circle cx="200" cy="88" r="24" fill="#f5f0e8" opacity=".15"/>
      <circle cx="200" cy="88" r="18" fill="#f5f0e8" opacity=".2"/>
      <circle cx="200" cy="88" r="12" fill="#f5f0e8" opacity=".3"/>
      <!-- Birds flying -->
      <g class="r-bird1">
        <path d="M0,70 Q8,64 16,70" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M20,65 Q29,59 38,65" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.2" stroke-linecap="round"/>
      </g>
      <g class="r-bird2">
        <path d="M0,80 Q7,74 14,80" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.3" stroke-linecap="round"/>
      </g>
      <!-- Compass at summit -->
      <circle cx="200" cy="88" r="35" fill="none" stroke="#2e7d32" stroke-width="1" opacity=".2"/>
      <path d="M200,68 L196,84 L200,81 L204,84Z" fill="#2e7d32" opacity=".4"/>
      <path d="M200,108 L196,92 L200,95 L204,92Z" fill="white" opacity=".15"/>
    </svg>`,
};

interface ShareModalProps {
  entry: Entry | null;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export default function ShareModal({ entry, onClose, showToast }: ShareModalProps) {
  const [cardStyle, setCardStyle] = useState(0);
  if (!entry) return null;

  const prompt = PROMPTS.find((p) => p.id === entry.prompt);
  const shareText = `"${entry.text}"\n\n— ${entry.location}, ${entry.date}\n\nSafarnama सफ़रनामा`;
  const scene = SCENES[entry.prompt] || SCENES.senses;

  const cardStyles = [
    // Dark
    { label: 'Forest Night',  bg: 'linear-gradient(160deg,#0a0f0a,#111a11,#0a0a0f)', accent: '#2e7d32',  text: 'rgba(255,255,255,.88)', sub: 'rgba(255,255,255,.25)', border: 'rgba(255,255,255,.08)', dark: true },
    { label: 'Amber Dusk',    bg: 'linear-gradient(160deg,#0f0a05,#1a1208,#0a0805)', accent: '#ffa726',  text: 'rgba(255,255,255,.88)', sub: 'rgba(255,255,255,.25)', border: 'rgba(255,255,255,.08)', dark: true },
    { label: 'Midnight Blue', bg: 'linear-gradient(160deg,#050510,#0a0818,#080512)', accent: '#7c6af7',  text: 'rgba(255,255,255,.88)', sub: 'rgba(255,255,255,.25)', border: 'rgba(255,255,255,.08)', dark: true },
    { label: 'Rose Night',    bg: 'linear-gradient(160deg,#120008,#1a0010,#0a0008)', accent: '#f06292',  text: 'rgba(255,255,255,.88)', sub: 'rgba(255,255,255,.25)', border: 'rgba(255,255,255,.08)', dark: true },
    // Light
    { label: 'Parchment',     bg: '#f5f0e8',  accent: '#2e7d32',  text: '#2a1a0a',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Golden Hour',   bg: '#fff8e1',  accent: '#e65100',  text: '#3e1a00',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Sage',          bg: '#e8f5e9',  accent: '#1b5e20',  text: '#1b2a1b',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Rose Bloom',    bg: '#fce4ec',  accent: '#880e4f',  text: '#2a0a18',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Sky',           bg: '#e3f2fd',  accent: '#1565c0',  text: '#0d1a2e',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Lavender',      bg: '#ede7f6',  accent: '#4527a0',  text: '#1a0a2e',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Warm White',    bg: '#ffffff',  accent: '#2e7d32',  text: '#111110',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Terracotta',    bg: '#fbe9e7',  accent: '#bf360c',  text: '#2a0e06',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
    { label: 'Sand & Ink',    bg: '#fdf6e3',  accent: '#8b4513',  text: '#2a1a0a',  sub: 'rgba(0,0,0,.3)',  border: 'rgba(0,0,0,.08)', dark: false },
  ];
  const cs = cardStyles[cardStyle % cardStyles.length];

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if ((e.target as HTMLElement).className === 'modal-backdrop') onClose(); }}
    >
      <div style={{
        background: 'var(--bg)', borderRadius: 20, width: '100%', maxWidth: 480,
        maxHeight: '92vh', overflowY: 'auto', position: 'relative',
        animation: 'fadeUp 0.25s ease', boxShadow: '0 32px 80px rgba(0,0,0,0.35)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.4)',
          border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer',
          color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 18, zIndex: 10, lineHeight: 1
        }}>×</button>

        {/* Animated scene */}
        <div style={{ borderRadius: '20px 20px 0 0', overflow: 'hidden', lineHeight: 0 }}
          dangerouslySetInnerHTML={{ __html: scene }}
        />

        {/* Card body */}
        <div style={{
          background: cs.bg, padding: '24px 28px 20px',
          borderTop: `2.5px solid ${cs.accent}`, position: 'relative', overflow: 'hidden'
        }}>
          {/* Watermark compass */}
          <div style={{ position: 'absolute', right: -24, bottom: -24, opacity: 0.04, pointerEvents: 'none' }}>
            <svg width="120" height="120" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
              {`<circle cx="36" cy="36" r="32" fill="none" stroke="${cs.dark ? 'white' : cs.accent}" strokeWidth="2"/><path d="M36,8 L30,30 L36,26 L42,30 Z" fill="${cs.dark ? 'white' : cs.accent}"/><path d="M36,64 L30,42 L36,46 L42,42 Z" fill="${cs.dark ? 'white' : cs.accent}" opacity=".4"/><circle cx="36" cy="36" r="5" fill="${cs.dark ? 'white' : cs.accent}"/>`}
            </svg>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontStyle: 'italic', color: cs.text, marginBottom: 6, lineHeight: 1.2 }}>
              {entry.location}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: cs.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{prompt?.why}</span>
              <span style={{ color: cs.sub }}>·</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: cs.sub, fontWeight: 300 }}>{entry.date}</span>
            </div>
          </div>

          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, lineHeight: 1.85, color: cs.text, marginBottom: 20 }}>
            "{entry.text.length > 240 ? entry.text.slice(0, 240) + '…' : entry.text}"
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${cs.border}`, paddingTop: 14 }}>
            <div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 900, letterSpacing: '0.14em', color: cs.accent }}>SAFARNAMA</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 9, color: cs.sub, marginTop: 1 }}>सफ़रनामा · travel journal</div>
            </div>
            {/* Style switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {cardStyles.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setCardStyle(i)}
                  title={s.label}
                  style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: s.dark ? s.bg : s.bg,
                    border: `2px solid ${cardStyle % cardStyles.length === i ? cs.accent : 'transparent'}`,
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none',
                    flexShrink: 0,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: s.dark ? s.bg : s.bg, borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.accent }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Share actions */}
        <div style={{ padding: '20px 28px 24px', background: 'var(--bg)' }}>
          <button
            onClick={async () => { try { await navigator.share({ title: `Safarnama — ${entry.location}`, text: shareText }); } catch {} }}
            style={{ width: '100%', padding: '14px', background: '#111110', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
