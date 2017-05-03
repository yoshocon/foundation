var searchLesson = (function(){
  var _const;
  _const = function(){
    this._construct();
  }
  _const.prototype = {
    _construct:function(){
      //查詢
      this._filterTimeZone = $("#filterTimeZone");
      this._filterLocation = $("#filterLocation");
      this._filterLesson = $("#filterLesson");
      this._filterTimeStart = $("#filterTimeStart");
      this._filterTimeDue = $("#filterTimeDue");
      this._filterEmptyClass = $("#filterEmptyClass");
      this._btnFilter = $("#btnFilter");
      this._cancelFilter = $("#cancelFilter");

      this._lessonList = $("#lessonList");
      this._emptyList = $("#emptyList");

      this._lessonSearchList = $("#lessonSearchList");
      this._emptySearchList = $("#emptySearchList");

      this._lessonloadingList = $("#lessonloadingList");
      this._nobodyList = $("#nobodyList");

      this._start();
    },

    _start:function(){
      var objThis = this;
      this._lessonList.hide();
      this._emptyList.hide();
      this._lessonloadingList.hide();
      this._nobodyList.hide();

      var today = layout._showTime();
      objThis._initialAll();
      objThis._getPositionList();
      objThis._filterTimeStart.val(today)
      objThis._filterTimeDue.val(today)
      $('input').iCheck('check');   //将输入框的状态设置为checked

    },

    _initialAll:function(){

      this._filterEmptyClass.on("ifClicked",$.proxy( function (e) {
          var objThis = this;
          if($(e.currentTarget).is(":checked") == true){
            objThis._filterLesson.removeAttr("disabled");
          }
          else{
            objThis._filterLesson.attr("disabled","disabled").val('');
          }

       },this))
      this._btnFilter.on("click",$.proxy(function(){
        var arr = new Array();
        var obj = new Object;
        var date = new Date();
        var start = this._filterTimeStart.val() == '' ? "0" : new Date(this._filterTimeStart.val()).getTime();
        var due = this._filterTimeDue.val() == '' ? "0" : new Date(this._filterTimeDue.val()).getTime();
        if(start > due){
          layer.msg('<b>請選擇正確的時間範圍</b>', {time: 1500, icon:2,shade:[0.5,'black']});
          this._filterTimeStart.val('');
          this._filterTimeDue.val('');
          return false;
        }

        obj.timezone = this._filterTimeZone.val() != '請選擇' ? this._filterTimeZone.val() : "";
        obj.location = this._filterLocation.val() != '請選擇' ? this._filterLocation.val() : "";
        obj.timestart = start;
        obj.timedue = due;
        obj.lesson = this._filterLesson.val() != '' ? this._filterLesson.val() : "";
        obj.emptyclass = this._filterEmptyClass.is(":checked") == true ? "1" : "0";
        arr = arr.concat(obj);

        this._getlessonList(arr);
      },this));
      //清除查詢
      this._cancelFilter.on("click",$.proxy(function(){
        var today = layout._showTime();
        this._filterTimeZone.val('請選擇');
        this._filterLocation.val('請選擇');
        this._filterTimeStart.val(today);
        this._filterTimeDue.val(today);
        this._filterLesson.val('').attr("disabled","disabled");
        $('input').iCheck('check');   //将输入框的状态设置为checked
        // this._filterEmptyClass = $("#filterEmptyClass");
      },this));
    },
    //取得列表查詢
    _getlessonList:function(val){
      var objThis = this;
      objThis._lessonList.hide();
      objThis._emptyList.hide();
      objThis._lessonSearchList.hide();
      objThis._emptySearchList.hide();
      $.ajax({
        type:'post',
        url:'/searchLessonDetail',
        data:{strJson: JSON.stringify(val)},
        success:function(datas){
            var data = datas.success
            console.log(datas)
            if (data == 'no data')
            {
              layer.msg('<b>查無資料</b>', {time: 1500, icon:2,shade:[0.5,'black']});
              objThis._nobodyList.show();

            }
            else
            {
              objThis._nobodyList.hide();

              layer.msg('<b>查詢成功</b>', {time: 1500, icon:1,shade:[0.5,'black']});
              if(objThis._filterEmptyClass.is(":checked")){
                objThis._setemptyList(datas.success);
              }else{
                objThis._setlessonList(datas.success);
              }
            }
        },
        beforeSend:function(){
          objThis._lessonloadingList.show();
        },
        complete:function(){
          objThis._lessonloadingList.hide();

        }
      });
    },
    //查空教室
    _setemptyList:function(strJson){
      var objThis = this;
      var _tr;
      var _td;
      console.log(strJson)

      objThis._emptySearchList.empty();
      for (var data in strJson)
      {
        var emptyData = strJson[data].split(' ')
        _tr = $("<tr />");
        //#
        _td = $("<td />",{"text":(parseInt(data)+1)});
        _tr.append(_td);
        //課程名稱
        _td = $("<td />",{"text":emptyData[0]});
        _tr.append(_td);
        //使用教室
        _td = $("<td />",{"text":emptyData[1]});
        _tr.append(_td);
        //上課人數
        _td = $("<td />",{"text":emptyData[2]});
        _tr.append(_td);


        objThis._emptySearchList.append(_tr);
      }




      objThis._emptySearchList.show();
      objThis._emptyList.show();
    },
    //查課程
    _setlessonList:function(strJson){
      var objThis = this;

      var _tr;
      var _td;

      console.log(strJson)

      objThis._lessonSearchList.empty();
      $.each(strJson,function(i,v){
        _tr = $("<tr />");
        //#
        _td = $("<td />",{"text":(i+1)});
        _tr.append(_td);
        //課程名稱
        _td = $("<td />",{"text":v.name});
        _tr.append(_td);
        //使用教室
        _td = $("<td />",{"text":v.building + " " + v.lessonClass});
        _tr.append(_td);
        //上課人數
        _td = $("<td />",{"text":v.people});
        _tr.append(_td);
        //時間 - 時段
        _td = $("<td />",{"text":v.time + " - " + v.period});
        _tr.append(_td);
        //聯絡人
        _td = $("<td />",{"text":v.contract});
        _tr.append(_td);
        //聯絡電話
        _td = $("<td />",{"text":v.contractPhone});
        _tr.append(_td);
        //詳細資料
        _input = $("<span />",{"class":"label label-default btn-embossed","text":"詳細資料","style":"font-size:100%"});
        _input.bind("click",function(){
          bootbox.alert("<b style='font-size:20px;'>課程資訊</b><hr/>" +
                "<b style='font-size:20px;'>課程名稱</b>：" + v.name +
                "<br/><br/>時間 - 時段：" + v.time + "-" + v.period +
								"<br/><br/>使用教室：" + v.building + " " +  v.lessonClass +
								"<br/><br/>上課人數：" + v.people +

								"<br/><br/>聯絡人姓名：" + v.contract +
								"<br/><br/>聯絡人電話：" + v.contractPhone +
								"<br/><br/>使用目標：" + v.aim	+
                "<br/><br/>備註：" + v.note +
                "<br/><br/>建立時間：" + v.createTime +
								"<br/><br/>修改時間：" + v.modifyTime +
                "<br/><br/>上傳者：" + v.user

          )
        })
        _td = $("<td />");
        _td.append(_input)
        _tr.append(_td)
        objThis._lessonSearchList.append(_tr);

      })

      objThis._lessonSearchList.show();
      objThis._lessonList.show();
    },
    //取得地點
    _getPositionList:function(){
      var objThis = this;
      $.ajax({
        type:'post',
        url:'/getPositionData',
        success:function(datas){
            var data = datas.success
            objThis._setPositionOption(data);
        }
      });

    },
    _setPositionOption:function(strJson){
      var objThis = this;
      objThis._filterLocation.empty().append("<option value='請選擇'>請選擇</option>");


      var jsonData = '[';
      $.each(strJson,function(i,v){
        if(v.lock == 'no'){
            objThis._filterLocation.append("<option value='" + v.location + "'>" + v.location + "</option>")
        }
      });
    },

  }
  return _const;
}());

var searchLesson;
$(function(){
  searchLesson = new searchLesson();
  setTimeout('layout._resize_tab();',100)    /* 調整背景 */
});
