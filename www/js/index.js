var bike = {
    service: 'Santo',
    measurement: 'fff6'
};

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.scan();
    },
    scan: function() {
        app.status("Scanning for BLE device");

        var foundBikeMonitor = false;
        function onScan(peripheral) {
            // 
            console.log("Found " + JSON.stringify(peripheral));
            foundBikeMonitor = true;

            ble.connect(peripheral.id, app.onConnect, app.onDisconnect);
        }

        function scanFailure(reason) {
            alert("BLE Scan Failed");
        }
        console.log("service:" + bike.service);

        ble.scan([bike.service], 5, onScan, scanFailure);

        setTimeout(function() {
            if (!foundBikeMonitor) {
                app.status("Did not find a BLEdevice.");
            }
        }, 5000);
    },
    onConnect: function(peripheral) {
        console.log("connect:" + peripheral.id)
        app.status("Connected to " + peripheral.id);
        ble.startNotification(peripheral.id, bike.service, bike.measurement, app.onData, app.onError);
    },
    onDisconnect: function(reason) {
        alert("Disconnected " + reason);
        returnText.innerHTML = returnTest.innerHTML + "...";
        app.status("Disconnected");
    },
    onData: function(buffer) {
        // assuming bike measurement is Uint8 format
        // See the characteristic specs
        var data = new Uint8Array(buffer);
        returnText.innerHTML = returnText.innerHTML + "<br>Data Received:"+ data[1];
    },
    onError: function(reason) {
        alert("There was an error " + reason);
    },
    status: function(message) {
        console.log(message);
        statusDiv.innerHTML =   "<br>" + statusDiv.innerHTML + "<br>" + message;
    }
};

app.initialize();
