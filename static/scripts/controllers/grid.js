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

   var myHeaderCellTemplate = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{cursor: col.cursor}" ng-class="{ ngSorted: !noSortVisible }">'+
        '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">{{col.displayName}}</div>'+
        '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
        '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
        '<div class="ngSortPriority">{{col.sortPriority}}</div>'+
        '<input type="text" ng-model="gridOptions.filterOptions.filterText2"/>'+
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
                               for ( var key in data.results){
                                  for (var columna in data.results[key]){
                                    $scope.headers.push({field: columna, displayName: columna.toUpperCase(), headerCellTemplate: myHeaderCellTemplate, colFilterText: ''});
                                  }
                                  break;
                               }
                            }
                            
                          });

                      $scope.gridOptions = { data: 'myData',  columnDefs:'headers',
                       enableRowSelection: false,
                        enableSorting: true,
                        enablePaging: true,
                        rowHeight: 36,
                        headerRowHeight: 60,
                        filterOptions: {
                            filterText: '',
                            filterText2: ''
                        },};
                    }


  /* Pagination */

  $scope.currentPage = 1;
  $scope.pageChanged = function(page) {
    $scope.loadData(page);
  };


  $scope.$watch('gridOptions.filterOptions.filterText2', function(searchText, oldsearchText) {
      if (searchText !== oldsearchText) {
        $scope.gridOptions.filterOptions.filterText = "nombre:" + searchText + "; ";
      }});
  $scope.loadData();
});

