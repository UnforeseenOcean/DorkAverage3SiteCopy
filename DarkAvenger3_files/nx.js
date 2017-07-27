function cleanup(id) {
    $('#' + id).val('');
}

(function ($win, $doc, undfined) {
    $doc.ready(function () {
        $('#user_phone_nick').keydown(function (e) {
            $('#confirm_code').val('');
        });
        function errorNick(){
        	alert('점검 중입니다.');
        	return false;
        }
        //SMS인증발송
         var isClickNick = false;
	    $("#send").click(function () {
	    	 if(!isClickNick){
	    	 	isClickNick = true;
	        if (validationChk(0)) {
	            var phone = $('#user_phone_nick').val();
	            $.ajax({
	                type: 'POST',
	                url: "https://mobilewebapi.nexon.com/SMS/sendSmsNew",
	                dataType: "json",
	                data: {
	                    eventName: "Da3_20170608",
	                    systemCode: "dav3",
	                    DepartCode: "nexon39",
	                    revPhoneNo: phone
	                },
	                success: function (data) {
	                    if (data.success) {
	                    		isClickNick = false;
	                        alert("발송에 성공했습니다.");
	                    } else {
	                    		isClickNick = false;
	                        alert(data.message);
	                    }
	                },
	                error: function (xhr, status, e) {
	                	isClickNick = false;
	                    alert("발송에 실패했습니다.\n잠시 후 다시 시도해주세요.");
	                }
	            });
	        }else{isClickNick = false;}
            }else{
            	alert('처리 중입니다.\n잠시만 기다려주세요.');
            }
	    });

        //인증코드확인
	    $("#check").click(function () {
    		if(!isClickNick){
    		   isClickNick = true;
	        if (validationChk(1)) {
	            $.eventName = 'Da3_20170608'
	            $.phoneNumber = $('#user_phone_nick').val();
	            $.code = $('#user_num_nick').val();
	            //console.log($.phoneNumber);
	            $.ajax({
	                type: 'POST',
	                url: "https://mobilewebapi.nexon.com/SMS/chkSmsNew",
	                dataType: "json",
	                data: {
	                    eventName: $.eventName,
	                    AuthenticationCode: $.code,
	                    phoneNumber: $.phoneNumber
	                },
	                success: function (data) {
	                    if (data.success) {
	                        $('#confirm_code').val($.code);
	                         isClickNick = false;
	                        alert("인증에 성공했습니다.");
	                    }
	                    else {
	                    	 isClickNick = false;
	                        alert(data.message);
	                    }

	                },
	                error: function (xhr, status, e) {
	                	 isClickNick = false;
	                     alert("정보확인에 실패했습니다.\n잠시 후 다시 시도해주세요.");
	                }
	            });
	        }else{isClickNick = false;}
          }else{
          	   alert('처리 중입니다.\n잠시만 기다려주세요.');
          }
	    });

        //선점한캐릭명확인
	    $('#btn_confirm_nick').on('click', function () {

    		if(!isClickNick){
	    	   isClickNick = true;
	        $.eventName = 'Da3_20170608';
	        $.phoneNumber = $('#user_phone_nick').val();
	        $.authCode = $('#user_num_nick').val();
	        if (validationChk(4)) {
	            $.ajax({
	                type: 'POST',
	                url: "https://mobilewebapi.nexon.com/Character/SelectCharacterUserCallNew",
	                dataType: "json",
	                data: {
	                    eventName: $.eventName,
	                    phoneNumber: $.phoneNumber,
	                    authCode: $.authCode
	                },
	                success: function (data) {
	                    if (data.success) {
	                        var nick = data.info.CharacterName;
	                        var code = data.info2;
	                        if (nick == '' || code == '') {
	                            alert("선점한닉네임이 존재하지 않습니다.");
	                        } else {
	                            confirmNick(nick, code);
	                        }
	                    } else {
	                        confirmNick("", "");
	                    }
	                     isClickNick = false;
	                },
	                error: function (xhr, status, e) {
	                	 isClickNick = false;
	                    alert("정보확인에 실패했습니다.\n잠시 후 다시 시도해주세요.");
	                }
	            });
	        }else{isClickNick = false;}
           }else{
           	alert('처리 중입니다.\n잠시만 기다려주세요.');
           }
	    });

        //사전예약쿠폰확인
	    $('#btn_confirm_coupon').on('click', function () {
	    	alert('곧, 사전예약 쿠폰을 확인하실 수 있습니다.\n07/28(금) 오픈 예정!');
	    });

	    function validationChk(fn) {
	        //fn 0: 핸드폰인증(default), 1: 인증번호확인, 2:닉네임중복체크, 3:선점등록, 4:선점정보확인

	        var phone = $('#user_phone_nick');
	        var chname = $('#user_nick').val();
	        var txt = "닉네임 확인하기";
	        if (fn == 5) txt = "사전예약쿠폰 확인하기";
	        var i, len;
	        userPhone = '';

	        for (i = 0, len = phone.length; i < len; i++) {
	            userPhone += $(phone[i]).val().replace(/ /gi, '');
	        }
	        var regExp = /^[0|1]/;

	        if (userPhone == '' || userPhone.length != 11 || regExp.test(userPhone.substring(3, userPhone.length - 1))) {
	            if (fn == 0) alert("정확한 핸드폰번호를 입력해주세요.");
	            else if (fn == 1) alert("인증번호를 입력해주세요.");
                else alert("휴대폰 번호를 입력해서 인증을 마치신 후 [" + txt + "] 버튼을 다시 눌러 주세요.");
	            return false;
	        }
	        if (userPhone.substring(0, 3) != '010') {
	            alert('010 번호만 입력가능합니다.');
	            return false;
	        }
	        if (fn == 1 || fn == 4 || fn == 5) {
                var user_num_nick = $('#user_num_nick').val();
                if (user_num_nick == '' || user_num_nick.length == 0) {
                    if (fn == 1) alert("인증번호를 입력해주세요.");
                    else alert("휴대폰 번호를 입력해서 인증을 마치신 후 [" + txt + "] 버튼을 다시 눌러 주세요.");
                    return false;
                }
            }
	        if (fn == 3 || fn == 4 || fn == 5) {
                var confirm_code = $('#confirm_code').val();
                if (confirm_code == '' || confirm_code.length == 0) {
                    alert("휴대폰 번호를 입력해서 인증을 마치신 후 ["+txt+"] 버튼을 다시 눌러 주세요.");
	                return false;
	            }
	        }
	        return true;
	    }

	    var getParamMap = function () {
	        var urlParams = {};
	        {
	            var queryString = window.location.search.substring(1);
	            var regex = /([^&=]+)=?([^&]*)/g;
	            var match;
	            while (match = regex.exec(queryString)) {
	                var paramName = decodeURIComponent(match[1].replace(/\+/g, " "));
	                var paramValue = decodeURIComponent(match[2].replace(/\+/g, " "));
	                urlParams[paramName] = paramValue;
	            }
	        }
	        return urlParams;
	    }

	      // url parse
	    var parseHostUrl = function () {
	        var urlParams = getParamMap();
	        var urlString = urlParams["hostUrl"] || "";
	        return urlString;
	    };

	    var parseAdPick = function () {
	        var urlParams = getParamMap();
	        var urlString = urlParams["_code"] || "";
	          return urlString;
	    };
	});
})(jQuery(window), jQuery(document));