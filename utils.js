module.exports = {
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  // format time to be HH:mm:ss
  formatTime: (date) => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
}
