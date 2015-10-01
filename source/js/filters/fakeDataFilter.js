/**
 * Fake data filter
 * Use server side instead of it
 */
module.exports = function() {
  return function(inputs, pair) {
    if(!pair || pair === 'All') return inputs;
    var output = [];
    angular.forEach(inputs, function(input) {
      if(!!~pair.indexOf(input.name))
        output.push(input);
    });
    return output;
  };
};
