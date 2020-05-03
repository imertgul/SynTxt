function pushText(roomNumber){
    let text = getAllLines();
    ipcRenderer.send('roomCreated', {
        text : text,
        room: roomNumber
    });
}