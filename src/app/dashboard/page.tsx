"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NAV = [
  { id:"overview", label:"Vue d'ensemble", icon:"📊" },
  { id:"clients",  label:"Clients",        icon:"👥", href:"/dashboard/clients" },
  { id:"offres",   label:"Offres flash",   icon:"⚡", href:"/dashboard/offres" },
  { id:"avis",     label:"Avis reçus",     icon:"💬" },
  { id:"qr",       label:"QR Code",        icon:"📱" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [pro, setPro] = useState<any>(null);
  const [stats, setStats] = useState({ total:0, avg:0, today:0 });
  const [avis, setAvis] = useState<any[]>([]);
  const [panel, setPanel] = useState("overview");

  useEffect(() => {
    (async () => {
      const { data:{ user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data:pro } = await supabase.from("pros").select("*").eq("email", user.email).single();
      if (!pro) return;
      setPro(pro);
      const { data:reviews } = await supabase.from("reviews").select("*").eq("pro_slug", pro.slug).order("created_at", { ascending:false });
      if (reviews?.length) {
        const avg = reviews.reduce((s:number,r:any) => s+r.rating, 0) / reviews.length;
        const today = reviews.filter((r:any) => new Date(r.created_at).toDateString() === new Date().toDateString()).length;
        setStats({ total:reviews.length, avg:Math.round(avg*10)/10, today });
        setAvis(reviews.slice(0,5));
      }
    })();
  }, []);

  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };
  const EMOJI = ["","👎","😐","🙂","👍","😍"];
  const qrUrl = pro ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://flashquality.vercel.app/scan/${pro.slug}`)}` : "";

  if (!pro) return (
    <div style={{ minHeight:"100vh", background:"#F0F4F9", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid #00A896", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"Calibri,'Trebuchet MS',sans-serif", background:"#F0F4F9" }}>
      <style>{`
        .sb-item{display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:700;color:rgba(255,255,255,.55);transition:all .18s;border:none;background:transparent;width:100%;text-align:left;}
        .sb-item:hover{background:rgba(255,255,255,.08);color:#fff;}
        .sb-item.on{background:rgba(0,168,150,.18);color:#00A896;}
        .kpi{background:#fff;border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(26,58,107,.07);}
        .avis-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #E2E8F0;}
        .avis-row:last-child{border-bottom:none;}
      `}</style>

      {/* Sidebar */}
      <div style={{ width:224, flexShrink:0, background:"#1A3A6B", display:"flex", flexDirection:"column", minHeight:"100vh", padding:"0 12px 24px" }}>
        <div style={{ padding:"20px 4px 24px", fontSize:18, fontWeight:900, color:"#fff", letterSpacing:"-.01em" }}>
          Flash<span style={{color:"#00A896"}}>Quality</span>
        </div>

        {/* Pro card */}
        <div style={{ background:"linear-gradient(135deg,#00A896,#007F72)", borderRadius:12, padding:"14px 16px", marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,.7)", marginBottom:4 }}>ESPACE PRO</div>
          <div style={{ fontSize:15, fontWeight:900, color:"#fff" }}>{pro.nom || pro.name}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.7)", marginTop:2 }}>{pro.categorie}</div>
        </div>

        {/* Nav */}
        <nav style={{ display:"flex", flexDirection:"column", gap:2, flex:1 }}>
          {NAV.map(n => (
            n.href ? (
              <Link key={n.id} href={n.href} style={{ textDecoration:"none" }}>
                <button className={`sb-item ${panel===n.id?"on":""}`} onClick={() => setPanel(n.id)}>
                  <span style={{fontSize:16}}>{n.icon}</span>{n.label}
                </button>
              </Link>
            ) : (
              <button key={n.id} className={`sb-item ${panel===n.id?"on":""}`} onClick={() => setPanel(n.id)}>
                <span style={{fontSize:16}}>{n.icon}</span>{n.label}
              </button>
            )
          ))}
        </nav>

        <button onClick={logout} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 16px", borderRadius:12, border:"none", background:"rgba(255,255,255,.06)", color:"rgba(255,255,255,.4)", fontSize:13, fontWeight:700, cursor:"pointer", width:"100%" }}>
          ↪ Déconnexion
        </button>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflow:"auto" }}>
        {/* Header */}
        <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"18px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 1px 0 #E2E8F0" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:"#1A3A6B", lineHeight:1 }}>
              {NAV.find(n=>n.id===panel)?.icon} {NAV.find(n=>n.id===panel)?.label}
            </div>
            <div style={{ fontSize:13, color:"#94A3B8", marginTop:4, fontWeight:600 }}>
              {new Date().toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"})}
            </div>
          </div>
          <div style={{ width:38, height:38, borderRadius:12, background:"linear-gradient(135deg,#1A3A6B,#00A896)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#fff" }}>
            {(pro.nom||pro.name||"?").split(" ").map((n:string)=>n[0]).join("").slice(0,2).toUpperCase()}
          </div>
        </div>

        <div style={{ padding:28 }}>

          {/* KPIs */}
          {panel === "overview" && (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
                <div className="kpi">
                  <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Avis total</div>
                  <div style={{ fontSize:36, fontWeight:900, color:"#1A3A6B" }}>{stats.total}</div>
                </div>
                <div className="kpi">
                  <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Note moyenne</div>
                  <div style={{ fontSize:36, fontWeight:900, color:"#1A3A6B" }}>
                    {stats.total > 0 ? `${EMOJI[Math.round(stats.avg)]} ${stats.avg}` : "—"}
                  </div>
                </div>
                <div className="kpi">
                  <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>Aujourd'hui</div>
                  <div style={{ fontSize:36, fontWeight:900, color:"#00A896" }}>{stats.today}</div>
                </div>
              </div>

              {/* Recent avis */}
              <div className="kpi">
                <div style={{ fontSize:15, fontWeight:900, color:"#1A3A6B", marginBottom:16 }}>Derniers avis</div>
                {avis.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"32px 0", color:"#94A3B8", fontSize:14 }}>
                    Aucun avis pour l'instant — partagez votre QR code !
                  </div>
                ) : avis.map((a:any) => (
                  <div key={a.id} className="avis-row">
                    <span style={{fontSize:24}}>{EMOJI[a.rating]}</span>
                    <div>
                      <div style={{fontSize:13, fontWeight:700, color:"#1A3A6B"}}>Note {a.rating}/5</div>
                      <div style={{fontSize:11, color:"#94A3B8", fontWeight:600}}>
                        {new Date(a.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code */}
          {panel === "qr" && (
            <div className="kpi" style={{ maxWidth:400, textAlign:"center" }}>
              <div style={{ fontSize:15, fontWeight:900, color:"#1A3A6B", marginBottom:20 }}>Mon QR Code</div>
              {qrUrl && <img src={qrUrl} alt="QR" style={{ width:220, height:220, borderRadius:12, marginBottom:16 }} />}
              <div style={{ fontSize:13, color:"#94A3B8", fontWeight:600, marginBottom:16 }}>
                flashquality.vercel.app/scan/{pro.slug}
              </div>
              <button onClick={() => navigator.clipboard.writeText(`https://flashquality.vercel.app/scan/${pro.slug}`)}
                style={{ background:"#1A3A6B", color:"#fff", border:"none", borderRadius:12, padding:"12px 24px", fontSize:14, fontWeight:800, cursor:"pointer" }}>
                Copier le lien
              </button>
            </div>
          )}

          {panel === "avis" && (
            <div className="kpi">
              <div style={{ fontSize:15, fontWeight:900, color:"#1A3A6B", marginBottom:16 }}>Tous les avis ({stats.total})</div>
              {avis.length === 0 ? (
                <div style={{ textAlign:"center", padding:"32px 0", color:"#94A3B8" }}>Aucun avis reçu</div>
              ) : avis.map((a:any) => (
                <div key={a.id} className="avis-row">
                  <span style={{fontSize:28}}>{EMOJI[a.rating]}</span>
                  <div>
                    <div style={{fontSize:13, fontWeight:700, color:"#1A3A6B"}}>Note {a.rating}/5</div>
                    <div style={{fontSize:11, color:"#94A3B8", fontWeight:600}}>{new Date(a.created_at).toLocaleDateString("fr-FR", {day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
