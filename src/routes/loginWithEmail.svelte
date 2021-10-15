<script>
    import Acc from "../components/acc.svelte"
    import { goto } from '@sapper/app';

    var errorMessage = ""
    var sucessMessage = ""
    async function loginWithEmail (event) {
        var email = event.detail.email
        var password = event.detail.password
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            errorMessage = ""
            sucessMessage = "Logged In!"
            await goto('/');
        } catch (error) {
            console.log(error)
            errorMessage = "Invalid Email or Password"
            sucessMessage = ""
        }
    }
</script>
<h2>
    Login With Email
</h2>
<Acc type = "login" on:login = {loginWithEmail} bind:errorMessage bind:sucessMessage></Acc>