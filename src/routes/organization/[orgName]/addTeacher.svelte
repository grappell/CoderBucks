<!-- teacher req

    email, password, 
    picture
    name
    class (name)
    bio

-->

<script>
    import {Row, Alert, FormGroup, Input, Label, Col, Button } from 'sveltestrap/src';
    import authStore from "../../../store/authStore"
    import { goto, stores } from '@sapper/app';
    import { slugify } from "../../../helper"
	const { page } = stores();

    authStore.subscribe(async(info) => {
        if (info.fierbaseOn === false) {
            return;
        } else if (info.isLogedIn === false) {
            alert("You Need To Be logged In to Access This Page, you will be rederected")
            await goto('/loginWithEmail');
        }
    })

    var picture, name, email, className, userId, bio;
    var errorMessage = "";
    var sucessMessage = "";
    var submiting = false;
    async function submit () {
        try {
            submiting = true;
            var db = firebase.firestore()
            console.log(name)
            if (name && email && className && userId) {
                var slugName = slugify(name) 
                await db.collection(`organization/${$page.params.orgName}/teachers`).doc(slugName).set({name, email, className, userId, bio})
                var add = await db.collection("organization").doc($page.params.orgName).collection("teachers").doc(slugName).get()
                if (picture[0].type === "image/png" || picture[0].type === "image/jpeg") {
                    var pic = picture[0]
                    const mainPicturePath = `/${$page.params.orgName}/teachers/${userId}.${pic.name.split(".").pop()}`;
                    const storage = firebase.storage();
                    const ref = storage.ref(mainPicturePath);
                    await ref.put(pic);
                    await db.collection("organization").doc($page.params.orgName).collection("teachers").doc(slugName).update({userImgUrl: await ref.getDownloadURL()})
                    sucessMessage = "Teacher Added"
                    submiting = false
                    name = "";
                    email = "";
                    className = "";
                    userId = "";
                    return mainPicturePath;
                }
            } else {
                errorMessage = "You are missing one or both fields"
                if (password.length > 5) {
                    errorMessage = "Your Password must be at least 6 characters"
                }
                submiting = false
            }
        } catch (error) {
            console.error(error, errorMessage)
            submiting = false
        }
        
    }
</script>

<h2>
    Add Teacher to {$page.params.orgName}
</h2>

<FormGroup>
    <Label for="Name">Name</Label>
    <Input
      type="text"
      name="Name"
      id="name"
      bind:value = {name} />
</FormGroup>
<FormGroup>
    <Label for="email">Email</Label>
    <Input
        type="email"
        name="email"
        id="email"
        placeholder="example@example.com"
        bind:value = {email} />
</FormGroup>
<FormGroup>
    <Label for="displayFile">Picture</Label>
    <Input type="file" name="file" id="displayFile" bind:files = {picture}/>
</FormGroup>
<FormGroup>
    <Label for="className">Class Name</Label>
    <Input
        type="text"
        name="className"
        id="className"
        bind:value = {className} />
</FormGroup>
<FormGroup>
    <Label for="bio">A bio of yourself</Label>
    <Input type="textarea" name="bio" id="bioInput" bind:value = {bio} />
</FormGroup>
<FormGroup>
    <Label for="bio">User Id</Label>
    <Input type="text" name="userIdInput" id="userIdInput" bind:value = {userId} />
</FormGroup>
<Button id = "submitButton" outline color= "success" class = "float-right" on:click = {submit} size = "block" bind:disabled={submiting}>Submit</Button>
<br/>
<br/>
{#if errorMessage!= ""} 
    <Alert color = "danger" dismissible>{errorMessage}</Alert>
{/if}
{#if sucessMessage!= ""} 
    <Alert color = "success" dismissible>{sucessMessage}</Alert>
{/if}