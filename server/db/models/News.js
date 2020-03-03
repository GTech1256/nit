import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: String,
    /**
     * AWS file structure
     * @Location - URL of the uploaded object.
     * @ETag - ETag of the uploaded object.
     * @Bucket - Bucket to which the object was uploaded.
     * @Key - Key to which the object was uploaded.
     */
    image: {
      url: String, // URL of the uploaded object.
      name: String, // ETag of the uploaded object.
      meta: {

      },
    },
    text: String,
    date: Date,
  },
  {
    timestamps: true,
  },
);


export default mongoose.model('News', schema);
