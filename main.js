const { app, BrowserWindow, session } = require('electron/main')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  win.loadFile('index.html')
}

app.whenReady().then(async () => {
  const { ElectronBlocker } = await import('@ghostery/adblocker-electron')
  const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))

  const youtubeSession = session.fromPartition('persist:youtube')
  const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)
  blocker.enableBlockingInSession(youtubeSession)
  console.log('Blocker active!')

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})