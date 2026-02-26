import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

interface Protocol {
  id: string
  title: string
  branch: string
  trigger: string
  type: 'blog' | 'tool'
}

const Vault = () => {
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const token = searchParams.get('token') || localStorage.getItem('vaultToken')

    if (token) {
      fetchVaultContent(token)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const fetchVaultContent = async (token: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/vault/content?token=${token}`)
      const data = await res.json()

      if (res.ok) {
        setUser(data.user)
        setProtocols(data.protocols)
        localStorage.setItem('vaultToken', token)
      } else {
        localStorage.removeItem('vaultToken')
        setMessage({ type: 'error', text: data.error || 'Access expired or invalid' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setMessage(null)

    try {
      const res = await fetch('/api/vault/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Check your WhatsApp! We just sent your secure access link.' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send link' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' })
    } finally {
      setIsSending(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('vaultToken')
    setUser(null)
    setProtocols([])
  }

  if (isLoading) {
    return (
      <div className="bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sor7ed-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20 filter grayscale scale-105">
          <source src="/Intro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {user ? (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in">
            <div>
              <span className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.4em] block mb-4">// VAULT_ACCESS_GRANTED</span>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Welcome, <span className="text-sor7ed-yellow">{user.name}</span></h1>
              <p className="text-zinc-500 mt-4 font-light tracking-wide max-w-xl">Your secure repository of neural protocols and architectural frameworks.</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-8 py-3 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] border border-white/10 rounded-full transition-all"
            >
              De-authorize Session
            </button>
          </header>

          {protocols.length === 0 ? (
            <div className="stealth-card p-20 text-center animate-in zoom-in">
              <p className="text-zinc-500 mb-8 font-light tracking-widest uppercase text-xs">// Repository Empty</p>
              <p className="text-zinc-400 mb-8">You haven't requested any protocols yet. Explore our tools to get started.</p>
              <Link to="/tools" className="btn-primary inline-block">Explore Tools</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {protocols.map((protocol, i) => (
                <div key={protocol.id} className="stealth-card p-10 group animate-in fade-in slide-in-from-bottom-20" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-[0.3em]">// {protocol.branch}</span>
                    <div className="w-10 h-1 bg-sor7ed-yellow/20 rounded-full group-hover:bg-sor7ed-yellow/40 transition-colors"></div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-8 group-hover:text-sor7ed-yellow transition-colors uppercase tracking-tight leading-none">
                    {protocol.title}
                  </h3>
                  <div className="space-y-4">
                    <Link
                      to={protocol.type === 'blog' ? `/blog/${encodeURIComponent(protocol.title)}` : `/tools`}
                      className="block w-full text-center border border-white/10 bg-white/5 text-white py-4 rounded-xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                      View {protocol.type === 'blog' ? 'Analysis' : 'Tool'}
                    </Link>
                    <button
                      onClick={() => window.open(`https://wa.me/447360277713?text=${encodeURIComponent(protocol.trigger)}`, '_blank')}
                      className="block w-full text-center border border-sor7ed-yellow/20 text-sor7ed-yellow py-4 rounded-xl hover:bg-sor7ed-yellow/10 transition-all text-xs font-bold uppercase tracking-widest"
                    >
                      Re-deploy Protocol
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <section className="mt-40 animate-in fade-in delay-1000">
            <div className="stealth-card p-12 md:p-16 border-sor7ed-yellow/20 bg-gradient-to-br from-sor7ed-yellow/5 to-transparent">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-xl text-center md:text-left">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">The Evolution Continues.</h2>
                  <p className="text-zinc-400 font-light leading-relaxed">Our interactive lab tools are migrating into a high-performance neural dashboard. Beta access is active.</p>
                </div>
                <Link to="/tools" className="btn-primary whitespace-nowrap">Explore Beta Tools</Link>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-in zoom-in">
            <div className="text-center mb-16">
              <img src="/logo.png" className="w-48 mx-auto mb-12 opacity-80" alt="SOR7ED" />
              <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">The Vault</h1>
              <p className="text-zinc-600 font-mono-headline text-[10px] uppercase tracking-[0.2em]">Authentication Required</p>
            </div>

            <div className="stealth-card p-10">
              <form onSubmit={handleRequestAccess} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-mono-headline text-zinc-500 mb-3 uppercase tracking-widest">Registry ID (Email)</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow focus:outline-none transition-all font-light"
                    placeholder="Enter registered email..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-white text-black font-black py-5 rounded-xl hover:bg-sor7ed-yellow transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                >
                  {isSending ? 'Transmitting...' : 'Request Access Link'}
                </button>

                {message && (
                  <div className={`p-4 rounded-xl text-[10px] font-mono-headline uppercase tracking-widest text-center ${message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    {message.text}
                  </div>
                )}
              </form>
            </div>

            <div className="mt-24">
              <p className="text-[10px] font-mono-headline text-zinc-700 uppercase tracking-widest text-center mb-8">// REGISTRY_PREVIEW</p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { title: 'Dopamine Fasting V4', branch: 'Mind', status: 'Locked' },
                  { title: 'Impulse Shield', branch: 'Wealth', status: 'Locked' },
                  { title: 'Circadian Sync', branch: 'Body', status: 'Locked' }
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl opacity-40 blur-[1px]">
                    <div>
                      <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{p.branch}</p>
                      <p className="text-sm font-bold uppercase tracking-tight">{p.title}</p>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-800 border border-zinc-800 px-2 py-1 rounded uppercase tracking-[0.2em]">{p.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-[10px] font-sans text-zinc-600">
                  Once authenticated, these protocols are deployed directly to your WhatsApp. <br />
                  Everything is searchable and instant. No apps.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center space-y-4">
              <p className="text-[10px] font-mono-headline text-zinc-700 uppercase tracking-widest">
                <Link to="/" className="text-zinc-500 hover:text-white transition-colors">Return to Surface</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vault
