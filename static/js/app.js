const roomName = JSON.parse(document.getElementById('room-name').textContent);
const username = JSON.parse(document.getElementById('username').textContent);

document.getElementById("hiddeninput").addEventListener('change', handleFileSelect, false)

function handleFileSelect() {
    var file = document.getElementById("hiddeninput").files[0]
    getBase64(file, file.type)
}

function getBase64(file, fileType) {
    var type = fileType.split("/")[0]
    var reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = function(){
      chatSocket.send(JSON.stringify({
        "what_is_it" : type,
        "message" : reader.result,
      }))
    }
}


const conversation = document.getElementById("conversation");
const sendButton = document.querySelector('#send');
const inputField = document.querySelector('#comment');

// Bağlantının yapılması
const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

// Mesajların ekrana yazdırılması
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    const message_type = data.what_is_it;
    if (message_type == "text"){
      message = data.message;
    } 
    
    else if (message_type == "image"){
      message = '<img  width="250" height="250" src="' + data.message + '">';
    }

    else if (message_type == "audio"){
      message = `<audio style="width: 200px;" controls>
                   <source src="${data.message}">
                 </audio>
                `
    }

    else if (message_type == "video"){
      message = '<img  width="250" height="250" src="' + data.message + '">';
      message = `<video width="250" height="250" controls>
                   <source src="${data.message}">
                 </video>
                `
    }


    if (username == data.user){
        var message = 
        `<div class="row message-body">
            <div class="col-sm-12 message-main-sender">
              <div class="sender">
                <div class="message-text">
                  ${message}
                </div>
                <span class="message-time pull-right">
                  ${data.created_date}
                </span>
              </div>
            </div>
          </div>`
    }
    else {
      var message = 
      `<div class="row message-body">
          <div class="col-sm-12 message-main-receiver">
            <div class="receiver">
              <div class="message-text">
                ${message}
              </div>
              <span class="message-time pull-right">
                ${data.created_date}
              </span>
            </div>
          </div>
        </div>`
    }
    conversation.innerHTML += message
    conversation.scrollTop = conversation.scrollHeight
};

// WebSocket bağlantısının kapanması
chatSocket.onclose = function(e) {
    console.error('Chat socket kapandı');
};

inputField.focus();
inputField.onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter, return
        sendButton.click();
    }
};

// Mesajı gönder ve yazı alanını temizle
sendButton.onclick = function(e) {
    const message = inputField.value;
    chatSocket.send(JSON.stringify({
        "what_is_it": "text",
        "message" : message,
    }));
    inputField.value = '';
};

var isRecord = false
var dataArray = []


conversation.scrollTop = conversation.scrollHeight

const startStop = document.getElementById("record")

startStop.onclick=()=>{

  if (isRecord) {
    stopRecord()
    startStop.style = ""
    isRecord = false
  } else {
    startRecord()
    startStop.style = "color: red"
    isRecord = true
  }

}

function startRecord() {
  navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream=>{
        mediaRecorder = new MediaRecorder(stream)
        mediaRecorder.start()
        dataArray = []

        mediaRecorder.ondataavailable = function (e) {
          dataArray.push(e.data); 
        }

        mediaRecorder.onstop = function (e) {
          let audioData = new Blob(dataArray, {'type': 'audio/mp3'})
          dataArray = []
          getBase64(audioData, audioData.type)
          
          stream.getTracks().forEach(function (track){
              if (track.readyState == 'live' && track.kind == 'audio'){
                  track.stop()
              }
          })
        }
    })
}

function stopRecord() {
    mediaRecorder.stop()
}

/*
navigator.mediaDevices.getUserMedia({audio:true})
    .then(function (mediaStreamObject){
        const startStop = document.getElementById("record")
        const mediaRecorder = new MediaRecorder(mediaStreamObject)
        startStop.addEventListener('click', function(e){
          if(isRecord){
              startStop.style=""
              isRecord = false
              mediaRecorder.stop()
          }
          else{
              startStop.style="color:red"
              isRecord = true
              mediaRecorder.start()
          }
        })

        mediaRecorder.ondataavailable = function (e) {
          dataArray.push(e.data); // Veriyi dataArray dizisine ekle
        };

        mediaRecorder.onstop = function (e) {
          let audioData = new Blob(dataArray, {'type': 'audio/mp3'})
          console.log(audioData)
          getBase64(audioData, audioData.type)
          dataArray = []
        }
})
*/