import { useState } from "react";

// ─── Music Theory ─────────────────────────────────────────────────────────────

const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLAT_NAMES = {"C#":"Db","D#":"Eb","F#":"Gb","G#":"Ab","A#":"Bb"};
const noteLabel = n => FLAT_NAMES[n] ? `${n}/${FLAT_NAMES[n]}` : n;
const addSemi = (note, n) => NOTES[(NOTES.indexOf(note) + n + 120) % 12];
const semiDiff = (a, b) => (NOTES.indexOf(b) - NOTES.indexOf(a) + 12) % 12;

// ─── Chord Definitions ────────────────────────────────────────────────────────
// Each tone: { semi, iname, role: "essential"|"colour"|"optional", tip }

const CHORD_FAMILIES = [
  {
    family: "Major 7th",
    color: "#F59E0B",
    dark: "#451a03",
    id: "maj",
    chords: [
      {
        id: "maj7", name: "Major 7", symbol: "maj7",
        description: "Warm, sophisticated, Bossa Nova. The major 7th is what separates a plain major chord from something that sounds like a jazz standard.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — always essential. The chord is named after this note." },
          { semi:4,  iname:"3",   role:"essential", tip:"Major 3rd — essential. This is what makes it major. Drop it and you lose the chord's identity." },
          { semi:7,  iname:"5",   role:"optional",  tip:"Perfect 5th — can be omitted. It adds body but contributes nothing harmonically unique. Often dropped in voicings to make room for colour tones." },
          { semi:11, iname:"maj7",role:"essential", tip:"Major 7th — essential. This is the whole point of the chord. Creates that beautiful tension just a semitone below the root." },
        ],
      },
      {
        id: "maj9", name: "Major 9", symbol: "maj9",
        description: "Even lusher than maj7. The 9th adds an airy, open quality — common in neo-soul and jazz.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential anchor." },
          { semi:4,  iname:"3",   role:"essential", tip:"Major 3rd — keep it. Defines the major quality." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — expendable. Free up that finger for the 9th." },
          { semi:11, iname:"maj7",role:"essential", tip:"Major 7th — keep it. The maj7 is why this chord sounds sophisticated." },
          { semi:2,  iname:"9",   role:"colour",    tip:"Major 9th — the star of this chord. An octave + whole step above root. Adds airiness and space." },
        ],
      },
      {
        id: "maj11", name: "Major 11", symbol: "maj11",
        description: "Dreamy and modal. The 11th clashes with the 3rd — often the 3rd is dropped to let the 11th breathe.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:4,  iname:"3",   role:"optional",  tip:"Major 3rd — careful here. The 3rd and 11th are only a semitone apart (enharmonically). Many players drop the 3rd entirely to avoid the clash and get a more open, modal sound." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — drop it. Too many notes fighting for space." },
          { semi:11, iname:"maj7",role:"essential", tip:"Major 7th — keep it. Without this it's not a maj11." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — adds depth. Can be included or omitted depending on how dense you want the voicing." },
          { semi:5,  iname:"11",  role:"colour",    tip:"11th (perfect 4th) — the defining note of this chord. On guitar, often voiced as a sus4-style addition at the top." },
        ],
      },
      {
        id: "maj13", name: "Major 13", symbol: "maj13",
        description: "The full picture — every colour available in the major key. In practice, always voice selectively.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:4,  iname:"3",   role:"essential", tip:"Major 3rd — keep it. Defines the major quality." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — drop it. Not needed." },
          { semi:11, iname:"maj7",role:"essential", tip:"Major 7th — essential to the chord name." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — adds breadth. Include if you have the fingers for it." },
          { semi:5,  iname:"11",  role:"optional",  tip:"11th — often omitted in 13th chords unless you specifically want that clash/modal quality." },
          { semi:9,  iname:"13",  role:"colour",    tip:"13th (major 6th up an octave) — the defining note. Bright, open, orchestral. This is what makes it a 13th chord." },
        ],
      },
    ],
  },
  {
    family: "Dominant 7th",
    color: "#EF4444",
    dark: "#450a0a",
    id: "dom",
    chords: [
      {
        id: "dom7", name: "Dominant 7", symbol: "7",
        description: "The most harmonically tense chord in music. That b7 creates a tritone with the 3rd that desperately wants to resolve. Blues, jazz, funk — it's everywhere.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:4,  iname:"3",   role:"essential", tip:"Major 3rd — essential. Forms the tritone with the b7. This tension is the whole point of a dominant chord." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — can be dropped. The tritone between 3rd and b7 defines the chord without it." },
          { semi:10, iname:"b7",  role:"essential", tip:"Minor 7th (b7) — essential. This is what makes it dominant rather than major. The tension that wants to resolve to the I chord." },
        ],
      },
      {
        id: "dom9", name: "Dominant 9", symbol: "9",
        description: "Funky and full. Hendrix lived here. The 9th adds richness without softening the dominant tension.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:4,  iname:"3",   role:"essential", tip:"Major 3rd — keep it. Part of the defining tritone." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — drop it. Makes room for the 9th." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — essential. The dominant tension." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — the colour tone. Adds fullness. The classic funk/soul voicing uses R, 3, b7, 9." },
        ],
      },
      {
        id: "dom11", name: "Dominant 11", symbol: "11",
        description: "Suspended and tense. The 11th (4th) adds a suspended quality on top of dominant tension — powerful for pre-resolution moments.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:4,  iname:"3",   role:"optional",  tip:"Major 3rd — often dropped. The 11th clashes directly with the 3rd. Without the 3rd you get a more open, suspended dominant sound." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — can be dropped." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — keep it. The dominant character depends on this." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — adds depth below the 11th." },
          { semi:5,  iname:"11",  role:"colour",    tip:"11th — the suspended, yearning quality. Stacked against b7 this creates real harmonic drama." },
        ],
      },
      {
        id: "dom13", name: "Dominant 13", symbol: "13",
        description: "Big band, jazz orchestra. The 13th over a dominant chord is bright and powerful — a major 6th sitting on top of all that tension.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:4,  iname:"3",   role:"essential", tip:"Major 3rd — keep it. Core of the dominant tritone." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — drop it." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — essential. The dominant tension." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — adds richness. R, 3, b7, 13 is the classic voicing; 9 is optional." },
          { semi:5,  iname:"11",  role:"optional",  tip:"11th — usually omitted in 13th chords. Clashes with the 3rd and the 13th. Leave it out unless you want that specific colour." },
          { semi:9,  iname:"13",  role:"colour",    tip:"13th — the defining note. Bright, major-sounding on top of dominant tension. Extremely effective voice leading tool." },
        ],
      },
      {
        id: "dom7sus2", name: "7sus2", symbol: "7sus2",
        description: "Ambiguous and floating. No 3rd means no major/minor — just open tension with that b7 pulling.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:2,  iname:"2",   role:"essential", tip:"Major 2nd — replaces the 3rd in sus2. Creates the open, unresolved quality." },
          { semi:7,  iname:"5",   role:"colour",    tip:"5th — generally kept in sus chords for stability." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — keeps the dominant tension even without a 3rd." },
        ],
      },
      {
        id: "dom7sus4", name: "7sus4", symbol: "7sus4",
        description: "Classic rock and soul. The sus4 replaces the 3rd — ambiguous, powerful, wants to resolve either to the 3rd or stay suspended.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:5,  iname:"4",   role:"essential", tip:"Perfect 4th — the suspended note. Replaces the 3rd. Wants to resolve down to the 3rd or up to the 5th." },
          { semi:7,  iname:"5",   role:"colour",    tip:"5th — generally kept for stability in sus chords." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — the dominant colour, even without a major 3rd." },
        ],
      },
    ],
  },
  {
    family: "Minor 7th",
    color: "#6366F1",
    dark: "#1e1b4b",
    id: "min",
    chords: [
      {
        id: "min7", name: "Minor 7", symbol: "m7",
        description: "Cool, relaxed, deeply useful. The b3 and b7 together create a sound that works in jazz, soul, funk and rock alike.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:3,  iname:"b3",  role:"essential", tip:"Minor 3rd — essential. This is what makes it minor. Without it you have a dominant chord." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — can be dropped. Useful to omit on guitar to keep voicings manageable." },
          { semi:10, iname:"b7",  role:"essential", tip:"Minor 7th — essential. Together with the b3, this is the core minor 7th sound." },
        ],
      },
      {
        id: "min9", name: "Minor 9", symbol: "m9",
        description: "Lush and melancholy. The 9th opens up the minor 7th into something almost orchestral.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:3,  iname:"b3",  role:"essential", tip:"Minor 3rd — keep it. Defines the minor quality." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — drop it to make room for the 9th." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — essential minor 7th colour." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — the added colour. Gives the chord an open, yearning quality. Very common in soul and neo-soul." },
        ],
      },
      {
        id: "min11", name: "Minor 11", symbol: "m11",
        description: "Modal and spacious. The 11th (perfect 4th) sits perfectly in a minor context — no clash with the b3 unlike in major.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:3,  iname:"b3",  role:"essential", tip:"Minor 3rd — keep it. Unlike major 11th, there's no clash here." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — can be dropped." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — essential." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — adds depth. Often included in m11 voicings." },
          { semi:5,  iname:"11",  role:"colour",    tip:"11th (perfect 4th) — in a minor context this note is completely at home. No tension with the b3. Creates a beautiful open, modal sound." },
        ],
      },
      {
        id: "min13", name: "Minor 13", symbol: "m13",
        description: "The full minor palette. The natural 13th (major 6th) over a minor chord creates a Dorian flavour — sophisticated and distinctive.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:3,  iname:"b3",  role:"essential", tip:"Minor 3rd — essential." },
          { semi:7,  iname:"5",   role:"optional",  tip:"5th — drop it." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — essential." },
          { semi:2,  iname:"9",   role:"colour",    tip:"9th — adds breadth." },
          { semi:5,  iname:"11",  role:"optional",  tip:"11th — optional. Include for extra density or drop for a cleaner voicing." },
          { semi:9,  iname:"13",  role:"colour",    tip:"13th (natural 6th) — this is what gives m13 its Dorian character. The major 6th over a minor chord sounds unexpectedly beautiful and modern." },
        ],
      },
      {
        id: "min7sus2", name: "m7sus2", symbol: "m7sus2",
        description: "Open and ambiguous — a minor 7th with the 3rd replaced by a 2nd. Neither fully minor nor suspended.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:2,  iname:"2",   role:"essential", tip:"2nd — replaces the b3. Creates ambiguity between minor and suspended." },
          { semi:7,  iname:"5",   role:"colour",    tip:"5th — generally kept for stability." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — keeps the minor 7th colour without the 3rd committing to minor." },
        ],
      },
      {
        id: "min7sus4", name: "m7sus4", symbol: "m7sus4",
        description: "Dark and suspended — the 4th replaces the b3. Very useful in modal contexts.",
        tones: [
          { semi:0,  iname:"R",   role:"essential", tip:"Root — essential." },
          { semi:5,  iname:"4",   role:"essential", tip:"Perfect 4th — the suspended note. Darker than dom7sus4 because the b7 adds minor colour." },
          { semi:7,  iname:"5",   role:"colour",    tip:"5th — generally kept." },
          { semi:10, iname:"b7",  role:"essential", tip:"b7 — the minor 7th colour that sets this apart from a plain sus4." },
        ],
      },
    ],
  },
];

const ALL_CHORDS = CHORD_FAMILIES.flatMap(f =>
  f.chords.map(c => ({ ...c, family: f.family, color: f.color, dark: f.dark, familyId: f.id }))
);

// ─── Suggested voicings (fret positions per string, null = muted/not played) ──
// Format: [E2, A2, D3, G3, B3, E4] fret numbers, null = don't play

const VOICINGS = {
  // ── Major 7th family ──────────────────────────────────────────────────────
  maj7: [
    {
      name: "Open E-shape",
      frets: [0,2,2,1,0,0],
      fingers: "Full 6-string open shape — warm and familiar",
      tones: "R · 3 · 5 · maj7 · R · 3",
      notes: "Great starting point. The maj7 on the G string is what you'll hear most clearly.",
    },
    {
      name: "A-string root (barre)",
      frets: [null,3,5,4,5,3],
      fingers: "Moveable barre shape — used everywhere in jazz",
      tones: "R · 5 · maj7 · 3 · 5",
      notes: "The most important moveable maj7 shape. Root on A string, slide it anywhere.",
    },
    {
      name: "Jazz shell (top 4)",
      frets: [null,null,3,2,1,0],
      fingers: "Compact 4-string shape — clean and pianistic",
      tones: "R · 3 · 5 · maj7",
      notes: "Drop the bottom strings. The 5th is optional here — try lifting that finger for R · maj7 · 3.",
    },
  ],
  maj9: [
    {
      name: "Open 9th voicing",
      frets: [null,3,2,4,3,null],
      fingers: "Root on A string, 9th on high E — spacious",
      tones: "R · 3 · maj7 · 9",
      notes: "The 9th on the high E gives it that airy, floating quality. Very neo-soul.",
    },
    {
      name: "Drop-5 jazz voicing",
      frets: [null,null,0,5,0,0],
      fingers: "4 strings, 5th omitted — clean and moveable",
      tones: "9 · R · maj7 · 3",
      notes: "No 5th needed. R, maj7, 3, 9 is the most efficient maj9 voicing on guitar.",
    },
    {
      name: "Wide open voicing",
      frets: [null,0,0,0,0,2],
      fingers: "Mixed open/fretted — big, spacious sound",
      tones: "9 · 5 · R · 3 · maj7",
      notes: "Lets the open strings add resonance. Works beautifully in C and G contexts.",
    },
  ],
  maj11: [
    {
      name: "Modal sparse",
      frets: [null,3,0,0,0,0],
      fingers: "Just root and open strings — very open",
      tones: "R · maj7 · 3 · 11",
      notes: "Deliberately sparse. The 11th clashes with the 3rd so giving them space is the key.",
    },
    {
      name: "No-3rd voicing",
      frets: [null,3,2,0,3,3],
      fingers: "Drop the 3rd entirely — removes the clash",
      tones: "R · 5 · maj7 · 11 · 11",
      notes: "Omitting the 3rd is the professional move here. Pure modal, dreamy sound.",
    },
    {
      name: "Full upper structure",
      frets: [null,3,2,0,3,0],
      fingers: "Root + maj7 + open 9 + 11 — lush",
      tones: "R · 5 · maj7 · 9 · 11",
      notes: "The 9 and 11 together with the maj7 create a stacked, orchestral effect.",
    },
  ],
  maj13: [
    {
      name: "Jazz 13th (classic)",
      frets: [null,null,2,4,4,4],
      fingers: "Top 4 strings — R · maj7 · 3 · 13",
      tones: "R · maj7 · 3 · 13",
      notes: "The most efficient maj13 voicing. 13th on top where it rings out most clearly.",
    },
    {
      name: "Full voicing",
      frets: [null,3,5,4,5,5],
      fingers: "5-string voicing with root on A",
      tones: "R · 5 · maj7 · 3 · 13",
      notes: "Adds the root on A string for a fuller, more grounded sound.",
    },
    {
      name: "Open 13th",
      frets: [null,3,2,0,0,5],
      fingers: "Open middle strings, 13th on top",
      tones: "R · 3 · 5 · maj7 · 13",
      notes: "The open G and B strings add space. The 13th landing on the high E feels natural.",
    },
  ],

  // ── Dominant 7th family ───────────────────────────────────────────────────
  dom7: [
    {
      name: "Open dominant 7th",
      frets: [0,2,0,1,0,0],
      fingers: "Open shape — everyman dominant chord",
      tones: "R · b7 · 3 · R · 3",
      notes: "The tritone between the 3rd and b7 is what gives this its tension. You'll hear it instantly.",
    },
    {
      name: "Barre dominant 7th",
      frets: [null,0,2,0,2,0],
      fingers: "Open shape — moveable with a barre",
      tones: "R · 5 · b7 · 3 · 5",
      notes: "Slide this shape up and barre across for any dominant 7th. The workhorse shape.",
    },
    {
      name: "Jazz shell voicing",
      frets: [null,null,null,3,1,0],
      fingers: "Just 3rd, b7, R — the tritone exposed",
      tones: "b7 · R · 3",
      notes: "Only three notes but the tritone is right there in the middle. Essential jazz comp shape.",
    },
  ],
  dom9: [
    {
      name: "Hendrix 9th",
      frets: [null,null,0,1,0,2],
      fingers: "The Hendrix shape — iconic funk/rock voicing",
      tones: "5 · b7 · 3 · 9",
      notes: "No root needed — the band has it. That b7–9 combination is the whole Hendrix sound.",
    },
    {
      name: "A-root funk 9th",
      frets: [null,2,2,2,2,3],
      fingers: "Root on A, 9th doubles on top two strings",
      tones: "9 · 5 · R · 3 · b7",
      notes: "The most complete dominant 9th shape. Used constantly in funk and soul.",
    },
    {
      name: "Compact jazz 9th",
      frets: [null,null,0,3,1,0],
      fingers: "4 strings — very moveable jazz voicing",
      tones: "9 · b7 · R · 3",
      notes: "Tight, pianistic. Slide this anywhere and you have a dominant 9th in that key.",
    },
  ],
  dom11: [
    {
      name: "Suspended dominant",
      frets: [null,0,2,0,3,0],
      fingers: "R + b7 + 11 — open and unresolved",
      tones: "R · 5 · b7 · 11",
      notes: "No 3rd — deliberately. The 11th replaces it for a suspended, yearning quality.",
    },
    {
      name: "Full 11th voicing",
      frets: [null,0,2,2,3,3],
      fingers: "Root on A, 11th on top two strings",
      tones: "R · 5 · b7 · 11 · 11",
      notes: "Dense and dramatic. Perfect before resolving to a dominant 7th or I chord.",
    },
    {
      name: "Shell + 11th",
      frets: [null,null,2,2,3,null],
      fingers: "Minimal 3-note shape — R · b7 · 11",
      tones: "R · b7 · 11",
      notes: "Stripped back to the essentials. Notice the 3rd is gone — that's intentional for 11th chords.",
    },
  ],
  dom13: [
    {
      name: "Jazz 13th (tight)",
      frets: [null,null,0,1,2,2],
      fingers: "Compact top 4 strings — essential jazz shape",
      tones: "5 · b7 · 3 · 13",
      notes: "The 13th on top, tritone in the middle. Everything you need in four strings.",
    },
    {
      name: "Full dominant 13th",
      frets: [null,0,0,1,2,2],
      fingers: "Root on A, full voicing",
      tones: "R · 5 · b7 · 3 · 13",
      notes: "Add the root on A string for a grounded, band-ready comp voicing.",
    },
    {
      name: "Shell + 13th",
      frets: [null,null,null,1,2,2],
      fingers: "Bare minimum: 3 · b7 · 13",
      tones: "b7 · 3 · 13",
      notes: "Three notes, massive sound. The tritone (3 + b7) plus the bright 13th on top. Jazz piano players do this constantly.",
    },
  ],
  dom7sus2: [
    {
      name: "Open sus2 dominant",
      frets: [0,0,2,2,0,0],
      fingers: "Very open, resonant — E-string roots",
      tones: "R · R · 5 · 2 · R",
      notes: "Stacks perfect 5ths and a 2nd — no 3rd, no tension, just floating dominant colour.",
    },
    {
      name: "A-root sus2",
      frets: [null,0,2,2,0,0],
      fingers: "Root on A, open top strings",
      tones: "R · 5 · 2 · b7",
      notes: "Adds the b7 for a full 7sus2. The open B and E strings add width.",
    },
    {
      name: "Compact moveable",
      frets: [null,null,0,3,1,3],
      fingers: "4-string, D-string root — slides anywhere",
      tones: "2 · b7 · R · 5",
      notes: "Omit the b7 and you get pure sus2 ambiguity. Add it back on the B string for the full colour.",
    },
  ],
  dom7sus4: [
    {
      name: "Classic 7sus4",
      frets: [null,0,2,2,3,0],
      fingers: "The most-used 7sus4 shape — rock standard",
      tones: "R · 5 · b7 · 4 · R",
      notes: "That suspended 4th wants to fall to the 3rd. Classic rock and gospel tension.",
    },
    {
      name: "Open 7sus4",
      frets: [0,2,0,2,0,0],
      fingers: "Open shape — full and resonant",
      tones: "R · b7 · 4 · R · R",
      notes: "All that root doubling gives it a huge, cathedral sound. Strum and let it ring.",
    },
    {
      name: "Jazz 7sus4",
      frets: [null,null,0,2,1,3],
      fingers: "Compact 4-string voicing",
      tones: "R · 5 · b7 · 4",
      notes: "Tight and clean. Move this shape up the neck for any 7sus4 you need.",
    },
  ],

  // ── Minor 7th family ──────────────────────────────────────────────────────
  min7: [
    {
      name: "Open m7 (A-shape)",
      frets: [null,0,2,0,1,0],
      fingers: "Open shape — an essential everyone should know",
      tones: "R · 5 · b7 · b3 · 5",
      notes: "Notice the b7 on the G string sitting right next to the b3 on B. That's the minor 7th sound.",
    },
    {
      name: "Open m7 (E-shape)",
      frets: [0,2,2,0,3,0],
      fingers: "Open shape — dark and resonant",
      tones: "R · b7 · b3 · R · b3",
      notes: "The low root and b7 stacked at the bottom give this a heavier, darker sound than Am7.",
    },
    {
      name: "Jazz shell (top 4)",
      frets: [null,null,null,2,1,0],
      fingers: "3-string jazz voicing — R · b7 · b3",
      tones: "R · b7 · b3",
      notes: "Three notes is enough. Move this up the neck — root on G string means any minor 7th is accessible.",
    },
  ],
  min9: [
    {
      name: "Open minor 9th",
      frets: [null,3,2,2,0,3],
      fingers: "The soul and R&B standard 9th",
      tones: "b3 · 5 · R · 9 · b7",
      notes: "The 9th on the high E adds that yearning, open quality. Common in neo-soul and smooth jazz.",
    },
    {
      name: "Compact moveable",
      frets: [null,null,3,5,3,0],
      fingers: "D-string root, 4 strings — slides anywhere",
      tones: "b3 · b7 · R · 9",
      notes: "No 5th needed. This voicing is complete with just those four tones.",
    },
    {
      name: "Wide open m9",
      frets: [0,2,0,0,0,2],
      fingers: "Open strings ring freely — big, ambient sound",
      tones: "R · b7 · b3 · R · 9",
      notes: "Slightly unconventional but beautiful. Let all strings ring and hear the 9th float on top.",
    },
  ],
  min11: [
    {
      name: "Modal m11",
      frets: [null,0,2,0,3,0],
      fingers: "Root on A, 11th on B string — classic modal voicing",
      tones: "R · 5 · b7 · 11 · 5",
      notes: "In a minor context, the 11th (perfect 4th) sits perfectly — no clash like in major.",
    },
    {
      name: "Open all-strings",
      frets: [null,0,0,0,1,0],
      fingers: "Mostly open — very spacious and ambient",
      tones: "R · b7 · b3 · b3 · 5",
      notes: "Add a finger on the B string for the b3 and let everything else ring. Very open, Dorian-esque.",
    },
    {
      name: "Compact jazz m11",
      frets: [null,null,0,2,1,3],
      fingers: "4 strings — R · b3 · b7 · 11",
      tones: "R · b3 · b7 · 11",
      notes: "All four essential tones in one moveable shape. The 11th on top is the star.",
    },
  ],
  min13: [
    {
      name: "Dorian voicing",
      frets: [null,0,2,2,1,2],
      fingers: "Root on A — R + b3 + b7 + 9 + 13",
      tones: "R · 5 · b7 · 9 · 13",
      notes: "The natural 13th (major 6th) over a minor chord is pure Dorian. Very distinctive.",
    },
    {
      name: "Jazz m13 shell",
      frets: [null,null,0,2,1,2],
      fingers: "Compact 4-string — b3 + b7 + 9 + 13",
      tones: "R · b3 · b7 · 13",
      notes: "Omit the 9th and 11th — just the defining minor + 13th colour. Clean and modern.",
    },
    {
      name: "Open m13 voicing",
      frets: [null,0,2,0,1,2],
      fingers: "Open strings add the 13th naturally",
      tones: "R · 5 · b7 · b3 · 9",
      notes: "The open strings can give you the 9th and 13th for free. Context-dependent but very effective.",
    },
  ],
  min7sus2: [
    {
      name: "Open m7sus2",
      frets: [null,0,2,2,0,0],
      fingers: "Open B and E — floaty and unresolved",
      tones: "R · 5 · b7 · 2 · R",
      notes: "Neither fully minor nor suspended — deliberately ambiguous. Works over many chord changes.",
    },
    {
      name: "Full moveable shape",
      frets: [null,0,2,0,0,0],
      fingers: "Root on A, 2nd on high E",
      tones: "R · 5 · b7 · 2 · 5",
      notes: "The 2nd doubled on top reinforces the sus quality. Slide up the neck for any root.",
    },
    {
      name: "Compact 4-string",
      frets: [null,null,0,2,1,0],
      fingers: "D-string root — very open and sparse",
      tones: "R · 5 · b7 · 2",
      notes: "Strip it back even further. No b7, just R + 2 + 5. Minimal and floating.",
    },
  ],
  min7sus4: [
    {
      name: "Modal m7sus4",
      frets: [null,0,2,2,3,0],
      fingers: "Root on A — dark and suspended",
      tones: "R · 5 · b7 · 4 · R",
      notes: "The 4th replaces the b3 — darker than dom7sus4 because the b7 adds that minor colour.",
    },
    {
      name: "Dense voicing",
      frets: [null,0,2,2,3,3],
      fingers: "Root on A, 4th doubled on top",
      tones: "R · 5 · b7 · 4 · 4",
      notes: "The suspended 4th doubled at the top makes it feel very heavy and unresolved.",
    },
    {
      name: "Compact m7sus4",
      frets: [null,null,0,2,3,0],
      fingers: "4-string shape — moveable",
      tones: "R · b7 · 4 · R",
      notes: "Clean and efficient. The b7 underneath the 4th gives the minor sus colour without the b3.",
    },
  ],
};

// ─── Fretboard builder ────────────────────────────────────────────────────────

const OPEN_STRINGS_LOW_HIGH = ["E","A","D","G","B","E"];
const FRET_COUNT = 15;

// ─── Transpose a stored voicing to the selected root ──────────────────────────
// Voicings are authored at a fixed root. Detect that root from the shape's notes
// and shift the whole shape so it actually sounds in the selected key.
function voicingRootPc(frets, chordSemis){
  const played=[];
  frets.forEach((f,i)=>{ if(f!=null) played.push((NOTES.indexOf(OPEN_STRINGS_LOW_HIGH[i]) + f) % 12); });
  if(!played.length) return null;
  const set=new Set(chordSemis);
  let best=0, bestScore=-1;
  for(let r=0;r<12;r++){ let sc=0; for(const pc of played) if(set.has((pc-r+12)%12)) sc++; if(sc>bestScore){bestScore=sc;best=r;} }
  return best;
}
function transposeVoicing(frets, chordSemis, targetRootName){
  const nat=voicingRootPc(frets, chordSemis);
  if(nat==null) return frets;
  const tgt=NOTES.indexOf(targetRootName);
  const s1=((tgt-nat)%12+12)%12;
  const fit=s=>{ const t=frets.map(f=>f==null?null:f+s); const nz=t.filter(f=>f!=null); return nz.every(f=>f>=0 && f<=FRET_COUNT)?t:null; };
  return fit(s1-12) || fit(s1) || frets.map(f=>f==null?null:f+s1);
}

function getIntervalName(root, note) {
  const semi = (NOTES.indexOf(note) - NOTES.indexOf(root) + 12) % 12;
  const map = {0:"R",1:"b2",2:"2/9",3:"b3",4:"3",5:"4/11",6:"b5",7:"5",8:"b6/aug5",9:"6/13",10:"b7",11:"maj7"};
  return map[semi] || "?";
}

function Fretboard({ root, chord, activeTones, onToggleFret, mode, suggestedFrets }) {
  // activeTones: Set of semitone values (0-11)
  // suggestedFrets: array of fret numbers per string [E2..E4], null = muted
  const displayStrings = [...OPEN_STRINGS_LOW_HIGH].reverse(); // high E first

  return (
    <div style={{ overflowX:"auto", paddingBottom:"4px" }}>
      <div style={{ minWidth:"620px" }}>
        {/* Fret numbers */}
        <div style={{ display:"flex", marginLeft:"36px", marginBottom:"4px" }}>
          {[0,...Array.from({length:FRET_COUNT},(_,i)=>i+1)].map(fret => (
            <div key={fret} style={{
              width:fret===0?"32px":"46px", textAlign:"center",
              fontSize:"9px", flexShrink:0,
              color:[3,5,7,9,12].includes(fret)?"#94a3b8":"#475569",
              fontWeight:[3,5,7,9,12].includes(fret)?"700":"400",
              fontFamily:"'JetBrains Mono',monospace",
            }}>{fret===0?"Open":fret}</div>
          ))}
        </div>

        {/* Strings */}
        {displayStrings.map((openNote, di) => {
          const strIdx = 5 - di; // 0=low E ... 5=high E
          const isOuter = di===0 || di===5;
          const sugFret = suggestedFrets ? suggestedFrets[strIdx] : null;

          return (
            <div key={di} style={{ display:"flex", alignItems:"center", marginBottom:"3px" }}>
              <div style={{
                width:"32px", textAlign:"right", paddingRight:"5px",
                fontSize:"9px", color:"#64748b", flexShrink:0,
                fontFamily:"'JetBrains Mono',monospace",
              }}>{openNote}</div>

              {/* Mute indicator for suggested mode */}
              {mode==="suggested" && suggestedFrets && sugFret===null && (
                <div style={{
                  width:"32px", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"12px", color:"#374151", flexShrink:0,
                }}>×</div>
              )}

              {Array.from({length:FRET_COUNT+1},(_,fret) => {
                const note = addSemi(openNote, fret);
                const semi = (NOTES.indexOf(note) - NOTES.indexOf(root) + 12) % 12;
                const toneInfo = chord.tones.find(t => t.semi === semi);

                // Is this dot active?
                let isActive = false;
                let isRoot = semi === 0;
                let dotColor = "#6366f1";

                if (mode === "free") {
                  isActive = activeTones.has(`${strIdx}-${fret}`);
                } else {
                  // suggested mode
                  isActive = sugFret === fret && sugFret !== null;
                }

                if (toneInfo) {
                  if (toneInfo.role === "essential") dotColor = chord.color || "#F59E0B";
                  else if (toneInfo.role === "colour") dotColor = "#22c55e";
                  else dotColor = "#94a3b8";
                }
                if (isRoot) dotColor = chord.color || "#F59E0B";

                const intervalLabel = getIntervalName(root, note);

                return (
                  <div
                    key={fret}
                    onClick={() => mode==="free" && onToggleFret(strIdx, fret, semi)}
                    style={{
                      width:fret===0?"32px":"46px", height:"28px",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      position:"relative", flexShrink:0,
                      cursor: mode==="free" ? "pointer" : "default",
                    }}
                  >
                    {/* String */}
                    {!(mode==="suggested" && sugFret===null) && (
                      <div style={{
                        position:"absolute", top:"50%", left:0, right:0,
                        height:isOuter?"1px":"2px",
                        background:"#334155", transform:"translateY(-50%)",
                      }}/>
                    )}
                    {/* Fret bar */}
                    {fret>0 && !(mode==="suggested" && sugFret===null) && (
                      <div style={{
                        position:"absolute", top:0, bottom:0, right:0,
                        width:fret===12?"3px":"1.5px",
                        background:fret===12?"#94a3b8":"#1e2535",
                      }}/>
                    )}
                    {/* Hover highlight in free mode */}
                    {mode==="free" && !isActive && (
                      <div className="fret-hover" style={{
                        position:"absolute", inset:2, borderRadius:"50%",
                        background:"transparent",
                      }}/>
                    )}
                    {/* Note dot */}
                    {isActive && (
                      <div style={{
                        position:"relative", zIndex:2,
                        width:"22px", height:"22px", borderRadius:"50%",
                        background: dotColor,
                        border: isRoot ? "2px solid #fff" : "none",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"7px", fontWeight:"700", color:"#fff",
                        fontFamily:"'JetBrains Mono',monospace",
                        boxShadow: isRoot ? `0 0 8px ${dotColor}` : "none",
                        transition:"all 0.15s ease",
                        animation:"popIn 0.2s ease",
                      }}>
                        {intervalLabel}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Position markers */}
        <div style={{ display:"flex", marginLeft:"78px", marginTop:"3px" }}>
          {Array.from({length:FRET_COUNT},(_,i)=>i+1).map(fret => (
            <div key={fret} style={{ width:"46px", textAlign:"center", flexShrink:0 }}>
              {[3,5,7,9].includes(fret) && <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#1e2535",margin:"0 auto" }}/>}
              {fret===12 && <div style={{ display:"flex",gap:"4px",justifyContent:"center" }}>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#1e2535" }}/>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#1e2535" }}/>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Theme ────────────────────────────────────────────────────────────────────

const THEMES = {
  dark: {
    bg:       "#0a0c12",
    surface:  "#131720",
    surface2: "#0a0c12",
    border:   "#1a2030",
    borderMid:"#1e2535",
    borderHi: "#334155",
    text:     "#dde3ed",
    textHi:   "#f0f4ff",
    textMid:  "#b0bcc8",
    textLo:   "#6b7280",
    textMute: "#3d4658",
    textDead: "#1e2535",
    string:   "#1e2535",
    fretBar:  "#1a2030",
    fretHi:   "#334155",
    fretNum:  "#334155",
    fretMark: "#1e2535",
    scrollBg: "#131720",
    scrollTh: "#1e2535",
    muted:    "#374151",
    roleOptional: "#94a3b8",
    colourTone:   "#22c55e",
    colourToneBg: "#14532d",
  },
  light: {
    bg:       "#ffffff",
    surface:  "#ffffff",
    surface2: "#f8f8f6",
    border:   "#e8e8e4",
    borderMid:"#d4d4ce",
    borderHi: "#9a9a94",
    text:     "#1a1a18",
    textHi:   "#000000",
    textMid:  "#3a3a36",
    textLo:   "#6b6b65",
    textMute: "#9a9a94",
    textDead: "#d4d4ce",
    string:   "#d4d4ce",
    fretBar:  "#e8e8e4",
    fretHi:   "#9a9a94",
    fretNum:  "#9a9a94",
    fretMark: "#d4d4ce",
    scrollBg: "#f8f8f6",
    scrollTh: "#d4d4ce",
    muted:    "#9a9a94",
    roleOptional: "#6b6b65",
    colourTone:   "#16a34a",
    colourToneBg: "#f0fdf4",
  },
};

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function ChordBuilder() {
  const [selectedFamilyId, setSelectedFamilyId] = useState("maj");
  const [selectedChordId,  setSelectedChordId]  = useState("maj7");
  const [selectedRoot,     setSelectedRoot]     = useState("C");
  const [mode,             setMode]             = useState("build");
  const [buildStep,        setBuildStep]        = useState(0);
  const [selectedVoicing,  setSelectedVoicing]  = useState(0);
  const [selectedToneIdx,  setSelectedToneIdx]  = useState(null);
  const [isDark,           setIsDark]           = useState(false);

  const T = isDark ? THEMES.dark : THEMES.light;

  const family  = CHORD_FAMILIES.find(f => f.id === selectedFamilyId);
  const chord   = ALL_CHORDS.find(c => c.id === selectedChordId);
  const voicings = VOICINGS[selectedChordId] || [];

  const visibleTones = chord.tones.slice(0, buildStep + 1);
  const isDone = buildStep >= chord.tones.length - 1;

  const handleFamilySelect = (fid) => {
    setSelectedFamilyId(fid);
    const fam = CHORD_FAMILIES.find(f => f.id===fid);
    setSelectedChordId(fam.chords[0].id);
    setBuildStep(0); setSelectedToneIdx(null); setSelectedVoicing(0);
  };
  const handleChordSelect = (cid) => {
    setSelectedChordId(cid);
    setBuildStep(0); setSelectedToneIdx(null); setSelectedVoicing(0);
  };
  const handleRootSelect = (root) => setSelectedRoot(root);
  const advance = () => { if (!isDone) setBuildStep(s => s+1); };
  const reset   = () => { setBuildStep(0); setSelectedToneIdx(null); };

  const visibleSemis = mode==="build"
    ? new Set(visibleTones.map(t => t.semi))
    : new Set(chord.tones.map(t => t.semi));

  const currentTone = visibleTones[visibleTones.length - 1];
  const progressPct = Math.round(((buildStep + 1) / chord.tones.length) * 100);

  // role → colour helper
  const roleColor = (role) => role==="essential" ? chord.color : role==="colour" ? T.colourTone : T.roleOptional;

  return (
    <div style={{
      minHeight:"100vh",
      background: T.bg,
      color: T.text,
      fontFamily:"'DM Sans',sans-serif",
      padding:"24px 18px 48px",
      transition:"background 0.2s, color 0.2s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing:border-box; }
        button { cursor:pointer; font-family:inherit; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar { height:5px; background:${T.scrollBg}; }
        ::-webkit-scrollbar-thumb { background:${T.scrollTh}; border-radius:3px; }
      `}</style>

      <div style={{ maxWidth:"900px", margin:"0 auto" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:"22px", display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"12px" }}>
          <div>
            <div style={{ display:"flex", alignItems:"baseline", gap:"10px", marginBottom:"4px" }}>
              <h1 style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(20px,5vw,28px)",
                fontWeight:"800", margin:0, color:T.textHi, letterSpacing:"-0.5px",
                textTransform:"uppercase",
              }}>Chord Builder</h1>
              <span style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:"9px",
                color:T.textLo, background:T.surface2,
                padding:"2px 6px", borderRadius:"2px", letterSpacing:"1px",
                border:`1px solid ${T.border}`,
              }}>UNLOCK THE GUITAR</span>
            </div>
            <p style={{ color:T.textMute, fontSize:"13px", margin:0 }}>
              Understand every note in the chord. Know what's essential, what's colour, and what to drop.
            </p>
          </div>

          {/* ── Dark/Light toggle ── */}
          <button
            onClick={() => setIsDark(d => !d)}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              flexShrink:0,
              padding:"6px 12px",
              borderRadius:"4px",
              border:`1px solid ${T.border}`,
              background: T.surface2,
              color: T.textMid,
              fontSize:"12px",
              display:"flex", alignItems:"center", gap:"5px",
              cursor:"pointer",
              whiteSpace:"nowrap",
            }}
          >
            <span style={{ fontSize:"14px" }}>{isDark ? "☀️" : "🌙"}</span>
            <span style={{ fontSize:"10px", fontFamily:"'JetBrains Mono',monospace" }}>
              {isDark ? "Light" : "Dark"}
            </span>
          </button>
        </div>

        {/* ── Root + Family + Chord ── */}
        <div style={{ background:T.surface, borderRadius:"14px", padding:"18px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>

          {/* Root */}
          <div style={{ marginBottom:"16px" }}>
            <SL T={T}>ROOT NOTE</SL>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"4px" }}>
              {NOTES.map(n => (
                <button key={n} onClick={() => handleRootSelect(n)} style={{
                  padding:"5px 10px", borderRadius:"6px", fontSize:"11px",
                  fontWeight:"700", fontFamily:"'JetBrains Mono',monospace",
                  border: selectedRoot===n ? `2px solid ${chord.color}` : `2px solid ${T.border}`,
                  background: selectedRoot===n ? `${chord.color}20` : T.surface2,
                  color: selectedRoot===n ? chord.color : T.textMute,
                  transition:"all 0.1s",
                }}>{n}</button>
              ))}
            </div>
          </div>

          {/* Family tabs */}
          <div style={{ marginBottom:"14px" }}>
            <SL T={T}>CHORD FAMILY</SL>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {CHORD_FAMILIES.map(f => (
                <button key={f.id} onClick={() => handleFamilySelect(f.id)} style={{
                  padding:"7px 16px", borderRadius:"8px", fontSize:"12px", fontWeight:"600",
                  border: selectedFamilyId===f.id ? `1.5px solid ${f.color}` : `1.5px solid ${T.border}`,
                  background: selectedFamilyId===f.id ? `${f.color}18` : T.surface2,
                  color: selectedFamilyId===f.id ? f.color : T.textMute,
                  transition:"all 0.1s",
                }}>{f.family}</button>
              ))}
            </div>
          </div>

          {/* Chord selector */}
          <div>
            <SL T={T}>CHORD TYPE</SL>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
              {family.chords.map(c => (
                <button key={c.id} onClick={() => handleChordSelect(c.id)} style={{
                  padding:"6px 13px", borderRadius:"7px", fontSize:"12px",
                  fontWeight: selectedChordId===c.id ? "700":"400",
                  border: selectedChordId===c.id ? `1.5px solid ${family.color}` : `1.5px solid ${T.border}`,
                  background: selectedChordId===c.id ? `${family.color}18` : T.surface2,
                  color: selectedChordId===c.id ? family.color : T.textLo,
                  transition:"all 0.1s",
                }}>
                  {selectedRoot}{c.symbol}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Chord description ── */}
        <div style={{
          background:T.surface, borderRadius:"12px", padding:"14px 18px",
          border:`1px solid ${chord.color}33`, marginBottom:"12px",
          display:"flex", gap:"12px", alignItems:"flex-start",
        }}>
          <div style={{
            fontFamily:"'JetBrains Mono',monospace", fontSize:"22px", fontWeight:"700",
            color:chord.color, flexShrink:0, lineHeight:1,
            padding:"8px 12px", background:`${chord.color}15`,
            borderRadius:"8px", border:`1px solid ${chord.color}44`,
          }}>
            {selectedRoot}{chord.symbol}
          </div>
          <div>
            <div style={{ fontSize:"13px", fontWeight:"600", color:T.textMid, marginBottom:"4px" }}>{chord.name}</div>
            <div style={{ fontSize:"12px", color:T.textLo, lineHeight:"1.65", fontStyle:"italic" }}>{chord.description}</div>
          </div>
        </div>

        {/* ── Mode tabs ── */}
        <div style={{ display:"flex", gap:"6px", marginBottom:"12px", flexWrap:"wrap" }}>
          {[
            { id:"build",     label:"Build Mode",        desc:"Add tones one by one" },
            { id:"suggested", label:"Suggested Voicings", desc:"Guitar-ready shapes" },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding:"8px 16px", borderRadius:"8px", fontSize:"12px", fontWeight:"600",
              border: mode===m.id ? `1.5px solid ${chord.color}` : `1.5px solid ${T.border}`,
              background: mode===m.id ? `${chord.color}15` : T.surface,
              color: mode===m.id ? chord.color : T.textMute,
              transition:"all 0.1s",
              display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"1px",
            }}>
              <span>{m.label}</span>
              <span style={{ fontSize:"9px", fontFamily:"'JetBrains Mono',monospace", opacity:0.6 }}>{m.desc}</span>
            </button>
          ))}
        </div>

        {/* ── Tone anatomy ── */}
        <div style={{ background:T.surface, borderRadius:"12px", padding:"14px 16px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>
          <SL T={T}>CHORD ANATOMY — tap a tone to learn more</SL>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {chord.tones.map((tone, i) => {
              const note = addSemi(selectedRoot, tone.semi);
              const isVisible = mode==="build" ? i <= buildStep : true;
              const isSelected = selectedToneIdx === i;
              const rc = roleColor(tone.role);
              return (
                <button key={i} onClick={() => setSelectedToneIdx(isSelected ? null : i)} style={{
                  padding:"8px 12px", borderRadius:"8px",
                  border: isSelected ? `1.5px solid ${rc}` : isVisible ? `1px solid ${rc}55` : `1px solid ${T.border}`,
                  background: isSelected ? `${rc}20` : isVisible ? `${rc}08` : T.surface2,
                  opacity: mode==="build" && !isVisible ? 0.3 : 1,
                  transition:"all 0.2s", cursor:"pointer", textAlign:"left",
                  animation: mode==="build" && i===buildStep ? "popIn 0.2s ease" : "none",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{
                      fontSize:"12px", fontWeight:"700",
                      fontFamily:"'JetBrains Mono',monospace",
                      color: isVisible ? rc : T.textDead,
                    }}>{tone.iname}</span>
                    <span style={{
                      fontSize:"11px", fontFamily:"'JetBrains Mono',monospace",
                      color: isVisible ? T.textLo : T.textDead,
                    }}>{note}</span>
                  </div>
                  <div style={{
                    fontSize:"8px", fontFamily:"'JetBrains Mono',monospace",
                    color: rc, opacity: isVisible ? 0.7 : 0.2,
                    marginTop:"2px", letterSpacing:"0.5px",
                  }}>{tone.role}</div>
                </button>
              );
            })}
          </div>

          {/* Role legend */}
          <div style={{ display:"flex", gap:"14px", marginTop:"10px", flexWrap:"wrap" }}>
            <LegendPill color={chord.color}   label="essential — always include" T={T} />
            <LegendPill color={T.colourTone}  label="colour — the character notes" T={T} />
            <LegendPill color={T.roleOptional} label="optional — can be omitted" T={T} />
          </div>

          {/* Tone detail */}
          {selectedToneIdx !== null && (() => {
            const tone = chord.tones[selectedToneIdx];
            const rc = roleColor(tone.role);
            return (
              <div style={{
                marginTop:"12px", padding:"12px 14px",
                background:T.surface2, borderRadius:"8px",
                border:`1px solid ${rc}44`,
                fontSize:"13px", color:T.textLo, lineHeight:"1.7",
                animation:"fadeUp 0.15s ease",
              }}>
                <span style={{
                  fontFamily:"'JetBrains Mono',monospace", fontSize:"11px",
                  color: rc, fontWeight:"700", marginRight:"8px",
                }}>{tone.iname} ({addSemi(selectedRoot, tone.semi)})</span>
                {tone.tip}
              </div>
            );
          })()}
        </div>

        {/* ── Build mode progress ── */}
        {mode==="build" && (
          <div style={{ marginBottom:"12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
              <span style={{ fontSize:"10px", color:T.textMute, fontFamily:"'JetBrains Mono',monospace" }}>
                {isDone ? "all tones revealed" : `tone ${buildStep+1} of ${chord.tones.length}`}
              </span>
              <span style={{ fontSize:"10px", color: isDone ? chord.color : T.textMute, fontFamily:"'JetBrains Mono',monospace" }}>
                {isDone ? `✓ ${selectedRoot}${chord.symbol} complete` : `${progressPct}%`}
              </span>
            </div>
            <div style={{ height:"3px", background:T.border, borderRadius:"2px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progressPct}%`, background:chord.color, transition:"width 0.4s ease", borderRadius:"2px" }}/>
            </div>
          </div>
        )}

        {/* ── Fretboard ── */}
        <div style={{ background:T.surface, borderRadius:"14px", padding:"18px", border:`1px solid ${T.border}`, marginBottom:"12px" }}>
          {mode==="suggested" && voicings.length > 0 && (
            <div style={{ marginBottom:"16px" }}>
              <SL T={T}>CHOOSE A VOICING ({voicings.length} available)</SL>
              <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"12px" }}>
                {voicings.map((v,i) => (
                  <button key={i} onClick={() => setSelectedVoicing(i)} style={{
                    padding:"6px 13px", borderRadius:"7px", fontSize:"11px",
                    fontWeight: selectedVoicing===i ? "700":"400",
                    border: selectedVoicing===i ? `1.5px solid ${chord.color}` : `1.5px solid ${T.border}`,
                    background: selectedVoicing===i ? `${chord.color}18` : T.surface2,
                    color: selectedVoicing===i ? chord.color : T.textMute,
                    transition:"all 0.1s",
                  }}>
                    {i+1}. {v.name}
                  </button>
                ))}
              </div>
              {(() => {
                const v = voicings[selectedVoicing];
                return (
                  <div style={{
                    background:T.surface2, borderRadius:"10px",
                    border:`1px solid ${chord.color}33`,
                    padding:"14px 16px", animation:"fadeUp 0.15s ease",
                  }}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"10px", alignItems:"flex-start", marginBottom:"10px" }}>
                      <div>
                        <div style={{ fontSize:"13px", fontWeight:"700", color:T.textMid, marginBottom:"3px" }}>{v.name}</div>
                        <div style={{ fontSize:"11px", color:T.textMute, fontFamily:"'JetBrains Mono',monospace" }}>{v.fingers}</div>
                      </div>
                      {v.tones && (
                        <div style={{
                          marginLeft:"auto", padding:"4px 10px",
                          background:`${chord.color}12`, border:`1px solid ${chord.color}33`,
                          borderRadius:"6px", fontSize:"10px",
                          fontFamily:"'JetBrains Mono',monospace", color:chord.color,
                        }}>{v.tones}</div>
                      )}
                    </div>
                    {v.notes && (
                      <p style={{
                        fontSize:"12px", lineHeight:"1.7",
                        color:T.textLo, margin:0, fontStyle:"italic",
                        borderTop:`1px solid ${T.border}`, paddingTop:"10px",
                      }}>{v.notes}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <SemiFretboard
            root={selectedRoot}
            chord={chord}
            mode={mode}
            visibleSemis={visibleSemis}
            suggestedFrets={mode==="suggested" && voicings[selectedVoicing] ? transposeVoicing(voicings[selectedVoicing].frets, chord.tones.map(t=>t.semi), selectedRoot) : null}
            T={T}
          />
        </div>

        {/* ── Build mode description card ── */}
        {mode==="build" && (
          <div style={{
            background:T.surface, borderRadius:"12px", padding:"16px 18px",
            border:`1px solid ${chord.color}33`, marginBottom:"14px",
            animation:"fadeUp 0.2s ease",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
              <div style={{
                padding:"3px 10px", borderRadius:"20px",
                background:`${chord.color}20`, border:`1px solid ${chord.color}55`,
                fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
                fontWeight:"700", color:chord.color,
              }}>
                {currentTone.iname} — {addSemi(selectedRoot, currentTone.semi)}
              </div>
              <div style={{
                fontSize:"9px", fontFamily:"'JetBrains Mono',monospace",
                padding:"3px 8px", borderRadius:"10px",
                background: currentTone.role==="essential" ? `${chord.color}15`
                  : currentTone.role==="colour" ? (isDark ? "#14532d" : "#dcfce7")
                  : T.surface2,
                color: currentTone.role==="essential" ? chord.color
                  : currentTone.role==="colour" ? T.colourTone
                  : T.textLo,
                border:`1px solid ${T.border}`,
              }}>{currentTone.role}</div>
            </div>
            <p style={{ fontSize:"13px", lineHeight:"1.75", color:T.textLo, margin:0 }}>
              {currentTone.tip}
            </p>
          </div>
        )}

        {/* ── Build nav buttons ── */}
        {mode==="build" && (
          <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
            <button onClick={reset} style={{
              padding:"11px 16px", borderRadius:"9px",
              border:`1.5px solid ${T.border}`, background:T.surface2,
              color:T.textMute, fontSize:"12px", fontWeight:"600",
            }}>↺ Reset</button>
            <button onClick={() => setBuildStep(s => Math.max(0,s-1))} disabled={buildStep===0} style={{
              padding:"11px 16px", borderRadius:"9px",
              border:`1.5px solid ${T.border}`, background:T.surface2,
              color: buildStep===0 ? T.textDead : T.textLo,
              fontSize:"12px", fontWeight:"600",
              cursor: buildStep===0 ? "not-allowed":"pointer",
            }}>← Back</button>
            <button onClick={advance} disabled={isDone} style={{
              flex:1, padding:"11px", borderRadius:"9px",
              border:`1.5px solid ${chord.color}`,
              background:`${chord.color}15`,
              color: isDone ? `${chord.color}66` : chord.color,
              fontSize:"13px", fontWeight:"700",
              cursor: isDone ? "not-allowed":"pointer",
            }}>
              {isDone
                ? `${selectedRoot}${chord.symbol} complete ✓`
                : `Add ${chord.tones[buildStep+1]?.iname} →`
              }
            </button>
          </div>
        )}

        <div style={{ textAlign:"center", color:T.border, fontSize:"10px", fontFamily:"'JetBrains Mono',monospace", paddingTop:"8px" }}>
          unlocktheguitar.net
        </div>
      </div>
    </div>
  );
}

// ─── Fretboard with semi-based highlighting ───────────────────────────────────

function SemiFretboard({ root, chord, mode, visibleSemis, suggestedFrets, T }) {
  const displayStrings = [...OPEN_STRINGS_LOW_HIGH].reverse();

  return (
    <div style={{ overflowX:"auto", paddingBottom:"4px" }}>
      <div style={{ minWidth:"620px" }}>
        <div style={{ display:"flex", marginLeft:"36px", marginBottom:"4px" }}>
          {[0,...Array.from({length:FRET_COUNT},(_,i)=>i+1)].map(fret => (
            <div key={fret} style={{
              width:fret===0?"32px":"46px", textAlign:"center", fontSize:"9px", flexShrink:0,
              color:[3,5,7,9,12].includes(fret) ? T.fretHi : T.fretNum,
              fontWeight:[3,5,7,9,12].includes(fret)?"700":"400",
              fontFamily:"'JetBrains Mono',monospace",
            }}>{fret===0?"Open":fret}</div>
          ))}
        </div>

        {displayStrings.map((openNote, di) => {
          const strIdx = 5-di;
          const isOuter = di===0||di===5;
          const sugFret = suggestedFrets ? suggestedFrets[strIdx] : null;
          const isMuted = suggestedFrets && sugFret===null;

          return (
            <div key={di} style={{ display:"flex", alignItems:"center", marginBottom:"3px" }}>
              <div style={{ width:"32px", textAlign:"right", paddingRight:"5px", fontSize:"9px", color:T.fretNum, flexShrink:0, fontFamily:"'JetBrains Mono',monospace" }}>
                {isMuted ? <span style={{ color:T.muted }}>×</span> : openNote}
              </div>
              {Array.from({length:FRET_COUNT+1},(_,fret) => {
                const note = addSemi(openNote, fret);
                const semi = (NOTES.indexOf(note) - NOTES.indexOf(root) + 12) % 12;
                const toneInfo = chord.tones.find(t => t.semi===semi);
                const rc = toneInfo
                  ? toneInfo.role==="essential" ? chord.color
                  : toneInfo.role==="colour" ? T.colourTone : T.roleOptional
                  : null;

                const isActive = mode==="build"
                  ? visibleSemis.has(semi)
                  : sugFret===fret && !isMuted;

                const iname = getIntervalName(root, note);
                const isRoot = semi===0;
                const dotColor = rc || "#6366f1";

                return (
                  <div key={fret} style={{
                    width:fret===0?"32px":"46px", height:"28px",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    position:"relative", flexShrink:0,
                  }}>
                    {!isMuted && <div style={{ position:"absolute", top:"50%", left:0, right:0, height:isOuter?"1px":"2px", background:T.string, transform:"translateY(-50%)" }}/>}
                    {fret>0 && !isMuted && <div style={{ position:"absolute", top:0, bottom:0, right:0, width:fret===12?"3px":"1.5px", background:fret===12 ? T.fretHi : T.fretBar }}/>}

                    {isActive && (
                      <div style={{
                        position:"relative", zIndex:2,
                        width:"22px", height:"22px", borderRadius:"50%",
                        background:dotColor,
                        border:isRoot?"2px solid #fff":"none",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"7px", fontWeight:"700", color:"#fff",
                        fontFamily:"'JetBrains Mono',monospace",
                        boxShadow:isRoot?`0 0 8px ${dotColor}`:"none",
                        transition:"all 0.15s",
                        animation:"popIn 0.15s ease",
                      }}>{iname}</div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div style={{ display:"flex", marginLeft:"78px", marginTop:"3px" }}>
          {Array.from({length:FRET_COUNT},(_,i)=>i+1).map(fret => (
            <div key={fret} style={{ width:"46px", textAlign:"center", flexShrink:0 }}>
              {[3,5,7,9].includes(fret)&&<div style={{ width:"6px",height:"6px",borderRadius:"50%",background:T.fretMark,margin:"0 auto" }}/>}
              {fret===12&&<div style={{ display:"flex",gap:"4px",justifyContent:"center" }}>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:T.fretMark }}/>
                <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:T.fretMark }}/>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SL({ children, style, T }) {
  return <div style={{ fontSize:"9px", color:T.textMute, letterSpacing:"1.5px", marginBottom:"8px", fontFamily:"'JetBrains Mono',monospace", fontWeight:"600", ...style }}>{children}</div>;
}

function LegendPill({ color, label, T }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:color, flexShrink:0 }}/>
      <span style={{ fontSize:"10px", color:T.textMute, fontFamily:"'JetBrains Mono',monospace" }}>{label}</span>
    </div>
  );
}
