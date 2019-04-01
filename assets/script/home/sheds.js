


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
        jsonPrefab:{
            default:null,
            type:cc.Prefab,
        },
        animalPrefab:{
            default:null,
            type:sp.SkeletonData,
        },
       
    },

    // use this for initialization
    onLoad: function () {
         
         this.randomRange = cc.p(100, 100);
         var node=this.node; 
         var animalPrefab=this.jsonPrefab;
         var spineList=this.animalPrefab;
         var animalJsons;
         var shedid=node.name.substring(4);
         var animalInfo=JSON.parse(cc.sys.localStorage.getItem('animalInfoIsNull'))[shedid];
         var _this=this;
         
         var demo=this.demo;
      
          ajax('http://120.77.51.98:8080/farm/farm/farm1010.do','',
                    function(res){
                         var data=JSON.parse(res);
                         
                     if(data.state){
                       var j = 0;   
                       var sysTime = data.data;
                         
                        for(var i=0;i<animalInfo.length;i++){
                         var animalJson = cc.instantiate(animalPrefab);
                         var create_date=animalInfo[i].create_date;
                         var animal_protime=animalInfo[i].animal_protime;
                         animalJson.getComponent(sp.Skeleton).skeletonData=spineList;
                         animalJson.position =common.getRandomPosition(cc.p(100,100));
                         
                         var label=animalJson.getChildByName('time').getComponent(cc.Label);
                          
                         var interval = 1;
                         // 重复次数
                         var repeat = animal_protime*3600;
                         // 开始延时
                         var delay = 0;
                         
                         var schetime=(create_date+ animal_protime*3600*1000-sysTime)/1000;
                         var length = animalInfo.length;
                         var demo1=demo.bind({},create_date,node,animal_protime,label,animalJson,schetime);
                         setInterval(demo1,1000);
                        }
                      }
         });          
  
    },
    demo:function(create_date,node,animal_protime,label,animalJson,schetime) {
                
               
                console.log(schetime);
               
               
                var hours = Math.floor(schetime / (3600));
        		var minutes = Math.floor(schetime / (60)) - (hours * 60);
        		var second = Math.floor(schetime)  - (hours * 60 * 60) - (minutes * 60);
                 label.string= hours+'h'+minutes+'min'+second+'s';
                 animalJson.parent=node;
             
                
               
                  
    },
   
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});
