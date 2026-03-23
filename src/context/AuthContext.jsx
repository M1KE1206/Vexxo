import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Module-level dispatch registratie (bridge naar ModalContext).
// AppDispatcher in App.jsx registreert de echte functie na mount.
// Bij HMR in dev kan de fn even null zijn — dit is een bekende edge case.
let _dispatchFn = null
export function _registerDispatch(fn) { _dispatchFn = fn }

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [session, setSession]   = useState(null)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    // Initiële sessie check (synchroon, vóór OAuth redirect fragment verwerkt is)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    // Luistert naar alle auth state changes, inclusief OAuth redirect na paginareload
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session) {
        // Verwerk pending action — overleeft OAuth redirect via sessionStorage
        const raw = sessionStorage.getItem('pendingAction')
        if (raw) {
          sessionStorage.removeItem('pendingAction')
          try {
            const payload = JSON.parse(raw)
            setTimeout(() => _dispatchFn?.(payload), 0)
          } catch {
            // Ongeldige JSON — negeer
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Gate een CTA actie achter auth.
   * payload: { action: string, data?: any }
   * Actieve sessie → dispatch direct.
   * Geen sessie → sessionStorage + open AuthModal.
   */
  const requireAuth = useCallback((payload) => {
    if (session) {
      _dispatchFn?.(payload)
    } else {
      sessionStorage.setItem('pendingAction', JSON.stringify(payload))
      setAuthOpen(true)
    }
  }, [session])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, session, signOut, requireAuth, authOpen, setAuthOpen }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
