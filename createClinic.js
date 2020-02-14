const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const readline = require("readline");
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

rl.question("practiceName ?  ", function (practiceName) {
rl.question("clinicName ?  ", function (clinicName) {
rl.question("clinicProperName ? (example: if clinicName is walnutcreek, enter Walnut Creek)  ", function (clinicProperName) {
rl.question("uuid ?  ", function (uuid) {
rl.question("adlLate ?  ", function (adlLate) {
rl.question("adlEarly ?  ", function (adlEarly) {
rl.question("oucProvider ?  ", function (oucProvider) {
rl.question("logoImgPath ?  ", function (logoImgPath) {
rl.question("timezone ?  ", function (timezone) {
rl.question("lobbyATitle ?  ", function (lobbyATitle) {
rl.question("lobbyBTitle ?", function (lobbyBTitle) {
   let templateClinic = getTemplateClinic(practiceName, clinicName, clinicProperName, uuid, adlLate, adlEarly, oucProvider, logoImgPath, timezone, lobbyATitle, lobbyBTitle);
   updateCollection(templateClinic);
})})})})})})})})})})})

function getTemplateClinic(practiceName, clinicName, clinicProperName, uuid, adlLate, adlEarly, oucProvider, logoImgPath, timezone, lobbyATitle, lobbyBTitle) {
   return ({
      // point this to practices/healthspaces/clinics when ready to test for PatientFlow
      [`practices/healthspaces/clinicsjsontest`]: {
         [`${clinicName}`]: {
            "workflow": {
               "transitions": [
                  {
                     "to": "registration",
                     "from": "arrived",
                     "name": "welcomePatient"
                  },
                  {
                     "to": "forms",
                     "from": "registration",
                     "name": "formsRequested"
                  },
                  {
                     "from": "registration",
                     "name": "registrationComplete",
                     "to": "ready"
                  },
                  {
                     "to": "ready",
                     "from": "forms",
                     "name": "formsComplete"
                  },
                  {
                     "to": "waiting",
                     "from": "ready",
                     "name": "assignRoom"
                  },
                  {
                     "from": "waiting",
                     "name": "attendPatient",
                     "to": "attended"
                  },
                  {
                     "to": "waiting",
                     "from": "attended",
                     "name": "sendTo"
                  },
                  {
                     "from": "attended",
                     "name": "clinicComplete",
                     "to": "completed"
                  },
                  {
                     "from": "completed",
                     "name": "beginCheckout",
                     "to": "checkout"
                  },
                  {
                     "name": "checkoutComplete",
                     "to": "departed",
                     "from": "checkout"
                  }
               ]
            },
            "uuid": uuid,
            "arrival_delta_limits": {
               "late": parseInt(adlLate),
               "early": parseInt(adlEarly)
            },
            "oucProvider": (oucProvider === "true"),
            "settings": {
               "kiosk_logo": logoImgPath
            },
            "actors": {
               "xray": {
                  "order": 4,
                  "title": "X-Ray",
                  "color": "#ffe828"
               },
               "extender": {
                  "color": "#d500f9",
                  "order": 8,
                  "title": "Extender"
               },
               "provider": {
                  "order": 1,
                  "title": "Provider",
                  "color": "#2a9fd3"
               },
               "unassigned": {
                  "title": "Unassigned",
                  "color": "#f4f4f4",
                  "order": 5
               },
               "caster": {
                  "title": "Caster",
                  "color": "#d35e2a",
                  "order": 2
               },
               "research": {
                  "title": "Research",
                  "color": "#283593",
                  "order": 7
               },
               "clinical": {
                  "order": 3,
                  "title": "Clinical",
                  "color": "#ff66ff"
               },
               "injector": {
                  "order": 9,
                  "title": "Injector",
                  "color": "#542510"
               },
               "scheduler": {
                  "title": "Scheduler",
                  "color": "#4caf50",
                  "order": 6
               }
            },
            "timezoneAdjust": 0,
            "statuses": {
               "waiting": {
                  "iod": 10,
                  "actor": true,
                  "room": true,
                  "title": "Waiting for<br>{actor}",
                  "order": 5
               },
               "arrived": {
                  "iod": 10,
                  "actor": false,
                  "room": false,
                  "title": "Signed In",
                  "order": 1
               },
               "attended": {
                  "title": "In Room with<br>{actor}",
                  "order": 6,
                  "iod": 0,
                  "actor": true,
                  "room": true
               },
               "departed": {
                  "order": 9,
                  "iod": 0,
                  "actor": false,
                  "room": false,
                  "title": "Completed Visit"
               },
               "forms": {
                  "order": 3,
                  "iod": 10,
                  "actor": false,
                  "room": false,
                  "title": "Completing Forms"
               },
               "checkout": {
                  "iod": 0,
                  "actor": false,
                  "room": false,
                  "title": "Checking Out",
                  "order": 8
               },
               "registration": {
                  "order": 2,
                  "iod": 0,
                  "actor": false,
                  "room": false,
                  "title": "Registration"
               },
               "ready": {
                  "order": 4,
                  "iod": 10,
                  "actor": false,
                  "room": false,
                  "title": "Ready"
               },
               "completed": {
                  "iod": 10,
                  "actor": false,
                  "room": false,
                  "title": "Completed Clinic",
                  "order": 7
               }
            },
            "timezone": timezone,
            "rooms": {
               "C": {
                  "order": 3,
                  "title": "C",
                  "children": {
                     "C1": {
                        "style": "grid-row: 3; grid-column: 1",
                        "title": "C1",
                        "order": 0
                     },
                     "C2": {
                        "order": 0,
                        "style": "grid-row: 3; grid-column: 2",
                        "title": "C2"
                     },
                     "C4": {
                        "order": 0,
                        "style": "grid-row: 3; grid-column: 4",
                        "title": "C4"
                     },
                     "C5": {
                        "order": 0,
                        "style": "grid-row: 3; grid-column: 5",
                        "title": "C5"
                     },
                     "C6": {
                        "title": "C6",
                        "order": 0,
                        "style": "grid-row: 3; grid-column: 6"
                     },
                     "C3": {
                        "title": "C3",
                        "order": 0,
                        "style": "grid-row: 3; grid-column: 3"
                     }
                  }
               },
               "E": {
                  "order": 5,
                  "title": "E",
                  "children": {
                     "E6": {
                        "order": 0,
                        "style": "grid-row: 5; grid-column: 6",
                        "title": "E6"
                     },
                     "E3": {
                        "style": "grid-row: 5; grid-column: 3",
                        "title": "E3",
                        "order": 0
                     },
                     "E4": {
                        "order": 0,
                        "style": "grid-row: 5; grid-column: 4",
                        "title": "E4"
                     },
                     "E2": {
                        "order": 0,
                        "style": "grid-row: 5; grid-column: 2",
                        "title": "E2"
                     },
                     "E5": {
                        "style": "grid-row: 5; grid-column: 5",
                        "title": "E5",
                        "order": 0
                     },
                     "E1": {
                        "style": "grid-row: 5; grid-column: 1",
                        "title": "E1",
                        "order": 0
                     }
                  }
               },
               "D": {
                  "order": 4,
                  "title": "D",
                  "children": {
                     "D6": {
                        "title": "D6",
                        "order": 0,
                        "style": "grid-row: 4; grid-column: 6"
                     },
                     "D2": {
                        "order": 0,
                        "style": "grid-row: 4; grid-column: 2",
                        "title": "D2"
                     },
                     "D5": {
                        "order": 0,
                        "style": "grid-row: 4; grid-column: 5",
                        "title": "D5"
                     },
                     "D3": {
                        "title": "D3",
                        "order": 0,
                        "style": "grid-row: 4; grid-column: 3"
                     },
                     "D4": {
                        "style": "grid-row: 4; grid-column: 4",
                        "title": "D4",
                        "order": 0
                     },
                     "D1": {
                        "title": "D1",
                        "order": 0,
                        "style": "grid-row: 4; grid-column: 1"
                     }
                  }
               },
               "A": {
                  "order": 1,
                  "title": lobbyATitle,
                  "children": {
                     "A4": {
                        "title": "A4",
                        "order": 0,
                        "style": "grid-row: 1; grid-column: 4"
                     },
                     "A1": {
                        "order": 0,
                        "style": "grid-row: 1; grid-column: 1",
                        "title": "A1"
                     },
                     "A3": {
                        "style": "grid-row: 1; grid-column: 3",
                        "title": "A3",
                        "order": 0
                     },
                     "A6": {
                        "order": 0,
                        "style": "grid-row: 1; grid-column: 6",
                        "title": "A6"
                     },
                     "A5": {
                        "title": "A5",
                        "order": 0,
                        "style": "grid-row: 1; grid-column: 5"
                     },
                     "A2": {
                        "order": 0,
                        "style": "grid-row: 1; grid-column: 2",
                        "title": "A2"
                     }
                  }
               },
               "pr": {
                  "title": "PR",
                  "children": {
                     "PR": {
                        "title": "PR",
                        "order": 0,
                        "style": "grid-row: 6; grid-column: 1 / span 6"
                     }
                  },
                  "order": 6
               },
               "B": {
                  "order": 2,
                  "title": lobbyBTitle,
                  "children": {
                     "B1": {
                        "order": 0,
                        "style": "grid-row: 2; grid-column: 1",
                        "title": "B1"
                     },
                     "B3": {
                        "style": "grid-row: 2; grid-column: 3",
                        "title": "B3",
                        "order": 0
                     },
                     "B5": {
                        "order": 0,
                        "style": "grid-row: 2; grid-column: 5",
                        "title": "B5"
                     },
                     "B4": {
                        "style": "grid-row: 2; grid-column: 4",
                        "title": "B4",
                        "order": 0
                     },
                     "B6": {
                        "order": 0,
                        "style": "grid-row: 2; grid-column: 6",
                        "title": "B6"
                     },
                     "B2": {
                        "title": "B2",
                        "order": 0,
                        "style": "grid-row: 2; grid-column: 2"
                     }
                  }
               }
            },
            "name": clinicProperName
         }
      }
   })
};

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
