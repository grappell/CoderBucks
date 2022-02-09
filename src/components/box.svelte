<script>
  export let dimensions = { x: 0, y: 0, roundnes: 10 };
  export let content;
  export let image;
  export let color;
</script>

<div
  style="--roundness: {dimensions.roundnes}px; background-color: rgb({color.r}, {color.g}, {color.b})"
  id="top-box"
  class="col w-{dimensions.x} h-{dimensions.y}"
>
  <h1>{content.header}</h1>
  {#if image}
    <img src={image.src} alt={image.alt} width={image.size} />
  {/if}
  {#if content.subtext}
    <p>{content.subtext}</p>
  {/if}
</div>

<style>
  #top-box {
    margin: 7px 10px;
    width: var(--width_x);
    height: var(--width_y);
    border-radius: var(--roundness);
    color: white;
  }
  img {
    border-radius: 5px;
  }
</style>
