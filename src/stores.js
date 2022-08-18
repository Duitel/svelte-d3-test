import { readable, writable, derived } from "svelte/store";
import { json } from "d3-fetch";

const water = readable(null, function start(set) {
  json("./data/geo_sectoren.geojson")
    .then(data => {
      set(data);
    });
  return function stop() {};
});

const provinces = readable(null, function start(set) {
  json("./data/provinces.geojson")
    .then(data => {
      set(data);
    });
  return function stop() {};
});

const erase = writable(false)
const drawInPixels = writable(false)

export {
  water, provinces, erase, drawInPixels
}
