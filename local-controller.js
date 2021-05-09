const { localcontroller } = require('./../../ElectraJS/electra');

localcontroller.listen()
    .then((port) => {
        console.log('Electra port opened. Listening for connections on port: ', port)
    });

    localcontroller.onConnection()
    .then((device_data) => {
        console.log('Connection request received: ', device_data);
    });

// generator.addDevice("10.10.10.2", "4734")
//     .then((response) => {
//         console.log('Device successfully added: ', response);
//     })
//     .catch((error) => {
//         console.log('Unable to add device: ', error);
//     });

// generator.sendEnergy(); // to nearest neigbour that is 'storage'.
// generator.sendEnergy(generator.getNeighbour('A124DS2')); // By ID.
console.log('done');