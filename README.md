#RATMAP

Ratmap is an interactive map that allows exploration of recent rat sightings in NYC! The data is accessed from NYC's DEP 311 Database, via Socrata's [Open Data Platform](https://nycopendata.socrata.com/Social-Services/Rat-Sightings/3q43-55fe). The database is updated daily, so you're always seeing the latest sightings.

### Resources

To make this application, I used the following libraries:

* [Angular](https://angularjs.org/)
* [Leaflet](http://leafletjs.com)
* [esri-leaflet](http://esri.github.io/esri-leaflet)
* [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
* [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat)
* [Bootstrap](http://getbootstrap.com/)

### Basic Structure

- ```app/main/main.controller.js``` requests the rat data and populates the models. It also receives events from the map directive to display rat data. 
- ```app/main/main.html``` displays the navbar and the map directive.
- ```app/components/map/map.directive.js``` sets up and displays the map, along with responding to user events. 
- ```app/components/navbar.html``` displays the side panel that shows event marker data (rat data!) and also allows the user to toggle the heatmap and marker layer on and off. 
- ```app/index.js``` contains routing.
- ```index.html``` is exactly what you would expect.

That's it! Everything is commented and (I hope) organized well. 

### Contributing

I started Ratmap just for fun and was surprised when there was a lot of interest on HackerNews and Twitter. You're more than welcome to contribute, no matter your skill level with Angular and Leaflet. Have an idea? Run it by me! I'd love to see your pull request. 

###License
Apache License Version 2.0