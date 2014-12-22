angular.module('ratmap').
directive('map', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "="
            },
            link: function(scope, element, attrs) {
                var map, heat, markers, heatmapShowing = true, markersShowing = true;

                $('#map').height($(window).height());

                scope.$watch('data', function(newVal) {
                  if (newVal)
                    draw(newVal);
                });

                scope.$on('toggle-display', function(ev, type) {
                  if (map && heat && markers) {
                    switch(type) {
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

                $window.onresize = function(event) {
                    $('#map').height($(window).height());
                }

                map = L.map('map',{
                  minZoom: 4,
                  maxZoom: 17,
                  zoomControl: false
                }).setView([40.712784, -74.005941], 12);

                new L.Control.Zoom({ position: 'topright' }).addTo(map);

                // alternative themes: 'terrain' and 'watercolor'.
                var canvas = L.tileLayer.provider('Esri.WorldGrayCanvas');

                map.addLayer(canvas);

                // create the geocoding control and add it to the map
                var searchControl = new L.esri.Geocoding.Controls.Geosearch({ position: 'topright' }).addTo(map);

                // create an empty layer group to store the results and add it to the map
                var results = new L.LayerGroup().addTo(map);

                // listen for the results event and add every result to the map
                searchControl.on("results", function(data) {
                    results.clearLayers();
                    for (var i = data.results.length - 1; i >= 0; i--) {
                        results.addLayer(L.marker(data.results[i].latlng));
                    };
                });

                function markerClick(d) {
                    scope.$emit('marker-click', d.layer.options.item);
                }
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
                function draw(data) {
                    var latLngs = [];
                    markers = new L.MarkerClusterGroup();
                    _.each(data, function(d) {
                      if (d.latitude && d.longitude) {
                        var m = new customMarker([parseFloat(d.latitude), parseFloat(d.longitude)], {
                            item: d,
                            icon: myIcon
                        });
                        markers.addLayer(m);
                        latLngs.push([parseFloat(d.latitude), parseFloat(d.longitude)]);
                      }
                    });
                    markers.on('click', markerClick);

                 if (markersShowing)
                  map.addLayer(markers);
                
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
