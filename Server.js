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
var totalRam;
var ramUsed;
var cpuUsage;
var tableData;


// Create a MongoDB client.
var client = mongo.MongoClient;
var url = "mongodb://localhost:27017/TimeDateDB";
var database;

client.connect(url, async function(err, db)
{
    if (err)
    {
        throw err;
    }

    database = db;

    getFromDatabase();
});

function addToDatabase()
{
    var dbo = database.db("TimesAndDatesDatabase");

    ramUsedPercent = ramUsed / totalRam * 100;

    var document = { SystemUptime: systemUptime,
        SystemUptimeInstance: systemUptimeInstance,
        LocalDateTime: localDateTime,
        RAMUsed: ramUsedPercent,
        CPUUsage: cpuUsage };

    dbo.collection("TimesAndDates").insertOne(document, function(err, res)
    {
        if (err)
        {
            throw err;
        }

        console.log("Inserted document: "
        + "\nSystemUptime: " + systemUptime
        + "\n, SystemUptimeInstance: " + systemUptimeInstance
        + "\n, LocalDateTime: " + localDateTime
        + "\n, RAM Used: " + ramUsedPercent
        + "\n, CPU Usage: " + cpuUsage + "\n");

        //database.close();
    });
}

async function getFromDatabase()
{
    var dbo = database.db("TimesAndDatesDatabase");

    //tableData = dbo.collection("TimesAndDates").find().sort({"LocalDateTime":1}).limit(10);
    //tableData = await dbo.collection("TimesAndDates").find().toArray();
    tableData = await dbo.collection("TimesAndDates").find().sort({"LocalDateTime":-1}).limit(10).toArray();
}


// Create an app with express.
var app = express();
var port = process.env.PORT || 5000;

app.listen(port, () => console.log('Listening on port ${port}'));

app.get('/express_backend', (request, response) => {
    response.send({ express: "Your express backend is connected to React!" });
});

app.get('/ServerData', (request, response) => {
    console.clear();
    getFromDatabase();
    response.send({ systemUptime: systemUptimeStr,
        systemUptimeInstance: systemUptimeInstanceStr,
        localDateTime: localDateTimeStr,
        tableData: tableData});
    addToDatabase();
});


// Create a snmp session.
var session = snmp.createSession ("127.0.0.1", "CStyle");
session.version = snmp.Version2c;


var oids = ["1.3.6.1.2.1.1.3.0",
            "1.3.6.1.2.1.25.1.1.0",
            "1.3.6.1.2.1.25.1.2.0",
            "1.3.6.1.4.1.2021.4.5.0",
            "1.3.6.1.4.1.2021.4.6.0",
            "1.3.6.1.4.1.2021.11.9.0"];


setInterval(main, 5000);
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

                    systemUptimeInstanceStr = "System Uptime: " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds";
                    systemUptimeInstance = Math.floor(varbinds[i].value / 100);
                    //systemUptimeInstanceStr = "System Uptime (Instance): " + systemUptimeInstance + " Seconds";
                    console.log("System Uptime (Instance) (Seconds): " + systemUptimeInstance);
                }
                // System Uptime
                else if (varbinds[i].oid == "1.3.6.1.2.1.25.1.1.0")
                {
                    var days = Math.floor((varbinds[i].value / 100) / (3600 * 24));
                    var hours = Math.floor(((varbinds[i].value / 100) % (3600 * 24)) / 3600);
                    var minutes = Math.floor(((varbinds[i].value / 100) % 3600) / 60);
                    var seconds = Math.floor((varbinds[i].value / 100) % 60);

                    systemUptimeStr = "System Uptime: " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds";
                    //console.log("System Uptime: " + days + " Days, " + hours + " Hours, " + minutes + " Minutes, " + seconds + " Seconds");
                    //systemUptime = Math.round(((varbinds[i].value / 100) % (3600 * 24)) / 3600 * 100) / 100;
                    systemUptime = Math.floor(varbinds[i].value / 100);
                    //systemUptimeStr = "System Uptime: " + systemUptime + " Seconds";
                    console.log("System Uptime (Seconds): " + systemUptime);
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
                else if (varbinds[i].oid == "1.3.6.1.4.1.2021.4.5.0")
                {
                    totalRam = varbinds[i].value;
                    console.log("Total RAM(KB): " + varbinds[i].value);
                }
                else if (varbinds[i].oid == "1.3.6.1.4.1.2021.4.6.0")
                {
                    ramUsed = varbinds[i].value;
                    console.log("Total RAM Used(KB): " + varbinds[i].value);
                }
                else if (varbinds[i].oid == "1.3.6.1.4.1.2021.11.9.0")
                {
                    cpuUsage = varbinds[i].value;
                    console.log("CPU User Time(%): " + varbinds[i].value);
                }
            }
        }
        //session.close ();
    });
}
