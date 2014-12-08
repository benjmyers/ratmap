angular.module('ratmap').
directive('map', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "="
            },
            link: function(scope, element, attrs) {

                $('#map').height($(window).height());

                scope.$watch('data', function(newVal) {
                  if (newVal)
                    draw(newVal);
                });

                $window.onresize = function(event) {
                    $('#map').height($(window).height());
                }

                var map = L.map('map',{
                  minZoom: 4,
                  maxZoom: 17,
                  zoomControl: false
                }).setView([40.712784, -74.005941], 12);

                new L.Control.Zoom({ position: 'topright' }).addTo(map);

                // alternative themes: 'terrain' and 'watercolor'
                var osm = L.tileLayer.provider('Esri.WorldGrayCanvas');

                map.addLayer(osm);

                function markerClick(d) {
                    scope.$emit('marker-click', d.layer.options.item);
                }

                var customMarker = L.Marker.extend({
                   options: { 
                      item: undefined
                   }
                });

                function draw(data) {

                  //{lat: 33.5363, lon:-117.044, value: 1}
                    var latLngs = [];

                    var markers = new L.MarkerClusterGroup();
                    _.each(data, function(d) {
                      if (d.latitude && d.longitude) {
                        var m = new customMarker([parseFloat(d.latitude), parseFloat(d.longitude)], {
                            item: d
                        });
                        markers.addLayer(m);
                        latLngs.push({'lat': parseFloat(d.latitude), 'lng': parseFloat(d.longitude), 'value': 1})
                      }
                    })
                    markers.on('click', markerClick);
                
                 var cfg = {
                     // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                     "radius": 2,
                     "maxOpacity": .8,
                     // scales the radius based on map zoom
                     "scaleRadius": true,
                     // if set to false the heatmap uses the global maximum for colorization
                     // if activated: uses the data maximum within the current map boundaries 
                     //   (there will always be a red spot with useLocalExtremas true)
                     "useLocalExtrema": false,
                     // which field name in your data represents the latitude - default "lat"
                     latField: 'lat',
                     // which field name in your data represents the longitude - default "lng"
                     lngField: 'lng',
                     // which field name in your data represents the data value - default "value"
                     valueField: 'value',
                     gradient: {
                         // enter n keys between 0 and 1 here
                         // for gradient color customization
                         '.1': 'blue',
                         '.5': 'lime',
                         '.7': 'red'
                     },

                 };
                // var heatmapLayer = new HeatmapOverlay(cfg);
                // map.addLayer(heatmapLayer)

                // heatmapLayer.setData({'data':latLngs});
                // map.removeLayer(heatmapLayer);

                 map.addLayer(markers);
                // map.addLayer(heatmapLayer);
                //L.control.layers({'Markers':markers}, {'HeatMap':heatmapLayer}).addTo(map);

                }

            }
        }
    }
])
