    function ajax(url, data, success, asyn) {

        asyn = asyn ? false : true;
        console.log(asyn);
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var res = xhr.responseText;
                success(res);
            }
        };
        xhr.open("POST", url, asyn);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        //xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send(data);
    }

    function getRandomPosition(pos) {
        return cc.p(cc.randomMinus1To1() * pos.x, cc.randomMinus1To1() * pos.y);
    }

    function getCountDays(time) {
        var curDate = new Date();
        /* 获取当前月份 */
        var curMonth = curDate.getMonth();

        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setTime(time);

        curDate.setMonth(curMonth + 1);

        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    }

    function time() {
        var time;
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            console.log(xhr.readyState);
            console.log(xhr.status);
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var res = xhr.responseText;
                var data = JSON.parse(res);
                if (data.state) {
                    time = data.data;

                }
            }

        };
        xhr.open("POST", 'http://'+urlPrefix+'/farm/farm/farm1010.do', false);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        //xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        xhr.send('');


        return time;
    }

    function user() {
        return JSON.parse(cc.sys.localStorage.getItem('allInfo')).userInfo[0];
    }

    function gJson(name) {
        return JSON.parse(cc.sys.localStorage.getItem(name));
    }

    function sJson(name, data) {
        cc.sys.localStorage.setItem(name, JSON.stringify(data));
    }

    function tips(mes) {
        var dialog = cc.find('error');
        cc.find('7/errorMsg', dialog).getComponent(cc.Label).string = mes;
        dialog.active = true;
    }

    function token() {
        return '&user_token=' + gJson('allInfo').userInfo[0].user_token;
    }

    function curGold() {
        return cc.find('Canvas/fixItem/fixLayout/gold/goldLabel').getComponent(cc.Label);
    }

    function randomAnim() {
        var anims = [
            'habitat_eat',
            'habitat_hungry',
            'habitat_hungry_sleep',
            'habitat_hungry_smoke',
            'habitat_idle_fire',
            'habitat_idle_fly', 'habitat_idle_head_down', 'habitat_idle_head_gore', 'habitat_idle_head_shake'
        ];
        return anims[Math.floor(Math.random() * anims.length)];

    }
    module.exports = {
        ajax: ajax,
        getRandomPosition: getRandomPosition,
        getCountDays: getCountDays,
        url: 'http://116.62.41.145:8080/farm/',
        time: time,
        p: [cc.v2(-80, 0), cc.v2(0, 60), cc.v2(80, 0), cc.v2(0, -60)],
        user: user,
        gJson: gJson,
        sJson: sJson,
        tips: tips,
        token: token,
        curGold: curGold,
        randomAnim: randomAnim
    };