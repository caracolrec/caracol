controllers.controller('VoteCtrl', function($scope, VoteService, $rootScope){
  $scope.voted = false;

  $scope.log = function(vote){
    !!vote ? ($scope.like = true) : ($scope.dislike = true);
  };

  $scope.hide = function(){
    $rootScope.hide = true;
  };

  $scope.vote = function(vote){
    //grabs uri and vote status
    var url = (window.location !== window.parent.location) ? document.referrer: document.location;
    var uri = encodeURIComponent(url);
    VoteService.vote(vote, uri);
    $scope.log(vote);
    $scope.voted = true;
  };
  
  $scope.revert = function(preference){
    $scope.voted = false;
    $scope[preference] = false;
  };

});
