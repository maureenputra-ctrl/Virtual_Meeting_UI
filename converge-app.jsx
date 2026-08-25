import { useState, useEffect, useCallback, useRef } from "react";
import {
  Home, Calendar, Users, Settings, Mic, MicOff, Video, VideoOff, Monitor, Hand, MessageSquare, Play, Clock, Plus, Download, Share2, Shield, Phone, Smile, Layout, History, PenTool, X, Volume2, Camera, Eye, EyeOff, FileText, Image, ChevronLeft, ChevronRight, SkipBack, SkipForward, Maximize2, MousePointer2, Type, Square, Minus, Undo2, Redo2, Move, StickyNote, LogIn, Hash, Lock, Presentation, Send, MessageCircle, Search, Paperclip, Star, Sparkles, Grid3X3, Disc, ExternalLink, Pin, Check, MoreHorizontal, Link2, Copy, Sun, Moon, Globe, BarChart2
} from "lucide-react";

const F = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
const M = "'SF Mono','Consolas',monospace";

const P = [
  { name:"You",initials:"SE",sp:false,muted:false,hue:215 },
  { name:"Sarah Chen",initials:"SC",sp:true,muted:false,hue:270 },
  { name:"David Kim",initials:"DK",sp:false,muted:true,hue:190 },
  { name:"Maria Garcia",initials:"MG",sp:false,muted:false,hue:330 },
  { name:"James Wilson",initials:"JW",sp:false,muted:true,hue:155 },
  { name:"Aisha Patel",initials:"AP",sp:false,muted:false,hue:35 },
  { name:"Tom Bradley",initials:"TB",sp:false,muted:false,hue:260 },
  { name:"Lin Wei",initials:"LW",sp:false,muted:true,hue:0 },
  { name:"Emma Roberts",initials:"ER",sp:false,muted:false,hue:220 },
];

const meetings = [{t:"Sprint Planning",time:"10:00",dur:"45m",n:8,soon:true},{t:"Design Review",time:"13:30",dur:"30m",n:5},{t:"Client Sync — Acme Corp",time:"15:00",dur:"1h",n:12}];
const past = [{t:"Q2 Strategy Session",d:"Jun 20",dur:"1h 23m",eng:87,n:14},{t:"Product Roadmap Review",d:"Jun 19",dur:"52m",eng:72,n:9},{t:"Team Standup",d:"Jun 19",dur:"18m",eng:95,n:6},{t:"Client Onboarding — Meridian",d:"Jun 18",dur:"1h 05m",eng:68,n:11}];
const chapters = [{time:"0:00",label:"Opening & Agenda",dur:"2:15"},{time:"2:15",label:"Q1 Performance Review",dur:"12:30"},{time:"14:45",label:"Product Updates",dur:"18:20"},{time:"33:05",label:"Open Discussion",dur:"15:40"},{time:"48:45",label:"Action Items",dur:"8:10"},{time:"56:55",label:"Closing & Next Steps",dur:"4:05"}];

function Av({initials,hue,size=28}){return <div style={{width:size,height:size,borderRadius:size,background:`hsl(${hue},40%,92%)`,color:`hsl(${hue},50%,40%)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.38,fontWeight:600,fontFamily:F,flexShrink:0}}>{initials}</div>}

// ─── Toast system ───
function useToast(){
  const [toasts,setToasts]=useState([]);
  const push=useCallback((msg)=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,phase:"in"}]);
    setTimeout(()=>setToasts(t=>t.map(x=>x.id===id?{...x,phase:"out"}:x)),2000);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),2400);
  },[]);
  const Toasts=()=><>
    <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes toastOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-6px)}}`}</style>
    <div style={{position:"fixed",bottom:20,left:"50%",transform:"translateX(-50%)",zIndex:300,display:"flex",flexDirection:"column",gap:6,alignItems:"center"}}>
      {toasts.map(t=><div key={t.id} style={{padding:"8px 18px",background:"#111",color:"#fff",borderRadius:8,fontSize:12.5,fontFamily:F,boxShadow:"0 4px 16px rgba(0,0,0,0.2)",animation:t.phase==="in"?"toastIn 0.25s ease":"toastOut 0.4s ease forwards"}}>{t.msg}</div>)}
    </div>
  </>;
  return {push,Toasts};
}

// ─── Sidebar ───
function Sidebar({active,onNav,unread,collapsed,onToggle}){
  const [showSt,setShowSt]=useState(false);
  const [st,setSt]=useState("available");
  const sts=[{id:"available",l:"Available",c:"#22863a"},{id:"busy",l:"Busy",c:"#d1242f"},{id:"dnd",l:"Do not disturb",c:"#d1242f"},{id:"away",l:"Away",c:"#b08800"}];
  const cur=sts.find(s=>s.id===st);
  const items=[{id:"dashboard",icon:Home,label:"Home"},{id:"chat",icon:MessageCircle,label:"Chat",badge:unread},{id:"calendar",icon:Calendar,label:"Calendar"},{id:"meeting",icon:Video,label:"Meeting",live:true},{id:"replay",icon:History,label:"History"}];
  const w=collapsed?56:200;
  return(
    <div style={{width:w,minWidth:w,background:"#fff",borderRight:"1px solid #eee",display:"flex",flexDirection:"column",height:"100vh",fontFamily:F,transition:"width 0.2s ease",overflow:"hidden"}}>
      <div style={{padding:collapsed?"16px 14px":"20px 16px 18px",display:"flex",alignItems:"center",gap:9,whiteSpace:"nowrap",transition:"padding 0.2s ease"}}>
        <div style={{width:28,height:28,borderRadius:7,background:"#014592",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer"}} onClick={onToggle}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="9" height="10" rx="2" fill="#fff"/><path d="M11 6L15 4V12L11 10V6Z" fill="#fff" opacity="0.7"/><circle cx="5.5" cy="8" r="1.5" fill="#014592"/></svg>
        </div>
        <span style={{fontSize:15,fontWeight:700,color:"#111",letterSpacing:"-0.03em",opacity:collapsed?0:1,transition:"opacity 0.15s ease",pointerEvents:collapsed?"none":"auto"}}>RDS Meet</span>
      </div>
      <div style={{flex:1,padding:collapsed?"4px 8px":"4px 8px"}}>
        {items.map(it=>{const I=it.icon,isA=active===it.id;return(
          <button key={it.id} onClick={()=>onNav(it.id)} title={it.label} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:6,border:"none",cursor:"pointer",background:isA?"#f5f5f5":"transparent",color:isA?"#111":"#777",fontSize:13,fontWeight:isA?600:400,fontFamily:F,marginBottom:1,position:"relative",whiteSpace:"nowrap",overflow:"hidden",transition:"padding 0.2s ease"}}>
            <I size={15} strokeWidth={isA?2:1.5} style={{flexShrink:0}}/>
            <span style={{opacity:collapsed?0:1,transition:"opacity 0.15s ease"}}>{it.label}</span>
            {it.badge>0&&<span style={{position:collapsed?"absolute":"static",top:collapsed?6:undefined,right:collapsed?6:undefined,marginLeft:collapsed?0:"auto",minWidth:collapsed?7:16,height:collapsed?7:16,borderRadius:collapsed?3.5:8,background:"#014592",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff"}}>{collapsed?"":it.badge}</span>}
            {it.live&&!(it.badge>0)&&<div style={{position:collapsed?"absolute":"static",top:collapsed?6:undefined,right:collapsed?8:undefined,marginLeft:collapsed?0:"auto",width:6,height:6,borderRadius:3,background:"#22863a"}}/>}
          </button>
        );})}
      </div>
      <div style={{position:"relative",margin:"0 8px 10px",overflow:"visible"}}>
        {!collapsed&&showSt&&<div style={{position:"absolute",bottom:"100%",left:0,right:0,marginBottom:4,background:"#fff",borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.12)",border:"1px solid #eee",padding:4,zIndex:10}}>
          <div style={{padding:"6px 10px",fontSize:10,color:"#aaa",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>Set status</div>
          {sts.map(s=><button key={s.id} onClick={()=>{setSt(s.id);setShowSt(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:5,border:"none",cursor:"pointer",background:st===s.id?"#f5f5f5":"transparent",fontFamily:F,fontSize:12,color:"#333"}}><div style={{width:7,height:7,borderRadius:4,background:s.c}}/>{s.l}</button>)}
        </div>}
        <button onClick={()=>{if(collapsed)onToggle();else setShowSt(!showSt)}} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"none",cursor:"pointer",background:active==="settings"?"#f5f5f5":"transparent",display:"flex",alignItems:"center",gap:9,fontFamily:F,fontSize:13,color:"#777",overflow:"hidden",whiteSpace:"nowrap"}}>
          <div style={{position:"relative",flexShrink:0}}><Av initials="SE" hue={215} size={26}/><div style={{position:"absolute",bottom:-1,right:-1,width:8,height:8,borderRadius:4,background:cur.c,border:"2px solid #fff"}}/></div>
          <div style={{flex:1,textAlign:"left",opacity:collapsed?0:1,transition:"opacity 0.15s ease"}}><div style={{color:"#111",fontWeight:500,fontSize:12.5}}>Setyana</div><div style={{fontSize:10,color:cur.c}}>{cur.l}</div></div>
          <Settings size={13} onClick={e=>{e.stopPropagation();onNav("settings")}} style={{opacity:collapsed?0:0.35,transition:"opacity 0.15s ease",cursor:"pointer",flexShrink:0}}/>
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ───
function DashboardScreen({onNav,toast,goReplay}){
  const [showJoin,setShowJoin]=useState(false);
  const [showNew,setShowNew]=useState(false);
  const meetLink="rds.meet/s/"+Math.random().toString(36).slice(2,5)+"-"+Math.random().toString(36).slice(2,5)+"-"+Math.random().toString(36).slice(2,5);
  return(
    <div style={{padding:"32px 36px",overflowY:"auto",height:"100vh",fontFamily:F,position:"relative"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:"#111",margin:0,letterSpacing:"-0.03em"}}>Good morning, Setyana</h1><p style={{fontSize:13,color:"#888",margin:"5px 0 0"}}>Tuesday, June 23</p></div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowJoin(true)} style={{padding:"7px 14px",borderRadius:6,border:"1px solid #ddd",cursor:"pointer",background:"#fff",color:"#444",fontSize:12.5,fontWeight:500,fontFamily:F,display:"flex",alignItems:"center",gap:6}}><LogIn size={14}/>Join</button>
          <button onClick={()=>setShowNew(true)} style={{padding:"7px 14px",borderRadius:6,border:"none",cursor:"pointer",background:"#014592",color:"#fff",fontSize:12.5,fontWeight:600,fontFamily:F,display:"flex",alignItems:"center",gap:6}}><Plus size={14}/>New meeting</button>
        </div>
      </div>

      {showNew&&<><div onClick={()=>setShowNew(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",zIndex:99}}/><div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#fff",borderRadius:12,padding:"24px 28px",width:400,zIndex:100,boxShadow:"0 16px 48px rgba(0,0,0,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:16,fontWeight:700,color:"#111"}}>Meeting ready</span><button onClick={()=>setShowNew(false)} style={{width:26,height:26,borderRadius:6,border:"none",background:"#f5f5f5",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#999"}}><X size={14}/></button></div>
        <p style={{fontSize:13,color:"#888",margin:"0 0 14px"}}>Share this link to invite others.</p>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:"#f8f8f8",borderRadius:6,marginBottom:16}}>
          <Link2 size={14} color="#888"/>
          <span style={{flex:1,fontSize:13.5,color:"#111",fontFamily:M,fontWeight:500,userSelect:"all"}}>{meetLink}</span>
          <button onClick={()=>{navigator.clipboard.writeText("https://"+meetLink).catch(()=>{});toast("Link copied")}} style={{padding:"4px 10px",borderRadius:5,border:"none",background:"#014592",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:4}}><Copy size={11}/>Copy</button>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowNew(false)} style={{flex:1,padding:"9px 0",borderRadius:6,border:"1px solid #ddd",background:"#fff",color:"#666",fontSize:13,fontFamily:F,cursor:"pointer"}}>Close</button>
          <button onClick={()=>{setShowNew(false);onNav("meeting")}} style={{flex:2,padding:"9px 0",borderRadius:6,border:"none",background:"#014592",color:"#fff",fontSize:13,fontWeight:600,fontFamily:F,cursor:"pointer"}}>Start meeting</button>
        </div>
      </div></>}
      {showJoin&&<><div onClick={()=>setShowJoin(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)",zIndex:99}}/><div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#fff",borderRadius:12,padding:"24px 28px",width:380,zIndex:100,boxShadow:"0 16px 48px rgba(0,0,0,0.12)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontSize:16,fontWeight:700,color:"#111"}}>Join a meeting</span><button onClick={()=>setShowJoin(false)} style={{width:26,height:26,borderRadius:6,border:"none",background:"#f5f5f5",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#999"}}><X size={14}/></button></div>
        <label style={{fontSize:12,color:"#888",display:"block",marginBottom:5}}>Meeting code</label>
        <input placeholder="e.g. 123-456-7890" style={{width:"100%",padding:"10px 12px",borderRadius:6,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:F,marginBottom:12}}/>
        <label style={{fontSize:12,color:"#888",display:"block",marginBottom:5}}>Passcode (optional)</label>
        <input type="password" placeholder="Enter passcode" style={{width:"100%",padding:"10px 12px",borderRadius:6,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:F,marginBottom:16}}/>
        <div style={{display:"flex",gap:8}}><button onClick={()=>setShowJoin(false)} style={{flex:1,padding:"9px 0",borderRadius:6,border:"1px solid #ddd",background:"#fff",color:"#666",fontSize:13,fontFamily:F,cursor:"pointer"}}>Cancel</button><button onClick={()=>{setShowJoin(false);onNav("meeting")}} style={{flex:2,padding:"9px 0",borderRadius:6,border:"none",background:"#014592",color:"#fff",fontSize:13,fontWeight:600,fontFamily:F,cursor:"pointer"}}>Join</button></div>
      </div></>}
      <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:"#f7f9fc",borderRadius:8,marginBottom:28,border:"1px solid #e8edf3",cursor:"pointer"}} onClick={()=>onNav("meeting")}>
        <div style={{width:8,height:8,borderRadius:4,background:"#014592",flexShrink:0}}/>
        <div style={{flex:1}}><span style={{fontSize:13.5,fontWeight:600,color:"#111"}}>Sprint Planning</span><span style={{fontSize:12.5,color:"#888",marginLeft:10}}>starts in 12 min · 8 people</span></div>
        <button style={{padding:"6px 18px",borderRadius:6,border:"none",background:"#014592",color:"#fff",fontSize:12.5,fontWeight:600,fontFamily:F,cursor:"pointer"}}>Join</button>
      </div>
      <div style={{marginBottom:36}}>
        <div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>Today</div>
        {meetings.map((m,i)=><div key={i} onClick={()=>onNav("meeting")} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 0",borderBottom:"1px solid #f0f0f0",cursor:"pointer"}}><span style={{fontFamily:M,fontSize:12,color:"#999",minWidth:44}}>{m.time}</span><span style={{fontSize:13.5,color:"#111",fontWeight:500,flex:1}}>{m.t}</span><span style={{fontSize:12,color:"#aaa"}}>{m.dur}</span><span style={{fontSize:12,color:"#aaa"}}>{m.n}p</span></div>)}
      </div>
      <div style={{marginBottom:36}}>
        <div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>Follow-ups</div>
        <div style={{padding:"12px 16px",background:"#fafafa",borderRadius:6}}><p style={{fontSize:12.5,color:"#555",margin:0,lineHeight:1.6}}>3 action items pending from yesterday. 2 summaries ready to review.</p><button onClick={()=>goReplay(null)} style={{marginTop:8,padding:0,border:"none",background:"transparent",color:"#014592",fontSize:12.5,fontWeight:500,cursor:"pointer",fontFamily:F}}>View all →</button></div>
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.05em"}}>Recent</span>
          <button onClick={()=>goReplay(null)} style={{border:"none",background:"transparent",color:"#014592",fontSize:12,cursor:"pointer",fontFamily:F}}>See all</button>
        </div>
        {past.map((m,i)=><div key={i} onClick={()=>goReplay(i)} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:i<past.length-1?"1px solid #ebebeb":"none",cursor:"pointer"}}><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"#111"}}>{m.t}</div><div style={{fontSize:11.5,color:"#aaa",marginTop:2}}>{m.d} · {m.dur} · {m.n} people</div></div><span style={{fontSize:13,fontWeight:600,color:m.eng>=80?"#22863a":m.eng>=60?"#b08800":"#d1242f"}}>{m.eng}%</span><ChevronRight size={14} color="#ccc"/></div>)}
      </div>
    </div>
  );
}

// ─── Meeting ───
function MeetingScreen({onNav,toast,isDark}){
  const lobby=[
    {id:0,t:"Sprint Planning",time:"10:00 AM",dur:"45m",n:8,live:true,inCall:["Sarah Chen","David Kim","Maria Garcia","James Wilson","Aisha Patel","Tom Bradley","Lin Wei","Emma Roberts"]},
    {id:1,t:"Design Review",time:"1:30 PM",dur:"30m",n:5,live:false,inCall:[]},
    {id:2,t:"Client Sync — Acme Corp",time:"3:00 PM",dur:"1h",n:12,live:false,inCall:[]},
  ];
  const [selMeeting,setSelMeeting]=useState(null);
  const [joined,setJoined]=useState(false);
  const [prejoinCam,setPrejoinCam]=useState(false);
  const [prejoinStream,setPrejoinStream]=useState(null);
  const prejoinVid=useRef(null);
  const [side,setSide]=useState("people");
  const [mt,setMt]=useState(false);
  const [vid,setVid]=useState(true);
  const [meetStream,setMeetStream]=useState(null);
  const meetVidRef=useRef(null);
  const [wb,setWb]=useState(false);
  const [wbT,setWbT]=useState(1);
  const [wbColor,setWbColor]=useState("#3e7be0");
  const [wbStrokes,setWbStrokes]=useState([]);
  const wbDrawingRef=useRef(false);
  const wbLastPt=useRef(null);
  const wbCurPts=useRef([]);
  const wbCanvasRef=useRef(null);
  const [view,setView]=useState("grid");
  const [spaceTheme,setSpaceTheme]=useState("living");
  const [meetingMode,setMeetingMode]=useState("standard"); /*SPACEMODE*/
  const [spaceTransition,setSpaceTransition]=useState(null); /*SPACEMODE*/
  const [showRoomPicker,setShowRoomPicker]=useState(false);
  const spaceRoomRef=useRef(null);
  const [spaceWaves,setSpaceWaves]=useState([]);
  const [spaceRxns,setSpaceRxns]=useState({});
  const [coffeeFly,setCoffeeFly]=useState([]);
  const [showPollForm,setShowPollForm]=useState(false);
  const [pollQ,setPollQ]=useState("");
  const [pollOpts,setPollOpts]=useState(["",""]);
  const [showAttachMenu,setShowAttachMenu]=useState(false);
  const [showEmojiPicker,setShowEmojiPicker]=useState(false);
  const fileInputRef=useRef(null);
  const [chatNotif,setChatNotif]=useState(null);
  const chatNotifTimer=useRef(null);
  const [hoveredObj,setHoveredObj]=useState(null);
  const [spaceTyping,setSpaceTyping]=useState(false);
  const spaceTypingTimer=useRef(null);
  const [isPresenting,setIsPresenting]=useState(false);
  const SEATS={
    living:[
      {id:0,svgX:168,svgY:338,label:"Sofa"},
      {id:1,svgX:228,svgY:342,label:"Sofa"},
      {id:2,svgX:308,svgY:344,label:"Sofa"},
      {id:3,svgX:392,svgY:344,label:"Sofa"},
      {id:4,svgX:468,svgY:340,label:"Sofa"},
      {id:5,svgX:115,svgY:408,label:"Bean bag"},
      {id:6,svgX:582,svgY:394,label:"Bean bag"},
      {id:7,svgX:662,svgY:348,label:"Bean bag"},
      {id:8,svgX:320,svgY:432,label:"Floor"},
      {id:9,svgX:445,svgY:442,label:"Floor"},
    ],
    office:[
      {id:0,svgX:295,svgY:272,label:"Conference table"},
      {id:1,svgX:400,svgY:264,label:"Conference table"},
      {id:2,svgX:505,svgY:272,label:"Conference table"},
      {id:3,svgX:224,svgY:345,label:"Conference table"},
      {id:4,svgX:576,svgY:345,label:"Conference table"},
      {id:5,svgX:295,svgY:418,label:"Conference table"},
      {id:6,svgX:400,svgY:426,label:"Conference table"},
      {id:7,svgX:505,svgY:418,label:"Conference table"},
      {id:8,svgX:126,svgY:316,label:"Observer"},
      {id:9,svgX:674,svgY:316,label:"Observer"},
    ],
    cafe:[
      {id:0,svgX:112,svgY:324,label:"Table"},
      {id:1,svgX:192,svgY:324,label:"Table"},
      {id:2,svgX:358,svgY:314,label:"Table"},
      {id:3,svgX:436,svgY:314,label:"Table"},
      {id:4,svgX:598,svgY:324,label:"Table"},
      {id:5,svgX:678,svgY:324,label:"Table"},
      {id:6,svgX:112,svgY:445,label:"Table"},
      {id:7,svgX:192,svgY:445,label:"Table"},
      {id:8,svgX:360,svgY:222,label:"Counter"},
      {id:9,svgX:480,svgY:222,label:"Counter"},
    ],
    library:[
      {id:0,svgX:195,svgY:253,label:"Desk"},
      {id:1,svgX:312,svgY:249,label:"Desk"},
      {id:2,svgX:488,svgY:249,label:"Desk"},
      {id:3,svgX:605,svgY:253,label:"Desk"},
      {id:4,svgX:218,svgY:352,label:"Desk"},
      {id:5,svgX:334,svgY:348,label:"Desk"},
      {id:6,svgX:466,svgY:348,label:"Desk"},
      {id:7,svgX:582,svgY:352,label:"Desk"},
      {id:8,svgX:400,svgY:430,label:"Teacher's desk"},
      {id:9,svgX:128,svgY:372,label:"Side seat"},
    ],
  };
  const roomNames={living:"Living Room",office:"Office",cafe:"Café",library:"Classroom"};
  const initSeats=()=>{const s={};(SEATS.living||[]).forEach((seat,i)=>{const p=i<P.length?P[i]:null;if(p)s[p.name==="You"?"You":p.name]=seat.id;});return s;};
  const [seatAssignments,setSeatAssignments]=useState(()=>{const s={};SEATS.living.forEach((seat,i)=>{if(i<P.length)s[i<1?"You":P[i].name]=seat.id;});return s;});
  const [rec,setRec]=useState(false);
  const [hand,setHand]=useState(false);
  const [rxn,setRxn]=useState(null);
  const [showRxn,setShowRxn]=useState(false);
  const [showShare,setShowShare]=useState(false);
  const [showLeave,setShowLeave]=useState(false);
  const [showMore,setShowMore]=useState(false);
  const [pinned,setPinned]=useState(null);
  const [waiting,setWaiting]=useState(true);
  const [pCount,setPCount]=useState(9);
  const [elapsed,setElapsed]=useState(0);
  const [clockTime,setClockTime]=useState(()=>{const d=new Date();return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;});
  const [chatMsgs,setChatMsgs]=useState([{w:"Sarah",m:"Sharing wireframes now",t:"10:32 AM"},{w:"David",m:"Can we discuss the timeline?",t:"10:33 AM"},{w:"Maria",m:"Q2 report added to files",t:"10:35 AM"}]);
  const [chatIn,setChatIn]=useState("");
  const [chatBubbles,setChatBubbles]=useState([]);
    const launchSpaceRoom=()=>{ /*SPACEMODE*/
    setSpaceTransition("entering");
    const seats=SEATS[spaceTheme]||SEATS.living;
    const shuffled=[...seats].sort(()=>Math.random()-0.5);
    const names=["You","Sarah Chen","David Kim","Maria Garcia","James Wilson","Tom Bradley","Aisha Patel","Lin Wei","Emma Roberts"];
    const a={};names.forEach((n,i)=>{if(shuffled[i])a[n]=shuffled[i].id;});
    setSeatAssignments(a);
    setTimeout(()=>{setMeetingMode("space");setView("space");setSide("");},900);
    setTimeout(()=>setSpaceTransition(null),2400);
  };
  const exitSpaceRoom=()=>{ /*SPACEMODE*/
    setSpaceTransition("exiting");
    setTimeout(()=>{setMeetingMode("standard");setView("grid");},900);
    setTimeout(()=>setSpaceTransition(null),2400);
  };
    const addBubble=(name,text)=>{
    if(!text||!text.trim())return;
    const id=Date.now()+Math.random();
    setChatBubbles(bs=>[...bs.filter(b=>b.name!==name),{id,name,text:text.trim()}]);
    setTimeout(()=>setChatBubbles(bs=>bs.filter(b=>b.id!==id)),4500);
  };
    const bg="#0e0e13",sf="#17171f",cd="#1d1d28",el="#262633",bd="rgba(255,255,255,0.07)";
  const [rooms,setRooms]=useState([{name:"UX Research",ppl:["Sarah Chen","David Kim","Setyana"],hue:215},{name:"Backend",ppl:["Maria Garcia","James Wilson","Tom Bradley"],hue:270},{name:"Design",ppl:["Aisha Patel","Lin Wei","Emma Roberts"],hue:190}]);
  const [dragPerson,setDragPerson]=useState(null);
  const [dragOver,setDragOver]=useState(null);
  const nameHue=(n)=>({Setyana:215,"Sarah Chen":270,"David Kim":190,"Maria Garcia":330,"James Wilson":155,"Tom Bradley":260,"Aisha Patel":35,"Lin Wei":0,"Emma Roberts":220}[n]||200);
  const movePerson=(name,toRoom)=>{setRooms(rs=>rs.map((r,i)=>({...r,ppl:i===toRoom?[...r.ppl.filter(p=>p!==name),name]:r.ppl.filter(p=>p!==name)})));toast(`Moved ${name} to ${rooms[toRoom].name}`);};
  const speaker=pinned!==null?P[pinned]:(P.find(p=>p.sp)||P[0]);
  const fmtTime=(s)=>{const m=Math.floor(s/60),sec=s%60;return `${m}:${sec<10?"0":""}${sec}`};

  useEffect(()=>{if(rxn){const t=setTimeout(()=>setRxn(null),3000);return()=>clearTimeout(t)}},[rxn]);
  useEffect(()=>{const ci=setInterval(()=>{const d=new Date();setClockTime(`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`);},30000);return()=>clearInterval(ci);},[]);

  // ── Keyboard shortcuts ──
  useEffect(()=>{
    if(!joined)return;
    const handler=(e)=>{
      const tag=document.activeElement?.tagName;
      if(tag==="INPUT"||tag==="TEXTAREA")return; // don't fire when typing
      switch(e.key){
        case"m":case"M":
          if(!e.metaKey&&!e.ctrlKey){e.preventDefault();setMt(v=>{toast(!v?"Mic on":"Mic off");return!v;});}
          break;
        case"v":case"V":
          if(!e.metaKey&&!e.ctrlKey){e.preventDefault();setVid(v=>{toast(!v?"Camera on":"Camera off");return!v;});}
          break;
        case"h":case"H":
          if(!e.metaKey&&!e.ctrlKey){e.preventDefault();setHand(v=>{toast(!v?"Hand raised":"Hand lowered");return!v;});}
          break;
        case"Escape":
          if(wb){setWb(false);}
          else if(showLeave){setShowLeave(false);}
          else if(showMore){setShowMore(false);}
          else if(showShare){setShowShare(false);}
          else if(showRxn){setShowRxn(false);}
          break;
        case"c":case"C":
          if(!e.metaKey&&!e.ctrlKey){e.preventDefault();setSide(s=>s==="chat"?"":"chat");}
          break;
        default:break;
      }
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[joined,wb,showLeave,showMore,showShare,showRxn]);
  useEffect(()=>{if(!joined)return;const i=setInterval(()=>setElapsed(e=>e+1),1000);return()=>clearInterval(i)},[joined]);
  useEffect(()=>{
    const c=wbCanvasRef.current;if(!c)return;
    const r=c.getBoundingClientRect();
    c.width=r.width*2;c.height=r.height*2;
    const ctx=c.getContext("2d");ctx.scale(2,2);
    wbStrokes.forEach(s=>{if(s.pts.length<2)return;ctx.beginPath();ctx.strokeStyle=s.color;ctx.lineWidth=s.width;ctx.lineCap="round";ctx.lineJoin="round";ctx.moveTo(s.pts[0].x,s.pts[0].y);s.pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke()});
  },[wb]);
  useEffect(()=>{
    const c=wbCanvasRef.current;if(!c||wbDrawingRef.current)return;
    const ctx=c.getContext("2d");const r=c.getBoundingClientRect();
    ctx.clearRect(0,0,r.width,r.height);
    wbStrokes.forEach(s=>{if(s.pts.length<2)return;ctx.beginPath();ctx.strokeStyle=s.color;ctx.lineWidth=s.width;ctx.lineCap="round";ctx.lineJoin="round";ctx.moveTo(s.pts[0].x,s.pts[0].y);s.pts.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke()});
  },[wbStrokes]);
  useEffect(()=>{if(joined&&vid&&!meetStream){navigator.mediaDevices.getUserMedia({video:true,audio:false}).then(s=>{setMeetStream(s)}).catch(()=>{})}if(!vid&&meetStream){meetStream.getTracks().forEach(t=>t.stop());setMeetStream(null)}},[joined,vid]);
  useEffect(()=>{if(meetVidRef.current&&meetStream)meetVidRef.current.srcObject=meetStream},[meetStream]);
  useEffect(()=>()=>{if(meetStream)meetStream.getTracks().forEach(t=>t.stop())},[meetStream]);

  // Pre-join camera
  const startPrejoinCam=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:true,audio:false});setPrejoinStream(s);setPrejoinCam(true)}catch(e){}};
  useEffect(()=>{if(prejoinCam&&prejoinVid.current&&prejoinStream)prejoinVid.current.srcObject=prejoinStream},[prejoinCam,prejoinStream]);
  const doJoin=()=>{if(prejoinStream)prejoinStream.getTracks().forEach(t=>t.stop());setPrejoinStream(null);setJoined(true)};
  const curMeeting=selMeeting!==null?lobby.find(m=>m.id===selMeeting):null;
  const isLive=curMeeting?.live??true;
  const activeP=isLive?P:[P[0]];

  const replies=["Got it, thanks!","Agreed 👍","Makes sense","Good point","I'll take a look","Sounds good to me"];
  const sendChat=()=>{if(!chatIn.trim())return;const msg=chatIn;setChatMsgs(m=>[...m,{w:"You",m:msg,t:"Now"}]);setChatIn("");toast("Message sent");if(view==="space")addBubble("You",msg);
    if(isLive)setTimeout(()=>{
      const names=["Sarah","David","Maria"];
      const r=replies[Math.floor(Math.random()*replies.length)];
      if(Math.random()<0.35){const rxnEmojis=["👍","👏","💯","❤️","😂","🎉","🤔","✅"];const re2=rxnEmojis[Math.floor(Math.random()*rxnEmojis.length)];const rname=names[Math.floor(Math.random()*names.length)];setSpaceRxns(prev=>({...prev,[rname]:re2}));setTimeout(()=>setSpaceRxns(prev=>{const n={...prev};delete n[rname];return n;}),3000);}
      const n=names[Math.floor(Math.random()*names.length)];
      setChatMsgs(m=>[...m,{w:n,m:r,t:"Just now"}]);if(view==="space")addBubble(n,r);
      // show notif only when chat panel is not open, and not in space mode (bubbles handle it there)
      if(view!=="space")setChatNotif({name:n,preview:r});
      if(chatNotifTimer.current)clearTimeout(chatNotifTimer.current);
      chatNotifTimer.current=setTimeout(()=>setChatNotif(null),4500);
    },2000+Math.random()*2000);
  };

  const B=({icon:I,on,danger,onClick,children,title})=>(
    <button onClick={onClick} title={title} style={{height:40,borderRadius:12,border:"none",cursor:"pointer",padding:children?"0 16px":"0",width:children?undefined:40,background:danger?on?"#d1242f":el:on?"#014592":el,color:danger||on?"#fff":"#ccc",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontSize:12,fontWeight:600,fontFamily:F,position:"relative"}}><I size={16}/>{children}</button>
  );



  // ── Lobby ──
  if(!selMeeting&&selMeeting!==0) return(
    <div style={{display:"flex",height:"100vh",alignItems:"flex-start",justifyContent:"center",background:isDark?"#0e0e13":"#fafafa",fontFamily:F,paddingTop:80,filter:isDark?"invert(0.92) hue-rotate(180deg)":"none"}}>
      <div style={{width:520}}>
        <h2 style={{fontSize:20,fontWeight:700,color:"#111",margin:"0 0 4px"}}>Meetings</h2>
        <p style={{fontSize:13,color:"#999",margin:"0 0 24px"}}>Today, June 23</p>
        {lobby.map(m=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:"#fff",borderRadius:8,marginBottom:8,border:"1px solid #eee"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#ccc"} onMouseLeave={e=>e.currentTarget.style.borderColor="#eee"}>
            <div style={{minWidth:56,textAlign:"right"}}>
              <div style={{fontFamily:M,fontSize:13,color:m.live?"#111":"#999"}}>{m.time.replace(" AM","a").replace(" PM","p")}</div>
              <div style={{fontSize:10.5,color:"#aaa",marginTop:1}}>{m.dur}</div>
            </div>
            <div style={{width:1,height:32,background:"#eee"}}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14,fontWeight:600,color:"#111"}}>{m.t}</span>
                {m.live&&<span style={{fontSize:10,fontWeight:600,color:"#4ade80",background:"rgba(74,222,128,0.1)",padding:"1px 7px",borderRadius:3}}>Live · {m.inCall.length} in call</span>}
              </div>
              <div style={{fontSize:12,color:"#999",marginTop:3}}>{m.n} invited{m.inCall.length>0&&<span> · <span style={{color:"#666"}}>{m.inCall.slice(0,3).map(n=>n.split(" ")[0]).join(", ")}{m.inCall.length>3?` +${m.inCall.length-3}`:""}</span></span>}</div>
            </div>
            <button onClick={()=>{setSelMeeting(m.id);setPrejoinCam(false);setPrejoinStream(null)}} style={{padding:"8px 20px",borderRadius:7,border:"none",background:m.live?"#014592":"#f5f5f5",color:m.live?"#fff":"#666",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:F}}>{m.live?"Join":"Preview"}</button>
          </div>
        ))}
        <div style={{marginTop:20,textAlign:"center"}}>
          <button onClick={()=>onNav("dashboard")} style={{padding:"8px 20px",borderRadius:7,border:"1px solid #ddd",background:"#fff",color:"#666",fontSize:12.5,cursor:"pointer",fontFamily:F}}>Back to home</button>
        </div>
      </div>
    </div>
  );

  // ── Pre-join ──
  if(!joined) return(
    <div style={{display:"flex",height:"100vh",alignItems:"center",justifyContent:"center",background:isDark?"#0e0e13":"#fafafa",fontFamily:F,filter:isDark?"invert(0.92) hue-rotate(180deg)":"none"}}>
      <div style={{width:480,textAlign:"center"}}>
        <h2 style={{fontSize:20,fontWeight:700,color:"#111",margin:"0 0 4px"}}>{curMeeting?.t||"Meeting"}</h2>
        <p style={{fontSize:13,color:"#999",margin:"0 0 24px"}}>{curMeeting?.live?`${curMeeting.inCall.length} people are already in this meeting`:`Starts at ${curMeeting?.time||""} · ${curMeeting?.n||0} invited`}</p>
        <div style={{width:320,height:200,borderRadius:10,background:"#111",margin:"0 auto 20px",overflow:"hidden",position:"relative"}}>
          {prejoinCam?(
            <>
              <video ref={prejoinVid} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)"}}/>
              <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6}}>
                <button onClick={()=>setMt(!mt)} style={{width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",background:mt?"#d1242f":"rgba(255,255,255,0.12)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{mt?<MicOff size={16}/>:<Mic size={16}/>}</button>
                <button onClick={()=>setVid(!vid)} style={{width:36,height:36,borderRadius:10,border:"none",cursor:"pointer",background:!vid?"#d1242f":"rgba(255,255,255,0.12)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>{vid?<Video size={16}/>:<VideoOff size={16}/>}</button>
              </div>
            </>
          ):(
            <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
              <Av initials="SE" hue={215} size={64}/>
              <button onClick={startPrejoinCam} style={{padding:"5px 14px",borderRadius:6,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#aaa",fontSize:11.5,cursor:"pointer",fontFamily:F}}>Turn on camera</button>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button onClick={()=>{if(prejoinStream)prejoinStream.getTracks().forEach(t=>t.stop());setPrejoinStream(null);setPrejoinCam(false);setSelMeeting(null)}} style={{padding:"10px 24px",borderRadius:8,border:"1px solid #ddd",background:"#fff",color:"#666",fontSize:13,cursor:"pointer",fontFamily:F}}>Back</button>
          <button onClick={doJoin} style={{padding:"10px 32px",borderRadius:8,border:"none",background:"#014592",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F}}>Join now</button>
        </div>
        <p style={{fontSize:11,color:"#aaa",marginTop:12}}>{mt?"Mic off":"Mic on"} · {vid?"Camera on":"Camera off"}</p>
      </div>
    </div>
  );

  return(
    <div style={{display:"flex",height:"100vh",flexDirection:"column",position:"relative",background:bg,fontFamily:F,filter:isDark?"invert(0.92) hue-rotate(180deg)":"none"}}>
      <style>{`@keyframes panelSlideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes panelSlideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}`}</style>
      {spaceTransition&&<div style={{position:"absolute",inset:0,zIndex:9999,background:"#03000e",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"spaceFade 2.4s ease forwards",pointerEvents:"none"}}><style>{`@keyframes spaceFade{0%{opacity:0}25%{opacity:1}70%{opacity:1}100%{opacity:0}}`}</style><div style={{textAlign:"center"}}><div style={{fontSize:30,color:"#fff",fontWeight:700,letterSpacing:3,marginBottom:10}}>{spaceTransition==="entering"?"✦ Space Room":"← Returning"}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.4)",letterSpacing:2}}>{spaceTransition==="entering"?"FINDING YOUR SEAT":"BACK TO GRID"}</div></div></div>}{/*SPACEMODE*/}
      {isLive&&waiting&&<div style={{background:"rgba(1,69,146,0.15)",borderBottom:`1px solid ${bd}`,padding:"8px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <span style={{fontSize:12,color:"#7eb8ff",flex:1}}>Tom Bradley is in the waiting room</span>
        <button onClick={()=>{setWaiting(false);setPCount(c=>c+1);toast("Tom Bradley admitted")}} style={{padding:"4px 12px",borderRadius:5,border:"none",background:"#014592",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F}}>Admit</button>
        <button onClick={()=>{setWaiting(false);toast("Tom Bradley denied")}} style={{padding:"4px 12px",borderRadius:5,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#aaa",fontSize:11,cursor:"pointer",fontFamily:F}}>Deny</button>
      </div>}
      <div style={{height:44,background:sf,borderBottom:`1px solid ${bd}`,display:"flex",alignItems:"center",padding:"0 14px",flexShrink:0,gap:10}}>
        <div style={{width:6,height:6,borderRadius:3,background:"#d1242f"}}/>
        <span style={{fontSize:12,color:"#ccc",fontWeight:500}}>{curMeeting?.t||"Meeting"}</span>
        <span style={{fontSize:12,color:"#666",fontFamily:M}}>{fmtTime(elapsed)}</span>
        {rec&&<div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(209,36,45,0.15)",padding:"3px 9px",borderRadius:4}}><div style={{width:6,height:6,borderRadius:3,background:"#d1242f"}}/>
        <span style={{fontSize:10.5,color:"#f87171",fontWeight:600}}>REC</span></div>}
        <div style={{flex:1}}/>
        <div style={{display:"flex",background:el,borderRadius:5,overflow:"hidden",marginRight:6,opacity:meetingMode==="space"?0.25:1,pointerEvents:meetingMode==="space"?"none":"auto"}}>
          <button onClick={()=>setView("grid")} style={{padding:"3px 8px",border:"none",cursor:"pointer",background:view==="grid"?"#014592":"transparent",color:view==="grid"?"#fff":"#666",fontSize:10,fontFamily:F,display:"flex",alignItems:"center",gap:2}}><Grid3X3 size={9}/>Grid</button>
          <button onClick={()=>setView("speaker")} style={{padding:"3px 8px",border:"none",cursor:"pointer",background:view==="speaker"?"#014592":"transparent",color:view==="speaker"?"#fff":"#666",fontSize:10,fontFamily:F,display:"flex",alignItems:"center",gap:2}}><Maximize2 size={9}/>Speaker</button>
          
        </div>
        {meetingMode==="standard"&&<button onClick={launchSpaceRoom} style={{marginRight:6,padding:"3px 12px",borderRadius:5,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#4c1d95,#6d28d9)",color:"#fff",fontSize:10,fontFamily:F,display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>{"✦"} Space Room</button>}{/*SPACEMODE*/}
        {meetingMode==="space"&&<div style={{marginRight:6,padding:"3px 10px",borderRadius:5,background:"rgba(109,40,217,0.22)",border:"1px solid rgba(139,92,246,0.3)",color:"#a78bfa",fontSize:10,fontFamily:F,display:"flex",alignItems:"center",gap:4}}>{"✦"} Space Room active</div>}{/*SPACEMODE*/}
        <span style={{fontSize:11,color:"#555"}}><Star size={9} color="#c9a227" style={{verticalAlign:"-1px",marginRight:3}}/>{isLive?pCount:1}p</span>
        <button onClick={()=>{navigator.clipboard.writeText("https://rds.meet/s/abc-def-123").catch(()=>{});toast("Link copied")}} style={{marginLeft:4,padding:"3px 6px",borderRadius:4,border:"none",background:el,color:"#777",cursor:"pointer",display:"flex",alignItems:"center"}}><Link2 size={11}/></button>
        <Shield size={11} color="#444" style={{marginLeft:4}}/>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}} onClick={()=>{if(view==="space"&&side)setSide("");}}>
        <div style={{flex:1,padding:6,display:"flex",flexDirection:"column"}}>
          {!wb?(view==="space"?(
            <div style={{flex:1,background:"#050010",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",borderRadius:12}}>
              {(()=>{
                const roomSeats=SEATS[spaceTheme]||SEATS.living;
                const occupantOf=(sid)=>Object.entries(seatAssignments).find(([,s])=>s===sid)?.[0];
                const handleSeat=(seat)=>{const occ=occupantOf(seat.id);if(occ&&occ!=="You"){toast(`${occ.split(" ")[0]} is sitting here`);return;}setSeatAssignments(s=>({...s,You:seat.id}));};
                const Rm=()=>{
                  if(spaceTheme==="living")return(<svg x="0" y="0" width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="lwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#131218"/><stop offset="100%" stopColor="#1a1820"/></linearGradient>
  <linearGradient id="lfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a1e12"/><stop offset="100%" stopColor="#382614"/></linearGradient>
  <linearGradient id="ltvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a0810"/><stop offset="45%" stopColor="#14101c"/><stop offset="100%" stopColor="#0a0810"/></linearGradient>
  <radialGradient id="lled" cx="50%" cy="100%" r="55%"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
  <radialGradient id="llamp" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f5a020" stopOpacity="0.35"/><stop offset="100%" stopColor="#f5a020" stopOpacity="0"/></radialGradient>
  <filter id="lg10"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="lg5"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="lg3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="800" height="500" fill="#0e0e14"/>
<rect x="0" y="0" width="800" height="192" fill="url(#lwg)"/>
<polygon points="0,0 82,192 0,500" fill="#0a0a10" opacity="0.9"/>
<polygon points="0,0 82,192 0,500" fill="#0a0a10" opacity="0.9"/>
<polygon points="800,0 718,192 800,500" fill="#0a0a10" opacity="0.9"/>
<polygon points="82,192 718,192 800,500 0,500" fill="url(#lfg)"/>
<rect width="800" height="500" fill="url(#lled)"/>
<line x1="82" y1="192" x2="718" y2="192" stroke="#3a2a18" strokeWidth="1.5" opacity="0.5"/>
<line x1="82" y1="64" x2="718" y2="64" stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>
<line x1="82" y1="128" x2="718" y2="128" stroke="rgba(255,255,255,0.025)" strokeWidth="1"/>
{/* FLOATING SHELVES — left wall */}
<rect x="82" y="0" width="92" height="192" fill="#16141c" opacity="0.7"/>
<rect x="84" y="35" width="88" height="3" fill="#2a2028"/>
<rect x="86" y="24" width="14" height="11" rx="1" fill="#7a2020" opacity="0.85"/>
<rect x="102" y="22" width="12" height="13" rx="1" fill="#1a3a6a" opacity="0.85"/>
<rect x="116" y="26" width="14" height="9" rx="1" fill="#206830" opacity="0.85"/>
<rect x="132" y="23" width="12" height="12" rx="1" fill="#8a5a10" opacity="0.85"/>
<ellipse cx="157" cy="30" rx="9" ry="12" fill="#1e3a10" opacity="0.9"/>
<ellipse cx="150" cy="32" rx="6" ry="8" fill="#264a18" opacity="0.8"/>
<rect x="84" y="78" width="88" height="3" fill="#2a2028"/>
<ellipse cx="95" cy="66" rx="9" ry="11" fill="#0e1c2a" opacity="0.8"/>
<ellipse cx="95" cy="61" rx="7" ry="7" fill="#1e3c50" opacity="0.7"/>
<rect x="106" y="60" width="14" height="18" rx="1" fill="#3a3040" opacity="0.8"/>
<rect x="122" y="64" width="12" height="14" rx="1" fill="#4a1a2a" opacity="0.8"/>
<rect x="136" y="62" width="10" height="16" rx="1" fill="#1a4a2a" opacity="0.8"/>
<rect x="149" y="58" width="20" height="10" rx="2" fill="#2a2a2a" opacity="0.7"/>
<rect x="84" y="118" width="88" height="3" fill="#2a2028"/>
<rect x="86" y="105" width="16" height="13" rx="1" fill="#7a3a10" opacity="0.85"/>
<rect x="104" y="103" width="12" height="15" rx="1" fill="#2a2a6a" opacity="0.85"/>
<rect x="118" y="108" width="14" height="10" rx="1" fill="#3a2a2a" opacity="0.8"/>
<rect x="134" y="104" width="10" height="14" rx="1" fill="#4a3a10" opacity="0.8"/>
<ellipse cx="158" cy="108" rx="8" ry="10" fill="#1e3a10" opacity="0.8"/>
<rect x="628" y="35" width="88" height="3" fill="#2a2028"/>
<rect x="630" y="24" width="14" height="11" rx="1" fill="#1a3a6a" opacity="0.85"/>
<rect x="646" y="22" width="12" height="13" rx="1" fill="#7a2020" opacity="0.85"/>
<rect x="660" y="26" width="14" height="9" rx="1" fill="#4a1a5a" opacity="0.85"/>
<rect x="676" y="23" width="12" height="12" rx="1" fill="#206830" opacity="0.85"/>
<ellipse cx="700" cy="30" rx="9" ry="12" fill="#1e3a10" opacity="0.9"/>
<ellipse cx="706" cy="32" rx="6" ry="8" fill="#264a18" opacity="0.8"/>
<rect x="628" y="78" width="88" height="3" fill="#2a2028"/>
<ellipse cx="640" cy="66" rx="9" ry="11" fill="#0e1c2a" opacity="0.8"/>
<ellipse cx="640" cy="61" rx="7" ry="7" fill="#1e3c50" opacity="0.7"/>
<rect x="652" y="60" width="14" height="18" rx="1" fill="#2a3040" opacity="0.8"/>
<rect x="668" y="64" width="12" height="14" rx="1" fill="#3a1a2a" opacity="0.8"/>
<rect x="682" y="62" width="10" height="16" rx="1" fill="#1a4a2a" opacity="0.8"/>
<rect x="693" y="58" width="22" height="10" rx="2" fill="#2a2a2a" opacity="0.7"/>
<rect x="628" y="118" width="88" height="3" fill="#2a2028"/>
<rect x="630" y="105" width="16" height="13" rx="1" fill="#2a2a6a" opacity="0.85"/>
<rect x="648" y="103" width="12" height="15" rx="1" fill="#7a3a10" opacity="0.85"/>
<rect x="662" y="108" width="14" height="10" rx="1" fill="#3a2a4a" opacity="0.8"/>
<rect x="678" y="104" width="10" height="14" rx="1" fill="#4a2a10" opacity="0.8"/>
<ellipse cx="700" cy="108" rx="8" ry="10" fill="#264a18" opacity="0.8"/>
{/* FLOATING SHELVES — right wall */}
<rect x="626" y="0" width="92" height="192" fill="#16141c" opacity="0.7"/>
{/* LARGE TV — focal point back wall */}
<rect x="232" y="9" width="336" height="172" rx="5" fill="#0c0a12"/>
<rect x="236" y="13" width="328" height="164" rx="3" fill="url(#ltvg)"><animate attributeName="opacity" values="1;0.96;1;0.98;0.95;1" dur="11s" repeatCount="indefinite"/></rect>
{/* TV screen content — streaming interface */}
<rect x="236" y="13" width="328" height="28" rx="3" fill="#0a0810"/>
<rect x="244" y="19" width="60" height="8" rx="2" fill="#e50914" opacity="0.85"/>
<rect x="312" y="20" width="36" height="6" rx="2" fill="#888" opacity="0.4"/>
<rect x="354" y="20" width="36" height="6" rx="2" fill="#888" opacity="0.35"/>
<rect x="396" y="20" width="36" height="6" rx="2" fill="#888" opacity="0.3"/>
<rect x="516" y="19" width="40" height="8" rx="4" fill="#333" opacity="0.6"/>
{/* Hero show image — cinematic gradient */}
<rect x="236" y="41" width="328" height="120" fill="#0a0818"/>
<rect x="236" y="60" width="328" height="60" fill="#1a1028" opacity="0.8"/>
<rect x="236" y="100" width="328" height="61" fill="#080614" opacity="0.9"/>
<ellipse cx="400" cy="100" rx="80" ry="50" fill="#5b21b6" opacity="0.12"/>
<ellipse cx="340" cy="90" rx="50" ry="35" fill="#1d4ed8" opacity="0.1"/>
{/* Show title overlay */}
<rect x="252" y="118" width="160" height="14" rx="2" fill="#fff" opacity="0.85"/>
<rect x="252" y="136" width="110" height="8" rx="2" fill="#aaa" opacity="0.55"/>
<rect x="252" y="148" width="80" height="8" rx="2" fill="#888" opacity="0.4"/>
{/* Thumbnail row */}
{[0,1,2,3].map(ti=><g key={ti}><rect x={372+ti*44} y={128} width="38" height="38" rx="3" fill={["#2d1b69","#0f172a","#1a1a2e","#162032"][ti]} opacity="0.9"/><rect x={374+ti*44} y="136" width="24" height="5" rx="1" fill="#666" opacity="0.5"/></g>)}
{/* Playback bar */}
<rect x="236" y="164" width="328" height="12" rx="0" fill="#0a0810"/>
<rect x="236" y="165" width="200" height="4" rx="2" fill="#e50914" opacity="0.7"/>
<rect x="236" y="165" width="328" height="4" rx="2" fill="#333" opacity="0.4"/>
{/* TV glow on ceiling */}
<ellipse cx="400" cy="14" rx="160" ry="18" fill="#3b82f6" opacity="0.07" filter="url(#lg10)"/>
{/* TV glow on floor */}
<ellipse cx="400" cy="200" rx="200" ry="24" fill="#5b21b6" opacity="0.06" filter="url(#lg10)"><animate attributeName="opacity" values="0.04;0.08;0.05;0.09;0.04;0.06" dur="9s" repeatCount="indefinite"/></ellipse>
{/* TV bezel glow */}
<rect x="232" y="9" width="336" height="172" rx="5" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.15"/>
{/* TV stand */}
<polygon points="352,182 448,180 454,194 346,196" fill="#1a1820"/>
<polygon points="346,196 454,194 456,200 344,202" fill="#141218"/>
<polygon points="344,202 356,202 358,218 342,220" fill="#1a1820"/>
<polygon points="444,202 456,202 458,220 442,220" fill="#1a1820"/>
{/* TV CONSOLE / CREDENZA */}
<polygon points="170,228 630,216 636,266 164,278" fill="#1e1c24"/>
<polygon points="170,228 630,216 630,232 170,244" fill="#2a2830"/>
<polygon points="164,278 636,266 636,284 164,296" fill="#141218"/>
{/* Console handles */}
{[220,340,460].map(x=><rect key={x} x={x} y="243" width="28" height="4" rx="2" fill="#3a3840" opacity="0.8"/>)}
{/* Console decorative items — plant pot + speaker */}
<rect x="178" y="212" width="20" height="16" rx="2" fill="#1a2a18"/><ellipse cx="188" cy="210" rx="14" ry="10" fill="#1e3a14"/>
<rect x="592" y="214" width="28" height="14" rx="3" fill="#1e1c24" stroke="#2a2830" strokeWidth="1"/>
<rect x="596" y="218" width="20" height="6" rx="2" fill="#252330" opacity="0.8"/>
{/* LED strip under console */}
<rect x="170" y="278" width="460" height="2" rx="1" fill="#3b82f6" opacity="0.25"/>
<ellipse cx="400" cy="295" rx="230" ry="16" fill="#3b82f6" opacity="0.04" filter="url(#lg5)"/>
{/* MODERN SOFA — low profile, warm gray */}
<ellipse cx="330" cy="416" rx="200" ry="22" fill="rgba(0,0,0,0.4)"/>
{/* Sofa base */}
<polygon points="134,334 530,322 534,380 130,392" fill="#2e2c36"/>
{/* Back cushions (3 segments) */}
<polygon points="136,296 254,292 256,334 134,338" fill="#3a3844"/>
<polygon points="258,290 376,286 378,330 256,334" fill="#3c3a46"/>
<polygon points="380,286 524,282 526,322 378,330" fill="#3a3844"/>
{/* Back rail */}
<polygon points="134,292 524,280 526,294 134,306" fill="#242230"/>
{/* Seat cushions */}
<polygon points="138,336 256,332 258,372 136,378" fill="#343240"/>
<polygon points="260,330 378,326 380,368 258,374" fill="#363444"/>
<polygon points="382,326 526,320 528,364 380,370" fill="#343240"/>
{/* Sofa arm left */}
<polygon points="120,284 140,282 138,396 118,398" fill="#242230"/>
<polygon points="118,282 142,280 144,292 116,294" fill="#2e2c38"/>
{/* Sofa arm right */}
<polygon points="524,272 544,270 546,386 522,388" fill="#242230"/>
<polygon points="522,268 548,266 550,278 520,280" fill="#2e2c38"/>
{/* Throw blanket on sofa */}
<polygon points="382,286 470,284 472,332 380,338" fill="#8b3a2a" opacity="0.82"/>
<polygon points="382,286 470,284 471,296 381,300" fill="#a04a38" opacity="0.75"/>
{/* Scatter pillows */}
<ellipse cx="178" cy="314" rx="28" ry="20" fill="#1e3a6a" opacity="0.9"/>
<ellipse cx="178" cy="311" rx="24" ry="16" fill="#264880"/>
<ellipse cx="480" cy="305" rx="24" ry="18" fill="#3a1a4a" opacity="0.9"/>
<ellipse cx="480" cy="302" rx="20" ry="14" fill="#4a2a5a"/>
{/* L EXTENSION — right side */}
<polygon points="524,270 560,268 562,426 520,428" fill="#2e2c36"/>
<polygon points="522,268 562,266 564,278 520,280" fill="#2e2c38"/>
<polygon points="524,322 562,320 564,366 522,368" fill="#343240"/>
{/* GLASS COFFEE TABLE */}
<ellipse cx="330" cy="444" rx="130" ry="18" fill="rgba(0,0,0,0.35)"/>
<polygon points="208,406 456,398 460,430 204,438" fill="#1a1820" opacity="0.5"/>
<polygon points="208,406 456,398 456,410 208,418" fill="#2a2830" opacity="0.6"/>
<polygon points="204,438 460,430 460,444 204,452" fill="#141218" opacity="0.8"/>
{/* Glass top */}
<polygon points="208,406 456,398 460,428 204,436" fill="rgba(140,160,200,0.07)" stroke="rgba(160,180,220,0.2)" strokeWidth="1"/>
{/* Items on table */}
<ellipse cx="256" cy="412" rx="16" ry="10" fill="#0e0e16" opacity="0.8"/>
<ellipse cx="256" cy="409" rx="13" ry="8" fill="#1a1828" opacity="0.9"/>
<rect x="298" y="406" width="32" height="22" rx="2" fill="#1a1828" opacity="0.8"/>
<rect x="300" y="408" width="28" height="18" rx="1" fill="#252336" opacity="0.7"/>
<rect x="366" y="404" width="50" height="14" rx="2" fill="#e8e0d0" opacity="0.55"/>
<rect x="366" y="404" width="50" height="4" rx="1" fill="#c8c0a8" opacity="0.4"/>
<rect x="428" y="408" width="24" height="18" rx="3" fill="#1e1c26" opacity="0.8"/>
{/* SIDE TABLE left with lamp */}
<ellipse cx="100" cy="436" rx="32" ry="10" fill="rgba(0,0,0,0.35)"/>
<polygon points="72,398 132,394 134,426 70,430" fill="#1a1820"/>
<polygon points="70,424 134,420 134,430 70,434" fill="#141218"/>
<rect x="96" y="364" width="6" height="36" rx="2" fill="#2a2630"/>
<path d="M76,364 Q100,354 124,364 L124,372 Q100,362 76,372 Z" fill="#2a2030"/>
<ellipse cx="99" cy="360" rx="20" ry="8" fill="#f5a020" opacity="0.85"/>
<ellipse cx="99" cy="395" rx="48" ry="38" fill="url(#llamp)"><animate attributeName="opacity" values="0.8;1;0.85;1;0.78;0.95" dur="6s" repeatCount="indefinite"/></ellipse>
{/* LARGE PLANT — right corner */}
<rect x="660" y="355" width="28" height="36" rx="4" fill="#16141c"/>
<rect x="672" y="292" width="5" height="65" rx="2" fill="#1c2e10"/>
<ellipse cx="674" cy="288" rx="26" ry="36" fill="#1e4012" opacity="0.92"/>
<ellipse cx="658" cy="302" rx="20" ry="28" fill="#264818" opacity="0.92"/>
<ellipse cx="690" cy="300" rx="20" ry="28" fill="#1e4012" opacity="0.92"/>
<ellipse cx="665" cy="278" rx="17" ry="24" fill="#2a4a18" opacity="0.9"/>
<ellipse cx="682" cy="282" rx="15" ry="21" fill="#1e3c10" opacity="0.9"/>
{/* SMALL PLANT left console */}
<rect x="84" y="218" width="18" height="22" rx="3" fill="#16141c"/>
<ellipse cx="93" cy="214" rx="14" ry="16" fill="#1e3a10"/><ellipse cx="84" cy="218" rx="10" ry="12" fill="#264818"/><ellipse cx="102" cy="217" rx="10" ry="12" fill="#1e3a10"/>
{/* PENDANT LIGHTS */}
<line x1="310" y1="0" x2="310" y2="18" stroke="#201e28" strokeWidth="2"/>
<path d="M294,18 Q310,28 326,18" fill="#1e1c26" stroke="#2a2830" strokeWidth="1"/>
<ellipse cx="310" cy="23" rx="12" ry="5" fill="#f5c060" opacity="0.8"/>
<ellipse cx="310" cy="210" rx="56" ry="22" fill="#f5a030" opacity="0.06" filter="url(#lg10)"/>
<line x1="490" y1="0" x2="490" y2="18" stroke="#201e28" strokeWidth="2"/>
<path d="M474,18 Q490,28 506,18" fill="#1e1c26" stroke="#2a2830" strokeWidth="1"/>
<ellipse cx="490" cy="23" rx="12" ry="5" fill="#f5c060" opacity="0.8"/>
<ellipse cx="490" cy="210" rx="56" ry="22" fill="#f5a030" opacity="0.06" filter="url(#lg10)"/>
{/* AREA RUG */}
<polygon points="148,360 520,348 534,440 134,452" fill="#1e1c28" opacity="0.35"/>
<polygon points="158,368 510,356 522,432 146,444" fill="none" stroke="#2e2c3a" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.3"/>
</svg>);

                  if(spaceTheme==="office")return(<svg x="0" y="0" width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="owg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1220"/><stop offset="100%" stopColor="#0e1828"/></linearGradient>
  <linearGradient id="ofg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#131e2e"/><stop offset="100%" stopColor="#1a2840"/></linearGradient>
  <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="192" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#030810"/><stop offset="35%" stopColor="#0a1640"/><stop offset="65%" stopColor="#8b3a0e"/><stop offset="82%" stopColor="#d06020"/><stop offset="100%" stopColor="#f28218"/></linearGradient>
  <radialGradient id="sungg" cx="68%" cy="96%" r="38%"><stop offset="0%" stopColor="#ffe060" stopOpacity="0.85"/><stop offset="40%" stopColor="#f08018" stopOpacity="0.4"/><stop offset="100%" stopColor="#f28218" stopOpacity="0"/></radialGradient>
  <radialGradient id="otg" cx="50%" cy="40%" r="60%"><stop offset="0%" stopColor="#6ab0e4" stopOpacity="0.14"/><stop offset="100%" stopColor="#6ab0e4" stopOpacity="0.03"/></radialGradient>
  <filter id="og6"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="og14"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="cityBW"><rect x="554" y="0" width="164" height="192"/></clipPath>
  <clipPath id="cityTRI"><polygon points="718,192 800,0 800,192"/></clipPath>
</defs>
<rect width="800" height="500" fill="#090e18"/>
{/* Back wall — left portion (city takes right) */}
<rect x="0" y="0" width="556" height="192" fill="url(#owg)"/>
<polygon points="0,0 82,192 0,500" fill="#070c14" opacity="0.9"/>
<polygon points="82,192 718,192 800,500 0,500" fill="url(#ofg)"/>
{[1,2,3].map(i=><line key={i} x1={82+i*159} y1="192" x2={i*200} y2="500" stroke="rgba(255,255,255,0.018)" strokeWidth="1"/>)}
<line x1="82" y1="64" x2="556" y2="64" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
<line x1="82" y1="128" x2="556" y2="128" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
{/* ── CITY WINDOW — back wall right (dawn skyline) ── */}
<g clipPath="url(#cityBW)">
  <rect x="554" y="0" width="164" height="192" fill="url(#skyg)"/>
  <ellipse cx="692" cy="188" rx="90" ry="36" fill="url(#sungg)"/>
  <ellipse cx="692" cy="185" rx="32" ry="14" fill="#ffd060" opacity="0.5" filter="url(#og6)"/>
  <rect x="554" y="164" width="164" height="28" fill="rgba(220,100,20,0.12)"/>
  <rect x="554" y="140" width="14" height="52" fill="#030810"/>
  <rect x="567" y="116" width="22" height="76" fill="#04090f"/>
  <rect x="565" y="104" width="4" height="14" fill="#030810"/>
  <rect x="589" y="138" width="16" height="54" fill="#030810"/>
  <rect x="605" y="98" width="28" height="94" fill="#04090f"/>
  <rect x="617" y="91" width="4" height="9" fill="#030810"/>
  <rect x="633" y="130" width="18" height="62" fill="#030810"/>
  <rect x="651" y="108" width="26" height="84" fill="#040a10"/>
  <rect x="677" y="144" width="14" height="48" fill="#030810"/>
  <rect x="691" y="118" width="20" height="74" fill="#04090f"/>
  <rect x="711" y="134" width="10" height="58" fill="#030810"/>
  {[[570,120,3,4],[572,132,3,4],[575,144,3,4],[579,120,3,4],[579,132,3,4],
    [608,104,3,4],[608,114,3,4],[612,104,3,4],[614,124,3,4],[618,114,3,4],
    [654,115,3,4],[654,126,3,4],[658,115,3,4],[660,135,3,4],[665,115,3,4],
    [694,123,3,4],[694,133,3,4],[698,123,3,4],[700,143,3,4],[706,123,3,4]
  ].map(([x,y,w,h],i)=><rect key={i} x={x} y={y} width={w} height={h} rx="0.5" fill="#ffe898" opacity="0.85"/>)}
  {[[609,142,3,4],[622,108,3,4],[656,140,3,4],[695,155,3,4]].map(([x,y,w,h],i)=><rect key={i} x={x} y={y} width={w} height={h} rx="0.5" fill="#aacdff" opacity="0.6"/>)}
</g>
{/* ── CITY WINDOW — right wall triangle ── */}
<g clipPath="url(#cityTRI)">
  <polygon points="718,192 800,0 800,192" fill="url(#skyg)"/>
  <ellipse cx="760" cy="185" rx="70" ry="28" fill="url(#sungg)" opacity="0.6"/>
  <rect x="720" y="110" width="22" height="82" fill="#040a10"/>
  <rect x="720" y="102" width="4" height="10" fill="#030810"/>
  <rect x="742" y="92" width="28" height="100" fill="#030810"/>
  <rect x="770" y="124" width="18" height="68" fill="#040a10"/>
  <rect x="788" y="105" width="16" height="87" fill="#030810"/>
  {[[723,118,3,4],[723,128,3,4],[728,118,3,4],[745,99,3,4],[745,110,3,4],[750,99,3,4],[752,120,3,4],[772,130,3,4],[776,140,3,4],[790,112,3,4],[794,125,3,4]].map(([x,y,w,h],i)=><rect key={i} x={x} y={y} width={w} height={h} rx="0.5" fill="#ffe898" opacity="0.85"/>)}
  <rect x="718" y="165" width="82" height="27" fill="rgba(210,90,15,0.15)"/>
</g>
{/* Right-wall dark strip below window */}
<polygon points="718,192 800,192 800,500 718,500" fill="#070c14" opacity="0.88"/>
{/* ── GLASS WINDOW FRAME & MULLIONS ── */}
<rect x="551" y="0" width="6" height="192" fill="#0a1622"/>
<rect x="554" y="0" width="246" height="4" fill="#0c1a2e"/>
<rect x="554" y="188" width="246" height="5" fill="#0c1a2e"/>
<rect x="610" y="0" width="4" height="192" fill="#0a1622"/>
<rect x="662" y="0" width="4" height="192" fill="#0a1622"/>
<rect x="714" y="0" width="4" height="192" fill="#0a1622"/>
<rect x="554" y="114" width="250" height="3" fill="#0a1622"/>
<line x1="557" y1="5" x2="609" y2="112" stroke="rgba(200,230,255,0.06)" strokeWidth="12"/>
<line x1="614" y1="5" x2="661" y2="112" stroke="rgba(200,230,255,0.04)" strokeWidth="10"/>
<line x1="666" y1="5" x2="713" y2="112" stroke="rgba(200,230,255,0.04)" strokeWidth="10"/>
<polygon points="554,192 718,192 750,340 520,340" fill="rgba(120,180,240,0.04)"/>
<polygon points="554,192 718,192 730,260 560,260" fill="rgba(160,200,240,0.03)"/>
{/* ── CEILING TRACK LIGHTING ── */}
<rect x="210" y="0" width="290" height="3" rx="1.5" fill="#1e2e42"/>
{[255,320,385,450].map(lx=><g key={lx}>
  <rect x={lx-4} y="3" width="8" height="10" rx="2" fill="#1a2838"/>
  <ellipse cx={lx} cy="192" rx="50" ry="20" fill="#c8ddee" opacity="0.05" filter="url(#og6)"/>
  <line x1={lx} y1="3" x2={lx} y2="13" stroke="#2a3a50" strokeWidth="2"/>
</g>)}
{/* ── PROJECTOR SCREEN ── */}
<rect x="148" y="10" width="396" height="166" rx="4" fill="#04080f"/>
<rect x="152" y="14" width="388" height="158" rx="2" fill="#edf1f7"/>
<rect x="164" y="26" width="364" height="22" rx="2" fill="#1e40af" opacity="0.9"/>
<rect x="168" y="31" width="180" height="10" rx="2" fill="#fff" opacity="0.8"/>
<rect x="354" y="31" width="60" height="10" rx="2" fill="#93c5fd" opacity="0.7"/>
{[54,68,82,96,110].map((ty,i)=><g key={i}><circle cx="172" cy={ty+3} r="2.5" fill="#2563eb" opacity="0.7"/><rect x="180" y={ty} width={[130,100,118,88,108][i]} height="5" rx="2" fill="#64748b" opacity={0.6-i*0.06}/></g>)}
<rect x="410" y="52" width="94" height="112" rx="3" fill="#f0f4fc" opacity="0.9"/>
{[[422,88,60],[437,72,76],[452,80,68],[467,56,82]].map(([x,h,oh],i)=><g key={i}><rect x={x} y={156-oh} width="12" height={oh} rx="2" fill="#dbeafe"/><rect x={x} y={156-h} width="12" height={h} rx="2" fill={i===1?"#1d4ed8":"#3b82f6"} opacity="0.88"/></g>)}
<line x1="416" y1="156" x2="480" y2="156" stroke="#94a3b8" strokeWidth="0.8"/>
<rect x="164" y="148" width="364" height="2" fill="#e2e8f0"/>
<rect x="164" y="154" width="52" height="7" rx="2" fill="#1e40af" opacity="0.5"/>
<ellipse cx="350" cy="192" rx="160" ry="18" fill="#3b82f6" opacity="0.06" filter="url(#og14)"/>
<rect x="148" y="10" width="396" height="166" rx="4" fill="none" stroke="#0a1830" strokeWidth="3"/>
{/* Projector device */}
<line x1="350" y1="0" x2="350" y2="10" stroke="#162030" strokeWidth="4"/>
<rect x="324" y="10" width="52" height="18" rx="3" fill="#162030"/>
<polygon points="344,28 356,28 548,178 152,178" fill="#3b82f6" opacity="0.018"/>
{/* Blinking cursor on slide */}
<rect x="182" y="56" width="2" height="8" rx="1" fill="#2563eb" opacity="0.7"><animate attributeName="opacity" values="0.7;0;0.7" dur="1.1s" repeatCount="indefinite"/></rect>
{/* ── LEFT WHITEBOARD ── */}
<rect x="82" y="16" width="60" height="142" rx="3" fill="#0a1622"/>
<rect x="85" y="19" width="54" height="136" rx="2" fill="#f5f8ff"/>
<circle cx="112" cy="72" r="10" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.7"/>
{[[96,52],[128,52],[90,92],[134,92]].map(([cx,cy],i)=><g key={i}><circle cx={cx} cy={cy} r="7" fill="none" stroke={i<2?"#10b981":"#f59e0b"} strokeWidth="1.2" opacity="0.7"/><line x1={cx+(i%2===0?7:-7)} y1={cy} x2={i<2?112+(i===0?-10:10):112+(i===2?-10:10)} y2={i<2?72:84} stroke="#94a3b8" strokeWidth="0.9" opacity="0.5"/></g>)}
<rect x="88" y="110" width="46" height="4" rx="2" fill="#3b82f6" opacity="0.4"/>
<rect x="88" y="118" width="36" height="3" rx="2" fill="#94a3b8" opacity="0.5"/>
<rect x="85" y="155" width="54" height="5" rx="1" fill="#0e1a2c"/>
{/* ── CORNER PLANTS ── */}
<rect x="84" y="330" width="28" height="38" rx="4" fill="#0a1420"/>
<rect x="96" y="264" width="6" height="70" rx="3" fill="#1a2c10"/>
{[[98,260,28,38],[82,272,22,30],[114,272,22,30],[90,248,18,26],[108,252,16,24]].map(([cx,cy,rx2,ry2],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx2} ry={ry2} fill={["#1e3c14","#264820","#1e3c14","#2a4a1a","#223a14"][i]} opacity="0.9"/>)}
<rect x="676" y="330" width="28" height="38" rx="4" fill="#0a1420"/>
<rect x="686" y="264" width="6" height="70" rx="3" fill="#1a2c10"/>
{[[688,260,28,38],[672,272,22,30],[704,272,22,30],[680,248,18,26],[698,252,16,24]].map(([cx,cy,rx2,ry2],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx2} ry={ry2} fill={["#1e3c14","#264820","#1e3c14","#2a4a1a","#223a14"][i]} opacity="0.9"/>)}
{/* ── GLASS OVAL CONFERENCE TABLE ── */}
<ellipse cx="400" cy="388" rx="175" ry="30" fill="rgba(0,0,0,0.45)"/>
<ellipse cx="400" cy="366" rx="22" ry="7" fill="#0e1a28"/>
<rect x="382" y="344" width="36" height="24" rx="6" fill="#0e1a28"/>
<ellipse cx="400" cy="342" rx="172" ry="72" fill="#0a1420" opacity="0.3"/>
<ellipse cx="400" cy="342" rx="172" ry="72" fill="url(#otg)" stroke="rgba(130,190,240,0.22)" strokeWidth="1.5"/>
<ellipse cx="355" cy="308" rx="98" ry="34" fill="rgba(210,235,255,0.055)"/>
<ellipse cx="400" cy="342" rx="168" ry="68" fill="none" stroke="rgba(180,220,255,0.35)" strokeWidth="0.9"/>
{[[296,338],[336,326],[378,322],[422,322],[464,326],[504,338]].map(([tx,ty],i)=><g key={i}><ellipse cx={tx} cy={ty+10} rx="4.5" ry="9" fill="rgba(190,225,250,0.22)" stroke="rgba(170,210,240,0.35)" strokeWidth="0.8"/><ellipse cx={tx} cy={ty+1} rx="3" ry="2" fill="rgba(220,240,255,0.25)"/></g>)}
<rect x="378" y="316" width="44" height="30" rx="2" fill="rgba(30,48,72,0.7)" stroke="rgba(100,160,220,0.2)" strokeWidth="0.8"/>
{/* ── CHAIRS ── */}
{[[295,270],[400,262],[505,270]].map(([cx,cy],i)=><g key={i}>
  <ellipse cx={cx} cy={cy+28} rx="23" ry="8" fill="rgba(0,0,0,0.35)"/>
  <rect x={cx-24} y={cy-16} width="48" height="36" rx="6" fill="#16263a"/>
  <rect x={cx-20} y={cy-12} width="40" height="28" rx="4" fill="#1e3250" opacity="0.9"/>
  <rect x={cx-24} y={cy+18} width="48" height="16" rx="4" fill="#16263a"/>
  <rect x={cx-28} y={cy+4} width="6" height="24" rx="3" fill="#10202e"/>
  <rect x={cx+22} y={cy+4} width="6" height="24" rx="3" fill="#10202e"/>
</g>)}
{[[222,340,true],[578,340,false]].map(([cx,cy,isLeft],i)=><g key={i}>
  <ellipse cx={cx} cy={cy+20} rx="18" ry="6" fill="rgba(0,0,0,0.35)"/>
  <rect x={cx-22} y={cy-6} width="44" height="36" rx="5" fill="#16263a"/>
  <rect x={cx-18} y={cy-3} width="36" height="28" rx="4" fill="#1e3250" opacity="0.85"/>
  <rect x={isLeft?cx+20:cx-26} y={cy-6} width="8" height="44" rx="4" fill="#10202e"/>
</g>)}
{[[295,415],[400,424],[505,415]].map(([cx,cy],i)=><g key={i}>
  <ellipse cx={cx} cy={cy+20} rx="23" ry="7" fill="rgba(0,0,0,0.35)"/>
  <rect x={cx-24} y={cy-4} width="48" height="28" rx="5" fill="#16263a"/>
  <rect x={cx-20} y={cy-2} width="40" height="22" rx="4" fill="#1e3250" opacity="0.9"/>
  <rect x={cx-28} y={cy-4} width="6" height="22" rx="3" fill="#10202e"/>
  <rect x={cx+22} y={cy-4} width="6" height="22" rx="3" fill="#10202e"/>
</g>)}
{[[122,312],[678,312]].map(([cx,cy],i)=><g key={i}>
  <ellipse cx={cx} cy={cy+18} rx="16" ry="5" fill="rgba(0,0,0,0.3)"/>
  <rect x={cx-18} y={cy-14} width="36" height="36" rx="5" fill="#12202e"/>
  <rect x={cx-14} y={cy-10} width="28" height="26" rx="4" fill="#1a2e40" opacity="0.85"/>
</g>)}
<ellipse cx="400" cy="360" rx="200" ry="95" fill="#0e1a2c" opacity="0.5"/>
<ellipse cx="400" cy="360" rx="196" ry="91" fill="none" stroke="rgba(100,150,200,0.08)" strokeWidth="2"/>
</svg>);
                  if(spaceTheme==="cafe")return(<svg x="0" y="0" width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="cwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1a0c06"/><stop offset="100%" stopColor="#240e08"/></linearGradient>
  <linearGradient id="cafeTile" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5c3c1a"/><stop offset="100%" stopColor="#3a2410"/></linearGradient>
  <radialGradient id="cfloorv" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#2a1808" stopOpacity="0.55"/><stop offset="100%" stopColor="#2a1808" stopOpacity="0"/></radialGradient>
  <radialGradient id="cwarm" cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor="#f59e0b" stopOpacity="0.04"/><stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/></radialGradient>
  <radialGradient id="cwin" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#f5a020" stopOpacity="0.95"/><stop offset="60%" stopColor="#e87010" stopOpacity="0.7"/><stop offset="100%" stopColor="#c85010" stopOpacity="0.3"/></radialGradient>
  <filter id="cglow3"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="cg8"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="cg4"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="800" height="500" fill="#0e0804"/>
<rect x="0" y="0" width="800" height="192" fill="url(#cwg)"/>
<polygon points="0,0 82,192 0,500" fill="#0a0602" opacity="0.9"/>
<polygon points="800,0 718,192 800,500" fill="#0a0602" opacity="0.9"/>
<polygon points="82,192 718,192 800,500 0,500" fill="url(#cafeTile)"/>
<polygon points="82,192 718,192 800,500 0,500" fill="url(#cfloorv)"/>
<rect x="530" y="3" width="178" height="60" rx="4" fill="#1a0e06"/>
<rect x="533" y="6" width="172" height="54" rx="3" fill="url(#cwin)"/>
<rect x="619" y="6" width="2" height="54" fill="#1a0e06" opacity="0.7"/>
<rect x="533" y="33" width="172" height="2" fill="#1a0e06" opacity="0.5"/>
<path d="M533,6 Q518,28 520,60 L533,60 Z" fill="#3a2010" opacity="0.7"/>
<path d="M705,6 Q720,28 718,60 L705,60 Z" fill="#3a2010" opacity="0.7"/>
<polygon points="530,192 708,192 720,300 518,300" fill="#f08020" opacity="0.035"/>
{(()=>{const b=[];const W=636,H=192,bw=48,bh=16;for(let row=0;row<Math.ceil(H/bh);row++){const off=row%2===0?0:24;for(let col=-1;col<Math.ceil(W/bw)+1;col++){const x=82+col*bw+off,y=row*bh;b.push(<rect key={`${row}-${col}`} x={x} y={y} width={bw-2} height={bh-1} rx="1" fill={row%3===0?"#2a1208":row%3===1?"#261008":"#2e1408"} opacity="0.7"/>);}}return b;})()}
<rect x="290" y="4" width="58" height="22" rx="4" fill="#1a0e06"/>
<rect x="292" y="6" width="54" height="18" rx="3" fill="#120a04"/>
<text x="319" y="18" textAnchor="middle" fill="#f5a030" fontSize="10" fontFamily="monospace" letterSpacing="2">{clockTime||"--:--"}</text>
<rect x="86" y="3" width="184" height="62" rx="4" fill="#1e1008"/>
<rect x="88" y="5" width="180" height="58" rx="3" fill="#2a1808"/>
<rect x="91" y="8" width="174" height="51" rx="2" fill="#1a3020"/>
<rect x="92" y="9" width="172" height="49" rx="1" fill="#1e3824"/>
<text x="178" y="24" textAnchor="middle" fill="rgba(235,228,205,0.92)" fontSize="12" fontFamily="Georgia,'Times New Roman',serif" letterSpacing="4" fontWeight="bold">MENU</text>
<line x1="120" y1="27" x2="236" y2="27" stroke="rgba(225,218,192,0.55)" strokeWidth="0.9"/>
<text x="178" y="36" textAnchor="middle" fill="rgba(218,210,185,0.78)" fontSize="7" fontFamily="Georgia,serif" letterSpacing="1">Café au Lait  ·  Espresso</text>
<text x="178" y="43" textAnchor="middle" fill="rgba(218,210,185,0.73)" fontSize="7" fontFamily="Georgia,serif" letterSpacing="1">Croissant  ·  Pain au Chocolat</text>
<text x="178" y="50" textAnchor="middle" fill="rgba(218,210,185,0.68)" fontSize="7" fontFamily="Georgia,serif" letterSpacing="1">Croque Monsieur  ·  Quiche</text>
<rect x="91" y="57" width="174" height="5" rx="1" fill="#241408"/>
<rect x="97" y="58" width="14" height="3" rx="1.5" fill="rgba(228,220,196,0.75)"/>
<rect x="114" y="58" width="10" height="3" rx="1.5" fill="rgba(200,195,175,0.65)"/>
{[152,400,648].map((lx,li)=><g key={li}>
  <line x1={lx} y1="0" x2={lx} y2="38" stroke="#2a1808" strokeWidth="1.5" opacity="0.8"/>
  <path d={`M${lx-22},38 Q${lx},52 ${lx+22},38`} fill="#2a1606" stroke="#3a2010" strokeWidth="1"/>
  <path d={`M${lx-22},38 L${lx-14},38 Q${lx},50 ${lx+14},38 L${lx+22},38`} fill="#3a2010"/>
  <ellipse cx={lx} cy="45" rx="8" ry="6" fill="#f5a020" opacity="0.9"><animate attributeName="opacity" values="0.85;0.95;0.88;0.96;0.84;0.90" dur={`${4.5+li*1.8}s`} repeatCount="indefinite"/></ellipse>
  <ellipse cx={lx} cy="192" rx="88" ry="36" fill="#f09020" opacity="0.1" filter="url(#cg8)"><animate attributeName="opacity" values="0.07;0.12;0.08;0.13;0.07;0.10" dur={`${4.5+li*1.8}s`} repeatCount="indefinite"/></ellipse>
  <ellipse cx={lx} cy="192" rx="44" ry="18" fill="#f5a030" opacity="0.08"/>
</g>)}
<polygon points="82,65 718,65 730,165 70,165" fill="#2e1808"/>
<polygon points="70,165 730,165 730,185 70,185" fill="#221206"/>
<polygon points="70,185 730,185 718,192 82,192" fill="#3a2010"/>
<polygon points="82,65 718,65 718,72 82,72" fill="#4a2c14" opacity="0.8"/>
<rect x="246" y="72" width="80" height="72" rx="4" fill="#1a1010"/>
<rect x="248" y="74" width="76" height="68" rx="3" fill="#221414"/>
<rect x="255" y="80" width="62" height="38" rx="3" fill="#1a1010"/>
<rect x="258" y="83" width="56" height="32" rx="2" fill="#0a0808"/>
<ellipse cx="286" cy="99" rx="18" ry="14" fill="#141010"/>
<ellipse cx="286" cy="99" rx="14" ry="10" fill="#1a1414"/>
<circle cx="286" cy="99" r="6" fill="#0a0808"/>
<rect x="262" y="124" width="48" height="8" rx="2" fill="#1a1010"/>
<rect x="266" y="157" width="40" height="8" rx="2" fill="#1a1010"/>
<rect x="274" y="163" width="10" height="14" rx="3" fill="#1a1010"/>
<rect x="288" y="163" width="10" height="14" rx="3" fill="#1a1010"/>
<path d="M293,73 Q290,65 293,58 Q296,51 293,44" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round"/>
<path d="M307,73 Q310,64 307,56 Q304,48 307,41" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" strokeLinecap="round"/>
<rect x="336" y="78" width="80" height="62" rx="4" fill="#1a1008" opacity="0.9"/>
{[0,1,2].map(i=><g key={i}><ellipse cx={348+i*24} cy="110" rx="9" ry="7" fill={["#6a3010","#2a1808","#7a4818"][i]} opacity="0.9"/><ellipse cx={348+i*24} cy="108" rx="7" ry="5" fill={["#7a4020","#3a2410","#8a5828"][i]} opacity="0.9"/></g>)}
{[440,470,500,530,560].map((tx,i)=><g key={i}><ellipse cx={tx} cy="118" rx="10" ry="7" fill="#1a0c04"/><ellipse cx={tx} cy="113" rx="8" ry="5" fill={i%2?"#c84010":"#8a3808"} opacity="0.9"/></g>)}
{[[152,312,294],[400,302,284],[648,312,294],[152,442,424],[400,432,414]].map(([cx,ty,tty],i)=>(
<g key={i}>
  <ellipse cx={cx} cy={ty+36} rx="50" ry="14" fill="rgba(0,0,0,0.35)"/>
  <ellipse cx={cx} cy={tty} rx="54" ry="28" fill="#1e140c"/>
  <ellipse cx={cx} cy={tty} rx="51" ry="25" fill="#2a1c12"/>
  <ellipse cx={cx} cy={tty-3} rx="48" ry="22" fill="#3a2a1a"/>
  <rect x={cx-5} y={tty+12} width="10" height="44" rx="4" fill="#2a1808"/>
  <ellipse cx={cx} cy={tty+54} rx="16" ry="5" fill="#1e1008"/>
  <ellipse cx={cx-16} cy={tty-10} rx="6" ry="4" fill="#c04010" opacity="0.9"/>
  <ellipse cx={cx+14} cy={tty-9} rx="5" ry="3.5" fill="#c04010" opacity="0.9"/>
  <rect x={cx-3} y={tty-18} width="6" height="14" rx="3" fill="#2a3830"/>
  <ellipse cx={cx} cy={tty-18} rx="5" ry="5" fill="#2a4820"/>
</g>))}
{[200,286,364,436,514,600].map((sx,si)=><g key={si}><ellipse cx={sx} cy="218" rx="14" ry="9" fill="#281408"/><ellipse cx={sx} cy="215" rx="12" ry="8" fill="#3a2010"/><rect x={sx-3} y="222" width="6" height="28" rx="3" fill="#1e0e04"/><ellipse cx={sx} cy="246" rx="10" ry="4" fill="#180e04"/></g>)}
<rect x="83" y="228" width="24" height="32" rx="3" fill="#2a1808"/>
<rect x="94" y="196" width="4" height="34" rx="2" fill="#1e3010"/>
{[[96,192,22,30],[82,204,17,24],[110,204,17,24],[90,185,14,20],[104,188,13,18]].map(([cx,cy,rx2,ry2],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx2} ry={ry2} fill={["#1e4010","#163408","#264818","#183a0c","#1e3c10"][i]} opacity="0.93"/>)}
<rect x="690" y="228" width="24" height="32" rx="3" fill="#2a1808"/>
<rect x="701" y="196" width="4" height="34" rx="2" fill="#1e3010"/>
{[[703,192,22,30],[689,204,17,24],[717,204,17,24],[697,185,14,20],[711,188,13,18]].map(([cx,cy,rx2,ry2],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx2} ry={ry2} fill={["#1e4010","#163408","#264818","#183a0c","#1e3c10"][i]} opacity="0.93"/>)}
<rect width="800" height="500" fill="url(#cwarm)"/>
</svg>);

                  if(spaceTheme==="library")return(<svg x="0" y="0" width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="clwg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c1408"/><stop offset="100%" stopColor="#241c0e"/></linearGradient>
  <linearGradient id="clfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2c1e0e"/><stop offset="100%" stopColor="#3a2816"/></linearGradient>
  <radialGradient id="clwin" cx="92%" cy="45%" r="40%"><stop offset="0%" stopColor="#f5c84a" stopOpacity="0.2"/><stop offset="100%" stopColor="#f5c84a" stopOpacity="0"/></radialGradient>
  <filter id="clg8"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<rect width="800" height="500" fill="#140e06"/>
<rect x="0" y="0" width="800" height="192" fill="url(#clwg)"/>
<polygon points="0,0 82,192 0,500" fill="#100c06" opacity="0.9"/>
<polygon points="800,0 718,192 800,500" fill="#100c06" opacity="0.9"/>
<polygon points="82,192 718,192 800,500 0,500" fill="url(#clfg)"/>
<rect width="800" height="500" fill="url(#clwin)"/>
<line x1="82" y1="192" x2="718" y2="192" stroke="#4a3010" strokeWidth="2" opacity="0.5"/>
{[1,2,3,4].map(i=><line key={i} x1={82+i*130} y1="192" x2={i*160} y2="500" stroke="#2a1c0c" strokeWidth="1" opacity="0.14"/>)}
<line x1="82" y1="155" x2="718" y2="155" stroke="#3a2810" strokeWidth="2" opacity="0.4"/>
<rect x="180" y="10" width="435" height="172" rx="5" fill="#0c1c10"/>
<rect x="184" y="14" width="427" height="164" rx="3" fill="#0e2218"/>
<rect x="280" y="24" width="236" height="9" rx="2" fill="#e0d8b8" opacity="0.72"/>
<line x1="280" y1="34" x2="516" y2="34" stroke="#c0b898" strokeWidth="1.2" opacity="0.5"/>
<rect x="194" y="46" width="62" height="5" rx="2" fill="#c8c0a8" opacity="0.6"/>
<rect x="262" y="46" width="16" height="5" rx="2" fill="#c8c0a8" opacity="0.5"/>
<rect x="284" y="46" width="48" height="5" rx="2" fill="#c8c0a8" opacity="0.6"/>
<rect x="194" y="58" width="48" height="5" rx="2" fill="#c8c0a8" opacity="0.55"/>
<rect x="248" y="58" width="20" height="5" rx="2" fill="#c8c0a8" opacity="0.45"/>
<rect x="274" y="58" width="56" height="5" rx="2" fill="#c8c0a8" opacity="0.55"/>
<line x1="198" y1="82" x2="198" y2="148" stroke="#b8b098" strokeWidth="1.3" opacity="0.65"/>
<line x1="198" y1="148" x2="298" y2="148" stroke="#b8b098" strokeWidth="1.3" opacity="0.65"/>
<path d="M198,148 Q218,128 238,114 Q258,100 278,88 Q288,82 298,78" fill="none" stroke="#88d488" strokeWidth="1.8" opacity="0.75" strokeLinecap="round"/>
{[220,240,260,280].map((x,i)=><line key={i} x1={x} y1="146" x2={x} y2="150" stroke="#b8b098" strokeWidth="1" opacity="0.5"/>)}
{[108,122,136].map((y,i)=><line key={i} x1="196" y1={y} x2="200" y2={y} stroke="#b8b098" strokeWidth="1" opacity="0.5"/>)}
{[[316,78],[316,92],[316,106],[316,120],[316,134]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y+3} r="2.5" fill="#c8c0a8" opacity="0.6"/><rect x={x+8} y={y} width={[112,88,104,76,96][i]} height="5" rx="2" fill="#c8c0a8" opacity={0.6-i*0.06}/></g>)}
<rect x="184" y="177" width="427" height="5" rx="1" fill="#183018"/>
{(()=>{const c=[];[196,214,228,578,596,612].forEach((x,i)=>c.push(<rect key={i} x={x} y="178" width={i%2===0?18:14} height="3" rx="1.5" fill={i<3?"#ddd8b8":"#c8c4a0"} opacity="0.8"/>));return c;})()}
<rect x="180" y="10" width="435" height="172" rx="5" fill="none" stroke="#2e1e0c" strokeWidth="3"/>
<rect x="630" y="14" width="80" height="158" rx="3" fill="#3a2810"/>
<rect x="633" y="17" width="74" height="152" rx="2" fill="#7a5828"/>
<rect x="637" y="22" width="30" height="40" rx="1" fill="#eee8d0" opacity="0.9"/><ellipse cx="652" cy="22" rx="2.5" ry="2.5" fill="#8a2010"/>
{[29,35,41,47].map(y=><rect key={y} x="637" y={y} width="22" height="3" rx="1" fill="#a0987a" opacity="0.5"/>)}
<rect x="671" y="26" width="28" height="32" rx="1" fill="#d0d8c8" opacity="0.9" transform="rotate(-2,685,42)"/><ellipse cx="671" cy="26" rx="2.5" ry="2.5" fill="#2a4a1a"/>
<rect x="637" y="68" width="30" height="22" rx="1" fill="#d8e0e8" opacity="0.85"/><ellipse cx="637" cy="68" rx="2.5" ry="2.5" fill="#1a3a6a"/>
<rect x="671" y="64" width="28" height="34" rx="1" fill="#eeddc8" opacity="0.9"/><ellipse cx="671" cy="64" rx="2.5" ry="2.5" fill="#7a3010"/>
<rect x="637" y="98" width="62" height="46" rx="2" fill="#d4e8d0" opacity="0.8"/>
{[108,114,120,130,136].map((y,i)=><rect key={y} x="642" y={y} width={[50,38,46,30,42][i]} height="4" rx="1" fill="#809878" opacity="0.6"/>)}
<circle cx="148" cy="42" r="22" fill="#1e1608" stroke="#2e2010" strokeWidth="2.5"/>
<circle cx="148" cy="42" r="18" fill="#e8e0c4" opacity="0.9"/>
{[0,3,6,9].map(i=><rect key={i} x={148+14*Math.sin(i*Math.PI/6)-2} y={42-14*Math.cos(i*Math.PI/6)-2} width="4" height="4" rx="1" fill="#1a1208" opacity="0.7"/>)}
<line x1="148" y1="42" x2="148" y2="30" stroke="#1a1208" strokeWidth="2" strokeLinecap="round"/>
<line x1="148" y1="42" x2="158" y2="44" stroke="#1a1208" strokeWidth="1.5" strokeLinecap="round"/>
<circle cx="148" cy="42" r="2" fill="#1a1208"/>
<rect x="82" y="0" width="92" height="192" fill="#1c1008"/>
{(()=>{const s=[];const bc=["#7a3020","#1a3a6a","#206830","#8a5a10","#4a1a5a","#902a10","#1a4a7a","#2a5a28"];for(let r=0;r<6;r++){s.push(<rect key={`ld${r}`} x="84" y={r*32} width="88" height="2" fill="#3a2810"/>);s.push(<rect key={`lf${r}`} x="84" y={r*32+2} width="88" height="28" fill="#221408"/>);for(let b=0;b<4;b++){const w=b%2===0?18:16;s.push(<rect key={`lb${r}${b}`} x={86+b*21} y={r*32+4} width={w} height="24" rx="1" fill={bc[(r*4+b)%8]} opacity="0.88"/>);}}return s;})()}
<polygon points="718,192 800,0 800,500 718,500" fill="#1e1608"/>
<polygon points="718,192 800,0 800,120 718,250" fill="#f5c84a" opacity="0.07"/>
<rect x="722" y="0" width="3" height="500" fill="#2a1e0c" opacity="0.5"/>
<line x1="718" y1="148" x2="800" y2="72" stroke="#2a1e0c" strokeWidth="2.5" opacity="0.5"/>
<polygon points="718,192 800,72 800,300 718,380" fill="#f5c84a" opacity="0.035"/>
<ellipse cx="400" cy="456" rx="170" ry="22" fill="rgba(0,0,0,0.4)"/>
<polygon points="258,420 542,408 548,444 252,456" fill="#2c1c0a"/>
<polygon points="258,420 542,408 542,422 258,434" fill="#3c2c14"/>
<polygon points="252,456 548,444 548,462 252,474" fill="#1e1208"/>
<rect x="272" y="410" width="38" height="28" rx="2" fill="#0c1808" opacity="0.85"/>
<rect x="360" y="414" width="55" height="16" rx="3" fill="#1e1808" opacity="0.9"/>
<rect x="440" y="408" width="50" height="32" rx="2" fill="#e8e0c8" opacity="0.75"/>
<ellipse cx="510" cy="412" rx="11" ry="12" fill="#7a1608"/>
<ellipse cx="510" cy="409" rx="9" ry="10" fill="#9a2010"/>
<rect x="509" y="399" width="2" height="8" rx="1" fill="#281c08"/>
{(()=>{const d=[];[{cx:195,cy:253},{cx:312,cy:249},{cx:488,cy:249},{cx:605,cy:253}].forEach(({cx,cy},i)=>{d.push(<ellipse key={`bs${i}`} cx={cx} cy={cy+24} rx="42" ry="11" fill="rgba(0,0,0,0.3)"/>);d.push(<polygon key={`bt${i}`} points={`${cx-42},${cy} ${cx+42},${cy-4} ${cx+44},${cy+20} ${cx-40},${cy+24}`} fill="#3a2a10"/>);d.push(<polygon key={`btt${i}`} points={`${cx-42},${cy} ${cx+42},${cy-4} ${cx+42},${cy+6} ${cx-42},${cy+10}`} fill="#4a3818" opacity="0.9"/>);d.push(<rect key={`bn${i}`} x={cx-12} y={cy+2} width="24" height="14" rx="1" fill="#1e1408" opacity="0.6"/>);});return d;})()}
{(()=>{const d=[];[{cx:218,cy:352},{cx:334,cy:348},{cx:466,cy:348},{cx:582,cy:352}].forEach(({cx,cy},i)=>{d.push(<ellipse key={`fs${i}`} cx={cx} cy={cy+26} rx="44" ry="12" fill="rgba(0,0,0,0.32)"/>);d.push(<polygon key={`ft${i}`} points={`${cx-44},${cy} ${cx+44},${cy-4} ${cx+46},${cy+22} ${cx-42},${cy+26}`} fill="#3a2a10"/>);d.push(<polygon key={`ftt${i}`} points={`${cx-44},${cy} ${cx+44},${cy-4} ${cx+44},${cy+8} ${cx-44},${cy+12}`} fill="#4a3818" opacity="0.9"/>);d.push(<rect key={`fn${i}`} x={cx-12} y={cy+2} width="24" height="14" rx="1" fill="#1e1408" opacity="0.6"/>);});return d;})()}
<rect x="105" y="346" width="8" height="42" rx="3" fill="#3a2a10"/>
<circle cx="109" cy="320" r="24" fill="#1a3a6a"/>
<circle cx="109" cy="320" r="22" fill="#1e4880"/>
<ellipse cx="102" cy="312" rx="9" ry="7" fill="#286028" opacity="0.85"/>
<ellipse cx="116" cy="322" rx="7" ry="9" fill="#286028" opacity="0.8"/>
<ellipse cx="109" cy="386" rx="18" ry="5" fill="#2a1c08"/>
<rect x="686" y="344" width="26" height="34" rx="4" fill="#1e1208"/>
<rect x="697" y="285" width="5" height="60" rx="2" fill="#1e3010"/>
{[[699,280,24,34],[684,294,18,26],[714,293,18,26],[691,266,16,23],[709,270,14,20]].map(([cx,cy,rx2,ry2],i)=><ellipse key={i} cx={cx} cy={cy} rx={rx2} ry={ry2} fill={["#254a18","#1e3c12","#2a4818","#1e3c12","#224010"][i]} opacity="0.93"/>)}
<rect x="220" y="0" width="360" height="3" rx="1.5" fill="#2c2010"/>
{[270,360,440,530].map(lx=><g key={lx}><rect x={lx-8} y="0" width="16" height="6" rx="2" fill="#2a1e0c"/><ellipse cx={lx} cy="2" rx="12" ry="5" fill="#f5e0a0" opacity="0.4"><animate attributeName="opacity" values="0.35;0.42;0.38;0.44;0.36;0.40" dur={`${6+lx%4}s`} repeatCount="indefinite"/></ellipse><ellipse cx={lx} cy="192" rx="50" ry="20" fill="#f5e0a0" opacity="0.05" filter="url(#clg8)"/></g>)}
</svg>);

};
                                return(<div style={{width:"100%",height:"100%",position:"relative"}}>
                {showRoomPicker&&<div style={{position:"absolute",top:8,right:8,zIndex:30,background:"rgba(5,3,18,0.92)",backdropFilter:"blur(14px)",borderRadius:10,padding:"10px 12px",border:"1px solid rgba(255,255,255,0.1)",minWidth:180}}>
                  <div style={{fontSize:9.5,color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em",fontFamily:F,marginBottom:8}}>CHOOSE ROOM</div>
                  {[{id:"living",label:"Living Room",icon:"🏠"},{id:"office",label:"Office",icon:"💼"},{id:"cafe",label:"Café",icon:"☕"},{id:"library",label:"Classroom",icon:"🎓"}].map(r=>(
                    <button key={r.id} onClick={()=>{setSpaceTheme(r.id);setShowRoomPicker(false);}}
                      style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"7px 10px",borderRadius:7,border:"none",cursor:"pointer",fontFamily:F,fontSize:12,
                        background:spaceTheme===r.id?"rgba(255,255,255,0.12)":"transparent",
                        color:spaceTheme===r.id?"#fff":"rgba(255,255,255,0.55)",marginBottom:2,textAlign:"left"}}>
                      <span style={{fontSize:14}}>{r.icon}</span>{r.label}
                      {spaceTheme===r.id&&<span style={{marginLeft:"auto",fontSize:9,color:"#a78bfa"}}>✓</span>}
                    </button>
                  ))}
                  <button onClick={()=>setShowRoomPicker(false)} style={{marginTop:6,width:"100%",padding:"5px",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"rgba(255,255,255,0.3)",fontSize:10,cursor:"pointer",fontFamily:F}}>Cancel</button>
                </div>}
                {!showRoomPicker&&<button onClick={()=>setShowRoomPicker(true)} style={{position:"absolute",top:8,right:8,zIndex:30,padding:"3px 9px",borderRadius:6,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(0,0,0,0.55)",color:"#aaa",fontSize:10,cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:3,backdropFilter:"blur(6px)"}}><Globe size={10}/>Change room</button>}
                <svg viewBox="-20 -80 840 660" preserveAspectRatio="xMidYMid meet" style={{width:"100%",height:"100%",display:"block",cursor:"default"}}>
                  <rect x="-20" y="-80" width="840" height="660" fill={{"living":"#0a0018","office":"#0a1420","cafe":"#160a04","library":"#160c04"}[spaceTheme]||"#050010"}/>
                  <Rm/>
                  {/* Seat indicators */}
                  {roomSeats.map(seat=>{
                    const occ=occupantOf(seat.id);
                    const isYou=occ==="You";
                    const isTaken=!!occ&&!isYou;
                    const r=14;
                    return(<g key={seat.id} onClick={()=>handleSeat(seat)} style={{cursor:isTaken?"not-allowed":"pointer"}}>
                      <circle cx={seat.svgX} cy={seat.svgY} r={r+6} fill="transparent"/>
                      {!occ&&<circle cx={seat.svgX} cy={seat.svgY} r={r} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeDasharray="4 3"/>}
                      {isYou&&<circle cx={seat.svgX} cy={seat.svgY} r={r} fill="rgba(139,92,246,0.25)" stroke="#8b5cf6" strokeWidth="2"/>}
                      {isTaken&&<circle cx={seat.svgX} cy={seat.svgY} r={r} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>}
                    </g>);
                  })}
                  {/* CSS animations */}
                  <defs><style>{`
                    @keyframes spaceFade{0%{opacity:0}25%{opacity:1}70%{opacity:1}100%{opacity:0}}
                    @keyframes bubblePop{0%{opacity:0;transform:translateY(6px)}12%{opacity:1;transform:translateY(0)}78%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-10px)}}
                    @keyframes panelSlideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
                    @keyframes wave{0%{transform:scale(1);opacity:0.7}100%{transform:scale(3.5);opacity:0}}
                    @keyframes waveUp{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-50px)}}
                    .wave-em{animation:waveUp 1.6s ease-out forwards;pointer-events:none;}
                    @keyframes floatUp{0%{opacity:0;transform:translateY(4px) scale(0.8)}15%{opacity:1;transform:translateY(0) scale(1.15)}70%{opacity:1;transform:translateY(-10px) scale(1)}100%{opacity:0;transform:translateY(-24px) scale(0.8)}}
                    @keyframes handWave{0%,100%{transform:rotate(0deg) translateY(0)}25%{transform:rotate(-20deg) translateY(-2px)}75%{transform:rotate(18deg) translateY(-1px)}}
                    @keyframes coffeeFlyAnim{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0.3);opacity:0}}
                    .room-obj{transition:opacity 0.2s;}
                    .room-obj:hover .obj-stroke{stroke-opacity:0.5;}
                  `}</style></defs>
                  {/* Participant avatars */}
                  {[...(isLive?P:[P[0]])].sort((a,b)=>{const sa=seatAssignments[a.name],sb=seatAssignments[b.name];const ya=sa!=null?roomSeats.find(s=>s.id===sa)?.svgY??0:0,yb=sb!=null?roomSeats.find(s=>s.id===sb)?.svgY??0:0;return ya-yb;}).map((p,pi)=>{
                    const sid=seatAssignments[p.name];
                    const seat=sid!=null?roomSeats.find(s=>s.id===sid):null;
                    const svgX=seat?seat.svgX:-100,svgY=seat?seat.svgY:-100;
                    const isMe=p.name==="You";
                    const r=isMe?20:16;
                    const typing=spaceTyping&&isMe;
                    const bs=[];
                    if(p.sp) bs.push({col:"rgba(255,255,255,0.5)",dot:false,pulse:true});
                    if(p.hd) bs.push({col:"#f59e0b",dot:false});
                    if(typing) bs.push({col:"#10b981",dot:true});
                    const hasHand=isMe?hand:p.hd;
                    const showRxn=isMe?rxn:spaceRxns[p.name];
                    return(<g key={p.name} transform={`translate(${svgX},${svgY})`}
                      style={{transition:"transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",cursor:!isMe?"pointer":"default"}}
                      onClick={!isMe?()=>{
                        const wid=Date.now();
                        setSpaceWaves(ws=>[...ws,{id:wid,svgX,svgY:svgY-r-12}]);
                        toast(`👋 You waved at ${p.name.split(" ")[0]}`);
                        setTimeout(()=>{
                          const wid2=Date.now();
                          setSpaceWaves(ws=>[...ws,{id:wid2,svgX:svgX+20,svgY:svgY-r-30,back:true,name:p.name.split(" ")[0]}]);
                          setTimeout(()=>setSpaceWaves(ws=>ws.filter(x=>x.id!==wid&&x.id!==wid2)),2000);
                        },900);
                      }:undefined}>
                      {bs.map((b,bi)=><circle key={bi} r={r+6+bi*5} fill="none" stroke={b.col} strokeWidth={b.pulse?"1.5":"1"} opacity="0.6">{b.pulse&&<animate attributeName="r" values={`${r+4};${r+12};${r+4}`} dur="2s" repeatCount="indefinite"/>}{b.pulse&&<animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>}</circle>)}
                      {/* Hand raise */}
                      {hasHand&&<g style={{animation:"handWave 1.2s ease-in-out infinite",transformOrigin:"0px 0px",transformBox:"fill-box"}}>
                        <text x="0" y={-(r+20)} textAnchor="middle" dominantBaseline="middle" fontSize="14">✋</text>
                      </g>}
                      {/* Reaction emoji */}
                      {showRxn&&<text x="0" y={-(r+(hasHand?36:20))} textAnchor="middle" dominantBaseline="middle" fontSize="16"
                        style={{animation:"floatUp 3s ease forwards",pointerEvents:"none"}}>
                        {showRxn}
                      </text>}
                      <circle r={r} fill={`hsl(${p.hue},38%,22%)`} stroke={isMe?"#a78bfa":p.sp?"rgba(255,255,255,0.5)":"none"} strokeWidth={isMe?2:1.5}/>
                      <text x="0" y="1" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={isMe?13:11} fontWeight="600" fontFamily={F}>{p.initials}</text>
                      <text x="0" y={r+10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily={F}>{p.name==="You"?"You":p.name.split(" ")[0]}</text>
                    </g>);
                  })}
                  {/* Wave animations */}
                  {spaceWaves.map(w=>(
                  <g key={w.id} style={{pointerEvents:"none"}}>
                    <text x={w.svgX} y={w.svgY} textAnchor="middle" fontSize="18" className="wave-em">👋</text>
                    {w.back&&<text x={w.svgX} y={w.svgY-8} textAnchor="middle" fontSize="9" className="wave-em" style={{animationDelay:"0.1s",fill:"rgba(255,255,255,0.6)",fontFamily:F}}>waves back</text>}
                  </g>
                ))}
                  {/* Coffee fly */}
                  {coffeeFly.map(cf=>(<g key={cf.id} style={{"--dx":`${cf.tx}px`,"--dy":`${cf.ty}px`,animation:"coffeeFlyAnim 0.8s ease-out forwards",transformOrigin:`${cf.sx}px ${cf.sy}px`}}><text x={cf.sx} y={cf.sy} fontSize="18" textAnchor="middle">☕</text></g>))}
                  {/* Chat bubbles */}
                  {chatBubbles.map(bubble=>{
                    const seatId=seatAssignments[bubble.name]||Object.entries(seatAssignments).find(([k])=>k.split(" ")[0]===bubble.name)?.[1];
                    const seat=roomSeats.find(s=>s.id===seatId);
                    if(!seat)return null;
                    const txt=bubble.text.length>34?bubble.text.slice(0,34)+"\u2026":bubble.text;
                    const bw=Math.min(Math.max(txt.length*6.4+28,64),210);
                    const bx=seat.svgX-bw/2,by=seat.svgY-82;
                    return(<g key={bubble.id} style={{pointerEvents:"none",animation:"bubblePop 4.5s ease forwards",transformBox:"fill-box",transformOrigin:"center bottom"}}>
                      <rect x={bx} y={by} width={bw} height={26} rx={13} fill="rgba(255,255,255,0.94)"/>
                      <polygon points={`${seat.svgX-6},${by+26} ${seat.svgX+6},${by+26} ${seat.svgX},${by+34}`} fill="rgba(255,255,255,0.94)"/>
                      <text x={seat.svgX} y={by+13} dominantBaseline="middle" textAnchor="middle" fontSize={10} fill="#111" fontFamily={F} fontWeight={500}>{txt}</text>
                    </g>);
                  })}
                </svg>
                {/* Action dock */}
                <div style={{position:"absolute",top:46,left:"50%",transform:"translateX(-50%)",zIndex:20,display:"flex",gap:2,background:"rgba(5,3,18,0.82)",backdropFilter:"blur(10px)",borderRadius:20,padding:"3px 5px",border:"1px solid rgba(255,255,255,0.08)"}}>
                  {[
                    {label:"Whiteboard",Icon:Presentation,col:"#8b5cf6",active:wb,         act:()=>{setWb(v=>!v);toast(wb?"Whiteboard closed":"Whiteboard opened");}},
                    {label:"Share",     Icon:Monitor,     col:"#3b82f6",active:isPresenting,act:()=>setShowShare(v=>!v)},
                    {label:"Chat",      Icon:MessageSquare,col:"#10b981",active:side==="chat",act:()=>setSide(s=>s==="chat"?"":"chat")},
                  ].map((btn,i)=>(
                    <button key={i} onClick={btn.act} title={btn.label}
                      style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:16,
                        border:"none",cursor:"pointer",transition:"all 0.15s",outline:"none",fontFamily:F,fontSize:11,
                        background:btn.active?`${btn.col}2a`:"transparent",
                        color:btn.active?btn.col:"rgba(255,255,255,0.4)"}}
                      onMouseEnter={e=>{if(!btn.active){e.currentTarget.style.background="rgba(255,255,255,0.07)";e.currentTarget.style.color="#fff";}}}
                      onMouseLeave={e=>{if(!btn.active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.4)";}}}
                    >
                      <btn.Icon size={12}/>{btn.label}
                    </button>
                  ))}
                  {meetingMode==="space"&&<button onClick={exitSpaceRoom} title="Exit Space Room"
                    style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:16,
                      border:"none",cursor:"pointer",fontFamily:F,fontSize:11,
                      background:"rgba(248,113,113,0.12)",color:"#f87171",transition:"all 0.15s",outline:"none"}}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(248,113,113,0.22)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="rgba(248,113,113,0.12)";}}
                  ><LogIn size={12}/>Exit Space</button>}{/*SPACEMODE*/}
                </div>
                {/* Room label */}
                <div style={{position:"absolute",bottom:8,left:10,background:"rgba(0,0,0,0.5)",padding:"2px 8px",borderRadius:4,fontSize:9.5,color:"#555",fontFamily:F,pointerEvents:"none"}}>🏠 {roomNames[spaceTheme]} · Click a seat</div>
                </div>);
              })()}
            </div>
          ):view==="grid"?(
            <div style={{flex:1,display:"grid",gridTemplateColumns:isLive?"repeat(3,1fr)":"1fr",gridTemplateRows:isLive?"repeat(3,1fr)":"1fr",gap:4}}>
              {activeP.map((p,i)=>(
                <div key={i} onClick={()=>{setPinned(pinned===i?null:i);toast(pinned===i?"Unpinned":p.name==="You"?"Pinned yourself":`Pinned ${p.name}`)}} style={{background:cd,borderRadius:12,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",border:p.sp?`2px solid rgba(255,255,255,0.7)`:pinned===i?`2px solid #014592`:`1px solid ${bd}`,boxShadow:p.sp?"0 0 12px rgba(255,255,255,0.1)":"none",overflow:"hidden",cursor:"pointer",transition:"border 0.2s ease, box-shadow 0.2s ease"}}>
                  {i===0&&vid&&meetStream?<video ref={meetVidRef} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)"}}/>:<Av initials={p.initials} hue={p.hue} size={i===0?56:44}/>}
                  {rxn&&i===0&&<div style={{position:"absolute",top:"30%",fontSize:32,animation:"float 3s forwards"}}>{rxn}</div>}
                  {hand&&i===0&&<div style={{position:"absolute",top:6,left:6,fontSize:18}}>✋</div>}
                  {pinned===i&&<div style={{position:"absolute",top:7,right:7,background:"#014592",borderRadius:5,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.4)"}}><Pin size={11} color="#fff" style={{transform:"rotate(45deg)"}}/></div>}
                  <div style={{position:"absolute",bottom:6,left:6,background:"rgba(0,0,0,0.55)",padding:"2px 7px",borderRadius:4,fontSize:10.5,color:"#ddd",display:"flex",alignItems:"center",gap:4}}>
                    {(i===0?mt:p.muted)&&<MicOff size={10} color="#ef4444"/>}
                    {p.sp&&<Volume2 size={10} color="rgba(255,255,255,0.7)"/>}
                    <span>{p.name==="You"?"You":p.name.split(" ")[0]}</span>
                  </div>
                  {p.hd&&<div style={{position:"absolute",top:6,right:6,fontSize:16}}>✋</div>}
                </div>
              ))}
            </div>
          ):(
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
              <div style={{flex:1,background:cd,borderRadius:12,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",border:activeP.find(p=>p.sp)?`2px solid rgba(255,255,255,0.7)`:`1px solid ${bd}`,overflow:"hidden"}}>
                {vid&&meetStream?<video ref={meetVidRef} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)"}}/>:<Av initials={activeP[pinned??0]?.initials||"YO"} hue={activeP[pinned??0]?.hue||215} size={80}/>}
                <div style={{position:"absolute",bottom:10,left:10,background:"rgba(0,0,0,0.55)",padding:"3px 10px",borderRadius:5,fontSize:12,color:"#ddd"}}>{activeP[pinned??0]?.name||"You"}</div>
              </div>
              <div style={{display:"flex",gap:4,height:80}}>
                {activeP.slice(0,5).map((p,i)=>(
                  <div key={i} onClick={()=>setPinned(i)} style={{flex:1,background:cd,borderRadius:8,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",border:pinned===i?`2px solid #014592`:`1px solid ${bd}`,cursor:"pointer",overflow:"hidden"}}>
                    <Av initials={p.initials} hue={p.hue} size={28}/>
                    <div style={{position:"absolute",bottom:3,left:3,right:3,background:"rgba(0,0,0,0.55)",padding:"1px 4px",borderRadius:3,fontSize:9,color:"#ddd",textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name==="You"?"You":p.name.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
            </div>
          )
          ):(<div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
      {/* Participant strip */}
      <div style={{display:"flex",gap:3,flexShrink:0,justifyContent:"center"}}>
        {activeP.slice(0,6).map((p,i)=>(
          <div key={i} style={{width:80,minWidth:80,height:50,background:cd,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:p.sp?`1px solid rgba(255,255,255,0.7)`:`1px solid ${bd}`,position:"relative",overflow:"hidden"}}>
            <Av initials={p.initials} hue={p.hue} size={24}/>
            <span style={{position:"absolute",bottom:2,left:4,fontSize:8,color:"#aaa",background:"rgba(0,0,0,0.4)",padding:"0 3px",borderRadius:2}}>{p.name==="You"?"Setyana":p.name.split(" ")[0]}</span>
          </div>
        ))}
        {isLive&&<div style={{width:80,minWidth:80,height:50,background:cd,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${bd}`,fontSize:10,color:"#666"}}>+3</div>}
      </div>
      {/* Canvas card */}
      <div style={{flex:1,borderRadius:14,overflow:"hidden",background:"#fff",border:"1px solid #e5e5e5",position:"relative",display:"flex",flexDirection:"column"}}>
        {/* Toolbar */}
        <div style={{height:38,background:"#fafafa",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",padding:"0 10px",gap:3,flexShrink:0}}>
          {[MousePointer2,PenTool,Type,Square,StickyNote,Minus].map((I,i)=>(
            <button key={i} onClick={()=>setWbT(i)} style={{width:28,height:28,borderRadius:5,border:"none",cursor:"pointer",background:wbT===i?"#014592":"transparent",color:wbT===i?"#fff":"#888",display:"flex",alignItems:"center",justifyContent:"center"}}><I size={13}/></button>
          ))}
          <div style={{width:1,height:16,background:"#e5e5e5",margin:"0 4px"}}/>
          {["#e03e3e","#e8a838","#4ea24e","#3e7be0","#8b5cf6","#d946a8"].map((c,i)=>(
            <div key={i} onClick={()=>setWbColor(c)} style={{width:14,height:14,borderRadius:7,background:c,cursor:"pointer",border:wbColor===c?"2px solid #333":"2px solid transparent"}}/>
          ))}
          <div style={{flex:1}}/>
          <Undo2 size={13} color={wbStrokes.length?"#666":"#ddd"} style={{cursor:"pointer"}} onClick={()=>setWbStrokes(s=>s.slice(0,-1))}/>
          <div onClick={()=>setWbStrokes([])} style={{marginLeft:6,cursor:"pointer",fontSize:10,color:"#aaa",padding:"2px 6px",borderRadius:3,background:"#f0f0f0"}}>Clear</div>
          <div style={{width:1,height:16,background:"#e5e5e5",margin:"0 6px"}}/>
          <button onClick={()=>setWb(false)} style={{display:"flex",alignItems:"center",gap:5,padding:"0 12px",height:28,borderRadius:6,border:"none",cursor:"pointer",background:"#d1242f",color:"#fff",fontSize:11,fontWeight:600,whiteSpace:"nowrap",flexShrink:0}}>
            <X size={12}/>Exit Whiteboard
          </button>
        </div>
        {/* Drawing area */}
        <div style={{flex:1,position:"relative",cursor:wbT===1?"crosshair":wbT===3?"crosshair":"default"}}>
          <canvas ref={wbCanvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",touchAction:"none",userSelect:"none"}}
            onMouseDown={e=>{
              if(wbT!==1&&wbT!==5)return;
              e.preventDefault();
              const c=e.currentTarget;
              // Re-init canvas size on every stroke start (survives remounts)
              if(c.width!==Math.round(c.offsetWidth)||c.height!==Math.round(c.offsetHeight)){
                c.width=c.offsetWidth||c.parentElement?.offsetWidth||800;
                c.height=c.offsetHeight||c.parentElement?.offsetHeight||500;
                // Redraw committed strokes on newly sized canvas
                const ctx2=c.getContext("2d");
                wbStrokes.forEach(s=>{if(s.pts.length<2)return;ctx2.beginPath();ctx2.strokeStyle=s.color;ctx2.lineWidth=s.width;ctx2.lineCap="round";ctx2.lineJoin="round";ctx2.moveTo(s.pts[0].x,s.pts[0].y);s.pts.forEach(p=>ctx2.lineTo(p.x,p.y));ctx2.stroke();});
              }
              const r=c.getBoundingClientRect();
              const x=e.clientX-r.left,y=e.clientY-r.top;
              wbDrawingRef.current=true;
              wbLastPt.current={x,y};
              wbCurPts.current=[{x,y}];
            }}
            onMouseMove={e=>{
              if(!wbDrawingRef.current)return;
              e.preventDefault();
              const c=e.currentTarget;
              const r=c.getBoundingClientRect();
              const x=e.clientX-r.left,y=e.clientY-r.top;
              const last=wbLastPt.current;if(!last)return;
              const ctx=c.getContext("2d");
              ctx.beginPath();
              ctx.strokeStyle=wbT===5?"#ffffff":wbColor;
              ctx.lineWidth=wbT===5?20:2;
              ctx.lineCap="round";ctx.lineJoin="round";
              ctx.moveTo(last.x,last.y);ctx.lineTo(x,y);ctx.stroke();
              wbLastPt.current={x,y};
              wbCurPts.current.push({x,y});
            }}
            onMouseUp={()=>{
              if(!wbDrawingRef.current)return;
              wbDrawingRef.current=false;
              const pts=wbCurPts.current||[];
              if(pts.length>1)setWbStrokes(s=>[...s,{pts,color:wbT===5?"#ffffff":wbColor,width:wbT===5?20:2}]);
              wbLastPt.current=null;wbCurPts.current=[];
            }}
            onMouseLeave={()=>{
              if(!wbDrawingRef.current)return;
              wbDrawingRef.current=false;
              const pts=wbCurPts.current||[];
              if(pts.length>1)setWbStrokes(s=>[...s,{pts,color:wbT===5?"#ffffff":wbColor,width:wbT===5?20:2}]);
              wbLastPt.current=null;wbCurPts.current=[];
            }}
          />
          {/* Dot grid */}
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(#e8e8e8 1px, transparent 1px)",backgroundSize:"20px 20px",pointerEvents:"none"}}/>
          {/* Sticky notes */}
          <div style={{position:"absolute",top:30,left:40,width:140,height:100,borderRadius:8,background:"#FEF3C7",padding:10,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transform:"rotate(-1.5deg)",pointerEvents:"none"}}>
            <div style={{fontSize:10,fontWeight:600,color:"#92400E"}}>User Research</div>
            <div style={{fontSize:9,color:"#b45309",marginTop:3,lineHeight:1.4}}>Interview 5 users about onboarding</div>
          </div>
          <div style={{position:"absolute",top:20,left:210,width:140,height:100,borderRadius:8,background:"#DBEAFE",padding:10,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",transform:"rotate(0.5deg)",pointerEvents:"none"}}>
            <div style={{fontSize:10,fontWeight:600,color:"#1e40af"}}>API Refactor</div>
            <div style={{fontSize:9,color:"#2563eb",marginTop:3,lineHeight:1.4}}>Migrate auth to v3 schema</div>
          </div>
          <div style={{position:"absolute",top:40,left:380,width:150,height:110,borderRadius:3,background:"#D1FAE5",padding:10,boxShadow:"0 1px 4px rgba(0,0,0,0.08)",transform:"rotate(-0.5deg)",pointerEvents:"none"}}>
            <div style={{fontSize:10.5,fontWeight:600,color:"#065f46"}}>Sprint Goal</div>
            <div style={{fontSize:9.5,color:"#047857",marginTop:4,lineHeight:1.4}}>Ship collab beta by Friday</div>
          </div>
        </div>
      </div>
    </div>)}
        {/* ── Chat notification toast (grid/speaker only) ── */}
        {view!=="space"&&chatNotif&&(
          <div style={{position:"absolute",bottom:16,right:16,zIndex:30,
            background:isDark?"rgba(30,30,44,0.95)":"rgba(255,255,255,0.97)",
            backdropFilter:"blur(12px)",borderRadius:10,padding:"10px 14px",
            boxShadow:"0 4px 24px rgba(0,0,0,0.18)",border:`1px solid ${bd}`,
            display:"flex",alignItems:"center",gap:10,maxWidth:280,
            animation:"panelSlideIn 0.25s ease",cursor:"pointer"}}
            onClick={()=>{setSide("chat");setChatNotif(null);}}>
            <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
              background:`hsl(${(P.find(p=>p.name===chatNotif.name)||P[1]).hue},38%,22%)`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,fontWeight:600,color:"#fff"}}>
              {(chatNotif.name||"?").split(" ").map(w=>w[0]).join("").slice(0,2)}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,fontWeight:600,color:isDark?"#ddd":"#333",marginBottom:1}}>{chatNotif.name}</div>
              <div style={{fontSize:11,color:isDark?"#999":"#666",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{chatNotif.preview}</div>
            </div>
            <MessageSquare size={13} color="#8b5cf6"/>
          </div>
        )}
        </div>

{(view==="space"||side)&&<div onClick={e=>e.stopPropagation()} style={{
  width:300,
  display:"flex",flexDirection:"column",
  ...(view==="space"?{
    position:"absolute",right:0,top:0,bottom:0,zIndex:20,
    background:"rgba(4,6,18,0.45)",
    backdropFilter:"blur(20px)",
    WebkitBackdropFilter:"blur(20px)",
    borderLeft:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"12px 0 0 12px",
    boxShadow:"-8px 0 40px rgba(0,0,0,0.5)",
    transform:side?"translateX(0)":"translateX(100%)",
    opacity:side?1:0,
    pointerEvents:side?"auto":"none",
    transition:"transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
  }:{
    background:sf,
    borderLeft:`1px solid ${bd}`,
  })
}}>
          <div style={{display:"flex",padding:"10px 12px",gap:4,borderBottom:view==="space"?"1px solid rgba(255,255,255,0.07)":`1px solid ${bd}`,flexShrink:0}}>
            {[{id:"chat",l:"Chat"},{id:"people",l:"People"},{id:"rooms",l:"Rooms"}].map(t=><button key={t.id} onClick={()=>setSide(t.id)} style={{padding:"6px 0",borderRadius:6,border:"none",cursor:"pointer",fontSize:10.5,fontWeight:side===t.id?600:400,fontFamily:F,background:side===t.id?(view==="space"?"rgba(139,92,246,0.25)":"#014592"):"transparent",color:side===t.id?"#fff":view==="space"?"rgba(255,255,255,0.35)":"#666",flex:1,transition:"all 0.15s",border:side===t.id&&view==="space"?"1px solid rgba(139,92,246,0.3)":"1px solid transparent"}}>{t.l}</button>)}
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"10px 12px"}}>
            {side==="people"&&activeP.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 2px",borderBottom:view==="space"?"1px solid rgba(255,255,255,0.05)":`1px solid ${bd}`}}><Av initials={p.initials} hue={p.hue} size={26}/><div style={{flex:1}}><span style={{fontSize:12,color:"#ddd",fontWeight:i===0?600:400}}>{p.name==="You"?"Setyana (You)":p.name}</span>{i===0&&<span style={{fontSize:10,color:"#c9a227",marginLeft:6}}>Host</span>}</div>{(i===0?mt:p.muted)&&<MicOff size={12} color="#f87171"/>}{p.sp&&<Volume2 size={12} color="rgba(255,255,255,0.6)"/>}</div>)}
            {side==="chat"&&<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
              <div style={{flex:1,overflowY:"auto"}}>{!isLive&&chatMsgs.filter(c=>c.w==="You").length===0?<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:6}}><MessageSquare size={20} color="#444"/><span style={{fontSize:12,color:"#666"}}>No one else is here yet</span></div>:(isLive?chatMsgs:chatMsgs.filter(c=>c.w==="You")).map((c,i)=>c.poll?(
                <div key={i} style={{marginBottom:10,background:"rgba(139,92,246,0.08)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:8,padding:"8px 10px"}}>
                  <div style={{fontSize:11,marginBottom:4}}><span style={{color:"#ddd",fontWeight:600}}>{c.w}</span><span style={{color:"#555",marginLeft:6}}>{c.t}</span><span style={{marginLeft:6,fontSize:9.5,color:"#8b5cf6",background:"rgba(139,92,246,0.15)",padding:"1px 5px",borderRadius:3}}>poll</span></div>
                  <div style={{fontSize:12,color:"#ddd",fontWeight:500,marginBottom:6}}>{c.m}</div>
                  {c.opts.map((opt,oi)=>{
                    const total=Object.values(c.votes||{}).reduce((a,b)=>a+b,0);
                    const v=c.votes?.[oi]||0;
                    const pct=total?Math.round(v/total*100):0;
                    return(<div key={oi} onClick={()=>{setChatMsgs(ms=>ms.map((msg,mi)=>mi===i?{...msg,votes:{...msg.votes,[oi]:(msg.votes?.[oi]||0)+1}}:msg));}}
                      style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,cursor:"pointer"}}>
                      <div style={{flex:1,background:"rgba(255,255,255,0.05)",borderRadius:4,height:22,position:"relative",overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)"}}>
                        <div style={{position:"absolute",inset:0,width:`${pct}%`,background:"rgba(139,92,246,0.25)",transition:"width 0.3s"}}/>
                        <span style={{position:"relative",padding:"0 8px",fontSize:11,color:"#ccc",lineHeight:"22px"}}>{opt}</span>
                      </div>
                      <span style={{fontSize:10,color:"#666",width:28,textAlign:"right"}}>{pct}%</span>
                    </div>);
                  })}
                </div>
              ):(
                <div key={i} style={{marginBottom:8,padding:view==="space"?"8px 10px":0,background:view==="space"?"rgba(255,255,255,0.04)":"transparent",borderRadius:view==="space"?8:0,border:view==="space"?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <div style={{fontSize:11,marginBottom:2}}><span style={{color:view==="space"?"rgba(255,255,255,0.85)":"#ddd",fontWeight:600}}>{c.w}</span><span style={{color:view==="space"?"rgba(255,255,255,0.25)":"#555",marginLeft:6}}>{c.t}</span></div>
                  {c.file?(
                    <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",background:el,borderRadius:6,border:`1px solid ${bd}`,cursor:"pointer"}}>
                      <Paperclip size={11} color="#4a90d9"/>
                      <span style={{fontSize:11,color:"#4a90d9",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.fname}</span>
                      <span style={{fontSize:10,color:"#555"}}>{c.fsize?(c.fsize/1024).toFixed(1)+"KB":""}</span>
                    </div>
                  ):(
                    <div style={{fontSize:12,color:view==="space"?"rgba(255,255,255,0.65)":"#999",lineHeight:1.5}}>{c.m}</div>
                  )}
                </div>
              ))}</div>
              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" style={{display:"none"}} onChange={e=>{
                const f=e.target.files?.[0];if(!f)return;
                setChatMsgs(m=>[...m,{w:"You",m:`📎 ${f.name}`,t:"Now",file:true,fname:f.name,fsize:f.size}]);
                setShowAttachMenu(false);toast("📎 File attached");e.target.value="";
              }}/>
              {/* Emoji picker */}
              {showEmojiPicker&&<div style={{background:sf,borderRadius:10,padding:"8px",marginBottom:4,border:`1px solid ${bd}`,display:"flex",flexWrap:"wrap",gap:2}}>
                {["😀","😂","😍","🥺","😎","🤔","😅","🙏","👏","🔥","❤️","💯","✅","👍","👎","🎉","😭","🤯","💀","🫡","😤","🥳","😴","🤝","💪","👀","🫶","⚡","💬","📌"].map(em=>(
                  <button key={em} onClick={()=>{setChatIn(c=>c+em);setShowEmojiPicker(false);}} style={{width:28,height:28,borderRadius:5,border:"none",background:"transparent",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={e=>e.currentTarget.style.background=el} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{em}</button>
                ))}
              </div>}
              {/* Poll creation form — fully custom options */}
              {showPollForm&&<div style={{background:el,borderRadius:8,padding:"10px",marginBottom:4,border:`1px solid ${bd}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <span style={{fontSize:11,color:"#aaa",fontWeight:600}}>📊 Create poll</span>
                  <button onClick={()=>{setShowPollForm(false);setPollQ("");setPollOpts(["",""]);}} style={{width:18,height:18,borderRadius:4,border:"none",background:"transparent",color:"#555",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={11}/></button>
                </div>
                {/* Question */}
                <input value={pollQ} onChange={e=>setPollQ(e.target.value)}
                  placeholder="Ask a question…"
                  style={{width:"100%",padding:"6px 8px",borderRadius:5,background:"#1d1d28",border:`1px solid ${bd}`,color:"#ddd",fontSize:11,outline:"none",fontFamily:F,boxSizing:"border-box",marginBottom:6}}/>
                {/* Custom options */}
                {pollOpts.map((opt,oi)=>(
                  <div key={oi} style={{display:"flex",gap:4,marginBottom:4,alignItems:"center"}}>
                    <span style={{fontSize:10,color:"#555",minWidth:18,textAlign:"right"}}>{String.fromCharCode(65+oi)}</span>
                    <input value={opt} onChange={e=>setPollOpts(o=>o.map((v,i)=>i===oi?e.target.value:v))}
                      placeholder={`Option ${String.fromCharCode(65+oi)}…`}
                      style={{flex:1,padding:"5px 8px",borderRadius:5,background:"#1d1d28",border:`1px solid ${bd}`,color:"#ddd",fontSize:11,outline:"none",fontFamily:F}}/>
                    {pollOpts.length>2&&<button onClick={()=>setPollOpts(o=>o.filter((_,i)=>i!==oi))} style={{width:18,height:18,borderRadius:4,border:"none",background:"transparent",color:"#555",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={10}/></button>}
                  </div>
                ))}
                {pollOpts.length<6&&<button onClick={()=>setPollOpts(o=>[...o,""])} style={{width:"100%",padding:"4px 0",borderRadius:5,border:`1px dashed ${bd}`,background:"transparent",color:"#555",fontSize:10,cursor:"pointer",fontFamily:F,marginBottom:6}}>+ Add option</button>}
                <button onClick={()=>{
                  if(!pollQ.trim()){toast("Add a question first");return;}
                  const filled=pollOpts.filter(o=>o.trim());
                  if(filled.length<2){toast("Add at least 2 options");return;}
                  setChatMsgs(m=>[...m,{w:"You",m:pollQ,t:"Now",poll:true,opts:filled,votes:{}}]);
                  setShowPollForm(false);setPollQ("");setPollOpts(["",""]);toast("📊 Poll sent!");
                }} style={{width:"100%",padding:"5px 0",borderRadius:5,border:"none",background:"#014592",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:F}}>Send poll</button>
              </div>}
              {/* + attach menu */}
              {showAttachMenu&&<div style={{background:sf,borderRadius:9,padding:"4px",marginBottom:4,border:`1px solid ${bd}`,display:"flex",flexDirection:"column",gap:1}}>
                {[
                  {icon:Paperclip,label:"File",  act:()=>{fileInputRef.current?.click();}},
                  {icon:Smile,    label:"Emoji",  act:()=>{setShowEmojiPicker(v=>!v);setShowAttachMenu(false);}},
                  {icon:BarChart2,label:"Poll",   act:()=>{setShowPollForm(v=>!v);setShowAttachMenu(false);}},
                ].map((item,i)=>(
                  <button key={i} onClick={item.act} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:6,border:"none",background:"transparent",color:"#bbb",cursor:"pointer",fontSize:12,fontFamily:F,textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background=el} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <item.icon size={13} color="#666"/>{item.label}
                  </button>
                ))}
              </div>}
              {/* Chat input row */}
              <div style={{display:"flex",gap:4,marginTop:4,alignItems:"center",paddingTop:view==="space"?6:0,borderTop:view==="space"?"1px solid rgba(255,255,255,0.06)":"none"}}>
                <button onClick={()=>{setShowAttachMenu(v=>!v);setShowPollForm(false);setShowEmojiPicker(false);}}
                  style={{width:30,height:30,borderRadius:7,border:`1px solid ${showAttachMenu?"#014592":bd}`,background:showAttachMenu?"rgba(1,69,146,0.2)":"transparent",color:showAttachMenu?"#4a90d9":"#555",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16,fontWeight:300}}>+</button>
                <input value={chatIn} onChange={e=>{setChatIn(e.target.value);setSpaceTyping(true);if(spaceTypingTimer.current)clearTimeout(spaceTypingTimer.current);spaceTypingTimer.current=setTimeout(()=>setSpaceTyping(false),2500);}} onKeyDown={e=>{if(e.key==="Enter")sendChat()}} placeholder="Message..." style={{flex:1,padding:"7px 10px",borderRadius:6,background:view==="space"?"rgba(255,255,255,0.06)":el,border:view==="space"?"1px solid rgba(255,255,255,0.1)":`1px solid ${bd}`,color:"#ddd",fontSize:12,outline:"none",fontFamily:F}}/>
                <button onClick={sendChat} style={{width:30,height:30,borderRadius:6,border:"none",background:"#014592",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Send size={12}/></button>
              </div>
            </div>}
            {side==="rooms"&&<>
              {!isLive?(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:6,paddingTop:40}}>
                  <Layout size={20} color="#444"/>
                  <span style={{fontSize:12,color:"#666"}}>No participants to assign</span>
                  <span style={{fontSize:11,color:"#555"}}>Breakout rooms are available when others join</span>
                </div>
              ):(<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:600,color:"#ddd"}}>Breakout Rooms</span><button style={{padding:"4px 10px",borderRadius:4,border:"none",background:"#014592",color:"#fff",fontSize:10.5,cursor:"pointer",fontFamily:F}}>+ Add</button></div>
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                <div style={{flex:1,padding:"7px 9px",background:cd,borderRadius:5,border:`1px solid ${bd}`,display:"flex",alignItems:"center",gap:5}}><Clock size={11} color="#777"/><select style={{background:"transparent",border:"none",color:"#ccc",fontSize:11,fontFamily:F,outline:"none",flex:1}}><option>15 min</option><option>30 min</option><option>45 min</option></select></div>
              </div>
              {rooms.map((r,ri)=><div key={ri} onDragOver={e=>{e.preventDefault();setDragOver(ri)}} onDrop={e=>{e.preventDefault();if(dragPerson)movePerson(dragPerson,ri);setDragPerson(null);setDragOver(null)}} style={{background:dragOver===ri?`hsl(${r.hue},20%,18%)`:cd,borderRadius:7,marginBottom:8,overflow:"hidden",border:dragOver===ri?`1px solid hsl(${r.hue},50%,40%)`:`1px solid ${bd}`,transition:"background 0.15s,border 0.15s"}}>
                <div style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:8,borderBottom:`1px solid ${bd}`}}>
                  <div style={{width:4,height:18,borderRadius:2,background:`hsl(${r.hue},50%,55%)`,flexShrink:0}}/><span style={{fontSize:11.5,fontWeight:600,color:"#ddd",flex:1}}>{r.name}</span>
                  <div style={{display:"flex",alignItems:"center",gap:3}}><div style={{width:32,height:3,borderRadius:2,background:el,overflow:"hidden"}}><div style={{width:`${(r.ppl.length/5)*100}%`,height:"100%",borderRadius:2,background:`hsl(${r.hue},40%,55%)`}}/></div><span style={{fontSize:9.5,color:"#666"}}>{r.ppl.length}/5</span></div>
                </div>
                <div style={{padding:"5px 6px"}}>{r.ppl.map((name,pi)=><div key={pi} draggable onDragStart={()=>setDragPerson(name)} onDragEnd={()=>{setDragPerson(null);setDragOver(null)}} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 6px",borderRadius:4,marginBottom:2,background:dragPerson===name?"rgba(1,69,146,0.3)":el,cursor:"grab",opacity:dragPerson===name?0.5:1,transition:"background 0.1s"}}><Av initials={name.split(" ").map(n=>n[0]).join("")} hue={nameHue(name)} size={20}/><span style={{fontSize:11,color:"#ccc",flex:1}}>{name}{name==="Setyana"?" (You)":""}</span><Move size={9} color="#555"/></div>)}
                  <div onDragOver={e=>e.preventDefault()} style={{padding:"6px",borderRadius:4,border:`1px dashed ${dragOver===ri?"hsl("+r.hue+",50%,50%)":"rgba(255,255,255,0.08)"}`,textAlign:"center",fontSize:10,color:dragOver===ri?`hsl(${r.hue},50%,60%)`:"#555",marginTop:2,transition:"border 0.15s,color 0.15s"}}>{dragOver===ri?"Release to drop":"Drop here"}</div>
                </div>
              </div>)}
              <div style={{display:"flex",gap:6,marginTop:4}}>
                <button onClick={()=>toast("Auto-assigned participants")} style={{flex:1,padding:"8px 0",borderRadius:6,border:`1px solid ${bd}`,background:"transparent",color:"#999",fontSize:11.5,cursor:"pointer",fontFamily:F}}>Auto-assign</button>
                <button onClick={()=>toast("Rooms opened")} style={{flex:1,padding:"8px 0",borderRadius:6,border:"none",background:"#22863a",color:"#fff",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:F}}>Open rooms</button>
              </div>
              </>)}
            </>}
          </div>
        </div>}
      </div>
      {/* ── BOTTOM CONTROL BAR ── */}
      <div style={{height:60,background:sf,borderTop:`1px solid ${bd}`,display:"flex",alignItems:"center",justifyContent:"center",gap:4,flexShrink:0,zIndex:10}}>
        <B icon={mt?MicOff:Mic}   on={false} danger={mt}  onClick={()=>{setMt(!mt);toast(mt?"Mic on":"Mic off")}} title="Mute (M)"/>
        <B icon={vid?Video:VideoOff} on={false} danger={!vid} onClick={()=>{setVid(!vid);toast(vid?"Camera off":"Camera on")}} title="Camera (V)"/>
        <B icon={Monitor} on={isPresenting} onClick={()=>setShowShare(v=>!v)} title="Share screen (S)"/>
        <div style={{width:1,height:20,background:bd,margin:"0 3px"}}/>
        <B icon={Disc} on={rec} danger={rec} onClick={()=>{setRec(!rec);toast(rec?"Recording stopped":"Recording started")}} title="Record (R)"/>
        <div style={{position:"relative"}}>
          <B icon={Smile} onClick={()=>setShowRxn(!showRxn)} title="React"/>
          {showRxn&&<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:6,background:isDark?"#1a1a2e":"#fff",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",padding:"6px 8px",display:"flex",gap:2,zIndex:20}}>
            {["👍","👏","❤️","😂","🎉","🤔"].map(e=><button key={e} onClick={()=>{setRxn(e);setShowRxn(false);toast(`Reacted ${e}`)}} style={{width:32,height:32,borderRadius:6,border:"none",cursor:"pointer",background:"transparent",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}} onMouseEnter={ev=>ev.currentTarget.style.background="#f5f5f5"} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>{e}</button>)}
          </div>}
        </div>
        <B icon={Hand} on={hand} onClick={()=>{setHand(!hand);toast(hand?"Hand lowered":"Hand raised")}} title="Raise hand (H)"/>
        <div style={{position:"relative"}}>
          <B icon={MoreHorizontal} on={showMore} onClick={()=>setShowMore(!showMore)} title="More"/>
          {showMore&&<div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",marginBottom:6,background:isDark?"#1a1a2e":"#fff",borderRadius:8,boxShadow:"0 4px 20px rgba(0,0,0,0.15)",padding:4,width:180,zIndex:20}}>
            {[
              {l:"Whiteboard", i:Presentation, act:()=>{setWb(!wb);setShowMore(false);toast(wb?"Whiteboard closed":"Whiteboard opened");}},
              {l:"Noise cancel", i:Volume2,     act:()=>{toast("Noise cancellation on");setShowMore(false);}},
              {l:"Blur background",i:Camera,    act:()=>{toast("Background blur on");setShowMore(false);}},
              {l:"Settings",     i:Settings,    act:()=>{onNav("settings");setShowMore(false);}},
            ].map((item,i)=><button key={i} onClick={item.act} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"8px 12px",border:"none",background:"transparent",cursor:"pointer",fontSize:12,color:isDark?"#ccc":"#333",borderRadius:5,textAlign:"left"}} onMouseEnter={ev=>ev.currentTarget.style.background=isDark?"#252540":"#f5f5f5"} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
              <item.i size={14}/>{item.l}
            </button>)}
          </div>}
        </div>
        <div style={{width:1,height:20,background:bd,margin:"0 3px"}}/>
        <B icon={MessageSquare} on={side==="chat"} onClick={()=>setSide(side==="chat"?"":"chat")} title="Chat (C)"/>
        <div style={{width:1,height:20,background:bd,margin:"0 3px"}}/>
        <button onClick={()=>setShowLeave(true)} style={{height:40,padding:"0 18px",borderRadius:12,border:"none",cursor:"pointer",background:"#d1242f",color:"#fff",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6,fontFamily:F}}>
          <Phone size={14}/>Leave
        </button>
      </div>
      {showLeave&&<><div onClick={()=>setShowLeave(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:99}}/><div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#fff",borderRadius:14,padding:"28px 28px 24px",width:340,zIndex:100,boxShadow:"0 20px 60px rgba(0,0,0,0.18)",textAlign:"center"}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Phone size={20} color="#d1242f"/></div>
        <div style={{fontSize:17,fontWeight:700,color:"#111",marginBottom:6}}>Leave meeting?</div>
        <p style={{fontSize:13,color:"#888",margin:"0 0 22px",lineHeight:1.5}}>You're the host. Choose whether to leave alone or end the meeting for everyone.</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={()=>{setShowLeave(false);if(meetStream)meetStream.getTracks().forEach(t=>t.stop());setMeetStream(null);setJoined(false);setSelMeeting(null);setElapsed(0);toast("You left the meeting")}} style={{width:"100%",padding:"10px 0",borderRadius:8,border:"none",background:"#d1242f",color:"#fff",fontSize:13,fontWeight:600,fontFamily:F,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}><Phone size={13}/>Leave Meeting</button>
          <button onClick={()=>{setShowLeave(false);if(meetStream)meetStream.getTracks().forEach(t=>t.stop());setMeetStream(null);setJoined(false);setSelMeeting(null);setElapsed(0);toast("Meeting ended for everyone")}} style={{width:"100%",padding:"10px 0",borderRadius:8,border:"none",background:"#111",color:"#fff",fontSize:13,fontWeight:600,fontFamily:F,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}><X size={13}/>End for Everyone</button>
          <button onClick={()=>setShowLeave(false)} style={{width:"100%",padding:"9px 0",borderRadius:8,border:"1px solid #e5e5e5",background:"#fff",color:"#666",fontSize:13,fontFamily:F,cursor:"pointer"}}>Stay</button>
        </div>
      </div></>}
    </div>
  );
}

// ─── History / Replay ───
function ReplayScreen({initialId,onBack}){
  const [sel,setSel]=useState(initialId);
  const [ch,setCh]=useState(0);
  useEffect(()=>{setSel(initialId);setCh(0)},[initialId]);
  const history=[
    {id:0,t:"Q2 Strategy Session",d:"Jun 20",time:"2:00 PM",dur:"1h 23m",n:14,eng:87,part:92,actions:7,
      summary:"Revenue tracked 12% above Q1 forecast. The v3.2 launch moves to July 15 with two additional engineers on mobile. Seven action items assigned.",
      chapters:[{time:"0:00",label:"Opening & Agenda",dur:"2:15"},{time:"2:15",label:"Q1 Performance Review",dur:"12:30"},{time:"14:45",label:"Product Updates",dur:"18:20"},{time:"33:05",label:"Open Discussion",dur:"15:40"},{time:"48:45",label:"Action Items",dur:"8:10"},{time:"56:55",label:"Closing",dur:"4:05"}],
      files:[{name:"Q2_Report.pdf",by:"Maria"},{name:"Roadmap_v3.xlsx",by:"David"},{name:"Wireframes.png",by:"Sarah"}]},
    {id:1,t:"Product Roadmap Review",d:"Jun 19",time:"10:00 AM",dur:"52m",n:9,eng:72,part:78,actions:4,
      summary:"Reviewed the product roadmap for Q3. Decided to prioritize the mobile SDK rewrite over the dashboard redesign. Four action items around timeline estimation.",
      chapters:[{time:"0:00",label:"Welcome",dur:"1:30"},{time:"1:30",label:"Q3 Priorities",dur:"15:00"},{time:"16:30",label:"Mobile SDK Discussion",dur:"20:00"},{time:"36:30",label:"Wrap-up",dur:"15:30"}],
      files:[{name:"Roadmap_Q3.pdf",by:"Sarah"},{name:"SDK_Estimates.xlsx",by:"David"}]},
    {id:2,t:"Team Standup",d:"Jun 19",time:"9:00 AM",dur:"18m",n:6,eng:95,part:100,actions:2,
      summary:"Quick sync on sprint progress. All tasks on track. Two blockers flagged and assigned owners.",
      chapters:[{time:"0:00",label:"Check-ins",dur:"8:00"},{time:"8:00",label:"Blockers",dur:"7:00"},{time:"15:00",label:"Plan for Today",dur:"3:00"}],
      files:[]},
    {id:3,t:"Client Onboarding — Meridian",d:"Jun 18",time:"3:00 PM",dur:"1h 05m",n:11,eng:68,part:64,actions:5,
      summary:"Walked Meridian through platform setup and integration options. Five follow-ups assigned.",
      chapters:[{time:"0:00",label:"Introductions",dur:"5:00"},{time:"5:00",label:"Platform Overview",dur:"20:00"},{time:"25:00",label:"Integration Options",dur:"18:00"},{time:"43:00",label:"Q&A",dur:"15:00"},{time:"58:00",label:"Next Steps",dur:"7:00"}],
      files:[{name:"Meridian_Proposal.pdf",by:"Setyana"},{name:"Integration_Guide.pdf",by:"David"},{name:"Case_Studies.pdf",by:"Maria"}]},
    {id:4,t:"Design System Sync",d:"Jun 17",time:"11:00 AM",dur:"35m",n:5,eng:82,part:80,actions:3,
      summary:"Reviewed new component library updates. Agreed on token naming convention. Three follow-ups assigned.",
      chapters:[{time:"0:00",label:"Component Updates",dur:"12:00"},{time:"12:00",label:"Token Naming",dur:"13:00"},{time:"25:00",label:"Action Items",dur:"10:00"}],
      files:[{name:"Component_Changelog.md",by:"Sarah"}]},
    {id:5,t:"Weekly All-Hands",d:"Jun 16",time:"10:00 AM",dur:"45m",n:42,eng:54,part:38,actions:0,
      summary:"Company-wide update. CEO shared Q2 results and hiring plans. Informational only.",
      chapters:[{time:"0:00",label:"CEO Update",dur:"15:00"},{time:"15:00",label:"Q2 Results",dur:"10:00"},{time:"25:00",label:"Engineering Update",dur:"12:00"},{time:"37:00",label:"Q&A",dur:"8:00"}],
      files:[]},
  ];
  const m=sel!==null?history.find(h=>h.id===sel):null;
  const grouped={};history.forEach(h=>{if(!grouped[h.d])grouped[h.d]=[];grouped[h.d].push(h)});

  if(!m) return(
    <div style={{padding:"32px 36px",overflowY:"auto",height:"100vh",fontFamily:F}}>
      <h1 style={{fontSize:18,fontWeight:700,color:"#111",margin:"0 0 24px"}}>Meeting History</h1>
      {Object.entries(grouped).map(([date,items])=>(
        <div key={date} style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>{date}</div>
          {items.map(h=>(
            <div key={h.id} onClick={()=>{setSel(h.id);setCh(0)}} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",borderRadius:6,cursor:"pointer",marginBottom:2,background:"transparent"}} onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:40,textAlign:"right",flexShrink:0}}><span style={{fontFamily:M,fontSize:12,color:"#999"}}>{h.time.replace(" AM","a").replace(" PM","p")}</span></div>
              <div style={{width:3,height:28,borderRadius:2,background:h.eng>=80?"#22863a":h.eng>=60?"#e5c44b":"#e09090",flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13.5,fontWeight:500,color:"#111"}}>{h.t}</div>
                <div style={{fontSize:12,color:"#aaa",marginTop:1}}>{h.dur} · {h.n} people · {h.chapters.length} chapters{h.actions>0?` · ${h.actions} actions`:""}</div>
              </div>
              <span style={{fontSize:13,fontWeight:600,color:h.eng>=80?"#22863a":h.eng>=60?"#b08800":"#d1242f",flexShrink:0}}>{h.eng}%</span>
              <ChevronRight size={14} color="#ddd"/>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  return(
    <div style={{padding:"32px 36px",overflowY:"auto",height:"100vh",fontFamily:F}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
        <button onClick={()=>{setSel(null);if(onBack)onBack()}} style={{width:28,height:28,borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#999"}}><ChevronLeft size={14}/></button>
        <div style={{flex:1}}><h1 style={{fontSize:18,fontWeight:700,color:"#111",margin:0}}>{m.t}</h1><p style={{fontSize:12,color:"#999",margin:"2px 0 0"}}>{m.d} at {m.time} · {m.dur} · {m.n} people</p></div>
        <button style={{padding:"6px 12px",borderRadius:6,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer",fontFamily:F,display:"flex",alignItems:"center",gap:4}}><Download size={12}/>Export</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
        <div>
          <div style={{background:"#111",borderRadius:10,aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
            <div style={{width:52,height:52,borderRadius:26,background:"rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Play size={20} color="#fff" fill="#fff"/></div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"20px 14px 10px",background:"linear-gradient(transparent,rgba(0,0,0,0.8))"}}>
              <div style={{height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,marginBottom:6,position:"relative"}}>
                <div style={{height:"100%",width:"35%",background:"#014592",borderRadius:2}}/>
                {m.chapters.map((c,i)=>{const pct=(i/m.chapters.length)*100;return <div key={i} style={{position:"absolute",top:-1,left:`${pct}%`,width:2,height:6,background:"#22863a",borderRadius:1}}/>})}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><SkipBack size={14} color="#fff"/><Play size={16} color="#fff" fill="#fff"/><SkipForward size={14} color="#fff"/><span style={{fontSize:11,color:"#999",fontFamily:M}}>29:12 / {m.dur}</span></div><Maximize2 size={12} color="#999"/></div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:14}}>
            {[{l:"Duration",v:m.dur},{l:"Engagement",v:m.eng+"%"},{l:"Participation",v:m.part+"%"},{l:"Action items",v:String(m.actions)}].map((s,i)=><div key={i} style={{padding:"12px 14px",background:"#fafafa",borderRadius:6}}><div style={{fontSize:18,fontWeight:700,color:"#111"}}>{s.v}</div><div style={{fontSize:11,color:"#aaa",marginTop:2}}>{s.l}</div></div>)}
          </div>
          <div style={{marginTop:14,padding:"14px 16px",background:"#fafafa",borderRadius:6}}><div style={{fontSize:12,fontWeight:600,color:"#111",marginBottom:6}}>Summary</div><p style={{fontSize:12.5,color:"#555",margin:0,lineHeight:1.6}}>{m.summary}</p></div>
        </div>
        <div>
          <div style={{marginBottom:16}}><div style={{fontSize:12,fontWeight:600,color:"#111",marginBottom:8}}>Chapters</div>
            {m.chapters.map((c,i)=><button key={i} onClick={()=>setCh(i)} style={{width:"100%",display:"flex",alignItems:"baseline",gap:8,padding:"8px 10px",border:"none",cursor:"pointer",background:ch===i?"#f0f4ff":"transparent",borderRadius:5,textAlign:"left",marginBottom:1,fontFamily:F}}><span style={{fontFamily:M,fontSize:11,color:"#014592",minWidth:32}}>{c.time}</span><div><div style={{fontSize:12,color:"#111",fontWeight:ch===i?600:400}}>{c.label}</div><div style={{fontSize:10.5,color:"#aaa"}}>{c.dur}</div></div></button>)}
          </div>
          {m.files.length>0&&<div><div style={{fontSize:12,fontWeight:600,color:"#111",marginBottom:8}}>Files</div>
            {m.files.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<m.files.length-1?"1px solid #f0f0f0":"none"}}><FileText size={14} color="#999"/><div style={{flex:1}}><div style={{fontSize:12,color:"#111"}}>{f.name}</div><div style={{fontSize:10.5,color:"#aaa"}}>{f.by}</div></div><Download size={12} color="#aaa" style={{cursor:"pointer"}}/></div>)}
          </div>}
          {m.files.length===0&&<div style={{padding:"20px 0",textAlign:"center"}}><FileText size={20} color="#ddd"/><div style={{fontSize:12,color:"#bbb",marginTop:6}}>No files shared</div></div>}
        </div>
      </div>
    </div>
  );
}

// ─── Chat ───
function ChatScreen(){
  const [active,setActive]=useState(0);
  const contacts=[{name:"Sarah Chen",hue:270,on:true,last:"Sure, I'll send the designs over",t:"10:42",unread:2},{name:"David Kim",hue:190,on:true,last:"API migration is on track",t:"10:15",unread:0},{name:"Sprint Planning",hue:215,on:true,last:"Tom: See you all at 10!",t:"9:50",unread:5,group:true},{name:"Sprint Planning (Jun 20)",hue:215,on:false,last:"Maria: Q2 report attached",t:"Jun 20",unread:0,group:true,mtg:true},{name:"Maria Garcia",hue:330,on:false,last:"Thanks for the feedback!",t:"Yesterday",unread:0},{name:"Design Team",hue:260,on:true,last:"Sarah: Components ready",t:"Yesterday",unread:0,group:true}];
  const [msgs,setMsgs]=useState([{s:false,m:"Hey! Finished the wireframes",t:"Today, 10:20 AM"},{s:true,m:"Can you share them in the design channel?",t:"Today, 10:22 AM",r:true},{s:false,m:"Already done. Updated the component library too",t:"Today, 10:25 AM"},{s:true,m:"Perfect — review in the design sync today",t:"Today, 10:30 AM",r:true},{s:false,m:"Sure, I'll send the designs over",t:"Today, 10:42 AM"}]);
  const [inp,setInp]=useState("");
  const ct=contacts[active];
  const send=()=>{if(!inp.trim())return;const id=Date.now();setMsgs(m=>[...m,{s:true,m:inp,t:"Now",r:false,id}]);setInp("");setTimeout(()=>setMsgs(m=>m.map(x=>x.id===id?{...x,r:true}:x)),1500)};
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:F}}>
      <div style={{width:280,borderRight:"1px solid #eee",display:"flex",flexDirection:"column",background:"#fff"}}>
        <div style={{padding:"18px 14px 10px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:16,fontWeight:700,color:"#111"}}>Chat</span><button style={{width:26,height:26,borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#777"}}><Plus size={13}/></button></div>
          <div style={{position:"relative"}}><Search size={13} color="#aaa" style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)"}}/><input placeholder="Search..." style={{width:"100%",padding:"7px 10px 7px 28px",borderRadius:6,background:"#f5f5f5",border:"none",fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:F,color:"#111"}}/></div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>{contacts.map((c,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"10px 14px",border:"none",cursor:"pointer",textAlign:"left",background:active===i?"#f5f5f5":"transparent",fontFamily:F}}>
            <div style={{position:"relative"}}><Av initials={c.name.split(" ").map(n=>n[0]).join("").slice(0,2)} hue={c.hue} size={32}/>{c.mtg&&<Video size={9} color="#014592" style={{position:"absolute",bottom:-1,right:-1,background:"#fff",borderRadius:3,padding:1}}/>}</div>
            <div style={{flex:1,overflow:"hidden"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12.5,fontWeight:c.unread?600:400,color:"#111"}}>{c.name}</span><span style={{fontSize:10,color:c.unread?"#014592":"#aaa",flexShrink:0}}>{c.t}</span></div><div style={{fontSize:11.5,color:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:1}}>{c.last}</div></div>
            {c.unread>0&&<div style={{minWidth:16,height:16,borderRadius:8,background:"#014592",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#fff",flexShrink:0}}>{c.unread}</div>}
          </button>
        ))}</div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",background:"#fafafa"}}>
        <div style={{height:50,background:"#fff",borderBottom:"1px solid #eee",display:"flex",alignItems:"center",padding:"0 18px",gap:10,flexShrink:0}}>
          <Av initials={ct.name.split(" ").map(n=>n[0]).join("").slice(0,2)} hue={ct.hue} size={30}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#111"}}>{ct.name}</div><div style={{fontSize:10.5,color:ct.on?"#22863a":"#aaa"}}>{ct.on?"Online":"Offline"}</div></div>
          {[Phone,Video,Search].map((I,i)=><button key={i} style={{width:30,height:30,borderRadius:6,border:"1px solid #eee",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#888"}}><I size={14}/></button>)}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"20px 22px",display:"flex",flexDirection:"column",gap:10}}>
          {ct.mtg ? (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
              <div style={{width:48,height:48,borderRadius:24,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}><Video size={20} color="#aaa"/></div>
              <div style={{fontSize:14,fontWeight:600,color:"#111"}}>Meeting ended</div>
              <div style={{fontSize:12.5,color:"#999",textAlign:"center",maxWidth:260,lineHeight:1.5}}>This chat was from {ct.name.match(/\((.+)\)/)?.[1]||"a past meeting"}. Messages are preserved for reference.</div>
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <button style={{padding:"6px 14px",borderRadius:6,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:12,cursor:"pointer",fontFamily:F}}>View summary</button>
                <button style={{padding:"6px 14px",borderRadius:6,border:"none",background:"#014592",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F}}>View recording</button>
              </div>
            </div>
          ) : msgs.length === 0 ? (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
              <div style={{width:48,height:48,borderRadius:24,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}><MessageCircle size={20} color="#ccc"/></div>
              <div style={{fontSize:13,color:"#999"}}>No messages yet</div>
              <div style={{fontSize:12,color:"#ccc"}}>Start the conversation</div>
            </div>
          ) : (
          msgs.map((m,i)=><div key={i} style={{display:"flex",flexDirection:m.s?"row-reverse":"row",gap:6}}>
            <div style={{maxWidth:"60%"}}>
              <div style={{padding:"9px 13px",borderRadius:m.s?"12px 12px 3px 12px":"12px 12px 12px 3px",background:m.s?"#014592":"#fff",color:m.s?"#fff":"#111",fontSize:12.5,lineHeight:1.5,border:m.s?"none":"1px solid #eee"}}>{m.m}</div>
              <div style={{fontSize:10,color:"#bbb",marginTop:2,textAlign:m.s?"right":"left",padding:"0 4px",display:"flex",alignItems:"center",justifyContent:m.s?"flex-end":"flex-start",gap:3}}>
                {m.t}
                {m.s&&<span style={{display:"inline-flex",alignItems:"center",color:m.r?"#014592":"#ccc"}}>{m.r?<><Check size={10} style={{marginRight:-6}}/><Check size={10}/></>:<Check size={10}/>}</span>}
              </div>
            </div>
          </div>)
          )}
        </div>
        <div style={{padding:"10px 18px 14px",background:"#fff",borderTop:"1px solid #eee",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,background:"#f5f5f5",borderRadius:8,padding:"4px 6px 4px 14px"}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send()}} placeholder="Message..." style={{flex:1,padding:"7px 0",background:"transparent",border:"none",color:"#111",fontSize:13,outline:"none",fontFamily:F}}/>
            <button style={{width:30,height:30,borderRadius:6,border:"none",background:"transparent",cursor:"pointer",color:"#aaa",display:"flex",alignItems:"center",justifyContent:"center"}}><Paperclip size={15}/></button>
            <button onClick={send} style={{width:30,height:30,borderRadius:6,border:"none",background:"#014592",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Send size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Calendar ───
function CalendarScreen({onNav}){
  const [sel,setSel]=useState(null);
  const hours=["8 AM","9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM"];
  const days=[{n:"Mon",d:22},{n:"Tue",d:23,today:true},{n:"Wed",d:24},{n:"Thu",d:25},{n:"Fri",d:26}];
  const evts=[{day:0,start:1,span:1,t:"Team Sync",n:6,tm:"9:00–9:45"},{day:1,start:2,span:1,t:"Sprint Planning",n:8,tm:"10:00–10:45"},{day:1,start:5,span:1,t:"Design Review",n:5,tm:"13:00–13:30"},{day:1,start:7,span:2,t:"Client Sync",n:12,tm:"15:00–16:00"},{day:2,start:1,span:2,t:"Workshop",n:15,tm:"9:00–11:00"},{day:3,start:3,span:1,t:"All Hands",n:42,tm:"11:00–12:00"},{day:4,start:1,span:1,t:"Retro",n:8,tm:"9:00–9:45"}];
  return(
    <div style={{padding:"28px 32px",overflowY:"auto",height:"100vh",fontFamily:F}} onClick={()=>setSel(null)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><h1 style={{fontSize:18,fontWeight:700,color:"#111",margin:0}}>Calendar</h1><div style={{display:"flex",alignItems:"center",gap:4}}><button style={{width:24,height:24,borderRadius:5,border:"1px solid #ddd",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#999"}}><ChevronLeft size={13}/></button><span style={{fontSize:12.5,color:"#666",padding:"0 4px"}}>Jun 22–26</span><button style={{width:24,height:24,borderRadius:5,border:"1px solid #ddd",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#999"}}><ChevronRight size={13}/></button></div></div>
        <button style={{padding:"7px 14px",borderRadius:6,border:"none",background:"#014592",color:"#fff",fontSize:12.5,fontWeight:600,cursor:"pointer",fontFamily:F}}><Plus size={13} style={{verticalAlign:"-2px",marginRight:4}}/>Schedule</button>
      </div>
      <div style={{background:"#fff",borderRadius:8,border:"1px solid #eee",overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"52px repeat(5,1fr)",borderBottom:"1px solid #eee"}}><div/>{days.map((d,i)=><div key={i} style={{padding:"10px 0",textAlign:"center",borderLeft:"1px solid #eee"}}><div style={{fontSize:10.5,color:d.today?"#014592":"#aaa",fontWeight:500}}>{d.n}</div><div style={{fontSize:17,fontWeight:700,marginTop:1,color:d.today?"#014592":"#111"}}>{d.today?<span style={{display:"inline-flex",width:28,height:28,borderRadius:14,background:"#014592",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14}}>{d.d}</span>:d.d}</div></div>)}</div>
        <div style={{maxHeight:420,overflowY:"auto"}}><div style={{display:"grid",gridTemplateColumns:"52px repeat(5,1fr)"}}>
          {hours.map((h,hi)=><div key={hi} style={{display:"contents"}}><div style={{padding:"3px 6px 0 0",textAlign:"right",fontSize:10,color:"#bbb",height:44,borderBottom:"1px solid #f5f5f5"}}>{h}</div>
            {days.map((_,di)=><div key={di} style={{height:44,borderLeft:"1px solid #eee",borderBottom:"1px solid #f5f5f5",position:"relative"}}>
              {evts.filter(e=>e.day===di&&e.start===hi).map((ev,ei)=><div key={ei} onClick={e=>{e.stopPropagation();setSel(sel===ev?null:ev)}} style={{position:"absolute",top:1,left:2,right:2,height:ev.span*44-2,borderRadius:4,background:sel===ev?"#dce6f7":"#eef3fb",borderLeft:"2px solid #014592",padding:"4px 7px",cursor:"pointer",overflow:"hidden",zIndex:sel===ev?5:1}}>
                <div style={{fontSize:10.5,fontWeight:600,color:"#111",lineHeight:1.2}}>{ev.t}</div><div style={{fontSize:9.5,color:"#999",marginTop:1}}>{ev.n}p</div>
                {sel===ev&&<div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:"100%",left:-2,marginTop:4,width:200,background:"#fff",borderRadius:8,boxShadow:"0 6px 24px rgba(0,0,0,0.12)",border:"1px solid #eee",padding:"12px 14px",zIndex:10}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#111",marginBottom:4}}>{ev.t}</div><div style={{fontSize:11.5,color:"#888",marginBottom:3}}>{ev.tm}</div><div style={{fontSize:11.5,color:"#888",marginBottom:10}}>{ev.n} participants</div>
                  <div style={{display:"flex",gap:6}}><button onClick={()=>onNav("meeting")} style={{flex:1,padding:"6px 0",borderRadius:5,border:"none",background:"#014592",color:"#fff",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:F}}>Join</button><button style={{padding:"6px 10px",borderRadius:5,border:"1px solid #ddd",background:"#fff",color:"#555",fontSize:11.5,cursor:"pointer",fontFamily:F}}>Details</button></div>
                </div>}
              </div>)}
            </div>)}
          </div>)}
        </div></div>
      </div>
    </div>
  );
}

// ─── Settings ───
function SettingsScreen({appearance,setAppearance}){
  const [prefs,setPrefs]=useState({chapters:true,summary:true,camOff:false,muteJoin:true,reminders:true});
  const [bg,setBg]=useState("None");
  const [camActive,setCamActive]=useState(false);
  const [stream,setStream]=useState(null);
  const vidRef=useRef(null);
  const toggle=(k)=>setPrefs(p=>({...p,[k]:!p[k]}));
  const [connectedApps,setConnectedApps]=useState({gcal:true,gdrive:true,slack:false,teams:false});

  const startCam=async()=>{
    try{const s=await navigator.mediaDevices.getUserMedia({video:true,audio:false});setStream(s);setCamActive(true);if(vidRef.current)vidRef.current.srcObject=s;}catch(e){setCamActive(false)}
  };
  const stopCam=()=>{if(stream){stream.getTracks().forEach(t=>t.stop());setStream(null)}setCamActive(false)};

  useEffect(()=>{if(camActive&&vidRef.current&&stream)vidRef.current.srcObject=stream},[camActive,stream]);
  useEffect(()=>()=>{if(stream)stream.getTracks().forEach(t=>t.stop())},[stream]);

  const bgColors={"Office":"linear-gradient(135deg,#e8d5b7,#c4a67a)","Living room":"linear-gradient(135deg,#d4c5a9,#b8a88a)","Bookshelf":"linear-gradient(135deg,#8b6f47,#5c4a2e)","Nature":"linear-gradient(135deg,#7ab68e,#4a8c5c)","Abstract gradient":"linear-gradient(135deg,#667eea,#764ba2)"};
  const getFilter=()=>{if(bg==="Slight blur")return"blur(2px) brightness(1.02)";if(bg==="Strong blur")return"blur(6px) brightness(1.02)";return"none"};
  const hasOverlay=bgColors[bg];

  return(
    <div style={{padding:"32px 36px",overflowY:"auto",height:"100vh",fontFamily:F,maxWidth:800,margin:"0 auto"}}>
      <h1 style={{fontSize:18,fontWeight:700,color:"#111",margin:"0 0 24px"}}>Settings</h1>
      <div style={{marginBottom:28}}><div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:12}}>Profile</div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}><Av initials="SE" hue={215} size={52}/><div style={{flex:1}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:3}}>Display name</label><input defaultValue="Setyana" style={{width:"100%",padding:"7px 10px",borderRadius:5,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:F}}/></div><div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:3}}>In-meeting name</label><input defaultValue="Setyana" style={{width:"100%",padding:"7px 10px",borderRadius:5,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:F}}/></div></div></div></div>
      </div>
      <div style={{marginBottom:28}}><div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:12}}>Audio & Video</div>
        <div style={{display:"flex",gap:16,marginBottom:12,alignItems:"stretch"}}>
          <div style={{width:240,minHeight:160,borderRadius:8,background:"#111",overflow:"hidden",position:"relative",flexShrink:0}}>
            {camActive?(
              <>
                <video ref={vidRef} autoPlay muted playsInline style={{width:"100%",height:"100%",objectFit:"cover",transform:"scaleX(-1)",filter:getFilter()}}/>
                {hasOverlay&&<div style={{position:"absolute",inset:0,background:bgColors[bg],opacity:0.4,mixBlendMode:"multiply"}}/>}
                {bg!=="None"&&<div style={{position:"absolute",bottom:6,left:6,padding:"2px 8px",borderRadius:4,background:"rgba(0,0,0,0.5)",fontSize:10,color:"#fff"}}>{bg}</div>}
                <button onClick={stopCam} style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:6,border:"none",background:"rgba(0,0,0,0.5)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><X size={12}/></button>
              </>
            ):(
              <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                <Camera size={24} color="#555"/>
                <button onClick={startCam} style={{padding:"5px 14px",borderRadius:6,border:"none",background:"#014592",color:"#fff",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:F}}>Start preview</button>
                <span style={{fontSize:10,color:"#666"}}>Test your camera</span>
              </div>
            )}
          </div>
          <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,alignContent:"start"}}>
            <div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:3}}>Camera</label><select style={{width:"100%",padding:"7px 10px",borderRadius:5,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:12.5,boxSizing:"border-box",fontFamily:F}}><option>FaceTime HD</option><option>Logitech C920</option><option>External Webcam</option></select></div>
            <div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:3}}>Background</label><select value={bg} onChange={e=>setBg(e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:5,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:12.5,boxSizing:"border-box",fontFamily:F}}><option>None</option><option>Slight blur</option><option>Strong blur</option><option>Office</option><option>Living room</option><option>Bookshelf</option><option>Nature</option><option>Abstract gradient</option></select></div>
            <div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:3}}>Microphone</label><select style={{width:"100%",padding:"7px 10px",borderRadius:5,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:12.5,boxSizing:"border-box",fontFamily:F}}><option>MacBook Pro Mic</option><option>External USB Mic</option><option>AirPods Pro</option><option>Bluetooth Headset</option></select></div>
            <div><label style={{fontSize:11,color:"#999",display:"block",marginBottom:3}}>Speaker</label><select style={{width:"100%",padding:"7px 10px",borderRadius:5,background:"#f8f8f8",border:"1px solid #e5e5e5",color:"#111",fontSize:12.5,boxSizing:"border-box",fontFamily:F}}><option>MacBook Pro Speakers</option><option>External Monitor</option><option>AirPods Pro</option><option>Bluetooth Headset</option></select></div>
          </div>
        </div>
      </div>
      <div><div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:12}}>Preferences</div>
        {[{l:"Auto-generate meeting chapters",k:"chapters"},{l:"AI meeting summary",k:"summary"},{l:"Camera off on join",k:"camOff"},{l:"Mute on join",k:"muteJoin"},{l:"Meeting reminders",k:"reminders"}].map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:i<4?"1px solid #f0f0f0":"none"}}>
            <span style={{fontSize:12.5,color:"#333"}}>{p.l}</span>
            <div onClick={()=>toggle(p.k)} style={{width:34,height:20,borderRadius:10,padding:2,cursor:"pointer",background:prefs[p.k]?"#014592":"#ddd"}}><div style={{width:16,height:16,borderRadius:8,background:"#fff",transform:prefs[p.k]?"translateX(14px)":"translateX(0)",transition:"transform 0.15s"}}/></div>
          </div>
        ))}
      </div>

      <div style={{marginTop:28}}><div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:12}}>Appearance</div>
        <div style={{display:"flex",gap:4,background:"#f5f5f5",borderRadius:8,padding:3}}>
          {[{id:"light",label:"Light",icon:Sun},{id:"dark",label:"Dark",icon:Moon},{id:"system",label:"System",icon:Monitor}].map(m=>(
            <button key={m.id} onClick={()=>setAppearance(m.id)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"8px 0",borderRadius:6,border:"none",cursor:"pointer",fontFamily:F,fontSize:12,fontWeight:appearance===m.id?600:400,background:appearance===m.id?"#fff":"transparent",color:appearance===m.id?"#111":"#888",boxShadow:appearance===m.id?"0 1px 3px rgba(0,0,0,0.08)":"none",transition:"all 0.15s"}}><m.icon size={13}/>{m.label}</button>
          ))}
        </div>
      </div>

      <div style={{marginTop:28}}><div style={{fontSize:11,fontWeight:600,color:"#aaa",textTransform:"uppercase",letterSpacing:"0.04em",marginBottom:12}}>Connected accounts</div>
        {[
          {id:"gcal",name:"Google Calendar",desc:"Sync meetings and events",icon:Calendar},
          {id:"gdrive",name:"Google Drive",desc:"Share and access files",icon:FileText},
          {id:"slack",name:"Slack",desc:"Send meeting notifications",icon:MessageSquare},
          {id:"teams",name:"Microsoft Teams",desc:"Import contacts and channels",icon:Users},
        ].map((app,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?"1px solid #f0f0f0":"none"}}>
            <div style={{width:32,height:32,borderRadius:7,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center"}}><app.icon size={15} color="#666"/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:12.5,color:"#333",fontWeight:500}}>{app.name}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:1}}>{app.desc}</div>
            </div>
            {connectedApps[app.id]?(
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:11.5,color:"#22863a",display:"flex",alignItems:"center",gap:3}}><Check size={12}/>Connected</span>
                <button onClick={()=>setConnectedApps(c=>({...c,[app.id]:false}))} style={{padding:"4px 10px",borderRadius:5,border:"1px solid #eee",background:"#fff",color:"#999",fontSize:11,cursor:"pointer",fontFamily:F}}>Disconnect</button>
              </div>
            ):(
              <button onClick={()=>setConnectedApps(c=>({...c,[app.id]:true}))} style={{padding:"5px 14px",borderRadius:5,border:"none",background:"#014592",color:"#fff",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:F}}>Connect</button>
            )}
          </div>
        ))}
      </div>

      <div style={{marginTop:32,paddingTop:20,borderTop:"1px solid #f0f0f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:12.5,color:"#333",fontWeight:500}}>RDS Meet</div>
          <div style={{fontSize:11,color:"#aaa",marginTop:2}}>Version 1.0.0 · Build 2026.06.23</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{padding:"5px 12px",borderRadius:5,border:"1px solid #eee",background:"#fff",color:"#666",fontSize:11,cursor:"pointer",fontFamily:F}}>Check for updates</button>
          <button style={{padding:"5px 12px",borderRadius:5,border:"1px solid #eee",background:"#fff",color:"#666",fontSize:11,cursor:"pointer",fontFamily:F}}>Licenses</button>
        </div>
      </div>
    </div>
  );
}

// ─── App ───
export default function App(){
  const [screen,setScreen]=useState("dashboard");
  const [searchOpen,setSearchOpen]=useState(false);
  const [searchQ,setSearchQ]=useState("");
  const [sidebarCollapsed,setSidebarCollapsed]=useState(false);
  const [replayId,setReplayId]=useState(null);
  const [appearance,setAppearance]=useState("light");
  const {push,Toasts}=useToast();
  const isDark=appearance==="dark";
  const goReplay=(id)=>{setReplayId(id);setScreen("replay")};

  const searchItems=[{type:"meeting",l:"Sprint Planning",sub:"Today 10:00 · 8 people",act:()=>{setScreen("meeting");setSearchOpen(false)}},{type:"person",l:"Sarah Chen",sub:"Online",act:()=>{setScreen("chat");setSearchOpen(false)}},{type:"person",l:"David Kim",sub:"Online",act:()=>{setScreen("chat");setSearchOpen(false)}},{type:"history",l:"Q2 Strategy Session",sub:"Jun 20 · 1h 23m",act:()=>{goReplay(0);setSearchOpen(false)}},{type:"page",l:"Calendar",sub:"View schedule",act:()=>{setScreen("calendar");setSearchOpen(false)}},{type:"page",l:"Settings",sub:"Preferences",act:()=>{setScreen("settings");setSearchOpen(false)}}];
  const filtered=searchQ?searchItems.filter(i=>i.l.toLowerCase().includes(searchQ.toLowerCase())):searchItems;
  const unread=7;

  const screens={
    dashboard:<DashboardScreen onNav={setScreen} toast={push} goReplay={goReplay}/>,
    chat:<ChatScreen/>,
    calendar:<CalendarScreen onNav={setScreen}/>,
    meeting:<MeetingScreen onNav={setScreen} toast={push} isDark={isDark}/>,
    replay:<ReplayScreen initialId={replayId} onBack={()=>setReplayId(null)}/>,
    settings:<SettingsScreen appearance={appearance} setAppearance={setAppearance}/>,
  };

  const darkFilter=isDark?"invert(0.92) hue-rotate(180deg)":"none";

  return(
    <div style={{display:"flex",height:"100vh",width:"100%",background:"#fafafa",fontFamily:F,fontSize:13,lineHeight:1.5,overflow:"hidden",position:"relative",filter:darkFilter,transition:"filter 0.3s ease"}} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setSearchOpen(true);setSearchQ("")}}} tabIndex={0}>
      <Sidebar active={screen} onNav={setScreen} unread={unread} collapsed={sidebarCollapsed} onToggle={()=>setSidebarCollapsed(c=>!c)}/>
      <div style={{flex:1,overflow:"hidden"}}>{screens[screen]||screens.dashboard}</div>
      <Toasts/>
      {searchOpen&&<><div onClick={()=>setSearchOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:200}}/>
        <div style={{position:"fixed",top:"18%",left:"50%",transform:"translateX(-50%)",width:480,background:"#fff",borderRadius:12,boxShadow:"0 16px 48px rgba(0,0,0,0.15)",zIndex:201,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:"1px solid #eee"}}><Search size={16} color="#aaa"/><input autoFocus value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>{if(e.key==="Escape")setSearchOpen(false)}} placeholder="Search meetings, people, pages..." style={{flex:1,border:"none",outline:"none",fontSize:14,color:"#111",background:"transparent",fontFamily:F}}/><kbd style={{padding:"2px 6px",borderRadius:4,background:"#f5f5f5",border:"1px solid #e5e5e5",fontSize:10,color:"#aaa",fontFamily:F}}>esc</kbd></div>
          <div style={{maxHeight:320,overflowY:"auto",padding:"4px 0"}}>{filtered.length===0&&<div style={{padding:"20px 16px",textAlign:"center",color:"#aaa",fontSize:13}}>No results</div>}
            {filtered.map((item,i)=><button key={i} onClick={item.act} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 16px",border:"none",cursor:"pointer",background:"transparent",fontFamily:F,textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="#f5f5f5"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{width:28,height:28,borderRadius:6,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.type==="meeting"?<Video size={13} color="#014592"/>:item.type==="person"?<Users size={13} color="#666"/>:item.type==="history"?<History size={13} color="#666"/>:<ExternalLink size={13} color="#666"/>}</div>
              <div style={{flex:1}}><div style={{fontSize:13,color:"#111",fontWeight:500}}>{item.l}</div><div style={{fontSize:11,color:"#aaa"}}>{item.sub}</div></div>
              <span style={{fontSize:10,color:"#ccc",textTransform:"capitalize"}}>{item.type}</span>
            </button>)}
          </div>
          <div style={{padding:"8px 16px",borderTop:"1px solid #eee",display:"flex",gap:12,fontSize:10.5,color:"#aaa"}}><span><kbd style={{padding:"1px 4px",borderRadius:3,background:"#f5f5f5",border:"1px solid #e5e5e5",fontSize:9,marginRight:3}}>⌘K</kbd>search</span><span><kbd style={{padding:"1px 4px",borderRadius:3,background:"#f5f5f5",border:"1px solid #e5e5e5",fontSize:9,marginRight:3}}>↵</kbd>open</span><span><kbd style={{padding:"1px 4px",borderRadius:3,background:"#f5f5f5",border:"1px solid #e5e5e5",fontSize:9,marginRight:3}}>esc</kbd>close</span></div>
        </div>
      </>}
    </div>
  );
}
