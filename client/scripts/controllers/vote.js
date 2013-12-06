controllers.controller('VoteCtrl', function($scope, VoteService, storage){
  $scope.voted = false;

  $scope.log = function(vote){
    !!vote ? ($scope.like = true) : ($scope.dislike = true);
  };

  $scope.vote = function(vote){
    //grabs uri and vote status
    var clipping_id;
    var url = (window.location !== window.parent.location) ? document.referrer: document.location;
    var user_id = storage.get('caracolID');
    var clippings = storage.get('clippings' + user_id);
    for (var i=0; i<clippings.length; i++){
      if (clippings[i].url === url){
        clipping_id = clippings[i].clipping_id;
        console.log(clipping_id);
      }
    }

    VoteService.vote(user_id, vote, clipping_id);
    $scope.log(vote);
    $scope.voted = true;
  };
  $scope.revert = function(preference){
    $scope.voted = false;
    $scope[preference] = false;
  };
});
