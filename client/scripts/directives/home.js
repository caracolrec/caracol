directives.directive('ngHome', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: 'dist/bookmarklet/templates/vote.html'
  };
});
