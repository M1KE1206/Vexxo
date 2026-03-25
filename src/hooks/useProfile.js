// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data) setProfile(data)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [user])

  /**
   * Optimistic update: state direct bijwerken, dan Supabase call.
   * Bij fout: rollback naar de oude waarde en gooi een error.
   */
  const updateField = useCallback(async (key, value) => {
    if (!user) throw new Error('Not authenticated')
    if (!profile) throw new Error('Profile not loaded')

    let prev
    setProfile(p => {
      prev = p?.[key] ?? null
      return { ...p, [key]: value }
    })

    const { error } = await supabase
      .from('profiles')
      .update({ [key]: value })
      .eq('id', user.id)

    if (error) {
      setProfile(p => ({ ...p, [key]: prev }))
      throw error
    }
  }, [user, profile])

  /**
   * Valideer, upload via upsert (geen aparte remove nodig), sla avatar_url op.
   * Gooit een Error met message 'size' of 'type' bij validatiefouten.
   */
  const uploadAvatar = useCallback(async (file) => {
    if (!user) throw new Error('Not authenticated')
    if (file.size > MAX_SIZE) throw new Error('size')
    if (!ALLOWED_TYPES.includes(file.type)) throw new Error('type')

    const path = `${user.id}/avatar`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { contentType: file.type, upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    // Cache-bust zodat de browser de nieuwe foto laadt
    const avatarUrl = `${publicUrl}?t=${Date.now()}`
    await updateField('avatar_url', avatarUrl)
    return avatarUrl
  }, [user, updateField])

  return { profile, loading, updateField, uploadAvatar }
}
