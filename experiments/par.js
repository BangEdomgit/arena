'use strict';
/* 숨 결투장 v2.19.0 — 실험용 병렬 실행기 (Node 전용, worker_threads)
 * 일감 = { mod: 모듈 경로, fn: 그 모듈이 내보낸 함수 이름, args: [인자…] }. 인자와 결과는 구조화 복제가 되는 값이어야 한다(함수 X).
 * 일꾼마다 모듈을 한 번 읽어 두고(데워진 채로) 큐에서 일감을 하나씩 가져간다. 결과는 일감 차례대로 돌려준다.
 * 판마다 씨앗이 정해져 있으니, 어느 일꾼이 어떤 차례로 돌려도 결과는 한 줄로 돌린 것과 같다(시험).
 * 주의: 부모 프로세스에서 register로 붙인 마법·덱·두뇌는 일꾼에 없다. 일꾼에서도 필요하면 setup 모듈에서 붙인다.
 *   const { runJobs } = require('./experiments/par');
 *   const res = await runJobs([{ mod: require.resolve('../test/suite'), fn: 'duels', args: [a, b, 100, rules] }], { workers: 4 });
 */
const path = require('path'), os = require('os');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (!isMainThread && workerData && workerData.__arenaPar) {
  // 일꾼: 일감을 받아 돌리고 결과를 돌려준다
  if (workerData.setup) require(workerData.setup);
  const mods = {};
  parentPort.on('message', job => {
    try {
      const M = mods[job.mod] || (mods[job.mod] = require(job.mod));
      if (typeof M[job.fn] !== 'function') throw new Error(job.mod + ': 내보낸 함수가 없다 — ' + job.fn);
      parentPort.postMessage({ i: job.i, ok: true, v: M[job.fn](...(job.args || [])) });
    } catch (e) { parentPort.postMessage({ i: job.i, ok: false, err: String(e && e.stack || e) }); }
  });
}

// 일꾼 수 기본값: 코어 수
const defaultWorkers = () => Math.max(1, (os.availableParallelism ? os.availableParallelism() : os.cpus().length));

// jobs를 workers개 일꾼으로 나눠 돌린다. onDone(끝난 수, 전체)는 진행 표시용. 일감 하나가 실패하면 모두 멈추고 그 오류를 던진다
function runJobs(jobs, opt = {}) {
  const n = Math.min(jobs.length, opt.workers || defaultWorkers()), out = new Array(jobs.length);
  if (!jobs.length) return Promise.resolve(out);
  return new Promise((resolve, reject) => {
    let next = 0, done = 0, failed = false; const ws = [];
    const stop = () => { for (const w of ws) w.terminate(); };
    const feed = w => { if (next < jobs.length) { const i = next++; w.postMessage(Object.assign({}, jobs[i], { i, mod: path.resolve(jobs[i].mod) })); } };
    for (let k = 0; k < n; k++) {
      const w = new Worker(__filename, { workerData: { __arenaPar: true, setup: opt.setup ? path.resolve(opt.setup) : null } });
      ws.push(w);
      w.on('message', r => {
        if (failed) return;
        if (!r.ok) { failed = true; stop(); reject(new Error('일감 ' + r.i + ' 실패:\n' + r.err)); return; }
        out[r.i] = r.v; done++; if (opt.onDone) opt.onDone(done, jobs.length);
        if (done === jobs.length) { stop(); resolve(out); } else feed(w);
      });
      w.on('error', e => { if (!failed) { failed = true; stop(); reject(e); } });
      feed(w);
    }
  });
}

// 한 줄로 돌리기 (같은 결과인지 견줄 때, 일꾼 1개와 같다)
function runSerial(jobs) { return jobs.map(j => { const M = require(path.resolve(j.mod)); return M[j.fn](...(j.args || [])); }); }

module.exports = { runJobs, runSerial, defaultWorkers };
