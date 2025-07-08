<script>
  import { onMount } from 'svelte';

  let speaker_list = [];
  let speakerColors = new Map();

  const colors = [
    { border: '#E5243B', bg: '#E5243B' }, // Red
    { border: '#4C9F38', bg: '#4C9F38' }, // Green
    { border: '#FCC310', bg: '#FCC310' }, // Yellow
    { border: '#26BDE2', bg: '#26BDE2' }, // Blue
    { border: '#1A486A', bg: '#1A486A' }  // Indigo
  ];

  function shuffleColorsWithoutRepeat(prevColor) {
    const available = colors.filter(c => c !== prevColor);
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    return available;
  }

  function assignColors(flatList) {
    let queue = [...colors];
    let lastColor = null;
    let i = 0;

    for (const sp of flatList) {
      if (i >= queue.length) {
        queue = shuffleColorsWithoutRepeat(lastColor);
        i = 0;
      }
      speakerColors.set(sp.photo, queue[i]); // assuming photo is unique, else use name
      lastColor = queue[i];
      i++;
    }
  }

  onMount(() => {
    fetch(`https://events.startupmission.in/api/event/kif/speakers?category=Speaker`)
      .then(response => response.json())
      .then((json) => {
        speaker_list = json;

        // Flatten all speakers for color assignment
        const all = Object.values(json).flat();
        assignColors(all);
      });
  });

  function getImage(photo) {
    return photo || '/default-avatar.png';
  }
</script>

{#each Object.entries(speaker_list) as [category, speakers]}
  <section class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {#each speakers as { name, designation, organisation, photo, linkedin }}
        <div class="relative group rounded-lg overflow-hidden flex flex-col border-2 shadow-sm hover:shadow-lg transition-all duration-300"
             style="border-color: {speakerColors.get(photo)?.border}">
          <img src={getImage(photo)} alt={name} class="h-64 w-full object-cover" loading="lazy" />

          <div class="text-white text-center py-3 px-2 font-semibold h-full"
               style="background-color: {speakerColors.get(photo)?.bg}">
            <h3 class="text-base">{name}</h3>
            <p class="text-xs font-normal">{designation}<br />{organisation}</p>
          </div>

          {#if linkedin}
            <a href={linkedin} target="_blank"
               class="absolute bottom-0 left-8 transform -translate-x-1/2 translate-y-full 
                      opacity-0 group-hover:-translate-y-20 group-hover:opacity-100 
                      transition-all duration-300 ease-in-out bg-white shadow-md 
                      rounded-full p-2 z-10"
               style="border: 2px solid {speakerColors.get(photo)?.bg}; color: {speakerColors.get(photo)?.bg}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.238-5 5v14c0 
                  2.762 2.239 5 5 5h14c2.762 0 5-2.238 
                  5-5v-14c0-2.762-2.238-5-5-5zm-11 
                  19h-3v-10h3v10zm-1.5-11.268c-.966 
                  0-1.75-.784-1.75-1.75s.784-1.75 
                  1.75-1.75 1.75.784 
                  1.75 1.75-.784 1.75-1.75 
                  1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.059-1.865-3.059-1.867 
                  0-2.153 1.459-2.153 2.967v5.696h-3v-10h2.881v1.367h.041c.401-.761 
                  1.379-1.561 2.837-1.561 3.033 
                  0 3.593 1.996 3.593 4.59v5.604z"/>
              </svg>
            </a>
          {/if}
        </div>
      {/each}
    </div>
  </section>
{/each}
