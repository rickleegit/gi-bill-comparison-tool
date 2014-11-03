function showSchools () {
  var clean = $(".school-list");
  /* remove previous data */
  clean.html('');

  var school_data = getFavSchoolsHtmlArray();
  var schools = [];
    $.each(getFavoriteSchoolsArray(), function(i, school) {
      schools.push("<div id='school-"+(i+1)+"'> <h2>" + school + "</h2>" + school_data[i] + "</div>");
    });
    $('#school-list').html(schools);
    $('#school-list #add-to-favorites').hide();
    $('#school-list #institution').hide();
}

$(document).ready(function() {

  /* select all the a tag with name equal to modal */
  $('a[name=modal]').click(function(e) {
    /* Cancel the link behavior */
    e.preventDefault();
    /* Get the A tag */
    var modal = $(this).attr('href');

    /*Get the screen height and width */
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    /* Set height and width to mask to fill up the whole screen */
    $('#comparemask').css({'width':maskWidth,'height':maskHeight});

    $('#comparemask').show();

    /* Get the window height and width */
    var winH = $(window).height();
    var winW = $(window).width();

    /* Set the popup window to center */
    $(modal).css('top',  winH/2-$(modal).height()/2);
    $(modal).css('left', winW/2-$(modal).width()/2);
    $(modal).show();

    showSchools();

  });

  /* if close button is clicked */
  $('.window .close').click(function (e) {
    /* Cancel the link behavior */
    e.preventDefault();
    $('#comparemask, .window').hide();
  });

  /* if mask is clicked */
  $('#comparemask').click(function () {
    $(this).hide();
    $('.window').hide();
  });

});

