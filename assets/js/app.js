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
  #sightings = [];

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
    let newSighting = new Sighting([lat, lng], date, time, species, locationType);

    // Add the sighting to the sighting array
    this.#sightings.push(newSighting);

    // Log sightings
    console.log(this.#sightings);

    // Render the sighting on the map
    this._renderSightingMarker(newSighting);

    // Create a axios put request and push the new sighting to the database
    axios
      .put("/api/report", {
        sighting: newSighting,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    // Render the sighting on the side bar
    // this._renderSighting(sighting);
  }

  // _renderSighting(sighting) {
  //   let html = `
  //   <li class="sighting animate__animated animate__fadeInLeft">
  //     <div class="sighting_col">
  //       <div class="sighting_row">
  //         <p>📆 ${sighting.date}</p>
  //       </div>
  //       <div class="sighting_row">
  //         <p>⌚ ${sighting.time}</p>
  //       </div>
  //     </div>
  //     <div class="sighting_col">
  //       <div class="sighting_row">
  //         <p>🦆 ${sighting.species}</p>
  //       </div>
  //       <div class="sighting_row">
  //         <p>🌲 ${sighting.locationType}</p>
  //       </div>
  //     </div>
  //   </li>
  //   `;

  //   form.insertAdjacentHTML("afterend", html);
  // }

  _renderSightingMarker(sighting) {
    L.marker(sighting.coords)
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
