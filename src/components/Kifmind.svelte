<script>

  import PocketBase from 'pocketbase';
  import { onMount } from 'svelte';

  const pb = new PocketBase('https://api.innovationfestival.in');

  let mentors = [];
  let filteredMentors = [];
  let mentorColors = new Map();

  const colors = [
    { border: '#4C9F38', bg: '#4C9F38' }, // Green
    { border: '#E5243B', bg: '#E5243B' }, // Red
    { border: '#FCC310', bg: '#FCC310' }, // Yellow
    { border: '#26BDE2', bg: '#26BDE2' }, // Blue
    { border: '#1A486A', bg: '#1A486A' }  // Indigo
  ];

  let filterOptions = {
    Functional: [],
    stpstage: [],
    sector: []
  };

  let selected = {
    Functional: '',
    stpstage: '',
    sector: ''
  };

  let loading = true;

  function shuffleColorsWithoutRepeat(prevColor) {
    const available = colors.filter(c => c !== prevColor);
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    return available;
  }

  function assignGroupedColors(mentorsList) {
    let colorQueue = [...colors];
    let lastColor = null;
    let colorIndex = 0;

    for (let i = 0; i < mentorsList.length; i++) {
      if (colorIndex >= colorQueue.length) {
        colorQueue = shuffleColorsWithoutRepeat(lastColor);
        colorIndex = 0;
      }
      const color = colorQueue[colorIndex];
      mentorColors.set(mentorsList[i].id, color);
      lastColor = color;
      colorIndex++;
    }
  }

  onMount(async () => {
    try {
      mentors = await pb.collection('kifmindmentors').getFullList({ sort: '-created' });

      const sets = {
        Functional: new Set(),
        stpstage: new Set(),
        sector: new Set()
      };

      mentors.forEach(mentor => {
        mentor.Functional?.forEach(f => sets.Functional.add(f));
        mentor.stpstage?.forEach(s => sets.stpstage.add(s));
        mentor.sector?.forEach(sec => sets.sector.add(sec));
      });

      filterOptions = {
        Functional: Array.from(sets.Functional),
        stpstage: Array.from(sets.stpstage),
        sector: Array.from(sets.sector)
      };

      // Sort mentors alphabetically
      mentors.sort((a, b) => a.Name?.localeCompare(b.Name));

      assignGroupedColors(mentors);
      filterMentors();
    } catch (err) {
      console.error('Error loading mentors:', err);
    } finally {
      loading = false;
    }
  });

  function filterMentors() {
    filteredMentors = mentors.filter(m => {
      const matchesFunctional = !selected.Functional || m.Functional?.includes(selected.Functional);
      const matchesStage = !selected.stpstage || m.stpstage?.includes(selected.stpstage);
      const matchesSector = !selected.sector || m.sector?.includes(selected.sector);
      return matchesFunctional && matchesStage && matchesSector;
    });
  }

  function imageUrl(mentor) {
    return mentor.image
      ? `https://api.innovationfestival.in/api/files/${mentor.collectionId}/${mentor.id}/${mentor.image}`
      : '/default-avatar.png';
  }



  let isOpenFunctional = false;
  let isOpenStage = false;
  let isOpenSector = false;

  function toggle(type) {
    if (type === 'Functional') {
      isOpenFunctional = !isOpenFunctional;
      isOpenStage = isOpenSector = false;
    } else if (type === 'stpstage') {
      isOpenStage = !isOpenStage;
      isOpenFunctional = isOpenSector = false;
    } else {
      isOpenSector = !isOpenSector;
      isOpenFunctional = isOpenStage = false;
    }
  }

  function selectOption(type, value) {
    selected[type] = value;
    isOpenFunctional = isOpenStage = isOpenSector = false;
    filterMentors();
  }
</script>

<!-- Filters -->


<!-- Dropdown Wrapper -->
<!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6">

  <div class="relative w-full mt-3">
    <div class="flex items-center gap-2">
      <button
        on:click={() => toggle('Functional')}
        class="w-full bg-blue-600 text-white text-sm overflow- px-2 py-3 rounded-xl shadow-lg flex justify-between items-center"
      >
        {selected.Functional || 'Functional Expertise'}
        <svg class="w-4 h-4 ml-2 transform {isOpenFunctional ? 'rotate-180' : ''}" fill="white" viewBox="0 0 20 20">
          <path d="M5.5 7.5l4.5 4.5 4.5-4.5h-9z" />
        </svg>
      </button>
      {#if selected.Functional}
        <button
          class="text-red-500 text-xl hover:text-red-700"
          on:click={() => { selected.Functional = ''; filterMentors(); }}
          aria-label="Clear Functional filter"
        >✕</button>
      {/if}
    </div>
    {#if isOpenFunctional}
      <div class="absolute left-0 w-11/12 mt-2 rounded-xl shadow-xl bg-blue-600 text-white z-10">
        {#each filterOptions.Functional as f}
          <div
            class="p-2 text-sm hover:bg-blue-500 cursor-pointer"
            on:click={() => selectOption('Functional', f)}
          >{f}</div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="relative w-full mt-3">
    <div class="flex items-center gap-2">
      <button
        on:click={() => toggle('stpstage')}
        class="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg flex justify-between items-center"
      >
        {selected.stpstage || 'Startup Stage'}
        <svg class="w-4 h-4 ml-2 transform {isOpenStage ? 'rotate-180' : ''}" fill="white" viewBox="0 0 20 20">
          <path d="M5.5 7.5l4.5 4.5 4.5-4.5h-9z" />
        </svg>
      </button>
      {#if selected.stpstage}
        <button
          class="text-red-500 text-xl hover:text-red-700"
          on:click={() => { selected.stpstage = ''; filterMentors(); }}
          aria-label="Clear Stage filter"
        >✕</button>
      {/if}
    </div>
    {#if isOpenStage}
      <div class="absolute left-0 w-full mt-2 rounded-xl shadow-xl bg-blue-600 text-white z-10">
        {#each filterOptions.stpstage as s}
          <div
            class="px-6 py-3 hover:bg-blue-500 cursor-pointer"
            on:click={() => selectOption('stpstage', s)}
          >{s}</div>
        {/each}
      </div>
    {/if}
  </div>

  <div class="relative w-full mt-3">
    <div class="flex items-center gap-2">
      <button
        on:click={() => toggle('sector')}
        class="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg flex justify-between items-center"
      >
        {selected.sector || 'Sector'}
        <svg class="w-4 h-4 ml-2 transform {isOpenSector ? 'rotate-180' : ''}" fill="white" viewBox="0 0 20 20">
          <path d="M5.5 7.5l4.5 4.5 4.5-4.5h-9z" />
        </svg>
      </button>
      {#if selected.sector}
        <button
          class="text-red-500 text-xl hover:text-red-700"
          on:click={() => { selected.sector = ''; filterMentors(); }}
          aria-label="Clear Sector filter"
        >✕</button>
      {/if}
    </div>
    {#if isOpenSector}
      <div class="absolute left-0 w-full mt-2 rounded-xl shadow-xl bg-blue-600 text-white z-10">
        {#each filterOptions.sector as sec}
          <div
            class="px-6 py-3 hover:bg-blue-500 cursor-pointer"
            on:click={() => selectOption('sector', sec)}
          >{sec}</div>
        {/each}
      </div>
    {/if}
  </div>
</div> -->


























<div class="grid grid-cols-1 md:grid-cols-3 gap-4  mb-8 p-6" data-aos="fade-right" data-aos-duration="1000" data-aos-offset="100" data-aos-delay=1000>
  <!-- Functional Expertise -->
  <div class=" flex items-center gap-2">
    <select class="flex-1 p-2 border bg-kif-blue text-white border-kif-blue rounded w-11/12 shadow-2xl " bind:value={selected.Functional} on:change={filterMentors}>
      <option value="" class="bg-kif-blue" disabled selected>Functional Expertise</option>
      {#each filterOptions.Functional as f}
        <option value={f}>{f}</option>
      {/each}
    </select>
    {#if selected.Functional}
      <button
        class="text-red-500 text-xl hover:text-red-700"
        on:click={() => { selected.Functional = ''; filterMentors(); }}
        aria-label="Clear Functional filter"
      >
        ✕
      </button>
    {/if}
  </div>

  <!-- Startup Stage -->
  <div class="flex items-center gap-2">
    <select class="flex-1 p-2 border bg-kif-green text-white border-kif-green rounded w-11/12 " bind:value={selected.stpstage} on:change={filterMentors}>
      <option value="" disabled selected>Startup Stage</option>
      {#each filterOptions.stpstage as s}
        <option value={s}>{s}</option>
      {/each}
    </select>
    {#if selected.stpstage}
      <button
        class="text-red-500 text-xl hover:text-red-700"
        on:click={() => { selected.stpstage = ''; filterMentors(); }}
        aria-label="Clear Stage filter"
      >
        ✕
      </button>
    {/if}
  </div>

  <!-- Sector -->
  <div class="flex items-center gap-2">
    <select class="flex-1 p-2 border bg-kif-dark-blue text-white border-kif-dark-blue rounded w-11/12 " bind:value={selected.sector} on:change={filterMentors}>
      <option value="" disabled selected>Sector</option>
      {#each filterOptions.sector as sec}
        <option value={sec}>{sec}</option>
      {/each}
    </select>
    {#if selected.sector}
      <button
        class="text-red-500 text-xl hover:text-red-700"
        on:click={() => { selected.sector = ''; filterMentors(); }}
        aria-label="Clear Sector filter"
      >
        ✕
      </button>
    {/if}
  </div>
</div>


<!-- Mentor Cards -->
{#if loading}
  <p class="text-center text-gray-600">Loading mentors...</p>
{:else if filteredMentors.length === 0}
  <p class="text-center text-gray-600">No mentors found for selected filters.</p>
{:else}
  <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6 pb-10">
    {#each filteredMentors as mentor}
      <div class="relative group rounded-lg overflow-hidden flex flex-col border-2"
           style="border-color: {mentorColors.get(mentor.id).border}">
        <img src={imageUrl(mentor)} alt={mentor.Name} class="h-64 object-cover" />

        <!-- Footer -->
        <div class="text-white text-center py-3 px-2 font-semibold h-full"
             style="background-color: {mentorColors.get(mentor.id).bg}">
          <h3 class="text-base">{mentor.Name}</h3>
          <p class="text-xs font-normal">{mentor.designation}<br />{mentor.organization}</p>
        </div>

        <!-- LinkedIn Hover Button -->
        {#if mentor.linkedin}
          <a href={mentor.linkedin} target="_blank"
             class="absolute bottom-0 left-8 transform -translate-x-1/2 translate-y-full 
                    opacity-0 group-hover:-translate-y-20 group-hover:opacity-100 
                    transition-all duration-300 ease-in-out bg-white shadow-md 
                    rounded-full p-2 z-10"
             style="border: 2px solid {mentorColors.get(mentor.id).bg}; color: {mentorColors.get(mentor.id).bg}">
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
{/if}
