<script>
  import Timer from "./timer.js"
  let { 
    time = { start: 0, end: 0, pause: 0 },
    status = "Stop", 
    seconds = 0, 
    autoRun,
    Status
  } = $props();
  let App = new Timer({time,status,seconds});
  let position = $state(0);
  let btnPlay = () => App.Play(()=>{
    status = App.status
    time = App.time
  });
  let btnPause = () => App.Pause(()=>{
    status = App.status
    time = App.time
  });
  let btnStop = () => App.Stop(()=>{
    status = App.status
    time = App.time
  });
  App.on("debug",({detail})=>console.log(detail))
  $effect(()=>{
    App.loop((t)=>{
      position = t;
      status = App.status;
      time = App.time;
    });
    if(autoRun)btnPlay();
    return ()=>btnStop();
  })
  $inspect(status,time)
  .with((t,status,time)=>Status({status,time}));
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
