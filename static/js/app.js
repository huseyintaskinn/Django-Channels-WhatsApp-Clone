const roomName = JSON.parse(document.getElementById('room-name').textContent);
const username = JSON.parse(document.getElementById('username').textContent);


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

    if (username == data.user){
        var message = 
        `<div class="row message-body">
            <div class="col-sm-12 message-main-sender">
              <div class="sender">
                <div class="message-text">
                  ${data.message}
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
                ${data.message}
              </div>
              <span class="message-time pull-right">
                ${data.created_date}
              </span>
            </div>
          </div>
        </div>`
    }
    conversation.innerHTML += message
    //document.querySelector('#chat-log').value += (data.message + '\n');
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
        'message': message
    }));
    inputField.value = '';
};

