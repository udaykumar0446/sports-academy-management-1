import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:4200').split(',').map(s => s.trim());
const here = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.join(here, 'data', 'athletes.json');
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

async function readAll() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  try { return JSON.parse(await fs.readFile(dataFile, 'utf8')); }
  catch (e) { if (e.code !== 'ENOENT') throw e; await fs.writeFile(dataFile, '[]\n'); return []; }
}
async function writeAll(rows) { await fs.writeFile(dataFile, JSON.stringify(rows, null, 2) + '\n'); }
function validate(body) {
  const athlete = { name: String(body.name || '').trim(), sport: String(body.sport || '').trim(), email: String(body.email || '').trim(), phone: String(body.phone || '').trim(), status: body.status === 'On Hold' ? 'On Hold' : 'Active' };
  if (!athlete.name || !athlete.sport || !athlete.email) return { error: 'Name, sport, and email are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(athlete.email)) return { error: 'Enter a valid email address.' };
  return { athlete };
}
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/athletes', async (req, res, next) => { try { const q = String(req.query.q || '').toLowerCase(); const rows = await readAll(); res.json(rows.filter(a => [a.name,a.sport,a.email,a.status].some(v => String(v).toLowerCase().includes(q)))); } catch(e) { next(e); } });
app.get('/api/dashboard', async (_req, res, next) => { try { const rows = await readAll(); res.json({ totalAthletes: rows.length, activeAthletes: rows.filter(a => a.status === 'Active').length, sportsCount: new Set(rows.map(a => a.sport)).size, onHold: rows.filter(a => a.status === 'On Hold').length }); } catch(e) { next(e); } });
app.post('/api/athletes', async (req, res, next) => { try { const v = validate(req.body); if (v.error) return res.status(400).json({message:v.error}); const rows = await readAll(); if (rows.some(a => a.email.toLowerCase() === v.athlete.email.toLowerCase())) return res.status(409).json({message:'That email is already registered.'}); const row = { id: Date.now().toString(), ...v.athlete, joinedAt: new Date().toISOString() }; rows.unshift(row); await writeAll(rows); res.status(201).json(row); } catch(e) { next(e); } });
app.put('/api/athletes/:id', async (req, res, next) => { try { const v = validate(req.body); if (v.error) return res.status(400).json({message:v.error}); const rows = await readAll(); const i = rows.findIndex(a => a.id === req.params.id); if (i < 0) return res.status(404).json({message:'Athlete not found.'}); if (rows.some(a => a.id !== req.params.id && a.email.toLowerCase() === v.athlete.email.toLowerCase())) return res.status(409).json({message:'That email is already registered.'}); rows[i] = {...rows[i], ...v.athlete}; await writeAll(rows); res.json(rows[i]); } catch(e) { next(e); } });
app.delete('/api/athletes/:id', async (req, res, next) => { try { const rows = await readAll(); const remaining = rows.filter(a => a.id !== req.params.id); if (rows.length === remaining.length) return res.status(404).json({message:'Athlete not found.'}); await writeAll(remaining); res.status(204).end(); } catch(e) { next(e); } });
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({message:'Internal server error.'}); });
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
