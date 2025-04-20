<script>
  import {onMount} from "svelte"
  import ClockAdd from "./icons/btnClockAdd.svelte";
  import Store from "./Db Components/storeAndLocalStorage.js";
  import { blur } from "svelte/transition";
  import CircularProgress from "@smui/circular-progress";
  import Dialog, { Content } from "@smui/dialog";
  import Card from "./Main Components/CardForm.svelte";
  import Timer from "./Timer Components/timer_inde.svelte";
  import FormatCounter from "./Timer Components/FormatCounter.svelte";
  import {Clock} from "./Timer Components/timer.js"
  let open = false;
  let store = new Store();
  const actions = {
    add: (data) => store.add(data),
    del: (id) => store.get(id).Destroy(),
    edit: (id, data) => store.get(id).edit(data),
    store: () => get(store),
  };
  if($store.length==0)open=true;
  let clock = new Clock();
  onMount(()=>clock.init());
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
  <Content id="simple-content">
    <form on:submit|preventDefault={(evt) => {
      let tags = Array.from(evt.currentTarget.querySelectorAll("input"))
      .map((e) => (e.type == "number")?Number(e.value ? e.value : e):0)
      const [h, m, s] = tags;
      const Sec = (!h?0:h) * 60 * 60 + (!m?0:m) * 60 + (!s?0:s);
      if(Sec==0) throw alert("not defined time");
      actions.add({status: "Stop", seconds: Sec, time: { start: 0, end: 0, pause: 0 }});
      open = !open;
    }}
      class="grid grid-cols-2 gap-2"
    >
      <label for="Hrs" class="text-sm">Horas</label>
      <input id="Hrs" type="number" min="0" max="59" placeholder="Horas" class="input no-focus border-0 p-2 max-w-sm"/>
      <label for="Min" class="text-sm">Minutos</label>
      <input id="Min" type="number" min="0" max="59" placeholder="Minutos" class="input no-focus border-0 p-2 max-w-sm"/>
      <label for="Sec" class="text-sm">Segundos</label>
      <input id="Sec" type="number" min="0" max="59" placeholder="Segundos" class="input no-focus border-0 p-2 max-w-sm"/>
      <input type="submit" value="Agregar" class="border-1 bg-gray-600 p-3 col-span-full"/>
    </form>
  </Content>
</Dialog>

<div class="grid xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 p-5 overflow-auto">
    {#each $store as data}
      <div in:blur={{ duration: 500 }} out:blur={{ duration: 500 }}>
        <Card id={data.id}>
          <Timer
            internalClock={(fns)=>clock.subscribe((t)=>fns(t))}
            id={data.id}
            seconds={data.seconds}
            status={data.status}
            time={data.time}
            on:Status={({detail:statusData}) => actions.edit(data.id,statusData)}
            let:btnPlay
            let:btnStop
            let:btnPause
            let:status
            let:position
          >
            <FormatCounter time={position} let:Data>
                <p class="text-xl text-center">
                  {#if Data.Hours != 0}{Data.pad.Hours} :{:else }00 :{/if}
                  {#if Data.Minutes != 0}{Data.pad.Minutes} :{:else }00 :{/if}
                  {#if Data.Seconds != 0}{Data.pad.Seconds} :{:else }00 :{/if}
                  {#if Data.Miliseconds != 0}{Data.pad.Miliseconds}{:else }000{/if}
                </p>
              <CircularProgress
                style="height: 200px; width: 200px;"
                progress={status=="Stop"?1:Data.useRange(data.seconds)}
              /><br />
            </FormatCounter>
            {#if status != "Play"}
              <button on:click={btnPlay} class="bg-gray-600 p-3 rounded-sm hover:bg-gray-700">Play</button>
            {:else}
              <button on:click={btnStop} class="bg-gray-600 p-3 rounded-sm hover:bg-gray-700">Stop</button>
              <button on:click={btnPause} class="bg-gray-600 p-3 rounded-sm hover:bg-gray-700">Pause</button>
            {/if}
            <button on:click={()=>{actions.del(data.id)}} class="bg-gray-600 p-3 rounded-sm hover:bg-gray-700">Del</button>
          </Timer>
        </Card>
      </div>
    {/each}
</div>

<button on:click={()=>{open=!open}} class="fixed block p-2 bottom-0 right-0 bg-gray-600 rounded-full hover:bg-gray-700 active:bg-gray-800">
  <ClockAdd />
</button>