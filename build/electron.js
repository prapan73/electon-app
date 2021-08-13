const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const startUrl = url.format({
    pathname: path.join(__dirname, "../build/index.html"),
    protocol: "file:",
    slashes: true,
  });
  win.loadURL(startUrl);
  console.log(startUrl);

  win.webContents.openDevTools({ mode: "detach" });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

app.once("ready-to-show", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-available", () => {
  app.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  app.webContents.send("update_downloaded");
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
