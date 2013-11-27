var directives = angular.module('app.directives', []);
directives.directive('ngHome', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: 'client/partials/home.html'
  };
});
