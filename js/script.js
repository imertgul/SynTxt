const electron = require('electron');
const {
  ipcRenderer
} = electron;
$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle").trigger("click");

$("#exportBtn").click(function(e){
    ipcRenderer.send('export');
})