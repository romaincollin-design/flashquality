'use client'
import { useEffect, useState, useCallback } from 'react'
import { getClientAutonomeAPI } from '../adapters/local'
import type { Depense, DepenseInput } from '../types'

export function useDepenses(clientId: string | null) {
  const api = getClientAutonomeAPI()
  const [depenses, setDepenses] = useState<Depense[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!clientId) return
    setLoading(true)
    try { setDepenses(await api.listDepenses(clientId)) } finally { setLoading(false) }
  }, [clientId, api])

  useEffect(() => { refresh() }, [refresh])

  const add = async (input: DepenseInput) => {
    if (!clientId) throw new Error('clientId requis')
    const d = await api.addDepense(clientId, input)
    setDepenses(prev => [d, ...prev])
    return d
  }
  const remove = async (id: string) => {
    if (!clientId) return
    await api.deleteDepense(clientId, id)
    setDepenses(prev => prev.filter(d => d.id !== id))
  }

  return { depenses, loading, add, remove, refresh }
}
