'use strict';

const fetch = require('node-fetch');

// TODO use wpt.fyi after https://github.com/web-platform-tests/wpt.fyi/pull/772 is deployed.
const RUNS_API = 'https://master-dot-wptdashboard.appspot.com/api/runs';

async function* iterateRuns() {
  let r = await fetch(`${RUNS_API}?max-count=500`);
  while (true) {
    if (!r.ok) {
      throw new Error(`non-OK fetch status ${r.status}`);
    }
    let runs = await r.json();
    for (const run of runs) {
      yield run;
    }
    const token = r.headers.get('wpt-next-page');
    if (!token) {
      break;
    }
    r = await fetch(`${RUNS_API}?page=${token}`);
  }
}

module.exports = { iterateRuns };