const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require('electron')
const path = require('path')
const url = require('url')
const Swal = require('sweetalert2')
const firebase = require("firebase");
const myFunctions = require('./functions.js')
// Export için Zahid'in ekledikleri
var fs = require('fs') //
var md_pdf = require("markdown-pdf") //
var MarkdownIt = require('markdown-it') //
md = new MarkdownIt(); //

let win = [];
app.on('ready', editorScreen);

var firebaseConfig = {
    apiKey: "AIzaSyBtu0QiT7b7T1O2eBdGj5idS7F-mjAA8Pk",
    authDomain: "syntxt-10a1d.firebaseapp.com",
    databaseURL: "https://syntxt-10a1d.firebaseio.com",
    projectId: "syntxt-10a1d",
    storageBucket: "syntxt-10a1d.appspot.com",
    messagingSenderId: "728805023306",
    appId: "1:728805023306:web:7cac2b60b726bec76ed0b3",
    measurementId: "G-Y1KW1EZM23"
};
firebase.initializeApp(firebaseConfig);
var realTimeDatabase = firebase.database();

let sync = {
    isOnlive: false,
    roomNumber: 0
}

ipcMain.on('exit', (ev) => {
    app.exit(0)
});

function updatehandler() {
    realTimeDatabase.ref(sync.roomNumber).child('data').on('child_changed', function (snapshot) {
        let update_context = {
            'line': snapshot.key,
            'value': snapshot.val()
        }
        win[0].webContents.send('lineUpdated', update_context)
    });

    realTimeDatabase.ref(sync.roomNumber).child('data').on('child_added', function() {
        sendDataToRenderer()
    })

    realTimeDatabase.ref(sync.roomNumber).child('data').on('child_removed', function() {
        sendDataToRenderer()
    })
}

ipcMain.on('joinedRoom', (ev, roomNumber) => {
    sync.isOnlive = true;
    sync.roomNumber = roomNumber;
    updatehandler()
    return sendDataToRenderer()
})

ipcMain.on('roomCreated', (ev, data) => {
    sync.isOnlive = true;
    sync.roomNumber = (data.room != -1 ? data.room : sync.roomNumber)
    if (sync.roomNumber) {
        realTimeDatabase.ref(sync.roomNumber).set({
            "data": data.text,
        });
        updatehandler()
    }
});

ipcMain.on('linePush', (ev, update_context) => {
    if (sync.isOnlive) {
        var updates = {};
        updates[update_context.lineNumber - 1] = update_context.lineText;
        realTimeDatabase.ref(sync.roomNumber).child('data').update(updates)
    } else
        console.log('isNotOnlive!');
});


ipcMain.on('export', (ev, export_context) => {
    let content = export_context.content
    let type = export_context.type
    let options = {
        'properties': [
            'createDirectory'
        ],
        'defaultPath': app.getPath('desktop')
    }

    if (type == "MD") {
        options.filters = myFunctions.getMD()
    } else if (type == "HTML") {
        options.filters = myFunctions.getHtmlFilters()
    } else {
        options.filters = myFunctions.getPdfFilters()
    }

    let filepath = dialog.showSaveDialogSync(win[0], options)

    if (filepath) {
        if (type == "PDF") {
            md_pdf().from.string(content).to(filepath, function () {
                myFunctions.sweetAlerter(win[0], "File Exported...", "success");
            })
            return
        }
        if (type == "HTML") {
            content = md.render(content.replace(/(?:\r\n|\r|\n)/g, "  \n"))
        }
        fs.writeFile(filepath, content, (err) => {
            if (err) {
                myFunctions.sweetAlerter(win[0], "File export failed", "warning");
            } else
                myFunctions.sweetAlerter(win[0], "File Exported...", "success");
        });
    }
});

function sendDataToRenderer(){
    realTimeDatabase.ref(sync.roomNumber).once('value').then(function (snapshot) {
        win[0].webContents.send('dataPulled', snapshot.val())
    });
}


function editorScreen() {
    win[0] = new BrowserWindow({
        fullscreen: true,
        frame: false,
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
        if (sync.isOnlive) {
            realTimeDatabase.ref(sync.roomNumber).remove();
        }
        win[0] = null
    })
}