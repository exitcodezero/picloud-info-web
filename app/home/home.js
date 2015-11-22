'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$websocket', function($scope, $websocket) {

    var socket;

    $scope.settings = {
        url: '',
        apiKey: ''
    };
    $scope.socketConnected = false;
    $scope.picloudInfo = [];
    $scope.infoCreatedAt = null;
    $scope.isConnecting = false;

    $scope.connect = function () {
        $scope.isConnecting = true;
        var websocketUrl = $scope.settings.url + "?apiKey=" + $scope.settings.apiKey;
        socket = $websocket(websocketUrl);
        socket.onMessage(function (message) {
            var data = JSON.parse(message.data);
            $scope.picloudInfo = formatInfoData(data);
            $scope.infoCreatedAt = data.created_at;
        });
        socket.onOpen(function () {
            $scope.isConnecting = false;
            $scope.socketConnected = true;
        });
        socket.onError(function () {
            $scope.isConnecting = false;
            $scope.socketConnected = false;
            $scope.resetSettings();
        });
        socket.onClose(function () {
            $scope.isConnecting = false;
            $scope.socketConnected = false;
            $scope.resetSettings();
        });
    };

    $scope.disconnect = function () {
        socket.close();
        $scope.isConnecting = false;
        $scope.socketConnected = false;
        $scope.resetSettings();
    };

    $scope.resetSettings = function () {
        $scope.settings = {
            url: '',
            apiKey: ''
        };
    };

    function formatInfoData (infoData) {
        var result = [];
        if (!infoData.events) {
            return result;
        }
        infoData.events.forEach(function (eventItem) {
            if (eventItem.connections) {
                eventItem.connections.forEach(function (connectionItem) {
                    result.push({
                        name: eventItem.name,
                        ipAddress: connectionItem.ip_address,
                        connectedAt: connectionItem.connected_at
                    });
                });
            }
        });
        return result;
    }

}]);
