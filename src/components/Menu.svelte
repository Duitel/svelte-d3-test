<script>
  import { drawInPixels, erase } from '../stores.js'
</script>

<div id="button-row">
  <div>
    <label>
      <input type=checkbox bind:checked={$drawInPixels}>
      Draw in pixels (vs smooth)
    </label>
  </div>
  <div>
    <label>
      <input type=checkbox bind:checked={$erase}>
      Erase
    </label>
  </div>
  <div>
    <button>Erase all</button>
  </div>
  <div>
    <button>Done!</button>
  </div>
</div>

<style>
  #button-row {
    display: grid;
    grid-template-columns: auto auto auto auto;
    align-items: center;
  }
</style>
