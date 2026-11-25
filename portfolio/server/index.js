import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import pg from 'pg'
import rateLimit from 'express-rate-limit'
import { timingSafeEqual } from 'crypto'

const db = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === '1' ? { rejectUnauthorized: false } : false })
const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || true }))
app.use(express.json({ limit: '50kb' }))

const auth = (req, res, next) => {
  try { jwt.verify((req.headers.authorization || '').slice(7), process.env.JWT_SECRET); next() }
  catch { res.status(401).json({ error: 'Please log in again.' }) }
}
const same = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))
const wrap = fn => (req, res) => fn(req, res).catch(e => { console.error(e); res.status(500).json({ error: 'Server error' }) })
const slow = rateLimit({ windowMs: 15 * 60 * 1000, max: 8, message: { error: 'Too many attempts. Try again later.' } })

app.get('/api/projects', wrap(async (_, res) => res.json((await db.query('SELECT * FROM projects ORDER BY position, id')).rows)))

app.post('/api/contact', slow, wrap(async (req, res) => {
  const { name = '', email = '', body = '' } = req.body
  if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || body.trim().length < 5) return res.status(400).json({ error: 'Add your name, a valid email and a message.' })
  await db.query('INSERT INTO messages(name,email,body) VALUES($1,$2,$3)', [name.slice(0, 100), email.slice(0, 200), body.slice(0, 2000)])
  res.json({ ok: true })
}))

app.post('/api/login', slow, (req, res) => {
  if (!same(String(req.body.password || ''), process.env.ADMIN_PASSWORD)) return res.status(401).json({ error: 'Wrong password.' })
  res.json({ token: jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '12h' }) })
})

app.post('/api/projects', auth, wrap(async (req, res) => {
  const { title, summary, stack = [], repo = '', demo = '', featured = false } = req.body
  if (!title || !summary) return res.status(400).json({ error: 'Title and summary are required.' })
  const r = await db.query('INSERT INTO projects(title,summary,stack,repo,demo,featured,position) VALUES($1,$2,$3,$4,$5,$6,(SELECT COALESCE(MAX(position),0)+1 FROM projects)) RETURNING *', [title, summary, stack, repo, demo, featured])
  res.json(r.rows[0])
}))
app.delete('/api/projects/:id', auth, wrap(async (req, res) => { await db.query('DELETE FROM projects WHERE id=$1', [req.params.id]); res.json({ ok: true }) }))
app.get('/api/messages', auth, wrap(async (_, res) => res.json((await db.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 100')).rows)))

app.listen(process.env.PORT || 4000, () => console.log('API ready'))
