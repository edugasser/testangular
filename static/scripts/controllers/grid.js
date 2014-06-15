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


  //$scope.search = {id:'', nombre:'', apellido:''};


   var myHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
        '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}  {{search[col.field]}} </div>'+
        '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
        '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
        '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
        '<input type="text"  ng-model="search[col.field]"/>'+
        '</div>'+
    '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';


  $scope.loadData = function (page) {
     Autor.get(page)
    .success(function(data) {
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
             for ( var key in data.results){
                for (var columna in data.results[key]){
                  $scope.search[columna]=''
                  $scope.headers.push({field: columna, displayName: columna.toUpperCase(), headerCellTemplate: myHeaderCellTemplate, colFilterText: ''});
                  
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

    };
  } // End Load Data()


  $scope.$watchCollection('search', function(newNames, oldNames) {
     console.log(newNames);
      Autor.query($scope.search);
  });





  /* Pagination */

  $scope.currentPage = 1;
  $scope.pageChanged = function(page) {
    $scope.loadData(page);
  };

  $scope.loadData();

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
