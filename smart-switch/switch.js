const electra = require('./../../ElectraJS/electra');
const ip = require('ip');

// Set random initial power consumption value, then every 2s generate and set a new consumption value.
// Our energy consuming device will be consuming anywhere between 60W and 120W.
let wattage = getRandomIntInclusive(60, 120); 
startWattageGenerator(60, 120);

// The address of the running device.
let address = process.argv[2] || process.env.IP || ip.address() || "127.0.0.1";
// The device will be publically accessible on this port.
const port = process.env.PORT || 4374;
// Add port number to the end of the address string.
if (!address.includes(':')) address = address.concat(':' + port);


console.log('======== Welcome to Electra Smart Switch emulator ========');
console.log('=================== By Aryan Nateghnia ===================');

let smartswitch = electra.smartswitch(address, 'PC Machine');
console.log('\nStarting server... \n');

smartswitch.listen()
    .then((address) => {
        console.log('Electra port opened.');
        console.log('Listening for Electra connections at address: ', address);
    });


smartswitch.onConnection(
    function success(deviceData) {
        console.log('\nConnection request received: ', deviceData);
    }
);

// Add local controller which is at address 127.0.0.100...
smartswitch.addDevice("127.0.0.100")
    .then((response) => {
        console.log('\nDevice successfully added: ', response);
        // Operations to do only once local controller is added.
        consumeEnergy();
        sendMetadata();
    })
    .catch((error) => {
        console.log('\nUnable to add device: ', error);
    });


function consumeEnergy() {
    smartswitch.consumeEnergy(wattage)
        .then((eContract) => {
            console.log('\nSuccessfully consumed energy from', eContract.destination.deviceId, ': ', eContract);
        })
        .catch((error) => {
        console.log('\nUnable to consume energy: ', error);
        })
        .finally(() => {
            // After the previous eContract is sent, send another one.
            consumeEnergy();
        });
}

function sendMetadata() {
    smartswitch.sendMetadataToLC(wattage)
        .then(console.log('Metadata transmitted successfully'))
        .catch((error) => {
            console.log('Unable to transfer metadeta: ', error);
        })
        .finally(() => {
            // After the previous metadata packet is sent, send another one.
            sendMetadata();
        });
}

/**
 * Sets a new random wattage value between the given number ranges provided.
 * This function calls itself (sets a new wattage) every 2 seconds.
 * @param {object} minWattage
 * @param {object} maxWattage
 * @public
 */
function startWattageGenerator(minWattage, maxWattage) {
    setInterval(function setWattage() {
        wattage = getRandomIntInclusive(minWattage, maxWattage);
    }, 2000);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
