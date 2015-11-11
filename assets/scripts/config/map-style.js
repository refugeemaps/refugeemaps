/**
 * The map style
 */
export default [
  {
    'featureType': 'administrative',
    'elementType': 'labels.text.fill',
    'stylers': [{
      'color': '#444444'
    }]
  },
  {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': [{
      'color': '#f2f2f2'
    }]
  },
  {
    'featureType': 'poi',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'off'
    }]
  },
  {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [
      {
        'saturation': '50'
      },
      {
        'lightness': '0'
      },
      {
        'weight': '1'
      }
    ]
  },
  {
    'featureType': 'road.highway',
    'elementType': 'all',
    'stylers': [
      {
        'visibility': 'on'
      },
      {
        'hue': '#ff9500'
      },
      {
        'saturation': '0'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'all',
    'stylers': [
      {
        'visibility': 'on'
      },
      {
        'hue': '#ffe800'
      },
      {
        'saturation': '-50'
      }
    ]
  },
  {
    'featureType': 'road.arterial',
    'elementType': 'labels.icon',
    'stylers': [{
      'visibility': 'off'
    }]
  },
  {
    'featureType': 'road.local',
    'elementType': 'all',
    'stylers': [
      {
        'visibility': 'on'
      },
      {
        'color': '#ffffff'
      },
      {
        'weight': '0.50'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels',
    'stylers': [
      {
        'visibility': 'on'
      },
      {
        'color': '#989898'
      }
    ]
  },
  {
    'featureType': 'road.local',
    'elementType': 'labels.text.fill',
    'stylers': [
      {
        'visibility': 'off'
      },
      {
        'color': '#000000'
      }
    ]
  },
  {
    'featureType': 'transit',
    'elementType': 'all',
    'stylers': [{
      'visibility': 'on'
    }]
  },
  {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': [
      {
        'color': '#46bcec'
      },
      {
        'visibility': 'on'
      }
    ]
  }
];
