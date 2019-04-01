
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        btn:{
            default:null,
            type:cc.Node
        },
        level:0
    },

    // use this for initialization
    onLoad: function () {
         //this.getAnimalList();
        this.getFriends();
        
    },
    getAnimalList:function(){
        var level=this.level;
        var xhr = new XMLHttpRequest();
        
         xhr.onreadystatechange = function () {
             if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                 var response =JSON.parse(xhr.responseText);
                 console.log(response.data);
             }
         };
         xhr.open("POST", 'http://www.tiahe.ren/animal/animal1001.do', true);
         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
         //xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
         xhr.send('level='+level);
    },
    buyAnimal:function(user_id,animal_id,animal_num,order_total,animal_code){
        var xhr = new XMLHttpRequest();
        
         xhr.onreadystatechange = function () {
             if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                 var response =JSON.parse(xhr.responseText);
                 console.log(response.data);
             }
         };
         xhr.open("POST", 'http://www.tiahe.ren/animal/animal1002.do', true);
         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        
         xhr.send( 'user_id='+user_id+'&animal_id='+animal_id+'&animal_num='
         +animal_num+'&order_total='+order_total+'&animal_code='+animal_code );
    },
    getMyAnimals:function(){
        var user_id=47212961;
        
        var xhr = new XMLHttpRequest();
        
         xhr.onreadystatechange = function () {
             if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                 var response =JSON.parse(xhr.responseText);
                 console.log(response);
             }
         };
         xhr.open("POST", 'http://www.tiahe.ren/animal/animal1003.do', true);
         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        
         xhr.send( 'user_id='+user_id);
    },
    getWarehouse:function(){
        var user_id=47212961;
        
        var xhr = new XMLHttpRequest();
        
         xhr.onreadystatechange = function () {
             if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                 var response =JSON.parse(xhr.responseText);
                 console.log(response);
             }
         };
         xhr.open("POST", 'http://www.tiahe.ren/warehouse/warehouse1001.do', true);
         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        
         xhr.send( 'user_id='+user_id);
    },
    getFriends:function(){
        var user_id=80339492;
        
        var xhr = new XMLHttpRequest();
        
         xhr.onreadystatechange = function () {
             if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                 var response =JSON.parse(xhr.responseText);
                 console.log(response);
             }
         };
         xhr.open("POST", 'http://www.tiahe.ren/user/user1003.do', true);
         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        
         xhr.send( 'user_id='+user_id);
    },
    
    

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
