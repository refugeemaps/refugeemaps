/**
 * @author: Thomas Steiner (tomac@google.com)
 * @license CC0 1.0 Universal (CC0 1.0)
 */

/* jshint shadow:true, loopfunc:true, -W034, -W097 */
/* global SpreadsheetApp, Logger, PropertiesService, Maps */

'use strict';

// The name of the hidden admin sheet
var ADMIN_SHEET_NAME = '🔒Admin';

// The to-be-expected admin column headers
var ADMIN_COLUMN_HEADERS = {
  sheets: 'sheets',
  columnHeaders: 'column headers',
  languages: 'languages'
};

// Special user column headers
var USER_COLUMNS = {
  visible: {
    name: 'visible',
    values: ['yes', 'no']
  },
  address: {
    name: 'address'
  },
  latitude: {
    name: 'latitude'
  },
  longitude: {
    name: 'longitude'
  },
  mapPreview: {
    name: 'map preview'
  },
  description: {
    name: 'description'
  }
};

// Dimensions of the map
var MAP_DIMENSIONS = {
  width: 150,
  height: 100
};

function bootstrapSpreadsheet() {
  resetSheet();
  readAdminSheet();
  freezeAndProtectSheets();
}

function updateSpreadsheet() {
  readAdminSheet();
  freezeAndProtectSheets();
}

function readAdminSheet() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var adminSheet = activeSpreadsheet.getSheetByName(ADMIN_SHEET_NAME);
  var columnHeaders = adminSheet.getRange(1, 1, 1,
      adminSheet.getLastColumn()).getValues()[0];
  var numUserColumns = 0;
  for (var i = 0; i < columnHeaders.length; i++) {
    var columnHeader = columnHeaders[i].toLowerCase();
    var columnValues = adminSheet.getRange(2, i + 1,
        adminSheet.getRange(2, i + 1, adminSheet.getLastRow(), 1)
        .getValues().filter(String).length, 1).getValues();
    for (var j = 0; j < columnValues.length; j++) {
      var cellValue = columnValues[j][0];
      if (columnHeader === ADMIN_COLUMN_HEADERS.sheets) {
        createSheetIfNotExists(cellValue, j);
      } else if (columnHeader === ADMIN_COLUMN_HEADERS.columnHeaders) {
        numUserColumns++;
        createColumnIfNotExists(cellValue, j);
        var userColumnHeader = cellValue.toLowerCase();
        if (userColumnHeader === USER_COLUMNS.visible.name) {
          USER_COLUMNS.visible.columnIndex = j + 1;
          createEnums(USER_COLUMNS.visible.values, j);
        } else if (userColumnHeader === USER_COLUMNS.latitude.name) {
          USER_COLUMNS.latitude.columnIndex = j + 1;
        } else if (userColumnHeader === USER_COLUMNS.longitude.name) {
          USER_COLUMNS.longitude.columnIndex = j + 1;
        } else if (userColumnHeader === USER_COLUMNS.address.name) {
          USER_COLUMNS.address.columnIndex = j + 1;
        } else if (userColumnHeader === USER_COLUMNS.mapPreview.name) {
          USER_COLUMNS.mapPreview.columnIndex = j + 1;
        } else if (userColumnHeader === USER_COLUMNS.description.name) {
          USER_COLUMNS.description.columnIndex = j + 1;
        }
      } else if (columnHeader === ADMIN_COLUMN_HEADERS.languages) {
        createColumnIfNotExists(getLanguageName(cellValue),
            j + numUserColumns);
        createTranslations(cellValue, j + numUserColumns,
            USER_COLUMNS.description.columnIndex);
      }
    }
  }
  var properties = PropertiesService.getDocumentProperties();
  for (var key in USER_COLUMNS) {
    properties.setProperty(key, JSON.stringify(USER_COLUMNS[key]));
  }
}

function onEdit(e) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = activeSpreadsheet.getActiveSheet();
  if (sheet.getName() === ADMIN_SHEET_NAME) {
    return updateSpreadsheet();
  }
  var temp = PropertiesService.getDocumentProperties();
  var properties = {};
  var keys = temp.getKeys();
  keys.forEach(function(key) {
    properties[key] = JSON.parse(temp.getProperty(key));
  });
  var range = e.range;
  var column = range.getColumn();
  if (column === properties.address.columnIndex) {
    var row = range.getRow();
    var numRows = range.getNumRows();
    updateLatLongColumn(
        properties.address.columnIndex,
        properties.latitude.columnIndex,
        properties.longitude.columnIndex,
        properties.mapPreview.columnIndex,
        row,
        numRows);
  }
}

function updateLatLongColumn(addressIndex, latitudeIndex, longitudeIndex,
    mapIndex, row, numRows) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = activeSpreadsheet.getActiveSheet();
  var addressRange = sheet.getRange(2, addressIndex, sheet.getMaxRows(), 1)
      .getValues();
  var latLongRange = sheet.getRange(2, latitudeIndex, sheet.getMaxRows(), 2)
      .getValues();
  for (var i = 0; i < latLongRange.length; i++) {
    if (!(i + 1 <= row && i + 1 <= row + numRows)) {
      continue;
    }
    var address = addressRange[i][0];
    var latitude = latLongRange[i][0];
    var longitude = latLongRange[i][1];
    if (address) {
      var geocodeResult = geocode(address);
      try {
        var result = geocodeResult.results[0];
        sheet.getRange(i + 2, latitudeIndex).setValue(
            result.geometry.location.lat);
        sheet.getRange(i + 2, longitudeIndex).setValue(
            result.geometry.location.lng);
        sheet.getRange(i + 2, addressIndex).setFontLine('none')
            .setBackground('white').setValue(result.formatted_address);
        sheet.autoResizeColumn(addressIndex);
        updateMapColumn(latitudeIndex, longitudeIndex, mapIndex);
      } catch (e) {
        Logger.log('Geocode error ' + e);
        sheet.getRange(i + 2, addressIndex).setFontLine('line-through')
            .setBackground('red');
      }
    }
  }
}

function updateMapColumn(latitudeIndex, longitudeIndex, mapIndex) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = activeSpreadsheet.getActiveSheet();
  var latLongRange = sheet.getRange(2, latitudeIndex, sheet.getMaxRows(), 2)
      .getValues();
  var mapRange = sheet.getRange(2, mapIndex, sheet.getMaxRows(), 1).getValues();
  for (var i = 0; i < mapRange.length; i++) {
    var map = mapRange[i][0];
    var latitude = latLongRange[i][0];
    var longitude = latLongRange[i][1];
    if (latitude && longitude) {
      var mapUrl = createStaticMap(latitude, longitude);
      sheet.insertImage(mapUrl, mapIndex, i + 2);
      sheet.getRange(i + 2, mapIndex).setValue(mapUrl);
      sheet.setRowHeight(i + 2, MAP_DIMENSIONS.height);
      sheet.setColumnWidth(mapIndex, MAP_DIMENSIONS.width);
    }
  }
}

function geocode(address) {
  return Maps.newGeocoder().geocode(address);
}

function resetSheet() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var adminSheet = activeSpreadsheet.getSheetByName(ADMIN_SHEET_NAME);
  adminSheet.showSheet();
  var sheets = activeSpreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getName() !== ADMIN_SHEET_NAME) {
      activeSpreadsheet.deleteSheet(sheet);
    }
  }
}

function freezeAndProtectSheets() {
  var temp = PropertiesService.getDocumentProperties();
  var properties = {};
  var keys = temp.getKeys();
  keys.forEach(function(key) {
    properties[key] = JSON.parse(temp.getProperty(key));
  });
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var adminSheet = activeSpreadsheet.getSheetByName(ADMIN_SHEET_NAME);
  var sheets = activeSpreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var maxRows = sheet.getMaxRows();
    var maxCols = sheet.getMaxColumns();
    if (sheet.getName() === ADMIN_SHEET_NAME) {
      continue;
    }
    // Vertical alignment and wrapping in all cells
    sheet.getRange(1, 1, maxRows, maxCols).setVerticalAlignment('top')
        .setWrap(true);
    // Frozen header
    sheet.setFrozenRows(1);
    // Frozen "visible" column
    sheet.setFrozenColumns(properties.visible.columnIndex);
    // Hide "latitude" and "longitude" columns
    sheet.hideColumns(properties.latitude.columnIndex);
    sheet.hideColumns(properties.longitude.columnIndex);
    // Protect "visible", "latitude", "longitude", "map preview" columns
    sheet.getRange(1, properties.visible.columnIndex, maxRows).protect();
    sheet.getRange(1, properties.latitude.columnIndex, maxRows).protect();
    sheet.getRange(1, properties.longitude.columnIndex, maxRows).protect();
    sheet.getRange(1, properties.mapPreview.columnIndex, maxRows).protect();
  }
  adminSheet.hideSheet();
}

function createSheetIfNotExists(sheetName, index) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = activeSpreadsheet.getSheetByName(sheetName);
  if (sheet) {
    return;
  }
  activeSpreadsheet.insertSheet(sheetName, index);
}

function createColumnIfNotExists(columnName, index) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = activeSpreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getName() === ADMIN_SHEET_NAME) {
      continue;
    }
    var columnHeaders = sheet.getLastColumn() ?
        sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    if (columnHeaders.indexOf(columnName) !== -1) {
      return;
    }
    var cell = sheet.getRange(1, index + 1);
    cell.setValue(columnName);
    cell.setFontWeight('bold');
  }
}

function createEnums(values, index) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var adminSheet = activeSpreadsheet.getSheetByName(ADMIN_SHEET_NAME);
  var sheets = activeSpreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getName() === ADMIN_SHEET_NAME) {
      continue;
    }
    var emoji = sheet.getName().replace(/\w/g, '');
    var range = sheet.getRange(2, index + 1, sheet.getMaxRows(), 1);
    var localValues = [
      emoji + values[0],
      values[1]
    ];
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(
        localValues, true);
    range.setDataValidation(rule);
    range.setValue(localValues[0]);
  }
}

function createTranslations(language, index, descriptionIndex) {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var adminSheet = activeSpreadsheet.getSheetByName(ADMIN_SHEET_NAME);
  var sheets = activeSpreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    if (sheet.getName() === ADMIN_SHEET_NAME) {
      continue;
    }
    var range = sheet.getRange(2, index + 1, sheet.getMaxRows(), 1);
    var a1Notation = String.fromCharCode(descriptionIndex + 96) + ':' +
        String.fromCharCode(descriptionIndex + 96);
    range.setValue('=IF(LEN(' + a1Notation + '), GOOGLETRANSLATE(' +
        a1Notation + ', "auto", "' + language + '"), "")');
  }
}

function createStaticMap(latitude, longitude) {
  var map = Maps.newStaticMap()
      .setMapType(Maps.StaticMap.Type.TERRAIN)
      .setCenter(latitude, longitude)
      .setZoom(14)
      .addMarker(latitude, longitude)
      .setSize(MAP_DIMENSIONS.width, MAP_DIMENSIONS.height);
  return map.getMapUrl();
}

function getLanguageName(code) {
  var iso639_1 = {
    ab: 'Abkhazian',
    aa: 'Afar',
    af: 'Afrikaans',
    ak: 'Akan',
    sq: 'Albanian',
    am: 'Amharic',
    ar: 'Arabic',
    an: 'Aragonese',
    hy: 'Armenian',
    as: 'Assamese',
    av: 'Avaric',
    ae: 'Avestan',
    ay: 'Aymara',
    az: 'Azerbaijani',
    bm: 'Bambara',
    ba: 'Bashkir',
    eu: 'Basque',
    be: 'Belarusian',
    bn: 'Bengali',
    bh: 'Bihari languages',
    bi: 'Bislama',
    bs: 'Bosnian',
    br: 'Breton',
    bg: 'Bulgarian',
    my: 'Burmese',
    ca: 'Catalan',
    km: 'Central Khmer',
    ch: 'Chamorro',
    ce: 'Chechen',
    zh: 'Chinese',
    cv: 'Chuvash',
    kw: 'Cornish',
    co: 'Corsican',
    cr: 'Cree',
    hr: 'Croatian',
    cs: 'Czech',
    da: 'Danish',
    nl: 'Dutch',
    dz: 'Dzongkha',
    en: 'English',
    eo: 'Esperanto',
    et: 'Estonian',
    ee: 'Ewe',
    fo: 'Faroese',
    fj: 'Fijian',
    fi: 'Finnish',
    fr: 'French',
    ff: 'Fulah',
    gd: 'Gaelic',
    gl: 'Galician',
    lg: 'Ganda',
    ka: 'Georgian',
    de: 'German',
    ki: 'Gikuyu',
    el: 'Greek',
    kl: 'Greenlandic',
    gn: 'Guarani',
    gu: 'Gujarati',
    ht: 'Haitian',
    ha: 'Hausa',
    he: 'Hebrew',
    hz: 'Herero',
    hi: 'Hindi',
    ho: 'Hiri Motu',
    hu: 'Hungarian',
    is: 'Icelandic',
    io: 'Ido',
    ig: 'Igbo',
    id: 'Indonesian',
    ia: 'Interlingua',
    iu: 'Inuktitut',
    ik: 'Inupiaq',
    ga: 'Irish',
    it: 'Italian',
    ja: 'Japanese',
    jv: 'Javanese',
    kn: 'Kannada',
    kr: 'Kanuri',
    ks: 'Kashmiri',
    kk: 'Kazakh',
    rw: 'Kinyarwanda',
    ky: 'Kirghiz',
    kv: 'Komi',
    kg: 'Kongo',
    ko: 'Korean',
    kj: 'Kuanyama',
    ku: 'Kurdish',
    lo: 'Lao',
    la: 'Latin',
    lv: 'Latvian',
    lb: 'Letzeburgesch',
    li: 'Limburgish',
    ln: 'Lingala',
    lt: 'Lithuanian',
    lu: 'Luba-Katanga',
    mk: 'Macedonian',
    mg: 'Malagasy',
    ms: 'Malay',
    ml: 'Malayalam',
    dv: 'Maldivian',
    mt: 'Maltese',
    gv: 'Manx',
    mi: 'Maori',
    mr: 'Marathi',
    mh: 'Marshallese',
    mn: 'Mongolian',
    na: 'Nauru',
    nv: 'Navajo',
    ng: 'Ndonga',
    ne: 'Nepali',
    nd: 'North Ndebele',
    se: 'Northern Sami',
    no: 'Norwegian',
    nb: 'Norwegian Bokmål',
    nn: 'Norwegian Nynorsk',
    ii: 'Nuosu',
    ie: 'Occidental',
    oc: 'Occitan',
    oj: 'Ojibwa',
    cu: 'Old Bulgarian',
    or: 'Oriya',
    om: 'Oromo',
    os: 'Ossetian',
    pi: 'Pali',
    pa: 'Panjabi',
    ps: 'Pashto',
    fa: 'Persian',
    pl: 'Polish',
    pt: 'Portuguese',
    qu: 'Quechua',
    ro: 'Romanian',
    rm: 'Romansh',
    rn: 'Rundi',
    ru: 'Russian',
    sm: 'Samoan',
    sg: 'Sango',
    sa: 'Sanskrit',
    sc: 'Sardinian',
    sr: 'Serbian',
    sn: 'Shona',
    sd: 'Sindhi',
    si: 'Sinhala',
    sk: 'Slovak',
    sl: 'Slovenian',
    so: 'Somali',
    st: 'Sotho, Southern',
    nr: 'South Ndebele',
    es: 'Spanish',
    su: 'Sundanese',
    sw: 'Swahili',
    ss: 'Swati',
    sv: 'Swedish',
    tl: 'Tagalog',
    ty: 'Tahitian',
    tg: 'Tajik',
    ta: 'Tamil',
    tt: 'Tatar',
    te: 'Telugu',
    th: 'Thai',
    bo: 'Tibetan',
    ti: 'Tigrinya',
    to: 'Tonga (Tonga Islands)',
    ts: 'Tsonga',
    tn: 'Tswana',
    tr: 'Turkish',
    tk: 'Turkmen',
    tw: 'Twi',
    ug: 'Uighur',
    uk: 'Ukrainian',
    ur: 'Urdu',
    uz: 'Uzbek',
    ve: 'Venda',
    vi: 'Vietnamese',
    vo: 'Volapük',
    wa: 'Walloon',
    cy: 'Welsh',
    fy: 'Western Frisian',
    wo: 'Wolof',
    xh: 'Xhosa',
    yi: 'Yiddish',
    yo: 'Yoruba',
    za: 'Zhuang',
    zu: 'Zulu'
  };
  return iso639_1[code];
}
