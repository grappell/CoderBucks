<script>
  import Acc from "../components/acc.svelte";
  import { goto, prefetch } from "@sapper/app";
  import authStore from "../store/authStore";
  import { storageAvailable } from "../helper";

  var errorMessage = "";
  var sucessMessage = "";
  async function loginWithEmail(event) {
    var email = event.detail.email;
    var password = event.detail.password;
    try {
      var user = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      var db = firebase.firestore();
      await db
        .collection(`/organization/EB/students`)
        .where("userId", "==", user.user.uid)
        .get()
        .then((data) => {
          console.log("found your account :)", data.docs[0].data().userId);

          let fakeAuthStore = {
            userId: undefined,
            fierbaseOn: false,
            isLogedIn: false,
            isStudent: false,
            studentPath: undefined,
          };

          fakeAuthStore = {
            ...fakeAuthStore,
            userId: data.docs[0].data().userId,
            fierbaseOn: true,
            isLogedIn: true,
          };
          // session storage for authStore
          if (storageAvailable("sessionStorage")) {
            let jsoned = JSON.stringify(fakeAuthStore);
            sessionStorage.setItem("authStore", jsoned);
          } else {
            alert("No session sorage avalable");
          }

          if (data.docs[0].data().coderBucksObject) {
            // check if student
            console.log("isStudent");
            let buffer = { ...$authStore };
            buffer.isStudent = true;
            buffer.studentPath = data.docs[0].ref.path; // to populate
            authStore.set(buffer);
            if (storageAvailable("sessionStorage")) {
              fakeAuthStore = {
                ...fakeAuthStore,
                isStudent: true,
                studentPath: data.docs[0].ref.path,
              };
              let jsoned = JSON.stringify(fakeAuthStore);
              sessionStorage.setItem("authStore", jsoned);
            }

            prefetch("./student_homepage").then(async () => {
              await goto("/student_homepage");
            });
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
