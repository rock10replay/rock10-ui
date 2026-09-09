/**
 * Utilitários de limpeza, formatação e validação matemática de CPF (dígitos verificadores).
 */

export function cleanCpf(cpf: string | null | undefined): string {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
}

export function formatCpf(cpf: string | null | undefined): string {
  const numbers = cleanCpf(cpf).slice(0, 11);
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
}

export function isValidCpf(cpf: string | null | undefined): boolean {
  const clean = cleanCpf(cpf);

  // Deve ter exatamente 11 dígitos
  if (clean.length !== 11) {
    return false;
  }

  // Rejeita sequências conhecidas de dígitos repetidos (ex: 00000000000, 11111111111, etc.)
  if (/^(\d)\1{10}$/.test(clean)) {
    return false;
  }

  // Validação do 1º dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i], 10) * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(clean[9], 10) !== digit1) {
    return false;
  }

  // Validação do 2º dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean[i], 10) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(clean[10], 10) !== digit2) {
    return false;
  }

  return true;
}
