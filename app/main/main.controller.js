'use strict';

angular.module('ratmap')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
      /* Default the heatmap as showing/not showing */
      $scope.hShow = true;
      /* Default the marker layer as showing/not showing */
      $scope.mShow = true;

      // ------------------------------------------------------------------------------
      // ----------------------------- Data Request -----------------------------------
      // ------------------------------------------------------------------------------

      $http.get('http://data.cityofnewyork.us/resource/3q43-55fe?$limit=10000', {
        cache: true
      }).
        success(function(data, status, headers, config) {
          /* Get the minimum date for display */
          data.minDate = formatDate(new Date(Math.min.apply(null,_.map(_.pluck(data, 'created_date'), function(d) { return new Date(d);}))));
          /* Set the data model */
          $scope.data = data;
          $scope.loaded = true;
        }).
        error(function(data, status, headers, config) {
          console.log(status);
        });

        // ------------------------------------------------------------------------------
        // ---------------------------------- Events ------------------------------------
        // ------------------------------------------------------------------------------

        /* 
        * Event listener for a marker click 
        * @param m - the marker 
        */
        $scope.$on('marker-click', function(ev, m) {
          /* Format display attributes */
          var address = makeAddress(m);
          var date = formatDate(new Date(m.created_date.split("T")[0]));
          var city = formatCity(m);
          var item = {
            'event': m.descriptor,
            'date': date,
            'type': m.location_type,
            'address': address,
            'city': city
          };
          /* Set the model */
          $scope.selected = item;
          $timeout(function() {
            $scope.$apply();
          },1);
        });

        // ------------------------------------------------------------------------------
        // ------------------------ Display Formatting ----------------------------------
        // ------------------------------------------------------------------------------

        /* Broadcasts an event to tell the heatmap and marker layer to show or not show 
        * @param type = markers || heatmap */
        $scope.show = function(type) {
          $scope.$broadcast('toggle-display', type);
        }

        /* Creates the address based on available fields */
        function makeAddress(m) {
          if (m.cross_street_1 && m.cross_street_2)
            return setCases(m.cross_street_1) + " & " + setCases(m.cross_street_2);
          else if (m.intersection_street_1 && m.intersection_street_2)
            return setCases(m.intersection_street_1) + " & " + setCases(m.intersection_street_2);
          else if (m.incident_address)
            return setCases(m.incident_address);
          else
            console.log(m)
        }

        /* Sets the first letters of the city's name to uppercase */
        function formatCity(m) {
          return setCases(m.city);
        }

        /* Format the marker's date for display */
        function formatDate(d) {
          return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        }

        /* Sets the first letter of each word in a space delimited string to caps and the other letters to lower */
        function setCases(m) {
          var formatted = "";
          _.each(m.split(" "), function(d) {
            formatted += d.split("")[0] + d.toLowerCase().slice(1, d.length) + " ";
          })
          return formatted;
        }
  });
