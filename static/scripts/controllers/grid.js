// main.js
var app = angular.module('myApp', ['ngGrid','ngRoute','ngResource','ui.bootstrap']);


app.factory("Post", function($resource) {
  return $resource("/autores/:id", {callback:'JSON_CALLBACK'}, {
    query: { method: "GET", isArray: false },
    
    create: { method: 'POST' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }
  });
});


app.controller('MyCtrl', function($scope,Post) {

  Post.query({page:1},function(careerList, getResponseHeaders){
      console.log(getResponseHeaders);
    });


  $scope.gridOptions = { data: 'myData' };

  /* Pagination */
  $scope.noOfPages = 20;
  $scope.currentPage = 4;
  $scope.maxSize = 5;
  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };
/*
  Resource.get(1234).
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
  }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
*/
});

