"use client";

import Link from "next/link";
import { ArrowLeft, Users, QrCode } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Mes clients</h1>
            <p className="text-xs text-gray-500">0 client enregistré</p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun client pour l'instant</h2>
        <p className="text-sm text-gray-500 max-w-xs mb-8">
          Vos clients apparaîtront ici après leur premier avis via votre QR code.
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          <QrCode className="w-4 h-4" />
          Voir mon QR code
        </Link>
      </div>
    </div>
  );
}
