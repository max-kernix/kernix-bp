//// Prevent Flash of unstyled content

$(document).ready(function() {
  // console.log('no fouc');
  $('.fouc').removeClass('fouc');
});

window.onload = function() { // dosen't work on doc.ready, transition doesn't occurs
  $('body').addClass('no-fouc');
};
