// cc.Class({
//     extends: cc.Component,

//     properties: {

//     },

//     // use this for initialization
//     onLoad: function() {
//         // var agent = anysdk.agentManager;
//         // var share_plugin = agent.getSharePlugin();
//         // share_plugin.setListener(this.onShareResult, this);
//     },
//     onShareResult: function(code, msg) {
//         cc.log("share result, resultcode:" + code + ", msg: " + msg);
//         var panel = cc.find('Canvas/uiLayer/panelSocial');
//         switch (code) {
//             case anysdk.ShareResultCode.kShareSuccess:
//                 panel.active = true;
//                 panel.getChildByName('text').getComponent('cc.Label').string = 1 + msg;
//                 break;
//             case anysdk.ShareResultCode.kShareFail:
//                 panel.active = true;
//                 panel.getChildByName('text').getComponent('cc.Label').string = 2 + msg;
//                 break;
//             case anysdk.ShareResultCode.kShareCancel:
//                 panel.active = true;
//                 panel.getChildByName('text').getComponent('cc.Label').string = 3 + msg;
//                 break;
//             case anysdk.ShareResultCode.kShareNetworkError:
//                 panel.active = true;
//                 panel.getChildByName('text').getComponent('cc.Label').string = 4 + msg;
//                 break;
//         }
//     },
//     shareToQuan: function() {
//         var info = {
//             title: "快来跟我玩一把斗地主", // title 标题，印象笔记、邮箱、信息、微信、人人网和 QQ 空间使用
//             imagePath: "/sdcard/test.png", // imagePath 是图片的本地路径，Linked-In 以外的平台都支持此参数
//             url: "http://sharesdk.cn", // url 仅在微信（包括好友和朋友圈）中使用

//             text: "ShareSDK 集成了简单、支持如微信、新浪微博、腾讯微博等社交平台", // text 是分享文本，所有平台都需要这个字段
//             mediaType: 0,
//             shareTo: 0,
//         }
//         var agent = anysdk.agentManager;
//         var share_plugin = agent.getSharePlugin();
//         share_plugin.share(info)
//     },
//     shareToFriend: function() {
//         var info = {
//             title: "快来跟我玩一把斗地主", // title 标题，印象笔记、邮箱、信息、微信、人人网和 QQ 空间使用
//             imagePath: "/sdcard/test.png", // imagePath 是图片的本地路径，Linked-In 以外的平台都支持此参数
//             url: "http://sharesdk.cn", // url 仅在微信（包括好友和朋友圈）中使用

//             text: "ShareSDK 集成了简单、支持如微信、新浪微博、腾讯微博等社交平台", // text 是分享文本，所有平台都需要这个字段
//             mediaType: 0,
//             shareTo: 0,
//         }
//         var agent = anysdk.agentManager;
//         var share_plugin = agent.getSharePlugin();
//         share_plugin.share(info)
//     },
//     toShare: function() {
//         var info = {
//             title: "快来跟我玩一把斗地主", // title 标题，印象笔记、邮箱、信息、微信、人人网和 QQ 空间使用
//             imagePath: "/sdcard/test.png", // imagePath 是图片的本地路径，Linked-In 以外的平台都支持此参数
//             url: "http://sharesdk.cn", // url 仅在微信（包括好友和朋友圈）中使用

//             text: "ShareSDK 集成了简单、支持如微信、新浪微博、腾讯微博等社交平台", // text 是分享文本，所有平台都需要这个字段
//             mediaType: 0,
//             shareTo: 0,
//         }
//         var agent = anysdk.agentManager;
//         var share_plugin = agent.getSharePlugin();
//         share_plugin.share(info)

//     }

//     // called every frame, uncomment this function to activate update callback
//     // update: function (dt) {

//     // },
// });