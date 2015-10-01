/** Custom select directive */

module.exports = function($rootScope) {
  return {
    restrict: "E",
    templateUrl: "public/templates/dropdown.html",
    scope: {
      placeholder: "@",
      list: "=",
      selected: "=",
      property: "@",
      ids: "="
    },
    link: function(scope) {
      /**
       * Action on select option in dropdown
       * @param {object} item contains selected option data
       */
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
      scope.listVisible = false;
      scope.isPlaceholder = true;

      /** Collapse dropdown on any click */
      $rootScope.$on("documentClicked", function(inner, target) {
        /** Except these selectors */
        var classes = [target[0].parentNode.className, target[0].className];
        if(!!classes.indexOf('dropdown-display clicked'))
          scope.$apply(function() {
            scope.listVisible = false;
          });
      });

      /** Refresh dropdown and set value of hidden input */
      scope.$watch("selected", function(value) {
        scope.isPlaceholder = scope.selected[scope.property] === undefined;
        scope.display = scope.selected[scope.property];
        scope.$parent.setInputValue();
      });
    }
  };
};
