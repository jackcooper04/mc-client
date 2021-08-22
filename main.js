
// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path');

const fs = require('fs');
var rimraf = require("rimraf");

require('update-electron-app')();
console.log()
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'test.ico')
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '/dist/index.html'))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}
//../../../

fs.readdir(path.resolve(__dirname,'../../../'), (err, files) => {
  var webFound = false;
  console.log(files)
  for (filesIdx in files){
    if (files[filesIdx].includes('app')){
      if (files[filesIdx] != 'app-'+app.getVersion()){
        rimraf.sync(path.resolve(__dirname,'../../../',files[filesIdx]))
      }
    };

  }
  for (filesIdx in files){
    if (files[filesIdx].includes('web_server_root.js')){
      webFound = true;
      break;
    };

  };
  if (!webFound){
    fs.copyFile('./web_server_root.js', path.resolve(__dirname,'../../../web_server_root.js'), (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });
  };
  const webServer = path.join(__dirname,'../../../web_server_root.js')(app.getVersion());

  //console.log(files)
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
