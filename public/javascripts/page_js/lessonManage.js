var lessonManage = (function(){
	var _const;
	_const = function(){

		this._lessonNum = 1;
		this._construct();
	}
	_const.prototype = {
		_construct:function(){
			//this._new = $("#new");
			this._new = $(".new");
			this._lesson = $("#lesson");
			// this._todayTime = $("#todayTime");
			this._bounce_lesson = $("#bounce_lesson");
			this._bounce_edit = $("#bounce_edit");
			this._bounce_detail = $("#bounce_datail");
			this._btnSubmit = $("#btnSubmit");
			this._btnCancel = $("#btnCancel");
			this._btnClose = $("#btnClose");
			//課程新增欄位
			this._lessonName = $("#lessonName");
			this._lessonCount = $("#lessonCount");
			this._lessonBuilding = $("#lessonBuilding");
			this._lessonFloor = $("#lessonFloor");
			this._lessonClass = $("#lessonClass");
			this._lessonTime = $("#lessonTime");
			this._lessonPeriod = $("#lessonPeriod");
			this._lessonPeople = $("#lessonPeople");
			this._lessonNote = $("#lessonNote");
			//form
			this._form_name = $(".form_name");
			this._form_count = $(".form_count");
			this._form_class = $(".form_class");
			this._form_time = $(".form_time");
			this._form_period = $(".form_period");
			this._form_people = $(".form_people");
			this._form_note = $(".form_note");
			this._form = $(".form");
			//detail
			this._lessonDetail = $("#lessonDetail");
			this._detailName = $("#detailName");
			this._detailData = $("#detailData");
			//查詢
			this._btnFilter = $("#btnFilter");
			this._cancelFilter = $("#cancelFilter");
			this._filterTimeZone = $("#filterTimeZone");
			this._filterClass = $("#filterClass");
			this._filterLocal = $("#filterLocal");
			//編輯課程
			this._EditlessonName = $("#EditlessonName");
			this._EditlessonTimes = $("#EditlessonTimes");
			this._EditlessonClass = $("#EditlessonClass");
			this._EditlessonClassTime = $("#EditlessonClassTime");
			this._EditlessonPeriod = $("#EditlessonPeriod");
			this._EditlessonPeople = $("#EditlessonPeople");
			this._EditlessonNote = $("#EditlessonNote");

			this._btnEditCancel = $("#btnEditCancel");
			this._btnEditSubmit = $("#btnEditSubmit");






			this._start();
		},
		_start:function(){
			var objThis = this;
			objThis._initialAll();

			objThis._getlessonIDList();
		},
		_initialAll:function(){

			//顯示當天時間
			// var now = new Date();
			// this._todayTime.append
      //   (   now.getFullYear() + '/' + (now.getMonth()+1) + '/'
      //     + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":"
      //     + now.getSeconds());

			//新增課程
			this._new.on("click",$.proxy(function(){
				this._lessonName.val("");
				this._lessonCount.val("");
				this._lessonTime.val("");
				this._lessonBuilding.val("請選擇");
				this._lessonPeriod.val("請選擇");
				this._lessonFloor.attr('disabled','');
				this._lessonFloor.empty();
				this._lessonClass.attr('disabled','');
				this._lessonClass.empty();
				this._lessonPeople.val("");
				this._lessonNote.val("");
				this._form.removeClass("has-error");
				//新增課程 視窗
				this._bounce_lesson.modal('show');
			},this));

			//清除查詢
			this._cancelFilter.on("click",$.proxy(function(){
				this._filterTimeZone.val('請選擇');
				this._filterClass.val('請選擇');
				this._filterLocal.val('請選擇');
			},this));
			//查詢
			this._btnFilter.on("click",$.proxy(function(){

			},this))

			//關閉課程明細
			this._btnClose.on("click",$.proxy(function(){
				this._bounce_detail.modal("hide");
			},this));

			//確認新增課程
			this._btnSubmit.on("click",$.proxy(function(){
				var objThis = this;
				if(this._checkSubmit())
				{
					bootbox.confirm({
            message:"<br/><b style='font-size:20px;'>確定申請 <font style='color:red;'>" + objThis._lessonName.val() + "</font> 課程嗎?</b><br/>" +
            "<br/><br/><b>地點：</b>" + objThis._lessonClass.val() +
            "<br/><br/><b>時間：</b>" + objThis._lessonTime.val() +
						"<br/><br/><b>課程堂數：</b>" + objThis._lessonCount.val() +
            "<br/><br/><b>時段：</b>" + objThis._lessonPeriod.val() +
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
										bootbox.alert("申請了課程 " + objThis._lessonName.val(),function(){
											var lessonData =
											{
												lessonName : objThis._lessonName.val(),
												lessonCount : objThis._lessonCount.val(),
												lessonBuilding : objThis._lessonBuilding.val(),
												lessonFloor : objThis._lessonFloor.val(),
												lessonClass : objThis._lessonClass.val(),
												lessonTime : objThis._lessonTime.val(),
												lessonPeriod : objThis._lessonPeriod.val(),
												lessonPeople : objThis._lessonPeople.val(),
												lessonNote : objThis._lessonNote.val()
											};
											$.ajax({
												type: "post",
												url: "/lessonManage",
												data: lessonData ,
												dataType: "json",
												success: function(message){
													if(message.success == 'yes')
													{
														layer.msg('<b>新增課程成功</b>', {time: 1500, icon:1,shade:[0.5,'black']});
													}
													else if(message.success == 'no')
													{
														layer.msg('<b>後續的課程有重複資料，不得審核通過</b>', {time: 1500, icon:2,shade:[0.5,'black']});
													}
												},
												error: function (xhr)
												{
													bootbox.alert('error: ' + xhr);console.log(xhr);
													layer.msg('<b>好像出現了意外錯誤</b>', {time: 1500, icon:2,shade:[0.5,'black']});
												}
											});
											// this._getlessonIDList(data);	/* 插入課程 */
											objThis._bounce_lesson.modal("hide");
										});

								}else{
									bootbox.alert("取消了申請課程");
								}
							}
						});
					}
			},this));
			//取消編輯課程
			this._btnEditCancel.on("click",$.proxy(function(){
				this._bounce_edit.modal("hide");
			},this));
			//取消新增課程
			this._btnCancel.on("click",$.proxy(function(){
				this._bounce_lesson.modal("hide");
			},this));

			//新英的彈跳視窗 隨地點自動更新
			this._lessonBuilding.on("change",$.proxy(function(){
				this._lessonClass.attr('disabled','');
				this._lessonClass.empty();
				switch (this._lessonBuilding.val()) {
					case '請選擇':
						this._lessonFloor.attr('disabled','');
						this._lessonFloor.empty();
						this._lessonClass.attr('disabled','');
						this._lessonClass.empty();
						break;
					case '環球':
						this._lessonFloor.removeAttr('disabled');
						this._lessonFloor.empty();
						this._lessonFloor.append("<option value='請選擇'>請選擇</option>");
						this._lessonFloor.append("<option value='環球3f'>3樓</option>");
						this._lessonFloor.append("<option value='環球12f'>12樓</option>");
						break;
					case '里仁':
						this._lessonFloor.removeAttr('disabled');
						this._lessonFloor.empty();
						this._lessonFloor.append("<option value='請選擇'>請選擇</option>");
						this._lessonFloor.append("<option value='里仁2f'>2樓</option>");
						break;
					case '學苑':
						this._lessonFloor.removeAttr('disabled');
						this._lessonFloor.empty();
						this._lessonFloor.append("<option value='請選擇'>請選擇</option>");
						this._lessonFloor.append("<option value='學苑7f'>7樓</option>");
						this._lessonFloor.append("<option value='學苑12f'>12樓</option>");
						this._lessonFloor.append("<option value='學苑13f'>13樓</option>");
						break;
				}
			},this))

			this._lessonFloor.on("change",$.proxy(function(){
				switch (this._lessonFloor.val()) {
					case '請選擇':
						this._lessonClass.attr('disabled','');
						this._lessonClass.empty();
						break;
					case '環球3f':
						this._lessonClass.removeAttr('disabled');
						this._lessonClass.empty();
						this._lessonClass.append("<option value='環球3-1'>3-1 (70人)</option>");
						this._lessonClass.append("<option value='環球3-2'>3-2 (60人)</option>");
						break;
					case '環球12f':
						this._lessonClass.removeAttr('disabled');
						this._lessonClass.empty();
						this._lessonClass.append("<option value='環球12-1'>12-1 (35人)</option>");
						this._lessonClass.append("<option value='環球12-2'>12-2 (35人)</option>");
						this._lessonClass.append("<option value='環球12-3'>12-3 (45人)</option>");
						break;
					case '里仁2f':
						this._lessonClass.removeAttr('disabled');
						this._lessonClass.empty();
						this._lessonClass.append("<option value='里仁2-1'>2-1 (80人)</option>");
						this._lessonClass.append("<option value='里仁2-2'>2-2 (20人會議室)</option>");
						break;
					case '學苑7f':
						this._lessonClass.removeAttr('disabled');
						this._lessonClass.empty();
						this._lessonClass.append("<option value='學苑7-4'>7-4 (40人)</option>");
						this._lessonClass.append("<option value='學苑7-5'>7-5 (40人)</option>");
						this._lessonClass.append("<option value='學苑7-6'>7-6 (45人)</option>");
						break;
					case '學苑12f':
						this._lessonClass.removeAttr('disabled');
						this._lessonClass.empty();
						this._lessonClass.append("<option value='學苑12-1'>12-1 (120人)</option>");
						break;
					case '學苑13f':
						this._lessonClass.removeAttr('disabled');
						this._lessonClass.empty();
						this._lessonClass.append("<option value='學苑13-3'>13-3 (20人)</option>");
						break;
				}
			},this))
		},

		_checkSubmit:function(){  // 確認新增課程欄位判斷
			var returnCheck = true;
			//課程名稱
			if(this._lessonName.val() == "")
			{
				returnCheck = false;
				this._form_name.addClass("has-error");
				layer.msg('<b>請輸入課程名稱</b>', {time: 1500, icon:2,shade:[0.5,'black']});
			}else
			{
				this._form_name.removeClass("has-error");
			}
			//課程時數
			var positiveInteger = /^[0-9]*[1-9][0-9]*$/ ;
			if(isNaN(this._lessonCount.val()) || this._lessonCount.val() < 1 || !positiveInteger.test(this._lessonCount.val()))
			{
				returnCheck = false;
				this._form_count.addClass("has-error");
				layer.msg('<b>請輸入阿拉伯數字(大於1)</b>', {time: 1500, icon:2,shade:[0.5,'black']});
			}else
			{
				this._form_count.removeClass("has-error");
			}
			//使用教室
			if(this._lessonClass.val() == '請選擇' || this._lessonFloor.val() == '請選擇' || this._lessonBuilding.val() == '請選擇')
			{
				returnCheck = false;
				this._form_class.addClass("has-error");
				layer.msg('<b>請選擇使用教室</b>', {time: 1500, icon:2,shade:[0.5,'black']});
			}else
			{
				this._form_class.removeClass("has-error");
			}
			//開始上課時間
			var correctTimeFormat = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/ ;
			if(this._lessonTime.val() == "" || !correctTimeFormat.test(this._lessonTime.val()))
			{
				returnCheck = false;
				this._form_time.addClass("has-error");
				layer.msg('<b>請輸入正確的時間格式</b>', {time: 1500, icon:2,shade:[0.5,'black']});
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
					layer.msg('<b>請選擇明天以後的上課時間</b>', {time: 1500, icon:2,shade:[0.5,'black']});
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
				layer.msg('<b>請選擇上課時段</b>', {time: 1500, icon:2,shade:[0.5,'black']});
			}
			else
			{
				this._form_period.removeClass("has-error");
			}

			//上課人數
			if(this._lessonPeople.val() == "" || this._lessonPeople.val() <1 || !positiveInteger.test(this._lessonPeople.val()))
			{
				returnCheck = false;
				this._form_people.addClass("has-error");
				layer.msg('<b>請輸入正確的上課人數格式</b>', {time: 1500, icon:2,shade:[0.5,'black']});
			}
			else
			{
				if (this._lessonClass.val() == undefined)
				{
					this._form_people.addClass("has-error");
					this._lessonPeople.val("");
					layer.msg('<b>請選擇教室再輸入人數</b>', {time: 1500, icon:2,shade:[0.5,'black']});
				}
				else
				{
					var checkPeopleNum = 1;
					var peopleNum = this._lessonPeople.val();
					var useClass = this._lessonClass.val();
					switch (useClass)
					{
						case '環球3-1':
						if (peopleNum <= 70) {checkPeopleNum = 0;}
						break;
						case '環球3-2':
						if (peopleNum <= 60) {checkPeopleNum = 0;}
						break;
						case '環球12-1':
						if (peopleNum <= 35) {checkPeopleNum = 0;}
						break;
						case '環球12-2':
						if (peopleNum <= 35) {checkPeopleNum = 0;}
						break;
						case '環球12-3':
						if (peopleNum <= 45) {checkPeopleNum = 0;}
						break;
						case '里仁2-1':
						if (peopleNum <= 80) {checkPeopleNum = 0;}
						break;
						case '里仁2-2':
						if (peopleNum <= 20) {checkPeopleNum = 0;}
						break;
						case '學苑7-4':
						if (peopleNum <= 40) {checkPeopleNum = 0;}
						break;
						case '學苑7-5':
						if (peopleNum <= 40) {checkPeopleNum = 0;}
						break;
						case '學苑7-6':
						if (peopleNum <= 45) {checkPeopleNum = 0;}
						break;
						case '學苑12-1':
						if (peopleNum <= 120) {checkPeopleNum = 0;}
						break;
						case '學苑13-3':
						if (peopleNum <= 20) {checkPeopleNum = 0;}
						break;
					}
					if (checkPeopleNum == 1)
					{
						returnCheck = false;
						this._form_people.addClass("has-error");
						layer.msg('<b>輸入人數超出教室容量</b>', {time: 1500, icon:2,shade:[0.5,'black']});
					}
					else
					{
						this._form_people.removeClass("has-error");
					}
				}
			}
			return returnCheck;
		},
		_getlessonIDList:function(){	/* 插入課程 */
			var objThis = this;
			$.ajax({
				type: "post",
				url: "/getAllPassLesson",
				dataType: "json",
				success: function(datas){
						console.log(datas)
						if(datas.success == 'yes'){
							objThis._setlessonIDList(datas.howLesson);
						}
				},
				error: function (xhr)
				{
					bootbox.alert('error: ' + xhr);console.log(xhr);
					layer.msg('<b>好像出現了意外錯誤</b>', {time: 1500, icon:2,shade:[0.5,'black']});
				}
			});



		},
		_setlessonIDList:function(data){
			var objThis = this;
			var _td;
			var _tr;
			console.log(data)
			$.each(data,function(i,v){
				switch(i%3){
					case 0:
					css = "danger";
					break;
					case 1:
					css = "active";
					break;
					case 2:
					css = "warning";
					break;
				}

				_tr = $("<tr />",{"class":css});

				//#
				_td = $("<td />",{"text":(i+1)});
				_tr.append(_td);

				//課程名稱
				_td = $("<td />",{"text":v.name});
				_tr.append(_td);
				//使用教室
				_td = $("<td />",{"text":v.lessonClass});
				_tr.append(_td);
				//時間-時段
				_td = $("<td />",{"text":v.time + "-" + v.period});
				_tr.append(_td)
				//編輯 刪除
				_td = $("<td />");
				_input = $("<span />",{"class":"label label-success","text":"編輯","style":"font-size:100%;"});
				_input.bind("click",function(){
						// bootbox.alert("編輯" + v.lessonID)
						objThis._EditlessonName.html("<font style='color:blue;'>" + v.name + "</font>  ");
						var arrTimes = v.lessonID.split('-');
						objThis._EditlessonTimes.html("第 <b style='color:red;'>" + arrTimes[2] + "</b> 次上課")
						objThis._EditlessonClass.val('');
						objThis._EditlessonClassTime.val(v.time);
						objThis._EditlessonPeriod.val(v.period);
						objThis._EditlessonPeople.val(v.people);
						objThis._EditlessonNote.val(v.note);


						objThis._bounce_edit.modal("show");
				})
				_td.append(_input);
				_input = $("<span />",{"class":"label label-danger","text":"刪除","style":"margin-left:10px;font-size:100%;"});
				_input.bind("click",function(){
						var arrTimes = v.lessonID.split('-');

							bootbox.prompt({
								title:"<b style='font-size:20px;'>您確定要刪除 <font style='color:red;'>" + v.name + "</font> 課程嗎?</b>" +
								"<br/><br/>第 <font style='color:red;'>" + arrTimes[2] + "</font> 次上課" +
								"<br/><br/>使用教室：" +
								"<br/><br/>上課時間：" + v.time +
								"<br/><br/>上課時段：" + v.period +
								"<br/><br/>上課人數：" + v.people +
								"<br/><br/>備註：" + v.note +
								"<br/><br/><br/><br/><b style='font-size:20px;color:red;'>請輸入密碼</b>",

								inputType:'password',
								buttons:{
									confirm:{
											label:'確定刪除',
											className:'btn-success'
									},
									cancel:{
											label:'取消',
											className:'btn-default'
									}

								},
								callback:function(result){
										console.log(result)
										console.log(v.lessonID)
								}
							})

							setTimeout("$('.bootbox-input').val('')",500)
				})
				_td.append(_input);
				_tr.append(_td);
				objThis._lesson.append(_tr);
			})
		}
	}
	return _const;
}());

var lessonManage;
$(function(){
	lessonManage = new lessonManage();
})
