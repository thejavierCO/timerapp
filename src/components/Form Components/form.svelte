<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  const emit = createEventDispatcher();
</script>

<form
    on:submit|preventDefault={(evt) =>
      emit("submit",Array.from(evt.currentTarget.querySelectorAll("input")).map((e) => {
        if (e.type == "number") return Number(e.value ? e.value : e);
      }))}
    >
    <div class="grid grid-cols-2 gap-2 m-2 place-items-center">
      <slot />
    </div>
    <button class="bg-gray-600 p-3 rounded-sm hover:bg-gray-700 w-full m-1">agregar</button>
</form>
