<button on:click={loginWithGoogle}> Login With Google </button>

<script>
    function loginWithGoogle () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
         var credential = result.credential;
         var token = credential.accessToken;
          var user = result.user;
          console.log(user)
        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
         });
    }
</script>