'use client'
import { useEffect, useState, useCallback } from 'react'
import { getClientAutonomeAPI } from '../adapters/local'
import type { Abonnement, AbonnementInput } from '../types'

export function useAbonnements(clientId: string | null) {
  const api = getClientAutonomeAPI()
  const [abonnements, setAbonnements] = useState<Abonnement[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!clientId) return
    setLoading(true)
    try { setAbonnements(await api.listAbonnements(clientId)) } finally { setLoading(false) }
  }, [clientId, api])

  useEffect(() => { refresh() }, [refresh])

  const add = async (input: AbonnementInput) => {
    if (!clientId) throw new Error('clientId requis')
    const a = await api.addAbonnement(clientId, input)
    setAbonnements(prev => [...prev, a].sort((x, y) => x.date_fin.localeCompare(y.date_fin)))
    return a
  }
  const update = async (id: string, patch: Partial<AbonnementInput>) => {
    if (!clientId) throw new Error('clientId requis')
    const a = await api.updateAbonnement(clientId, id, patch)
    setAbonnements(prev => prev.map(x => x.id === id ? a : x))
    return a
  }
  const remove = async (id: string) => {
    if (!clientId) return
    await api.deleteAbonnement(clientId, id)
    setAbonnements(prev => prev.filter(a => a.id !== id))
  }

  return { abonnements, loading, add, update, remove, refresh }
}
