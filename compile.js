const path = require('path');
const fs = require('fs');
const solc = require('solc');

const DronechargingPath = path.resolve(__dirname, 'contracts', 'Dronecharging.sol');
//console.log(inboxPath);
const source = fs.readFileSync(DronechargingPath, 'utf8');
//console.log(source);
//console.log(solc.compile(source, 1));
module.exports = solc.compile(source, 1).contracts[':Dronecharging'];