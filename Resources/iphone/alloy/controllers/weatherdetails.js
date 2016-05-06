function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function shareWeather() {
        facebook.loggedIn ? facebook.requestWithGraphPath("me/feed", {
            message: "Sharing weather conditions with WeatherMe!"
        }, "POST", function(e) {
            alert(e.success ? "Success!  From FB: " + e.result : e.error ? e.error : "Unkown result");
        }) : facebook.authorize();
    }
    function openForecast() {
        var forecastWindow = Alloy.createController("weatherforecast").getView();
        forecastWindow.open({
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });
    }
    function addtoFavourites() {
        var db = Ti.Database.open("weatherMeDB");
        db.execute("INSERT INTO favourites VALUES (?)", Ti.App.Properties.getString("cityName"));
        db.close();
    }
    function closeDetails() {
        $.detailsWindow.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "weatherdetails";
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
    $.__views.__alloyId19 = Ti.UI.createWindow({
        title: "weatherMe",
        backgroundColor: "white",
        id: "__alloyId19"
    });
    $.__views.__alloyId21 = Ti.UI.createButton({
        title: "Back",
        id: "__alloyId21"
    });
    closeDetails ? $.addListener($.__views.__alloyId21, "click", closeDetails) : __defers["$.__views.__alloyId21!click!closeDetails"] = true;
    $.__views.__alloyId19.leftNavButton = $.__views.__alloyId21;
    $.__views.__alloyId23 = Ti.UI.createButton({
        title: "Share",
        id: "__alloyId23"
    });
    shareWeather ? $.addListener($.__views.__alloyId23, "click", shareWeather) : __defers["$.__views.__alloyId23!click!shareWeather"] = true;
    $.__views.__alloyId19.rightNavButton = $.__views.__alloyId23;
    $.__views.__alloyId24 = Ti.UI.createView({
        top: 5,
        width: "100%",
        id: "__alloyId24"
    });
    $.__views.__alloyId19.add($.__views.__alloyId24);
    $.__views.__alloyId25 = Ti.UI.createLabel({
        text: "Weather Conditions",
        top: 0,
        id: "__alloyId25"
    });
    $.__views.__alloyId24.add($.__views.__alloyId25);
    $.__views.iconWeather = Ti.UI.createImageView({
        id: "iconWeather",
        left: 20,
        top: 40
    });
    $.__views.__alloyId24.add($.__views.iconWeather);
    $.__views.cityName = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica Neue Ultralight",
            fontSize: "32dp"
        },
        text: "City",
        id: "cityName",
        left: 100,
        top: 40
    });
    $.__views.__alloyId24.add($.__views.cityName);
    $.__views.textMainCondition = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica Neue Ultralight",
            fontSize: "20dp"
        },
        text: "Condition",
        id: "textMainCondition",
        left: 100,
        top: 80
    });
    $.__views.__alloyId24.add($.__views.textMainCondition);
    $.__views.textDetailsCondition = Ti.UI.createLabel({
        font: {
            fontFamily: "Helvetica Neue Ultralight",
            fontSize: "12dp"
        },
        text: "Details",
        id: "textDetailsCondition",
        left: 100,
        top: 100
    });
    $.__views.__alloyId24.add($.__views.textDetailsCondition);
    $.__views.textDescription = Ti.UI.createLabel({
        text: "Details",
        id: "textDescription",
        left: 30,
        top: 140
    });
    $.__views.__alloyId24.add($.__views.textDescription);
    $.__views.textTemp = Ti.UI.createLabel({
        text: "Details",
        id: "textTemp",
        left: 30,
        top: 170
    });
    $.__views.__alloyId24.add($.__views.textTemp);
    $.__views.textHumidty = Ti.UI.createLabel({
        text: "Details",
        id: "textHumidty",
        left: 30,
        top: 190
    });
    $.__views.__alloyId24.add($.__views.textHumidty);
    $.__views.textPressure = Ti.UI.createLabel({
        text: "Details",
        id: "textPressure",
        left: 30,
        top: 210
    });
    $.__views.__alloyId24.add($.__views.textPressure);
    $.__views.textWind = Ti.UI.createLabel({
        text: "Details",
        id: "textWind",
        left: 30,
        top: 230
    });
    $.__views.__alloyId24.add($.__views.textWind);
    $.__views.__alloyId26 = Ti.UI.createButton({
        title: "Add to favourites",
        bottom: 80,
        id: "__alloyId26"
    });
    $.__views.__alloyId19.add($.__views.__alloyId26);
    addtoFavourites ? $.addListener($.__views.__alloyId26, "click", addtoFavourites) : __defers["$.__views.__alloyId26!click!addtoFavourites"] = true;
    $.__views.__alloyId27 = Ti.UI.createButton({
        title: "Forecast",
        bottom: 50,
        id: "__alloyId27"
    });
    $.__views.__alloyId19.add($.__views.__alloyId27);
    openForecast ? $.addListener($.__views.__alloyId27, "click", openForecast) : __defers["$.__views.__alloyId27!click!openForecast"] = true;
    $.__views.__alloyId28 = Ti.UI.createButton({
        title: "Share",
        bottom: 20,
        id: "__alloyId28"
    });
    $.__views.__alloyId19.add($.__views.__alloyId28);
    shareWeather ? $.addListener($.__views.__alloyId28, "click", shareWeather) : __defers["$.__views.__alloyId28!click!shareWeather"] = true;
    $.__views.detailsWindow = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId19,
        id: "detailsWindow"
    });
    $.__views.detailsWindow && $.addTopLevelView($.__views.detailsWindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var fb = require("facebook");
    fb.permissions = [ "user_about_me", "publish_stream" ];
    fb.initialize();
    fb.authorize();
    $.detailsWindow.addEventListener("open", function() {
        $.iconWeather.image = Ti.App.Properties.getString("weatherimage");
        $.cityName.text = Ti.App.Properties.getString("cityName");
        $.textMainCondition.text = Ti.App.Properties.getString("maincondition");
        $.textDetailsCondition.text = "Actual temp: " + Ti.App.Properties.getString("temp") + "ºC";
        $.textDescription.text = Ti.App.Properties.getString("description");
        $.textTemp.text = "Max: " + Ti.App.Properties.getString("tempmax") + "ºC - Min: " + Ti.App.Properties.getString("tempmin") + "ºC";
        $.textHumidty.text = "Humidity: " + Ti.App.Properties.getString("humidity") + "%";
        $.textPressure.text = "Pressure: " + Ti.App.Properties.getString("pressure") + "bars";
        $.textWind.text = "Wind speed: " + Ti.App.Properties.getString("windspeed") + "kph";
    });
    facebook.addEventListener("login", function(e) {
        alert(e.success ? "Facebook login successfull!" : "Problems with Facebook login!");
    });
    __defers["$.__views.__alloyId21!click!closeDetails"] && $.addListener($.__views.__alloyId21, "click", closeDetails);
    __defers["$.__views.__alloyId23!click!shareWeather"] && $.addListener($.__views.__alloyId23, "click", shareWeather);
    __defers["$.__views.__alloyId26!click!addtoFavourites"] && $.addListener($.__views.__alloyId26, "click", addtoFavourites);
    __defers["$.__views.__alloyId27!click!openForecast"] && $.addListener($.__views.__alloyId27, "click", openForecast);
    __defers["$.__views.__alloyId28!click!shareWeather"] && $.addListener($.__views.__alloyId28, "click", shareWeather);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;