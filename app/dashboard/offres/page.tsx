"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Zap, Clock, Tag, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";

type Offre = { id: string; titre: string; description: string; reduction: string; validite: string; active: boolean; vues: number; };

export default function OffresPage() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [slug, setSlug] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: "", description: "", reduction: "", validite: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: pro } = await supabase.from("pros").select("slug").eq("email", user.email).single();
      if (!pro) return;
      setSlug(pro.slug);
      const { data } = await supabase.from("offres").select("*").eq("pro_slug", pro.slug).order("created_at", { ascending: false });
      setOffres(data || []);
    }
    load();
  }, []);

  const toggleActive = async (offre: Offre) => {
    await supabase.from("offres").update({ active: !offre.active }).eq("id", offre.id);
    setOffres(prev => prev.map(o => o.id === offre.id ? { ...o, active: !o.active } : o));
  };

  const deleteOffre = async (id: string) => {
    await supabase.from("offres").delete().eq("id", id);
    setOffres(prev => prev.filter(o => o.id !== id));
  };

  const handleCreate = async () => {
    if (!form.titre || !form.description || !form.reduction || !form.validite) { setError("Tous les champs sont obligatoires."); return; }
    const { data, error: err } = await supabase.from("offres").insert({ ...form, pro_slug: slug }).select().single();
    if (err || !data) { setError("Erreur lors de la création."); return; }
    setOffres(prev => [data, ...prev]);
    setForm({ titre: "", description: "", reduction: "", validite: "" });
    setError("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Offres flash</h1>
              <p className="text-xs text-gray-500">{offres.filter(o => o.active).length} active(s)</p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />Créer
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">Les offres s'affichent après chaque avis via votre QR code.</p>
        </div>

        {offres.length === 0 && (
          <div className="text-center py-16">
            <Zap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucune offre pour l'instant</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-blue-600 text-sm font-medium">Créer ma première offre →</button>
          </div>
        )}

        {offres.map((offre) => (
          <div key={offre.id} className={`bg-white rounded-2xl p-4 border transition-all ${offre.active ? "border-blue-200 shadow-sm" : "border-gray-100 opacity-60"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">{offre.reduction}</span>
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{offre.titre}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">{offre.description}</p>
                <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" />{offre.validite}</span>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button onClick={() => toggleActive(offre)} className="text-gray-400 hover:text-blue-500 transition-colors">
                  {offre.active ? <ToggleRight className="w-7 h-7 text-blue-600" /> : <ToggleLeft className="w-7 h-7" />}
                </button>
                <button onClick={() => deleteOffre(offre.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Nouvelle offre flash</h2>
              <button onClick={() => { setShowModal(false); setError(""); }} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Titre (ex: Happy Hour café)" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Réduction (ex: -20%)" value={form.reduction} onChange={e => setForm({ ...form, reduction: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Validité (ex: Ce soir)" value={form.validite} onChange={e => setForm({ ...form, validite: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <button onClick={handleCreate} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">⚡ Publier l'offre</button>
          </div>
        </div>
      )}
    </div>
  );
}
