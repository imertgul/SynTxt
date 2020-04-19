const electron = require('electron');
const {
  ipcRenderer
} = electron;

var isPreviewOn = false;
$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle").trigger("click");

$("#exportBtn").click(function(e){
    ipcRenderer.send('export');
})
$("#test").click(function(e){
  if (!isPreviewOn) {
    $("#editor").toggleClass("col-md-6");
    $("#editor").toggleClass("col-md-12");
    // $("#preview").addClass("col-md-6");
    $("#m-editor").css("width", "50%");
    $("#preview").css("display", "block");
    $("#preview").toggleClass("col-md-6");
    isPreviewOn = true;
  }
  else{
    $("#editor").toggleClass("col-md-6");
    $("#editor").toggleClass("col-md-12");
    // $("#editor").addClass("col-md-12");
    $("#m-editor").css("width", "95%");
    $("#preview").css("display", "none");
    $("#preview").toggleClass("col-md-6");
    isPreviewOn = false;
  }
})
//todo you know what to do

