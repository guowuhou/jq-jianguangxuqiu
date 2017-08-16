// $(function(){
window.onload = function(){
    //封装ajax
    jQuery.support.cors = true;
    var commonRequest = function (url, options) {
        $.ajax({
            url: url,
            type: 'get',
            dataType:'json',
            contentType: "application/json;charset=utf8",
            data:options.param,
            complete:function(response){
                options.complete && options.complete(response);
            },
            success: function (response) {
                options.success && options.success(response);
            },
            error: function (response) {
                if (options.error) {
                    options.error(response);
                    return;
                };
                alert(response.errMsg);
            }
        });
    };
    var yihang = function(options){
        commonRequest("https://rmb-stg.pingan.com.cn/brop/pop/cust/brop_pop_shelf_service.qrySuperviseProductList",options);
        // commonRequest("https://rmb.pingan.com.cn/brop/pop/cust/brop_pop_shelf_service.qrySuperviseProductList",options);
    };
   
    //导航Tab事件
    $(".xiaoshou-tab-nav li a").on('click',function(){
        var currentTable = $(this).data('table');
         var tableClass = '.' + currentTable;
         $(this).parent().addClass('active').siblings().removeClass('active');
        $(".xiaoshou-product-list").find(tableClass).css('display','block').
                                    siblings().css('display','none');
        showPage(currentTable);
    });
    
    var showPage = function(current){
        if(current=='table'){
            $('.page').hide();
        }else{
            var params = getParams();
            $('.page .pageNo').val(1);
            $('.page .page_size :first').addClass('active').siblings().removeClass('active');
            tplOut(params.tableIndex,params.tplId,params.dataType);
        }
    }
   
    //获取查询列表参数
    var getParams = function(){
        var myParams = {};
        var mapIndex = {
            'table01': '01',
            'table02': '02',
            'table03': '03',
            'table04': '04'
        };
        var tableIndex = $('.xiaoshou-tab-nav').find('.active a').data('table');
        myParams.pageNum = $('.page .pageNo').val();
        myParams.pageSize =  $('.page .page_size').find('.active').text();
        myParams.tableIndex = tableIndex;
        myParams.dataType = mapIndex[tableIndex];
        if(myParams.dataType=='01'){
            myParams.tplId = 'tpl01';
        }else{
            myParams.tplId = 'tpl02';
        }
        return myParams;
    }
    
    //分页-每页多少条事件
    //向上点击
    $(".caret_top").on('click',function(){
        var ul = $('.page .page_size');
        var pageSize = ul.find('.active').text()
        if(pageSize==10){
           return;
        }else{
            var prev = ul.find('.active').removeClass('active').prev();
            prev.addClass('active');
            var params = getParams();
            tplOut(params.tableIndex,params.tplId,params.dataType,true);
        }
    })
    //向下点击
     $(".caret_down").on('click',function(){
        var ul = $('.page .page_size');
        var pageSize = ul.find('.active').text();
        var nextLi = ul.find('.active').next().text();
        var pageNo = $('.page .pageNo').val();
        var totalSize = Number($('.page .totalSize').text());
        if(pageSize==100||Number(pageSize)>totalSize){
            return;
        }else{
            if(nextLi*pageNo>totalSize){
                $('.page .pageNo').val(Math.ceil(totalSize/nextLi));
            }
            var params = getParams();
            var next = ul.find('.active').removeClass('active').next();
            next.addClass('active');
            tplOut(params.tableIndex,params.tplId,params.dataType,true);
        }
    })
    //input-pageNum输入及Enter事件
    var reg  = /^[1-9][\d]{0,2}$/;
    $(".pageNo").on('input',function(){
        var value = $(this).val();
        var totalPage = $('.page .totalPage').text();
        var flag = reg.test(value);
        if(!flag){
            $(this).val(value.substring(0,value.length-1));
        };
        if(Number(value)>=Number(totalPage)){
            $(this).val(totalPage)
        };
        if($(this).val()==''){
            $(this).val('1');
        }
    })
    $(".pageNo").on('keyup',function(e){
        var pageNum = $(this).val();
        var params = getParams();
        if(e.keyCode==13){
            tplOut(params.tableIndex,params.tplId,params.dataType);
        };
    })
    
    //跳转到首页
    $(".homeBtn").on('click',function(){
        var params = getParams();
        if(params.pageNum == 1){ 
            return;
        };
        params.pageNum ="1";
        $('.page .pageNo').val(params.pageNum);
        tplOut(params.tableIndex,params.tplId,params.dataType);
    })
    //上一页
    $(".prevBtn").on('click',function(){
        var params = getParams();
        if(params.pageNum == 1){
            return;
        };
        params.pageNum = Number(params.pageNum) -1+'';
        $('.page .pageNo').val(params.pageNum);
        tplOut(params.tableIndex,params.tplId,params.dataType);
    });
    //下一页
    $(".nextBtn").on('click',function(){
        var params = getParams();
        if(params.pageNum == $(".page .totalPage").text()){ 
            return;
        };
        params.pageNum = Number(params.pageNum) +1+'';
        $('.page .pageNo').val(params.pageNum);
        tplOut(params.tableIndex,params.tplId,params.dataType);
    });
    //跳转到尾页
    $(".lastBtn").on('click',function(){
        var params = getParams();
         if(params.pageNum == $(".page .totalPage").text()){  
            return;
        };
        params.pageNum = $(".page .totalPage").text();
        $('.page .pageNo').val(params.pageNum);
        tplOut(params.tableIndex,params.tplId,params.dataType);
    });
    //刷新
    $(".refresh").on('click',function(){
        var params = getParams();
        params.pageNum = 1;
        $('.page .pageNo').val('1');
        tplOut(params.tableIndex,params.tplId,params.dataType);
    });
    
    //渲染模版
    function tplOut(ele,tplId,dataType,oneFlag){
        var params = getParams();
        params.dataType = dataType;
        var pageSize = params.pageSize;
        yihang({
                param:params,
                success:function(response){
                    pageClick(response,ele,tplId,params);
                },
                error:function(response){
                    alert(response.msg);
                }
            });
    }
    tplOut('table01','tpl01','01');
    
    function pageClick(response,ele,tplId,params){
        var element = '.' + ele + ' tbody';
        var len = response.data.list.length;
        if(len==0){
            $(element).html("<tr><td colspan='10'>暂无记录</td></tr>");
            $('.page').hide();
        }else{
            var tpl = $('#'+ tplId).html();
            var html = _.template(tpl)( response.data);
            $(element).html(html);
            var totalSize = response.data.totalSize;
            var totalPage = Math.ceil(totalSize/params.pageSize);
            $('.page .totalPage').text(totalPage);
            $('.page .totalSize').text(totalSize);
            if($('.page .pageNo').val()==1){
                $('.page .prevBtn').removeClass('prev').addClass('prev_grap');
                $('.page .homeBtn').removeClass('home').addClass('home_grap');
            }else{
                $('.page .prevBtn').removeClass('prev_grap').addClass('prev');
                $('.page .homeBtn').removeClass('home_grap').addClass('home');
            }
            if($('.page .pageNo').val()==totalPage){
                $('.page .nextBtn').removeClass('next').addClass('next_grap');
                $('.page .lastBtn').removeClass('last').addClass('last_grap');
            }else{
                $('.page .nextBtn').removeClass('next_grap').addClass('next');
                $('.page .lastBtn').removeClass('last_grap').addClass('last');
            }
            if(totalPage==1){
                $('.page').hide();
            }else{
                $('.page').show();
            }
            
        }
    }
}
// })


