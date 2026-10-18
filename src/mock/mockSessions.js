// MOCK DATA: fake "signed-in devices". Deleted when the real backend is connected.
// Created the first time a person's sessions are requested.

export const sessionsByUser = new Map()

export function createDefaultSessions() {
  return [
    { id: 'current', device: 'This device', location: 'Accra, Ghana', lastActive: new Date().toISOString(), current: true },
    { id: 'sess-2', device: 'Chrome on Windows', location: 'Accra, Ghana', lastActive: '2026-10-17T18:20:00Z', current: false },
    { id: 'sess-3', device: 'Safari on iPhone', location: 'Kumasi, Ghana', lastActive: '2026-10-16T09:05:00Z', current: false },
  ]
}