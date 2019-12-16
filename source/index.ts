import './main.scss';
// import Presenter from './Presenter';
import { slider, slider2 } from './main';

declare global {

  interface JQuery {
    myPlugin: any;
  }
}

(function($){
  $.fn.myPlugin = function(options) {
    // new Presenter($(this), options);
    slider($(this), options);
    slider2($(this), options);
  };
})(jQuery);

$(function() {
  $('#block').myPlugin({
    min: 200,
    max: 600,
    values: [300, 400],
    step: 0,
    pinUp: true,
    orientation: 'vertical',
  });
});

$(function() {
  $('#block2').myPlugin({
    min: 0,
    max: 100,
    values: [45],
    step: 3,
    pinUp: false,
    orientation: 'horizontal',
  });
});
