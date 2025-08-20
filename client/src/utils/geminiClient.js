export const isGeminiEnabled = () => Boolean(import.meta.env.VITE_GEMINI_API_KEY)

export async function* askGeminiStream(question, contextData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    // Local fallback: yield a single response suggesting matches from context
    const text = buildLocalAnswer(question, contextData)
    yield text
    return
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}`
  const contextString = JSON.stringify(contextData, null, 2)

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `Answer only from the following data. If the answer is not present, respond with concise helpful guidance and suggest the closest matching events.
\nDATA:\n${contextString}\n\nQUESTION: ${question}`
          }]
        }]
      })
    })
  } catch (error) {
    console.error('❌ Network Error:', error)
    yield buildLocalAnswer(question, contextData)
    return
  }

  if (!response.ok || !response.body) {
    console.error('❌ Gemini API Error:', await response.text())
    yield buildLocalAnswer(question, contextData)
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')

    for (let line of lines) {
      if (line.trim().startsWith('data:')) {
        const json = line.replace('data: ', '')
        if (json === '[DONE]') return

        try {
          const parsed = JSON.parse(json)
          const text =
            parsed &&
            parsed.candidates &&
            parsed.candidates[0] &&
            parsed.candidates[0].content &&
            parsed.candidates[0].content.parts &&
            parsed.candidates[0].content.parts[0] &&
            parsed.candidates[0].content.parts[0].text

          if (text) yield text
        } catch (err) {
          console.error('Error parsing stream chunk:', err)
          continue
        }
      }
    }
  }
}

function buildLocalAnswer(question, contextData) {
  try {
    const q = String(question || '').toLowerCase()
    const items = Array.isArray(contextData) ? contextData : []
    const matches = items.filter(e =>
      (e.title || '').toLowerCase().includes(q) ||
      (e.genre || '').toLowerCase().includes(q) ||
      (e.location || '').toLowerCase().includes(q)
    ).slice(0, 5)
    if (matches.length) {
      return `I found some events that may help:\n${matches.map(m => `• ${m.title} — ${m.genre || ''} — ${m.date || ''} — ${m.location || ''}`).join('\n')}\n\nSay "book now" to go to bookings or ask for more details.`
    }
    return 'I can help you find matches, tickets, and prices. Try asking: "Cricket matches in Delhi", "Tickets under 1000", or "Show India vs Pakistan".'
  } catch {
    return 'Assistant is ready. Ask me about matches, tickets, or events.'
  }
}