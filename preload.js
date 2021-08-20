// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {app, BrowserWindow} = require('electron')
window.addEventListener('DOMContentLoaded', () => {
  console.log('HELLO')
  const element = document.getElementById("clientVersion");
  element.innerText = app.getVersion();
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
