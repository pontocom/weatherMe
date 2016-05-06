function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function closeFavourites() {
        $.favouritesWindow.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "favourites";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.__alloyId0 = Ti.UI.createWindow({
        title: "Favourites",
        backgroundColor: "white",
        id: "__alloyId0"
    });
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "Back",
        id: "__alloyId2"
    });
    closeFavourites ? $.addListener($.__views.__alloyId2, "click", closeFavourites) : __defers["$.__views.__alloyId2!click!closeFavourites"] = true;
    $.__views.__alloyId0.leftNavButton = $.__views.__alloyId2;
    var __alloyId3 = {};
    var __alloyId6 = [];
    var __alloyId7 = {
        type: "Ti.UI.Label",
        bindId: "fav",
        properties: {
            font: {
                fontFamily: "Helvetica Neue Ultralight",
                fontSize: "18dp"
            },
            bindId: "fav"
        }
    };
    __alloyId6.push(__alloyId7);
    var __alloyId5 = {
        properties: {
            name: "favouritesList"
        },
        childTemplates: __alloyId6
    };
    __alloyId3["favouritesList"] = __alloyId5;
    $.__views.favouritesListSection = Ti.UI.createListSection({
        id: "favouritesListSection"
    });
    var __alloyId9 = [];
    __alloyId9.push($.__views.favouritesListSection);
    $.__views.favouritesListView = Ti.UI.createListView({
        sections: __alloyId9,
        templates: __alloyId3,
        id: "favouritesListView",
        defaultItemTemplate: "favouritesList"
    });
    $.__views.__alloyId0.add($.__views.favouritesListView);
    $.__views.favouritesWindow = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId0,
        id: "favouritesWindow"
    });
    $.__views.favouritesWindow && $.addTopLevelView($.__views.favouritesWindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.favouritesWindow.addEventListener("open", function() {
        var db = Ti.Database.open("weatherMeDB");
        var result = db.execute("SELECT * FROM favourites");
        while (result.isValidRow()) {
            var cityname = result.fieldByName("name");
            console.log(cityname);
            $.favouritesListSection.appendItems([ {
                fav: {
                    text: cityname
                },
                itemId: cityname
            } ]);
            result.next();
        }
        db.close();
    });
    $.favouritesListView.addEventListener("itemclick", function(e) {
        var item = e.section.getItemAt(e.itemIndex);
        Ti.API.info("LIGHTHOUSE: Clicked an option..." + item.itemId);
        Ti.App.Properties.setString("cityName", item.itemId);
        var getWeatherURLForCity = "http://api.openweathermap.org/data/2.5/weather?q=" + item.itemId + "&units=metric";
        var xhr = Titanium.Network.createHTTPClient({
            onload: function() {
                console.log("Inside onload function...");
                console.log("Answer text:" + this.responseText);
                var result = JSON.parse(this.responseText);
                if ("404" == result.cod) {
                    alert("City not found! Sorry!!!");
                    return;
                }
                Ti.App.Properties.setString("weatherimage", result.weather[0].icon + ".png");
                Ti.App.Properties.setString("maincondition", result.weather[0].main);
                Ti.App.Properties.setString("temp", result.main.temp);
                Ti.App.Properties.setString("tempmax", result.main.temp_max);
                Ti.App.Properties.setString("tempmin", result.main.temp_min);
                Ti.App.Properties.setString("description", result.weather[0].description);
                Ti.App.Properties.setString("humidity", result.main.humidity);
                Ti.App.Properties.setString("pressure", result.main.pressure);
                Ti.App.Properties.setString("windspeed", result.wind.speed);
            },
            onerror: function() {
                console.log("Some error occured!!!!");
            },
            timeout: 1e4
        });
        console.log("Calling -> " + getWeatherURLForCity);
        xhr.open("GET", getWeatherURLForCity);
        xhr.send();
        if (item.itemId) {
            var detailsWindow = Alloy.createController("weatherdetails").getView();
            detailsWindow.open({
                modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
            });
        }
    });
    __defers["$.__views.__alloyId2!click!closeFavourites"] && $.addListener($.__views.__alloyId2, "click", closeFavourites);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;