<script>
    import { onMount, onDestroy } from "svelte";
  
    let isVisible = false;
    let divClass = ""; // Class to handle visibility
  
    // Run only in the browser after mount
    onMount(() => {
      // Add scroll listener only on the client-side
      const handleScroll = () => {
        if (window.scrollY >= window.innerHeight) {
          isVisible = true;
        } else {
          isVisible = false;
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      // Clean up on destroy
      onDestroy(() => {
        window.removeEventListener("scroll", handleScroll);
      });
    });
  
    // Close button to hide the div with hidden class
    const closeDiv = () => {
      divClass = "hidden";
    };
  
    // Handle button click (optional - Add any behavior if needed)
    const handleBuyTicket = () => {
      alert("Redirecting to ticket purchase page...");
    };
  </script>
  
  <style>
    .bottom-div {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
     
      background-color: #ff6600;
      color: white;
     
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 9999;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
  
    .content-container {
      align-items: center;
      width: 100%;
    }
  
   
  
    .btn-container {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  
    .buy-btn {
      background-color: white;
      color: #ff6600;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      border: none;
      transition: background-color 0.3s ease;
    }
  
    .buy-btn:hover {
      background-color: #ffd1b3;
    }
  
    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: white;
    }
  
    .hidden {
      display: none !important;
    }
  
    .vl-btn6 {
      display: inline-flex;
      align-items: center;
      background-color: white;
      color: #ff6600;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .vl-btn6:hover {
      background-color: #ffd1b3;
    }
  
    .vl-btn6 img {
      margin-left: 8px;
    }
  </style>
  
  {#if isVisible}
    <div class="bottom-div md:w-3/4 w-full pb-3 {divClass}">
      <div class="content-container pt-3 px-6 flex md:flex-row flex-col md:justify-between items-center justify-center text-center">
        <!-- Left Content (Text & Button) -->
       
        <div class="text-container text-xl">
            <h1>#10YearsofKSUM</h1>
        </div>
        <div>
            <h1 class=" md:text-xl text-base">Shaping a Sustainable Tomorrow 2035
            </h1>
        </div>
      
       
      
        <div class="btn-container">
          <a class="buy-btn" >Register Now →</a>
          <button class="close-btn top-0 right-0 font-extralight" on:click={closeDiv}>✖</button>
        </div>
      </div>
    </div>
  {/if}
  