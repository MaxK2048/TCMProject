var snmp = require("net-snmp");
var http = require("http");
var express = require("express");


// Global strings
var systemUptime = "System Uptime: Not Set";
var localDateTime = "Local Date/Time: Not Set";


// Create an app with express.
var app = express();
var port = process.env.PORT || 5000;

app.listen(port, () => console.log('Listening on port ${port}'));

app.get('/express_backend', (request, response) => {
    response.send({ express: "Your express backend is connected to React!" });
});

app.get('/SystemUptime', (request, response) => {
    response.send({ systemUptime: systemUptime, localDateTime: localDateTime });
});


// Create a snmp session.
var session = snmp.createSession ("127.0.0.1", "CStyle");
session.version = snmp.Version2c;


var oids = ["1.3.6.1.2.1.1.3.0",
            "1.3.6.1.2.1.25.1.1.0",
            "1.3.6.1.2.1.25.1.2.0"];


setInterval(main, 1000);
function main()
{
    session.get (oids, function (error, varbinds)
    {
        if (error)
        {
            console.error (error);
            console.log("get error#1");
        }
        else
        {
            for (var i = 0; i < varbinds.length; i++)
            {
                if (snmp.isVarbindError (varbinds[i]))
                {
                    console.error (snmp.varbindError (varbinds[i]));
                    console.log("get error#2");
                }
                else
                {
                    //console.log (varbinds[i].oid + " = " + varbinds[i].value);
                    //console.log("get success!")
                }

                if (varbinds[i].oid == "1.3.6.1.2.1.1.3.0")
                {
                    var days = Math.floor((varbinds[i].value / 100) / (3600 * 24));
                    var hours = Math.floor(((varbinds[i].value / 100) % (3600 * 24)) / 3600);
                    var minutes = Math.floor(((varbinds[i].value / 100) % 3600) / 60);
                    var seconds = Math.floor((varbinds[i].value / 100) % 60);

                    //console.log("System Uptime: " + (varbinds[i].value / 100));

                    //console.log("System Uptime (Instance): " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds");
                }
                else if (varbinds[i].oid == "1.3.6.1.2.1.25.1.1.0")
                {
                    var days = Math.floor((varbinds[i].value / 100) / (3600 * 24));
                    var hours = Math.floor(((varbinds[i].value / 100) % (3600 * 24)) / 3600);
                    var minutes = Math.floor(((varbinds[i].value / 100) % 3600) / 60);
                    var seconds = Math.floor((varbinds[i].value / 100) % 60);

                    //console.log("System Uptime: " + (varbinds[i].value / 100));

                    console.log("System Uptime: " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds");
                    systemUptime = "System Uptime: " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds";
                }
                else if (varbinds[i].oid == "1.3.6.1.2.1.25.1.2.0")
                {
                    //console.log("System Date: " + varbinds[i].value.length);

                    
                    var accumBuff = Buffer.alloc(8);
                    for (var j = 0; j < 7; j++)
                    {
                        accumBuff.writeUint8(varbinds[i].value[j], j);
                    }
                    accumBuff.writeUint8(0, 7)
                    //console.log(accumBuff);
                    var accumDate = new Date(accumBuff.buffer);
                    //console.log(accumDate.toString());

                    var buff = Buffer.from(varbinds[i].value);

                    date = new Date(
                        buff.readUInt16BE(),
                        buff.readUInt8(2) - 1,
                        buff.readUInt8(3),
                        buff.readUInt8(4),
                        buff.readUInt8(5),
                        buff.readUInt8(6));
                    console.log(date.toString());
                    localDateTime = date.toString();
                }
            }
        }
        //session.close ();
    });
}

//var mainFunc = main();