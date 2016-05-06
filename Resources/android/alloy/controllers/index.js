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
    $.__views.weatherWindow = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "weatherWindow",
        fullscreen: false,
        title: "weatherMe"
    });
    $.__views.weatherWindow && $.addTopLevelView($.__views.weatherWindow);
    $.__views.cityName = Ti.UI.createTextField({
        id: "cityName",
        top: 0,
        width: "100%",
        height: 50,
        opacity: 100,
        color: "black",
        hintText: "Enter city...."
    });
    $.__views.weatherWindow.add($.__views.cityName);
    $.__views.mapview = Alloy.Globals.Map.createView({
        id: "mapview",
        animate: true,
        regionFit: true,
        userLocation: true,
        height: Ti.UI.FILL,
        top: 51,
        left: 0
    });
    $.__views.weatherWindow.add($.__views.mapview);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var d_img_loc;
    d_img_loc = "images/";
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
    $.weatherWindow.addEventListener("return", function(e) {
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
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;