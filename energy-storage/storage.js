const electra = require('./../../ElectraJS/electra');
const ip = require('ip');

let capacityLimit = 4000; // The capacity limit of the energy storage device.
let capacity = 2000; // Starting capacity in Wh (Watt Hours).

// The address of the running device.
let address = process.argv[2] || process.env.IP || ip.address() || "127.0.0.1";

// The device will be publically accessible on this port.
const port = process.env.PORT || 4374;

// Add port number to the end of the address string.
if (!address.includes(':')) address = address.concat(':' + port);

console.log('========== Welcome to Electra storage emulator ===========');
console.log('=================== By Aryan Nateghnia ===================');

let storage = electra.storage(address, 'Lithium Ion 4KWh Battery');
console.log('\nStarting server... \n');

storage.listen(port)
    .then((address) => {
        console.log('Electra port opened.');
        console.log('Listening for Electra connections at address: ', address);
    });

storage.onConnection(
    function success(deviceData) {
        console.log('\nConnection request received: ', deviceData);
    }
);

storage.addDevice("127.0.0.100")
    .then((response) => {
        console.log('\nDevice successfully added: ', response);
    })
    .catch((error) => {
        console.log('\nUnable to add device: ', error);
    });

storage.onEnergyContract(
    function success(res) {
        const elapsedTime = Math.abs((res.establishment_time / 1000) - (Date.now() / 1000)); // Elapsed time in seconds.
        const addedEnergy = (res.wattage / 3600) * (elapsedTime); // Convert to watts per second (1h = 3600s) then multiply by elapsedTime.
        capacity += addedEnergy;
        console.log('\nReceived energy: ', addedEnergy);
        console.log('New capacity: ', capacity);
    },
    function failure(error) {
        console.log('\nUnable to receive energy: ', error);
    }
);
