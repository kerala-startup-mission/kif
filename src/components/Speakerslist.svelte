<script>
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

  /* hide default navigation arrows (optional if you use custom HTML) */
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
                <!-- <p class="text-sm">{speaker.designation}<br />{speaker.organisation}</p> -->
            </div>
        </div>
      {/each}
    </div>

    <div class="swiper-pagination pt-10 text-center"></div>
  </div>

  <!-- <div class="flex justify-center mt-8">
    <a href="/SpeakersKIF" class="bg-kif-yellow hover:bg-yellow-500 text-white text-sm font-semibold py-2 px-6 rounded-full shadow">
      View More
    </a>
  </div> -->
</section>
