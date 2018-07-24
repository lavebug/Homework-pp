const http = require('http');
const axios = require('axios');
let medicationMap = {};
let prescriptionMap = {};
let prescriptions = [];
let medications = [];

// Use axios for multiple request 
function getPrescriptions() {
  return axios.get('http://api-sandbox.pillpack.com/prescriptions');
}

function getMedications() {
  return axios.get('http://api-sandbox.pillpack.com/medications');
}

axios.all([getPrescriptions(), getMedications()])
  .then(axios.spread(function (pres, meds) {
    // Both requests are now complete
    prescriptions = pres.data; // retriving prescriptions colection
    // convert to dictionary key/value pair where key is prescription id and value is a prescription object
    prescriptions.forEach(prescription => {prescriptionMap[prescription.id] = prescription;});
    medications = meds.data; // retriving medications collection
    // convert to dictionary key/value pair where key is medication id and value is a medication object
    medications.forEach(medication => {medicationMap[medication.id] = medication;});

    // for loop of prescriptions retrieving medication from dictionary
    let updatedPrescriptions = [];
    for(let i = 0; i < prescriptions.length; i++) {
      // retriving medication object based on medication_id from prescription
      let medicationObj = medicationMap[prescriptionMap[prescriptions[i].id].medication_id];
      let arrayMedicationResult = [];
      let j = 0;
      for (let o = 0; o < medications.length; o++){
        // finding a medication with same rxcui in medication colection
        if (medicationObj.rxcui == medications[o].rxcui){
          arrayMedicationResult[j] = medications[o];
          j++;
        }
      };
      for (let u = 0; u < arrayMedicationResult.length ; u++){
        // filtering brand medication storing result in updatedPrescriptions
        if(arrayMedicationResult[u].generic === true) {
          updatedPrescriptions.push({"prescription_id": prescriptionMap[prescriptions[u].id].id, "medication_id": arrayMedicationResult[u].id});
        }
      };
    }

    let prescription_updates = {"prescription_updates": updatedPrescriptions}
    console.log(prescription_updates);
  }));

// Create/start Node
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// TODO Create a view (index.html) & output that to the page