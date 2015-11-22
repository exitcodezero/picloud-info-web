'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$websocket', function($scope, $websocket) {

    $scope.settings = {
        url: '',
        apiKey: ''
    };
    $scope.socketConnected = false;
    $scope.picloudInfo = {};
    $scope.errorMessage = "";

    $scope.startSocket = function () {
        $scope.errorMessage = "";
        var websocketUrl = $scope.settings.url + "?apiKey=" + $scope.settings.apiKey;
        var socket = $websocket(websocketUrl);
        socket.onMessage(function (message) {
            $scope.picloudInfo = JSON.parse(message.data);
        });
        socket.onOpen(function () {
            $scope.socketConnected = true;
        });
        socket.onError(function() {
            $scope.socketConnected = false;
            $scope.resetSettings();
            $scope.errorMessage = "Socket error";
        });
        socket.onClose(function() {
            $scope.socketConnected = false;
            $scope.resetSettings();
            $scope.errorMessage = "Socket closed";
        });
    };

    $scope.resetSettings = function () {
        $scope.settings = {
            url: '',
            apiKey: ''
        };
    };

}]);
