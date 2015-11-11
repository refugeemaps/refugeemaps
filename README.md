# Ubilabs Refugee Map

## Description

Map that shows locations which are potentially useful and interesting for refugees such as public restrooms, supermarkets, churches, playgrounds or call shops.

### Links

* Staging: …

### Team

* PM Ubilabs: Martin Kleppe <kleppe@ubilabs.net>
* Dev Ubilabs: Malte Modrow <modrow@ubilabs.net>
* Dev Ubilabs: Robert Katzki <katzki@ubilabs.net>

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

## Hosting

The project is hosted at [Google App Engine](https://console.developers.google.com/project/earthview-gallery/appengine).
