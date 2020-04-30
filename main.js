const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')
const url = require('url')
const Swal = require('sweetalert2')
let win = [];
app.on('ready', editorEkranı);

ipcMain.on('export', (ev, value)=>{
    //exportWindow()
    console.log(value);

});



function exportWindow(){
    win[1] = new BrowserWindow({
        width: 400,
        height: 400,  
        frame: false,
        webPreferences: {
            nodeIntegration: true,
        }
    })
    win[1].loadURL(url.format({
        pathname: path.join(__dirname, './pages/export.html'),
        protocol: 'file:',
        slashes: true
    }))
    // win[1].webContents.openDevTools();
    win[1].on('closed', () => {
        win[1] = null
    })
}

function editorEkranı() {
    // Yeni bir pencere yarat
    win[0] = new BrowserWindow({
        //width: 800,
        //height: 600,
        fullscreen: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            // webSecurity: false
        }
    })
    win[0].loadURL(url.format({
        pathname: path.join(__dirname, './pages/index.html'),
        protocol: 'file:',
        slashes: true
    }))
    // win[0].webContents.openDevTools();
    win[0].on('closed', () => {
        win[0] = null
    })
}
