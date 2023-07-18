// Create a map object.
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Add a tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


// https://www.schemecolor.com/red-orange-green-gradient.php
var color1 = "#69B34C";
var color2 = "#ACB334";
var color3 = "#FAB733";
var color4 = "#FF8E15";
var color5 = "#FF4E11";
var color6 = "#FF0D0D";


// Function for color gradient of depth
function depthColor(depth) {
  if (depth >= 90) {
   return color6;}
  else if (depth >= 70) {
    return color5;}
  else if (depth >= 50) {
    return color4;}
  else if (depth >= 30) {
    return color3;}
  else if (depth >= 10) {
    return color2;}
  else {return color1;}
  };

// Functions for date/time formatting
// https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
function dateFormat(time) {
  var date = new Date(time).toLocaleDateString("en-US")
  return date; 
};

function timeFormat(time) {
  var time = new Date(time).toLocaleTimeString("en-US")
  return time;
};


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";
d3.json(url).then(function(response) {

  console.log("Earthquake Data", response);
  features = response.features;
  

  

  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    let magnitude = features[i].properties.mag;
    let properties = features[i].properties;
    if (location) {
      // console.log("location", location);
      let coordinates = [location.coordinates[1], location.coordinates[0]]
      let depth = location.coordinates[2];
      // console.log("coordinates", coordinates)
      // console.log("depth", depth);
      // console.log("magnitude", magnitude);
      L.circle(coordinates, {
            fillOpacity: .75,
            color: "black",
            weight: 1,
            fillColor: depthColor(depth),
            radius: (magnitude * 20000)
          }).bindPopup(`<h1>${properties.title}</h1> <h3>Type: ${properties.type}</h3> 
            <hr> <h3>Coordinates: ${coordinates}</h3> 
            <hr> <h3>Date: ${dateFormat(properties.time)}</h3> 
            <h3>Time: ${timeFormat(properties.time)}</h3>`).addTo(myMap);
      
    }

  };

// Legend
// https://codepen.io/haakseth/pen/KQbjdO

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Depth</h4>";
  div.innerHTML += `<i style="background: ${color1}"></i><span>-10-10</span><br>`;
  div.innerHTML += `<i style="background: ${color2}"></i><span>10-30</span><br>`;
  div.innerHTML += `<i style="background: ${color3}"></i><span>30-50</span><br>`;
  div.innerHTML += `<i style="background: ${color4}"></i><span>50-70</span><br>`;
  div.innerHTML += `<i style="background: ${color5}"></i><span>70-90</span><br>`;
  div.innerHTML += `<i style="background: ${color6}"></i><span>90+</span><br>`;
 
  
  

  return div;
};

legend.addTo(myMap);

});


d3.json("data/PB2002_plates.json").then(function(data) {
  console.log("Plate Data", data);

  plates = data.features.feature.geometry

  for (let i = 0; i < data.features.length; i++) {

    let coordinates = plates[i].coordinates

    console.log(coordinates)

  };



  // L.polygon([
  //   [45.54, -122.68],
  //   [45.55, -122.68],
  //   [45.55, -122.66]
  // ], {
  //   color: "yellow",
  //   fillColor: "yellow",
  //   fillOpacity: 0.75
  // }).addTo(myMap);
  
});