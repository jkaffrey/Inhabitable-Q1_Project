"use strict";
var BackgroundScroll = function(params) {
  params = $.extend({
    scrollSpeed: 70,
    imageWidth: $('#background').width(),
    imageHeight: $('#background').height()
  }, params);

  var step = 1,
  current = 0,
  restartPosition = - (params.imageWidth - params.imageHeight);

  var scroll = function() {
    current -= step;
    if (current == restartPosition){
      current = 0;
    }
    $('#background').css('backgroundPosition', current + 'px 0');

  };

  this.init = function() {
    setInterval(scroll, params.scrollSpeed);

  };
};

var scroll = new BackgroundScroll();
scroll.init();
