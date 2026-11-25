import { useEffect, useRef, useState } from 'react'

const API = import.meta.env.VITE_API || 'http://localhost:4000'
const call = async (path, opts = {}, token) => {
  const r = await fetch(API + path, { ...opts, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) } })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.error || 'Something went wrong.')
  return d
}
// Shown until the API responds, so the page never looks empty.
const FALLBACK = [
  { id: 1, featured: true, title: 'SAKSHAM AI: rural FinTech assistant', summary: '8 AI agents and 10+ REST APIs for credit scoring, fraud detection and government scheme matching, with a voice assistant in 12 regional languages.', stack: ['React', 'Node.js', 'AI agents', 'Voice AI'], repo: 'https://github.com/kashishmahore10-web', demo: 'https://arthsaathi-frontend.vercel.app', image: '/projects/saksham-ai.png' },
  { id: 2, title: 'Grocery e-commerce and delivery system', summary: 'Full-stack grocery platform with separate customer, delivery-partner, and admin dashboards. Includes JWT authentication, role-based access control (RBAC), real-time order tracking, and automated order/workflow management backed by REST APIs.', stack: ['React', 'Express', 'PostgreSQL'], repo: 'https://github.com/kashishmahore10-web', demo: 'https://vercel.com/kashishmahore-s-projects/quick-kart', image: '/projects/grocery-ecommerce.png' },
  { id: 3, title: 'AI-based internship recommendation engine', summary: 'Recommends internships by matching candidate profiles and keywords with opportunities, with a dashboard for exploring results.', stack: ['React', 'Vite', 'Node.js', 'REST APIs'], repo: 'https://github.com/kashishmahore10-web/AI-Based-Internship-Recommendation-Engine', demo: 'https://ai-based-internship-recommendation-three.vercel.app', image: '/projects/ai-internship-recommendation.png' },
  { id: 4, title: 'Phi-2 fine-tuning with QLoRA', summary: 'Fine-tuned Microsoft Phi-2 (2.7B) on the Guanaco-1K dataset using QLoRA, PEFT, and 4-bit quantization. Optimized memory-efficient training for instruction-following responses. Evaluated outputs to improve response quality and efficiency on limited compute.', stack: ['PyTorch', 'Hugging Face', 'PEFT'], repo: 'https://github.com/kashishmahore10-web', image: '/projects/phi2-qlora.svg' },
  { id: 6, title: 'AI Resume Builder', summary: 'AI-powered resume platform with an AI resume builder, AI interviewer, and AI chatbot to help users create resumes, practice interviews, and get guidance through a clean, responsive interface.', stack: ['React', 'Vite', 'JavaScript', 'AI'], repo: 'https://github.com/kashishmahore10-web/resume-frontend', demo: 'https://resume-frontend-weld.vercel.app', image: '/projects/resume-frontend.svg' },
  { id: 7, title: 'Cancer Awareness Page', summary: 'Responsive awareness page built with React and Tailwind CSS to share cancer-related information and resources. Includes inspirational quotes and a contact section to support visitors.', stack: ['React', 'Vite', 'Tailwind CSS'], repo: 'https://github.com/kashishmahore10-web/Cancer_Awareness-_Page', demo: 'https://cancer-awareness-page.vercel.app', image: '/projects/cancer-awareness.svg' },
]

// Stars drift upward and link to the cursor: the one memorable detail.
function Sky() {
  const ref = useRef()
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d'), m = { x: -999, y: -999 }
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W, H, st = [], raf
    const init = () => {
      W = c.width = innerWidth; H = c.height = innerHeight
      st = Array.from({ length: Math.min(140, W * H / 9000 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, p: Math.random() * 6.28, v: Math.random() * .15 + .03 }))
    }
    const draw = () => {
      x.clearRect(0, 0, W, H)
      for (const a of st) {
        if (!calm) { a.y -= a.v; a.p += .02; if (a.y < -2) { a.y = H + 2; a.x = Math.random() * W } }
        x.fillStyle = `rgba(230,215,255,${.45 + .45 * Math.sin(a.p)})`
        x.beginPath(); x.arc(a.x, a.y, a.r, 0, 6.28); x.fill()
        const d = (a.x - m.x) ** 2 + (a.y - m.y) ** 2
        if (d < 18000) { x.strokeStyle = `rgba(230,215,255,${.35 * (1 - d / 18000)})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(m.x, m.y); x.stroke() }
      }
      if (!calm) raf = requestAnimationFrame(draw)
    }
    const move = e => { m.x = e.clientX; m.y = e.clientY }
    init(); draw()
    addEventListener('pointermove', move); addEventListener('resize', init)
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('resize', init) }
  }, [])
  return <canvas id="sky" ref={ref} aria-hidden="true" />
}

const ROLES = ['Full-stack developer', 'GenAI and LLM builder', 'AI agents and RAG', 'Problem solver']
function Typed() {
  const [t, setT] = useState('')
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setT(ROLES[0]); return }
    let i = 0, n = 0, del = false, id
    const tick = () => {
      n += del ? -1 : 1; setT(ROLES[i].slice(0, n)); let d = del ? 35 : 75
      if (!del && n === ROLES[i].length) { del = true; d = 1400 } else if (del && n === 0) { del = false; i = (i + 1) % ROLES.length; d = 300 }
      id = setTimeout(tick, d)
    }
    tick(); return () => clearTimeout(id)
  }, [])
  return <span>{t}<i /></span>
}

function Contact() {
  const [f, setF] = useState({ name: '', email: '', body: '' }), [s, setS] = useState({ ok: '', err: '' })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const send = async e => {
    e.preventDefault(); setS({ ok: '', err: '' })
    try { await call('/api/contact', { method: 'POST', body: JSON.stringify(f) }); setS({ ok: "Message sent. I'll reply soon." }); setF({ name: '', email: '', body: '' }) }
    catch (x) { setS({ err: x.message }) }
  }
  return (
    <form onSubmit={send}>
      <input placeholder="Your name" value={f.name} onChange={set('name')} aria-label="Your name" required />
      <input type="email" placeholder="Your email" value={f.email} onChange={set('email')} aria-label="Your email" required />
      <textarea rows="4" placeholder="What would you like to build?" value={f.body} onChange={set('body')} aria-label="Message" required />
      <button className="b p" type="submit">Send message</button>
      <p className={s.err ? 'msg err' : 'msg'} role="status">{s.ok || s.err}</p>
    </form>
  )
}

function Admin({ back }) {
  const [token, setToken] = useState(''), [pw, setPw] = useState(''), [err, setErr] = useState('')
  const [list, setList] = useState([]), [msgs, setMsgs] = useState([]), [p, setP] = useState({ title: '', summary: '', stack: '', repo: '', demo: '' })
  const load = async t => { setList(await call('/api/projects')); setMsgs(await call('/api/messages', {}, t)) }
  const login = async e => { e.preventDefault(); try { const { token: t } = await call('/api/login', { method: 'POST', body: JSON.stringify({ password: pw }) }); setToken(t); setErr(''); load(t) } catch (x) { setErr(x.message) } }
  const add = async e => { e.preventDefault(); try { await call('/api/projects', { method: 'POST', body: JSON.stringify({ ...p, stack: p.stack.split(',').map(s => s.trim()).filter(Boolean) }) }, token); setP({ title: '', summary: '', stack: '', repo: '', demo: '' }); load(token) } catch (x) { setErr(x.message) } }
  const del = async id => { await call('/api/projects/' + id, { method: 'DELETE' }, token); load(token) }
  const set = k => e => setP({ ...p, [k]: e.target.value })
  return (
    <div className="wrap adm layer">
      <a href="#top" onClick={back}>Back to portfolio</a>
      <h2 style={{ marginTop: 24 }}>Admin</h2>
      {!token ? (
        <form onSubmit={login}><input type="password" placeholder="Admin password" value={pw} onChange={e => setPw(e.target.value)} aria-label="Admin password" /><button className="b p">Log in</button><p className="msg err">{err}</p></form>
      ) : (<>
        <form onSubmit={add}>
          <input placeholder="Title" value={p.title} onChange={set('title')} required />
          <textarea rows="3" placeholder="Summary" value={p.summary} onChange={set('summary')} required />
          <input placeholder="Stack, comma separated" value={p.stack} onChange={set('stack')} />
          <input placeholder="GitHub URL" value={p.repo} onChange={set('repo')} />
          <input placeholder="Live demo URL" value={p.demo} onChange={set('demo')} />
          <button className="b p">Add project</button><p className="msg err">{err}</p>
        </form>
        <h3 style={{ margin: '32px 0 8px' }}>Projects</h3>
        <ul>{list.map(x => <li key={x.id}><span>{x.title}</span><button className="b" onClick={() => del(x.id)}>Delete</button></li>)}</ul>
        <h3 style={{ margin: '32px 0 8px' }}>Messages</h3>
        <ul>{msgs.length ? msgs.map(m => <li key={m.id}><span><b>{m.name}</b> ({m.email}): {m.body}</span></li>) : <li className="mu">No messages yet.</li>}</ul>
      </>)}
    </div>
  )
}

export default function App() {
  const [admin, setAdmin] = useState(location.hash === '#admin'), [projects, setProjects] = useState(FALLBACK)
  const route = location.pathname.replace(/\/+$/, '') || '/'
  const page = route === '/' ? 'home' : ['about', 'skills', 'projects', 'resume', 'blogs', 'opportunities'].includes(route.slice(1)) ? route.slice(1) : 'not-found'
  useEffect(() => { call('/api/projects').then(d => d.length && setProjects(d)).catch(() => {}) }, [])
  useEffect(() => { const h = () => setAdmin(location.hash === '#admin'); addEventListener('hashchange', h); return () => removeEventListener('hashchange', h) }, [])
  const skillset = [
    { icon: 'C++', label: 'C++' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-plain.svg', label: 'Python', invert: true },
    { icon: 'JS', label: 'JavaScript' },
    { icon: 'TS', label: 'TypeScript' },
    { icon: 'SQL', label: 'SQL' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', label: 'React', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-plain.svg', label: 'Next.js', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain.svg', label: 'Node.js', invert: true },
    { icon: 'Ex', label: 'Express' },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-plain.svg', label: 'MongoDB', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-plain.svg', label: 'PostgreSQL', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', label: 'Tailwind CSS', invert: true },
  ]
  const tools = [
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg', label: 'VS Code', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg', label: 'Git', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', label: 'GitHub', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-plain.svg', label: 'Postman', invert: true },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', label: 'Vercel', invert: true },
  ]
  return (<>
    <Sky />
    {admin ? <Admin back={() => setAdmin(false)} /> : (
      <div className="layer" id="top">
        <header><div className="wrap"><nav aria-label="Main">
          <a className="logo" href="/">KM</a>
          <div className="nav-links">
            <a className="l" href="/"><svg className="ni" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z" /></svg> Home</a>
            <a className="l" href="/about"><svg className="ni" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg> About</a>
            <a className="l" href="/skills"><svg className="ni" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg> Skills</a>
            <a className="l" href="/projects"><svg className="ni" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8m-4-3v3m-5-9 3-3 3 3 2-2 2 2" /></svg> Projects</a>
            <a className="l" href="/resume"><svg className="ni" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M14 3v6h6M8 13h8m-8 4h8" /></svg> Resume</a>
            <a className="l x" href="/opportunities"><svg className="ni" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11 0v2h4v-2" /></svg> Opportunities</a>
          </div>
          <a className="b p nav-cv" href="/Kashish_Mahore_Resume.pdf" download><svg className="download-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" /></svg> Download CV</a>
        </nav></div></header>
        <main>
          {page === 'home' && <section id="hero"><div className="wrap hg">
            <div>
              <p className="mu">Hi there, I&apos;m</p>
              <h1>Kashish Mahore</h1>
              <p className="role"><Typed /></p>
              <p className="lead">I build full-stack products and GenAI systems, from AI agents and fine-tuned LLMs to the React and Node.js apps people use. B.Tech in Electronics and Instrumentation at SGSITS Indore (2023-2027).</p>
              <div className="btns"><a className="b p" href="/projects">See my projects</a><a className="b" href="mailto:kashishmahore2005@gmail.com">Email me</a><a className="b" href="https://github.com/kashishmahore10-web" target="_blank" rel="noopener">GitHub</a></div>
            </div>
            <div className="art" aria-hidden="true">
              <svg viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a855f7" /><stop offset="1" stopColor="#5eead4" /></linearGradient></defs>
                <circle cx="200" cy="200" r="150" fill="none" stroke="#a855f7" strokeOpacity=".3" strokeDasharray="3 7" /><circle cx="200" cy="200" r="100" fill="none" stroke="#a855f7" strokeOpacity=".25" />
                <g className="orb"><circle cx="350" cy="200" r="9" fill="#5eead4" /><circle cx="125" cy="330" r="7" fill="#e0a3ff" /><circle cx="90" cy="110" r="6" fill="#a855f7" /></g>
                <rect x="105" y="130" width="190" height="125" rx="14" fill="#1b1238" stroke="url(#g)" strokeWidth="2" />
                <g fill="none" strokeLinecap="round" strokeWidth="5"><path d="M125 175h60" stroke="#e0a3ff" /><path d="M140 193h90" stroke="#a855f7" /><path d="M140 211h50" stroke="#5eead4" /><path d="M125 229h75" stroke="#e0a3ff" /></g>
                <path d="M60 270h280l-24 22H84z" fill="#2a1d52" /></svg>
            </div>
          </div></section>}
          {page === 'home' && <section className="home-intro"><div className="wrap home-intro-grid">
            <div className="home-intro-copy">
              <p className="home-eyebrow">A LITTLE ABOUT HOW I BUILD</p>
              <h2>Curious by nature.<br /><span>Builder by choice.</span></h2>
              <p className="home-intro-text">I turn ideas into useful digital products - bringing together full-stack engineering and AI. From shaping an idea to building the interface, APIs, and intelligent features, I enjoy making the pieces work as one.</p>
              <div className="home-focus"><span>Full-stack developer</span><span>Generative AI</span><span>Practical problem-solving</span></div>
              <div className="home-intro-actions">
                <a className="b p" href="/about">Get to know me</a>
                <a className="b" href="/projects">Explore my work</a>
              </div>
            </div>
            <div className="home-visual profile-visual" aria-hidden="true">
              <div className="profile-orbit profile-orbit-one" />
              <div className="profile-orbit profile-orbit-two" />
              <div className="profile-avatar">
                <svg viewBox="0 0 360 400">
                  <defs>
                    <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9b5de5" /><stop offset="1" stopColor="#41236f" /></linearGradient>
                    <linearGradient id="avatar-jacket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#30204d" /><stop offset="1" stopColor="#171128" /></linearGradient>
                    <linearGradient id="avatar-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#38252b" /><stop offset="1" stopColor="#211522" /></linearGradient>
                  </defs>
                  <circle cx="180" cy="190" r="152" fill="url(#avatar-bg)" />
                  <circle cx="180" cy="190" r="152" fill="none" stroke="#e0a3ff" strokeOpacity=".32" strokeWidth="2" />
                  <path d="M56 344c12-68 57-104 124-104s112 36 124 104v18H56z" fill="url(#avatar-jacket)" />
                  <path d="m138 250 42 46 42-46 19 18-34 76h-54l-34-76z" fill="#453467" />
                  <path d="M157 220h46v48c-12 16-34 16-46 0z" fill="#d89a78" />
                  <path d="M111 139c0-59 31-91 70-91 47 0 73 32 73 89v40c0 49-33 83-74 83s-69-34-69-83z" fill="url(#avatar-hair)" />
                  <path d="M127 143c0-42 21-68 55-68 37 0 57 26 57 68v48c0 36-25 64-57 64s-55-28-55-64z" fill="#efb895" />
                  <path d="M117 147c-7-55 18-99 66-99 48 0 77 32 72 97-13-8-22-21-26-39-22 18-55 27-102 25l-4 35-6-19z" fill="url(#avatar-hair)" />
                  <path d="M137 153c9-7 19-7 28-1m31 0c9-6 19-6 28 1" fill="none" stroke="#553a36" strokeWidth="4" strokeLinecap="round" />
                  <ellipse cx="151" cy="169" rx="4" ry="5" fill="#30202a" /><ellipse cx="211" cy="169" rx="4" ry="5" fill="#30202a" />
                  <path d="M160 197c11 14 29 14 40 0-3 15-12 21-20 21s-17-6-20-21z" fill="#a94f5b" />
                  <path d="M166 199c8 5 20 5 28 0-2 6-7 9-14 9s-12-3-14-9z" fill="#fff1e9" />
                  <path d="m162 297 18 21 18-21 25 63h-86z" fill="#5eead4" fillOpacity=".85" />
                  <circle cx="275" cy="100" r="7" fill="#5eead4" /><circle cx="83" cy="260" r="5" fill="#e0a3ff" />
                  <rect x="91" y="282" width="178" height="62" rx="8" fill="#171128" stroke="#9b5de5" strokeWidth="2" />
                  <rect x="98" y="289" width="164" height="48" rx="4" fill="#211936" />
                  <circle cx="107" cy="297" r="2" fill="#a855f7" /><circle cx="114" cy="297" r="2" fill="#5eead4" />
                  <path d="M109 309h26m-26 8h48m-48 8h34" fill="none" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
                  <path d="M82 345h196l-15 12H97z" fill="#6d5593" stroke="#a855f7" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="profile-chip profile-chip-top"><span className="profile-chip-dot" /> Full-stack developer</div>
              <div className="profile-chip profile-chip-bottom">AI / GenAI builder</div>
            </div>
          </div></section>}
          {page === 'about' && <section id="about"><div className="wrap about">
            <h2>Know who <span className="hl">I&apos;M</span></h2>
            <p className="sub">Building AI-powered and full-stack products that turn ideas into real-world impact.</p>
            <div className="stats"><div><b>350+</b><span>DSA problems solved</span></div><div><b>8</b><span>AI agents built</span></div><div><b>12</b><span>regional languages supported</span></div><div><b>10+</b><span>REST APIs shipped</span></div></div>

            <p className="intro">Hi everyone, I&apos;m <em>Kashish Mahore</em> from Indore, India. I&apos;m passionate about <em>full-stack development, GenAI/LLMs, and problem solving</em>, and I enjoy building products across the whole loop: from data and models to APIs, interfaces, and deployment.</p>

            <ul className="about-points">
              <li><span className="about-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m2 9 10-5 10 5-10 5zM6 11v5c3 3 9 3 12 0v-5m4-2v7" /></svg></span><p>Pursuing a <em>B.Tech in Electronics and Instrumentation</em> at <em>SGSITS Indore</em> (2023-2027).</p></li>
              <li><span className="about-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-13 5h18m-11 0v2h4v-2" /></svg></span><p><em>Full Stack Intern at Agentic Papers</em> (Oct 2024 - Nov 2025) - built responsive React interfaces and integrated Node.js/Express APIs with MongoDB for an AI-driven platform.</p></li>
              <li><span className="about-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8zM19 3v4m-2-2h4M5 17v4m-2-2h4" /></svg></span><p>Built AI and full-stack projects including <em>SAKSHAM AI</em> (Nomura KukushIN 10.0), e-commerce systems, recommendation engines, and LLM fine-tuning work.</p></li>
            </ul>

            <h3>Recent experience &amp; projects</h3>
            <ul className="about-list">
              <li><b>Agentic Papers:</b> Engineered React.js + Tailwind CSS + Framer Motion interfaces and integrated REST APIs for efficient workflows and scalable onboarding.</li>
              <li><b>SAKSHAM AI (Rural FinTech Platform):</b> Built 8 AI agents and 10+ REST APIs for credit scoring, fraud detection, scheme matching, and voice assistance in 12 regional languages.</li>
              <li><b>AI-based Internship Recommendation Engine:</b> Developed profile/keyword-based matching with dynamic recommendations and an analytics dashboard.</li>
              <li><b>Full-Stack Grocery E-commerce Platform:</b> Built MERN/PostgreSQL app with JWT auth, RBAC, real-time tracking, and automated workflows.</li>
              <li><b>Phi-2 fine-tuning with QLoRA:</b> Fine-tuned Microsoft Phi-2 (2.7B) with PEFT and 4-bit quantization, improving efficiency on evaluation.</li>
            </ul>

            <h3>Achievements &amp; leadership</h3>
            <ul className="about-list">
              <li>Solved <em>350+ DSA problems</em> on LeetCode and GeeksforGeeks.</li>
              <li><em>Nomura KukushIN 10.0</em> participant; <em>Adobe India Hackathon</em> participant.</li>
              <li><em>Shri K.A. Chitale Gold Medal (2024-25)</em> and <em>Shri Das Gupta Best Student of the Year (2025)</em></li>
              <li><em>President</em>, Eklavya Khel Spardha Manch (SGSITS) - led 20+ events and tournaments.</li>
              <li><em>State Gold Medalist</em> in Boxing, Karate, Judo, Gymnastics and Athletics (5K/10K); <em>First Prize in Taekwondo</em> at IIT Kanpur.</li>
              <li><em>Lance Corporal, NCC</em> (Oct 2023 - Sept 2024) - leadership, event management, and teamwork.</li>
            </ul>

            <blockquote className="quote">&quot;Build products that make a difference and solve real-world problems.&quot;</blockquote>
          </div></section>}
          {page === 'skills' && <section id="skills"><div className="wrap">
            <h2 className="sec-title">Professional <span className="hl">Skillset</span></h2>
            <div className="tiles">{skillset.map(s => <div className="tile" key={s.label}>{s.src ? <span className={'tile-badge' + (s.badge ? ' on' : '')}><img className={'tile-img' + (s.invert ? ' inv' : '')} src={s.src} alt="" loading="lazy" /></span> : <span className="tile-ico">{s.icon}</span>}<span>{s.label}</span></div>)}</div>
            <h2 className="sec-title tools-title"><span className="hl">Tools</span> I use</h2>
            <div className="tiles">{tools.map(t => <div className="tile" key={t.label}>{t.src ? <span className={'tile-badge' + (t.badge ? ' on' : '')}><img className={'tile-img' + (t.invert ? ' inv' : '')} src={t.src} alt="" loading="lazy" /></span> : <span className="tile-ico">{t.icon}</span>}<span>{t.label}</span></div>)}</div>
          </div></section>}
          {page === 'projects' && <section id="projects"><div className="wrap"><h2 className="sec-title">My Recent <span className="hl">Works</span></h2><p className="sub" style={{ margin: '0 auto 36px', textAlign: 'center' }}>A few things I&apos;ve enjoyed building.</p>
            <div className="pj">{projects.map(x => (
              <article key={x.id} className="card">
                <div className="pj-img">{x.image ? <img src={x.image} alt={x.title} loading="lazy" /> : <div className="pj-ph"><span>{x.title}</span></div>}</div>
                <div className="pj-body">
                  <h3>{x.title}</h3>
                  <p className="mu">{x.summary}</p>
                  <div className="chips">{(x.stack || []).map(s => <span key={s}>{s}</span>)}</div>
                  <div className="links">{x.repo && <a href={x.repo} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>GitHub</a>}{x.demo && <a href={x.demo} target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8m-4-3v3m-5-9 3-3 3 3 2-2 2 2" /></svg>Demo</a>}</div>
                </div>
              </article>))}              </div></div></section>}
              {page === 'resume' && <section id="resume"><div className="wrap">
            <h2 className="sec-title">My <span className="hl">Resume</span></h2>
            <p className="sub" style={{ margin: '0 auto 28px', textAlign: 'center' }}>View or download my resume.</p>
            <div className="resume-actions"><a className="b p" href="/Kashish_Mahore_Resume.pdf" download>↓ Download CV</a><a className="b" href="/Kashish_Mahore_Resume.pdf" target="_blank" rel="noopener">Open in new tab</a></div>
            <div className="resume-frame"><iframe src="/Kashish_Mahore_Resume.pdf" title="Kashish Mahore Resume" loading="lazy" /></div>
          </div></section>}
          {page === 'blogs' && <section id="blogs"><div className="wrap">
            <h2 className="sec-title">My <span className="hl">Blogs</span></h2>
            <p className="sub" style={{ margin: '0 auto', textAlign: 'center' }}>Blog posts coming soon. Stay tuned!</p>
          </div></section>}
          {page === 'opportunities' && <section id="opportunities" className="ct"><div className="wrap">
            <p className="opportunity-status"><span /> Open to opportunities</p>
            <h2>Let&apos;s build something <span className="hl">meaningful</span></h2>
            <p className="sub opportunity-intro">I&apos;m exploring software engineering, full-stack development, and AI/GenAI opportunities. If you have a role, collaboration, or project in mind, I&apos;d love to hear from you.</p>
            <div className="opportunity-grid">
              <div className="opportunity-card">
                <h3>Let&apos;s connect</h3>
                <p className="mu">The best way to reach me is by email. You can also explore my work on GitHub.</p>
                <a className="contact-link" href="mailto:kashishmahore2005@gmail.com"><span className="contact-icon">@</span><span><small>Email</small><b>kashishmahore2005@gmail.com</b></span></a>
                <a className="contact-link" href="https://github.com/kashishmahore10-web" target="_blank" rel="noopener"><span className="contact-icon">GH</span><span><small>GitHub</small><b>github.com/kashishmahore10-web</b></span></a>
                <a className="contact-link" href="https://www.linkedin.com/in/kashish-mahore-37b25a2ab/" target="_blank" rel="noopener"><span className="contact-icon">in</span><span><small>LinkedIn</small><b>linkedin.com/in/kashish-mahore</b></span></a>
                <p className="opportunity-location">Based in Indore, India</p>
                <a className="b p opportunity-email" href="mailto:kashishmahore2005@gmail.com">Contact me</a>
              </div>
              <div className="opportunity-form">
                <h3>Send me a message</h3>
                <p className="mu">Tell me a little about the opportunity or what you&apos;d like to build.</p>
                <Contact />
              </div>
            </div>
          </div></section>}
          {page === 'not-found' && <section><div className="wrap"><h2>Page not found</h2><p className="sub">The page you&apos;re looking for doesn&apos;t exist.</p><a className="b p" href="/">Back home</a></div></section>}
        </main>
        <footer className="site-footer">
          <div className="footer-social">
            <h2>Find me on</h2>
            <p>Feel free to connect with me</p>
            <div className="footer-social-links">
              <a href="https://github.com/kashishmahore10-web" target="_blank" rel="noopener" aria-label="GitHub profile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg></a>
              <a href="https://www.linkedin.com/in/kashish-mahore-37b25a2ab/" target="_blank" rel="noopener" aria-label="LinkedIn profile">in</a>
              <a href="mailto:kashishmahore2005@gmail.com" aria-label="Email Kashish Mahore">@</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>Designed and built by Kashish Mahore</span>
            <span>&copy; 2026 Kashish Mahore</span>
            <a href="#admin">Admin</a>
          </div>
        </footer>
      </div>)}
  </>)
}
