import { parseVisitorProfile, type VisitorProfile } from './chat-profile';
import type { ChatSnapshot } from './chat-types';
const key = 'h4t-visitor-memory-v1';
export function readVisitorCache(): { profile: VisitorProfile | null; snapshot: ChatSnapshot | null } {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    if (!value || Date.now() - value.savedAt > 30 * 86400000) return { profile: null, snapshot: null };
    const profile = parseVisitorProfile(value.profile || {});
    const snapshot = value.snapshot && ['cms', 'preview'].includes(value.snapshot.mode) && Array.isArray(value.snapshot.messages) ? value.snapshot as ChatSnapshot : null;
    return { profile, snapshot };
  } catch { return { profile: null, snapshot: null }; }
}
// Contact details and a bounded recent history stay on this browser. The private
// server cookie is never readable by JavaScript or included in local storage.
export function writeVisitorCache(profile: VisitorProfile | null, snapshot: ChatSnapshot | null) {
  try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), profile, snapshot: snapshot ? { ...snapshot, messages: snapshot.messages.slice(-120) } : null })); } catch { /* Storage can be disabled or full. Chat still works through its cookie. */ }
}
