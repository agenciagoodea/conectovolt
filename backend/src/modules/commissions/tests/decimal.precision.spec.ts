import { Prisma } from '../../../generated/client';

describe('Monetary Decimal Precision Unit Tests', () => {
  it('should prevent binary floating point errors (0.10 + 0.20 === 0.30)', () => {
    const a = new Prisma.Decimal('0.10');
    const b = new Prisma.Decimal('0.20');
    const sum = a.add(b);

    expect(sum.toString()).toBe('0.3');
    expect(Number(sum)).toBe(0.3);
  });

  it('should calculate platform and operator commission accurately without penny leakage', () => {
    const paymentAmount = new Prisma.Decimal('33.33');
    const percentage = new Prisma.Decimal('5.00');

    const platformAmount = paymentAmount
      .mul(percentage)
      .div(100)
      .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

    const operatorAmount = paymentAmount
      .sub(platformAmount)
      .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

    expect(platformAmount.toString()).toBe('1.67');
    expect(operatorAmount.toString()).toBe('31.66');
    expect(platformAmount.add(operatorAmount).toString()).toBe('33.33');
  });

  it('should handle exact tariff calculations with 4 decimal places (price_per_kwh)', () => {
    const pricePerKwh = new Prisma.Decimal('1.8595');
    const energyKwh = new Prisma.Decimal('25.4000');

    const totalAmount = pricePerKwh
      .mul(energyKwh)
      .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

    // 1.8595 * 25.4 = 47.2313 -> rounded to 47.23
    expect(totalAmount.toString()).toBe('47.23');
  });
});
