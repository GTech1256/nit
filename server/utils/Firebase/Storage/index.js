const admin = require('firebase-admin');

const serviceAccount = require('./@private-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export function getFiles() {
  const bucket = admin.storage().bucket();

  console.log(bucket);
}

export async function uploadFileToFirebase(file) {
  console.log();
  console.log();
  console.log(file, 'FILE', file.name);
  console.log();
  console.log();

  return admin
    .storage()
    .bucket()
    .put(file);
}

export function removeFileFromFirebase(filename) {
  return admin
    .storage()
    .bucket()
    .file(filename)
    .delete();
}
