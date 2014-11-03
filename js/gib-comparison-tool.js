/*
 * gib-comparison-tool.js - The GI Bill Comparison Tool Module
 */


// Define `console` in IE9 and below
(function () {
  var f = function () {};
  if (!window.console) {
    window.console = { log:f, info:f, warn:f, debug:f, error:f };
  }
})();


var GIBComparisonTool = (function () {

  // All institutions (names and facility codes)
  var institutions = [];

  // User form data
  var formData = {
    military_status:        '',
    spouse_active_duty:     false,
    gi_bill_chap:           '',
    number_of_depend:       '',  
    post_911_elig:          '',
    cumulative_service:     '',
    enlistment_service:     '',
    consecutive_service:    '',
    facility_code:          '',
    online:                 false,
    in_state:               true,
    tuition_fees:           '',
    in_state_tuition_fees:  '',
    yellow_ribbon:          false,
    yellow_ben:             '',
    rop:                    '',
    rop_old:                '',
    ojt_working:            '',
    calendar:               '',
    number_nontrad_terms:   '',
    length_nontrad_terms:   '',
    kicker_elig:            false,
    kicker:                 0,
    buy_up_elig:            false,
    buy_up:                 0,
    scholar:                '',
    tuition_assist:         ''
  };

  // The current institution
  var institution = {};

  // Calculated values
  var calculated = {
    tier:                     0.0,
    service_discharge:        false,
    institution_type:         '',
    institution_type_display: '',
    location:                 '',
    old_gi_bill:              false,
    vre_only:                 false,
    only_tuition_fees:        false,
    est_tuition_fees:         0,
    monthlyrate:              0,
    est_housing_allowance:    0,
    est_book_stipend:         0,
    tuition_out_of_state:     0,
    number_of_terms:          0,
    term_length:              0,
    acad_year_length:         0,
    tuition_net_price:        0,
    tuition_fees_cap:         0,
    tuition_fees_per_term:    0,
    rop_old:                  0,
    rop_book:                 0,
    rop_ojt:                  0,
    kicker_benefit:           0,
    buy_up_rate:              0, 
    monthly_rate_final:       0, 
    term1:                    '',
    term2:                    '',
    term3:                    '',
    term4:                    '',
    tuition_fees_term_1:      0,
    tuition_fees_term_2:      0,
    tuition_fees_term_3:      0,
    tuition_fees_total:       0,
    yr_ben_term_1:            0,
    yr_ben_term_2:            0,
    yr_ben_term_3:            0,
    yr_ben_total:             0,
    yr_ben_school_term_1:     0,
    yr_ben_school_term_2:     0,
    yr_ben_school_term_3:     0,
    yr_ben_school_total:      0,
    yr_ben_va_term_1:         0,
    yr_ben_va_term_2:         0,
    yr_ben_va_term_3:         0,
    yr_ben_va_total:          0,
    housing_allow_term_1:     0,
    housing_allow_term_2:     0,
    housing_allow_term_3:     0,
    housing_allow_total:      0,
    book_stipend_term_1:      0,
    book_stipend_term_2:      0,
    book_stipend_term_3:      0,
    book_stipend_total:       0,
    total_term_1:             0,
    total_term_2:             0,
    total_term_3:             0,
    total_to_school:          0,
    total_scholarship_ta:     0,
    total_to_you:             0,
    total_left_to_pay:        0,
    total_year:               0,
    gi_bill_total_text:       '',
    yellow_ribbon_elig:       false
  };

  // Constants
  var TFCAP  = 20235.02,
      AVGBAH = 1509,
      BSCAP  = 1000,
      BSOJTMONTH = 83,
      FLTTFCAP   = 11562.86,
      CORRESPONDTFCAP  = 9828.43,
      TUITIONASSISTCAP = 4500,
      MGIB3YRRATE = 1717,
      MGIB2YRRATE = 1395,
      SRRATE = 367,
      DEARATE = 1018,
      DEARATEOJT = 743,
      VRE0DEPRATE = 594.47,
      VRE1DEPRATE = 737.39,
      VRE2DEPRATE = 868.96,
      VREINCRATE = 63.34,
      VRE0DEPRATEOJT = 519.77,
      VRE1DEPRATEOJT = 628.55,
      VRE2DEPRATEOJT = 724.41,
      VREINCRATEOJT = 47.12,
      GROUP1GRADMED  = 39.4,
      GROUP1GRADHIGH = 57.8,
      GROUP2GRADMED  = 20.2,
      GROUP2GRADHIGH = 36.6,
      GROUP3GRADMED  = 35,
      GROUP3GRADHIGH = 63.9,
      GROUP4GRADMED  = 0,
      GROUP4GRADHIGH = 0,
      GROUP5GRADMED  = 62.4,
      GROUP5GRADHIGH = 77,
      GROUP1GRADRANKHIGH = 636,
      GROUP1GRADRANKMED  = 1269,
      GROUP1GRADRANKMAX  = 1873,
      GROUP2GRADRANKHIGH = 470,
      GROUP2GRADRANKMED  = 931,
      GROUP2GRADRANKMAX  = 1390,
      GROUP3GRADRANKHIGH = 252,
      GROUP3GRADRANKMED  = 498,
      GROUP3GRADRANKMAX  = 740,
      GROUP4GRADRANKHIGH = 0,
      GROUP4GRADRANKMED  = 0,
      GROUP4GRADRANKMAX  = 0,
      GROUP5GRADRANKHIGH = 808,
      GROUP5GRADRANKMED  = 1542,
      GROUP5GRADRANKMAX  = 2263,
      CDRHIGH = 100,
      CDRAVG  = 14.7,
      CDRLOW  = 0,
      GROUP1LOANMED  = 16122,
      GROUP1LOANHIGH = 21286,
      GROUP2LOANMED  = 7042,
      GROUP2LOANHIGH = 13625,
      GROUP3LOANMED  = 6823,
      GROUP3LOANHIGH = 9501,
      GROUP4LOANMED  = 5000,
      GROUP4LOANHIGH = 12167,
      GROUP5LOANMED  = 7321,
      GROUP5LOANHIGH = 9501,
      GROUP1LOANRANKMED  = 709,
      GROUP1LOANRANKHIGH = 1345,
      GROUP1LOANRANKMAX  = 2000,
      GROUP2LOANRANKMED  = 460,
      GROUP2LOANRANKHIGH = 931,
      GROUP2LOANRANKMAX  = 1409,
      GROUP3LOANRANKMED  = 189,
      GROUP3LOANRANKHIGH = 511,
      GROUP3LOANRANKMAX  = 727,
      GROUP4LOANRANKMED  = 0,
      GROUP4LOANRANKHIGH = 0,
      GROUP4LOANRANKMAX  = 0,
      GROUP5LOANRANKMED  = 675,
      GROUP5LOANRANKHIGH = 1349,
      GROUP5LOANRANKMAX  = 2024;

  // Colors and styles
  var lightBlue  = '#94bac9',
      mediumBlue = '#1d7893',
      darkBlue   = '#004974',
      darkGray   = '#494949',
      font       = 'Arial, Helvetica, sans-serif';

  // For analytics
  var didOpenCalculator = false;


  /*
   * Get user data from the form
   */
  var getFormData = function () {
    formData.military_status      = $('#military-status').val();
    formData.spouse_active_duty   = $('#spouse-active-duty-yes').prop('checked');
    formData.gi_bill_chap         = Number($('#gi-bill-chapter').val());
    formData.number_of_depend     = Number($('#number-of-dependents').val());
    formData.post_911_elig        = $('#elig-for-post-gi-bill-yes').prop('checked');
    formData.cumulative_service   = $('#cumulative-service').val();
    formData.enlistment_service   = Number($('#enlistment-service').val());
    formData.consecutive_service  = Number($('#consecutive-service').val());
    formData.online               = $('#online-classes-yes').prop('checked');

    if (formData.military_status == 'spouse') {
      $('#spouse-active-duty-form').show();
    } else {
      $('#spouse-active-duty-form').hide();
    }


    if (formData.gi_bill_chap == 30 ) {
      $('#enlistment-service-form').show();
    } else {
      $('#enlistment-service-form').hide();
    }


    if (formData.gi_bill_chap == 1607 ) {
      $('#consecutive-service-form').show();
    } else {
      $('#consecutive-service-form').hide();
    }


    if (formData.gi_bill_chap != 31) {
      $('#elig-for-post-gi-bill-form').hide();
      $('#voc-rehab-warning').hide();
    } else {
      $('#elig-for-post-gi-bill-form').show();
      $('#voc-rehab-warning').show();
    }

    if (formData.gi_bill_chap == 31 && formData.post_911_elig == false) {
      $('#number-of-dependents-form').show();
    } else {
      $('#number-of-dependents-form').hide();
    }

    if (formData.gi_bill_chap == 33) {
      $('#cumulative-service-form').show();
    } else {
      $('#cumulative-service-form').hide();
    }

    formData.in_state              = $('#in-state-yes').prop('checked');
    formData.tuition_fees          = getCurrency('#tuition-fees-input');
    formData.in_state_tuition_fees = getCurrency('#in-state-tuition-fees');
    formData.yellow_ribbon         = $('#yellow-ribbon-recipient-yes').prop('checked');
    formData.yellow_ben            = getCurrency('#yellow-ribbon-amount');
    formData.rop                   = $('#enrolled').val();
    formData.rop_old               = $('#enrolled-old').val();
    formData.ojt_working           = $('#working').val();
    formData.calendar              = $('#calendar').val();
    formData.number_nontrad_terms  = Number($('#number-non-traditional-terms').val());
    formData.length_nontrad_terms  = $('#length-non-traditional-terms').val();
    formData.kicker_elig           = $('#kicker-elig-yes').prop('checked');
    formData.kicker                = getCurrency('#kicker');
    formData.buy_up_elig           = $('#buy-up-yes').prop('checked');
    formData.buy_up                = $('#buy-up-rate').val();
    formData.scholar               = getCurrency('#scholar');
    formData.tuition_assist        = getCurrency('#tuition-assist');
  };

  /*
   * Get data for selected institution
   */
  var getInstitution = function (facility_code, callback) {
    var url = 'api/' + facility_code.substr(0, 3) + '/' + facility_code + '.json';

    $.getJSON(url, function(data) {
      institution = data;
      callback();
    });
  };

  /*
   * Format location of the institution
   */
  var formatLocation = function () {
    if (institution.country != 'USA') {
      calculated.location = '' + institution.city + ', ' +
                                 institution.country;
    } else {
      calculated.location = '' + institution.city + ', ' +
                                 institution.state;
    }
  };

  /*
   * Formats currency in USD
   */
  var formatCurrency = function (num) {
    num = Math.round(num);
    var str = num.toString();
    if (str.length > 3) {
       return '$' + str.slice(0, -3) + ',' + str.slice(-3);
    } else {
      return '$' + str;
    }
  };

  /*
   * Formats numbers
   */
  var formatNumber = function (num) {
    var str = num.toString();
    if (str.length > 3) {
       return str.slice(0, -3) + ',' + str.slice(-3);
    } else {
      return str;
    }
  };

  /*
   * ADD A COMMENT
   */
  var getCurrency = function (el) {
    var currency = $(el).val();
    return Number(currency.replace(/[^0-9\.]+/g,''));
  }

  /*
   * Determine the type of institution
   */
  var getInstitutionType = function () {
    if (institution.facility_code[1] == '0') {
      calculated.institution_type = 'ojt';
    } else if (institution.flight) {
      calculated.institution_type = 'flight';
    } else if (institution.correspondence) {
      calculated.institution_type = 'correspond';
    } else if (institution.country != 'USA') {
      calculated.institution_type = 'foreign';
    } else {
      switch (institution.facility_code[0]) {
        case '1':
          calculated.institution_type = 'public';
          break;
        case '2':
          calculated.institution_type = 'private';
          break;
        case '3':
          calculated.institution_type = 'private';
          break;
      }
    }
  };

  /*
   * Determine the type of institution for display
   */
  var getInstitutionTypeForDisplay = function () {
    if (institution.facility_code[1] == '0') {
      calculated.institution_type_display = 'OJT / Apprenticeship';
    } else if (institution.flight) {
      calculated.institution_type_display = 'Flight';
    } else if (institution.correspondence) {
      calculated.institution_type_display = 'Correspondence';
    } else if (institution.country != 'USA') {
      calculated.institution_type_display = 'Foreign';
    } else {
      switch (institution.facility_code[0]) {
        case '1':
          calculated.institution_type_display = 'Public School';
          break;
        case '2':
          calculated.institution_type_display = 'For Profit School';
          break;
        case '3':
          calculated.institution_type_display = 'Private School';
          break;
      }
    }
  };

  /*
   * Determine the type of institution for search
   */
  var getInstitutionTypeForSearch = function (facility_code) {
    if (facility_code[1] == "0") {
      return "ojt";
    } else {
      return "school";
    }
  };

  /*
   * Calculate the tier
   */
  var getTier = function () {
    if (formData.gi_bill_chap == 31 && formData.post_911_elig == true) {
    calculated.tier = 1;
    } else if (formData.cumulative_service == 'service discharge') {
      calculated.tier = 1;
      calculated.service_discharge = true;
    } else {
      calculated.tier = parseFloat(formData.cumulative_service);
    }
  };

  /*
   * Calculate if using new or old GI Bill benefits
   */

  var getOldGIBill = function ( ) {
    if (formData.gi_bill_chap == 30 || formData.gi_bill_chap == 1607 || formData.gi_bill_chap == 1606 || formData.gi_bill_chap == 35) {
        calculated.old_gi_bill = true;
    } else {
        calculated.old_gi_bill = false;
    }
  };  
  
  
  /*
   * Calculate if eligible for VR&E and Post-9/11 Benefits
   */

  var getVREOnly = function ( ) {
    if (formData.gi_bill_chap == 31 && formData.post_911_elig == false) {
        calculated.vre_only = true;
    } else {
        calculated.vre_only = false;
    }
  };

  /*
   * Calculate if monthly benefit can only be spent on tuition/fees
   */

  var getOnlyTuitionFees = function ( ) {
    if (formData.military_status == 'active duty' && (formData.gi_bill_chap == 30 || formData.gi_bill_chap == 1607)) {
        calculated.only_tuition_fees = true;
    } else if ((calculated.institution_type == 'correspond' || calculated.institution_type == 'flight') && calculated.old_gi_bill == true) {
        calculated.only_tuition_fees = true;    
    } else if ((formData.rop_old == "less than half" || formData.rop_old == "quarter")  && (formData.gi_bill_chap == 30 || formData.gi_bill_chap == 1607 || formData.gi_bill_chap == 35)) {
        calculated.only_tuition_fees = true;
    } else {
        calculated.only_tuition_fees = false;
    }
  };

  /*
   * Calculate the monthly benefit rate for non-chapter 33 benefits
   */
  var getMonthlyRate = function ( ) {
    if (formData.gi_bill_chap == 30 && formData.enlistment_service == 3 && calculated.institution_type == 'ojt' ) {
        calculated.monthlyrate = MGIB3YRRATE * 0.75;	
    } else if (formData.gi_bill_chap == 30 && formData.enlistment_service == 3 ) {
        calculated.monthlyrate = MGIB3YRRATE;
    } else if (formData.gi_bill_chap == 30 && formData.enlistment_service == 2 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = MGIB2YRRATE * 0.75;
    } else if (formData.gi_bill_chap == 30 && formData.enlistment_service == 2 ) {
        calculated.monthlyrate = MGIB2YRRATE;
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = MGIB3YRRATE * formData.consecutive_service * 0.75;
    } else if (formData.gi_bill_chap == 1607 ) {
        calculated.monthlyrate = MGIB3YRRATE* formData.consecutive_service;
    } else if (formData.gi_bill_chap == 1606 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = SRRATE * 0.75;
    } else if (formData.gi_bill_chap == 1606 ) {
        calculated.monthlyrate = SRRATE;
    } else if (formData.gi_bill_chap == 35 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = DEARATEOJT;
    } else if (formData.gi_bill_chap == 35 && calculated.institution_type == 'flight') {
        calculated.monthlyrate = 0;
    } else if (formData.gi_bill_chap == 35) {
        calculated.monthlyrate = DEARATE;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend == 0 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = VRE0DEPRATEOJT;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend == 0) {
        calculated.monthlyrate = VRE0DEPRATE;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend == 1 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = VRE1DEPRATEOJT;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend == 1) {
        calculated.monthlyrate = VRE1DEPRATE;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend == 2 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = VRE2DEPRATEOJT;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend == 2) {
        calculated.monthlyrate = VRE2DEPRATE;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend > 2 && calculated.institution_type == 'ojt') {
        calculated.monthlyrate = VRE2DEPRATEOJT + ((formData.number_of_depend-2) * VREINCRATEOJT) ;
    } else if (formData.gi_bill_chap == 31 && formData.number_of_depend > 2) {
        calculated.monthlyrate = VRE2DEPRATE + ((formData.number_of_depend-2) * VREINCRATE) ;
    }
  };

  /*
   * Calculates the estimated tuition and fees
   */
  var getTuitionFees = function () {
    if (calculated.old_gi_bill == true) {
      calculated.est_tuition_fees = '$0 / year ';
    } else if (calculated.institution_type == 'ojt') {
      calculated.est_tuition_fees = '';
    } else if (formData.gi_bill_chap == 31) {
      calculated.est_tuition_fees = 'Full Cost of Attendance';
    } else if (calculated.institution_type == 'flight') {
      calculated.est_tuition_fees = formatCurrency(FLTTFCAP * calculated.tier) + ' / year (up to)';
    } else if (calculated.institution_type == 'correspond') {
      calculated.est_tuition_fees = formatCurrency(CORRESPONDTFCAP * calculated.tier) + ' / year (up to)';
    } else if (calculated.institution_type == 'public' && institution.country == 'USA') {
      calculated.est_tuition_fees = Math.round(calculated.tier * 100) + '% of instate tuition';
    } else {
      calculated.est_tuition_fees = formatCurrency(TFCAP * calculated.tier) + ' / year (up to)';
    }
  };
  

  /*
   * Calculate the estimated housing allowance
   */
  var getHousingAllowance = function () {
    if (calculated.old_gi_bill == true && calculated.only_tuition_fees == true) {
      calculated.est_housing_allowance = formatCurrency(calculated.monthlyrate) + ' / month (full time)*';
    } else if (calculated.old_gi_bill == true || calculated.vre_only == true) {
      calculated.est_housing_allowance = formatCurrency(calculated.monthlyrate) + ' / month (full time)';
    } else if (formData.military_status == 'active duty') {
      calculated.est_housing_allowance = '$0 / month';
    } else if (formData.military_status == 'spouse' && formData.spouse_active_duty) {
      calculated.est_housing_allowance = '$0 / month';
    } else if (calculated.institution_type == 'flight') {
      calculated.est_housing_allowance = '$0 / month';
    } else if (calculated.institution_type == 'correspond') {
      calculated.est_housing_allowance = '$0 / month';
    } else if (calculated.institution_type == 'ojt') {
      calculated.est_housing_allowance = formatCurrency(calculated.tier * institution.bah) + ' / month';
    } else if (formData.online) {
      calculated.est_housing_allowance = formatCurrency(calculated.tier * AVGBAH / 2) + ' / month (full time)';
    } else if (institution.country != 'USA') {
      calculated.est_housing_allowance = formatCurrency(calculated.tier * AVGBAH) + ' / month (full time)';
    } else {
      calculated.est_housing_allowance = formatCurrency(calculated.tier * institution.bah) + ' / month (full time)';
    }
  };

  /*
   * Calculate the estimated book stipend
   */
  var getBookStipend = function () {
    if (formData.gi_bill_chap == 30 || formData.gi_bill_chap == 1607 || formData.gi_bill_chap == 1606 || formData.gi_bill_chap == 35) {
      calculated. est_book_stipend = '$0 / year';
    } else if (calculated.institution_type == 'flight') {
      calculated.est_book_stipend = '$0 / year';
    } else if (calculated.institution_type == 'correspond') {
      calculated.est_book_stipend = '$0 / year';
    } else if (formData.gi_bill_chap == 31) {
      calculated.est_book_stipend = 'Full Cost of Books/Supplies';
    } else {
      calculated.est_book_stipend = formatCurrency(calculated.tier * BSCAP) + ' / year';
    }
  };

  /*
   * Calculate the prepopulated value out-of-state tuiton rates
   */
  var getTuitionOutOfState = function () {
      calculated.tuition_out_of_state = institution.tuition_out_of_state;
  };


  /*
   * Calculate the total number of academic terms
   */
  var getNumberOfTerms = function () {
    if (formData.calendar == 'semesters') {
      calculated.number_of_terms = 2;
    } else if (formData.calendar == 'quarters')  {
      calculated.number_of_terms = 3;
    } else if (formData.calendar == 'nontraditional') {
      calculated.number_of_terms = formData.number_nontrad_terms;
    } else if (calculated.institution_type == 'ojt') {
      calculated.number_of_terms = 4;
    }
  };

  /*
   * Set the net price (Payer of Last Resort)
   */
  var getTuitionNetPrice = function () {
    calculated.tuition_net_price = Math.max(0, Math.min(
      formData.tuition_fees - formData.scholar - formData.tuition_assist
    ));
  };

  /*
   * Set the proper tuition/fees cap
   */
  var getTuitionFeesCap = function () {
   if (calculated.institution_type == 'flight') {
     calculated.tuition_fees_cap = FLTTFCAP;
   } else if (calculated.institution_type == 'correspond') {
     calculated.tuition_fees_cap = CORRESPONDTFCAP;
   } else if (calculated.institution_type == 'public' && institution.country == 'USA' && formData.in_state) {
     calculated.tuition_fees_cap = formData.tuition_fees;
   } else if (calculated.institution_type == 'public' && institution.country == 'USA' && !formData.in_state) {
     calculated.tuition_fees_cap = formData.in_state_tuition_fees;
   } else if (calculated.institution_type == 'private' || calculated.institution_type == 'foreign') {
     calculated.tuition_fees_cap = TFCAP;
   }
  };

  /*
   * Calculate the tuition/fees per term
   */
  var getTuitionFeesPerTerm = function () {
    calculated.tuition_fees_per_term = formData.tuition_fees / calculated.number_of_terms;
  };

  /*
   * Calculate the length of each term
   */
  var getTermLength = function () {
    if (formData.calendar == 'semesters') {
      calculated.term_length = 4.5;
    } else if (formData.calendar == 'quarters')  {
      calculated.term_length = 3;
    } else if (formData.calendar == 'nontraditional') {
      calculated.term_length = formData.length_nontrad_terms;
    } else if (calculated.institution_type == 'ojt') {
      calculated.term_length = 6;
    }
  };

  /*
   * Calculate the length of the academic year
   */
  var getAcadYearLength = function () {
    if (formData.calendar == 'nontraditional') {
      calculated.acad_year_length = formData.number_nontrad_terms * formData.length_nontrad_terms;
    } else {
      calculated.acad_year_length = 9;
    }
  };

 /*
   * Calculate the rate of pursuit for Old GI Bill
   */
  var getRopOld = function () {
    if (formData.rop_old == "full") {
      calculated.rop_old = 1;
    } else if (formData.rop_old == "three quarter") {
      calculated.rop_old = 0.75;
    } else if (formData.rop_old == "half") {
      calculated.rop_old = 0.50;
    } else if (formData.rop_old == "less than half") {
      calculated.rop_old = 0.50;
    } else if (formData.rop_old == "quarter") {
      calculated.rop_old = 0.25;
    }
  };


 /*
   * Calculate the rate of pursuit for Book Stipend
   */
  var getRopBook = function () {
    if (formData.rop == 1) {
      calculated.rop_book = 1;
    } else if (formData.rop == 0.8) {
      calculated.rop_book = 0.75;
    } else if (formData.rop == 0.6) {
      calculated.rop_book = 0.50;
    } else if (formData.rop == 0) {
      calculated.rop_book = 0.25;
    }
  };

  /*
   * Calculate the rate of pursuit for OJT
   */
  var getRopOjt = function () {
    calculated.rop_ojt = formData.ojt_working / 30;
  };

  /*
   * Determine yellow ribbon eligibility
   */
  var getYellowRibbonEligibility = function () {
    if (calculated.tier < 1 || !institution.yr || !formData.yellow_ribbon || formData.military_status == 'active duty') {
      calculated.yellow_ribbon_elig = false;
    } else if (calculated.institution_type == 'ojt' || calculated.institution_type == 'flight' || calculated.institution_type == 'correspond') {
      calculated.yellow_ribbon_elig = false;
    } else {
      calculated.yellow_ribbon_elig = true;
    }
  };

  /*
   * Determine kicker benefit level
   */
  var getKickerBenefit = function () {
    if (!formData.kicker_elig) {
      calculated.kicker_benefit = 0;
    } else {
      calculated.kicker_benefit = formData.kicker;
    }
  };
  

  /*
   * Determine buy up rates
   */
  var getBuyUpRate = function () {
    if (!formData.buy_up_elig) {
      calculated.buy_up_rate = 0;
    } else if (formData.gi_bill_chap !== 30) {
      calculated.buy_up_rate = 0;
    } else {
      calculated.buy_up_rate = (formData.buy_up/4);
    }
  };

  /*
   * Calculate Housing Allowance Rate Final
   */

  var getMonthlyRateFinal = function () {
    calculated.monthly_rate_final = calculated.rop_old * ((calculated.monthlyrate + calculated.buy_up_rate)  + calculated.kicker_benefit);
  };

  /*
   * Calculate the name of Term #1
   */
  var getTerm1 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.term1 = 'Months 1-6';
    } else if (formData.calendar == 'semesters') {
      calculated.term1 = 'Fall';
    } else if (formData.calendar == 'quarters') {
      calculated.term1 = 'Fall';
    } else if (formData.calendar == 'nontraditional') {
      calculated.term1 = 'Term 1';
    }
  };

  /*
   * Calculate the name of Term #2
   */
  var getTerm2 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.term2 = 'Months 7-12';
    } else if (formData.calendar == 'semesters') {
      calculated.term2 = 'Spring';
    } else if (formData.calendar == 'quarters')  {
      calculated.term2 = 'Winter';
    } else if (formData.calendar == 'nontraditional') {
      calculated.term2 = 'Term 2';
    }
  };

  /*
   * Calculate the name of Term #3
   */
  var getTerm3 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.term3 = 'Months 13-18';
    } else if (formData.calendar == 'semesters') {
      calculated.term3 = '';
    } else if (formData.calendar == 'quarters')  {
      calculated.term3 = 'Spring';
    } else if (formData.calendar == 'nontraditional') {
      calculated.term3 = 'Term 3';
    }
  };

  /*
   * Calculate the name of Term #4
   */
  var getTerm4 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.term4 = 'Months 19-24';
    } else {
      calculated.term4 = 'Total (/Yr)';
    }
  };

  /*
   * Calculate Tuition Fees for Term #1
   */
  var getTuitionFeesTerm1 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.tuition_fees_term_1 = 0;
    } else if (calculated.old_gi_bill == true) {
      calculated.tuition_fees_term_1 = 0;
    } else if (formData.gi_bill_chap == 31) {
      calculated.tuition_fees_term_1 = calculated.tuition_fees_per_term;
    } else {
      calculated.tuition_fees_term_1 =
      Math.max(0, Math.min(
      calculated.tier * calculated.tuition_fees_per_term,
      calculated.tier * calculated.tuition_fees_cap,
      calculated.tier * calculated.tuition_net_price
      ));
    }
  };

  /*
   * Calculate Tuition Fees for Term #2
   */
  var getTuitionFeesTerm2 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.tuition_fees_term_2 = 0;
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms == 1) {
      calculated.tuition_fees_term_2 = 0;
    } else if (calculated.old_gi_bill == true) {
      calculated.tuition_fees_term_2 = 0;
    } else if (formData.gi_bill_chap == 31) {
      calculated.tuition_fees_term_2 = calculated.tuition_fees_per_term;
    } else {
      calculated.tuition_fees_term_2 =
      Math.max(0, Math.min(
      calculated.tier * calculated.tuition_fees_per_term,
      calculated.tier * calculated.tuition_fees_cap - calculated.tuition_fees_term_1,
      calculated.tier * calculated.tuition_net_price - calculated.tuition_fees_term_1
      ));
    }
  };

  /*
   * Calculate Tuition Fees for Term #3
   */
  var getTuitionFeesTerm3 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.tuition_fees_term_3 = 0;
    } else if (formData.calendar == 'semesters' || (formData.calendar == 'nontraditional' && calculated.number_of_terms < 3)) {
      calculated.tuition_fees_term_3 = 0;
    } else if (calculated.old_gi_bill == true) {
      calculated.tuition_fees_term_3 = 0;
    } else if (formData.gi_bill_chap == 31) {
      calculated.tuition_fees_term_3 = calculated.tuition_fees_per_term;
    } else {
      calculated.tuition_fees_term_3 =
      Math.max(0, Math.min(
      calculated.tier * calculated.tuition_fees_per_term,
      calculated.tier * calculated.tuition_fees_cap - calculated.tuition_fees_term_1 - calculated.tuition_fees_term_2,
      calculated.tier * calculated.tuition_net_price - calculated.tuition_fees_term_1 - calculated.tuition_fees_term_2
      ));
    }
  };

  /*
   * Calculate the name of Tuition Fees Total
   */
  var getTuitionFeesTotal = function () {
    calculated.tuition_fees_total = calculated.tuition_fees_term_1 +
                                    calculated.tuition_fees_term_2 +
                                    calculated.tuition_fees_term_3;
  };

  /*
   * Calculate Yellow Ribbon for Term #1
   */
  var getYrBenTerm1 = function () {
    if (!calculated.yellow_ribbon_elig || formData.yellow_ben == 0) {
      calculated.yr_ben_term_1 = 0;
    } else if (calculated.old_gi_bill == true || formData.gi_bill_chap == 31) {
      calculated.yr_ben_term_1 = 0;
    } else if (calculated.tuition_fees_per_term == calculated.tuition_fees_term_1) {
      calculated.yr_ben_term_1 = 0;
    } else {
      calculated.yr_ben_term_1 = Math.max(0, Math.min(
        calculated.tuition_fees_per_term - calculated.tuition_fees_term_1,
        calculated.tuition_net_price - calculated.tuition_fees_term_1,
        formData.yellow_ben * 2
        ));
    }
  };

  /*
   * Calculate Yellow Ribbon for Term #2
   */
  var getYrBenTerm2 = function () {
    if (!calculated.yellow_ribbon_elig || formData.yellow_ben == 0) {
      calculated.yr_ben_term_2 = 0;
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms == 1) {
      calculated.yr_ben_term_2 = 0;
    } else if (calculated.old_gi_bill == true || formData.gi_bill_chap == 31) {
      calculated.yr_ben_term_2 = 0;
    } else if (calculated.tuition_fees_per_term == calculated.tuition_fees_term_2) {
      calculated.yr_ben_term_2 = 0;
    } else {
      calculated.yr_ben_term_2 = Math.max(0, Math.min(
          calculated.tuition_fees_per_term - calculated.tuition_fees_term_2,
          calculated.tuition_net_price - calculated.tuition_fees_term_1 - calculated.tuition_fees_term_2 - calculated.yr_ben_term_1,
          formData.yellow_ben * 2 - calculated.yr_ben_term_1
          ));
    }
  };

  /*
   * Calculate Yellow Ribbon for Term #3
   */
  var getYrBenTerm3 = function () {
    if (!calculated.yellow_ribbon_elig || formData.yellow_ben == 0) {
      calculated.yr_ben_term_3 = 0;
    } else if (formData.calendar == 'semesters' || (formData.calendar == 'nontraditional' && calculated.number_of_terms < 3)) {
      calculated.yr_ben_term_3 = 0;
    } else if (calculated.old_gi_bill == true || formData.gi_bill_chap == 31) {
      calculated.yr_ben_term_3 = 0;
    } else if (calculated.tuition_fees_per_term == calculated.tuition_fees_term_3) {
      calculated.yr_ben_term_3 = 0;
    } else {
      calculated.yr_ben_term_3 = Math.max(0, Math.min(
        calculated.tuition_fees_per_term - calculated.tuition_fees_term_3,
        calculated.tuition_net_price - calculated.tuition_fees_term_1 - calculated.tuition_fees_term_2 - calculated.tuition_fees_term_3 - calculated.yr_ben_term_1 - calculated.yr_ben_term_2,
        formData.yellow_ben * 2 - calculated.yr_ben_term_1 - calculated.yr_ben_term_2
        ));
    }
  };

  /*
   * Calculate Yellow Ribbon for the Year
   */
  var getYrBenTotal = function () {
    if (!calculated.yellow_ribbon_elig || formData.yellow_ben == 0) {
      calculated.yr_ben_total = 0;
    } else {
      calculated.yr_ben_total = calculated.yr_ben_term_1 +
                                calculated.yr_ben_term_2 +
                                calculated.yr_ben_term_3;
    }
  };

  /*
   * Calculate Yellow Ribbon by school / VA contributions
   */
  var getYrBreakdown = function () {
    calculated.yr_ben_school_term_1   =       calculated.yr_ben_term_1 / 2;
    calculated.yr_ben_va_term_1       =       calculated.yr_ben_term_1 / 2;
    calculated.yr_ben_school_term_2   =       calculated.yr_ben_term_2 / 2;
    calculated.yr_ben_va_term_2       =       calculated.yr_ben_term_2 / 2;
    calculated.yr_ben_school_term_3   =       calculated.yr_ben_term_3 / 2;
    calculated.yr_ben_va_term_3       =       calculated.yr_ben_term_3 / 2;
    calculated.yr_ben_school_total    =       calculated.yr_ben_total / 2;
    calculated.yr_ben_va_total        =       calculated.yr_ben_total / 2;
  };

  /*
   * Calculate Total Paid to School
   */
  var getTotalPaidToSchool = function () {
    calculated.total_to_school = calculated.tuition_fees_total + calculated.yr_ben_total;
  };

  /*
  * Calculate Total Scholarships and Tuition Assistance
  */
  var getTotalScholarships = function () {
    calculated.total_scholarship_ta = formData.scholar + formData.tuition_assist;
  };

  /*
   * Calculate Total Left to Pay
   */
  var getTotalLeftToPay = function () {
    calculated.total_left_to_pay = Math.max(0, formData.tuition_fees - calculated.total_to_school - formData.scholar - formData.tuition_assist);
  };

  /*
   * Calculate Housing Allowance for Term #1
   */
  var getHousingAllowTerm1 = function () {
   if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'flight') {
      calculated.housing_allow_term_1 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .55) ));
    } else if (formData.gi_bill_chap == 1606 && calculated.institution_type == 'flight') {
      calculated.housing_allow_term_1 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * .55 ));
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_1 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .6)));
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_1 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .6)));
    } else if (calculated.only_tuition_fees) {
      calculated.housing_allow_term_1 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term));
    } else if (calculated.old_gi_bill == true || calculated.vre_only == true) {
      calculated.housing_allow_term_1 = calculated.monthly_rate_final;
    } else if (formData.military_status == 'active duty') {
      calculated.housing_allow_term_1 = (0 + calculated.kicker_benefit);
    } else if (formData.military_status == 'spouse' && formData.spouse_active_duty) {
      calculated.housing_allow_term_1 = (0 + calculated.kicker_benefit);
    } else if (calculated.institution_type == 'flight' || calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_1 = 0;
    } else if (calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_1 = calculated.rop_ojt * (calculated.tier * institution.bah + calculated.kicker_benefit);
    } else if (formData.online) {
      calculated.housing_allow_term_1 = formData.rop * (calculated.tier * AVGBAH / 2 + calculated.kicker_benefit);
    } else if (institution.country != 'USA') {
      calculated.housing_allow_term_1 = formData.rop * ((calculated.tier * AVGBAH) + calculated.kicker_benefit);
    } else {
      calculated.housing_allow_term_1 = formData.rop * ((calculated.tier * institution.bah) + calculated.kicker_benefit);
    }
  };

  /*
   * Calculate Housing Allowance for Term #2
   */
  var getHousingAllowTerm2 = function () {
    if (formData.gi_bill_chap == 35 && calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_2 =  0.75 * calculated.monthly_rate_final;
    } else if (calculated.old_gi_bill == true && calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_2 =  (6.6/9) * calculated.monthly_rate_final;
    } else if (calculated.vre_only == true  && calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_2 = calculated.monthly_rate_final;
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms == 1) {
      calculated.housing_allow_term_2 = 0;
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'flight') {
      calculated.housing_allow_term_2 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .55) ));
    } else if (formData.gi_bill_chap == 1606 && calculated.institution_type == 'flight') {
      calculated.housing_allow_term_2 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * .55 ));
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_2 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .6)));
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_2 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .6)));
    } else if (calculated.only_tuition_fees) {
      calculated.housing_allow_term_2 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term));
    } else if (calculated.old_gi_bill == true || calculated.vre_only == true) {
      calculated.housing_allow_term_2 = calculated.monthly_rate_final;
    } else if (formData.military_status == 'active duty') {
      calculated.housing_allow_term_2 = (0 + calculated.kicker_benefit);
    } else if (formData.military_status == 'spouse' && formData.spouse_active_duty) {
      calculated.housing_allow_term_2 = (0 + calculated.kicker_benefit);
    } else if (calculated.institution_type == 'flight' || calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_2 = 0;
    } else if (calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_2 = 0.8 * calculated.rop_ojt * (calculated.tier * institution.bah + calculated.kicker_benefit);
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms == 1) {
      calculated.housing_allow_term_2 = 0;
    } else if (formData.online) {
      calculated.housing_allow_term_2 = formData.rop * (calculated.tier * AVGBAH/ 2 + calculated.kicker_benefit);
    } else if (institution.country != 'USA') {
      calculated.housing_allow_term_2 = formData.rop * (calculated.tier * AVGBAH + calculated.kicker_benefit);
    } else {
      calculated.housing_allow_term_2 = formData.rop * (calculated.tier * institution.bah + calculated.kicker_benefit);
    }
  };

  /*
   * Calculate Housing Allowance for Term #3
   */
  var getHousingAllowTerm3 = function () {
    if (formData.gi_bill_chap == 35 && calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_3 =  0.494 * calculated.monthly_rate_final;
    } else if (calculated.old_gi_bill == true && calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_3 =  (7/15) * calculated.monthly_rate_final;
    } else if (calculated.vre_only == true  && calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_3 = calculated.monthly_rate_final;
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'flight') {
      calculated.housing_allow_term_3 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .55) ));
    } else if (formData.gi_bill_chap == 1606 && calculated.institution_type == 'flight') {
      calculated.housing_allow_term_3 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * .55 ));
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_3 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .6)));
    } else if (formData.gi_bill_chap == 1607 && calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_3 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term * (formData.consecutive_service * .6)));
    } else if (calculated.only_tuition_fees) {
      calculated.housing_allow_term_3 = Math.max(0, Math.min(calculated.monthly_rate_final, calculated.tuition_fees_per_term));
    } else if (calculated.old_gi_bill == true || calculated.vre_only == true) {
      calculated.housing_allow_term_3 = calculated.monthly_rate_final;
    } else if (formData.military_status == 'spouse' && formData.spouse_active_duty) {
      calculated.housing_allow_term_3 = (0 + calculated.kicker_benefit);
    } else if (calculated.institution_type == 'flight' || calculated.institution_type == 'correspond') {
      calculated.housing_allow_term_3 = 0;
    } else if (calculated.institution_type == 'ojt') {
      calculated.housing_allow_term_3 = 0.6 * calculated.rop_ojt * (calculated.tier * institution.bah + calculated.kicker_benefit);
    } else if (formData.military_status == 'active duty') {
      calculated.housing_allow_term_3 = (0 + calculated.kicker_benefit);
    } else if (formData.calendar == 'semesters') {
      calculated.housing_allow_term_3 = 0;
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms < 3) {
      calculated.housing_allow_term_3 = 0;
    } else if (formData.online) {
      calculated.housing_allow_term_3 = formData.rop * (calculated.tier * AVGBAH / 2 + calculated.kicker_benefit);
    } else if (institution.country != 'USA') {
      calculated.housing_allow_term_3 = formData.rop * (calculated.tier * AVGBAH + calculated.kicker_benefit);
    } else {
      calculated.housing_allow_term_3 = formData.rop * (calculated.tier * institution.bah + calculated.kicker_benefit);
    }
  };

  /*
   * Calculate Housing Allowance Total for year
   */
  var getHousingAllowTotal = function () {
    if (formData.gi_bill_chap == 35 && calculated.institution_type == 'ojt') {
      calculated.housing_allow_total =  0.25 * calculated.monthly_rate_final;
    } else if (calculated.old_gi_bill == true && calculated.institution_type == 'ojt') {
      calculated.housing_allow_total =  (7/15) * calculated.monthly_rate_final;
    } else if (calculated.vre_only == true  && calculated.institution_type == 'ojt') {
      calculated.housing_allow_total = calculated.monthly_rate_final;
    } else if (calculated.institution_type == 'ojt') {
      calculated.housing_allow_total = 0.4 * calculated.rop_ojt * (calculated.tier * institution.bah + calculated.kicker_benefit);
    } else if (calculated.only_tuition_fees) {
      calculated.housing_allow_total = Math.max(0, Math.min(calculated.monthly_rate_final * calculated.acad_year_length, formData.tuition_fees));
    } else {
      calculated.housing_allow_total = calculated.housing_allow_term_1 * calculated.acad_year_length;
    }
  };

  /*
   * Calculate Book Stipend for Term #1
   */
  var getBookStipendTerm1 = function () {
    if (calculated.institution_type == 'flight' || calculated.institution_type == 'correspond') {
      calculated.book_stipend_term_1 = 0;
    } else if (calculated.old_gi_bill == true) {
      calculated.book_stipend_term_1 = 0;
    } else if (formData.gi_bill_chap == 31) {
      calculated.book_stipend_term_1 = BSCAP;
    } else if (calculated.institution_type == 'ojt' && formData.gi_bill_chap == 33) {
      calculated.book_stipend_term_1 = BSOJTMONTH;
    } else {
      calculated.book_stipend_term_1 = calculated.rop_book * BSCAP / calculated.number_of_terms * calculated.tier;
    }
  };

  /*
   * Calculate Book Stipend for Term #2
   */
  var getBookStipendTerm2 = function () {
    if (calculated.institution_type == 'flight' || calculated.institution_type == 'correspond') {
      calculated.book_stipend_term_2 = 0;
    } else if (calculated.institution_type == 'ojt' && formData.gi_bill_chap == 33) {
      calculated.book_stipend_term_2 = BSOJTMONTH;
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms == 1) {
      calculated.book_stipend_term_2 = 0;
    } else if (calculated.old_gi_bill == true) {
      calculated.book_stipend_term_2 = 0;
    } else if (formData.gi_bill_chap == 31) {
      calculated.book_stipend_term_2 = BSCAP;
    } else {
      calculated.book_stipend_term_2 = calculated.rop_book * BSCAP / calculated.number_of_terms * calculated.tier;
    }
  };

  /*
   * Calculate Book Stipend for Term #3
   */
  var getBookStipendTerm3 = function () {
    if (calculated.institution_type == 'flight' || calculated.institution_type == 'correspond') {
      calculated.book_stipend_term_2 = 0;
    } else if  (calculated.institution_type == 'ojt' && formData.gi_bill_chap == 33) {
      calculated.book_stipend_term_3 = BSOJTMONTH;
    } else if (formData.calendar == 'semesters') {
      calculated.book_stipend_term_3 = 0;
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms < 3) {
      calculated.book_stipend_term_3 = 0;
    } else if (calculated.old_gi_bill == true) {
      calculated.book_stipend_term_2 = 0;
    } else if (formData.gi_bill_chap == 31) {
      calculated.book_stipend_term_2 = BSCAP;
    } else {
      calculated.book_stipend_term_3 = calculated.rop_book * BSCAP / calculated.number_of_terms * calculated.tier;
    }
  };

  /*
   * Calculate Book Stipend for Year
   */
  var getBookStipendYear = function () {
    if (calculated.institution_type == 'ojt' && formData.gi_bill_chap == 33) {
      calculated.book_stipend_total = BSOJTMONTH;
    } else {
      calculated.book_stipend_total = calculated.book_stipend_term_1 +
                                      calculated.book_stipend_term_2 +
                                      calculated.book_stipend_term_3;
    }
  };

  /*
   * Calculate Total Payments to You
   */
  var getTotalPaidToYou = function () {
    calculated.total_to_you = calculated.housing_allow_total + calculated.book_stipend_total;
  };

  /*
   * Calculate Total Benefits for Term 1
   */
  var getTotalTerm1 = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.total_term_1 = 0;
    } else {
      calculated.total_term_1 = calculated.tuition_fees_term_1 +
                                calculated.yr_ben_term_1 +
                                calculated.housing_allow_term_1 * calculated.term_length +
                                calculated.book_stipend_term_1;
    }
  };

  /*
   * Calculate Total Benefits for Term 2
   */
  var getTotalTerm2 = function () {
    if (formData.calendar == 'nontraditional' && calculated.number_of_terms == 1) {
      calculated.book_stipend_term_2 = 0;
    } else if (calculated.institution_type == 'ojt') {
      calculated.total_term_2 = 0;
    } else {
      calculated.total_term_2 = calculated.tuition_fees_term_2 +
                                calculated.yr_ben_term_2 +
                                (calculated.housing_allow_term_2 * calculated.term_length) +
                                calculated.book_stipend_term_2;
    }
  };

  /*
   * Calculate Total Benefits for Term 3
   */
  var getTotalTerm3 = function () {
    if (formData.calendar == 'semesters') {
      calculated.total_term_3 = 0;
    } else if (formData.calendar == 'nontraditional' && calculated.number_of_terms < 3) {
      calculated.total_term_3 = 0;
    } else if (calculated.institution_type == 'ojt') {
      calculated.total_term_3 = 0;
    } else {
      calculated.total_term_3 = calculated.tuition_fees_term_3 +
                                calculated.yr_ben_term_3 +
                                (calculated.housing_allow_term_3 * calculated.term_length) +
                                calculated.book_stipend_term_3;
    }
  };

  /*
   * Calculate Text for Total Benefits Row
   */
  var getTotalText = function () { 
    if (formData.gi_bill_chap == 33) {
      calculated.gi_bill_total_text = 'Total Post-9/11 GI Bill Benefits';
    } else if (formData.gi_bill_chap == 30) {
      calculated.gi_bill_total_text = 'Total Montgomery GI Bill Benefits';
    } else if (formData.gi_bill_chap == 1606) {
      calculated.gi_bill_total_text = 'Total Select Reserve GI Bill Benefits';
    } else if (formData.gi_bill_chap == 1607) {
      calculated.gi_bill_total_text = 'Total REAP GI Bill Benefits';
    } else if (formData.gi_bill_chap == 35) {
      calculated.gi_bill_total_text = 'Total DEA GI Bill Benefits';
    } else if (formData.gi_bill_chap == 31) {
      calculated.gi_bill_total_text = 'Total Voc Rehab Benefits';
    }
};

  /*
   * Calculate Total Benefits for Year
   */
  var getTotalYear = function () {
    if (calculated.institution_type == 'ojt') {
      calculated.total_year = 0;
    } else {
      calculated.total_year = calculated.tuition_fees_total +
                              calculated.yr_ben_total +
                              calculated.housing_allow_total +
                              calculated.book_stipend_total;
    }
  };

  /*
   * Draw the graduation rate chart
   */
  var drawGraduationRate = function () {
    var gradMed, gradHigh,
        gradRankMax, gradRankMed, gradRankHigh,
        gradCategory;

    switch (institution.indicator_group) {
      case 1:
        gradMed  = GROUP1GRADMED;
        gradHigh = GROUP1GRADHIGH;
        gradRankMax  = GROUP1GRADRANKMAX;
        gradRankMed  = GROUP1GRADRANKMED;
        gradRankHigh = GROUP1GRADRANKHIGH;
        break;
      case 2:
        gradMed  = GROUP2GRADMED;
        gradHigh = GROUP2GRADHIGH;
        gradRankMax  = GROUP2GRADRANKMAX;
        gradRankMed  = GROUP2GRADRANKMED;
        gradRankHigh = GROUP2GRADRANKHIGH;
        break;
      case 3:
        gradMed  = GROUP3GRADMED;
        gradHigh = GROUP3GRADHIGH;
        gradRankMax  = GROUP3GRADRANKMAX;
        gradRankMed  = GROUP3GRADRANKMED;
        gradRankHigh = GROUP3GRADRANKHIGH;
        break;
      case 5:
        gradMed  = GROUP5GRADMED;
        gradHigh = GROUP5GRADHIGH;
        gradRankMax  = GROUP5GRADRANKMAX;
        gradRankMed  = GROUP5GRADRANKMED;
        gradRankHigh = GROUP5GRADRANKHIGH;
        break;
    }

    if (institution.grad_rate >= gradHigh) {
      gradCategory = 'high';
    } else if (institution.grad_rate >= gradMed) {
      gradCategory = 'medium';
    } else {
      gradCategory = 'low';
    }

    var attr = 'Graduation rate is ' + gradCategory + '.';
    $('#graduation-rates-chart').attr({
      alt: attr,
      title: attr
    });

    var pt = institution.grad_rate_rank,
        el, ui, pos;

    var indent = 30,
        w = 80,
        h = 30,
        y = 69;

    var xText = indent + 40;
    var yText = y + 15;

    switch (gradCategory) {
      case 'high':
        el = { min: gradRankHigh, max: 1 };
        ui = { min: 190, max: 190 + w };
        pos = mapPt(pt, el, ui);
        break;
      case 'medium':
        el = { min: gradRankMed, max: gradRankHigh };
        ui = { min: 110, max: 110 + w };
        pos = mapPt(pt, el, ui);
        break;
      case 'low':
        el = { min: gradRankMax, max: gradRankMed };
        ui = { min: 30, max: 30 + w };
        pos = mapPt(pt, el, ui);
        break;
    }

    $('#graduation-rates-chart').empty();
    var canvas = Raphael('graduation-rates-chart', 300, 100);

    // Draw static elements
    canvas.add([
      // Low rect
      {
        type: 'rect',
        x: indent,
        y: y,
        width: w,
        height: h,
        fill: lightBlue,
        stroke: '#000'
      },
      // Medium rect
      {
        type: 'rect',
        x: indent + w,
        y: y,
        width: w,
        height: h,
        fill: mediumBlue,
        stroke: '#000'
      },
      // High rect
      {
        type: 'rect',
        x: indent + (w * 2),
        y: y,
        width: w,
        height: h,
        fill: darkBlue,
        stroke: '#000'
      },
      // "LOW" text
      {
        type: 'text',
        text: 'LOW',
        x: xText,
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "MEDIUM" text
      {
        type: 'text',
        text: 'MEDIUM',
        x: xText + w,
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "HIGH" text
      {
        type: 'text',
        text: 'HIGH',
        x: xText + (w * 2),
        y: yText,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      }
    ]);

    // Draw dynamic elements

    // Arrow
    var arrow = canvas.path('M0,0 L16,0 L8,10 L0,0');
    arrow.attr({
      fill: darkGray,
      stroke: 'none'
    });
    arrow.translate(pos - 8, y - 13);

    // Percentage
    var percentage = canvas.text(pos, 46, institution.grad_rate + "%");
    percentage.attr({
      'font-family': font,
      'font-size': 16,
      fill: darkGray
    });
  };

  /*
   * Draw the loan default rates chart
   */
  var drawLoanDefaultRates = function () {
    var attr = 'Default rate is ' + institution.default_rate +
               '%, compared to the national average of ' + CDRAVG + '%.';
    $('#loan-default-rates-chart').attr({
      alt: attr,
      title: attr
    });

    $('#loan-default-rates-chart').empty();

    var canvas = Raphael('loan-default-rates-chart', 300, 200);

    var schoolBarHeight = (institution.default_rate / 100) * 145,
        nationalBarHeight = (CDRAVG / 100) * 145;

    canvas.add([
      // Bottom horizontal bar
      {
        type: 'rect',
        x: 25,
        y: 145,
        width: 250,
        height: 4,
        fill: darkGray,
        stroke: 'none'
      },
      // "THIS SCHOOL" text
      {
        type: 'text',
        text: 'THIS SCHOOL',
        x: 88,
        y: 160,
        'font-family': font,
        'font-size': 12,
        fill: darkGray
      },
      // "NATIONAL AVERAGE" text
      {
        type: 'text',
        text: 'NATIONAL AVERAGE',
        x: 220,
        y: 160,
        'font-family': font,
        'font-size': 12,
        fill: darkGray
      },
      // This school bar
      {
        type: 'rect',
        x: 50,
        y: 145 - schoolBarHeight,
        width: 75,
        height: schoolBarHeight,
        fill: mediumBlue,
        stroke: 'none'
      },
      // This school percentage
      {
        type: 'text',
        text: institution.default_rate + "%",
        x: 90,
        y: 177,
        'font-family': font,
        'font-size': 16,
        fill: darkGray
      },
      // National average bar
      {
        type: 'rect',
        x: 175,
        y: 145 - nationalBarHeight,
        width: 75,
        height: nationalBarHeight,
        fill: darkGray,
        stroke: 'none'
      },
      // National average percentage
      {
        type: 'text',
        text: CDRAVG + "%",
        x: 215,
        y: 177,
        'font-family': font,
        'font-size': 16,
        fill: darkGray
      }
    ]);
  };

  /*
   * Draw the median borrowing chart
   */
  var drawMedianBorrowingChart = function () {
    var loanMed, loanHigh,
        loanRankMax, loanRankMed, loanRankHigh,
        loanCategory;

    switch (institution.indicator_group) {
      case 1:
        loanMed  = GROUP1LOANMED;
        loanHigh = GROUP1LOANHIGH;
        loanRankMax  = GROUP1LOANRANKMAX;
        loanRankMed  = GROUP1LOANRANKMED;
        loanRankHigh = GROUP1LOANRANKHIGH;
        break;
      case 2:
        loanMed  = GROUP2LOANMED;
        loanHigh = GROUP2LOANHIGH;
        loanRankMax  = GROUP2LOANRANKMAX;
        loanRankMed  = GROUP2LOANRANKMED;
        loanRankHigh = GROUP2LOANRANKHIGH;
        break;
      case 3:
        loanMed  = GROUP3LOANMED;
        loanHigh = GROUP3LOANHIGH;
        loanRankMax  = GROUP3LOANRANKMAX;
        loanRankMed  = GROUP3LOANRANKMED;
        loanRankHigh = GROUP3LOANRANKHIGH;
        break;
      case 5:
        loanMed  = GROUP5LOANMED;
        loanHigh = GROUP5LOANHIGH;
        loanRankMax  = GROUP5LOANRANKMAX;
        loanRankMed  = GROUP5LOANRANKMED;
        loanRankHigh = GROUP5LOANRANKHIGH;
        break;
    }

    if (institution.avg_stu_loan_debt >= loanHigh) {
      loanCategory = 'high';
    } else if (institution.avg_stu_loan_debt >= loanMed) {
      loanCategory = 'medium';
    } else {
      loanCategory = 'low';
    }

    var attr = 'Median Borrowing is ' + loanCategory + '.';
    $('#median-borrowing-chart').attr({
      alt: attr,
      title: attr
    });

    var pt = institution.avg_stu_loan_debt_rank,
        el, ui, pos;

    switch (loanCategory) {
      case 'high':
        el = { min: loanRankHigh, max: loanRankMax };
        ui = { min: 120, max: 180 };
        pos = mapPt(pt, el, ui);
        break;
      case 'medium':
        el = { min: loanRankMed, max: loanRankHigh };
        ui = { min: 60, max: 120 };
        pos = mapPt(pt, el, ui);
        break;
      case 'low':
        el = { min: 1, max: loanRankMed };
        ui = { min: 0, max: 60 };
        pos = mapPt(pt, el, ui);
        break;
    }

    $('#median-borrowing-chart').empty();
    var canvas = Raphael('median-borrowing-chart', 300, 150);

    canvas.add([
      // Low wedge
      {
        type: 'path',
        path: wedgePath(150, 120, 180, 240, 100),
        fill: lightBlue,
        stroke: 'none'
      },
      // Medium wedge
      {
        type: 'path',
        path: wedgePath(150, 120, 240, 300, 100),
        fill: mediumBlue,
        stroke: 'none'
      },
      // High wedge
      {
        type: 'path',
        path: wedgePath(150, 120, 300, 360, 100),
        fill: darkBlue,
        stroke: 'none'
      },
      // "LOW" text
      {
        type: 'text',
        text: 'LOW',
        x: 85,
        y: 85,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "MEDIUM" text
      {
        type: 'text',
        text: 'MEDIUM',
        x: 150,
        y: 50,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // "HIGH" text
      {
        type: 'text',
        text: 'HIGH',
        x: 215,
        y: 85,
        'font-family': font,
        'font-size': 12,
        fill: '#fff'
      },
      // Amount text
      {
        type: 'text',
        text: formatCurrency(institution.avg_stu_loan_debt),
        x: 150,
        y: 135,
        'font-family': font,
        'font-weight': 'bold',
        'font-size': 18,
        fill: darkGray
      }
    ]);

    // Arrow
    var arrow = canvas.path('M25,0 L25,10 L-25,5 L25,0');
    arrow.attr({
      fill: '#fff',
      stroke: '#fff',
      'stroke-width': 2
    });
    arrow.transform('t125,110');

    // Calculate rotation point
    var arrowBox = arrow.getBBox();
    var xRotatePoint = arrowBox.x + arrowBox.width;
    var yRotatePoint = arrowBox.y + arrowBox.height / 2;
    arrow.transform(arrow.attr('transform')+'t'+(arrowBox.height / 2)+',0'+
                    'R'+pos+','+xRotatePoint+','+yRotatePoint);

    // Small gray circle
    canvas.add([{
      type: 'path',
      path: wedgePath(150, 120, 180, 360, 15),
      fill: darkGray,
      stroke: 'none'
    }]);
  };

  /*
   * Creates an SVG wedge path
   * Adapted from: stackoverflow.com/questions/13092979/svg-javascript-pie-wedge-generator
   */
  var wedgePath = function (x, y, startAngle, endAngle, r) {
    var x1 = x + r * Math.cos(Math.PI * startAngle / 180),
        y1 = y + r * Math.sin(Math.PI * startAngle / 180),
        x2 = x + r * Math.cos(Math.PI * endAngle / 180),
        y2 = y + r * Math.sin(Math.PI * endAngle / 180);

    return 'M'+x+' '+y+' L'+x1+' '+y1+' A'+r+' '+r+' 0 0 1 '+x2+' '+y2+' z';
  };

  /*
   * Maps a point to an underlying pixel grid
   * Parameters:
   *   pt  Number
   *   el  Object  { min: Number, max: Number }
   *   ui  Object  { min: Number, max: Number }
   */
  var mapPt = function(pt, el, ui) {
    return (pt - el.min) * ((ui.max - ui.min) / (el.max - el.min)) + ui.min;
  };

  /*
   * Update benefit information
   */
  var update = function (facility_code) {
    if (facility_code !== undefined) {
      formData.facility_code = facility_code;
    }

    // Get user data from the form
    getFormData();

    // An institution must be selected to proceed
    if (!formData.facility_code) { return; }

    if (formData.facility_code == institution.facility_code) {
      // Just do an update with existing institution, no $.getJSON call
      updatePage();
    } else {
      // Lookup the new institution
      getInstitution(formData.facility_code, function () {
        console.log("*** " + institution.institution + " ***");
        console.log("Institution Data:");
        console.log(institution);

        // Reset values with new institution
        $('#yellow-ribbon-recipient-no').prop('checked', true);
        $('#yellow-ribbon-amount').val('$0');
        $('#scholar').val('$0');
        $('#tuition-assist').val('$0');
        $('#kicker-elig-no').prop('checked', true);
        $('#kicker').val('$200');
        $('#buy-up-no').prop('checked', true);

        getFormData();

        // Reset element visibility
        $('#benefit-estimator').show();
        $('#calculator').hide();
        $('#calculate-benefits-btn').show();
        $('#add-favorite-school-checkbox').prop('checked', institutionFavorited(institution.institution));
        resetCalcBtn();

        $('#tuition-fees-input').val(formatCurrency(institution.tuition_in_state));
        $('#in-state-tuition-fees').val(formatCurrency(institution.tuition_in_state));
        formData.tuition_fees = institution.tuition_in_state;

        // Set term calendar from the institution data if present
        if (institution.calendar) {
          formData.calendar = institution.calendar;
          $('#calendar').val(institution.calendar);
        } else {
          formData.calendar = 'semesters';
          $('#calendar').val('semesters');
        }

        // Reset opening calculator tracking
        didOpenCalculator = false;

        updatePage();
      });
    }
  };

  /*
   * Update the entire page
   */
  var updatePage = function () {
    console.log('--- Updating Page ---');

    // Calculate values
    formatLocation();
    getInstitutionType();
    getInstitutionTypeForDisplay();
    getTier();
    getOldGIBill();
    getVREOnly();
    getOnlyTuitionFees();
    getMonthlyRate();
    getTuitionFees();
    getHousingAllowance();
    getBookStipend();
    getTuitionOutOfState();
    getNumberOfTerms();
    getTuitionNetPrice();
    getTuitionFeesCap();
    getTuitionFeesPerTerm();
    getTermLength();
    getAcadYearLength();
    getRopOld();
    getRopBook();
    getRopOjt();
    getKickerBenefit();
    getBuyUpRate();
    getMonthlyRateFinal();
    getYellowRibbonEligibility();
    getTerm1();
    getTerm2();
    getTerm3();
    getTerm4();
    getTuitionFeesTerm1();
    getTuitionFeesTerm2();
    getTuitionFeesTerm3();
    getTuitionFeesTotal();
    getYrBenTerm1();
    getYrBenTerm2();
    getYrBenTerm3();
    getYrBenTotal();
    getYrBreakdown();
    getHousingAllowTerm1();
    getHousingAllowTerm2();
    getHousingAllowTerm3();
    getHousingAllowTotal();
    getBookStipendTerm1();
    getBookStipendTerm2();
    getBookStipendTerm3();
    getBookStipendYear();
    getTotalTerm1();
    getTotalTerm2();
    getTotalTerm3();
    getTotalPaidToSchool();
    getTotalLeftToPay();
    getTotalScholarships();
    getTotalPaidToYou();
    getTotalYear();
    getTotalText();


    // Log values for testing
    console.log("Form Data:");
    console.log(formData);
    console.log("Calculated Values:");
    console.log(calculated);

    // Write results to the page
    $('#benefit-estimator table').removeClass('inactive');
    $('#institution').html(institution.institution);
    $('#location').html(calculated.location);
    $('#type').html(calculated.institution_type_display);
    $('#tuition-fees').html(calculated.est_tuition_fees);
    $('#housing-allowance').html(calculated.est_housing_allowance);
    $('#book-stipend').html(calculated.est_book_stipend);
    $('#profile').show();

    $('#poe').html(institution.poe ? 'Yes' : 'No');

    if (institution.yr) {
      var location = institution.country == 'USA' ? institution.state : 'overseas';
      var linkFirstHalf = '<a href="http://www.benefits.va.gov/gibill/yellow_ribbon/2014/states/' + location + '.asp" onclick="track(\'Yellow Ribbon Rates\', \'';
      var linkSecondHalf = '\');" target="_blank">See YR rates &raquo;</a>';

      var linkVetIndicators = linkFirstHalf + 'Vet Indicators' + linkSecondHalf;
      var linkCalculator = linkFirstHalf + 'Calculator' + linkSecondHalf;

      $('#yr').html('Yes &nbsp; ' + linkVetIndicators);
      $('#yellow-ribbon-rates-link').html(linkCalculator);
    } else {
      $('#yr').html('No');
    }

    $('#gibill').html(institution.gibill ? formatNumber(institution.gibill) : 0);

    $('#institution-calculator').html(institution.institution);
    $('#location-calculator').html(calculated.location);
    $('#type-calculator').html(calculated.institution_type_display);

    $('#tuition-out-of-state').html(calculated.tuition_out_of_state)
    $('#numberofterms').html(calculated.number_of_terms);
    $('#termlength').html(calculated.term_length);
    $('#acadyearlength').html(calculated.acad_year_length);
    $('#yr_console').html(institution.yr);

    $('.term1').html(calculated.term1);
    $('.term2').html(calculated.term2);
    $('.term3').html(calculated.term3);
    $('.term4').html(calculated.term4);

    $('#tuition-fees-term-1').html(formatCurrency(calculated.tuition_fees_term_1));
    $('#tuition-fees-term-2').html(formatCurrency(calculated.tuition_fees_term_2));
    $('#tuition-fees-term-3').html(formatCurrency(calculated.tuition_fees_term_3));
    $('#tuition-fees-total').html(formatCurrency(calculated.tuition_fees_total));

    $('#yr-ben-term-1').html(formatCurrency(calculated.yr_ben_school_term_1));
    $('#yr-ben-term-2').html(formatCurrency(calculated.yr_ben_school_term_2));
    $('#yr-ben-term-3').html(formatCurrency(calculated.yr_ben_school_term_3));
    $('#yr-ben-total').html(formatCurrency(calculated.yr_ben_school_total));

    $('#yr-ben-term-va-1').html(formatCurrency(calculated.yr_ben_va_term_1));
    $('#yr-ben-term-va-2').html(formatCurrency(calculated.yr_ben_va_term_2));
    $('#yr-ben-term-va-3').html(formatCurrency(calculated.yr_ben_va_term_3));
    $('#yr-ben-va-total').html(formatCurrency(calculated.yr_ben_va_total));

    $('#total-paid-to-school').html(formatCurrency(calculated.total_to_school));
    $('#total-tuition-fees-scholarships').html(formatCurrency(calculated.total_scholarship_ta));
    $('#total-tuition-fees-charged').html(formatCurrency(formData.tuition_fees));

    $('#total-left-to-pay').html(formatCurrency(calculated.total_left_to_pay));
    if (calculated.total_left_to_pay > 0) {
      $('#total-left-to-pay').addClass('red');
    } else {
      $('#total-left-to-pay').removeClass('red');
    }

    $('#housing-allow-term-1').html(formatCurrency(calculated.housing_allow_term_1) + ' /month');
    $('#housing-allow-term-2').html(formatCurrency(calculated.housing_allow_term_2) + ' /month');
    $('#housing-allow-term-3').html(formatCurrency(calculated.housing_allow_term_3) + ' /month');
    $('#housing-allow-total').html(formatCurrency(calculated.housing_allow_total));

    $('#book-stipend-term-1').html(formatCurrency(calculated.book_stipend_term_1));
    $('#book-stipend-term-2').html(formatCurrency(calculated.book_stipend_term_2));
    $('#book-stipend-term-3').html(formatCurrency(calculated.book_stipend_term_3));
    $('#book-stipend-total').html(formatCurrency(calculated.book_stipend_total));

    if (calculated.institution_type == 'ojt') {
      $('#housing-allow-total').append(' /month');
      $('#book-stipend-term-1').append(' /month');
      $('#book-stipend-term-2').append(' /month');
      $('#book-stipend-term-3').append(' /month');
      $('#book-stipend-total').append(' /month');
    }

    $('#total-term-1').html(formatCurrency(calculated.total_term_1));
    $('#total-term-2').html(formatCurrency(calculated.total_term_2));
    $('#total-term-3').html(formatCurrency(calculated.total_term_3));

    $('#total-paid-to-you').html(formatCurrency(calculated.total_to_you));
    $('#total-year-td').html(calculated.gi_bill_total_text);
    $('#total-year').html(formatCurrency(calculated.total_year));

    if (institution.student_veteran) {
      $('#student-veterans').html('Yes');
      if (institution.student_veteran_link) {
        $('#student-veterans').append(' &nbsp; <a href="'+ institution.student_veteran_link +'" onclick="track(\'Student Veterans Group\', \'Click\');" target="_blank">Go to site &raquo;</a>');
      }
    } else {
      $('#student-veterans').html('No');
    }

    $('#vet-success').html('Yes &nbsp; <a href="mailto:'+ institution.vetsuccess_email +'" onclick="track(\'Vet Success\', \'Email\');">Email '+ institution.vetsuccess_name +' &raquo;</a>');

    // Show/hide elements (defaults) ///////////////////////////////////////////

    $('#online-classes').show();
    $('#voc-rehab').hide();
    $('#voc-rehab-warning').hide();
    $('#only-tuition-fees').hide();
    $('#veteran-indicators').show();
    $('#vet-success-row').hide();
    $('#eight-keys-row').hide();
    $('#school-indicators').show();

    // Tuition/Fees Input Results
    $('#tuition-fees-section').show();
    $('#in-state').hide();
    $('#in-state-tuition-fees-form').hide();
    $('#yellow-ribbon-recipient-form').hide();
    $('#yellow-ribbon-amount-form').hide();
    $('#yellow-ribbon-rates-link').hide();
    $('#scholar-form').show();
    $('#tuition-assist-form').hide();

    // Enrollment Inputs
    $('#enrollment-section').show();
    $('#enrolled-form').show();
    $('#enrolled-form-old-gi-bill').hide();
    $('#working-form').hide();
    $('#calendar-form').show();
    $('#number-non-traditional-terms-form').hide();
    $('#length-non-traditional-terms-form').hide();
    $('#kicker-elig-form').show();
    $('#kicker-form').hide();
    $('#buy-up-form').hide();
    $('#buy-up-rate-form').hide();

    // Calculator Results
    $('#paid-school-calculator').show();
    $('#calc-tuition-fees-row').show();
    $('#calc-yellow-ribbon-row').show();
    $('#calc-yellow-ribbon-va-row').show();
    $('#calc-paid-to-school-total-row').show();
    $('#calc-tuition-fees-scholarship-row').show();
    $('#calc-tuition-fees-charged-row').show();
    $('#calc-out-of-pocket-row').show();
    $('#calc-paid-to-you-total-row').show();
    $('#calc-tuition-only-row').hide();
    $('#paid-to-you-calculator').show();
    $('#calc-term-total-row').show();

    // Calculator Results - Particular Terms
    $('#term2').show();
    $('#term3').show();
    $('#tuition-fees-term-2').show();
    $('#tuition-fees-term-3').show();
    $('#yr-ben-term-2').show();
    $('#yr-ben-term-3').show();
    $('#yr-ben-term-va-2').show();
    $('#yr-ben-term-va-3').show();
    $('#housing-allow-term-2').show();
    $('#housing-allow-term-3').show();
    $('#book-stipend-term-2').show();
    $('#book-stipend-term-3').show();
    $('#total-term-2').show();
    $('#total-term-3').show();

    // Show/Hide elements (overrides) //////////////////////////////////////////

    if ((getFavoriteSchoolsArray().length < 3) || (institutionFavorited(institution.institution))) {
      $('#add-to-favorites').show();
    } else {
      $('#add-to-favorites').hide();
    }
    
    if (formData.cumulative_service == 'service discharge') {
      $('#voc-rehab').show();
    }
    
    if (calculated.only_tuition_fees == true) {
      $('#only-tuition-fees').show();
      $('#calc-tuition-only-row').show();
    } else {
      $('#only-tuition-fees').hide();
      $('#calc-tuition-only-row').hide();
    }
    
    if (formData.gi_bill_chap == 31 && calculated.vre_only == false) {
      $('#enrolled-form').show();
      $('#enrolled-form-old-gi-bill').hide();
      $('#yellow-ribbon-recipient-form').hide();
      $('#yellow-ribbon-amount-form').hide();
      $('#yellow-ribbon-rates-link').hide();
      $('#scholar-form').hide();
      $('#tuition-assist-form').hide();
      $('#calc-yellow-ribbon-row').hide();
    }
    
    if (calculated.institution_type == 'ojt') {
      $('#online-classes').hide();
      $('#veteran-indicators').hide();
      $('#school-indicators').hide();
      $('#tuition-fees-section').hide();
      $('#enrolled-form').hide();
      $('#enrolled-form-old-gi-bill').hide();
      $('#working-form').show();
      $('#calendar-form').hide();
      $('#scholar-form').hide();
      $('#tuition-assist-form').hide();
      $('#paid-school-calculator').hide();
      $('#calc-tuition-fees-row').hide();
      $('#calc-yellow-ribbon-row').hide();
      $('#calc-yellow-ribbon-va-row').hide();
      $('#calc-paid-to-school-total-row').hide();
      $('#calc-tuition-fees-scholarship-row').hide();
      $('#calc-tuition-fees-charged-row').hide();
      $('#calc-out-of-pocket-row').hide();
      $('#calc-paid-to-you-total-row').hide();
      $('#paid-to-you-calculator').hide();
      $('#calc-term-total-row').hide();
      $('#calc-tuition-only-row').hide();
    }

    if (calculated.institution_type == 'flight' ||
        calculated.institution_type == 'correspond') {
      $('#online-classes').hide();
      $('#enrolled-form').hide();
      $('#enrolled-form-old-gi-bill').hide();
      $('#kicker-elig-form').hide();
      $('#buy-up-form').hide();
    }

    if (calculated.institution_type == 'public') {
      $('#in-state').show();
      if (!formData.in_state) {
        $('#in-state-tuition-fees-form').show();
      }
    }

    if (institution.yr && calculated.tier == 1.0) {
      $('#yellow-ribbon-recipient-form').show();
      if (formData.yellow_ribbon) {
        $('#yellow-ribbon-amount-form').show();
        $('#yellow-ribbon-rates-link').show();
      }
    }

    if (calculated.institution_type != 'ojt' && formData.calendar == 'nontraditional') {
      $('#number-non-traditional-terms-form').show();
      $('#length-non-traditional-terms-form').show();
    }
    
    if (calculated.old_gi_bill == true || calculated.vre_only == true) {
      $('#enrolled-form').hide();
      $('#enrolled-form-old-gi-bill').show();
      $('#yellow-ribbon-recipient-form').hide();
      $('#yellow-ribbon-amount-form').hide();
      $('#yellow-ribbon-rates-link').hide();
      $('#scholar-form').hide();
      $('#calc-yellow-ribbon-row').hide();
    }

    if (formData.kicker_elig) {
      $('#kicker-form').show();
    }

    if (formData.buy_up_elig) {
      $('#buy-up-rate-form').show();
    }

    if (formData.gi_bill_chap == 30) {
      $('#buy-up-form').show();
    } else {
      $('#buy-up-form').hide();
      $('#buy-up-rate-form').hide();      
    }

    if ((formData.military_status == 'active duty' ||
        formData.military_status == 'national guard / reserves') &&
        formData.gi_bill_chap == 33) {
      $('#tuition-assist-form').show();
    } else {
      $('#tuition-assist-form').hide();
    }

    if (!calculated.yellow_ribbon_elig) {
      $('#calc-yellow-ribbon-row').hide();
      $('#calc-yellow-ribbon-va-row').hide();
    }

    if (calculated.total_scholarship_ta == 0) {
      $('#calc-tuition-fees-scholarship-row').hide();
    }

    // Calculator

    $('#paid-to-school-td').prop('colspan', 3);
    $('#tuition-fees-charged-td').prop('colspan', 3);
    $('#total-left-to-pay-td').prop('colspan', 3);
    $('#total-paid-to-you-td').prop('colspan', 3);
    $('#total-year-td').prop('colspan', 3);

    if (calculated.number_of_terms == 1) {
      $('#term2').hide();
      $('#term3').hide();
      $('#tuition-fees-term-2').hide();
      $('#tuition-fees-term-3').hide();
      $('#yr-ben-term-2').hide();
      $('#yr-ben-term-3').hide();
      $('#yr-ben-term-va-2').hide();
      $('#yr-ben-term-va-3').hide();
      $('#housing-allow-term-2').hide();
      $('#housing-allow-term-3').hide();
      $('#book-stipend-term-2').hide();
      $('#book-stipend-term-3').hide();
      $('#total-term-2').hide();
      $('#total-term-3').hide();
      $('#paid-to-school-td').prop('colspan', 1);
      $('tuition-fees-scholarship-td').prop('colspan', 1);
      $('#tuition-fees-charged-td').prop('colspan', 1);
      $('#total-left-to-pay-td').prop('colspan', 1);
      $('#total-paid-to-you-td').prop('colspan', 1);
      $('#total-year-td').prop('colspan', 1);
      $('calc-tuition-only-td').prop('colspan', 3);
    }

    if (calculated.number_of_terms < 3 && calculated.institution_type != 'ojt') {
      $('#term3').hide();
      $('#tuition-fees-term-3').hide();
      $('#yr-ben-term-3').hide();
      $('#yr-ben-term-va-3').hide();
      $('#housing-allow-term-3').hide();
      $('#book-stipend-term-3').hide();
      $('#total-term-3').hide();
      $('#paid-to-school-td').prop('colspan', 2);
      $('tuition-fees-scholarship-td').prop('colspan', 2);
      $('#tuition-fees-charged-td').prop('colspan', 2);
      $('#total-left-to-pay-td').prop('colspan', 2);
      $('#total-paid-to-you-td').prop('colspan', 2);
      $('#total-year-td').prop('colspan', 2);
    }

    if (calculated.number_of_terms == 3 || calculated.institution_type == 'ojt') {
          $('#total-year-td').prop('colspan', 4);
    }

    // Veteran Indicators  /////////

    // Vet Success
    if (institution.vetsuccess_name) {
      $('#vet-success-row').show();
    }

    // 8 Keys
    if (institution.eight_keys) {
     $('#eight-keys-row').show();
    }

    // School Indicators
    if (institution.indicator_group === null ||
        institution.indicator_group == 4) {
      $('#graduation-rates-chart').html('<p>Not Reported</p>');
      $('#loan-default-rates-chart').html('<p>Not Reported</p>');
      $('#median-borrowing-chart').html('<p>Not Reported</p>');

    // Draw the charts
    } else {
      if (institution.grad_rate !== null) {
        drawGraduationRate();
      } else {
        $('#graduation-rates-chart').html('<p>Not Reported</p>');
      }

      if (institution.default_rate !== null) {
        drawLoanDefaultRates();
      } else {
        $('#loan-default-rates-chart').html('<p>Not Reported</p>');
      }

      if (institution.avg_stu_loan_debt !== null) {
        drawMedianBorrowingChart();
      } else {
        $('#median-borrowing-chart').html('<p>Not Reported</p>');
      }
    }

    // More information about school link
    $('#navigator-link').html(
      "<p><a href='http://nces.ed.gov/collegenavigator/?id=" +
      institution.cross +
      "' onclick=\"track('Tool Tips', 'School Indicators / College Navigator');\" target='newtab'>More information about your school &raquo;</a></p>");
  };

  /*
   * Update the in/out of state values
   */
  var updateInState = function () {
    if (!formData.in_state) {
      $('#tuition-fees-input').val(formatCurrency(institution.tuition_out_of_state));
    } else {
      $('#tuition-fees-input').val(formatCurrency(institution.tuition_in_state));
    }
  };

  /*
   * Track the opening of the calculator per school
   */
  var trackOpenCalculator = function () {
    if (!didOpenCalculator) {
      track('Calculator', 'Open');
      didOpenCalculator = true;
    }
  };

  // Initialize page

  $(document).ready(function () {

    // Initialize favorite schools session data
    if (sessionStorage.favorite_schools === undefined) {
      sessionStorage.setItem('favorite_schools', JSON.stringify([]));
      sessionStorage.setItem('html_fav_schools', JSON.stringify([]));
    }
    // Initialize favorite selections display data
    $('#number-of-favorites-selected').text(getFavoriteSchoolsArray().length);
    $('#favorites-list').text(getFavoriteSchoolsArray());
    
    // Bind event handlers to form elements
    $('#military-status, ' +
      '#spouse-active-duty-yes, #spouse-active-duty-no, ' +
      '#gi-bill-chapter, ' +
      '#number-of-dependents, ' +
      '#elig-for-post-gi-bill-yes, #elig-for-post-gi-bill-no, ' +
      '#cumulative-service,' +
      '#enlistment-service, ' +
      '#consecutive-service, ' +
      '#online-classes-yes, #online-classes-no, ' +
      '#in-state-yes, #in-state-no, ' +
      // '#tuition-fees-input, ' +
      '#in-state-tuition-fees, ' +
      '#yellow-ribbon-recipient-yes, #yellow-ribbon-recipient-no,  ' +
      '#yellow-ribbon-amount, ' +
      // '#enrolled, ' +
      // '#enrolled-old, ' +
      '#working, ' +
      // '#calendar, ' +
      '#number-non-traditional-terms, ' +
      '#length-non-traditional-terms, ' +
      // '#kicker-elig-yes, #kicker-elig-no, ' +
      '#kicker, ' +
      '#buy-up-yes, #buy-up-no,  ' +
      '#buy-up-rate, ' +
      // '#scholar, ' +
      '#tuition-assist').on('change', function () {
      GIBComparisonTool.update();
    });

    $('#in-state-yes, #in-state-no').on('change', function () {
      updateInState();
      GIBComparisonTool.update();
    });

    // Removing this to bind instead to calculate button.
    /*
    $('#tuition-fees-input, #in-state-tuition-fees,' +
      '#yellow-ribbon-amount, #scholar, #kicker').bindWithDelay('keyup', function(e) {
      $(this).change();
    }, 1000);
    */
    
    $('#calculate-benefits').click(function () {
      $('#estimated-benefits').hide();
      GIBComparisonTool.update();
      $('#calculated-benefits').show();
    });
    
    $('#clear-calculated-benefits').click(function () {
      $('#calculated-benefits').hide();
      $('#estimated-benefits').show();
    });

    // Hide elements on load
    
    // old elements (may no longer be needed)
    $('#enlistment-service-form').hide();
    $('#consecutive-service-form').hide();
    $('#number-of-dependents-form').hide();
    $('#elig-for-post-gi-bill-form').hide();
    $('#calculate-benefits-btn').hide();
    $('#spouse-active-duty-form').hide();
    $('voc-rehab-warning').hide();
    $('#institution-select').hide();
    $('#veteran-indicators').hide();
    $('#only-tuition-fees').hide();
    $('#voc-rehab').hide();
    $('#school-indicators').hide();
    $('#tuition-fees-section').hide();
    $('#enrollment-section').hide();
    $('#calculator').hide();
    $('#add-to-favorites').hide();
    
    // new profile elements
    $('#calculated-benefits').hide();
    
    // Load institution data
    $.getJSON('api/institutions.json', function (data) {

      var label = "";
      for (var i = 0; i < data.length; i++) {

        if (data[i][4] == "USA") {
          label = data[i][1] + ' (' + data[i][2] + ', ' + data[i][3] + ')';
        } else {
          label = data[i][1] + ' (' + data[i][2] + ', ' + data[i][4] + ')';
        }

        institutions.push({ value:   data[i][0],
                            label:   label,
                            city:    data[i][2],
                            state:   data[i][3],
                            country: data[i][4] });
      }

      $('#institution-search').autocomplete({
        minLength: 3,
        source: function (request, response) {
          var results = [],
              state = $('#filter-state').val(),
              institution_type = $('#filter-institution-type').val();

          // Do filtering stuff
          if ($('#filter-results-box').is(':visible')) {
            for (var i = 0; i < institutions.length; i++) {
              if (((state == institutions[i].state || state == "") ||
                  (state == 'foreign' && institutions[i].country != 'USA')) &&
                  (institution_type == getInstitutionTypeForSearch(institutions[i].value) || institution_type == "")) {
                results.push(institutions[i]);
              }
            }
          } else {
            results = institutions;
          }

          results = $.ui.autocomplete.filter(results, request.term);

          if (results == 0) {
            response(["*** No Schools / Employers Found ***"]);
          } else {
            response(results.slice(0, 200));
          }
        },
        select: function (event, ui) {
          event.preventDefault();
          $('#institution-search').val(ui.item.label);
          formData.facility_code = ui.item.value;
          GIBComparisonTool.update();

          // Track when institution is selected
          _gaq.push(['_trackEvent', 'School Interactions', 'School Added', formData.facility_code]);
        },
        focus: function (event, ui) {
          event.preventDefault();
          $('#institution-search').val(ui.item.label);
        }
      });

    });
  });


  return {
    update: update,
    trackOpenCalculator: trackOpenCalculator
  };
})();

/*
 * Toggle filter results
 */
function toggleFilterResults () {
  $('#filter-results-box').toggle();
}


/*
 * Toggle between calculator and benefit estimator
 */
function toggleCalc () {
  $('#benefit-estimator').toggle();
  $('#calculator').toggle();
  $('#calculate-benefits-btn a').html();

  var benStr = "How much am I going to get?";
  var calcStr = "Return to Summary"
  if ($('#calculate-benefits-btn a').html() == benStr) {
    $('#calculate-benefits-btn a').html(calcStr);
    scrollToAnchor('calculator');
  } else {
    $('#calculate-benefits-btn a').html(benStr);
    scrollToAnchor('benefit-estimator');
  }
}


/*
 * Reset the calculator button text
 */
function resetCalcBtn () {
  $('#calculate-benefits-btn a').html("How much am I going to get?");
}


/*
 * Scroll to anchor
 */
function scrollToAnchor (id) {
  var aTag = $("a[name='"+ id +"']");
  $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}

/* 
 * Retrieve array of session's favorite school
 */
function getFavSchoolsHtmlArray () {
  return JSON.parse(sessionStorage.getItem('html_fav_schools'));
}

/* 
 * Retrieve array of session's favorite schools 
 */
function getFavoriteSchoolsArray () {
  return JSON.parse(sessionStorage.getItem('favorite_schools'));
}


/*
 * Has this institution been selected as a favorite? 
 */
function institutionFavorited (institution) {
  return (getFavoriteSchoolsArray().indexOf(institution) >= 0);
}


/*
 * Add or remove a favorite school 
 */
function processFavoriteSchool () {
  var f_schools_html = getFavSchoolsHtmlArray();
  var f_schools = getFavoriteSchoolsArray();
  var institution = $('#institution').text();
  var table_data = $('#name-summary').html() + $('#estimated-benefits').html();

    if ($('#add-favorite-school-checkbox').is(':checked') && !(institutionFavorited(institution))) {
      /* save institution name */
      f_schools.push(institution);
      /* save institution-related data as html */
      f_schools_html.push(table_data);
    } else {
      /* remove schools data from sessionStorage */
      if (!$('#add-favorite-school-checkbox').is(':checked') && (institutionFavorited(institution))) {
        f_schools.splice(f_schools.indexOf(institution), 1);
        f_schools_html.splice(f_schools.indexOf(institution), 1);
      }
    }
  sessionStorage.setItem('favorite_schools', JSON.stringify(f_schools));
  sessionStorage.setItem('html_fav_schools', JSON.stringify(f_schools_html));
  $('#number-of-favorites-selected').text(getFavoriteSchoolsArray().length);
  $('#favorites-list').text(getFavoriteSchoolsArray());
  $('#your-favorites').show();
  $('#compare-favorites').show();
  console.log("Favorite Schools:");
  console.log(getFavoriteSchoolsArray() );
}

/*
 * Tracks a link using Google Analytics
 */
function track (action, label, url) {
  _gaq.push(['_trackEvent', 'Page Interactions', action, label]);
}
