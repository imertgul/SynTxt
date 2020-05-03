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