var controllers = angular.module('app.controllers', []);
controllers.controller('VoteCtrl', function($scope, VoteService){
  $scope.voted = false;

  $scope.log = function(vote){
    !!vote ? ($scope.like = true) : ($scope.dislike = true);
  };

  $scope.vote = function(vote){
    //grabs uri and vote status
    var user_id = 0;
    var url = (window.location !== window.parent.location) ? document.referrer: document.location;
    VoteService.vote(user_id, vote, $scope.clipping_id.toNumber()); //--> will add when the db is more open-minded and willing to accept our users' preferences
    $scope.log(vote);
    $scope.voted = true;
  };
  $scope.revert = function(preference){
    $scope.voted = false;
    $scope[preference] = false;
  };
});
