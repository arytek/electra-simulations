const electra = require('./../../ElectraJS/electra');
const ip = require('ip');

// Set random initial wattage value, then every 2s generate and set a new wattage value.
// Our energy generating device will be generating anywhere between 300W and 350W.
let wattage = getRandomIntInclusive(300, 350); 
startWattageGenerator(300, 350);

// The address of the running device.
let address = process.argv[2] || process.env.IP || ip.address() || "127.0.0.1";

// The device will be publically accessible on this port.
const port = process.env.PORT || 4374;

// Add port number to the end of the address string.
if (!address.includes(':')) address = address.concat(':' + port);


console.log('========= Welcome to Electra generator emulator ==========');
console.log('=================== By Aryan Nateghnia ===================');

let generator = electra.generator(address);
console.log('\nStarting server... \n');

generator.listen()
    .then((address) => {
        console.log('Electra port opened.');
        console.log('Listening for Electra connections at address: ', address);
    });

generator.onConnection(
    function success(deviceData) {
        console.log('\nConnection request received: ', deviceData);
    }
);

// Add local controller...
generator.addDevice("127.0.0.100")
    .then((response) => {
        console.log('\nDevice successfully added: ', response);
        sendEnergy();
    })
    .catch((error) => {
        console.log('\nUnable to add device: ', error);
    });


function sendEnergy() {
    console.log('\nSending energy to nearest energy storage provider...');
    generator.sendEnergy(wattage)
        .then((eContract) => {
            console.log('\nSuccessfully sent energy to', eContract.sink.deviceId, ': ', eContract);
        })
        .catch((error) => {
        console.log('\nUnable to send energy: ', error);
        })
        .finally(() => {
            // After the previous eContract is sent, send another one.
            sendEnergy();
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
