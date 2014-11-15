'use strict';

angular.module('ratmap')
  .controller('MainCtrl', function ($scope) {

        d3.json('data/rats.json', function(err, data) {
          var thisYear = [];
          _.each(data.data, function(d) {
            if (d[9].split("-")[0] === "2014")
              thisYear.push(d);
          })
          data.data = thisYear;
          $scope.data = data;
          $scope.$apply();
        })

  });
