export async function getOrginisations() {
  var db = firebase.firestore();
  var collection = await db.collection("organization").get();
  return collection.docs.map((data) => {
    return data.data();
  });
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
