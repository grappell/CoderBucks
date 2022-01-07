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
  onMount(async () => {
    var db = firebase.firestore();

    teacherPath =
      "organization/" +
      $page.params.orgName +
      "/teachers/" +
      $page.params.teacherName;
    studentPath = "organization/" + $page.params.orgName + "/students";

    db.collection(studentPath).onSnapshot(async (querySnapshot) => {
      let teacherRef = await db.doc(teacherPath).get();
      let teacherData = teacherRef.data();
      teacherData.studentsRef.forEach(async (element) => {
        let studentData = await element.get();
        studentList.push(studentData.data());
      });
    });

    productSuperList = chunk(
      3,
      await getTeacherSubCollections(
        $page.params.orgName,
        $page.params.teacherName,
        "products"
      )
    );
    console.log(studentList);

    for (let i = -1; i < studentList.length; i++) {
      console.log("we have gotten here");
      console.log(studentList[0]); // somehow not working
      studentInput[studentList[i + 1].name] = "";
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
    dbPath = student.path;
    let currentCBValue = student.coderBucksValue;
    await db
      .doc(dbPath)
      .update({
        coderBucksValue: currentCBValue + parseInt(studentInput[student.name]),
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
        student.coderBucksValue}</ListGroupItem
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
    {#if errorMessage != ""}
      <Alert color="danger" dismissible>{errorMessage}</Alert>
    {/if}
    {#if sucessMessage != ""}
      <br />
      <Alert color="success" dismissible>{sucessMessage}</Alert>
    {/if}
    <br />
  {/each}
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
