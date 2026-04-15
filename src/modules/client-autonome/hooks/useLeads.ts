'use client'
import { useEffect, useState, useCallback } from 'react'
import { getClientAutonomeAPI } from '../adapters/local'
import type { Lead, LeadInput } from '../types'

export function useLeads(clientId: string | null) {
  const api = getClientAutonomeAPI()
  const [leads, setLeads] = useState<Lead[]>([])

  const refresh = useCallback(async () => {
    if (!clientId) return
    setLeads(await api.listLeads(clientId))
  }, [clientId, api])

  useEffect(() => { refresh() }, [refresh])

  const create = async (input: LeadInput) => {
    if (!clientId) throw new Error('clientId requis')
    const l = await api.createLead(clientId, input)
    setLeads(prev => [l, ...prev])
    return l
  }

  return { leads, create, refresh }
}
