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

    dbo.collection("TimesAndDates").findOne({}, function(err, result)
        {
            if (err)
            {
                throw err;
            }

            console.log(result.name + ", " + result.time);

            db.close();
        });
});