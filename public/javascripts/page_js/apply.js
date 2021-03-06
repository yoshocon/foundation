var apply = (function(){
  var _const;
  _const = function(){
    this._construct();
  }
  _const.prototype = {
    _construct:function(){
      this._new = $(".new");
      this._btnSubmit = $("#btnSubmit");
      this._btnCancel = $("#btnCancel");
      //課程新增欄位
      this._lessonName = $("#lessonName");
      this._lessonBuilding = $("#lessonBuilding");
      this._lessonFloor = $("#lessonFloor");
      this._lessonClass = $("#lessonClass");
      this._lessonTime = $("#lessonTime");
      this._lessonPeriod = $("#lessonPeriod");
      this._lessonPeople = $("#lessonPeople");
      this._lessonNote = $("#lessonNote");
      this._lessonForm = $("#lessonForm");
      //form
      this._form_name = $(".form_name");
      this._form_class = $(".form_class");
      this._form_time = $(".form_time");
      this._form_period = $(".form_period");
      this._form_people = $(".form_people");
      this._form_note = $(".form_note");
      this._form = $(".form");
      //detail
      this._detailContract = $("#detailContract");
      this._detailPhone = $("#detailPhone");
      //select
      this._selectLocal = $("#selectLocal");
      this._selectClass = $("#selectClass");
      //
      this._hiddenPositionData = $("#hiddenPositionData");
      this.checkPeople = 0;
      //lessonList
      this._lesson = $("#lesson");

      this._start();
    },

    _start:function(){
      var objThis = this;
      objThis._initialAll();
      objThis._getPositionList();
    },

    _initialAll:function(){

      //確認新增課程
			this._btnSubmit.on("click",$.proxy(function(){
        var objThis = this;


      	if(objThis._checkSubmit())
				{
          bootbox.confirm({
            message:"<br/><b style='font-size:20px;'>確定申請 <font style='color:red;'>" + objThis._lessonName.val() + "</font> 課程嗎?</b><br/>" +
            "<br/><br/><b>地點：</b>" + objThis._lessonClass.val() +
            "<br/><br/><b>時間：</b>" + objThis._lessonTime.val() +
            "<br/><br/><b>時段：</b>" + objThis._lessonPeriod.val() +
            "<br/><br/><b>聯絡人：</b>" + objThis._detailContract.val() +
            "<br/><br/><b>聯絡電話：</b>" + objThis._detailPhone.val() +
            "<br/><br/><b>上課人數：</b>" + objThis._lessonPeople.val() +
            "<br/><br/><b>申請事由：</b>" + objThis._lessonNote.val(),
            buttons:{
              confirm:{
                  label:'確定申請',
                  className:'btn-success'
              },
              cancel:{
                  label:'取消',
                  className:'btn-default'
              }

            },
            callback:function(e){
                if(e){

                    var lessonData =
                    {
                      lessonName : objThis._lessonName.val(),
                      lessonBuilding : objThis._lessonBuilding.val(),
                      lessonFloor : objThis._lessonFloor.val(),
                      lessonClass : objThis._lessonClass.val(),
                      lessonTime : objThis._lessonTime.val(),
                      lessonPeriod : objThis._lessonPeriod.val(),
                      lessonPeople : objThis._lessonPeople.val(),
                      lessonAim : objThis._lessonNote.val(),
                      contract : objThis._detailContract.val(),
                      contractPhone : objThis._detailPhone.val()
                    };

                    $.ajax({
          						type: "post",
          						url: "/apply",
          						data: lessonData ,
          						dataType: "json",
          						success: function(message){
          							if(message.success == 'yes')
          							{
          								layer.msg('<b>申請課程成功</b>', {time: 1500, icon:1,shade:[0.5,'black']});
                          location.href = '/lesson'
          							}
                        else if(message.success == 'no')
                        {
                          layer.msg('<b>申請失敗，原因：時間衝突</b>', {time: 1500, icon:2,shade:[0.5,'black']});
                        }
          						},
          						error: function (xhr)
          						{
          							alert('error: ' + xhr);console.log(xhr);
          							layer.msg('<b>好像出現了意外錯誤</b>', {time: 1500, icon:2,shade:[0.5,'black']});
          						}
          					});
                }else{
                  layer.msg('<b>取消申請課程</b>', {time: 1500, icon:2,shade:[0.5,'black']});
                }
              }
          });
				}
			},this));

      //大樓change
			this._lessonBuilding.on("change",$.proxy(function(e){
        var objThis = this;
        var check = true;
        objThis._lessonFloor.empty().append("<option value='請選擇'>請選擇</option>")
        objThis._lessonClass.empty().append("<option value='請選擇'>請選擇</option>")
        objThis._lessonPeople.attr("disabled","disabled").val('')
        if($(e.currentTarget).val() != "請選擇"){
            var data = JSON.parse(this._hiddenPositionData.val());
            $.each(data,function(i,v){
                check = true;
                if($(e.currentTarget).val() == v.building){
                  $("#lessonFloor option").each(function(index,element){
                    if($(element).val() == v.floor )  check = false;
                  });
                  if(check){
                    objThis._lessonFloor.append("<option value='" + v.floor + "'>" + v.floor + "</option>");
                  }
                }
            })
        }
			},this))
      // 樓層change
			this._lessonFloor.on("change",$.proxy(function(e){
        var objThis = this;
        objThis._lessonClass.empty().append("<option value='請選擇'>請選擇</option>");
        objThis._lessonPeople.attr("disabled","disabled").val('')

        if($(e.currentTarget).val() != "請選擇"){
          objThis._lessonClass.empty().append("<option value='請選擇'>請選擇</option>");
          var data = JSON.parse(this._hiddenPositionData.val());
          $.each(data,function(i,v){
              if($(e.currentTarget).val() == v.floor && objThis._lessonBuilding.val() == v.building){
                  objThis._lessonClass.append("<option value='" + v.classroom + "'>" + v.classroom + "  (最大容納人數：" + v.people + "人)</option>");
              }
          })
        }
			},this));
      // 教室change 儲存人數
      this._lessonClass.on("change",$.proxy(function(e){
        var objThis = this;
        objThis._lessonPeople.attr("disabled","disabled").val('')
          if($(e.currentTarget).val() != "請選擇"){
            var data = JSON.parse(this._hiddenPositionData.val());
            $.each(data,function(i,v){
                if($(e.currentTarget).val() == v.classroom && objThis._lessonBuilding.val() == v.building && objThis._lessonFloor.val() == v.floor){
                    objThis.checkPeople  = parseInt(v.people);
                }
            })
            objThis._lessonPeople.removeAttr("disabled")
          }else{
						objThis.checkPeople = 0;
					}
      },this));
    },
    _checkSubmit:function(){  // 確認新增課程欄位判斷
			var returnCheck = true;
      var errorText = '';		//存放錯誤訊息
			//課程名稱
			if(this._lessonName.val() == "")
			{
				returnCheck = false;
				this._form_name.addClass("has-error");
				// layer.msg('<b>請輸入課程名稱</b>', {time: 1500, icon:2,shade:[0.5,'black']});
        errorText += '<b>請輸入課程名稱</b><br/>';
			}else
			{
				this._form_name.removeClass("has-error");
			}
      //申請事由
      if(this._lessonNote.val() == "")
      {
        returnCheck = false;
        this._form_note.addClass("has-error");
        // layer.msg('<b>請輸入申請事由</b>', {time: 1500, icon:2,shade:[0.5,'black']});
        errorText += '<b>請輸入申請事由</b><br/>';
      }else
      {
        this._form_note.removeClass("has-error");
      }
			//使用教室
			if(this._lessonClass.val() == '請選擇' || this._lessonFloor.val() == '請選擇' || this._lessonBuilding.val() == '請選擇')
			{
				returnCheck = false;
				this._form_class.addClass("has-error");
				// layer.msg('<b>請選擇使用教室</b>', {time: 1500, icon:2,shade:[0.5,'black']});
        errorText += '<b>請選擇使用教室</b><br/>';
			}else
			{
				this._form_class.removeClass("has-error");

        //上課人數
        var positiveInteger = /^[0-9]*[1-9][0-9]*$/ ;
  			if(this._lessonPeople.val() == "" || this._lessonPeople.val() <1 || !positiveInteger.test(this._lessonPeople.val()) )
  			{
  				returnCheck = false;
  				this._form_people.addClass("has-error");
  				// layer.msg('<b>請輸入正確的上課人數格式</b>', {time: 1500, icon:2,shade:[0.5,'black']});
          errorText += '<b>請輸入正確的上課人數格式</b><br/>';
  			}


				if (this.checkPeople < this._lessonPeople.val())
				{
					returnCheck = false;
					this._form_people.addClass("has-error");
					// layer.msg('<b>輸入人數超出教室容量</b>', {time: 1500, icon:2,shade:[0.5,'black']});
          errorText += '<b>輸入人數超出教室容量</b><br/>';
				}
				else
				{
					this._form_people.removeClass("has-error");
				}

			}
			//開始上課時間
			var correctTimeFormat = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/ ;
			if(this._lessonTime.val() == "" || !correctTimeFormat.test(this._lessonTime.val()))
			{
				returnCheck = false;
				this._form_time.addClass("has-error");
				// layer.msg('<b>請輸入正確的時間格式</b>', {time: 1500, icon:2,shade:[0.5,'black']});
        errorText += '<b>請輸入正確的時間格式</b><br/>';
			}else
			{
				var date = new Date;
				var todayTime = new Date(date.getFullYear(), date.getMonth()+1, date.getDate()).getTime();
				var useDate = this._lessonTime.val().split('/');
				var useTime = new Date(useDate[0], useDate[1], useDate[2]).getTime();
				if (todayTime >= useTime)
				{
					returnCheck = false;
					this._form_time.addClass("has-error");
					// layer.msg('<b>請選擇明天以後的上課時間</b>', {time: 1500, icon:2,shade:[0.5,'black']});
          errorText += '<b>請選擇明天以後的上課時間</b><br/>';
				}
				else
				{
					this._form_time.removeClass("has-error");
				}
			}
			//上課時段
			if(this._lessonPeriod.val() == '請選擇')
			{
				returnCheck = false;
				this._form_period.addClass("has-error");
				// layer.msg('<b>請選擇上課時段</b>', {time: 1500, icon:2,shade:[0.5,'black']});
        errorText += '<b>請選擇上課時段</b><br/>';
			}
			else
			{
				this._form_period.removeClass("has-error");
			}

			// //上課人數
      // var positiveInteger = /^[0-9]*[1-9][0-9]*$/ ;
			// if(this._lessonPeople.val() == "" || this._lessonPeople.val() <1 || !positiveInteger.test(this._lessonPeople.val()) )
			// {
			// 	returnCheck = false;
			// 	this._form_people.addClass("has-error");
			// 	layer.msg('<b>請輸入正確的上課人數格式</b>', {time: 1500, icon:2,shade:[0.5,'black']});
			// }
      // else if (this._lessonClass.val() == undefined)
      // {
      //   this._form_people.addClass("has-error");
      //   this._lessonPeople.val("");
			// 	layer.msg('<b>請選擇教室再輸入人數</b>', {time: 1500, icon:2,shade:[0.5,'black']});
      // }
      // else
			// {
			// 	if (this.checkPeople < this._lessonPeople.val())
			// 	{
			// 		returnCheck = false;
			// 		this._form_people.addClass("has-error");
			// 		layer.msg('<b>輸入人數超出教室容量</b>', {time: 1500, icon:2,shade:[0.5,'black']});
			// 	}
			// 	else
			// 	{
			// 		this._form_people.removeClass("has-error");
			// 	}
			// }
      if(errorText != ''){
						layer.msg(errorText, {time: 3000, icon:2,shade:[0.5,'black']});
			}
			return returnCheck;
		},
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
      objThis._lessonBuilding.empty().append("<option value='請選擇'>請選擇</option>");
      objThis._lessonFloor.empty().append("<option value='請選擇'>請選擇</option>");
      objThis._lessonClass.empty().append("<option value='請選擇'>請選擇</option>");

      var arrBuilding = new Array();
      var arrFloor = new Array();
      var arrClass = new Array();
      var jsonData = '[';
      $.each(strJson,function(i,v){
        if(v.lock == 'no'){
          arrBuilding.push(v.building);

          jsonData += '{"building":"' + v.building + '",';
          jsonData += '"floor":"' + v.floor + '",';
          jsonData += '"classroom":"' + v.classroom + '",';
          jsonData += '"people":"' + v.people + '"},'
        }
      });
      jsonData = jsonData.substring(0,jsonData.length - 1);
      jsonData += ']'
      objThis._hiddenPositionData.val(jsonData)

      //刪除重複
      if(arrBuilding.length > 0){
          var index = 0;
          for(var i=0;i<arrBuilding.length;i++){
              if(arrBuilding[index] != arrBuilding[i]){
                  index++;
                  arrBuilding[index] = arrBuilding[i];
              }
          }
          for(var j = arrBuilding.length; j > index;j--){
              delete arrBuilding[j];
          }
          for(var k=0;k <= index;k++){
                _option = $("<option />",{"text":arrBuilding[k],"value":arrBuilding[k]});
                objThis._lessonBuilding.append(_option);
          }

      }
    },
  }
  return _const;
}());

var apply;
$(function(){
  apply = new apply();
  setTimeout('layout._resize_tab();',100)    /* 調整背景 */
})
