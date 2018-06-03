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

// on click for submit button and what will happens when they click it
$("#btnSubmit").on("click", function(event) {
    event.preventDefault();
    // capture user inputs and store them in variables
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequency").val().trim();
   

    
    
    // confirm things are working
    console.log(moment().format("DD/MM/YY hh:mm A"));
    console.log(moment().endOf('hour').fromNow());
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    // clear input fields after submit
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");



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
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    

        // create variables to store data
        var trainNameInfo = childSnapshot.val().trainName;
        var destinationInfo = childSnapshot.val().destination;
        var firstTrainTimeInfo = childSnapshot.val().firstTrainTime;
        var frequencyInfo = childSnapshot.val().frequency;
    //     // log the values
        console.log(trainNameInfo);
        console.log(destinationInfo);
        console.log(firstTrainTimeInfo);
        console.log(frequencyInfo);
    
    // momentjs variables for next arrival and minutes away
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrainTimeInfo, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        // // // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted, "HH:mm"));
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // // // Time apart (remainder)
        var tRemainder = diffTime % frequencyInfo;
        console.log("Time apart: " + tRemainder);

        // // // Minute Until Train
        var tMinutesTillTrain = frequencyInfo - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // // // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        // var nextArrival = current time - first train time
        // var minutesAway = 


    //     //adding the user input and time calculations to the screen and the current time to the jumbotron
        $("#trainInfo > tbody").append("<tr><td>" + trainNameInfo + 
        "</td><td>" + destinationInfo + "</td><td>" + frequencyInfo + 
        "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");

        $("#time").text("Current Time: " + moment().format("HH:mm"));
    

      // Handle the errors
    }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

