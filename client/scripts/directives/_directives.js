var directives = angular.module('app.directives', []);
directives.directive('ngVote', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: 'dist/bookmarklet/templates/vote.html'
  };
}).directive('ngLogin', function(){
  return {
    restrict: 'A',
    require: '^ngModel',
    templateUrl: 'dist/bookmarklet/templates/login.html'
  }
});
