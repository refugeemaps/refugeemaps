var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/15Na8ihDIljcRatsPkNQFA1rQLM6C08AC0VJVyGFKioI/pub?gid=81535625&single=true&output=tsv';
var PROXY = 'http://crossorigin.me/';

var INFO_WINDOW_HTML =
    '<div class="demo-card-square mdl-card mdl-shadow--2dp">' +
      '<div style="background:url(\'{{emoji}}\') ' +
          'top right 0 no-repeat #46B6AC;" ' +
          'class="mdl-card__title mdl-card--expand">' +
        '<h2 class="mdl-card__title-text">{{name}}</h2>' +
        '<span>{{address}}</span>' +
      '</div>' +
      '<div class="mdl-card__supporting-text">{{description}}</div>' +
      '<div class="mdl-card__supporting-text">{{openingHours}}</div>' +
    '</div>';

var CATEGORY_HTML = '<a class="mdl-navigation__link" href="">{{category}}</a>';

var LANGUAGE_HTML = '<li class="mdl-menu__item">{{language}}</li>';

var I18N = {
  _current: 'en',
  _direction: 'ltr',
  categoriesTitle: {
    en: 'Categories'
  }
};

function fetchSpreadsheetData() {
  console.log('Getting spreadsheet data');
  var url = PROXY + SPREADSHEET_URL;
  var cached = localStorage.getItem(url);
  if (cached) {
    console.log('Using cached spreadsheet data');
    return Promise.resolve(JSON.parse(cached));
  }
  console.log('Getting spreadsheet data');
  return fetch(url).then(function(response) {
    return response.text();
  }).then(function(data) {
    console.log('Caching spreadsheet data');
    localStorage.setItem(url, JSON.stringify(data));
    return data;
  }).catch(function(error) {
    throw(error);
  });
}

function parseSpreadsheetData(data) {
  console.log('Parsing spreadsheet data');
  return new Promise(function(resolve, reject) {
    data = data.split(/\n/);
    var json = {
      categories: null,
      columns: null,
      languages: null,
      payload: []
    };
    data.forEach(function(line, i) {
      line = line.split(/\t/);
      if (i === 0) {
        json.categories = line;
      } else if (i === 1) {
        json.columns = line;
        json.languages = line.slice(line.indexOf('Description') + 1);
      } else {
        var contents = {};
        line.forEach(function(cell, i) {
          contents[json.columns[i]] = cell;
        });
        json.payload.push(contents);
      }
    });
    return resolve(json);
  });
}

function whereAmI() {
  console.log('Getting current location');
  return new Promise(function(resolve) {
    navigator.geolocation.getCurrentPosition(function(position, error) {
      if (error) {
        return reject(error.message);
      }
      console.log('Current location: ' + position.coords.latitude + ', ' +
          position.coords.longitude);
      return resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    });
  });
}

function centerMap(position) {
  console.log('Centering map to ' + position.latitude + ', ' +
      position.longitude);
  var map = document.querySelector('google-map');
  map.latitude = position.latitude;
  map.longitude = position.longitude;
}

function addMapMarkers(items) {
  console.log('Adding map markers');
  var map = document.querySelector('google-map');
  items.forEach(function(item) {
    var marker = document.createElement('google-map-marker');
    marker.latitude = item.Latitude;
    marker.longitude = item.Longitude;
    marker.title = item.Name;
    var dataUrl = emojiToBitmap(item.Category, 25);
    marker.icon = dataUrl;
    marker.innerHTML = INFO_WINDOW_HTML
        .replace(/\{\{emoji\}\}/g, dataUrl)
        .replace(/\{\{name\}\}/g, item.Name)
        .replace(/\{\{address\}\}/g, item.Address)
        .replace(/\{\{description\}\}/g, item.Description)
        .replace(/\{\{openingHours\}\}/g, item['Opening Hours']);
    Polymer.dom(map).appendChild(marker);
  });
  map.fitToMarkers = true;
}

function emojiToBitmap(emoji, opt_size) {
  var cached = localStorage.getItem(emoji);
  if (cached) {
    return cached;
  }
  var canvas = document.createElement('canvas');
  var size = opt_size || 50;
  var halfSize = size / 2;
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');
  ctx.arc(halfSize, halfSize, halfSize, 0 , Math.PI * 2, true);
  ctx.fillStyle = 'rgba(0, 0, 0, .3)';
  ctx.fill();
  ctx.font = size + 'px Helvetica';
  var width = ctx.measureText(emoji).width;
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 0, width / 2);
  var dataUrl = canvas.toDataURL();
  localStorage.setItem(emoji, dataUrl);
  return dataUrl;
}

function createCategoriesMenu(parsedData) {
  console.log('Creating categories menu');
  var categoryMenu = document.querySelector('#categories-menu');
  var temp = document.createElement('div');
  parsedData.categories.forEach(function(category) {
    temp.innerHTML += CATEGORY_HTML.replace(/\{\{category\}\}/g, category);
  });
  categoryMenu.innerHTML = temp.innerHTML;
  var categoriesTitle = document.querySelector('#categories-title');
  categoriesTitle.innerHTML = I18N.categoriesTitle[I18N._current];
  return Promise.resolve(parsedData);
}

function createLanguagesMenu(parsedData) {
  console.log('Creating languages menu');
  var languagesMenu = document.querySelector('#languages-menu');
  var temp = document.createElement('div');
  parsedData.languages.forEach(function(language) {
    temp.innerHTML += LANGUAGE_HTML.replace(/\{\{language\}\}/g, language);
  });
  languagesMenu.innerHTML = temp.innerHTML;
  return Promise.resolve(parsedData);
}

function createFavicon() {
  console.log('Creating favicon');
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.rel = 'shortcut icon';
  link.href = emojiToBitmap('🗺', 180);
  head.appendChild(link);
  return Promise.resolve();
}

(function bootstrap() {
  console.log('Bootstrapping');
  Promise.all([
    whereAmI(),
    fetchSpreadsheetData().then(function(rawData) {
      return parseSpreadsheetData(rawData);
    }).then(function(parsedData) {
      return parsedData;
    }).then(function(parsedData) {
      return createCategoriesMenu(parsedData);
    }).then(function(parsedData) {
      return createLanguagesMenu(parsedData);
    }).catch(function(error) {
      throw(error);
    }),
    createFavicon()
  ]).then(function(results) {
    var position = results[0];
    var parsedData = results[1];
    document.querySelector('#spinner').removeAttribute('is-active');
    document.querySelector('google-map').style.display = 'block';
    addMapMarkers(parsedData.payload);
    centerMap(position);
  }).catch(function(error) {
    throw(error);
  });
})();