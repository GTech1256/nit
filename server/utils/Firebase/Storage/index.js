const firebase = require('firebase-admin');
const serviceAccount = require('./@private-firebase.json');


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});


export const uploadFileToFirebase = file => new Promise((resolve, reject) => {
  console.log(1);
  console.log(file.path);


  firebase
    .storage()
    .bucket()
    .upload(file.path, async (err, uploadedFile) => {
      if (err) {
        return reject(err);
      }

      await uploadedFile.makePublic();
      console.log('published');

      const [url] = await uploadedFile.getSignedUrl({
        action: 'read',
        expires: new Date().getTime() + 60 * 60 * 24 * 7,
      });

      console.log('RESOLVE');

      // console.log(url,);


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
