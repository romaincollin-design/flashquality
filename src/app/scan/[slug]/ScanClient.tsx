'use client'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
type Pro = { id: string; slug: string; nom: string; categorie: string; adresse: string | null; tel: string | null; plan: string }
const F = "Calibri, 'Trebuchet MS', sans-serif"
const C = { navy:'#1A3A6B',teal:'#00A896',teal2:'#007F72',amber:'#E8A820',orange:'#E8621A',bg:'#F0F4F9',border:'#E2E8F0',slate:'#4A5568',slate2:'#94A3B8' }
function ini(nom:string){return nom.split(' ').map((w:string)=>w[0]).join('').toUpperCase().slice(0,2)}
function catL(cat:string){const m:Record<string,string>={boulangerie:'Boulangerie',restaurant:'Restaurant',coiffeur:'Coiffeur',beaute:'Beaute',sante:'Sante',artisan:'Artisan'};return m[cat]||(cat.charAt(0).toUpperCase()+cat.slice(1))}
function Consent({checked,onChange,children}:{checked:boolean;onChange:()=>void;children:React.ReactNode}){
  return(<div onClick={onChange} style={{display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer',marginBottom:12}}>
    <div style={{width:22,height:22,borderRadius:7,flexShrink:0,marginTop:1,border:`2px solid ${checked?C.teal:C.border}`,background:checked?C.teal:'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .15s'}}>
      {checked&&<span style={{fontSize:11,color:'#fff',fontWeight:900}}>v</span>}
    </div>
    <div style={{fontSize:13,fontWeight:600,color:C.slate,lineHeight:1.5}}>{children}</div>
  </div>)
}
export default function ScanClient({pro}:{pro:Pro}){
  const [step,setStep]=useState<1|2|3>(1)
  const [prenom,setPrenom]=useState('')
  const [email,setEmail]=useState('')
  const [tel,setTel]=useState('')
  const [optCom,setOptCom]=useState(false)
  const [optRes,setOptRes]=useState(false)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const initiales=ini(pro.nom)
  const label=catL(pro.categorie)
  const ville=pro.adresse?(pro.adresse.split(',').pop()?.trim()||''):''
  async function submit(){
    if(!prenom.trim()||!email.trim()){setError('Prenom et email requis');return}
    setLoading(true);setError('')
    const sb=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    try{
      const {error:e}=await sb.auth.signInWithOtp({email:email.trim(),options:{data:{prenom:prenom.trim(),tel:tel.trim()},emailRedirectTo:`${window.location.origin}/client`}})
      if(e)throw e
      localStorage.setItem('fq_pending_scan',JSON.stringify({pro_id:pro.id,opt_in_commerce:optCom,opt_in_reseau:optRes,prenom:prenom.trim(),tel:tel.trim()}))
      setStep(3)
    }catch(err:unknown){setError(err instanceof Error?err.message:'Erreur inattendue')}
    finally{setLoading(false)}
  }
  if(step===1)return(
    <div style={{minHeight:'100vh',background:'#0A1628',display:'flex',justifyContent:'center',fontFamily:F}}>
      <div style={{width:'100%',maxWidth:430,minHeight:'100vh',display:'flex',flexDirection:'column',background:'linear-gradient(170deg,#071426 0%,#1A3A6B 65%,#0d2040 100%)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',width:320,height:320,borderRadius:'50%',top:-90,right:-90,background:'rgba(0,168,150,.11)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',width:220,height:220,borderRadius:'50%',bottom:140,left:-70,background:'rgba(232,168,32,.08)',pointerEvents:'none'}}/>
        <div style={{padding:'26px 24px 0',fontSize:16,fontWeight:900,color:'#fff',position:'relative',zIndex:2}}>Flash<span style={{color:C.teal}}>Quality</span></div>
        <div style={{padding:'26px 22px 18px',position:'relative',zIndex:2}}>
          <div style={{background:'rgba(255,255,255,.1)',border:'1.5px solid rgba(255,255,255,.18)',borderRadius:20,padding:'16px 20px',display:'flex',alignItems:'center',gap:14,backdropFilter:'blur(14px)'}}>
            <div style={{width:54,height:54,borderRadius:16,flexShrink:0,background:`linear-gradient(135deg,${C.teal},${C.teal2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:900,color:'#fff'}}>{initiales}</div>
            <div>
              <div style={{fontSize:16,fontWeight:900,color:'#fff'}}>{pro.nom}</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.55)',fontWeight:600,marginTop:2}}>{label}{ville?` - ${ville}`:''}</div>
              <div style={{display:'inline-flex',alignItems:'center',gap:4,background:'rgba(0,168,150,.2)',border:'1px solid rgba(0,168,150,.4)',borderRadius:100,padding:'2px 8px',fontSize:10,fontWeight:700,color:C.teal,marginTop:5}}>Verifie FlashQuality</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'6px 0',position:'relative'}}>
            <div style={{position:'absolute',left:0,right:0,top:'50%',height:1,background:'rgba(255,255,255,.08)'}}/>
            <div style={{background:`linear-gradient(90deg,${C.teal2},${C.teal})`,borderRadius:100,padding:'6px 18px',fontSize:11,fontWeight:800,color:'#fff',zIndex:1,boxShadow:'0 4px 16px rgba(0,168,150,.35)'}}>Echange FlashQuality</div>
          </div>
          <div style={{background:'rgba(255,255,255,.05)',border:'1.5px dashed rgba(255,255,255,.18)',borderRadius:20,padding:'16px 20px',display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:54,height:54,borderRadius:16,flexShrink:0,background:'rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,border:'1.5px dashed rgba(255,255,255,.15)'}}>?</div>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:'rgba(255,255,255,.55)'}}>Toi</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.3)',fontWeight:600,marginTop:2}}>Rejoins FlashQuality pour finaliser</div>
            </div>
          </div>
        </div>
        <div style={{padding:'0 22px 18px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,position:'relative',zIndex:2}}>
          <div style={{borderRadius:16,padding:14,background:'rgba(232,168,32,.1)',border:'1px solid rgba(232,168,32,.25)'}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:C.amber,marginBottom:8}}>Tu donnes</div>
            {['Ton prenom','Ton email','Ton telephone'].map(t=>(<div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:12,fontWeight:600,color:'rgba(255,255,255,.7)',marginBottom:5}}><div style={{width:6,height:6,borderRadius:'50%',background:C.amber,flexShrink:0}}/>{t}</div>))}
          </div>
          <div style={{borderRadius:16,padding:14,background:'rgba(0,168,150,.1)',border:'1px solid rgba(0,168,150,.25)'}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:C.teal,marginBottom:8}}>Tu recois</div>
            {['Fiche commerce','Offres & actus','Chat direct'].map(t=>(<div key={t} style={{display:'flex',alignItems:'center',gap:7,fontSize:12,fontWeight:600,color:'rgba(255,255,255,.7)',marginBottom:5}}><div style={{width:6,height:6,borderRadius:'50%',background:C.teal,flexShrink:0}}/>{t}</div>))}
          </div>
        </div>
        <div style={{padding:'0 22px 22px',position:'relative',zIndex:2,textAlign:'center'}}>
          <div style={{fontSize:26,fontWeight:900,color:'#fff',lineHeight:1.2,marginBottom:8}}>Ta base perso<br/><span style={{color:C.teal}}>intelligente</span></div>
          <div style={{fontSize:14,color:'rgba(255,255,255,.5)',fontWeight:600,lineHeight:1.6}}>Tes commerces, tes avis, ta compta. Gratuit, sans pub.</div>
        </div>
        <div style={{padding:'0 22px 38px',position:'relative',zIndex:2,marginTop:'auto'}}>
          <button onClick={()=>setStep(2)} style={{width:'100%',padding:18,background:C.teal,color:'#fff',fontSize:16,fontWeight:900,border:'none',borderRadius:100,cursor:'pointer',boxShadow:'0 6px 28px rgba(0,168,150,.45)',fontFamily:F,marginBottom:10}}>Finaliser l echange - gratuit</button>
          <div style={{textAlign:'center',fontSize:11,color:'rgba(255,255,255,.3)',fontWeight:600}}>Opt-in total - Sans pub - Tes donnees restent les tiennes</div>
          <div style={{textAlign:'center',fontSize:13,fontWeight:700,color:'rgba(255,255,255,.45)',marginTop:10}}>Deja un compte ? <span style={{color:C.teal,cursor:'pointer'}} onClick={()=>window.location.href='/login'}>Me connecter</span></div>
        </div>
      </div>
    </div>
  )
  if(step===2)return(
    <div style={{minHeight:'100vh',background:'#fff',display:'flex',justifyContent:'center',fontFamily:F}}>
      <div style={{width:'100%',maxWidth:430,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{background:`linear-gradient(135deg,${C.navy},#0F2550)`,padding:'44px 22px 56px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',bottom:-22,left:0,right:0,height:44,background:'#fff',borderRadius:'22px 22px 0 0'}}/>
          <button onClick={()=>setStep(1)} style={{background:'none',border:'none',fontSize:22,color:'rgba(255,255,255,.6)',cursor:'pointer',padding:0,marginBottom:14,display:'block'}}>←</button>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(0,168,150,.2)',border:'1px solid rgba(0,168,150,.35)',borderRadius:100,padding:'4px 12px',fontSize:11,fontWeight:800,color:C.teal,marginBottom:12}}>Echange avec {pro.nom}</div>
          <div style={{fontSize:24,fontWeight:900,color:'#fff',lineHeight:1.2,marginBottom:6}}>Cree ton espace<br/>en 30 secondes</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.5)',fontWeight:600}}>Gratuit - Sans engagement - Sans pub</div>
        </div>
        <div style={{margin:'28px 22px 6px',background:C.bg,borderRadius:16,padding:'14px 16px',display:'flex',gap:12}}>
          <span style={{fontSize:24,flexShrink:0}}>R</span>
          <div>
            <div style={{fontSize:13,fontWeight:800,color:C.navy,marginBottom:3}}>L echange FlashQuality</div>
            <div style={{fontSize:12,fontWeight:600,color:C.slate2,lineHeight:1.5}}>Tu partages tes coordonnees avec {pro.nom} et rejoins FlashQuality.</div>
          </div>
        </div>
        <div style={{padding:'10px 22px 28px',flex:1}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
            <div>
              <label style={{fontSize:11,fontWeight:800,color:C.navy,textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:6}}>Prenom *</label>
              <input value={prenom} onChange={e=>setPrenom(e.target.value)} placeholder="Elodie" style={{width:'100%',padding:'14px 16px',border:`2px solid ${C.border}`,borderRadius:14,fontSize:15,fontFamily:F,fontWeight:600,color:C.navy,background:C.bg,boxSizing:'border-box'}}/>
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:800,color:C.navy,textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:6}}>Telephone</label>
              <input value={tel} onChange={e=>setTel(e.target.value)} placeholder="06 XX XX XX" type="tel" style={{width:'100%',padding:'14px 16px',border:`2px solid ${C.border}`,borderRadius:14,fontSize:15,fontFamily:F,fontWeight:600,color:C.navy,background:C.bg,boxSizing:'border-box'}}/>
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,fontWeight:800,color:C.navy,textTransform:'uppercase',letterSpacing:'.06em',display:'block',marginBottom:6}}>Email *</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="ton@email.com" type="email" style={{width:'100%',padding:'14px 16px',border:`2px solid ${C.border}`,borderRadius:14,fontSize:15,fontFamily:F,fontWeight:600,color:C.navy,background:C.bg,boxSizing:'border-box'}}/>
          </div>
          <div style={{background:C.bg,borderRadius:16,padding:16,marginBottom:16,border:`2px solid ${C.border}`}}>
            <Consent checked={optCom} onChange={()=>setOptCom(v=>!v)}>J accepte que <strong>{pro.nom}</strong> me contacte avec des <span style={{color:C.teal,fontWeight:700}}>offres et informations</span></Consent>
            <Consent checked={optRes} onChange={()=>setOptRes(v=>!v)}>J accepte les <span style={{color:C.teal,fontWeight:700}}>actualites FlashQuality</span> (tombola, nouveautes)</Consent>
          </div>
          {error&&<div style={{color:C.orange,fontSize:13,fontWeight:600,marginBottom:12,textAlign:'center'}}>{error}</div>}
          <button onClick={submit} disabled={loading} style={{width:'100%',padding:16,background:loading?C.slate2:C.navy,color:'#fff',fontSize:15,fontWeight:900,border:'none',borderRadius:100,cursor:loading?'not-allowed':'pointer',fontFamily:F,boxShadow:'0 4px 16px rgba(26,58,107,.3)'}}>
            {loading?'Envoi...':'Finaliser mon echange'}
          </button>
          <div style={{textAlign:'center',fontSize:11,color:C.slate2,fontWeight:600,marginTop:12}}>Lien magique par email - Aucun mot de passe</div>
        </div>
      </div>
    </div>
  )
  return(
    <div style={{minHeight:'100vh',background:'#fff',display:'flex',justifyContent:'center',fontFamily:F}}>
      <div style={{width:'100%',maxWidth:430,minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <div style={{background:`linear-gradient(135deg,${C.navy},#0F2550)`,padding:'52px 22px 60px',textAlign:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',bottom:-22,left:0,right:0,height:44,background:'#fff',borderRadius:'22px 22px 0 0'}}/>
          <div style={{width:72,height:72,borderRadius:'50%',background:`linear-gradient(135deg,${C.teal},#1A7A50)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,margin:'0 auto 16px',boxShadow:'0 8px 32px rgba(0,168,150,.5)'}}>V</div>
          <div style={{fontSize:24,fontWeight:900,color:'#fff',marginBottom:6}}>Echange realise !</div>
          <div style={{fontSize:14,color:'rgba(255,255,255,.55)',fontWeight:600}}>Lien envoye a {email}</div>
        </div>
        <div style={{padding:'36px 20px 20px',flex:1}}>
          <div style={{background:`linear-gradient(135deg,${C.amber},${C.orange})`,borderRadius:16,padding:'14px 18px',display:'flex',alignItems:'center',gap:12,marginBottom:16,boxShadow:'0 4px 16px rgba(232,168,32,.3)'}}>
            <span style={{fontSize:28,flexShrink:0}}>*</span>
            <div>
              <div style={{fontSize:14,fontWeight:900,color:'#fff'}}>XP gagne !</div>
              <div style={{fontSize:12,color:'rgba(255,255,255,.75)',fontWeight:600,marginTop:2}}>Premier echange avec {pro.nom}</div>
            </div>
            <div style={{fontSize:30,fontWeight:900,color:'#fff',marginLeft:'auto'}}>+15</div>
          </div>
          <div style={{background:C.navy,borderRadius:20,padding:'18px 20px',marginBottom:16,position:'relative',overflow:'hidden',boxShadow:'0 8px 32px rgba(26,58,107,.25)'}}>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,position:'relative',zIndex:1}}>
              <div style={{width:50,height:50,borderRadius:15,background:`linear-gradient(135deg,${C.teal},${C.teal2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:900,color:'#fff',flexShrink:0}}>{initiales}</div>
              <div>
                <div style={{fontSize:16,fontWeight:900,color:'#fff'}}>{pro.nom}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.45)',fontWeight:600,marginTop:2}}>{pro.adresse||''}</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,position:'relative',zIndex:1}}>
              {[['Tel','Appeler'],['Av','Avis'],['Msg','Message']].map(([ico,lbl])=>(<div key={lbl} style={{background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,padding:'12px 8px',textAlign:'center',cursor:'pointer'}}><div style={{fontSize:14,marginBottom:4}}>{ico}</div><div style={{fontSize:10,fontWeight:800,color:'rgba(255,255,255,.7)'}}>{lbl}</div></div>))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <button onClick={()=>{window.location.href='/client'}} style={{width:'100%',padding:16,background:C.navy,color:'#fff',fontSize:15,fontWeight:900,border:'none',borderRadius:100,cursor:'pointer',fontFamily:F}}>Ouvrir mon espace FlashQuality</button>
            <button onClick={()=>{window.location.href='/'}} style={{width:'100%',padding:14,background:'transparent',color:C.navy,fontSize:14,fontWeight:700,border:`2px solid ${C.border}`,borderRadius:100,cursor:'pointer',fontFamily:F}}>Retour accueil</button>
          </div>
        </div>
      </div>
    </div>
  )
}
