var directives = angular.module('app.directives', []);
directives.directive('firstDirective', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: ''
  };
});