import { useState, useEffect, useCallback } from "react";

const C = {
  bg:"#060d1a",surface:"#0b1628",card:"#0f1e35",border:"#1c2e4a",
  gold:"#c9a86c",goldLight:"#e8c97a",goldDim:"#7a6540",
  text:"#dce6f0",muted:"#5a7090",green:"#2ecc71",red:"#e74c3c",yellow:"#f39c12",
};

function useStorage(key, init) {
  const [val, setVal] = useState(init);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get(key); if (r?.value) setVal(JSON.parse(r.value)); } catch(_){}
      setReady(true);
    })();
  }, [key]);
  const save = useCallback(async (v) => {
    const next = typeof v==="function" ? v(val) : v;
    setVal(next);
    try { await window.storage.set(key, JSON.stringify(next)); } catch(_){}
  }, [key, val]);
  return [val, save, ready];
}

const DEMO_OBJECTS = [
  { id:1, name:"ЖК «Северный»", address:"ул. Ленина, 45", client:"ООО РосСтрой", clientCode:"RS-2024", deadline:"2026-06-15", progress:72, createdAt:"2025-01-10",
    processes:[{id:1,name:"Фундамент",done:true,worker:"Иванов А.",note:""},{id:2,name:"Каркас здания",done:true,worker:"Петров В.",note:""},{id:3,name:"Кровля",done:true,worker:"Сидоров К.",note:""},{id:4,name:"Фасад",done:false,worker:"Иванов А.",note:""},{id:5,name:"Внутренняя отделка",done:false,worker:"Петров В.",note:""},{id:6,name:"Сдача объекта",done:false,worker:"",note:""}]},
  { id:2, name:"БЦ «Гранит»", address:"пр. Мира, 12", client:"ИП Смирнов", clientCode:"SM-8831", deadline:"2026-09-01", progress:35, createdAt:"2025-03-05",
    processes:[{id:1,name:"Фундамент",done:true,worker:"Козлов Д.",note:""},{id:2,name:"Каркас",done:false,worker:"Иванов А.",note:""},{id:3,name:"Кровля",done:false,worker:"",note:""},{id:4,name:"Фасад",done:false,worker:"",note:""},{id:5,name:"Сдача объекта",done:false,worker:"",note:""}]},
  { id:3, name:"Дорога Р-55", address:"Трасса Р-55, км 14", client:"Горадминистрация", clientCode:"GA-5517", deadline:"2026-04-20", progress:90, createdAt:"2024-11-01",
    processes:[{id:1,name:"Земляные работы",done:true,worker:"Сидоров К.",note:""},{id:2,name:"Основание",done:true,worker:"Козлов Д.",note:""},{id:3,name:"Асфальтирование",done:true,worker:"Петров В.",note:""},{id:4,name:"Разметка",done:false,worker:"Иванов А.",note:""},{id:5,name:"Сдача",done:false,worker:"",note:""}]},
];
const DEMO_WORKERS = [
  {id:1,name:"Козлов Д.",role:"Монтажник",rating:4.9,jobs:31,phone:"+7 900 444-55-66"},
  {id:2,name:"Иванов А.",role:"Прораб",rating:4.8,jobs:24,phone:"+7 900 111-22-33"},
  {id:3,name:"Петров В.",role:"Строитель",rating:4.5,jobs:18,phone:"+7 900 777-88-99"},
  {id:4,name:"Сидоров К.",role:"Строитель",rating:4.2,jobs:15,phone:"+7 900 000-12-34"},
];

const genCode = () => {
  const L="ABCDEFGHJKLMNPQRSTUVWXYZ", D="0123456789";
  return [L,L].map(x=>x[Math.random()*x.length|0]).join("")+"-"+Array.from({length:4},()=>D[Math.random()*D.length|0]).join("");
};
const calcProgress = p => p.length ? Math.round(p.filter(x=>x.done).length/p.length*100) : 0;
const daysLeft = d => Math.ceil((new Date(d)-new Date())/86400000);

function Logo({size=48}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="44" stroke={C.gold} strokeWidth="2" opacity="0.5"/>
      <circle cx="50" cy="50" r="34" stroke={C.gold} strokeWidth="0.8" opacity="0.25"/>
      <polygon points="50,6 54,47 50,50 46,47" fill={C.goldLight}/>
      <polygon points="50,94 54,53 50,50 46,53" fill={C.gold} opacity="0.6"/>
      <polygon points="6,50 47,46 50,50 47,54" fill={C.goldLight}/>
      <polygon points="94,50 53,46 50,50 53,54" fill={C.gold} opacity="0.6"/>
      <polygon points="21,21 46,46 50,50 46,46" fill={C.gold} opacity="0.4"/>
      <polygon points="79,79 54,54 50,50 54,54" fill={C.gold} opacity="0.3"/>
      <polygon points="79,21 54,46 50,50 54,46" fill={C.gold} opacity="0.4"/>
      <polygon points="21,79 46,54 50,50 46,54" fill={C.gold} opacity="0.3"/>
      <circle cx="50" cy="50" r="6" fill={C.gold}/>
      <circle cx="50" cy="50" r="3.5" fill={C.bg}/>
    </svg>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Barlow:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  input,select,button,textarea{font-family:'Barlow',sans-serif!important}
  select option{background:#0b1628}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1c2e4a;border-radius:99px}
  input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.5)}
`;

const st = {
  wrap:{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'Barlow',sans-serif",color:C.text},
  hdr:{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 18px 0",position:"sticky",top:0,zIndex:100},
  hrow:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12},
  nav:{display:"flex",borderTop:`1px solid ${C.border}`},
  nvb:(a)=>({flex:1,padding:"10px 0",border:"none",background:"transparent",color:a?C.gold:C.muted,fontWeight:a?700:400,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderBottom:a?`2px solid ${C.gold}`:"2px solid transparent",transition:"all 0.2s"}),
  pg:{padding:"16px 16px 90px"},
  sec:{fontSize:10,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:C.goldDim,marginBottom:10},
  crd:(hl)=>({background:C.card,border:`1px solid ${hl?C.gold:C.border}`,borderRadius:12,padding:14,marginBottom:10,cursor:"pointer"}),
  rw:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  ct:{fontSize:15,fontWeight:700,marginBottom:2,fontFamily:"'Cormorant Garamond',serif"},
  cs:{fontSize:12,color:C.muted,marginBottom:8},
  bar:{height:5,background:C.border,borderRadius:99,overflow:"hidden"},
  fl:(p)=>({height:"100%",width:`${p}%`,background:p>=80?C.green:p>=50?C.gold:C.yellow,borderRadius:99,transition:"width 0.4s"}),
  chip:(col)=>({background:col+"22",color:col,borderRadius:6,fontSize:10,fontWeight:700,padding:"3px 8px"}),
  fab:{position:"fixed",bottom:78,right:18,width:52,height:52,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,border:"none",color:C.bg,fontSize:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${C.gold}55`,zIndex:200},
  ovl:{position:"fixed",inset:0,background:"#000c",zIndex:300,display:"flex",alignItems:"flex-end"},
  mbox:{background:C.surface,borderRadius:"18px 18px 0 0",width:"100%",maxHeight:"93vh",overflowY:"auto",padding:"22px 18px 44px"},
  mhd:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18},
  mtl:{fontSize:22,fontWeight:700,fontFamily:"'Cormorant Garamond',serif"},
  lbl:{fontSize:11,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:5},
  inp:{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:9,color:C.text,padding:"11px 13px",fontSize:14,marginBottom:10,outline:"none"},
  btn:(v="gold")=>({width:"100%",padding:"13px",borderRadius:9,border:v==="gold"?`1px solid ${C.gold}`:`1px solid ${C.border}`,background:v==="gold"?`linear-gradient(135deg,${C.gold},${C.goldLight})`:"transparent",color:v==="gold"?C.bg:C.muted,fontWeight:700,fontSize:13,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer",marginBottom:8}),
  xbtn:{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer",padding:4,lineHeight:1},
};

// ── STARS ─────────────────────────────────────────────
function Stars({rating,onChange}) {
  return (
    <span style={{display:"flex",gap:2,alignItems:"center"}}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} onClick={()=>onChange&&onChange(i)} style={{fontSize:14,color:i<=Math.round(rating)?C.gold:C.border,cursor:onChange?"pointer":"default"}}> ★</span>
      ))}
      <span style={{fontSize:11,color:C.muted,marginLeft:3}}>{rating.toFixed(1)}</span>
    </span>
  );
}

// ── OBJECT CARD ───────────────────────────────────────
function ObjCard({obj,onClick}) {
  const dl=daysLeft(obj.deadline);
  const dlC=dl<0?C.red:dl<14?C.yellow:C.muted;
  return (
    <div style={st.crd(false)} onClick={onClick}>
      <div style={st.rw}>
        <div style={{...st.ct,flex:1,marginRight:8}}>{obj.name}</div>
        <div style={st.chip(obj.progress>=80?C.green:obj.progress>=40?C.gold:C.yellow)}>{obj.progress}%</div>
      </div>
      <div style={st.cs}>{obj.address}</div>
      <div style={{...st.bar,marginBottom:8}}><div style={st.fl(obj.progress)}/></div>
      <div style={st.rw}>
        <span style={{fontSize:11,color:C.muted}}>{obj.processes.filter(p=>p.done).length}/{obj.processes.length} эт. · {obj.client}</span>
        <span style={{fontSize:11,color:dlC,fontWeight:600}}>{dl<0?"⚠ Просрочен":dl===0?"⚠ Сегодня!":dl<14?`⚡ ${dl} дн.`:`${dl} дн.`}</span>
      </div>
    </div>
  );
}

// ── OBJECT DETAIL ─────────────────────────────────────
function ObjDetail({obj,workers,onClose,onToggle,onUpdateNote,onEdit}) {
  const [editNote,setEditNote]=useState(null);
  const [noteText,setNoteText]=useState("");
  const dl=daysLeft(obj.deadline);
  return (
    <div style={st.ovl} onClick={onClose}>
      <div style={st.mbox} onClick={e=>e.stopPropagation()}>
        <div style={st.mhd}>
          <div>
            <div style={{fontSize:10,color:C.gold,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Объект</div>
            <div style={st.mtl}>{obj.name}</div>
            <div style={{fontSize:12,color:C.muted}}>{obj.address}</div>
          </div>
          <button style={st.xbtn} onClick={onClose}>✕</button>
        </div>

        <div style={{background:C.bg,borderRadius:10,padding:14,marginBottom:16,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[
              {v:obj.progress+"%",l:"Прогресс",c:obj.progress>=80?C.green:C.gold},
              {v:Math.abs(dl)+"д",l:dl<0?"Просроч.":"Осталось",c:dl<0?C.red:dl<14?C.yellow:C.gold},
              {v:obj.processes.filter(p=>p.done).length+"/"+obj.processes.length,l:"Этапов",c:C.gold},
            ].map((x,i)=>(
              <div key={i} style={{flex:1,textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:800,color:x.c,fontFamily:"'Cormorant Garamond',serif"}}>{x.v}</div>
                <div style={{fontSize:10,color:C.muted,letterSpacing:"0.05em"}}>{x.l}</div>
                {i<2&&<div style={{position:"absolute",display:"none"}}/>}
              </div>
            ))}
          </div>
          <div style={st.bar}><div style={st.fl(obj.progress)}/></div>
          <div style={{...st.rw,marginTop:10}}>
            <span style={{fontSize:11,color:C.muted}}>👤 {obj.client}</span>
            <span style={{fontSize:11,color:C.muted}}>Код клиента: <b style={{color:C.gold,letterSpacing:"0.1em"}}>{obj.clientCode}</b></span>
          </div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>📅 Срок: {obj.deadline}</div>
        </div>

        <div style={st.sec}>Этапы работ</div>
        {obj.processes.map(p=>(
          <div key={p.id}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
              <div
                onClick={()=>onToggle(obj.id,p.id)}
                style={{width:26,height:26,borderRadius:"50%",border:`2px solid ${p.done?C.green:C.border}`,background:p.done?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",transition:"all 0.2s"}}
              >
                {p.done&&<span style={{color:"#fff",fontSize:13,lineHeight:1}}>✓</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:p.done?C.muted:C.text,textDecoration:p.done?"line-through":"none"}}>{p.name}</div>
                {p.worker&&<div style={{fontSize:11,color:C.muted}}>👷 {p.worker}</div>}
                {p.note&&<div style={{fontSize:11,color:C.goldDim,fontStyle:"italic",marginTop:2}}>📝 {p.note}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                <div style={st.chip(p.done?C.green:C.yellow)}>{p.done?"Готово":"В работе"}</div>
                <button onClick={()=>{setEditNote(p.id);setNoteText(p.note||"");}} style={{background:"none",border:"none",color:C.muted,fontSize:10,cursor:"pointer",padding:0,letterSpacing:"0.04em"}}>✏ заметка</button>
              </div>
            </div>
            {editNote===p.id&&(
              <div style={{padding:"8px 0 10px",display:"flex",gap:8}}>
                <input style={{...st.inp,margin:0,flex:1,fontSize:12,padding:"8px 10px"}} placeholder="Добавить заметку..." value={noteText} onChange={e=>setNoteText(e.target.value)}/>
                <button onClick={()=>{onUpdateNote(obj.id,p.id,noteText);setEditNote(null);}} style={{background:C.gold,border:"none",color:C.bg,borderRadius:8,padding:"0 14px",fontWeight:700,fontSize:12,cursor:"pointer"}}>OK</button>
                <button onClick={()=>setEditNote(null)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"0 10px",fontSize:12,cursor:"pointer"}}>×</button>
              </div>
            )}
          </div>
        ))}

        <div style={{marginTop:20}}>
          <button style={st.btn("gold")} onClick={()=>onEdit(obj)}>✏ Редактировать объект</button>
        </div>
      </div>
    </div>
  );
}

// ── OBJ FORM ──────────────────────────────────────────
function ObjForm({obj,workers,onClose,onSave}) {
  const isEdit=!!obj;
  const [name,setName]=useState(obj?.name||"");
  const [addr,setAddr]=useState(obj?.address||"");
  const [client,setClient]=useState(obj?.client||"");
  const [deadline,setDeadline]=useState(obj?.deadline||"");
  const [code]=useState(obj?.clientCode||genCode());
  const [procs,setProcs]=useState(obj?.processes||[
    {id:1,name:"Фундамент",done:false,worker:"",note:""},
    {id:2,name:"Каркас",done:false,worker:"",note:""},
    {id:3,name:"Отделка",done:false,worker:"",note:""},
    {id:4,name:"Сдача объекта",done:false,worker:"",note:""},
  ]);
  const upd=(i,f,v)=>setProcs(p=>p.map((x,j)=>j===i?{...x,[f]:v}:x));
  const save=()=>{
    if(!name.trim()||!addr.trim())return;
    const ps=procs.filter(p=>p.name.trim());
    onSave(isEdit?{...obj,name,address:addr,client,deadline,clientCode:code,processes:ps,progress:calcProgress(ps)}:{id:Date.now(),name,address:addr,client,deadline:deadline||"2026-12-31",clientCode:code,progress:0,createdAt:new Date().toISOString().slice(0,10),processes:ps});
    onClose();
  };
  return (
    <div style={st.ovl} onClick={onClose}>
      <div style={st.mbox} onClick={e=>e.stopPropagation()}>
        <div style={st.mhd}>
          <div style={st.mtl}>{isEdit?"Редактировать":"Новый объект"}</div>
          <button style={st.xbtn} onClick={onClose}>✕</button>
        </div>

        <label style={st.lbl}>Название *</label>
        <input style={st.inp} placeholder="ЖК «Название»" value={name} onChange={e=>setName(e.target.value)}/>
        <label style={st.lbl}>Адрес *</label>
        <input style={st.inp} placeholder="ул. Ленина, 1" value={addr} onChange={e=>setAddr(e.target.value)}/>
        <label style={st.lbl}>Клиент</label>
        <input style={st.inp} placeholder="ООО «Компания»" value={client} onChange={e=>setClient(e.target.value)}/>
        <label style={st.lbl}>Срок сдачи</label>
        <input style={{...st.inp,colorScheme:"dark"}} type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}/>

        <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 14px",marginBottom:14}}>
          <div style={{...st.sec,margin:"0 0 4px"}}>Код клиента</div>
          <div style={{fontSize:22,fontWeight:700,color:C.gold,letterSpacing:"0.2em",fontFamily:"'Cormorant Garamond',serif"}}>{code}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:2}}>Передайте этот код клиенту для просмотра прогресса</div>
        </div>

        <div style={st.sec}>Этапы работ</div>
        {procs.map((p,i)=>(
          <div key={p.id} style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
            <div onClick={()=>upd(i,"done",!p.done)} style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${p.done?C.green:C.border}`,background:p.done?C.green:"transparent",flexShrink:0,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {p.done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}
            </div>
            <input style={{...st.inp,flex:2,margin:0,padding:"9px 10px"}} placeholder={`Этап ${i+1}`} value={p.name} onChange={e=>upd(i,"name",e.target.value)}/>
            <select style={{...st.inp,flex:1.2,margin:0,padding:"9px 6px",fontSize:12}} value={p.worker} onChange={e=>upd(i,"worker",e.target.value)}>
              <option value="">— рабочий</option>
              {workers.map(w=><option key={w.id} value={w.name}>{w.name}</option>)}
            </select>
            <button onClick={()=>setProcs(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",flexShrink:0,lineHeight:1}}>×</button>
          </div>
        ))}
        <button style={{...st.btn("ghost"),color:C.gold,border:`1px dashed ${C.goldDim}`,marginBottom:16}} onClick={()=>setProcs(p=>[...p,{id:Date.now(),name:"",done:false,worker:"",note:""}])}>+ Добавить этап</button>
        <button style={st.btn("gold")} onClick={save}>{isEdit?"Сохранить":"Создать объект"}</button>
        <button style={{...st.btn("ghost"),color:C.muted,border:"none"}} onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
}

// ── WORKER FORM ───────────────────────────────────────
function WorkerForm({onClose,onSave}) {
  const [name,setName]=useState("");
  const [role,setRole]=useState("Строитель");
  const [phone,setPhone]=useState("");
  return (
    <div style={st.ovl} onClick={onClose}>
      <div style={st.mbox} onClick={e=>e.stopPropagation()}>
        <div style={st.mhd}>
          <div style={st.mtl}>Новый рабочий</div>
          <button style={st.xbtn} onClick={onClose}>✕</button>
        </div>
        <label style={st.lbl}>Имя *</label>
        <input style={st.inp} placeholder="Иванов А." value={name} onChange={e=>setName(e.target.value)}/>
        <label style={st.lbl}>Должность</label>
        <select style={st.inp} value={role} onChange={e=>setRole(e.target.value)}>
          {["Прораб","Строитель","Монтажник","Электрик","Сантехник","Отделочник","Разнорабочий"].map(r=><option key={r}>{r}</option>)}
        </select>
        <label style={st.lbl}>Телефон</label>
        <input style={st.inp} placeholder="+7 900 000-00-00" value={phone} onChange={e=>setPhone(e.target.value)}/>
        <button style={st.btn("gold")} onClick={()=>{if(!name.trim())return;onSave({id:Date.now(),name,role,phone,rating:5.0,jobs:0});onClose();}}>Добавить</button>
        <button style={{...st.btn("ghost"),color:C.muted,border:"none"}} onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
}

// ── WORKERS TAB ───────────────────────────────────────
function WorkersTab({workers,onAdd,onRate}) {
  const sorted=[...workers].sort((a,b)=>b.rating-a.rating);
  const medals=["🥇","🥈","🥉"];
  const cols=[C.gold,C.muted,C.goldDim,"#3a5070"];
  return (
    <div style={st.pg}>
      <div style={{...st.sec,marginBottom:12}}>Рейтинг рабочих</div>
      {sorted.map((w,i)=>(
        <div key={w.id} style={{background:C.card,border:`1px solid ${i===0?C.gold:C.border}`,borderRadius:12,padding:14,marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:42,height:42,borderRadius:10,background:cols[i%4]+"33",border:`1.5px solid ${cols[i%4]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,flexShrink:0,color:cols[i%4]}}>
            {w.name[0]}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{w.name}</div>
            <div style={{fontSize:11,color:C.muted,marginBottom:5}}>{w.role}{w.phone?` · ${w.phone}`:""}</div>
            <Stars rating={w.rating} onChange={r=>onRate(w.id,r)}/>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:22}}>{medals[i]||`#${i+1}`}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>{w.jobs} объект.</div>
          </div>
        </div>
      ))}
      <button style={{...st.btn("ghost"),border:`1px dashed ${C.goldDim}`,color:C.gold,marginTop:4}} onClick={onAdd}>+ Добавить рабочего</button>
    </div>
  );
}

// ── STATS TAB ─────────────────────────────────────────
function StatsTab({objects,workers}) {
  const all=objects.flatMap(o=>o.processes);
  const avg=objects.length?Math.round(objects.reduce((s,o)=>s+o.progress,0)/objects.length):0;
  const overdue=objects.filter(o=>daysLeft(o.deadline)<0).length;
  const near=objects.filter(o=>{const d=daysLeft(o.deadline);return d>=0&&d<14;}).length;
  const statBoxes=[
    {v:objects.length,l:"Объектов",c:C.gold},
    {v:all.filter(p=>p.done).length,l:"Этапов сдано",c:C.green},
    {v:overdue,l:"Просрочено",c:overdue>0?C.red:C.muted},
    {v:near,l:"Дедлайн <14д",c:near>0?C.yellow:C.muted},
    {v:avg+"%",l:"Ср. прогресс",c:C.gold},
    {v:workers.length,l:"Рабочих",c:C.green},
  ];
  return (
    <div style={st.pg}>
      <div style={st.sec}>Общая сводка</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {statBoxes.map((x,i)=>(
          <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:800,color:x.c,fontFamily:"'Cormorant Garamond',serif"}}>{x.v}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:3,letterSpacing:"0.04em"}}>{x.l}</div>
          </div>
        ))}
      </div>

      <div style={st.sec}>Прогресс объектов</div>
      {[...objects].sort((a,b)=>b.progress-a.progress).map(o=>{
        const dl=daysLeft(o.deadline);
        return (
          <div key={o.id} style={{...st.crd(false),cursor:"default"}}>
            <div style={st.rw}>
              <div style={{fontSize:14,fontWeight:600,flex:1,marginRight:8,fontFamily:"'Cormorant Garamond',serif"}}>{o.name}</div>
              <div style={st.chip(o.progress>=80?C.green:o.progress>=40?C.gold:C.yellow)}>{o.progress}%</div>
            </div>
            <div style={{...st.bar,marginTop:8,marginBottom:8}}><div style={st.fl(o.progress)}/></div>
            <div style={st.rw}>
              <span style={{fontSize:11,color:C.muted}}>{o.client}</span>
              <span style={{fontSize:11,color:dl<0?C.red:dl<14?C.yellow:C.muted}}>{dl<0?"Просрочен":dl<14?`⚡ ${dl} дн.`:`${dl} дн.`}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── CLIENT PORTAL ─────────────────────────────────────
function ClientPortal({objects,code,onLogout}) {
  const obj=objects.find(o=>o.clientCode===code);
  if(!obj) return (
    <div style={{...st.wrap,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minHeight:"100vh",padding:24,textAlign:"center"}}>
      <style>{css}</style>
      <Logo size={52}/>
      <div style={{fontSize:22,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",marginTop:14,color:C.gold}}>Объект не найден</div>
      <div style={{fontSize:13,color:C.muted,margin:"12px 0 24px"}}>Код: <b style={{color:C.gold}}>{code}</b> — не найден.<br/>Обратитесь к менеджеру.</div>
      <button style={{...st.btn("gold"),width:"auto",padding:"12px 28px"}} onClick={onLogout}>← Назад</button>
    </div>
  );
  const dl=daysLeft(obj.deadline);
  return (
    <div style={st.wrap}>
      <style>{css}</style>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Logo size={30}/>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Cormorant Garamond',serif"}}>Портал клиента</div>
            <div style={{fontSize:10,color:C.muted}}>Код: {code}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"6px 12px",fontSize:11,cursor:"pointer"}}>Выйти</button>
      </div>
      <div style={st.pg}>
        <div style={{background:`linear-gradient(135deg,${C.card},${C.surface})`,border:`1px solid ${C.gold}44`,borderRadius:14,padding:18,marginBottom:16}}>
          <div style={{fontSize:21,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{obj.name}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:14}}>{obj.address}</div>
          <div style={{display:"flex",gap:12,marginBottom:12}}>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{fontSize:26,fontWeight:800,color:obj.progress>=80?C.green:C.gold,fontFamily:"'Cormorant Garamond',serif"}}>{obj.progress}%</div>
              <div style={{fontSize:10,color:C.muted}}>ПРОГРЕСС</div>
            </div>
            <div style={{width:1,background:C.border}}/>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{fontSize:26,fontWeight:800,color:dl<0?C.red:dl<14?C.yellow:C.gold,fontFamily:"'Cormorant Garamond',serif"}}>{Math.abs(dl)}</div>
              <div style={{fontSize:10,color:C.muted}}>{dl<0?"ДН. ПРОСРОЧ.":"ДНЕЙ ОСТАЛОСЬ"}</div>
            </div>
            <div style={{width:1,background:C.border}}/>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{fontSize:26,fontWeight:800,color:C.gold,fontFamily:"'Cormorant Garamond',serif"}}>{obj.processes.filter(p=>p.done).length}</div>
              <div style={{fontSize:10,color:C.muted}}>ИЗ {obj.processes.length} ЭТ.</div>
            </div>
          </div>
          <div style={st.bar}><div style={st.fl(obj.progress)}/></div>
          <div style={{fontSize:11,color:C.muted,marginTop:8}}>📅 Срок: {obj.deadline}</div>
        </div>

        <div style={st.sec}>Статус этапов</div>
        {obj.processes.map(p=>(
          <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:p.done?C.green:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {p.done?<span style={{color:"#fff",fontSize:13}}>✓</span>:<span style={{color:C.muted,fontSize:12}}>○</span>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:p.done?C.muted:C.text,textDecoration:p.done?"line-through":"none"}}>{p.name}</div>
              {p.note&&<div style={{fontSize:11,color:C.goldDim,fontStyle:"italic"}}>{p.note}</div>}
            </div>
            <div style={st.chip(p.done?C.green:C.yellow)}>{p.done?"✓ Готово":"В работе"}</div>
          </div>
        ))}

        <div style={{marginTop:24,textAlign:"center",padding:16,background:C.card,borderRadius:12,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,color:C.muted}}>По вопросам свяжитесь с вашим менеджером</div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────
function Login({onAdmin,onClient}) {
  const [mode,setMode]=useState("choose");
  const [pass,setPass]=useState("");
  const [code,setCode]=useState("");
  const [err,setErr]=useState("");
  return (
    <div style={{...st.wrap,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minHeight:"100vh",padding:24,position:"relative",overflow:"hidden"}}>
      <style>{css}</style>
      <div style={{position:"fixed",inset:0,background:`radial-gradient(ellipse at 50% 25%, #0d2040 0%, ${C.bg} 65%)`,zIndex:0}}/>
      <div style={{position:"fixed",top:"8%",left:"50%",transform:"translateX(-50%)",opacity:0.04,zIndex:0,pointerEvents:"none"}}><Logo size={300}/></div>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:340,textAlign:"center"}}>
        <Logo size={60}/>
        <div style={{fontSize:28,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",marginTop:12,color:C.gold,letterSpacing:"0.1em",textTransform:"uppercase"}}>СтройКонтроль</div>
        <div style={{fontSize:12,color:C.muted,letterSpacing:"0.08em",marginBottom:36,textTransform:"uppercase"}}>Управление строительными объектами</div>

        {mode==="choose"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <button style={{...st.btn("gold"),padding:16,fontSize:14}} onClick={()=>setMode("admin")}>🏗 Администратор</button>
            <button style={{...st.btn("ghost"),border:`1px solid ${C.goldDim}`,color:C.gold,padding:16,fontSize:14}} onClick={()=>setMode("client")}>👤 Войти как клиент</button>
          </div>
        )}
        {mode==="admin"&&(
          <div>
            <label style={{...st.lbl,textAlign:"left"}}>Пароль администратора</label>
            <input style={{...st.inp,textAlign:"center",fontSize:20,letterSpacing:"0.2em"}} type="password" placeholder="••••" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&(pass==="1234"?onAdmin():setErr("Неверный пароль"))} autoFocus/>
            {err&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{err}</div>}
            <button style={st.btn("gold")} onClick={()=>pass==="1234"?onAdmin():setErr("Неверный пароль")}>Войти</button>
            <button style={{...st.btn("ghost"),color:C.muted,border:"none"}} onClick={()=>{setMode("choose");setErr("");setPass("");}}>← Назад</button>
            <div style={{fontSize:11,color:C.muted,marginTop:6}}>Пароль по умолчанию: 1234</div>
          </div>
        )}
        {mode==="client"&&(
          <div>
            <label style={{...st.lbl,textAlign:"left"}}>Код доступа к объекту</label>
            <input style={{...st.inp,textAlign:"center",fontSize:20,letterSpacing:"0.25em",textTransform:"uppercase"}} placeholder="XX-0000" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onClient(code.toUpperCase().trim())} autoFocus/>
            <button style={st.btn("gold")} onClick={()=>onClient(code.toUpperCase().trim())}>Просмотр объекта</button>
            <button style={{...st.btn("ghost"),color:C.muted,border:"none"}} onClick={()=>{setMode("choose");setCode("");}}>← Назад</button>
            <div style={{fontSize:11,color:C.muted,marginTop:6}}>Код выдаётся администратором</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────
export default function App() {
  const [objects,setObjects,objReady]=useStorage("bm_objects_v3",DEMO_OBJECTS);
  const [workers,setWorkers,wReady]=useStorage("bm_workers_v3",DEMO_WORKERS);
  const [session,setSession,sReady]=useStorage("bm_session_v3",null);
  const [tab,setTab]=useState("objects");
  const [selectedId,setSelectedId]=useState(null);
  const [showAdd,setShowAdd]=useState(false);
  const [editObj,setEditObj]=useState(null);
  const [showWForm,setShowWForm]=useState(false);

  if(!objReady||!wReady||!sReady) return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style>
      <Logo size={52}/>
    </div>
  );

  if(!session) return <Login onAdmin={()=>setSession({role:"admin"})} onClient={code=>setSession({role:"client",code})}/>;
  if(session.role==="client") return <ClientPortal objects={objects} code={session.code} onLogout={()=>setSession(null)}/>;

  const selObj=selectedId?objects.find(o=>o.id===selectedId):null;

  const toggleProc=(oId,pId)=>{
    setObjects(prev=>prev.map(o=>{
      if(o.id!==oId)return o;
      const ps=o.processes.map(p=>p.id===pId?{...p,done:!p.done}:p);
      return{...o,processes:ps,progress:calcProgress(ps)};
    }));
  };
  const updateNote=(oId,pId,note)=>{
    setObjects(prev=>prev.map(o=>o.id!==oId?o:{...o,processes:o.processes.map(p=>p.id===pId?{...p,note}:p)}));
  };
  const saveObj=(obj)=>{
    setObjects(prev=>prev.find(o=>o.id===obj.id)?prev.map(o=>o.id===obj.id?obj:o):[obj,...prev]);
  };

  return (
    <div style={st.wrap}>
      <style>{css}</style>

      {/* HEADER */}
      <div style={st.hdr}>
        <div style={st.hrow}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Logo size={32}/>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:C.gold,fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>СтройКонтроль</div>
              <div style={{fontSize:10,color:C.muted,letterSpacing:"0.06em"}}>Администратор</div>
            </div>
          </div>
          <button onClick={()=>setSession(null)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"6px 12px",fontSize:11,cursor:"pointer"}}>Выйти</button>
        </div>
        <div style={st.nav}>
          {[{k:"objects",l:"Объекты"},{k:"workers",l:"Рабочие"},{k:"stats",l:"Итоги"}].map(t=>(
            <button key={t.k} style={st.nvb(tab===t.k)} onClick={()=>setTab(t.k)}>{t.l}</button>
          ))}
        </div>
      </div>

      {/* PAGES */}
      {tab==="objects"&&(
        <div style={st.pg}>
          <div style={{...st.rw,marginBottom:10}}>
            <div style={st.sec}>Объекты — {objects.length}</div>
            <div style={{fontSize:11,color:C.muted}}>{objects.filter(o=>o.progress<100).length} в работе</div>
          </div>
          {objects.length===0&&<div style={{textAlign:"center",padding:48,color:C.muted}}><div style={{fontSize:36,marginBottom:10}}>🏗</div>Нет объектов. Нажмите + для добавления.</div>}
          {objects.map(o=><ObjCard key={o.id} obj={o} onClick={()=>setSelectedId(o.id)}/>)}
        </div>
      )}
      {tab==="workers"&&<WorkersTab workers={workers} onAdd={()=>setShowWForm(true)} onRate={(id,r)=>setWorkers(p=>p.map(w=>w.id===id?{...w,rating:r}:w))}/>}
      {tab==="stats"&&<StatsTab objects={objects} workers={workers}/>}

      {/* FAB */}
      {tab==="objects"&&<button style={st.fab} onClick={()=>setShowAdd(true)}>+</button>}

      {/* MODALS */}
      {selObj&&!editObj&&(
        <ObjDetail obj={selObj} workers={workers} onClose={()=>setSelectedId(null)} onToggle={toggleProc} onUpdateNote={updateNote} onEdit={o=>{setEditObj(o);}}/>
      )}
      {(showAdd||editObj)&&(
        <ObjForm obj={editObj} workers={workers} onClose={()=>{setShowAdd(false);setEditObj(null);}} onSave={o=>{saveObj(o);setEditObj(null);setShowAdd(false);}}/>
      )}
      {showWForm&&<WorkerForm onClose={()=>setShowWForm(false)} onSave={w=>setWorkers(p=>[...p,w])}/>}
    </div>
  );
}
