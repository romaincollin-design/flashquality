'use client'
import { useState, useEffect, useRef } from 'react'

type Screen = 'home'|'review'|'offers'|'contact'|'depenses'|'carnet'|'profile'|'notifs'|'abonnements'
type NavTab = 'home'|'carnet'|'depenses'|'abonnements'|'profile'

const A='#7C5CFC',AD='#5538D4',AL='#EDE8FF',BG='#F0EDE8',RC=22
const CARD:React.CSSProperties={background:'white',borderRadius:RC,border:'2.5px solid #F0EDE8',boxSizing:'border-box'}
const PRO={name:'Trattoria Bella',sub:'Restaurant italien \u00B7 Nice, 06',badge:'Restaurant',initials:'TB',avatarBg:'#FEF3C7',avatarCol:'#D97706',rating:'4.7',tel:'04 9X XX XX XX',addr:'5 rue de la Paix, Nice',hours:'Mar\u2013Dim \u00B7 12h\u201322h30'}
const RATINGS=[{emoji:'\u{1F60D}',label:'G\u00E9nial'},{emoji:'\u{1F44D}',label:'Top'},{emoji:'\u{1F642}',label:'Bien'},{emoji:'\u{1F610}',label:'Moyen'},{emoji:'\u{1F44E}',label:'D\u00E9cevant'},{emoji:'\u{1F6AB}',label:'Jamais'}]
const PROS=[{id:'t',initials:'TB',bg:'#FEF3C7',col:'#D97706',name:'Trattoria Bella',sub:'Restaurant \u00B7 Nice \u00B7 il y a 2j',rating:'4.7',hasFlash:true},{id:'c',initials:'PC',bg:'#ECFDF5',col:'#059669',name:'Plomberie Carrel',sub:'Artisan \u00B7 Grasse \u00B7 il y a 2 sem.',rating:'4.9',hasFlash:false}]
const NOTIFS=[{id:'n1',ini:'\u26A1',ibg:'#FEF3C7',icol:'#D97706',title:'Trattoria Bella \u00B7 Offre flash',desc:'Pizza \u201330% ce soir jusqu\u2019\u00E0 21h.',time:'Il y a 12 min',dot:'#FF4D6D'},{id:'n2',ini:'\u{1F3C6}',ibg:'#EDE8FF',icol:'#7C5CFC',title:'FlashQuality',desc:'Niveau 2 atteint ! Tests produits d\u00E9bloqu\u00E9s.',time:'Il y a 1h',dot:A}]
const SUBS=[{icon:'\u{1F3E0}',ibg:'#FFF1EB',name:'Assurance AXA',price:'72\u20AC/mois',date:'27/04/2026',cd:'J-14',cdc:'#DC2626'},{icon:'\u{1F4E1}',ibg:'#EEF4FF',name:'Box Internet Orange',price:'36\u20AC/mois',date:'15/09/2026',cd:'J-155',cdc:'#10B981'},{icon:'\u26A1',ibg:'#F0FDF9',name:'\u00C9lectricit\u00E9 EDF',price:'89\u20AC/mois',date:'01/01/2027',cd:'J-263',cdc:'#10B981'}]
const DEPS=[{icon:'\u{1F37D}\uFE0F',ibg:'#F3F0FF',name:'Trattoria Bella',cat:'Restaurant \u00B7 Hier',amt:'48,50 \u20AC'},{icon:'\u2702\uFE0F',ibg:'#FFF0FB',name:'Studio Coiff',cat:'Coiffeur \u00B7 Il y a 3j',amt:'65,00 \u20AC'},{icon:'\u26FD',ibg:'#E0FDF4',name:'Total \u00C9nergies',cat:'Essence \u00B7 Il y a 5j',amt:'82,30 \u20AC'}]

function ft(s:number){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sc=s%60;return (h?h+'h ':'')+String(m).padStart(2,'0')+'m '+String(sc).padStart(2,'0')+'s'}
function fs(s:number){const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return (h?h+'h ':'')+String(m).padStart(2,'0')+'m'}

function SHD({title,onBack,right}:{title:string;onBack?:()=>void;right?:React.ReactNode}){
  return <div style={{padding:'12px 14px 8px',display:'flex',alignItems:'center',gap:10,background:'white',borderBottom:'2px solid #F0EDE8',flexShrink:0}}>
    {onBack&&<button onClick={onBack} style={{width:36,height:36,borderRadius:'50%',background:'#F0EDE8',border:'none',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'inherit'}}>\u2190</button>}
    <span style={{fontSize:16,fontWeight:900,color:'#1A1033',flex:1}} dangerouslySetInnerHTML={{__html:title}}/>
    {right}
  </div>
}

export default function ClientApp(){
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
  const [dCat,setDCat]=useState('\u{1F37D}\uFE0F Resto')
  const [showMsg,setShowMsg]=useState(false)
  const [msg,setMsg]=useState('')
  const [cf,setCf]=useState('all')
  const fref=useRef<HTMLInputElement>(null)

  useEffect(()=>{const iv=setInterval(()=>setSecs(s=>Math.max(0,s-1)),1000);return()=>clearInterval(iv)},[])
  const go=(s:Screen)=>setScreen(s)
  const nt=(n:NavTab,s:Screen)=>{setNav(n);setScreen(s)}
  const ai=()=>{setAiL(true);setAiD(false);setTimeout(()=>{setDPre('Trattoria Bella');setDAmt('48.50');setAiL(false);setAiD(true)},1800)}

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
        <div style={{display:'inline-flex',alignItems:'center',background:'rgba(255,255,255,.22)',border:'1px solid rgba(255,255,255,.35)',borderRadius:100,padding:'5px 11px',fontSize:10,color:'white',fontWeight:800}}>\u2713 V\u00E9rifi\u00E9</div>
        <div style={{display:'inline-flex',alignItems:'center',background:'rgba(255,255,255,.22)',border:'1px solid rgba(255,255,255,.35)',borderRadius:100,padding:'5px 11px',fontSize:10,color:'white',fontWeight:800}}>{'\u{1F37D}\uFE0F'} {PRO.badge}</div>
      </div>
      <div style={{position:'absolute',top:14,right:14,background:'rgba(255,255,255,.22)',backdropFilter:'blur(12px)',border:'1.5px solid rgba(255,255,255,.4)',borderRadius:RC,padding:'8px 12px',textAlign:'center'}}>
        <div style={{fontSize:20,fontWeight:900,color:'white',lineHeight:1,fontFamily:"'Fredoka',sans-serif"}}>{PRO.rating}</div>
        <div style={{fontSize:9,color:'rgba(255,255,255,.7)',fontWeight:800}}>\u2B50 note</div>
      </div>
      <div style={{marginTop:14,background:'rgba(255,255,255,.15)',borderRadius:100,height:7,overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:100,background:'rgba(255,255,255,.7)',width:'67%'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',margin:'5px 0 2px'}}>
        <span style={{fontSize:10,color:'rgba(255,255,255,.6)',fontWeight:700}}>Niveau 2 \u00B7 R\u00E9gulier {'\u{1F3C6}'}</span>
        <span style={{fontSize:10,color:'rgba(255,255,255,.85)',fontWeight:800}}>+10 XP par avis</span>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'12px 12px 0'}}>
      <AC hot onClick={()=>go('review')} badge="+10 XP" icon="\u2B50" title="Mon avis" sub="Exp. rapide"/>
      <AC onClick={()=>go('offers')} badge="\u26A1 2" bc="#FF4D6D" icon="\u26A1" title="Offres flash" sub="2 actives"/>
      <AC onClick={()=>go('contact')} icon="\u{1F4AC}" title="Contacter" sub="Message \u00B7 Appel"/>
      <AC onClick={()=>nt('depenses','depenses')} icon="\u{1F9FE}" title="D\u00E9penses" sub="Photo ticket \u00B7 TVA" ac="#10B981"/>
    </div>
    <div onClick={()=>go('offers')} style={{margin:'10px 12px 0',background:`linear-gradient(135deg,${A},${AD})`,borderRadius:RC,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,cursor:'pointer',boxShadow:'0 8px 24px rgba(124,92,252,.4)',border:'1.5px solid rgba(255,255,255,.1)'}}>
      <div style={{fontSize:32,flexShrink:0}}>{'\u{1F355}'}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:900,color:'white'}}>Pizza \u201330% ce soir</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.75)',fontWeight:700,marginTop:2}}>Toutes nos pizzas maison jusqu&apos;\u00E0 21h</div>
        <div style={{fontSize:10,color:'rgba(255,255,255,.55)',marginTop:3,fontWeight:700}}>{'\u23F1'} Expire dans {ft(secs)}</div>
      </div>
      <div style={{fontSize:20,color:'rgba(255,255,255,.5)'}}>\u203A</div>
    </div>
    <div style={{padding:'14px 12px 0'}}>
      <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10,paddingTop:12,borderTop:'2px solid #F0EDE8'}}>Mes prestataires r\u00E9cents</div>
      {PROS.map(p=><div key={p.id} onClick={()=>go('contact')} style={{...CARD,display:'flex',alignItems:'center',gap:11,padding:'12px 13px',marginBottom:9,cursor:'pointer',boxShadow:'0 2px 10px rgba(0,0,0,.07)',position:'relative'}}>
        <div style={{width:46,height:46,borderRadius:RC,background:p.bg,color:p.col,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,flexShrink:0}}>{p.initials}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>{p.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{p.sub}</div></div>
        <div style={{background:A,color:'white',fontSize:11,fontWeight:900,padding:'3px 8px',borderRadius:100}}>{p.rating} \u2B50</div>
        {p.hasFlash&&<div style={{position:'absolute',top:10,right:34,fontSize:9,fontWeight:900,background:'#FF4D6D',color:'white',padding:'2px 6px',borderRadius:100}}>\u26A1</div>}
        <div style={{fontSize:18,color:'#D0CEC9',marginLeft:4}}>\u203A</div>
      </div>)}
    </div>
    <div style={{height:12}}/>
  </div>

  const Review=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Ton avis" onBack={()=>go('home')}/>
    <div style={{flex:1,overflowY:'auto'}}>
      <div style={{padding:'14px 18px 12px',textAlign:'center'}}>
        <div style={{fontSize:17,fontWeight:900,color:'#1A1033',lineHeight:1.3}}>Comment \u00E9tait ta pizza ?</div>
        <div style={{fontSize:12,color:'#B0ADA8',fontWeight:700,marginTop:3}}>10 secondes max \u00B7 +10 XP {'\u{1F389}'}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,padding:'0 13px 12px'}}>
        {RATINGS.map((r,i)=><div key={i} onClick={()=>setRating(i)} style={{background:rating===i?AL:'white',border:`2.5px solid ${rating===i?A:'#F0EDE8'}`,borderRadius:RC,padding:'13px 8px',textAlign:'center',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4,boxSizing:'border-box'}}>
          <div style={{fontSize:28,lineHeight:1}}>{r.emoji}</div>
          <div style={{fontSize:10,fontWeight:800,color:rating===i?A:'#B0ADA8'}}>{r.label}</div>
        </div>)}
      </div>
      <div style={{padding:'0 13px 10px'}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6}}>Un d\u00E9tail ? (optionnel)</div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} placeholder="Ex : les p\u00E2tes \u00E9taient parfaites" style={{width:'100%',border:'2.5px solid #F0EDE8',borderRadius:RC,padding:'11px 13px',fontSize:13,fontWeight:700,color:'#1A1033',background:'#FAFAF8',fontFamily:'inherit',resize:'none',outline:'none',boxSizing:'border-box'}}/>
      </div>
      <div style={{display:'flex',gap:8,padding:'0 13px 10px'}}>
        {(['pro','public'] as const).map(v=><div key={v} onClick={()=>setVis(v)} style={{flex:1,padding:'8px 12px',borderRadius:RC,border:`2px solid ${vis===v?A:'#F0EDE8'}`,background:vis===v?AL:'white',textAlign:'center',fontSize:12,fontWeight:800,color:vis===v?A:'#B0ADA8',cursor:'pointer',boxSizing:'border-box'}}>
          {v==='pro'?'\u{1F512} Pro seulement':'\u{1F30D} Communaut\u00E9'}
        </div>)}
      </div>
      <div style={{padding:'0 13px 16px'}}>
        <button onClick={()=>{if(rating!==null)setCel(true)}} style={{width:'100%',padding:14,borderRadius:100,background:rating!==null?A:'#D0CEC9',color:'white',fontSize:14,fontWeight:900,border:'none',cursor:rating!==null?'pointer':'not-allowed',fontFamily:'inherit',marginBottom:10,boxSizing:'border-box'}}>Envoyer {'\u{1F680}'}</button>
        <div style={{textAlign:'center',fontSize:11,color:'#B0ADA8',fontWeight:700}}>Aucun compte requis \u00B7 Anonyme par d\u00E9faut</div>
      </div>
    </div>
  </div>

  const Offers=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <SHD title="Offres &amp; exp\u00E9riences" onBack={()=>go('home')}/>
    <div style={{flex:1,overflowY:'auto',padding:'12px 13px'}}>
      <div style={{...CARD,border:`2.5px solid ${A}`,marginBottom:10,overflow:'hidden'}}>
        <div style={{padding:'12px 13px 10px',display:'flex',gap:10,alignItems:'flex-start'}}>
          <div style={{width:44,height:44,borderRadius:RC,background:AL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{'\u{1F355}'}</div>
          <div><div style={{display:'inline-block',background:AL,color:A,fontSize:10,fontWeight:900,padding:'3px 9px',borderRadius:100,marginBottom:4}}>\u26A1 Vente flash</div><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Pizza \u201330% ce soir</div></div>
        </div>
        <div style={{padding:'0 13px 10px',fontSize:12,color:'#A8A5A0',fontWeight:700,lineHeight:1.5}}>Toutes nos pizzas maison jusqu&apos;\u00E0 21h. Sur place ou \u00E0 emporter.</div>
        <div style={{padding:'0 13px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{background:'#FFE8EC',color:'#FF4D6D',fontSize:11,fontWeight:800,padding:'4px 10px',borderRadius:100}}>\u23F1 {fs(secs)}</div>
          <button style={{background:A,color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Je veux \u00E7a !</button>
        </div>
      </div>
      <div style={{...CARD,marginBottom:10,overflow:'hidden'}}>
        <div style={{padding:'12px 13px 10px',display:'flex',gap:10,alignItems:'flex-start'}}>
          <div style={{width:44,height:44,borderRadius:RC,background:'#EEF4FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{'\u{1F396}\uFE0F'}</div>
          <div><div style={{display:'inline-block',background:'#EEF4FF',color:'#3A86FF',fontSize:10,fontWeight:900,padding:'3px 9px',borderRadius:100,marginBottom:4}}>Test produit</div><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Soir\u00E9e d\u00E9gustation</div></div>
        </div>
        <div style={{padding:'0 13px 10px',fontSize:12,color:'#A8A5A0',fontWeight:700,lineHeight:1.5}}>Nouveau menu en avant-premi\u00E8re. 8 places seulement.</div>
        <div style={{padding:'0 13px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{background:'#E0FDF4',color:'#10B981',fontSize:11,fontWeight:800,padding:'4px 10px',borderRadius:100}}>{'\u{1F4C5}'} Vendredi 20h</div>
          <button style={{background:'#3A86FF',color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>M&apos;inscrire</button>
        </div>
      </div>
      <div style={{background:AL,borderRadius:RC,padding:'14px 13px',border:'2.5px dashed rgba(124,92,252,.28)',textAlign:'center'}}>
        <div style={{fontSize:14,fontWeight:900,color:'#1A1033',marginBottom:3}}>{'\u{1F514}'} Recevoir les prochaines offres</div>
        <div style={{fontSize:11,color:'#A8A5A0',fontWeight:700,marginBottom:12}}>Notifi\u00E9\u00B7e quand {PRO.name} publie une offre</div>
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
        {([['\u{1F4DE}',PRO.tel],['\u{1F4CD}',PRO.addr],['\u{1F553}',PRO.hours]] as [string,string][]).map(([ico,val])=><div key={val} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:10,background:'#F0F4F9',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>{ico}</div>
          <span style={{fontSize:13,fontWeight:700,color:'#1A1033'}}>{val}</span>
        </div>)}
      </div>
      <div style={{padding:'12px 13px 0',display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        <a href={`tel:${PRO.tel.replace(/\s/g,'')}`} style={{background:AL,border:`2px solid ${A}`,borderRadius:RC,padding:'12px 8px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:'pointer',textDecoration:'none'}}>
          <div style={{fontSize:22}}>{'\u{1F4DE}'}</div><div style={{fontSize:11,fontWeight:900,color:A}}>Appeler</div>
        </a>
        <div onClick={()=>setShowMsg(!showMsg)} style={{background:'white',border:'2px solid #E8E4DC',borderRadius:RC,padding:'12px 8px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,cursor:'pointer'}}>
          <div style={{fontSize:22}}>{'\u{1F4AC}'}</div><div style={{fontSize:11,fontWeight:900,color:'#1A1033'}}>Message</div>
        </div>
      </div>
      {showMsg&&<div style={{margin:'10px 13px 0'}}>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={3} placeholder="Votre message..." style={{width:'100%',border:'2.5px solid #F0EDE8',borderRadius:RC,padding:'11px 13px',fontSize:13,fontWeight:700,fontFamily:'inherit',resize:'none',outline:'none',boxSizing:'border-box'}}/>
        <button style={{width:'100%',marginTop:8,padding:12,borderRadius:100,background:A,color:'white',fontSize:13,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'inherit',boxSizing:'border-box'}}>Envoyer</button>
      </div>}
      <div style={{padding:'12px 13px 14px'}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:9}}>\u26A1 Offre active</div>
        <div onClick={()=>go('offers')} style={{...CARD,border:`2.5px solid ${A}`,padding:'12px 13px',cursor:'pointer'}}>
          <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:7}}>
            <div style={{width:36,height:36,borderRadius:10,background:AL,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>\u26A1</div>
            <div><div style={{display:'inline-block',background:AL,color:A,fontSize:10,fontWeight:900,padding:'3px 9px',borderRadius:100,marginBottom:4}}>Vente flash</div><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>Pizza \u201330% ce soir</div></div>
          </div>
          <div style={{fontSize:12,color:'#A8A5A0',fontWeight:700,lineHeight:1.5,marginBottom:9}}>Toutes nos pizzas maison jusqu&apos;\u00E0 21h.</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{background:'#FFE8EC',color:'#FF4D6D',fontSize:11,fontWeight:800,padding:'4px 10px',borderRadius:100}}>\u23F1 Expire bient\u00F4t</div>
            <button style={{background:A,color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Voir l&apos;offre</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  const Depenses=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <div style={{background:'linear-gradient(135deg,#10B981,#059669)',padding:'18px 18px 16px',flexShrink:0}}>
      <div style={{fontSize:19,fontWeight:900,color:'white',marginBottom:2}}>{'\u{1F9FE}'} Mes d\u00E9penses</div>
      <div style={{fontSize:12,color:'rgba(255,255,255,.7)',fontWeight:700,marginBottom:12}}>Photo ticket \u00B7 Suivi \u00B7 Historique</div>
      <div style={{display:'flex',gap:12}}>
        {([['324\u20AC','Ce mois'],['12','Tickets'],['6','Cat\u00E9gories']] as [string,string][]).map(([v,l])=><div key={l} style={{background:'rgba(255,255,255,.15)',borderRadius:12,padding:'8px 12px',textAlign:'center'}}>
          <div style={{fontSize:18,fontWeight:900,color:'white',fontFamily:"'Fredoka',sans-serif"}}>{v}</div>
          <div style={{fontSize:9,color:'rgba(255,255,255,.65)',fontWeight:800,marginTop:2}}>{l}</div>
        </div>)}
      </div>
    </div>
    <div style={{flex:1,overflowY:'auto',paddingBottom:16}}>
      <div style={{margin:'12px 12px 0',background:'white',borderRadius:RC,border:'2px solid #E8E4DC',padding:14}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>R\u00E9partition ce mois</div>
        <div style={{display:'flex',gap:6,alignItems:'flex-end',height:72}}>
          {([['55px',A,'Resto'],['38px','#EC4899','Beaut\u00E9'],['28px','#F59E0B','Sortie'],['22px','#06B6D4','Coiffeur'],['42px','#10B981','Essence'],['18px','#B0ADA8','Autre']] as [string,string,string][]).map(([h,c,l])=><div key={l} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <div style={{width:'100%',height:h,background:c,borderRadius:'6px 6px 0 0'}}/>
            <div style={{fontSize:9,color:'#B0ADA8',fontWeight:700}}>{l}</div>
          </div>)}
        </div>
      </div>
      <div style={{margin:'10px 12px 0'}}>
        <div onClick={()=>fref.current?.click()} style={{background:'white',borderRadius:RC,border:'2.5px dashed #D0CEC9',padding:'20px 16px',textAlign:'center',cursor:'pointer'}}>
          <div style={{fontSize:32,marginBottom:6}}>{'\u{1F4F8}'}</div>
          <div style={{fontSize:14,fontWeight:900,color:'#1A1033',marginBottom:2}}>Scanner un ticket</div>
          <div style={{fontSize:12,color:'#B0ADA8',fontWeight:700}}>Photo \u00B7 Galerie \u00B7 PDF</div>
        </div>
        <input ref={fref} type="file" accept="image/*" style={{display:'none'}}/>
        <div style={{textAlign:'center',marginTop:8}}>
          <button onClick={ai} style={{display:'inline-flex',alignItems:'center',gap:6,background:aiD?'linear-gradient(135deg,#10B981,#34D399)':`linear-gradient(135deg,${A},${AD})`,color:'white',fontSize:12,fontWeight:900,padding:'8px 16px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit',opacity:aiL?0.7:1}}>
            {aiL?'\u2726 Analyse en cours\u2026':aiD?'\u2726 Extraction compl\u00E8te !':'\u2726 Identifier avec l\u2019IA'}
          </button>
        </div>
      </div>
      {aiD&&<div style={{margin:'10px 12px 0',background:'white',borderRadius:RC,border:`2.5px solid ${A}`,overflow:'hidden'}}>
        <div style={{background:`linear-gradient(135deg,${A},${AD})`,padding:'10px 13px',display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'white'}}>\u2726</div>
          <div style={{fontSize:13,fontWeight:900,color:'white'}}>Identification automatique</div>
        </div>
        <div style={{padding:'12px 13px'}}>
          {([['Prestataire','Trattoria Bella'],['Cat\u00E9gorie','\u{1F37D}\uFE0F Restauration'],['Date',new Date().toLocaleDateString('fr-FR')],['Montant','48,50 \u20AC']] as [string,string][]).map(([l,v])=><div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #F0EDE8'}}>
            <span style={{fontSize:12,color:'#B0ADA8',fontWeight:700}}>{l}</span>
            <span style={{fontSize:12,fontWeight:900,color:'#1A1033'}}>{v}</span>
          </div>)}
        </div>
      </div>}
      <div style={{margin:'10px 12px 0',background:'white',borderRadius:RC,border:'2px solid #E8E4DC',padding:14}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}}>Prestataire</div>
            <input value={dPre} onChange={e=>setDPre(e.target.value)} placeholder="Nom\u2026" style={{width:'100%',border:'2px solid #F0EDE8',borderRadius:12,padding:'8px 10px',fontSize:13,fontWeight:700,color:'#1A1033',fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5}}>Montant</div>
            <input value={dAmt} onChange={e=>setDAmt(e.target.value)} type="number" step="0.01" placeholder="0,00 \u20AC" style={{width:'100%',border:'2px solid #F0EDE8',borderRadius:12,padding:'8px 10px',fontSize:13,fontWeight:700,fontFamily:'inherit',outline:'none',boxSizing:'border-box'}}/>
          </div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:7}}>Cat\u00E9gorie</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['\u{1F37D}\uFE0F Resto','\u{1F485} Beaut\u00E9','\u{1F3AD} Sortie','\u2702\uFE0F Coiffeur','\u26FD Essence','\u{1F3E5} Sant\u00E9','\u{1F4E6} Autre'].map(cat=><div key={cat} onClick={()=>setDCat(cat)} style={{padding:'6px 12px',borderRadius:100,border:`2px solid ${dCat===cat?A:'#E8E4DC'}`,background:dCat===cat?AL:'white',fontSize:12,fontWeight:800,color:dCat===cat?A:'#B0ADA8',cursor:'pointer'}}>{cat}</div>)}
          </div>
        </div>
        <button onClick={()=>setDepCel(true)} style={{width:'100%',padding:12,borderRadius:100,background:'#10B981',color:'white',fontSize:13,fontWeight:900,border:'none',cursor:'pointer',fontFamily:'inherit',boxSizing:'border-box'}}>{'\u{1F4BE}'} Enregistrer</button>
      </div>
      <div style={{margin:'12px 12px 0'}}>
        <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:9}}>Historique r\u00E9cent</div>
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
      {[{id:'all',label:'Tous'},{id:'resto',label:'\u{1F37D}\uFE0F Resto'},{id:'beaute',label:'\u{1F485} Beaut\u00E9'},{id:'artisan',label:'\u{1F527} Artisan'}].map(c=><div key={c.id} onClick={()=>setCf(c.id)} style={{whiteSpace:'nowrap',padding:'6px 13px',borderRadius:100,border:`2px solid ${cf===c.id?'transparent':'#F0EDE8'}`,background:cf===c.id?A:'white',fontSize:11,fontWeight:800,color:cf===c.id?'white':'#B0ADA8',cursor:'pointer'}}>{c.label}</div>)}
    </div>
    <div style={{flex:1,overflowY:'auto',padding:'10px 13px 14px'}}>
      {PROS.map(p=><div key={p.id} onClick={()=>go('contact')} style={{...CARD,display:'flex',alignItems:'center',gap:11,padding:'12px 13px',marginBottom:9,cursor:'pointer',boxShadow:'0 2px 10px rgba(0,0,0,.07)',position:'relative'}}>
        <div style={{width:46,height:46,borderRadius:RC,background:p.bg,color:p.col,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:900,flexShrink:0}}>{p.initials}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:900,color:'#1A1033'}}>{p.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{p.sub}</div></div>
        <div style={{background:A,color:'white',fontSize:11,fontWeight:900,padding:'3px 8px',borderRadius:100}}>{p.rating} \u2B50</div>
        {p.hasFlash&&<div style={{position:'absolute',top:10,right:34,fontSize:9,fontWeight:900,background:'#FF4D6D',color:'white',padding:'2px 6px',borderRadius:100}}>\u26A1</div>}
        <div style={{fontSize:18,color:'#D0CEC9',marginLeft:4}}>\u203A</div>
      </div>)}
    </div>
  </div>

  const Profile=()=><div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
    <div style={{flex:1,overflowY:'auto'}}>
      <div style={{background:A,padding:'24px 16px 20px',position:'relative',overflow:'hidden',textAlign:'center'}}>
        <div style={{position:'absolute',width:120,height:120,top:-40,right:-30,borderRadius:'50%',background:'rgba(255,255,255,.1)'}}/>
        <div style={{width:64,height:64,borderRadius:20,background:'rgba(255,255,255,.2)',border:'2px solid rgba(255,255,255,.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:'white',margin:'0 auto 10px'}}>JD</div>
        <div style={{fontSize:18,fontWeight:900,color:'white'}}>Jean Dupont</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.7)',fontWeight:700,marginTop:3}}>{'\u{1F3C6}'} Niveau 2 \u00B7 R\u00E9gulier</div>
        <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:16,flexWrap:'wrap'}}>
          {([['6','avis'],['3','pros suivis'],['240','XP'],['12','tickets']] as [string,string][]).map(([v,l])=><div key={l} style={{background:'rgba(255,255,255,.15)',borderRadius:12,padding:'8px 12px',textAlign:'center'}}>
            <div style={{fontSize:16,fontWeight:900,color:'white',fontFamily:"'Fredoka',sans-serif"}}>{v}</div>
            <div style={{fontSize:9,color:'rgba(255,255,255,.7)',fontWeight:700}}>{l}</div>
          </div>)}
        </div>
      </div>
      <div style={{padding:'14px 13px 4px',fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em'}}>Les niveaux FlashQuality</div>
      <div style={{padding:'8px 13px 14px',display:'flex',flexDirection:'column',gap:7}}>
        {([{icon:'\u{1F331}',level:'Niveau 1 \u00B7 Nouveau',sub:'1er scan \u00B7 Offres flash',xp:'0 XP',cur:false,op:1},{icon:'\u{1F3C6}',level:'Niveau 2 \u00B7 R\u00E9gulier \u2190 ici',sub:'3 avis + 5 scans \u00B7 Tests produits',xp:'100 XP',cur:true,op:1},{icon:'\u{1F48E}',level:'Niveau 3 \u00B7 Fid\u00E8le',sub:'10 avis \u00B7 Exp\u00E9riences exclusives',xp:'500 XP',cur:false,op:0.7},{icon:'\u{1F396}\uFE0F',level:'Niveau 4 \u00B7 Ambassadeur',sub:'Invit\u00E9 par un pro \u00B7 Panel testeur',xp:'Invitation',cur:false,op:0.5}] as {icon:string;level:string;sub:string;xp:string;cur:boolean;op:number}[]).map((lvl,i)=><div key={i} style={{background:lvl.cur?AL:'white',borderRadius:RC,border:`2.5px solid ${lvl.cur?A:'#F0EDE8'}`,padding:'11px 13px',display:'flex',alignItems:'center',gap:10,opacity:lvl.op}}>
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
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:900,color:'#1A1033'}}>{s.name}</div><div style={{fontSize:11,color:'#B0ADA8',fontWeight:700,marginTop:2}}>{s.price} \u00B7 {s.date}</div></div>
        <div style={{fontSize:12,fontWeight:900,color:s.cdc}}>{s.cd}</div>
      </div>)}
      <div style={{fontSize:10,fontWeight:900,color:'#B0ADA8',textTransform:'uppercase',letterSpacing:'.08em',margin:'14px 0 8px'}}>Abonnements num\u00E9riques</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {([{icon:'\u{1F3AC}',name:'Netflix',price:'13,99\u20AC/mois',status:'Actif',color:'#10B981'},{icon:'\u{1F3B5}',name:'Spotify',price:'9,99\u20AC/mois',status:'Peu utilis\u00E9',color:'#E8A820'},{icon:'\u{1F4F1}',name:'Forfait SFR',price:'19,99\u20AC/mois',status:'Actif',color:'#10B981'},{icon:'\u{1F3CB}\uFE0F',name:'Basic Fit',price:'19,99\u20AC/mois',status:'Pas utilis\u00E9',color:'#DC2626'}] as {icon:string;name:string;price:string;status:string;color:string}[]).map(s=><div key={s.name} style={{background:'white',borderRadius:RC,border:'2px solid #F0EDE8',padding:'10px 12px'}}>
          <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
          <div style={{fontSize:12,fontWeight:900,color:'#1A1033'}}>{s.name}</div>
          <div style={{fontSize:11,color:'#B0ADA8'}}>{s.price}</div>
          <div style={{fontSize:10,fontWeight:800,color:s.color,marginTop:4}}>\u25CF {s.status}</div>
        </div>)}
      </div>
      <div style={{background:'#FFFBEB',borderRadius:RC,border:'2px solid #E8A820',padding:'12px 14px'}}>
        <div style={{fontSize:12,fontWeight:900,color:'#92400E',marginBottom:4}}>{'\u{1F4A1}'} Conseil FQ</div>
        <div style={{fontSize:12,fontWeight:700,color:'#1A1033',lineHeight:1.5}}>Spotify et Basic Fit non utilis\u00E9s depuis 3 semaines. \u00C9conomie possible : <strong>29,98\u20AC/mois</strong>.</div>
      </div>
    </div>
  </div>

  const BNav=()=>{
    const tabs=[{id:'home' as NavTab,label:'Accueil',icon:'\u{1F3E0}',sc:'home' as Screen},{id:'carnet' as NavTab,label:'Mes lieux',icon:'\u{1F4CD}',sc:'carnet' as Screen},{id:'depenses' as NavTab,label:'Compta',icon:'\u{1F9FE}',sc:'depenses' as Screen,col:'#10B981'},{id:'abonnements' as NavTab,label:'Contrats',icon:'\u{1F514}',sc:'abonnements' as Screen},{id:'profile' as NavTab,label:'Moi',icon:'\u{1F392}',sc:'profile' as Screen}]
    return <div style={{height:62,background:'white',borderTop:'2px solid #F0EDE8',display:'flex',flexShrink:0}}>
      {tabs.map(t=>{const active=nav===t.id,c=t.col||A;return <button key={t.id} onClick={()=>nt(t.id,t.sc)} style={{flex:1,background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,fontFamily:'inherit',padding:0}}>
        <div style={{fontSize:20}}>{t.icon}</div>
        <div style={{fontSize:9,fontWeight:800,color:active?c:'#B0ADA8'}}>{t.label}</div>
        {active&&<div style={{width:4,height:4,borderRadius:'50%',background:c}}/>}
      </button>})}
    </div>
  }

  return <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Fredoka:wght@500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{display:none;}`}</style>
    <div style={{minHeight:'100vh',display:'flex',justifyContent:'center',background:'#1A1033',fontFamily:"'Nunito',sans-serif"}}>
      <div style={{width:'100%',maxWidth:430,minHeight:'100vh',background:BG,display:'flex',flexDirection:'column',position:'relative',overflow:'hidden'}}>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {screen==='home'&&<Home/>}
          {screen==='review'&&<Review/>}
          {screen==='offers'&&<Offers/>}
          {screen==='contact'&&<Contact/>}
          {screen==='depenses'&&<Depenses/>}
          {screen==='carnet'&&<Carnet/>}
          {screen==='profile'&&<Profile/>}
          {screen==='notifs'&&<Notifs/>}
          {screen==='abonnements'&&<Abos/>}
        </div>
        <BNav/>
        {cel&&<div style={{position:'absolute',inset:0,background:`linear-gradient(135deg,${A},${AD})`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:100,textAlign:'center',padding:24}}>
          <div style={{fontSize:72,marginBottom:16}}>{'\u{1F389}'}</div>
          <div style={{fontSize:28,fontWeight:900,color:'white',marginBottom:8}}>Avis envoy\u00E9 !</div>
          <div style={{fontSize:16,color:'rgba(255,255,255,.75)',fontWeight:700,marginBottom:32}}>+10 XP gagn\u00E9s \u00B7 Merci d&apos;aider ce prestataire {'\u{1F49B}'}</div>
          <button onClick={()=>{setCel(false);go('home')}} style={{background:'white',color:A,fontSize:16,fontWeight:900,padding:'14px 32px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Super !</button>
        </div>}
        {depCel&&<div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#10B981,#059669)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:100,textAlign:'center',padding:24}}>
          <div style={{fontSize:72,marginBottom:16}}>{'\u2705'}</div>
          <div style={{fontSize:28,fontWeight:900,color:'white',marginBottom:8}}>D\u00E9pense enregistr\u00E9e !</div>
          <div style={{fontSize:16,color:'rgba(255,255,255,.75)',fontWeight:700,marginBottom:32}}>Ticket sauvegard\u00E9 \u00B7 TVA calcul\u00E9e {'\u{1F9EE}'}</div>
          <button onClick={()=>setDepCel(false)} style={{background:'white',color:'#10B981',fontSize:16,fontWeight:900,padding:'14px 32px',borderRadius:100,border:'none',cursor:'pointer',fontFamily:'inherit'}}>Voir l&apos;historique</button>
        </div>}
      </div>
    </div>
  </>
}
