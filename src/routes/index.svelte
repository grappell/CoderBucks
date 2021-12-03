<script>
  import { onMount } from "svelte";
  import {
    Alert,
    Col,
    ListGroup,
    Row,
    ListGroupItem,
    Button,
  } from "sveltestrap/src";
  import {
    Carousel,
    CarouselControl,
    CarouselIndicators,
    CarouselItem,
  } from "sveltestrap/src";
  import { getOrginisations } from "../db";
  import authStore from "../store/authStore";
  import { goto } from "@sapper/app";
  var organizationList = [];
  const items = [
    "https://images.unsplash.com/photo-1558637845-c8b7ead71a3e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1599522336242-0db868a98cb1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  ];
  let activeIndex = 0;
  onMount(async () => {
    organizationList = await getOrginisations();
  });

  async function joinButonClick() {
    await goto("/create_account");
  }
</script>

<!-- you can change the "object-fit: _____" to cover, contain, or fill. (would look funny) -->

<h1 style="text-align: center; padding: 50px">
  Welcome to the CoderBucks Home Page
</h1>

<div class="position-relative">
  <Carousel {items} bind:activeIndex class="start-50 translate-middle">
    <CarouselIndicators bind:activeIndex {items} />
    <div class="carousel-inner">
      {#each items as item, index}
        <CarouselItem bind:activeIndex itemIndex={index}>
          <img
            src={item}
            class="h-50 d-block w-100"
            style="object-fit: contain; height:500px!important"
            alt={`${item} ${index + 1}`}
          />
        </CarouselItem>
      {/each}
    </div>
    <CarouselControl direction="prev" bind:activeIndex {items} />
    <CarouselControl direction="next" bind:activeIndex {items} />
  </Carousel>
</div>
<br />

<Button on:click={joinButonClick}>JOIN THIS THING</Button>

<p>
  All current pages:<br />

  http://localhost:3000/create_account <br />
  http://localhost:3000/loginWithEmail<br />
  http://localhost:3000/store<br />
  http://localhost:3000/organization/[name]<br />
  http://localhost:3000/organization/[name]/teachers/[teacherName]<br />
  http://localhost:3000/organization/[name]/teachers/[teacherName]/addProduct<br
  />
  http://localhost:3000/organization/add
</p>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@496&display=swap");
  :global(body) {
    font-family: "Roboto Mono", monospace;
    background-color: rgb(
      236,
      236,
      236
    ); /* need to settle on a background color... */
  }
</style>
