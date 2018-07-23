const http = require('http');

// Create/start Node
const hostname = '127.0.0.1';
const port = 3000;

let medicationMap = {};
let prescriptionMap = {};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// TODO Combine prescritions and medications in one get (foreach)
// Get Prescriptions (500)
let prescriptions = [];
let medications = [];
http.get('http://api-sandbox.pillpack.com/prescriptions', (resp) => {
  let data = '';
 
  // data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // the whole response has been received.
  resp.on('end', () => {
    prescriptions = JSON.parse(data);
    prescriptions.forEach(prescription => {prescriptionMap[prescription.id] = prescription;});
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

// TODO Combine prescritions and medications in one get (foreach)
// Get Medications (40)
http.get('http://api-sandbox.pillpack.com/medications', (resp) => {
  let data = '';
 
  // data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // the whole response has been received.
  resp.on('end', () => {
    medications = JSON.parse(data);
    medications.forEach(medication => {medicationMap[medication.id] = medication;});
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

// TODO get rid of setTimeout
setTimeout(function(){
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
  // console.log(prescription_updates);
}, 1000);

// TODO Create a view (index.html) and output that to the page