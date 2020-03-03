const firebase = require('firebase-admin');
const serviceAccount = require('./@private-firebase.json');


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});


export const uploadFileToFirebase = file => new Promise((resolve, reject) => {
  firebase
    .storage()
    .bucket()
    .upload(file.path, async (err, uploadedFile) => {
      if (err) {
        return reject(err);
      }

      await uploadedFile.makePublic();

      const [url] = await uploadedFile.getSignedUrl({
        action: 'read',
        expires: new Date(2020, 3, 3, 22, 22, 0, 0),
      });


      return resolve({
        name: uploadedFile.metadata.name,
        url,
      });
    });
});

export function removeFileFromFirebase(filename) {
  return firebase
    .storage()
    .bucket()
    .file(filename)
    .delete();
}
