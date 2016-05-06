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
    $.__views.__alloyId29 = Ti.UI.createWindow({
        title: "Weather Forecast",
        backgroundColor: "white",
        id: "__alloyId29"
    });
    $.__views.__alloyId31 = Ti.UI.createButton({
        title: "Back",
        id: "__alloyId31"
    });
    closeForecast ? $.addListener($.__views.__alloyId31, "click", closeForecast) : __defers["$.__views.__alloyId31!click!closeForecast"] = true;
    $.__views.__alloyId29.leftNavButton = $.__views.__alloyId31;
    var __alloyId32 = {};
    var __alloyId35 = [];
    var __alloyId36 = {
        type: "Ti.UI.ImageView",
        bindId: "icon",
        properties: {
            top: 5,
            left: 5,
            bindId: "icon"
        }
    };
    __alloyId35.push(__alloyId36);
    var __alloyId37 = {
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
    __alloyId35.push(__alloyId37);
    var __alloyId38 = {
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
    __alloyId35.push(__alloyId38);
    var __alloyId39 = {
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
    __alloyId35.push(__alloyId39);
    var __alloyId34 = {
        properties: {
            name: "forecastList"
        },
        childTemplates: __alloyId35
    };
    __alloyId32["forecastList"] = __alloyId34;
    $.__views.forecastListSection = Ti.UI.createListSection({
        id: "forecastListSection"
    });
    var __alloyId41 = [];
    __alloyId41.push($.__views.forecastListSection);
    $.__views.forecastListView = Ti.UI.createListView({
        sections: __alloyId41,
        templates: __alloyId32,
        id: "forecastListView",
        defaultItemTemplate: "forecastList"
    });
    $.__views.__alloyId29.add($.__views.forecastListView);
    $.__views.forecastWindow = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId29,
        id: "forecastWindow"
    });
    $.__views.forecastWindow && $.addTopLevelView($.__views.forecastWindow);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var d_img_loc;
    d_img_loc = "";
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
    __defers["$.__views.__alloyId31!click!closeForecast"] && $.addListener($.__views.__alloyId31, "click", closeForecast);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;