"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("romain.collin@gmail.com");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "https://flashquality.vercel.app/dashboard" }
    });
    setSent(true);
    setLoading(false);
  };

  if (sent) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="text-5xl mb-4">📬</div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Vérifie ta boîte mail</h1>
      <p className="text-sm text-gray-500">Un lien de connexion a été envoyé à <strong>{email}</strong></p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">FlashQuality</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Espace professionnel</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
            {loading ? "Envoi…" : "Recevoir le lien de connexion"}
          </button>
        </div>
      </div>
    </div>
  );
}
