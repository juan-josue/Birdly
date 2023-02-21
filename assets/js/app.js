"use strict";

// Imports
import { Sighting } from "./sighting.js";

// only execute this code in the dashboard
if (window.location.pathname == "/dashboard") {
  // Document Elements
  const form = document.querySelector("#sighting-form");
  const inputDate = document.querySelector("#date");
  const inputTime = document.querySelector("#time");
  const inputSpecies = document.querySelector("#species");
  const inputLocation = document.querySelector("#locationType");
  const sightings = document.querySelectorAll(".sighting-summary");
  const delBtns = document.querySelectorAll(".del-btn");

  class App {
    #map;
    #mapEvent;
    #mapZoomLevel = 13;

    constructor() {
      // Get user's position and load the map on that location
      this._getPosition();

      // Attach event handlers
      form.addEventListener("submit", this._newSighting.bind(this));

      sightings.forEach((sighting) => {
        sighting.addEventListener("click", this._moveToPopup.bind(this));
      });

      delBtns.forEach((delBtn) => {
        delBtn.addEventListener("click", this._deleteSighting.bind(this));
      });
    }

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

      this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

      // Render map background
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);

      // Add event listender to the loaded map for click events
      this.#map.on("click", this._showForm.bind(this));

      // render a marker on the map for each sighting
      const markers = [];
      $(".sighting").each(function () {
        let marker = {};
        marker.lat = $(this).data("lat");
        marker.lng = $(this).data("lng");
        marker.date = $(this).find("p:nth-of-type(1)").text();
        marker.species = $(this).find("p:nth-of-type(3)").text();
        markers.push(marker);
      });
      markers.forEach((marker) => {
        this._renderSightingMarker(marker);
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

      // Create a ajax put request and push the new sighting to the database
      $.ajax({
        url: "/api/report",
        method: "PUT",
        data: { sighting: newSighting },
        success: function (response) {
          console.log(response);
          location.reload();
        },
        error: function (xhr, status, error) {
          console.error(error);
        },
      });
    }

    _renderSightingMarker(marker) {
      L.marker([marker.lat, marker.lng])
        .addTo(this.#map)
        .bindPopup(
          L.popup({
            maxWidth: 300,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: "popup",
          })
        )
        .setPopupContent(marker.date + " - " + marker.species)
        .openPopup();
    }

    _moveToPopup(e) {
      if (!this.#map) return;

      const sightingEl = e.target.closest(".sighting-summary");
      if (!sightingEl) return;

      const coordEls = sightingEl.querySelectorAll(".hide");
      const coords = [coordEls[0].textContent, coordEls[1].textContent];

      this.#map.setView(coords, 15, {
        animate: true,
        pan: {
          duration: 3,
        },
      });
    }

    _deleteSighting(event) {
      if (!this.#map) return;

      const delBtn = event.target.closest(".del-btn");
      const sightingId = delBtn.getAttribute("sighting-id");

      if (!delBtn) return;

      $.ajax({
        url: "/api/delete",
        method: "DELETE",
        data: { sightingId: sightingId },
        success: function (response) {
          console.log(response);
          location.reload();
        },
        error: function (xhr, status, error) {
          console.log(error);
        },
      });
    }
  }

  const app = new App();
}
