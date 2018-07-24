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
    // convert it to dictionary key/value pair -> n
    prescriptions = pres.data;
    prescriptions.forEach(prescription => {prescriptionMap[prescription.id] = prescription;});
    medications = meds.data;
    medications.forEach(medication => {medicationMap[medication.id] = medication;});

    // for loop of prescriptions retrieving medication from dictionary -> n+1
    // total time complexity (wort case) = O(n+n+1)
    //                                   = O(2n+1)
    //                                   = O(n)
    let updatedPrescriptions = [];
    for(let x = 0; x < prescriptions.length; x++) {
      let medicationObj = medicationMap[prescriptionMap[prescriptions[x].id].medication_id];
      let arrayMedicationResult = [];
      let j = 0;
      for (let i = 0; i < medications.length; i++){
        if (medicationObj.rxcui == medications[i].rxcui){
          arrayMedicationResult[j] = medications[i];
          j++;
        }
      };
      for (let i = 0; i < arrayMedicationResult.length ; i++){
        if(arrayMedicationResult[i].generic === true) {
          updatedPrescriptions.push({"prescription_id": prescriptionMap[prescriptions[x].id].id, "medication_id": arrayMedicationResult[i].id});
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