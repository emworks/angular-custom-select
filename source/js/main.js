var angular = require('angular');

angular.module('dropdown', [require('angular-resource')])
  .run(function($rootScope) {
    angular.element(document).on("click", function(e) {
      $rootScope.$broadcast("documentClicked", angular.element(e.target));
    });
  })
  .controller('dropdownCtrl', require('./controllers/dropdownCtrl'))
  .directive("dropdown", require('./directives/dropdownDirective'))
  .filter('byIdFilter', require('./filters/byIdFilter'))
  .filter('fakeDataFilter', require('./filters/fakeDataFilter'));
