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
		diamond: {
			default: null,
			type: cc.Node
		},
		gold: {
			default: null,
			type: cc.Node
		},
		diamondToMoney: { //钻石兑换金币
			default: null,
			type: cc.Node
		},
		buyDiamond: { //购买钻石
			default: null,
			type: cc.Node
		},
		whoOpen: cc.Node,
		diaOpen: cc.Node,
		zhongjiang: cc.Node,
		goldOpen: cc.Node,
		Choose: cc.Node,
		zs1: cc.Node,
		jb1: cc.Node,
		diaOpen1:cc.Node,
		goldOpen1:cc.Node
	},

	// use this for initialization
	onLoad: function() {
		cc.director.preloadScene('home');
		var gold = gJson('allInfo').farmInfo[0].gold;
		var dia = gJson('allInfo').farmInfo[0].diamond;
		gold = gold.toString().length < 2 ? '0' + gold : gold;
		dia = dia.toString().length < 2 ? '0' + dia : dia;

		cc.find('Canvas/fixItem/fixLayout/gold/goldLabel').getComponent('cc.Label').string = gold;
		cc.find('Canvas/fixItem/fixLayout/diamond/diamondLabel').getComponent('cc.Label').string = dia;
		cc.find('Canvas/fixItem/prompt').active = true;
	},
	showDiamond: function() {
		// body...
		this.diamond.active = true;
		this.Choose.active = false;
	},
	showGold: function() {
		// body...
		this.gold.active = true;
		this.Choose.active = false;
	},
	hideDiamond: function() {
		this.diamond.active = false;
	},
	hideGold: function() {
		this.gold.active = false;
	},
	ShowdiamondToMoney: function() {
		this.diamondToMoney.active = true;
	},
	ShowbuyDiamond: function() {
		this.buyDiamond.active = true;
	},
	HidediamondToMoney: function() {
		this.diamondToMoney.active = false;

	},
	HidebuyDiamond: function() {
		this.buyDiamond.active = false;
	},
	ShowwhoOpen: function() {
		this.whoOpen.active = true;
	},
	HidewhoOpen: function() {
		this.whoOpen.active = false;
	},
	ShowdiaOpen: function() {
		this.diaOpen.active = true;
	},
	HidediaOpen: function() {
		this.diaOpen.active = false;
	},
	ShowgoldOpen: function() {
		this.goldOpen.active = true;
	},
	HidegoldOpen: function() {
		this.goldOpen.active = false;
	},
	Showzhongjiang: function() {
		this.zhongjiang.active = true;
	},
	Hidezhongjiang: function() {
		this.zhongjiang.active = false;
	},
	ShowChoose: function() {
		this.Choose.active = true;
	},
	HideChoose: function() {
		this.Choose.active = false;
	},
	Showzs1: function() {
		this.zs1.active = true;
		this.Choose.active = false;
	},
	Hidezs1: function() {
		this.zs1.active = false;
	},
	Showjb1: function() {
		this.jb1.active = true;
		this.Choose.active = false;
	},
	Hidejb1: function() {
		this.jb1.active = false;
	},
	ShowgoldOpen1: function() {
		this.goldOpen1.active = true;
		this.Choose.active = false;
	},
	HidegoldOpen1: function() {
		this.goldOpen1.active = false;
	},
	ShowdiaOpen1: function() {
		this.diaOpen1.active = true;
		this.Choose.active = false;
	},
	HidediaOpen1: function() {
		this.diaOpen1.active = false;
	},
	goHome: function() {
		cc.find('loading').active=true;
		cc.director.loadScene('home');
	},
	goDdz:function () {
		cc.find('loading').active=true;
		cc.director.loadScene('/ddz/scenes/menu');
	}

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
});