<script>
  import Menu from './components/Menu.svelte'
  import Plot from './components/Plot.svelte'
</script>

<main>
  <div id="main-container">
    <div><Menu /></div>
    <div><Plot /></div>
  </div>
</main>

<style>
  #main-container {
    display: grid;
    grid-template-rows: max-content auto;
  }

</style>
