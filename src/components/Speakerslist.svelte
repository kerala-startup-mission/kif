<!-- <script>
  import { onMount } from 'svelte';
  import Swiper from 'swiper/bundle';
  import 'swiper/css/bundle';

  let speaker_list = [];

  const getImage = (photo) => photo || '/default-avatar.png';

  onMount(() => {
    fetch(`https://events.startupmission.in/api/event/kif/speakers?category=Speakers`)
      .then(res => res.json())
      .then(json => {
        speaker_list = Object.values(json).flat();

        // Wait for DOM
        setTimeout(() => {
          new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            },
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
            },
            loop: true,
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
          });
        }, 100);
      });
  });
</script>

<style>
 
  .swiper-button-prev,
  .swiper-button-next {
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }

  .swiper-button-prev {
    left: -60px;
  }

  .swiper-button-next {
    right: -60px;
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    display: none;
  }
</style>

<section class="relative max-w-screen-xl mx-auto px-4 py-10">
  <div class="swiper-button-prev absolute" style="left: -2rem;">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </div>

  <div class="swiper-button-next absolute" style="right: -2rem;">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </div>



  <div class="swiper">
    <div class="swiper-wrapper mb-20">
      {#each speaker_list as speaker}
       <div class="swiper-slide flex flex-col items-center justify-center w-full">
            <div class="flex justify-center items-center mb-3">
                <img
                src={getImage(speaker.photo)}
                alt={speaker.name}
                class="h-32 w-32 rounded-full object-cover"
                />
            </div>
            <div class="text-center">
                <h3 class="text-sm font-semibold">{speaker.name}</h3>
            </div>
        </div>
      {/each}
    </div>

    <div class="swiper-pagination pt-10 text-center"></div>
  </div>

 
</section> -->


<script>
  import { onMount } from 'svelte';
  import Swiper from 'swiper/bundle';
  import 'swiper/css/bundle';

  let speaker_list = [];
  let speakerColors = new Map();

  const colors = [
    { border: '#E5243B', bg: '#E5243B' }, // Red
    { border: '#4C9F38', bg: '#4C9F38' }, // Green
    { border: '#FCC310', bg: '#FCC310' }, // Yellow
    { border: '#26BDE2', bg: '#26BDE2' }, // Blue
    { border: '#1A486A', bg: '#1A486A' }  // Indigo
  ];

  const getImage = (photo) => photo || '/default-avatar.png';

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
      speakerColors.set(sp.photo, queue[i]);
      lastColor = queue[i];
      i++;
    }
  }

  onMount(() => {
    fetch(`https://events.startupmission.in/api/event/kif/speakers?category=Speakers`)
      .then(res => res.json())
      .then(json => {
        speaker_list = Object.values(json).flat();
        assignColors(speaker_list);

        // Initialize Swiper
        setTimeout(() => {
          new Swiper('.swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            },
            loop: true,
            autoplay: {
              delay: 3000,
              disableOnInteraction: false,
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
          });
        }, 100);
      });
  });
</script>

<style>
 
  .swiper-button-prev,
  .swiper-button-next {
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }

  .swiper-button-prev {
    left: -60px;
  }

  .swiper-button-next {
    right: -60px;
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    display: none;
  }
</style>


<section class="relative max-w-screen-xl mx-auto px-4 py-10">
  <!-- Navigation -->
  <div class="swiper-button-prev absolute">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </div>

  <div class="swiper-button-next absolute">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </div>

  <!-- Swiper -->
  <div class="swiper">
    <div class="swiper-wrapper pb-20">
      {#each speaker_list as { name, designation, organisation, photo, linkedin }}
       <div class="swiper-slide h-full">
        <div
            class="relative group rounded-lg overflow-hidden flex flex-col h-full border-2 shadow-sm hover:shadow-lg transition-all duration-300"
            style="border-color: {speakerColors.get(photo)?.border}"
        >
            <img src={getImage(photo)} alt={name} class="h-64 w-full object-cover" loading="lazy" />

            <div
            class="flex flex-col text-white text-center px-2 font-semibold flex-grow"
            style="background-color: {speakerColors.get(photo)?.bg}; min-height: 80px;"
            >
            <h3 class="text-base">{name}</h3>
            <p class="text-xs font-normal">{designation}<br />{organisation}</p>
            </div>

            {#if linkedin}
            <!-- LinkedIn icon button -->
            {/if}
        </div>
        </div>

      {/each}
    </div>

    <div class="swiper-pagination pt-20 text-center"></div>
  </div>
</section>

