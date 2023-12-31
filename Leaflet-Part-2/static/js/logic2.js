// Build Plates polygon plots from geoJSON
d3.json("data/PB2002_plates.json").then(function(data) {
    console.log("Plate Data", data);
  let platesGroup = [];
  
  let plateFeatures = data.features

//  Push each plot to group
  for (let i = 0; i < data.features.length; i++) {
    platesGroup.push(L.geoJSON(plateFeatures[i], {
        color: "orange",
        fillColor: "none",
        weight: 3
  }))};
    
// Setup for Earthquakes plot

// Create a color array for depths
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
function dateFormat(time) {
  var date = new Date(time).toLocaleDateString("en-US")
  return date; 
};

function timeFormat(time) {
  var time = new Date(time).toLocaleTimeString("en-US")
  return time;
};

// Last 30 days of all 1.0 Earthquakes
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";
d3.json(url).then(function(response) {

    let earthquakesGroup = []

  console.log(response);
  features = response.features;

  for (let i = 0; i < features.length; i++) {
    let location = features[i].geometry;
    let magnitude = features[i].properties.mag;
    let properties = features[i].properties;
    if (location) {
      let coordinates = [location.coordinates[1], location.coordinates[0]]
      let depth = location.coordinates[2];
        
    //   Push each earthquake to a group for plotting
      earthquakesGroup.push(L.circle(coordinates, {
            fillOpacity: .75,
            color: "black",
            weight: 1,
            fillColor: depthColor(depth),
            // Multiply Magnitudes so that they register on map
            radius: (magnitude * 20000)
          }).bindPopup(`<h1>${properties.title}</h1> <h3>Depth: ${depth} km</h3> 
            <hr> <h3>Coordinates: ${coordinates}</h3> 
            <hr> <h3>Date: ${dateFormat(properties.time)}</h3> 
            <h3>Time: ${timeFormat(properties.time)}</h3>`));
      
    }

  };
//   Create layer groups for earthquakes and plates
  let earthquakes = L.layerGroup(earthquakesGroup)
  let plates = L.layerGroup(platesGroup)

//   Create base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   });
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    let worldImage = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    let world = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	    attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	    maxZoom: 8
    });


// Baser Layers list

  let baseMaps = {
  "Street": street,
  "World": world,
  "Topographic": topo,
  "Sattelite": worldImage
}
  
// Overlay layers list
  
let overlayMaps = {
  "Earthquakes": earthquakes,
  "Techtonic Plates": plates
}

// Create a map object.
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4,
  layers: [worldImage, earthquakes, plates]
});

// Create a control object
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Create a legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Earthquake Depth (km)</h4>";
  div.innerHTML += `<i style="background: ${color1}"></i><span>-10-10</span><br>`;
  div.innerHTML += `<i style="background: ${color2}"></i><span>10-30</span><br>`;
  div.innerHTML += `<i style="background: ${color3}"></i><span>30-50</span><br>`;
  div.innerHTML += `<i style="background: ${color4}"></i><span>50-70</span><br>`;
  div.innerHTML += `<i style="background: ${color5}"></i><span>70-90</span><br>`;
  div.innerHTML += `<i style="background: ${color6}"></i><span>90+</span><br>`;
 
  return div;
}
legend.addTo(myMap);

});  


});






