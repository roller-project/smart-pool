$(function () {
  $(".goo-collapsible > a").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (!window || window.innerWidth >= 992) {
      return
    }
    if (!$(this).hasClass("open")) {
      $(".goo-collapsible ul").slideUp(350);
      $(".goo-collapsible a").removeClass("open").blur();

      $(this).next("ul").slideDown(350);
      $(this).addClass("open");
    } else if ($(this).hasClass("open")) {
      $(this).removeClass("open").blur();
      $(this).next("ul").slideUp(350);
    }
  });

  $(".goo-collapsible.auto-dropdown").on("mouseenter", function (e) {

    if (!window || window.innerWidth < 992) {
      return
    }
    var target = $(this).find('a');
    if (!target.hasClass("open")) {
      $(".goo-collapsible ul").slideUp(350);
      $(".goo-collapsible a").removeClass("open").blur();

      target.next("ul").slideDown(350);
      target.addClass("open");
    }
  });
  $(".goo-collapsible.auto-dropdown").on("mouseleave", function (e) {
    if (!window || window.innerWidth < 992) {
      return
    }
    var target = $(this).find('a');
    if (target.hasClass("open")) {
      target.removeClass("open").blur();
      target.next("ul").slideUp(350);
    }
  });

  $('.f_hd_withSideBarToggle .sideBarToggle').click(function () {
    $('.f_sideBar').toggleClass('f_sideBar_show');
  });

  //inputs
  $('.m_inputBoxSelect').click(function () {
    $(this).find('.m_inputOptionsWrap').toggle();
  });

  $('.sideBarToggle').click(function () {
    $('.f_sideBar').toggleClass('f_sideBar_show');
  });

  //计算subnav li宽度，赋总和值给subnav，实现移动端subnav横向滚动
  var subNavWidth = 0;
  $('.subNavBox .subNav li').each(function () {
    subNavWidth += $(this).outerWidth()
  });

  var subNavOuterParts = $('.subNavBox .subNav').outerWidth() - $('.subNavBox .subNav').width();
  $('.subNavBox .subNav').css({'min-width': subNavWidth + 'px'});

  // alertTips
  $('.m_warningBelowContainer').find('.i_warningClose').click(function (e) {
    e.preventDefault();
    $(this).parent().parent('.m_warningBelowContainer').hide();
  });

  $('*[data-toggle=tooltip]').tooltip({
    animated: 'fade',
    placement: 'top',
    container: 'body',
    html: true
  });

  $(".nav-only-pc").click(function () {
    if (!window || window.innerWidth < 992) {
      return;
    }
    window.location.href = this.getAttribute('data-href')
  });
  // 避免左侧导航栏被其他点击关闭
  $('.left-side-nav .dropdown').each(function () {
    this.closable = false;
  });
  $('.left-side-nav .dropdown').on({
    "shown.bs.dropdown": function () {
      this.closable = false;
    },
    "click": function () {
      this.closable = true;
    },
    "hide.bs.dropdown": function () {
      return this.closable;
    }
  });
  $(".left-side-nav .dropdown-menu").click(function (e) {
    e.stopPropagation();
  });
  // 自动展开滚动到子账户
  $("#navbar-collapse .navbar-right a.dropdown-toggle").click(function () {
    if (!window || window.innerWidth >= 992) {
      return;
    }
    $("#navbar-collapse").animate({scrollTop: 400})
  });
  // 推荐下载或者打开app相关
  var hideDownloadLink = sessionStorage.getItem('hideDownloadLink');
  if (mobileAndTabletcheck() && !hideDownloadLink) {
    $("#open-in-app").addClass('shown');
    $("#propose-download-app").addClass('shown');
  }
  ;
  $("#propose-download-app .close-button").click(function () {
    hideDownloadApp();
  });
  $("#open-in-app").click(function () {
    hideDownloadApp();
    sessionStorage.setItem('proposeMode', 'call-app');
    window.location.href = "/mobile/download/guide/";
  });
  $("#propose-download-app .download-button").click(function () {
    hideDownloadApp();
    sessionStorage.setItem('proposeMode', 'download-app'); // 1 调用 ，2 下载
    window.location.href = "/mobile/download/guide/";
  });
  var proposeMode = sessionStorage.getItem('proposeMode');
  if (proposeMode === 'call-app') {
    openApp(BrowserInfo().isAndroid ? 'viabtcpool://pool.com' : 'viabtcPool://', function (opened) {
      console.log('call app failed')
    });
  }
  sessionStorage.removeItem('proposeMode');

  // cet挖矿奖励提示
  var deltaHours = 2; // 具体要看发放时间,utc几点就是几
  var delayedDate = new Date(Date.now() - deltaHours * 3600 * 1000).toISOString().slice(0, 10);
  // 需要已登录状态
  if ($('#cet-mining').length && !$('#verify-signin-form').length && localStorage.getItem('lastTime') !== delayedDate) {
    localStorage.setItem('lastTime', delayedDate);
    $.get("/api/notify/last/", function (data) {
      if (data.result && data.result.length) {
        $('#cet-mining-message').text(data.result);
        $('#cet-mining').modal('show');
      }
    });
  }
});

var hideDownloadApp = function () {
  $("#propose-download-app").removeClass('shown');
  $("#open-in-app").removeClass('shown');
  sessionStorage.setItem('hideDownloadLink', 'true');
};

var openApp = function (openUrl, callback) {
  var browser = BrowserInfo();

  //检查app是否打开
  function checkOpen(cb) {
    var _clickTime = +(new Date());

    function check(elsTime) {
      if (elsTime > 3000 || document.hidden || document.webkitHidden) {
        cb(1);
      } else {
        cb(0);
      }
    }

    //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
    var _count = 0, intHandle;
    intHandle = setInterval(function () {
      _count++;
      var elsTime = +(new Date()) - _clickTime;
      if (_count >= 100 || elsTime > 3000) {
        clearInterval(intHandle);
        check(elsTime);
      }
    }, 20);
  }

  window.location.href = openUrl;

  if (callback) {

    //使用微链接
    var encodeUri = encodeURIComponent(openUrl);

    if (browser.isWeixin) {
      return; // 应用宝上不了，暂时就只能先不做了
    } else {
      checkOpen(function (opened) {
        callback && callback(opened);
      });
    }
  }
};

var BrowserInfo = function () {
  var json = {
    userAgent: navigator.userAgent.toLowerCase(),
    isAndroid: Boolean(navigator.userAgent.match(/android/ig)),
    isIphone: Boolean(navigator.userAgent.match(/iphone|ipod/ig)),
    isIpad: Boolean(navigator.userAgent.match(/ipad/ig)),
    isWeixin: Boolean(navigator.userAgent.match(/MicroMessenger/ig)),
  }

  return json;
};

var mobileAndTabletcheck = function () {
  var check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
