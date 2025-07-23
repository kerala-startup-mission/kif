<script>
    import {onMount} from 'svelte';
    import SvelteMarkdown from 'svelte-markdown'
    import { DateTime } from "luxon";
    import simplur from 'simplur';
  
    let loading = true;
  
    let agenda_list = [];
    let categories = [];
    let venues = [];
  
    let active_tab = ""; 
    let active_venue = ""; 
  
    async function loadData(){
      var today = DateTime.now().toFormat("LLL dd, yyyy");
      loading = true;
      let data = await fetch(`https://events.startupmission.in/api/event/kif/agenda/venue`).then(response => response.json());
      agenda_list = data.agenda;
      categories = data.categories;
      venues = data.venues;
      loading = false;
      active_tab = (dates().indexOf(today) >= 0) ? today : dates()[0];
      
      active_venue="Digital Hub Theatre Hall";
  
    }
  
    function dates(){
      let dates = Object.keys(agenda_list);
      return dates;
    }
  
    onMount(async ()=>{
      await loadData();
    });
  
    function date_format(date, format) {
      let d = DateTime.fromFormat(date, "LLL dd, yyyy");
      return d.toFormat(format);
    }
  
    function date_single(date){
      let s = DateTime.fromSQL(date);
      return s.toFormat('hh:mm a');
    }
  
    function date_detail(start, end){
      let s = DateTime.fromSQL(start);
      let e = DateTime.fromSQL(end);
  
      if(s.hasSame(e, 'day')){
        return s.toFormat('hh:mm a') + " - " + e.toFormat('hh:mm a')
      }
      else{
        return s.toFormat('hh:mm a') + " - " + e.toFormat('hh:mm a')
      }
  
    }
  
    function selectTab(date){
      active_tab = date;
    }
  
    function selectVenue(venue){
      active_venue = venue;
    }
  
  </script>
  
  <div class="agenda__tabs space-x-4 text-center text-kif-dark-blue mb-5 ">
    {#each Object.entries(agenda_list) as [date, agendas]}
      <button on:click={()=> selectTab(date)} class="px-5 py-3 spl_cursor mb-3 sm:text-base text-xs rounded-md shadow  border {date == active_tab ? 'bg-kif-red text-white border-red-600' : 'border-kif-dark-blue'} " >
        <span>{date_format(date, 'ccc')}</span>, {date_format(date, 'LLL d, y')}
      </button>
    {/each}
  </div>
  
<div class="agenda__tabs space-x-4 text-center text-kif-dark-blue mb-5 ">
  {#if agenda_list[active_tab]}
    {#each Object.keys(agenda_list[active_tab]) as venue}
      <button
        on:click={() => selectVenue(venue)}
        class="px-5 py-3 mb-3 spl_cursor sm:text-base text-xs rounded-md shadow border 
          {venue == active_venue ? 'bg-kif-red text-white border-red-600' : 'border-kif-dark-blue'}">
        <span>{venue}</span>
      </button>
    {/each}
  {/if}
</div>

  
  <div id="event-sched1" data-title="Event Schedule" class="">
    {#each Object.entries(agenda_list) as [date, agendas]}
  
      {#if date == active_tab}
  
        <!-- <div class="text-center mb-10">Venue: {venue[date]}</div> -->
  
        <div class="w-full max-w-4xl mx-auto mb-5">
  
          {#each Object.entries(agendas) as [venue, agenda] }
  
            {#if venue == active_venue}
  
              {#each agenda as {name, description, start_time, end_time, category, speakers, venue} }
  
                <div class=" alternate-row px-5 py-3 my-2">
                  <div class="flex flex-col md:flex-row md:space-x-5">
                    <div class=" text-kif-dark-blue md:pt-3 flex-shrink-0 min-w-[6rem]">{date_single(start_time)} IST</div>
                    
                    <div class="w-full divide-y divide-gray-600 space-y-4 mb-3">
                      
                        <div class=" w-full pt-3">
                          <div class="text-yellow-500 uppercase text-xs">{category ?? ""}</div>
                          <div class="md:text-lg text-base font-bold max-w-xl text-kif-green">{name}</div>
      
                          {#if description }
                            <div class="mt-4 text-kif-dark-blue mb-4">
                              <SvelteMarkdown source={description}></SvelteMarkdown>
                            </div>
                          {/if}
      
                          {#if Object.entries(speakers).length}
                            <div class="mt-4 ml-4">
                              {#each Object.entries(speakers) as [category, speaker_list]}
                                <div class="font-bold text-xs uppercase text-pink-300 mb-3">
                                  { simplur`${[speaker_list.length,null]}${category}[|s]` }
                                </div>
      
                                <div class="flex flex-wrap w-full">
                                  {#each speaker_list as {name, designation, organisation, photo, linkedin}}
                                    <div class="flex items-center space-x-4 mb-3 pr-3 md:w-1/2">
                                      <div class="rounded-full flex-shrink-0 w-20 border-r-4 border-b-4 border-red-500 shadow-lg overflow-hidden">
                                        <img src="{photo}" alt="name" class="">
                                      </div>
                                      <div>
                                        <div class="font-bold text-kif-dark-blue  text-sm">{name}</div>
                                        <div class="text-xs text-pink-300">{designation}</div>
                                        <div class="text-xs text-pink-300">{organisation ?? ""}</div>
                                      </div>
                                    </div>
                                  {/each}
                                </div>
      
                              {/each}
                            </div>
                          {/if}
      
                          <!-- {#if venue}
                            <div class="pt-3 text-xs  flex space-x-4 text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                                <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                              </svg>
                              {venue}
                            </div>
                          {/if} -->
      
                        </div>
                      
      
                    </div>
      
                  </div>
                  
                </div>
  
              {/each}
  
            {/if}
            
          {/each}
        </div>
      {/if}
      
    {/each}
  </div>
  
  <style lang="scss">
  .alternate-row{
    &:nth-child(odd){
      --tw-bg-opacity: .10;
      border: 1px solid rgba(112, 109, 109, 0.136);
    }
    &:nth-child(even){
      --tw-bg-opacity: 0;
      border: 1px solid rgba(112, 109, 109, 0.136);
    }
  }

  #event-sched{
    position: relative;
    &::before{
      @apply text-white md:text-8xl text-5xl font-bold font-heading opacity-80 transform -rotate-90;
      content: attr(data-title);
      position: absolute;
      top: 0;
      left: -75%;
      transform-origin: center right;

      @media (min-width: 768px){
        & {
          font-size: 8rem;
          line-height: 1;
        }
      }
    }
  }
</style>