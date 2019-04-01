var Game = require('Game');
cc.Class({
    extends: cc.Component,

    properties: {
        // nodes
        point: cc.Label,
        suit: cc.Sprite,
        mainPic: cc.Sprite,
        cardBG: cc.Sprite,
        // resources
        redTextColor: cc.Color.WHITE,
        blackTextColor: cc.Color.WHITE,
        texFrontBG: cc.SpriteFrame,
        texBackBG: cc.SpriteFrame,
        texFaces: {
            default: [],
            type: cc.SpriteFrame
        },
        texSuitBig: {
            default: [],
            type: cc.SpriteFrame
        },
        texSuitSmall: {
            default: [],
            type: cc.SpriteFrame
        },
        fJ: cc.SpriteFrame,
        tJ: cc.SpriteFrame
    },
    onLoad: function() {


    },
    addListener: function() {

        var _this = this;
        var tap = this.node.getChildByName('tap');
        var node = this.node;
        node.on('touchend', function() {

            var player = Game.instance.playerAnchors[2].getChildByName('playerPrefab').getComponent('Player');
            var ischecked = node.getPositionY();
            if (ischecked) {
                node.setPositionY(0);
                player.pickDownCard(_this.card);
            } else {
                node.setPositionY(20);
                player.pickUpCard(_this.card);
            }

        });
        tap.on('touchmove', function(event) {

            var start = event.getStartLocation().x;
            var end = event.getLocation().x;
            var up = event.getPreviousLocation().x;
            
            if (start > end) {
                var a = start;
                start = end;
                end = a;
            }


            if (end - start > 40) {
                var cards = cc.find('Canvas/playerLayer/anchorPlayer1/playerPrefab/anchorCards').children;
                var player = Game.instance.playerAnchors[2].getChildByName('playerPrefab').getComponent('Player');
                for (var i = 0; i < cards.length; i++) {
                    var xPos = cards[i].getNodeToWorldTransformAR().tx;

                    if (start - 40 <= xPos && xPos <= end) {

                        cards[i].color = {
                            r: 186,
                            g: 186,
                            b: 186,
                            a: 255
                        };

                    } else {
                        cards[i].color = {
                            r: 255,
                            g: 255,
                            b: 255,
                            a: 255
                        };
                    }
                }

            }
        });
        tap.on('touchcancel', function(event) {
           
            var start = event.getStartLocation().x;
            var end = event.getLocation().x;
            if (start > end) {
                var a = start;
                start = end;
                end = a;
            }

            if (end - start > 40) {
                var cards = cc.find('Canvas/playerLayer/anchorPlayer1/playerPrefab/anchorCards').children;
                var player = Game.instance.playerAnchors[2].getChildByName('playerPrefab').getComponent('Player');
                for (var i = 0; i < cards.length; i++) {
                    var xPos = cards[i].getNodeToWorldTransformAR().tx;

                    if (start - 40 <= xPos && xPos <= end) {

                        var ischecked = cards[i].getPositionY();
                        if (ischecked) {
                            cards[i].setPositionY(0);
                            player.pickDownCard(cards[i].getComponent('Card').card);
                            cards[i].color = {
                                r: 255,
                                g: 255,
                                b: 255,
                                a: 255
                            };
                        } else {

                            cards[i].setPositionY(20);
                            player.pickUpCard(cards[i].getComponent('Card').card);
                            cards[i].color = {
                                r: 255,
                                g: 255,
                                b: 255,
                                a: 255
                            };
                        }

                    }
                }
            }

        });
        // if (node.getSiblingIndex() == node.parent.children.length - 1) {
        //     node.getChildByName('tap').width = 100;
        // }
    },
    changeLastTapWidth: function() {
        this.node.getChildByName('tap').width = 150;
    },
    // use this for initialization
    init: function(card) {
        this.card = card;
        var isFaceCard = card.value > 10 && card.value < 14;

        if (isFaceCard) {
            this.mainPic.spriteFrame = this.texFaces[card.value - 10 - 1];
        } else if (card.value == 16) {
            this.mainPic.spriteFrame = this.fJ;
        } else if (card.value == 17) {
            this.mainPic.spriteFrame = this.tJ;
        } else {
            this.mainPic.spriteFrame = this.texSuitBig[card.suit];
        }


        // for jsb
        if (card.value == 16 || card.value == 17) {
            this.point.string = 'J\nO\nK\nE\nR';
        } else {
            this.point.string = card.point;
        }



        if (card.suit % 2 != 0) {
            if (card.value == 16) {
                this.point.node.color = this.blackTextColor;
            } else {
                this.point.node.color = this.redTextColor;
            }

        } else {
            this.point.node.color = this.blackTextColor;
        }

        this.suit.spriteFrame = this.texSuitSmall[card.suit];

    },

    reveal: function(isFaceUp) {
        this.point.node.active = isFaceUp;
        this.suit.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
    },
});