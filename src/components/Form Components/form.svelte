<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Button, { Label } from "@smui/button";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  const emit = createEventDispatcher();
  onMount(() => {
    Array.from(
      document
        .querySelector("#my_form")
        .querySelectorAll("input[type='number']")
    ).map((e: HTMLInputElement) => {
      e.min = "0";
      e.max = "59";
      return e;
    });
  });
</script>

<form
    on:submit|preventDefault={(evt) =>
      emit("submit",Array.from(evt.currentTarget.querySelectorAll("input")).map((e) => {
        if (e.type == "number") return Number(e.value ? e.value : e);
      }))}
    >
    <div class="grid grid-cols-4 gap-4">
      <slot />
    </div>
    <button class="bg-gray-600 p-3 rounded-sm hover:bg-gray-700 w-full m-1">agregar</button>
</form>
