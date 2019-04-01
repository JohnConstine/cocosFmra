
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
       // num:1,
       info:{
            default:null,
            type:cc.Prefab
       },
      
    },

    // use this for initialization
    onLoad: function () {

        
        
        var _this=this;
        var data=this.node.data;
        
        
        this.node.on('touchstart',function(data){

            //var data=gJson('warehouse')[thisindex];
            var info    =cc.instantiate(this.info); 

            //cc.find('index',info).getComponent(cc.Label).string=thisindex;
            cc.find('name',info).getComponent(cc.Label).string=data.product_name;
            cc.find('have/num',info).getComponent(cc.Label).string=cc.find('num',_this.node).getComponent(cc.Label).string.substr(1)+'只';
            cc.find('price/price',info).getComponent(cc.Label).string=data.product_price;
            cc.find('number/num',info).getComponent(cc.Label).string=1;
            cc.find('introduce/intro',info).getComponent(cc.Label).string='介绍:'+data.product_introduce;
            cc.find('total/total',info).getComponent(cc.Label).string=data.product_price;
            cc.find('id',info).getComponent(cc.Label).string=data.product_id;

            info.parent=cc.find('Canvas/fixItem/warehouse/scroll');
            info.active=true;
            
        }.bind(this,data));

      //   var add=cc.find('number/add',info);
      //   var del=cc.find('number/del',info);
      //   var num=cc.find('number/num',info);

      //   add.on('touchstart',function(haveNum){
            
            // this.num++;
            // if(this.num>haveNum) this.num=haveNum;
            // num.getComponent(cc.Label).string=this.num;
      //   }.bind(this,haveNum));

      //   del.on('touchstart',function(){
            // this.num--;
            // if(this.num<1) this.num=1; 
            // num.getComponent(cc.Label).string=this.num;
      //   }.bind(this));

    },
    // consoleNum:function () {
    //     console.log(this.num);
    // }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
});
