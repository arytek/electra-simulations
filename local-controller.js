const electra = require('./../../ElectraJS/electra');
const ip = require('ip');

// The address of the running device.
let address = process.argv[2] || process.env.IP || ip.address() || "127.0.0.1";

// The device will be publically accessible on this port.
const port = process.env.PORT || 4374;

// Add port number to the end of the address string.
if (!address.includes(':')) address = address.concat(':' + port);

console.log('====== Welcome to Electra local-controller emulator ======');
console.log('=================== By Aryan Nateghnia ===================');

let localcontroller = electra.localcontroller(address);
console.log('\nStarting server... \n');

localcontroller.listen(port)
    .then((address) => {
        console.log('Electra port opened.');
        console.log('Listening for Electra connections at address: ', address);
    });

localcontroller.onConnection(
    function success(deviceData) {
        console.log('\nConnection request received: ', deviceData);
    }
);

localcontroller.onEnergyContract(
    function success(eContract) {
        console.log('\nIncoming eContract... ', eContract);
        console.log('\nSuccessfully routed eContract to: ', eContract.sink);
    },
    function failure(error) {
        console.log('\nUnable to add device: ', error);
    }
);
