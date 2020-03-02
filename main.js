const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')
const url = require('url')

let win
app.on('ready', girisEkranı);

ipcMain.on('signIn', (ev, user)=>{
    // console.log(user);
    mainScreen(user);
    win.close();
});
ipcMain.on('appClose', (ev)=>{
    app.quit();
});


function mainScreen(user){
    project = new BrowserWindow({
        frame: false,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            // webSecurity: false
        }
    })
    project.loadURL(url.format({
        pathname: path.join(__dirname, 'project.html'),
        protocol: 'file:',
        slashes: true
    }))
    // project.webContents.openDevTools();
}

function girisEkranı() {
    // Yeni bir pencere yarat
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            // webSecurity: false
        }
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'auth.html'),
        protocol: 'file:',
        slashes: true
    }))
    // win.webContents.openDevTools();
    win.on('closed', () => {
        /*
        Pencerenin referansını kaldırıyoruz.
        Uygulama birden fazla pencereye sahipse, 
        pencereleri bir dizide saklamanız öneriliyor.
        İlgili nesnenin (örnekte win) silineceği zaman budur.
        */
        win = null
    })
}

