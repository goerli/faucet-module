var https = require('https');
const axios = require('axios');

var roomId    = '5b92ffefd73408ce4fa74cbf'
var token     = '49a37e04d62ff8583f7c31e8eea9c55f2e0ed3da';
var heartbeat = " \n";

var options = {
  hostname: 'stream.gitter.im',
  port:     443,
  path:     '/v1/rooms/' + roomId + '/chatMessages',
  method:   'GET',
  headers:  {'Authorization': 'Bearer ' + token}
};

var req = https.request(options, function(res) {
  res.on('data', function(chunk) {
    var msg = chunk.toString();
    userCheck(msg);
    if (msg !== heartbeat) console.log('Message: ' + msg);
  });
});

req.on('error', function(e) {
  console.log('Something went wrong: ' + e.message);
});

userCheck = (msg) => {
  const start = JSON.parse(msg);
  console.log(msg);
  
  let userID, messageID, username, content, sent, currentMessageTime, globalTimeBenchMark;
  messageID = start.id;
  userID = start.fromUser.id;
  username = start.fromUser.id;
  sent = start.sent;
  getAllMessages(userID);
}

getYesterday = () => {
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate()-1);
  return yesterday;
}

getAllMessages = async (userId) => {
  const yesterday = getYesterday();  
  await getMessagesRequest(userId, yesterday);
}

getMessagesRequest = async (userId, yesterday) => {
  const url = `https://api.gitter.im/v1/rooms/5b92ffefd73408ce4fa74cbf/chatMessages?access_token=49a37e04d62ff8583f7c31e8eea9c55f2e0ed3da`;
  let format;
  let userCanGetEth = true;

  submitAddress();
    axios.get(url).then((response) => {
        for(let i = 0; i < response.data.length; i++) {     
        format = new Date(response.data[i].sent);
        if(format.getDate() >= yesterday.getDate()) {   
            if(userId === response.data[i].fromUser.id ) {
            console.log(response.data[i].fromUser.id + " - user cannot recieve eth");
            userCanGetEth = false;
            } 
        }
        }
        if(userCanGetEth) {
            submitAddress();
        }
        console.log(userCanGetEth);  
    });
}

submitAddress = () => {    
    let apiUrl = 'http://localhost:3000/gitterAddress/0xae8e18c3a4b139c3be6c32af7dfe147181dcfbe8';
    console.log(apiUrl);
    axios
    .get(apiUrl)
        .then(error => { console.log('caught', error.message) }, response => {
            console.log("response then ");
            console.log(response);          
            return;
        })
}

req.end();
