/**
 * Created by 16288 on 2019/5/11.
 */

//全局变量
var localHost = 'http://47.106.140.239:5000'; //服务器数据地址
var localHost2 = 'http://47.106.140.239:8080'; //服务器主机地址
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
        },
    };
    if (formData) {
        obj.contentType = false;
        obj.mimeType = "multipart/form-data";
        obj.processData = false;
    }
    $.ajax(obj)
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
    console.log(ret);
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
function SelcetArea() {
    Ajax('/area/province/0', 'get', null, function (ret) {
        SelectBox('province', ret.province_list, 'ID', 'Name');
    });
    $('#province').change(function () {
        var provinceId =  $('#province').val();
        if (provinceId) {
            Ajax('/area/city/' + provinceId, 'get', null, function (ret) {
                SelectBox('city', ret.city_list, 'ID', 'Name')
            });
        } else {
            Alert('请选择先选择省份')
        }
    });
    $('#city').change(function () {
        var cityId = $(this).val();
        if (cityId) {
            Ajax('/area/district/' + cityId, 'get', null, function (ret) {
                SelectBox('district', ret.distict_list, 'ID', 'Name')
            });
        } else {
            Alert('请选择先选择市')
        }
    })
}
//获取区域方法
function getArea() {
    var district = parseInt($('#district').val());
    var city = parseInt($('#city').val());
    var province = parseInt($('#province').val());
    if (district){
        return district;
    } else if (city){
        return city;
    } else if (province){
        return province;
    }
}

//多选框赋值
function SelectBox(boxId, arr, valId, Name) {
    if (arr) {
        var optionstring = '<option value="0" ></option>';

        $.each(arr, function (key, value) {
            if (value[valId] == null) {
                return true
            }
            optionstring += "<option value='" + value[valId] + "'>" + value[Name] + "</option>";
        });
        if (boxId == 'province'||boxId == 'city'||boxId == 'district') {
            $("#"+boxId).html('<option value="0" ></option>'+optionstring);
        };
        $("#" + boxId).html(optionstring);
    }
}
function SelectBox2(node, arr, valId, Name) {
    if (arr) {
        var optionstring = '';
        $.each(arr, function (key, value) {
            optionstring += "<option value=\"" + value[valId] + "\" >" + value[Name] + "</option>";
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
            html += '<li><a href="javascript:void(0)" attrId=' + arr[i].ID + '>' + arr[i].Name + '</a></li>'
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
                    '<a href="javascript:void(0)" attrId=' + arr[i].ID + ' >' + arr[i].Name + '</a></li>'
            }
        }
    }
    return html;
}
//分组图片上传
function getFormData(node) {
    var fileObj = node.files;
    var formFile = new FormData();
    for(var i=0;i<fileObj.length;i++){
        formFile.append("file", fileObj[i]);
    }
    return formFile;
}

//上传并回显图片名字
function getFormDataOne(node) {
    var fileObj = node.files;
    var span=$(node).parents('.btn-group').prev('span');
    for (var i=0;i<fileObj.length;i++){
        span.append('<a href="" target="_blank" style="margin-right: 20px">' + fileObj[i].name + '</a>');
    }
}



//获取上传图片
function uploadMore(node,formData) {
    var fileObj = document.getElementById(node).files;
    for(var i=0;i<fileObj.length;i++){
        formData.append(node, fileObj[i]);
    }
    return formData
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

//my分页
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
        search()
    })
}


//cookie设置
function setCookie (name, value, day) {
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

function setRoot() {
    if(Permission){
       var myRoot=JSON.parse(Permission);
       for(var i =0;i<myRoot.length;i++){
           var menubtn=$('[menubtn='+myRoot[i]+']');
            if(menubtn.length>0){
                menubtn.css('display','block');
            }
       }
    }
}



