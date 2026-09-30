'use strict';
/* 숨 결투장 — 결정론 수학 (SPEC 20장)
 * Math.pow·sin·cos·atan2·hypot은 JS 엔진마다(같은 V8이라도 판마다) 마지막 자리가 다르다. 그 차이가 수천 걸음 뒤 판을 가른다.
 * 그래서 IEEE 754가 결과를 하나로 정한 연산(사칙연산, sqrt, round)만으로 계산한다. 정밀도는 1e-15 안팎.
 * 엔진 안에서는 Math의 위 함수들을 쓰지 않는다 (시험이 본다). */
const PIO2 = 1.5707963267948966, PIO2_HI = 1.5707963267341256, PIO2_LO = 6.077100506506192e-11;
const LN2_HI = 6.93147180369123816490e-01, LN2_LO = 1.90821492927058770002e-10, SQRT2 = Math.sqrt(2);
const series = (n, f) => { const c = []; for (let k = 0; k < n; k++) c.push(f(k)); return c; };
const horner = (c, z) => { let v = c[c.length - 1]; for (let k = c.length - 2; k >= 0; k--) v = v * z + c[k]; return v; };
let fac = 1; const FACT = series(24, k => (fac = k ? fac * k : 1));
const SINC = series(9, k => (k % 2 ? 1 : -1) / FACT[2 * k + 3]), COSC = series(9, k => (k % 2 ? -1 : 1) / FACT[2 * k + 4]);   // r³부터, r⁴부터
const ATNC = series(13, k => (k % 2 ? 1 : -1) / (2 * k + 3)), EXPC = series(18, k => 1 / FACT[k + 2]), LOGC = series(11, k => 1 / (2 * k + 3));
const P2 = new Map(); for (let k = 0, v = 1, u = 1; k <= 1023; k++, v *= 2, u /= 2) { P2.set(k, v); P2.set(-k, u); }
function sincos(x, wantCos) {
  if (!isFinite(x)) return NaN;
  const k = Math.round(x / PIO2), r = (x - k * PIO2_HI) - k * PIO2_LO, z = r * r, q = ((k % 4) + 4) % 4;
  const s = r + r * z * horner(SINC, z), c = 1 - z / 2 + z * z * horner(COSC, z), i = wantCos ? (q + 1) % 4 : q;
  return i === 0 ? s : i === 1 ? c : i === 2 ? -s : -c;
}
const sin = x => sincos(x, false), cos = x => sincos(x, true);
function atan(x) {
  if (x !== x) return NaN; if (x < 0) return -atan(-x); if (x > 1) return PIO2_HI - (atan(1 / x) - PIO2_LO);
  const t = x / (1 + Math.sqrt(1 + x * x)), u = t / (1 + Math.sqrt(1 + t * t)), z = u * u;   // atan x = 4 atan u, |u| ≤ tan(π/16)
  return 4 * (u + u * z * horner(ATNC, z));
}
function atan2(y, x) {
  if (x !== x || y !== y) return NaN;
  if (x > 0) return atan(y / x); if (x < 0) return y >= 0 ? atan(y / x) + Math.PI : atan(y / x) - Math.PI;
  return y > 0 ? PIO2 : y < 0 ? -PIO2 : 0;
}
function exp(x) {
  if (x !== x) return NaN; if (x > 709.78) return Infinity; if (x < -745.2) return 0;
  const k = Math.round(x / LN2_HI), r = (x - k * LN2_HI) - k * LN2_LO, v = 1 + r + r * r * horner(EXPC, r);
  return k > 1023 ? v * P2.get(1023) * P2.get(k - 1023) : k < -1022 ? v * P2.get(-1022) * P2.get(k + 1022) : v * P2.get(k);
}
function log(x) {
  if (x !== x || x < 0) return NaN; if (x === 0) return -Infinity; if (x === Infinity) return x;
  let e = 0, m = x; while (m >= 2 ** 64) { m /= 2 ** 64; e += 64; } while (m < 2 ** -64) { m *= 2 ** 64; e -= 64; }
  while (m >= SQRT2) { m /= 2; e++; } while (m < SQRT2 / 2) { m *= 2; e--; }
  const s = (m - 1) / (m + 1), z = s * s;
  return e * LN2_HI + (e * LN2_LO + 2 * (s + s * z * horner(LOGC, z)));
}
function pow(x, y) {
  if (y === 0) return 1; if (x === 1) return 1; if (x !== x || y !== y) return NaN;
  if (x === 0) return y > 0 ? 0 : Infinity;
  if (x < 0) { if (Math.round(y) !== y) return NaN; const v = exp(y * log(-x)); return Math.abs(y % 2) === 1 ? -v : v; }
  return exp(y * log(x));
}
const hyp = (x, y) => Math.sqrt(x * x + y * y);
const hyp3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);   // 높이를 넣은 거리 (z = 0이면 hyp와 비트까지 같다)
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

module.exports = { sin, cos, atan, atan2, exp, log, pow, hyp, hyp3, clamp, mulberry32, horner };
