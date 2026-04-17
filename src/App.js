import { useState, useEffect } from "react";
import {
  Gamepad2, Store, BookOpen, Download, User, Search, Bell, Settings,
  Shield, Database, RefreshCw, X, Play, ShoppingCart, ChevronRight,
  Star, Zap, Users, Award, Check, CheckCircle, MessageCircle, Trophy,
  Globe, TrendingUp, Clock, AlertCircle, Heart, ChevronDown,
  Flame, Gift, Tag, Layers, Swords, Crown, Sparkles, Radio,
  ThumbsUp, Eye, BarChart2, Hash, PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import AuthPage from "./AuthPage.jsx";
import GameDetailPage from "./pages/GameDetailPage";
import { FriendListPage, FriendProfilePage } from "./pages/FriendPages";
import NotificationPanel from "./components/NotificationPanel";

const T = {
  bg:         "#0e1016",
  surface:    "#13161f",
  surfaceHi:  "#181c28",
  card:       "#15182200",
  cardSolid:  "#151822",
  border:     "#1e2338",
  borderHi:   "#2d3560",
  accent:     "#1a9fff",
  accentSoft: "#1a9fff0d",
  accentGlow: "#1a9fff30",
  teal:       "#00c8d4",
  tealSoft:   "#00c8d40d",
  orange:     "#f06a28",
  gold:       "#c8a050",
  purple:     "#7c5cfc",
  purpleSoft: "#7c5cfc12",
  text:       "#dde4f0",
  textSub:    "#6a7898",
  textDim:    "#2e3858",
  success:    "#0fb97e",
  warning:    "#f0a030",
  danger:     "#e84040",
  green:      "#3ebd6e",
};

const GAMES = [
  { id:1, title:"Elden Ring",         studio:"FromSoftware",   genre:"Action RPG",   price:499, orig:699, disc:29, rating:9.8, reviews:"Çok Olumlu", reviewCount:"320K", tags:["Açık Dünya","Soulslike","Fantastik"], c1:"#7a3c10", c2:"#2e1204", badgeType:"tr",   desc:"Yüzyılın açık dünya RPG'si.", players:"124K", featured:true },
  { id:2, title:"Cyberpunk 2077",     studio:"CD Projekt Red", genre:"Action RPG",   price:299, orig:429, disc:30, rating:8.7, reviews:"Çok Olumlu", reviewCount:"490K", tags:["Siberpunk","Açık Dünya"],            c1:"#c8a020", c2:"#3a1e00", badgeType:"hot",  players:"98K"  },
  { id:3, title:"God of War",         studio:"Santa Monica",   genre:"Adventure",    price:349, orig:499, disc:30, rating:9.5, reviews:"Çok Olumlu", reviewCount:"210K", tags:["Mitoloji","Dövüş","Hikaye"],         c1:"#1a5c8a", c2:"#5e1010", badgeType:"tr",   players:"76K"  },
  { id:4, title:"Baldur's Gate 3",    studio:"Larian Studios", genre:"RPG",          price:449, orig:599, disc:25, rating:9.6, reviews:"Çok Olumlu", reviewCount:"380K", tags:["D&D","Strateji","Çok Oyunculu"],    c1:"#3d5a8a", c2:"#1a2d4a", badgeType:"new",  players:"88K"  },
  { id:5, title:"The Witcher 3",      studio:"CD Projekt Red", genre:"RPG",          price:179, orig:299, disc:40, rating:9.4, reviews:"Çok Olumlu", reviewCount:"570K", tags:["Açık Dünya","Fantastik"],            c1:"#2d6a44", c2:"#1a3d25", badgeType:"sale", players:"52K"  },
  { id:6, title:"Hades",              studio:"Supergiant",     genre:"Roguelike",    price:129, orig:199, disc:35, rating:9.3, reviews:"Çok Olumlu", reviewCount:"180K", tags:["Roguelike","Aksiyon","Mitoloji"],   c1:"#8b1a3a", c2:"#3a0d1a", badgeType:"tr",   players:"41K"  },
  { id:7, title:"Hollow Knight",      studio:"Team Cherry",    genre:"Metroidvania", price:89,  orig:149, disc:40, rating:9.5, reviews:"Çok Olumlu", reviewCount:"240K", tags:["Platform","Zor","Keşif"],            c1:"#2a3a5a", c2:"#0f1a2a", badgeType:"sale", players:"35K"  },
  { id:8, title:"Deep Rock Galactic", studio:"Ghost Ship",     genre:"Co-op",        price:149, orig:199, disc:25, rating:9.7, reviews:"Çok Olumlu", reviewCount:"160K", tags:["Co-op","Uzay","FPS"],               c1:"#5a3a1a", c2:"#2a1a0a", badgeType:"hot",  players:"63K"  },
];

const FREE_GAMES = [
  { id:10, title:"Destiny 2",    studio:"Bungie",  genre:"FPS",           c1:"#2a3a6a", c2:"#0f1a3a", endsIn:"3 gün" },
  { id:11, title:"Apex Legends", studio:"Respawn", genre:"Battle Royale", c1:"#6a2a1a", c2:"#2a0f0a", endsIn:"5 gün" },
];

const FRIENDS_PLAYING = [
  { name:"Mert K.",  game:"Elden Ring",     av:"MK", since:"2sa",  c1:"#7a3c10", c2:"#2e1204" },
  { name:"Ayşe T.",  game:"Cyberpunk 2077", av:"AT", since:"45dk", c1:"#c8a020", c2:"#3a1e00" },
  { name:"Burak S.", game:"God of War",     av:"BS", since:"1sa",  c1:"#1a5c8a", c2:"#5e1010" },
];

const FRIENDS_LIST = [
  { name:"Mert K.",   status:"online",  game:"Elden Ring",     av:"MK" },
  { name:"Ayşe T.",   status:"online",  game:"Cyberpunk 2077", av:"AT" },
  { name:"Can D.",    status:"away",    game:"2 saat önce",    av:"CD" },
  { name:"Zeynep A.", status:"offline", game:"Çevrimdışı",     av:"ZA" },
  { name:"Burak S.",  status:"online",  game:"God of War",     av:"BS" },
  { name:"Emir Y.",   status:"online",  game:"Hades",          av:"EY" },
];

const CATEGORIES = [
  { id:"all",      label:"Tümü",       icon: Layers   },
  { id:"action",   label:"Aksiyon",    icon: Swords   },
  { id:"rpg",      label:"RPG",        icon: Crown    },
  { id:"sale",     label:"İndirimler", icon: Tag      },
  { id:"free",     label:"Ücretsiz",   icon: Gift     },
  { id:"new",      label:"Yeni Çıkan", icon: Sparkles },
  { id:"trending", label:"Trend",      icon: Flame    },
];

const BADGE = {
  tr:   { bg: T.teal,   text: T.bg,   label:"TR FİYATI" },
  hot:  { bg: T.orange, text: "#fff", label:"TREND"     },
  new:  { bg: T.purple, text: "#fff", label:"YENİ"      },
  sale: { bg: T.danger, text: "#fff", label:"İNDİRİM"   },
};

const REVIEW_COLOR = { "Çok Olumlu": T.green, "Olumlu": T.warning, "Karışık": "#aaa" };
const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const SYNC_STEPS = ["Steam bağlantısı kuruluyor...","Kütüphane taranıyor...","Oyunlar içe aktarılıyor...","Veri Türkiye'de yerelleştiriliyor...","Tamamlandı!"];

export default function OyuncuPlatformu() {
  const [user,          setUser]          = useState(null);
  const [page,          setPage]          = useState("main");
  const [selectedGame,  setSelectedGame]  = useState(null);
  const [selectedFriend,setSelectedFriend]= useState(null);
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [section,       setSection]       = useState("store");
  const [collapsed,     setCollapsed]     = useState(false);
  const [friendsOpen,   setFriendsOpen]   = useState(true);
  const [category,      setCategory]      = useState("all");
  const [syncOpen,      setSyncOpen]      = useState(false);
  const [syncing,       setSyncing]       = useState(false);
  const [syncStep,      setSyncStep]      = useState(0);
  const [cart,          setCart]          = useState([]);
  const [wish,          setWish]          = useState([]);
  const [query,         setQuery]         = useState("");
  const [hovCard,       setHovCard]       = useState(null);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel  = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(l);
  }, []);

  const toggleCart = id => setCart(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleWish = id => setWish(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const goGame   = (game) => { setSelectedGame(game);     setPage("gameDetail");    };
  const goFriend = (name) => { setSelectedFriend(name);   setPage("friendProfile"); };

  if (!user) return <AuthPage onLogin={(u) => setUser(u)} />;
  if (page === "gameDetail")    return <GameDetailPage game={selectedGame} onBack={() => setPage("main")} cart={cart} wish={wish} toggleCart={toggleCart} toggleWish={toggleWish} />;
  if (page === "friendList")    return <FriendListPage onBack={() => setPage("main")} onFriendClick={goFriend} />;
  if (page === "friendProfile") return <FriendProfilePage friendName={selectedFriend} onBack={() => setPage("friendList")} onGameClick={goGame} />;

  const startSync = () => {
    setSyncing(true); setSyncStep(0);
    let s = 0;
    const iv = setInterval(() => {
      s++; setSyncStep(s);
      if (s >= SYNC_STEPS.length - 1) {
        clearInterval(iv);
        setTimeout(() => { setSyncing(false); setSyncOpen(false); setSyncStep(0); }, 1800);
      }
    }, 900);
  };

  const filtered = GAMES.filter(g => {
    const q = g.title.toLowerCase().includes(query.toLowerCase()) || g.genre.toLowerCase().includes(query.toLowerCase());
    if (!q) return false;
    if (category === "all")      return true;
    if (category === "action")   return ["Action RPG","Adventure","Co-op"].includes(g.genre);
    if (category === "rpg")      return ["RPG","Action RPG"].includes(g.genre);
    if (category === "sale")     return g.disc >= 35;
    if (category === "new")      return g.badgeType === "new";
    if (category === "trending") return g.badgeType === "hot";
    return true;
  });

  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", background:T.bg, color:T.text, fontFamily:"'Outfit',system-ui,sans-serif", overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:${T.surface}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
        @keyframes shimmer{0%{transform:translateX(-160%)}100%{transform:translateX(260%)}}
        .nb{transition:all .18s;cursor:pointer;border:none;background:none;outline:none;display:flex;align-items:center}
        .nb:hover{background:${T.accentSoft}!important;color:${T.text}!important}
        .pb{transition:all .18s cubic-bezier(.4,0,.2,1);cursor:pointer;border:none;outline:none}
        .pb:hover{filter:brightness(1.1);transform:translateY(-1px)}
        .pb:active{transform:scale(.97)}
        .gc{transition:transform .22s cubic-bezier(.4,0,.2,1),box-shadow .22s,border-color .22s;cursor:pointer}
        .gc:hover{transform:translateY(-5px)}
        .fr{transition:background .13s;cursor:pointer;border-radius:8px}
        .fr:hover{background:${T.border}50!important}
        .catbtn{transition:all .18s;cursor:pointer;border:none;outline:none}
        input::placeholder{color:${T.textSub}}
        input{caret-color:${T.accent}}
        .sf{animation:fadeUp .38s ease}
      `}</style>

      {/* ═══ LEFT SIDEBAR ═══ */}
      <aside style={{ width:collapsed?68:220, minWidth:collapsed?68:220, height:"100vh", background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", overflow:"hidden", transition:"width .3s cubic-bezier(.4,0,.2,1),min-width .3s cubic-bezier(.4,0,.2,1)" }}>
        <div style={{ padding:"16px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:collapsed?"center":"space-between", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, overflow:"hidden", minWidth:0 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${T.accent},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:collapsed?"pointer":"default" }}
              onClick={() => { if (collapsed) setCollapsed(false); }}>
              <Gamepad2 size={18} color="#fff" />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontWeight:800, fontSize:14, letterSpacing:".05em" }}>OYUNCU</div>
                <div style={{ fontSize:8, color:T.accent, letterSpacing:".18em", fontWeight:700, marginTop:1 }}>PLATFORMU TR</div>
              </div>
            )}
          </div>
          <button className="nb" onClick={() => setCollapsed(p=>!p)} style={{ borderRadius:8, padding:"4px", color:T.textSub, flexShrink:0, display:collapsed?"none":"flex" }}>
            <PanelLeftClose size={15} />
          </button>
        </div>

        <nav style={{ padding:"12px 8px" }}>
          {[
            { id:"store",     icon:Store,    label:"Mağaza"     },
            { id:"library",   icon:BookOpen, label:"Kütüphane"  },
            { id:"downloads", icon:Download, label:"İndirmeler", dot:true },
            { id:"community", icon:Users,    label:"Topluluk"   },
            { id:"profile",   icon:User,     label:"Profil"     },
          ].map(({ id, icon:Icon, label, dot }) => {
            const active = section === id;
            return (
              <button key={id} className="nb" onClick={() => setSection(id)} style={{ width:"100%", padding:collapsed?"10px 0":"9px 11px", borderRadius:9, marginBottom:2, background:active?T.accentSoft:"transparent", color:active?T.accent:T.textSub, fontWeight:active?700:400, fontSize:13, borderLeft:collapsed?"none":`3px solid ${active?T.accent:"transparent"}`, justifyContent:collapsed?"center":"flex-start", gap:10 }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <Icon size={16} />
                  {dot && <div style={{ position:"absolute", top:-2, right:-2, width:6, height:6, borderRadius:"50%", background:T.warning, border:`2px solid ${T.surface}` }} />}
                </div>
                {!collapsed && <span style={{ flex:1, textAlign:"left" }}>{label}</span>}
                {!collapsed && active && <ChevronRight size={11} style={{ opacity:.4 }} />}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div style={{ padding:"0 8px", marginTop:4 }}>
            <div style={{ background:"linear-gradient(135deg,#10202e,#182840)", borderRadius:11, padding:"13px", border:"1px solid #2a475e" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#66c0f4", animation:"pulse 2s infinite" }} />
                <span style={{ fontSize:9, color:"#c7d5e0", fontWeight:800, letterSpacing:".1em" }}>STEAM ENTEGRASYONU</span>
              </div>
              <button className="pb" onClick={() => setSyncOpen(true)} style={{ width:"100%", padding:"8px 0", borderRadius:8, background:"rgba(102,192,244,.08)", border:"1px solid rgba(102,192,244,.25)", color:"#c7d5e0", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:6, fontFamily:"inherit" }}>
                <RefreshCw size={12} /> Steam Sync
              </button>
            </div>
          </div>
        )}
        {collapsed && (
          <button className="nb pb" onClick={() => setSyncOpen(true)} style={{ justifyContent:"center", width:"100%", padding:"10px 0", color:"#66c0f4", marginTop:8 }}>
            <RefreshCw size={17} />
          </button>
        )}

        <div style={{ flex:1 }} />

        <div style={{ padding:"0 8px 10px" }}>
          {!collapsed ? (
            <>
              <div style={{ background:"#061510", border:"1px solid #10301a", borderRadius:9, padding:"9px 11px", marginBottom:6 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}><Database size={9} color={T.success} /><span style={{ fontSize:8, color:T.success, fontWeight:800, letterSpacing:".08em" }}>VERİ MERKEZİ</span></div>
                <div style={{ fontSize:11, color:"#34d399", fontWeight:700 }}>Türkiye · İstanbul</div>
                <div style={{ fontSize:9, color:T.textSub, marginTop:1 }}>KVKK & BTK Uyumlu</div>
              </div>
              <div style={{ background:"#060c18", border:`1px solid ${T.border}`, borderRadius:9, padding:"9px 11px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}><Shield size={9} color={T.teal} /><span style={{ fontSize:8, color:T.teal, fontWeight:800, letterSpacing:".08em" }}>YAŞ SINIRI</span></div>
                <div style={{ fontSize:11, color:"#67e8f9", fontWeight:700 }}>Yerel Onaylı · RTÜK</div>
                <div style={{ fontSize:9, color:T.textSub, marginTop:1 }}>Temsilci Kayıtlı</div>
              </div>
            </>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
              <div title="Veri Merkezi" style={{ width:36, height:36, borderRadius:9, background:"#061510", border:"1px solid #10301a", display:"flex", alignItems:"center", justifyContent:"center" }}><Database size={15} color={T.success} /></div>
              <div title="Yaş Sınırı: RTÜK" style={{ width:36, height:36, borderRadius:9, background:"#060c18", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}><Shield size={15} color={T.teal} /></div>
            </div>
          )}
        </div>

        <button className="nb" style={{ padding:"10px 0", color:T.textSub, fontSize:11, width:"100%", borderRadius:0, justifyContent:"center", gap:7, borderTop:`1px solid ${T.border}` }}>
          <Settings size={13} />{!collapsed && " Ayarlar"}
        </button>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* TOPBAR */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 20px", borderBottom:`1px solid ${T.border}`, background:`${T.surface}f0`, backdropFilter:"blur(12px)", flexShrink:0 }}>
          <div style={{ flex:1, maxWidth:420, display:"flex", alignItems:"center", background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:"8px 13px", gap:9 }}>
            <Search size={14} color={T.textSub} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Oyun veya yayıncı ara..." style={{ background:"none", border:"none", outline:"none", color:T.text, fontSize:13, flex:1, fontFamily:"inherit" }} />
            {query && <X size={12} color={T.textSub} style={{ cursor:"pointer" }} onClick={() => setQuery("")} />}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginLeft:"auto" }}>
            {cart.length > 0 && (
              <div style={{ position:"relative", cursor:"pointer" }}>
                <ShoppingCart size={17} color={T.textSub} />
                <div style={{ position:"absolute", top:-5, right:-5, background:T.accent, color:T.bg, borderRadius:"50%", width:14, height:14, fontSize:8, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{cart.length}</div>
              </div>
            )}
            <div style={{ position:"relative" }}>
              <Bell size={17} color={showNotifs?T.accent:T.textSub} style={{ cursor:"pointer" }} onClick={() => setShowNotifs(p=>!p)} />
              <div style={{ position:"absolute", top:-3, right:-3, width:6, height:6, borderRadius:"50%", background:T.orange, border:`2px solid ${T.surface}` }} />
              {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
            </div>
            <Users size={17} color={friendsOpen?T.accent:T.textSub} style={{ cursor:"pointer" }} onClick={() => setFriendsOpen(p=>!p)} />
            <div style={{ display:"flex", alignItems:"center", gap:8, background:T.bg, border:`1px solid ${T.border}`, borderRadius:20, padding:"4px 12px 4px 4px", cursor:"pointer" }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:T.bg }}>U</div>
              <span style={{ fontSize:12, fontWeight:600 }}>Umut</span>
              <div style={{ width:6, height:6, borderRadius:"50%", background:T.success }} />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, overflowY:"auto", display:"flex" }}>
          <div style={{ flex:1, minWidth:0 }}>

            {/* ══ STORE ══ */}
            {section === "store" && (
              <div className="sf">
                {/* HERO */}
                <div style={{ position:"relative", height:380, overflow:"hidden", cursor:"pointer" }} onClick={() => goGame(GAMES[0])}>
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(125deg,${GAMES[0].c2} 0%,${GAMES[0].c1} 55%,#1a0800 100%)` }} />
                  <div style={{ position:"absolute", inset:0, opacity:.08, backgroundImage:NOISE, backgroundSize:"128px" }} />
                  <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px)" }} />
                  <div style={{ position:"absolute", right:"-5%", top:"5%", width:"55%", height:"90%", borderRadius:"50%", background:`radial-gradient(ellipse,${GAMES[0].c1}a0 0%,transparent 65%)` }} />
                  <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
                    <div style={{ position:"absolute", top:0, width:"30%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)", animation:"shimmer 6s ease-in-out infinite", animationDelay:"2s" }} />
                  </div>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:120, background:`linear-gradient(to top,${T.bg},transparent)` }} />
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(14,16,22,.95) 30%,rgba(14,16,22,.35) 60%,transparent 100%)" }} />
                  <div style={{ position:"absolute", top:20, right:20, display:"flex", gap:10 }}>
                    <div style={{ background:"rgba(14,16,22,.8)", backdropFilter:"blur(16px)", border:`1px solid ${T.border}`, borderRadius:12, padding:"10px 16px", textAlign:"center" }}>
                      <div style={{ fontSize:8, color:T.textSub, letterSpacing:".1em", marginBottom:3 }}>METACRITIC</div>
                      <div style={{ fontSize:22, fontWeight:900, color:T.green }}>96</div>
                    </div>
                    <div style={{ background:"rgba(14,16,22,.8)", backdropFilter:"blur(16px)", border:`1px solid ${T.border}`, borderRadius:12, padding:"10px 16px", textAlign:"center" }}>
                      <div style={{ fontSize:8, color:T.textSub, letterSpacing:".1em", marginBottom:3 }}>ŞU AN OYNUYOR</div>
                      <div style={{ fontSize:18, fontWeight:900, color:T.text }}>{GAMES[0].players}</div>
                    </div>
                  </div>
                  <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"32px 36px" }}>
                    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:`${T.accent}18`, border:`1px solid ${T.accent}35`, borderRadius:20, padding:"4px 13px", marginBottom:14, width:"fit-content" }}>
                      <Zap size={10} color={T.accent} />
                      <span style={{ fontSize:9, color:T.accent, fontWeight:800, letterSpacing:".12em" }}>HAFTANIN ÖZEL OYUNU</span>
                    </div>
                    <h1 style={{ fontSize:50, fontWeight:900, letterSpacing:"-.03em", lineHeight:.92, marginBottom:8 }}>{GAMES[0].title}</h1>
                    <p style={{ color:T.textSub, fontSize:13, marginBottom:16 }}>{GAMES[0].studio} · {GAMES[0].genre}</p>
                    <div style={{ display:"flex", gap:8, marginBottom:22 }}>
                      {GAMES[0].tags.map(t => <span key={t} style={{ fontSize:11, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", borderRadius:5, padding:"3px 9px", color:"rgba(221,228,240,.6)" }}>{t}</span>)}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <button className="pb" onClick={e => { e.stopPropagation(); toggleCart(GAMES[0].id); }} style={{ padding:"12px 28px", borderRadius:10, fontWeight:800, fontSize:14, fontFamily:"inherit", background:cart.includes(GAMES[0].id)?T.success:T.accent, color:T.bg, boxShadow:`0 0 28px ${cart.includes(GAMES[0].id)?T.success+"44":T.accentGlow}` }}>
                        {cart.includes(GAMES[0].id) ? "✓ Sepette" : "Hemen Satın Al"}
                      </button>
                      <button className="pb" style={{ padding:"12px 18px", borderRadius:10, background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.12)", color:T.text, fontWeight:600, fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", gap:7 }}>
                        <Play size={13} fill={T.text} /> Fragman
                      </button>
                      <div style={{ marginLeft:"auto", textAlign:"right" }}>
                        <div style={{ display:"inline-block", background:`${T.danger}20`, border:`1px solid ${T.danger}40`, borderRadius:6, padding:"3px 9px", color:T.danger, fontSize:10, fontWeight:800, marginBottom:4 }}>%{GAMES[0].disc} İNDİRİM</div>
                        <div style={{ display:"flex", alignItems:"baseline", gap:7, justifyContent:"flex-end" }}>
                          <span style={{ color:T.textSub, textDecoration:"line-through", fontSize:13 }}>{GAMES[0].orig} ₺</span>
                          <span style={{ fontSize:28, fontWeight:900, color:T.gold }}>{GAMES[0].price} ₺</span>
                        </div>
                        <div style={{ fontSize:8, color:T.teal, fontWeight:800, letterSpacing:".1em" }}>TÜRKİYE ÖZEL FİYATI</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ padding:"0 20px 32px" }}>
                  {/* Arkadaşlar ne oynuyor */}
                  <div style={{ marginTop:24, marginBottom:28 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                      <Radio size={14} color={T.orange} />
                      <span style={{ fontWeight:800, fontSize:15 }}>Arkadaşların Şu An Oynuyor</span>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:T.success, animation:"pulse 1.5s infinite", marginLeft:2 }} />
                    </div>
                    <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:6 }}>
                      {FRIENDS_PLAYING.map(f => (
                        <div key={f.name} className="gc" onClick={() => goFriend(f.name)} style={{ flexShrink:0, width:200, background:T.surface, borderRadius:13, border:`1px solid ${T.border}`, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,.3)" }}>
                          <div style={{ height:80, background:`linear-gradient(135deg,${f.c2},${f.c1})`, position:"relative" }}>
                            <div style={{ position:"absolute", inset:0, opacity:.1, backgroundImage:NOISE, backgroundSize:"64px" }} />
                            <div style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)", borderRadius:6, padding:"2px 7px", display:"flex", alignItems:"center", gap:4 }}>
                              <div style={{ width:5, height:5, borderRadius:"50%", background:T.success }} />
                              <span style={{ fontSize:9, color:"#fff", fontWeight:700 }}>CANLI</span>
                            </div>
                          </div>
                          <div style={{ padding:"10px 12px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent}40,${T.purple}40)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, flexShrink:0, border:`1px solid ${T.borderHi}` }}>{f.av}</div>
                              <div>
                                <div style={{ fontSize:12, fontWeight:700 }}>{f.name}</div>
                                <div style={{ fontSize:10, color:T.teal, fontWeight:500 }}>{f.game}</div>
                              </div>
                            </div>
                            <div style={{ fontSize:9, color:T.textSub, marginTop:7 }}>{f.since} süredir oynuyor</div>
                          </div>
                        </div>
                      ))}
                      <div className="gc" style={{ flexShrink:0, width:180, background:T.surface, borderRadius:13, border:`2px dashed ${T.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, padding:"20px", cursor:"pointer" }}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:T.accentSoft, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <Users size={16} color={T.accent} />
                        </div>
                        <div style={{ fontSize:12, color:T.textSub, textAlign:"center", lineHeight:1.4 }}>Arkadaş Davet Et</div>
                      </div>
                    </div>
                  </div>

                  {/* Ücretsiz */}
                  <div style={{ marginBottom:28 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <Gift size={14} color={T.purple} />
                        <span style={{ fontWeight:800, fontSize:15 }}>Şu An Ücretsiz</span>
                        <span style={{ fontSize:11, background:T.purpleSoft, border:`1px solid ${T.purple}40`, color:T.purple, borderRadius:6, padding:"2px 8px", fontWeight:700 }}>Epic Tarzı</span>
                      </div>
                      <button style={{ fontSize:12, color:T.textSub, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"inherit" }}>
                        Tümünü Gör <ChevronRight size={12} />
                      </button>
                    </div>
                    <div style={{ display:"flex", gap:12 }}>
                      {FREE_GAMES.map(g => (
                        <div key={g.id} className="gc" style={{ flex:1, background:T.surface, borderRadius:13, border:`1px solid ${T.border}`, overflow:"hidden", boxShadow:"0 4px 16px rgba(0,0,0,.3)" }}>
                          <div style={{ height:110, background:`linear-gradient(135deg,${g.c2},${g.c1})`, position:"relative" }}>
                            <div style={{ position:"absolute", inset:0, opacity:.09, backgroundImage:NOISE, backgroundSize:"64px" }} />
                            <div style={{ position:"absolute", top:10, left:10, background:T.purple, color:"#fff", borderRadius:6, padding:"3px 9px", fontSize:9, fontWeight:900 }}>ÜCRETSİZ</div>
                            <div style={{ position:"absolute", bottom:10, right:10, background:"rgba(0,0,0,.6)", borderRadius:6, padding:"3px 8px", display:"flex", alignItems:"center", gap:4 }}>
                              <Clock size={9} color="#fff" />
                              <span style={{ fontSize:9, color:"#fff", fontWeight:700 }}>Bitiş: {g.endsIn}</span>
                            </div>
                          </div>
                          <div style={{ padding:"10px 14px 13px" }}>
                            <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{g.title}</div>
                            <div style={{ fontSize:10, color:T.textSub, marginBottom:10 }}>{g.studio} · {g.genre}</div>
                            <button className="pb" style={{ width:"100%", padding:"8px", borderRadius:8, background:T.purple, color:"#fff", fontWeight:700, fontSize:12, fontFamily:"inherit" }}>Ücretsiz Al</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kategori + Grid */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:4 }}>
                      {CATEGORIES.map(({ id, label, icon:Icon }) => {
                        const active = category === id;
                        return (
                          <button key={id} className="catbtn" onClick={() => setCategory(id)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 13px", borderRadius:9, border:`1px solid ${active?T.accent+"50":T.border}`, background:active?T.accentSoft:T.surface, color:active?T.accent:T.textSub, fontWeight:active?700:500, fontSize:12, whiteSpace:"nowrap", fontFamily:"inherit" }}>
                            <Icon size={13} />{label}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
                      <h2 style={{ fontSize:18, fontWeight:800 }}>{query?`"${query}" Sonuçları`:"Tüm Oyunlar"}</h2>
                      <span style={{ fontSize:12, color:T.textSub }}>{filtered.length} oyun</span>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
                      {filtered.map((game, i) => {
                        const bc     = BADGE[game.badgeType];
                        const inCart = cart.includes(game.id);
                        const inWish = wish.includes(game.id);
                        const hov    = hovCard === game.id;
                        const rc     = REVIEW_COLOR[game.reviews] || T.textSub;
                        return (
                          <div key={game.id} className="gc"
                            onMouseEnter={() => setHovCard(game.id)}
                            onMouseLeave={() => setHovCard(null)}
                            onClick={() => goGame(game)}
                            style={{ borderRadius:14, overflow:"hidden", background:T.surface, border:`1px solid ${hov?T.borderHi:T.border}`, animation:`fadeUp .42s ease both`, animationDelay:`${i*.05}s`, boxShadow:hov?`0 14px 40px rgba(0,0,0,.55),0 0 0 1px ${T.borderHi}`:"0 3px 14px rgba(0,0,0,.3)" }}>
                            <div style={{ height:148, position:"relative", background:`linear-gradient(140deg,${game.c2},${game.c1})`, overflow:"hidden" }}>
                              <div style={{ position:"absolute", inset:0, opacity:.09, backgroundImage:NOISE, backgroundSize:"64px" }} />
                              <div style={{ position:"absolute", right:"-15%", top:"-15%", width:"70%", height:"70%", borderRadius:"50%", background:`radial-gradient(circle,${game.c1}cc 0%,transparent 65%)` }} />
                              <div style={{ position:"absolute", top:9, left:9, background:bc.bg, color:bc.text, borderRadius:5, padding:"2px 8px", fontSize:8, fontWeight:900, letterSpacing:".05em" }}>{bc.label}</div>
                              <div style={{ position:"absolute", top:9, right:9, background:"rgba(0,0,0,.6)", backdropFilter:"blur(4px)", borderRadius:6, padding:"2px 7px", fontSize:9, fontWeight:800, color:"#fff" }}>-%{game.disc}</div>
                              <div style={{ position:"absolute", inset:0, background:"rgba(14,16,22,.88)", backdropFilter:"blur(6px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, opacity:hov?1:0, transition:"opacity .2s", pointerEvents:hov?"auto":"none" }}>
                                <button className="pb" onClick={e => { e.stopPropagation(); toggleCart(game.id); }} style={{ padding:"8px 0", borderRadius:8, fontWeight:700, fontSize:13, fontFamily:"inherit", background:inCart?T.success:T.accent, color:T.bg, width:"76%", boxShadow:inCart?`0 0 14px ${T.success}44`:`0 0 14px ${T.accentGlow}` }}>
                                  {inCart?"✓ Sepette":`${game.price} ₺ — Ekle`}
                                </button>
                                <button className="pb" onClick={e => { e.stopPropagation(); toggleWish(game.id); }} style={{ padding:"7px 0", borderRadius:8, fontWeight:600, fontSize:11, fontFamily:"inherit", background:inWish?`${T.danger}20`:"rgba(255,255,255,.07)", border:`1px solid ${inWish?T.danger+"45":"rgba(255,255,255,.12)"}`, color:inWish?T.danger:T.textSub, width:"76%", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
                                  <Heart size={11} fill={inWish?T.danger:"none"} />{inWish?"İstek Listesinde":"İstek Listesi"}
                                </button>
                              </div>
                              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"26px 11px 10px", background:"linear-gradient(to top,rgba(14,16,22,.85),transparent)" }}>
                                <div style={{ fontSize:14, fontWeight:800, color:"#fff", lineHeight:1.1 }}>{game.title}</div>
                              </div>
                            </div>
                            <div style={{ padding:"10px 12px 12px" }}>
                              <div style={{ fontSize:10, color:T.textSub, marginBottom:6, fontWeight:500 }}>{game.studio}</div>
                              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:8, padding:"5px 7px", background:`${rc}10`, border:`1px solid ${rc}25`, borderRadius:6 }}>
                                <ThumbsUp size={10} color={rc} />
                                <span style={{ fontSize:10, color:rc, fontWeight:700 }}>{game.reviews}</span>
                                <span style={{ fontSize:9, color:T.textSub }}>({game.reviewCount})</span>
                              </div>
                              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                <div>
                                  <div style={{ fontSize:10, color:T.textSub, textDecoration:"line-through", lineHeight:1 }}>{game.orig} ₺</div>
                                  <div style={{ fontSize:19, fontWeight:900, color:T.gold, lineHeight:1.1 }}>{game.price} <span style={{ fontSize:11, color:T.textSub, fontWeight:400 }}>₺</span></div>
                                  {game.badgeType==="tr" && <div style={{ fontSize:7, color:T.teal, fontWeight:800, letterSpacing:".08em" }}>TR ÖZEL</div>}
                                </div>
                                <button className="pb" onClick={e => { e.stopPropagation(); toggleWish(game.id); }} style={{ background:"none", padding:5, borderRadius:7, color:wish.includes(game.id)?T.danger:T.textDim }}>
                                  <Heart size={15} fill={wish.includes(game.id)?T.danger:"none"} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ LIBRARY ══ */}
            {section === "library" && (
              <div className="sf" style={{ padding:"24px 20px 36px" }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:20 }}>
                  <h2 style={{ fontSize:20, fontWeight:800 }}>Kütüphanem</h2>
                  <span style={{ fontSize:13, color:T.textSub }}>{GAMES.length} oyun</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:11 }}>
                  {GAMES.map((g, i) => {
                    const progs = [78,45,92,12,100,67,30,88];
                    const prog  = progs[i] ?? 50;
                    return (
                      <div key={g.id} className="gc" onClick={() => goGame(g)} style={{ display:"flex", gap:13, padding:"13px", background:T.surface, borderRadius:13, border:`1px solid ${T.border}`, animation:`fadeUp .4s ease both`, animationDelay:`${i*.05}s` }}>
                        <div style={{ width:56, height:56, borderRadius:10, flexShrink:0, background:`linear-gradient(145deg,${g.c2},${g.c1})`, position:"relative", overflow:"hidden" }}>
                          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 70% 30%,rgba(255,255,255,.22),transparent 60%)" }} />
                        </div>
                        <div style={{ flex:1, overflow:"hidden" }}>
                          <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{g.title}</div>
                          <div style={{ fontSize:10, color:T.textSub, marginBottom:7 }}>{g.genre}</div>
                          <div style={{ height:3, background:T.border, borderRadius:2, overflow:"hidden", marginBottom:3 }}>
                            <div style={{ height:"100%", background:prog===100?T.success:T.accent, borderRadius:2, width:`${prog}%` }} />
                          </div>
                          <div style={{ fontSize:9, color:T.textSub }}>{prog===100?"✓ Tamamlandı":`%${prog} tamamlandı`}</div>
                        </div>
                        <Play size={15} color={T.accent} style={{ cursor:"pointer", flexShrink:0, marginTop:4 }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══ COMMUNITY ══ */}
            {section === "community" && (
              <div className="sf" style={{ padding:"24px 20px 36px" }}>
                <h2 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>Topluluk</h2>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:"18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:16 }}><Flame size={14} color={T.orange} /><span style={{ fontWeight:700, fontSize:14 }}>Trend Oyunlar</span></div>
                    {GAMES.slice(0,5).map((g,i) => (
                      <div key={g.id} className="fr" onClick={() => goGame(g)} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 6px", borderRadius:8 }}>
                        <div style={{ width:22, fontWeight:900, fontSize:16, color:i<3?T.gold:T.textDim, textAlign:"center" }}>#{i+1}</div>
                        <div style={{ width:36, height:36, borderRadius:8, background:`linear-gradient(135deg,${g.c2},${g.c1})`, flexShrink:0 }} />
                        <div style={{ flex:1, overflow:"hidden" }}>
                          <div style={{ fontSize:13, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{g.title}</div>
                          <div style={{ fontSize:10, color:T.teal }}>{g.players} oyuncu</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                          <TrendingUp size={11} color={T.green} />
                          <span style={{ fontSize:10, color:T.green, fontWeight:600 }}>+{(Math.random()*15+5).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:T.surface, borderRadius:14, border:`1px solid ${T.border}`, padding:"18px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:16 }}><Users size={14} color={T.accent} /><span style={{ fontWeight:700, fontSize:14 }}>Arkadaş Aktivitesi</span></div>
                    {[
                      { name:"Mert K.",  act:"Elden Ring başardı",          t:"5dk",  Icon:Trophy,    c:T.warning },
                      { name:"Ayşe T.",  act:"Cyberpunk 2077'de 100 saat",  t:"1sa",  Icon:Clock,     c:T.accent  },
                      { name:"Burak S.", act:"God of War'u %100 tamamladı", t:"2sa",  Icon:Award,     c:T.success },
                      { name:"Emir Y.",  act:"Hades'te yeni rekor",         t:"3sa",  Icon:BarChart2, c:T.purple  },
                    ].map(({ name, act, t, Icon, c }) => (
                      <div key={name} className="fr" onClick={() => goFriend(name)} style={{ display:"flex", gap:10, marginBottom:10, padding:"8px 6px" }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:`${c}15`, border:`1px solid ${c}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <Icon size={13} color={c} />
                        </div>
                        <div>
                          <div><span style={{ fontSize:12, fontWeight:700 }}>{name} </span><span style={{ fontSize:11, color:T.textSub }}>{act}</span></div>
                          <div style={{ fontSize:9, color:T.textDim, marginTop:2 }}>{t} önce</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ DOWNLOADS ══ */}
            {section === "downloads" && (
              <div className="sf" style={{ padding:"24px 20px 36px" }}>
                <h2 style={{ fontSize:20, fontWeight:800, marginBottom:20 }}>İndirmeler</h2>
                <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
                  {[
                    { name:"Cyberpunk 2077",  size:"62 GB",  prog:67,  speed:"124 MB/s", eta:"4dk",  c1:"#c8a020", c2:"#3a1e00" },
                    { name:"God of War",      size:"48 GB",  prog:100, speed:"—",        eta:"—",    c1:"#1a5c8a", c2:"#5e1010" },
                    { name:"Baldur's Gate 3", size:"122 GB", prog:23,  speed:"98 MB/s",  eta:"18dk", c1:"#3d5a8a", c2:"#1a2d4a" },
                  ].map((d,i) => (
                    <div key={d.name} style={{ background:T.surface, borderRadius:13, border:`1px solid ${T.border}`, overflow:"hidden", animation:`fadeUp .4s ease both`, animationDelay:`${i*.07}s` }}>
                      <div style={{ height:3, background:`linear-gradient(to right,${d.c2},${d.c1})` }} />
                      <div style={{ padding:"16px 18px" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:13 }}>
                          <div style={{ fontWeight:700, fontSize:14 }}>{d.name}</div>
                          <div style={{ display:"flex", gap:14, fontSize:12, alignItems:"center" }}>
                            <span style={{ color:T.textSub }}>{d.size}</span>
                            {d.prog<100 && <><span style={{ color:T.accent, fontWeight:600 }}>↓ {d.speed}</span><span style={{ color:T.textSub, display:"flex", alignItems:"center", gap:3 }}><Clock size={10} />{d.eta}</span></>}
                            {d.prog===100 && <span style={{ color:T.success, fontWeight:700 }}>✓ Hazır</span>}
                          </div>
                        </div>
                        <div style={{ height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:2, width:`${d.prog}%`, background:d.prog===100?T.success:T.accent, boxShadow:d.prog===100?`0 0 10px ${T.success}55`:`0 0 10px ${T.accentGlow}`, transition:"width .5s" }} />
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                          <span style={{ fontSize:10, color:T.textSub }}>{d.prog}%</span>
                          {d.prog<100?<span style={{ fontSize:10, color:T.textSub, cursor:"pointer" }}>Duraklat</span>:<span style={{ fontSize:10, color:T.accent, cursor:"pointer", fontWeight:600 }}>Oyna →</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ PROFILE ══ */}
            {section === "profile" && (
              <div className="sf" style={{ padding:"24px 20px 36px" }}>
                <div style={{ background:`linear-gradient(130deg,${T.surface} 0%,#0d1a2a 100%)`, borderRadius:16, padding:"26px", border:`1px solid ${T.border}`, marginBottom:16, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", right:-40, top:-40, width:260, height:260, borderRadius:"50%", background:`radial-gradient(circle,${T.accent}07 0%,transparent 65%)`, pointerEvents:"none" }} />
                  <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:24 }}>
                    <div style={{ width:74, height:74, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, color:T.bg, boxShadow:`0 0 28px ${T.accentGlow}`, flexShrink:0 }}>U</div>
                    <div>
                      <div style={{ fontSize:22, fontWeight:900, letterSpacing:"-.02em" }}>Umut B.</div>
                      <div style={{ fontSize:13, color:T.textSub, marginTop:2 }}>@umutb0606 · Ankara, Türkiye</div>
                      <div style={{ display:"flex", gap:7, marginTop:9, flexWrap:"wrap" }}>
                        {[{ I:Shield, l:"KVKK Doğrulanmış", c:T.success },{ I:Globe, l:"Yerel Hesap", c:T.teal }].map(({ I, l, c }) => (
                          <div key={l} style={{ display:"inline-flex", alignItems:"center", gap:5, background:`${c}10`, border:`1px solid ${c}28`, borderRadius:11, padding:"3px 10px" }}>
                            <I size={9} color={c} /><span style={{ fontSize:9, color:c, fontWeight:700 }}>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                    {[{ v:"24", l:"Oyun" },{ v:"387", l:"Başarım" },{ v:"1.2K", l:"Saat" },{ v:"48", l:"Arkadaş" }].map(({ v, l }) => (
                      <div key={l} style={{ background:T.bg, borderRadius:11, padding:"14px", border:`1px solid ${T.border}`, textAlign:"center" }}>
                        <div style={{ fontSize:24, fontWeight:900, color:T.gold }}>{v}</div>
                        <div style={{ fontSize:10, color:T.textSub, marginTop:3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:"#0a1525", border:"1px solid #1a2a3a", borderLeft:`3px solid ${T.teal}`, borderRadius:11, padding:"13px 17px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5 }}><AlertCircle size={12} color={T.teal} /><span style={{ fontSize:12, color:T.teal, fontWeight:700 }}>Yasal Bilgilendirme</span></div>
                  <p style={{ fontSize:12, color:T.textSub, lineHeight:1.7 }}>Bu platform 7418 sayılı Kanun kapsamında Türkiye'de yerel temsilcilik ataması yapmıştır. Verileriniz KVKK hükümlerine uygun şekilde Türkiye'deki veri merkezlerinde işlenmektedir. Yasal Temsilci: Oyuncu Platform A.Ş. — İstanbul.</p>
                </div>
              </div>
            )}

          </div>

          {/* ═══ RIGHT FRIENDS PANEL ═══ */}
          {friendsOpen && (
            <div style={{ width:210, minWidth:210, borderLeft:`1px solid ${T.border}`, background:T.surface, display:"flex", flexDirection:"column", overflow:"hidden", flexShrink:0 }}>
              <div style={{ padding:"14px 13px 12px", borderBottom:`1px solid ${T.border}`, cursor:"pointer" }} onClick={() => setPage("friendList")}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <Users size={13} color={T.accent} />
                  <span style={{ fontWeight:800, fontSize:12 }}>Arkadaşlar</span>
                  <div style={{ marginLeft:"auto", background:T.accentSoft, color:T.accent, borderRadius:9, padding:"2px 7px", fontSize:8, fontWeight:800 }}>
                    {FRIENDS_LIST.filter(f=>f.status==="online").length} çevrimiçi
                  </div>
                </div>
              </div>
              <div style={{ flex:1, overflowY:"auto", paddingTop:4 }}>
                {["online","away","offline"].map(status => {
                  const group = FRIENDS_LIST.filter(f => f.status === status);
                  if (!group.length) return null;
                  const label = { online:"Çevrimiçi", away:"Uzakta", offline:"Çevrimdışı" }[status];
                  const sc    = { online:T.success, away:T.warning, offline:T.textDim }[status];
                  return (
                    <div key={status}>
                      <div style={{ padding:"8px 13px 4px", fontSize:8, color:T.textDim, fontWeight:800, letterSpacing:".1em" }}>{label.toUpperCase()}</div>
                      {group.map(f => (
                        <div key={f.name} className="fr" onClick={() => goFriend(f.name)} style={{ padding:"6px 12px", display:"flex", alignItems:"center", gap:9, margin:"0 4px" }}>
                          <div style={{ position:"relative", flexShrink:0 }}>
                            <div style={{ width:30, height:30, borderRadius:"50%", background:f.status==="online"?`linear-gradient(135deg,${T.accent}38,${T.purple}38)`:"#14192e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, border:`1px solid ${f.status==="online"?T.borderHi:T.border}` }}>{f.av}</div>
                            <div style={{ position:"absolute", bottom:1, right:1, width:8, height:8, borderRadius:"50%", background:sc, border:`2px solid ${T.surface}`, ...(f.status==="online"?{animation:"pulse 2.5s infinite"}:{}) }} />
                          </div>
                          <div style={{ flex:1, overflow:"hidden" }}>
                            <div style={{ fontSize:11, fontWeight:600 }}>{f.name}</div>
                            <div style={{ fontSize:9, color:f.status==="online"?T.teal:T.textSub, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.game}</div>
                          </div>
                          {f.status==="online" && <MessageCircle size={12} color={T.textDim} style={{ cursor:"pointer", flexShrink:0 }} />}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div style={{ borderTop:`1px solid ${T.border}`, padding:"12px 12px 11px" }}>
                <div style={{ fontSize:8, color:T.textSub, fontWeight:800, letterSpacing:".1em", marginBottom:11 }}>SON AKTİVİTE</div>
                {[
                  { name:"Mert K.",  act:"Elden Ring bitti",     t:"2dk",  Icon:Trophy,     c:T.warning },
                  { name:"Ayşe T.",  act:"Yeni başarım kazandı", t:"15dk", Icon:Award,      c:T.accent  },
                  { name:"Burak S.", act:"God of War başlattı",  t:"1sa",  Icon:TrendingUp, c:T.success },
                ].map(({ name, act, t, Icon, c }) => (
                  <div key={name} onClick={() => goFriend(name)} style={{ display:"flex", gap:8, marginBottom:10, alignItems:"flex-start", cursor:"pointer" }}>
                    <div style={{ width:24, height:24, borderRadius:7, background:`${c}13`, border:`1px solid ${c}22`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={11} color={c} />
                    </div>
                    <div>
                      <span style={{ fontSize:10, fontWeight:700 }}>{name} </span>
                      <span style={{ fontSize:10, color:T.textSub }}>{act}</span>
                      <div style={{ fontSize:8, color:T.textDim, marginTop:1 }}>{t} önce</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ STEAM SYNC MODAL ═══ */}
      {syncOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.82)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, animation:"fadeIn .2s ease" }}>
          <div style={{ background:T.surface, border:`1px solid ${T.borderHi}`, borderRadius:20, padding:"30px", width:430, maxWidth:"92vw", animation:"fadeUp .25s ease", boxShadow:"0 40px 80px rgba(0,0,0,.65)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:13 }}>
                <div style={{ width:46, height:46, borderRadius:13, background:"linear-gradient(135deg,#1b2838,#2a475e)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #2a475e" }}>
                  <RefreshCw size={21} color="#c7d5e0" style={syncing?{animation:"spin 1s linear infinite"}:{}} />
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:17 }}>Steam Sync</div>
                  <div style={{ fontSize:11, color:T.textSub, marginTop:2 }}>Kütüphanenizi içe aktarın</div>
                </div>
              </div>
              <button onClick={() => setSyncOpen(false)} style={{ background:T.cardSolid, border:`1px solid ${T.border}`, cursor:"pointer", color:T.textSub, padding:8, borderRadius:9, display:"flex" }}><X size={15} /></button>
            </div>
            {!syncing && syncStep===0 ? (
              <>
                <div style={{ background:T.cardSolid, borderRadius:13, marginBottom:16, border:`1px solid ${T.border}` }}>
                  {["Steam kütüphanenizi otomatik tarama","Tüm oyunları Türkiye fiyatıyla eşleştirme","Başarım ve ilerleme verilerini aktarma","Tüm veriler yalnızca Türkiye sunucularında"].map((item,i,arr) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 15px", borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none" }}>
                      <CheckCircle size={13} color={T.teal} />
                      <span style={{ fontSize:12, color:T.textSub }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background:"#061510", border:"1px solid #10301a", borderRadius:10, padding:"9px 13px", marginBottom:18, display:"flex", alignItems:"flex-start", gap:8 }}>
                  <Shield size={12} color={T.success} style={{ marginTop:1, flexShrink:0 }} />
                  <span style={{ fontSize:11, color:"#34d399", lineHeight:1.55 }}>Tüm veriler KVKK kapsamında Türkiye'deki veri merkezinde işlenir.</span>
                </div>
                <button className="pb" onClick={startSync} style={{ width:"100%", padding:"13px", borderRadius:12, background:T.accent, color:T.bg, fontWeight:800, fontSize:14, fontFamily:"inherit", boxShadow:`0 0 24px ${T.accentGlow}` }}>Steam Hesabını Bağla</button>
              </>
            ) : (
              <div>
                <div style={{ marginBottom:22 }}>
                  {SYNC_STEPS.map((step,i) => {
                    const done=i<syncStep, active=i===syncStep;
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:13, marginBottom:13 }}>
                        <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, background:done?T.accent:active?T.accentSoft:T.cardSolid, border:active?`2px solid ${T.accent}`:done?"2px solid transparent":`2px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s", boxShadow:done?`0 0 10px ${T.accentGlow}`:"none" }}>
                          {done && <Check size={12} color={T.bg} />}
                          {active && <div style={{ width:7, height:7, borderRadius:"50%", background:T.accent, animation:"pulse 1s infinite" }} />}
                        </div>
                        <span style={{ fontSize:12, fontWeight:active||done?600:400, color:done?T.text:active?T.accent:T.textSub, transition:"all .3s" }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ height:4, background:T.cardSolid, borderRadius:2, overflow:"hidden", border:`1px solid ${T.border}` }}>
                  <div style={{ height:"100%", borderRadius:2, background:syncStep>=SYNC_STEPS.length-1?T.success:T.accent, width:`${(syncStep/(SYNC_STEPS.length-1))*100}%`, transition:"width .8s ease", boxShadow:`0 0 8px ${T.accentGlow}` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}