<script>
  import {
    getCoderBucksObject,
    addStudentToTeacher,
    getTecherEmailsFromStudent,
    getTeacherProductsWithEmail,
  } from "../db";
  import authStore from "../store/authStore";
  import { onMount } from "svelte";
  import { Button } from "sveltestrap/src";
  import { goto } from "@sapper/app";
  import Box from "../components/box.svelte";
  import { Row, Alert, FormGroup, Input, Label, Col } from "sveltestrap/src";
  import Popup from "../components/popup.svelte";
  import Card from "../components/product.svelte";

  let total = 0;
  let mail_to_value = [];
  let classNameInput = "";
  let buttonColor = "secondary";

  let showPopup = false;
  let popTitle = "";
  let popSubT = "";
  let isGood;

  let teacherProductSuperlist = [];
  let openStore = false;

  // TODO: get isStudent from firebase (also not working)
  onMount(async () => {
    let SSdata = JSON.parse(sessionStorage.getItem("authStore"));
    let db = firebase.firestore();
    if (SSdata) {
      authStore.set(SSdata);
    }
    var cbObj = await getCoderBucksObject($authStore.studentPath);

    console.log($authStore.isStudent);

    if (!$authStore.isStudent && !cbObj) {
      alert("You are not a student");
      await goto("/");
    }

    // end of checking student

    console.log(cbObj);
    let temp = {};

    for (let key in cbObj) {
      // console.log(`${key} = ${cbObj[key].coderBucksValue}`);
      temp[key] = cbObj[key].coderBucksValue;
      mail_to_value.push(temp);
      total += cbObj[key].coderBucksValue;
      temp = {};
    }

    console.log(mail_to_value, total);
  });

  async function onNameSubmit() {
    let suceeded = await addStudentToTeacher(
      classNameInput,
      $authStore.studentPath
    );

    // todo: clear input opon sucess + others.

    if (suceeded[0]) {
      displayPopup("success", "Sucess!", "Class Sucessfully Added", true);
    } else {
      displayPopup(
        "danger",
        "Problem Adding to Class",
        "Class could not be added for the following reason: " +
          suceeded[1] +
          ".",
        false
      );
    }
  }

  function displayPopup(color, title, subTitle, good) {
    let popup = null;

    buttonColor = color;
    popTitle = title;
    popSubT = subTitle;
    isGood = good;
    showPopup = true;

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

  let show = false;
  function hoverChange(inbound) {
    show = !inbound;

    let elements = document.getElementsByClassName("card-c");
    let card = document.getElementById("teacher-store").style;

    elements = Array.from(elements);
    elements.forEach((element) => {
      if (show) {
        element.style.opacity = "100";
        element.style.zIndex = "0";
      } else {
        element.style.opacity = "0";
        element.style.zIndex = "-10";
      }
    });

    if (show) {
      card.transform = "scale(-1000px)";
      card.zIndex = "0";
      card.position = "relative";
    } else {
      card.position = "relative";
      card.transform = "scale(100vw)";
      card.zIndex = "2";
      card.position = "absolute";
    }

    card.opacity = "100";
  }

  onMount(async () => {
    teacherProductSuperlist = [];

    let teacherEmails = await getTecherEmailsFromStudent(
      $authStore.studentPath
    );
    await teacherEmails.forEach(async (email) => {
      let orgName = $authStore.studentPath.split("/")[1];
      if (!$authStore.studentPath.split("/")[0].match("organization")) {
        orgName = $authStore.studentPath.split("/")[2];
      }
      let awaitBuffer = await getTeacherProductsWithEmail(email, orgName);
      console.log(awaitBuffer);
      if (awaitBuffer instanceof Error) {
        displayPopup(
          "danger",
          awaitBuffer,
          "Problem feching student products",
          false
        );
        throw new Error(awaitBuffer);
        console.log("gone");
      }
      teacherProductSuperlist = teacherProductSuperlist.concat(awaitBuffer);
      awaitBuffer = null;
    });

    document
      .getElementById("teacher-store")
      .addEventListener("mouseover", async (event) => {
        openStore = true;
      });
    document
      .getElementById("teacher-store")
      .addEventListener("mouseleave", async (event) => {
        openStore = false;
      });
  });
</script>

<!-- things we want:
  
 -> Total coder bucks (in big)
 -> teacher spend store (links maby)
 -> Open assignments tab (stuff that the teacher is offering to pay for in coderbucks)

-->

<!-- Things to fix:
  When the popup is open on a monitor then the webpage has extra height, allowing scrolling
-->

<!-- next thing to do is add the teacher store (remindzer: we already have a product.svelte file that will lay out the store for us) -->

<h1 style="text-align: center; padding: 0.5rem">Student Homepage</h1>
<div class="photo-container">
  <section class="photo-grid">
    <div
      class="card-c card-cb"
      style="background-image: url('https://www.investopedia.com/thmb/lqOcGlE7PI6vLMzhn5EDdO0HvYk=/1337x1003/smart/filters:no_upscale()/GettyImages-1054017850-7ef42af7b8044d7a86cfb2bff8641e1d.jpg');"
    >
      <p>
        Your total Coder Bucks: {total}
      </p>
    </div>
    <div
      class="card-store card-tall card-wide card-c"
      id="teacher-store"
      style="background-image: url('https://media.wired.com/photos/5c9040ee4950d24718d6da99/1:1/w_1800,h_1800,c_limit/shoppingcart-1066110386.jpg');"
      on:pointerover={() => {
        hoverChange(true);
      }}
      on:mouseleave={() => hoverChange(false)}
    >
      {#if !openStore}
        Teacher Store
      {/if}
      {#if openStore}
        Store:
        <hr />
        <!-- was working here -->
        <div style="font-size: 20px; overflow:none;" class="flex-row">
          {#each teacherProductSuperlist as productList}
            <Col md="4">
              <Card product={productList} />
            </Col>
          {/each}
        </div>
      {/if}
    </div>
    <div
      class="card-c card-tall card-wide"
      style="background-image: url('https://media.wired.com/photos/5ae0d5ae3f3b183561144216/16:9/w_2005,h_1128,c_limit/google-tasks.jpg'); color: black;"
    >
      Open tasks
    </div>
    <div
      class="card-c card-nohover teacher-student-add classNameIn_Div"
      style="color: black;"
    >
      <FormGroup class="classnameInput">
        <Label for="className">Add to other class</Label>
        <Input
          type="email"
          name="className"
          id="className"
          placeholder="Teacher Email"
          bind:value={classNameInput}
        />
        <Button
          class="classnameInput"
          on:click={onNameSubmit}
          color={buttonColor}
        >
          Submit
        </Button>
      </FormGroup>
    </div>
  </section>
</div>

<style>
  .photo-container {
    position: absolute;
    left: 0;
    margin: 0;
    padding: 0;
  }

  .card-c,
  .card-nohover,
  .card-store {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #353535;
    font-size: 3rem;
    color: #fff;
    box-shadow: rgba(3, 8, 20, 0.1) 0px 0.15rem 0.5rem,
      rgba(2, 8, 20, 0.1) 0px 0.075rem 0.175rem;
    height: 100%;
    width: 100%;
    border-radius: 4px;
    /* transition: all 500ms; */
    overflow: hidden;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .card-store {
    overflow: hidden;
  }

  .card-nohover {
    align-items: baseline !important;
    font-size: large;
    color: white;
  }

  .card-c:hover {
    box-shadow: rgba(2, 8, 20, 0.1) 0px 0.35em 1.175em,
      rgba(2, 8, 20, 0.08) 0px 0.175em 0.5em;
    transform: translateY(-3px) scale(1.01);
  }

  .photo-grid {
    margin: 0;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto, minmax(240px, 1fr));
    grid-template-rows: repeat(auto, minmax(240px, 77%));
    transform: translateX(6vw);
    /* ^^ this was making the width scale incorretly ar -600px */
    grid-auto-rows: 10px;
    grid-auto-columns: 10vh;
  }

  .teacher-student-add {
    grid-column: span 4 / auto;
    background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NBw0HDQ0HBwcHBw0HBwcHBw8IDQcNIBEWFhURExMYHSggGBolGxUTITEhJSk3Li4uFx8zOD84NygtLisBCgoKDQ0NDw0NDysZFRkrLSstKy0rNzcrKysrKysrKysrKzc3NysrLSsrKy0rKysrKysrLSsrKysrKystLS0rN//AABEIAI4BYwMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAAAQIDBgT/xAAYEAEBAQEBAAAAAAAAAAAAAAAAARECEv/EABsBAAMBAQEBAQAAAAAAAAAAAAABAgMEBgUH/8QAGhEBAQEBAQEBAAAAAAAAAAAAAAECERIDE//aAAwDAQACEQMRAD8ArDxeDH2uvT+k4MX5PyXS9Iw/K8PC6n0jyflfk5ynpemfk/LTyryXU+mXk/LTyflPS9MvJ+WvkeS6Xpj5Hlt5Hkun6Y+S8tvJeS6c0xvKby3vKbyXVzTGxNja8psLq5plYmxrYmwq0mmNibGtibGdaTTKxFjWxFjHUays7E2NLE2Ma0lZ0rF2JrOrlRSXU1K5U0qqkSokGRKIjIlEDIKIAAwACDpMHlp5Py9H15j0z8n5aeTnJdTdM/Kpy0nJzlPU3bOcnOWs5Oclam7Zzk5y1nJzlN0m7ZeT8tfJ+U9T7ZeR5beR5Lo9sfI8tvJeS6PbHym8t7yXkuqm2F5TeW95TeR1c2wvKLy9F5ReT60mmFiLG9iLCazTCxNjaxFia1mmNiLG1iLGeo1zpjYixrYixhqNpWdia0sTYzrSVFTV1KFyppKqSXKRGRLlIjIjlIGQV0gZEZAAG63yc5aeT8vv+nkLtnOVTlflWJ6m7ZzlU5Xh4nqbtE5VOVYeF1N0mcn5Vh4nqfSfIxeDC6n0nBisGF0ekYMXgwh6Z4LF4WBU0zsTY1sTYOrmmN5ReW9ibB1pNPPeWdj0dcs+ofW2dMLGdjfqM+oG2dMbEWNrGdia3zplYzsbWM7GOo2zWVTWliKxsayoqaupqK0lTU1dSlcqSUmkuUiMiVKQMgoiMEogADdth4eHj7fXifScPFYZdTdJw8My6n0WHhhKfQwYYIvQwAyT6IGAPREYIeiLFFQqaTibFlSVNIsRY0qabSaZWM+o2qOobbOmHUZ9Rv1GXUNvnTHqM+o26jPqE3zpl1GfUa9I6jPUb50xsTY0sRWGo3zWdTV1NZ1rKipq6mpXKmkZVLSUiMgqUiMiVKQMiUQABu7wGH2Xg/RGDJPojABegZAk+jABF6MEAn0YIaQ9AFo0cHoAtAOaBAqXFzRUqdTQ0mk1FXU02udM+mXUa9M+jb50y6ZdNemfQdOdM+mfTTpHSbG+dMukVpWdY6jozpFRV1NY2Ns1FTVUqixpKmpVSqWkqaRkS5SABKlIjIKBGCN3YLSfZfnvpQTo0cL0oanRo4m7Vo1OjS4n2vRqNGjibtWjU6Wjifa9Go0vQ4XtejUei9Dg/RejUei9Fw/0XpanS0cXNqtK1OlaONZs7U0WptHGudl0z6VajqjjoztHTLpp0y6PjpxpHSKus6LHTnSOkVdRWWo6M6RUVdRWGo3zU1NOlWVjWVNKnSqa1lJJklcpAAlykRkSpQAAfXcaWp0vT7XH5rfovRrP0PR8RfovRrP0PQ4m/Rp6Hpl6HocRfo09D0y9D0OJv0aeh6Z6XocTfo00emelo4n9Gnoemelo4P0aei9I9F6HD/Rp6L0z9F6Hlc+jX0Xpl6L0PLWfRr6Temd6K9Dy2z9V2otTek3oeXVj6Dqo6pXpFo468bFqLRam0cdWNlainam1Fy6c6TUVVTWGsujOk1NOprCxvnQqadKs7GspUgE8aSkRklcoIAlygEAfXY6XpGlr73H5VdtPRajRo4i7XpajRo4n2vRqNGjifS9LUaNHC9L0ajS0cT6Xo1Glp8HpelqdLRwel6Wo0tHD9L0rU6nRxU0u9FekWptHFzS70m9JvSL0fGudLvSL0m9IvQ8ujG13pF6Z3pN6Py68fRpek3pnek+iuXZj6tLU2o9F6RcuzH0Vam0rStY6y6sbFqaLS1zay6M6BFS1jY3zoyBIsayggE8aSggCXKAAR9dVpanSeg4/I/S9LU6NHC9K0ajRp8Lq9Go0aOJ6rRqNGjhdXpanS0cHV6Wp0tHC6vS1GjRw+q0tTpaOH1Wlam0rT4qVVqbU2ptHFyqtReitRafGmad6R10XVZ9VUy3zTvSL0VqLVcdGdKvSb0m1NpeXTja/Q9MtLU3Lqx9G3otZeh6Y6y7MfRppanS1zby68bVo1OjXNrLqzo9CdGs7G2dGCCLG0oBBPFymC0Err//Z");
  }

  .classNameIn_Div :global(.classnameInput) {
    color: rgb(238, 238, 238);
    text-align: center;
    margin: 3px auto;
    width: 80%;
    font-weight: 600;
  }

  #teacher-store {
    transition: all 1s;
  }

  /* 
  #teacher-store:hover ~ .card-c {
    opacity: 0;
    position: absolute;
  } */

  /* #teacher-store:hover {
    grid-row: span 6 / auto;
    grid-column: span 4 / auto; */
  /* grid-row-start: 4; <-- was attempting to aimate this so that the trasition is less jarring */
  /* } */

  .flex-row {
    display: flex;
    flex-direction: row;
    gap: 1em;
    /* align-items: center; */
    justify-content: space-around;

    /* background-color: red; */

    max-width: max(50%, 1000px);
  }

  .card-wide {
    grid-column: span 4 / auto;
  }

  .card-tall {
    grid-row: span 10 / auto;
  }

  .card-cb {
    grid-column: span 4 / auto;
    grid-row: span 10 / auto;
    color: black;
    font-size: 2rem;
  }

  .teacher-student-add {
    grid-column: span 4 / auto;
    grid-row: span 8 / auto;
    background-image: url("data:image/jpeg;base64,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");
  }

  /* Medium screens */
  @media screen and (min-width: 600px) {
    .card-tall {
      grid-row: span 2 / auto;
    }

    .card-wide {
      grid-column: span 2 / auto;
    }

    .photo-grid {
      margin: 0;
      display: grid;
      gap: 1rem;
      transform: translateX(12.5%);
      grid-template-columns: repeat(auto, minmax(240px, 1fr));
      grid-auto-rows: 140px;
      grid-auto-columns: 19vw;
    }

    .card-cb {
      grid-column: span 4 / auto;
      grid-row: span 3 / auto;
      color: black;
    }

    .teacher-student-add {
      grid-column: span 4 / auto;
      grid-row: span 1 / auto;
      background-image: url("data:image/jpeg;base64,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");
    }
  }
</style>
