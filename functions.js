(function () {
    var someThings;

    module.exports.setUsers = function (realTimeDatabase, sync, win) {
        realTimeDatabase.ref(sync.roomNumber).child('users').push(sync.userName).once('value', function (user) {
            realTimeDatabase.ref(sync.roomNumber).child('users').once('value', function (snapshot) {
                let userList = snapshot.val();
                let keyList = Object.keys(userList)
                let users = [];
                for (let index = 0; index < keyList.length; index++) {
                    users[index] = userList[keyList[index]];
                }
                console.log(users);
                
                //win.webContents.send('userListArrived', users);
                return users;
            })
        });
    }
    module.exports.checkUsers = function (realTimeDatabase, sync, win) {
        realTimeDatabase.ref(sync.roomNumber).child('users').once('value', function (snapshot) {
            if (snapshot.val()) { //TODO: BUNLARI YAPMAMIZ LAZIM HEPSİNE
                let userList = snapshot.val();
                let keyList = Object.keys(userList)
                let users = [];
                for (let index = 0; index < keyList.length; index++) {
                    users[index] = userList[keyList[index]];
                }
                console.log(users);
                win.webContents.send('userListArrived', users);
                return users;
            }
        })
    }
    module.exports.onDisconnect = function (realTimeDatabase, sync) {
        realTimeDatabase.ref(sync.roomNumber).child('users').once('value', function (snap) {
            let userList = snap.val();
            let keyList = Object.keys(userList)
            for (let index = 0; index < keyList.length; index++) {
                if (sync.userName == userList[keyList[index]]) {
                    realTimeDatabase.ref(sync.roomNumber).child('users').child(keyList[index]).remove();
                }
            }
            if (keyList.length = 1 && userList[keyList[0]] == sync.userName) {
                realTimeDatabase.ref(sync.roomNumber).remove();
            }
        })
        //realTimeDatabase.goOffline();
    }

    module.exports.sweetAlerter = function (win, messages, icon) {
        win.webContents.send('log', {
            string: messages,
            icon: icon
        })
    }

    module.exports.getHtmlFilters = function () {
        return html_filters = [{
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
        return md_filters = [{
            'name': "Markdown file",
            'extensions': ["md"]
        }];
    }
    module.exports.getSomeThings = function () {
        return someThings();
    }

}());