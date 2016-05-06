function closeFavourites(e) {
    $.favouritesWindow.close();
}

$.favouritesWindow.addEventListener('open', function(e) {
   var db = Ti.Database.open("weatherMeDB");
   var result = db.execute("SELECT * FROM favourites");

    while(result.isValidRow()) {
        var cityname = result.fieldByName('name');
        console.log(cityname);
        
        $.favouritesListSection.appendItems([{
            fav: {
                text: cityname
            },
            itemId: cityname
        }]);
        
        result.next();
    }

   db.close(); 
});

$.favouritesListView.addEventListener('itemclick', function(e) {
    var item = e.section.getItemAt(e.itemIndex);
    
    Ti.API.info('LIGHTHOUSE: Clicked an option...' + item.itemId);
    
    Ti.App.Properties.setString("cityName", item.itemId);

    
    var getWeatherURLForCity = "http://api.openweathermap.org/data/2.5/weather?q=" + item.itemId + "&units=metric";
    
    var xhr = Titanium.Network.createHTTPClient({
        onload: function() {
            console.log('Inside onload function...'); 
            console.log('Answer text:' + this.responseText);
            var result = JSON.parse(this.responseText);
            
            if(result.cod == "404") {
                alert('City not found! Sorry!!!');
                return;
            }
            
            Ti.App.Properties.setString('weatherimage', result.weather[0].icon + '.png');
            Ti.App.Properties.setString('maincondition', result.weather[0].main);
            Ti.App.Properties.setString('temp', result.main.temp);
            Ti.App.Properties.setString('tempmax', result.main.temp_max);
            Ti.App.Properties.setString('tempmin', result.main.temp_min);
            Ti.App.Properties.setString('description', result.weather[0].description);
            Ti.App.Properties.setString('humidity', result.main.humidity);
            Ti.App.Properties.setString('pressure', result.main.pressure);
            Ti.App.Properties.setString('windspeed', result.wind.speed);
            
        },
        onerror: function(e) {
            console.log('Some error occured!!!!');
        },
        timeout: 10000,

    });

    console.log('Calling -> ' + getWeatherURLForCity);    

    xhr.open('GET', getWeatherURLForCity);
    xhr.send();

    if(item.itemId) {
        var detailsWindow = Alloy.createController("weatherdetails").getView();
        detailsWindow.open({
            modalTransitionStyle: Titanium.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL
        });
    }
});