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
                    // {lat: 33.5363, lon:-117.044, value: 1}
                    var latLngs = [];
                    var markers = new L.MarkerClusterGroup();
                    _.each(data, function(d) {
                      if (d.latitude && d.longitude) {
                        var m = new customMarker([parseFloat(d.latitude), parseFloat(d.longitude)], {
                            item: d
                        });
                        markers.addLayer(m);
                        latLngs.push([parseFloat(d.latitude), parseFloat(d.longitude)]);
                      }
                    });
                    markers.on('click', markerClick);

                 //map.addLayer(markers);
                 // #dc7633
                 var heat = L.heatLayer(latLngs, {
                     radius: 18,
                     gradient: {
                         0.4: '#1b5479', // #f6ddcc',
                         0.65: '#d4e6f1',//#e59866',
                         1: '#D35400'
                     }
                 }).addTo(map);


              L.control.layers({
                  'Markers': markers
              }, {
                  'HeatMap': heat
              }).addTo(map);


                }

            }
        }
    }
])
