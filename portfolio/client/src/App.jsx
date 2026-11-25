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
    try { await call('/api/contact', { method: 'POST', body: JSON.stringify(f) }); setS({ ok: 'Message sent. Iâ€™ll reply soon.' }); setF({ name: '', email: '', body: '' }) }
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
          <a className="logo" href="#top">KM</a>
          <div className="nav-links">
            <a className="l" href="#top"><span className="ni">âŒ‚</span> Home</a>
            <a className="l" href="#about"><span className="ni">ðŸ‘¤</span> About</a>
            <a className="l" href="#skills"><span className="ni">âœ¦</span> Skills</a>
            <a className="l" href="#projects"><span className="ni">â–£</span> Projects</a>
            <a className="l" href="#resume"><span className="ni">ðŸ“„</span> Resume</a>
            <a className="l x" href="#contact"><span className="ni">âœ‰</span> Contact</a>
          </div>
          <a className="b p nav-cv" href="/Kashish_Mahore_Resume.pdf" download>â†“ Download CV</a>
        </nav></div></header>
        <main>
          <section id="hero"><div className="wrap hg">
            <div>
              <p className="mu">Hi there, Iâ€™m</p>
              <h1>Kashish Mahore</h1>
              <p className="role"><Typed /></p>
              <p className="lead">I build full-stack products and GenAI systems, from AI agents and fine-tuned LLMs to the React and Node.js apps people use. B.Tech in Electronics and Instrumentation at SGSITS Indore (2023â€“2027).</p>
              <div className="btns"><a className="b p" href="#projects">See my projects</a><a className="b" href="mailto:kashishmahore10@gmail.com">Email me</a><a className="b" href="https://github.com/kashishmahore10-web" target="_blank" rel="noopener">GitHub</a></div>
            </div>
            <div className="art" aria-hidden="true">
              <svg viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a855f7" /><stop offset="1" stopColor="#5eead4" /></linearGradient></defs>
                <circle cx="200" cy="200" r="150" fill="none" stroke="#a855f7" strokeOpacity=".3" strokeDasharray="3 7" /><circle cx="200" cy="200" r="100" fill="none" stroke="#a855f7" strokeOpacity=".25" />
                <g className="orb"><circle cx="350" cy="200" r="9" fill="#5eead4" /><circle cx="125" cy="330" r="7" fill="#e0a3ff" /><circle cx="90" cy="110" r="6" fill="#a855f7" /></g>
                <rect x="105" y="130" width="190" height="125" rx="14" fill="#1b1238" stroke="url(#g)" strokeWidth="2" />
                <g fill="none" strokeLinecap="round" strokeWidth="5"><path d="M125 175h60" stroke="#e0a3ff" /><path d="M140 193h90" stroke="#a855f7" /><path d="M140 211h50" stroke="#5eead4" /><path d="M125 229h75" stroke="#e0a3ff" /></g>
                <path d="M60 270h280l-24 22H84z" fill="#2a1d52" /></svg>
            </div>
          </div></section>
          <section id="about"><div className="wrap about">
            <h2>Know who <span className="hl">I&apos;M</span></h2>
            <p className="sub">Building AI-powered and full-stack products that turn ideas into real-world impact.</p>
            <div className="stats"><div><b>350+</b><span>DSA problems solved</span></div><div><b>8</b><span>AI agents built</span></div><div><b>12</b><span>regional languages supported</span></div><div><b>10+</b><span>REST APIs shipped</span></div></div>

            <p className="intro">Hi everyone, I&apos;m <em>Kashish Mahore</em> from Indore, India. I&apos;m passionate about <em>full-stack development, GenAI/LLMs, and problem solving</em>, and I enjoy building products across the whole loop: from data and models to APIs, interfaces, and deployment.</p>

            <ul className="about-points">
              <li><span>ðŸŽ“</span><p>Pursuing a <em>B.Tech in Electronics and Instrumentation</em> at <em>SGSITS Indore</em> (2023â€“2027).</p></li>
              <li><span>ðŸ’¼</span><p><em>Full Stack Intern at Agentic Papers</em> (Oct 2024 â€“ Nov 2025) â€” built responsive React interfaces and integrated Node.js/Express APIs with MongoDB for an AI-driven platform.</p></li>
              <li><span>ðŸš€</span><p>Built AI and full-stack projects including <em>SAKSHAM AI</em> (Nomura KukushIN 10.0), e-commerce systems, recommendation engines, and LLM fine-tuning work.</p></li>
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
              <li><em>Shri K.A. Chitale Gold Medal (2024â€“25)</em> and <em>Shri Das Gupta Best Student of the Year (2025)</em></li>
              <li><em>President</em>, Eklavya Khel Spardha Manch (SGSITS) â€” led 20+ events and tournaments.</li>
              <li><em>State Gold Medalist</em> in Boxing, Karate, Judo, Gymnastics and Athletics (5K/10K); <em>First Prize in Taekwondo</em> at IIT Kanpur.</li>
              <li><em>Lance Corporal, NCC</em> (Oct 2023 â€“ Sept 2024) â€” leadership, event management, and teamwork.</li>
            </ul>

            <blockquote className="quote">â€œBuild products that make a difference and solve real-world problems.â€</blockquote>
          </div></section>
          <section id="skills"><div className="wrap">
            <h2 className="sec-title">Professional <span className="hl">Skillset</span></h2>
            <div className="tiles">{skillset.map(s => <div className="tile" key={s.label}>{s.src ? <span className={'tile-badge' + (s.badge ? ' on' : '')}><img className={'tile-img' + (s.invert ? ' inv' : '')} src={s.src} alt="" loading="lazy" /></span> : <span className="tile-ico">{s.icon}</span>}<span>{s.label}</span></div>)}</div>
            <h2 className="sec-title tools-title"><span className="hl">Tools</span> I use</h2>
            <div className="tiles">{tools.map(t => <div className="tile" key={t.label}>{t.src ? <span className={'tile-badge' + (t.badge ? ' on' : '')}><img className={'tile-img' + (t.invert ? ' inv' : '')} src={t.src} alt="" loading="lazy" /></span> : <span className="tile-ico">{t.icon}</span>}<span>{t.label}</span></div>)}</div>
          </div></section>
          <section id="projects"><div className="wrap"><h2>Projects</h2><p className="sub">Loaded live from my own API and database.</p>
            <div className="pj">{projects.map(x => (
              <article key={x.id} className="card">
                <div className="pj-img">{x.image ? <img src={x.image} alt={x.title} loading="lazy" /> : <div className="pj-ph"><span>{x.title}</span></div>}</div>
                <div className="pj-body">
                  <h3>{x.title}</h3>
                  <p className="mu">{x.summary}</p>
                  <div className="chips">{(x.stack || []).map(s => <span key={s}>{s}</span>)}</div>
                  <div className="links">{x.repo && <a href={x.repo} target="_blank" rel="noopener">GitHub</a>}{x.demo && <a href={x.demo} target="_blank" rel="noopener">Demo</a>}</div>
                </div>
              </article>))}</div></div></section>
          <section id="resume"><div className="wrap">
            <h2 className="sec-title">My <span className="hl">Resume</span></h2>
            <p className="sub" style={{ margin: '0 auto 28px', textAlign: 'center' }}>View or download my resume.</p>
            <div className="resume-actions"><a className="b p" href="/Kashish_Mahore_Resume.pdf" download>↓ Download CV</a><a className="b" href="/Kashish_Mahore_Resume.pdf" target="_blank" rel="noopener">Open in new tab</a></div>
            <div className="resume-frame"><iframe src="/Kashish_Mahore_Resume.pdf" title="Kashish Mahore Resume" loading="lazy" /></div>
          </div></section>
          <section id="blogs"><div className="wrap">
            <h2 className="sec-title">My <span className="hl">Blogs</span></h2>
            <p className="sub" style={{ margin: '0 auto', textAlign: 'center' }}>Blog posts coming soon. Stay tuned!</p>
          </div></section>
          <section id="blogs"><div className="wrap">
            <h2 className="sec-title">My <span className="hl">Blogs</span></h2>
            <p className="sub" style={{ margin: '0 auto', textAlign: 'center' }}>Blog posts coming soon. Stay tuned!</p>
          </div></section>
          <section id="contact" className="ct"><div className="wrap"><h2>Let's build something</h2><p className="sub" style={{ margin: '0 auto 28px' }}>I'm looking for software and AI engineering roles. Send a message and it lands straight in my database.</p><Contact /></div></section>
        </main>
        <footer>Â© 2026 Kashish Mahore Â· <a href="#admin">Admin</a></footer>
      </div>)}
  </>)
}
