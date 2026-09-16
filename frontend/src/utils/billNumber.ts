// Deterministic/session-unique bill number generator: PE-2026-XXXX
const generatedNumbers = new Set<string>();

export function generateBillNumber(year: number = 2026): string {
  let attempts = 0;
  let candidate = '';
  
  while (attempts < 100) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit number between 1000 and 9999
    candidate = `PE-${year}-${randomSuffix}`;
    if (!generatedNumbers.has(candidate)) {
      generatedNumbers.add(candidate);
      return candidate;
    }
    attempts++;
  }
  
  // Fallback timestamp-based suffix
  const tsSuffix = String(Date.now()).slice(-4);
  candidate = `PE-${year}-${tsSuffix}`;
  generatedNumbers.add(candidate);
  return candidate;
}

export function generateMeterNumber(): string {
  const code = Math.floor(100000 + Math.random() * 900000);
  return `MTR-${code}`;
}
