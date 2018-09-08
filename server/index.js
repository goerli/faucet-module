
const express = require("express");
const ethers = require('ethers');
const app = express();
const cors = require("cors");
const utils = ethers.utils;
var config = require("../config/config.json");
const mkdirp = require("mkdirp");
const level = require("level");

let connect = () => {
    var provider =  new ethers.providers.JsonRpcProvider('http://40.114.122.81:8545')
    var faucetWallet = new ethers.Wallet('0x938c57c1b1e3c43407e86e38dddd4f4a92e90fb0c1d55a21c8c66e907cc84a2a');
    faucetWallet.provider = provider;
}

connect()

mkdirp.sync(require("os").homedir() + "/.ethfaucetssl/queue");
mkdirp.sync(require("os").homedir() + "/.ethfaucetssl/exceptions");
const dbQueue = level(require("os").homedir() + "/.ethfaucetssl/queue");
const dbExceptions = level(
  require("os").homedir() + "/.ethfaucetssl/exceptions"
);

const greylistduration = 1000 * 60 * 60 * 24;

/**
 * Helper functions
 */

function isAddress(address) {
    return /^(0x)?[0-9a-f]{40}$/i.test(address);
}
  
function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function fixaddress(address) {
    address = address.replace(" ", "");
    address = address.toLowerCase();
    if (!strStartsWith(address, "0x")) {
        return "0x" + address;
    }
    return address;
}
  
/**
 * getFaucetBalance function rewritten, returns ether balance string converted
 */
getFaucetBalance = async () => {
    let etherString;
    await provider.getBalance(faucetWallet.address).then(function (balance) {
        etherString = utils.formatEther(balance);
        // console.log('currentWallet Balance: ' + etherString);
    });
    return etherString.toString(10); 
  }

getFaucetBalance();

/**
 * This endpoint is only triggered when the address and user has been verified and valid.
 * 1 eth will be given
 */
app.get("/gitterAddress/:address", function(req, res) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("client IP=", ip);
    var etherbalance = -1;
    try {
      etherbalance = getFaucetBalance();
    } catch (e) {
      console.log(e);
    }
    res.sendStatus(200)   
//    console.log(req.params.address);
});

app.listen(3000, function() {
    console.log("faucet listening on port 3000");
});


