// Get the video element
const video = document.getElementById('myVideo');
const fileInput = document.getElementById('fileInput');


const socket = new WebSocket('wss://extra-z7e4jwfgoq-el.a.run.app'); // Replace wit
socket.addEventListener('open', function (event) {    
    // Send a message to the WebSocket server
    socket.send(JSON.stringify({command: "connect"}));
});

// Event listener for incoming messages
socket.addEventListener('message', function (event) {
    console.log('Received message from server:', event.data);
    let data = JSON.parse(event.data);

    if(data.command == "play"){
        video.currentTime = data.time;
        video.play();
    }else if(data.command == "pause"){
        video.currentTime = data.time;
        video.pause();
    }

});

// Event listener for connection close
socket.addEventListener('close', function (event) {
    console.log('WebSocket connection closed.');
});

// Event listener for connection errors
socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

function loadVideo() {
    const file = fileInput.files[0];
    const fileURL = URL.createObjectURL(file);
  
    video.src = fileURL;
    video.load();
  }


// Set volume of the video (value ranges from 0 to 1)
function setVolume(volume) {
  video.volume = volume;
}

function getStatus(){
    socket.send(JSON.stringify({command: "update", time: video.currentTime}))
}

video.onpause = (event)=>{
  socket.send(JSON.stringify({command: "pause", time: video.currentTime}));
}

video.onplay = (event)=>{
  socket.send(JSON.stringify({command: "play", time: video.currentTime}));
}
