<script>
  import { onMount } from 'svelte';
  import SvelteMarkdown from 'svelte-markdown';
  import { DateTime } from "luxon";
  import simplur from 'simplur';

  let loading = true;
  let agenda_list = [];
  let categories = [];
  let venues = [];
  let active_tab = "";

  async function loadData() {
    const today = DateTime.now().toFormat("LLL dd, yyyy");
    loading = true;
    const data = await fetch(`https://events.startupmission.in/api/event/kif/agenda/venue`).then(response => response.json());
    agenda_list = data.agenda;
    categories = data.categories;
    venues = data.venues;
    loading = false;
    active_tab = dates().includes(today) ? today : dates()[0];
  }

  function dates() {
    return Object.keys(agenda_list);
  }

  onMount(async () => {
    await loadData();
  });

  function date_format(date, format) {
    return DateTime.fromFormat(date, "LLL dd, yyyy").toFormat(format);
  }

  function date_detail(start) {
    return DateTime.fromSQL(start).toFormat('hh:mm a');
  }

  function selectTab(date) {
    active_tab = date;
  }

  function classifyEvents(agenda) {
    const morning = [];
    const afternoon = [];
    const fullDay = [];

    agenda.forEach(event => {
      const start = DateTime.fromSQL(event.start_time);
      const end = DateTime.fromSQL(event.end_time);

      const startHour = start.hour;
      const endHour = end.hour;

      const isMorning = startHour >= 9 && endHour <= 14;
      const isAfternoon = startHour >= 13 && endHour <= 21;
      const isFullDay = startHour >= 9 && endHour <= 22 && !(isMorning || isAfternoon);

      if (isMorning) {
        morning.push(event);
      } else if (isAfternoon) {
        afternoon.push(event);
      } else if (isFullDay) {
        fullDay.push(event);
      } else {
        // fallback for anything else
        fullDay.push(event);
      }
    });

    return { morning, afternoon, fullDay };
  }
</script>

<!-- Date Tabs -->
<div class="agenda__tabs space-x-4 text-center text-kif-dark-blue mb-5">
  {#each Object.entries(agenda_list) as [date, agendas]}
    <button on:click={() => selectTab(date)} class="px-5 py-3 spl_cursor mb-3 sm:text-base text-xs rounded-md shadow border {date === active_tab ? 'bg-kif-red text-white border-red-600' : 'border-kif-dark-blue'}">
      <span>{date_format(date, 'ccc')}</span>, {date_format(date, 'LLL d, y')}
    </button>
  {/each}
</div>

<!-- Agenda Display -->
<div id="event-sched1" data-title="Event Schedule" class="">
  {#each Object.entries(agenda_list) as [date, agendas]}
    {#if date === active_tab}
      <h2 class="text-2xl font-bold text-center mb-6">{date_format(date, 'DDD')}</h2>
      <div class="grid md:grid-cols-3 grid-cols-1 gap-3 mb-4">
        <div class="font-bold text-lg md:flex hidden">Venue</div>
        <div class="font-bold text-lg md:flex hidden">Morning</div>
        <div class="font-bold text-lg md:flex hidden">Afternoon</div>

        {#each Object.entries(agendas) as [venue, agenda]}
          {#key venue}
            <div class="font-medium py-2">{venue}</div>

            <!-- Morning Column -->
            <div class="space-y-2">
              {#each classifyEvents(agenda).morning.concat(classifyEvents(agenda).fullDay) as event}
                <div class="p-2 border rounded bg-white text-sm">
                  <div class="font-semibold text-kif-green">{event.name}</div>
                  <div class="text-xs text-yellow-600 uppercase">{event.category}</div>
                  <div class="text-xs text-gray-500">{date_detail(event.start_time)} IST</div>
                </div>
              {/each}
            </div>

            <!-- Afternoon Column -->
            <div class="space-y-2">
              {#each classifyEvents(agenda).afternoon.concat(classifyEvents(agenda).fullDay) as event}
                <div class="p-2 border rounded bg-white text-sm">
                  <div class="font-semibold text-kif-green">{event.name}</div>
                  <div class="text-xs text-yellow-600 uppercase">{event.category}</div>
                  <div class="text-xs text-gray-500">{date_detail(event.start_time)} IST</div>
                </div>
              {/each}
            </div>
          {/key}
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .agenda__tabs button {
    transition: all 0.3s ease;
  }
  .agenda__tabs button:hover {
    opacity: 0.85;
  }
  #event-sched1 h2 {
    color: #1a202c;
  }
  .grid-cols-3 > div,
  .grid-cols-1 > div {
    padding: 0.5rem;
  }
  .border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
</style>
