function handle_json(url, callback) {
  // TODO: handle errors?
  $.getJSON(url, function(data) { callback(null, data); });
}

function search_name(needle, institutions, callback) {
  var results = {};
  needle = needle.toUpperCase();
  for (key in institutions) {
    if (institutions[key]["label"].indexOf(needle) > -1) {
      results[key] = null;
    }
  }

  callback(null, results);
}

function normalize(str) {
  return str.replace(/\W/g, "").toLowerCase();
}

function advanced_search(institutions) {
  var type = $("#adv_type").val(),
      state = $("#adv_state").val(),
      country = $("#adv_country").val(),
      accreditation = $("#adv_accreditation").val(),
      name = $("#adv_name").val(),
      student_veteran = $("#adv_student_veteran").is(":checked"),
      yr = $("#adv_yr").is(":checked"),
      poe = $("#adv_poe").is(":checked"),
      eight_keys = $("#adv_eight_keys").is(":checked"),
      publicsch = $("#adv_public").is(":checked"),
      privatesch = $("#adv_private").is(":checked"),
      correspondence = $("#adv_correspondence").is(":checked"),
      flight = $("#adv_flight").is(":checked"),
      foreign = $("#adv_foreign").is(":checked"),
      ojt = $("#adv_ojt").is(":checked"),
      results = [],
      intersectq = queue(),
      unionq = queue(),
      displayq = queue();

  /* TODO: can these be gzipped? */
  if (type != "") {
    var url = 'api/filters/type/' + normalize(type) + '.json';
    intersectq.defer(handle_json, url);
  }
  if (state != "") {
    var url = 'api/filters/state/' + normalize(state) + '.json';
    intersectq.defer(handle_json, url);
  }
  if (country != "") {
    var url = 'api/filters/country/' + normalize(country) + '.json';
    intersectq.defer(handle_json, url);
  }
  if (accreditation != "") {
    var url = 'api/filters/accreditation_type/' + normalize(accreditation) + '.json';
    intersectq.defer(handle_json, url);
  }  
  if (name != "") {
    intersectq.defer(search_name, name, institutions);
  }
  if (student_veteran) {
    var url = 'api/filters/student_veteran/true.json';
    intersectq.defer(handle_json, url);
  }
  if (yr) {
    var url = 'api/filters/yr/true.json';
    intersectq.defer(handle_json, url);
  }
  if (poe) {
    var url = 'api/filters/poe/true.json';
    intersectq.defer(handle_json, url);
  }
  if (eight_keys) {
    var url = 'api/filters/eight_keys/true.json';
    intersectq.defer(handle_json, url);
  }
  if (publicsch) {
    var url = 'api/filters/type/public.json';
    unionq.defer(handle_json, url);
  }
  if (privatesch) {
    var url = 'api/filters/type/private.json';
    unionq.defer(handle_json, url);
  }
  if (correspondence) {
    var url = 'api/filters/type/correspondence.json';
    unionq.defer(handle_json, url);
  }
  if (flight) {
    var url = 'api/filters/type/flight.json';
    unionq.defer(handle_json, url);
  }
  if (foreign) {
    var url = 'api/filters/type/foreign.json';
    unionq.defer(handle_json, url);
  }
  if (ojt) {
    var url = 'api/filters/type/ojt.json';
    unionq.defer(handle_json, url);
  }

  // The search results are as follows, where & means intersection and | means union:
  // (type & country & name & student_veterans & yr & poe & eight_keys) &
  // (public | private | correspondence | flight | foreign | ojt)
  function getintersect(callback) {
    intersectq.awaitAll(function(err, results) {
      callback(null, intersect(institutions, results));
    });
  }

  function unionize(callback) {
    unionq.awaitAll(function(err, results) {
      callback(null, union(institutions, results));
    });
  }

  displayq.defer(getintersect);
  displayq.defer(unionize);
  displayq.awaitAll(function(err, results) {
    var intersection = intersect(institutions, results);
    show(institutions, intersection);
    csv(institutions, intersection)
  });
}

function show(institutions, intersection) {
  var out = $(".results-list");

  /* remove previous search results */
  out.html('');

  /* Add the clear button */
  $("#adv_clear").html('<a href="#" id="adv_clear_results">Clear</a>');

  /* add the code to clear the results list */
  $('#adv_clear_results').click(function(e) {
    e.preventDefault();
    $(".results-list").html('');
    $("#adv_clear").html('');
    $("#adv_results_n").html('Search Results');
    $(".download").html('');
  });

  /* add the results to the results box */
  var institutionResults = {};
  for (key in intersection) {
    var inst = institutions[key];
    institutionResults[inst.name] = inst;
  }
  var sortedInstitutionNames = Object.keys(institutionResults).sort();
  for (index in sortedInstitutionNames) {
    var instName = sortedInstitutionNames[index];
    var inst = institutionResults[instName];
    var place = inst.city;
    if (inst.state){
      place += ", " + inst.state;
    }
    var res = '<li><a href="#" class="adv_result" data-key="'+inst.value+'">'+inst.name+
          '<span>'+place+'</span></a></li>';
    out.append(res);
  }

  var n = Object.keys(intersection).length,
      sr = n + " Search Result" + (n == 1 ? '' : 's');
  $("#adv_results_n").html(sr);

  /* connect the result links to the handleSelect function */
  $('.adv_result').click(function(evt) {
    handleSelect(evt, institutions);
  });
}

function handleSelect(evt, institutions) {
  var id = evt.currentTarget.attributes["data-key"].value,
      inst = institutions[id];

  /* close the modal */
  $(".modal .close").click();

  /* update the benefits div */
  $('#institution-search').val(inst.label);
  GIBComparisonTool.update(id);

  /* scroll to the right place (delay because update eats the URL) */
  setTimeout('window.location = "#about_your_school"', 10);
}

function union(institutions, dicts) {
  if (dicts.length == 0) { return; }

  results = dicts[0];
  for (var i=1; i<dicts.length; i++) {
    for (key in dicts[i]) {
      results[key] = undefined;
    }
  }

  return results;
}

/* Return the intersection of all its arguments */
function intersect(institutions, dicts) {
  if (dicts.length == 0) { return; }

  results = dicts[0];
  for (var i=1; i<dicts.length; i++) {
    if (typeof dicts[i] != "object") { continue; }

    temp_results = {};
    for (key in results) {
      if (dicts[i].hasOwnProperty(key)) {
        temp_results[key] = undefined;
      }
    }

    results = temp_results;
  }

  return results;
}

function csv(institutions, intersection) {
  var csvs = "facility code,name,city,state\n";

  for (key in intersection) {
    var res = institutions[key];
    csvs += res.value+','+res.name+','+res.city+','+res.state+'\n';
  }

  var encdata = btoa(csvs);
  $(".download").html('<a href="data:text/csv;base64,'+encdata+'">Download <abbr title="comma seperated value file">CSV</abbr></a>');
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
                                      name:    data[i][1],
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

    /* Turn on keyboard handler */
    $(document).keydown(handleEnter);
  });

  $(".modal .close").click(function(e) {
    e.preventDefault();
    $('#mask, .modal').hide();
    $(document).off("keydown", handleEnter);
  });

  $('#mask').click(function () {
    $('#mask, .modal').hide();
    $(document).off("keydown", handleEnter);
  });

  $('#advsearch').click(function() {
    advanced_search(institutiondict);
  });

  function handleEnter(evt) {
    if (evt.keyCode == 13) {
      advanced_search(institutiondict);
    }
  }

  // "an employer" or "a school"
  $("#employer_n").hide();
  $("#adv_type").change(function() {
    if (this.value == "ojt") {
      $("#employer_n").show()
    } else {
      $("#employer_n").hide()
    }
  })
});
