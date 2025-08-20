import React, { useState, useEffect, useRef } from 'react'
import { Send, X, Mic, Minimize2, Trash2, Sparkles, SlidersHorizontal, ChevronDown, ChevronUp, VolleyballIcon, BotMessageSquareIcon } from 'lucide-react'
import { askGeminiStream, isGeminiEnabled } from '../utils/geminiClient'
import { dummyShowsData as eventsData } from '../data/assests'
import TicketBookingModal from './TicketBookingModal'
import { useApp } from '../hooks/useApp'

const quickChips = [
  'Upcoming cricket in India',
  'Tickets under 1000',
  'Events in Delhi',
  'Show football matches',
]

const GENRES = ['cricket','football','hockey','badminton','kabaddi','others']

function getStoredTrending() {
  try {
    const v = localStorage.getItem('chatTrending')
    return v ? v === '1' : false
  } catch {
    return false
  }
}

const FootballChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm your Sports Assistant. Ask about matches, prices, or bookings. Try the quick chips below." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [memory, setMemory] = useState(() => {
    const raw = localStorage.getItem('chatMemory')
    if (!raw) return {}
    try { return JSON.parse(raw) } catch { return {} }
  })
  const [showFilters, setShowFilters] = useState(false)
  const [modalEvent, setModalEvent] = useState(null)
  const [showTrending, setShowTrending] = useState(getStoredTrending)

  const recognitionRef = useRef(null)
  const chatEndRef = useRef(null)
  const { addBooking } = useApp()

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { localStorage.setItem('chatMemory', JSON.stringify(memory || {})) }, [memory])
  useEffect(() => { try { localStorage.setItem('chatTrending', showTrending ? '1' : '0') } catch { /* storage not available */ } }, [showTrending])

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = (event) => { setInput(event.results[0][0].transcript) }
      recognition.onend = () => setIsListening(false)
      recognitionRef.current = recognition
    }
  }, [])

  const knownCities = Array.from(new Set((eventsData || []).map(e => (e.location || '').toLowerCase()).filter(Boolean)))

  const parseContext = (question) => {
    const q = String(question || '').toLowerCase()
    const newMem = { ...memory }
    let foundGenre = false
    let foundCity = false
    let foundPrice = false

    for (const g of GENRES) {
      if (q.includes(g)) { newMem.genre = g; foundGenre = true; break }
    }
    for (const city of knownCities) {
      if (city && q.includes(city)) { newMem.city = city; foundCity = true; break }
    }
    const underMatch = q.match(/under\s*(\d{2,6})|below\s*(\d{2,6})|<=?\s*(\d{2,6})|upto\s*(\d{2,6})/)
    if (underMatch) {
      const val = Number(underMatch[1] || underMatch[2] || underMatch[3] || underMatch[4])
      if (!Number.isNaN(val)) { newMem.maxPrice = val; foundPrice = true }
    } else {
      const explicit = q.match(/\b(\d{3,6})\b/)
      if (explicit) {
        const n = Number(explicit[1])
        if (!Number.isNaN(n)) { newMem.maxPrice = n; foundPrice = true }
      }
    }

    if (q.includes('clear') || q.includes('reset filters') || q.includes('reset')) {
      setMemory({})
      return {}
    }

    if (!foundCity && (foundGenre || foundPrice || q.includes('anywhere') || q.includes('india'))) {
      delete newMem.city
    }

    setMemory(newMem)
    return newMem
  }

  const filterMatches = (ctx) => {
    const list = (eventsData || [])
    const genre = (ctx.genre || '').toLowerCase()
    const city = (ctx.city || '').toLowerCase()
    const maxPrice = ctx.maxPrice
    const matches = list.filter(e => {
      const okGenre = !genre || (e.genre || '').toLowerCase().includes(genre)
      const okCity = !city || (e.location || '').toLowerCase().includes(city)
      let okPrice = true
      if (maxPrice && Array.isArray(e.seatTypes)) {
        const regular = e.seatTypes.find(t => (t.type || '').toLowerCase() === 'regular')
        const price = regular?.price || 0
        okPrice = price <= maxPrice
      }
      return okGenre && okCity && okPrice
    })
    return matches.slice(0, 6)
  }

  const buildLocalText = (ctx, matches) => {
    if (!matches || !matches.length) {
      return 'I can help you find events. Try refining by genre, city, or price with the filter icon.'
    }
    const lines = matches.map(m => `• ${m.title} — ${m.genre || ''} — ${m.date || ''} — ${m.location || ''}`)
    const ctxBits = [ctx.genre && `genre: ${ctx.genre}`, ctx.city && `city: ${ctx.city}`, ctx.maxPrice && `≤ ₹${ctx.maxPrice}`].filter(Boolean)
    const header = ctxBits.length ? `Here are some options (${ctxBits.join(', ')}):` : 'Here are some options for you:'
    return `${header}\n${lines.join('\n')}\n\nTap Book to continue.`
  }

  const pushCards = (matches, note) => {
    if (!matches.length) return
    setMessages(prev => ([
      ...prev,
      {
        sender: 'bot',
        text: note || 'Here are some options for you:',
        cards: matches.map(m => ({
          id: m._id || m.id,
          title: m.title,
          subtitle: `${m.genre || ''} • ${m.date || ''} • ${m.location || ''}`,
          img: m.backdrop_path || m.poster_path || '',
          price: (m.seatTypes && m.seatTypes.find(t => (t.type || '').toLowerCase()==='regular')?.price) || 0,
        }))
      }
    ]))
  }

  const bookEvent = (id) => {
    if (!id) return
    const full = (eventsData || []).find(e => (e._id || e.id) === id)
    if (full) setModalEvent(full)
  }

  const handleSend = async (preset) => {
    const question = typeof preset === 'string' ? preset : input
    if (!String(question).trim()) return

    const ctx = parseContext(question)

    const userMsg = { sender: 'user', text: question }
    let botIndex = null
    let assembled = ''

    setMessages(prev => {
      const updated = [...prev, userMsg, { sender: 'bot', text: '' }]
      botIndex = updated.length - 1
      return updated
    })

    // Instant suggestions to feel responsive
    const instant = filterMatches(ctx)
    if (instant.length) {
      pushCards(instant, 'Suggestions based on your query:')
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
    }

    setInput('')
    setLoading(true)

    try {
      let gotChunk = false
      for await (const chunk of askGeminiStream(question, eventsData)) {
        gotChunk = true
        assembled = chunk
        setMessages(prev => prev.map((m, i) => i === botIndex ? { ...m, text: assembled } : m))
      }
      if (!gotChunk) {
        const matches = filterMatches(ctx)
        assembled = buildLocalText(ctx, matches)
        setMessages(prev => prev.map((m, i) => i === botIndex ? { ...m, text: assembled } : m))
      }
    } catch {
      const matches = filterMatches(ctx)
      assembled = buildLocalText(ctx, matches)
      setMessages(prev => prev.map((m, i) => i === botIndex ? { ...m, text: assembled } : m))
    } finally {
      setLoading(false)
      // no additional follow-up list requested
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return
    setIsListening(true)
    recognitionRef.current.start()
  }

  const clearChat = () => {
    setMessages([{ sender: 'bot', text: "Hi! I'm your Sports Assistant. Ask about matches, prices, or bookings." }])
  }

  // trending section uses eventsData directly

  const setGenre = (g) => setMemory(m => ({ ...m, genre: g }))
  const setCity = (c) => setMemory(m => ({ ...m, city: c }))
  const setPrice = (p) => setMemory(m => ({ ...m, maxPrice: p }))
  const clearFilters = () => setMemory({})
  const applyFilters = () => {
    const matches = filterMatches(memory)
    if (!matches.length) {
      const tip = memory.city ? `No matches in ${memory.city}. Try clearing city filter.` : 'No matches. Try expanding filters.'
      setMessages(prev => ([...prev, { sender: 'bot', text: tip }]))
    }
    setMessages(prev => ([...prev, { sender: 'bot', text: buildLocalText(memory, matches) }]))
    pushCards(matches, 'Updated results based on your filters:')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-6 right-4 z-50 bg-gradient-to-br from-green-600 to-emerald-500 text-white rounded-full p-4 shadow-xl hover:shadow-2xl hover:scale-105 transition cursor-pointer '
        title='AI Sports Assistant'
      >
        <BotMessageSquareIcon />
      </button>

      {isOpen && (
        <div className='fixed bottom-20 right-4 w-[86vw] sm:w-[380px] md:w-[420px] lg:w-[480px] xl:w-[520px] max-h-[80vh] bg-[#0b0b0b] text-white shadow-2xl rounded-2xl z-50 flex flex-col border border-white/10 overflow-hidden'>
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-sm border-b border-white/10'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 rounded-full bg-green-600 grid place-items-center text-xs'>🤖</div>
              <div>
                <div className='text-sm font-semibold'>Sports Assistant</div>
                <div className='text-[10px] text-gray-400'>{isGeminiEnabled() ? 'Gemini enabled' : 'Local mode'}</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button className='p-1 rounded hover:bg-white/5' onClick={() => setShowTrending(v=>!v)} title='Toggle trending'>
                {showTrending ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button className='p-1 rounded hover:bg-white/5' onClick={() => setShowFilters(f => !f)} title='Refine filters'><SlidersHorizontal size={16} /></button>
              <button className='p-1 rounded hover:bg-white/5' onClick={clearChat} title='Clear chat'><Trash2 size={16} /></button>
              <button className='p-1 rounded hover:bg-white/5' onClick={() => setIsOpen(false)} title='Minimize'><Minimize2 size={16} /></button>
              <button className='p-1 rounded hover:bg-white/5' onClick={() => setIsOpen(false)} title='Close'><X size={16} /></button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className='px-3 py-3 bg-black/40 border-b border-white/10 text-[11px]'>
              <div className='mb-2 text-gray-400'>Refine by Genre</div>
              <div className='flex gap-2 flex-wrap mb-3'>
                {GENRES.map(g => (
                  <button key={g} onClick={() => setGenre(g)} className={`px-2 py-1 rounded-full border ${memory.genre===g ? 'bg-green-600 border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{g}</button>
                ))}
              </div>
              <div className='mb-2 text-gray-400'>Refine by City</div>
              <div className='flex gap-2 flex-wrap mb-3 max-h-16 overflow-y-auto pr-1'>
                {knownCities.slice(0,24).map(c => (
                  <button key={c} onClick={() => setCity(c)} className={`px-2 py-1 rounded-full border capitalize ${memory.city===c ? 'bg-green-600 border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{c}</button>
                ))}
              </div>
              <div className='mb-2 text-gray-400'>Refine by Price</div>
              <div className='flex gap-2 flex-wrap mb-3'>
                {[800,1500,2500,3500].map(p => (
                  <button key={p} onClick={() => setPrice(p)} className={`px-2 py-1 rounded-full border ${memory.maxPrice===p ? 'bg-green-600 border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>≤ ₹{p}</button>
                ))}
              </div>
              <div className='flex justify-between'>
                <button onClick={clearFilters} className='px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10'>Clear</button>
                <button onClick={applyFilters} className='px-2 py-1 rounded bg-green-600 hover:bg-green-700'>Show results</button>
              </div>
            </div>
          )}

          {/* Trending */}
          {showTrending && (
            <div className='px-3 pt-2 pb-2 bg-[#0d0d0d] border-b border-white/10'>
              <div className='text-xs text-gray-400 mb-2'>Trending events</div>
              <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10'>
                {(eventsData || []).slice(0, 6).map((e, idx) => (
                  <div key={idx} className='min-w-[140px] bg-white/5 rounded-lg p-2 border border-white/10'>
                    <div className='text-xs font-semibold line-clamp-2'>{e.title}</div>
                    <div className='text-[10px] text-gray-400'>{e.genre} • {e.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          <div className='flex-1 min-h-[220px] max-h-[55vh] overflow-y-auto px-3 py-3 bg-[#0e0e0e] flex flex-col space-y-3 text-sm scrollbar-thin scrollbar-thumb-white/20'>
            {messages.map((msg, idx) => (
              <div key={idx} className='space-y-2'>
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && (<div className='w-6 h-6 bg-green-600 text-white text-xs flex items-center justify-center rounded-full mr-2'>🤖</div>)}
                  <div className={`p-2 rounded-2xl max-w-[78%] whitespace-pre-wrap break-words shadow ${msg.sender === 'bot' ? 'bg-white/5 text-left rounded-bl-none border border-white/10' : 'bg-green-600/20 text-right rounded-br-none border border-green-500/20'}`}>
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (<div className='w-6 h-6 bg-[var(--color-primary)] text-white text-xs flex items-center justify-center rounded-full ml-2'>👤</div>)}
                </div>
                {msg.cards && (
                  <div className='grid grid-cols-1 gap-2 pl-8 pr-2'>
                    {msg.cards.map((c, i) => (
                      <div key={i} className='flex gap-3 items-center bg-white/5 rounded-lg p-2 border border-white/10'>
                        {c.img && <img src={c.img} alt={c.title} className='w-12 h-12 rounded object-cover' />}
                        <div className='flex-1'>
                          <div className='text-xs font-semibold line-clamp-1'>{c.title}</div>
                          <div className='text-[10px] text-gray-400 line-clamp-1'>{c.subtitle}</div>
                          <div className='text-[11px] text-green-400 mt-1'>Regular: ₹{(c.price || 0).toLocaleString()}</div>
                        </div>
                        <button onClick={() => bookEvent(c.id)} className='text-xs px-2 py-1 rounded bg-green-600 hover:bg-green-700'>Book</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className='flex items-center gap-2 text-sm text-gray-400 pl-8'>
                <div className='animate-pulse'>Typing</div>
                <div className='animate-bounce'>.</div>
                <div className='animate-bounce delay-150'>.</div>
                <div className='animate-bounce delay-300'>.</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick chips */}
          <div className='px-3 py-2 bg-black/40 border-t border-white/10 flex gap-2 flex-wrap'>
            {quickChips.map((chip, idx) => (
              <button key={idx} onClick={() => handleSend(chip)} className='text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10'>
                {chip}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className='flex items-center border-t border-white/10 px-2 py-2 bg-black/40'>
            <input
              type='text'
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
              placeholder='Ask about matches, prices, cities... (Enter to send)'
              className='flex-1 px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg outline-none focus:border-green-500'
              onKeyDown={(ev) => ev.key === 'Enter' && handleSend()}
            />
            <Mic onClick={handleVoiceInput} className={`ml-2 cursor-pointer transition ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-200'}`} title='Voice input' />
            <Send className='ml-2 cursor-pointer text-green-400 hover:text-green-300' onClick={() => handleSend()} title='Send' />
          </div>
        </div>
      )}

      {/* Booking Modal from chatbot */}
      {modalEvent && (
        <TicketBookingModal
          event={modalEvent}
          onClose={() => setModalEvent(null)}
          onConfirm={(ev, formData) => {
            try { addBooking(ev, null, formData) } catch (err) { console.warn('Booking save failed (non-fatal):', err) }
          }}
        />
      )}
    </>
  )
}

export default FootballChatBot

