const electra = require('./../../ElectraJS/electra');
const ip = require('ip');

// Since the electrical grid provides a constant power, the power defined below is not a variable, like in the generator. 
let wattage = 2880; // 240v x 12A = 2880W


// The address of the running device.
let address = process.argv[2] || process.env.IP || ip.address() || "127.0.0.1";
// The device will be publically accessible on this port.
const port = process.env.PORT || 4374;
// Add port number to the end of the address string.
if (!address.includes(':')) address = address.concat(':' + port);


console.log('============ Welcome to Electra grid emulator ============');
console.log('=================== By Aryan Nateghnia ===================');

let grid = electra.grid(address, 'Energy Grid');
console.log('\nStarting server... \n');

grid.listen()
    .then((address) => {
        console.log('Electra port opened.');
        console.log('Listening for Electra connections at address: ', address);
    });

grid.onConnection(
    function success(deviceData) {
        console.log('\nConnection request received: ', deviceData);
    }
);

// Add local controller which is at address 127.0.0.100...
grid.addDevice("127.0.0.100")
    .then((response) => {
        console.log('\nDevice successfully added: ', response);
        // Operations to do only once local controller is added.
        grid.setTarifRate(0.23); // Set a tarif rate of 23 cents.
        sendEnergy();
        sendMetadata();
    })
    .catch((error) => {
        console.log('\nUnable to add device: ', error);
    });


/**
 * Local functions.
 */

function sendEnergy() {
    grid.sendEnergy(wattage)
        .then((eContract) => {
            console.log('\nSuccessfully sent energy to', eContract.destination.deviceId, ': ', eContract);
        })
        .catch((error) => {
        console.log('\nUnable to send energy: ', error);
        })
        .finally(() => {
            // After the previous eContract is sent, send another one.
            sendEnergy();
        });
}

function sendMetadata() {
    grid.sendMetadataToLC()
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
