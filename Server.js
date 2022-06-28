var snmp = require("net-snmp");
var http = require("http");
var express = require("express");
var mongo = require("mongodb");


// Global variables
var systemUptimeStr = "System Uptime: Not Set";
var systemUptime = 0;
var systemUptimeInstanceStr = "System Uptime: Not Set";
var systemUptimeInstance = 0;
var localDateTimeStr = "Local Date/Time: Not Set";
var localDateTime;


// Create a MongoDB client.
var client = mongo.MongoClient;
var url = "mongodb://localhost:27017/TimeDateDB";

function addToDatabase()
{
    client.connect(url, function(err, db)
    {
        if (err)
        {
            throw err;
        }

        var dbo = db.db("TimesAndDatesDatabase");
        //console.log("Database created!");

        var document = { SystemUptime: systemUptime, SystemUpTimeInstance: systemUptimeInstance, LocalDateTime: localDateTime };

        //dbo.createCollection("TimesAndDates", function(err, res)
        //console.log("Collection(Table) created!");
        dbo.collection("TimesAndDates").insertOne(document, function(err, res)
        {
            if (err)
            {
                throw err;
            }

            console.log("Inserted document: " + "SystemUptime: " + systemUptime + ", SystemUptimeInstance: " + systemUptimeInstance + ", LocalDateTime: " + localDateTime);

            db.close();
        });
    });
}


// Create an app with express.
var app = express();
var port = process.env.PORT || 5000;

app.listen(port, () => console.log('Listening on port ${port}'));

app.get('/express_backend', (request, response) => {
    response.send({ express: "Your express backend is connected to React!" });
});

app.get('/ServerData', (request, response) => {
    response.send({ systemUptime: systemUptimeStr, systemUptimeInstance: systemUptimeInstanceStr, localDateTime: localDateTimeStr });
    addToDatabase();
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
                
                // System Uptime (Instance)
                if (varbinds[i].oid == "1.3.6.1.2.1.1.3.0")
                {
                    var days = Math.floor((varbinds[i].value / 100) / (3600 * 24));
                    var hours = Math.floor(((varbinds[i].value / 100) % (3600 * 24)) / 3600);
                    var minutes = Math.floor(((varbinds[i].value / 100) % 3600) / 60);
                    var seconds = Math.floor((varbinds[i].value / 100) % 60);

                    systemUptimeInstance = Math.round(((varbinds[i].value / 100) % (3600 * 24)) / 3600 * 100) / 100;
                    systemUptimeInstanceStr = "System Uptime (Instance): " + systemUptimeInstance + " Hours";
                    console.log("System Uptime (Instance) (Hours): " + systemUptimeInstance);
                }
                // System Uptime
                else if (varbinds[i].oid == "1.3.6.1.2.1.25.1.1.0")
                {
                    var days = Math.floor((varbinds[i].value / 100) / (3600 * 24));
                    var hours = Math.floor(((varbinds[i].value / 100) % (3600 * 24)) / 3600);
                    var minutes = Math.floor(((varbinds[i].value / 100) % 3600) / 60);
                    var seconds = Math.floor((varbinds[i].value / 100) % 60);

                    //systemUptimeStr = "System Uptime: " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds";
                    //console.log("System Uptime: " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds");
                    systemUptime = Math.round(((varbinds[i].value / 100) % (3600 * 24)) / 3600 * 100) / 100;
                    systemUptimeStr = "System Uptime: " + systemUptime + " Hours";
                    console.log("System Uptime (Hours): " + systemUptime);
                }
                // Local Date/Time
                else if (varbinds[i].oid == "1.3.6.1.2.1.25.1.2.0")
                {
                    // Convert byte string to a Date object.
                    var buff = Buffer.from(varbinds[i].value);

                    date = new Date(
                        buff.readUInt16BE(),
                        buff.readUInt8(2) - 1,
                        buff.readUInt8(3),
                        buff.readUInt8(4),
                        buff.readUInt8(5),
                        buff.readUInt8(6));
                    console.log(date.toString());
                    localDateTimeStr = date.toString();
                    localDateTime = date;
                }
            }
        }
        //session.close ();
    });
}
