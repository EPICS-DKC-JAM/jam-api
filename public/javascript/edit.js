angular.module('edit', ['schemaForm'])
    .controller('MainController', function ($scope, $http) {
        $scope.openConsumable = function (item) {
            console.log($scope.model);
            $scope.showConsumableModal = true;
            $scope.model = item;
        };

        $http({
            url: 'consumables/getRaw/all',
            method: 'GET'
        }).then(function (response) {
            console.log(response.data);
            $scope.consumables = response.data.data;
        });

        $scope.openModifier = function (item) {
            console.log($scope.model);
            $scope.showModifierModal = true;
            $scope.model = item;
        };

        $http({
            url: 'modifiers/get/all',
            method: 'GET'
        }).then(function (response) {
            console.log(response.data);
            $scope.modifiers = response.data.data;
        });

        $scope.openSize = function (item) {
            console.log($scope.model);
            $scope.showSizeModal = true;
            $scope.model = item;
        };

        $http({
            url: 'sizes/get/all',
            method: 'GET'
        }).then(function (response) {
            console.log(response.data);
            $scope.sizes = response.data.data;
        });

    })

    .controller('ConsumableController', function ($scope, $http) {
        $scope.schema = {
            type: "object",
            properties: {
                name: {type: "string", minLength: 2, title: "Name"},
                description: {type: "string", minLength: 0, title: "Description"},
                price: {type: "number", title: "Price"},
                jslImage: {type: "string", title: "JSL Image"},
                itemImage: {type: "string", title: "Consumable Image"},
                caffeine: {type: "boolean", title: "Caffeine"},
                modifiers: {type: "integer", title: "Modifier ID"},
                size: {type: "integer", title: "Size ID"}
            }
        };

        $scope.form = [
            "*",
            {
                type: "submit",
                title: "Save"
            }
        ];

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');

            if (form.$valid) {
                $http({
                    url: 'consumables/upsert',
                    method: 'POST',
                    data: {data: $scope.model}
                }).then(function (response) {
                    console.log(response.data);
                });

                $http({
                    url: 'consumables/getRaw/all',
                    method: 'GET'
                }).then(function (response) {
                    console.log(response.data);
                    $scope.consumables = response.data.data;
                });
            }
        }
    })

    .controller('ModifierController', function ($scope, $http) {
        $scope.schema = {
            type: "object",
            properties: {
                modifiers: {type: "array", title: "Modifiers", items: {type: "string", minLength: 1, title: "  "}}
            }
        };

        $scope.form = [
            "*",
            {
                type: "submit",
                title: "Save"
            }
        ];

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');

            if (form.$valid) {
                $http({
                    url: 'modifiers/upsert',
                    method: 'POST',
                    data: {data: $scope.model}
                }).then(function (response) {
                    console.log(response.data);
                });

                $http({
                    url: 'modifiers/get/all',
                    method: 'GET'
                }).then(function (response) {
                    console.log(response.data);
                    $scope.modifiers = response.data.data;
                });
            }
        }
    })

    .controller('SizeController', function ($scope, $http) {
        $scope.schema = {
            type: "object",
            properties: {
                sizes: {type: "array", title: "Sizes", items: {type: "string", minLength: 1, title: "  "}}
            }
        };

        $scope.form = [
            "*",
            {
                type: "submit",
                title: "Save"
            }
        ];

        $scope.onSubmit = function (form) {
            $scope.$broadcast('schemaFormValidate');

            if (form.$valid) {
                $http({
                    url: 'sizes/upsert',
                    method: 'POST',
                    data: {data: $scope.model}
                }).then(function (response) {
                    console.log(response.data);
                });

                $http({
                    url: 'sizes/get/all',
                    method: 'GET'
                }).then(function (response) {
                    console.log(response.data);
                    $scope.sizes = response.data.data;
                });
            }
        }
    })

    .directive('modal', function () {
        return {
            template: '<div class="modal fade">' +
            '<div class="container container-table">' +
            '<div class="row vertical-center-row">' +
            '<div class="jumbotron" align="center">' +
            '<div class="modal-body" align="center" ng-transclude style="padding-bottom: 4%"></div>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Close</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function (value) {
                    if (value === true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    });

