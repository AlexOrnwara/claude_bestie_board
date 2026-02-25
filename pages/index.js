import { useEffect, useState, useRef, useCallback } from 'react'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

// ── Constants ────────────────────────────────────────────────
const MOODS = ['😊','😂','🥰','😭','😴','🤩','😤','🥺','😌','🤗','🥳','😎','🫠','🤔','😇','🥲','😏','🫶','💀','🌸','🙃','😬','🥹','🫡','🤯','🦋','💫','🌈','🔥','🫧']
const AVEMOJI = ['🌸','🌊','🦋','🌙','⭐','🌈','🍓','🍀','🔮','🦊','🐱','🐶','🐻','🐼','🐨','🦁','🐸','🦄','🍭','☀️','🌺','🪷','🌻','🍄','🫧','💎','🍒','🫐','🌴','🐝']
const GIF_SETS = {
  cats: [
    'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
    'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif',
    'https://media.giphy.com/media/l4FGGafcOHmrlQxG0/giphy.gif',
    'https://media.giphy.com/media/BzyTuYCmvSORqs1ABM/giphy.gif',
  ],
  dogs: [
    'https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif',
    'https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif',
    'https://media.giphy.com/media/4ZrFRwHGl4HTELW801/giphy.gif',
    'https://media.giphy.com/media/26FxykLpuDxQiFbnO/giphy.gif',
    'https://media.giphy.com/media/mCRJDo24UvJMA/giphy.gif',
    'https://media.giphy.com/media/oCjCOdBKukBEQ/giphy.gif',
  ],
  cozy: [
    'https://media.giphy.com/media/YnBntKOgnUSBkV7bQH/giphy.gif',
    'https://media.giphy.com/media/xT9IgG50Lg7rusUgyU/giphy.gif',
    'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    'https://media.giphy.com/media/3o7WIRMNnbFpyZaWdy/giphy.gif',
    'https://media.giphy.com/media/l2JhtKtDWYNKdRpoA/giphy.gif',
    'https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif',
  ],
  cute: [
    'https://media.giphy.com/media/CjmvTCZf2U3p09Cn0h/giphy.gif',
    'https://media.giphy.com/media/LpFkGgz1CcXVBXvgAi/giphy.gif',
    'https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif',
    'https://media.giphy.com/media/H4DjXQXamtTiIuCcRU/giphy.gif',
    'https://media.giphy.com/media/3ohhwLh5dw0i7iLzOg/giphy.gif',
    'https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif',
  ],
}

const DEFAULT_STATE = {
  name1: 'Bestie 1', name2: 'Bestie 2',
  avatar1: '🌸', avatar2: '🌊',
  mood1: '😊', moodtext1: '',
  mood2: '🌙', moodtext2: '',
  note1: '', note2: '',
  music1: '', music2: '',
  fdep1: '', farr1: '', fdate1: '',
  fdep2: '', farr2: '', fdate2: '',
  gif1: '', gif2: '',
  meetupPlace: '', meetupDate: '',
  ts1: null, ts2: null,
}

// ── Countdown helper ─────────────────────────────────────────
function getFlightCnt(dep, arr, date, color) {
  if (!date) return null
  const diff = Math.ceil((new Date(date) - new Date()) / 86400000)
  let text
  if (diff < 0) text = `${dep||'?'} → ${arr||'?'} · already flew! ✈️`
  else if (diff === 0) text = `${dep||'?'} → ${arr||'?'} · TODAY!!! 🛫🎉`
  else text = `${dep||'?'} → ${arr||'?'} · ${diff} day${diff !== 1 ? 's' : ''} to go ✈️`
  return <div className="flightCnt" style={{ color }}>{text}</div>
}

function getMeetupCnt(place, date) {
  if (!date) return null
  const diff = Math.ceil((new Date(date) - new Date()) / 86400000)
  let text
  if (diff < 0) text = `${place||'somewhere'} was ${Math.abs(diff)}d ago 💖`
  else if (diff === 0) text = `IT'S TODAY!!! 🎉🎉🎉`
  else text = `${place||'somewhere'} in ${diff} day${diff !== 1 ? 's' : ''} 💕`
  return <div className="bigCnt">{text}</div>
}

// ── EmojiPicker ──────────────────────────────────────────────
function EmojiPicker({ id, emojis, onSelect, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (disabled) return null

  return (
    <div className="pickerWrap" ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#bbb' }}>
        ✏️
      </button>
      <div className={`emojiPicker ${open ? 'open' : ''}`} id={id}>
        {emojis.map(e => (
          <button key={e} className="emojiOpt" onClick={() => { onSelect(e); setOpen(false) }}>{e}</button>
        ))}
      </div>
    </div>
  )
}

// ── GifModal ─────────────────────────────────────────────────
function GifModal({ open, onClose, onSelect }) {
  const [tab, setTab] = useState('cats')
  const [urlVal, setUrlVal] = useState('')

  return (
    <div className={`modalOverlay ${open ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modalBox">
        <div className="modalHead">
          <h3>🐾 pick your vibe</h3>
          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>
        <div className="gifTabs">
          {Object.keys(GIF_SETS).map(t => (
            <button key={t} className={`gifTab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'cats' ? '🐱 cats' : t === 'dogs' ? '🐶 dogs' : t === 'cozy' ? '☕ cozy' : '🌸 cute'}
            </button>
          ))}
        </div>
        <div className="gifGrid">
          {GIF_SETS[tab].map((url, i) => (
            <div key={i} className="gifItem" onClick={() => { onSelect(url); onClose() }}>
              <img src={url} alt="gif" loading="lazy" />
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#bbb', marginBottom: '8px' }}>or paste any gif/image URL:</p>
        <div className="urlRow">
          <input className="urlInp" value={urlVal} onChange={e => setUrlVal(e.target.value)} placeholder="https://...gif" />
          <button className="applyBtn" onClick={() => { if (urlVal.trim()) { onSelect(urlVal.trim()); onClose(); setUrlVal('') } }}>set ✓</button>
        </div>
      </div>
    </div>
  )
}

// ── BffCard ───────────────────────────────────────────────────
function BffCard({ n, data, mine, onChange, onGifClick }) {
  const color = n === 1 ? 'var(--p1-dark)' : 'var(--p2-dark)'
  const isOnline = data[`ts${n}`] && Date.now() - data[`ts${n}`] < 5 * 60 * 1000

  const field = (key) => data[key] || ''
  const update = (key, val) => onChange(key, val)

  return (
    <div className={`noteCard p${n} ${mine ? 'mine' : ''}`}>
      <div className="cardHeader">
        <div className="avatarWrap">
          <button className="cardAvatar" disabled={!mine} title={mine ? 'Click to change' : ''}>
            {field(`avatar${n}`)}
          </button>
          <EmojiPicker
            id={`apicker${n}`}
            emojis={AVEMOJI}
            onSelect={val => update(`avatar${n}`, val)}
            disabled={!mine}
          />
        </div>
        <div className="cardNameWrap">
          <input
            className="cardName"
            value={field(`name${n}`)}
            onChange={e => update(`name${n}`, e.target.value)}
            maxLength={20}
            disabled={!mine}
          />
        </div>
        <div className={`onlinePip ${isOnline ? 'online' : ''}`} title={isOnline ? 'Online' : 'Offline'} />
      </div>

      <div className="slabel">✨ current mood</div>
      <div className="moodRow">
        <div className="pickerWrap" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="moodBig" disabled={!mine}>{field(`mood${n}`)}</button>
          <EmojiPicker
            id={`mpicker${n}`}
            emojis={MOODS}
            onSelect={val => update(`mood${n}`, val)}
            disabled={!mine}
          />
        </div>
        <input
          className="moodText"
          value={field(`moodtext${n}`)}
          onChange={e => update(`moodtext${n}`, e.target.value)}
          placeholder="feeling..."
          maxLength={40}
          disabled={!mine}
        />
      </div>

      <div className="slabel">📝 note</div>
      <textarea
        className="noteText"
        value={field(`note${n}`)}
        onChange={e => update(`note${n}`, e.target.value)}
        placeholder="write something sweet..."
        maxLength={300}
        disabled={!mine}
      />

      <div className="slabel">🎵 listening to</div>
      <div className="musicRow">
        <span className="musicIcon">🎵</span>
        <input
          className="musicInp"
          value={field(`music${n}`)}
          onChange={e => update(`music${n}`, e.target.value)}
          placeholder="song · artist"
          maxLength={80}
          disabled={!mine}
        />
      </div>

      <div className="slabel">✈️ my next flight</div>
      <div className="flightBox">
        <div className="flightRow">
          <input className="flightInp" value={field(`fdep${n}`)} onChange={e => update(`fdep${n}`, e.target.value)} placeholder="from" maxLength={10} disabled={!mine} />
          <span className="flightArrow">→</span>
          <input className="flightInp" value={field(`farr${n}`)} onChange={e => update(`farr${n}`, e.target.value)} placeholder="to" maxLength={10} disabled={!mine} />
          <input className="flightInp" type="date" value={field(`fdate${n}`)} onChange={e => update(`fdate${n}`, e.target.value)} disabled={!mine} />
        </div>
        {getFlightCnt(field(`fdep${n}`), field(`farr${n}`), field(`fdate${n}`), color)}
      </div>

      <div className="slabel">🐾 vibe gif</div>
      <div className="gifRow">
        {field(`gif${n}`) && <img className="gifPreview" src={field(`gif${n}`)} alt="vibe gif" />}
        {mine && <button className="gifBtn" onClick={() => onGifClick(n)}>{n === 1 ? '🐱' : '🐶'} pick a gif</button>}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function Home() {
  const [boardData, setBoardData] = useState(DEFAULT_STATE)
  const [myWho, setMyWho] = useState(null)
  const [syncStatus, setSyncStatus] = useState({ cls: '', text: 'connecting...' })
  const [gifModal, setGifModal] = useState({ open: false, card: 1 })
  const [floaters, setFloaters] = useState([])

  const saveTimer = useRef(null)
  const myWhoRef = useRef(null)
  const boardRef = useRef(boardData)

  useEffect(() => { boardRef.current = boardData }, [boardData])
  useEffect(() => { myWhoRef.current = myWho }, [myWho])

  // ── Floaters
  useEffect(() => {
    const pets = ['🐱','🐶','🐾','✨','💕','🌸','⭐','🦋','🌈','🍓','💫','🫧']
    const interval = setInterval(() => {
      const id = Date.now()
      const item = {
        id,
        emoji: pets[Math.floor(Math.random() * pets.length)],
        left: Math.random() * 100,
        duration: 9 + Math.random() * 12,
      }
      setFloaters(f => [...f, item])
      setTimeout(() => setFloaters(f => f.filter(x => x.id !== id)), 22000)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // ── Initial load + Supabase Realtime subscription
  useEffect(() => {
    async function loadInitial() {
      const { data, error } = await supabase
        .from('bffboard')
        .select('value')
        .eq('key', 'board')
        .single()

      if (data?.value) {
        setBoardData(prev => ({ ...prev, ...data.value }))
      }
      setSyncStatus({ cls: 'live', text: 'pick who you are 👆' })
    }
    loadInitial()

    // Real-time subscription
    const channel = supabase
      .channel('bffboard-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bffboard', filter: 'key=eq.board' },
        (payload) => {
          const incoming = payload.new?.value
          if (!incoming) return
          const who = myWhoRef.current
          setBoardData(prev => {
            // Don't overwrite own card with stale remote data
            const merged = { ...prev, ...incoming }
            if (who === 1) {
              const keys1 = ['name1','avatar1','mood1','moodtext1','note1','music1','fdep1','farr1','fdate1','gif1']
              keys1.forEach(k => { merged[k] = prev[k] })
            } else if (who === 2) {
              const keys2 = ['name2','avatar2','mood2','moodtext2','note2','music2','fdep2','farr2','fdate2','gif2']
              keys2.forEach(k => { merged[k] = prev[k] })
            }
            return merged
          })
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // ── Save to Supabase
  const saveToSupabase = useCallback(async (dataToSave) => {
    setSyncStatus({ cls: 'saving', text: 'saving...' })
    const { error } = await supabase
      .from('bffboard')
      .upsert({ key: 'board', value: dataToSave, updated_at: new Date().toISOString() })

    if (error) {
      setSyncStatus({ cls: '', text: 'save failed ⚠️' })
    } else {
      setSyncStatus({ cls: 'live', text: 'saved ✓' })
      setTimeout(() => setSyncStatus({ cls: 'live', text: 'live sync on 🟢' }), 1500)
    }
  }, [])

  // ── Field change handler
  const handleChange = useCallback((key, val) => {
    setBoardData(prev => {
      const next = { ...prev, [key]: val, [`ts${myWhoRef.current}`]: Date.now() }
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => saveToSupabase(next), 700)
      return next
    })
  }, [saveToSupabase])

  // ── Select who I am
  const selectWho = (n) => {
    setMyWho(n)
    setSyncStatus({ cls: 'live', text: 'live sync on 🟢' })
  }

  return (
    <>
      <Head>
        <title>💌 BFF Board</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💌</text></svg>" />
      </Head>

      {/* Floaters */}
      <div className="floaters">
        {floaters.map(f => (
          <span
            key={f.id}
            className="floater"
            style={{ left: `${f.left}vw`, animationDuration: `${f.duration}s` }}
          >{f.emoji}</span>
        ))}
      </div>

      {/* Header */}
      <div className="header">
        <h1>💌 BFF Board</h1>
        <p className="subtitle">your cozy little shared space — just the two of you ✨</p>
        <div className={`syncStatus ${syncStatus.cls}`}>
          <div className="syncDot" />
          <span>{syncStatus.text}</span>
        </div>
      </div>

      {/* Who am I */}
      <div className="whoBar">
        <button className={`whoBtn p1 ${myWho === 1 ? 'active' : ''}`} onClick={() => selectWho(1)}>
          I&apos;m Bestie 1 🌸
        </button>
        <button className={`whoBtn p2 ${myWho === 2 ? 'active' : ''}`} onClick={() => selectWho(2)}>
          I&apos;m Bestie 2 🌊
        </button>
      </div>

      {/* Board */}
      <div className="board">
        {[1, 2].map(n => (
          <BffCard
            key={n}
            n={n}
            data={boardData}
            mine={myWho === n}
            onChange={handleChange}
            onGifClick={(card) => setGifModal({ open: true, card })}
          />
        ))}
      </div>

      {/* Shared meetup */}
      <div className="sharedWrap">
        <div className="sharedCard">
          <div className="sharedTitle">🗓️ when we meet next</div>
          <div className="meetupRow">
            <span>📍</span>
            <input
              className="meetupInp"
              value={boardData.meetupPlace || ''}
              onChange={e => handleChange('meetupPlace', e.target.value)}
              placeholder="where are we meeting?"
              disabled={!myWho}
            />
            <input
              className="meetupInp"
              type="date"
              value={boardData.meetupDate || ''}
              onChange={e => handleChange('meetupDate', e.target.value)}
              style={{ fontFamily: 'Nunito, sans-serif', fontSize: '0.9rem' }}
              disabled={!myWho}
            />
            {getMeetupCnt(boardData.meetupPlace, boardData.meetupDate)}
          </div>
          <div className="catsBanner">🐱 🐾 ✨ 🐾 🐶</div>
        </div>
      </div>

      {/* Gif Modal */}
      <GifModal
        open={gifModal.open}
        onClose={() => setGifModal(g => ({ ...g, open: false }))}
        onSelect={(url) => handleChange(`gif${gifModal.card}`, url)}
      />
    </>
  )
}
