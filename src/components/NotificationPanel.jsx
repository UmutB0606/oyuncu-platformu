import { useState } from "react";
import { Bell, X, Tag, Users, Award, Zap, CheckCheck, Trash2 } from "lucide-react";

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
  orange:     "#f06a28",
  text:       "#dde4f0",
  textSub:    "#6a7898",
  textDim:    "#2e3858",
  success:    "#0fb97e",
  warning:    "#f0a030",
  danger:     "#e84040",
};

const INITIAL_NOTIFS = [
  { id:1, type:"sale",    icon:Tag,    title:"Büyük İndirim!",               body:"Elden Ring %29 indirimde — son 2 gün!",                        time:"5 dk",  read:false, c:T.danger  },
  { id:2, type:"friend",  icon:Users,  title:"Mert K. arkadaşlık isteği gönderdi", body:"Arkadaşlık isteğini kabul et veya reddet.",            time:"12 dk", read:false, c:T.accent  },
  { id:3, type:"achieve", icon:Award,  title:"Yeni Başarım!",                body:"'Koleksiyoncu' başarımını kazandın — Elden Ring",              time:"1 sa",  read:false, c:T.gold    },
  { id:4, type:"sale",    icon:Tag,    title:"Sepetindeki oyun indirime girdi", body:"The Witcher 3 şu an %40 indirimde.",                       time:"3 sa",  read:true,  c:T.danger  },
  { id:5, type:"friend",  icon:Users,  title:"Burak S. God of War'u bitirdi", body:"Arkadaşın yeni bir başarım kazandı.",                         time:"5 sa",  read:true,  c:T.success },
  { id:6, type:"system",  icon:Zap,    title:"TR Özel Fiyat Güncellendi",    body:"Türkiye fiyat listesi güncellendi, oyunları kontrol et.",       time:"1 gün", read:true,  c:T.teal    },
];

export default function NotificationPanel({ onClose }) {
  const [notifs,    setNotifs]    = useState(INITIAL_NOTIFS);
  const [filter,    setFilter]    = useState("all");

  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, read:true })));
  const dismiss     = (id) => setNotifs(p => p.filter(n => n.id !== id));
  const markRead    = (id) => setNotifs(p => p.map(n => n.id === id ? { ...n, read:true } : n));

  const filtered = notifs.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "sale")   return n.type === "sale";
    if (filter === "friend") return n.type === "friend";
    return true;
  });

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:90 }} />

      {/* Panel */}
      <div style={{
        position:"fixed", top:54, right:16, width:360,
zIndex:9999,
        background:"#13161f", border:`1px solid ${T.border}`,
        borderRadius:16, overflow:"hidden",
        boxShadow:"0 20px 60px rgba(0,0,0,.6),0 0 0 1px #1e2338",
        animation:"notifSlide .22s cubic-bezier(.4,0,.2,1)",
      }}>
        <style>{`
          @keyframes notifSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
          .ni{transition:background .15s;cursor:pointer}
          .ni:hover{background:${T.accentSoft}!important}
          .dmbtn{transition:all .15s;cursor:pointer;border:none;background:none;outline:none;opacity:0;display:flex}
          .ni:hover .dmbtn{opacity:1}
        `}</style>

        {/* Header */}
        <div style={{ padding:"16px 18px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Bell size={16} color={T.accent} />
              <span style={{ fontWeight:800, fontSize:15 }}>Bildirimler</span>
              {unread > 0 && (
                <div style={{ background:T.danger, color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {unread}
                </div>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ display:"flex", alignItems:"center", gap:4, background:"none", border:"none", color:T.accent, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                  <CheckCheck size={13} /> Tümünü Oku
                </button>
              )}
              <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:T.textSub, display:"flex", padding:4 }}>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display:"flex", gap:6 }}>
            {[
              { id:"all",    label:"Tümü"     },
              { id:"unread", label:"Okunmadı" },
              { id:"sale",   label:"İndirim"  },
              { id:"friend", label:"Arkadaş"  },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                padding:"4px 10px", borderRadius:7, border:`1px solid ${filter===id ? T.accent+"50" : T.border}`,
                background:filter===id ? T.accentSoft : "transparent",
                color:filter===id ? T.accent : T.textSub,
                fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications list */}
        <div style={{ maxHeight:420, overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"40px 20px", textAlign:"center", color:T.textSub, fontSize:13 }}>
              Bildirim yok
            </div>
          ) : (
            filtered.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} className="ni" onClick={() => markRead(n.id)}
                  style={{ display:"flex", gap:12, padding:"13px 16px", borderBottom:`1px solid ${T.border}`, background:n.read ? "transparent" : `${n.c}06`, position:"relative" }}>
                  {/* Unread dot */}
                  {!n.read && (
                    <div style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)", width:5, height:5, borderRadius:"50%", background:n.c }} />
                  )}

                  {/* Icon */}
                  <div style={{ width:36, height:36, borderRadius:10, background:`${n.c}15`, border:`1px solid ${n.c}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon size={15} color={n.c} />
                  </div>

                  {/* Content */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:n.read ? 500 : 700, marginBottom:3, color:n.read ? T.textSub : T.text }}>{n.title}</div>
                    <div style={{ fontSize:11, color:T.textSub, lineHeight:1.5, marginBottom:4 }}>{n.body}</div>
                    <div style={{ fontSize:10, color:T.textDim, fontWeight:600 }}>{n.time} önce</div>
                  </div>

                  {/* Dismiss */}
                  <button className="dmbtn" onClick={e => { e.stopPropagation(); dismiss(n.id); }} style={{ color:T.textSub, padding:4, borderRadius:6, flexShrink:0 }}>
                    <X size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifs.length > 0 && (
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"center" }}>
            <button onClick={() => setNotifs([])} style={{ display:"flex", alignItems:"center", gap:5, background:"none", border:"none", color:T.textSub, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
              <Trash2 size={12} /> Tümünü Temizle
            </button>
          </div>
        )}
      </div>
    </>
  );
}