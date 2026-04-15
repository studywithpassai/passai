import { useState, useRef, useEffect } from "react";

const G = {
  purple900:"#1a0533", purple800:"#2d0a5e", purple700:"#3d0d7a", purple600:"#5a0fa8",
  purple500:"#7b2fd4", purple400:"#9b4de8", purple100:"#e8d5f5", purple50:"#f5eafd",
  amber500:"#f5a623", amber400:"#f7bc55", amber100:"#fef3d8", amber50:"#fffbf0",
  cream:"#faf8f4", gray50:"#f5f4f0", gray100:"#ece9e3",
  gray300:"#b8b4ab", gray400:"#9a9690", gray500:"#7a766f", gray700:"#3d3b37", gray900:"#1a1917",
  white:"#ffffff", danger:"#c0392b", dangerBg:"#fff0f0",
  purple:"#6c5ce7", purpleBg:"#f0eeff", blue:"#0984e3", blueBg:"#e6f5ff",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:${G.cream};color:${G.gray900};-webkit-font-smoothing:antialiased}
  .outfit{font-family:'Outfit',sans-serif}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${G.purple400};border-radius:3px}
  input,textarea,select,button{font-family:'Plus Jakarta Sans',sans-serif}
  .fade-in{animation:fadeIn 0.35s ease}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .spin{animation:spin 0.75s linear infinite;display:inline-block}
  .pulse{animation:pulse 1.4s ease infinite}
  @media(max-width:768px){.hide-mobile{display:none!important}.mobile-stack{flex-direction:column!important}.mobile-col{grid-template-columns:1fr!important}}
`;


const COUNTRIES = {
  Nigeria:{
    flag:"🇳🇬",currency:"₦",plans:{basic:4000,pro:8000},
    exams:["JAMB","WAEC","NECO","GCE"],
    subjects:["Mathematics","English Language","Physics","Chemistry","Biology","Economics","Government","Literature","Geography","CRS/IRS","Commerce","Agricultural Science","Further Mathematics"],
    curriculum:"NERDC Nigerian Secondary School curriculum",
    tip:"JAMB is CBT-based, 40 questions per subject in 2 hours. WAEC has objectives and essays/practicals. Aim for 250+ in JAMB.",
  },
  Ghana:{
    flag:"🇬🇭",currency:"GH₵",plans:{basic:60,pro:120},
    exams:["WASSCE","BECE","NOVDEC"],
    subjects:["Core Mathematics","English Language","Integrated Science","Social Studies","Physics","Chemistry","Biology","Economics","Business Management","Geography","History","Elective Mathematics"],
    curriculum:"Ghana Education Service (GES) Secondary curriculum",
    tip:"WASSCE: need at least C6 in 6 core and elective subjects for university admission. BECE is for JHS students.",
  },
  Tanzania:{
    flag:"🇹🇿",currency:"TSh",plans:{basic:12000,pro:24000},
    exams:["CSEE","ACSEE","PSLE"],
    subjects:["Mathematics","English","Kiswahili","Physics","Chemistry","Biology","History","Geography","Civics","Commerce","Book Keeping","Agriculture","Advanced Mathematics"],
    curriculum:"NECTA Tanzania Secondary School curriculum",
    tip:"CSEE (Form 4) Division I means 7 points or less — lowest points = best grade. ACSEE is Form 6 A-Level.",
  },
  Uganda:{
    flag:"🇺🇬",currency:"USh",plans:{basic:18000,pro:36000},
    exams:["UCE","UACE","PLE"],
    subjects:["Mathematics","English Language","Physics","Chemistry","Biology","History","Geography","Economics","Entrepreneurship","Agriculture","Computer Studies","Fine Art","Luganda"],
    curriculum:"Uganda NCDC/UNEB Secondary School curriculum",
    tip:"UCE aggregate 4–36, Division 1 is the best. UACE (A-Level) requires principal and subsidiary passes. English is compulsory.",
  },
  Kenya:{
    flag:"🇰🇪",currency:"KSh",plans:{basic:500,pro:1000},
    exams:["KCSE","KCPE","KPSEA"],
    subjects:["Mathematics","English","Kiswahili","Physics","Chemistry","Biology","History & Government","Geography","CRE/IRE","Business Studies","Agriculture","Computer Studies","French"],
    curriculum:"KICD Kenya Secondary School curriculum",
    tip:"KCSE: Grade A to E. Mean grade C+ is minimum for public university. Mathematics and English are compulsory subjects.",
  },
};

const SAMPLE_QS=[
  {id:1,exam:"JAMB",year:2023,subject:"Mathematics",country:"Nigeria",question:"If log₂(x+3)=3, find x.",options:["5","3","8","6"],answer:0,explanation:"2³=x+3 → 8=x+3 → x=5"},
  {id:2,exam:"KCSE",year:2022,subject:"Mathematics",country:"Kenya",question:"A car travels 120km in 2 hours. What is its average speed in m/s?",options:["16.67 m/s","60 m/s","33.33 m/s","120 m/s"],answer:0,explanation:"60km/h × (1000/3600) = 16.67 m/s"},
  {id:3,exam:"WASSCE",year:2023,subject:"Core Mathematics",country:"Ghana",question:"Find the gradient of the line 3y = 6x + 9.",options:["2","3","6","½"],answer:0,explanation:"y = 2x + 3, so gradient m = 2"},
  {id:4,exam:"CSEE (Form 4)",year:2022,subject:"Physics",country:"Tanzania",question:"Which quantity has both magnitude and direction?",options:["Mass","Temperature","Velocity","Speed"],answer:2,explanation:"Velocity is a vector — has magnitude and direction. Others are scalars."},
  {id:5,exam:"UCE (O-Level)",year:2023,subject:"Chemistry",country:"Uganda",question:"What is the pH of a neutral solution at 25°C?",options:["0","7","14","1"],answer:1,explanation:"pH 7 = neutral at 25°C. Below 7 = acidic, above 7 = basic."},
  {id:6,exam:"KCSE",year:2023,subject:"Biology",country:"Kenya",question:"The process by which plants make food using sunlight is called:",options:["Respiration","Photosynthesis","Transpiration","Osmosis"],answer:1,explanation:"Photosynthesis occurs in chloroplasts: 6CO₂+6H₂O+light → C₆H₁₂O₆+6O₂"},
  {id:7,exam:"JAMB",year:2022,subject:"Chemistry",country:"Nigeria",question:"What is the oxidation state of Cr in K₂Cr₂O₇?",options:["+3","+6","+7","+4"],answer:1,explanation:"2+2Cr+(7×-2)=0 → 2Cr=12 → Cr=+6"},
  {id:8,exam:"WASSCE",year:2022,subject:"English Language",country:"Ghana",question:"VERBOSE most nearly means:",options:["Silent","Wordy","Angry","Confused"],answer:1,explanation:"Verbose = using more words than necessary; wordy; long-winded"},
  {id:9,exam:"ACSEE (Form 6)",year:2023,subject:"Mathematics",country:"Tanzania",question:"Find dy/dx if y = 3x³ - 2x² + 5.",options:["9x² - 4x","9x² + 4x","3x² - 2x","6x - 4"],answer:0,explanation:"dy/dx = 3(3x²) - 2(2x) + 0 = 9x² - 4x"},
  {id:10,exam:"UACE (A-Level)",year:2022,subject:"Economics",country:"Uganda",question:"Which of the following is a characteristic of a perfectly competitive market?",options:["Product differentiation","Price making power","Many buyers and sellers","High barriers to entry"],answer:2,explanation:"Perfect competition: many buyers & sellers, homogeneous products, free entry/exit, price takers."},
];

const MOCK = {streak:7,questionsToday:6,totalQuestions:248,accuracy:72,subjects:{Mathematics:68,Physics:81,Chemistry:75,Biology:65,"English":79}};

function Spinner({size=16,color=G.purple500}){return <span className="spin" style={{width:size,height:size,borderRadius:"50%",border:`2px solid ${color}30`,borderTop:`2px solid ${color}`,display:"inline-block",flexShrink:0}}/>}
function Tag({children,color=G.purple600,bg=G.purple50,style={}}){return <span style={{background:bg,color,fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:20,whiteSpace:"nowrap",...style}}>{children}</span>}
function Btn({children,onClick,variant="primary",size="md",loading,disabled,full,style={}}){
  const sz={sm:"7px 15px 7px",md:"11px 22px",lg:"14px 28px"};
  const fs={sm:13,md:14,lg:16};
  const v={primary:{background:G.purple600,color:G.white,border:"none"},outline:{background:"transparent",color:G.purple700,border:`1.5px solid ${G.purple400}`},ghost:{background:"transparent",color:G.gray400,border:"none"},amber:{background:G.amber500,color:G.white,border:"none"},dark:{background:G.purple900,color:G.white,border:"none"}};
  return <button onClick={onClick} disabled={disabled||loading} style={{padding:sz[size],fontSize:fs[size],...v[variant],borderRadius:10,fontWeight:600,cursor:disabled||loading?"not-allowed":"pointer",transition:"all 0.15s",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,opacity:disabled||loading?0.65:1,width:full?"100%":"auto",...style}}>
    {loading&&<Spinner size={14} color={variant==="outline"?G.purple600:G.white}/>}{children}
  </button>
}
function Card({children,style={},onClick}){return <div onClick={onClick} style={{background:G.white,borderRadius:16,border:`1px solid ${G.gray100}`,padding:"1.25rem",cursor:onClick?"pointer":"default",...style}}>{children}</div>}
function StatCard({label,value,icon,color=G.purple600,bg=G.purple50}){return <div style={{background:bg,borderRadius:14,padding:"1rem 1.25rem",display:"flex",alignItems:"center",gap:12}}>
  <div style={{width:44,height:44,borderRadius:12,background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
  <div><div className="outfit" style={{fontSize:22,fontWeight:700,color:G.gray900,lineHeight:1}}>{value}</div><div style={{fontSize:12,color:G.gray500,fontWeight:500,marginTop:3}}>{label}</div></div>
</div>}
function ProgressBar({value,max=100,color=G.purple500}){return <div style={{height:8,background:G.gray100,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min((value/max)*100,100)}%`,background:color,borderRadius:4,transition:"width 0.6s ease"}}/></div>}
function Avatar({name,size=36}){return <div style={{width:size,height:size,borderRadius:"50%",background:G.purple800,color:G.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.36,fontWeight:700,fontFamily:"Outfit",flexShrink:0}}>{name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>}

function FAQItem({q,a}){
  const [open,setOpen]=useState(false);
  return <div style={{borderBottom:`1px solid ${G.gray100}`,padding:"1rem 0"}}>
    <button onClick={()=>setOpen(p=>!p)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,textAlign:"left"}}>
      <span style={{fontSize:15,fontWeight:600,color:G.gray900}}>{q}</span>
      <span style={{fontSize:20,color:G.purple600,flexShrink:0,transition:"transform 0.2s",transform:open?"rotate(45deg)":"rotate(0deg)"}}>+</span>
    </button>
    {open&&<p style={{fontSize:14,color:G.gray500,lineHeight:1.7,marginTop:10,paddingRight:"2rem"}}>{a}</p>}
  </div>
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function LandingPage({onAuth}){
  const [mode,setMode]=useState("signup");
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",email:"",password:"",country:"Nigeria",level:"Secondary School",exam:"JAMB"});
  const [loading,setLoading]=useState(false);
  const c=COUNTRIES[form.country];
  const currentExams=c?.exams||[];

  const pick=(country)=>{
    const firstLevel="Secondary School";
    const firstExam=COUNTRIES[country].exams[firstLevel][0];
    setForm(p=>({...p,country,level:firstLevel,exam:firstExam}));
    setStep(2);
  };
  const submit=async()=>{
    if(!form.email||!form.password)return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    setLoading(false);
    onAuth({name:form.name||"Student",email:form.email,country:form.country,exam:form.exam,plan:"free"});
  };

  return <div style={{minHeight:"100vh",background:G.cream}}>
    <div style={{background:`linear-gradient(140deg,${G.purple900},${G.purple800} 60%,#0a3d2e)`,padding:"0 1.5rem",position:"relative",overflow:"hidden"}}>
      {[[400,-120,-100,0.08],[240,-50,-30,0.12]].map(([s,t,r,o],i)=><div key={i} style={{position:"absolute",width:s,height:s,borderRadius:"50%",border:`1px solid ${G.white}`,opacity:o,top:t,right:r}}/>)}
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.2rem 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:34,height:34,borderRadius:9,background:G.amber500,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>🎯</div>
          <span className="outfit" style={{color:G.white,fontWeight:800,fontSize:22,letterSpacing:"-0.5px"}}>PassAI</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="ghost" size="sm" style={{color:`${G.white}70`}} onClick={()=>{setMode("login");setStep(2)}}>Login</Btn>
          <Btn variant="amber" size="sm" onClick={()=>{setMode("signup");setStep(1)}}>Get Started Free</Btn>
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",gap:60,padding:"4rem 0 5rem",alignItems:"center",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:280}}>
          <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
            {Object.entries(COUNTRIES).map(([n,d])=><span key={n} style={{background:`${G.white}15`,padding:"4px 10px",borderRadius:20,fontSize:12,color:`${G.white}cc`,display:"flex",alignItems:"center",gap:5}}><span>{d.flag}</span>{n}</span>)}
          </div>
          <h1 className="outfit" style={{color:G.white,fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:800,lineHeight:1.15,marginBottom:16,letterSpacing:"-1px"}}>Pass Your Exams With <span style={{color:G.amber400}}>AI Tutoring</span></h1>
          <p style={{color:`${G.white}bb`,fontSize:16,lineHeight:1.75,marginBottom:28,maxWidth:500}}>JAMB, KCSE, WASSCE, NECTA, UCE and more. Upload textbooks, practice past questions, get step-by-step AI explanations — built for African students.</p>
          <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
            {[["🎓","50,000+","Past Questions"],["🌍","5","Countries"],["⭐","4.9","Rating"]].map(([ic,v,l])=><div key={l}><div className="outfit" style={{color:G.amber400,fontWeight:800,fontSize:22}}>{ic} {v}</div><div style={{color:`${G.white}60`,fontSize:12,marginTop:2}}>{l}</div></div>)}
          </div>
        </div>
        {/* AUTH CARD */}
        <div style={{width:"100%",maxWidth:400,background:G.white,borderRadius:22,padding:"1.75rem",boxShadow:"0 28px 64px rgba(0,0,0,0.28)",flexShrink:0}}>
          <div style={{display:"flex",background:G.gray50,borderRadius:10,padding:4,marginBottom:18}}>
            {["signup","login"].map(m=><button key={m} onClick={()=>{setMode(m);setStep(m==="signup"?1:2)}} style={{flex:1,padding:"8px",border:"none",borderRadius:8,fontWeight:600,fontSize:13,background:mode===m?G.white:"transparent",color:mode===m?G.purple700:G.gray400,cursor:"pointer",transition:"all 0.2s"}}>{m==="signup"?"Sign Up":"Log In"}</button>)}
          </div>
          {mode==="signup"&&step===1&&<>
            <p style={{fontSize:13,fontWeight:600,color:G.gray700,marginBottom:12}}>🌍 Where are you studying?</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.entries(COUNTRIES).map(([name,data])=><button key={name} onClick={()=>pick(name)} style={{padding:"10px 12px",border:`2px solid ${form.country===name?G.purple500:G.gray100}`,borderRadius:12,background:form.country===name?G.purple50:G.white,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all 0.15s"}}>
                <span style={{fontSize:20}}>{data.flag}</span><span style={{fontSize:13,fontWeight:600,color:form.country===name?G.purple700:G.gray700}}>{name}</span>
              </button>)}
            </div>
          </>}
          {(mode==="login"||(mode==="signup"&&step===2))&&<>
            {mode==="signup"&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,padding:"8px 12px",background:G.purple50,borderRadius:10}}>
              <span style={{fontSize:20}}>{c.flag}</span><span style={{fontSize:13,color:G.purple700,fontWeight:600}}>{form.country}</span>
              <button onClick={()=>setStep(1)} style={{marginLeft:"auto",fontSize:12,color:G.purple600,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>Change</button>
            </div>}
            {mode==="signup"&&<div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Full Name</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Amara Osei" style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none"}}/></div>}
            <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Email</label><input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} type="email" placeholder="you@email.com" style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none"}}/></div>
            <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Password</label><input value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} type="password" placeholder="••••••••" style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none"}}/></div>
            {mode==="signup"&&<div style={{marginBottom:12}}>
              <label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Study Level</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                
            </div>}
            {mode==="signup"&&<div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Target Exam</label><select value={form.exam} onChange={e=>setForm(p=>({...p,exam:e.target.value}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none",background:G.white}}>{currentExams.map(e=><option key={e}>{e}</option>)}</select></div>}
            {mode==="login"&&<div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Country</label><select value={form.country} onChange={e=>setForm(p=>({...p,country:e.target.value,exam:COUNTRIES[e.target.value].exams["Secondary School"][0]}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none",background:G.white}}>{Object.keys(COUNTRIES).map(c=><option key={c}>{c}</option>)}</select></div>}
<Btn full loading={loading} onClick={submit} style={{marginBottom:10}}>{mode==="signup"?"Create Free Account →":"Log In →"}</Btn>
            <p style={{fontSize:12,color:G.gray400,textAlign:"center"}}>{mode==="signup"?"Have an account? ":"New here? "}<span onClick={()=>{setMode(mode==="signup"?"login":"signup");setStep(mode==="signup"?2:1)}} style={{color:G.purple600,cursor:"pointer",fontWeight:600}}>{mode==="signup"?"Log In":"Sign Up Free"}</span></p>
          </>}
        </div>
      </div>
    </div>

    {/* EXAM STRIP */}
    <div style={{background:G.white,borderBottom:`1px solid ${G.gray100}`,padding:"1.25rem 1.5rem",overflowX:"auto"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",gap:24,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
        <span style={{fontSize:11,fontWeight:700,color:G.gray400,letterSpacing:"0.06em",whiteSpace:"nowrap"}}>SUPPORTED EXAMS</span>
        {Object.entries(COUNTRIES).map(([country,data])=><div key={country} style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:17}}>{data.flag}</span>{Object.values(data.exams).flat().slice(0,3).map(e=><Tag key={e} style={{marginRight:4}}>{e}</Tag>)}
        </div>)}
      </div>
    </div>

    {/* HOW IT WORKS */}
    <div style={{maxWidth:1100,margin:"0 auto",padding:"4rem 1.5rem"}}>
      <div style={{textAlign:"center",marginBottom:"3rem"}}>
        <Tag color={G.purple600} bg={G.purple50} style={{fontSize:13,padding:"6px 16px",marginBottom:16}}>HOW IT WORKS</Tag>
        <h2 className="outfit" style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:800,color:G.gray900,letterSpacing:"-0.5px"}}>Start Studying in 3 Simple Steps</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:24}}>
        {[
          {step:"01",icon:"🌍",title:"Choose Your Country & Exam",desc:"Select from Nigeria, Kenya, Ghana, Tanzania, or Uganda. Pick your target exam — JAMB, KCSE, WASSCE and more."},
          {step:"02",icon:"📚",title:"Study & Practice",desc:"Access thousands of past questions, use the AI tutor for explanations, generate practice tests, and upload your textbooks."},
          {step:"03",icon:"🏆",title:"Track & Improve",desc:"Monitor your accuracy per subject, maintain your study streak, and watch your exam readiness score grow to 100%."},
        ].map(s=><div key={s.step} style={{textAlign:"center",padding:"1.5rem"}}>
          <div style={{width:60,height:60,borderRadius:20,background:G.purple600,color:G.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 1rem",fontWeight:800}}>{s.icon}</div>
          <div style={{fontSize:11,fontWeight:800,color:G.purple600,letterSpacing:"0.1em",marginBottom:6}}>{s.step}</div>
          <div className="outfit" style={{fontWeight:700,fontSize:17,color:G.gray900,marginBottom:8}}>{s.title}</div>
          <p style={{fontSize:14,color:G.gray500,lineHeight:1.7}}>{s.desc}</p>
        </div>)}
      </div>
    </div>

    {/* FEATURES GRID */}
    <div style={{background:G.gray50,padding:"4rem 1.5rem"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"3rem"}}>
          <Tag color={G.purple600} bg={G.purple50} style={{fontSize:13,padding:"6px 16px",marginBottom:16}}>FEATURES</Tag>
          <h2 className="outfit" style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:800,color:G.gray900,letterSpacing:"-0.5px"}}>Everything You Need to Pass</h2>
          <p style={{color:G.gray500,fontSize:15,marginTop:8}}>Built specifically for African exam systems</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          {[
            {icon:"🤖",title:"AI Tutor",desc:"Ask questions in plain English. Get curriculum-accurate answers with step-by-step explanations for your specific exam.",color:G.purple600,bg:G.purple50},
            {icon:"📚",title:"Past Questions",desc:"50,000+ verified questions from JAMB, KCSE, WASSCE, CSEE, UCE and more — going back 20 years.",color:"#0984e3",bg:"#e6f5ff"},
            {icon:"📄",title:"PDF Textbook AI",desc:"Upload any textbook and ask questions about specific chapters. Works with any curriculum.",color:"#00b894",bg:"#e8faf4"},
            {icon:"📝",title:"AI Practice Tests",desc:"Generate fresh custom tests by subject, topic, difficulty — perfectly matched to your exam format.",color:G.amber500,bg:G.amber50},
            {icon:"📅",title:"Study Schedule",desc:"AI builds a personalized study plan from your exam date, adjusting for your weak areas.",color:"#6c5ce7",bg:"#f0eeff"},
            {icon:"📊",title:"Progress Tracking",desc:"Real-time accuracy per subject, daily streaks, weekly activity charts, and exam readiness score.",color:"#e17055",bg:"#fff0ed"},
          ].map(f=><div key={f.title} style={{background:G.white,borderRadius:16,border:`1px solid ${G.gray100}`,padding:"1.5rem"}}>
            <div style={{width:46,height:46,borderRadius:14,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:12}}>{f.icon}</div>
            <div className="outfit" style={{fontWeight:700,fontSize:15,color:G.gray900,marginBottom:6}}>{f.title}</div>
            <p style={{fontSize:13,color:G.gray500,lineHeight:1.65}}>{f.desc}</p>
          </div>)}
        </div>
      </div>
    </div>

    {/* TESTIMONIALS */}
    <div style={{maxWidth:1100,margin:"0 auto",padding:"4rem 1.5rem"}}>
      <div style={{textAlign:"center",marginBottom:"3rem"}}>
        <Tag color={G.purple600} bg={G.purple50} style={{fontSize:13,padding:"6px 16px",marginBottom:16}}>TESTIMONIALS</Tag>
        <h2 className="outfit" style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:800,color:G.gray900,letterSpacing:"-0.5px"}}>Students Who Passed With PassAI</h2>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
        {[
          {name:"Amara Osei",country:"🇬🇭 Ghana",exam:"WASSCE 2023",grade:"A1 in Mathematics",text:"PassAI's step-by-step explanations finally made algebra click for me. I went from C6 to A1 in just 3 months of daily practice.",avatar:"AO"},
          {name:"Chukwuemeka Eze",country:"🇳🇬 Nigeria",exam:"JAMB 2023",grade:"Score: 312/400",text:"The past questions database is incredible. I practiced 2018-2022 JAMB questions every day and scored 312. PassAI is the best investment I made.",avatar:"CE"},
          {name:"Aisha Mohammed",country:"🇰🇪 Kenya",exam:"KCSE 2023",grade:"A in Biology",text:"The AI Tutor explained photosynthesis and genetics better than my teacher ever did. I could ask the same question 10 times without feeling embarrassed!",avatar:"AM"},
          {name:"Farida Nakato",country:"🇺🇬 Uganda",exam:"UCE 2023",grade:"Division 1",text:"I used the study schedule feature and it organized my entire revision. I knew exactly what to study each day. Got Division 1 in all my subjects!",avatar:"FN"},
          {name:"Zawadi Mwangi",country:"🇹🇿 Tanzania",exam:"CSEE 2023",grade:"Division 1",text:"Nilifurahia sana jinsi AI inavyoeleza maswali ya Kiswahili na Sayansi. PassAI ni chombo bora kwa wanafunzi wa Tanzania.",avatar:"ZM"},
          {name:"Kofi Mensah",country:"🇬🇭 Ghana",exam:"BECE 2023",grade:"Aggregate 6",text:"I'm only in JHS but PassAI helped me get the best BECE results in my school. The practice tests are just like the real exam!",avatar:"KM"},
        ].map(t=><div key={t.name} style={{background:G.white,borderRadius:16,border:`1px solid ${G.gray100}`,padding:"1.5rem"}}>
          <div style={{display:"flex",gap:4,marginBottom:12}}>{[1,2,3,4,5].map(s=><span key={s} style={{color:G.amber500,fontSize:14}}>★</span>)}</div>
          <p style={{fontSize:13,color:G.gray700,lineHeight:1.7,marginBottom:14,fontStyle:"italic"}}>"{t.text}"</p>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:G.purple600,color:G.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{t.avatar}</div>
            <div><div style={{fontWeight:700,fontSize:13,color:G.gray900}}>{t.name}</div>
            <div style={{fontSize:11,color:G.gray400}}>{t.country} · {t.exam}</div>
            <div style={{fontSize:11,color:G.purple600,fontWeight:700}}>{t.grade}</div></div>
          </div>
        </div>)}
      </div>
    </div>

    {/* STATS BANNER */}
    <div style={{background:`linear-gradient(135deg,${G.purple800},${G.purple600})`,padding:"3rem 1.5rem"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:24,textAlign:"center"}}>
        {[["50,000+","Past Questions"],["5","Countries"],["15+","Subjects"],["98%","Pass Rate"],["4.9★","Rating"],["Free","To Start"]].map(([v,l])=>(
          <div key={l}><div className="outfit" style={{color:G.white,fontWeight:800,fontSize:28,letterSpacing:"-1px"}}>{v}</div>
          <div style={{color:`${G.white}70`,fontSize:13,marginTop:4}}>{l}</div></div>
        ))}
      </div>
    </div>

    {/* FAQ */}
    <div style={{maxWidth:800,margin:"0 auto",padding:"4rem 1.5rem"}}>
      <div style={{textAlign:"center",marginBottom:"3rem"}}>
        <Tag color={G.purple600} bg={G.purple50} style={{fontSize:13,padding:"6px 16px",marginBottom:16}}>FAQ</Tag>
        <h2 className="outfit" style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:800,color:G.gray900,letterSpacing:"-0.5px"}}>Frequently Asked Questions</h2>
      </div>
      {[
        {q:"Is PassAI free to use?",a:"Yes! The free plan gives you 10 questions per day, basic AI Q&A, and access to all 5 countries. Upgrade to Basic or Pro for unlimited access."},
        {q:"Which exams does PassAI cover?",a:"PassAI covers JAMB, WAEC, NECO, GCE (Nigeria), KCSE, KCPE (Kenya), WASSCE, BECE (Ghana), CSEE, ACSEE (Tanzania), UCE, UACE (Uganda), plus university and professional exams."},
        {q:"How is PassAI different from other study apps?",a:"PassAI uses real AI (Claude by Anthropic) trained on African curricula. It gives curriculum-specific answers, knows your exam format, and uses local examples relevant to your country."},
        {q:"Can I upload my textbooks?",a:"Yes! Pro plan users can upload any PDF textbook and ask the AI questions about specific chapters, topics, or concepts."},
        {q:"How do I pay? Are Nigerian/Kenyan cards accepted?",a:"We accept all major cards including local Nigerian and Kenyan bank cards. We also support mobile money where available."},
        {q:"Is my data safe?",a:"Yes. All data is encrypted and stored securely. We never sell your data to third parties. Your study history is private."},
      ].map((faq,i)=><FAQItem key={i} q={faq.q} a={faq.a}/>)}
    </div>

    {/* PRICING */}
    <div style={{background:G.purple900,padding:"3.5rem 1.5rem"}}>
      <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
        <h2 className="outfit" style={{color:G.white,fontSize:"clamp(1.5rem,3vw,2rem)",fontWeight:800,marginBottom:6,letterSpacing:"-0.5px"}}>Affordable for Every Student</h2>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:"2rem",flexWrap:"wrap"}}>
          {Object.entries(COUNTRIES).map(([n,d])=><span key={n} style={{fontSize:12,color:`${G.white}60`,padding:"3px 10px",border:`1px solid ${G.purple700}`,borderRadius:20}}>{d.flag} {d.currency}{d.plans.basic}/{d.currency}{d.plans.pro}</span>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
          {[
            {name:"Free",price:"Free",period:"forever",features:["10 questions/day","Basic AI Q&A","All 5 countries","Basic progress"],v:"outline",cta:"Start Free"},
            {name:"Basic",price:"Local price",period:"/month",features:["Unlimited questions","Full AI Tutor","All past questions","Progress tracking","Study schedule"],v:"primary",cta:"Go Basic",popular:true},
            {name:"Pro",price:"Local price",period:"/month",features:["Everything in Basic","PDF textbook upload","AI exam simulator","WhatsApp support","Offline access"],v:"amber",cta:"Go Pro"},
          ].map(p=><div key={p.name} style={{background:p.popular?G.purple700:G.purple800,borderRadius:16,padding:"1.5rem",border:p.popular?`2px solid ${G.amber500}`:`1px solid ${G.purple700}`,position:"relative"}}>
            {p.popular&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:G.amber500,color:G.white,fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:20,whiteSpace:"nowrap"}}>MOST POPULAR</div>}
            <div className="outfit" style={{color:G.white,fontWeight:800,fontSize:18,marginBottom:4}}>{p.name}</div>
            <div style={{marginBottom:14}}><span className="outfit" style={{color:G.amber400,fontWeight:800,fontSize:22}}>{p.price}</span><span style={{color:`${G.white}50`,fontSize:12}}>{p.period}</span></div>
            {p.features.map(f=><div key={f} style={{display:"flex",gap:8,marginBottom:8,fontSize:13,color:`${G.white}cc`}}><span style={{color:G.purple400,fontWeight:700,flexShrink:0}}>✓</span>{f}</div>)}
            <Btn variant={p.v} full style={{marginTop:16}} onClick={submit}>{p.cta}</Btn>
          </div>)}
        </div>
      </div>
    </div>
    {/* FINAL CTA */}
    <div style={{padding:"3rem 1.5rem",background:G.cream}}>
      <div style={{maxWidth:700,margin:"0 auto",textAlign:"center",padding:"3rem",background:`linear-gradient(135deg,${G.purple800},${G.purple600})`,borderRadius:24}}>
        <div style={{fontSize:40,marginBottom:12}}>🎯</div>
        <h2 className="outfit" style={{color:G.white,fontSize:"clamp(1.4rem,3vw,1.8rem)",fontWeight:800,marginBottom:12,letterSpacing:"-0.5px"}}>Ready to Pass Your Exams?</h2>
        <p style={{color:`${G.white}80`,fontSize:15,marginBottom:20,lineHeight:1.7}}>Join thousands of students across Africa studying smarter with PassAI. Start free today — no credit card needed.</p>
        <Btn variant="amber" size="lg" onClick={()=>{setMode("signup");setStep(1);window.scrollTo({top:0,behavior:"smooth"})}}>Start Studying Free →</Btn>
      </div>
    </div>
  </div>
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV=[{id:"dashboard",icon:"⊞",label:"Dashboard"},{id:"ai-tutor",icon:"🤖",label:"AI Tutor"},{id:"past-questions",icon:"📚",label:"Past Questions"},{id:"practice-test",icon:"📝",label:"Practice Test"},{id:"schedule",icon:"📅",label:"Study Schedule"},{id:"progress",icon:"📊",label:"Progress"}];

function Sidebar({active,onNav,user,onLogout}){
  const c=COUNTRIES[user.country]||COUNTRIES.Nigeria;
  return <div style={{width:220,background:G.purple900,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0}}>
    <div style={{padding:"1.25rem 1rem 1rem",borderBottom:`1px solid ${G.purple800}`}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div style={{width:32,height:32,borderRadius:9,background:G.amber500,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🎯</div>
        <span className="outfit" style={{color:G.white,fontWeight:800,fontSize:20}}>PassAI</span>
      </div>
      <div style={{fontSize:12,color:`${G.white}60`}}>{c.flag} {user.country} · {"Secondary School"||"Secondary"} · {user.exam}</div>
    </div>
    <nav style={{flex:1,padding:"0.75rem 0.5rem"}}>
      {NAV.map(n=><button key={n.id} onClick={()=>onNav(n.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:"none",background:active===n.id?G.purple700:"transparent",color:active===n.id?G.white:`${G.white}60`,cursor:"pointer",marginBottom:2,transition:"all 0.15s",fontSize:14,fontWeight:active===n.id?600:400,textAlign:"left"}}>
        <span style={{fontSize:16}}>{n.icon}</span>{n.label}
      </button>)}
    </nav>
    <div style={{padding:"1rem",borderTop:`1px solid ${G.purple800}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <Avatar name={user.name} size={34}/>
        <div style={{minWidth:0}}><div style={{color:G.white,fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.name}</div><div style={{color:`${G.white}50`,fontSize:11}}>Free Plan</div></div>
      </div>
      <button onClick={onLogout} style={{width:"100%",padding:"7px",border:`1px solid ${G.purple800}`,borderRadius:8,background:"transparent",color:`${G.white}55`,fontSize:12,cursor:"pointer"}}>Sign Out</button>
    </div>
  </div>
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({user}){
  const c=COUNTRIES[user.country]||COUNTRIES.Nigeria;
  const p=MOCK;
  return <div className="fade-in" style={{padding:"2rem"}}>
    <div style={{marginBottom:"1.5rem",display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
      <div><h1 className="outfit" style={{fontSize:26,fontWeight:800,color:G.gray900}}>Good day, {user.name.split(" ")[0]} {c.flag}</h1>
      <p style={{color:G.gray500,fontSize:14,marginTop:4}}>{new Date().toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric"})} · <strong>{user.exam}</strong></p></div>
      <Tag color={G.purple700} bg={G.purple50} style={{fontSize:13,padding:"6px 14px"}}>{c.flag} {user.country}</Tag>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:"1.5rem"}}>
      <StatCard label="Day Streak" value={`${p.streak}🔥`} icon="🔥" color={G.amber500} bg={G.amber50}/>
      <StatCard label="Today" value={`${p.questionsToday}/10`} icon="✅" color={G.purple600} bg={G.purple50}/>
      <StatCard label="Total" value={p.totalQuestions} icon="📝" color={G.purple} bg={G.purpleBg}/>
      <StatCard label="Accuracy" value={`${p.accuracy}%`} icon="🎯" color={G.blue} bg={G.blueBg}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}} className="mobile-col">
      <Card>
        <div className="outfit" style={{fontWeight:700,fontSize:15,marginBottom:16}}>Subject Performance</div>
        {Object.entries(p.subjects).map(([sub,acc])=><div key={sub} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:G.gray700,fontWeight:500}}>{sub}</span><span style={{fontSize:13,fontWeight:700,color:acc>=75?G.purple600:acc>=60?"#e67e22":G.danger}}>{acc}%</span></div>
          <ProgressBar value={acc} color={acc>=75?G.purple500:acc>=60?"#e67e22":G.danger}/>
        </div>)}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card style={{background:G.purple50,border:`1px solid ${G.purple100}`}}><div style={{fontSize:24,marginBottom:6}}>🏆</div><div style={{fontSize:11,color:G.purple700,fontWeight:700,marginBottom:2}}>TOP SUBJECT</div><div className="outfit" style={{fontSize:20,fontWeight:800,color:G.purple700}}>Physics</div><div style={{fontSize:12,color:G.purple600,marginTop:2}}>81% accuracy</div></Card>
        <Card style={{background:G.amber50,border:`1px solid ${G.amber100}`}}><div style={{fontSize:24,marginBottom:6}}>⚡</div><div style={{fontSize:11,color:G.amber500,fontWeight:700,marginBottom:2}}>FOCUS HERE</div><div className="outfit" style={{fontSize:20,fontWeight:800,color:G.amber500}}>Biology</div><div style={{fontSize:12,color:G.gray500,marginTop:2}}>65% — needs work</div></Card>
        <Card style={{background:G.purple900,border:"none"}}><div style={{fontSize:11,color:`${G.white}60`,fontWeight:700,marginBottom:4}}>EXAM READINESS</div><div className="outfit" style={{fontSize:34,fontWeight:800,color:G.white,lineHeight:1,marginBottom:8}}>72%</div><ProgressBar value={72} color={G.amber500}/><div style={{fontSize:11,color:`${G.white}50`,marginTop:6}}>Target: 80%</div></Card>
      </div>
    </div>
    <div style={{marginTop:16}}>
      <Card style={{background:G.amber50,border:`1px solid ${G.amber100}`}}>
        <div className="outfit" style={{fontWeight:700,fontSize:14,marginBottom:4,color:G.gray900}}>💡 {user.exam} Tip</div>
        <p style={{fontSize:13,color:G.gray700,lineHeight:1.65}}>{c.tip}</p>
      </Card>
    </div>
  </div>
}

// ─── AI TUTOR ─────────────────────────────────────────────────────────────────
function AITutor({user}){
  const c=COUNTRIES[user.country]||COUNTRIES.Nigeria;
  const [mode,setMode]=useState("chat"); // "chat" | "lesson"
  const [messages,setMessages]=useState([{role:"assistant",content:"👋 Hey! I'm your PassAI teacher.\n\nI can help you in two ways:\n📖 **Lesson Mode** — I pick a topic and teach it step by step\n💬 **Chat Mode** — Ask me anything and I'll explain it\n\nWhat subject do you want to start with?",suggestions:["Teach me Mathematics","Teach me Physics","Teach me Chemistry","Teach me Biology"]}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [lessonTopic,setLessonTopic]=useState(null);
  const [lessonStep,setLessonStep]=useState(0);
  const [voiceEnabled,setVoiceEnabled]=useState(true);
  const [listening,setListening]=useState(false);
  const [speaking,setSpeaking]=useState(false);
  const bottomRef=useRef();
  const recognitionRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[messages]);

  const LESSON_STEPS=["📖 Introduction","🔍 Deep Explanation","✏️ Worked Example","🧠 Common Mistakes","📝 Practice Question"];

  const formatMessage=(text)=>{
    // Split by lines and render with basic formatting
    return text.split("\n").map((line,i)=>{
      if(line.startsWith("**")&&line.endsWith("**")) return <div key={i} style={{fontWeight:700,color:G.gray900,marginTop:8,marginBottom:2}}>{line.slice(2,-2)}</div>;
      if(line.startsWith("# ")) return <div key={i} className="outfit" style={{fontWeight:800,fontSize:17,color:G.gray900,marginTop:10,marginBottom:4}}>{line.slice(2)}</div>;
      if(line.startsWith("## ")) return <div key={i} className="outfit" style={{fontWeight:700,fontSize:15,color:G.purple700||"#5a0fa8",marginTop:8,marginBottom:3}}>{line.slice(3)}</div>;
      if(line.startsWith("• ")||line.startsWith("- ")) return <div key={i} style={{display:"flex",gap:8,marginTop:3}}><span style={{color:G.amber500,fontWeight:700,flexShrink:0}}>•</span><span>{line.slice(2)}</span></div>;
      if(line.match(/^\d+\./)) return <div key={i} style={{display:"flex",gap:8,marginTop:4}}><span style={{color:G.purple600||"#7c3aed",fontWeight:700,minWidth:20,flexShrink:0}}>{line.split(".")[0]}.</span><span>{line.split(".").slice(1).join(".").trim()}</span></div>;
      if(line.startsWith("✅")||line.startsWith("❌")||line.startsWith("⚡")||line.startsWith("💡")||line.startsWith("📌")||line.startsWith("🎯")) return <div key={i} style={{marginTop:5,padding:"6px 10px",background:G.amber50,borderRadius:8,fontSize:13}}>{line}</div>;
      if(line.trim()==="") return <div key={i} style={{height:6}}/>;
      return <div key={i} style={{marginTop:2,lineHeight:1.75}}>{line}</div>;
    });
  };

  const buildSystem=(isLesson,topic,step)=>{
    const stepInstructions=[
      "Give a short exciting introduction to the topic. Why does it matter? Where is it used in real life in "+user.country+"? 3-4 sentences. End with: what we will cover today.",
      "Give a thorough but clear explanation. Use numbered steps. Include the key formula or rule. Use a simple analogy relevant to "+user.country+".",
      "Show one complete worked example step-by-step. Number every step. Show all working. This must be exam-style for "+user.exam+".",
      "List 3 common mistakes students make on this topic in "+user.exam+". For each: show the WRONG approach then the RIGHT approach.",
      "Give one exam-style practice question. After a blank line write ANSWER: and give the full solution. Then give an Exam Tip."
    ];
    const base="You are PassAI — an expert African exam teacher. Warm, encouraging, brilliant at making complex topics simple.\n\nSTUDENT: "+user.country+" "+c.flag+" | Exam: "+user.exam+" | Curriculum: "+c.curriculum+"\n\n";
    if(isLesson){
      return base+"LESSON MODE — Teaching: "+topic+"\nStep "+(step+1)+" of 5: "+LESSON_STEPS[step]+"\n\nFor this step: "+stepInstructions[step]+"\n\nFormat with ## headers, numbered steps, bullet points. Be concise but complete.";
    }
    return base+"CHAT MODE — Answer the student question directly.\nRules:\n1. Use ## headers for long answers\n2. Number every calculation step\n3. Use bullet points for lists\n4. Always end with Exam Tip\n5. Use local "+user.country+" examples (currency "+c.currency+")\n6. Show WHY wrong answers are wrong";
  };

  const send=async(text=input,isLesson=false,topic=null,step=0)=>{
    if(!text.trim()||loading)return;
    const userMsg={role:"user",content:text};
    setMessages(p=>[...p,userMsg]);
    setInput("");setLoading(true);
    try{
      const history=[...messages,userMsg].filter(m=>!m.suggestions).map(m=>({role:m.role,content:m.content}));
      const res=await fetch("https://passai-production-7757.up.railway.app/ai/ask",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system:buildSystem(isLesson,topic||lessonTopic,step),
          messages:history.slice(-16)
        })
      });
      const d=await res.json();
      const reply=d.content?.[0]?.text||"Sorry, try again.";
      const nextStep=isLesson?step+1:null;
      const suggestions=isLesson&&nextStep<5
        ?[LESSON_STEPS[nextStep]+" →"]
        :isLesson&&nextStep>=5
        ?["Practice more questions","Teach me another topic","Quiz me on this topic"]
        :["Show me an example","Explain differently","Give me a harder question","Quiz me"];
      const newMsg={role:"assistant",content:reply,suggestions,isLesson,step:isLesson?step:null};
      setMessages(p=>[...p,newMsg]);
      if(isLesson)setLessonStep(nextStep);
      if(voiceEnabled)speak(reply);
    }catch{
      setMessages(p=>[...p,{role:"assistant",content:"⚠️ Connection error. Please try again.",suggestions:[]}]);
    }
    setLoading(false);
  };

  const speak=(text)=>{
    if(!window.speechSynthesis)return;
    window.speechSynthesis.cancel();
    const clean=text.replace(/[#*•→]/g,"").replace(/
+/g," ").trim();
    const utt=new SpeechSynthesisUtterance(clean);
    utt.rate=0.92;utt.pitch=1.05;utt.volume=1;
    const voices=window.speechSynthesis.getVoices();
    const preferred=voices.find(v=>v.name.includes("Google UK English Female")||v.name.includes("Samantha")||v.name.includes("Karen")||v.name.includes("Moira")||(v.lang==="en-GB"&&v.localService));
    if(preferred)utt.voice=preferred;
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking=()=>{window.speechSynthesis?.cancel();setSpeaking(false);};

  const startListening=()=>{
    if(!("webkitSpeechRecognition" in window||"SpeechRecognition" in window)){
      alert("Voice not supported in this browser. Please use Chrome.");return;
    }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.lang=user.country==="Tanzania"||user.country==="Kenya"?"sw-KE":"en-NG";
    rec.interimResults=false;rec.maxAlternatives=1;
    rec.onstart=()=>setListening(true);
    rec.onend=()=>setListening(false);
    rec.onerror=()=>setListening(false);
    rec.onresult=(e)=>{
      const transcript=e.results[0][0].transcript;
      setInput(transcript);
      setTimeout(()=>send(transcript),300);
    };
    recognitionRef.current=rec;
    rec.start();
  };

  const startLesson=(subject)=>{
    const topic=`${user.exam} ${subject} — Core Concepts`;
    setLessonTopic(topic);
    setLessonStep(0);
    setMode("lesson");
    send(`Start teaching me: ${topic}`,true,topic,0);
  };

  const handleSuggestion=(s,msg)=>{
    if(s.includes("→")&&msg.isLesson){
      send(`Continue to: ${s.replace(" →","")}`,true,lessonTopic,msg.step+1);
    }else if(s.startsWith("Teach me ")){
      startLesson(s.replace("Teach me ",""));
    }else{
      send(s,false);
    }
  };

  const SUBJECTS=c.subjects.slice(0,6);

  return <div className="fade-in" style={{height:"100%",display:"flex",flexDirection:"column",background:"#fafafa"}}>
    {/* Header */}
    <div style={{padding:"1rem 1.5rem",borderBottom:`1px solid ${G.gray100}`,background:G.white,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${G.purple800||"#3b0764"},${G.purple600||"#7c3aed"})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎓</div>
        <div>
          <div className="outfit" style={{fontWeight:800,fontSize:16,color:G.gray900}}>AI Teacher</div>
          <div style={{fontSize:11,color:G.gray500}}>{c.flag} {user.country} · {user.exam} · {mode==="lesson"&&lessonTopic?lessonTopic:"Chat Mode"}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <button onClick={()=>{voiceEnabled?stopSpeaking():null;setVoiceEnabled(p=>!p)}} title={voiceEnabled?"Mute AI voice":"Unmute AI voice"} style={{width:32,height:32,borderRadius:"50%",border:`1.5px solid ${voiceEnabled?G.green400:G.gray100}`,background:voiceEnabled?G.green50:G.white,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>{voiceEnabled?"🔊":"🔇"}</button>
        {["chat","lesson"].map(m=><button key={m} onClick={()=>setMode(m)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${mode===m?"#7c3aed":G.gray100}`,background:mode===m?"#f5f3ff":G.white,color:mode===m?"#6d28d9":G.gray500,fontSize:12,fontWeight:700,cursor:"pointer"}}>{m==="chat"?"💬 Chat":"📖 Lesson"}</button>)}
      </div>
    </div>

    {/* Messages */}
    <div style={{flex:1,overflowY:"auto",padding:"1.25rem",display:"flex",flexDirection:"column",gap:14,minHeight:0}}>

      {/* Lesson progress bar */}
      {mode==="lesson"&&lessonTopic&&<div style={{background:G.white,border:`1px solid ${G.gray100}`,borderRadius:12,padding:"10px 14px"}}>
        <div style={{fontSize:11,fontWeight:700,color:G.gray500,marginBottom:8,letterSpacing:"0.04em"}}>LESSON PROGRESS</div>
        <div style={{display:"flex",gap:4}}>
          {LESSON_STEPS.map((s,i)=><div key={i} style={{flex:1,textAlign:"center"}}>
            <div style={{height:4,borderRadius:4,background:i<lessonStep?(G.purple600||"#7c3aed"):i===lessonStep?G.amber500:G.gray100,marginBottom:4,transition:"background 0.3s"}}/>
            <div style={{fontSize:9,color:i<lessonStep?(G.purple600||"#7c3aed"):G.gray400,fontWeight:i===lessonStep?700:400}}>{s.split(" ")[0]}</div>
          </div>)}
        </div>
      </div>}

      {/* Chat mode subject picker */}
      {mode==="lesson"&&!lessonTopic&&<div style={{background:G.white,border:`1px solid ${G.gray100}`,borderRadius:16,padding:"1.25rem"}}>
        <div className="outfit" style={{fontWeight:700,fontSize:14,marginBottom:12,color:G.gray900}}>📖 Choose a subject to start your lesson:</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {SUBJECTS.map(s=><button key={s} onClick={()=>startLesson(s)} style={{padding:"10px 12px",border:`1.5px solid ${G.gray100}`,borderRadius:10,background:G.white,color:G.gray700,cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:600,transition:"all 0.15s",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>{s==="Mathematics"?"🔢":s==="Physics"?"⚡":s==="Chemistry"?"🧪":s==="Biology"?"🧬":s==="English"||s==="English Language"?"📝":"📚"}</span>{s}
          </button>)}
        </div>
      </div>}

      {messages.map((m,i)=><div key={i} style={{display:"flex",gap:10,flexDirection:m.role==="user"?"row-reverse":"row",alignItems:"flex-start"}}>
        {m.role==="assistant"&&<div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${G.purple800||"#3b0764"},${G.purple600||"#7c3aed"})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>🎓</div>}
        {m.role==="user"&&<Avatar name={user.name} size={36}/>}
        <div style={{maxWidth:"82%",display:"flex",flexDirection:"column",gap:8,alignItems:m.role==="user"?"flex-end":"flex-start"}}>
          <div style={{background:m.role==="user"?`linear-gradient(135deg,${G.purple700||"#5b21b6"},${G.purple600||"#7c3aed"})`:G.white,color:m.role==="user"?G.white:G.gray900,borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"12px 16px",fontSize:14,lineHeight:1.7,border:m.role==="assistant"?`1px solid ${G.gray100}`:"none",boxShadow:m.role==="assistant"?"0 1px 4px rgba(0,0,0,0.06)":"none"}}>
            {m.role==="assistant"?formatMessage(m.content):m.content}
          </div>
          {/* Lesson step badge */}
          {m.isLesson&&m.step!=null&&<div style={{fontSize:10,color:G.gray400,fontWeight:600}}>{LESSON_STEPS[m.step]}</div>}
          {/* Suggestion chips */}
          {m.suggestions&&m.suggestions.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {m.suggestions.map((s,si)=><button key={si} onClick={()=>handleSuggestion(s,m)} style={{padding:"6px 12px",borderRadius:20,border:`1.5px solid ${G.purple200||"#ddd6fe"}`,background:G.purple50||"#f5f3ff",color:G.purple700||"#6d28d9",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s"}}>{s}</button>)}
          </div>}
        </div>
      </div>)}

      {loading&&<div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{width:36,height:36,borderRadius:12,background:`linear-gradient(135deg,${G.purple800||"#3b0764"},${G.purple600||"#7c3aed"})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🎓</div>
        <div style={{background:G.white,border:`1px solid ${G.gray100}`,borderRadius:"18px 18px 18px 4px",padding:"14px 18px",display:"flex",gap:6,alignItems:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
          <span style={{fontSize:12,color:G.gray500,fontWeight:500}}>Teacher is thinking</span>
          {[0,1,2].map(i=><div key={i} className="pulse" style={{width:6,height:6,borderRadius:"50%",background:G.purple400||"#a78bfa",animationDelay:`${i*0.18}s`}}/>)}
        </div>
      </div>}
      <div ref={bottomRef}/>
    </div>

    {/* Input area */}
    <div style={{padding:"0.875rem 1.25rem",borderTop:`1px solid ${G.gray100}`,background:G.white,flexShrink:0}}>
      {/* Listening indicator */}
      {listening&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:"#fff0f0",borderRadius:10,marginBottom:4}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:"#e74c3c",animation:"pulse 0.8s ease infinite"}}/>
        <span style={{fontSize:13,color:"#e74c3c",fontWeight:600}}>Listening... speak now</span>
        <button onClick={()=>recognitionRef.current?.stop()} style={{marginLeft:"auto",fontSize:12,color:"#e74c3c",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Stop</button>
      </div>}
      <div style={{display:"flex",gap:8,background:"#f5f4f0",border:`1.5px solid ${G.gray100}`,borderRadius:14,padding:"6px 6px 6px 14px"}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}
          placeholder={listening?"Listening...":mode==="lesson"?"Ask about the lesson… or tap 🎤 to speak":`Ask anything about ${user.exam}… or tap 🎤`}
          style={{flex:1,border:"none",outline:"none",resize:"none",fontSize:14,lineHeight:1.5,color:G.gray900,background:"transparent",minHeight:36,maxHeight:100,fontFamily:"'Plus Jakarta Sans',sans-serif"}} rows={1}/>
        <div style={{display:"flex",gap:6,alignSelf:"flex-end"}}>
          <button onClick={startListening} disabled={listening||loading} title="Speak your question" style={{width:36,height:36,borderRadius:10,border:`1.5px solid ${listening?"#e74c3c":G.gray100}`,background:listening?"#fff0f0":G.white,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",opacity:listening?1:0.8}}>{listening?"⏹":"🎤"}</button>
          <Btn onClick={()=>send()} disabled={!input.trim()||loading} loading={loading} style={{borderRadius:10}}>Send ↑</Btn>
        </div>
      </div>
    </div>
  </div>
}


// ─── PAST QUESTIONS ───────────────────────────────────────────────────────────
const API="https://passai-production-7757.up.railway.app";

function PastQuestions({user}){
  const [filterCountry,setFilterCountry]=useState(user.country||"Nigeria");
  const [filterExam,setFilterExam]=useState("All");
  const [filterSubject,setFilterSubject]=useState("All");
  const [answered,setAnswered]=useState({});
  const [aiExplain,setAiExplain]=useState({});
  const [loadingEx,setLoadingEx]=useState({});
  const [questions,setQuestions]=useState([]);
  const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(false);
  const [offset,setOffset]=useState(0);
  const LIMIT=20;
  const c=COUNTRIES[filterCountry]||COUNTRIES.Nigeria;

  const SUPABASE_URL="https://apqmlgnfvthgtbymvyyn.supabase.co";
  const SUPABASE_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwcW1sZ25mdnRoZ3RieW12eXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMjQ0MDUsImV4cCI6MjA5MTgwMDQwNX0.KBqPnC5JX8aaZc3uFpp7lxA7p4fM_awa61yA06kmvLg";

  const fetchQuestions=async(country,exam,subject,off=0)=>{
    setLoading(true);
    try{
      let url=`${SUPABASE_URL}/rest/v1/past_questions?select=*&country=eq.${encodeURIComponent(country)}&order=year.desc&limit=${LIMIT}&offset=${off}`;
      if(exam&&exam!=="All")url+=`&exam=eq.${encodeURIComponent(exam)}`;
      if(subject&&subject!=="All")url+=`&subject=eq.${encodeURIComponent(subject)}`;
      const res=await fetch(url,{headers:{
        "apikey":SUPABASE_ANON,
        "Authorization":`Bearer ${SUPABASE_ANON}`,
        "Prefer":"count=exact"
      }});
      const totalCount=res.headers.get("content-range")?.split("/")?.[1];
      const d=await res.json();
      if(off===0)setQuestions(Array.isArray(d)?d:[]);
      else setQuestions(p=>[...p,...(Array.isArray(d)?d:[])]);
      setTotal(parseInt(totalCount)||0);
      setOffset(off);
    }catch(e){console.error("Questions fetch error:",e)}
    setLoading(false);
  };

  useEffect(()=>{fetchQuestions(filterCountry,filterExam,filterSubject,0);},[filterCountry,filterExam,filterSubject]);

  const filtered=questions;

  const getExplain=async(q)=>{
    setLoadingEx(p=>({...p,[q.id]:true}));
    try{
      const res=await fetch("https://passai-production-7757.up.railway.app/ai/ask",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:`${q.exam} ${q.year} ${q.subject} (${q.country}):\nQ: ${q.question}\nAnswer: ${q.options[q.answer]}\n\nExplain clearly for a ${q.country} student. Cover why the correct answer is right and why wrong options are wrong. Reference ${COUNTRIES[q.country]?.curriculum}. Be concise.`}]})
      });
      const d=await res.json();
      setAiExplain(p=>({...p,[q.id]:d.content?.[0]?.text||"Explanation unavailable."}));
    }catch{setAiExplain(p=>({...p,[q.id]:"Error loading."}))}
    setLoadingEx(p=>({...p,[q.id]:false}));
  };

  return <div className="fade-in" style={{padding:"2rem"}}>
    <h1 className="outfit" style={{fontSize:22,fontWeight:800,color:G.gray900,marginBottom:4}}>Past Questions 📚</h1>
    <p style={{color:G.gray500,fontSize:13,marginBottom:"1rem"}}>Verified questions across 5 countries</p>
    <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
      {Object.entries(COUNTRIES).map(([name,data])=><button key={name} onClick={()=>{setFilterCountry(name);setFilterExam("All");setFilterSubject("All")}} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${filterCountry===name?G.purple400:G.gray100}`,background:filterCountry===name?G.purple50:G.white,color:filterCountry===name?G.purple700:G.gray500,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
        <span>{data.flag}</span>{name}
      </button>)}
    </div>
    <Card style={{marginBottom:12,padding:"0.875rem"}}>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
        {[["Exam",["All",...c.exams],filterExam,setFilterExam],["Subject",["All",...c.subjects.slice(0,8)],filterSubject,setFilterSubject]].map(([label,opts,val,set])=>(
          <div key={label}><label style={{fontSize:11,fontWeight:700,color:G.gray400,display:"block",marginBottom:4}}>{label}</label>
          <select value={val} onChange={e=>set(e.target.value)} style={{padding:"7px 12px",border:`1.5px solid ${G.gray100}`,borderRadius:8,fontSize:13,outline:"none",background:G.white}}>
            {opts.map(o=><option key={o}>{o}</option>)}
          </select></div>
        ))}
        <Tag color={G.purple700} bg={G.purple50} style={{marginLeft:"auto"}}>{filtered.length} questions</Tag>
      </div>
    </Card>
    {loading&&questions.length===0&&<div style={{textAlign:"center",padding:"3rem",color:G.gray400}}><Spinner size={32}/><div style={{marginTop:12,fontWeight:600}}>Loading questions...</div></div>}
    {!loading&&filtered.length===0&&<div style={{textAlign:"center",padding:"3rem",color:G.gray400}}><div style={{fontSize:40,marginBottom:12}}>📭</div><div style={{fontWeight:600}}>No questions found</div><div style={{fontSize:13,marginTop:4}}>Try selecting All for Exam or Subject</div></div>}
    {filtered.map(q=>{
      const opts=typeof q.options==="string"?JSON.parse(q.options):q.options;
      const correctIdx=q.correct_index??q.answer??0;
      const ua=answered[q.id];const ok=ua===correctIdx;
      return <Card key={q.id} style={{marginBottom:12}}>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          <Tag color={G.purple} bg={G.purpleBg}>{q.exam}</Tag><Tag color={G.purple700} bg={G.purple50}>{q.year}</Tag><Tag color={G.gray700} bg={G.gray50}>{q.subject}</Tag>
          {q.difficulty&&<Tag color={q.difficulty==="easy"?"#27ae60":q.difficulty==="hard"?"#e74c3c":"#f39c12"} bg={q.difficulty==="easy"?"#eafaf1":q.difficulty==="hard"?"#fdedec":"#fef9e7"}>{q.difficulty}</Tag>}
        </div>
        <p style={{fontSize:15,color:G.gray900,fontWeight:500,marginBottom:12,lineHeight:1.6}}>{q.question}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {opts.map((opt,i)=>{
            let bg=G.white,border=`1.5px solid ${G.gray100}`,color=G.gray900;
            if(ua!==undefined){if(i===correctIdx){bg=G.purple50;border=`1.5px solid ${G.purple400}`;color=G.purple700}else if(i===ua&&!ok){bg=G.dangerBg;border=`1.5px solid ${G.danger}`;color=G.danger}}
            return <button key={i} onClick={()=>{if(ua===undefined)setAnswered(p=>({...p,[q.id]:i}))}} style={{padding:"10px 13px",border,borderRadius:10,background:bg,color,cursor:ua===undefined?"pointer":"default",textAlign:"left",fontSize:13,fontWeight:500,transition:"all 0.18s"}}>
              <span style={{fontWeight:700,marginRight:6,opacity:0.4}}>{String.fromCharCode(65+i)}.</span>{opt}
            </button>
          })}
        </div>
        {ua!==undefined&&<div style={{marginTop:12}}>
          <div style={{padding:"9px 13px",borderRadius:10,background:ok?G.purple50:G.dangerBg,fontSize:13,color:ok?G.purple700:G.danger,fontWeight:600,marginBottom:8}}>{ok?"✅ Correct!":"❌ Incorrect — answer: "+opts[correctIdx]}</div>
          {q.explanation&&<div style={{background:G.amber50,border:`1px solid ${G.amber100}`,borderRadius:10,padding:"10px 13px",fontSize:13,lineHeight:1.7,color:G.gray700,marginBottom:8}}>{q.explanation}</div>}
          {!aiExplain[q.id]&&<Btn variant="outline" size="sm" loading={loadingEx[q.id]} onClick={()=>getExplain(q)}>🤖 AI Explanation</Btn>}
          {aiExplain[q.id]&&<div style={{background:G.amber50,border:`1px solid ${G.amber100}`,borderRadius:10,padding:"12px 14px",fontSize:13,lineHeight:1.7,color:G.gray700,whiteSpace:"pre-wrap"}}>{aiExplain[q.id]}</div>}
        </div>}
      </Card>
    })}
    {questions.length<total&&<div style={{textAlign:"center",marginTop:8}}>
      <Btn variant="outline" loading={loading} onClick={()=>fetchQuestions(filterCountry,filterExam,filterSubject,offset+LIMIT)}>Load More Questions</Btn>
      <div style={{fontSize:12,color:G.gray400,marginTop:6}}>Showing {questions.length} of {total}</div>
    </div>}
  </div>
}

// ─── PRACTICE TEST ────────────────────────────────────────────────────────────
function PracticeTest({user}){
  const c=COUNTRIES[user.country]||COUNTRIES.Nigeria;
  const currentExams=c.exams;
  const [cfg,setCfg]=useState({subject:c.subjects[0],exam:user.exam,count:5,difficulty:"Mixed"});
  const [phase,setPhase]=useState("setup");
  const [qs,setQs]=useState([]);
  const [ans,setAns]=useState({});
  const [cur,setCur]=useState(0);
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);

  const generate=async()=>{
    setLoading(true);
    try{
      const res=await fetch("https://passai-production-7757.up.railway.app/ai/ask",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:`Generate exactly ${cfg.count} ${cfg.difficulty} ${cfg.exam} questions on "${cfg.subject}" for ${user.country}.\nAlign with ${c.curriculum}.\nReturn ONLY valid JSON array:\n[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]`}]})
      });
      const d=await res.json();
      let text=d.content?.[0]?.text||"[]";
      text=text.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      setQs(JSON.parse(text));setPhase("test");setCur(0);setAns({});setDone(false);
    }catch{alert("Error generating test.")}
    setLoading(false);
  };

  const score=Object.entries(ans).filter(([i,a])=>qs[parseInt(i)]?.answer===a).length;
  const pct=qs.length?Math.round((score/qs.length)*100):0;

  if(phase==="setup") return <div className="fade-in" style={{padding:"2rem",maxWidth:540}}>
    <h1 className="outfit" style={{fontSize:22,fontWeight:800,color:G.gray900,marginBottom:4}}>Practice Test 📝</h1>
    <p style={{color:G.gray500,fontSize:13,marginBottom:"1.25rem"}}>{c.flag} {user.country} · AI-generated questions</p>
    <Card>
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Exam</label>
        <select value={cfg.exam} onChange={e=>setCfg(p=>({...p,exam:e.target.value}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none",background:G.white}}>{currentExams.map(o=><option key={o}>{o}</option>)}</select>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Subject</label>
        <select value={cfg.subject} onChange={e=>setCfg(p=>({...p,subject:e.target.value}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none",background:G.white}}>{c.subjects.map(o=><option key={o}>{o}</option>)}</select>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Questions: {cfg.count}</label>
        <input type="range" min={5} max={20} step={5} value={cfg.count} onChange={e=>setCfg(p=>({...p,count:parseInt(e.target.value)}))} style={{width:"100%"}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:G.gray400,marginTop:3}}>{[5,10,15,20].map(v=><span key={v}>{v}</span>)}</div>
      </div>
      <div style={{marginBottom:20}}>
        <label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:8}}>Difficulty</label>
        <div style={{display:"flex",gap:8}}>{["Easy","Mixed","Hard"].map(d=><button key={d} onClick={()=>setCfg(p=>({...p,difficulty:d}))} style={{flex:1,padding:"9px",border:`1.5px solid ${cfg.difficulty===d?G.purple400:G.gray100}`,borderRadius:10,background:cfg.difficulty===d?G.purple50:G.white,color:cfg.difficulty===d?G.purple700:G.gray400,fontWeight:600,fontSize:13,cursor:"pointer"}}>{d}</button>)}</div>
      </div>
      <Btn full loading={loading} onClick={generate}>🤖 Generate AI Test</Btn>
    </Card>
  </div>

  if(done) return <div className="fade-in" style={{padding:"2rem",maxWidth:640}}>
    <Card style={{textAlign:"center",marginBottom:14,background:pct>=80?G.purple50:G.amber50,border:`1px solid ${pct>=80?G.purple100:G.amber100}`}}>
      <div style={{fontSize:52,marginBottom:8}}>{pct>=80?"🏆":pct>=60?"👍":"📚"}</div>
      <div className="outfit" style={{fontSize:28,fontWeight:800}}>{score}/{qs.length}</div>
      <div className="outfit" style={{fontSize:36,fontWeight:800,color:pct>=80?G.purple600:G.amber500,marginBottom:4}}>{pct}%</div>
      <p style={{color:G.gray500,fontSize:13}}>{pct>=80?"Excellent! 🔥":pct>=60?"Good work! Review errors.":"Keep practising!"}</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:14}}>
        <Btn variant="outline" onClick={()=>setPhase("setup")}>New Test</Btn>
        <Btn onClick={()=>setDone(false)}>Review Answers</Btn>
      </div>
    </Card>
    {qs.map((q,i)=><Card key={i} style={{marginBottom:10,borderLeft:`4px solid ${ans[i]===q.answer?G.purple500:G.danger}`}}>
      <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>Q{i+1}. {q.question}</div>
      <div style={{fontSize:13,color:ans[i]===q.answer?G.purple600:G.danger,marginBottom:4}}>{ans[i]===q.answer?"✅":"❌"} {q.options[ans[i]]||"Not answered"}</div>
      {ans[i]!==q.answer&&<div style={{fontSize:13,color:G.purple600,marginBottom:4}}>✅ {q.options[q.answer]}</div>}
      <div style={{fontSize:12,color:G.gray500,background:G.gray50,padding:"8px 10px",borderRadius:8}}>{q.explanation}</div>
    </Card>)}
  </div>

  const q=qs[cur];
  return <div className="fade-in" style={{padding:"2rem",maxWidth:640}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
      <span style={{fontSize:13,color:G.gray500}}>Q{cur+1}/{qs.length} · {cfg.subject}</span>
      <Btn variant="outline" size="sm" onClick={()=>setDone(true)}>Finish & Score</Btn>
    </div>
    <ProgressBar value={cur+1} max={qs.length}/>
    <Card style={{marginTop:14,marginBottom:14}}>
      <p style={{fontSize:15,fontWeight:600,lineHeight:1.7,marginBottom:16}}>{q.question}</p>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.options.map((opt,i)=><button key={i} onClick={()=>{setAns(p=>({...p,[cur]:i}));if(cur<qs.length-1)setTimeout(()=>setCur(c=>c+1),350);else setDone(true)}} style={{padding:"11px 15px",border:`1.5px solid ${ans[cur]===i?G.purple400:G.gray100}`,borderRadius:10,background:ans[cur]===i?G.purple50:G.white,color:ans[cur]===i?G.purple700:G.gray900,cursor:"pointer",textAlign:"left",fontSize:14,fontWeight:500,transition:"all 0.15s"}}>
          <span style={{fontWeight:700,marginRight:8,color:G.gray300}}>{String.fromCharCode(65+i)}.</span>{opt}
        </button>)}
      </div>
    </Card>
    <div style={{display:"flex",gap:10}}>
      <Btn variant="outline" disabled={cur===0} onClick={()=>setCur(c=>c-1)}>← Prev</Btn>
      <Btn disabled={cur===qs.length-1} onClick={()=>setCur(c=>c+1)}>Next →</Btn>
    </div>
  </div>
}

// ─── STUDY SCHEDULE ───────────────────────────────────────────────────────────
function StudySchedule({user}){
  const c=COUNTRIES[user.country]||COUNTRIES.Nigeria;
  const allExams=c.exams;
  const [form,setForm]=useState({exam:user.exam,date:"",hours:3,weak:[]});
  const [schedule,setSchedule]=useState(null);
  const [loading,setLoading]=useState(false);
  const toggle=s=>setForm(p=>({...p,weak:p.weak.includes(s)?p.weak.filter(x=>x!==s):[...p.weak,s]}));

  const generate=async()=>{
    if(!form.date){alert("Please select your exam date");return}
    setLoading(true);
    const days=Math.ceil((new Date(form.date)-new Date())/864e5);
    try{
      const res=await fetch("https://passai-production-7757.up.railway.app/ai/ask",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:[{role:"user",content:`Study schedule for a ${user.country} student. Exam: ${form.exam} in ${days} days (${form.date}). Curriculum: ${c.curriculum}. Hours/day: ${form.hours}. Weak subjects: ${form.weak.join(",")||"none"}.\n\nReturn ONLY valid JSON:\n{"overview":"...","phases":[{"name":"","duration":"","focus":"","daily":[{"time":"08:00","task":"Subject — Topic","duration":"1hr"}]}],"tips":["tip1","tip2"]}`}]})
      });
      const d=await res.json();
      let text=d.content?.[0]?.text||"{}";
      text=text.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();
      setSchedule(JSON.parse(text));
    }catch{alert("Error generating schedule.")}
    setLoading(false);
  };

  return <div className="fade-in" style={{padding:"2rem"}}>
    <h1 className="outfit" style={{fontSize:22,fontWeight:800,color:G.gray900,marginBottom:4}}>Study Schedule 📅</h1>
    <p style={{color:G.gray500,fontSize:13,marginBottom:"1.25rem"}}>{c.flag} {user.country} · AI-personalised plan</p>
    <div style={{display:"grid",gridTemplateColumns:schedule?"1fr 1.6fr":"1fr",gap:20,maxWidth:schedule?1000:520}} className="mobile-stack">
      <Card>
        {[["Exam",allExams,"exam"]].map(([label,opts,key])=><div key={key} style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>{label}</label><select value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none",background:G.white}}>{opts.map(e=><option key={e}>{e}</option>)}</select></div>)}
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Exam Date</label><input type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:"10px 13px",border:`1.5px solid ${G.gray100}`,borderRadius:10,fontSize:14,outline:"none"}}/></div>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:5}}>Hours/Day: {form.hours}h</label><input type="range" min={1} max={10} value={form.hours} onChange={e=>setForm(p=>({...p,hours:parseInt(e.target.value)}))} style={{width:"100%"}}/></div>
        <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,color:G.gray700,display:"block",marginBottom:8}}>Weak Subjects</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{c.subjects.slice(0,8).map(s=><button key={s} onClick={()=>toggle(s)} style={{padding:"5px 11px",borderRadius:20,border:`1.5px solid ${form.weak.includes(s)?G.danger:G.gray100}`,background:form.weak.includes(s)?G.dangerBg:G.white,color:form.weak.includes(s)?G.danger:G.gray500,fontSize:12,cursor:"pointer",fontWeight:500}}>{s}</button>)}</div></div>
        <Btn full loading={loading} onClick={generate}>🤖 Generate Schedule</Btn>
      </Card>
      {schedule&&<div className="fade-in">
        <Card style={{marginBottom:12,background:G.purple50,border:`1px solid ${G.purple100}`}}><div className="outfit" style={{fontWeight:700,marginBottom:6,color:G.purple800}}>📋 Strategy</div><p style={{fontSize:14,color:G.purple700,lineHeight:1.7}}>{schedule.overview}</p></Card>
        {schedule.phases?.map((ph,i)=><Card key={i} style={{marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:28,height:28,borderRadius:8,background:G.purple800,color:G.white,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>{i+1}</div>
            <div><div className="outfit" style={{fontWeight:700,fontSize:15}}>{ph.name}</div><div style={{fontSize:12,color:G.gray500}}>{ph.duration} · {ph.focus}</div></div>
          </div>
          {ph.daily?.map((item,j)=><div key={j} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:j<ph.daily.length-1?`1px solid ${G.gray50}`:"none",alignItems:"center"}}>
            <span style={{fontSize:11,color:G.gray400,width:55,flexShrink:0}}>{item.time}</span>
            <span style={{fontSize:13,flex:1}}>{item.task}</span>
            <Tag color={G.purple700} bg={G.purple50}>{item.duration}</Tag>
          </div>)}
        </Card>)}
        {schedule.tips&&<Card style={{background:G.amber50,border:`1px solid ${G.amber100}`}}>
          <div className="outfit" style={{fontWeight:700,marginBottom:8,color:G.amber500}}>💡 Tips</div>
          {schedule.tips.map((t,i)=><div key={i} style={{display:"flex",gap:8,marginBottom:7,fontSize:13,color:G.gray700}}><span style={{color:G.amber500,fontWeight:700,flexShrink:0}}>→</span>{t}</div>)}
        </Card>}
      </div>}
    </div>
  </div>
}

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
function Progress({user}){
  const p=MOCK;const c=COUNTRIES[user.country]||COUNTRIES.Nigeria;
  return <div className="fade-in" style={{padding:"2rem"}}>
    <h1 className="outfit" style={{fontSize:22,fontWeight:800,color:G.gray900,marginBottom:4}}>Progress 📊</h1>
    <p style={{color:G.gray500,fontSize:13,marginBottom:"1.25rem"}}>{c.flag} {user.country} · {user.exam}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:"1.25rem"}}>
      <StatCard label="Day Streak" value={`${p.streak}🔥`} icon="🔥" color={G.amber500} bg={G.amber50}/>
      <StatCard label="Questions" value={p.totalQuestions} icon="📝" color={G.purple600} bg={G.purple50}/>
      <StatCard label="Accuracy" value={`${p.accuracy}%`} icon="🎯" color={G.blue} bg={G.blueBg}/>
      <StatCard label="Readiness" value="72%" icon="🏆" color={G.purple} bg={G.purpleBg}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:16}} className="mobile-col">
      <Card>
        <div className="outfit" style={{fontWeight:700,fontSize:15,marginBottom:16}}>Subject Performance</div>
        {Object.entries(p.subjects).map(([sub,acc])=><div key={sub} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:G.gray700,fontWeight:500}}>{sub}</span><div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:13,fontWeight:700,color:acc>=75?G.purple600:acc>=60?"#e67e22":G.danger}}>{acc}%</span><Tag color={acc>=75?G.purple700:acc>=60?"#9c6500":G.danger} bg={acc>=75?G.purple50:acc>=60?G.amber50:G.dangerBg}>{acc>=75?"Strong":acc>=60?"Good":"Weak"}</Tag></div></div>
          <ProgressBar value={acc} color={acc>=75?G.purple500:acc>=60?"#e67e22":G.danger}/>
        </div>)}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Card style={{background:G.purple900,border:"none"}}><div style={{fontSize:11,color:`${G.white}60`,fontWeight:700,letterSpacing:"0.06em",marginBottom:6}}>EXAM READINESS</div><div className="outfit" style={{fontSize:38,fontWeight:800,color:G.white,lineHeight:1,marginBottom:8}}>72%</div><ProgressBar value={72} color={G.amber500}/><div style={{fontSize:11,color:`${G.white}50`,marginTop:6}}>Need 80% to be exam-ready</div></Card>
        <Card><div className="outfit" style={{fontWeight:700,fontSize:14,marginBottom:10}}>📅 Weekly Activity</div>
          <div style={{display:"flex",gap:5,alignItems:"flex-end",height:52}}>{[20,38,28,50,60,42,58].map((h,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{width:"100%",background:i===6?G.purple500:G.purple100,borderRadius:3,height:h}}/><span style={{fontSize:10,color:G.gray400}}>{"SMTWTFS"[i]}</span></div>)}</div>
        </Card>
        <Card style={{background:G.amber50,border:`1px solid ${G.amber100}`}}><div className="outfit" style={{fontWeight:700,fontSize:13,marginBottom:8}}>📌 Study Focus</div>{c.subjects.slice(0,3).map(s=><div key={s} style={{display:"flex",gap:8,marginBottom:6,fontSize:13,color:G.gray700}}><span style={{color:G.amber500}}>→</span>{s}</div>)}</Card>
      </div>
    </div>
  </div>
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [view,setView]=useState("dashboard");
  if(!user) return <><style>{css}</style><LandingPage onAuth={setUser}/></>
  const VIEWS={dashboard:<Dashboard user={user}/>, "ai-tutor":<AITutor user={user}/>, "past-questions":<PastQuestions user={user}/>, "practice-test":<PracticeTest user={user}/>, schedule:<StudySchedule user={user}/>, progress:<Progress user={user}/>};
  return <><style>{css}</style>
    <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
      <div className="hide-mobile"><Sidebar active={view} onNav={setView} user={user} onLogout={()=>setUser(null)}/></div>
      <main style={{flex:1,overflowY:"auto",background:G.cream}}>{VIEWS[view]||<Dashboard user={user}/>}</main>
    </div>
  </>
}
