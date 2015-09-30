var angular = require('angular');

var app = angular.module('dropdown', [require('angular-resource')]);

app.controller('dropdownCtrl', function($scope, $resource) {

  var extractObjProps = function(obj, prop) {
    var values = [],
        separator = '/';
    for(var item in obj){
      if(obj.hasOwnProperty(item) && obj[item][prop]){
        values.push(obj[item][prop]);
      }
    }
    return values.join(separator);
  }

  var resource = $resource('data/data.json', {}, {
    'get': { method: 'GET' }
  });

  $scope.setInputValue = function() {
    $scope.dd = extractObjProps($scope.selected, 'name');
  };

  $scope.submit = function() {
    alert(JSON.stringify($scope.result));
  };

  $scope.currencies = {
    1: { "id": 1, "name": "EUR", "children": [3,5] },
    3: { "id": 3, "name": "USD" },
    5: { "id": 5, "name": "GBP" },
    999: { "id": 999, "name": "All" }
  };

  $scope.selected = {
    1: $scope.currencies[1],
    2: $scope.currencies[5]
  };

  $scope.filters = {
    1: [1,3,999],
    2: $scope.selected[1].children || []
  };

  $scope.data = resource.get({currency:$scope.dd}, function(data) {
    return data;
  });

  $scope.$watch("selected[1]", function(current, previous) {
    if(current.id === previous.id) return;
    $scope.selected[2] = {};
    $scope.filters[2] = $scope.selected[1].children || [];
  });

});

app.run(function($rootScope) {
  angular.element(document).on("click", function(e) {
    $rootScope.$broadcast("documentClicked", angular.element(e.target));
  });
});

app.directive("dropdown", function($rootScope) {
  return {
    restrict: "E",
    templateUrl: "templates/dropdown.html",
    scope: {
      placeholder: "@",
      list: "=",
      selected: "=",
      property: "@",
      ids: "="
    },
    link: function(scope) {
      scope.listVisible = false;
      scope.isPlaceholder = true;
      scope.select = function(item) {
        if(scope.selected.id === item.id) return;
        scope.isPlaceholder = false;
        scope.selected = item;
      };
      scope.isSelected = function(item) {
        return item[scope.property] === scope.selected[scope.property];
      };
      scope.show = function() {
        scope.listVisible = true;
      };
      scope.isEmptyObj = function(obj) {
        return !obj.length;
      };
      $rootScope.$on("documentClicked", function(inner, target) {
        var classes = [target[0].parentNode.className, target[0].className];
        if(!!classes.indexOf('dropdown-display clicked'))
          scope.$apply(function() {
            scope.listVisible = false;
          });
      });
      scope.$watch("selected", function(value) {
        scope.isPlaceholder = scope.selected[scope.property] === undefined;
        scope.display = scope.selected[scope.property];
        scope.$parent.setInputValue();
      });
    }
  };
});

app.filter('filterById', function() {
  return function(inputs, ids) {
    if(!ids) return [];
    var output = [];
    angular.forEach(inputs, function(input) {
      if(!!~ids.indexOf(input.id))
        output.push(input);
    });
    return output;
  };
});

app.filter('fakeDataFilter', function() {
  return function(inputs, pair) {
    if(!pair || pair === 'All') return inputs;
    var output = [];
    angular.forEach(inputs, function(input) {
      if(!!~pair.indexOf(input.name))
        output.push(input);
    });
    return output;
  };
});
