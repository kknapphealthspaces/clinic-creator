const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const readline = require("readline");
const appointmentsJson = require("./csvjson.json");
admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://healthspaces-io-staging.firebaseio.com"
});
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});
const db = admin.firestore();
db.settings({ timestampsInSnapshots: true });

// rl.question("practiceName ?  ", function (practiceName) {
// rl.question("clinicName ?  ", function (clinicName) {
// rl.question("clinicProperName ? (example: if clinicName is walnutcreek, enter Walnut Creek)  ", function (clinicProperName) {
// rl.question("uuid ?  ", function (uuid) {
// rl.question("adlLate ?  ", function (adlLate) {
// rl.question("adlEarly ?  ", function (adlEarly) {
// rl.question("oucProvider ?  ", function (oucProvider) {
// rl.question("logoImgPath ?  ", function (logoImgPath) {
// rl.question("timezone ?  ", function (timezone) {
// rl.question("lobbyATitle ?  ", function (lobbyATitle) {
// rl.question("lobbyBTitle ?", function (lobbyBTitle) {
//    let templateClinic = getTemplateClinic(practiceName, clinicName, clinicProperName, uuid, adlLate, adlEarly, oucProvider, logoImgPath, timezone, lobbyATitle, lobbyBTitle);
//    updateCollection(templateClinic);
// })})})})})})})})})})})

const appointments = appointmentsJson;
const sortedAppts = {};
const sortAppts = (clinicName, apptID, appt) => {
   if (sortedAppts[clinicName] === undefined) {
       sortedAppts[clinicName] = {}
   }
   sortedAppts[clinicName][apptID] = appt;
}
for (let appointment of appointments) {
    clinicName = appointment[""];
    appointmentID = appointment["visitNumer"];
    delete appointment["visitNumer"];
    switch (clinicName) {
        case "Grove City OH Physician" || "New Albany Physician" || "Dublin Physician" || "Olentangy Physician" || "Pickerington Urgent Care" || "Westerville Physician" || "Pickerington Physician":
            sortAppts(clinicName, appointmentID, appointment);
        default:
            break
    }
}
console.log(sortedAppts);

function importAppointment(clinicName, appointment) {
    return ({
        // point this to practices/healthspaces/clinics when ready to test for PatientFlow
        [`practices/${practiceName}/clinics/${clinicName}`]: {
            ["appointments"]: {

            }
        }
    })
}

async function updateCollection(dataArray) {
   for (const index in dataArray) {
      const collectionName = index;
      for (const doc in dataArray[index]) {
         if (dataArray[index].hasOwnProperty(doc)) {
            await startUpdating(collectionName, doc, dataArray[index][doc]);
            process.exit(0);
         }
      }
   }
}
function startUpdating(collectionName, doc, data) {
   return new Promise(resolve => {
      db.collection(collectionName).doc(doc)
         .set(data)
         .then(() => {
            console.log(`${doc} is imported successfully to firestore!`);
            resolve('Data wrote!');
         })
         .catch(error => {
            console.log(error);
         });
   });
}
