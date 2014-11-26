'use strict';

angular.module('ratmap')
  .controller('MainCtrl', function ($scope, $http, $timeout) {

      $http.get('http://data.cityofnewyork.us/resource/3q43-55fe?$limit=5000', {
        cache: true
      }).
        success(function(data, status, headers, config) {
          data.minDate = formatDate(new Date(Math.min.apply(null,_.map(_.pluck(data, 'created_date'), function(d) { return new Date(d);}))));
          $scope.data = data;
          $scope.loaded = true;
        }).
        error(function(data, status, headers, config) {
          console.log(status);
        });

        $scope.$on('marker-click', function(ev, m) {
          var address = makeAddress(m);
          var date = formatDate(new Date(m.created_date.split("T")[0]));
          var city = formatCity(m);
          var item = {
            'event': m.descriptor,
            'date': date,
            'address': address,
            'city': city
          };
          $scope.selected = item;
          $timeout(function() {
            $scope.$apply();
          },1);
        });

        function makeAddress(m) {
          if (m.location_type === "INTERSECTION")
            return setCases(m.cross_street_1) + " & " + setCases(cross_street_2);
          else 
            return setCases(m.incident_address);
        }

        function formatCity(m) {
          return setCases(m.city);
        }

        function formatDate(d) {
          return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        }

        function setCases(m) {
          var formatted = "";
          _.each(m.split(" "), function(d) {
            formatted += d.split("")[0] + d.toLowerCase().slice(1, d.length) + " ";
          })
          return formatted;
        }

  });
