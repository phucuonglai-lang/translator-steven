import { useState } from 'react'
import { Copy, Check, Languages, Loader2 } from 'lucide-react'

function App() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<{ vietnamese: string, english: string, spanish_cuba: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedType, setCopiedType] = useState<string | null>(null)

  const handleTranslate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:3000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setResults(data)
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  return (
    <div className="container">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
          <Languages size={32} color="#60a5fa" />
          <h1>Steven Translator v2.5</h1>
        </div>
        <p className="status-msg">Dành cho gia đình tại Cuba • Ổn định</p>
      </header>

      <div className="input-group">
        <textarea
          placeholder="Nhập tiếng Việt tại đây..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleTranslate()
            }
          }}
        />
        <button 
          className="translate-btn" 
          onClick={handleTranslate}
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader2 className="animate-spin" /> Đang dịch...
            </div>
          ) : 'DỊCH NGAY'}
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {results && (
        <div className="results">
          <div className="result-card">
            <span className="label">Tiếng Việt 🇻🇳</span>
            <p className="output-text">{results.vietnamese}</p>
            <button className="copy-btn" onClick={() => copyToClipboard(results.vietnamese, 'vi')}>
              {copiedType === 'vi' ? <Check size={24} color="#10b981" /> : <Copy size={24} />}
            </button>
          </div>

          <div className="result-card">
            <span className="label">English 🇺🇸</span>
            <p className="output-text">{results.english}</p>
            <button className="copy-btn" onClick={() => copyToClipboard(results.english, 'en')}>
              {copiedType === 'en' ? <Check size={24} color="#10b981" /> : <Copy size={24} />}
            </button>
          </div>

          <div className="result-card">
            <span className="label">Spanish (Cuba 🇨🇺)</span>
            <p className="output-text">{results.spanish_cuba}</p>
            <button className="copy-btn" onClick={() => copyToClipboard(results.spanish_cuba, 'es')}>
              {copiedType === 'es' ? <Check size={24} color="#10b981" /> : <Copy size={24} />}
            </button>
          </div>
        </div>
      )}

      <footer style={{ marginTop: 'auto', paddingTop: '40px', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        <p>Phiên bản dành cho người thân • AI Gemini 2.5 Flash Lite</p>
      </footer>
    </div>
  )
}

export default App
