"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const NAV = [
  {id:"dash",  icon:"📊", label:"Vue d'ensemble"},
  {id:"clients",icon:"👥",label:"Clients & XP",    badge:"247",bc:"b-teal"},
  {id:"offres", icon:"⚡", label:"Offres flash"},
  {id:"test",   icon:"🎖️",label:"Test produit",    badge:"💎",bc:"",bs:{background:"#5B21B6",color:"#fff"}},
  {id:"tombola",icon:"🎰",label:"Tombola",          badge:"J-18",bc:"b-orange"},
  {id:"qr",     icon:"📲",label:"QR Code & Events"},
  {id:"exp",    icon:"🌟",label:"Expériences",      badge:"Ext.",bc:"b-orange"},
  {id:"messages",icon:"💬",label:"Messages",        badge:"3",bc:"b-teal"},
  {id:"agenda", icon:"📅",label:"Agenda"},
  {id:"analytics",icon:"📈",label:"Analytiques"},
  {id:"reviews",icon:"⭐",label:"Avis reçus",       badge:"305",bc:"b-teal"},
  {id:"settings",icon:"⚙️",label:"Paramètres"},
];

const CLIENTS = [
  {n:"Sophie M.",e:"s.martin@demo.fq",xp:1240,lvl:"lv-gold",ll:"🥇 Gold",vis:"Il y a 2j",ca:"312€",ok:true},
  {n:"Lucas B.", e:"l.bernard@demo.fq",xp:980, lvl:"lv-plat",ll:"💠 Platine",vis:"Il y a 1j",ca:"42€",ok:true},
  {n:"Thomas R.",e:"06 XX XX XX XX",  xp:840, lvl:"lv-silv",ll:"🥈 Silver",vis:"Il y a 5j",ca:"185€",ok:false},
  {n:"Claire M.",e:"c.moreau@demo.fq",xp:720, lvl:"lv-gold",ll:"🥇 Gold",vis:"Il y a 2 mois",ca:"134€",ok:false},
  {n:"Marie L.", e:"m.leroy@demo.fq", xp:410, lvl:"lv-bron",ll:"🥉 Bronze",vis:"Il y a 3 sem.",ca:"78€",ok:false},
];

const EMOJI:any = {5:"😍",4:"👍",3:"🙂",2:"😐",1:"👎"};

export default function Dashboard() {
  const router = useRouter();
  const [pro, setPro] = useState<any>(null);
  const [panel, setPanel] = useState("dash");
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState({total:0,avg:0,today:0});
  const [offresList, setOffresList] = useState<any[]>([]);
  const [showOffer, setShowOffer] = useState(false);
  const [newOffer, setNewOffer] = useState({titre:"",description:"",reduction:"",validite:""});
  const [chatSel, setChatSel] = useState(0);

  useEffect(() => {
    (async()=>{
      const {data:{user}} = await sb.auth.getUser();
      if(!user){router.push("/login");return;}
      const {data:p} = await sb.from("pros").select("*").eq("user_id",user.id).single();
      if(!p){router.push("/login");return;}
      setPro(p);
      const {data:rv} = await sb.from("reviews").select("*").eq("pro_slug",p.slug).order("created_at",{ascending:false});
      if(rv?.length){
        const avg = rv.reduce((s:number,r:any)=>s+r.rating,0)/rv.length;
        const today = rv.filter((r:any)=>new Date(r.created_at).toDateString()===new Date().toDateString()).length;
        setStats({total:rv.length,avg:Math.round(avg*10)/10,today});
        setReviews(rv);
      }
      const {data:off} = await sb.from("offres").select("*").eq("pro_slug",p.slug).order("created_at",{ascending:false});
      setOffresList(off||[]);
    })();
  },[]);

  const logout = async()=>{await sb.auth.signOut();router.push("/login");};
  const initiales = (s:string)=>s.split(" ").map((w:string)=>w[0]).join("").slice(0,2).toUpperCase();
  const qrUrl = pro?`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("https://flashquality.vercel.app/scan/"+pro.slug)}`:"";

  const createOffer = async()=>{
    if(!newOffer.titre)return;
    const {data} = await sb.from("offres").insert({...newOffer,pro_slug:pro.slug,active:true}).select().single();
    if(data)setOffresList(p=>[data,...p]);
    setShowOffer(false);setNewOffer({titre:"",description:"",reduction:"",validite:""});
  };

  const toggleOffer = async(o:any)=>{
    await sb.from("offres").update({active:!o.active}).eq("id",o.id);
    setOffresList(p=>p.map((x:any)=>x.id===o.id?{...x,active:!x.active}:x));
  };

  const deleteOffer = async(id:string)=>{
    await sb.from("offres").delete().eq("id",id);
    setOffresList(p=>p.filter((x:any)=>x.id!==id));
  };

  const CHATS = [
    {n:"Sophie M.",sub:"🥇 Gold · 1240 XP",av:"SM",bg:"#FEF6DC",col:"#1A3A6B",msgs:[
      {from:"c",txt:"Bonjour ! Je voulais vous remercier pour les croissants d'hier, vraiment excellents !",t:"9h12"},
      {from:"p",txt:"Merci beaucoup Sophie ! C'est toujours un plaisir. On a une nouvelle offre ce week-end, vous serez la première informée 😊",t:"9h45"},
      {from:"c",txt:"Super ! Avec plaisir, je viendrai sûrement samedi.",t:"10h02"},
    ]},
    {n:"Thomas R.",sub:"🥈 Silver · 840 XP",av:"TR",bg:"#E8EDF7",col:"#1A3A6B",msgs:[
      {from:"c",txt:"Bonjour, vous avez encore du pain de seigle ?",t:"11h30"},
      {from:"p",txt:"Bonjour Thomas ! Oui, il nous en reste. Venez avant 17h.",t:"11h42"},
    ]},
    {n:"Marie L.",sub:"🥉 Bronze · 410 XP",av:"ML",bg:"#DFF6F3",col:"#007F72",msgs:[
      {from:"c",txt:"Est-ce que vous faites des commandes spéciales pour les anniversaires ?",t:"Hier"},
    ]},
  ];

  if(!pro) return (
    <div style={{minHeight:"100vh",background:"#F0F4F9",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:40,height:40,border:"3px solid #00A896",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{fontFamily:"Calibri,'Trebuchet MS',sans-serif",background:"#F0F4F9",minHeight:"100vh"}}>
      <style>{`
        *{box-sizing:border-box;}
        .sb-item{display:flex;align-items:center;gap:14px;padding:11px 16px;margin:2px 10px;border-radius:14px;cursor:pointer;font-size:14px;font-weight:700;color:rgba(255,255,255,.55);border:none;background:none;width:calc(100% - 20px);text-align:left;transition:all .18s;font-family:Calibri,'Trebuchet MS',sans-serif;}
        .sb-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.9);}
        .sb-item.on{background:rgba(255,255,255,.12);color:#fff;}
        .sb-icon{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;background:rgba(255,255,255,.08);}
        .sb-item.on .sb-icon{background:rgba(255,255,255,.18);}
        .fq-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:14px;font-size:13px;font-weight:800;cursor:pointer;border:none;transition:all .16s;font-family:Calibri,'Trebuchet MS',sans-serif;}
        .btn-navy{background:#1A3A6B;color:#fff;}
        .btn-navy:hover{background:#122859;}
        .btn-teal{background:#00A896;color:#fff;}
        .btn-teal:hover{background:#007F72;}
        .btn-ghost{background:#fff;color:#4A5568;border:2px solid #E2E8F0;}
        .btn-sm{padding:7px 14px;font-size:12px;}
        .btn-danger{background:#FDECEA;color:#C0392B;border:none;}
        .fq-kpi{background:#fff;border-radius:20px;padding:18px 20px;box-shadow:0 2px 12px rgba(26,58,107,.07);position:relative;overflow:hidden;}
        .fq-card{background:#fff;border-radius:20px;box-shadow:0 2px 12px rgba(26,58,107,.07);margin-bottom:18px;overflow:hidden;}
        .fq-pill{padding:7px 14px;border-radius:100px;border:2px solid #E2E8F0;font-size:12px;font-weight:700;cursor:pointer;background:#fff;color:#4A5568;font-family:Calibri,'Trebuchet MS',sans-serif;}
        .fq-pill.on{background:#1A3A6B;color:#fff;border-color:#1A3A6B;}
        .fq-inp{width:100%;padding:11px 14px;border:2px solid #E2E8F0;border-radius:14px;font-size:13px;font-family:Calibri,'Trebuchet MS',sans-serif;font-weight:600;color:#1A3A6B;background:#FAFCFF;}
        .fq-inp:focus{outline:none;border-color:#00A896;}
        .lvl{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:800;}
        .lv-diam{background:#EDE9FE;color:#5B21B6;}
        .lv-plat{background:#DFF6F3;color:#007F72;}
        .lv-gold{background:#FEF6DC;color:#7A5500;}
        .lv-silv{background:#F1F5F9;color:#4A5568;}
        .lv-bron{background:#FDEEE6;color:#E8621A;}
        .fq-tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:11px;font-weight:700;}
        .t-teal{background:#DFF6F3;color:#007F72;}
        .t-green{background:#DFF2EA;color:#1A7A50;}
        .t-gray{background:#F1F5F9;color:#8898AA;}
        .t-orange{background:#FDEEE6;color:#E8621A;}
        .ci{padding:14px 18px;border-bottom:1px solid #E2E8F0;cursor:pointer;display:flex;gap:12px;align-items:flex-start;}
        .ci:hover{background:#F0F4F9;}
        .ci.on{background:#DFF6F3;}
        .overlay{display:none;position:fixed;inset:0;background:rgba(18,40,89,.5);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
        .overlay.on{display:flex;}
        table{width:100%;border-collapse:collapse;font-size:13px;}
        th{padding:10px 14px;text-align:left;font-size:11px;font-weight:800;color:#8898AA;text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid #E2E8F0;}
        td{padding:12px 14px;border-bottom:1px solid #E2E8F0;font-weight:600;color:#4A5568;}
        tr:last-child td{border-bottom:none;}
        .f-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
        .f-lbl{font-size:12px;font-weight:700;color:#4A5568;width:120px;flex-shrink:0;}
        .f-track{flex:1;background:#F0F4F9;border-radius:8px;height:32px;overflow:hidden;}
        .f-fill{height:100%;border-radius:8px;display:flex;align-items:center;padding:0 12px;font-size:12px;font-weight:800;color:#fff;}
        .f-pct{font-size:12px;font-weight:800;color:#4A5568;width:38px;text-align:right;}
        .tgl-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#FAFCFF;border-radius:14px;margin-bottom:8px;}
      `}</style>

      {/* TOPBAR */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,height:52,background:"rgba(18,40,89,.96)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",padding:"0 24px",gap:16,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{fontSize:17,color:"#fff",letterSpacing:"-.02em"}}>Flash<em style={{color:"#00A896",fontStyle:"normal"}}>Quality</em></div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button onClick={logout} className="fq-btn" style={{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.7)",fontSize:12}}>↪ Déconnexion</button>
        </div>
      </div>

      <div style={{display:"flex",marginTop:52,minHeight:"calc(100vh - 52px)"}}>
        {/* SIDEBAR */}
        <nav style={{width:256,flexShrink:0,background:"#1A3A6B",display:"flex",flexDirection:"column",position:"sticky",top:52,height:"calc(100vh - 52px)",overflowY:"auto"}}>
          <div style={{margin:16,borderRadius:14,background:"linear-gradient(135deg,rgba(0,168,150,.25),rgba(0,168,150,.08))",border:"1px solid rgba(0,168,150,.3)",padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#00A896,#007F72)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:900,color:"#fff",boxShadow:"0 4px 12px rgba(0,168,150,.4)"}}>
              {initiales(pro.nom||pro.name||"?")}
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>{pro.nom||pro.name}</div>
              <div style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:10,fontWeight:700,color:"#00A896",background:"rgba(0,168,150,.15)",borderRadius:100,padding:"2px 8px",marginTop:4}}>● Plan Pro · actif</div>
            </div>
          </div>

          <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".12em",padding:"16px 20px 6px"}}>Principal</div>
          {NAV.slice(0,7).map(n=>(
            <button key={n.id} className={`sb-item ${panel===n.id?"on":""}`} onClick={()=>setPanel(n.id)}>
              <div className="sb-icon">{n.icon}</div>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge && <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:100,background:n.bs?.background||"#00A896",color:n.bs?.color||"#fff",...n.bs}}>{n.badge}</span>}
            </button>
          ))}

          <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".12em",padding:"16px 20px 6px"}}>Communication</div>
          {NAV.slice(7,9).map(n=>(
            <button key={n.id} className={`sb-item ${panel===n.id?"on":""}`} onClick={()=>setPanel(n.id)}>
              <div className="sb-icon">{n.icon}</div>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge && <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:100,background:"#00A896",color:"#fff"}}>{n.badge}</span>}
            </button>
          ))}

          <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".12em",padding:"16px 20px 6px"}}>Insights</div>
          {NAV.slice(9,11).map(n=>(
            <button key={n.id} className={`sb-item ${panel===n.id?"on":""}`} onClick={()=>setPanel(n.id)}>
              <div className="sb-icon">{n.icon}</div>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge && <span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:100,background:"#00A896",color:"#fff"}}>{n.badge}</span>}
            </button>
          ))}

          <div style={{fontSize:9,fontWeight:800,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".12em",padding:"16px 20px 6px"}}>Compte</div>
          <button className={`sb-item ${panel==="settings"?"on":""}`} onClick={()=>setPanel("settings")}>
            <div className="sb-icon">⚙️</div><span>Paramètres</span>
          </button>

          <div style={{flex:1}}/>
          <div style={{margin:12,background:"linear-gradient(135deg,#007F72,#1A7A50)",borderRadius:14,padding:"14px 16px",cursor:"pointer"}}>
            <div style={{fontSize:13,fontWeight:800,color:"#fff"}}>🚀 Passer Business</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.7)",marginTop:2}}>Multi-sites · API · Segments avancés</div>
          </div>
        </nav>

        {/* MAIN */}
        <div style={{flex:1,overflow:"auto"}}>

          {/* ── VUE D'ENSEMBLE ── */}
          {panel==="dash" && (
            <div style={{display:"flex",flexDirection:"column",flex:1}}>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Bonjour, {pro.nom||pro.name} 👋</div>
                  <div style={{fontSize:13,color:"#8898AA",marginTop:5,fontWeight:600}}>30 derniers jours · Tout se passe bien !</div>
                </div>
                <button className="fq-btn btn-ghost btn-sm">⬇ Exporter CSV</button>
              </div>
              <div style={{padding:"28px 32px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
                  {[
                    {icon:"📱",bg:"#E8EDF7",lbl:"Scans QR",val:stats.total||284,trend:"↑ +18% ce mois",col:"#1A3A6B"},
                    {icon:"👥",bg:"#DFF6F3",lbl:"Clients actifs",val:247,trend:"↑ +31 nouveaux",col:"#00A896"},
                    {icon:"⭐",bg:"#FEF5E7",lbl:"Avis reçus",val:stats.total||305,trend:`↑ Note moy. ${stats.avg||4.8}`,col:"#E8A820"},
                    {icon:"👆",bg:"#FDEEE6",lbl:"Clics offres",val:128,trend:"↑ +28%",col:"#E8621A"},
                    {icon:"💶",bg:"#DFF2EA",lbl:"CA tickets",val:"6 420€",trend:"↑ +340€",col:"#1A7A50"},
                    {icon:"📤",bg:"#E8EDF7",lbl:"Partages fiche",val:43,trend:"↑ +12 cette sem.",col:"#8898AA"},
                  ].map((k,i)=>(
                    <div key={i} className="fq-kpi">
                      <div style={{width:36,height:36,borderRadius:10,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:10}}>{k.icon}</div>
                      <div style={{fontSize:11,fontWeight:700,color:"#8898AA",textTransform:"uppercase",letterSpacing:".06em"}}>{k.lbl}</div>
                      <div style={{fontSize:28,fontWeight:900,color:"#1A3A6B",lineHeight:1.1,margin:"4px 0"}}>{k.val}</div>
                      <div style={{fontSize:11,fontWeight:700,color:"#1A7A50"}}>{k.trend}</div>
                      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:k.col}}/>
                    </div>
                  ))}
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:18}}>
                  <div>
                    <div className="fq-card">
                      <div style={{padding:"16px 20px",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B"}}>📊 Activité — 7 derniers jours</div>
                      </div>
                      <div style={{padding:"20px 22px"}}>
                        <div style={{display:"flex",gap:8,alignItems:"flex-end",height:90}}>
                          {[{v:38,h:43,c:"#1A3A6B",d:"Lun"},{v:52,h:59,c:"#1A3A6B",d:"Mar"},{v:31,h:35,c:"#1A3A6B",d:"Mer",o:.7},{v:45,h:51,c:"#1A3A6B",d:"Jeu"},{v:72,h:81,c:"#00A896",d:"Ven"},{v:80,h:90,c:"#00A896",d:"Sam"},{v:24,h:27,c:"#1A3A6B",d:"Dim",o:.5}].map((b,i)=>(
                            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                              <div style={{fontSize:10,fontWeight:800,color:"#4A5568"}}>{b.v}</div>
                              <div style={{width:"100%",height:b.h,borderRadius:"6px 6px 0 0",background:b.c,opacity:b.o||1}}/>
                              <div style={{fontSize:10,fontWeight:700,color:"#8898AA"}}>{b.d}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="fq-card">
                      <div style={{padding:"16px 20px",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B"}}>👥 Clients récents</div>
                        <button className="fq-btn btn-ghost btn-sm" onClick={()=>setPanel("clients")}>Voir tout →</button>
                      </div>
                      <table>
                        <thead><tr><th>Client</th><th>Niveau</th><th>Dernière visite</th><th>CA</th><th>Contact</th></tr></thead>
                        <tbody>
                          {CLIENTS.slice(0,4).map((c,i)=>(
                            <tr key={i}>
                              <td><strong>{c.n}</strong><br/><span style={{fontSize:11,color:"#8898AA"}}>{c.e}</span></td>
                              <td><span className={`lvl ${c.lvl}`}>{c.ll}</span></td>
                              <td>{c.vis}</td>
                              <td><strong>{c.ca}</strong></td>
                              <td><span className={`fq-tag ${c.ok?"t-teal":"t-gray"}`}>{c.ok?"✓ OK":"🔒"}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <div className="fq-card" style={{marginBottom:18}}>
                      <div style={{padding:"16px 20px",borderBottom:"1px solid #E2E8F0"}}><div style={{fontSize:14,fontWeight:800,color:"#1A3A6B"}}>🎯 Entonnoir global</div></div>
                      <div style={{padding:"16px 18px"}}>
                        {[{l:"Scans QR",w:"100%",v:"284",c:"#1A3A6B",p:"100%"},{l:"Avis laissé",w:"74%",v:"210",c:"#00A896",p:"74%"},{l:"Offre cliquée",w:"45%",v:"128",c:"#E8621A",p:"45%"},{l:"Ticket scanné",w:"28%",v:"80",c:"#1A7A50",p:"28%"},{l:"Fiche partagée",w:"15%",v:"43",c:"#E8A820",p:"15%"}].map((f,i)=>(
                          <div key={i} className="f-row">
                            <div className="f-lbl">{f.l}</div>
                            <div className="f-track"><div className="f-fill" style={{width:f.w,background:f.c}}>{f.v}</div></div>
                            <div className="f-pct">{f.p}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="fq-card">
                      <div style={{padding:"16px 20px",borderBottom:"1px solid #E2E8F0"}}><div style={{fontSize:14,fontWeight:800,color:"#1A3A6B"}}>💬 Avis récents</div></div>
                      <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:10}}>
                        {reviews.slice(0,3).map((r:any,i:number)=>(
                          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                            <div style={{fontSize:22}}>{EMOJI[r.rating]||"😊"}</div>
                            <div>
                              <div style={{fontSize:13,fontWeight:800,color:"#1A3A6B"}}>Note {r.rating}/5</div>
                              <div style={{fontSize:11,color:"#8898AA",fontWeight:600,marginTop:3}}>{new Date(r.created_at).toLocaleDateString("fr-FR")}</div>
                            </div>
                          </div>
                        ))}
                        {reviews.length===0 && <div style={{textAlign:"center",padding:"20px 0",color:"#8898AA",fontSize:13}}>Scannez votre QR pour recevoir vos premiers avis</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CLIENTS ── */}
          {panel==="clients" && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Clients & XP 🏆</div><div style={{fontSize:13,color:"#8898AA",marginTop:5,fontWeight:600}}>247 clients · Classement mensuel</div></div>
                <div style={{display:"flex",gap:8}}>
                  <button className="fq-btn btn-ghost btn-sm">⬇ Export CSV</button>
                  <button className="fq-btn btn-teal btn-sm" onClick={()=>setShowOffer(true)}>+ Créer une offre</button>
                </div>
              </div>
              <div style={{padding:"28px 32px"}}>
                <div className="fq-card" style={{padding:20,marginBottom:18}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:16}}>🏆 Top 3 ce mois</div>
                  <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:12}}>
                    {[{n:"Thomas R.",xp:"840 XP",h:80,e:"🥈",bg:"linear-gradient(135deg,#8898AA,#6B7A8D)"},{n:"Sophie M.",xp:"1 240 XP",h:106,e:"🥇",bg:"linear-gradient(135deg,#E8A820,#C98800)"},{n:"Lucas B.",xp:"980 XP",h:64,e:"🥉",bg:"linear-gradient(135deg,#E8621A,#C04E10)"}].map((p,i)=>(
                      <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                        <div style={{width:88,height:p.h,borderRadius:"12px 12px 0 0",background:p.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",padding:"12px 8px"}}>
                          <div style={{fontSize:22,marginBottom:6}}>{p.e}</div>
                          <div style={{width:38,height:38,borderRadius:11,background:"rgba(255,255,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff",marginBottom:5}}>{p.n.split(" ").map(w=>w[0]).join("")}</div>
                          <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.9)"}}>{p.xp}</div>
                        </div>
                        <div style={{fontSize:12,fontWeight:700,color:"#4A5568"}}>{p.n}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="fq-card">
                  <table>
                    <thead><tr><th>Client</th><th>Niveau</th><th>XP ce mois</th><th>Avis</th><th>CA tickets</th><th>Dernière visite</th><th>Contact</th></tr></thead>
                    <tbody>
                      {CLIENTS.map((c,i)=>(
                        <tr key={i}>
                          <td><strong>{c.n}</strong><br/><span style={{fontSize:11,color:"#8898AA"}}>{c.e}</span></td>
                          <td><span className={`lvl ${c.lvl}`}>{c.ll}</span></td>
                          <td><strong>{c.xp}</strong></td>
                          <td>{Math.floor(c.xp/90)}</td>
                          <td><strong>{c.ca}</strong></td>
                          <td>{c.vis}</td>
                          <td><span className={`fq-tag ${c.ok?"t-teal":"t-gray"}`}>{c.ok?"✓ Autorisé":"🔒 Limité"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{borderRadius:14,padding:"12px 16px",fontSize:12,fontWeight:600,lineHeight:1.6,background:"#E8EDF7",color:"#1A3A6B",borderLeft:"4px solid #1A3A6B"}}>
                  💎 <strong>Niveaux (reset mensuel) :</strong> Diamant ≥ 98% · 💠 Platine ≥ 90% · 🥇 Gold 60–90% · 🥈 Silver 40–60% · 🥉 Bronze 0–40% du taux d'activité FlashQuality. Comme Duolingo — un client inactif redescend le mois suivant.
                </div>
              </div>
            </div>
          )}

          {/* ── OFFRES ── */}
          {panel==="offres" && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Offres flash ⚡</div><div style={{fontSize:13,color:"#8898AA",marginTop:5,fontWeight:600}}>Écoulement de stock · Vente privée · Fréquentation</div></div>
                <button className="fq-btn btn-teal" onClick={()=>setShowOffer(true)}>+ Nouvelle offre</button>
              </div>
              <div style={{padding:"28px 32px"}}>
                {offresList.length===0 ? (
                  <div className="fq-card" style={{padding:48,textAlign:"center"}}>
                    <div style={{fontSize:48,marginBottom:16}}>⚡</div>
                    <div style={{fontSize:16,fontWeight:800,color:"#1A3A6B",marginBottom:8}}>Aucune offre pour l'instant</div>
                    <div style={{fontSize:13,color:"#8898AA",marginBottom:20}}>Créez votre première offre flash et attirez vos clients</div>
                    <button className="fq-btn btn-teal" onClick={()=>setShowOffer(true)}>+ Créer ma première offre</button>
                  </div>
                ) : offresList.map((o:any,i:number)=>(
                  <div key={i} className="fq-card" style={{padding:"18px 20px",display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{width:48,height:48,borderRadius:14,background:"#FDEEE6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>⚡</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <span style={{fontSize:15,fontWeight:800,color:"#1A3A6B"}}>{o.titre}</span>
                        <span className={`fq-tag ${o.active?"t-green":"t-gray"}`}>{o.active?"● Active":"Inactive"}</span>
                        {o.reduction && <span style={{background:"#1A3A6B",color:"#fff",fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:100}}>{o.reduction}</span>}
                      </div>
                      <div style={{fontSize:13,color:"#4A5568",fontWeight:600,marginBottom:8}}>{o.description}</div>
                      {o.validite && <div style={{fontSize:12,fontWeight:700,color:"#8898AA"}}>⏱ {o.validite}</div>}
                    </div>
                    <div style={{display:"flex",gap:8,flexShrink:0}}>
                      <button className="fq-btn btn-ghost btn-sm" onClick={()=>toggleOffer(o)}>{o.active?"Désactiver":"Activer"}</button>
                      <button className="fq-btn btn-danger btn-sm" onClick={()=>deleteOffer(o.id)}>Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TOMBOLA ── */}
          {panel==="tombola" && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Tombola 🎰</div>
                <div style={{fontSize:13,color:"#8898AA",marginTop:5,fontWeight:600}}>Tirage le 30 du mois · 3 paniers locaux</div>
              </div>
              <div style={{padding:"28px 32px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:24}}>
                  {[{e:"🧺",t:"Grand panier artisan",v:"120€",n:"Panier 1"},{e:"💆",t:"Panier bien-être",v:"80€",n:"Panier 2"},{e:"🍫",t:"Panier gourmand",v:"60€",n:"Panier 3"}].map((p,i)=>(
                    <div key={i} className="fq-card" style={{padding:20,textAlign:"center"}}>
                      <div style={{fontSize:40,marginBottom:8}}>{p.e}</div>
                      <div style={{fontSize:13,fontWeight:800,color:"#1A3A6B",marginBottom:4}}>{p.n}</div>
                      <div style={{fontSize:12,color:"#8898AA",fontWeight:600,marginBottom:8}}>{p.t}</div>
                      <div style={{fontSize:20,fontWeight:900,color:"#E8621A"}}>{p.v}</div>
                    </div>
                  ))}
                </div>
                <div className="fq-card" style={{padding:20}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:16}}>📊 Stats tombola avril</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
                    {[{l:"Tickets distribués",v:"1 428"},{l:"Commerces participants",v:"12"},{l:"Jours restants",v:"J-18"}].map((s,i)=>(
                      <div key={i} style={{background:"#F0F4F9",borderRadius:14,padding:16,textAlign:"center"}}>
                        <div style={{fontSize:24,fontWeight:900,color:"#1A3A6B"}}>{s.v}</div>
                        <div style={{fontSize:12,color:"#8898AA",fontWeight:600,marginTop:4}}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:"#DFF6F3",borderRadius:14,padding:"12px 16px",fontSize:12,fontWeight:600,color:"#007F72",borderLeft:"4px solid #00A896",marginTop:16}}>
                  🎖️ FlashQuality prend <strong>20%</strong> de la valeur des paniers contribués par les pros. Chaque client gagne des tickets en scannant votre QR code.
                </div>
              </div>
            </div>
          )}

          {/* ── QR CODE ── */}
          {panel==="qr" && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>QR Code & Events 📲</div>
                <div style={{fontSize:13,color:"#8898AA",marginTop:5,fontWeight:600}}>Votre QR code d'échange FlashQuality</div>
              </div>
              <div style={{padding:"28px 32px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                  <div className="fq-card" style={{padding:32,textAlign:"center"}}>
                    <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:20}}>📲 Mon QR Code</div>
                    {qrUrl && <img src={qrUrl} alt="QR" style={{width:200,height:200,borderRadius:14,marginBottom:16,border:"3px solid #E2E8F0"}}/>}
                    <div style={{fontSize:13,color:"#8898AA",fontWeight:600,marginBottom:16}}>flashquality.vercel.app/scan/{pro.slug}</div>
                    <div style={{display:"flex",gap:8,justifyContent:"center"}}>
                      <button className="fq-btn btn-navy btn-sm" onClick={()=>navigator.clipboard.writeText("https://flashquality.vercel.app/scan/"+pro.slug)}>📋 Copier le lien</button>
                      <button className="fq-btn btn-ghost btn-sm">⬇ Télécharger</button>
                    </div>
                  </div>
                  <div>
                    <div className="fq-card" style={{padding:20}}>
                      <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:12}}>💡 Conseils de placement</div>
                      {["Caisse / comptoir — hauteur des yeux","Vitrine côté intérieur","Table si espace restauration","Reçu / facture papier","Carte de visite format pocket"].map((t,i)=>(
                        <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #E2E8F0",fontSize:13,fontWeight:600,color:"#4A5568"}}>
                          <span style={{color:"#00A896",fontWeight:800}}>{i+1}.</span>{t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {panel==="messages" && (
            <div style={{display:"flex",flexDirection:"column",flex:1}}>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Messages 💬</div>
              </div>
              <div style={{padding:"28px 32px",flex:1}}>
                <div style={{display:"grid",gridTemplateColumns:"280px 1fr",height:"calc(100vh - 200px)",background:"#fff",borderRadius:20,boxShadow:"0 2px 12px rgba(26,58,107,.07)",overflow:"hidden"}}>
                  <div style={{borderRight:"1px solid #E2E8F0",display:"flex",flexDirection:"column"}}>
                    <div style={{padding:"16px 18px",borderBottom:"1px solid #E2E8F0",fontSize:14,fontWeight:800,color:"#1A3A6B",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      Conversations <span style={{background:"#00A896",color:"#fff",fontSize:11,fontWeight:800,padding:"2px 8px",borderRadius:100}}>3</span>
                    </div>
                    {CHATS.map((c,i)=>(
                      <div key={i} className={`ci ${chatSel===i?"on":""}`} onClick={()=>setChatSel(i)}>
                        <div style={{width:40,height:40,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:c.col,flexShrink:0}}>{c.av}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:800,color:"#1A3A6B"}}>{c.n}</div>
                          <div style={{fontSize:11,color:"#8898AA",fontWeight:600,marginTop:2}}>{c.sub}</div>
                          <div style={{fontSize:12,color:"#8898AA",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.msgs[c.msgs.length-1].txt}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",flexDirection:"column"}}>
                    <div style={{padding:"14px 20px",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:38,height:38,borderRadius:11,background:CHATS[chatSel].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:CHATS[chatSel].col}}>{CHATS[chatSel].av}</div>
                      <div>
                        <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B"}}>{CHATS[chatSel].n}</div>
                        <div style={{fontSize:11,color:"#8898AA",fontWeight:600}}>{CHATS[chatSel].sub}</div>
                      </div>
                    </div>
                    <div style={{flex:1,overflowY:"auto",padding:20,background:"#F0F4F9",display:"flex",flexDirection:"column",gap:12}}>
                      {CHATS[chatSel].msgs.map((m,i)=>(
                        <div key={i} style={{maxWidth:"70%",alignSelf:m.from==="c"?"flex-start":"flex-end"}}>
                          <div style={{padding:"11px 16px",borderRadius:18,fontSize:13,lineHeight:1.6,fontWeight:600,
                            ...(m.from==="c"?{background:"#fff",border:"2px solid #E2E8F0",color:"#4A5568"}:{background:"#1A3A6B",color:"#fff"})
                          }}>{m.txt}</div>
                          <div style={{fontSize:10,color:"#8898AA",padding:"4px 4px 0",textAlign:m.from==="p"?"right":"left"}}>{m.t}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{padding:"14px 20px",borderTop:"1px solid #E2E8F0",display:"flex",gap:10,background:"#fff"}}>
                      <input placeholder="Répondre à ce client…" className="fq-inp" style={{flex:1,borderRadius:100}}/>
                      <button className="fq-btn btn-navy" style={{borderRadius:100}}>Envoyer ↗</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── AVIS ── */}
          {panel==="reviews" && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Avis reçus ⭐</div>
                <div style={{fontSize:13,color:"#8898AA",marginTop:5,fontWeight:600}}>{reviews.length} avis · Note moyenne {stats.avg||"—"}/5</div>
              </div>
              <div style={{padding:"28px 32px"}}>
                <div className="fq-card">
                  <table>
                    <thead><tr><th>Note</th><th>Emoji</th><th>Date</th></tr></thead>
                    <tbody>
                      {reviews.length===0 ? (
                        <tr><td colSpan={3} style={{textAlign:"center",padding:"32px 0",color:"#8898AA"}}>Aucun avis reçu — partagez votre QR code !</td></tr>
                      ) : reviews.map((r:any,i:number)=>(
                        <tr key={i}>
                          <td><strong>{r.rating}/5</strong></td>
                          <td style={{fontSize:24}}>{EMOJI[r.rating]||"😊"}</td>
                          <td>{new Date(r.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTIQUES ── */}
          {panel==="analytics" && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Analytiques 📈</div>
                <div style={{fontSize:13,color:"#8898AA",marginTop:5,fontWeight:600}}>Performance de votre commerce</div>
              </div>
              <div style={{padding:"28px 32px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
                  <div className="fq-card" style={{padding:20}}>
                    <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:16}}>🎯 Entonnoir de conversion</div>
                    {[{l:"Scans QR",w:"100%",v:"284",c:"#1A3A6B",p:"100%"},{l:"Avis laissé",w:"74%",v:"210",c:"#00A896",p:"74%"},{l:"Offre cliquée",w:"45%",v:"128",c:"#E8621A",p:"45%"},{l:"Ticket scanné",w:"28%",v:"80",c:"#1A7A50",p:"28%"}].map((f,i)=>(
                      <div key={i} className="f-row">
                        <div className="f-lbl">{f.l}</div>
                        <div className="f-track"><div className="f-fill" style={{width:f.w,background:f.c}}>{f.v}</div></div>
                        <div className="f-pct">{f.p}</div>
                      </div>
                    ))}
                  </div>
                  <div className="fq-card" style={{padding:20}}>
                    <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:16}}>👥 Répartition clients</div>
                    {[{e:"💎",l:"Diamant",n:8,p:3,c:"#5B21B6"},{e:"💠",l:"Platine",n:14,p:6,c:"#00A896"},{e:"🥇",l:"Gold",n:65,p:26,c:"#E8A820"},{e:"🥈",l:"Silver",n:89,p:36,c:"#8898AA"},{e:"🥉",l:"Bronze",n:71,p:29,c:"#E8621A"}].map((s,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #E2E8F0"}}>
                        <span style={{fontSize:18,width:24}}>{s.e}</span>
                        <span style={{fontSize:13,fontWeight:700,color:"#1A3A6B",flex:1}}>{s.l}</span>
                        <div style={{width:100,height:8,background:"#F0F4F9",borderRadius:4,overflow:"hidden"}}>
                          <div style={{width:s.p+"%",height:"100%",background:s.c,borderRadius:4}}/>
                        </div>
                        <span style={{fontSize:12,fontWeight:700,color:"#8898AA",width:50,textAlign:"right"}}>{s.n} · {s.p}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PARAMÈTRES ── */}
          {panel==="settings" && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>Paramètres ⚙️</div>
              </div>
              <div style={{padding:"28px 32px",maxWidth:640}}>
                <div className="fq-card" style={{padding:24,marginBottom:18}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:16}}>🏪 Informations du commerce</div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,fontWeight:800,color:"#4A5568",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:6}}>Nom</label>
                    <input className="fq-inp" defaultValue={pro.nom||pro.name}/>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,fontWeight:800,color:"#4A5568",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:6}}>Catégorie</label>
                    <input className="fq-inp" defaultValue={pro.categorie}/>
                  </div>
                  <div style={{marginBottom:20}}>
                    <label style={{fontSize:11,fontWeight:800,color:"#4A5568",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:6}}>Adresse</label>
                    <input className="fq-inp" defaultValue={pro.adresse||""}/>
                  </div>
                  <button className="fq-btn btn-teal">Sauvegarder</button>
                </div>
                <div className="fq-card" style={{padding:24}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#1A3A6B",marginBottom:16}}>🔔 Notifications</div>
                  {[{l:"Nouvel avis reçu",s:"Notification immédiate"},{l:"Nouveau client inscrit",s:"Quotidien · résumé"},{l:"Offre expirée",s:"1h avant l'expiration"}].map((t,i)=>(
                    <div key={i} className="tgl-row">
                      <div><div style={{fontSize:13,fontWeight:700,color:"#1A3A6B"}}>{t.l}</div><div style={{fontSize:11,color:"#8898AA",fontWeight:600,marginTop:2}}>{t.s}</div></div>
                      <div style={{width:38,height:22,borderRadius:100,background:"#00A896",position:"relative",cursor:"pointer"}}>
                        <div style={{position:"absolute",top:3,right:3,width:16,height:16,borderRadius:"50%",background:"#fff"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Panels vides pour les autres sections */}
          {["test","exp","agenda"].includes(panel) && (
            <div>
              <div style={{padding:"22px 32px 18px",background:"#fff",borderBottom:"1px solid #E2E8F0"}}>
                <div style={{fontWeight:900,fontSize:24,color:"#1A3A6B"}}>{NAV.find(n=>n.id===panel)?.icon} {NAV.find(n=>n.id===panel)?.label}</div>
              </div>
              <div style={{padding:"28px 32px",textAlign:"center"}}>
                <div className="fq-card" style={{padding:48}}>
                  <div style={{fontSize:48,marginBottom:16}}>{NAV.find(n=>n.id===panel)?.icon}</div>
                  <div style={{fontSize:18,fontWeight:800,color:"#1A3A6B",marginBottom:8}}>Bientôt disponible</div>
                  <div style={{fontSize:13,color:"#8898AA"}}>Cette fonctionnalité arrive dans la prochaine mise à jour.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL OFFRE */}
      <div className={`overlay ${showOffer?"on":""}`} onClick={(e)=>{if(e.target===e.currentTarget)setShowOffer(false)}}>
        <div style={{background:"#fff",borderRadius:20,width:540,maxHeight:"88vh",overflowY:"auto",boxShadow:"0 8px 32px rgba(26,58,107,.12)"}}>
          <div style={{padding:"20px 24px",borderBottom:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#fff"}}>
            <div style={{fontWeight:800,fontSize:20,color:"#1A3A6B"}}>Nouvelle offre</div>
            <button onClick={()=>setShowOffer(false)} style={{width:34,height:34,borderRadius:10,border:"2px solid #E2E8F0",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#4A5568"}}>✕</button>
          </div>
          <div style={{padding:24}}>
            {[
              {f:"titre",p:"Ex : Happy Hour café",l:"Titre de l'offre"},
              {f:"description",p:"Ex : -20% sur tous les cafés entre 15h et 17h",l:"Description"},
              {f:"reduction",p:"Ex : -20% ou 1+1",l:"Réduction affichée"},
              {f:"validite",p:"Ex : Ce week-end ou Aujourd'hui jusqu'à 17h",l:"Validité"},
            ].map((field)=>(
              <div key={field.f} style={{marginBottom:14}}>
                <label style={{fontSize:11,fontWeight:800,color:"#4A5568",textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:6}}>{field.l}</label>
                <input className="fq-inp" placeholder={field.p} value={(newOffer as any)[field.f]} onChange={e=>setNewOffer(p=>({...p,[field.f]:e.target.value}))}/>
              </div>
            ))}
            <button className="fq-btn btn-teal" style={{width:"100%",justifyContent:"center",padding:14,marginTop:8}} onClick={createOffer}>⚡ Publier l'offre</button>
          </div>
        </div>
      </div>
    </div>
  );
}
