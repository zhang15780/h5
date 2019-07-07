
/*$(function(){
    //菜单点击
    $(".J_menuItem").click(function(event){
        event.preventDefault();
        var $this=$(this);
        var url=$this.attr('href');
        var name=$this.html();
        //addTabs(url,name,$this);
    });
});

function addTabs(url,name,tabHead) {
    var frameName='frame-'+url.split('.')[0];
    $('#content-main div').each(function (i,ele) {
       var $this=$(this);
       var id=$this.attr('id');
       if(id==frameName){
           $this.show().siblings.hide();
           tabHead.addClass('active').siblings.remove('active');
       }else{
           createFrame('url',frameName,$('#content-main').append('<div id="'+frameName+'"></div>'))
       }
    });
}
//创建一个iframe
function createFrame(url,nameId,domParent,cb){
    var iframe = document.createElement('iframe');
    iframe.src=url;
    iframe.id=nameId;
    iframe.height='100%';
    domParent.appendChild(iframe);
    if(cb) cb();
}*/
