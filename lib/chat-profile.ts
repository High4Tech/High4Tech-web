export type VisitorProfile = { name: string; email: string; phone: string };
export function parseVisitorProfile(value: Record<string, unknown>): VisitorProfile | null {
  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const email = typeof value.email === 'string' ? value.email.trim().toLowerCase() : '';
  const phone = typeof value.phone === 'string' ? value.phone.trim() : '';
  const digits = phone.replace(/\D/g, '');
  if (name.length < 2 || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length > 40 || !/^\+?[\d\s().-]+$/.test(phone) || digits.length < 7 || digits.length > 15) return null;
  return { name, email, phone: (phone.startsWith('+') ? '+' : '') + digits };
}
export const hasVisitorProfile = (value: { visitorName?: string; visitorEmail?: string | null; visitorPhone?: string | null } | null | undefined) => Boolean(value && parseVisitorProfile({ name: value.visitorName, email: value.visitorEmail, phone: value.visitorPhone }));
