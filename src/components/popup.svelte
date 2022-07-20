<svelte:options accessors />

<script>
  import { afterUpdate, beforeUpdate } from "svelte";
  import { Button, Form, FormGroup, Label, Input } from "sveltestrap/src";
  import { fade } from "svelte/transition";

  export let input = {
    showPopup: true,
    title: "",
    subTitle: "",
    label: "",
    hasInput: false,
    inputPlaceholder: "Type Here",
    hasOkButton: false,
    isGood: true,
  };

  function changePopup() {
    input.showPopup = !input.showPopup;
  }

  afterUpdate(() => {
    let totalHeight = window.innerHeight;
    document.documentElement.style.setProperty(
      "--totalHeight",
      totalHeight + "px"
    );

    if (input.showPopup) {
      switch (input.isGood) {
        case true:
          document.getElementById("box").style.backgroundColor =
            getComputedStyle(document.documentElement).getPropertyValue(
              "--suceedCol"
            );
          break;

        case false:
          document.getElementById("box").style.backgroundColor =
            getComputedStyle(document.documentElement).getPropertyValue(
              "--failCol"
            );
          break;

        default:
          document.getElementById("box").style.backgroundColor = "white";
      }
    }
  });
  export let inputReturn;
</script>

{#if input.showPopup}
  <div
    class="overlay"
    id="overlay"
    transition:fade={{ delay: 150, duration: 300 }}
  >
    <div class="box" id="box">
      <h1>{input.title}</h1>
      <hr />
      <span>
        <p>{input.subTitle}</p>
        {#if input.hasInput}
          <Form>
            <FormGroup>
              {#if input.label}
                <Label for="exampleEmail">{input.label}</Label>
              {/if}
              <Input
                placeholder={input.inputPlaceholder}
                bind:value={inputReturn}
              />
            </FormGroup>
          </Form>
        {/if}
        {#if input.hasOkButton}
          <Button color="primary">Ok</Button>
        {/if}
        <Button color="dark" on:click={changePopup}>Close</Button>
      </span>
    </div>
  </div>
{/if}

<style>
  :root {
    --totalHeight: 100px;
    --suceedCol: rgb(220, 243, 211);
    --failCol: rgb(255, 218, 218);
  }

  .box {
    min-width: 40rem;
    opacity: 100%;
    background-color: white;
    box-shadow: 0px 12px 24px -12px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0px 12px 24px -12px rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 1001;
    left: 0;
    transform: translateX(calc(50vw - 50%)) translateY(calc(50vh - 60%));
    top: calc(50vh - 60%);
    padding: 1rem;
    border-radius: 1rem;
    transition: all 1s;
  }

  .overlay:after {
    z-index: 1000;
    content: "\A";
    position: absolute;
    width: 100%;
    height: var(--totalHeight);
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    transition: background 0.5s;
    -webkit-transition: background 0.5s;
    -moz-transition: background 0.5s;
  }
</style>
