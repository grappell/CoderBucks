<script>
  import Nav from "../components/Nav.svelte";
  import { onMount } from "svelte";
  import authStore from "../store/authStore";
  import { Container } from "sveltestrap/src";

  export let segment;

  onMount(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        authStore.update((previous) => {
          return {
            ...previous,
            userId: uid,
            fierbaseOn: true,
            isLogedIn: true,
          };
        });
      } else {
        authStore.set({
          userId: undefined,
          fierbaseOn: true,
          isLogedIn: false,
          isStudent: false,
          studentPath: undefined,
        });
      }
    });

    if ($authStore.uid == undefined) {
      let sessionStorageIn = sessionStorage.getItem("authStore");
      if (sessionStorageIn) {
        authStore.set(JSON.parse(sessionStorageIn));
      }
    }

    let db = firebase.firestore();
  });
</script>

<Nav {segment} />

<Container style="margin-top: 50px">
  <slot />
</Container>

<style>
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 1px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: darkgray;
    border-radius: 3px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: gray;
  }
</style>
