var app = angular.module('myApp', ['ngRoute','ngResource']);


app.factory("Post", function($resource) {
  return $resource("/autores/:id", {}, {
    query: { method: "GET", isArray: true },
    create: { method: 'POST' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
});


app.controller("MainCtrl", function($scope, Post) {
  
  midata={'nombre':'pepe3','apellido':'juan'}

  //Post.delete({ id: 1 }); // delete oK
  //Post.update({'id':2},midata); // update OK
  //var a=Post.get({ id: 2 }); //get solo uno


  Post.query(function(data) {
    $scope.posts = data;
  });
 
 /* var user = new Post();
  user.id = 5;
  user.nombre = 'Kirk Bushell';
  user.apellido = 'Kirk Bushell';
  user.$save(); // POST ok */

 $scope.delete = function(post) {
    Post.delete({id:post.id},
      function(data){ 
          //do something with data here 
         idx = $scope.posts.indexOf(post)
         $scope.posts.splice(idx, 1);
        }
        ); 
 }

 /* $scope.save = function(post) {
    if ($scope.post._id) {
      Post.update({_id: $scope.post._id}, $scope.post);
    } else {
      var nuevo = new Post(post);
      nuevo.$save()
      .then(function(res)  { console.log("authenticated") })
      .catch(function(req) { console.log(req); })
      .success(function()  { $scope.posts.push(post);});
    }

    $scope.editing = false;
    $scope.post = new Post();
  }*/

$scope.save = function(post) {
    if ($scope.post._id) {
      Post.update({_id: $scope.post._id}, $scope.post);
    } else {
      var nuevo = new Post(post);

      nuevo.$save(
          //sucess
          function(data){ 
            $scope.posts.push(post);
          })
      .catch(function(req) { $scope.errors=req.data }); 
    }
    $scope.editing = false;
    $scope.post = new Post();
  }




});

