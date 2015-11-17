// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('Android-Ionic-App', ['ionic', 'Android-Ionic-App.controllers','Android-Ionic-App.services','LocalStorageModule','ngCordova'])

.run(['$ionicPlatform', function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
   .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
  .state('app.list', {
    url: '/:listId',
    views: {
      'menuContent': {
        templateUrl: 'templates/list.html',
          controller: 'ListsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/homework');
}])
.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('gere0018-Android-Ionic-App');
}]);

angular.module('Android-Ionic-App.controllers', [])

.controller('AppCtrl', ['$scope', 'Data', 'LocalStorage', function($scope,Data, LocalStorage ) {
    Data.lists[0] =  LocalStorage.getLocalStorageValues("1") || [];
    Data.lists[1] =  LocalStorage.getLocalStorageValues("2") || [];
    Data.lists[2] = LocalStorage.getLocalStorageValues("3")  || [];
    Data.settings = LocalStorage.getLocalStorageValues("settings1") || Data.settings;

}])
.controller('AddCtrl', ['$scope', 'Data', '$location', 'LocalStorage',function($scope, Data, $location,LocalStorage) {
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
    };

}])

.controller('ListsCtrl', ['$scope', 'Data', 'LocalStorage', '$cordovaVibration', '$cordovaLocalNotification', function($scope, Data,  LocalStorage, $cordovaVibration, $cordovaLocalNotification) {
     var i = Data.identifyList();
    $scope.list =  Data.lists[i];
    $scope.listTitle = Data.getListTitle(i);
    console.log(i);

    //save the value of the checkbox in local storage.
    $scope.taskComplete = function($index){
        var i = Data.identifyList();
        LocalStorage.setLocalStorageValues(i, Data.lists[i]);
        //make phone vibrate when task is completed if allowed in settings
        if((Data.settings[0].checked === true) && (Data.lists[i][$index].isChecked === true) ){
           // console.log("phone vibrating");
            // Vibrate 100ms
            $cordovaVibration.vibrate(100);
        }
        //make phone vibrate when task is completed if allowed in settings
        if(Data.settings[1].checked === true){
            var listComplete = true;
            for (var j= 0; j<Data.lists[i].length; j++ ){
               if(Data.lists[i][j].isChecked !== true){
                   listComplete = false;
                   break;
               }
            }

            //When list is fully complete send notification if allowed in settings
            if(listComplete === true){
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

    };

    //delete items from list and local storage.
    $scope.removeItem = function($index){
         var i = Data.identifyList();
        Data.removeItem(Data.lists[i], $index );
        LocalStorage.setLocalStorageValues(i, Data.lists[i]);
    };

}])


.controller('SettingsCtrl',['$scope', 'Data', 'LocalStorage', function($scope,Data,LocalStorage) {
    $scope.settings = Data.settings;

    //When we change the toggle in the settings, save the new settings to local storage as well.
    $scope.isChecked = function(){
        if($scope.settings[0].checked === true){

        console.log("phone vibrating");
        }
        if($scope.settings[1].checked === true){
            console.log("notification");
        }
         LocalStorage.setLocalStorageValues("settings", Data.settings);

     };


}]);



angular.module('Android-Ionic-App.services', [])
.factory('Data', ['$location', function DataFactory($location) {
    var reminders = [];
    var homework = [];
    var work = [];
    var settings = [
        { text: "Vibrate on item complete", checked: false },
        { text: "Notify when list completed", checked: false }
      ];
    var lists = [homework, work,reminders];
    var i;
  return {
      settings: settings,
      lists: lists,
      identifyList: function(){
          if($location.path()=="/app/homework"){
                i = 0;
            }
            if($location.path()=="/app/work"){
                i = 1;
            }
            if($location.path()=="/app/reminders"){
                i = 2;
            }
          return i;
      },
      getListTitle: function(i){
          var listTitle = "";
                if(i === 0){
                    listTitle = "Homework";
                }
                if(i === 1){
                    listTitle = "Work";
                }
                if(i === 2){
                    listTitle = "Reminders";
                }
          return listTitle;

      },
      addItem: function(whichList, item){
        whichList.push(item);
      },
      removeItem: function (whichList, index) {
        whichList.splice(index, 1);
      }

  };


}])
.factory('LocalStorage',['localStorageService', function LocalStorageFactory(localStorageService) {
     return {
      getLocalStorageValues: function(key){
          return localStorageService.get(key);
      },
      setLocalStorageValues: function(listsIndex, whichList){
          localStorageService.set(listsIndex + 1, whichList);
      }
    };


}]);

