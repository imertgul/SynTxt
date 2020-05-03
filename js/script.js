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
    if (result.value) {
      Swal.fire({
        type: 'success',
        icon: 'success',
        html: '<h3>'+result.value + ' file exported </h3>'
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

function roomNumber(min, max) {
  return min + Math.floor((max - min) * Math.random());
}

$("#sync").click(function (e) {
  Swal.fire({
    title: 'You are going to work with a friend!',
    text: "Create or a join a room",
    icon: 'warning',
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#ffcc00',
    confirmButtonText: 'Create',
    cancelButtonText: 'Join'
  }).then((result) => {
    if (result.value) {
      let tempNumber = roomNumber(0, 100000);
      Swal.fire({
        type: 'success',
        text: 'Create',
        showCloseButton: true,
        html: '<h3>Your room number is: ' + tempNumber + '</h3>',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Create and Join!'
      });
      pushText(tempNumber)
    } else if (result.dismiss == 'cancel'){
      Swal.fire({
        title: 'Submit your Room number',
        text: 'Room number must be created today!',
        input: 'number',
        showCancelButton: true,
        confirmButtonText: 'Join a room',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.value) {
          ipcRenderer.send('joinedRoom', result.value)
          Swal.fire({
            title: `Data çekiliyooo`,
            icon: 'success',
          })
        }
      })
    }

  })
})
