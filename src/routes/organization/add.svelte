<!-- orginisation reqirements
name: (of school)
location: (timezone, upper cal, lower cal) subdevide areas to make easyer to find/qurrey acc
teacher Acc(s): 
id: school name(seatch so name doesnt exist)
-->
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
  import { onMount } from "svelte";
  import authStore from "../../store/authStore";
  import { getOrginisations } from "../../db";
  import Popup from "../../components/popup.svelte";

  var submiting = false;
  var errorMessage = "";
  var name = "";
  var location = "N_CA";
  var sucessMessage = "";

  let buttonColor;
  let popTitle;
  let popSubT;
  let isGood;
  let showPopup;

  function hexCode() {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 16).toString(16);
    }
    return code;
  }

  async function checkHex() {
    var db = firebase.firestore();
    let data = await db.collection("organization").get();
    var generatedOrgCode = hexCode();

    for (let x = 0; x < data.docs.length; x++) {
      if (data.docs[x].data().orgCode === generatedOrgCode) {
        generatedOrgCode = hexCode();
        x = -1;
      }
    }
    return generatedOrgCode;
  }

  async function submit() {
    submiting = true;

    try {
      var db = firebase.firestore();
      let verifiedOrgCode = await checkHex();
      var semiProssedName = name.split(" ");
      var prossedName = semiProssedName.map(
        (element) => element[0].toUpperCase() + element.substr(1)
      );
      name = prossedName.join(" ");

      //doing --> check if name is already in use
      let orgs = await getOrginisations(true);
      if (orgs.includes(name)) {
        openPopup({
          buttonColor: "danger",
          popTitle: "Error",
          popSubT:
            "There is already an organization with that name. Please try again with a diffrent name.",
          isGood: false,
          showPopup: true,
        });
        submiting = false;
        sucessMessage = "";
        return;
      }

      await db.collection("organization").doc(name).set({
        name: name,
        location: location,
        userId: $authStore.userId,
        orgCode: verifiedOrgCode,
      });
      submiting = false;
      sucessMessage = "Organization added";

      openPopup({
        buttonColor: "success",
        popTitle: "Sucess!",
        popSubT: "Organization Sucessfully Added",
        isGood: true,
        showPopup: true,
      });
    } catch (error) {
      console.error(error);
      sucessMessage = "";

      openPopup({
        buttonColor: "danger",
        popTitle: "Error",
        popSubT:
          "We ran into a problem adding the organization, please try again",
        isGood: false,
        showPopup: true,
      });

      submiting = false;
    }
  }

  function openPopup(props) {
    let popup = null;

    let { buttonColor, popTitle, popSubT, isGood, showPopup } = props;

    popup = new Popup({
      target: document.body,
    });

    popup.input = {
      showPopup: showPopup,
      title: popTitle,
      subTitle: popSubT,
      isGood: isGood,
      shouldOpenPopup: showPopup,
    };

    popup = undefined;
  }
</script>

<h2>Add School</h2>
<Row>
  <Col>
    <FormGroup>
      <Label for="email">Name Of School</Label>
      <Input
        type="text"
        name="email"
        id="name"
        bind:value={name}
        placeholder="School Name"
      />
    </FormGroup>
  </Col>
</Row>
<Row>
  <Col>
    <FormGroup>
      <Label for="exampleSelect">General location</Label>
      <Input
        type="select"
        name="select"
        id="locationSelect"
        bind:value={location}
      >
        <option value="N_CA">North Califonia</option>
        <option value="S_CA">South Califonia</option>
        <option value="OG">Oregon</option>
        <option value="NV">Nevada</option>
      </Input>
    </FormGroup>
  </Col>
</Row>
<Row>
  <Col>
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
    {/if}
  </Col>
</Row>
