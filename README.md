# Problem Definition:

```
> GET JSON from http://api-sandbox.pillpack.com/medications and http://api-sandbox.pillpack.com/prescriptions
> For every brand medication find matching generic medication by RxNorm Concept Unique Identifier (rxcui)
> Output new prescriptions with prescriptions_id and generic medication_id as per https://gist.github.com/mpokress/51e7956d082656d52fbb in JSON format example:

{
  "prescription_updates":
    [
      {
          "prescription_id": "562cddf76238310003020000",
          "medication_id": "562cdd706238310003000000"
      },
      {
          "prescription_id": "562cde1d6238310003030000",
          "medication_id": "562cdd706238310003000000"
      }
    ]
}
```

## Getting Started

### Installing

```
> install node.js https://nodejs.org/en/download/
> Open Terminal (if on mac) or other command line
> git clone https://github.com/lavebug/Homework-pp.git
> cd Homework-pp
> npm install http
```

## Running

In Terminal type node app.js updated prescriptions will console.log to Terminal 