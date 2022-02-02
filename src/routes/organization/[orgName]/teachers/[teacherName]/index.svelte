<script>
  import { goto, stores } from "@sapper/app";
  import { getTeacherSubCollections } from "../../../../../db";
  import { onMount } from "svelte";
  import {
    Row,
    FormGroup,
    Input,
    Label,
    Col,
    Button,
    ListGroup,
    ListGroupItem,
    Alert,
  } from "sveltestrap/src";
  import Product from "../../../../../components/product.svelte";
  const { page } = stores();

  $: capitalTeacherName =
    $page.params.teacherName.charAt(0).toUpperCase() +
    $page.params.teacherName.substring(1);

  var studentList = [];
  var productSuperList = [];
  let studentInput = {};
  let dbPath;
  let studentPath, teacherPath;
  let errorMessage = "";
  let sucessMessage = "";
  let tmail;
  onMount(async () => {
    var db = firebase.firestore();

    teacherPath =
      "organization/" +
      $page.params.orgName +
      "/teachers/" +
      $page.params.teacherName;
    studentPath = "organization/" + $page.params.orgName + "/students";

    let teacherRef = await db.doc(teacherPath).get();
    let teacherData = teacherRef.data();
    tmail = teacherData.email;
    if (teacherData.studentsRef) {
      teacherData.studentsRef.forEach(async (element) => {
        let studentData = await element.get();
        studentList.push(studentData.data());
      });
    } else {
      alert("No students :(");
    }
    productSuperList = chunk(
      3,
      await getTeacherSubCollections(
        $page.params.orgName,
        $page.params.teacherName,
        "products"
      )
    );

    for (let i = 0; i < studentList.length; i++) {
      console.log(studentList, studentList[i]);
      studentInput[studentList[i].name] = "";
    }
  });

  function chunk(chunkSize, list) {
    var R = [];
    for (var i = 0; i < list.length; i += chunkSize)
      R.push(list.slice(i, i + chunkSize));
    return R;
  }

  async function submit(student) {
    var db = firebase.firestore();
    dbPath = student.coderBucksObject[tmail].path;
    let currentCBValue = student.coderBucksObject[tmail].coderBucksValue;
    let newCBObject = { ...student.coderBucksObject };
    newCBObject[tmail].coderBucksValue =
      currentCBValue + parseInt(studentInput[student.name]);
    await db
      .doc(dbPath)
      .update({
        coderBucksObject: newCBObject,
      })
      .then(() => {
        studentList[student.name] = "";
        sucessMessage = "Sucessfully added coderbucks";
        errorMessage = "";
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
        errorMessage = "Error adding coderbucks";
        sucessMessage = "";
      });
  }
</script>

<h2>{capitalTeacherName}'s Homepage</h2>
<br />

<ListGroup>
  <h4>Students:</h4>
  {#each studentList as student}
    <h5>{student.name}</h5>
    <ListGroupItem tag="button"
      >{student.name +
        " - CoderBucks In account: " +
        student.coderBucksObject[tmail].coderBucksValue}</ListGroupItem
    >
    <FormGroup>
      <Input
        type="number"
        name="cbNumInput"
        id="cbNumInputId"
        placeholder="CoderBucks To assign"
        bind:value={studentInput[student.name]}
      />
    </FormGroup>
    <Button
      id="submitButton"
      outline
      color="success"
      class="float-right"
      on:click={submit(student)}
      size="block">Submit</Button
    >
  {/each}
  {#if errorMessage != ""}
    <Alert color="danger" dismissible>{errorMessage}</Alert>
  {/if}
  {#if sucessMessage != ""}
    <br />
    <Alert color="success" dismissible>{sucessMessage}</Alert>
  {/if}
  <br />
  <!-- make the banner on ecach one and somehow make the id original -->
</ListGroup>

<ListGroup>
  <h4>Products:</h4>
</ListGroup>

{#each productSuperList as productList}
  <Row>
    {#each productList as product}
      <Col md="4">
        <Product {product} />
      </Col>
    {/each}
  </Row>
{/each}
