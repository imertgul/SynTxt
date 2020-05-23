(function () {
    var someThings;

    module.exports.pushUser = function (realTimeDatabase, sync) {
        realTimeDatabase.ref(sync.roomNumber).child('users').push(sync.userName);
    }
    module.exports.onDisconnect = function (realTimeDatabase, sync, msg) {
        realTimeDatabase.ref(sync.roomNumber).onDisconnect().set(msg, function (err) {
            if (err) {
                win[0].webContents.send('log', {
                    string: 'Disconnected!',
                    icon: 'warning'
                })
            }
        })
    }
    module.exports.isAvalible = function (realTimeDatabase, sync) {
        var connectedRef = realTimeDatabase.ref(sync.roomNumber);
        connectedRef.once("value", function (snap) {
            console.log(snap.val());
            if (snap.exists()) {
                return true;
            } else {
                return false;
            }
        });
    }
    module.exports.isConnected = function (firebase) {
        var connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", function (snap) {
            if (snap.val() === true) {
                return true;
            } else {
                return false;
            }
        });
    }
    module.exports.sweetAlerter = function (win, messages, icon) {
        win.webContents.send('log', {
            string: messages,
            icon: icon
        })
    }

    module.exports.getHtmlFilters = function () {
        return  html_filters = [{
            'name': "HTML file",
            'extensions': ["html"]
        }];
    }
    module.exports.getPdfFilters = function () {
        return pdf_filters = [{
            'name': "PDF file",
            'extensions': ["pdf"]
        }];
    }
    module.exports.getMdFilters = function () {
        return  md_filters = [{
            'name': "Markdown file",
            'extensions': ["md"]
        }];
    }
    module.exports.getSomeThings = function () {
        return someThings();
    }

}());