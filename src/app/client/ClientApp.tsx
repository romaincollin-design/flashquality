'use client'
import { useState, useEffect, useRef } from 'react'
import type { JeuConfig, QuizzQuestion } from '@/lib/jeux/types'
import { isReglesQuizz, isReglesSpin, isReglesTombola } from '@/lib/jeux/types'
import { getJeuxMock } from '@/lib/jeux/mock'
import { selectActifs, tirerQuestionsQuizz, tirerSpin, readTombolaTickets, addTombolaTicket, tombolaMonthKey } from '@/lib/jeux/engine'
import { DepensesScreen, AbonnementsScreen } from '@/modules/client-autonome'

type Screen = 'home'|'review'|'offers'|'contact'|'depenses'|'carnet'|'profile'|'notifs'|'abonnements'|'jeux'|'quizz'|'spin'|'tombola'
type NavTab = 'home'|'carnet'|'depenses'|'abonnements'|'profile'

const A='#7C5CFC',AD='#5538D4',AL='#EDE8FF',BG='#F0EDE8',RC=22
const CARD:React.CSSProperties={background:'white',borderRadius:RC,border:'2.5px solid #F0EDE8',boxSizing:'border-box'}
const RATINGS=[{emoji:'😍',label:'Génial'},{emoji:'👍',label:'Top'},{emoji:'🙂',label:'Bien'},{emoji:'😐',label:'Moyen'},{emoji:'👎',label:'Décevant'},{emoji:'🚫',label:'Jamais'}]
const PROS=[{id:'t',initials:'TB',bg:'#FEF3C7',col:'#D97706',name:'Trattoria Bella',sub:'Restaurant · Nice · il y a 2j',rating:'4.7',hasFlash:true},{id:'c',initials:'PC',bg:'#ECFDF5',col:'#059669',name:'Plomberie Carrel',sub:'Artisan · Grasse · il y a 2 sem.',rating:'4.9',hasFlash:false}]
const NOTIFS=[{id:'n1',ini:'⚡',ibg:'#FEF3C7',icol:'#D97706',title:'Trattoria Bella · Offre flash',desc:'Pizza –30% ce soir jusqu’à 21h.',time:'Il y a 12 min',dot:'#FF4D6D'},{id:'n2',ini:'🏆',ibg:'#EDE8FF',icol:'#7C5CFC',title:'FlashQuality',desc:'Niveau 2 atteint ! Tests produits débloqués.',time:'Il y a 1h',dot:A}]
const SUBS=[{icon:'🏠',ibg:'#FFF1EB',name:'Assurance AXA',price:'72€/mois',date:'27/04/2026',cd:'J-14',cdc:'#DC2626'},{icon:'📡',ibg:'#EEF4FF',name:'Box Internet Orange',price:'36€/mois',date:'15/09/2026',cd:'J-155',cdc:'#10B981'},{icon:'⚡',ibg:'#F0FDF9',name:'Électricité EDF',price:'89€/mois',date:'01/01/2027',cd:'J-263',cdc:'#10B981'}]
const DEPS=[{icon:'🍽️',ibg:'#F3F0FF',name:'Trattoria Bella',cat:'Restaurant · Hier',amt:'48,50 €'},{icon:'✂️',ibg:'#FFF0FB',name:'Studio Coiff',cat:'Coiffeur · Il y a 3j',amt:'65,00 €'},{icon:'⛽',ibg:'#E0FDF4',name:'Total Énergies',cat:'Essence · Il y a 5j',amt:'82,30 €'}]

function ft(s:number){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;return (h?h+'h ':'')+String(m).padStart(2,'0')+'m '+String(sc).padStart(2,'0')+'s'}
function fs(s:number){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return (h?h+'h ':'')+String(m).padStart(2,'0')+'m'}

function SHD({title,onBack,right}:{title:string;onBack?:()=>void;right?:React.ReactNode}){
  return <div style={{padding:'12px 14px 8px',display:'flex',alignItems:'center',gap:10,background:'white',borderBottom:'2px solid #F0EDE8',flexShrink:0}}>
    {onBack&&<button onClick={onBack} style={{width:36,height:36,borderRadius:'50%',background:'#F0EDE8',border:'none',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'inherit'}}>←</button>}
    <span style={{fontSize:16,fontWeight:900,color:'#1A1033',flex:1}} dangerouslySetInnerHTML={{__html:title}}/>
    {right}
  </div>
}

export default function ClientApp({pro,offres:offresSupabase,slug}:{pro:any,offres:any[],slug:string|null}){
  const [screen,setScreen]=useState<Screen>('home')
  const [nav,setNav]=useState<NavTab>('home')
  const [rating,setRating]=useState<number|null>(null)
  const [comment,setComment]=useState('')
  const [vis,setVis]=useState<'pro'|'public'>('pro')
  const [cel,setCel]=useState(false)
  const [depCel,setDepCel]=useState(false)
  const [secs,setSecs]=useState(6138)
  const [aiL,setAiL]=useState(false)
  const [aiD,setAiD]=useState(false)
  const [dPre,setDPre]=useState('')
  const [dAmt,setDAmt]=useState('')
  const [dCat,setDCat]=useState('🍽️ Resto')
  const OFFRES=offresSupabase||[]
  const OF=OFFRES[0]||null
  const PRO={name:pro?.nom||'Commerce',sub:(pro?.categorie||'')+' · '+(pro?.adresse||''),badge:pro?.categorie||'',initials:(pro?.nom||'C').split(' ').map((w:string)=>w[0]||'').join('').slice(0,2).toUpperCase(),avatarBg:'#FEF3C7',avatarCol:'#D97706',rating:'4.7',tel:pro?.tel||'',addr:pro?.adresse||'',hours:''}
  const [showMsg,setShowMsg]=useState(false)
  const [msg,setMsg]=useState('')
  const [cf,setCf]=useState('all')
  const fref=useRef<HTMLInputElement>(null)
  const [clientId,setClientId]=useState<string|null>(null)
  const [checkingAuth,setCheckingAuth]=useState(true)
  const [regPrenom,setRegPrenom]=useState('')
  const [regEmail,setRegEmail]=useState('')
  const [regVille,setRegVille]=useState('')
  const [regTranche,setRegTranche]=useState<''|'18-25'|'26-35'|'36-50'|'50+'>('')
  const [regRgpd,setRegRgpd]=useState(false)
  const [regSubmitting,setRegSubmitting]=useState(false)
  const [regError,setRegError]=useState('')

  useEffect(()=>{try{const id=localStorage.getItem('fq_client_id');if(id)setClientId(id)}catch{}setCheckingAuth(false)},[])
  useEffect(()=>{const iv=setInterval(()=>setSecs(s=>Math.max(0,s-1)),1000);return()=>clearInterval(iv)},[])

  // --- XP + actions (preview: localStorage ; prod: table xp_events + jeux_config.regles) ---
  type ActionType='avis'|'partage'|'quizz'
  const XP_CONFIG:Record<ActionType,{xp:number;label:string}>={avis:{xp:10,label:'Avis envoy\u00e9'},partage:{xp:5,label:'Fiche partag\u00e9e'},quizz:{xp:15,label:'Quizz r\u00e9ussi'}}
  const MAX_ACTIONS_PER_DAY=3
  const todayKey=()=>new Date().toISOString().slice(0,10)
  const actionsKey=(cid:string,pid:string)=>`fq_actions_${cid}_${pid}_${todayKey()}`
  const xpKey=(cid:string)=>`fq_xp_${cid}`
  const [todayActions,setTodayActions]=useState<Array<{type:ActionType;xp:number;at:number}>>([])
  const [totalXp,setTotalXp]=useState(0)
  const [xpToast,setXpToast]=useState<{xp:number;label:string}|null>(null)

  useEffect(()=>{
    if(!clientId||!pro?.id)return
    try{
      const raw=localStorage.getItem(actionsKey(clientId,pro.id))
      setTodayActions(raw?JSON.parse(raw):[])
      const xp=localStorage.getItem(xpKey(clientId))
      setTotalXp(xp?parseInt(xp,10)||0:0)
    }catch{}
  },[clientId,pro?.id])

  function tryAction(type:ActionType):{ok:boolean;xp?:number;reason?:'limite'}{
    if(!clientId||!pro?.id)return {ok:false,reason:'limite'}
    if(todayActions.length>=MAX_ACTIONS_PER_DAY)return {ok:false,reason:'limite'}
    const cfg=XP_CONFIG[type]
    const entry={type,xp:cfg.xp,at:Date.now()}
    const next=[...todayActions,entry]
    const nextXp=totalXp+cfg.xp
    try{
      localStorage.setItem(actionsKey(clientId,pro.id),JSON.stringify(next))
      localStorage.setItem(xpKey(clientId),String(nextXp))
    }catch{}
    setTodayActions(next)
    setTotalXp(nextXp)
    setXpToast({xp:cfg.xp,label:cfg.label})
    setTimeout(()=>setXpToast(null),2500)
    return {ok:true,xp:cfg.xp}
  }
  const actionsLeft=MAX_ACTIONS_PER_DAY-todayActions.length
  const limitReached=actionsLeft<=0

  // --- Jeux (preview: mock; prod: fetch jeux_config par pro_id) ---
  const [jeux,setJeux]=useState<JeuConfig[]>([])
  const [tombolaTickets,setTombolaTickets]=useState(0)
  const [quizzQuestions,setQuizzQuestions]=useState<QuizzQuestion[]>([])
  const [quizzIdx,setQuizzIdx]=useState(0)
  const [quizzPicked,setQuizzPicked]=useState<number|null>(null)
  const [quizzCorrect,setQuizzCorrect]=useState(0)
  const [quizzDone,setQuizzDone]=useState(false)
  const [spinRot,setSpinRot]=useState(0)
  const [spinning,setSpinning]=useState(false)
  const [spinResult,setSpinResult]=useState<{label:string;gain:string;color:string}|null>(null)

  useEffect(()=>{
    if(!pro?.id)return
    setJeux(getJeuxMock(pro.id))
  },[pro?.id])

  useEffect(()=>{
    if(!clientId||!pro?.id)return
    setTombolaTickets(readTombolaTickets(clientId,pro.id))
  },[clientId,pro?.id])

  const actifs=selectActifs(jeux)
  const jeuTombola=actifs.find(isReglesTombola)
  const jeuBonus=actifs.find(j=>j.jeu_type!=='tombola')

  function startQuizz(){
    const q=jeux.find(isReglesQuizz)
    if(!q)return
    setQuizzQuestions(tirerQuestionsQuizz(q.regles.questions,q.regles.nb_par_session))
    setQuizzIdx(0);setQuizzPicked(null);setQuizzCorrect(0);setQuizzDone(false)
    go('quizz')
  }
  function pickQuizz(i:number){
    if(quizzPicked!==null)return
    setQuizzPicked(i)
    const good=quizzQuestions[quizzIdx].bonne===i
    if(good)setQuizzCorrect(c=>c+1)
    setTimeout(()=>{
      if(quizzIdx+1<quizzQuestions.length){setQuizzIdx(quizzIdx+1);setQuizzPicked(null)}
      else finishQuizz(good?quizzCorrect+1:quizzCorrect)
    },900)
  }
  function finishQuizz(score:number){
    setQuizzDone(true)
    const reussi=score===quizzQuestions.length
    if(reussi){
      const r=tryAction('quizz')
      if(r.ok&&clientId&&pro?.id){
        const n=addTombolaTicket(clientId,pro.id,1)
        setTombolaTickets(n)
      }
    }
  }
  function startSpin(){
    const s=jeux.find(isReglesSpin)
    if(!s||spinning)return
    if(limitReached)return
    setSpinning(true);setSpinResult(null)
    const {index,segment}=tirerSpin(s.regles)
    const seg=360/s.regles.segments.length
    const target=3600+(360-(index*seg+seg/2))
    setSpinRot(target)
    setTimeout(()=>{
      setSpinning(false)
      setSpinResult({label:segment.label,gain:segment.gain,color:segment.color})
      tryAction('quizz')
    },3200)
  }

  function handleRegister(){
    setRegError('')
    if(!regPrenom.trim())return setRegError('Pr\u00e9nom requis')
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail))return setRegError('Email invalide')
    if(!regVille.trim())return setRegError('Ville requise')
    if(!regTranche)return setRegError('Tranche d\u2019\u00e2ge requise')
    if(!regRgpd)return setRegError('Consentement requis')
    setRegSubmitting(true)
    setTimeout(()=>{
      const id=(typeof crypto!=='undefined'&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2)
      try{localStorage.setItem('fq_client_id',id)}catch{}
      setClientId(id)
      setRegSubmitting(false)
    },800)
  }

  function Inscription(){
    const IN:React.CSSProperties={width:'100%',padding:'12px 14px',borderRadius:14,border:'2px solid #F0EDE8',fontSize:14,fontFamily:'inherit',fontWeight:700,color:'#1A1033',outline:'none',boxSizing:'border-box',background:'white'}
    const TRANCHES:Array<'18-25'|'26-35'|'36-50'|'50+'>=['18-25','26-35','36-50','50+']
    return <div style={{minHeight:'100vh',background:'#1A1033',display:'flex',justifyContent:'center',padding:'24px 16px',fontFamily:"'Nunito',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Fredoka:wght@500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{width:'100%',maxWidth:430,display:'flex',flexDirection:'column',gap:16}}>
        <div style={{textAlign:'center',color:'white',padding:'8px 0 4px'}}>
          <div style={{fontSize:28,marginBottom:6}}>{'\u{1F44B}'}</div>
          <div style={{fontSize:22,fontWeight:900,letterSpacing:'-.02em'}}>Bienvenue chez {PRO.name}</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.7)',fontWeight:700,marginTop:4}}>Cr\u00e9e ton compte FlashQuality en 20s</div>
        </div>
        <div style={{...CARD,padding:18,display:'flex',flexDirection:'column',gap:12}}>
          <div>
            <label style={{fontSize:11,fontWeight:800,color:'#6B6760',textTransform:'uppercase',letterSpacing:'.08em'}}>Pr\u00e9nom</label>
            <input style={{...IN,marginTop:6}} value={regPrenom} onChange={e=>setRegPrenom(e.target.value)} placeholder="Ton pr\u00e9nom"/>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:800,color:'#6B6760',textTransform:'uppercase',letterSpacing:'.08em'}}>Email</label>
            <input type="email" style={{...IN,marginTop:6}} value={regEmail} onChange={e=>setRegEmail(e.target.value)} placeholder="toi@email.com"/>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:800,color:'#6B6760',textTransform:'uppercase',letterSpacing:'.08em'}}>Ville</label>
            <input style={{...IN,marginTop:6}} value={regVille} onChange={e=>setRegVille(e.target.value)} placeholder="Nice, Grasse..."/>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:800,color:'#6B6760',textTransform:'uppercase',letterSpacing:'.08em'}}>Tranche d&apos;\u00e2ge</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:6}}>
              {TRANCHES.map(t=>{const on=regTranche===t;return <button key={t} type="button" onClick={()=>setRegTranche(t)} style={{padding:'10px 8px',borderRadius:12,border:`2px solid ${on?A:'#F0EDE8'}`,background:on?AL:'white',color:on?A:'#1A1033',fontWeight:800,fontSize:13,cursor:'pointer',fontFamily:'inherit',boxSizing:'border-box'}}>{t}</button>})}
            </div>
          </div>
          <label style={{display:'flex',gap:10,alignItems:'flex-start',cursor:'pointer',padding:'8px 2px'}}>
            <input type="checkbox" checked={regRgpd} onChange={e=>setRegRgpd(e.target.checked)} style={{marginTop:3,width:18,height:18,accentColor:A,cursor:'pointer'}}/>
            <span style={{fontSize:12,color:'#6B6760',fontWeight:700,lineHeight:1.4}}>J&apos;accepte que FlashQuality traite mes donn\u00e9es pour la gestion de mon compte et l&apos;envoi d&apos;offres du commerce. RGPD.</span>
          </label>
          {regError&&<div style={{background:'#FEE2E2',color:'#B91C1C',padding:'10px 12px',borderRadius:12,fontSize:12,fontWeight:800}}>{regError}</div>}
          <button onClick={handleRegister} disabled={regSubmitting} style={{background:regSubmitting?'#B8A9FF':A,color:'white',border:'none',borderRadius:100,padding:'14px 20px',fontSize:15,fontWeight:900,cursor:regSubmitting?'wait':'pointer',fontFamily:'inherit',marginTop:4,boxShadow:`0 4px 0 ${AD}`}}>{regSubmitting?'Inscription...':'Cr\u00e9er mon compte'}</button>
        </div>
        <div style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,.5)',fontWeight:700}}>Aucune carte bancaire \u2022 R\u00e9siliable \u00e0 tout moment</div>
      </div>
    </div>
  }
  const go=(s:Screen)=>setScreen(s)
  const nt=(n:NavTab,s:Screen)=>{setNav(n);setScreen(s)}
  const ai=()=>{setAiL(true);setAiD(false);setTimeout(()=>{setDPre(pro?.nom||'Commerce');setDAmt('48.50');setAiL(false);setAiD(true)},1800)}

  function AC({hot,onClick,badge,bc,icon,title,sub,ac}:{hot?:boolean;onClick:()=>void;badge?:string;bc?:string;icon:string;title:string;sub:string;ac?:string}){
    return <div onClick={onClick} style={{background:hot?AL:ac?'#D1FAF0':'white',borderRadius:RC,padding:'14px 12px 12px',cursor:'pointer',border:`2px solid ${hot?A:ac||'#E8E4DC'}`,position:'relative',overflow:'hidden',boxShadow:'0 2px 10px rgba(0,0,0,.07)',boxSizing:'border-box'}}>
      {badge&&<div style={{position:'absolute',top:10,right:10,background:bc||A,color:'white',fontSize:9,fontWeight:900,padding:'2px 7px',borderRadius:100}}>{badge}</div>}
      <div style={{fontSize:28,lineHeight:1,marginBottom:5}}>{icon}</div>
      <div style={{fontSize:13,fontWeight:900,color:ac||(hot?A:undefined)||'#1A1033'}}>{title}</div>
      <div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{sub}</div>
    </div>
  }

  const Home=()=><div style={{flex:1,overflowY:'auto'} as React.CSSProperties}>
    <div style={{background:A,padding:'18px 16px',position:'relative',overflow:'hidden',borderRadius:RC,margin:'12px 12px 0',border:'2.5px solid rgba(255,255,255,.15)',boxShadow:`0 8px 28px rgba(124,92,252,.45),0 2px 0 ${AD}`}}>
      <div style={{position:'absolute',width:140,height:140,top:-50,right:-40,borderRadius:'50%',background:'rgba(255,255,255,.1)'}}/>
      <div style={{position:'absolute',width:80,height:80,bottom:-20,right:70,borderRadius:'50%',background:'rgba(255,255,255,.1)'}}/>
      <div style={{fontSize:9,fontWeight:800,color:'rgba(255,255,255,.55)',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:4}}>Bienvenue chez</div>
      <div style={{fontSize:22,fontWeight:900,color:'white',lineHeight:1.1,letterSpacing:'-.03em',marginBottom:4}}>{PRO.name}</div>
      <div style={{fontSize:12,color:'rgba(255,255,255,.75)',fontWeight:700,marginBottom:14}}>{PRO.sub}</div>
      <div style={{display:'flex',gap:7}}>
        <div style={{display:'inline-flex',alignItems:'center',background:'rgba(255,255,255,.22)',border:'1px solid rgba(255,255,255,.35)',borderRadius:100,padding:'5px 11px',fontSize:10,color:'white',fontWeight:800}}>✓ Vérifié</div>
        <div style={{display:'inline-flex',alignItems:'center',background:'rgba(255,255,255,.22)',border:'1px solid rgba(255,255,255,.35)',borderRadius:100,padding:'5px 11px',fontSize:10,color:'white',fontWeight:800}}>{'🍽️'} {PRO.badge}</div>
      </div>
      <div style={{position:'absolute',top:14,right:14,background:'rgba(255,255,255,.22)',backdropFilter:'blur(12px)',border:'1.5px solid rgba(255,255,255,.4)',borderRadius:RC,padding:'8px 12px',textAlign:'center'}}>
        <div style={{fontSize:20,fontWeight:900,color:'white',lineHeight:1,fontFamily:"'Fredoka',sans-serif"}}>{PRO.rating}</div>
        <div style={{fontSize:9,color:'rgba(255,255,255,.7)',fontWeight:800}}>⭐ note</div>
      </div>
      <div style={{marginTop:14,background:'rgba(255,255,255,.15)',borderRadius:100,height:7,overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:100,background:'rgba(255,255,255,.7)',width:'67%'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'8px 0 2px'}}>
        <span style={{fontSize:10,color:'rgba(255,255,255,.85)',fontWeight:800}}>{totalXp} XP \u00b7 {todayActions.length}/{MAX_ACTIONS_PER_DAY} actions auj.</span>
        <span style={{display:'inline-flex',gap:4}}>{Array.from({length:MAX_ACTIONS_PER_DAY}).map((_,i)=><span key={i} style={{width:7,height:7,borderRadius:'50%',background:i<todayActions.length?'white':'rgba(255,255,255,.3)'}}/>)}</span>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'12px 12px 0'}}>
      <AC hot onClick={()=>go('review')} badge="+10 XP" icon="⭐" title="Mon avis" sub="Exp. rapide"/>
      <AC onClick={()=>go('offers')} badge="⚡ 2" bc="#FF4D6D" icon="⚡" title="Offres flash" sub="2 actives"/>
      <AC onClick={()=>go('contact')} icon="💬" title="Contacter" sub="Message · Appel"/>
      <AC onClick={()=>nt('depenses','depenses')} icon="🧾" title="Dépenses" sub="Photo ticket · TVA" ac="#10B981"/>
    </div>
    <div onClick={()=>go('jeux')} style={{margin:'10px 12px 0',background:'linear-gradient(135deg,#F59E0B,#DC2626)',borderRadius:RC,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',boxShadow:'0 8px 24px rgba(245,158,11,.4)',border:'1.5px solid rgba(255,255,255,.15)'}}>
      <div style={{fontSize:32,flexShrink:0}}>{'\u{1F3B2}'}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:900,color:'white'}}>Jouer &amp; gagner</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.85)',fontWeight:700,marginTop:2}}>{tombolaTickets} ticket{tombolaTickets>1?'s':''} tombola ce mois-ci</div>
        <div style={{fontSize:10,color:'rgba(255,255,255,.7)',marginTop:3,fontWeight:700}}>{'\u{1F3C6}'} Tirage fin {tombolaMonthKey()}</div>
      </div>
      <div style={{background:'rgba(255,255,255,.25)',border:'1.5px solid rgba(255,255,255,.45)',borderRadius:100,padding:'6px 12px',fontSize:16,fontWeight:900,color:'white',fontFamily:"'Fredoka',sans-serif"}}>{tombolaTickets}</div>
    </div>
    <div onClick={()=>go('offers')} style={{margin:'10px 12px 0',background:`linear-gradient(135deg,${A},${AD})`,borderRadius:RC,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',boxShadow:'0 8px 24px rgba(124,92,252,.4)',border:'1.5px solid rgba(255,255,255,.1)'}}>
      <div style={{fontSize:32,flexShrink:0}}>{'🍕'}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:900,color:'white'}}>Pizza –30% ce soir</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.75)',fontWeight:700,marginTop:2}}>Toutes nos pizzas maison jusqu&apos;à 21h</div>
        <div style={{fontSize:10,color:'rgba(255,255,255,.55)',marginTop:3,fontWeight:700}}>{'⏱'} Expire dans {ft(secs)}</div>
      </div>
      <div style={{fontSize:20,color:'rgba(255,255,255,.5)'}}>›</div>
    </div>
    <div style={{padding:'14px 12px 0'}}>
      <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10,paddingTop:12,borderTop:'2px solid #F0EDE8'}}>Mes prestataires récents</div>
      {PROS.map(p=><div key={p.id} onClick={()=>go('contact')} style={{...CARD,display:'flex',alignItems:'center',gap:11,padding:'12px 13px',marginBottom:9,cursor:'pointer',boxShadow:'0 2px 10px rgba(0,0,0,.07)',position:'relative'}}>
        <div style={{width:46,height:46,borderRadius:RC,background:p.bg,color:p.col,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,flexShrink:0}}>{p.initials}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>{p.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{p.sub}</div></div>
        <div style={{background:A,color:'white',fontSize:11,fontWeight:900,padding:'3px 8px',borderRadius:100}}>{p.rating} ⭐</div>
        {p.hasFlash&&<div style={{position:'absolute',top:10,right:34,fontSize:9,fontWeight:900,background:'#FF4D6D',color:'white',padding:'2px 6px',borderRadius:100}}>⚡</div>}
        <div style={{fontSize:18,color:'#D0CEC9',marginLeft:4}}>›</div>
      </div>)}
    </div>
    <div style={{height:12}}/>
  </div>

  const Review=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Ton avis" onBack={()=>go('home')}/>
    <div style={{flex:1,overflowY:'auto'}}>
      <div style={{padding:'14px 18px 12px',textAlign:'center'}}>
        <div style={{fontSize:17,fontWeight:900,color:'#1A1033',lineHeight:1.3}}>Comment était ta pizza ?</div>
        <div style={{fontSize:12,color:'#B0ADA8',fontWeight:700,marginTop:3}}>10 secondes max · +10 XP {'🎉'}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,padding:'0 13px 12px'}}>
        {RATINGS.map((r,i)=><div key={i} onClick={()=>setRating(i)} style={{background:rating===i?AL:'white',border:`2.5px solid ${rating===i?A:'#F0EDE8'}`,borderRadius:RC,padding:'13px 8px',textAlign:'center',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4,boxSizing:'border-box'}}>
          <div style={{fontSize:28,lineHeight:1}}>{r.emoji}</div>
          <div style={{fontSize:10,fontWeight:800,color:rating===i?A:'#B0ADA8'}}>{r.label}</div>
        </div>)}
      </div>
      <div style={{padding:'0 13px 10px'}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6}}>Un détail ? (optionnel)</div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} placeholder="Ex : les pâtes étaient parfaites" style={{width:'100%',border:'2.5px solid #F0EDE8',borderRadius:RC,padding:'11px 13px',fontSize:13,fontWeight:700,color:'#1A1033',background:'#FAFAF8',fontFamily:'inherit',resize:'none',outline:'none',boxSizing:'border-box'}}/>
      </div>
      <div style={{display:'flex',gap:8,padding:'0 13px 10px'}}>
        {(['pro','public'] as const).map(v=><div key={v} onClick={()=>setVis(v)} style={{flex:1,padding:'8px 12px',borderRadius:RC,border:`2px solid ${vis===v?A:'#F0EDE8'}`,background:vis===v?AL:'white',textAlign:'center',fontSize:12,fontWeight:800,color:vis===v?A:'#B0ADA8',cursor:'pointer',boxSizing:'border-box'}}>
          {v==='pro'?'🔒 Pro seulement':'🌍 Communauté'}
        </div>)}
      </div>
      <div style={{padding:'0 13px 16px'}}>
        <button onClick={()=>{if(rating===null)return;if(limitReached)return;const r=tryAction('avis');if(r.ok)setCel(true)}} disabled={rating===null||limitReached} style={{width:'100%',padding:14,borderRadius:100,background:(rating!==null&&!limitReached)?A:'#D0CEC9',color:'white',fontSize:14,fontWeight:900,border:'none',cursor:(rating!==null&&!limitReached)?'pointer':'not-allowed',fontFamily:'inherit',marginBottom:10,boxSizing:'border-box'}}>{limitReached?'Limite du jour atteinte':'Envoyer \u{1F680}'}</button>
        <div style={{textAlign:'center',fontSize:11,color:'#B0ADA8',fontWeight:700}}>{limitReached?'Reviens demain pour gagner plus d\u2019XP \u{1F31F}':'Aucun compte requis \u00b7 Anonyme par d\u00e9faut'}</div>
      </div>
    </div>
  </div>

  const Offers=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Offres &amp; expériences" onBack={()=>go('home')}/>
    <div style={{flex:1,overflowY:'auto',padding:'12px 13px'}}>
      <div style={{...CARD,border:`2.5px solid ${A}`,marginBottom:10,overflow:'hidden'}}>
        <div style={{padding:'12px 13px 10px',display:'flex',gap:10,alignItems:'flex-start'}}>
          <div style={{width:44,height:44,borderRadius:RC,background:AL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{'🍕'}</div>
          <div><div style={{display:'inline-block',background:AL,color:A,fontSize:10,fontWeight:900,padding:'3px 9px',borderRadius:100,marginBottom:4}}>⚡ Vente flash</div><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Pizza –30% ce soir</div></div>
        </div>
        <div style={{padding:'0 13px 10px',fontSize:12,color:'#A8A5A0',fontWeight:700,lineHeight:1.5}}>Toutes nos pizzas maison jusqu&apos;à 21h. Sur place ou à emporter.</div>
        <div style={{padding:'0 13px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{background:'#FFE8EC',color:'#FF4D6D',fontSize:11,fontWeight:800,padding:'4px 10px',borderRadius:100}}>⏱ {fs(secs)}</div>
          <button style={{background:A,color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Je veux ça !</button>
        </div>
      </div>
      <div style={{...CARD,marginBottom:10,overflow:'hidden'}}>
        <div style={{padding:'12px 13px 10px',display:'flex',gap:10,alignItems:'flex-start'}}>
          <div style={{width:44,height:44,borderRadius:RC,background:'#EEF4FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{'🎖️'}</div>
          <div><div style={{display:'inline-block',background:'#EEF4FF',color:'#3A86FF',fontSize:10,fontWeight:900,padding:'3px 9px',borderRadius:100,marginBottom:4}}>Test produit</div><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Soirée dégustation</div></div>
        </div>
        <div style={{padding:'0 13px 10px',fontSize:12,color:'#A8A5A0',fontWeight:700,lineHeight:1.5}}>Nouveau menu en avant-première. 8 places seulement.</div>
        <div style={{padding:'0 13px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{background:'#E0FDF4',color:'#10B981',fontSize:11,fontWeight:800,padding:'4px 10px',borderRadius:100}}>{'📅'} Vendredi 20h</div>
          <button style={{background:'#3A86FF',color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>M&apos;inscrire</button>
        </div>
      </div>
      <div style={{background:AL,borderRadius:RC,padding:'14px 13px',border:'2.5px dashed rgba(124,92,252,.28)',textAlign:'center'}}>
        <div style={{fontSize:14,fontWeight:900,color:'#1A1033',marginBottom:3}}>{'🔔'} Recevoir les prochaines offres</div>
        <div style={{fontSize:11,color:'#A8A5A0',fontWeight:700,marginBottom:12}}>Notifié·e quand {PRO.name} publie une offre</div>
        <button style={{width:'100%',padding:12,borderRadius:100,background:A,color:'white',fontSize:13,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'inherit',boxSizing:'border-box'}}>M&apos;abonner gratuitement</button>
      </div>
    </div>
  </div>

  const Contact=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Contacter" onBack={()=>go('home')}/>
    <div style={{flex:1,overflowY:'auto'}}>
      <div style={{margin:'12px 13px 0',...CARD,padding:14}}>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:12}}>
          <div style={{width:48,height:48,borderRadius:RC,background:PRO.avatarBg,color:PRO.avatarCol,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,flexShrink:0}}>{PRO.initials}</div>
          <div><div style={{fontSize:16,fontWeight:900,color:'#1A1033'}}>{PRO.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{PRO.sub}</div></div>
        </div>
        {([['📞',PRO.tel],['📍',PRO.addr],['🕓',PRO.hours]] as [string,string][]).map(([ico,val])=><div key={val} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:10,background:'#F0F4F9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{ico}</div>
          <span style={{fontSize:13,fontWeight:700,color:'#1A1033'}}>{val}</span>
        </div>)}
      </div>
      <div style={{padding:'12px 13px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <a href={`tel:${PRO.tel.replace(/\s/g,'')}`} style={{background:AL,border:`2px solid ${A}`,borderRadius:RC,padding:'12px 8px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:'pointer',textDecoration:'none'}}>
          <div style={{fontSize:22}}>{'📞'}</div><div style={{fontSize:11,fontWeight:900,color:A}}>Appeler</div>
        </a>
        <div onClick={()=>setShowMsg(!showMsg)} style={{background:'white',border:'2px solid #E8E4DC',borderRadius:RC,padding:'12px 8px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:'pointer'}}>
          <div style={{fontSize:22}}>{'💬'}</div><div style={{fontSize:11,fontWeight:900,color:'#1A1033'}}>Message</div>
        </div>
      </div>
      {showMsg&&<div style={{margin:'10px 13px 0'}}>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={3} placeholder="Votre message..." style={{width:'100%',border:'2.5px solid #F0EDE8',borderRadius:RC,padding:'11px 13px',fontSize:13,fontWeight:700,fontFamily:'inherit',resize:'none',outline:'none',boxSizing:'border-box'}}/>
        <button style={{width:'100%',marginTop:8,padding:12,borderRadius:100,background:A,color:'white',fontSize:13,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'inherit',boxSizing:'border-box'}}>Envoyer</button>
      </div>}
      <div style={{padding:'12px 13px 14px'}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:9}}>⚡ Offre active</div>
        <div onClick={()=>go('offers')} style={{...CARD,border:`2.5px solid ${A}`,padding:'12px 13px',cursor:'pointer'}}>
          <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:7}}>
            <div style={{width:36,height:36,borderRadius:10,background:AL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>⚡</div>
            <div><div style={{display:'inline-block',background:AL,color:A,fontSize:10,fontWeight:900,padding:'3px 9px',borderRadius:100,marginBottom:4}}>Vente flash</div><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Pizza –30% ce soir</div></div>
          </div>
          <div style={{fontSize:12,color:'#A8A5A0',fontWeight:700,lineHeight:1.5,marginBottom:9}}>Toutes nos pizzas maison jusqu&apos;à 21h.</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{background:'#FFE8EC',color:'#FF4D6D',fontSize:11,fontWeight:800,padding:'4px 10px',borderRadius:100}}>⏱ Expire bientôt</div>
            <button style={{background:A,color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Voir l&apos;offre</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  const Depenses=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <div style={{background:'linear-gradient(135deg,#10B981,#059669)',padding:'18px 18px 16px',flexShrink:0}}>
      <div style={{fontSize:19,fontWeight:900,color:'white',marginBottom:2}}>{'🧾'} Mes dépenses</div>
      <div style={{fontSize:12,color:'rgba(255,255,255,.7)',fontWeight:700,marginBottom:12}}>Photo ticket · Suivi · Historique</div>
      <div style={{display:'flex',gap:12}}>
        {([['324€','Ce mois'],['12','Tickets'],['6','Catégories']] as [string,string][]).map(([v,l])=><div key={l} style={{background:'rgba(255,255,255,.15)',borderRadius:12,padding:'8px 12px',textAlign:'center'}}>
          <div style={{fontSize:18,fontWeight:900,color:'white',fontFamily:"'Fredoka',sans-serif"}}>{v}</div>
          <div style={{fontSize:9,color:'rgba(255,255,255,.65)',fontWeight:800,marginTop:2}}>{l}</div>
        </div>)}
      </div>
    </div>
    <div style={{flex:1,overflowY:'auto',paddingBottom:16}}>
      <div style={{margin:'12px 12px 0',background:'white',borderRadius:RC,border:'2px solid #E8E4DC',padding:14}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Répartition ce mois</div>
        <div style={{display:'flex',gap:6,alignItems:'flex-end',height:72}}>
          {([['55px',A,'Resto'],['38px','#EC4899','Beauté'],['28px','#F59E0B','Sortie'],['22px','#06B6D4','Coiffeur'],['42px','#10B981','Essence'],['18px','#B0ADA8','Autre']] as [string,string,string][]).map(([h,c,l])=><div key={l} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <div style={{width:'100%',height:h,background:c,borderRadius:'6px 6px 0 0'}}/>
            <div style={{fontSize:9,color:'#B0ADA8',fontWeight:700}}>{l}</div>
          </div>)}
        </div>
      </div>
      <div style={{margin:'10px 12px 0'}}>
        <div onClick={()=>fref.current?.click()} style={{background:'white',borderRadius:RC,border:'2.5px dashed #D0CEC9',padding:'20px 16px',textAlign:'center',cursor:'pointer'}}>
          <div style={{fontSize:32,marginBottom:6}}>{'📸'}</div>
          <div style={{fontSize:14,fontWeight:900,color:'#1A1033',marginBottom:2}}>Scanner un ticket</div>
          <div style={{fontSize:12,color:'#B0ADA8',fontWeight:700}}>Photo · Galerie · PDF</div>
        </div>
        <input ref={fref} type="file" accept="image/*" style={{display:'none'}}/>
        <div style={{textAlign:'center',marginTop:8}}>
          <button onClick={ai} style={{display:'inline-flex',alignItems:'center',gap:6,background:aiD?'linear-gradient(135deg,#10B981,#34D399)':`linear-gradient(135deg,${A},${AD})`,color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit',opacity:aiL?0.7:1}}>
            {aiL?'✦ Analyse en cours…':aiD?'✦ Extraction complète !':'✦ Identifier avec l’IA'}
          </button>
        </div>
      </div>
      {aiD&&<div style={{margin:'10px 12px 0',background:'white',borderRadius:RC,border:`2.5px solid ${A}`,overflow:'hidden'}}>
        <div style={{background:`linear-gradient(135deg,${A},${AD})`,padding:'10px 13px',display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'white'}}>✦</div>
          <div style={{fontSize:13,fontWeight:900,color:'white'}}>Identification automatique</div>
        </div>
        <div style={{padding:'12px 13px'}}>
          {([['Prestataire','Trattoria Bella'],['Catégorie','🍽️ Restauration'],['Date',new Date().toLocaleDateString('fr-FR')],['Montant','48,50 €']] as [string,string][]).map(([l,v])=><div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #F0EDE8'}}>
            <span style={{fontSize:12,color:'#B0ADA8',fontWeight:700}}>{l}</span>
            <span style={{fontSize:12,fontWeight:900,color:'#1A1033'}}>{v}</span>
          </div>)}
        </div>
      </div>}
      <div style={{margin:'10px 12px 0',background:'white',borderRadius:RC,border:'2px solid #E8E4DC',padding:14}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}}>Prestataire</div>
            <input value={dPre} onChange={e=>setDPre(e.target.value)} placeholder="Nom…" style={{width:'100%',border:'2px solid #F0EDE8',borderRadius:12,padding:'8px 10px',fontSize:13,fontWeight:700,color:'#1A1033',fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}}>Montant</div>
            <input value={dAmt} onChange={e=>setDAmt(e.target.value)} type="number" step="0.01" placeholder="0,00 €" style={{width:'100%',border:'2px solid #F0EDE8',borderRadius:12,padding:'8px 10px',fontSize:13,fontWeight:700,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:7}}>Catégorie</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['🍽️ Resto','💅 Beauté','🎭 Sortie','✂️ Coiffeur','⛽ Essence','🏥 Santé','📦 Autre'].map(cat=><div key={cat} onClick={()=>setDCat(cat)} style={{padding:'6px 12px',borderRadius:100,border:`2px solid ${dCat===cat?A:'#E8E4DC'}`,background:dCat===cat?AL:'white',fontSize:12,fontWeight:800,color:dCat===cat?A:'#B0ADA8',cursor:'pointer'}}>{cat}</div>)}
          </div>
        </div>
        <button onClick={()=>setDepCel(true)} style={{width:'100%',padding:12,borderRadius:100,background:'#10B981',color:'white',fontSize:13,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'inherit',boxSizing:'border-box'}}>{'💾'} Enregistrer</button>
      </div>
      <div style={{margin:'12px 12px 0'}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:9}}>Historique récent</div>
        {DEPS.map(d=><div key={d.name} style={{...CARD,display:'flex',alignItems:'center',gap:10,padding:'12px 13px',marginBottom:8}}>
          <div style={{width:36,height:36,borderRadius:10,background:d.ibg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{d.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:900,color:'#1A1033'}}>{d.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{d.cat}</div></div>
          <div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>{d.amt}</div>
        </div>)}
      </div>
    </div>
  </div>

  const Carnet=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Mes lieux" right={<span style={{fontSize:12,fontWeight:800,color:A,cursor:'pointer'}}>+ Ajouter</span>}/>
    <div style={{display:'flex',gap:6,padding:'10px 13px 0',overflowX:'auto',flexShrink:0}}>
      {[{id:'all',label:'Tous'},{id:'resto',label:'🍽️ Resto'},{id:'beaute',label:'💅 Beauté'},{id:'artisan',label:'🔧 Artisan'}].map(c=><div key={c.id} onClick={()=>setCf(c.id)} style={{whiteSpace:'nowrap',padding:'6px 13px',borderRadius:100,border:`2px solid ${cf===c.id?'transparent':'#F0EDE8'}`,background:cf===c.id?A:'white',fontSize:11,fontWeight:800,color:cf===c.id?'white':'#B0ADA8',cursor:'pointer'}}>{c.label}</div>)}
    </div>
    <div style={{flex:1,overflowY:'auto',padding:'10px 13px 14px'}}>
      {PROS.map(p=><div key={p.id} onClick={()=>go('contact')} style={{...CARD,display:'flex',alignItems:'center',gap:11,padding:'12px 13px',marginBottom:9,cursor:'pointer',boxShadow:'0 2px 10px rgba(0,0,0,.07)',position:'relative'}}>
        <div style={{width:46,height:46,borderRadius:RC,background:p.bg,color:p.col,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,flexShrink:0}}>{p.initials}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>{p.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{p.sub}</div></div>
        <div style={{background:A,color:'white',fontSize:11,fontWeight:900,padding:'3px 8px',borderRadius:100}}>{p.rating} ⭐</div>
        {p.hasFlash&&<div style={{position:'absolute',top:10,right:34,fontSize:9,fontWeight:900,background:'#FF4D6D',color:'white',padding:'2px 6px',borderRadius:100}}>⚡</div>}
        <div style={{fontSize:18,color:'#D0CEC9',marginLeft:4}}>›</div>
      </div>)}
    </div>
  </div>

  const Profile=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <div style={{flex:1,overflowY:'auto'}}>
      <div style={{background:A,padding:'24px 16px 20px',position:'relative',overflow:'hidden',textAlign:'center'}}>
        <div style={{position:'absolute',width:120,height:120,top:-40,right:-30,borderRadius:'50%',background:'rgba(255,255,255,.1)'}}/>
        <div style={{width:64,height:64,borderRadius:20,background:'rgba(255,255,255,.2)',border:'2px solid rgba(255,255,255,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:'white',margin:'0 auto 10px'}}>JD</div>
        <div style={{fontSize:18,fontWeight:900,color:'white'}}>Jean Dupont</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.7)',fontWeight:700,marginTop:3}}>{'🏆'} Niveau 2 · Régulier</div>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:16,flexWrap:'wrap'}}>
          {([['6','avis'],['3','pros suivis'],['240','XP'],['12','tickets']] as [string,string][]).map(([v,l])=><div key={l} style={{background:'rgba(255,255,255,.15)',borderRadius:12,padding:'8px 12px',textAlign:'center'}}>
            <div style={{fontSize:16,fontWeight:900,color:'white',fontFamily:"'Fredoka',sans-serif"}}>{v}</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,.7)',fontWeight:700}}>{l}</div>
          </div>)}
        </div>
      </div>
      <div style={{padding:'14px 13px 4px',fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em'}}>Les niveaux FlashQuality</div>
      <div style={{padding:'8px 13px 14px',display:'flex',flexDirection:'column',gap:7}}>
        {([{icon:'🌱',level:'Niveau 1 · Nouveau',sub:'1er scan · Offres flash',xp:'0 XP',cur:false,op:1},{icon:'🏆',level:'Niveau 2 · Régulier ← ici',sub:'3 avis + 5 scans · Tests produits',xp:'100 XP',cur:true,op:1},{icon:'💎',level:'Niveau 3 · Fidèle',sub:'10 avis · Expériences exclusives',xp:'500 XP',cur:false,op:0.7},{icon:'🎖️',level:'Niveau 4 · Ambassadeur',sub:'Invité par un pro · Panel testeur',xp:'Invitation',cur:false,op:0.5}] as {icon:string;level:string;sub:string;xp:string;cur:boolean;op:number}[]).map((lvl,i)=><div key={i} style={{background:lvl.cur?AL:'white',borderRadius:RC,border:`2.5px solid ${lvl.cur?A:'#F0EDE8'}`,padding:'11px 13px',display:'flex',alignItems:'center',gap:10,opacity:lvl.op}}>
          <div style={{width:38,height:38,borderRadius:10,background:lvl.cur?A:'#F0EDE8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{lvl.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:900,color:lvl.cur?A:'#1A1033'}}>{lvl.level}</div><div style={{fontSize:11,color:lvl.cur?A:'#B0ADA8',opacity:lvl.cur?0.7:1,fontWeight:700,marginTop:2}}>{lvl.sub}</div></div>
          <div style={{fontSize:11,fontWeight:700,color:lvl.cur?A:'#B0ADA8'}}>{lvl.xp}</div>
        </div>)}
      </div>
    </div>
  </div>

  const Notifs=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Mes actus" right={<span style={{fontSize:12,fontWeight:800,color:A,cursor:'pointer'}}>Tout lire</span>}/>
    <div style={{flex:1,overflowY:'auto'}}>
      <div style={{padding:'10px 13px 4px',fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em'}}>Aujourd&apos;hui</div>
      {NOTIFS.map(n=><div key={n.id} style={{...CARD,margin:'0 13px 8px',display:'flex',alignItems:'flex-start',gap:10,padding:'12px 13px'}}>
        <div style={{width:40,height:40,borderRadius:RC,background:n.ibg,color:n.icol,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,flexShrink:0}}>{n.ini}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}><div style={{width:7,height:7,borderRadius:'50%',background:n.dot,flexShrink:0}}/><div style={{fontSize:12,fontWeight:900,color:'#1A1033'}}>{n.title}</div></div>
          <div style={{fontSize:12,color:'#A8A5A0',fontWeight:700,lineHeight:1.5}}>{n.desc}</div>
          <div style={{fontSize:10,color:'#C8C6C2',marginTop:3}}>{n.time}</div>
        </div>
      </div>)}
    </div>
  </div>

  const Abos=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Contrats &amp; abonnements" right={<span style={{fontSize:12,fontWeight:800,color:A,cursor:'pointer'}}>+ Ajouter</span>}/>
    <div style={{flex:1,overflowY:'auto',padding:'12px 13px 14px'}}>
      <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:9}}>Contrats annuels</div>
      {SUBS.map(s=><div key={s.name} style={{background:'white',borderRadius:RC,border:'2px solid #F0EDE8',padding:'12px 14px',marginBottom:8,display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:s.ibg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{s.icon}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:900,color:'#1A1033'}}>{s.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{s.price} · {s.date}</div></div>
        <div style={{fontSize:12,fontWeight:900,color:s.cdc}}>{s.cd}</div>
      </div>)}
      <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',margin:'14px 0 8px'}}>Abonnements numériques</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {([{icon:'🎬',name:'Netflix',price:'13,99€/mois',status:'Actif',color:'#10B981'},{icon:'🎵',name:'Spotify',price:'9,99€/mois',status:'Peu utilisé',color:'#E8A820'},{icon:'📱',name:'Forfait SFR',price:'19,99€/mois',status:'Actif',color:'#10B981'},{icon:'🏋️',name:'Basic Fit',price:'19,99€/mois',status:'Pas utilisé',color:'#DC2626'}] as {icon:string;name:string;price:string;status:string;color:string}[]).map(s=><div key={s.name} style={{background:'white',borderRadius:RC,border:'2px solid #F0EDE8',padding:'10px 12px'}}>
          <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
          <div style={{fontSize:12,fontWeight:900,color:'#1A1033'}}>{s.name}</div>
          <div style={{fontSize:11,color:'#B0ADA8'}}>{s.price}</div>
          <div style={{fontSize:10,fontWeight:800,color:s.color,marginTop:4}}>● {s.status}</div>
        </div>)}
      </div>
      <div style={{background:'#FFFBEB',borderRadius:RC,border:'2px solid #E8A820',padding:'12px 14px'}}>
        <div style={{fontSize:12,fontWeight:900,color:'#92400E',marginBottom:4}}>{'💡'} Conseil FQ</div>
        <div style={{fontSize:12,fontWeight:700,color:'#1A1033',lineHeight:1.5}}>Spotify et Basic Fit non utilisés depuis 3 semaines. Économie possible : <strong>29,98€/mois</strong>.</div>
      </div>
    </div>
  </div>

  function Jeux(){
    return <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
      <SHD title="Jeux &amp; r\u00e9compenses" onBack={()=>go('home')}/>
      <div style={{flex:1,overflowY:'auto',padding:'12px 13px 16px'}}>
        {jeuTombola&&isReglesTombola(jeuTombola)&&<div onClick={()=>go('tombola')} style={{background:'linear-gradient(135deg,#F59E0B,#DC2626)',borderRadius:RC,padding:'16px 18px',cursor:'pointer',boxShadow:'0 8px 24px rgba(245,158,11,.4)',border:'1.5px solid rgba(255,255,255,.15)',marginBottom:10}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{fontSize:30}}>{'\u{1F3AB}'}</div>
            <div style={{flex:1}}><div style={{fontSize:16,fontWeight:900,color:'white'}}>Tombola du mois</div><div style={{fontSize:11,color:'rgba(255,255,255,.8)',fontWeight:700}}>Tirage fin {tombolaMonthKey()}</div></div>
            <div style={{background:'rgba(255,255,255,.25)',border:'1.5px solid rgba(255,255,255,.45)',borderRadius:100,padding:'6px 14px',fontSize:18,fontWeight:900,color:'white',fontFamily:"'Fredoka',sans-serif"}}>{tombolaTickets}</div>
          </div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.9)',fontWeight:700,lineHeight:1.4}}>{jeuTombola.regles.lot}</div>
        </div>}
        {jeuBonus&&jeuBonus.jeu_type==='quizz'&&<div onClick={startQuizz} style={{...CARD,padding:16,cursor:'pointer',marginBottom:10,borderColor:A}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:44,height:44,borderRadius:RC,background:AL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{'\u{1F9E0}'}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Quizz maison</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{jeuBonus.regles.nb_par_session} questions \u00b7 sans-faute = 1 ticket tombola</div></div>
            <div style={{background:A,color:'white',fontSize:11,fontWeight:900,padding:'4px 10px',borderRadius:100}}>+{jeuBonus.regles.xp_reussite} XP</div>
          </div>
        </div>}
        {jeuBonus&&jeuBonus.jeu_type==='spin'&&<div onClick={()=>go('spin')} style={{...CARD,padding:16,cursor:'pointer',marginBottom:10,borderColor:A}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:44,height:44,borderRadius:RC,background:AL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{'\u{1F3AF}'}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Roue de la chance</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{jeuBonus.regles.segments.length} segments \u00b7 tirage pond\u00e9r\u00e9</div></div>
            <div style={{background:A,color:'white',fontSize:11,fontWeight:900,padding:'4px 10px',borderRadius:100}}>Tenter</div>
          </div>
        </div>}
        {limitReached&&<div style={{background:'#FEF3C7',border:'2px solid #F59E0B',borderRadius:RC,padding:'12px 14px',fontSize:12,fontWeight:800,color:'#92400E'}}>{'\u{1F6AB}'} Limite de 3 actions/jour atteinte. Reviens demain !</div>}
      </div>
    </div>
  }

  function Quizz(){
    const q=quizzQuestions[quizzIdx]
    if(quizzDone){
      const ok=quizzCorrect===quizzQuestions.length
      return <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
        <SHD title="R\u00e9sultat" onBack={()=>go('jeux')}/>
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,textAlign:'center'}}>
          <div style={{fontSize:72,marginBottom:12}}>{ok?'\u{1F3C6}':'\u{1F4AA}'}</div>
          <div style={{fontSize:22,fontWeight:900,color:'#1A1033',marginBottom:6}}>{quizzCorrect} / {quizzQuestions.length}</div>
          <div style={{fontSize:13,color:'#6B6760',fontWeight:700,marginBottom:24,lineHeight:1.5}}>{ok?`Sans-faute ! +1 ticket tombola \u{1F3AB}`:'Presque ! Retente demain.'}</div>
          <button onClick={()=>go('jeux')} style={{background:A,color:'white',border:'none',borderRadius:100,padding:'12px 28px',fontSize:14,fontWeight:900,cursor:'pointer',fontFamily:'inherit',boxShadow:`0 4px 0 ${AD}`}}>Retour aux jeux</button>
        </div>
      </div>
    }
    if(!q)return <div style={{padding:20,color:'#1A1033'}}>Chargement...</div>
    return <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
      <SHD title={`Quizz \u00b7 ${quizzIdx+1}/${quizzQuestions.length}`} onBack={()=>go('jeux')}/>
      <div style={{flex:1,overflowY:'auto',padding:'14px 16px'}}>
        <div style={{background:'#F0EDE8',borderRadius:100,height:7,overflow:'hidden',marginBottom:18}}>
          <div style={{height:'100%',borderRadius:100,background:A,width:`${((quizzIdx+(quizzPicked!==null?1:0))/quizzQuestions.length)*100}%`,transition:'width .3s'}}/>
        </div>
        <div style={{fontSize:18,fontWeight:900,color:'#1A1033',lineHeight:1.3,marginBottom:16}}>{q.q}</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {q.choix.map((c,i)=>{
            const picked=quizzPicked===i
            const isGood=quizzPicked!==null&&i===q.bonne
            const isBad=picked&&i!==q.bonne
            const bg=isGood?'#D1FAE5':isBad?'#FEE2E2':picked?AL:'white'
            const bd=isGood?'#10B981':isBad?'#DC2626':picked?A:'#F0EDE8'
            return <button key={i} onClick={()=>pickQuizz(i)} disabled={quizzPicked!==null} style={{padding:'14px 16px',borderRadius:14,border:`2.5px solid ${bd}`,background:bg,fontSize:14,fontWeight:800,color:'#1A1033',cursor:quizzPicked===null?'pointer':'default',fontFamily:'inherit',textAlign:'left',boxSizing:'border-box'}}>{c}</button>
          })}
        </div>
      </div>
    </div>
  }

  function Spin(){
    const s=jeux.find(isReglesSpin)
    if(!s)return <div style={{padding:20}}>Aucun spin actif.</div>
    const segs=s.regles.segments
    const seg=360/segs.length
    const grad=segs.map((x,i)=>`${x.color} ${i*seg}deg ${(i+1)*seg}deg`).join(',')
    return <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
      <SHD title="Roue de la chance" onBack={()=>go('jeux')}/>
      <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{position:'relative',width:260,height:260,marginTop:10}}>
          <div style={{position:'absolute',top:-6,left:'50%',transform:'translateX(-50%)',width:0,height:0,borderLeft:'12px solid transparent',borderRight:'12px solid transparent',borderTop:`20px solid ${A}`,zIndex:2}}/>
          <div style={{width:260,height:260,borderRadius:'50%',background:`conic-gradient(${grad})`,border:`6px solid ${A}`,transform:`rotate(${spinRot}deg)`,transition:spinning?'transform 3s cubic-bezier(.17,.67,.3,1)':'none',position:'relative'}}>
            {segs.map((x,i)=>{
              const angle=i*seg+seg/2
              return <div key={i} style={{position:'absolute',top:'50%',left:'50%',transformOrigin:'0 0',transform:`rotate(${angle}deg) translate(60px,-8px)`,color:'white',fontSize:11,fontWeight:900,whiteSpace:'nowrap'}}>{x.label}</div>
            })}
          </div>
        </div>
        <button onClick={startSpin} disabled={spinning||limitReached} style={{marginTop:24,background:spinning||limitReached?'#D0CEC9':A,color:'white',border:'none',borderRadius:100,padding:'14px 36px',fontSize:15,fontWeight:900,cursor:spinning||limitReached?'not-allowed':'pointer',fontFamily:'inherit',boxShadow:`0 4px 0 ${AD}`}}>{spinning?'Rotation...':limitReached?'Limite atteinte':'Tourner !'}</button>
        {spinResult&&<div style={{marginTop:20,background:'white',border:`2.5px solid ${spinResult.color}`,borderRadius:RC,padding:'14px 18px',textAlign:'center',width:'100%',maxWidth:300,boxSizing:'border-box'}}>
          <div style={{fontSize:11,fontWeight:800,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em'}}>R\u00e9sultat</div>
          <div style={{fontSize:18,fontWeight:900,color:'#1A1033',marginTop:4}}>{spinResult.gain}</div>
        </div>}
      </div>
    </div>
  }

  function Tombola(){
    if(!jeuTombola||!isReglesTombola(jeuTombola))return <div style={{padding:20}}>Aucune tombola active.</div>
    return <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
      <SHD title="Tombola du mois" onBack={()=>go('jeux')}/>
      <div style={{flex:1,overflowY:'auto',padding:'14px 16px'}}>
        <div style={{background:'linear-gradient(135deg,#F59E0B,#DC2626)',borderRadius:RC,padding:'20px 18px',color:'white',marginBottom:14,boxShadow:'0 8px 24px rgba(245,158,11,.4)'}}>
          <div style={{fontSize:11,fontWeight:800,color:'rgba(255,255,255,.75)',textTransform:'uppercase',letterSpacing:'.1em'}}>Lot du mois</div>
          <div style={{fontSize:18,fontWeight:900,marginTop:6,lineHeight:1.3}}>{jeuTombola.regles.lot}</div>
          <div style={{marginTop:14,display:'flex',gap:8,alignItems:'center'}}>
            <div style={{background:'rgba(255,255,255,.25)',border:'1.5px solid rgba(255,255,255,.4)',borderRadius:100,padding:'6px 14px',fontSize:20,fontWeight:900,fontFamily:"'Fredoka',sans-serif"}}>{tombolaTickets}</div>
            <div style={{fontSize:12,fontWeight:700,color:'rgba(255,255,255,.85)'}}>ticket{tombolaTickets>1?'s':''} en poche</div>
          </div>
        </div>
        <div style={{...CARD,padding:14,marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>Comment gagner ?</div>
          <div style={{fontSize:13,color:'#1A1033',fontWeight:700,lineHeight:1.5}}>R\u00e9ussir le quizz maison sans faute = 1 ticket. Plus de tickets = plus de chances au tirage fin {tombolaMonthKey()}.</div>
        </div>
      </div>
    </div>
  }

  const BNav=()=>{
    const tabs=[{id:'home' as NavTab,label:'Accueil',icon:'🏠',sc:'home' as Screen},{id:'carnet' as NavTab,label:'Mes lieux',icon:'📍',sc:'carnet' as Screen},{id:'depenses' as NavTab,label:'Compta',icon:'🧾',sc:'depenses' as Screen,col:'#10B981'},{id:'abonnements' as NavTab,label:'Contrats',icon:'🔔',sc:'abonnements' as Screen},{id:'profile' as NavTab,label:'Moi',icon:'🎒',sc:'profile' as Screen}]
    return <div style={{height:62,background:'white',borderTop:'2px solid #F0EDE8',display:'flex',flexShrink:0}}>
      {tabs.map(t=>{const active=nav===t.id,c=t.col||A;return <button key={t.id} onClick={()=>nt(t.id,t.sc)} style={{flex:1,background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,fontFamily:'inherit',padding:0}}>
        <div style={{fontSize:20}}>{t.icon}</div>
        <div style={{fontSize:9,fontWeight:800,color:active?c:'#B0ADA8'}}>{t.label}</div>
        {active&&<div style={{width:4,height:4,borderRadius:'50%',background:c}}/>}
      </button>})}
    </div>
  }

  if(checkingAuth)return <div style={{minHeight:'100vh',background:'#1A1033'}}/>
  if(!clientId)return Inscription()

  return <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Fredoka:wght@500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{display:none;}`}</style>
    <div style={{minHeight:'100vh',display:'flex',justifyContent:'center',background:'#1A1033',fontFamily:"'Nunito',sans-serif"}}>
      <div style={{width:'100%',maxWidth:430,minHeight:'100vh',background:BG,display:'flex',flexDirection:'column',position:'relative',overflow:'hidden'}}>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {screen==='home'&&<Home/>}
          {screen==='review'&&<Review/>}
          {screen==='offers'&&<Offers/>}
          {screen==='contact'&&<Contact/>}
          {screen==='depenses'&&clientId&&<DepensesScreen clientId={clientId} onBack={()=>go('home')}/>}
          {screen==='carnet'&&<Carnet/>}
          {screen==='profile'&&<Profile/>}
          {screen==='notifs'&&<Notifs/>}
          {screen==='abonnements'&&clientId&&<AbonnementsScreen clientId={clientId} onBack={()=>go('home')}/>}
          {screen==='jeux'&&Jeux()}
          {screen==='quizz'&&Quizz()}
          {screen==='spin'&&Spin()}
          {screen==='tombola'&&Tombola()}
        </div>
        <BNav/>
        {cel&&<div style={{position:'absolute',inset:0,background:`linear-gradient(135deg,${A},${AD})`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:100,textAlign:'center',padding:24}}>
          <div style={{fontSize:72,marginBottom:16}}>{'🎉'}</div>
          <div style={{fontSize:28,fontWeight:900,color:'white',marginBottom:8}}>Avis envoyé !</div>
          <div style={{fontSize:16,color:'rgba(255,255,255,.75)',fontWeight:700,marginBottom:32}}>+10 XP gagnés · Merci d&apos;aider ce prestataire {'💛'}</div>
          <button onClick={()=>{setCel(false);go('home')}} style={{background:'white',color:A,fontSize:16,fontWeight:900,padding:'14px 32px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Super !</button>
        </div>}
        {depCel&&<div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:100,textAlign:'center',padding:24}}>
          <div style={{fontSize:72,marginBottom:16}}>{'✅'}</div>
          <div style={{fontSize:28,fontWeight:900,color:'white',marginBottom:8}}>Dépense enregistrée !</div>
          <div style={{fontSize:16,color:'rgba(255,255,255,.75)',fontWeight:700,marginBottom:32}}>Ticket sauvegardé · TVA calculée {'🧮'}</div>
          <button onClick={()=>setDepCel(false)} style={{background:'white',color:'#10B981',fontSize:16,fontWeight:900,padding:'14px 32px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Voir l&apos;historique</button>
        </div>}
        {xpToast&&<div style={{position:'absolute',left:16,right:16,bottom:82,background:`linear-gradient(135deg,${A},${AD})`,color:'white',borderRadius:RC,padding:'12px 16px',display:'flex',alignItems:'center',gap:12,zIndex:120,boxShadow:'0 10px 28px rgba(124,92,252,.5)',border:'1.5px solid rgba(255,255,255,.18)'}}>
          <div style={{fontSize:26,lineHeight:1}}>{'\u{2728}'}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:900}}>+{xpToast.xp} XP</div>
            <div style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.8)'}}>{xpToast.label}</div>
          </div>
          <div style={{fontSize:11,fontWeight:800,color:'rgba(255,255,255,.85)'}}>{todayActions.length}/{MAX_ACTIONS_PER_DAY}</div>
        </div>}
      </div>
    </div>
  </>
}
