<script>
  import { goto, stores } from "@sapper/app";
  import { getOrgCode, getTeachers } from "../../../db";
  import { onMount } from "svelte";
  import { ListGroup, ListGroupItem } from "sveltestrap/src";
  const { page } = stores();

  var teacherList = [];
  var orgCode;
  var prossedOrgName;
  onMount(async () => {
    teacherList = await getTeachers($page.params.orgName);

    var orgNameList = $page.params.orgName.split("-");
    prossedOrgName = orgNameList.map(
      (element) => element[0].toUpperCase() + element.substr(1)
    );
    prossedOrgName = prossedOrgName.join(" ");
    console.log("here");
    orgCode = await getOrgCode(prossedOrgName);
    console.log(orgCode); //wifi problems (wifi stopprd working, completally bricked)
  });
</script>

<h2>
  Welcome to the {prossedOrgName} Home Page

  <p>Org Code: {orgCode}</p>
</h2>

<p>Here is the list of the current teachers:</p>

<ListGroup>
  {#each teacherList as teacher}
    <h3>{teacher.name}</h3>
    <ListGroupItem
      tag="button"
      href={`/organization/${$page.params.orgName}/teachers/${teacher.id}/addProduct`}
      action
    >
      Add product to {teacher.name}</ListGroupItem
    >
    <ListGroupItem
      tag="button"
      href={`/organization/${$page.params.orgName}/teachers/${teacher.id}`}
      action
    >
      Go to {teacher.name}'s Homepage</ListGroupItem
    >
    <br />
  {/each}
</ListGroup>

<br />

<a href={`organization/${$page.params.orgName}/addTeacher`}>
  Add annother teacher
</a>
