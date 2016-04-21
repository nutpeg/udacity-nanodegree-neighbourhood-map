$(document).ready(function(){
  $('.icon-menu').click(function(){
    $(this).toggleClass('open');
    $('.sidebar').toggleClass('open');
    $('.content').toggleClass('open');
  });
});