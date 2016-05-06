var d_img_loc;
if(OS_ANDROID) {
    d_img_loc = 'images/';
} else {
    d_img_loc = '';
}

$.weatherWindow.addEventListener("open", function(e) {
    if (Ti.Geolocation.locationServicesEnabled) {
        Titanium.Geolocation.purpose = 'Get Current Location';
        Titanium.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                Ti.API.error('Error: ' + e.error);
            } else {
                Ti.API.info(e.coords);
                latt = e.coords.latitude;
                longt = e.coords.longitude;
                
                $.mapview.setLocation({
                    latitude: e.coords.latitude,
                    longitude: e.coords.longitude,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15
                });
                
                var getWeatherURLForCoordinates = "http://api.openweathermap.org/data/2.5/weather?lat="+latt+"&lon="+longt+"&units=metric&APPID=c3397f645600ceea70a97de590fe8147";
                
                var xhr = Titanium.Network.createHTTPClient({
                    onload: function() {
                        var result = JSON.parse(this.responseText);

                        // just to remove previous annotations on map
                        $.mapview.removeAllAnnotations();
                        
                        // place an annotation for the place
                        
                        var annotation = Alloy.Globals.Map.createAnnotation({
                            latitude: latt,
                            longitude: longt,
                            title: result.name,
                            subtitle: result.weather[0].main + ', Temp: ' + result.main.temp + 'ºC',
                            pincolor: Alloy.Globals.Map.ANNOTATION_RED,
                            animate: true,
                            rightButton: d_img_loc + result.weather[0].icon + '.png'
                        });
                        
                        Ti.App.Properties.setString('weatherimage', d_img_loc + result.weather[0].icon + '.png');
                        Ti.App.Properties.setString('maincondition', result.weather[0].main);
                        Ti.App.Properties.setString('temp', result.main.temp);
                        Ti.App.Properties.setString('tempmax', result.main.temp_max);
                        Ti.App.Properties.setString('tempmin', result.main.temp_min);
                        Ti.App.Properties.setString('description', result.weather[0].description);
                        Ti.App.Properties.setString('humidity', result.main.humidity);
                        Ti.App.Properties.setString('pressure', result.main.pressure);
                        Ti.App.Properties.setString('windspeed', result.wind.speed);
                        
                        $.mapview.addAnnotation(annotation);
                        
                    },
                    onerror: function(e) {
                        console.log('Some error occured!!!!');
                    },
                    timeout: 10000,
            
                });
            
                console.log('Calling -> ' + getWeatherURLForCoordinates);    
            
                xhr.open('GET', getWeatherURLForCoordinates);
                xhr.send(); 
            
            }
        });
    } else {
        alert('Please enable location services');
    }
});

if(OS_IOS) {
    $.weatherWWindow.addEventListener("return", function(e) {
       //alert($.cityName.value); 
       if($.cityName.value != '')
            lookFor(e);
    });
} else {
    $.weatherWindow.addEventListener("return", function(e) {
       //alert($.cityName.value); 
       if($.cityName.value != '')
            lookFor(e);
    });
} 

function lookFor(e) {
    //alert($.cityName.value); 
    if($.cityName.value == '') return;
    
    var getWeatherURLForCity = "http://api.openweathermap.org/data/2.5/weather?q=" + $.cityName.value + "&units=metric&APPID=c3397f645600ceea70a97de590fe8147";
    
    var xhr = Titanium.Network.createHTTPClient({
        onload: function() {
            console.log('Inside onload function...'); 
            console.log('Answer text:' + this.responseText);
            var result = JSON.parse(this.responseText);
            
            if(result.cod == "404") {
                alert('City not found! Sorry!!!');
                return;
            }
            
            // get the result to check the coordinates
            
            var latt = result.coord.lat;
            var lgtd = result.coord.lon;
            
            $.mapview.setLocation({
                latitude: latt,
                longitude: lgtd,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15
            });
            
            
            // just to remove previous annotations on map
            $.mapview.removeAllAnnotations();
            
            
            // place an annotation for the place
            
            var annotation = Alloy.Globals.Map.createAnnotation({
                latitude: latt,
                longitude: lgtd,
                title: result.name,
                subtitle: result.weather[0].main + ', Temp: ' + result.main.temp + 'ºC',
                pincolor: Alloy.Globals.Map.ANNOTATION_RED,
                animate: true,
                rightButton: d_img_loc + result.weather[0].icon + '.png'
            });
            
            
            Ti.App.Properties.setString('weatherimage', d_img_loc + result.weather[0].icon + '.png');
            Ti.App.Properties.setString('maincondition', result.weather[0].main);
            Ti.App.Properties.setString('temp', result.main.temp);
            Ti.App.Properties.setString('tempmax', result.main.temp_max);
            Ti.App.Properties.setString('tempmin', result.main.temp_min);
            Ti.App.Properties.setString('description', result.weather[0].description);
            Ti.App.Properties.setString('humidity', result.main.humidity);
            Ti.App.Properties.setString('pressure', result.main.pressure);
            Ti.App.Properties.setString('windspeed', result.wind.speed);
            
            $.mapview.addAnnotation(annotation);
            
        },
        onerror: function(e) {
            console.log('Some error occured!!!!');
        },
        timeout: 10000,

    });

    console.log('Calling -> ' + getWeatherURLForCity);    

    xhr.open('GET', getWeatherURLForCity);
    xhr.send();
}

$.mapview.addEventListener('click', function(e) {
    console.log('you clicked the *** annotation!!!');
    console.log('source = ' + e.clicksource);

    if (e.clicksource == 'rightButton') {
        // handle the full report
        //alert(e.title);
        
        Ti.App.Properties.setString("cityName", e.title);
        
        var detailsWindow = Alloy.createController("weatherdetails").getView();
        detailsWindow.open({
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });
    } else {
        console.log('you clicked the *** annotation!!!');
        console.log('source = ' + e.clicksource);
        if(e.clicksource == 'infoWindow') {
            Ti.App.Properties.setString("cityName", e.title);
            
            var detailsWindow = Alloy.createController("weatherdetails").getView();
            detailsWindow.open();
        }
    }
});

function openFavourites(e) {
    var favWindow = Alloy.createController("favourites").getView();
    favWindow.open({
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
    });
}

$.weatherWindow.open();
