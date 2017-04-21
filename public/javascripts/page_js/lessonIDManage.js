var lessonIDManage = (function(){
  var _const;
  _const = function(){
    this._construct();
  }
  _const.prototype = {
    _construct:function(){
      this._bounce_new = $('#bounce_new');
      this._btnCancel = $('#btnCancel');
      this._btnSubmit = $('#btnSubmit');
      this._form_name = $('.form_name');
      this._form_abbreviation = $('.form_abbreviation');
      this._lesson = $('#lesson');
      this._lessonName = $('#lessonName');
      this._lessonAbbreviation = $('#lessonAbbreviation');
      this._new = $('#new');
      this._todayTime = $("#todayTime");

      this._start();
    },

    _start:function(){
      var objThis = this;
      objThis._initialAll();
      objThis._getlessonIDList();
    },

    _initialAll:function(){
      //初始化彈跳視窗位置
      this._bounce_new.css('position','absolute');
      this._bounce_new.css('top', '20%');

      //顯示當天時間
      var now = new Date();
			this._todayTime.append
        (   now.getFullYear() + '/' + (now.getMonth()+1) + '/'
          + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":"
          + now.getSeconds());

      //新增課程編號
      this._new.on('click', $.proxy(function(){
        this._lessonName.val('');
        this._lessonAbbreviation.val('');
        //開啟新增課程視窗
        this._bounce_new.modal('show');
      }, this));

      //關閉新增課程編號視窗
      this._btnCancel.on('click', $.proxy(function(){
        this._bounce_new.modal('hide');
      },this));

      //確認新增課程編號
      this._btnSubmit.on('click', $.proxy(function(){
        var objThis = this;
        if(this._checkSubmit())
        {
          var abbreviationData =
          {
            lessonName : this._lessonName.val(),
            lessonAbbreviation : this._lessonAbbreviation.val()
          };
          $.ajax({
            type: 'post',
            url: '/lessonIDManage',
            data: abbreviationData,
            dataType: 'json',
            success: function(message)
            {
              if (message.success == 'no repeat')
              {
                layer.msg('<b>新增課程成功</b>', {time: 1500, icon:1,shade:[0.5,'black']});
              }
              else if(message.success == 'repeat')
              {
                layer.msg('<b>新增課程失敗，課程已被新增過</b>', {time: 1500, icon:2,shade:[0.5,'black']});
              }
            },
            error: function(xhr)
            {
              alert('error: ' + xhr);console.log(xhr);
              layer.msg('<b>好像出現了意外錯誤</b>', {time: 1500, icon:2,shade:[0.5,'black']});
            },
            complete:function(){
                objThis._getlessonIDList();
            }
          })
          this._bounce_new.modal('hide');
        }
      }, this));
    },

    _checkSubmit:function(){
      var returnCheck = true;
      //課程名稱
      if(this._lessonName.val() == '')
      {
        returnCheck = false;
        this._form_name.addClass("has-error");
        layer.msg('<b>請輸入課程名稱</b>', {time: 1500, icon:2,shade:[0.5,'black']});
      }
      else
      {
        this._form_name.removeClass("has-error");
      }
      return returnCheck;
    },
    _getlessonIDList:function(){
      var objThis = this;

      $.ajax({
        type:'post',
        url:'/getupdateLessonID',
        success:function(datas){
            var data = datas.success
            objThis._setlessonIDList(data);
        }
      });

    },
    _setlessonIDList:function(strJson){
      var objThis = this;
      var _tr;
      var _td;
      var _input;
      objThis._lesson.empty();
      $.each(strJson,function(i,v){
        var trClass;
          switch(i%4){
              case 0:
                trClass = 'active'
                break;
              case 1:
                trClass = 'success'
                break;
              case 2:
                trClass = 'warning'
                break;
              case 3:
                trClass = 'danger'
                break;

          }
          _tr = $("<tr />",{"class":trClass});
          //#
          _td = $("<td />",{"text":(i+1)});
          _tr.append(_td);
          //上傳者
          _td = $("<td />",{"style":"text-align:left","text":v.userName});
          _tr.append(_td);
          //課程名稱
          _td = $("<td />",{"style":"text-align:left","text":v.name});
          _tr.append(_td);
          //課程簡稱
          _td = $("<td />",{"text":v.abbreviation});
          _tr.append(_td);
          //新增時間
          _td = $("<td />",{"nowrap":"nowrap","text":v.createTime});
          _tr.append(_td);
          //修改時間
          _td = $("<td />",{"nowrap":"nowrap","text":v.modifyTime});
          _tr.append(_td);
          //詳細資料
          _input = $("<span />",{"class":"label label-default","text":"聯絡人資訊","style":"font-size:100%;"});
          _input.bind("click",function(){
              bootbox.alert("聯絡人資訊")
          })
          _td = $("<td />");
          _td.append(_input)
          _tr.append(_td);

          objThis._lesson.append(_tr)
      });

    }
  }
  return _const;
}());

var lessonIDManage;
$(function(){
  lessonIDManage = new lessonIDManage();
})
