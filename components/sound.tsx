'use client';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

function playUiClick() {
  if (typeof window === 'undefined' || localStorage.getItem('h4t-sound') === 'off') return;
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(520, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(240, context.currentTime + 0.045);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.06);
  oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.065);
  window.setTimeout(() => context.close().catch(() => undefined), 120);
}

export function ClickSounds() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a,button,input[type="checkbox"],summary,select')) playUiClick();
    };
    document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);
  return null;
}

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => setEnabled(localStorage.getItem('h4t-sound') !== 'off'), []);
  return <button className="sound-toggle" aria-label={enabled ? 'Mute interface sounds' : 'Enable interface sounds'} aria-pressed={!enabled} onClick={() => { const next = !enabled; setEnabled(next); localStorage.setItem('h4t-sound', next ? 'on' : 'off'); }}>{enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}</button>;
}
