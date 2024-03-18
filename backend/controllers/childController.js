import asyncHandler from 'express-async-handler'
import Child from '../models/childModel.js'
import generateToken from '../utils/generateToken.js'

//@desc   Register new user
//route   POST /api/children/register
//@access Public
const registerChild = asyncHandler(async (req, res) => {
  const { parentId, name, dateOfBirth, gradeLevel, diagnoses, accommodations } =
    req.body
  const childExists = await Child.findOne({ parentId, name, dateOfBirth })

  if (childExists) {
    res.status(400)
    throw new Error('Child already exists')
  }

  const child = await Child.create({
    parentId,
    name,
    dateOfBirth,
    gradeLevel,
    diagnoses,
    accommodations,
  })

  if (child) {
    generateToken(res, child._id)
    res.status(201).json({
      _id: child._id,
      parentId,
      name,
      dateOfBirth,
      gradeLevel,
      diagnoses,
      accommodations,
    })
  } else {
    res.status(400)
    throw new Error('Invalid child data')
  }

  res.status(200).json({ message: 'Child Registered' })
})

export { registerChild }