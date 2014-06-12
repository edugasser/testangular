// main.js
var app = angular.module('myApp', ['ngGrid','ngRoute','ui.bootstrap']);


app.factory('Autor', function($http) {

    return {
      // get all the comments
      get : function(page) {
        return $http.get('/autores',{params: {page:page}});
      },

      // save a comment (pass in comment data)
      save : function(commentData) {
        return $http({
          method: 'POST',
          url: '/api/comments',
          headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
          data: $.param(commentData)
        });
      },

      // destroy a comment
      destroy : function(id) {
        return $http.delete('/api/comments/' + id);
      }
    }
  });



app.controller('MyCtrl', function($scope,$http,Autor) {


  Autor.get()
  .success(function(data) {
        $scope.myData = data.results;
      });

  $scope.gridOptions = { data: 'myData' };

  /* Pagination */
  $scope.noOfPages = 3;
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

