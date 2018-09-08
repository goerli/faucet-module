var Gitter = require('node-gitter');
require('dotenv').config()

var roomId    = process.env.ROOM_ID;
var token     = process.env.GITTER_TOKENS;
let gitter;

const setup = async () => {
    gitter = new Gitter(token);
    const user = await gitter.currentUser();
    console.log("logged in as " + user.username);
}

const connectToRoom = async () => {
    gitter.rooms.find(roomId).then(function(room) {
        var events = room.streaming().chatMessages();       
        // The 'snapshot' event is emitted once, with the last messages in the room
        events.on('snapshot', function(snapshot) {
          console.log(snapshot.length + ' messages in the snapshot');
        }); 
        // The 'chatMessages' event is emitted on each new message
        events.on('chatMessages', function(message) {
          console.log('A message was ' + message.operation);
          console.log('Text: ', message.model.text);
        });
    });
}

setup();
connectToRoom();