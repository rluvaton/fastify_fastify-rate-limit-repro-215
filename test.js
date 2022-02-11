const fetch = require('node-fetch');
const {sleep, formatTime} = require('./utils')

const storeType = process.argv[2];

console.log('Running with store type: ' + storeType);

let redisReadyPrResolve;
let redisReadyPrReject;

let redisReadyPr = new Promise((resolve, reject) => {
  redisReadyPrResolve = resolve;
  redisReadyPrReject = reject;
})

let url = 'http://localhost'
if (storeType === 'redis') {
  url += ':8001';

  const startRedisDb = require('./redis/start-redis-db');
  startRedisDb(redisReadyPrResolve, redisReadyPrReject);
} else {
  url += ':8000';
}


async function sendRequestAndLog(msg, ip = '127.0.0.1') {
  const res = await fetch(url, {
    headers: { 'my-ip': ip },
  });

  console.log(`${ip}: ${msg} | response code: ${res.status}`);

  return {
    msg,
    ip,
    status: res.status,
    time: formatTime(new Date(res.headers.get('Date'))),
  }
}
async function prepareForTest() {
  // Start the server
  if (storeType === 'redis') {
    await redisReadyPr;
    await require('./redis')
  } else {
    await require('./local');
  }
}

(async () => {
  await prepareForTest();

  console.log('Running test\n')

  const USER_1_IP = '1.1.1.1';
  const USER_2_IP = '2.2.2.2';

  const responseArray = [];

  // First request - will start the counter
  responseArray.push(await sendRequestAndLog('User 1 sends request, status should be 200', USER_1_IP));

  console.log('Waiting 7 seconds')
  await sleep(7 * 1000);

  responseArray.push(await sendRequestAndLog('User 2 sends request after 7s, status should be 200', USER_2_IP))
  responseArray.push(await sendRequestAndLog('User 2 sends another request immediately, status should be 429', USER_2_IP))

  console.log('Waiting 5 more seconds, then the global time window should reset')
  await sleep(5 * 1000);

  responseArray.push(await sendRequestAndLog('User 2 sends another request after 5s, status should be 429', USER_2_IP))


  console.log('\n')
  console.log('Summary')
  console.log('-------')

  console.table(responseArray);

  process.exit(0);
})().catch((e) => console.error('failed with some error', e));
