//Operations page controller
var app = angular.module('myApp', []);

app.controller('opsController', ['$scope', '$http', function($scope,$http) {
    //Initialization of Scope variables
	$scope.showCategory = false;
	$scope.showDish = false;
	$scope.showOrders = false;
	$scope.showOrderUpdate = false;
    $scope.status;
    $scope.onClick = false;
    $scope.changedStatus;

    //Creating categories. This function will just change the Div.
    $scope.createCategory = function() {
        if($scope.showCategory == true){
        	$scope.showCategory = false; 
        } else{
        	$scope.showCategory = true;
        	$scope.showDish = false;
			$scope.showOrders = false;
			$scope.showOrderUpdate = false;
			refreshCategory();
        }
    }

    //Adding dishes to a specific category. This function will just change the Div.
    $scope.addDishToCategory = function() {
        if($scope.showDish == true){
        	$scope.showDish = false; 
        } else{
        	$scope.showCategory = false;
        	$scope.showDish = true;
			$scope.showOrders = false;
			$scope.showOrderUpdate = false;
			refreshDish();
			refreshCategory();
        }
    }

    //Checking the orders placed. This function will just change the Div.
    $scope.checkOrders = function() {
        if($scope.showOrders == true){
        	$scope.showOrders = false; 
        } else{
        	$scope.showCategory = false;
        	$scope.showDish = false;
			$scope.showOrders = true;
			$scope.showOrderUpdate = false;
            fetchOrders();
        }
    }

    //Updating the order status. This function will just change the Div
    $scope.updateOrders = function() {
        if($scope.showOrderUpdate == true){
        	$scope.showOrderUpdate = false; 
        } else{
        	$scope.showCategory = false;
        	$scope.showDish = false;
			$scope.showOrders = false;
			$scope.showOrderUpdate = true;
        }
    }

    //Clear data written in the input box
    $scope.clearCategoryData = function() {
    	refreshCategory();
    }

    //Clear data written in the input box
    $scope.clearDishData = function() {
    	refreshDish();
    }

    //Add the categories.
    $scope.addCategory = function(name) {
    	$scope.category = {name}
    	var collection = 'category';
        $http.post('/hotspice/' + collection, $scope.category).success(function(response) {
		    refreshCategory();
		});
    }

    //Add dishes to categories
    $scope.addDish = function(name , price, categoryName) {
        if(categoryName == undefined){
            alert('Please select a categories')
        }else{
            $scope.dish = {name, price, categoryName}
            var collection = 'dish';
            $http.post('/hotspice/' + collection, $scope.dish).success(function(response) {
                refreshDish();
            });
        }
    	
    }

    //Sort the orders depending on the status
    $scope.sortOrders = function(orderStatus){
        $scope.status = orderStatus;
        var changedStatus = ($scope.status == 'Received') ? 'Fulfilled' : (($scope.status == 'Fulfilled') ? 'Dispatched' : 'Delievered');
        $scope.changedStatus = changedStatus;
        $scope.onClick = true;
        var collection = 'sortOrders';
        var status = orderStatus;
        var parameters = {collection, status};
        $http({
           url: '/hotspice/', 
           method: "GET",
           params: parameters
        }).success(function(response) {
            if($scope.showOrderUpdate == true)
                $scope.ordersToChangeStatus = response;
            else
                $scope.orders = response;
            
        });
    }


    //Change the status of the orders placed
    $scope.changeStatus = function(id){
        var collection = 'changeStatus'
        var status = ($scope.status == 'Received') ? 'Fulfilled' : ($scope.status == 'Fulfilled' ? 'Dispatched' : 'Delievered');
        var parameters = {collection, id, status};
        $http({
           url: '/hotspice/', 
           method: "PUT",
           params: parameters
        });

        $scope.sortOrders($scope.status);
        
    }


    //Get dynamically what all categories are present to populate the drop-down list
    var refreshCategory = function() {
    	var collection = 'category';
        var parameters = {collection};
    	$scope.categories = [];
    	$http({
           url: '/hotspice/', 
           method: "GET",
           params: parameters}).success(function(response) {
	    	$scope.category = response;
	    	$scope.categories = response;
	  	});
	};


    //Get all the dishes.
	var refreshDish = function() {
		var collection = 'dish';
        var parameters = {collection};
		$http({
           url: '/hotspice/', 
           method: "GET",
           params: parameters}).success(function(response) {
	    	$scope.dish = response;
	  });
	};

    //Get all the orders.
    var fetchOrders = function() {
        var collection = 'getOrders'
        var parameters = {collection};
        $http({
           url: '/hotspice/', 
           method: "GET",
           params: parameters}).success(function(response) {
            $scope.orders = response;
            $scope.orderCategories = [
                    {"name" : 'All'},
                    {"name" : 'Received'},
                    {"name" : 'Fulfilled'},
                    {"name" : 'Dispatched'},
                    {"name" : 'Delievered'}
                ];
      });

    };
}]);

