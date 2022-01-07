<script>
  import Acc from "../components/acc.svelte";
  import { goto } from "@sapper/app";
  import authStore from "../store/authStore";
  import { slugify } from "../helper";

  var errorMessage = "";
  var sucessMessage = "";
  async function loginWithEmail(event) {
    var email = event.detail.email;
    var password = event.detail.password;
    var orgCode = event.detail.orgCode;
    var tMail = event.detail.tMail;
    var name = event.detail.name;
    var studentOrgCode = event.detail.studentOrgCode;
    try {
      var db = firebase.firestore();
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      if (orgCode != undefined) {
        console.log(orgCode);
        let targetOrgName = "";
        await db
          .collection("organization")
          .where("orgCode", "==", orgCode)
          .get()
          .then((data) => {
            console.log(data);
            data.forEach((element) => {
              targetOrgName = element.data().name;
            });
          });
        let docName = name.split(" ").join("-");
        console.log(email);
        await db
          .collection("organization")
          .doc(targetOrgName)
          .collection("teachers")
          .doc(docName)
          .set({
            name: name,
            email: email,
            orgCode: orgCode,
            userId: $authStore.userId,
          });
        setTimeout(async () => {
          await goto(
            `/organization/${targetOrgName}/teachers/${docName}/finish_teacher_account`
          );
        }, 1000);
      } else {
        let targetOrgName = "";
        let targetTeachName = "";

        // await db
        //   .collection("organization")
        //   .get()
        //   .then((data) => {
        //     data.forEach(async (element) => {
        //       targetOrgName = element.data().name;
        //       console.log("orginisation/" + targetOrgName + "/teachers", tMail);
        //       await db
        //         .collection("organization")
        //         .doc(targetOrgName)
        //         .collection("teachers")
        //         .where("email", "==", tMail)
        //         .get()
        //         .then((data2) => {
        //           console.log(data2);
        //           data2.forEach(async (element2) => {
        //             targetTeachName = element2.data().name;
        //             let indexTargetTName = targetTeachName.split(" ").join("-");
        //             console.log(
        //               targetTeachName,
        //               typeof targetTeachName,
        //               indexTargetTName
        //             );
        //             await db
        //               .collection(
        //                 `/organization/${targetOrgName}/teachers/${indexTargetTName}/students/`
        //               )
        //               .doc(slugify(name))
        //               .set({
        //                 name: name,
        //                 email: email,
        //                 coderBucksObject: {
        //                   [tMail]: {
        //                     coderBucksValue: 0,
        //                     path: `/organization/${targetOrgName}/teachers/${indexTargetTName}/students/${slugify(
        //                       name
        //                     )}`,
        //                   },
        //                 },
        //                 orgName: targetOrgName,
        //                 userId: $authStore.userId,
        //               });
        //             $authStore.studentPath = `/organization/${targetOrgName}/teachers/${indexTargetTName}/students/${slugify(
        //               name
        //             )}`;
        //             await goto("/student_homepage");
        //           });
        //         });
        //     });
        //   });

        console.log(tMail);
        const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
        await db
          .collection("organization")
          .where("orgCode", "==", studentOrgCode)
          .get()
          .then(async (data) => {
            let targetOrgName = data.docs[0].id;
            await db
              .collection(`/organization/${targetOrgName}/students/`)
              .doc(slugify(name))
              .set({
                name: name,
                email: email,
                coderBucksObject: {
                  [tMail]: {
                    coderBucksValue: 0,
                    path: `/organization/${targetOrgName}/students/${slugify(
                      name
                    )}`,
                  },
                },
                orgName: targetOrgName,
                userId: $authStore.userId,
              });
            $authStore.studentPath = `/organization/${targetOrgName}/students/${slugify(
              name
            )}`;
            // end of setting student
            // now setting teacher-student ref
            let buffer = data.docs[0].ref.collection("teachers");
            buffer
              .where("email", "==", tMail)
              .get()
              .then(async (data2) => {
                let targetTeacher = data2.docs[0].ref;
                let studentRef = db.doc(
                  `/organization/${targetOrgName}/students/${slugify(name)}`
                );
                targetTeacher.update({ studentsRef: arrayUnion(studentRef) });
              });
          });
        //end of .then
      }
      await goto("/student_homepage");
      errorMessage = "";
      sucessMessage = "Success! Redirecting...";
    } catch (error) {
      console.error(error);
      errorMessage = "Invalid Email or Password";
      sucessMessage = "";
    }
  }
</script>

<h2>Make a new account</h2>
<br />
<Acc
  type="login"
  on:login={loginWithEmail}
  bind:errorMessage
  bind:sucessMessage
/>
