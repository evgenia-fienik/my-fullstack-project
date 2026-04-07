export function getId(raw: any): string {
  if (!raw) return '';
  if (typeof raw === 'string') return raw;
  return raw.$oid || String(raw);
}