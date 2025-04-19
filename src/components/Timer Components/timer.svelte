<script>
  import Timer from "./timer.js"
  let { 
    time = { start: 0, end: 0, pause: 0 },
    status = "Stop", 
    seconds = 0, 
    autoRun,
    Status,
    id
  } = $props();
  let App = new Timer({time,status,seconds});
  let position = $state(0);
  let btnPlay = () => App.status = "Play";
  let btnPause = () => App.status = "Pause";
  let btnStop = () => App.status = "Stop";
  
  App.on("Status",({detail})=>status=detail)
  App.on("Time",({detail})=>time=detail)

  $effect(()=>{
    App.loop((t)=>position=t)
    if(autoRun)btnPlay();
    return ()=>App.Stop();
  })
  $inspect(status,time)
  .with((t,status,time)=>t=="update"?Status({status,time}):"init");
  $inspect(seconds)
  .with((t,seconds)=>App.seconds=seconds);
</script>

<!-- svelte-ignore slot_element_deprecated -->
<slot
{btnPlay}
{btnPause}
{btnStop}
{status}
{position}
>
<h1>test</h1>
</slot>
