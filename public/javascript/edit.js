var token = '';

angular.module('edit', ['schemaForm', 'ngMaterial', 'smart-table', 'ngFileUpload'])
    .controller('loginController', function ($scope, $http) {
        $scope.loggedIn = false;

        $scope.onSubmit = function () {
            console.log($scope.username);
            console.log($scope.password);

            $http({
                url: '/auth',
                method: 'POST',
                data: {username: $scope.username, password: $scope.password}
            }).then(function (response) {
                console.log(response.data);

                function onSuccess(token, callback) {
                    this.token = token;
                    callback();
                }

                if (response.data.status) {
                    onSuccess(response.data.token, function () {
                        $scope.loggedIn = true;
                    });
                } else {
                    $scope.loggedIn = false;
                    alert('Invalid Login')
                }
            });
        }
    })

    .controller('MainController', function ($scope, $http) {
        $scope.openConsumable = function (item) {
            console.log($scope.model);
            $scope.showConsumableModal = true;
            $scope.model = item;
        };

        $http({
            url: 'consumables/getRaw/all',
            method: 'GET',
            headers: {'x-access-token': token}
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
            method: 'GET',
            headers: {'x-access-token': token}
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
            method: 'GET',
            headers: {'x-access-token': token}
        }).then(function (response) {
            console.log(response.data);
            $scope.sizes = response.data.data;
        });


        $scope.deleteConsumable = function (id) {
            $http({
                url: 'consumables/delete/' + id,
                method: 'GET',
                headers: {'x-access-token': token}
            }).then(function (response) {
                console.log(response)
                if (response.data.status) {
                    $http({
                        url: 'consumables/getRaw/all',
                        method: 'GET',
                        headers: {'x-access-token': token}
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.consumables.length = 0;
                        angular.extend($scope.consumables, response.data.data);
                        //$scope.consumables = response.data.data;
                    });
                } else {

                }
            });
        };
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


        $scope.onSubmit = function (form, add) {
            $scope.$broadcast('schemaFormValidate');
            if (form.$valid) {
                $http({
                    url: 'consumables/upsert',
                    method: 'POST',
                    headers: {'x-access-token': token},
                    data: {data: $scope.model}
                }).then(function (response) {
                    console.log(response.data.status);
                    if (response.data.status) {
                        $http({
                            url: 'consumables/getRaw/all',
                            method: 'GET',
                            headers: {'x-access-token': token}
                        }).then(function (response) {
                            console.log(response.data);
                            $scope.consumables.length = 0;
                            angular.extend($scope.consumables, response.data.data);
                        });
                    }
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

        $scope.onSubmit = function (form, add) {
            $scope.$broadcast('schemaFormValidate');

            if (form.$valid) {
                $http({
                    url: 'modifiers/upsert',
                    method: 'POST',
                    headers: {'x-access-token': token},
                    data: {data: $scope.model}
                }).then(function (response) {
                    console.log(response.data);
                    $http({
                        url: 'modifiers/get/all',
                        method: 'GET',
                        headers: {'x-access-token': token}
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.modifiers = response.data.data;
                    });
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

        $scope.onSubmit = function (form, add) {
            $scope.$broadcast('schemaFormValidate');

            if (form.$valid) {
                $http({
                    url: 'sizes/upsert',
                    method: 'POST',
                    headers: {'x-access-token': token},
                    data: {data: $scope.model}
                }).then(function (response) {
                    console.log(response.data);
                    $http({
                        url: 'sizes/get/all',
                        method: 'GET',
                        headers: {'x-access-token': token}
                    }).then(function (response) {
                        console.log(response.data);
                        $scope.sizes = response.data.data;
                    });
                });
            }
        }
    })

    .controller('RecommendationController', function ($scope, Upload) {
        $scope.uploadPic = function (file) {
            file.upload = Upload.upload({
                url: 'recommendations/upload',
                headers: {'x-access-token': token},
                data: {file: file}
            });

            console.log(file);
            file.upload.then(function (response) {
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            });
        }
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
        }])

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
    })

    .directive('stRatio', function () {
        return {
            link: function (scope, element, attr) {
                var ratio = +(attr.stRatio);

                element.css('width', ratio + '%');

            }
        };
    });


function bs_input_file() {
    $(".input-file").before(
        function () {
            if (!$(this).prev().hasClass('input-ghost')) {
                var element = $("<input type='file' class='input-ghost' style='visibility:hidden; height:0'>");
                element.attr("name", $(this).attr("name"));
                element.change(function () {
                    element.next(element).find('input').val((element.val()).split('\\').pop());
                });
                $(this).find("button.btn-choose").click(function () {
                    element.click();
                });
                $(this).find("button.btn-reset").click(function () {
                    element.val(null);
                    $(this).parents(".input-file").find('input').val('');
                });
                $(this).find('input').css("cursor", "pointer");
                $(this).find('input').mousedown(function () {
                    $(this).parents('.input-file').prev().click();
                    return false;
                });
                return element;
            }
        }
    );
}
$(function () {
    bs_input_file();
});