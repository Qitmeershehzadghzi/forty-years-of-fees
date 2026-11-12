import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRealFee,
  calculateNominalGrowth,
  calculateCAGR,
  calculateInflationRate,
  calculateRealFeeGrowth
} from '../src/utils/inflationCalculator.js';

test('Inflation Engine: Real Fee calculation with historical fee=5000, histCPI=10, baseCPI=500', () => {
  // Real Fee in Base Year = Historical Fee × (CPI Base Year / CPI Historical Year)
  // Real Fee = 5000 × (500 / 10) = 250,000
  const realFee = calculateRealFee(5000, 10, 500);
  assert.equal(realFee, 250000);
});

test('Inflation Engine: Real Fee throws on invalid/negative inputs', () => {
  assert.throws(() => calculateRealFee(-500, 10, 100), /Invalid inflation calculation inputs/);
  assert.throws(() => calculateRealFee(500, 0, 100), /Invalid inflation calculation inputs/);
  assert.throws(() => calculateRealFee(500, 10, 0), /Invalid inflation calculation inputs/);
  assert.throws(() => calculateRealFee('invalid', 10, 100), /Invalid inflation calculation inputs/);
});

test('Inflation Engine: Nominal growth calculation', () => {
  // ((10000 - 5000) / 5000) * 100 = 100%
  const growth = calculateNominalGrowth(5000, 10000);
  assert.equal(growth, 100);
});

test('Inflation Engine: CAGR calculation', () => {
  // 5000 to 20000 over 10 years: (20000/5000)^(1/10) - 1 = 4^(0.1) - 1 ≈ 14.87%
  const cagr = calculateCAGR(5000, 20000, 10);
  assert.equal(cagr, 14.87);
});

test('Inflation Engine: Inflation rate calculation', () => {
  // CPI from 100 to 110: ((110 - 100) / 100) * 100 = 10%
  const rate = calculateInflationRate(110, 100);
  assert.equal(rate, 10);
});

test('Inflation Engine: Real fee growth calculation', () => {
  const growth = calculateRealFeeGrowth(200000, 250000);
  assert.equal(growth, 25);
});
