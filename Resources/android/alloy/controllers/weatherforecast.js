function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function closeForecast() {
        $.forecastWindow.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "weatherforecast";
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
    $.__views.__alloyId20 = Ti.UI.createWindow({
        title: "Weather Forecast",
        backgroundColor: "white",
        id: "__alloyId20"
    });
    $.__views.__alloyId22 = Ti.UI.createButton({
        title: "Back",
        id: "__alloyId22"
    });
    closeForecast ? $.addListener($.__views.__alloyId22, "click", closeForecast) : __defers["$.__views.__alloyId22!click!closeForecast"] = true;
    $.__views.__alloyId20.leftNavButton = $.__views.__alloyId22;
    var __alloyId23 = {};
    var __alloyId26 = [];
    var __alloyId27 = {
        type: "Ti.UI.ImageView",
        bindId: "icon",
        properties: {
            top: 5,
            left: 5,
            bindId: "icon"
        }
    };
    __alloyId26.push(__alloyId27);
    var __alloyId28 = {
        type: "Ti.UI.Label",
        bindId: "wday",
        properties: {
            font: {
                fontFamily: "Helvetica Neue Ultralight",
                fontSize: "18dp"
            },
            top: 5,
            left: 60,
            bindId: "wday"
        }
    };
    __alloyId26.push(__alloyId28);
    var __alloyId29 = {
        type: "Ti.UI.Label",
        bindId: "cond",
        properties: {
            font: {
                fontFamily: "Helvetica Neue Ultralight",
                fontSize: "20dp"
            },
            top: 40,
            left: 60,
            bindId: "cond"
        }
    };
    __alloyId26.push(__alloyId29);
    var __alloyId30 = {
        type: "Ti.UI.Label",
        bindId: "temp",
        properties: {
            font: {
                fontFamily: "Helvetica Neue Ultralight",
                fontSize: "14dp"
            },
            top: 60,
            left: 60,
            bindId: "temp"
        }
    };
    __alloyId26.push(__alloyId30);
    var __alloyId25 = {
        properties: {
            name: "forecastList"
        },
        childTemplates: __alloyId26
    };
    __alloyId23["forecastList"] = __alloyId25;
    $.__views.forecastListSection = Ti.UI.createListSection({
        id: "forecastListSection"
    });
    var __alloyId32 = [];
    __alloyId32.push($.__views.forecastListSection);
    $.__views.forecastListView = Ti.UI.createListView({
        sections: __alloyId32,
        templates: __alloyId23,
        id: "forecastListView",
        defaultItemTemplate: "forecastList"
    });
    $.__views.__alloyId20.add($.__views.forecastListView);
    $.__views.forecastWindow = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId20,
        id: "forecastWindow"
    });
    $.__views.forecastWindow && $.addTopLevelView($.__views.forecastWindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var d_img_loc;
    d_img_loc = "images/";
    $.forecastWindow.addEventListener("open", function() {
        var forecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + Ti.App.Properties.getString("cityName") + "&mode=json&units=metric&cnt=7&APPID=c3397f645600ceea70a97de590fe8147";
        var xhr = Titanium.Network.createHTTPClient({
            onload: function() {
                console.log("Received -> " + this.responseText);
                var result = JSON.parse(this.responseText);
                console.log("List -> " + result.list);
                var i = 0;
                for (i = 0; i < result.cnt; i++) {
                    var theDate = new Date(1e3 * result.list[i].dt);
                    dateString = theDate.toDateString();
                    $.forecastListSection.appendItems([ {
                        icon: {
                            image: d_img_loc + result.list[i].weather[0].icon + ".png"
                        },
                        wday: {
                            text: dateString
                        },
                        cond: {
                            text: result.list[i].weather[0].main
                        },
                        temp: {
                            text: result.list[i].temp.day
                        },
                        properties: {
                            height: 100
                        },
                        itemId: i
                    } ]);
                }
            },
            onerror: function() {
                alert("Some weird error occured... sorry for this!!!");
            },
            timeout: 5e3
        });
        xhr.open("GET", forecastURL);
        xhr.send();
    });
    __defers["$.__views.__alloyId22!click!closeForecast"] && $.addListener($.__views.__alloyId22, "click", closeForecast);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;