/**
 * Extract properties from object and concatenate
 * @param  {object} obj  Target object
 * @param  {string} prop Target property
 * @param  {string} sep  Separator or glue
 * @return {string}
 */
function extractObjProps(obj, prop, sep) {
  var values = [];
  for(var item in obj){
    if(obj.hasOwnProperty(item) && obj[item][prop]){
      values.push(obj[item][prop]);
    }
  }
  return values.join(sep);
}

/**
 * All dropdown options
 * where "children" is a filter (as it will be said below)
 */
var currencies = {
  1: { "id": 1, "name": "EUR", "children": [3,5] },
  3: { "id": 3, "name": "USD" },
  5: { "id": 5, "name": "GBP" },
  999: { "id": 999, "name": "All" }
};

/** Ctrl */
module.exports = function($scope, $resource) {

  /** Set value of hidden input */
  $scope.setInputValue = function() {
    $scope.dd = extractObjProps($scope.selected, 'name', '/');
  };

  /** Fake submit */
  $scope.submit = function() {
    alert(JSON.stringify($scope.result));
  };

  $scope.currencies = currencies;

  /** Preset selected options */
  $scope.selected = {
    1: $scope.currencies[1],
    2: $scope.currencies[5]
  };

  /**
   * Set available options for each dropdown
   * Filter is an array of currencies object keys
   * Filter of the second dropdown is a children of the first dropdown
   * So here is a simple dependency
   */
  $scope.filters = {
    1: [1,3,999],
    2: $scope.selected[1].children || []
  };

  /** Get fake json data */
  $scope.data = $resource('data/data.json', {}, {'get': { method: 'GET' }})
    .get({currency:$scope.dd}, function(data) {
      return data;
    });

  /** Dependent dropdowns event logic */
  $scope.$watch("selected[1]", function(current, previous) {
    if(current.id === previous.id) return;
    $scope.selected[2] = {};
    $scope.filters[2] = $scope.selected[1].children || [];
  });

};
