"use strict";

export class Sighting {
  constructor(coords, date, time, species, locationType) {
    this.coords = coords;
    this.date = date;
    this.time = time;
    this.species = species;
    this.locationType = locationType;
  }
}
