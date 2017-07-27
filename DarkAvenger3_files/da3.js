jQuery.fn.center = function (type) {
	var top, left;

	if(config.isSoundPlay && $(this).hasClass('pop_sound')){
		config.stopSoundForPop = true;
		$('.btn_sound_controll').trigger('click');
	}

	top = (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop();
	left = (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft();
	this.css('position','absolute');
	if($(this).hasClass('char_player')){
		left += -280;
	}else if($(this).hasClass('pop')){
		this.css('top', top + 'px');
	}
	this.css('left', left + 'px');
	return this;
};

function confirmCoupon(obj){
	var ele0, ele1;

	ele0 = '<p class="none_coupon">참여한 이력이 없습니다.</p>';
	ele1 = '<p class="none_coupon">참여한 이력이 없습니다.</p>';
	$('#dimmed').show();
	if(obj.cbt.length){
		ele0 = '';
		ele0 += '<ol>';
		for(var i = 0, len = obj.cbt.length; i < len; i++){
			ele0 += '<li>- 쿠폰번호 : ' + obj.cbt[i] + '</li>';
		}
		ele0 += '</ol>';
	}
	if(obj.launching.length){
		ele1 = '';
		ele1 += '<ol>';
		for(var i = 0, len = obj.launching.length; i < len; i++){
			ele1 += '<li>- 쿠폰번호 : ' + obj.launching[i] + '</li>';
		}
		ele1 += '</ol>';
	}
	$('#pop_confirm_coupon .cbt').html(ele0);
	$('#pop_confirm_coupon .launching').html(ele1);
	$('#pop_confirm_coupon').center().show();
}
function confirmNick(nick, num){
	var ele0;

	ele0 = '<p class="none_coupon">참여한 이력이 없습니다.</p>';

	$('#dimmed').show();
	if(nick && num){
		ele0 = '';
		ele0 += '<p class="user_nick">-닉네임 : ' + nick + '</p><p class="user_number">-인증번호 : ' + num + '</p>'
	}else{
		$('#pop_confirm_nick .user_nick').html('-닉네임 : ' + nick);
		$('#pop_confirm_nick .user_number').html('-인증번호 : ' + num);
	}
	$('#pop_confirm_nick .nick').html(ele0);
	$('#pop_confirm_nick').center().show();
}

// function shareFacebook(share) {
// 	FB.ui(share, function(response){
// 		console.dir(response);
// 	});
// }

var config;
(function($, $win, $doc, undefined){
	var ele, fn;
	config = {
		isIE : false,
		checkEqualizer : false,
		checkOneTime : [],
		minHeight : 0,
		count :0,
		charCount : 0,
		percent : 0, // 프리로드 퍼센트
		prevSectionKey : -1,
		nextSectionKey : 0,
		sectionLength : 0,
		enterTimer : 1000, // ie9 이하는 10으로 세팅 필요
		leaveTimer : 10,
		fog : true,
		prevSectionClass : [],
		nextSectionClass : [],
		stopSoundForPop : false,
		isSoundPlay : false,
		isAnimate : false, // 섹션 내 애니메이션 중인지
		isChangeSection : false, // 섹션 전환 애니메이션 중인지
		isExistVerticalScroll : false, // 현재 세로 스크롤이 존재하는지
		isScrollEndPointTop : false, // 현재 세로 스크롤이 최상단에 위치하는지
		isScrollEndPointBottom : false, // 현재 세로 스크롤이 최하단에 위치하는지
		preventScroll : false // 스크롤 이벤트 방지
	};
	fn = {
		startFog : function(){
			var fogCnt = 4158;
			var t = setInterval(function(){
				if(!config.fog){
					clearInterval(t)
					return;
				}
				if(fogCnt <= 320){
					fogCnt = 4158;
					clearInterval(t)
					$('.fog').css('left', '-' + 320 + 'px');
					fn.startFog();
				}else{
					fogCnt--;
					$('.fog').css('left', '-' + fogCnt + 'px');
				}
			}, 20);
		},
		checkBrowser : function(){
			var deviceAgent = {
				version : navigator.userAgent.toLowerCase()
			};
			if(window.navigator.userAgent.search(/trident/i) != -1){ // ie
				config.isIE = true;
				if(parseInt(deviceAgent.version.match(/trident\/(\d.\d)/i)[1], 10) <= 5 || deviceAgent.version.indexOf('msie 9.0') != -1){ // ie8 ~ ie9
					$('#ie_guide').show();
					config.enterTimer = 10;
				}
			}else{ // ie 외 브라우저
				config.isIE = false;
			}
			// else if(deviceAgent.version.indexOf('chrome') != -1){ //chrome

			// }
		},
		checkPopDisplay : function(){
			var result;

			result = false;
			$('.pop').each(function(){
				if($(this).css('display') == 'block')result = true;
			});
			return result;
		},
		setVerticalContent : function(){
			var winH, conH;

			winH = $win.height();
			conH = ele.contents.height();

			winH = winH < conH ? conH : winH;
			ele.contents.css('margin-top', (winH - conH) / 2 + 'px');
		},
		setState : function(){
			$(ele.sections[config.prevSectionKey]).removeClass(config.prevSectionClass.join(' '));
			$(ele.sections[config.nextSectionKey]).removeClass(config.nextSectionClass.join(' '));
			config.isChangeSection = false;
			config.count = config.prevSectionKey = config.nextSectionKey;
		},
		setExistScroll : function(){
			if($win.height() < config.minHeight) config.isExistVerticalScroll = true;
			else config.isExistVerticalScroll = false;

			if(config.isExistVerticalScroll) $('body').addClass('is_scroll');
			else $('body').removeClass('is_scroll');
		},
		setScrollTop : function(){
			$('html, body').scrollTop(0);
		},
		setPlayer : function(){
			var winH, winW,
				h, w;

			winH = $win.height();
			winW = $win.width();

			winH = winH < config.minHeight ? config.minHeight : winH;
			winW = winW < 1200 ? 1200 : winW;

			// $('#section1').height(winH);

			h = winH;
			w = 16 * h / 9;

			if(w < winW){
				w = winW;
				h = 9 * w / 16;
			}

			ele.videos.css({
				'width' : w,
				'height' : h
			});

			if(winW <= 1200) return;
			$(ele.videos).each(function(){
				$(this).center();
			});
		},
		setCenterPop : function(){
			$('.pop').each(function(){
				if($(this).css('display') == 'block') $(this).center();
			});
		},
		setFrameChar : function(){
			var frameImgPath = [
				'http://nxm-mt.akamaized.net/Contents/da3.nexon.com/LaunchDownload/images/frame_char0/',
				'http://nxm-mt.akamaized.net/Contents/da3.nexon.com/LaunchDownload/images/frame_char1/',
				'http://nxm-mt.akamaized.net/Contents/da3.nexon.com/LaunchDownload/images/frame_char2/'
			];

			var obj = {};
			//$(".threesixty_images li").remove(); // 새로고침돌
			for(var i = 0; i < 3; i++){
				(function(i){
					// var pop1_360;
					var frame_total;
					var frame_value;
					var frame_per;
					var frame_total = 71; //이미지 총 갯수
					obj['char' + i] = $('.rotation' + i).ThreeSixty({
						totalFrames: frame_total, // 총 아니요. 360 슬라이더 용 이미지
						endFrame: frame_total, // 자동 스핀 애니메이션의 끝 프레임
						currentFrame: 1, // 자동 스핀의 시작 프레임
						imgList: '.threesixty_images', // 이미지 목록 선택자
						progress: '.spinner', // 선별기로드 진행률 표시
						imagePath: frameImgPath[i], // 이미지 경로
						filePrefix: 'frame_', // 파일 접두사가있는 경우
						ext: '.png', // 이미지 파일 종류
						width: 440, //넓이값
						height: 780,//높이값
						drag: true,//드래그 사용여부
						//responsive: true,
						navigation: false,
						disableSpin: true, // true; 처음 회선 하지 안음
						onReady:function(){
							obj['char' + i].gotoAndPlay(36);
						}
					});

					$( "#slider" + i).slider({
						create: function() {
							//$(".drag_bar .num").text( $( this ).slider( "value" ) );
							frame_per = $( this ).slider( "value" );
							frame_value = Math.abs(Math.floor(frame_total / 100 * frame_per));
							obj['char' + i].gotoAndPlay(frame_value);
						},
						slide: function( event, ui ) {
							//$(".drag_bar .num").text( ui.value );
							frame_per = ui.value;
							frame_value = Math.abs(Math.floor(frame_total / 100 * frame_per));
							obj['char' + i].gotoAndPlay(frame_value);
						}
					});
				})(i);
			}
			return obj;
		},
		popMovie : function(obj, url){
			obj.find('.player').html('<div class="iframe_cover"></div><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + url + '?autoplay=1&autohide=1&nohtml5=1&controls=1&loop=1&playlist=' + url + '&rel=0&fs=1&wmode=transparent&showinfo=0&modestbranding=1&iv_load_policy=1&start=0&theme=dark&vq=hd1080&color=red&enablejsapi=1" frameborder="0" allowfullscreen></iframe>');
			setTimeout(function(){
				obj.find('.iframe_cover').remove();
			}, 500);
		},
		stopCharVideo : function(){
			var i, len;

			for(i = 0, len = ele.controllersChar.length; i < len; i++){
				ele['videoChar' + i].pause();
				$(ele['videoChar' + i]).css('opacity', 0);
			}
		},
		triggerEvent : function(delta){
			if(config.isAnimate && !config.isExistVerticalScroll) return; // 섹션 내 애니메이션 중이고, 세로 스크롤이 없으면
			if(fn.checkPopDisplay()) return false; // 레이어팝업이 노출되어 있는 경우
			if(config.prevSectionKey == 2){ // 캐릭터 섹션이면 휠 기능이 섹션이 아닌 내부 캐릭터 전환으로 반영
				if(delta > 0 && config.charCount > 0){
					$(ele.controllersChar[--config.charCount]).trigger('click');
					return false;
				}else if(delta < 0 && config.charCount < 2){
					$(ele.controllersChar[++config.charCount]).trigger('click');
					return false;
				}
			}

			if (delta > 0 && config.count > 0){ // up
				--config.count;
			}else if (delta < 0 && config.count < config.sectionLength - 1){ // down
				++config.count;
			}else{
				return;
			}

			config.nextSectionKey = config.count;
			// config.nextSectionKey = (config.count + config.sectionLength) % config.sectionLength;
			$('.btn_section[data-key="' + config.nextSectionKey + '"]').trigger('click');
		},
		initSection : function(sectionKey){
			if(sectionKey == 0){
				ele.videoMain.load();
				ele.videoMain.play();
				config.isAnimate = true;
				setTimeout(function(){
					$('#section' + sectionKey).addClass('obj_action_repeat');
					config.isAnimate = false;
				}, config.enterTimer);
			}else if(sectionKey == 1){ // 섹션 1로 오는거면
				config.fog = true;
				fn.startFog();
			}else if(sectionKey == 2){ // 섹션 2로 오는거면
				if(config.delta > 0){ // 섹션 3 > 2로 오는 거면 마지막 캐릭터 소개 강제 활성
					$(ele.controllersChar[2]).trigger('click');
				}else{ // 그 외 섹션 2로 오는 모든 로투의 경우 첫번째 캐릭터 소개 강제 활성
					$(ele.controllersChar[0]).trigger('click');
				}
			}else if(sectionKey == 3){
				ele.videoMedia.load();
				ele.videoMedia.play();
				config.isAnimate = true;
				setTimeout(function(){
					$('#section' + sectionKey).addClass('obj_action_repeat');
					setTimeout(function(){config.isAnimate = false;}, config.enterTimer / 2);
				}, config.enterTimer);
			}else if(sectionKey == 4){
				config.isAnimate = true;

				(function(sectionKey){
					$('#section' + sectionKey + ' .inner_scale').addClass('obj_action');
					setTimeout(function(){
						$('#section' + sectionKey + ' .con_wrapper >.inner').addClass('obj_action');
						$('#section' + sectionKey + ' .con').addClass('obj_action');
						$('#section' + sectionKey + ' .con_wrapper').addClass('obj_action');
						if(!config.checkOneTime[sectionKey] && sectionKey != 6){
							config.checkOneTime[sectionKey] = sectionKey;
							setTimeout(function(){config.isAnimate = false;}, config.enterTimer * 1.3);
						}else{
							config.isAnimate = false;
						}
					}, config.enterTimer);
				})(sectionKey);
			}

			if(config.prevSectionKey == 0){ // 섹션 0에서 떠나는 경우 섹션 2의 모든 캐릭터 영상 비활성
				ele.videoMain.pause();
			}else if(config.prevSectionKey == 1){ // 섹션 1에서 떠나는 경우 섹션 2의 모든 캐릭터 영상 비활성
				config.fog = false;
			}else if(config.prevSectionKey == 2){ // 섹션 2에서 떠나는 경우 섹션 2의 모든 캐릭터 영상 비활성
				fn.stopCharVideo();
			}else if(config.prevSectionKey == 3){ // 섹션 2에서 떠나는 경우 섹션 2의 모든 캐릭터 영상 비활성
				ele.videoMedia.pause();
			}else if(config.prevSectionKey > 2 && config.prevSectionKey <= 6){
				// console.log(config.prevSectionKey);
				// (function(prevSectionKey){
				// 	setTimeout(function(){
				// 		$('#section' + config.prevSectionKey + '>.inner').removeClass('obj_action');
				// 		$('#section' + config.prevSectionKey + ' form').removeClass('obj_action');
				// 	}, config.leaveTimer);
				// })(config.prevSectionKey);
			}
		},
		bar : function(){
			config.isChangeSection = true;
			var c = 0, p = $('#preload_wrap'), a = p.find('.txt_caution'), t = p.find('.txt_percent'), l = p.find('.bar i.on');

			function randomRange(n1, n2) {
				return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
			}
			function callback(s){
				setTimeout(function(){
					a.css('opacity', (100 - c) / 100);
					if(config.percent < c) c = config.percent; // 로딩 지연일 경우
					if(++c > 100){
						$('.temp').remove();
						p.addClass('end');
						config.isChangeSection = false;
						fn.setPlayer();
						$('.btn_section[data-key="0"]').trigger('click');
						$('.btn_sound_controll').trigger('click');
						setTimeout(function(){
							p.addClass('delay');
							setTimeout(function(){
								p.hide();
							}, 1000);
						}, 990);
						return;
					}
					l.css('width', c + '%');
					t.html(c + '%');
					if(c < 8) callback(randomRange(10, 400));
					else callback(randomRange(10, 80));
				}, s - c);
			}
			callback(randomRange(1, 150));
		},
		equalizer : function(){
			var e = $('.equalizer'), b = e.find('i'),
				i, len;
			function randomRange(n1, n2) {
				return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
			}
			function repeat(obj, time){
				setTimeout(function(){
					if(!config.checkEqualizer){
						b.removeClass('active');
						return; // 재귀 중단
					}

					if(obj.hasClass('active')) obj.removeClass('active');
					else obj.addClass('active');

					repeat(obj, randomRange(10, 200));
				}, time);
			}


			for(i = 0, len = b.length; i < len; i++){
				repeat($(b[i]), randomRange(10, 200));
			}
		}
	};
	$doc.ready(function(){
		var tempImg = [];
		var i, j, len;
		for(i = 0; i < 3; i++){
			for(j = 0; j < 72; j++){
				tempImg.push('<li><img src="http://nxm-mt.akamaized.net/Contents/da3.nexon.com/LaunchDownload/images/frame_char' + i + '/frame_' + j + '.png"></li>');
			}
		}
		$('.temp').html(tempImg);

		$('body').DEPreLoad({
			OnStep: function(percent) {
				config.percent = percent;
			},
			OnComplete: function(){
				// $('.temp').remove();
			}
		});
		fn.bar();
		// $('#preload_wrap').hide();

		ele = {
			dimmed : $('#dimmed'),
			contents : $('.con_wrapper'),
			controllers : $('#aside').find('.btn_section'),
			sections : $('#container').find('.section'),
			containerChar : $('#char'),
			controllersChar : $('.nav_char').find('button'),
			btnMovieMain : $('#section0').find('.btn_movie'),
			btnMovieInfo : $('#section1').find('.btn_movie'),
			videoMain : document.getElementById('main_player'),
			videoChar0 : document.getElementById('char_player0'),
			videoChar1 : document.getElementById('char_player1'),
			videoChar2 : document.getElementById('char_player2'),
			videoMedia : document.getElementById('media_player'),
			videos : $('.video_bg').find('video'),
			tabMedia : $('#pop_media ol li button')
		};
		config.sectionLength = ele.sections.length;
		config.minHeight = parseInt($('body').css('min-height'), 10);

		ele.controllers.on('click', function(){
			var $self, dataKey, effect;

			$self = $(this);
			dataKey = parseInt($self.attr('data-key'));
			if(config.isChangeSection || config.prevSectionKey == dataKey || config.isAnimate && !config.isExistVerticalScroll){
				return false;
			}

			config.nextSectionKey = dataKey;
			config.isChangeSection = true;


			if(config.prevSectionKey < config.nextSectionKey) effect = 'small';
			else if(config.prevSectionKey > config.nextSectionKey) effect = 'big';

			config.prevSectionClass = ['obj_action_repeat', 'action', 'fade_in', 'fade_out_' + effect];
			config.nextSectionClass = [effect, 'fade_in_' + effect];

			$(ele.sections[config.prevSectionKey]).addClass('fade_out_' + effect);
			$(ele.sections[config.nextSectionKey]).addClass(effect);

			setTimeout(function(){
				fn.setState();
			}, 410);

			$(ele.sections[config.nextSectionKey]).addClass('action');


			ele.controllers.removeClass('active');

			// if(config.nextSectionKey >= 3 && config.nextSectionKey <= 6){
			// 	$('#aside #nav li.i3 button').addClass('active');
			// }

			$('.btn_section[data-key="' + config.nextSectionKey + '"]').addClass('active');

			fn.initSection(config.nextSectionKey);

			setTimeout(function(){
				$('html, body').stop(true).animate({ 'scrollTop': '1px' }, 10, function(){
					config.isScrollEndPointBottom = false;
					config.isScrollEndPointTop = true;
					config.preventScroll = false;
				});
				$(ele.sections[config.nextSectionKey]).addClass('fade_in fade_in_' + effect);
			}, 10);

			// $(ele.sections[config.nextSectionKey]).addClass('fade_in_' + effect);
		});

		fn.checkBrowser();
		fn.setExistScroll();
		fn.setVerticalContent();
		var objChar = fn.setFrameChar();
		$win.on({
			'scroll' : function(){
				// if(config.isScrollEndPointBottom && delta > 0 || config.isScrollEndPointTop && delta < 0){
				// 	config.isScrollEndPointTop = false;
				// 	config.isScrollEndPointBottom = false;
				// }
			},
			'resize' : function(){
				fn.setExistScroll();
				fn.setVerticalContent();
				fn.setPlayer();
				fn.setCenterPop();
			},
			'load' : function(){
				// $('.btn_section[data-key="3"]').trigger('click');
				fn.setPlayer();
			}
		});

		$('#container').mousewheel(function(event, delta) {
			if(config.isChangeSection || config.isAnimate) return false; // 섹션 전환 애니메이션이 진행 중인 경우
			if(fn.checkPopDisplay()) return false; // 레이어팝업이 노출되어 있는 경우

			config.delta = delta;
			if(!config.isExistVerticalScroll){
				fn.triggerEvent(delta);
				return false;
			}else if(config.isExistVerticalScroll){
				if(!config.preventScroll){
					config.preventScroll = true;
					var scrollEnd = Math.floor(($doc.height() - $win.height()) * 0.99);
					var scrollTop = Math.floor($win.scrollTop());
					if(Math.abs(scrollTop - scrollEnd) < 2) scrollTop = scrollEnd; // 스크롤 오차 범위 +- 2px까지 허용
					if(delta < 0 && scrollTop < scrollEnd){
						$('html, body').stop(true).animate({ 'scrollTop': scrollEnd + 'px' }, 100, function(){
							setTimeout(function(){config.preventScroll = false;}, 10);
						});
					}else if(delta > 0 && scrollTop > 1){
						$('html, body').stop(true).animate({ 'scrollTop': '1px' }, 100, function(){
							setTimeout(function(){config.preventScroll = false;}, 10);
						});
					}else{
						setTimeout(function(){config.preventScroll = false;}, 10);
						fn.triggerEvent(delta);
					}
					return false;
				}
				return false;
			}
		});

		ele.controllersChar.on('click', function(){
			var $self, dataChar,
				i, len;

			$self = $(this);

			// if($self.hasClass('active')) return;
			if(config.isAnimate) return;

			if(config.isExistVerticalScroll) $('html, body').stop(true).animate({ 'scrollTop': '1px' }, 10, function(){
				config.isScrollEndPointBottom = false;
				config.isScrollEndPointTop = true;
				config.preventScroll = false;
			});

			config.isAnimate = true;
			ele.controllersChar.removeClass('active');
			$self.addClass('active');
			dataChar = parseInt($self.attr('data-char'), 10);
			config.charCount = dataChar;

			for(i = 0, len = ele.controllersChar.length; i < len; i++){
				if(i != dataChar){
					ele.containerChar.removeClass('char' + i);
					ele['videoChar' + i].pause();
					$(ele['videoChar' + i]).css('opacity', 0);
				}
			}
			ele.containerChar.addClass('char' + dataChar);
			ele['videoChar' + dataChar].load();
			ele['videoChar' + dataChar].play();

			setTimeout(function(){
				$(ele['videoChar' + dataChar]).css('opacity', 1);
			}, 300);

			setTimeout(function(){
				config.isAnimate = false;
			}, 700);
		});

		$('.btn_movie_char').on('click', function(){
			var $self, obj, url;

			$self = $(this);
			obj = $('#pop_movie');
			url = $self.attr('data-url');

			fn.stopCharVideo(); // 캐릭터 소개에서 레이어 팝업 열면 배경 영상 모두 정지

			ele.dimmed.show();
			obj.center().show();
			fn.popMovie(obj, url);
		});
		$('.btn_vr_char').on('click', function(){
			var $self, obj, pop;

			$self = $(this);
			pop = $self.attr('data-pop');
			obj = $('#pop_char' + pop);

			fn.stopCharVideo(); // 캐릭터 소개에서 레이어 팝업 열면 배경 영상 모두 정지
			objChar['char' + pop].gotoAndPlay(0);

			ele.dimmed.show();
			obj.center().show();
		});

		$('#section3 ol li button').on('click', function(){
			var $self, obj, tab;

			$self = $(this);
			obj = $('#pop_media');
			tab = parseInt($self.attr('data-tab'), 10);

			ele.dimmed.show();
			obj.center().show();

			ele.videoMedia.pause();
			$(ele.tabMedia[tab]).trigger('click');
		});

		ele.tabMedia.on('click', function(){
			var $self, obj, url;

			$self = $(this);
			url = $self.attr('data-url');
			obj = $('#pop_media');

			ele.tabMedia.removeClass('active');
			$self.addClass('active');
			fn.popMovie(obj, url);
		});

		ele.btnMovieMain.on('click', function(){
			var $self, obj, url;

			$self = $(this);
			url = $self.attr('data-url');
			obj = $('#pop_movie');

			ele.dimmed.show();
			obj.center().show();

			ele.videoMain.pause();

			fn.popMovie(obj, url);
		});
		ele.btnMovieInfo.on('click', function(){
			var $self, obj, url;

			$self = $(this);
			url = $self.attr('data-url');
			obj = $('#pop_movie');

			ele.dimmed.show();
			obj.center().show();
			fn.popMovie(obj, url);
		});

		$('.btn_movie_creater').on('click', function(){
			var $self, obj, url;

			$self = $(this);
			url = $self.attr('data-url');
			obj = $('#pop_movie');

			ele.dimmed.show();
			obj.center().show();
			fn.popMovie(obj, url);
		});

		$('.input_txt li .input_wrap input').on('focus', function(){
			var $self, parents;

			$self = $(this);
			parents = $self.parents('li');
			if(parents.hasClass('focus') || $self.val() != '') return;
			parents.addClass('focus');
		}).on('blur', function(){
			var $self, parents;

			$self = $(this);
			parents = $self.parents('li');
			if($self.val() != '') return;
			parents.removeClass('focus');
		});

		$('#container #section6 .con .inner ol li a').on('mouseenter', function(){
			var $self, dataType;

			$self = $(this);
			dataType = $self.attr('data-type');

			$('#container #section6 .con div.clearFix div.' + dataType).addClass('obj_action');
		}).on('mouseleave', function(){
			var $self, dataType;

			$self = $(this);
			dataType = $self.attr('data-type');

			$('#container #section6 .con div.clearFix div.' + dataType).removeClass('obj_action');
		});

		var paramDate = new Date().getTime();
		var shareTable = {
			main : {
				title : '다크어벤저3',
				description : '액션의 끝을 경험하라! 다크어벤저3',
				href : 'https://i.nx.com/3gY',
				picture : 'http://nxm-mt.akamaized.net/Contents/da3.nexon.com/LaunchDownload/sns.jpg?d=' + paramDate
			}
		};

		$('#aside .btn_share_facebook').on('click', function(){
			var $self, table, share;

			$self = $(this);
			table = shareTable[$self.attr('data-table')];
			share = {
				method: 'share',
				href: table['href'],
				title: table['title'],
				picture: table['picture'],
				description: table['description']
			};
			FB.ui(share, function(response){
				console.dir(response);
			});
		});

		$('#container .btn_mov_reg').on('click', function(){
			$('.btn_section[data-key="8"]').trigger('click');
		});

		$('.btn_caution button').on('click', function(){
			var $self, obj, pop;

			$self = $(this);
			pop = $self.attr('data-pop');
			obj = $('#pop_caution_' + pop);

			ele.dimmed.show();
			obj.center().show();
		});

		$('.input_check .i1 button').on('click', function(){
			var $self, obj;

			$self = $(this);
			obj = $('#pop_terms0');

			ele.dimmed.show();
			obj.center().show();
		});

		$('.input_check .i2 button').on('click', function(){
			var $self, obj;

			$self = $(this);
			obj = $('#pop_terms1');

			ele.dimmed.show();
			obj.center().show();
		});

		$('#container #section5 .con .inner .btn_create_url').on('click', function(){
			var $self, obj, pop;

			$self = $(this);
			pop = $self.attr('data-pop');
			obj = $('#pop_' + pop);

			ele.dimmed.show();
			obj.center().show();
		});

		$('#ie_guide p.btn button').on('click', function(){
			$('#ie_guide').find('.inner').hide().end().fadeOut(2000);
		});

		$('.pop_char .btn_close').on('click', function(){
			var $self, pop;

			$self = $(this);
			pop = $self.attr('data-pop');
			objChar['char' + pop].gotoAndPlay(36);
		});

		$('#pop_media .btn_close').on('click', function(){
			// ele.videoMedia.load();
			ele.videoMedia.play();
		});

		$('#wrap .pop_sound .btn_close').on('click', function(){
			if(config.stopSoundForPop){
				// setTimeout(function(){$('.btn_sound_controll').trigger('click');}, 500);
				config.stopSoundForPop = false;
				$('.btn_sound_controll').trigger('click');
			}
		});

		$('.pop .btn_close').on('click', function(){
			var $self, parents, player;

			$self = $(this);
			parents = $self.parents('.pop');
			player = parents.find('.player');

			if(config.prevSectionKey == 0){
				ele.videoMain.play();
			}else if(config.prevSectionKey == 2){ // 캐릭터 소개에서 레이어 팝업 닫으면 배경 영상 다시 재생
				$(ele.controllersChar[config.charCount]).trigger('click');
			}

			player.html('');
			parents.hide();
			ele.dimmed.hide();
		});

		var isMenuAnimate = false;
		$('#aside .btn_close_menu').on('click', function(){
			var $self;

			$self = $(this);
			if(isMenuAnimate) return;

			isMenuAnimate = true;
			$('#aside').addClass('close fix');
			setTimeout(function(){isMenuAnimate = false;}, 500);
		});

		$('#aside .btn_open_menu').on('click', function(){
			var $self;

			$self = $(this);
			if(isMenuAnimate) return;

			isMenuAnimate = true;
			$('#aside').removeClass('close');
			setTimeout(function(){isMenuAnimate = false;$('#aside').removeClass('fix');}, 500);
		});
		$('.btn_sound_controll').on('click', function(){
			var $self;

			$self = $(this);
			if(config.isSoundPlay && $self.hasClass('play')){
				config.isSoundPlay = false;
				soundManager.pause('sound');
				$self.removeClass('play').addClass('pause');
				config.checkEqualizer = false;
			}else{
				config.isSoundPlay = true;
				soundManager.play('sound');
				$self.removeClass('pause').addClass('play');
				config.checkEqualizer = true;
				fn.equalizer();
			}
		});
		$('input.type_num').on('keyup', function(){
			$(this).val($(this).val().replace(/[^0-9]/gi, ''));
		});
		$('.nano').nanoScroller({preventPageScrolling: true});

	});
})(jQuery, jQuery(window), jQuery(document));