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

ipcRenderer.on('lineUpdated', (ev, update_context) => {
    setLine(Number(update_context.line), update_context.value)
})


function pushLine(lineNumber, lineText) {
    ipcRenderer.send('linePush', {
        lineNumber: lineNumber,
        lineText: lineText
    })
}