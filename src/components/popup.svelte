<script>
  import { Button, Form, FormGroup, Label, Input } from "sveltestrap/src";
  // export let showPopup = false;
  // export let label = "";
  // export let hasInput = false;
  // export let inputPlaceholder = "Type Here";

  export let input = {
    showPopup: false,
    title: "",
    subTitle: "",
    label: "",
    hasInput: false,
    inputPlaceholder: "Type Here",
    hasOkButton: false,
  };

  function handleScroll() {
    let totalHeight = window.screen.height;
    document.documentElement.style.setProperty(
      "--totalHeight",
      totalHeight + "px"
    );
  }

  function closePopup() {
    input.showPopup = false;
  }

  export let inputReturn;
</script>

<svelte:window on:scroll|once={handleScroll} />

{#if input.showPopup}
  <div class="overlay" id="overlay">
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
        <Button color="dark" on:click={closePopup}>Close</Button>
      </span>
    </div>
  </div>
{/if}

<style>
  :root {
    --totalHeight: 100vh;
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
    transform: translateX(calc(50vw - 50%)) translateY(calc(50vh - 50%));
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
