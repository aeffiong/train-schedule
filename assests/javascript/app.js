// Goal: create a web application that gives a train schedule with their arrival times and number of minutes 
// until the arrival at the station

// use moment.js to get the times based on the current time
// use firebase to store the trains and times so that users from multiple machines can see the trains on there






  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC0I6INBQuAgbUzOk1jR1jPC_BaxShdc88",
    authDomain: "train-schedule-53c31.firebaseapp.com",
    databaseURL: "https://train-schedule-53c31.firebaseio.com",
    projectId: "train-schedule-53c31",
    storageBucket: "",
    messagingSenderId: "1040855041175"
  };
  firebase.initializeApp(config);


// define variables
var database = firebase.database();
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
// moment.js related variables
    // var nextArrival = ;
    // var minutesAway = ;

// on click for submit button and what will happens when they click it
$("#btnSubmit").on("click", function(event) {
    event.preventDefault();
    // capture user inputs and store them in variables
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
    frequency = $("#frequency").val().trim();
    // moment.js related variables
    // nextArrival = ;
    // minutesAway = ;

    
    
    // confirm things are working
    console.log(moment().format("DD/MM/YY hh:mm A"));
    console.log(moment().endOf('hour').fromNow());
    // console.log(trainName);
    // console.log(destination);
    console.log(firstTrainTime);
    // console.log(frequency);



    // setting up the firebase database
        // try .push instead of .set to keep track of everything that's been added
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });
    // // listening for changes to the data in firebase
    //     // try "child_added" - goes off each time a new child is added to the server
    database.ref().on("child_added", function(childSnapshot) {
    
    //     // log the values
        console.log(childSnapshot.val().trainName);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().firstTrainTime);
        console.log(childSnapshot.val().frequency);
    
    // momentjs variables for next arrival and minutes away
        // First Time (pushed back 1 year to make sure it comes before current time)
        // var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        // // Difference between the times
        var diffTime = moment().diff(moment(childSnapshot.val().firstTrainTime, "HH:mm"));
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log("Time apart: " + tRemainder);

        // // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        // var nextArrival = current time - first train time
        // var minutesAway = 


    //     // do this instead of the what we did below to get it to show on the screen
        $("#trainInfo > tbody").append("<tr><td>" + childSnapshot.val().trainName + 
        "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + 
        "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    

      // Handle the errors
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

