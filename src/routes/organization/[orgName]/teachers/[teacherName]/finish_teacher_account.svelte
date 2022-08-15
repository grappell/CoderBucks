<script>
    import {Row, Alert, FormGroup, Input, Label, Col, Button } from 'sveltestrap/src';
    import { goto, stores } from '@sapper/app';
    import authStore from "../../../../../store/authStore"
    const { page } = stores();

    let bio;
    let className;
    let teacherName = $page.params.teacherName
    let picture;
    let submiting = false;
    let errorMessage = "";
    let sucessMessage = "";
    async function submit () {
        let userId = $authStore.userId;
        console.log(userId)
        try {
            submiting = true;
            var db = firebase.firestore()
            if (className && userId && picture) {
                await db.collection(`organization/${$page.params.orgName}/teachers`).doc(teacherName).update({className, bio})
                var add = await db.collection("organization").doc($page.params.orgName).collection("teachers").doc(teacherName).get()
                if (picture && (picture[0].type === "image/png" || picture[0].type === "image/jpeg")) {
                    var pic = picture[0]
                    const mainPicturePath = `/${$page.params.orgName}/teachers/${userId}.${pic.name.split(".").pop()}`;
                    const storage = firebase.storage();
                    const ref = storage.ref(mainPicturePath);
                    await ref.put(pic);
                    await db.collection("organization").doc($page.params.orgName).collection("teachers").doc(teacherName).update({userImgUrl: await ref.getDownloadURL()})
                    sucessMessage = "Teacher Added"
                    submiting = false
                    className = "";
                    userId = "";
                    return mainPicturePath;
                }
            } else {
                errorMessage = "You are missing one or more fields"
                if(!picture){
                    errorMessage = "Missing profile image"
                }
                submiting = false
            }
        } catch (error) {
            console.error(error, errorMessage)
            submiting = false
        }
    }
</script>
<div>
    <h2>
        Finish adding a teacher to {$page.params.orgName}
    </h2>
    <br>
    <br>
    <Row>
        <Col>
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
            <Button id = "submitButton" outline color= "success" class = "float-right" on:click = {submit} size = "block" bind:disabled={submiting}>Submit</Button>
            <br/>
            <br/>
            {#if errorMessage!= ""} 
                <Alert color = "danger" dismissible>{errorMessage}</Alert>
            {/if}
            {#if sucessMessage!= ""} 
                <Alert color = "success" dismissible>{sucessMessage}</Alert>
            {/if}
        </Col>
    </Row>    
</div>