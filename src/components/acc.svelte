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
  import { createEventDispatcher } from "svelte";

  var email;
  var password;
  export var errorMessage = "";
  export var sucessMessage = "";
  var user;
  var orgCode;
  var visiblity = false;
  export var type = "login";
  var submitName;
  let tMail;
  let studentOrgCode;

  let currentURL;

  const dispatch = createEventDispatcher();
  function loginWithEmail() {
    if (!tMail) {
      dispatch(type, {
        name: submitName,
        email: email,
        password: password,
        orgCode: orgCode,
      });
    } else {
      dispatch(type, {
        name: submitName,
        email: email,
        password: password,
        tMail: tMail,
        studentOrgCode: studentOrgCode,
      });
    }
  }

  onMount(() => {
    user = firebase.auth().currentUser;
    if (user != null) {
      email = user.email;
      sucessMessage = "Already Logged In!";
    }

    currentURL = window.location.pathname;

    if (currentURL === "/create_account") {
      let collection = document.getElementsByClassName("makeAcc");
      for (let i = 0; i < collection.length; i++) {
        collection[i].style = "display: block;";
      }
    }
  });
  //do something with the email

  function showTeacher() {
    let Oform = document.getElementById("teacherForm");
    let Tform = document.getElementById("studentForm");
    let button = document.getElementById("accTypeButton");
    let o0form = document.getElementById("studentOrgCode");
    if (visiblity) {
      Oform.style.display = "none";
      Tform.style.display = "block";
      o0form.style.display = "block";
      visiblity = false;
      button.innerText = "Make a teacher account";
    } else {
      Oform.style.display = "block";
      Tform.style.display = "none";
      o0form.style.display = "none";
      visiblity = true;
      button.innerText = "Make a student account";
    }
  }
</script>

<div class="makeAcc" style="display: none;">
  <Row>
    <Col>
      <FormGroup>
        <Label>Name</Label>
        <Input
          type="text"
          name="name"
          id="nameForm"
          placeholder="Name"
          bind:value={submitName}
        />
      </FormGroup>
    </Col>
  </Row>
</div>
<Row>
  <Col>
    <FormGroup>
      <Label for="email">Email</Label>
      <Input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        bind:value={email}
      />
    </FormGroup>
  </Col>
</Row>
<Row>
  <Col>
    <FormGroup>
      <Label for="password" id="passwordLabel">Password</Label>
      <Input
        type="password"
        name="password"
        id="password"
        placeholder={user != null ? "Hidden" : "Password"}
        bind:value={password}
        disabled={user != null}
      />
    </FormGroup>
  </Col>
</Row>

<div class="makeAcc" style="display: none;">
  <Row>
    <Col>
      <FormGroup id="teacherForm" style="display: none">
        <Label for="teacherCode" id="orgCode">Organization Code</Label>
        <Input
          type="text"
          id="teacherCodeText"
          placeholder="Organization Code"
          bind:value={orgCode}
        />
      </FormGroup>
    </Col>
  </Row>
  <Row>
    <Col>
      <FormGroup id="studentForm">
        <Label for="studentTeacherCode" id="tMail">Teacher's Email</Label>
        <Input
          type="text"
          id="studentCodeText"
          placeholder="Teacher Eamil"
          bind:value={tMail}
        />
      </FormGroup>
    </Col>
  </Row>
  <Row>
    <Col>
      <FormGroup id="studentOrgCode">
        <Label for="studentOrgCode" id="studentOrgCode">Organization Code</Label
        >
        <Input
          type="text"
          id="studentCodeText"
          placeholder="Organization Code"
          bind:value={studentOrgCode}
        />
      </FormGroup>
    </Col>
  </Row>
  <Row />
  <Row>
    <Col style="text-align: center">
      <Button on:click={showTeacher} block id="accTypeButton">
        Make a teacher account
      </Button>
    </Col>
  </Row>
</div>
<br />
<Col>
  <div>
    {#if errorMessage != ""}
      <Alert color="danger" dismissible>{errorMessage}</Alert>
    {/if}

    {#if sucessMessage != ""}
      <Alert color="success">{sucessMessage}</Alert>
    {/if}

    {#if user == null}
      <Button
        id="submitButton"
        outline
        color="success"
        class="float-right"
        on:click={loginWithEmail}
        size="block">Submit</Button
      >
    {/if}
  </div>
</Col>

<!-- if is always coming up as false -->
