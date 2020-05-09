const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
const path = require('path')
const url = require('url')
const Swal = require('sweetalert2')
var firebase = require("firebase");
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
var database = firebase.database();
let sync = {
    isOnlive: false,
    roomNumber: 0
}

ipcMain.on('exit', (ev) => {
    app.exit(0)
});


function updatehandler() {
    firebase.database().ref(sync.roomNumber).on('child_changed', function (snapshot) {
        //win[0].webContents.send('lineUpdated', snapshot.val())
        win[0].webContents.send('lineUpdated', snapshot.val())
    });
}

ipcMain.on('linePush', (ev, snapshot) => {
    if (sync.isOnlive) {
        var updates = {};
        updates[snapshot.lineNumber] = snapshot.lineText;
        firebase.database().ref(snapshot.roomNumber).child('data').update(updates)
    } else
        console.log('isNotOnlive!');
});


ipcMain.on('roomCreated', (ev, data) => {
    sync.isOnlive = true;
    sync.roomNumber = data.room;
    firebase.database().ref(data.room).set({
        "data": data.text,
    });
    updatehandler()
});

ipcMain.on('export', (ev, value) => {
    console.log(value);
});

ipcMain.on('joinedRoom', (ev, roomNumber) => {
    sync.isOnlive = true;
    sync.roomNumber = roomNumber;
    updatehandler()
    return firebase.database().ref(roomNumber).once('value').then(function (snapshot) {
        win[0].webContents.send('dataPulled', snapshot.val())
    });
})

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
        win[0] = null
    })
}