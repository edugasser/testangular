// main.js
var app = angular.module('myApp', ['ngGrid','ngRoute','ui.bootstrap']);

app.factory('Autor', function($http) {

    return {
      // get all the comments
      get : function(page) {
        return $http.get('/autores',{params: {page:page}});
      },

      // query all the comments
      query : function(texto) {
        return $http.get('/autores?'+texto);
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

  function Tratar_Grid(data){
      $scope.myData = data.results;

      // Preparamos la paginacion
      if ($scope.noOfPages==null){
        var page_size = data.results.length;
        $scope.noOfPages =  (data.count%page_size != 0) ? parseInt((data.count/page_size))+1 : (data.count/page_size);
      }

      // Preparamos los headers
      if ($scope.headers==null){
         $scope.headers=[]
         $scope.search={}
         for (var key in data.results){
            for (var columna in data.results[key]){
              $scope.search[columna]=''
              $scope.headers.push({field: columna, displayName: columna.toUpperCase(), headerCellTemplate: 'static/scripts/controllers/filterHeaderTemplate.html'});
              
            }
            break;
         }
       } // End headers
    }

  var filterBarPlugin = {
      init: function(scope, grid) {
          filterBarPlugin.scope = scope;
          filterBarPlugin.grid = grid;
          $scope.$watch(function() {
              var searchQuery = '';
              var vacio = true;
              angular.forEach(filterBarPlugin.scope.columns, function(col) {
                  if (col.visible && col.filterText) {
                      var filterText = col.filterText.trim();
                      if (filterText.length % 3 === 0){
                        searchQuery+=col.field + "__contains=" + filterText+ "&";
                      }  
                      vacio = false;        
                  }
              }
              );
              /* si han vaciado el campo,hacemos otra llamada*/
              if (vacio){
                searchQuery= ' ';
              }
             return searchQuery;
          }, function(searchQuery,vacio) {
              /* si hay datos que buscar */
              if (searchQuery){
                $scope.queryData(searchQuery);
              }
          });
      },
      scope: undefined,
      grid: undefined,
  };

  $scope.loadData = function (page) {
     Autor.get(page)
      .success(function(data) {
        Tratar_Grid(data);
      }); // End sucess()
  } // End Load Data()


  $scope.queryData = function (query) {
     Autor.query(query)
      .success(function(data) {
        Tratar_Grid(data);
      }); // End sucess()
  } // End query Data()


  /* Pagination */
  $scope.currentPage = 1;
  $scope.pageChanged = function(page) {
    $scope.loadData(page);
  };

  $scope.sortDjango = function(event){
    $scope.pru2 = event;
  };

  $scope.loadData();
  $scope.gridOptions = { 
    data: 'myData',  
    columnDefs:'headers',
    enableRowSelection: false,
    enableSorting: true,
    enablePaging: true,
    rowHeight: 36,
    headerRowHeight: 60,
    plugins: [filterBarPlugin],
  };// End gridOptions()



$scope.$watch('gridOptions.ngGrid.config.sortInfo', function () {
      console.log($scope.gridOptions.ngGrid.config.sortInfo);
  }, true);

});

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
