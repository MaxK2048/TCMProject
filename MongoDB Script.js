var mongo = require("mongodb");

var client = mongo.MongoClient;
var url = "mongodb://localhost:27017/TimeDateDB";

client.connect(url, function(err, db)
{
    if (err)
    {
        throw err;
    }

    var dbo = db.db("TimesAndDatesDatabase");
    console.log("Database created!");

    var document = { name: "Time", time: "17:00" };

    //dbo.createCollection("TimesAndDates", function(err, res)
    //console.log("Collection(Table) created!");
    dbo.collection("TimesAndDates").insertOne(document, function(err, res)
        {
            if (err)
            {
                throw err;
            }

            console.log("1 TimeDate inserted!");

            db.close();
        });
});