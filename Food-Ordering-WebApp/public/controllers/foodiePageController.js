//Customer (Foodie's) page controller
var app = angular.module('myApp', []);

app.controller('foodieController', ['$scope', '$http', function($scope,$http) {
  //Initialization of Scope variables
	$scope.dishCounter = [];
	$scope.dishPrice = [];
  $scope.myOrders = [];
	$scope.showFoodiePage = false;
	$scope.showOrderPage = false;
	$scope.dishSelected = {dish : [], contact : {}, orderTime : {}, orderTotalPrice : {}, orderStatus : {}};
	$scope.firstTime = false;
	$scope.nextTime = false;
	$scope.editOrderPage = false;
	$scope.showMyRecentOrders = false;
	$scope.phoneNumber;
	$scope.address;
	$scope.sortParam;
	$scope.catParam;
  $scope.orderTotalPrice = 0;

  //Initialization of data
	$scope.init = function(value) {
		$scope.showFoodiePage = true;
		$scope.firstTime = true;
		$scope.showMyRecentOrders = false;
		refreshCategory();
		refreshDish();
  	}

    //Adding dishes in the order
  	$scope.addDish = function(name,price) {
  		$scope.dishCounter[name] = $scope.dishCounter[name] + 1;
  		if($scope.dishCounter[name] == 1){
  			$scope.dishPrice[name] = price;
  		}
  	}

    //Removing dishes from the order
  	$scope.removeDish = function(name,price) {
  		if($scope.dishCounter[name] > 0){
  			$scope.dishCounter[name] = $scope.dishCounter[name] - 1;
  		}
  	}

    //Remove all dishes from the order
  	$scope.removeallDishes = function(name){
  		$scope.dishCounter[name] = 0;
  	}

    //Reviewing the order. Will show what all dieshes selected till now
  	$scope.reviewOrder = function(){
  		for(name in $scope.dishPrice){
  			if($scope.dishCounter[name] > 0){
  				var totalPriceOfDish = $scope.dishCounter[name] * $scope.dishPrice[name];
  				$scope.dishSelected.dish.push({'name' : name, 'quantity' : $scope.dishCounter[name] , 'price' : $scope.dishPrice[name], 
  				'totalPrice' : totalPriceOfDish});
  			}
        $scope.orderTotalPrice = $scope.orderTotalPrice + totalPriceOfDish;
  		}
  		$scope.showFoodiePage = false;
  		$scope.showOrderPage = true;
  	}

    //Modify order on review order page. This function will just change the Div
  	$scope.modifyOrder = function(){
  		$scope.showFoodiePage = true;
  		$scope.showOrderPage = false;
  		$scope.firstTime = false;
  		$scope.nextTime = true;
  	}

    //Edit quantity of selected dishes. This function will just change the Div
  	$scope.editQuantity = function(){
  		$scope.showFoodiePage = false;
  		$scope.showOrderPage = false;
  		$scope.editOrderPage = true;

  	}

    //Review the order after modification
  	$scope.reviewOrderAgain = function(){
  		$scope.dishSelected = {dish : [], contact : {}};
  		for(name in $scope.dishPrice){
  			if($scope.dishCounter[name] > 0){
  				var totalPriceOfDish = $scope.dishCounter[name] * $scope.dishPrice[name];
  				$scope.dishSelected.dish.push({'name' : name, 'quantity' : $scope.dishCounter[name] , 'price' : $scope.dishPrice[name], 
  				'totalPrice' : totalPriceOfDish});
  			}
        $scope.orderTotalPrice = $scope.orderTotalPrice + totalPriceOfDish;
  		}
  		$scope.showFoodiePage = false;
  		$scope.showOrderPage = true;
  		$scope.editOrderPage = false;
  	}

    //Place the order
  	$scope.placeOrder = function(){
  		var collection = 'orders';

  		if($scope.phoneNumber && $scope.address){
  			$scope.dishSelected.contact = $scope.phoneNumber;
  			$scope.dishSelected.orderTime = Date.now();
        $scope.dishSelected.orderTotalPrice = $scope.orderTotalPrice;
        $scope.dishSelected.orderStatus = 'Received';
  		   	$http.post('/hotspice/' + collection, $scope.dishSelected).success(function(response) {
			});
			  alert('Order placed successfully. Redirecting to homepage');
  			window.location = "../index.html"
  		} else{
  			alert("Please enter valid number and address");
  		}
  	}

    //Showing recent orders of a specific customer. This function will just change the Div.
  	$scope.showRecentOrders = function(){
  		$scope.showMyRecentOrders = true;
  		$scope.showFoodiePage = false;
  		$scope.showOrderPage = false;
  	}


    //Showing last five orders of a specific customer
  	$scope.fetchMyRecentOrders = function(number){
  		$scope.showMyRecentOrders = true;
  		$scope.showFoodiePage = false;
  		$scope.showOrderPage = false;
  		var collection = 'fetch';
  		var number = number;
  		var parameters = {collection, number};
  		$http({
		   url: '/hotspice/', 
		   method: "GET",
		   params: parameters
      }).success(function(response){
	  		$scope.myOrders = response;
	  	});
  	}

    //Show the dishes for a category selected
  	$scope.showSelectedCategory = function(name){
  		var collection = 'findCat';
  		var collectionName = 'dish';
  		var sortParamOne = name;
  		var parameters = {collection, collectionName, sortParamOne};  		
  		if(sortParamOne !== undefined){
  			$http({
		   		url: '/hotspice/', 
		   		method: "GET",
		   		params: parameters
			}).success(function(response){
				$scope.dish = response;
			});
  		}
  	}

    //Helper function to show the data of recent orders
    $scope.getIndex = function(order){
      var orderArr = [];
      for(var index = 0; index < order.dish.length; index++)
        orderArr[index] = index;

      return orderArr;
    }

    //Sort the dishes alphabetically, in order of price
  	$scope.sortDishes = function(name){
  		var collection = 'sortCat';
  		var collectionName = 'dish';
  		var sortParamOne = name;
  		var parameters = {collection, collectionName, sortParamOne};
  		refreshCategory();
  		if(sortParamOne !== undefined){
  			$http({
		   		url: '/hotspice/', 
		   		method: "GET",
		   		params: parameters
			}).success(function(response){
				$scope.dish = response;
			});
  		}
  	}

  //Get dynamically what all categories are present to populate the drop-down list.
	var refreshCategory = function() {
    	var collection = 'category';
    	var parameters = {collection};
    	$scope.categories = [];
    	$http({
		   url: '/hotspice/', 
		   method: "GET",
		   params: parameters}).success(function(response){
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
		   params: parameters}).success(function(response){
	  		$scope.dish = response;
	    	angular.forEach(response, function(value,key){
	    		$scope.dishCounter[value.name] = 0;
	    		$scope.sortedDishes = [
	    			{"name" : 'A-Z'},
	    			{"name" : 'Z-A'},
	    			{"name" : 'Price Low-High'},
	    			{"name" : 'Price High-Low'}
		    	];
	    	});
	  	});
	};
}]);