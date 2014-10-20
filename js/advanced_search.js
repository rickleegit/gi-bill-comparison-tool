function handle_json(url, callback) {
  // TODO: handle errors?
  $.getJSON(url, function(data) { callback(null, data); });
}

function advanced_search(institutions) {
  var type = $("#adv_type").val(),
      state = $("#adv_state").val(),
      results = [],
      q = queue();

  /* TODO: normalize type and state. lowercase, [a-zA-Z] */
  /* TODO: can these be gzipped? */
  if (type != "") {
    var url = 'api/filters/type/' + type + '.json';
    q.defer(handle_json, url);
  }
  if (state != "") {
    var url = 'api/filters/state/' + state + '.json';
    q.defer(handle_json, url);
  }

  q.awaitAll(function(err, results) { intersect(institutions, results); })
}

/* Return the intersection of all its arguments */
function intersect(institutions, dicts) {
  if (dicts.length == 0) { return; }

  results = dicts[0];
  for (var i=1; i<dicts.length; i++) {
    temp_results = {};
    for (key in results) {
      if (dicts[i].hasOwnProperty(key)) {
        temp_results[key] = undefined;
      }
    }

    results = temp_results;
  }

  /* TODO: move this out of the intersection func */
  for (key in results) {
    console.log(institutions[key].label);
  }

  return results;
}

$().ready(function () {
  var institutiondict = {};

  /* TODO: this is loaded twice now; once in gib-comparison-tool. Move this over there and rewrite
   * the autocomplete filter */
  $.getJSON('api/institutions.json', function (data) {
    for (var i = 0; i < data.length; i++) {
      var country_or_state = data[i][4] == "USA" ? data[i][3] : data[i][4],
          label = data[i][1] + ' (' + data[i][2] + ', ' + country_or_state + ')';

      institutiondict[data[i][0]] = { value:   data[i][0],
                                      label:   label,
                                      city:    data[i][2],
                                      state:   data[i][3],
                                      country: data[i][4] };
    }
  });

  $("a[href=#advancedsearch]").click(function(e) {
    e.preventDefault();

    var wh = $(window).height(),
        dh = $(document).height(),
        ww = $(window).width(),
        modal = $($(this).attr("href"));

    /* set mask on and show it */
    $('#mask').css({'width': ww, 'height': dh});
    $('#mask').show();

    /* center and show modal */
    modal.css('top', wh/2-modal.height()/2);
    modal.css('left', ww/2-modal.width()/2);
    modal.show();
  });

  $(".modal .close").click(function(e) {
    e.preventDefault();
    $('#mask, .modal').hide();
  });

  $('#mask').click(function () {
    $('#mask, .modal').hide();
  });

  $('#advsearch').click(function() { advanced_search(institutiondict); });
});
