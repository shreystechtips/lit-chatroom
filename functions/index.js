const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Keeps track of the length of the 'likes' child list in a separate property.
exports.addtimestamp = functions.database
  .ref("/messages/{messageID}")
  .onCreate(async (change) => {
    const messageRef = change.ref;
    const timeRef = messageRef.child("timestamp");
    return await timeRef.set(admin.database.ServerValue.TIMESTAMP);
  });
