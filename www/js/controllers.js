angular.module('Android-Ionic-App.controllers', [])

.controller('AppCtrl', function($scope, LocalStorage,Data ) {
    Data.lists[0] =  LocalStorage.getLocalStorageValues("1") || [];
    Data.lists[1] =  LocalStorage.getLocalStorageValues("2") || [];
    Data.lists[2] = LocalStorage.getLocalStorageValues("3")  || [];
    Data.settings = LocalStorage.getLocalStorageValues("settings1") || Data.settings;

})
.controller('AddCtrl', function($scope, Data, $location,LocalStorage) {
    $scope.action = "";
    //add item function using the Data service
    $scope.addItem = function (){
        //using the Data service, identify which list is being used.
        var i = Data.identifyList();
        if($scope.action){
            Data.addItem(Data.lists[i], {title: $scope.action, id: Data.lists[i].length, isChecked: false});
            LocalStorage.setLocalStorageValues(i, Data.lists[i]);
            $scope.action = "";
        }
    }

})

.controller('ListsCtrl', function($scope, Data,  LocalStorage, $cordovaVibration, $cordovaLocalNotification) {
     var i = Data.identifyList();
    $scope.list =  Data.lists[i];
    $scope.listTitle = Data.getListTitle(i);
    console.log(i);

    //save the value of the checkbox in local storage.
    $scope.taskComplete = function($index){
        var i = Data.identifyList();
        LocalStorage.setLocalStorageValues(i, Data.lists[i]);
        //make phone vibrate when task is completed if allowed in settings
        if((Data.settings[0].checked == true) && (Data.lists[i][$index].isChecked == true) ){
           // console.log("phone vibrating");
            // Vibrate 100ms
            $cordovaVibration.vibrate(100);
        }
        //make phone vibrate when task is completed if allowed in settings
        if(Data.settings[1].checked == true){
            var listComplete = true;
            for (var j= 0; j<Data.lists[i].length; j++ ){
               if(Data.lists[i][j].isChecked != true){
                   listComplete = false;
                   break;
               }
            }

            //When list is fully complete send notification if allowed in settings
            if(listComplete == true){
                //console.log("send notification to the user");
                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: 'List Complete',
                    text: $scope.listTitle + " is complete.",
                    data: {
                      customProperty: 'custom value'
                    }
                  });
            }
        }

    }

    //delete items from list and local storage.
    $scope.removeItem = function($index){
         var i = Data.identifyList();
        Data.removeItem(Data.lists[i], $index );
        LocalStorage.setLocalStorageValues(i, Data.lists[i]);
    }

})


.controller('SettingsCtrl', function($scope,Data,LocalStorage) {
    $scope.settings = Data.settings;

    //When we change the toggle in the settings, save the new settings to local storage as well.
    $scope.isChecked = function($index){
        if($scope.settings[0].checked == true){

        console.log("phone vibrating");
        }
        if($scope.settings[1].checked == true){
            console.log("notification");
        }
         LocalStorage.setLocalStorageValues("settings", Data.settings);

     }


});


