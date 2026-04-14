'use client'
import { useState } from 'react'

type Panel = 'dash' | 'alerts' | 'commerces' | 'clients' | 'onboarding' | 'revenue' | 'tombola' | 'jeux' | 'logs' | 'system'

interface Props { userEmail: string }

const C = {
  navy:'#1A3A6B',navy2:'#122859',navyL:'#E8EDF7',
  teal:'#00A896',teal2:'#007F72',tealL:'#DFF6F3',
  orange:'#E8621A',orangeL:'#FDEEE6',
  amber:'#E8A820',amberL:'#FEF6DC',
  green:'#1A7A50',greenL:'#DFF2EA',
  red:'#C0392B',redL:'#FDECEA',
  diam:'#5B21B6',diam2:'#3B0F8C',diamL:'#EDE9FE',
  slate:'#4A5568',slate2:'#8898AA',
  bg:'#F0F4F9',white:'#FFFFFF',bord:'#E2E8F0',
  adm:'#4F46E5',adm2:'#3730A3',admL:'#EEF2FF',
}
const F = "Calibri, 'Trebuchet MS', sans-serif"
const r = '14px'

export default function AdminClient({ userEmail }: Props) {
  const [panel, setPanel] = useState<Panel>('dash')
  const [comDrawer, setComDrawer] = useState(false)
  const [clientDrawer, setClientDrawer] = useState(false)
  const [toast, setToast] = useState('')
  const [gameStates, setGameStates] = useState({ r1: true, q1: true, r2: true })

  function notify(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const pill = (text: string, type: string) => {
    const s: Record<string,{bg:string;col:string}> = {
      pro:{bg:C.tealL,col:C.teal2}, active:{bg:C.greenL,col:C.green},
      free:{bg:C.navyL,col:C.slate}, paused:{bg:C.amberL,col:C.amber},
      diam:{bg:C.diamL,col:C.diam}, gold:{bg:C.amberL,col:'#D97706'},
      silver:{bg:C.navyL,col:C.slate}, bronze:{bg:C.orangeL,col:C.orange},
      amber:{bg:C.amberL,col:C.amber}, adm:{bg:C.admL,col:C.adm},
      red:{bg:C.redL,col:C.red},
    }
    const st = s[type] || s.free
    return <span style={{display:'inline-flex',alignItems:'center',padding:'3px 10px',borderRadius:100,fontSize:11,fontWeight:800,background:st.bg,color:st.col,whiteSpace:'nowrap'}}>{text}</span>
  }

  const kpi = (icon:string,val:string,label:string,trend:string,accent?:string) => (
    <div style={{background:C.white,borderRadius:16,padding:'18px 20px',boxShadow:'0 2px 12px rgba(26,58,107,.07)',borderTop:`3px solid ${accent||C.navyL}`,flex:1,minWidth:160}}>
      <div style={{fontSize:28}}>{icon}</div>
      <div style={{fontSize:28,fontWeight:900,color:C.navy,lineHeight:1.1,marginTop:8}}>{val}</div>
      <div style={{fontSize:12,color:C.slate2,fontWeight:700,marginTop:4}}>{label}</div>
      {trend && <div style={{fontSize:11,color:C.teal,fontWeight:800,marginTop:6}}>{trend}</div>}
    </div>
  )

  const card = (children: React.ReactNode, style?: React.CSSProperties) => (
    <div style={{background:C.white,borderRadius:16,padding:20,boxShadow:'0 2px 12px rgba(26,58,107,.07)',marginBottom:16,...style}}>{children}</div>
  )

  const sectionTitle = (t:string,sub?:string) => (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:16,fontWeight:900,color:C.navy}}>{t}</div>
      {sub && <div style={{fontSize:12,color:C.slate2,fontWeight:600,marginTop:3}}>{sub}</div>}
    </div>
  )

  const statBar = (name:string,val:string,pct:number,color:string) => (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
        <span style={{fontSize:12,fontWeight:700,color:C.slate}}>{name}</span>
        <span style={{fontSize:12,fontWeight:800,color:C.navy}}>{val}</span>
      </div>
      <div style={{height:8,background:C.navyL,borderRadius:4,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:4}} />
      </div>
    </div>
  )

  const logRow = (color:string,text:React.ReactNode,time:string) => (
    <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:`1px solid ${C.bord}`}}>
      <div style={{width:8,height:8,borderRadius:'50%',background:color,flexShrink:0}} />
      <div style={{fontSize:13,color:C.slate,fontWeight:600,flex:1}}>{text}</div>
      <div style={{fontSize:11,color:C.slate2,fontWeight:700,whiteSpace:'nowrap'}}>{time}</div>
    </div>
  )

  const revRow = (label:string,val:string,pos?:boolean,neg?:boolean) => (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}>
      <span style={{fontSize:13,color:C.slate,fontWeight:600}}>{label}</span>
      <span style={{fontSize:14,fontWeight:900,color:neg?C.red:pos?C.green:C.navy}}>{val}</span>
    </div>
  )

  const alertBox = (color:'red'|'amber'|'teal'|'adm',icon:string,title:string,sub:string,actions?:React.ReactNode) => {
    const bg={red:C.redL,amber:C.amberL,teal:C.tealL,adm:C.admL}[color]
    const border={red:C.red,amber:C.amber,teal:C.teal,adm:C.adm}[color]
    return (
      <div style={{display:'flex',alignItems:'flex-start',gap:12,background:bg,borderLeft:`4px solid ${border}`,borderRadius:r,padding:14,marginBottom:12}}>
        <div style={{fontSize:20}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:C.navy}}>{title}</div>
          <div style={{fontSize:12,color:C.slate2,fontWeight:600,marginTop:3}}>{sub}</div>
        </div>
        {actions && <div style={{display:'flex',gap:8,flexShrink:0,alignItems:'center'}}>{actions}</div>}
      </div>
    )
  }

  const aBtn = (label:string,onClick:()=>void,variant:'open'|'kill'|'ok'='open') => (
    <button onClick={onClick} style={{padding:'5px 12px',borderRadius:8,fontSize:12,fontWeight:800,background:{open:C.adm,kill:C.red,ok:C.green}[variant],color:'#fff',border:'none',cursor:'pointer',fontFamily:F}}>{label}</button>
  )

  const toggle = (checked:boolean,onChange:(v:boolean)=>void,label:string) => (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div onClick={()=>onChange(!checked)} style={{width:44,height:24,borderRadius:12,position:'relative',cursor:'pointer',background:checked?C.teal:C.slate2,transition:'background .2s'}}>
        <div style={{position:'absolute',top:2,left:checked?22:2,width:20,height:20,borderRadius:'50%',background:'#fff',transition:'left .2s',boxShadow:'0 1px 4px rgba(0,0,0,.2)'}} />
      </div>
      <span style={{fontSize:13,fontWeight:700,color:C.slate}}>{label}</span>
    </div>
  )

  const sbBtn = (p:Panel,icon:string,label:string,badge?:{text:string;color:string}) => (
    <button onClick={()=>setPanel(p)} style={{display:'flex',alignItems:'center',gap:14,padding:'11px 16px',margin:'2px 10px',borderRadius:r,cursor:'pointer',fontSize:14,fontWeight:700,color:panel===p?'#fff':'rgba(255,255,255,.5)',background:panel===p?'rgba(79,70,229,.25)':'none',boxShadow:panel===p?'inset 0 0 0 1px rgba(79,70,229,.4)':'none',border:'none',width:'calc(100% - 20px)',textAlign:'left',fontFamily:F}}>
      <div style={{width:38,height:38,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0,background:panel===p?'rgba(79,70,229,.35)':'rgba(255,255,255,.06)'}}>{icon}</div>
      <span style={{flex:1}}>{label}</span>
      {badge && <span style={{fontSize:10,fontWeight:800,padding:'2px 8px',borderRadius:100,background:badge.color,color:badge.color===C.amber?C.navy:'#fff'}}>{badge.text}</span>}
    </button>
  )

  // ── PANELS ──────────────────────────────────────────

  const Dash = () => <>
    <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20}}>
      {kpi('🏪','12','Commerces actifs','↑ +3 ce mois',C.teal)}
      {kpi('👥','1 247','Clients plateforme','↑ +89 ce mois',C.adm)}
      {kpi('💰','348 €','MRR abonnements','↑ +87 € vs M-1',C.green)}
      {kpi('🎰','+192 €','Commissions tombola','Mois en cours',C.amber)}
    </div>
    <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20}}>
      {kpi('📊','2 841','Scans QR ce mois','↑ +14%')}
      {kpi('⭐','3 658','Avis collectés total','↑ +305 ce mois')}
      {kpi('⚠️','2','Churners ce mois','→ Action requise',C.red)}
      {kpi('💎','87','Clients Diamant','Top 3% plateforme')}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
      {card(<>
        {sectionTitle('Commerces par plan','12 commerces · MRR 348 €')}
        {statBar('🌟 Plan Pro (29€/mois)','9 commerces · 261 €',75,C.teal)}
        {statBar('🎰 + Tombola (10€/mois)','8 commerces · 80 €',67,C.amber)}
        {statBar('🆓 Plan Gratuit (0€)','3 commerces · en conv.',25,C.slate2)}
        <div style={{display:'flex',gap:8,marginTop:12,flexWrap:'wrap'}}>
          <span style={{padding:'4px 12px',borderRadius:100,fontSize:11,fontWeight:800,background:C.tealL,color:C.teal2,border:`1px solid ${C.teal}`}}>Palier pilote : 20 pros</span>
          <span style={{padding:'4px 12px',borderRadius:100,fontSize:11,fontWeight:800,background:C.amberL,color:C.amber,border:`1px solid ${C.amber}`}}>MRR cible : 580 €</span>
        </div>
      </>)}
      {card(<>
        {sectionTitle('Alertes actives','Requiert attention immédiate')}
        {alertBox('red','🔴','Paiement Stripe échoué','Institut Éclat · Cannes · 29€ en attente depuis 3j')}
        {alertBox('amber','🟡','Commerce inactif 30j','Dr. Laurent Ostéo · Valbonne · 0 scan ce mois')}
        {alertBox('teal','🟢','Tombola — tirage dans 17j','1 428 tickets · 12 commerces participants')}
      </>)}
    </div>
    {card(<>
      {sectionTitle("Activité plateforme (aujourd'hui)")}
      {logRow(C.teal,<><strong>Studio Coiff</strong> — 3 nouveaux clients via QR scan</>,'il y a 12 min')}
      {logRow(C.adm,<><strong>Boulangerie Martin</strong> — Offre flash &quot;Croissants -30%&quot; activée</>,'il y a 1h')}
      {logRow(C.amber,<><strong>Trattoria Bella</strong> — Paiement Stripe OK · 29€ débité</>,'il y a 2h')}
      {logRow(C.green,<><strong>Plomberie Carrel</strong> — Nouveau commerce onboardé · Plan Pro</>,'hier 16h42')}
      {logRow(C.red,<><strong>Institut Éclat</strong> — Paiement Stripe <strong>échoué</strong> · Relance auto</>,'hier 09h15')}
    </>)}
  </>

  const Alerts = () => <>
    <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:12}}>🔴 Critiques</div>
    {card(alertBox('red','💳','Paiement Stripe échoué — Institut Éclat','29€ non encaissé · 3 jours · Relance auto envoyée le 10/04',<>{aBtn('Voir fiche',()=>notify('Ouverture fiche…'))}{aBtn('Suspendre',()=>notify('Compte suspendu'),'kill')}</>))}
    <div style={{fontSize:13,fontWeight:800,color:C.navy,margin:'20px 0 12px'}}>🟡 Avertissements</div>
    {card(<>
      {alertBox('amber','😴','Commerce inactif — Dr. Laurent Ostéo','0 scan sur 30 jours · Abonnement Pro · Risque churn',<>{aBtn('Relancer',()=>notify('Email envoyé'))}{aBtn('Appeler',()=>notify('Appel planifié'),'ok')}</>)}
      {alertBox('amber','📊','Tombola — paniers incomplets','Panier #3 "Gourmand" : aucun contributeur · Tirage dans 17j',<>{aBtn('Gérer tombola',()=>setPanel('tombola'))}</>)}
    </>)}
    <div style={{fontSize:13,fontWeight:800,color:C.navy,margin:'20px 0 12px'}}>🔵 Informations</div>
    {card(alertBox('adm','✨','2 prospects en attente d\'onboarding','Boulangerie Artisane · Cannes · 11/04 · Coiffeur Soleil · Grasse · 12/04',<>{aBtn('Onboarding',()=>setPanel('onboarding'))}</>))}
  </>

  const Commerces = () => <>
    <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
      {['Tous (12)','Plan Pro (9)','Gratuit (3)','Tombola (8)','Inactifs (1)'].map((f,i)=>(
        <button key={i} onClick={()=>notify(`Filtre: ${f}`)} style={{padding:'6px 14px',borderRadius:100,fontSize:12,fontWeight:800,cursor:'pointer',background:i===0?C.navy:C.white,color:i===0?'#fff':C.slate,border:`1px solid ${i===0?C.navy:C.bord}`,fontFamily:F}}>{f}</button>
      ))}
    </div>
    <div style={{background:C.white,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,58,107,.07)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{background:C.bg}}>
          {['Commerce','Catégorie','Plan','Clients','Scans/mois','Statut','Actions'].map(h=>(
            <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:800,color:C.slate2,textTransform:'uppercase',letterSpacing:'.04em',whiteSpace:'nowrap'}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {[
            {ico:'🥖',nom:'Boulangerie Martin',loc:'Grasse · boulangerie-martin',cat:'Boulangerie',pro:true,tom:true,clients:247,scans:284,st:'active'},
            {ico:'🍕',nom:'Trattoria Bella',loc:'Nice · trattoria-bella',cat:'Restaurant',pro:true,tom:true,clients:183,scans:201,st:'active'},
            {ico:'✂️',nom:'Studio Coiff',loc:'Grasse · studio-coiff',cat:'Coiffeur',pro:true,tom:true,clients:142,scans:168,st:'active'},
            {ico:'💆',nom:'Institut Éclat',loc:'Cannes · institut-eclat',cat:'Beauté',pro:true,tom:false,clients:98,scans:112,st:'paused'},
            {ico:'🏥',nom:'Dr. Laurent Ostéo',loc:'Valbonne · dr-laurent',cat:'Santé',pro:true,tom:false,clients:64,scans:0,st:'inactive'},
            {ico:'🔧',nom:'Plomberie Carrel',loc:'Grasse · plomberie-carrel',cat:'Artisan',pro:true,tom:true,clients:37,scans:45,st:'active'},
            {ico:'🌸',nom:'Fleurs du Midi',loc:'Grasse · fleurs-du-midi',cat:'Fleuriste',pro:false,tom:false,clients:18,scans:22,st:'free'},
          ].map((c,i)=>(
            <tr key={i} onClick={()=>setComDrawer(true)} style={{borderBottom:`1px solid ${C.bord}`,cursor:'pointer',opacity:c.st==='free'?.7:1}}>
              <td style={{padding:'12px 14px'}}>
                <div style={{fontWeight:800,color:C.navy}}>{c.ico} {c.nom}</div>
                <div style={{fontSize:11,color:C.slate2}}>{c.loc}</div>
              </td>
              <td style={{padding:'12px 14px',color:C.slate,fontWeight:600}}>{c.cat}</td>
              <td style={{padding:'12px 14px'}}>
                {c.pro && <span style={{marginRight:4}}>{pill('⭐ Pro','pro')}</span>}
                {c.tom && <span>{pill('🎰 Tombola','active')}</span>}
                {!c.pro && pill('Gratuit','free')}
              </td>
              <td style={{padding:'12px 14px',fontWeight:800,color:C.navy}}>{c.clients}</td>
              <td style={{padding:'12px 14px',color:c.scans===0?C.red:C.slate,fontWeight:c.scans===0?800:600}}>{c.scans===0?'0 ⚠':c.scans}</td>
              <td style={{padding:'12px 14px'}}>
                {c.st==='active'&&pill('● Actif','active')}
                {c.st==='paused'&&pill('⚠ Paiement','paused')}
                {c.st==='inactive'&&pill('😴 Inactif','paused')}
                {c.st==='free'&&pill('Gratuit','free')}
              </td>
              <td style={{padding:'12px 14px',fontSize:11,fontWeight:800,color:c.st==='paused'?C.red:c.st==='inactive'?C.amber:c.st==='free'?C.teal:C.adm}}>
                {c.st==='paused'?'⚠ Action requise':c.st==='inactive'?'Relancer →':c.st==='free'?'Upgrade Pro →':'Voir fiche →'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{marginTop:10,fontSize:12,color:C.slate2,textAlign:'center',fontWeight:600}}>
      Affichage 7 / 12 · <span onClick={()=>notify('Chargement…')} style={{color:C.adm,cursor:'pointer'}}>Charger tous →</span>
    </div>
  </>

  const Clients = () => <>
    <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:18}}>
      {kpi('👥','1 247','Clients total','↑ +89 ce mois',C.adm)}
      {kpi('📲','76%','Scan → inscription','')}
      {kpi('🎟️','1 428','Tickets tombola','',C.amber)}
      {kpi('😴','2','Churners ce mois','',C.red)}
    </div>
    <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center'}}>
      <input placeholder="🔍  Rechercher un client…" style={{flex:1,minWidth:240,padding:'9px 14px',borderRadius:10,border:`1px solid ${C.bord}`,fontSize:13,fontFamily:F,color:C.navy,outline:'none'}} />
      {[['Tous (1247)','all'],['💎 Diamant','diam'],['🥇 Gold','gold'],['🥈 Silver','silver'],['😴 Inactifs','inact'],['⚠ Sans opt-in','norgpd']].map(([l,k])=>(
        <button key={k} onClick={()=>notify(`Filtre: ${l}`)} style={{padding:'6px 12px',borderRadius:100,fontSize:11,fontWeight:800,cursor:'pointer',background:k==='all'?C.navy:C.white,color:k==='all'?'#fff':C.slate,border:`1px solid ${k==='all'?C.navy:C.bord}`,fontFamily:F}}>{l}</button>
      ))}
    </div>
    <div style={{background:C.white,borderRadius:16,overflow:'auto',boxShadow:'0 2px 12px rgba(26,58,107,.07)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
        <thead><tr style={{background:C.bg}}>
          {['Client','Niveau','XP','Scans','Avis','Jeux','Offres','Tickets','Dernier scan','Opt-in','Statut',''].map(h=>(
            <th key={h} style={{padding:'9px 12px',textAlign:'left',fontSize:10,fontWeight:800,color:C.slate2,textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {[
            {i:'É',n:'Élodie V.',e:'e.vernet@demo.fq',l:'Grasse',niv:'diam',xp:1890,sc:'22/4com.',av:'18 ★4.9',jx:'14·3g',of:9,tk:22,last:'il y a 2j',ok:true,risk:false,grad:[C.diam,C.diam2]},
            {i:'S',n:'Sophie M.',e:'s.martin@demo.fq',l:'Nice',niv:'gold',xp:1240,sc:'14/3com.',av:'11 ★4.8',jx:'8·1g',of:6,tk:14,last:'il y a 5j',ok:true,risk:false,grad:[C.amber,'#D97706']},
            {i:'L',n:'Lucas B.',e:'l.bernard@demo.fq',l:'Cannes',niv:'plat',xp:980,sc:'11/2com.',av:'9 ★4.7',jx:'6·2g',of:4,tk:11,last:'il y a 3j',ok:true,risk:false,grad:[C.teal,C.teal2]},
            {i:'T',n:'Thomas R.',e:'06 XX XX XX',l:'Valbonne',niv:'silv',xp:840,sc:'9/2com.',av:'7 ★4.6',jx:'3·0g',of:2,tk:9,last:'il y a 12j',ok:false,risk:false,grad:[C.slate2,C.slate]},
            {i:'C',n:'Claire M.',e:'c.moreau@demo.fq',l:'Grasse',niv:'gold',xp:720,sc:'6/2com.',av:'5 ★5.0',jx:'4·1g',of:3,tk:6,last:'il y a 8j',ok:false,risk:false,grad:['#D97706',C.amber]},
            {i:'M',n:'Marie L.',e:'m.leroy@demo.fq',l:'Grasse',niv:'bron',xp:410,sc:'4/1com.',av:'3 ★4.5',jx:'1·0g',of:1,tk:4,last:'il y a 21j',ok:false,risk:true,grad:[C.orange,'#C2410C']},
          ].map((cl,i)=>{
            const nP:Record<string,React.ReactNode>={diam:pill('💎 Diamant','diam'),plat:pill('💠 Platine','active'),gold:pill('🥇 Gold','gold'),silv:pill('🥈 Silver','silver'),bron:pill('🥉 Bronze','bronze')}
            return (
              <tr key={i} style={{borderBottom:`1px solid ${C.bord}`}}>
                <td style={{padding:'10px 12px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${cl.grad[0]},${cl.grad[1]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#fff',flexShrink:0}}>{cl.i}</div>
                    <div>
                      <div style={{fontWeight:800,color:C.navy}}>{cl.n}</div>
                      <div style={{fontSize:10,color:C.slate2}}>{cl.e} · {cl.l}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:'10px 12px'}}>{nP[cl.niv]}</td>
                <td style={{padding:'10px 12px',fontWeight:800,color:C.navy}}>{cl.xp.toLocaleString()}</td>
                <td style={{padding:'10px 12px',color:C.slate2}}>{cl.sc}</td>
                <td style={{padding:'10px 12px',color:C.slate2}}>{cl.av}</td>
                <td style={{padding:'10px 12px',color:C.slate2}}>{cl.jx}</td>
                <td style={{padding:'10px 12px',fontWeight:700}}>{cl.of}</td>
                <td style={{padding:'10px 12px',fontWeight:800,color:C.navy}}>{cl.tk}</td>
                <td style={{padding:'10px 12px',fontSize:11,color:C.slate2}}>{cl.last}</td>
                <td style={{padding:'10px 12px',fontSize:14}}>{cl.ok?'✅':'❌'}</td>
                <td style={{padding:'10px 12px'}}>{cl.risk?pill('😴 Risque','paused'):pill('● Actif','active')}</td>
                <td style={{padding:'10px 12px'}}>{aBtn('Voir →',()=>setClientDrawer(true))}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    <div style={{marginTop:10,fontSize:12,color:C.slate2,textAlign:'center',fontWeight:600}}>
      Affichage 6 / 1 247 · <span onClick={()=>notify('Chargement…')} style={{color:C.adm,cursor:'pointer'}}>Charger 50 suivants →</span>
    </div>
  </>

  const Onboarding = () => <>
    <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:24}}>
      {kpi('📥','2','Prospects actifs','',C.adm)}
      {kpi('✅','12','Onboardés ce mois','',C.teal)}
      {kpi('📞','5','Appels à planifier','',C.amber)}
    </div>
    <div style={{fontSize:14,fontWeight:800,color:C.navy,marginBottom:12}}>Pipeline prospects</div>
    {card(<>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div><div style={{fontWeight:800,color:C.navy,fontSize:15}}>🥐 Boulangerie Artisane</div><div style={{fontSize:12,color:C.slate2}}>Cannes · Marie Dupont · 06 XX XX XX XX</div></div>
        {pill('📥 Nouveau contact','adm')}
      </div>
      <div style={{fontSize:13,color:C.slate,fontWeight:600,marginBottom:14}}>Reçu le 11/04 via formulaire landing · Intéressée par Plan Pro + Tombola</div>
      <div style={{display:'flex',gap:8}}>
        {aBtn('🚀 Créer compte pro',()=>notify('Compte créé'),'ok')}
        {aBtn('📧 Email bienvenue',()=>notify('Email envoyé'))}
        {aBtn('📞 Planifier appel',()=>notify('Appel planifié'))}
      </div>
    </>)}
    {card(<>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div><div style={{fontWeight:800,color:C.navy,fontSize:15}}>✂️ Coiffeur Soleil</div><div style={{fontSize:12,color:C.slate2}}>Grasse · Jean Soleil · 06 XX XX XX XX</div></div>
        {pill('📞 Appel prévu','amber')}
      </div>
      <div style={{fontSize:13,color:C.slate,fontWeight:600,marginBottom:14}}>Reçu le 12/04 via bouche-à-oreille · Appel planifié le 15/04 à 14h</div>
      <div style={{display:'flex',gap:8}}>
        {aBtn('🚀 Créer compte pro',()=>notify('Compte créé'),'ok')}
        {aBtn('📅 Confirmer RDV',()=>notify('RDV confirmé'))}
      </div>
    </>)}
    {card(<>
      <div style={{fontSize:14,fontWeight:900,color:C.navy,marginBottom:14}}>Checklist onboarding standard</div>
      {[
        {done:true,label:'Compte Supabase Auth créé',note:'Automatique'},
        {done:true,label:'Fiche pro créée (slug unique)',note:'Automatique'},
        {done:true,label:'QR code généré (flashquality.app/scan/[slug])',note:'Automatique'},
        {done:false,label:'Email de bienvenue + lien accès dashboard',action:()=>notify('Email envoyé'),al:'Envoyer'},
        {done:false,label:'Stripe : abonnement créé + 1ère facturation',action:()=>notify('Stripe configuré'),al:'Config Stripe'},
        {done:false,label:'Appel de prise en main (15-20 min)',action:()=>notify('Appel planifié'),al:'Planifier'},
      ].map((item,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}>
          <span style={{fontSize:18}}>{item.done?'✅':'☐'}</span>
          <span style={{fontSize:13,fontWeight:700,color:item.done?C.navy:C.slate,flex:1}}>{item.label}</span>
          {item.done&&<span style={{fontSize:11,color:C.slate2}}>{item.note}</span>}
          {!item.done&&item.action&&aBtn(item.al!,item.action)}
        </div>
      ))}
    </>)}
  </>

  const Revenue = () => <>
    <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20}}>
      {kpi('💶','540 €','MRR total','↑ +87€ vs mars',C.green)}
      {kpi('🎰','192 €','Commissions tombola','Mois en cours',C.teal)}
      {kpi('📈','6 480 €','ARR (annualisé)','Projection',C.amber)}
      {kpi('⚠️','29 €','Paiements en attente','1 commerce',C.red)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
      {card(<>
        {sectionTitle('Détail revenus — Avril')}
        {revRow('Abonnements Pro (9 × 29€)','261 €',true)}
        {revRow('Options Tombola (8 × 10€)','80 €',true)}
        {revRow('Commissions tombola (20%)','192 €',true)}
        {revRow('Leads marketplace (V2)','— (V2)')}
        <div style={{borderTop:`2px solid ${C.navy}`,margin:'8px 0',paddingTop:10,display:'flex',justifyContent:'space-between'}}>
          <span style={{fontWeight:900,color:C.navy,fontSize:14}}>Total brut</span>
          <span style={{fontWeight:900,color:C.green,fontSize:18}}>533 €</span>
        </div>
        {revRow('Frais Stripe (1,5%+0,25€)','–11 €',false,true)}
        {revRow('Coûts infra (Supabase+Vercel)','–65 €',false,true)}
        {revRow('Claude Pro dev','–20 $',false,true)}
        <div style={{borderTop:`2px solid ${C.green}`,margin:'8px 0',paddingTop:10,display:'flex',justifyContent:'space-between'}}>
          <span style={{fontWeight:900,color:C.navy,fontSize:14}}>Marge nette</span>
          <span style={{fontWeight:900,color:C.green,fontSize:18}}>~437 €</span>
        </div>
        <div style={{textAlign:'center',marginTop:8}}>
          <span style={{padding:'4px 14px',borderRadius:100,fontSize:12,fontWeight:800,background:C.greenL,color:C.green,border:`1px solid ${C.green}`}}>Marge 82% 🎉</span>
        </div>
      </>)}
      {card(<>
        {sectionTitle('Paliers de rentabilité')}
        {[{col:C.green,bg:C.greenL,t:'✅ Pilote — 12 pros · ~540€/mois',s:'Rentable · Marge 82%'},
          {col:C.teal2,bg:C.tealL,t:'🎯 Cible 1 an — 50 pros · 1 450€/mois',s:'Coûts stables · Marge >83%'},
          {col:C.adm,bg:C.admL,t:'🚀 Scale — 200 pros · 5 800€/mois',s:'Même infra · Marge ~90%'},
          {col:C.amber,bg:C.amberL,t:'🏆 Objectif — 3 000 pros · 87K€/mois',s:'+ tombola : 135K€ MRR total'},
        ].map((p,i)=>(
          <div key={i} style={{padding:10,background:p.bg,borderRadius:r,borderLeft:`3px solid ${p.col}`,marginBottom:8}}>
            <div style={{fontSize:13,fontWeight:800,color:p.col}}>{p.t}</div>
            <div style={{fontSize:11,color:C.slate2,marginTop:2}}>{p.s}</div>
          </div>
        ))}
        <div style={{fontSize:14,fontWeight:900,color:C.navy,margin:'16px 0 10px'}}>Transactions récentes</div>
        {revRow('Trattoria Bella · Pro','+29 € ✓',true)}
        {revRow('Studio Coiff · Pro + Tombola','+39 € ✓',true)}
        {revRow('Institut Éclat · Pro','29 € ⚠ ÉCHEC',false,true)}
        {revRow('Plomberie Carrel · Pro + Tom.','+39 € ✓',true)}
      </>)}
    </div>
  </>

  const Tombola = () => <>
    <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20}}>
      {kpi('🎟️','1 428','Tickets en circulation','',C.amber)}
      {kpi('🏪','8','Commerces participants','',C.teal)}
      {kpi('💶','260 €','Valeur totale paniers','',C.green)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
      <div>
        <div style={{fontSize:14,fontWeight:900,color:C.navy,marginBottom:12}}>Paniers à gagner</div>
        {[
          {num:1,nom:'🧺 Grand panier artisan local',val:'120 € · Boulangerie Martin, Plomberie Carrel',alert:false},
          {num:2,nom:'💆 Panier bien-être',val:'80 € · Institut Éclat, Studio Coiff',alert:false},
          {num:3,nom:'🍴 Panier gourmand',val:'⚠ 60 € · Aucun contributeur — Action requise',alert:true},
        ].map(p=>(
          <div key={p.num} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',marginBottom:10,background:p.alert?C.redL:C.white,borderRadius:12,border:`1px solid ${p.alert?C.red:C.bord}`,boxShadow:'0 2px 8px rgba(26,58,107,.06)'}}>
            <div style={{width:32,height:32,borderRadius:8,background:p.alert?C.redL:C.navyL,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:p.alert?C.red:C.navy,fontSize:15,flexShrink:0}}>{p.num}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:C.navy,fontSize:13}}>{p.nom}</div>
              <div style={{fontSize:11,color:p.alert?C.red:C.slate2,marginTop:2}}>{p.val}</div>
            </div>
            {p.alert?aBtn('Solliciter',()=>notify('Notification envoyée'),'kill'):aBtn('Éditer',()=>notify('Édition…'))}
          </div>
        ))}
      </div>
      <div>
        <div style={{fontSize:14,fontWeight:900,color:C.navy,marginBottom:12}}>Participation par commerce</div>
        {card(<>
          {statBar('🥖 Boulangerie Martin','340 tickets',82,C.teal)}
          {statBar('✂️ Studio Coiff','210 tickets',51,C.adm)}
          {statBar('🍕 Trattoria Bella','188 tickets',45,C.orange)}
          {statBar('💆 Institut Éclat','154 tickets',37,C.diam)}
          {statBar('🔧 Plomberie Carrel','89 tickets',21,C.green)}
        </>)}
        {card(<>
          {sectionTitle('Config tirage')}
          <div style={{background:C.bg,borderRadius:r,padding:12,fontFamily:"'Courier New',monospace",fontSize:12,color:C.navy,lineHeight:1.7}}>
            <div>// Edge Function: tombola-draw</div>
            <div>// CRON: 30 du mois à 20:00 UTC+1</div>
            <div style={{color:C.teal,marginTop:6}}>Pondéré par nb tickets · 1 ticket = 1 chance</div>
            <div style={{color:C.adm}}>Commission FQ = 20% valeur panier</div>
          </div>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button onClick={()=>notify('Test dryrun — résultat en logs')} style={{flex:1,padding:8,borderRadius:10,border:`1px solid ${C.bord}`,background:C.white,fontSize:12,fontWeight:800,color:C.slate,cursor:'pointer',fontFamily:F}}>🔍 Test dryrun</button>
            <button onClick={()=>{if(confirm('Lancer le tirage ?'))notify('🎉 Tirage lancé !')}} style={{flex:1,padding:8,borderRadius:10,border:'none',background:C.red,fontSize:12,fontWeight:800,color:'#fff',cursor:'pointer',fontFamily:F}}>🎲 Tirer maintenant</button>
          </div>
        </>)}
      </div>
    </div>
    {card(<>
      {sectionTitle('Historique tirages')}
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{background:C.bg}}>{['Mois','Gagnants','Tickets','Valeur','Commission','Statut'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:11,fontWeight:800,color:C.slate2,textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
        <tbody>
          <tr style={{borderBottom:`1px solid ${C.bord}`}}>
            <td style={{padding:'10px 12px',fontWeight:800,color:C.navy}}>Mars 2026</td>
            <td style={{padding:'10px 12px',color:C.slate}}>Élodie V. · Sophie M. · Lucas B.</td>
            <td style={{padding:'10px 12px'}}>1 290</td>
            <td style={{padding:'10px 12px'}}>260 €</td>
            <td style={{padding:'10px 12px',fontWeight:900,color:C.green}}>+52 €</td>
            <td style={{padding:'10px 12px'}}>{pill('✓ Tiré','active')}</td>
          </tr>
        </tbody>
      </table>
    </>)}
  </>

  const Jeux = () => <>
    {card(<>
      {sectionTitle('Sécurité — Anti-triche (Edge Functions)')}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
        {[
          {col:C.green,bg:C.greenL,t:'✅ Validation serveur',s:"game-validator · UNIQUE INDEX (jeu_id, client_id, date_trunc('week'))"},
          {col:C.teal2,bg:C.tealL,t:'✅ 1 partie / semaine / jeu',s:'Enforced en DB · Impossible à contourner côté client'},
          {col:C.adm,bg:C.admL,t:'✅ Gains côté serveur',s:'XP + récompenses calculés en Edge Function · Jamais exposés en front'},
        ].map((s,i)=>(
          <div key={i} style={{padding:12,background:s.bg,borderRadius:r,borderLeft:`3px solid ${s.col}`}}>
            <div style={{fontSize:13,fontWeight:800,color:s.col}}>{s.t}</div>
            <div style={{fontSize:11,color:C.slate2,marginTop:4}}>{s.s}</div>
          </div>
        ))}
      </div>
    </>)}
    <div style={{fontSize:14,fontWeight:900,color:C.navy,marginBottom:12}}>Kill switch par commerce</div>
    {card(<>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:900,color:C.navy}}>🥖 Boulangerie Martin</div>
        {pill('● Commerce actif','active')}
      </div>
      {[{k:'r1' as const,ico:'🎡',n:'Roulette des surprises',s:'1×/semaine · Bronze+ · 247 participations · 34 gains'},
        {k:'q1' as const,ico:'❓',n:'Quiz boulangerie',s:'1×/semaine · Silver+ · 89 participations'}
      ].map(g=>(
        <div key={g.k} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',background:C.bg,borderRadius:r,marginBottom:8}}>
          <div style={{fontSize:28}}>{g.ico}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,color:C.navy,fontSize:13}}>{g.n}</div>
            <div style={{fontSize:11,color:C.slate2,marginTop:2}}>{g.s}</div>
          </div>
          {toggle(gameStates[g.k],(v)=>{setGameStates(s=>({...s,[g.k]:v}));notify(`${g.n}: ${v?'activé':'désactivé'}`)},gameStates[g.k]?'Actif':'Inactif')}
        </div>
      ))}
    </>)}
    {card(<>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:900,color:C.navy}}>✂️ Studio Coiff</div>
        {pill('● Commerce actif','active')}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',background:C.bg,borderRadius:r}}>
        <div style={{fontSize:28}}>🎡</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,color:C.navy,fontSize:13}}>Roulette beauté</div>
          <div style={{fontSize:11,color:C.slate2,marginTop:2}}>1×/semaine · Bronze+ · 142 participations</div>
        </div>
        {toggle(gameStates.r2,(v)=>{setGameStates(s=>({...s,r2:v}));notify(`Roulette Studio Coiff: ${v?'activée':'désactivée'}`)},gameStates.r2?'Actif':'Inactif')}
      </div>
    </>)}
    {card(<>
      <div style={{fontSize:14,fontWeight:900,color:C.red,marginBottom:12}}>🛑 Kill Switch Global</div>
      {alertBox('red','⚠️','Cette action coupe tous les jeux sur toute la plateforme',"À utiliser uniquement en cas de faille critique. Irréversible sans réactivation manuelle.")}
      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>{if(confirm('Couper TOUS les jeux ?'))notify('Tous les jeux coupés')}} style={{flex:1,padding:10,borderRadius:r,border:'none',background:C.red,color:'#fff',fontSize:13,fontWeight:800,cursor:'pointer',fontFamily:F}}>🛑 Couper TOUS les jeux</button>
        <button onClick={()=>notify('Tous les jeux réactivés')} style={{flex:1,padding:10,borderRadius:r,border:'none',background:C.green,color:'#fff',fontSize:13,fontWeight:800,cursor:'pointer',fontFamily:F}}>✅ Réactiver tous</button>
      </div>
    </>,{border:`2px solid ${C.redL}`})}
  </>

  const Logs = () => <>
    <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:20}}>
      {kpi('✅','99.8%','Uptime 30j','',C.green)}
      {kpi('⚡','142ms','Latence API moyenne','')}
      {kpi('❌','2','Erreurs 24h','',C.red)}
    </div>
    {card(<>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:900,color:C.navy}}>Flux temps réel</div>
        <select style={{padding:'6px 12px',fontSize:12,borderRadius:8,border:`1px solid ${C.bord}`,fontFamily:F,color:C.navy}}>
          <option>Tous les services</option><option>Edge Functions</option><option>Auth</option><option>Stripe</option><option>Resend</option>
        </select>
      </div>
      {logRow(C.teal,<><strong>[xp-calculator]</strong> XP calculé pour client demo-001 · +15xp (scan) · niveau: diamant</>,'13:42:18')}
      {logRow(C.teal,<><strong>[auth]</strong> Nouvelle inscription · Magic Link · Grasse · scan: boulangerie-martin</>,'13:39:02')}
      {logRow(C.adm,<><strong>[game-validator]</strong> Participation validée · roulette-001 · client demo-004 · gain: -10%</>,'13:28:55')}
      {logRow(C.green,<><strong>[stripe]</strong> Webhook · payment_intent.succeeded · 39€ · Studio Coiff</>,'12:01:14')}
      {logRow(C.amber,<><strong>[receipt-parser]</strong> GPT-4o Vision · 47.50€ · Restaurant · 0.0035€</>,'11:44:31')}
      {logRow(C.red,<><strong>[stripe]</strong> payment_intent.payment_failed · 29€ · Institut Éclat · card_declined</>,'09:15:02')}
      {logRow(C.red,<><strong>[resend]</strong> Email bounce · contact@institut-eclat.fr · smtp: user unknown</>,'09:15:05')}
      {logRow(C.teal,<><strong>[tombola-draw]</strong> CRON check · prochain tirage: 2026-04-30 20:00:00 · 1428 tickets</>,'08:00:00')}
      <div style={{marginTop:12,textAlign:'center'}}>
        <button onClick={()=>notify('Chargement…')} style={{padding:'7px 20px',borderRadius:10,border:`1px solid ${C.bord}`,background:C.white,fontSize:12,fontWeight:800,color:C.slate,cursor:'pointer',fontFamily:F}}>Charger plus ↓</button>
      </div>
    </>)}
  </>

  const System = () => <>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
      {card(<>
        {sectionTitle('Infrastructure')}
        {revRow('Hébergement','Vercel Pro · Edge Runtime')}
        {revRow('Base de données','Supabase Pro · PostgreSQL 15')}
        {revRow('Auth','Supabase Auth · Google OAuth + Magic Link')}
        {revRow('Storage','Supabase Storage · tickets/{client_id}')}
        {revRow('Email transac.','Resend Starter · inbound parsing')}
        {revRow('Paiements','Stripe · 1.5% + 0.25€ / transaction')}
        {revRow('IA tickets','GPT-4o Vision · 0.0035€/ticket')}
        {revRow('Domaine','flashquality.app · admin.flashquality.app')}
      </>)}
      {card(<>
        {sectionTitle('Sécurité — Checklist')}
        {[
          {ok:true,label:'RLS activé sur 16 tables'},
          {ok:true,label:'Middleware vérifie rôle DB avant accès admin'},
          {ok:true,label:'service_role key uniquement côté serveur'},
          {ok:true,label:'Anti-triche jeux enforced en DB (UNIQUE INDEX)'},
          {ok:true,label:'Variables d\'env Vercel (jamais exposées)'},
          {ok:true,label:'Logs séparés admin/pro/client'},
          {ok:false,label:'IP whitelist Vercel — à configurer en prod'},
        ].map((item,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:`1px solid ${C.bord}`}}>
            <span>{item.ok?'✅':'⚠️'}</span>
            <span style={{fontSize:13,fontWeight:700,color:item.ok?C.navy:C.amber}}>{item.label}</span>
          </div>
        ))}
      </>)}
    </div>
    {card(<>
      {sectionTitle('Edge Functions — Statut')}
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{background:C.bg}}>{['Fonction','Trigger','Dernière exécution','Statut'].map(h=><th key={h} style={{padding:'8px 12px',textAlign:'left',fontSize:11,fontWeight:800,color:C.slate2,textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
        <tbody>
          {[
            {fn:'xp-calculator',tr:'INSERT xp_events',last:'il y a 12 min'},
            {fn:'tombola-draw',tr:'CRON 30/mois 20h',last:'31 mars 2026'},
            {fn:'game-validator',tr:'POST /api/jeux/play',last:'il y a 28 min'},
            {fn:'receipt-parser',tr:'email inbound / photo upload',last:'il y a 2h'},
          ].map(fn=>(
            <tr key={fn.fn} style={{borderBottom:`1px solid ${C.bord}`}}>
              <td style={{padding:'10px 12px',fontWeight:800,color:C.navy}}>{fn.fn}</td>
              <td style={{padding:'10px 12px',color:C.slate2}}>{fn.tr}</td>
              <td style={{padding:'10px 12px',color:C.slate2}}>{fn.last}</td>
              <td style={{padding:'10px 12px'}}>{pill('✓ OK','active')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>)}
    {card(<>
      {sectionTitle('Config XP — Barème points')}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[['Scan nouveau commerce','+15 pts'],['Avis emoji posté','+10 pts'],['Ticket photo scanné','+5 pts'],['Partage fiche commerce','+10 pts'],['Participation jeu','+5 pts'],['Quiz réussi','+20 pts']].map(([l,v],i)=>(
          <div key={i} style={{padding:10,background:C.bg,borderRadius:r}}>
            <div style={{fontSize:11,color:C.slate2,fontWeight:700}}>{l}</div>
            <div style={{fontSize:22,fontWeight:900,color:C.navy}}>{v}</div>
          </div>
        ))}
      </div>
    </>)}
  </>

  const panelMap: Record<Panel,{title:string;sub:string;content:React.ReactNode}> = {
    dash:{title:"Bonjour Romain 👋 Voici la plateforme",sub:"14 avril 2026 · Zone pilote : Grasse / Côte d'Azur 06",content:<Dash/>},
    alerts:{title:'Alertes & Incidents 🔔',sub:'3 alertes actives · 0 incident critique',content:<Alerts/>},
    commerces:{title:'Commerces 🏪',sub:'12 actifs · 3 gratuits · 0 suspendus',content:<Commerces/>},
    clients:{title:'Clients globaux 👥',sub:'1 247 clients · Cliquez sur un client pour voir son profil',content:<Clients/>},
    onboarding:{title:'Onboarding commerces ✨',sub:"2 prospects en cours · Pipeline d'acquisition",content:<Onboarding/>},
    revenue:{title:'Revenue & Stripe 💰',sub:'Avril 2026 · Toutes sources',content:<Revenue/>},
    tombola:{title:'Tombola — Gestion 🎰',sub:'Avril 2026 · Tirage le 30/04 à 20h00',content:<Tombola/>},
    jeux:{title:'Jeux — Kill Switch ⚙️🎮',sub:'Contrôle global des jeux par commerce · Anti-triche enforced côté serveur',content:<Jeux/>},
    logs:{title:'Logs système 📋',sub:'Vercel Log Drain · Supabase Edge Functions · Dernières 24h',content:<Logs/>},
    system:{title:'Système & Configuration ⚙️',sub:"Infrastructure · Sécurité · Variables d'environnement",content:<System/>},
  }
  const cur = panelMap[panel]

  return (
    <div style={{fontFamily:F,background:C.bg,minHeight:'100vh',color:C.slate}}>
      {/* Topbar */}
      <div style={{position:'fixed',top:0,left:0,right:0,zIndex:999,height:52,background:'linear-gradient(135deg,#1A0A3B 0%,#2D1B69 50%,#1A3A6B 100%)',display:'flex',alignItems:'center',padding:'0 24px',gap:16,borderBottom:'1px solid rgba(255,255,255,.08)'}}>
        <div style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:17,color:'#fff',letterSpacing:'-.02em'}}>
          Flash<em style={{color:C.teal,fontStyle:'normal'}}>Quality</em>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(79,70,229,.35)',border:'1px solid rgba(79,70,229,.5)',padding:'4px 12px',borderRadius:100,fontSize:11,fontWeight:800,color:'#C7D2FE',letterSpacing:'.04em'}}>⬡ SUPERADMIN</div>
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,color:'rgba(255,255,255,.5)'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:C.teal}}/>Système opérationnel
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:100,background:'rgba(255,255,255,.08)',cursor:'pointer',fontSize:12,fontWeight:700,color:'#fff'}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${C.adm},#6D28D9)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:900}}>R</div>
          Romain · Admin
        </div>
      </div>

      <div style={{display:'flex',marginTop:52,minHeight:'calc(100vh - 52px)'}}>
        {/* Sidebar */}
        <div style={{width:260,flexShrink:0,background:'linear-gradient(180deg,#1A0A3B 0%,#1E1258 60%,#1A2860 100%)',display:'flex',flexDirection:'column',position:'sticky',top:52,height:'calc(100vh - 52px)',overflowY:'auto'}}>
          <div style={{margin:16,borderRadius:r,background:'linear-gradient(135deg,rgba(79,70,229,.3),rgba(79,70,229,.08))',border:'1px solid rgba(79,70,229,.35)',padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,flexShrink:0,background:`linear-gradient(135deg,${C.adm},#6D28D9)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>⬡</div>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:'#fff'}}>FlashQuality HQ</div>
              <div style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,fontWeight:700,color:'#A5B4FC',background:'rgba(79,70,229,.2)',borderRadius:100,padding:'2px 8px',marginTop:4}}>⬡ Superadmin · Côte d&apos;Azur</div>
            </div>
          </div>
          <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.2)',textTransform:'uppercase',letterSpacing:'.12em',padding:'16px 20px 6px'}}>Vue globale</div>
          {sbBtn('dash','🏠','Tableau de bord')}
          {sbBtn('alerts','🔔','Alertes',{text:'3',color:C.red})}
          {sbBtn('logs','📋','Logs système')}
          <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.2)',textTransform:'uppercase',letterSpacing:'.12em',padding:'16px 20px 6px'}}>Gestion</div>
          {sbBtn('commerces','🏪','Commerces',{text:'12',color:C.teal})}
          {sbBtn('clients','👥','Clients globaux',{text:'1 247',color:C.adm})}
          {sbBtn('onboarding','✨','Onboarding',{text:'2',color:C.amber})}
          <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.2)',textTransform:'uppercase',letterSpacing:'.12em',padding:'16px 20px 6px'}}>Revenus</div>
          {sbBtn('revenue','💰','Revenue & Stripe')}
          {sbBtn('tombola','🎰','Tombola',{text:'Actif',color:C.amber})}
          <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.2)',textTransform:'uppercase',letterSpacing:'.12em',padding:'16px 20px 6px'}}>Configuration</div>
          {sbBtn('jeux','🎮','Jeux — Kill switch')}
          {sbBtn('system','⚙️','Système & Config')}
          <div style={{height:1,background:'rgba(255,255,255,.07)',margin:'8px 16px'}}/>
          <a href="/dashboard" style={{margin:'12px',marginTop:'auto',background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:r,padding:'14px 16px',cursor:'pointer',textDecoration:'none',display:'block'}}>
            <div style={{fontSize:12,fontWeight:800,color:'rgba(255,255,255,.6)'}}>← Retour dashboard</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.3)',marginTop:2}}>admin.flashquality.app</div>
          </a>
        </div>

        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'22px 32px 18px',background:C.white,borderBottom:`1px solid ${C.bord}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <div>
              <div style={{fontWeight:900,fontSize:24,color:C.navy,lineHeight:1}}>{cur.title}</div>
              <div style={{fontSize:13,color:C.slate2,marginTop:5,fontWeight:600}}>{cur.sub}</div>
            </div>
            <div style={{display:'flex',gap:10}}>
              {panel==='dash'&&<><button onClick={()=>setPanel('logs')} style={{padding:'7px 14px',borderRadius:10,border:`1px solid ${C.bord}`,background:C.white,fontSize:12,fontWeight:800,color:C.slate,cursor:'pointer',fontFamily:F}}>📋 Logs</button><button onClick={()=>setPanel('onboarding')} style={{padding:'7px 14px',borderRadius:10,border:'none',background:C.adm,fontSize:12,fontWeight:800,color:'#fff',cursor:'pointer',fontFamily:F}}>+ Onboarding commerce</button></>}
              {panel==='commerces'&&<><button onClick={()=>notify('Export CSV téléchargé')} style={{padding:'7px 14px',borderRadius:10,border:`1px solid ${C.bord}`,background:C.white,fontSize:12,fontWeight:800,color:C.slate,cursor:'pointer',fontFamily:F}}>⬇ Export</button><button onClick={()=>setPanel('onboarding')} style={{padding:'7px 14px',borderRadius:10,border:'none',background:C.adm,fontSize:12,fontWeight:800,color:'#fff',cursor:'pointer',fontFamily:F}}>+ Nouveau commerce</button></>}
              {panel==='clients'&&<button onClick={()=>notify('Export RGPD téléchargé')} style={{padding:'7px 14px',borderRadius:10,border:`1px solid ${C.bord}`,background:C.white,fontSize:12,fontWeight:800,color:C.slate,cursor:'pointer',fontFamily:F}}>⬇ Export RGPD</button>}
              {panel==='tombola'&&<><button onClick={()=>notify('Ajout panier…')} style={{padding:'7px 14px',borderRadius:10,border:`1px solid ${C.bord}`,background:C.white,fontSize:12,fontWeight:800,color:C.slate,cursor:'pointer',fontFamily:F}}>+ Ajouter panier</button><button onClick={()=>{if(confirm('Lancer le tirage ?'))notify('🎉 Tirage lancé !')}} style={{padding:'7px 14px',borderRadius:10,border:'none',background:C.red,fontSize:12,fontWeight:800,color:'#fff',cursor:'pointer',fontFamily:F}}>🎲 Lancer tirage</button></>}
              {panel==='jeux'&&<button onClick={()=>{if(confirm('Couper tous les jeux ?'))notify('Tous les jeux coupés')}} style={{padding:'7px 14px',borderRadius:10,border:'none',background:C.red,fontSize:12,fontWeight:800,color:'#fff',cursor:'pointer',fontFamily:F}}>🛑 Couper tous les jeux</button>}
            </div>
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'28px 32px'}}>{cur.content}</div>
        </div>
      </div>

      {/* Drawer commerce */}
      {comDrawer&&(
        <div style={{position:'fixed',inset:0,zIndex:1000}}>
          <div onClick={()=>setComDrawer(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.4)',backdropFilter:'blur(4px)'}}/>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:720,background:C.white,display:'flex',flexDirection:'column',boxShadow:'-8px 0 40px rgba(0,0,0,.2)',overflow:'hidden'}}>
            <div style={{padding:'20px 24px',borderBottom:`1px solid ${C.bord}`,display:'flex',alignItems:'flex-start',gap:16,background:'linear-gradient(135deg,#1A0A3B,#1A3A6B)'}}>
              <div style={{width:56,height:56,borderRadius:16,background:'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0}}>🥖</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                  <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>Boulangerie Martin</div>
                  {pill('⭐ Pro','pro')}{pill('🎰 Tombola','active')}{pill('● Actif','active')}
                </div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.5)',marginTop:4}}>Grasse · boulangerie-martin · Onboardé le 15 jan. 2026</div>
                <div style={{display:'flex',gap:20,marginTop:12}}>
                  {[['247','clients'],['284','scans/mois'],['305','avis'],['4.8 ⭐','note moy.'],['39 €','MRR']].map(([v,l])=>(
                    <div key={l}><div style={{fontSize:20,fontWeight:900,color:'#fff',lineHeight:1}}>{v}</div><div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:2}}>{l}</div></div>
                  ))}
                </div>
              </div>
              <button onClick={()=>setComDrawer(false)} style={{background:'rgba(255,255,255,.1)',border:'none',color:'#fff',width:32,height:32,borderRadius:8,cursor:'pointer',fontSize:16,fontWeight:700}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:24,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{textAlign:'center',color:C.slate2,fontSize:14,fontWeight:600,lineHeight:2}}>
                Détails commerce complets disponibles après connexion Supabase réelle.<br/>
                Onglets : Infos · Clients · Activité · Offres · Jeux · Stripe · Admin
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer client */}
      {clientDrawer&&(
        <div style={{position:'fixed',inset:0,zIndex:1000}}>
          <div onClick={()=>setClientDrawer(false)} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.4)',backdropFilter:'blur(4px)'}}/>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:580,background:C.white,display:'flex',flexDirection:'column',boxShadow:'-8px 0 40px rgba(0,0,0,.2)'}}>
            <div style={{padding:'20px 24px',display:'flex',alignItems:'flex-start',gap:16,background:`linear-gradient(135deg,${C.diam},${C.diam2})`}}>
              <div style={{width:56,height:56,borderRadius:16,background:'rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:'#fff',flexShrink:0}}>É</div>
              <div style={{flex:1}}>
                <div style={{fontSize:20,fontWeight:900,color:'#fff'}}>Élodie V.</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.6)',marginTop:2}}>e.vernet@demo.fq · Grasse</div>
                <div style={{display:'flex',gap:8,marginTop:8}}>{pill('💎 Diamant','diam')}<span style={{fontSize:12,color:'rgba(255,255,255,.7)',fontWeight:700,alignSelf:'center'}}>1 890 XP</span></div>
              </div>
              <button onClick={()=>setClientDrawer(false)} style={{background:'rgba(255,255,255,.15)',border:'none',color:'#fff',width:32,height:32,borderRadius:8,cursor:'pointer',fontSize:16}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:24,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{textAlign:'center',color:C.slate2,fontSize:14,fontWeight:600,lineHeight:2}}>
                Profil client complet disponible après connexion Supabase réelle.<br/>
                Activité · Avis · Jeux · Tombola · RGPD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast&&(
        <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:C.navy,color:'#fff',padding:'12px 24px',borderRadius:100,fontSize:13,fontWeight:800,boxShadow:'0 8px 32px rgba(26,58,107,.3)',zIndex:9999,whiteSpace:'nowrap'}}>{toast}</div>
      )}
    </div>
  )
}
