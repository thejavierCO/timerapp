<script>
  import ClockAdd from "./icons/btnClockAdd.svelte";
  import Store from "./Db Components/storeAndLocalStorage.js";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import { blur } from "svelte/transition";
  import CircularProgress from "@smui/circular-progress";
  import Dialog, { Content } from "@smui/dialog";
  import Card from "./Main Components/CardForm.svelte";
  import Form from "./Form Components/form.svelte";
  import InputTime from "./Form Components/inputTime.svelte";
  import Timer from "./Timer Components/timer_inde.svelte";
  import FormatCounter from "./Timer Components/FormatCounter.svelte";
  let open = false;
  
  let store = new Store();
  const actions = {
    add: (data) => store.add(data),
    del: (id) => store.get(id).Destroy(),
    edit: (id, data) => store.get(id).edit(data),
    store: () => get(store),
  };
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
  <Content id="simple-content">
    <Form on:submit={({ detail: [h, m, s] }) => {
      const Sec = (!h?0:h) * 60 * 60 + (!m?0:m) * 60 + (!s?0:s);
      if(Sec==0) throw alert("not defined time");
      actions.add({status: "Stop", seconds: Sec, time: { start: 0, end: 0, pause: 0 }});
      open = !open;
    }}>
      <InputTime value="0" label="hours" suffix="hrs" />
      <InputTime value="0" label="minutes" suffix="min" />
      <InputTime value="0" label="seconds" suffix="sec" />
    </Form>
  </Content>
</Dialog>

<LayoutGrid class="">
    {#each $store as data}
      <Cell>
        <div in:blur={{ duration: 500 }} out:blur={{ duration: 500 }}>
          <Card id={data.id}>
            <Timer
              seconds={data.seconds}
              status={data.status}
              time={data.time}
              on:Status={({ detail: statusData }) => actions.edit(data.id, statusData)}
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
      </Cell>
    {/each}
</LayoutGrid>

<button on:click={()=>{open=!open}} class="fixed block p-2 bottom-0 right-0 bg-gray-600 rounded-full hover:bg-gray-700 active:bg-gray-800">
  <ClockAdd />
</button>