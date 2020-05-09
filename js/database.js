function pushText(roomNumber){
    let text = getAllLines();
    ipcRenderer.send('roomCreated', {
        text : text,
        room: roomNumber
    });
}

ipcRenderer.on('dataPulled', (ev, snapshot) => {
    setAllLines(snapshot.data)
})

ipcRenderer.on('lineUpdated', (ev, snapshot) => {
    console.log(snapshot);    
})



function pushLine(roomNumber, lineNumber, lineText) {
    ipcRenderer.send('linePush', {
        roomNumber: roomNumber,
        lineNumber: lineNumber,
        lineText: lineText
    })
}

pushLine(28832, 1, "Updated line 1")