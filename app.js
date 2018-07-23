const http = require('http');

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
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

// TODO improve/combine for loop (map, reduce, filter) and get rid of setTimeout
setTimeout(function(){
  let arrayGenRccui = [];
  // Itearate prescriptions and medications on every medication id match modify prescriptions by adding rxcui and generic key/value
  for (let i = 0 ; i < prescriptions.length ; i++){
    for (let j = 0; j < medications.length ; j++){
      if (prescriptions[i].medication_id == medications[j].id){
        prescriptions[i].rxcui = medications[j].rxcui;
        prescriptions[i].generic = medications[j].generic;
      }
    };  
  };
  // TODO improve/combine for loop (map, reduce, filter)
  // Itearate modified prescriptions and medications
  for (let i = 0 ; i < prescriptions.length ; i++){
    for (let j = 0; j < medications.length ; j++){
      if (prescriptions[i].generic === false && prescriptions[i].rxcui == medications[j].rxcui){
        prescriptions[i].generic_med_id = medications[j].id;
        arrayGenRccui.push({"prescription_id": prescriptions[i].id, "medication_id": prescriptions[i].generic_med_id})
      }
    };
  };
  // Log out prescriptions update as per gist example https://gist.github.com/mpokress/51e7956d082656d52fbb
  // Just a prescription_id and (generic) mdeication_id
  let prescription_updates = {"prescription_updates": arrayGenRccui}
  console.log(prescription_updates);
}, 1000);

// TODO Create a view (index.html) and output that to the page