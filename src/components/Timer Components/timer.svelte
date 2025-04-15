<script>
  import Timer from "./timer.js"
  import {onMount } from "svelte";
  export let time = { start: 0, pause: 0, end: 0 };
  export let status = "Stop";
  export let seconds = 1;
  export let autoRun = false;
  let App = new Timer().seconds(seconds);
  App.status = status;
  App.time = time;
  export let btnPlay = () => App.status = "Play";
  export let btnStop = () => App.status = "Stop";
  export let btnPause = () => App.status = "Pause";
  App.on("Status",({detail})=>{
    console.log(detail)
  })
  onMount(()=>{
    // App.loop();
    if(autoRun)btnPlay()
  })
</script>

<slot
{btnPlay}
{btnPause}
{btnStop}
{status}
position={App.CurrentPosicion}
/>
