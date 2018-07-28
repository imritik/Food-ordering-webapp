//Controller for the homepage
var app = angular.module('myApp', []);
app.controller('homePageController', function($scope) {
	//Redirects user to operations page
    $scope.redirectToOps = function() {
        window.location = "../opspage.html";
    }

    //Redirects user to Customer Page
    $scope.redirectToFoodie = function() {
        window.location = "../foodiepage.html";
    }
});

