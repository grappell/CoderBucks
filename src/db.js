export async function getOrginisations(shouldReturnNames = false) {
  var db = firebase.firestore();
  var collection = await db.collection("organization").get();
  if (shouldReturnNames){

    return collection.docs.map((data) => {
      return data.data().name;
    });

  } else {

    return collection.docs.map((data) => {
      return data.data()
    });

  }
}

export async function getTeachers(orgName) {
  var db = firebase.firestore();
  var collection = await db
    .collection("organization")
    .doc(orgName)
    .collection("teachers")
    .get();
  return collection.docs.map((data) => {
    return { ...data.data(), id: data.id };
  });
}

// function obsolite
export async function getTeacherSubCollections(
  orgName,
  teacherName,
  subCollection
) {
  var db = firebase.firestore();
  var collection = await db
    .collection("organization")
    .doc(orgName)
    .collection("teachers")
    .doc(teacherName)
    .collection(subCollection)
    .get();
  return collection.docs.map((data) => {
    return { ...data.data(), id: data.id };
  });
}

export async function getOrgCode(orgName) {
  let returnData;
  var db = firebase.firestore();
  await db
    .collection("organization")
    .doc(orgName)
    .get()
    .then((data) => {
      if (data.exists) {
        returnData = data.data().orgCode;
      } else {
        returnData = "Error Getting Data";
      }
    });
  return returnData;
}

// unfinished
export async function getTecherListFromStudent(studentPath){
  let returnData;
  let db = firebase.firestore();
  returnData = await db.doc(studentPath).coderBucksObject
  console.log(returnData);
}


export async function getCoderBucksObject(studentPath) {
  let returData;
  let db = firebase.firestore();
  try{
    await db
      .doc(studentPath)
      .get()
      .then((data) => {
        returData = data.data().coderBucksObject;
      });
    return returData;
  } catch (e) {
    console.error(e) // common error --> student path is undefined (look at the authStore value when you call it) 
    return null;
  }
}


export async function addStudentToTeacher(teacherEmail = "", studentPath) {
  let db = firebase.firestore();

  if(!teacherEmail){
    console.error("No teacher email specified, aborting function")
    return false;
  } 
  
  let cbObj = await db.doc(studentPath).get().then((data) => {return data.data().coderBucksObject})
  if (cbObj[teacherEmail]){
    console.error("Teacher is already added")
    return false;
  }

  try {

    const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

    let orgPath = studentPath.split("/").slice(0, 2).join("/")

    // we add the ref to the teacher
    await db.collection(`${orgPath}/teachers`).where("email", "==", teacherEmail).get().then((data) => {
      let targetTeacher = data.docs[0].ref;
      let studentRef = db.doc(studentPath);
      targetTeacher.update({ studentsRef: arrayUnion(studentRef) });
    });

    //add cbobj to student
    await db.doc(studentPath).set(
      {coderBucksObject: {
        [teacherEmail]: {
          coderBucksValue: 0,
          path: studentPath,
        },
      },
    }, {merge: true})

    return true;
    
  } catch (e) {
    console.error(e)
    return false;
  }
}
