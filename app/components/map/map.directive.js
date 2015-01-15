angular.module('ratmap').
directive('map', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "="
            },
            link: function(scope, element, attrs) {
                var map, heat, markers, heatmapShowing = true,
                    markersShowing = true;

                // Set the map height equivalent to the window height
                $('#map').height($(window).height());

                // Watch for model data changes
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        draw(newVal);
                });

                // Watch for display toggle between heatmap / marker layer
                scope.$on('toggle-display', function(ev, type) {
                    if (map && heat && markers) {
                        switch (type) {
                            case "heatmap":
                                if (heatmapShowing)
                                    map.removeLayer(heat);
                                else
                                    map.addLayer(heat);
                                heatmapShowing = !heatmapShowing;
                                return;
                            case "markers":
                                if (markersShowing)
                                    map.removeLayer(markers);
                                else
                                    map.addLayer(markers);
                                markersShowing = !markersShowing;
                                return;
                        }
                    }
                })

                // Emit a marker-click event to the controller on marker click
                function markerClick(d) {
                    scope.$emit('marker-click', d.layer.options.item);
                }
                
                // Update the map height on page resize
                $window.onresize = function(event) {
                    $('#map').height($(window).height());
                }

                // Create the map
                map = L.map('map', {
                    minZoom: 4,
                    maxZoom: 17,
                    zoomControl: false
                }).setView([40.712784, -74.005941], 12);

                // Add the zoom control
                new L.Control.Zoom({
                    position: 'topright'
                }).addTo(map);

                // Add the tile layer. Alternative themes: 'terrain' and 'watercolor'.
                var canvas = L.tileLayer.provider('Esri.WorldGrayCanvas');

                // Add the tile layer
                map.addLayer(canvas);

                // Create the geocoding control and add it to the map
                var searchControl = new L.esri.Geocoding.Controls.Geosearch({
                    position: 'topright'
                }).addTo(map);

                // Create an empty layer group to store the results and add it to the map
                var results = new L.LayerGroup().addTo(map);

                // Listen for the results event and add every result to the map
                searchControl.on("results", function(data) {
                    results.clearLayers();
                    for (var i = data.results.length - 1; i >= 0; i--) {
                        results.addLayer(L.marker(data.results[i].latlng));
                    };
                });

                // Create custom marker icon
                var customMarker = L.Marker.extend({
                    options: {
                        item: undefined
                    }
                });
                var myIcon = L.icon({
                    iconUrl: 'assets/images/marker.svg',
                    shadowSize: [0, 0],
                    iconSize: [38, 95]
                });

                // Draw the map
                function draw(data) {
                    var latLngs = [];
                    // Create the marker custer layer
                    markers = new L.MarkerClusterGroup();
                    // For each rat report!
                    _.each(data, function(d) {
                        if (d.latitude && d.longitude) {
                            // Create a custom marker
                            var m = new customMarker([parseFloat(d.latitude), parseFloat(d.longitude)], {
                                item: d,
                                icon: myIcon
                            });
                            markers.addLayer(m);
                            // Create the array of lat lngs for the heatlayer
                            latLngs.push([parseFloat(d.latitude), parseFloat(d.longitude)]);
                        }
                    });
                    // Add click listener
                    markers.on('click', markerClick);

                    // Add the layer
                    if (markersShowing)
                        map.addLayer(markers);

                    // Create the heatmap
                    heat = L.heatLayer(latLngs, {
                        radius: 16,
                        gradient: {
                            0.4: '#1b5479',
                            0.65: '#d4e6f1',
                            1: '#D35400'
                        }
                    });

                    if (heatmapShowing)
                        map.addLayer(heat);

                }
            }
        }
    }
])
