/**
 * Created by 16288 on 2019/5/11.
 */
// cookie.js
/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/js-cookie@2.2.1/src/js.cookie.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */

/*! jquery.cookie v1.4.1 | MIT */
!function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? a(require("jquery")) : a(jQuery)
}(function (a) {
    function b(a) {
        return h.raw ? a : encodeURIComponent(a)
    }

    function c(a) {
        return h.raw ? a : decodeURIComponent(a)
    }

    function d(a) {
        return b(h.json ? JSON.stringify(a) : String(a))
    }

    function e(a) {
        0 === a.indexOf('"') && (a = a.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return a = decodeURIComponent(a.replace(g, " ")), h.json ? JSON.parse(a) : a
        } catch (b) {
        }
    }

    function f(b, c) {
        var d = h.raw ? b : e(b);
        return a.isFunction(c) ? c(d) : d
    }

    var g = /\+/g, h = a.cookie = function (e, g, i) {
        if (void 0 !== g && !a.isFunction(g)) {
            if (i = a.extend({}, h.defaults, i), "number" == typeof i.expires) {
                var j = i.expires, k = i.expires = new Date;
                k.setTime(+k + 864e5 * j)
            }
            return document.cookie = [b(e), "=", d(g), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("")
        }
        for (var l = e ? void 0 : {}, m = document.cookie ? document.cookie.split("; ") : [], n = 0, o = m.length; o > n; n++) {
            var p = m[n].split("="), q = c(p.shift()), r = p.join("=");
            if (e && e === q) {
                l = f(r, g);
                break
            }
            e || void 0 === (r = f(r)) || (l[q] = r)
        }
        return l
    };
    h.defaults = {}, a.removeCookie = function (b, c) {
        return void 0 === a.cookie(b) ? !1 : (a.cookie(b, "", a.extend({}, c, {expires: -1})), !a.cookie(b))
    }
});


//全局变量
// var localHost = 'http://47.106.140.239:5000'; //服务器数据地址
//var localHost = 'http://120.78.163.106:5000'; //服务器数据地址
var localHost = 'http://127.0.0.1:5000'; //服务器数据地址
// var localHost2 = 'http://47.106.140.239:8080'; //服务器主机地址
var localHost2 = 'http://47.92.138.195:8081'; //服务器主机地址
var Permission = getCookie('Permission'); //获取用户权限 []
var LayerOpen;   //开启新页面，用于关闭窗口
var LayerConfirm;   //开启新页面，用于关闭窗口
var Page = 1;
var PageSize = 10;


//定义弹出框
function Alert(msg) {
    window.top.layer.alert(msg,
        {
            skin: 'layui-layer-molv' //样式类名
        });
}

//定义弹出框
function Confirm(msg, cb, cbErr) {
    LayerConfirm = window.top.layer.confirm(msg, {
        skin: 'layui-layer-molv',
        btn: ['确定', '取消']
    }, cb, cbErr);
}

//加载页面
function Open(tit, area, url) {
    LayerOpen = window.layer.open(
        {
            title: tit,
            type: url ? 2 : 1,
            shadeClose: true,
            closeBtn: 1,
            anim: 2,
            maxmin: true,
            skin: 'layui-layer-molv',
            area: area || ['50%', '50%'],
            content: url || $('#add-cont').html()
        }
    )
}

//请求方法
function Ajax(url, type, data, cb, cbErr, formData) {
    var obj = {
        url: localHost + url,
        type: type,
        data: data,
        dataType: 'json',
        /* contentType:'x-www-form-urlencoded',*/
        headers: {'Access-Control-Allow-Origin': '*'},
        xhrFields: {withCredentials: true},
        success: function (data) {
            //console.log(data);
            if (!data.code) {
                cb(data)
            } else if (data.code == 50009) {
                Confirm('登陆超时！！', function () {
                    window.top.location.href = localHost2 + '/html/login.html'
                })
            } else {
                data.msg && Alert(data.msg);
                cbErr && cbErr()
            }
        },
    };
    if (formData) {
        obj.contentType = false;
        obj.mimeType = "multipart/form-data";
        obj.processData = false;
    }
    $.ajax(obj)
}

//请求方法
function SyncAjax(url, type, data, cb, cbErr, formData, async) {
    var obj = {
        url: localHost + url,
        type: type,
        sync: async,
        data: data,
        dataType: 'json',
        /* contentType:'x-www-form-urlencoded',*/
        headers: {'Access-Control-Allow-Origin': '*'},
        xhrFields: {withCredentials: true},
        success: function (data) {
            console.log(data);
            if (!data.code) {
                cb(data)
            } else if (data.code == 50009) {
                Confirm('登陆超时！！', function () {
                    window.top.location.href = localHost2 + '/html/login.html'
                })
            } else {
                data.msg && Alert(data.msg);
                cbErr && cbErr()
            }
        }
    };
    if (formData) {
        obj.contentType = false;
        obj.mimeType = "multipart/form-data";
        obj.processData = false;
    }
    $.ajax(obj)
}

function strUrlparams(data) {
    var str = '';
    for (var i in data) {
        str += i + '=' + data[i] + '&';
    }
    return str
}

//table
function showTable(node, url, method, pyKey, columns, cb) {
    var obj = {
        url: localHost + url,
        method: method,
        ajaxOptions: {
            xhrFields: { //跨域
                withCredentials: true
            },
            crossDomain: true
        },
        idField: pyKey,
        striped: true,
        dataField: "data",
        pagination: true,
        queryParams: queryParams,
        pageNumber: 1,
        pageSize: 10,
        sidePagination: "server",
        pageList: [10, 25, 50, 100, 1000],
        responseHandler: responseHandler,
        columns: columns,
    };
    if (cb) {
        obj.onLoadSuccess = cb
    }
    $(node).bootstrapTable('destroy').bootstrapTable(obj)
}

function responseHandler(ret) {
    if (typeof ret === 'string') ret = JSON.parse(ret);
    if (ret.code == 0) {
        if (ret.total) {
            return {
                total: ret.total,
                data: ret.result
            };
        } else {
            return {
                data: ret.result
            };
        }
    } else {
        Alert('后台出现错误');
    }
};

//设置选择地区方法
function SelcetArea(cb) {
    Ajax('/area/province/0', 'get', null, function (ret) {
        SelectBox('province', ret.province_list, 'ID', 'Name');
    });
    $('#province').change(function () {
        var provinceId = $('#province').val();
        if (provinceId != '0') {
            $('#city').empty();
            $('#district').empty();
            Ajax('/area/city/' + provinceId, 'get', null, function (ret) {
                SelectBox('city', ret.city_list, 'ID', 'Name');
            });
        } else {
            $('#city').empty();
            $('#district').empty();
            Alert('请选择先选择省份')
        }
    });
    $('#city').change(function () {
        var cityId = $(this).val();
        if (cityId != '0') {
            $('#district').empty();
            Ajax('/area/district/' + cityId, 'get', null, function (ret) {
                SelectBox('district', ret.distict_list, 'ID', 'Name');
            });
        } else {
            $('#district').empty();
            Alert('请选择先选择市')
        }
    })
}

//获取区域方法
function getArea() {
    var district = parseInt($('#district').val());
    var city = parseInt($('#city').val());
    var province = parseInt($('#province').val());
    if (district) {
        return district;
    } else if (city) {
        return city;
    } else if (province) {
        return province;
    }
}

//多选框赋值
function SelectBox(boxId, arr, valId, Name, str) {
    var optionstring = '';
    var nodePar = $("#" + boxId);
    if (boxId == 'province') {
        optionstring = '<option value="0">选择省..</option>';
    } else if (boxId == 'city') {
        optionstring = '<option value="0">选择市..</option>';
    } else if (boxId == 'district') {
        optionstring = '<option value="0">选择区..</option>';
    } else {
        optionstring = '<option value="0">' + (str || '请选择..') + '</option>';
    }
    if (arr) {
        $.each(arr, function (key, value) {
            if (value[valId] == null) {
                return true
            }
            optionstring += "<option value='" + value[valId] + "'>" + value[Name] + "</option>";
        });
    }
    nodePar.html(optionstring);
}

function SelectBox2(node, arr, valId, Name) {
    if (arr) {
        var optionstring = '<option value="0">请选择..</option>';
        $.each(arr, function (key, value) {
            var temp = value[Name]
            if (value[Name].length > 20) {
                temp = value[Name].substring(0, 22) + '...'
            }
            optionstring += "<option value=\"" + value[valId] + "\" >" + temp + "</option>";
        });
        node.html(optionstring);
    }
}

//获取input,select 的val
function GetFormVal(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = $('#' + arr[i]).val()
    }
    return obj
}

//设置input,select 的val
function SetFormVal(obj) {
    for (var i in obj) {
        $('#' + i).val(obj[i])
    }
}

// 获取图片分组
function SetGroup(arr) {
    var html = '';
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            html += '<li><a href="javascript:void(0)" attrId=' + arr[i].ID + '  Purl=' + arr[i].Purl + '>' + arr[i].Name + '</a></li>'
        }
    }
    return html;
}

function SetShowGroup(arr) {
    var html = '';
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].Purl && arr[i].Purl.length > 0) {
                html += '<li><input type="checkbox" style="position: absolute;top: 4px;left: 5px;"/>' +
                    '<a href="javascript:void(0)" Purl=' + arr[i].Purl + ' attrId=' + arr[i].ID + ' >' + arr[i].Name + '</a></li>'
            } else {
                html += '<li><input type="checkbox" style="position: absolute;top: 4px;left: 5px;"/>' +
                    '<a href="javascript:void(0)" attrId=' + arr[i].ID + '  Purl=' + arr[i].Purl + ' >' + arr[i].Name + '</a></li>'
            }
        }
    }
    return html;
}

//分组图片上传
function getFormData(node) {
    var fileObj = node.files;
    var formFile = new FormData();
    for (var i = 0; i < fileObj.length; i++) {
        formFile.append("file", fileObj[i]);
    }
    return formFile;
}

//上传并回显图片名字
function getFormDataOne(node) {
    var fileObj = node.files;
    var span = $(node).parents('.btn-group').prev('span');

    for (var i = 0; i < fileObj.length; i++) {
        span.html(fileObj[i].name);
    }
}


//获取上传图片
function uploadMore(node, formData) {
    var fileObj = document.getElementById(node).files;
    // console.log(fileObj);
    for (var i = 0; i < fileObj.length; i++) {
        formData.append(node + '[]', fileObj[i]);
    }
    return formData
}

function uploadFileChk(node){
    var fileObj = document.getElementById(node).files;
    if (fileObj.length>0) {
        return '1'
    }
    return ''
}


//获取url参数
String.prototype.getQueryString = function (name) {
    var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)");
    var r = this.match(reg);
    if (r) {
        return decodeURIComponent(r[2]);
    }
    return null;
};

//企业分页
function myPage(rettotal) {
    var total = rettotal % PageSize;
    var pageTotal = (total == 0) ? (rettotal / PageSize) : (parseInt(rettotal / PageSize) + 1);
    var ss = new Pagess({
        id: 'pagination',
        pageTotal: pageTotal, //必填,总页数
        pageAmount: PageSize,  //每页多少条
        dataTotal: rettotal, //总共多少条数据
        curPage: Page, //初始页码,不填默认为1
        pageSize: 5, //分页个数,不填默认为5
        showPageTotalFlag: true, //是否显示数据统计,不填默认不显示
        showSkipInputFlag: true, //是否支持跳转,不填默认不显示
        getPage: function (page) {
            Page = page;
        }
    });
    $('#pageSize').val(PageSize);
    $('#pagination li:not(".totalPage")').on('click', function () {
        var type = $(this).html();
        if (type == '首页') {
            Page = 1;
        } else if (type == '尾页') {
            Page = pageTotal;
        }
        search();
    });
    $('#pageSize').on('change', function (event) {
        PageSize = $(this).val();
        Page = 1;
        search()
    })
}


//权限设置
function setRoot() {
    if (Permission) {
        var myRoot = JSON.parse(Permission);
        for (var i = 0; i < myRoot.length; i++) {
            var menubtn = $('[menubtn=' + myRoot[i] + ']');
            if (menubtn.length > 0) {
                menubtn.css('display', 'block');
            }
        }
    }
}

//输入验证
function CheckLength(formdata) {
    var alert_list = [];
    $('input[type="text"]').each(function () {
        var $this = $(this);
        if ($this.val().length > 30) {
            var temp_str = $this.parents('.form-group').children('.control-label').text();
            alert_list.push(temp_str.substring(1, temp_str.length - 1))
        }
    });
    if (alert_list.length > 1) {
        var alert_str = '';
        $.each(alert_list, function (i, val) {
            if (i < alert_list.length - 1) {
                alert_str += val + ','
            } else {
                alert_str += val + ' 长度不能超过30个字符'
            }
        });
        return [true, alert_str]
    }
    return [false, '']
}

function CheckCard(_this) {
    var code = _this.value
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    }
    else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    if (!pass) Alert(tip);
    // return pass;
}

function CheckPhone(_this) {
    var code = _this.value
    var tip = "";
    var pass = true;
    if (!code || !/(\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/i.test(code)) {
        tip = "手机号码错误";
        pass = false;
    }
    if (!pass) Alert(tip);
}

function CheckNumber(_this) {
    var code = _this.value
    var tip = "";
    var pass = true;
    if (!code || !/^[0-9]+([.]{1}[0-9]+){0,1}$/i.test(code)) {
        tip = "请输入数字";
        pass = false;
    }
    if (!pass) {
        _this.value = ''
        Alert(tip);
    }
}

//添加tab导航和frame页面
function addTabs(url, name) {
    var windowTop = window.top;
    var titleName = name;  //实际显示标题;
    var infoName = name;   //移入显示的标题信息
    var tabId = '';
    var iframeId = '';
    var arr = [];

    if (name.length > 4) {
        titleName = name.substring(0, 6);
    }
    if (url.indexOf('imgTab.html') > 0) {
        tabId = 'imgTab';
    } else if (url.indexOf('?') > 0) {
        tabId = url.replace(/^\..\//, '').replace(/\.[a-z]+\?/g, '').replace(/[\/|=]/g, '-').replace(/\&.+/g, '').replace(/^html-/, '');
    } else {
        tabId = url.replace('../html/', '').replace(/[\/|=]/g, '-').replace('.html', '');
    }

    iframeId = 'iframeId-' + tabId;

    //所有已存在的id 数组
    windowTop.$('#tabBox a').each(function (i, ele) {
        var $this = $(this);
        var id = $this.attr('id');
        arr.push(id);
    });

    if (arr.indexOf(tabId) < 0) {
        windowTop.$('#tabBox').append('<a id="' + tabId + '" title="' + infoName + '">' + titleName + '<i class="fa fa-times-circle tabs-close"></i></a>');
        windowTop.$('#' + tabId).addClass('active').siblings().removeClass('active');
        windowTop.createFrame(url, iframeId);
        windowTop.$('#' + iframeId).show().siblings().hide();
    } else {

        var $tabId = windowTop.$('#' + tabId);
        var $iframeId = windowTop.$('#' + iframeId);
        if (!tabId == 'home') $tabId.html(titleName + '<i class="fa fa-times-circle tabs-close"></i>').attr('title', infoName);
        $tabId.addClass('active').siblings().removeClass('active');
        $iframeId.attr('src', url);
        $iframeId.show().siblings().hide();
    }
    windowTop.tabsChange();
    windowTop.removeTab();
}

function createFrame(url, frameId, cb) {
    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.id = frameId;
    iframe.height = '100%';
    iframe.width = '100%';
    $('#content-main').append(iframe);
    if (cb) cb();
}

function tabsChange() {
    $('#tabBox a').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var frameId = 'iframeId-' + $this.attr('id');
        $this.addClass('active').siblings().removeClass('active');
        $('#' + frameId).show().siblings().hide();
    });
}

function removeTab(tabId) {
    if (tabId) {
        var windowTop = window.top;
        var tab = windowTop.$('#' + tabId);
        var frame = windowTop.$('#iframeId-' + tabId);
        tab.remove();
        frame.remove();
    } else {
        $('#tabBox a .fa').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var tab = $(this).parent('a');
            var tabId = tab.attr('id');
            var frame = $('#iframeId-' + tabId);
            tab.prev().addClass('active');
            tab.remove();
            frame.prev().show();
            frame.remove();
        });
    }
}


//查看图片
function showImg(src, arr, index) {
    var items;
    if (arr && arr.length > 0) {
        if (typeof arr == 'string') {
            arr = JSON.parse(arr)
        }
        items = arr
    } else {
        items = [
            {
                src: src,
            },
        ];
    }
    var scrollTop = $(document).scrollTop();
    var options = {
        index: index || 0, // 此选项表示您将从第一张图片开始
        scrollTop: $(document).scrollTop()
    };

    var viewer = new PhotoViewer(items, options);
    $(".photoviewer-button-close").click(function () {
        $(document).scrollTop(scrollTop)
    })
}

//查看view页面的分组图片
function showGroup($this) {
    var groups = $this.parents('ul');
    var index = $this.parent('li').index();
    var aLink = groups.find('a');
    var groupArr = [];
    for (var i = 0; i < aLink.length; i++) {
        var src = aLink.eq(i).attr('purl');
        groupArr.push({
            src: localHost + src,
        })
    }
    showImg('', groupArr, index)
}

//查看编辑新建页面的分组图片
function openImg(_this) {
    var oParents = $(_this).parents('.input-group');
    var GtypeImgId = oParents.find('#GtypeImgId');
    var $this = null;
    if (GtypeImgId.val().length > 0) {
        $this = oParents.find('a[attrid="' + GtypeImgId.val() + '"]');
    } else {
        $this = oParents.find('a').eq(0)
    }
    if ($this && $this.length > 0) {
        showGroup($this)
    } else {
        Alert('请选择分组，或者上传图片！！')
    }
}


//图片查看回显
function showImgInfo(node, srcs) {
    if (srcs && srcs.length > 0) {
        node.html('<img src="' + localHost + srcs + '" onclick=showImg(this.src) style="width: 100px;height: 100px">')
    }
}

//返回缩略图url
function getMinImage(url) {
    var imgSrcArr = url.split('.');
    var imgName = imgSrcArr[0];
    var imgType = imgSrcArr[1];
    var min_image = imgName + '_min' + '.' + imgType;
    return min_image
}

//企业上传显示图片
function showMoreImg(data, id, remove) {
    for (var j = 0; j < data.length; j++) {
        var list = data[j];
        var fileType = list.filepath.split('.')[1];
        var str = '';
        if (isImgType(fileType)) {
            str = '<a href="javascript:void(0)" id="img' + list.id + '" onclick=showImg("' + localHost + list.filepath + '") style="margin-right: 20px">' + list.filename + '</a>';
        } else {
            str = '<a href="' + localHost + list.filepath + '" id="img' + list.id + '"  style="margin-right: 20px" download="' + list.filename + '">' + list.filename + '</a>';
        }
        if (remove) {
            str += '<a onclick=deleteMoreImg(this,' + list.id + ') style="margin-right: 20px;text-decoration: line-through;color: red">删除</a>';
        }
        $('#' + id).append(str);
    }
}

//删除企业多张图片
function deleteMoreImg(_that, id) {
    var _this = $(_that);
    Ajax('/company/remove/otherfile', 'delete', {id: id}, function (ret) {
        Alert('删除成功');
        _this.remove();
        $('#img' + id).remove();
    })

}

//上传企业多张图片
function uploadMoreImg(_this) {
    var id = $(_this).attr('id');
    var disp = $('#' + id + '_disp');
    var temp_file_list = _this.files;
    for (var i = 0; i < temp_file_list.length; i++) {
        disp.append(temp_file_list[i].name + '&nbsp;');
    }
}


//是否为空或空字符串
function isNull(obj) {
    if (typeof(obj) == "number") return false;
    if (typeof(obj) == "undefined" || obj == null || !obj || (typeof(obj) == "string" && obj.trim() == "")) {
        return true;
    } else {
        return false;
    }
}

function isImgType(fileType) {
    if (isNull(fileType)) {
        return false;
    }
    var lowerType = fileType.toLowerCase();
    if ("jpg" == lowerType || "jpeg" == lowerType || "bmp" == lowerType
        || "gif" == lowerType || "png" == lowerType) {
        return true;
    }
    return false;
}


//cookie设置
function setCookie(name, value, day) {
    if (day !== 0) {     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
        var expires = day * 60 * 60 * 1000;
        var date = new Date(+new Date() + expires);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
    } else {
        document.cookie = name + "=" + escape(value);
    }
};

//cookie获取
function getCookie(name) {
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
};

function checkNull(formdata, chk_list, select_list) {
    if (!select_list) {
        select_list = [];
    }
    for (var i in chk_list) {
        var temp_index = select_list.indexOf(i)
        if (temp_index == -1) {
            if (Object.prototype.toString.call(formdata) !== '[object FormData]') {
                if (!formdata[i] || formdata[i] == '[]' || formdata[i] == "请选择" || formdata[i] == 'null' || formdata[i] == 'undefined') {
                    return i
                }
            } else {
                if (!formdata.get(i) || formdata.get(i) == '[]' || formdata.get(i) == "请选择" || formdata.get(i) == 'null' || formdata.get(i) == 'undefined') {
                    return i
                }
            }
        } else {
            if (Object.prototype.toString.call(formdata) !== '[object FormData]') {
                if (formdata[i] == '0') {
                    return i
                }
            } else {
                if (formdata.get(i) == '0') {
                    return i
                }
            }
        }

    }
    return ''
}


