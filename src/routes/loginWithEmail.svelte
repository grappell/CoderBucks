<script>
  import Acc from "../components/acc.svelte";
  import { goto, prefetch } from "@sapper/app";
  import authStore from "../store/authStore";
  import { storageAvailable } from "../helper";
  import { getOrginisations } from "../db";

  var errorMessage = "";
  var sucessMessage = "";
  async function loginWithEmail(event) {
    var email = event.detail.email;
    var password = event.detail.password;

    // TODO: Refactor data orginization to better follow MLM dubble lookup table

    try {
      let user;

      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(async () => {
          user = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
        })
        .catch((e) => {
          throw new Error(e);
        });

      console.log(user);

      var db = firebase.firestore();
      let allOrgNames = await getOrginisations(true);

      allOrgNames.forEach(async (name) => {
        try {
          await db
            .collection(`/organization/${name}/students`)
            .where("userId", "==", user.user.uid)
            .get()
            .then((data) => {
              if (!data.exists) {
                throw new Error("This user is not a student");
              }

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
            })
            .catch(async (e) => {
              errorMessage = "Loading...";
              console.error(e);

              // console.log(user.user.uid);

              await db
                .collection(`/organization/${name}/teachers`)
                .where("userId", "==", "Mq4JxJf5NRdx2XNxpeoOQ4IZGM43")
                .get()
                .then((data) => {
                  console.log(data);

                  if (!data.exists) throw new Error("This user does not exist");

                  console.log(data);
                });
            });

          errorMessage = "";
          sucessMessage = "Logged In!";
          await goto("/");
        } catch (e) {
          console.error(e);
          // the only error we should recieving is the one saying that "data is undefined".
          //However if there is a ghost error, consider adding a console.error here :)
        }
      });
    } catch (error) {
      console.error(error);
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
