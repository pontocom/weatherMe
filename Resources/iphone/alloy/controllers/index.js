function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function lookFor() {
        if ("" == $.cityName.value) return;
        var getWeatherURLForCity = "http://api.openweathermap.org/data/2.5/weather?q=" + $.cityName.value + "&units=metric&APPID=c3397f645600ceea70a97de590fe8147";
        var xhr = Titanium.Network.createHTTPClient({
            onload: function() {
                console.log("Inside onload function...");
                console.log("Answer text:" + this.responseText);
                var result = JSON.parse(this.responseText);
                if ("404" == result.cod) {
                    alert("City not found! Sorry!!!");
                    return;
                }
                var latt = result.coord.lat;
                var lgtd = result.coord.lon;
                $.mapview.setLocation({
                    latitude: latt,
                    longitude: lgtd,
                    latitudeDelta: .15,
                    longitudeDelta: .15
                });
                $.mapview.removeAllAnnotations();
                var annotation = Alloy.Globals.Map.createAnnotation({
                    latitude: latt,
                    longitude: lgtd,
                    title: result.name,
                    subtitle: result.weather[0].main + ", Temp: " + result.main.temp + "ºC",
                    pincolor: Alloy.Globals.Map.ANNOTATION_RED,
                    animate: true,
                    rightButton: d_img_loc + result.weather[0].icon + ".png"
                });
                Ti.App.Properties.setString("weatherimage", d_img_loc + result.weather[0].icon + ".png");
                Ti.App.Properties.setString("maincondition", result.weather[0].main);
                Ti.App.Properties.setString("temp", result.main.temp);
                Ti.App.Properties.setString("tempmax", result.main.temp_max);
                Ti.App.Properties.setString("tempmin", result.main.temp_min);
                Ti.App.Properties.setString("description", result.weather[0].description);
                Ti.App.Properties.setString("humidity", result.main.humidity);
                Ti.App.Properties.setString("pressure", result.main.pressure);
                Ti.App.Properties.setString("windspeed", result.wind.speed);
                $.mapview.addAnnotation(annotation);
            },
            onerror: function() {
                console.log("Some error occured!!!!");
            },
            timeout: 1e4
        });
        console.log("Calling -> " + getWeatherURLForCity);
        xhr.open("GET", getWeatherURLForCity);
        xhr.send();
    }
    function openFavourites() {
        var favWindow = Alloy.createController("favourites").getView();
        favWindow.open({
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
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
    $.__views.weatherWWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "weatherWWindow",
        fullscreen: false,
        title: "weatherMe"
    });
    $.__views.__alloyId11 = Ti.UI.createButton({
        title: "Favourites",
        id: "__alloyId11"
    });
    openFavourites ? $.addListener($.__views.__alloyId11, "click", openFavourites) : __defers["$.__views.__alloyId11!click!openFavourites"] = true;
    $.__views.weatherWWindow.rightNavButton = $.__views.__alloyId11;
    $.__views.mapview = Alloy.Globals.Map.createView({
        id: "mapview",
        animate: true,
        regionFit: true,
        userLocation: true,
        height: Ti.UI.FILL,
        top: 0,
        left: 0,
        zIndex: -20
    });
    $.__views.weatherWWindow.add($.__views.mapview);
    $.__views.__alloyId12 = Ti.UI.createView({
        width: "95%",
        height: 50,
        top: 5,
        zIndex: 100,
        opacity: "100%",
        id: "__alloyId12"
    });
    $.__views.weatherWWindow.add($.__views.__alloyId12);
    var __alloyId15 = [];
    $.__views.__alloyId16 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.CANCEL,
        id: "__alloyId16"
    });
    __alloyId15.push($.__views.__alloyId16);
    $.__views.__alloyId17 = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    __alloyId15.push($.__views.__alloyId17);
    $.__views.__alloyId18 = Ti.UI.createButton({
        title: "Send",
        style: Ti.UI.iPhone.SystemButtonStyle.DONE,
        id: "__alloyId18"
    });
    __alloyId15.push($.__views.__alloyId18);
    lookFor ? $.addListener($.__views.__alloyId18, "click", lookFor) : __defers["$.__views.__alloyId18!click!lookFor"] = true;
    $.__views.__alloyId13 = Ti.UI.iOS.createToolbar({
        items: __alloyId15,
        id: "__alloyId13"
    });
    $.__views.cityName = Ti.UI.createTextField({
        clearOnEdit: true,
        keyboardToolbar: $.__views.__alloyId13,
        id: "cityName",
        backgroundColor: "white",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardToolbarColor: "#999",
        keyboardToolbarHeight: 40,
        top: 10,
        width: "90%",
        height: 30,
        hintText: "Enter city...."
    });
    $.__views.__alloyId12.add($.__views.cityName);
    $.__views.__alloyId13 = Ti.UI.iOS.createToolbar({
        clearOnEdit: true,
        keyboardToolbar: $.__views.__alloyId13,
        id: "cityName",
        backgroundColor: "white",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardToolbarColor: "#999",
        keyboardToolbarHeight: 40,
        top: 10,
        width: "90%",
        height: 30,
        hintText: "Enter city...."
    });
    $.__views.weatherWindow = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.weatherWWindow,
        id: "weatherWindow"
    });
    $.__views.weatherWindow && $.addTopLevelView($.__views.weatherWindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var d_img_loc;
    d_img_loc = "";
    $.weatherWindow.addEventListener("open", function() {
        if (Ti.Geolocation.locationServicesEnabled) {
            Titanium.Geolocation.purpose = "Get Current Location";
            Titanium.Geolocation.getCurrentPosition(function(e) {
                if (e.error) Ti.API.error("Error: " + e.error); else {
                    Ti.API.info(e.coords);
                    latt = e.coords.latitude;
                    longt = e.coords.longitude;
                    $.mapview.setLocation({
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude,
                        latitudeDelta: .15,
                        longitudeDelta: .15
                    });
                    var getWeatherURLForCoordinates = "http://api.openweathermap.org/data/2.5/weather?lat=" + latt + "&lon=" + longt + "&units=metric&APPID=c3397f645600ceea70a97de590fe8147";
                    var xhr = Titanium.Network.createHTTPClient({
                        onload: function() {
                            var result = JSON.parse(this.responseText);
                            $.mapview.removeAllAnnotations();
                            var annotation = Alloy.Globals.Map.createAnnotation({
                                latitude: latt,
                                longitude: longt,
                                title: result.name,
                                subtitle: result.weather[0].main + ", Temp: " + result.main.temp + "ºC",
                                pincolor: Alloy.Globals.Map.ANNOTATION_RED,
                                animate: true,
                                rightButton: d_img_loc + result.weather[0].icon + ".png"
                            });
                            Ti.App.Properties.setString("weatherimage", d_img_loc + result.weather[0].icon + ".png");
                            Ti.App.Properties.setString("maincondition", result.weather[0].main);
                            Ti.App.Properties.setString("temp", result.main.temp);
                            Ti.App.Properties.setString("tempmax", result.main.temp_max);
                            Ti.App.Properties.setString("tempmin", result.main.temp_min);
                            Ti.App.Properties.setString("description", result.weather[0].description);
                            Ti.App.Properties.setString("humidity", result.main.humidity);
                            Ti.App.Properties.setString("pressure", result.main.pressure);
                            Ti.App.Properties.setString("windspeed", result.wind.speed);
                            $.mapview.addAnnotation(annotation);
                        },
                        onerror: function() {
                            console.log("Some error occured!!!!");
                        },
                        timeout: 1e4
                    });
                    console.log("Calling -> " + getWeatherURLForCoordinates);
                    xhr.open("GET", getWeatherURLForCoordinates);
                    xhr.send();
                }
            });
        } else alert("Please enable location services");
    });
    $.weatherWWindow.addEventListener("return", function(e) {
        "" != $.cityName.value && lookFor(e);
    });
    $.mapview.addEventListener("click", function(e) {
        console.log("you clicked the *** annotation!!!");
        console.log("source = " + e.clicksource);
        if ("rightButton" == e.clicksource) {
            Ti.App.Properties.setString("cityName", e.title);
            var detailsWindow = Alloy.createController("weatherdetails").getView();
            detailsWindow.open({
                modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
            });
        } else {
            console.log("you clicked the *** annotation!!!");
            console.log("source = " + e.clicksource);
            if ("infoWindow" == e.clicksource) {
                Ti.App.Properties.setString("cityName", e.title);
                var detailsWindow = Alloy.createController("weatherdetails").getView();
                detailsWindow.open();
            }
        }
    });
    $.weatherWindow.open();
    __defers["$.__views.__alloyId11!click!openFavourites"] && $.addListener($.__views.__alloyId11, "click", openFavourites);
    __defers["$.__views.__alloyId18!click!lookFor"] && $.addListener($.__views.__alloyId18, "click", lookFor);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;