<script>
  import {
    Row,
    Alert,
    FormGroup,
    Input,
    Label,
    Col,
    Button,
  } from "sveltestrap/src";
  import authStore from "../../../../../store/authStore";
  import { goto, stores } from "@sapper/app";
  import { onMount } from "svelte";
  const { page } = stores();

  authStore.subscribe(async (info) => {
    if (info.fierbaseOn === false) {
      return;
    } else if (info.isLogedIn === false) {
      alert(
        "You Need To Be logged In to Access This Page, you will be rederected"
      );
      await goto("/loginWithEmail");
    }
  });

  page.subscribe(console.log);

  var picture;
  var name;
  var price;
  var errorMessage = "";
  var sucessMessage = "";
  var submiting = false;
  async function submit() {
    submiting = true;
    var db = firebase.firestore();
    console.log(name);
    if (name && price) {
      var add = await db
        .collection("organization")
        .doc($page.params.orgName)
        .collection("teachers")
        .doc($page.params.teacherName)
        .collection("products")
        .add({ name: name, price: price, userId: $authStore.userId });
      if (picture[0].type === "image/png" || picture[0].type === "image/jpeg") {
        var pic = picture[0];
        const mainPicturePath = `/${$authStore.userId}/${name}.${pic.name
          .split(".")
          .pop()}`;
        const storage = firebase.storage();
        const ref = storage.ref(mainPicturePath);
        await ref.put(pic);
        await add.update({ userImgUrl: await ref.getDownloadURL() });
        sucessMessage = "Product Added!";
        submiting = false;
        name = "";
        price = "";
        return mainPicturePath;
      }
    } else {
      errorMessage = "You are missing one or both fields";
      submiting = false;
    }
  }

  onMount(async () => {
    var db = firebase.firestore();
    var urlTeacher = db
      .collection("organization")
      .doc($page.params.orgName)
      .collection("teachers")
      .doc($page.params.teacherName);
    let teacherUID;
    urlTeacher.get().then((data) => {
      teacherUID = data.data().userId;
    });
    var snapshot = await urlTeacher.get();
    if (!snapshot.exists) {
      alert(
        "This teacher name does not exist, you will be redirected to the home page"
      );
      goto(`/organization/${$page.params.orgName}`);
    }
    console.log(teacherUID, $authStore.userId);
    console.log($authStore);
    if ($authStore.userId != teacherUID) {
      alert("Acounts do not macth");
      goto(`/organization/${$page.params.orgName}`);
    }
  });
</script>

<h2>Add a product to {$page.params.teacherName}</h2>
<br />

<FormGroup>
  <Label for="Name">Name of Product</Label>
  <Input
    type="text"
    name="email"
    id="name"
    bind:value={name}
    placeholder="Input the name of the product here"
  />
</FormGroup>
<FormGroup>
  <Label for="price">Price</Label>
  <Input
    type="number"
    name="number"
    id="price"
    bind:value={price}
    placeholder="Input price Here (in CoderBucks)"
  />
</FormGroup>
<FormGroup>
  <Label for="displayFile">File</Label>
  <Input type="file" name="file" id="displayFile" bind:files={picture} />
</FormGroup>
<Button
  id="submitButton"
  outline
  color="success"
  class="float-right"
  on:click={submit}
  size="block"
  bind:disabled={submiting}>Submit</Button
>
<br />
<br />
{#if errorMessage != ""}
  <Alert color="danger" dismissible>{errorMessage}</Alert>
{/if}
{#if sucessMessage != ""}
  <Alert color="success" dismissible>{sucessMessage}</Alert>
  <center
    ><a href={`/organization/${$page.params.orgName}`}
      ><h2 class="link">Click here to return to the home page</h2></a
    ></center
  >
{/if}
