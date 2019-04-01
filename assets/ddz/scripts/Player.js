var Actor = require('Actor');

cc.Class({
    extends: Actor,
    properties: {

        pickUpCards: {
            default: []
        }
    },
    init: function(cards) {
        this.pickUpCards=[];
        this.cards = cards;
    },
    pickUpCard: function(card) {

        this.pickUpCards.push(card);
        for (var i in this.cards) {
            if (this.cards[i].id == card.id) {
                this.cards.splice(i, 1);
            }
        }

    },
    pickDownCard: function(card) {
        this.cards.push(card);
        for (var i in this.pickUpCards) {
            if (this.pickUpCards[i].id == card.id) {
                this.pickUpCards.splice(i, 1);
            }
        }

    },
    canPickOut: function() {
        var res = getType(this.pickUpCards);

        
        if (!res) {
            return {
                canPickOut: false,
                msg: '牌型错误'
            };
        } else {
            res.canPickOut = true;
        }
        if (upperChupaiCards) {
            var result = judge(res, upperChupaiCards);
            console.log(result);

            res.canPickOut = result;
            res.msg=result?'':'不能这样出牌';
        }
        return res;
    },
    insertDizhupai: function(dizhupai) {
        // body...

        var handCard = this.cards;
        var dizhuCards = [];
        for (var i = 0; i < 3; i++) {
            handCard.push(porkStand[dizhupai[i]]);
        }

        handCard.sort(function(a, b) {
            return b.value == a.value?a.id-b.id:b.value-a.value;
        });



        var actorRenderer = this.node.getComponent('ActorRenderer');
        actorRenderer.formatDzCards(handCard);





        // cards[cards.length - 1].getChildByName('tap').width = 60;
        // for (var i = 0; i < dizhuCards.length; i++) {
        //     for (var j = 0; j < handCard.length; j++) {
        //         if (dizhuCards[i].value > handCard[0].value) { //大于最大的牌，放在第一位
        //             actorRenderer.addCard(dizhuCards[i], 0 + i);
        //             break;
        //         } else if (dizhuCards[i].value < handCard[handCard.length - 1].value) {
        //             actorRenderer.addCard(dizhuCards[i], handCard.length + i);
        //             break;
        //         } else if (dizhuCards[i].value == handCard[j].value) {

        //             if (dizhuCards[i].id < handCard[j].id) {
        //                 actorRenderer.addCard(dizhuCards[i], j + i);
        //                 break;
        //             } else {
        //                 actorRenderer.addCard(dizhuCards[i], j + 1 + i);
        //                 break;
        //             }
        //         } else if (handCard[j].value > dizhuCards[i].value && dizhuCards[i].value > handCard[j + 1].value) {

        //             actorRenderer.addCard(dizhuCards[i], j + 1 + i);
        //             break;
        //         }
        //     }
        // }
        // var cards=actorRenderer.anchorCards.children;
        // cards[cards.length - 1].getChildByName('tap').width = 150;
        // for (var i = 0; i < 3; i++) {
        //     handCard.push(porkStand[dizhupai[i]]);
        // }
        this.cards = handCard;
    },
    chupai: function(res) {
        var chupaiCards = this.pickUpCards;

        var msg = {
            'type': 'chupai',
            'chupaiCards': chupaiCards,
            'res': res
        };
        
        DZWS.ob.send(JSON.stringify(msg));

        var inGameUI = cc.find('Game/InGameUI').getComponent('InGameUI');
        var chupai = inGameUI.gameStateUI.getChildByName('chupai');
        chupai.active = false;
    },
    chupaiAuto:function () {
        var cards=this.cards;
        cards.sort(function(a,b) {
            return a.value==b.value?b.id-a.id:a.value-b.value;
        })
       
        var chupaiCards = [cards[0]];
        var res=getType(chupaiCards);
        var msg = {
            'type': 'chupai',
            'chupaiCards': chupaiCards,
            'res': res
        };
        

        DZWS.ob.send(JSON.stringify(msg));
        var game=cc.find('Game').getComponent('Game');
        var ActorRenderer = game.playerAnchors[2].getChildByName('playerPrefab').getComponent('ActorRenderer');
        ActorRenderer.chupaiAutoDeleteCard();
        var inGameUI = cc.find('Game/InGameUI').getComponent('InGameUI');
        var chupai = inGameUI.gameStateUI.getChildByName('chupai');
        chupai.active = false;
    },
    pickSomeCards: function(start, end) {
        // body...

    },
    chupaiToDeleteCards: function(res) {
      
        var cards = res.porks;
        cards.sort(function(a, b) {
            return a.id - b.id
        })
        var nowCards = this.cards;
        
        for (var i in cards) {

            for (var j = 0; j < nowCards.length; j++) {
                if (cards[i].id == nowCards[j].id) {
                    nowCards.splice(j, 1);
                }
            }
        }
        
        this.cards=nowCards;
        this.pickUpCards = [];
    }



});