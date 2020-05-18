(function () {
    var someThings;

    module.exports.onDisconnect = function (firebase, sync, msg) {
        firebase.database().ref(sync.roomNumber).onDisconnect().set(msg, function (err) {
            if (err) {
                win[0].webContents.send('log', {
                    string: 'Disconnected!',
                    icon: 'warning'
                })
            }
        })
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