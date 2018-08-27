var viabtc = {};
viabtc.common = viabtc.common || {};

viabtc.lang = 'en_US';
viabtc.langs = {zh_Hans_CN: 'zh_Hans_CN', zh_Hant_HK: 'zh_Hant_HK', en_US: 'en_US', ja_JP: 'ja_JP', ko_KR: 'ko_KR', ru_RU: 'ru_RU'};
viabtc.set_lang = function() {
  var lang = $("body").attr("lang");
  if (lang in viabtc.langs) {
    viabtc.lang = lang;
  }
}

viabtc.coins = {BTC: 'BTC', BCC: 'BCC', LTC: 'LTC'};
viabtc.set_coin = function() {
  var coin = $("body").attr("coin");
  if(!coin){
    return;
  }
  coin = coin.toUpperCase();
  viabtc.coin = coin;
}

viabtc.set_timezone_offset = function() {
  var offset = $("body").attr("tz-offset");
  viabtc.tz_offset = offset;
}

viabtc.default_button_types = 'Confirm';
viabtc.button_types = {
  Confirm: {zh_Hans_CN: '确认', zh_Hant_HK: '確認', en_US: 'Confirm', ja_JP: '確認', ko_KR: '확인', ru_RU: 'Подтверждение'},
  Cancel: {zh_Hans_CN: '取消', zh_Hant_HK: '取消', en_US: 'Cancel', ja_JP: 'キャンセル', ko_KR: '취소', ru_RU: 'Отмена'},
  Create: {zh_Hans_CN: '创建', zh_Hant_HK: '創建', en_US: 'Create', ja_JP: '作成', ko_KR: '생성', ru_RU: 'Создать'},
  Delete: {zh_Hans_CN: '删除', zh_Hant_HK: '刪除', en_US: 'Delete', ja_JP: '削除', ko_KR: '삭제', ru_RU: 'Удалить'},
  Remove: {zh_Hans_CN: '移除', zh_Hant_HK: '移除', en_US: 'Remove', ja_JP: '取り除く', ko_KR: '제거', ru_RU: 'Убрать'},
  Save: {zh_Hans_CN: '保存', zh_Hant_HK: '保存', en_US: 'Save', ja_JP: '保存', ko_KR: '저장', ru_RU: 'Сохранить'},
  Submit: {zh_Hans_CN: '提交', zh_Hant_HK: '提交', en_US: 'Submit', ja_JP: '提出', ko_KR: '제출', ru_RU: 'Передать'},
  CreateAndAdd: {zh_Hans_CN: '创建并添加', zh_Hant_HK: '創建並添加', en_US: 'Create and add', ja_JP: '作成＆添加', ko_KR: '생성 및 추가', ru_RU: 'Создать и добавить'}
}

viabtc.dialog_titles = {
  Error: {zh_Hans_CN: '错误', zh_Hant_HK: '錯誤', en_US: 'Error', ja_JP: 'エラー', ko_KR: '에러', ru_RU: 'Ошибка'},
  Warn: {zh_Hans_CN: '警告', zh_Hant_HK: '警告', en_US: 'Warn', ja_JP: '警告', ko_KR: '경고', ru_RU: 'Предупреждение'},
  Info: {zh_Hans_CN: '提示', zh_Hant_HK: '提示', en_US: 'Info', ja_JP: 'プロンプト', ko_KR: 'TIP', ru_RU: 'Напоминание'},
  Notice: {zh_Hans_CN: '提示', zh_Hant_HK: '提示', en_US: 'Notice', ja_JP: 'プロンプト', ko_KR: 'TIP', ru_RU: 'Напоминание'},
  Success: {zh_Hans_CN: '成功', zh_Hant_HK: '成功', en_US: 'Success', ja_JP: '成功しました', ko_KR: '성공', ru_RU: 'Успешно'}
}

// when lang is zh, then customize date format
viabtc.xdateFmt = {
  min: {zh_Hans_CN: '%H:%M', zh_Hant_HK: '%H:%M', en_US: '%H:%M', ja_JP: '%H:%M', ko_KR: '%H:%M', ru_RU: '%H:%M'},
  hour: {zh_Hans_CN: '%H:00', zh_Hant_HK: '%H:00', en_US: '%H:00', ja_JP: '%H:00', ko_KR: '%H:00', ru_RU: '%H:00'},
  day: {zh_Hans_CN: '%m月%d日', zh_Hant_HK: '%m月%d日', en_US: '%d, %b', ja_JP: '%m月%d日', ko_KR: '%m월%d일', ru_RU: '%m День %d Месяц'},
  month: {zh_Hans_CN: '%Y年%m月', zh_Hant_HK: '%Y年%m月', en_US: '%b, %Y', ja_JP: '%Y年%m月', ko_KR: '%Y년%m월', ru_RU: '%Y Месяц %m Год'},
  year: {zh_Hans_CN: '%Y年', zh_Hant_HK: '%Y年', en_US: '%Y', ja_JP: '%Y年', ko_KR: '%Y년', ru_RU: '%YГод'}
}

// simple alert
viabtc.common.alert = function(title, content) {
  if (title in viabtc.dialog_titles)
    title = viabtc.dialog_titles[title][viabtc.lang]
  $.alert({title: title, content: content});
}

// something not good
viabtc.common.warn = function(title, content, callback) {
  if (title in viabtc.dialog_titles)
    title = viabtc.dialog_titles[title][viabtc.lang]
  var options = {
    title: title,
    content: content,
    icon: "fa fa-warning",
    closeIcon: true,
    type: 'orange',
    buttons: {
      confirm: {
        text: viabtc.button_types['Confirm'][viabtc.lang],
        btnclass: 'btn btn-secondary',
        action: function(){
          func = callback || function(){return;};
          func();
        }
      }
    }
  };
  $.confirm(options);
}

viabtc.common.confirm = function(title, content, confirm_callback, cancel_callback) {
  if (title in viabtc.dialog_titles)
    title = viabtc.dialog_titles[title][viabtc.lang]
  var options = {
    title: title,
    content: content,
    icon: "fa fa-info-circle",
    closeIcon: true,
    animation: 'top',
    type: 'blue',
    buttons: {
      no1: {
        text: viabtc.button_types['Cancel'][viabtc.lang],
        btnClass: 'btn-secondary',
        action: function() {
          func = cancel_callback || function(){return;};
          func();
        }
      },
      yes2: {
        text: viabtc.button_types['Confirm'][viabtc.lang],
        btnclass: 'btn-primary',
        action: function(){
          func = confirm_callback || function(){return;};
          func();
        }
      }

    }
  };
  $.confirm(options);
}

// prompt need input
viabtc.common.prompt = function(type, title, content, confirm_callback, cancel_callback) {
  if (!(type in viabtc.button_types))
    type = viabtc.default_button_types;

  if (title in viabtc.dialog_titles)
    title = viabtc.dialog_titles[title][viabtc.lang]

  var options = {
    title: title,
    content: content,
    icon: "fa fa-info-circle",
    closeIcon: true,
    animation: 'top',
    type: 'blue',
    buttons: {
      cancel: {
        text: viabtc.button_types['Cancel'][viabtc.lang],
        btnClass: 'btn-secondary',
        action: function() {
          func = cancel_callback || function(){return;};
          func();
        }
      },
      confirm: {
        text: viabtc.button_types[type][viabtc.lang],
        btnclass: 'btn-primary',
        action: function(){
          func = confirm_callback || function(){return;};
          func();
        }
      }
    }
  };
  $.confirm(options);
}

// success info
viabtc.common.info = function(title, content, callback) {
  if (title in viabtc.dialog_titles)
    title = viabtc.dialog_titles[title][viabtc.lang]

  var options = {
    title: title,
    content: content,
    icon: "fa fa-info-circle",
    closeIcon: true,
    animation: 'top',
    type: 'green',
    buttons: {
      confirm: {
        text: viabtc.button_types['Confirm'][viabtc.lang],
        btnclass: 'btn btn-primary',
        action: function(){
          func = callback || function(){return;};
          func();
        }
      }
    }
  };
  $.confirm(options);
}

// error
viabtc.common.error = function(title, content, callback) {
  if (title in viabtc.dialog_titles)
    title = viabtc.dialog_titles[title][viabtc.lang]

  var options = {
    title: title,
    content: content,
    icon: "fa fa-times-circle",
    closeIcon: true,
    animation: 'top',
    type: 'red',
    buttons: {
      confirm: {
        text: viabtc.button_types['Confirm'][viabtc.lang],
        btnclass: 'btn btn-primary',
        action: function(){
          func = callback || function(){return;};
          func();
        }
      }
    }
  };
  $.confirm(options);
}

// call raw confirm
viabtc.common.dialog = function(options) {
  var options = $.extend({
    title: '',
    animation: 'top',
    type: 'default',
    buttons: {},
    icon: '',
    columnClass: 'col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-10 col-xs-offset-1',
  }, options);

  $.confirm(options);
}

viabtc.set_highcharts_timezone = function(offset) {
  if (typeof Highcharts != 'undefined') {
    Highcharts.setOptions({
      global: {
        timezoneOffset: -offset * 60
      }
    });
  }
}

$(document).ready(function(){
  // execute
  viabtc.set_lang();
  viabtc.set_coin();
  viabtc.set_timezone_offset();
  viabtc.set_highcharts_timezone(viabtc.tz_offset);
});


