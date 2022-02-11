const {spawn} = require('child_process');
const chalk = require('chalk');
const exitHook = require('exit-hook');

function startRedisDb(resolve, reject) {
  console.log('Starting Redis, showing logs until redis is ready');
  const child = spawn('docker', ['run', '-p', '6379:6379', '--rm', 'redis:6-alpine']);

  // In case of error, fail
  child.on('exit', reject)
  child.on('error', reject)
  child.on('close', reject)

  let output = '';


  function onRedisData(data) {
    process.stdout.write(chalk.blue(data))
    output += data.toString();

    if (output.includes('Ready to accept connections')) {
      console.log('\n-----\nNo more redis data\n-----\n');
      resolve();
      child.stdout.off('data', onRedisData);
    }
  }

  child.stderr.on('data', (data) => process.stdout.write(chalk.red(data.toString())));
  child.stdout.on('data', onRedisData);

  exitHook(() => child.kill())
}

module.exports = startRedisDb;
