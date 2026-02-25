interface VaultUser {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
}

interface Protocol {
  id: string
  title: string
  branch: string
  trigger: string
  template: string
}

const Vault = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<VaultUser | null>(null)
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // existing useEffect + fetchVaultContent logic stays exactly the same
  // (token handling, etc.)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setMessage(null)

    try {
      const res = await fetch('/api/vault/send-link-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      })

      const data = await res.json().catch(() => ({} as { error?: string }))

      if (res.ok) {
        setMessage({ type: 'success', text: 'Magic link sent to WhatsApp!' })
      } else {
        setMessage({ type: 'error', text: data?.error || 'Number not found' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Try again.' })
    } finally {
      setIsSending(false)
    }
  }

  // loading spinner unchanged

  return (
    <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
      {/* background video unchanged */}

      {user ? (
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.4em] block mb-4">// VAULT_ACCESS_GRANTED</span>
              <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                Welcome, <span className="text-sor7ed-yellow">{`${user.firstName} ${user.lastName}`}</span>
              </h1>
              <p className="text-zinc-600 mt-2 text-sm font-mono-headline uppercase tracking-wide">
                {user.phoneNumber}
              </p>
              <p className="text-zinc-500 mt-4 font-light tracking-wide max-w-xl">
                Your secure repository of neural protocols.
              </p>
            </div>
            <button onClick={handleLogout} className="...">
              De-authorize
            </button>
          </header>

          {/* protocols grid unchanged */}
        </div>
      ) : (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-in zoom-in">
            <div className="text-center mb-16">
              <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">The Vault</h1>
              <p className="text-zinc-600 font-mono-headline text-[10px] uppercase tracking-[0.2em]">
                WhatsApp Verification Required
              </p>
            </div>

            <div className="stealth-card p-10">
              <form onSubmit={handleLogin} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-mono-headline text-zinc-500 mb-3 uppercase tracking-widest">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      if (message) setMessage(null)
                    }}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow focus:outline-none transition-all font-light"
                    placeholder="+447360277713"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending || !phoneNumber.trim()}
                  className="w-full bg-white text-black font-black py-5 rounded-xl hover:bg-sor7ed-yellow transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                >
                  {isSending ? 'Sending...' : 'Send Magic Link'}
                </button>

                {message && (
                  <div className={`p-4 rounded-xl text-[10px] font-mono-headline uppercase tracking-widest text-center ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {message.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// POST /api/vault/send-link-whatsapp
app.post('/api/vault/send-link-whatsapp', async (req, res) => {
  const { phoneNumber } = req.body
  
  // 1. Find/lookup user by phone number in your DB
  const user = await db.users.findOne({ phoneNumber: phoneNumber.trim() })
  if (!user) {
    return res.status(404).json({ error: 'Number not registered' })
  }
  
  // 2. Generate short-lived token (same as your current flow)
  const token = generateToken({ userId: user.id })
  
  // 3. Send WhatsApp message with magic link
  await sendWhatsAppMessage(phoneNumber, {
    message: `🔐 Vault Access: ${yourDomain}/vault?token=${token}`
  })
  
  res.json({ success: true })
})
