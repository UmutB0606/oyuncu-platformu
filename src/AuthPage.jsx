import { useState } from "react";
import {
  Gamepad2, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  CheckCircle, AlertCircle, ChevronLeft, Shield, Database, Zap,
  RefreshCw
} from "lucide-react";

const T = {
  bg:         "#0e1016",
  surface:    "#13161f",
  card:       "#151822",
  border:     "#1e2338",
  borderHi:   "#2d3560",
  accent:     "#1a9fff",
  accentSoft: "#1a9fff12",
  accentGlow: "#1a9fff35",
  teal:       "#00c8d4",
  purple:     "#7c5cfc",
  text:       "#dde4f0",
  textSub:    "#6a7898",
  textDim:    "#2e3858",
  success:    "#0fb97e",
  danger:     "#e84040",
  warning:    "#f0a030",
};

const API = "https://oyuncu-platformu-backend-production.up.railway.app/api/auth";

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function validate(view, form) {
  const errors = {};
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (view === "login") {
    if (!form.email)                    errors.email    = "Email gerekli";
    else if (!emailRe.test(form.email)) errors.email    = "Geçerli bir email girin";
    if (!form.password)                 errors.password = "Şifre gerekli";
    else if (form.password.length < 6)  errors.password = "En az 6 karakter";
  }
  if (view === "register") {
    if (!form.username)                      errors.username = "Kullanıcı adı gerekli";
    else if (form.username.length < 3)       errors.username = "En az 3 karakter";
    if (!form.email)                         errors.email    = "Email gerekli";
    else if (!emailRe.test(form.email))      errors.email    = "Geçerli bir email girin";
    if (!form.password)                      errors.password = "Şifre gerekli";
    else if (form.password.length < 8)       errors.password = "En az 8 karakter";
    if (!form.confirm)                       errors.confirm  = "Şifre tekrarı gerekli";
    else if (form.confirm !== form.password) errors.confirm  = "Şifreler eşleşmiyor";
  }
  if (view === "forgot") {
    if (!form.email)                    errors.email = "Email gerekli";
    else if (!emailRe.test(form.email)) errors.email = "Geçerli bir email girin";
  }
  return errors;
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score  = checks.filter(Boolean).length;
  const labels = ["Çok Zayıf", "Zayıf", "Orta", "Güçlü"];
  const colors = [T.danger, T.warning, "#f0d030", T.success];
  return (
    <div style={{ marginTop:6 }}>
      <div style={{ display:"flex", gap:4, marginBottom:4 }}>
        {checks.map((_, i) => <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<score?colors[score-1]:T.border, transition:"background .3s" }} />)}
      </div>
      <div style={{ fontSize:10, color:colors[score-1], fontWeight:600 }}>{labels[score-1]}</div>
    </div>
  );
}

function Input({ icon:Icon, type="text", placeholder, value, onChange, error, showToggle, onToggle, showPass }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
          <Icon size={15} color={error?T.danger:T.textSub} />
        </div>
        <input
          type={showToggle?(showPass?"text":"password"):type}
          placeholder={placeholder} value={value} onChange={onChange}
          style={{ width:"100%", padding:"12px 13px 12px 40px", background:error?`${T.danger}08`:T.bg, border:`1px solid ${error?T.danger+"60":T.border}`, borderRadius:10, color:T.text, fontSize:13, outline:"none", fontFamily:"inherit", transition:"border-color .18s" }}
          onFocus={e => { e.target.style.borderColor = error?T.danger:T.accent; }}
          onBlur={e  => { e.target.style.borderColor = error?T.danger+"60":T.border; }}
        />
        {showToggle && (
          <button onClick={onToggle} type="button" style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.textSub, display:"flex" }}>
            {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
          </button>
        )}
      </div>
      {error && (
        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5 }}>
          <AlertCircle size={11} color={T.danger} />
          <span style={{ fontSize:11, color:T.danger }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return <div style={{ width:18, height:18, border:`2px solid rgba(255,255,255,.3)`, borderTopColor:"#fff", borderRadius:"50%", animation:"spin 1s linear infinite" }} />;
}

export default function AuthPage({ onLogin }) {
  const [view,       setView]       = useState("login");
  const [form,       setForm]       = useState({ email:"", password:"", username:"", confirm:"", remember:false, kvkk:false });
  const [errors,     setErrors]     = useState({});
  const [apiError,   setApiError]   = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [loading,    setLoading]    = useState(false);

  // OTP state
  const [pendingEmail, setPendingEmail] = useState("");
  const [otp,          setOtp]          = useState(["","","","","",""]);
  const [otpError,     setOtpError]     = useState("");
  const [resendCd,     setResendCd]     = useState(0);

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }));
    setApiError("");
    if (errors[key]) setErrors(p => ({ ...p, [key]: undefined }));
  };

  const switchView = (v) => {
    setView(v); setErrors({}); setApiError("");
    setForm({ email:"", password:"", username:"", confirm:"", remember:false, kvkk:false });
  };

  /* ── OTP input handler ── */
  const handleOtp = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setOtpError("");
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-${i-1}`)?.focus();
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  /* ── Start resend cooldown ── */
  const startCooldown = () => {
    setResendCd(60);
    const iv = setInterval(() => setResendCd(p => { if (p<=1){clearInterval(iv);return 0;} return p-1; }), 1000);
  };

  /* ── REGISTER ── */
  const submitRegister = async () => {
    const errs = validate("register", form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!form.kvkk) { setApiError("KVKK metnini kabul etmelisiniz."); return; }
    setLoading(true); setApiError("");
    try {
      const res  = await fetch(`${API}/register`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ username:form.username, email:form.email, password:form.password }) });
      const data = await res.json();
      if (!res.ok) { setApiError(data.error || "Bir hata oluştu."); return; }
      setPendingEmail(form.email);
      setOtp(["","","","","",""]);
      setView("verify");
      startCooldown();
    } catch { setApiError("Sunucuya bağlanılamadı. Backend çalışıyor mu?"); }
    finally   { setLoading(false); }
  };

  /* ── LOGIN ── */
  const submitLogin = async () => {
    const errs = validate("login", form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiError("");
    try {
      const res  = await fetch(`${API}/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email:form.email, password:form.password }) });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsVerification) { setPendingEmail(data.email); setView("verify"); startCooldown(); return; }
        setApiError(data.error || "Giriş başarısız.");
        return;
      }
      localStorage.setItem("accessToken",  data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      onLogin(data.user);
    } catch { setApiError("Sunucuya bağlanılamadı."); }
    finally   { setLoading(false); }
  };

  /* ── VERIFY OTP ── */
  const submitVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { setOtpError("6 haneli kodu eksiksiz girin."); return; }
    setLoading(true); setOtpError("");
    try {
      const res  = await fetch(`${API}/verify-email`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email:pendingEmail, code }) });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.error || "Kod hatalı."); return; }
      localStorage.setItem("accessToken",  data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      onLogin(data.user);
    } catch { setOtpError("Sunucuya bağlanılamadı."); }
    finally   { setLoading(false); }
  };

  /* ── RESEND OTP ── */
  const resendOtp = async () => {
    if (resendCd > 0) return;
    try {
      await fetch(`${API}/resend-otp`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email:pendingEmail }) });
      startCooldown();
      setOtpError("");
    } catch { setOtpError("Kod gönderilemedi."); }
  };

  /* ── FORGOT ── */
  const submitForgot = async () => {
    const errs = validate("forgot", form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiError("");
    setTimeout(() => { setLoading(false); setView("sent"); }, 1200);
  };

  const submit = view === "register" ? submitRegister : view === "login" ? submitLogin : submitForgot;

  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", background:T.bg, fontFamily:"'Outfit',system-ui,sans-serif", overflow:"hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes shimmer{0%{transform:translateX(-160%)}100%{transform:translateX(260%)}}
        .pb{transition:all .18s;cursor:pointer;border:none;outline:none}
        .pb:hover{filter:brightness(1.1);transform:translateY(-1px)}
        .pb:active{transform:scale(.97)}
        input::placeholder{color:${T.textSub}}
        input{caret-color:${T.accent}}
        .af{animation:fadeUp .4s ease}
        .otp-input{width:46px;height:54px;text-align:center;font-size:22px;font-weight:800;background:${T.bg};border:2px solid ${T.border};border-radius:12px;color:${T.text};outline:none;font-family:inherit;transition:border-color .18s}
        .otp-input:focus{border-color:${T.accent}}
      `}</style>

      {/* ═══ LEFT HERO ═══ */}
      <div style={{ flex:1, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"48px" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,#0a0c14 0%,#1a2840 40%,#0d1828 100%)" }} />
        <div style={{ position:"absolute", inset:0, opacity:.07, backgroundImage:NOISE, backgroundSize:"128px" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px)" }} />
        <div style={{ position:"absolute", left:"20%", top:"25%", width:320, height:320, borderRadius:"50%", background:`radial-gradient(circle,${T.accent}18 0%,transparent 65%)` }} />
        <div style={{ position:"absolute", right:"10%", bottom:"30%", width:240, height:240, borderRadius:"50%", background:`radial-gradient(circle,${T.purple}18 0%,transparent 65%)` }} />
        <div style={{ position:"absolute", left:"40%", bottom:"10%", width:180, height:180, borderRadius:"50%", background:`radial-gradient(circle,${T.teal}12 0%,transparent 65%)` }} />
        <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:0, width:"25%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent)", animation:"shimmer 7s ease-in-out infinite" }} />
        </div>

        {/* Logo */}
        <div style={{ position:"absolute", top:40, left:48, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:`linear-gradient(135deg,${T.accent},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Gamepad2 size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:T.text, letterSpacing:".05em" }}>OYUNCU</div>
            <div style={{ fontSize:9, color:T.accent, letterSpacing:".18em", fontWeight:700 }}>PLATFORMU TR</div>
          </div>
        </div>

        {/* Floating cards */}
        {[
          { top:"18%", right:"8%",  delay:"0s",  w:120, h:160, bg:"linear-gradient(145deg,#2e1204,#7a3c10)", title:"Elden Ring", price:"499 ₺" },
          { top:"32%", right:"22%", delay:"1s",  w:100, h:136, bg:"linear-gradient(145deg,#1a2d4a,#3d5a8a)", title:"BG3",        price:"449 ₺" },
          { top:"48%", right:"6%",  delay:"2s",  w:90,  h:120, bg:"linear-gradient(145deg,#3a0d1a,#8b1a3a)", title:"Hades",      price:"129 ₺" },
        ].map(({ top, right, delay, w, h, bg, title, price }) => (
          <div key={title} style={{ position:"absolute", top, right, animation:`float ${3.5+Math.random()}s ease-in-out infinite`, animationDelay:delay }}>
            <div style={{ width:w, height:h, borderRadius:14, background:bg, border:"1px solid rgba(255,255,255,.1)", boxShadow:"0 20px 40px rgba(0,0,0,.5)", overflow:"hidden", position:"relative" }}>
              <div style={{ position:"absolute", inset:0, opacity:.1, backgroundImage:NOISE, backgroundSize:"64px" }} />
              <div style={{ position:"absolute", bottom:10, left:10 }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#fff" }}>{title}</div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,.5)" }}>{price}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom */}
        <div style={{ position:"relative", zIndex:1 }}>
          <h1 style={{ fontSize:42, fontWeight:900, letterSpacing:"-.03em", lineHeight:1.05, marginBottom:16, color:T.text }}>
            Türkiye'nin<br />
            <span style={{ background:`linear-gradient(135deg,${T.accent},${T.teal})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Oyun Platformu</span>
          </h1>
          <p style={{ fontSize:14, color:T.textSub, lineHeight:1.7, maxWidth:380, marginBottom:32 }}>
            Türkiye'ye özel fiyatlar, yerel veri merkezi ve KVKK uyumlu altyapıyla binlerce oyuna erişin.
          </p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[{ icon:Database, label:"Veri Merkezi: Türkiye", c:T.success }, { icon:Shield, label:"KVKK Uyumlu", c:T.teal }, { icon:Zap, label:"TR Özel Fiyat", c:T.accent }].map(({ icon:I, label, c }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:6, background:`${c}10`, border:`1px solid ${c}28`, borderRadius:20, padding:"5px 12px" }}>
                <I size={11} color={c} /><span style={{ fontSize:10, color:c, fontWeight:700 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT FORM ═══ */}
      <div style={{ width:460, minWidth:460, height:"100vh", background:T.surface, borderLeft:`1px solid ${T.border}`, display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 40px", overflowY:"auto" }}>

        {/* API error banner */}
        {apiError && (
          <div style={{ display:"flex", alignItems:"center", gap:9, background:`${T.danger}10`, border:`1px solid ${T.danger}40`, borderRadius:10, padding:"11px 14px", marginBottom:20 }}>
            <AlertCircle size={15} color={T.danger} />
            <span style={{ fontSize:13, color:T.danger }}>{apiError}</span>
          </div>
        )}

        {/* ── LOGIN ── */}
        {view === "login" && (
          <div className="af">
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontSize:26, fontWeight:900, letterSpacing:"-.02em", marginBottom:6 }}>Giriş Yap</h2>
              <p style={{ fontSize:13, color:T.textSub }}>Hesabına giriş yap ve oynamaya başla.</p>
            </div>
            <Input icon={Mail} type="email" placeholder="Email adresi"  value={form.email}    onChange={set("email")}    error={errors.email} />
            <Input icon={Lock}              placeholder="Şifre"          value={form.password} onChange={set("password")} error={errors.password} showToggle onToggle={() => setShowPass(p=>!p)} showPass={showPass} />
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
                <div onClick={() => setForm(p=>({...p,remember:!p.remember}))} style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${form.remember?T.accent:T.border}`, background:form.remember?T.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .18s", cursor:"pointer" }}>
                  {form.remember && <CheckCircle size={11} color={T.bg} />}
                </div>
                <span style={{ fontSize:12, color:T.textSub }}>Beni hatırla</span>
              </label>
              <button onClick={() => switchView("forgot")} style={{ background:"none", border:"none", color:T.accent, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Şifremi unuttum</button>
            </div>
            <button className="pb" onClick={submitLogin} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:11, background:T.accent, color:T.bg, fontWeight:800, fontSize:14, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 0 24px ${T.accentGlow}`, opacity:loading?0.7:1 }}>
              {loading ? <Spinner /> : <><span>Giriş Yap</span><ArrowRight size={16} /></>}
            </button>
            <div style={{ textAlign:"center", marginTop:24 }}>
              <span style={{ fontSize:13, color:T.textSub }}>Hesabın yok mu? </span>
              <button onClick={() => switchView("register")} style={{ background:"none", border:"none", color:T.accent, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Kayıt Ol</button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
              <div style={{ flex:1, height:1, background:T.border }} />
              <span style={{ fontSize:11, color:T.textDim }}>veya</span>
              <div style={{ flex:1, height:1, background:T.border }} />
            </div>
            <button className="pb" style={{ width:"100%", padding:"12px", borderRadius:11, background:"linear-gradient(135deg,#1b2838,#2a475e)", border:"1px solid #2a475e", color:"#c7d5e0", fontWeight:700, fontSize:13, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:9 }}>
              <div style={{ width:18, height:18, borderRadius:4, background:"#66c0f4", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Gamepad2 size={11} color="#1b2838" />
              </div>
              Steam ile Giriş Yap
            </button>
          </div>
        )}

        {/* ── REGISTER ── */}
        {view === "register" && (
          <div className="af">
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontSize:26, fontWeight:900, letterSpacing:"-.02em", marginBottom:6 }}>Hesap Oluştur</h2>
              <p style={{ fontSize:13, color:T.textSub }}>Ücretsiz hesap aç, TR fiyatlarından yararlan.</p>
            </div>
            <Input icon={User} type="text"  placeholder="Kullanıcı adı"        value={form.username} onChange={set("username")} error={errors.username} />
            <Input icon={Mail} type="email" placeholder="Email adresi"          value={form.email}    onChange={set("email")}    error={errors.email} />
            <div style={{ marginBottom:4 }}>
              <Input icon={Lock} placeholder="Şifre (en az 8 karakter)" value={form.password} onChange={set("password")} error={errors.password} showToggle onToggle={() => setShowPass(p=>!p)} showPass={showPass} />
              <PasswordStrength password={form.password} />
            </div>
            <div style={{ marginTop:12 }}>
              <Input icon={Lock} placeholder="Şifre tekrarı" value={form.confirm} onChange={set("confirm")} error={errors.confirm} showToggle onToggle={() => setShowConf(p=>!p)} showPass={showConf} />
            </div>
            <label style={{ display:"flex", alignItems:"flex-start", gap:8, cursor:"pointer", marginBottom:24 }}>
              <div onClick={() => setForm(p=>({...p,kvkk:!p.kvkk}))} style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${form.kvkk?T.accent:T.border}`, background:form.kvkk?T.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .18s", cursor:"pointer", flexShrink:0, marginTop:1 }}>
                {form.kvkk && <CheckCircle size={11} color={T.bg} />}
              </div>
              <span style={{ fontSize:11, color:T.textSub, lineHeight:1.6 }}>
                <span style={{ color:T.accent, cursor:"pointer" }}>KVKK Aydınlatma Metni</span>'ni ve <span style={{ color:T.accent, cursor:"pointer" }}>Kullanım Koşulları</span>'nı okudum, kabul ediyorum.
              </span>
            </label>
            <button className="pb" onClick={submitRegister} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:11, background:T.accent, color:T.bg, fontWeight:800, fontSize:14, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 0 24px ${T.accentGlow}`, opacity:loading?0.7:1 }}>
              {loading ? <Spinner /> : <><span>Kayıt Ol</span><ArrowRight size={16} /></>}
            </button>
            <div style={{ textAlign:"center", marginTop:20 }}>
              <span style={{ fontSize:13, color:T.textSub }}>Zaten hesabın var mı? </span>
              <button onClick={() => switchView("login")} style={{ background:"none", border:"none", color:T.accent, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Giriş Yap</button>
            </div>
          </div>
        )}

        {/* ── EMAIL VERIFY (OTP) ── */}
        {view === "verify" && (
          <div className="af" style={{ textAlign:"center" }}>
            <div style={{ width:68, height:68, borderRadius:"50%", background:`${T.accent}12`, border:`2px solid ${T.accent}35`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
              <Mail size={28} color={T.accent} />
            </div>
            <h2 style={{ fontSize:24, fontWeight:900, marginBottom:10 }}>Email Doğrulama</h2>
            <p style={{ fontSize:13, color:T.textSub, lineHeight:1.7, marginBottom:8 }}>
              <strong style={{ color:T.text }}>{pendingEmail}</strong> adresine 6 haneli doğrulama kodu gönderdik.
            </p>
            <p style={{ fontSize:12, color:T.textDim, marginBottom:32 }}>Spam klasörünü de kontrol et.</p>

            {/* OTP inputs */}
            <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24 }} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i} id={`otp-${i}`} className="otp-input"
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit}
                  onChange={e => handleOtp(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                  style={{ width:46, height:54, textAlign:"center", fontSize:22, fontWeight:800, background:T.bg, border:`2px solid ${otpError?T.danger:digit?T.accent:T.border}`, borderRadius:12, color:T.text, outline:"none", fontFamily:"inherit", transition:"border-color .18s" }}
                />
              ))}
            </div>

            {otpError && (
              <div style={{ display:"flex", alignItems:"center", gap:7, justifyContent:"center", marginBottom:16 }}>
                <AlertCircle size={13} color={T.danger} />
                <span style={{ fontSize:12, color:T.danger }}>{otpError}</span>
              </div>
            )}

            <button className="pb" onClick={submitVerify} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:11, background:T.accent, color:T.bg, fontWeight:800, fontSize:14, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 0 24px ${T.accentGlow}`, marginBottom:16, opacity:loading?0.7:1 }}>
              {loading ? <Spinner /> : <><CheckCircle size={16} /><span>Doğrula</span></>}
            </button>

            {/* Resend */}
            <button onClick={resendOtp} disabled={resendCd > 0} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:resendCd>0?T.textDim:T.accent, fontSize:13, cursor:resendCd>0?"default":"pointer", fontFamily:"inherit", margin:"0 auto", opacity:resendCd>0?0.6:1 }}>
              <RefreshCw size={13} />
              {resendCd > 0 ? `Tekrar gönder (${resendCd}s)` : "Kodu tekrar gönder"}
            </button>

            <button onClick={() => switchView("login")} style={{ display:"block", margin:"20px auto 0", background:"none", border:"none", color:T.textSub, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
              ← Giriş sayfasına dön
            </button>
          </div>
        )}

        {/* ── FORGOT ── */}
        {view === "forgot" && (
          <div className="af">
            <button onClick={() => switchView("login")} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:T.textSub, fontSize:13, cursor:"pointer", fontFamily:"inherit", marginBottom:28 }}>
              <ChevronLeft size={15} /> Geri Dön
            </button>
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontSize:26, fontWeight:900, letterSpacing:"-.02em", marginBottom:6 }}>Şifremi Unuttum</h2>
              <p style={{ fontSize:13, color:T.textSub, lineHeight:1.6 }}>Email adresini gir, şifre sıfırlama bağlantısını gönderelim.</p>
            </div>
            <Input icon={Mail} type="email" placeholder="Email adresi" value={form.email} onChange={set("email")} error={errors.email} />
            <button className="pb" onClick={submitForgot} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:11, background:T.accent, color:T.bg, fontWeight:800, fontSize:14, fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:`0 0 24px ${T.accentGlow}`, marginTop:8, opacity:loading?0.7:1 }}>
              {loading ? <Spinner /> : <><span>Sıfırlama Maili Gönder</span><ArrowRight size={16} /></>}
            </button>
          </div>
        )}

        {/* ── SENT ── */}
        {view === "sent" && (
          <div className="af" style={{ textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:`${T.success}15`, border:`2px solid ${T.success}40`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
              <CheckCircle size={32} color={T.success} />
            </div>
            <h2 style={{ fontSize:24, fontWeight:900, marginBottom:10 }}>Mail Gönderildi!</h2>
            <p style={{ fontSize:13, color:T.textSub, lineHeight:1.7, marginBottom:32 }}>
              <strong style={{ color:T.text }}>{form.email}</strong> adresine şifre sıfırlama bağlantısı gönderdik.
            </p>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px", marginBottom:28, textAlign:"left" }}>
              <div style={{ fontSize:12, color:T.textSub, lineHeight:1.7 }}>
                💡 Mail gelmediyse spam klasörünü kontrol et. 5 dakika içinde gelmezse tekrar deneyebilirsin.
              </div>
            </div>
            <button className="pb" onClick={() => switchView("login")} style={{ width:"100%", padding:"13px", borderRadius:11, background:T.accent, color:T.bg, fontWeight:800, fontSize:14, fontFamily:"inherit", boxShadow:`0 0 24px ${T.accentGlow}` }}>
              Giriş Sayfasına Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
}