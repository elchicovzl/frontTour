(function() {
    'use strict';

    var toastr;
    
    toastr = require('toastr');
    
    module.exports = ['Upload', 'utils.Collection', '$q', 
        function(Upload, Collection, $q) {
            return {
                restrict    : 'A',
                templateUrl : function(elem, attr) {
                    if(typeof attr.type != "undefined" && attr.type == "panos") {
                        return 'public/views/'+attr.folder+'/uploadFilePanos.html';
                    }             
                    return 'public/views/'+attr.folder+'/uploadFile.html';
                },
                scope       : {
                    model: '='
                },
                controller  : function($scope, $attrs) {
                    var fileCollection,
                        modelCollection,
                        url,
                        typeElm,
                        cont,
                        upload;

                    url          = window.api.hostname + "/files";    
                    $scope.model = Array.isArray($scope.model) ? $scope.model : [];
                    $scope.files = [];
                    cont         = 0;

                    $scope.files = $scope.model.map(function(obj) {
                        obj.fileUrl = url + '/' + obj.locationURL;
                        obj.edit = true;
                        return obj;
                    });

                    modelCollection = new Collection($scope.model);
                    fileCollection  = new Collection($scope.files);

                    $scope.hoverIn = function() {
                        this.hoverChange = true;
                    };

                    $scope.hoverOut = function() {
                        this.hoverChange = false;
                    };

                    typeElm = $attrs.type;

                    $scope.uploadd = function($file) {
                        console.log("asdasd");
                    }

                    $scope.upload = function($file) {
                        if(!$file) return;

                        $scope.$parent.$parent.isLoading = true;
                        $scope.$parent.edit      = true;
                        $file.status             = 'uploading';
                        $file.progress           = 0;
                        
                        cont++;

                        fileCollection.add($file);

                        upload = Upload.upload({
                            url  : url,
                            data : {file: $file}
                        });

                        upload.then(function success(response) {
                            $file.status             = 'completed';
                            $file.id                 = response.data.key;
                            $file.typeElm            = typeElm;

                            cont--;

                            if(cont == 0) {
                                $scope.$parent.$parent.isLoading = false;
                            } 

                            modelCollection.add($file);

                        }, function error(response, a) {
                            response.isOverrideHandler = true;

                            cont--;

                            if(cont == 0) {
                                $scope.$parent.$parent.isLoading = false;
                            }

                            toastr.error('There was an error when trying to upload the file', 'Error');

                        }, function onProgress(event) {
                            $file.progress = parseInt(100.0 * event.loaded / event.total);
                        });
                    };

                    $scope.delete = function(file) {
                        upload.abort();

                        fileCollection.removeBy('id', file.id);
                        modelCollection.removeBy('id', file.id);
                    };
                }
            };
        }
    ]
})();