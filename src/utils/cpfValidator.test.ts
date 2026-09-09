import { describe, it, expect } from 'vitest';
import { cleanCpf, formatCpf, isValidCpf } from './cpfValidator';

describe('cpfValidator', () => {
  it('cleanCpf removes non-numeric characters', () => {
    expect(cleanCpf('123.456.789-00')).toBe('12345678900');
    expect(cleanCpf('')).toBe('');
    expect(cleanCpf(null)).toBe('');
    expect(cleanCpf(undefined)).toBe('');
  });

  it('formatCpf formats 11 digits correctly', () => {
    expect(formatCpf('12345678901')).toBe('123.456.789-01');
    expect(formatCpf('123')).toBe('123');
    expect(formatCpf('123456')).toBe('123.456');
    expect(formatCpf('123456789')).toBe('123.456.789');
  });

  it('isValidCpf validates valid and invalid CPFs', () => {
    // Sequências repetidas inválidas
    expect(isValidCpf('00000000000')).toBe(false);
    expect(isValidCpf('111.111.111-11')).toBe(false);
    expect(isValidCpf('123')).toBe(false);

    // CPFs válidos conhecidos matematicamente
    // 52998224725 -> 5+2+9+9+8+2+2+4+7 = valid
    expect(isValidCpf('52998224725')).toBe(true);
    expect(isValidCpf('529.982.247-25')).toBe(true);

    // CPF inválido (dígitos trocados)
    expect(isValidCpf('529.982.247-26')).toBe(false);
  });
});
