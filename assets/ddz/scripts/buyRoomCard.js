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
    },

    // use this for initialization
    onLoad: function() {

    },
    init: function(data) {
        this.data = data;

        var items = cc.find('content', this.node).children;
        for (var i = 0; i < data.length; i++) {

            items[i].getChildByName('text').getComponent('cc.Label').string = 'X' + data[i].num;
            items[i].getChildByName('price').getComponent('cc.Label').string = data[i].price;
        }
    },
    submit: function(event) {
            var _this = this;
            var data = this.data;
            var index = event.target.parent.getSiblingIndex();
            var id = data[index].id;
            ajax(
                urlPrefix + 'prop/prop1006.do',
                'user_id=' + getUserInfo().user_id +
                '&id=' + id +
                userToken(),
                function(res) {
                    var data = JSON.parse(res);
                    if (data.state) {
                        var room = cc.find('Menu/room').getComponent('Room');
                        room.updateDiaAndCard(data.data);

                        var msg = {
                            'type': 'shuxinUserData'
                            
                        };


                        DZWS.ob.send(JSON.stringify(msg));
                    } else {
                        ddztips(data.message);
                    }
                    _this.node.active = false;
                }

            )
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {

    // },
});