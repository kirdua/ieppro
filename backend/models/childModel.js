import mongoose from 'mongoose'
const Schema = mongoose.Schema

const childSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gradeLevel: {
      type: String,
      required: true,
    },
    specialNeeds: [
      {
        type: String,
      },
    ],
    accommodations: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Child = mongoose.model('Child', childSchema)
export default Child
