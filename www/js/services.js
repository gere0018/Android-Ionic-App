angular.module('Android-Ionic-App.services', [])
.factory('Data', function DataFactory($location) {
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
                if(i == 0){
                    listTitle = "Homework";
                }
                if(i == 1){
                    listTitle = "Work";
                }
                if(i == 2){
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

  }


})
.factory('LocalStorage', function LocalStorageFactory(localStorageService) {
     return {
      getLocalStorageValues: function(key){
          return localStorageService.get(key);
      },
      setLocalStorageValues: function(listsIndex, whichList){
          localStorageService.set(listsIndex + 1, whichList);
      }
    }


});

