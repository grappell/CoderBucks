<script>
  import {
    getTeachers,
    getTecherListFromStudent,
    getCoderBucksObject,
  } from "../db";
  import authStore from "../store/authStore";
  import { onMount } from "svelte";
  import { Button } from "sveltestrap/src";
  import { goto } from "@sapper/app";
  import Box from "../components/box.svelte";

  // TODO: get isStudent from firebase (also not working)
  onMount(async () => {
    let db = firebase.firestore();

    var cbObj = await getCoderBucksObject($authStore.studentPath);

    console.log($authStore.isStudent);

    console.log(cbObj);

    if (!$authStore.isStudent && !cbObj) {
      alert("You are not a student");
      await goto("/");
    }
    // getTecherListFromStudent($authStore.studentPath);
  });
</script>

<!-- AuthStore is not working :( -->

<!-- things we want:
  
 -> Total coder bucks (in big)
 -> teacher spend store (links maby)
 -> Accoount controller
 -> Open assignments tab (stuff that the teacher is offering to pay for in coderbucks)

-->

<h1>Student Homepage</h1>

<div class="photo-container">
  <section class="photo-grid">
    <div class="card card-cb">Total coder bucks</div>
    <div
      class="card card-tall card-wide"
      style="background-image: url('https://media.wired.com/photos/5c9040ee4950d24718d6da99/1:1/w_1800,h_1800,c_limit/shoppingcart-1066110386.jpg');"
    >
      Teacher Store
    </div>
    <!-- <div
      class="card card-tall"
      style="background-image: url('http://cdn.onlinewebfonts.com/svg/img_243887.png');"
    >
      Account
    </div> -->
    <div
      class="card card-tall card-wide"
      style="background-image: url('https://media.wired.com/photos/5ae0d5ae3f3b183561144216/16:9/w_2005,h_1128,c_limit/google-tasks.jpg'); color: black;"
    >
      Open tasks
    </div>
    <!-- <div
      class="card card-tall"
      style="background-image: url('https://echamicrobiology.com/app/uploads/2016/05/question-mark-character.jpg'); color: black;"
    >
      Someting else
    </div> -->
    <!-- <div class="card card-tall">2</div> -->
  </section>
</div>

<style>
  .photo-container {
    position: absolute;
    left: 0;
    margin: 0;
    padding: 0;
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #353535;
    font-size: 3rem;
    color: #fff;
    box-shadow: rgba(3, 8, 20, 0.1) 0px 0.15rem 0.5rem,
      rgba(2, 8, 20, 0.1) 0px 0.075rem 0.175rem;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    transition: all 500ms;
    overflow: hidden;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .card:hover {
    box-shadow: rgba(2, 8, 20, 0.1) 0px 0.35em 1.175em,
      rgba(2, 8, 20, 0.08) 0px 0.175em 0.5em;
    transform: translateY(-3px) scale(1.01);
  }

  .photo-grid {
    margin: 0;
    display: grid;
    gap: 1rem;
    transform: translateX(12.5%);
    grid-template-columns: repeat(auto, minmax(240px, 1fr));
    grid-auto-rows: 140px;
    grid-auto-columns: 80vw;
  }

  /* Medium screens */
  @media screen and (min-width: 600px) {
    .card-tall {
      grid-row: span 2 / auto;
    }

    .card-wide {
      grid-column: span 2 / auto;
    }

    .photo-grid {
      grid-auto-columns: 19vw;
    }

    .card-cb {
      grid-column: span 4 / auto;
      grid-row: span 3 / auto;
      background-image: url("https://www.investopedia.com/thmb/lqOcGlE7PI6vLMzhn5EDdO0HvYk=/1337x1003/smart/filters:no_upscale()/GettyImages-1054017850-7ef42af7b8044d7a86cfb2bff8641e1d.jpg");
      color: black;
    }
  }
</style>
