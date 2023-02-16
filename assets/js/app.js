"use strict";

// //Imports
import { Sighting } from "./sighting.js";

// // Document Elements
const form = document.querySelector("#sighting-form");
const inputDate = document.querySelector("#date");
const inputTime = document.querySelector("#time");
const inputSpecies = document.querySelector("#species");
const inputLocation = document.querySelector("#locationType");

class App {
  #map;
  #mapEvent;

  constructor() {
    // Get user's position and load the map on that location
    this._getPosition();

    // Attach event handlers
    form.addEventListener("submit", this._newSighting.bind(this));
  }

  /**
   * If geolocation is not null load the map
   * Else send an alert message to the user.
   */
  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    // Render map background
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Add event listender to the loaded map for click events
    this.#map.on("click", this._showForm.bind(this));

    const pairs = [];
    $('.sighting').each(function() {
      let lat = $(this).find('.hide').eq(0).text();
      let lng = $(this).find('.hide').eq(1).text();
      pairs.push([lat, lng]);
    });
    pairs.forEach(pair => {
      this._renderSightingMarker(pair);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hide");
  }

  _newSighting(e) {
    e.preventDefault();

    // Get inputs from form
    const date = inputDate.value;
    const time = inputTime.value;
    const species = inputSpecies.value;
    const locationType =
      inputLocation.options[inputLocation.selectedIndex].value;
    const { lat, lng } = this.#mapEvent.latlng;

    // Create new Sighting object
    let newSighting = new Sighting(
      [lat, lng],
      date,
      time,
      species,
      locationType
    );

    // Create a axios put request and push the new sighting to the database
    axios
      .put("/api/report", {
        sighting: newSighting,
      })
      .then(function (response) {
        console.log(response.data);
        location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  _renderSightingMarker(coords) {
    L.marker(coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "popup",
        })
      )
      .setPopupContent("Sighting")
      .openPopup();
  }

}

const app = new App();
