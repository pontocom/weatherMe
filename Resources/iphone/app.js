var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.Map = require("ti.map");

Alloy.Globals.Facebook = require("facebook");

var db = Ti.Database.open("weatherMeDB");

db.execute("CREATE TABLE IF NOT EXISTS favourites (name varchar(128) not null primary key);");

db.close();

Alloy.createController("index");