import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  '📐 Explain Pythagoras theorem',
  '⚗️ What is photosynthesis?',
  '📊 Difference between mean & median',
  '🧬 What is DNA replication?',
  '⚡ Explain Ohm\'s Law simply',
  '📜 What caused World War I?',
]

const SYSTEM_PROMPT = `You are PathFinder's AI study assistant for Indian students (Class 9–College).

STRICT RULES — follow these always:
1. ONLY answer questions related to academic subjects: Maths, Science, History, Geography, English, Economics, Civics, Computer Science, or career/college guidance.
2. If the user asks anything NOT related to studies or career — reply ONLY with: "I can only help with study-related questions. Try asking me about a subject! 📚"
3. Keep answers SHORT and DIRECT — 3 to 5 sentences maximum for simple questions.
4. Use bullet points only when listing steps or multiple items.
5. NO long introductions. NO "Great question!" or "Sure!" Go straight to the answer.
6. NO repeating the question back. NO summarizing at the end.
7. Use Indian curriculum context (CBSE/ICSE) when relevant.
8. End with ONE short follow-up tip or question — only if it adds value.
9. Use emojis sparingly — max 1 or 2 per reply.`

const API_KEY = 'AIzaSyDc4g3kX6Is62lLfoVA0AZafVrQ11sGoFI'

const MODELS = [
  'gemini-2.5-flash-lite-preview-06-17',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
]

async function callGemini(history, apiKey) {
  let lastError = ''
  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: history,
            generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        const msg = data?.error?.message || ''
        lastError = msg
        if (
          msg.includes('not found') || msg.includes('quota') ||
          msg.includes('limit: 0') || msg.includes('not supported') ||
          msg.includes('RESOURCE_EXHAUSTED')
        ) continue
        throw new Error(msg || 'API error')
      }
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (reply) return { reply, model }
    } catch (e) {
      lastError = e.message
      continue
    }
  }
  throw new Error(
    lastError.includes('limit: 0') || lastError.includes('quota')
      ? 'API key has no free quota. Go to aistudio.google.com/apikey → delete old key → Create API key in new project.'
      : `All models failed. ${lastError}`
  )
}

const STORAGE_KEY = 'pf_question_history'

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export default function AIAssistant() {
  const [open,        setOpen]        = useState(false)
  const [tab,         setTab]         = useState('chat')   // 'chat' | 'history'
  const [messages,    setMessages]    = useState([{
    role: 'assistant',
    content: "Hi! 👋 I'm your PathFinder Study AI. Ask me any subject doubt — Maths, Science, History and more! 📚",
  }])
  const [input,       setInput]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [pulse,       setPulse]       = useState(true)
  const [activeModel, setActiveModel] = useState('')
  const [qHistory,    setQHistory]    = useState(loadHistory)  // saved questions

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => { if (open) setPulse(false) }, [open])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])
  useEffect(() => { if (open && tab === 'chat') setTimeout(() => inputRef.current?.focus(), 300) }, [open, tab])

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')
    setTab('chat')

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    // ✅ Save question to history (avoid duplicates)
    setQHistory(prev => {
      const exists = prev.find(q => q.text === userText)
      if (exists) return prev
      const updated = [
        { text: userText, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), date: new Date().toLocaleDateString('en-IN') },
        ...prev,
      ].slice(0, 50) // keep max 50
      saveHistory(updated)
      return updated
    })

    try {
      const geminiHistory = []
      geminiHistory.push({ role: 'user',  parts: [{ text: SYSTEM_PROMPT }] })
      geminiHistory.push({ role: 'model', parts: [{ text: 'Understood. I will only answer study and career questions, keep answers short and direct.' }] })
      newMessages.slice(1).forEach(m => {
        geminiHistory.push({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })
      })

      const { reply, model } = await callGemini(geminiHistory, API_KEY)
      if (model && model !== activeModel) setActiveModel(model)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Hi! 👋 I'm your PathFinder Study AI. Ask me any subject doubt — Maths, Science, History and more! 📚",
    }])
  }

  const clearHistory = () => {
    setQHistory([])
    saveHistory([])
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 2000 }}>
        {!open && (
          <div style={{
            position: 'absolute', bottom: '110%', right: 0,
            background: '#0F172A', color: 'white',
            padding: '7px 13px', borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', fontWeight: 500,
            whiteSpace: 'nowrap', pointerEvents: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          }}>
            Ask Study Doubts 💡
            <div style={{
              position: 'absolute', bottom: -5, right: 18,
              width: 10, height: 10, background: '#0F172A',
              transform: 'rotate(45deg)', borderRadius: 2,
            }} />
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 58, height: 58, borderRadius: '50%', border: 'none',
            background: open ? '#0F172A' : 'linear-gradient(135deg, #F97316, #F59E0B)',
            color: 'white', fontSize: open ? '1.3rem' : '1.5rem',
            cursor: 'pointer',
            boxShadow: open ? '0 4px 20px rgba(15,23,42,0.35)' : '0 4px 20px rgba(249,115,22,0.5)',
            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}
        >
          {open ? '✕' : '🤖'}
          {pulse && !open && (
            <span style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: '2px solid #F97316', animation: 'pulseRing 1.8s ease-out infinite',
              pointerEvents: 'none',
            }} />
          )}
          {/* Badge showing saved question count */}
          {qHistory.length > 0 && !open && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: '#EF4444', color: 'white',
              borderRadius: '50%', width: 20, height: 20,
              fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'DM Sans, sans-serif',
              border: '2px solid white',
            }}>
              {qHistory.length > 9 ? '9+' : qHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Chat Panel ── */}
      <div style={{
        position: 'fixed', bottom: 100, right: 28, zIndex: 1999,
        width: 370, maxWidth: 'calc(100vw - 32px)',
        background: 'white', borderRadius: 22,
        boxShadow: '0 20px 60px rgba(15,23,42,0.18), 0 4px 20px rgba(249,115,22,0.08)',
        border: '1.5px solid #F1EDE8',
        display: 'flex', flexDirection: 'column',
        maxHeight: open ? 580 : 0,
        opacity: open ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
        pointerEvents: open ? 'all' : 'none',
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #F97316, #F59E0B)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              }}>🤖</div>
              <div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.92rem', color: 'white' }}>PathFinder AI</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#86EFAC', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)' }}>
                    {activeModel || 'Study Assistant • Online'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={tab === 'chat' ? clearChat : clearHistory} title={tab === 'chat' ? 'Clear chat' : 'Clear history'} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8,
              width: 30, height: 30, cursor: 'pointer', color: 'white',
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >🗑</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { key: 'chat',    label: '💬 Chat' },
              { key: 'history', label: `📋 Saved (${qHistory.length})` },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, padding: '5px 0', borderRadius: 8, border: 'none',
                background: tab === t.key ? 'white' : 'rgba(255,255,255,0.2)',
                color: tab === t.key ? '#F97316' : 'white',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.78rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* ── CHAT TAB ── */}
        {tab === 'chat' && (
          <>
            <div style={{
              flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
              display: 'flex', flexDirection: 'column', gap: 10,
              scrollbarWidth: 'thin', scrollbarColor: '#F1EDE8 transparent',
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeUp 0.2s ease',
                }}>
                  {msg.role === 'assistant' && (
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginRight: 7, marginTop: 2,
                      background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                    }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '78%', padding: '10px 13px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #F97316, #F59E0B)' : '#F8F4F0',
                    color: msg.role === 'user' ? 'white' : '#1E293B',
                    fontFamily: 'DM Sans, sans-serif', fontSize: '0.87rem', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                  }}>🤖</div>
                  <div style={{
                    padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
                    background: '#F8F4F0', display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: '#F97316',
                        display: 'inline-block',
                        animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SUGGESTIONS.slice(0, 4).map(s => (
                  <button key={s} onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ''))}
                    style={{
                      padding: '5px 11px', borderRadius: 50,
                      border: '1px solid #FED7AA', background: '#FFF4ED',
                      color: '#F97316', fontFamily: 'DM Sans, sans-serif',
                      fontWeight: 500, fontSize: '0.75rem', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFEDD5'; e.currentTarget.style.borderColor = '#F97316' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FFF4ED'; e.currentTarget.style.borderColor = '#FED7AA' }}
                  >{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '10px 12px 12px', borderTop: '1px solid #F1EDE8',
              display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0,
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Ask a study doubt… (Enter to send)"
                rows={1}
                style={{
                  flex: 1, padding: '10px 13px', borderRadius: 13,
                  border: '1.5px solid #E8E0D5', outline: 'none', resize: 'none',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: '#1E293B',
                  background: '#FAFAFA', lineHeight: 1.5, transition: 'border-color 0.2s',
                  maxHeight: 90, overflowY: 'auto',
                }}
                onFocus={e => e.target.style.borderColor = '#F97316'}
                onBlur={e  => e.target.style.borderColor = '#E8E0D5'}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: 40, height: 40, borderRadius: 12, border: 'none', flexShrink: 0,
                  background: input.trim() && !loading ? 'linear-gradient(135deg, #F97316, #F59E0B)' : '#F1EDE8',
                  color: input.trim() && !loading ? 'white' : '#94A3B8',
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  fontSize: '1rem', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: input.trim() && !loading ? '0 3px 10px rgba(249,115,22,0.35)' : 'none',
                }}
              >➤</button>
            </div>
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === 'history' && (
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: 8,
            scrollbarWidth: 'thin', scrollbarColor: '#F1EDE8 transparent',
          }}>
            {qHistory.length === 0 ? (
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '40px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
                <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, color: '#1E293B', marginBottom: 6 }}>
                  No saved questions yet
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#64748B' }}>
                  Ask a question in Chat and it will be saved here automatically
                </div>
                <button onClick={() => setTab('chat')} style={{
                  marginTop: 16, padding: '8px 20px', borderRadius: 10,
                  border: 'none', background: 'linear-gradient(135deg, #F97316, #F59E0B)',
                  color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                  fontSize: '0.82rem', cursor: 'pointer',
                }}>Go to Chat →</button>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: '#94A3B8', padding: '2px 4px' }}>
                  {qHistory.length} question{qHistory.length !== 1 ? 's' : ''} saved • Click to ask again
                </div>
                {qHistory.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q.text)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 12px',
                      borderRadius: 12, border: '1.5px solid #F1EDE8',
                      background: 'white', cursor: 'pointer',
                      transition: 'all 0.15s', animation: 'fadeUp 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#F97316'; e.currentTarget.style.background = '#FFF4ED' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#F1EDE8'; e.currentTarget.style.background = 'white' }}
                  >
                    <div style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
                      color: '#1E293B', fontWeight: 500, marginBottom: 4,
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {q.text}
                    </div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: '#94A3B8' }}>
                      🕐 {q.time} • {q.date}
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  )
}