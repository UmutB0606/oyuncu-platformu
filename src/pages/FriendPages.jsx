import { useState } from "react";
import {
  ChevronLeft, Users, Star, Clock, Award, ChevronDown, ChevronUp,
  MessageCircle, UserPlus, Search, CheckCircle, Gamepad2, TrendingUp,
  Shield, Trophy, BarChart2
} from "lucide-react";

const T = {
  bg:         "#0e1016",
  surface:    "#13161f",
  card:       "#151822",
  border:     "#1e2338",
  borderHi:   "#2d3560",
  accent:     "#1a9fff",
  accentSoft: "#1a9fff0d",
  accentGlow: "#1a9fff30",
  teal:       "#00c8d4",
  gold:       "#c8a050",
  purple:     "#7c5cfc",
  text:       "#dde4f0",
  textSub:    "#6a7898",
  textDim:    "#2e3858",
  success:    "#0fb97e",
  warning:    "#f0a030",
  danger:     "#e84040",
  green:      "#3ebd6e",
};

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const FRIEND_GAMES = {
  "Mert K.": [
    { id:1, title:"Elden Ring",       genre:"Action RPG", hours:340, lastPlayed:"Bugün",      c1:"#7a3c10", c2:"#2e1204", achievement:87 },
    { id:2, title:"Dark Souls III",   genre:"Action RPG", hours:220, lastPlayed:"3 gün önce", c1:"#2a3a5a", c2:"#0f1a2a", achievement:62 },
    { id:3, title:"Sekiro",           genre:"Action",     hours:95,  lastPlayed:"1 hafta önce",c1:"#1a3a1a", c2:"#0a1a0a", achievement:40 },
    { id:4, title:"Hollow Knight",    genre:"Metroidvania",hours:180,lastPlayed:"2 hafta önce",c1:"#2a3a5a", c2:"#0f1a2a", achievement:55 },
  ],
  "Ayşe T.": [
    { id:2, title:"Cyberpunk 2077",   genre:"Action RPG", hours:210, lastPlayed:"Bugün",      c1:"#c8a020", c2:"#3a1e00", achievement:73 },
    { id:3, title:"The Witcher 3",    genre:"RPG",        hours:480, lastPlayed:"Dün",         c1:"#2d6a44", c2:"#1a3d25", achievement:91 },
    { id:4, title:"Baldur's Gate 3",  genre:"RPG",        hours:120, lastPlayed:"4 gün önce", c1:"#3d5a8a", c2:"#1a2d4a", achievement:38 },
  ],
  "Burak S.": [
    { id:3, title:"God of War",       genre:"Adventure",  hours:95,  lastPlayed:"Bugün",      c1:"#1a5c8a", c2:"#5e1010", achievement:100},
    { id:4, title:"God of War Ragnarok",genre:"Adventure",hours:80,  lastPlayed:"1 hafta önce",c1:"#1a4a7a", c2:"#4e0e0e", achievement:67 },
    { id:5, title:"Horizon ZD",       genre:"Action RPG", hours:150, lastPlayed:"2 hafta önce",c1:"#2d5a2d", c2:"#1a3a1a", achievement:82 },
  ],
  "Can D.": [
    { id:1, title:"Hades",            genre:"Roguelike",  hours:520, lastPlayed:"2 saat önce",c1:"#8b1a3a", c2:"#3a0d1a", achievement:95 },
    { id:2, title:"Dead Cells",       genre:"Roguelike",  hours:200, lastPlayed:"3 gün önce", c1:"#5a1a2a", c2:"#2a0d14", achievement:70 },
  ],
  "Zeynep A.": [
    { id:1, title:"Stardew Valley",   genre:"Simulation", hours:800, lastPlayed:"1 gün önce", c1:"#2d6a44", c2:"#1a3d25", achievement:88 },
    { id:2, title:"Animal Crossing",  genre:"Simulation", hours:350, lastPlayed:"5 gün önce", c1:"#3a6a2a", c2:"#1a3a14", achievement:60 },
  ],
  "Emir Y.": [
    { id:1, title:"Hades",            genre:"Roguelike",  hours:280, lastPlayed:"Bugün",      c1:"#8b1a3a", c2:"#3a0d1a", achievement:78 },
    { id:2, title:"Deep Rock Galactic",genre:"Co-op",     hours:190, lastPlayed:"Dün",        c1:"#5a3a1a", c2:"#2a1a0a", achievement:55 },
    { id:3, title:"Elden Ring",       genre:"Action RPG", hours:150, lastPlayed:"1 hafta önce",c1:"#7a3c10", c2:"#2e1204", achievement:42 },
  ],
};

const FRIEND_ACHIEVEMENTS = {
  "Mert K.": [
    { name:"Elden Lord",     game:"Elden Ring",     icon:"👑", earned:true,  rare:2.1  },
    { name:"Ejderha Katili", game:"Elden Ring",     icon:"🐉", earned:true,  rare:8.4  },
    { name:"Soul Master",    game:"Dark Souls III", icon:"⚔️", earned:true,  rare:5.2  },
    { name:"Yenilmez",       game:"Elden Ring",     icon:"🛡️", earned:false, rare:1.2  },
    { name:"Gezgin",         game:"Hollow Knight",  icon:"🗺️", earned:true,  rare:22.7 },
    { name:"Koleksiyoncu",   game:"Elden Ring",     icon:"🗡️", earned:false, rare:15.3 },
  ],
  "Ayşe T.": [
    { name:"Nomad",          game:"Cyberpunk 2077", icon:"🌆", earned:true,  rare:12.5 },
    { name:"Witcher",        game:"The Witcher 3",  icon:"🐺", earned:true,  rare:45.2 },
    { name:"Card Collector", game:"The Witcher 3",  icon:"🃏", earned:true,  rare:8.9  },
    { name:"Dark Horse",     game:"BG3",            icon:"🐴", earned:false, rare:3.1  },
  ],
  "Burak S.": [
    { name:"God of War",     game:"God of War",     icon:"⚔️", earned:true,  rare:100  },
    { name:"Realm Racer",    game:"God of War",     icon:"🏆", earned:true,  rare:18.4 },
    { name:"Kratos",         game:"God of War Ragnarok",icon:"💪",earned:false,rare:5.2},
  ],
  "Can D.": [
    { name:"True Form",      game:"Hades",          icon:"💀", earned:true,  rare:15.3 },
    { name:"Completionist",  game:"Hades",          icon:"🏅", earned:true,  rare:4.2  },
    { name:"Speed Runner",   game:"Dead Cells",     icon:"⚡", earned:false, rare:2.8  },
  ],
  "Zeynep A.": [
    { name:"Perfection",     game:"Stardew Valley", icon:"🌟", earned:true,  rare:8.9  },
    { name:"Master Farmer",  game:"Stardew Valley", icon:"🌾", earned:true,  rare:22.1 },
  ],
  "Emir Y.": [
    { name:"True Form",      game:"Hades",          icon:"💀", earned:true,  rare:15.3 },
    { name:"Driller",        game:"Deep Rock",      icon:"⛏️", earned:false, rare:6.7  },
  ],
};

const FRIENDS_DATA = [
  { name:"Mert K.",   status:"online",  game:"Elden Ring",     av:"MK", level:47, hours:835,  achievements:89,  since:"3 yıl" },
  { name:"Ayşe T.",   status:"online",  game:"Cyberpunk 2077", av:"AT", level:38, hours:810,  achievements:74,  since:"2 yıl" },
  { name:"Can D.",    status:"away",    game:"2 saat önce",    av:"CD", level:52, hours:1240, achievements:120, since:"4 yıl" },
  { name:"Zeynep A.", status:"offline", game:"Çevrimdışı",     av:"ZA", level:29, hours:560,  achievements:55,  since:"1 yıl" },
  { name:"Burak S.",  status:"online",  game:"God of War",     av:"BS", level:41, hours:720,  achievements:98,  since:"3 yıl" },
  { name:"Emir Y.",   status:"online",  game:"Hades",          av:"EY", level:35, hours:470,  achievements:67,  since:"2 yıl" },
];

/* ═══════════════════════════════════════
   FRIEND PROFILE PAGE
═══════════════════════════════════════ */
export function FriendProfilePage({ friendName, onBack, onGameClick }) {
  const [showAchiev, setShowAchiev] = useState(false);
  const [showGames,  setShowGames]  = useState(false);

  const friend   = FRIENDS_DATA.find(f => f.name === friendName) || FRIENDS_DATA[0];
  const games    = FRIEND_GAMES[friend.name]    || [];
  const achieves = FRIEND_ACHIEVEMENTS[friend.name] || [];
  const sc       = { online:T.success, away:T.warning, offline:T.textDim }[friend.status];
  const earned   = achieves.filter(a => a.earned).length;

  return (
    <div style={{ height:"100vh", width:"100%", background:T.bg, color:T.text, fontFamily:"'Outfit',system-ui,sans-serif", overflowY:"auto" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${T.surface}}::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .pb{transition:all .18s;cursor:pointer;border:none;outline:none}
        .pb:hover{filter:brightness(1.1);transform:translateY(-1px)}
        .pb:active{transform:scale(.97)}
        .nb{transition:all .18s;cursor:pointer;border:none;background:none;outline:none;display:flex;align-items:center}
        .nb:hover{background:${T.accentSoft}!important}
        .gr{transition:all .2s;cursor:pointer}
        .gr:hover{transform:translateY(-3px);border-color:${T.borderHi}!important}
        .af{animation:fadeUp .38s ease}
      `}</style>

      {/* Hero */}
      <div style={{ position:"relative", height:220, overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,#0d1828 0%,#1a2840 50%,#0a1020 100%)` }} />
        <div style={{ position:"absolute", inset:0, opacity:.06, backgroundImage:NOISE, backgroundSize:"128px" }} />
        <div style={{ position:"absolute", left:"30%", top:"-20%", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle,${T.accent}15 0%,transparent 65%)` }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:100, background:`linear-gradient(to top,${T.bg},transparent)` }} />

        <button className="nb" onClick={onBack} style={{ position:"absolute", top:20, left:24, display:"flex", alignItems:"center", gap:7, background:"rgba(14,16,22,.6)", backdropFilter:"blur(8px)", border:`1px solid ${T.border}`, borderRadius:10, padding:"8px 14px", color:T.textSub, fontSize:13, fontWeight:600 }}>
          <ChevronLeft size={15} /> Arkadaşlar
        </button>
      </div>

      <div style={{ maxWidth:820, margin:"-80px auto 0", padding:"0 32px 64px", position:"relative", zIndex:1 }}>
        {/* Profile card */}
        <div className="af" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:20, padding:"28px", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:20 }}>
            {/* Avatar */}
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, color:T.bg, boxShadow:`0 0 24px ${T.accentGlow}`, border:`3px solid ${T.surface}` }}>
                {friend.av}
              </div>
              <div style={{ position:"absolute", bottom:3, right:3, width:16, height:16, borderRadius:"50%", background:sc, border:`3px solid ${T.surface}` }} />
            </div>

            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                <h1 style={{ fontSize:24, fontWeight:900 }}>{friend.name}</h1>
                <div style={{ background:`${sc}18`, border:`1px solid ${sc}35`, borderRadius:6, padding:"2px 9px", fontSize:10, color:sc, fontWeight:700 }}>
                  {friend.status === "online" ? "Çevrimiçi" : friend.status === "away" ? "Uzakta" : "Çevrimdışı"}
                </div>
              </div>
              {friend.status === "online" && (
                <div style={{ fontSize:13, color:T.teal, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}>
                  <Gamepad2 size={13} />
                  {friend.game} oynuyor
                </div>
              )}
              <div style={{ fontSize:12, color:T.textSub }}>{friend.since} süredir arkadaş</div>
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:8 }}>
              <button className="pb" style={{ padding:"9px 18px", borderRadius:10, background:T.accent, color:T.bg, fontWeight:700, fontSize:12, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                <MessageCircle size={13} /> Mesaj Gönder
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:24 }}>
            {[
              { v:`Lvl ${friend.level}`, l:"Seviye",      c:T.gold,    icon:<Trophy size={14} color={T.gold} />    },
              { v:friend.hours,          l:"Toplam Saat", c:T.accent,  icon:<Clock size={14} color={T.accent} />   },
              { v:friend.achievements,   l:"Başarım",     c:T.purple,  icon:<Award size={14} color={T.purple} />   },
              { v:games.length,          l:"Oyun",        c:T.teal,    icon:<Gamepad2 size={14} color={T.teal} />  },
            ].map(({ v, l, c, icon }) => (
              <div key={l} style={{ background:T.bg, borderRadius:12, padding:"14px", border:`1px solid ${T.border}`, textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:6 }}>{icon}</div>
                <div style={{ fontSize:20, fontWeight:900, color:c }}>{v}</div>
                <div style={{ fontSize:10, color:T.textSub, marginTop:2, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── OYUNLAR ── */}
        <div className="af" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, marginBottom:16, overflow:"hidden" }}>
          <button onClick={() => setShowGames(p => !p)} style={{ width:"100%", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", cursor:"pointer", color:T.text, fontFamily:"inherit" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Gamepad2 size={16} color={T.accent} />
              <span style={{ fontSize:16, fontWeight:800 }}>Oyunlar</span>
              <span style={{ fontSize:12, background:T.accentSoft, color:T.accent, borderRadius:8, padding:"2px 8px", fontWeight:700 }}>{games.length} oyun</span>
            </div>
            {showGames ? <ChevronUp size={16} color={T.textSub} /> : <ChevronDown size={16} color={T.textSub} />}
          </button>

          {showGames && (
            <div style={{ borderTop:`1px solid ${T.border}`, padding:"12px 16px 16px", animation:"fadeUp .3s ease" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {games.map(g => (
                  <div key={g.id} className="gr" onClick={() => onGameClick && onGameClick(g)}
                    style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 14px", background:T.bg, border:`1px solid ${T.border}`, borderRadius:12 }}>
                    <div style={{ width:52, height:52, borderRadius:10, flexShrink:0, background:`linear-gradient(145deg,${g.c2},${g.c1})`, position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 70% 30%,rgba(255,255,255,.2),transparent 60%)" }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{g.title}</div>
                      <div style={{ fontSize:11, color:T.textSub }}>{g.genre} · Son: {g.lastPlayed}</div>
                      <div style={{ marginTop:6, height:3, background:T.border, borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", background:g.achievement===100?T.success:T.accent, borderRadius:2, width:`${g.achievement}%` }} />
                      </div>
                      <div style={{ fontSize:9, color:T.textSub, marginTop:3 }}>%{g.achievement} başarım</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:16, fontWeight:800, color:T.gold }}>{g.hours}</div>
                      <div style={{ fontSize:9, color:T.textSub, fontWeight:600 }}>SAAT</div>
                    </div>
                    <ChevronDown size={14} color={T.textDim} style={{ transform:"rotate(-90deg)" }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BAŞARIMLAR ── */}
        <div className="af" style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
          <button onClick={() => setShowAchiev(p => !p)} style={{ width:"100%", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", cursor:"pointer", color:T.text, fontFamily:"inherit" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Award size={16} color={T.gold} />
              <span style={{ fontSize:16, fontWeight:800 }}>Başarımlar</span>
              <span style={{ fontSize:12, background:`${T.gold}18`, color:T.gold, borderRadius:8, padding:"2px 8px", fontWeight:700 }}>{earned}/{achieves.length}</span>
            </div>
            {showAchiev ? <ChevronUp size={16} color={T.textSub} /> : <ChevronDown size={16} color={T.textSub} />}
          </button>

          {showAchiev && (
            <div style={{ borderTop:`1px solid ${T.border}`, padding:"12px 16px 16px", animation:"fadeUp .3s ease" }}>
              {/* bar */}
              <div style={{ margin:"8px 0 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:11, color:T.textSub }}>Tamamlanma</span>
                  <span style={{ fontSize:11, color:T.gold, fontWeight:700 }}>%{achieves.length ? Math.round(earned/achieves.length*100) : 0}</span>
                </div>
                <div style={{ height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:T.gold, borderRadius:2, width:`${achieves.length ? earned/achieves.length*100 : 0}%` }} />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {achieves.map((a, i) => (
                  <div key={i} style={{ display:"flex", gap:10, padding:"12px", background:a.earned?`${T.gold}08`:T.bg, border:`1px solid ${a.earned?T.gold+"30":T.border}`, borderRadius:12, opacity:a.earned?1:0.5 }}>
                    <div style={{ fontSize:22, flexShrink:0 }}>{a.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:a.earned?T.text:T.textSub, marginBottom:2 }}>{a.name}</div>
                      <div style={{ fontSize:10, color:T.textSub, marginBottom:3 }}>{a.game}</div>
                      <div style={{ fontSize:9, color:T.textDim }}>%{a.rare} oyuncu</div>
                    </div>
                    {a.earned && <CheckCircle size={13} color={T.gold} style={{ flexShrink:0, marginTop:2 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   FRIEND LIST PAGE
═══════════════════════════════════════ */
export function FriendListPage({ onBack, onFriendClick }) {
  const [query,      setQuery]      = useState("");
  const [filter,     setFilter]     = useState("all");

  const filtered = FRIENDS_DATA.filter(f => {
    const matchQ = f.name.toLowerCase().includes(query.toLowerCase());
    if (!matchQ) return false;
    if (filter === "online")  return f.status === "online";
    if (filter === "offline") return f.status !== "online";
    return true;
  });

  const online = FRIENDS_DATA.filter(f => f.status === "online").length;

  return (
    <div style={{ height:"100vh", width:"100%", background:T.bg, color:T.text, fontFamily:"'Outfit',system-ui,sans-serif", overflowY:"auto" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:${T.surface}}::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .pb{transition:all .18s;cursor:pointer;border:none;outline:none}
        .pb:hover{filter:brightness(1.1)}
        .nb{transition:all .18s;cursor:pointer;border:none;background:none;outline:none;display:flex;align-items:center}
        .nb:hover{background:${T.accentSoft}!important}
        .fc{transition:all .2s;cursor:pointer}
        .fc:hover{border-color:${T.borderHi}!important;transform:translateY(-2px)}
        input::placeholder{color:${T.textSub}}
        .af{animation:fadeUp .38s ease}
      `}</style>

      {/* Header */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"16px 32px", display:"flex", alignItems:"center", gap:16, position:"sticky", top:0, zIndex:5 }}>
        <button className="nb" onClick={onBack} style={{ borderRadius:10, padding:"8px 14px", color:T.textSub, fontSize:13, fontWeight:600, gap:7, border:`1px solid ${T.border}` }}>
          <ChevronLeft size={15} /> Geri
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Users size={18} color={T.accent} />
          <span style={{ fontSize:18, fontWeight:800 }}>Arkadaşlar</span>
          <div style={{ background:T.accentSoft, color:T.accent, borderRadius:9, padding:"2px 9px", fontSize:11, fontWeight:800 }}>{online} çevrimiçi</div>
        </div>
        <button className="pb" style={{ marginLeft:"auto", padding:"9px 16px", borderRadius:10, background:T.accent, color:T.bg, fontWeight:700, fontSize:12, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
          <UserPlus size={13} /> Arkadaş Ekle
        </button>
      </div>

      <div style={{ maxWidth:820, margin:"0 auto", padding:"28px 32px 64px" }}>
        {/* Search + filter */}
        <div className="af" style={{ display:"flex", gap:10, marginBottom:24 }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"9px 14px", gap:9 }}>
            <Search size={14} color={T.textSub} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Arkadaş ara..." style={{ background:"none", border:"none", outline:"none", color:T.text, fontSize:13, flex:1, fontFamily:"inherit" }} />
          </div>
          {["all","online","offline"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:"9px 16px", borderRadius:10, border:`1px solid ${filter===f ? T.accent+"50" : T.border}`, background:filter===f ? T.accentSoft : T.surface, color:filter===f ? T.accent : T.textSub, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              {f === "all" ? "Tümü" : f === "online" ? "🟢 Çevrimiçi" : "⚫ Çevrimdışı"}
            </button>
          ))}
        </div>

        {/* Friend cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))", gap:12 }}>
          {filtered.map((f, i) => {
            const sc = { online:T.success, away:T.warning, offline:T.textDim }[f.status];
            const statusLabel = { online:"Çevrimiçi", away:"Uzakta", offline:"Çevrimdışı" }[f.status];
            return (
              <div key={f.name} className="fc" onClick={() => onFriendClick(f.name)}
                style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"18px 20px", animation:`fadeUp .4s ease both`, animationDelay:`${i*.06}s`, cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent}40,${T.purple}40)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, border:`2px solid ${f.status==="online"?T.borderHi:T.border}` }}>
                      {f.av}
                    </div>
                    <div style={{ position:"absolute", bottom:1, right:1, width:12, height:12, borderRadius:"50%", background:sc, border:`2px solid ${T.surface}` }} />
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700 }}>{f.name}</div>
                    <div style={{ fontSize:11, color:sc, fontWeight:600, marginBottom:2 }}>{statusLabel}</div>
                    {f.status === "online" && <div style={{ fontSize:11, color:T.textSub }}>{f.game} oynuyor</div>}
                  </div>
                  <ChevronDown size={15} color={T.textDim} style={{ transform:"rotate(-90deg)" }} />
                </div>

                {/* Mini stats */}
                <div style={{ display:"flex", gap:8 }}>
                  {[
                    { v:`Lvl ${f.level}`, l:"Seviye",  c:T.gold   },
                    { v:f.hours,          l:"Saat",    c:T.accent },
                    { v:f.achievements,   l:"Başarım", c:T.purple },
                  ].map(({ v, l, c }) => (
                    <div key={l} style={{ flex:1, background:T.bg, borderRadius:9, padding:"8px", border:`1px solid ${T.border}`, textAlign:"center" }}>
                      <div style={{ fontSize:14, fontWeight:800, color:c }}>{v}</div>
                      <div style={{ fontSize:9, color:T.textSub, marginTop:1 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}