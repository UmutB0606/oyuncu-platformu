import { useState } from "react";
import {
  ChevronLeft, Star, ThumbsUp, ThumbsDown, Users, Clock,
  ShoppingCart, Heart, Play, Shield, Monitor, Cpu, HardDrive,
  Award, CheckCircle, ChevronDown, ChevronUp, Zap, Globe,
  TrendingUp, MessageCircle
} from "lucide-react";

const T = {
  bg:         "#0e1016",
  surface:    "#13161f",
  card:       "#151822",
  cardSolid:  "#151822",
  border:     "#1e2338",
  borderHi:   "#2d3560",
  accent:     "#1a9fff",
  accentSoft: "#1a9fff0d",
  accentGlow: "#1a9fff30",
  teal:       "#00c8d4",
  gold:       "#c8a050",
  purple:     "#7c5cfc",
  orange:     "#f06a28",
  text:       "#dde4f0",
  textSub:    "#6a7898",
  textDim:    "#2e3858",
  success:    "#0fb97e",
  warning:    "#f0a030",
  danger:     "#e84040",
  green:      "#3ebd6e",
};

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const SCREENSHOTS = [
  { id:1, label:"Açık Dünya" },
  { id:2, label:"Dövüş" },
  { id:3, label:"Boss" },
  { id:4, label:"Karakter" },
  { id:5, label:"Manzara" },
];

const REVIEWS = [
  { user:"KaranlıkSavaşçı", hours:340, rating:"olumlu", text:"Serinin en iyi oyunu. Boss dövüşleri inanılmaz zorlu ama bir o kadar tatmin edici. Açık dünya tasarımı muhteşem.", date:"12 Mart 2024" },
  { user:"EldenLord_TR",    hours:820, rating:"olumlu", text:"800 saat oynadım hâlâ bitmedi. Her köşede yeni bir şey keşfediyorsun. TR fiyatıyla bu kalite başka yerde bulamazsın.", date:"3 Ocak 2024" },
  { user:"CasualGamer35",   hours:45,  rating:"olumsuz", text:"Çok zor, başlangıç için uygun değil. Ama grafikleri güzel.", date:"28 Şubat 2024" },
  { user:"SoulsVeteran",    hours:1200,rating:"olumlu", text:"Masterpiece. FromSoftware her oyunla kendini geçiyor. Lore'u okumak için ayrıca 200 saat harcadım.", date:"5 Nisan 2024" },
];

const ACHIEVEMENTS = [
  { id:1, name:"Elden Lord",        desc:"Oyunu tamamla",                    rare:2.1,  icon:"👑", earned:true  },
  { id:2, name:"Ejderha Katili",    desc:"Tüm ejderha bossları yenik düşür", rare:8.4,  icon:"🐉", earned:true  },
  { id:3, name:"Yenilmez",          desc:"Hiç ölmeden bir boss öldür",       rare:1.2,  icon:"⚔️", earned:false },
  { id:4, name:"Koleksiyoncu",      desc:"500 farklı eşya topla",            rare:15.3, icon:"🗡️", earned:true  },
  { id:5, name:"Gezgin",            desc:"Tüm haritayı keşfet",              rare:22.7, icon:"🗺️", earned:false },
  { id:6, name:"Kahraman",          desc:"10.000 düşman öldür",              rare:34.5, icon:"💀", earned:true  },
];

const SYS_REQ = {
  min: [
    { label:"İşletim Sistemi", value:"Windows 10/11 64-bit" },
    { label:"İşlemci",         value:"Intel Core i5-8600K" },
    { label:"Bellek",          value:"12 GB RAM" },
    { label:"Ekran Kartı",     value:"NVIDIA GTX 1070 8GB" },
    { label:"Depolama",        value:"60 GB SSD" },
  ],
  rec: [
    { label:"İşletim Sistemi", value:"Windows 10/11 64-bit" },
    { label:"İşlemci",         value:"Intel Core i7-8700K" },
    { label:"Bellek",          value:"16 GB RAM" },
    { label:"Ekran Kartı",     value:"NVIDIA GTX 1080 Ti 11GB" },
    { label:"Depolama",        value:"60 GB NVMe SSD" },
  ],
};

export default function GameDetailPage({ game, onBack, onBuyGame, cart, wish, toggleCart, toggleWish }) {
  const [activeShot,    setActiveShot]    = useState(0);
  const [showAchiev,    setShowAchiev]    = useState(false);
  const [showSysReq,    setShowSysReq]    = useState(false);
  const [reviewFilter,  setReviewFilter]  = useState("all");

  if (!game) return null;

  const inCart = cart?.includes(game.id);
  const inWish = wish?.includes(game.id);
  const rc     = game.reviews === "Çok Olumlu" ? T.green : T.warning;
  const earned = ACHIEVEMENTS.filter(a => a.earned).length;

  const filteredReviews = REVIEWS.filter(r => {
    if (reviewFilter === "olumlu")  return r.rating === "olumlu";
    if (reviewFilter === "olumsuz") return r.rating === "olumsuz";
    return true;
  });

  return (
    <div style={{ height:"100vh", width:"100%", background:T.bg, color:T.text, fontFamily:"'Outfit',system-ui,sans-serif", overflowY:"auto" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:${T.surface}}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes shimmer{0%{transform:translateX(-160%)}100%{transform:translateX(260%)}}
        .pb{transition:all .18s;cursor:pointer;border:none;outline:none}
        .pb:hover{filter:brightness(1.1);transform:translateY(-1px)}
        .pb:active{transform:scale(.97)}
        .nb{transition:all .18s;cursor:pointer;border:none;background:none;outline:none;display:flex;align-items:center}
        .nb:hover{background:${T.accentSoft}!important}
        .tag{transition:all .18s;cursor:pointer}
        .tag:hover{border-color:${T.accent}!important;color:${T.accent}!important}
        .sc{transition:all .18s;cursor:pointer;opacity:.7}
        .sc:hover{opacity:1;border-color:${T.borderHi}!important}
        .sc.active{opacity:1}
        .af{animation:fadeUp .4s ease}
      `}</style>

      {/* ═══ HERO ═══ */}
      <div style={{ position:"relative", height:480, overflow:"hidden" }}>
        {/* BG */}
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(125deg,${game.c2} 0%,${game.c1} 55%,#1a0800 100%)` }} />
        <div style={{ position:"absolute", inset:0, opacity:.08, backgroundImage:NOISE, backgroundSize:"128px" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,.03) 3px,rgba(0,0,0,.03) 4px)" }} />
        <div style={{ position:"absolute", right:"-5%", top:"5%", width:"55%", height:"90%", borderRadius:"50%", background:`radial-gradient(ellipse,${game.c1}a0 0%,transparent 65%)` }} />
        <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:0, width:"30%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)", animation:"shimmer 7s ease-in-out infinite" }} />
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, background:`linear-gradient(to top,${T.bg},transparent)` }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(14,16,22,.97) 32%,rgba(14,16,22,.4) 65%,transparent 100%)" }} />

        {/* Back button */}
        <button className="nb" onClick={onBack} style={{ position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:7, background:"rgba(14,16,22,.6)", backdropFilter:"blur(8px)", border:`1px solid ${T.border}`, borderRadius:10, padding:"8px 14px", color:T.textSub, fontSize:13, fontWeight:600, zIndex:10 }}>
          <ChevronLeft size={15} /> Geri Dön
        </button>

        {/* Content */}
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"40px 48px" }}>
          {/* Badge row */}
          <div style={{ display:"flex", gap:8, marginBottom:18 }}>
            <div style={{ background:T.teal, color:T.bg, borderRadius:6, padding:"3px 10px", fontSize:9, fontWeight:900, letterSpacing:".06em" }}>TR FİYATI</div>
            <div style={{ background:`${rc}20`, border:`1px solid ${rc}40`, color:rc, borderRadius:6, padding:"3px 10px", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", gap:5 }}>
              <ThumbsUp size={10} /> {game.reviews}
            </div>
            <div style={{ background:`${T.purple}20`, border:`1px solid ${T.purple}40`, color:T.purple, borderRadius:6, padding:"3px 10px", fontSize:9, fontWeight:800 }}>
              {game.genre}
            </div>
          </div>

          <h1 style={{ fontSize:58, fontWeight:900, letterSpacing:"-.03em", lineHeight:.92, marginBottom:10 }}>{game.title}</h1>
          <p style={{ color:T.textSub, fontSize:14, marginBottom:14, fontWeight:500 }}>{game.studio}</p>

          {/* Tags */}
          <div style={{ display:"flex", gap:7, marginBottom:24, flexWrap:"wrap" }}>
            {(game.tags || []).map(t => <span key={t} className="tag" style={{ fontSize:11, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.1)", borderRadius:6, padding:"4px 10px", color:"rgba(221,228,240,.6)" }}>{t}</span>
            )}
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:20, marginBottom:28 }}>
            {[
              { label:"Oyuncu Puanı", value:game.rating, icon:<Star size={13} color="#f59e0b" fill="#f59e0b" />, c:"#f59e0b" },
              { label:"Şu An Oynuyor", value:game.players, icon:<Users size={13} color={T.teal} />, c:T.teal },
              { label:"Değerlendirme", value:game.reviewCount, icon:<MessageCircle size={13} color={T.accent} />, c:T.accent },
            ].map(({ label, value, icon, c }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                {icon}
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:c }}>{value}</div>
                  <div style={{ fontSize:9, color:T.textSub, fontWeight:600, letterSpacing:".04em" }}>{label.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button className="pb" onClick={() => toggleCart(game.id)} style={{ padding:"13px 32px", borderRadius:12, fontWeight:800, fontSize:15, fontFamily:"inherit", background:inCart ? T.success : T.accent, color:T.bg, boxShadow:`0 0 28px ${inCart ? T.success+"44" : T.accentGlow}`, display:"flex", alignItems:"center", gap:8 }}>
              <ShoppingCart size={16} />
              {inCart ? "✓ Sepette" : `Satın Al — ${game.price} ₺`}
            </button>
            <button className="pb" onClick={() => toggleWish(game.id)} style={{ padding:"13px 16px", borderRadius:12, background:inWish ? `${T.danger}20` : "rgba(255,255,255,.08)", border:`1px solid ${inWish ? T.danger+"45" : "rgba(255,255,255,.13)"}`, color:inWish ? T.danger : T.text, display:"flex", alignItems:"center", gap:7, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
              <Heart size={15} fill={inWish ? T.danger : "none"} />
              {inWish ? "İstek Listesinde" : "İstek Listesi"}
            </button>
            <div style={{ marginLeft:"auto", textAlign:"right" }}>
              <div style={{ display:"inline-block", background:`${T.danger}20`, border:`1px solid ${T.danger}40`, borderRadius:6, padding:"3px 9px", color:T.danger, fontSize:10, fontWeight:800, marginBottom:4 }}>
                %{game.disc} İNDİRİM
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:8, justifyContent:"flex-end" }}>
                <span style={{ color:T.textSub, textDecoration:"line-through", fontSize:14 }}>{game.orig} ₺</span>
                <span style={{ fontSize:30, fontWeight:900, color:T.gold }}>{game.price} ₺</span>
              </div>
              <div style={{ fontSize:9, color:T.teal, fontWeight:800, letterSpacing:".1em" }}>TÜRKİYE ÖZEL FİYATI</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 48px 64px" }}>

        {/* ── SCREENSHOTS ── */}
        <div style={{ marginBottom:40, animation:"fadeUp .4s ease" }}>
          <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16 }}>Ekran Görüntüleri</h2>

          {/* Main screenshot */}
          <div style={{ width:"100%", height:340, borderRadius:16, overflow:"hidden", marginBottom:12, position:"relative", background:`linear-gradient(145deg,${game.c2},${game.c1})`, border:`1px solid ${T.border}` }}>
            <div style={{ position:"absolute", inset:0, opacity:.08, backgroundImage:NOISE, backgroundSize:"128px" }} />
            <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(ellipse at 30% 50%,rgba(255,255,255,.15),transparent 60%)" }} />
            <div style={{ position:"absolute", bottom:16, left:16, background:"rgba(0,0,0,.6)", backdropFilter:"blur(8px)", borderRadius:8, padding:"4px 12px", fontSize:11, color:"rgba(255,255,255,.8)", fontWeight:600 }}>
              {SCREENSHOTS[activeShot].label}
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display:"flex", gap:8 }}>
            {SCREENSHOTS.map((s, i) => (
              <div key={s.id} className={`sc ${activeShot === i ? "active" : ""}`} onClick={() => setActiveShot(i)}
                style={{ flex:1, height:72, borderRadius:10, overflow:"hidden", position:"relative", background:`linear-gradient(145deg,${game.c2},${game.c1})`, border:`2px solid ${activeShot === i ? T.accent : T.border}`, cursor:"pointer" }}>
                <div style={{ position:"absolute", inset:0, opacity:.1, backgroundImage:NOISE, backgroundSize:"64px" }} />
                <div style={{ position:"absolute", inset:0, background: activeShot !== i ? "rgba(0,0,0,.3)" : "transparent", transition:"background .2s" }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24 }}>
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* About */}
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"22px 24px", marginBottom:20 }}>
              <h3 style={{ fontSize:16, fontWeight:800, marginBottom:12 }}>Oyun Hakkında</h3>
              <p style={{ fontSize:13, color:T.textSub, lineHeight:1.8 }}>
                {game.title}, {game.studio} tarafından geliştirilen ve açık dünya mekanikleriyle derin bir dövüş sistemi sunan ödüllü bir {game.genre} oyunudur. Geniş ve gizemli bir dünyada kendi hikayeni yaz, güçlü bossları yenik düşür ve destansı bir maceraya atıl.
              </p>
              <p style={{ fontSize:13, color:T.textSub, lineHeight:1.8, marginTop:12 }}>
                Türkiye'ye özel fiyatlandırma ve KVKK uyumlu veri işleme altyapısıyla güvenle satın al. Tüm DLC içerikleri Türkiye sunucularımızda güvenle saklanır.
              </p>
            </div>

            {/* Achievements */}
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, marginBottom:20, overflow:"hidden" }}>
              <button onClick={() => setShowAchiev(p => !p)} style={{ width:"100%", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", cursor:"pointer", color:T.text, fontFamily:"inherit" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <Award size={16} color={T.gold} />
                  <span style={{ fontSize:16, fontWeight:800 }}>Başarımlar</span>
                  <span style={{ fontSize:12, background:T.accentSoft, color:T.accent, borderRadius:8, padding:"2px 8px", fontWeight:700 }}>{earned}/{ACHIEVEMENTS.length}</span>
                </div>
                {showAchiev ? <ChevronUp size={16} color={T.textSub} /> : <ChevronDown size={16} color={T.textSub} />}
              </button>

              {showAchiev && (
                <div style={{ borderTop:`1px solid ${T.border}`, padding:"8px 16px 16px", animation:"fadeUp .3s ease" }}>
                  {/* Progress bar */}
                  <div style={{ margin:"12px 0 16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:11, color:T.textSub }}>Tamamlanma</span>
                      <span style={{ fontSize:11, color:T.gold, fontWeight:700 }}>%{Math.round(earned/ACHIEVEMENTS.length*100)}</span>
                    </div>
                    <div style={{ height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", background:T.gold, borderRadius:2, width:`${earned/ACHIEVEMENTS.length*100}%` }} />
                    </div>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {ACHIEVEMENTS.map(a => (
                      <div key={a.id} style={{ display:"flex", gap:10, padding:"12px", background:a.earned ? `${T.gold}08` : T.card, border:`1px solid ${a.earned ? T.gold+"30" : T.border}`, borderRadius:12, opacity:a.earned ? 1 : 0.5 }}>
                        <div style={{ fontSize:22, flexShrink:0 }}>{a.icon}</div>
                        <div style={{ flex:1, overflow:"hidden" }}>
                          <div style={{ fontSize:12, fontWeight:700, color:a.earned ? T.text : T.textSub, marginBottom:2 }}>{a.name}</div>
                          <div style={{ fontSize:10, color:T.textSub, marginBottom:4 }}>{a.desc}</div>
                          <div style={{ fontSize:9, color:T.textDim, fontWeight:600 }}>%{a.rare} oyuncu kazandı</div>
                        </div>
                        {a.earned && <CheckCircle size={13} color={T.gold} style={{ flexShrink:0, marginTop:2 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"22px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                <h3 style={{ fontSize:16, fontWeight:800 }}>Kullanıcı Yorumları</h3>
                <div style={{ display:"flex", gap:6 }}>
                  {["all","olumlu","olumsuz"].map(f => (
                    <button key={f} onClick={() => setReviewFilter(f)} style={{ padding:"5px 12px", borderRadius:8, border:`1px solid ${reviewFilter===f ? T.accent+"50" : T.border}`, background:reviewFilter===f ? T.accentSoft : "transparent", color:reviewFilter===f ? T.accent : T.textSub, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                      {f === "all" ? "Tümü" : f === "olumlu" ? "👍 Olumlu" : "👎 Olumsuz"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div style={{ display:"flex", gap:10, marginBottom:20, padding:"14px", background:T.card, borderRadius:12, border:`1px solid ${T.border}` }}>
                <div style={{ textAlign:"center", padding:"0 16px 0 0", borderRight:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:36, fontWeight:900, color:T.green }}>94%</div>
                  <div style={{ fontSize:10, color:T.textSub, fontWeight:600 }}>OLUMLU</div>
                </div>
                <div style={{ flex:1, paddingLeft:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                    <ThumbsUp size={13} color={T.green} />
                    <div style={{ flex:1, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", background:T.green, width:"94%", borderRadius:2 }} />
                    </div>
                    <span style={{ fontSize:11, color:T.green, fontWeight:700 }}>94%</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <ThumbsDown size={13} color={T.danger} />
                    <div style={{ flex:1, height:4, background:T.border, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", background:T.danger, width:"6%", borderRadius:2 }} />
                    </div>
                    <span style={{ fontSize:11, color:T.danger, fontWeight:700 }}>6%</span>
                  </div>
                  <div style={{ fontSize:11, color:T.textSub, marginTop:8 }}>{game.reviewCount} değerlendirme</div>
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {filteredReviews.map((r, i) => (
                  <div key={i} style={{ padding:"14px 16px", background:T.card, border:`1px solid ${T.border}`, borderRadius:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent}40,${T.purple}40)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800 }}>
                        {r.user[0]}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700 }}>{r.user}</div>
                        <div style={{ fontSize:10, color:T.textSub }}>{r.hours} saat · {r.date}</div>
                      </div>
                      <div style={{ marginLeft:"auto" }}>
                        {r.rating === "olumlu"
                          ? <div style={{ display:"flex", alignItems:"center", gap:4, color:T.green, fontSize:11, fontWeight:700 }}><ThumbsUp size={12} /> Olumlu</div>
                          : <div style={{ display:"flex", alignItems:"center", gap:4, color:T.danger, fontSize:11, fontWeight:700 }}><ThumbsDown size={12} /> Olumsuz</div>
                        }
                      </div>
                    </div>
                    <p style={{ fontSize:12, color:T.textSub, lineHeight:1.7 }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>
            {/* Buy box */}
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, padding:"20px", marginBottom:16, position:"sticky", top:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
                <Star size={13} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize:13, fontWeight:700, color:"#f59e0b" }}>{game.rating}</span>
                <span style={{ fontSize:11, color:T.textSub }}>· {game.genre}</span>
              </div>

              <div style={{ marginBottom:16 }}>
                <div style={{ display:"inline-block", background:`${T.danger}20`, border:`1px solid ${T.danger}40`, borderRadius:6, padding:"3px 9px", color:T.danger, fontSize:10, fontWeight:800, marginBottom:8 }}>
                  %{game.disc} İNDİRİM
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <span style={{ color:T.textSub, textDecoration:"line-through", fontSize:13 }}>{game.orig} ₺</span>
                  <span style={{ fontSize:28, fontWeight:900, color:T.gold }}>{game.price} ₺</span>
                </div>
                <div style={{ fontSize:9, color:T.teal, fontWeight:800, letterSpacing:".1em", marginTop:2 }}>TÜRKİYE ÖZEL FİYATI</div>
              </div>

              <button className="pb" onClick={() => toggleCart(game.id)} style={{ width:"100%", padding:"12px", borderRadius:11, fontWeight:800, fontSize:14, fontFamily:"inherit", background:inCart ? T.success : T.accent, color:T.bg, boxShadow:`0 0 20px ${inCart ? T.success+"44" : T.accentGlow}`, marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                <ShoppingCart size={15} />
                {inCart ? "✓ Sepette" : "Sepete Ekle"}
              </button>
              <button className="pb" onClick={() => toggleWish(game.id)} style={{ width:"100%", padding:"11px", borderRadius:11, fontWeight:600, fontSize:13, fontFamily:"inherit", background:inWish ? `${T.danger}15` : "transparent", border:`1px solid ${inWish ? T.danger+"40" : T.border}`, color:inWish ? T.danger : T.textSub, display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                <Heart size={14} fill={inWish ? T.danger : "none"} />
                {inWish ? "İstek Listesinden Çıkar" : "İstek Listesine Ekle"}
              </button>

              {/* Info list */}
              <div style={{ marginTop:18, borderTop:`1px solid ${T.border}`, paddingTop:16 }}>
                {[
                  { label:"Geliştirici",   value:game.studio },
                  { label:"Tür",           value:game.genre  },
                  { label:"Çıkış Tarihi",  value:"25 Şubat 2022" },
                  { label:"Dil Desteği",   value:"Türkçe dahil 16 dil" },
                  { label:"Veri Merkezi",  value:"Türkiye · İstanbul" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${T.border}` }}>
                    <span style={{ fontSize:11, color:T.textSub }}>{label}</span>
                    <span style={{ fontSize:11, color:T.text, fontWeight:600, textAlign:"right", maxWidth:"55%" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sys req */}
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden" }}>
              <button onClick={() => setShowSysReq(p => !p)} style={{ width:"100%", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", cursor:"pointer", color:T.text, fontFamily:"inherit" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <Monitor size={15} color={T.accent} />
                  <span style={{ fontSize:14, fontWeight:800 }}>Sistem Gereksinimleri</span>
                </div>
                {showSysReq ? <ChevronUp size={15} color={T.textSub} /> : <ChevronDown size={15} color={T.textSub} />}
              </button>

              {showSysReq && (
                <div style={{ borderTop:`1px solid ${T.border}`, padding:"16px", animation:"fadeUp .3s ease" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    {["min","rec"].map(type => (
                      <div key={type}>
                        <div style={{ fontSize:10, fontWeight:800, color:type==="min" ? T.textSub : T.accent, letterSpacing:".08em", marginBottom:10 }}>
                          {type === "min" ? "MİNİMUM" : "ÖNERİLEN"}
                        </div>
                        {SYS_REQ[type].map(({ label, value }) => (
                          <div key={label} style={{ marginBottom:8 }}>
                            <div style={{ fontSize:9, color:T.textDim, fontWeight:700, marginBottom:2 }}>{label.toUpperCase()}</div>
                            <div style={{ fontSize:10, color:T.textSub }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}