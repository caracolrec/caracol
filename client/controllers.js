var controllers = angular.module('app.controllers', []);
controllers.controller('VoteCtrl', function($scope, VoteService){

  $scope.vote = function(vote){
    //grabs uri and vote status
    var user = "adam";
    var url = (window.location !== window.parent.location) ? document.referrer: document.location;
    VoteService.vote(user, vote);
  };

});
