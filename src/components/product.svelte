<script>
  export let product;
  // export let fontColor;
  import {
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardText,
    CardTitle,
  } from "sveltestrap/src";
</script>

<Card class="mb-3" style="width: min(100%, 300px); height: min(110%, 500px);">
  <CardHeader>
    <CardTitle style="color:black; text-align:center">{product.name}</CardTitle>
  </CardHeader>
  <CardBody>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      src={product.userImgUrl}
      style="width: 80%; display: block; margin:auto;"
    />
    <br />
    <CardText style="text-align: center; color:black;"
      ><strong>Price: </strong> ${product.price} CB</CardText
    >
    <CardSubtitle style="text-align: center; color:black;"
      ><strong>Description: </strong>
      {product.decription || "Missing Deciption"}</CardSubtitle
    >
  </CardBody>
</Card>

<style>
  * {
    z-index: 20 !important;
    position: relative;
    font-size: 20px !important;
    overflow: hidden;

    padding: 0;
    margin: 0;
  }
</style>
