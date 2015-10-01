/**
 * Fake data filter
 * Use server side instead of it
 */
module.exports = function() {
  return function(inputs, ids) {
    if(!ids) return [];
    var output = [];
    angular.forEach(inputs, function(input) {
      if(!!~ids.indexOf(input.id))
        output.push(input);
    });
    return output;
  };
};
