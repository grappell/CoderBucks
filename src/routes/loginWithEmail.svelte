<script>
  import Acc from "../components/acc.svelte";
  import { goto } from "@sapper/app";

  var errorMessage = "";
  var sucessMessage = "";
  async function loginWithEmail(event) {
    var email = event.detail.email;
    var password = event.detail.password;
    try {
      var user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log(user.user.uid);
      var db = firebase.firestore();
      await db
        .collection(`/organization/EB/students`)
        .where("userId", "==", user.user.uid)
        .get()
        .then((data) => {
          console.log("found you", data.docs[0].data().userId);
          if (data.coderBucksObject) {
            console.log("isStudent");
          } else {
            console.log("is not student");
          }
        });

      errorMessage = "";
      sucessMessage = "Logged In!";
      await goto("/");
    } catch (error) {
      console.log(error);
      errorMessage = "Invalid Email or Password";
      sucessMessage = "";
    }
  }
</script>

<h2>Login With Email</h2>
<Acc
  type="login"
  on:login={loginWithEmail}
  bind:errorMessage
  bind:sucessMessage
/>
