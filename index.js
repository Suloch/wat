
class Player{
  
  constructor(){
    this.socket = null;
    this.video = document.getElementById('myVideo');
    this.fileInput = document.getElementById('fileInput');
    this.websocketServerLocation = 'wss://extra-z7e4jwfgoq-el.a.run.app';
    this.video = document.getElementById('myVideo');

    this.startWebSocket();
    this.loadVideo();
  }

  startWebSocket(){
    this.socket = new WebSocket(this.websocketServerLocation);

    this.socket.addEventListener('open', (event) => {
      this.socket.send(JSON.stringify({command: "connect"}));
    });

    this.socket.addEventListener('message', (event) => {
      console.log('Received message from server:', event.data);
      let data = JSON.parse(event.data);

      if(data.command == "play"){
          this.video.currentTime = data.time;
          this.video.play();
      }else if(data.command == "pause"){
          this.video.currentTime = data.time;
          this.video.pause();
      }
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed.');
      this.socket = null;
      setTimeout(()=>{this.startWebSocket()}, 5000);
    });

    this.socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
    });
  }

  loadVideo(){
    if(this.fileInput.files.length < 1)
      return;

    this.file = this.fileInput.files[0];
    this.video.src = URL.createObjectURL(this.file);
    this.video.load();
    this.video.onpause = (event) =>{
      if(this.socket != null){
        this.socket.send(JSON.stringify({command: "pause", time: this.video.currentTime}));
      }
    }
    this.video.onplay = (event) => {
      if(this.socket != null){
        this.socket.send(JSON.stringify({command: "play", time: this.video.currentTime}));
      }
    }
  }
}

// const player = new Player();