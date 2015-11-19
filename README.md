# Refugee Map

## Description

Map that shows locations which are potentially useful and interesting for refugees such as public restrooms, supermarkets, churches, playgrounds or call shops.

### Links

* [http://refugeemaps.eu](http://refugeemaps.eu)

### Data Sources

All data is managed via Google Spreadsheets. Every city has it's own sheet and a global sheet will mananage the available locations.

* [Location Spreadsheet](https://docs.google.com/spreadsheets/d/1pg-73mda1ZBtGZAFdkt2gh6XXCHxPuYnaWhNQbrcDx0/pub?gid=0&single=true)
* [Full Sample Location Sheet](https://docs.google.com/spreadsheets/d/15Na8ihDIljcRatsPkNQFA1rQLM6C08AC0VJVyGFKioI/pubhtml)
* TSV Sample Location Data as [TSV](https://docs.google.com/spreadsheets/d/15Na8ihDIljcRatsPkNQFA1rQLM6C08AC0VJVyGFKioI/pub?gid=81535625&single=true&output=tsv) or [HTML](https://docs.google.com/spreadsheets/d/15Na8ihDIljcRatsPkNQFA1rQLM6C08AC0VJVyGFKioI/pub?gid=81535625&single=true)


## Development

### Prerequisites
Make sure you have the following tools installed:

```sh
brew install go
brew install go-app-engine-64
brew install direnv
# Setup direnv in your shell: http://direnv.net/
direnv allow .envrc
```

### Installation

After cloning the repository, install all dependencies:

```sh
go get
npm install
```

### Develop

Run the following command to start the server on localhost:

```sh
npm run server
```

### Deploy

To deploy the application, run the following commands:

```sh
npm run deploy
```

## Team

* Ubilabs: Martin Kleppe
* Google: Thomas Steiner
* Ubilabs: Malte Modrow
* Ubilabs: Robert Katzki


