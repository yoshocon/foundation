var aduit = (function(){
  var _const;
  _const = function(){
    this._construct();
  }
  _const.prototype = {
    _construct:function(){
      this._btnCancel = $('#btnCancel');
      this._btnSubmit = $('#btnSubmit');
      this._bounce_check = $("#bounce_check");
      this._checkText = $("#checkText");
      this._lessonID = $(".lessonID");
      this._lesson = $("#lesson");

      this.clickID = "";
      this.clickLessonName = "";
      this._start();
    },

    _start:function(){
      var objThis = this;
      objThis._initialAll();
      objThis._getAuditList();
    },

    _initialAll:function(){


      //審核通過
      this._btnSubmit.on('click',$.proxy(function(){
        var objThis = this;
        bootbox.confirm({
          message:"確定審核通過嗎?",
          button:{
            confirm:{
                label:'確定通過',
                className:'btn-success'
            },
            cancel:{
                label:'我在想一下',
                className:'btn-default'
            }
          },
            callback:function(e){
                if(e){

                  var lesson = { lessonID: objThis.clickID };
                  $.ajax({
                    type: "post",
                    url: "/auditpass",
                    data: JSON.stringify(lesson) ,
                    contentType: "application/json",
                    dataType: "json",
                    success: function(message){
                      if(message.success == 'yes')
                      {
                        objThis._getAuditList();
                        layer.msg('<b>審核通過</b>', {time: 1500, icon:1,shade:[0.5,'black']});
                        //更改通知資料
                        var postData = {
                            isReview:'1'
                        };
                        firebase.database().ref('/lessonNotice').once('value').then(function(e){
                          var data = e.val();
                          $.each(data,function(i,v){
                            $.each(v,function(n,m){
                              //判斷課程名稱
                              if(n == 'lessonName' && m == objThis.clickLessonName){
                                key = i;
                                firebase.database().ref('/lessonNotice/' + key).update(postData);
                                time = v.time
                                time = new Date(time).toLocaleString();
                                time = time.replace(/\-/g,'/').split(' ')[0];


                                //判斷同一天的課程的資料
                                firebase.database().ref('/lessonNotice').once('value').then(function(tt){
                                    var tt = tt.val();
                                    $.each(tt,function(t1,t2){
                                      $.each(t2,function(t3,t4){
                                        if(t3 == 'time' && t2.isReview == '0'){
                                          cTime = t4;
                                          cTime = new Date(cTime).toLocaleString();
                                          cTime = cTime.replace(/\-/g,'/').split(' ')[0];
                                          if(cTime == time){
                                            key = t1;
                                            var postData = {
                                                isReview:'2'
                                            };
                                            firebase.database().ref('/lessonNotice/' + key).update(postData);
                                          }
                                        }
                                      })
                                    })
                                })
                              }

                            })
                          });
                        })
                      }
                      else if(message.success == 'no')
                      {
                        layer.msg('<b>後續的課程有重複資料，不得審核通過</b>', {time: 1500, icon:2,shade:[0.5,'black']});
                      }
                    },
                    error: function (xhr)
                    {
                      alert('error: ' + xhr);console.log(xhr);
                      layer.msg('<b>好像出現了意外錯誤</b>', {time: 1500, icon:2,shade:[0.5,'black']});
                    }
                  });

                  objThis._bounce_check.modal("hide");
                }else{
                  layer.msg('<b>取消了審核課程</b>', {time: 1500, icon:2,shade:[0.5,'black']});
                }
            }
        })
      }, this));

      //審核不通過
      this._btnCancel.on('click',$.proxy(function()
      {
        var objThis = this;
        bootbox.confirm({
          message:"確定審核不通過嗎?",
          button:{
            confirm:{
                label:'確定不通過',
                className:'btn-success'
            },
            cancel:{
                label:'我在想一下',
                className:'btn-default'
            }
          },
            callback:function(e){
                if(e){

                  var lesson = { lessonID: objThis.clickID };
                  $.ajax({
                    type: "post",
                    url: "/auditFail",
                    data: JSON.stringify(lesson) ,
                    contentType: "application/json",
                    dataType: "json",
                    success: function(message){
                      if(message.success == 'yes')
                      {
                        objThis._getAuditList();
                        layer.msg('<b>審核不通過</b>', {time: 1500, icon:1,shade:[0.5,'black']});
                        //更改通知資料
                        var postData = {
                            isReview:'2'
                        };
                        firebase.database().ref('/lessonNotice').once('value').then(function(e){
                          var data = e.val();
                          $.each(data,function(i,v){
                            $.each(v,function(n,m){

                              if(n == 'lessonName' && m == objThis.clickLessonName){
                                key = i;
                                firebase.database().ref('/lessonNotice/' + key).update(postData);
                              }
                            })
                          });
                        })
                      }
                    },
                    error: function (xhr)
                    {
                      alert('error: ' + xhr);console.log(xhr);
                      layer.msg('<b>好像出現了意外錯誤</b>', {time: 1500, icon:2,shade:[0.5,'black']});
                    }
                  });

                  objThis._bounce_check.modal("hide");
                }else{
                  layer.msg('<b>取消了審核課程</b>', {time: 1500, icon:2,shade:[0.5,'black']});
                }
            }
        })
      }, this));
    },
    _getAuditList:function(){
        var objThis = this;

        $.ajax({
          type:'post',
          url:'/updateAuditLesson',
          success:function(datas){
              // console.log(datas);
              // console.log(datas.showLesson)
              if(datas.success == 'yes'){
                var data = datas.showLesson;
                objThis._setAuditList(data);
              }
          }
        });
    },
    _setAuditList:function(strJson){
        var objThis = this;
        var _tr;
        var _td;
        var _input;

        objThis._lesson.empty();
        $.each(strJson,function(i,v){
          var trClass;
            switch(i%5){
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
                case 4:
                  trClass = 'info'
                  break;

            }
            _tr = $("<tr />",{"class":trClass});
            //#
            _td = $("<td />",{"text":(i+1)});
            _tr.append(_td);
            //申請者
            _td = $("<td />",{"text":v.user});
            _tr.append(_td);
            //課程名稱
            _td = $("<td />",{"text":v.name});
            _tr.append(_td);
            //上課次數
            _td = $("<td />",{"text":v.count});
            _tr.append(_td);
            //申請目的
            _td = $("<td />",{"text":v.aim});
            _tr.append(_td);
            //申請教室
            _td = $("<td />",{"text":v.lessonClass});
            _tr.append(_td);
            //申請人數
            _td = $("<td />",{"text":v.people});
            _tr.append(_td);
            //申請時間
            _td = $("<td />",{"text":v.time + ' - ' + v.period});
            _tr.append(_td);
            //送出時間
            _td = $("<td />",{"text":v.modifyTime});
            _tr.append(_td);
            //審核
            _input = $("<span />",{"class":"label label-success btn-embossed","text":"審核","id":v.lessonID,"name":(i+1),"style":"font-size:100%"});
            _input.click(function(){
              objThis.clickLessonName = v.name;
              // console.log(objThis.clickLessonName)
              clickID = $(this).attr('id');
              clickName = $(this).attr('name');
            });

            _input.on('click',$.proxy(function()
            {
              // clickID = $('tr').attr('id');
              // alert(clickID);
              if (clickID != undefined)
              {
                objThis._checkText.empty();
                objThis._checkText.append("你選擇的是編號" + clickName + '，是否同意這份申請？');
                objThis.clickID = clickID;
                objThis._bounce_check.modal('show');
              }
            },this));

            _td = $("<td />");
            _td.append(_input);
            _tr.append(_td);

            objThis._lesson.append(_tr)
        });
    }
  }
  return _const;
}());

var aduit;
$(function(){
  aduit = new aduit();
  setTimeout('layout._resize_tab();',100)    /* 調整背景 */
})
