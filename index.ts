const {app, BrowserWindow} = require('electron')
let win;
const createWindow = () => {
  win = new BrowserWindow({
    show: false
  });
  win.maximize();
  win.loadURL(`file://${__dirname}/dist/index.html`);
  // win.webContents.openDevTools();
  win.on('closed', () => win = null);
  win.setMenu(null);
  win.on('ready-to-show', () => {
    win.show()
    win.focus()
  })
}

app.on('ready', _ => createWindow())
app.on('window-all-closed', _ => process.platform !== 'darwin' && app.quit())
app.on('activate', _ => win === null && createWindow())
