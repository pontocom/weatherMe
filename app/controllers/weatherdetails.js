/**
 * Facebook application data
 */
/*
var facebook = Alloy.Globals.Facebook;
facebook.appid="1447262665514527";
//facebook.permissions=['user_about_me','publish_stream'];
facebook.permissions=['user_about_me'];
facebook.forceDialogAuth = true;
*/

var fb = require('facebook');
fb.permissions = ['user_about_me','publish_stream'];
fb.initialize();
fb.authorize();


$.detailsWindow.addEventListener("open", function(e) {    
    $.iconWeather.image = Ti.App.Properties.getString('weatherimage');
    $.cityName.text = Ti.App.Properties.getString('cityName');
    $.textMainCondition.text = Ti.App.Properties.getString('maincondition');
    $.textDetailsCondition.text = "Actual temp: " + Ti.App.Properties.getString('temp') + 'ºC';
    
    
    $.textDescription.text = Ti.App.Properties.getString('description');
    $.textTemp.text = "Max: " + Ti.App.Properties.getString('tempmax') + "ºC - Min: " + Ti.App.Properties.getString('tempmin')+ "ºC";
    $.textHumidty.text = "Humidity: " + Ti.App.Properties.getString('humidity') + "%";
    $.textPressure.text = "Pressure: " + Ti.App.Properties.getString('pressure') + "bars";
    $.textWind.text = "Wind speed: " + Ti.App.Properties.getString('windspeed') + "kph";    
});

function shareWeather(e) {
    if(facebook.loggedIn) {
        
        
        facebook.requestWithGraphPath('me/feed', {message: "Sharing weather conditions with WeatherMe!"}, 
         "POST", function(e) {
            if (e.success) {
                alert("Success!  From FB: " + e.result);
            } else {
                if (e.error) {
                    alert(e.error);
                } else {
                    alert("Unkown result");
                }
            }
        });
        
       /*
       facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
            if(e.success) {
               var result = JSON.parse(e.result);
               console.log(e.result);
               
            } else {
                alert(e.error);
            }
        });
        */
    } else {
        facebook.authorize();
    }
}

facebook.addEventListener('login', function(e) {
   if(e.success) {
       alert('Facebook login successfull!');
   } else {
       alert('Problems with Facebook login!');
   }
});

function openForecast(e) {
    var forecastWindow = Alloy.createController("weatherforecast").getView();
        forecastWindow.open({
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });
}

function addtoFavourites(e) {
    var db = Ti.Database.open("weatherMeDB");
    db.execute("INSERT INTO favourites VALUES (?)", Ti.App.Properties.getString('cityName'));
    db.close();
}


function closeDetails(e) {
    $.detailsWindow.close();
}
