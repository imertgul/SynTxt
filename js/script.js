const electron = require('electron');
const Swal = require('sweetalert2');
const {
  ipcRenderer
} = electron;

var isPreviewOn = false;
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle").trigger("click");

$("#exportBtn").click(function (e) {
  Swal.fire({
    title: 'Select Export Type',
    input: 'select',
    inputOptions: {
      MD: 'MD files',
      PDF: 'PDF',
      HTML: 'HTML',
    },
    //inputPlaceholder: 'Select a fruit',
    footer: '<a href>Sorular için tıkla!</a>',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        ipcRenderer.send('export', value);
        resolve();
      })
    }
  }).then(function (result) {
    if (result.value != undefined) {
      Swal.fire({
        type: 'success',
        html: result.value + ' file exported'
      })
    }
  })


})

$("#exitApp").click(function (e) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Exit!'
  }).then((result) => {
    if (result.value) {
      ipcRenderer.send('exit');
    }
  }) 
})

