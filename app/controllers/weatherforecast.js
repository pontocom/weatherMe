var d_img_loc;
if(OS_ANDROID) {
    d_img_loc = 'images/';
} else {
    d_img_loc = '';
}

function closeForecast(e) {
    $.forecastWindow.close();
}

$.forecastWindow.addEventListener('open', function(e){
   var forecastURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+ Ti.App.Properties.getString('cityName') +"&mode=json&units=metric&cnt=7&APPID=c3397f645600ceea70a97de590fe8147"; 
   
   var xhr = Titanium.Network.createHTTPClient({
       onload: function () {
           console.log('Received -> ' + this.responseText);
           var result = JSON.parse(this.responseText);
           
           console.log('List -> ' + result.list);
           var i = 0;
           for(i=0 ; i < result.cnt; i++) {               
               var theDate = new Date(result.list[i].dt * 1000);
               //dateString = theDate.toGMTString();
               dateString = theDate.toDateString();
                              
               $.forecastListSection.appendItems([{
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
                    properties: {height: 100},
                    itemId: i
                }]);
           }
       },
       onerror: function () {
           alert('Some weird error occured... sorry for this!!!');
       },
       timeout: 5000
   });
   
   xhr.open('GET', forecastURL);
   xhr.send();
});
