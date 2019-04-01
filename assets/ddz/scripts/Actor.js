var Types = require('Types');
var Utils = require('Utils');
var ActorPlayingState = Types.ActorPlayingState;

cc.Class({
    extends: cc.Component,

    properties: {
        // 所有明牌
        cards: {
            default: []
            
        },
       
    
        renderer: {
            default: null,
            type: cc.Node
        },
      
    },

    init: function () {
        this.ready = true;
        this.renderer = this.getComponent('ActorRenderer');
    },

    addCard: function (card) {
        this.cards.push(card);
        this.renderer.onDeal(card, true);

        var cards = this.holeCard ? [this.holeCard].concat(this.cards) : this.cards;
        if (Utils.isBust(cards)) {
            this.state = ActorPlayingState.Bust;
        }
    },

   

    stand: function () {
        this.state = ActorPlayingState.Stand;
    },

    revealHoldCard: function () {
        if (this.holeCard) {
            this.cards.unshift(this.holeCard);
            this.holeCard = null;
            this.renderer.onRevealHoldCard();
        }
    },

    // revealNormalCard: function() {
    //     this.onRevealNormalCard();
    // },

    report: function () {
        this.state = ActorPlayingState.Report;
    },

    reset: function () {
        this.cards = [];
        this.holeCard = null;
        this.reported = false;
        this.state = ActorPlayingState.Normal;
        this.renderer.onReset();
    }
});
