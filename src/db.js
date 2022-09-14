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

export async function getTeacherEmails(orgName) {
  var db = firebase.firestore();
  var collection = await db
    .collection("organization")
    .doc(orgName)
    .collection("teachers")
    .get();
  return collection.docs.map((data) => {
    let teacher = { ...data.data(), id: data.id };
    return teacher.email
  });
}



export async function getTeacherProducts(
  orgName,
  teacherName
) {
  var db = firebase.firestore();
  var collection = await db
    .collection("organization")
    .doc(orgName)
    .collection("teachers")
    .doc(teacherName)
    .collection("products")
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
  

export async function getOrgNameFromCode(orgCode) {
  var db = firebase.firestore();
  let returnData;
  await db.collection("organization").where("orgCode", "==", orgCode).get().then((data) => {
    if (data.docs[0].exists) {
        returnData = data.docs[0].id;
      }
    else{
      console.error("Problem getting data in 'getOrgNameFormCode', current data: " + data)
      console.log(data)
    }
  })
  return returnData;
}

export async function getTecherEmailsFromStudent(studentPath){
  let returnData;
  let db = firebase.firestore();
  returnData = await db.doc(studentPath).get().then((data) => {
    return Object.keys(data.data().coderBucksObject)
  })
  return returnData;
}


export async function getCoderBucksObject(studentPath) {
  let returnData;
  let db = firebase.firestore();
  try{
    await db
      .doc(studentPath)
      .get()
      .then((data) => {
        returnData = data.data().coderBucksObject;
      });
    return returnData;
  } catch (e) {
    console.error(e) // common error --> student path is undefined (look at the authStore value when you call it) 
    return null;
  }
}


export async function addStudentToTeacher(teacherEmail = "", studentPath, error_passthrough) {
  let db = firebase.firestore();

  //checks for corner cases
  if(!teacherEmail){
    console.error(new Error("No teacher email specified, aborting function"))
    return [false, "No teacher email specified"];
  } 
  
  let cbObj = await getCoderBucksObject(studentPath)
  if (cbObj[teacherEmail]){
    console.error(new Error("Teacher is already added"))
    return [false, "Teacher is already added"];
  }

  let orgName = studentPath.split("/").slice(1, 2)[0];
  let teacherEmails = await getTeacherEmails(orgName);
  if (!teacherEmails.includes(teacherEmail)) {
    console.error(new Error("Teacher email is invalid - teacher might not exist"));
    return [false, "Teacher email is invalid"];
  }

  //todo: Make it so that if the teacher already has an ref to the sudent, show a popup saying that "student is alrady added"
  //PS: there is no need to change logic, as it uses a merge and will not add annother sudent ref. 

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

    return [true, ""];
    
  } catch (e) {
    console.error(e)
    return [false, e];
  }
}


//Todo: Something here is broken, need to fix. Current error: line 'tName = data.docs[0].data().name' is breaking with the error 'Cannot read properties of undefined (reading 'data')';

export async function getTeacherProductsWithEmail (teacherEmail, orgName) {
  let db = firebase.firestore();
  let tName = "";
  console.log(teacherEmail, orgName)
  let teacherPath = await db.collection(`organization/${orgName}/teachers/`).where("email", "==", teacherEmail).get().then((data) => {
    if (data.empty){
      throw new Error("Invalid fetch params")
    }
    tName = data.docs[0].data().name;
    return data.docs[0].ref.path
  })

  // throw new Error("Problem Querying data, please come back at a later time")
  
  let productsUF = await db.doc(teacherPath).collection("products").get() //uf --> unfiltered
  
  return productsUF.docs.map((data) => {
    return { ...data.data(), id: data.id, teacherName: tName };
  })
} 


export function clearAllCache() {
  try{
    sessionStorage.clear()
    return true
  } catch {
    return false
  }
}

export async function checkOrgCode(orgCode) {
  let res = await db.collection("organization").where("orgCode", "==", orgCode)
}