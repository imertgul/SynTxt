function pushText(sync){
    let text = getAllLines();
    ipcRenderer.send('roomCreated', {
        text : text,
        userName: sync.userName,
        room: sync.roomNumber
    });
}

ipcRenderer.on('dataPulled', (ev, snapshot) => {
    setAllLines(snapshot.data)
})

ipcRenderer.on('lineUpdated', (ev, update_context) => {
    setLine(Number(update_context.line), update_context.value)
})


function pushLines(lines) {
    ipcRenderer.send('linePush', lines);
}

function deleteLines(line_numbers) {
    ipcRenderer.send('lineDelete', line_numbers);
}