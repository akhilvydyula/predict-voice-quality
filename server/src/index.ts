import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import {
  getProfile,
  getProfileMeta,
  getStoreStats,
  listSessions,
  saveProfile,
  syncSession,
} from './store.js';
import type { SingerProfile, SyncSessionRequest } from './types.js';

const VERSION = '1.0.0';
const startedAt = Date.now();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const apiKey = process.env.API_KEY?.trim() || null;

app.use(cors());
app.use(express.json({ limit: '512kb' }));

function requireApiKey(req: Request, res: Response, next: NextFunction) {
  if (!apiKey) {
    next();
    return;
  }

  const header = req.header('x-api-key');
  if (header !== apiKey) {
    res.status(401).json({ error: 'Invalid or missing API key', code: 'unauthorized' });
    return;
  }

  next();
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'voice-quality-api',
    version: VERSION,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  });
});

app.get('/v1/status', requireApiKey, (_req, res) => {
  const stats = getStoreStats();
  res.json({
    ok: true,
    service: 'voice-quality-api',
    version: VERSION,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    ...stats,
  });
});

app.post('/v1/sessions', requireApiKey, (req, res) => {
  const body = req.body as Partial<SyncSessionRequest>;

  if (!isNonEmptyString(body.deviceId)) {
    res.status(400).json({ error: 'deviceId is required', code: 'invalid_request' });
    return;
  }
  if (!body.summary?.metrics || !body.summary?.insights || !body.summary?.coaching) {
    res.status(400).json({ error: 'summary is required', code: 'invalid_request' });
    return;
  }
  if (!body.advanced) {
    res.status(400).json({ error: 'advanced is required', code: 'invalid_request' });
    return;
  }

  const result = syncSession(body.deviceId.trim(), body.summary, body.advanced, body.profile);
  res.status(201).json(result);
});

app.get('/v1/sessions/:deviceId', requireApiKey, (req, res) => {
  const deviceId = req.params.deviceId?.trim();
  if (!deviceId) {
    res.status(400).json({ error: 'deviceId is required', code: 'invalid_request' });
    return;
  }

  const limit = Math.min(Number(req.query.limit ?? 20) || 20, 50);
  res.json({
    deviceId,
    sessions: listSessions(deviceId, limit),
  });
});

app.get('/v1/profile/:deviceId', requireApiKey, (req, res) => {
  const deviceId = req.params.deviceId?.trim();
  if (!deviceId) {
    res.status(400).json({ error: 'deviceId is required', code: 'invalid_request' });
    return;
  }

  const meta = getProfileMeta(deviceId);
  res.json({
    deviceId,
    profile: getProfile(deviceId),
    updatedAt: meta?.updatedAt ?? null,
  });
});

app.put('/v1/profile/:deviceId', requireApiKey, (req, res) => {
  const deviceId = req.params.deviceId?.trim();
  const profile = req.body?.profile as SingerProfile | undefined;

  if (!deviceId) {
    res.status(400).json({ error: 'deviceId is required', code: 'invalid_request' });
    return;
  }
  if (!profile?.sessions || !profile.skillAverages) {
    res.status(400).json({ error: 'profile is required', code: 'invalid_request' });
    return;
  }

  saveProfile(deviceId, profile);
  const meta = getProfileMeta(deviceId);
  res.json({
    deviceId,
    profile: getProfile(deviceId),
    updatedAt: meta?.updatedAt ?? null,
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', code: 'not_found' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`voice-quality-api listening on 0.0.0.0:${port}`);
});
