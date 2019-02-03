const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  MenuItem
} = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const url = require('url')
process.env.GOOGLE_API_KEY = ''

let tray
let window
let dev = false

if (
  process.defaultApp ||
  /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
  /[\\/]electron[\\/]/.test(process.execPath)
) {
  console.log('dev', true)
  dev = true
}
autoUpdater.checkForUpdatesAndNotify()
// Don't show the app in the doc
app.dock.hide()

app.on('ready', () => {
  createTray()
  createWindow()
})

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit()
})

const createTray = () => {
  tray = new Tray(path.join(__dirname, './icon.png'))
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && dev) {
      window.openDevTools({ mode: 'detach' })
    }
  })
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

const createWindow = () => {
  window = new BrowserWindow({
    width: 500,
    height: 400,
    show: false,
    frame: false,
    fullscreenable: false,
    icon: path.join(__dirname, 'src/assets/icons/png/128x128.png'),
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })
  // and load the index.html of the app.
  let indexPath
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }
  window.loadURL(indexPath)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const toggleMenu = () => {
  const menu = new Menu()

  // Build menu one item at a time, unlike
  menu.append(
    new MenuItem({
      label: 'Quit App',
      role: 'quit'
    })
  )
  menu.popup({})
}

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)
  event.returnValue = toggleMenu()
})

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.webContents.send('reload-home', true)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})
