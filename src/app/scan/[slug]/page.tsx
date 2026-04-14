"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const RATINGS = [
  { value: 5, emoji: "😍", label: "Excellent" },
  { value: 4, emoji: "👍", label: "Bien" },
  { value: 3, emoji: "🙂", label: "Correct" },
  { value: 2, emoji: "😐", label: "Moyen" },
  { value: 1, emoji: "👎", label: "Déçu" },
];

export default function ScanPage() {
  const { slug } = useParams<{ slug: string }>();
  const [pro, setPro] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.from("pros").select("*").eq("slug", slug).single().then(({ data }) => setPro(data));
  }, [slug]);

  const handleRate = async (rating: number) => {
    setSelected(rating);
    await supabase.from("reviews").insert({ pro_slug: slug, rating });
    setTimeout(() => setDone(true), 400);
  };

  if (!pro) return (
    <div style={{ minHeight:"100vh", background:"#0A1628", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid #00A896", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (done) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(170deg,#071426 0%,#1A3A6B 65%,#0d2040 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", textAlign:"center" }}>
      <div style={{ fontSize:72, marginBottom:16, animation:"pop .4s ease" }}>{RATINGS.find(r => r.value === selected)?.emoji}</div>
      <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", marginBottom:8 }}>Merci !</h1>
      <p style={{ fontSize:15, color:"rgba(255,255,255,.55)", fontWeight:600 }}>Votre avis a été transmis à <strong style={{color:"#00A896"}}>{pro.nom || pro.name}</strong>.</p>
      <style>{`@keyframes pop{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );

  const initiales = (pro.nom || pro.name || "?").split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase();

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(170deg,#071426 0%,#1A3A6B 65%,#0d2040 100%)", display:"flex", flexDirection:"column", alignItems:"center", fontFamily:"Calibri,'Trebuchet MS',sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,168,150,.3)}50%{box-shadow:0 0 44px rgba(0,168,150,.65)}}
        .rating-btn{background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.15);border-radius:20px;padding:18px 12px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:8px;}
        .rating-btn:hover{background:rgba(0,168,150,.2);border-color:#00A896;transform:translateY(-4px);}
        .rating-btn:active{transform:scale(.95);}
      `}</style>

      <div style={{ width:"100%", maxWidth:430, padding:"28px 22px", animation:"fadeUp .4s ease" }}>
        {/* Logo */}
        <div style={{ fontSize:15, fontWeight:900, color:"#fff", marginBottom:32 }}>
          Flash<span style={{color:"#00A896"}}>Quality</span>
        </div>

        {/* Merchant card */}
        <div style={{ background:"rgba(255,255,255,.1)", border:"1.5px solid rgba(255,255,255,.18)", borderRadius:20, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, backdropFilter:"blur(14px)", marginBottom:12 }}>
          <div style={{ width:54, height:54, borderRadius:16, background:"linear-gradient(135deg,#00A896,#007F72)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:900, color:"#fff", flexShrink:0, animation:"glow 2.5s ease-in-out infinite" }}>
            {pro.emoji || initiales}
          </div>
          <div>
            <div style={{ fontSize:17, fontWeight:900, color:"#fff" }}>{pro.nom || pro.name}</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", fontWeight:600, marginTop:2 }}>{pro.categorie}</div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(0,168,150,.2)", border:"1px solid rgba(0,168,150,.4)", borderRadius:100, padding:"2px 8px", fontSize:10, fontWeight:700, color:"#00A896", marginTop:5 }}>
              ✦ Partenaire vérifié
            </div>
          </div>
        </div>

        {/* Exchange pill */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"10px 0", position:"relative" }}>
          <div style={{ position:"absolute", left:0, right:0, top:"50%", height:1, background:"rgba(255,255,255,.08)" }} />
          <div style={{ background:"linear-gradient(90deg,#007F72,#00A896)", borderRadius:100, padding:"6px 20px", fontSize:11, fontWeight:800, color:"#fff", zIndex:1, boxShadow:"0 4px 16px rgba(0,168,150,.35)" }}>
            Votre avis → Offres exclusives
          </div>
        </div>

        {/* Client placeholder */}
        <div style={{ background:"rgba(255,255,255,.05)", border:"1.5px dashed rgba(255,255,255,.18)", borderRadius:20, padding:"16px 20px", display:"flex", alignItems:"center", gap:14, marginBottom:32 }}>
          <div style={{ width:54, height:54, borderRadius:16, background:"rgba(255,255,255,.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0, border:"1.5px dashed rgba(255,255,255,.15)" }}>👤</div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:"rgba(255,255,255,.55)" }}>Vous</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", fontWeight:600, marginTop:2 }}>Comment s'est passée votre visite ?</div>
          </div>
        </div>

        {/* Rating buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:8, marginBottom:24 }}>
          {RATINGS.map((r) => (
            <button key={r.value} className="rating-btn" onClick={() => handleRate(r.value)}
              style={{ opacity: selected && selected !== r.value ? 0.4 : 1 }}>
              <span style={{ fontSize:32 }}>{r.emoji}</span>
              <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.6)" }}>{r.label}</span>
            </button>
          ))}
        </div>

        <div style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,.2)", fontWeight:600 }}>
          Propulsé par FlashQuality ✦
        </div>
      </div>
    </div>
  );
}
