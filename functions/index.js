var functions = require("firebase-functions");
var admin = require("firebase-admin");
var moment = require("moment");

admin.initializeApp(functions.config().firebase);

exports.bookUpdate = functions.firestore
  .document("books/{bookId}")
  .onUpdate(event => {
    const book = event.data.data();
    const payload = {
      notification: {
        title: book.title,
        body: book.author
      }
    };
    admin
      .messaging()
      .sendToDevice(
        "dETyH6Ko0Ts:APA91bGvIMOyPdBLFsbYgZNVnFj5dU5XEU7voMo__EhmFxZFf1quyxMOtO73TbGJqqMzI4t0NieOdLSmC4j5Pzp62V5Bui55GfyplIwB-t8UUNDeXFulTLgUmgZe5x_QjaL1edwcXdsJ",
        payload
      );
  });

exports.checkOverDues = functions.firestore.collection("");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
