token = ""

angular.module('live', ['btford.socket-io', 'smart-table'])
    .controller('loginController', function ($scope, $http, socket) {
        socket.on('receiveItems', function (data) {
            $scope.carts = data;
            console.log($scope.carts)
        });

        $http({
            url: 'live/initialize',
            method: 'GET',
            headers: {'x-access-token': token}
        }).then(function (response) {
            console.log(response.data);
            $scope.carts = response.data.data;
        });

        $scope.deleteCart = function (id) {
            $http({
                url: 'live/delete/' + id,
                method: 'GET',
                headers: {'x-access-token': token}
            }).then(function (response) {
                console.log(response.data);
                $scope.carts = response.data.data;
            });
        }
    })


    .factory('socket', function (socketFactory) {
        return socketFactory();
    })

    .directive('ngConfirmClick', [
        function () {
            return {
                link: function (scope, element, attr) {
                    var msg = attr.ngConfirmClick || "Are you sure?";
                    var clickAction = attr.confirmedClick;
                    element.bind('click', function (event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }]);


