
// global
let chart; 
let isPlay = true;
let url = 'http://localhost:80/ruty_api_test/delivery/truck/1/last'; 

//API REQ
async function requestData() {
    if(isPlay == true){
        const result = await fetch(url);
        if (result.ok) {

            const data = await result.json();
            //const [date, value] = data[0];
            var temp = data.data.temp.data;
            var hum = data.data.hum.data; 
            var entryDate = data.data.temp.date;
            //var latCoord = data.data.temp.coords.latitude;
            //var lonCoord = data.data.temp.coords.longitude;
            console.log(entryDate+" "+temp+" "+hum);
            const pointTemp = [new Date(entryDate).getTime(), temp];  
            const pointHum = [new Date(entryDate).getTime(), hum];        
            //const pointTemp = [new Date(date).getTime(), value * 10];
            //const pointHum = [new Date(date).getTime(), value * 5];
            const series = chart.series[0],
                shift = series.data.length > 20; // shift if the series is longer than 20
            const seriesH = chart.series[1],
                shiftH = seriesH.data.length > 20; // shift if the series is longer than 20
            // add the point
            chart.series[0].addPoint(pointTemp, true, shift);
            chart.series[1].addPoint(pointHum, true, shiftH);
                    // call it again after one second
        setTimeout(requestData, 1000);
        }
    }
}

//grafica lineal
window.addEventListener('load', function () {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'temperatura: °C | humedad: %',
            style: {    
                color: 'black',
                fontWeight: 'bold'
            }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000,
            crosshair: true
        },
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value}°C',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Temperature in °C',
                style: {
                    //textOutline: 0,
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }, { // Secondary yAxis
            title: {
                text: 'rel. humidity in %',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            labels: {
                format: '{value} %',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            opposite: true
        }],
        legend: {
            show: true,
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 50,
            floating: true,
            borderWidth: 2,
            position: 'labeled',
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        tooltip: {
            shared: true
        },
        series: [{
            name: 'Temperature',
            data: [],
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return Highcharts.numberFormat(this.y,2);
                }
            },
            zones: [{
                value: 10,
                color: '#c42525'
            }, {
                value: 50,
                color: '#f28f43'
            }, {
                color: '#0d233a'
            }],
            color: '#0d233a',
            tooltip: {
                valueSuffix: '°C',
                valueDecimals: 2
                }
            },
            {
            name: 'Humedity',
            data: [],
            dataLabels: {
                enabled: true,
                formatter: function () {
                    return Highcharts.numberFormat(this.y,2);
                }
            },
            dashStyle: "shortDash",
            yAxis: 1,
            color: '#2f7ed8',
            tooltip: {
                valueSuffix: '%',
                valueDecimals: 2
                }
            }
        ]
    });
});





function play(){
    isPlay = true;
    requestData();
}

function stop(){
    isPlay = false;
}




////////////////////////////////////////////////////map 
//api location MAPA
let myMap = L.map('myMap').setView([0, 0], 2)

const urlOpenLayers = 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
L.tileLayer(urlOpenLayers, {
  maxZoom: 15,
}).addTo(myMap)

const iconMarker = L.icon({
  iconUrl: './static/assets/img/mappin.png',
  iconSize: [60, 60],
  iconAnchor: [30, 60]
})

let marker = null
const updateMap = () => {
  const urlISSGeoLocation = 'http://localhost:80/ruty_api_test/delivery/truck/1/last'
  fetch(urlISSGeoLocation)
    .then(res => res.json())
    .then(data => {
      if (marker) {
        myMap.removeLayer(marker)
      }
      const {
        latitude,
        longitude
      } = data.data.temp.coords
      console.log(latitude, longitude)
      marker = L.marker([latitude.toString(), longitude.toString()], {
      //  icon: iconMarker
      }).addTo(myMap);
    })
  setTimeout(updateMap, 3000)
}

function clickZoom(e) {
	map.setView(e.target.getLatLng(),15);
}

updateMap()

//var bounds = new L.LatLngBounds(arrayOfLatLngs);



 

 
