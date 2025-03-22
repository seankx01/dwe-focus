const { app, BrowserWindow, systemPreferences } = require("electron/main");

const createWindow = () => {
  const win = new BrowserWindow({ show: false });
  win.loadFile("dist/index.html");
  win.maximize();
  win.setMinimumSize(600, 450);
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  systemPreferences.askForMediaAccess("camera").then((granted) => {
    if (!granted) {
      alert("Webcam use is restricted.");
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
