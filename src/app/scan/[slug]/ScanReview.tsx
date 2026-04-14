'use client'
import { useState } from 'react'

const EMOJIS = [
  { emoji: '😍', label: 'Excellent' },
  { emoji: '😊', label: 'Bien' },
  { emoji: '👍', label: 'Correct' },
  { emoji: '😐', label: 'Moyen' },
  { emoji: '😕', label: 'Décevant' },
  { emoji: '😤', label: 'Mauvais' },
]

export default function ScanReview({ commerce }: { commerce: any }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (done) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-2xl font-bold text-center mb-2">Merci !</h1>
      <p className="text-gray-500 text-center">Votre avis a été enregistré.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{commerce.emoji || '🏪'}</div>
        <h1 className="text-2xl font-bold">{commerce.nom}</h1>
        <p className="text-gray-400 text-sm mt-1">{commerce.categorie}</p>
      </div>
      <p className="text-center text-lg font-medium mb-6">
        Comment s'est passée votre visite ?
      </p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {EMOJIS.map(({ emoji, label }) => (
          <button
            key={emoji}
            onClick={() => setSelected(emoji)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
              selected === emoji
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-100 bg-gray-50'
            }`}
          >
            <span className="text-4xl">{emoji}</span>
            <span className="text-xs text-gray-500 mt-1">{label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => selected && setDone(true)}
        disabled={!selected}
        className={`w-full py-4 rounded-2xl text-white font-semibold text-lg transition-all ${
          selected ? 'bg-blue-600 active:scale-95' : 'bg-gray-200 text-gray-400'
        }`}
      >
        Envoyer mon avis
      </button>
      <p className="text-center text-sm text-gray-400 mt-6">
        Aucun compte requis · 100% anonyme
      </p>
    </div>
  )
}
