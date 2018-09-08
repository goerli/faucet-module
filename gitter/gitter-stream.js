var Gitter = require('node-gitter');
require('dotenv').config()
const roomId = process.env.ROOM_ID;
const token  = process.env.GITTER_TOKENS;
let gitter;
const server = require('../server/index');

const setup = async () => {
    server.connect();
    gitter = new Gitter(token);
    const user = await gitter.currentUser();
    console.log("logged in as " + user.username);
    const faucetBalance = await server.getFaucetBalance();
    await server.getTxCount()
}

const connectToRoom = async () => {
    gitter.rooms.find(roomId).then(function(room) {
        var events = room.streaming().chatMessages();       
        // The 'snapshot' event is emitted once, with the last messages in the room
        events.on('snapshot', function(snapshot) {
          console.log(snapshot.length + ' messages in the snapshot');
        }); 
        // The 'chatMessages' event is emitted on each new message
        events.on('chatMessages', async function(message) {
          console.log('A message was ' + message.operation);
          console.log('Text: ', message.model.text);
          //check map
          const faucetBalancePRE = await server.getFaucetBalance();
          const response = await server.sendTestEth(message.model.text)
          const faucetBalance = await server.getFaucetBalance();
        });
    });
}

setup();
connectToRoom();