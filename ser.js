function Game() {
    // const fs = require('fs');
    let dir = './data.txt';
    // let app = require('express')();
    // let server = require('http').createServer(app);
    // let io = require('socket.io')(server);
    var fs = require( 'fs' );
    var app = require('express')();
    var https        = require('https');
    var server = https.createServer({
        key: fs.readFileSync('./private.key'),
        cert: fs.readFileSync('./certificate.crt'),
        ca: fs.readFileSync('./ca_bundle.crt'),
        requestCert: false,
        rejectUnauthorized: false
    },app);
    var io = require('socket.io').listen(server);
    var clientIDArray = [];
    var baselineDict = {};

    app.get('/home', function (req, res) {
        res.sendfile(__dirname + '/homepage.html');
    });
    app.get('/css', function (req, res) {
        res.sendfile(__dirname + '/HPCss.css');
    });

    app.get('/index', function (req, res) {
        res.sendfile(__dirname + '/index.html');
    });


    io.on('connection', (socket) => {
        console.log('connect', socket.id);
        socket.on('disconnect', function(){
            io.emit('user_changed', {user: socket.username, event: 'left'});
        });



        socket.on('initialRequest', (message) => {
            //io.emit('client_number', {cNumber: clientIDArray.length});
            console.log("length",clientIDArray.length)
            for (var i=0; i<clientIDArray.length; i++ ) {
                io.emit('newClientMSG',{YNO: "Yes" , Number: String(i)})
            }


        });

        socket.on('checkID', (message) => {
            var uInput = message.userInput.toUpperCase();
            console.log(uInput)
            if (clientIDArray.includes(uInput)){
                io.emit('checkedResult', {result: "Yes"});
            }else{
                io.emit('checkedResult', {result: "No"});
            }

        });
        socket.on('send-message', (message) => {
            console.log(baselineDict);
            var clientID = message.user.toUpperCase();
            var currentTime = message.TimeStamp;
            var hrv = message.HRV;
            var MHR = parseInt(message.hr);
            if (!isNaN(MHR)){
                var tuple = [parseInt(message.hr), currentTime, parseInt(hrv)];
                if (!clientIDArray.includes(clientID) && clientID != undefined){
                    baselineDict[clientID] = [tuple];
                    clientIDArray.push(clientID);
                    io.emit('newClientMSG',{YNO: "Yes" , Number: String(clientIDArray.length - 1)});
                }

                if (baselineDict.hasOwnProperty(clientID)){
                    baselineDict[clientID].push(tuple);
                    if (baselineDict[clientID].length == 60){
                        var hrArray = arrayColumn(baselineDict[clientID], 0);
                        var hrArrayTopFifteen = hrArray.slice(0,60);
                        let sum = hrArrayTopFifteen.reduce((previous, current) => current += previous);
                        let avg = sum / hrArrayTopFifteen.length;
                        console.log("avg:",avg);
                        var uIndex = clientIDArray.indexOf(String(clientID));
                        io.emit("getBaseline",{uIdx: uIndex, baseline:avg});
                    }

                }
                var clientIndex = clientIDArray.indexOf(clientID)
                console.log(message);
                io.emit('vMSG', {hr: message.hr, cIndex: clientIndex});

                if(baselineDict[clientID].length%60 == 0){
                    //fs.writeFileSync(dir, JSON.stringify(baselineDict));
                    fs.writeFileSync(dir,JSON.stringify(baselineDict));

                }
            }



        });

        socket.on('requestUNo', (message) => {
            var uipt = message.uInput.toUpperCase();
            var uIndex = clientIDArray.indexOf(uipt);
            io.emit('getUNo', {uNo:uIndex});
            if (baselineDict.hasOwnProperty(uipt)){
                var hrArray = arrayColumn(baselineDict[uipt], 0);
                if (hrArray.length >= 60){
                    var fifteen =  hrArray.slice(0,60);
                    let sum = fifteen.reduce((previous, current) => current += previous);
                    let avg = sum / fifteen.length;
                    console.log("avg:",avg);

                    io.emit("getBaseline",{uIdx: uIndex, baseline:avg});
                }

            }

        });




    });



    var port = process.env.PORT || 443;

    server.listen(port, function(){
        console.log('listening in http://yourwebsite:' + port);
    });
}

function arrayColumn(arr, n) {
    return arr.map(x=> x[n]);
}

var game = new Game()
