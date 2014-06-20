// main.js
var app = angular.module('myApp', ['ngGrid','ngRoute','ui.bootstrap']);

app.factory('Autor', function($http) {
    return {
      // get all the comments
      get : function(page) {
        return $http.get('/dame_autores',{params: {page:page}});
      },

      // query all the comments
      query : function(page,texto,ordering) {
        console.log(page);
        ordering = typeof ordering !== 'undefined' ? ordering : '';
        page = typeof page !== 'undefined' ? 'page='+page.toString()+'&' : '';
        texto = typeof texto !== 'undefined' ? texto : '';
        if (texto=='   ')texto='';

        return $http.get('/dame_autores?'+page+texto+ordering);
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


app.config(function($logProvider){
  $logProvider.debugEnabled(true);
});

app.controller('MyCtrl', function($scope,$http,Autor,$log) {
  $scope.firstWatch=true;
  function Tratar_Grid(data){
      $scope.myData = data.results;

      // Preparamos la paginacion

      $scope.noOfPages =  data.num_pages;
     

      if ($scope.headers==null){
        $scope.headers=data.headers
      }
      
    }
  
  
  var filterBarPlugin = {
      init: function(scope, grid) {
          filterBarPlugin.scope = scope;
          filterBarPlugin.grid = grid;
          $scope.memory_search=''
          $scope.$watch(function() {
              var searchQuery = '';
              var vacio = true;
              angular.forEach(filterBarPlugin.scope.columns, function(col) {
                  if (col.visible && col.filterText) {
                    
                      var filterText = col.filterText.value
                      // cada tres caracteres, realiza una busqueda
                      if (filterText.length % 3 === 0){
                        searchQuery+=col.field + "=" + filterText+ "&";
                      }
                      vacio = false;        
                  }
              }
              );
              // si han vaciado todos los campos por completo,hacemos otra llamada
              if (vacio){
                searchQuery= '   ';// 3 espacios
              }
             return searchQuery;
          }, function(searchQuery,vacio,newVal, oldVal) {
                // esta condicion es redundante, pero es que cuando
                // inicia la página, se lanza esta función sin pasar por el watch
              $log.debug($scope.firstWatch,searchQuery,searchQuery.length);
               if (!$scope.firstWatch && searchQuery.length>=3){
                  $scope.queryData(1,searchQuery, $scope.ordering);
                  // cuando se quiera ordenar, hay que tener en cuenta los filtros
                  // los guardamos aquí para no tener que realizar otra vez el recorrido.
                  $scope.memory_search = searchQuery;
                }
                $scope.firstWatch = false;
          });
      },
      scope: undefined,
      grid: undefined,
  };
    $scope.selectables = {'nombre':[
        { label: 'edu', value: 'edu'},
        { label:'andres', value: 'andres'},
        { label: 'walter', value: 'walter'}
    ],'apellido':[
        { label: 'gasser', value: 'gasser'},
        { label:'gasser', value: 'suden'},
        { label: 'suden', value: 'suden'}
    ],'id':[
        { label: 'A', value: 'edu'},
        { label:'B', value: 2},
        { label: 'C', value: 3}
    ]};


  $scope.loadData = function (page) {
     Autor.get(page)
      .success(function(data) {
        Tratar_Grid(data);
      }); // End sucess()
  } // End Load Data()


  $scope.queryData = function (page,query,ordering) {
     Autor.query(page,query,ordering)
      .success(function(data) {
        Tratar_Grid(data);
      }); // End sucess()
  } // End query Data()

  $scope.$watch('gridOptions.ngGrid.config.sortInfo', function (newVal, oldVal) {
      if(newVal != oldVal){
        var obj = $scope.gridOptions.ngGrid.config.sortInfo;
        var dir = ''
        if(obj.directions[0]=='desc'){
          dir='-'
        }
        $scope.ordering = '&ordering='+dir+obj.fields[0]

        $scope.queryData(1,$scope.memory_search, $scope.ordering)
        $scope.currentPage = 1;
      }
  }, true);

  /* Pagination */
  $scope.currentPage = 1;
  $scope.pageChanged = function(page) {
    $scope.queryData(page,$scope.memory_search,$scope.ordering)
  };

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


  $scope.loadData(1);

});