const electron = require('electron');
const Swal = require('sweetalert2');
const {
  ipcRenderer
} = electron;

let sync = {
  isOnlive: false,
  roomNumber: 0,
  userName: "zero"
}

$('body').toggleClass('sidebar-xs').removeClass('sidebar-mobile-main');
$('#usersStatus').prop('disabled', true);

$("#exportBtn").click(function (e) {
  Swal.fire({
    title: 'Select Export Type',
    input: 'select',
    inputOptions: {
      MD: 'md',
      PDF: 'pdf',
      HTML: 'html',
    },
    //inputPlaceholder: 'Select a fruit',
    footer: '<a href>Sorular için tıkla!</a>',
    showCancelButton: true,
    inputValidator: (value) => {
      return new Promise((resolve) => {
        let export_context = {
          'type': value,
          'content': last_value
        }
        ipcRenderer.send('export', export_context);
        resolve();
      })
    }
  })
})

ipcRenderer.on('joinedSuccessfuly', (ev, snap) => {
  sync.isOnlive = true;
  sync.roomNumber = snap.roomNumber;
  setStateBars(sync);
})

ipcRenderer.on('log', (ev, snap) => {
  Swal.fire({
    icon: snap.icon,
    html: '<h3>' + snap.string + '</h3>'
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
  if (!sync.isOnlive) {
    Swal.fire({
      title: 'Sync Working is starting',
      text: 'Please type a temporary username!',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        sync.userName = result.value;
        console.log(sync);
        Swal.fire({
          title: 'You are going to work with a friend!',
          text: "Create or a join a room.",
          //icon: 'warning',
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#ffcc00',
          confirmButtonText: 'Create',
          cancelButtonText: 'Join'
        }).then((result) => {
          if (result.value) {
            // let tempNumber = roomNumber(0, 100000);
            let tempNumber = 0 + Math.floor((100000 - 0) * Math.random());
            Swal.fire({
              type: 'success',
              text: 'Create',
              showCloseButton: true,
              html: '<h3>Your room number is: ' + tempNumber + '</h3>',
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Create and Join!'
            }).then((result) => {
              if (result.value) {
                sync.roomNumber = tempNumber
                sync.isOnlive = true
                setStateBars(sync);
                pushText(sync)
              }
            })
          } else if (result.dismiss == 'cancel') {
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
                sync.roomNumber = result.value;
                ipcRenderer.send('joinedRoom', sync)

              }
            })
          }
        })
      }
    })
  } else {
    Swal.fire({
      type: 'success',
      text: 'You are connected',
      showCloseButton: true,
      confirmButtonColor: '#a83a32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Disconnect!'
    }).then((result) => {
      if (result.value) {
        //todo disconnected
      }
    })
  }

})

var setStateBars = function (sync) {
  if (sync.isOnlive) {
    $('#usersStatus').prop('disabled', false);
    $("#sync").prop('disabled', false);
    $('#onlineStatus').html('<span class="badge bg-success my-3 my-md-0 ml-md-3 mr-md-auto">Online</span>');
    $('#roomStatus').html('<span class="badge bg-dark my-3 my-md-0 ml-md-3 mr-md-auto"> Room: '+ sync.roomNumber +'</span>');
  } else {
    $('#usersStatus').prop('disabled', true);
    $("#sync").prop('disabled', true);
    $('#onlineStatus').html('<span class="badge bg-warning my-3 my-md-0 ml-md-3 mr-md-auto">Offline</span>');
    $('#roomStatus').html(' ');
  }
}