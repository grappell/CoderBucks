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

<!-- todo: fix the styling for the card - currently using min(), want to use clamp() -->

<Card
  class="mb-3"
  style="width: min(100%, 300px); height: clamp(250px, 400px, 110%); margin-bottom: 50px !important;"
>
  <CardHeader style="display: flex; flex-direction: column;">
    <CardTitle
      style="color:black; text-align:center; font-weight: 600; font-size: larger; justify-self: center; align-self: center;"
      >{product.name}</CardTitle
    >
  </CardHeader>
  <CardBody class="cardBody">
    <img
      src={product.userImgUrl}
      style="width: 95%; display: block; border-radius: 5px;"
      alt="product img"
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
    /* margin: 0; */
  }
</style>
