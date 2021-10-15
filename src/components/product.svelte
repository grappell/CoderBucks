<script>
    export let product
    import { Card, CardBody, CardHeader, CardSubtitle, CardText,CardTitle } from 'sveltestrap/src';


</script>

<Card class="mb-3">
    <CardHeader>
      <CardTitle>{product.name}</CardTitle>
    </CardHeader>
    <CardBody>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img src={product.userImgUrl} style="width: 80%; display: block; margin:auto;"/>
        <br>
        <CardText style="text-align: center;" ><strong>Price: </strong> ${product.price} CB</CardText>
        <CardSubtitle style="text-align: center;"><strong>Description: </strong> {product.decription || "Missing Deciption"}</CardSubtitle>
    </CardBody>
  </Card>