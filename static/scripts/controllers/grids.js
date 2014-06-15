// main.js
var app = angular.module('myApp', ['ngGrid','ngRoute','ui.bootstrap']);


app.factory('Autor', function($http) {

    return {
      // get all the comments
      get : function(page) {
        return $http.get('/autores');
      },

      // query all the comments
      query : function(texto) {
        return $http.get('/autores',{params: {query:texto}});
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

  var filterBarPlugin = {
      init: function(scope, grid) {
          filterBarPlugin.scope = scope;
          filterBarPlugin.grid = grid;
          $scope.$watch(function() {
              var searchQuery = "";
              angular.forEach(filterBarPlugin.scope.columns, function(col) {
                  if (col.visible && col.filterText) {
                      var filterText = (col.filterText.indexOf('*') == 0 ? col.filterText.replace('*', '') : "^" + col.filterText) + ";";
                      searchQuery += col.displayName + ": " + filterText;
                  }
              });
              return searchQuery;
          }, function(searchQuery) {
              filterBarPlugin.scope.$parent.filterText = searchQuery;
              filterBarPlugin.grid.searchProvider.evalFilter();
          });
      },
      scope: undefined,
      grid: undefined,
  };


  $scope.loadData = function () {
     Autor.get()
    .success(function(data) {
          $scope.myData = data;
          var count = data.length;


          $scope.myData = data;
          $scope.currentPage = 1; //current page
          $scope.entryLimit = 5; //max no of items to display in a page
          $scope.filteredItems = data.length; //Initially for no filter
          $scope.totalItems = data.length;


          // Preparamos la paginacion
          if ($scope.noOfPages==null){
            var page_size = $scope.maxSize;
            $scope.noOfPages =  (count%page_size != 0) ? parseInt((count/page_size))+1 : (count/page_size);
          }

          // Preparamos los headers
          if ($scope.headers==null){
             $scope.headers=[]
             $scope.search={}
             for ( var key in data){

                for (var columna in data[key]){
                  $scope.headers.push({field: columna, displayName: columna.toUpperCase(), headerCellTemplate: 'static/scripts/controllers/filterHeaderTemplate.html'});
                }
                break;
             }
           }
          
        });

    $scope.gridOptions = { 
      data: 'myData',  
      columnDefs:'headers',
      enableRowSelection: false,
      enableSorting: true,
      enablePaging: true,
      rowHeight: 36,
      headerRowHeight: 60,
      plugins: [filterBarPlugin],
      
    };
  } // End Load Data()


  /* Pagination 
  $scope.currentPage = 1;
  $scope.maxSize = 5;


  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };
*/
  $scope.loadData();

  $scope.currentPage = 1;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
  };


});
/*   <pagination num-pages="noOfPages" current-page="currentPage"  on-select-page="pageChanged(page)" max-size="maxSize"></pagination>

var myplugin = {
      init: function(scope, grid) {
          myplugin.scope = scope;
          myplugin.grid = grid;
         $scope.$watch(function () {
              var searchQuery = "";
             angular.forEach(myplugin.scope.columns, function (col) {
                  if (col.filterText) {
                      searchQuery += col.field + ": " + col.filterText + "; ";
                  }
              });
              debug.log(searchQuery);
             return searchQuery;
          }, function (searchQuery) {
              debug.log(searchQuery);
              myplugin.scope.$parent.filterText = searchQuery;
              myplugin.grid.searchProvider.evalFilter();
          });
      },
      scope: undefined,
      grid: undefined
};
*/
/*
  $scope.$watch('search', function(searchText, oldsearchText) {
      console.log('aaa');
      if (searchText !== oldsearchText) {
        $scope.search[nombre] = "nombre:" + searchText + "; ";
      }});

*/
/*
$scope.$watchCollection('search', function(newNames, oldNames) {
    console.log(newNames);
        $scope.dataCount = newNames.length;
      });
*/

/*
angular.forEach($scope.search, function(object) {
    $scope.$watch(object, function(newNames,oldNames) {

        console.log(object);

    })
}, true);
*/

/*
 $scope.$watch($scope.search['id'], function(newNames,oldNames) {
        console.log(newNames);
    })*/

/*
 $scope.onKeyPress = function ($event,campo) {
      console.log(campo);
      
    };
*/

/*
  // poniendo  ng-keyup="getValue($event,col.field)" en el template
  $scope.getValue = function ($event,campo){
    var texto = $scope.search[campo];
    Autor.query($scope.search);
  }
*/
