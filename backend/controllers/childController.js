import asyncHandler from 'express-async-handler'
import Child from '../models/childModel.js'
import generateToken from '../utils/generateToken.js'

//@desc   Register new user
//route   POST /api/children/register
//@access Public
const registerChild = asyncHandler(async (req, res) => {
  const { parentId, name, dateOfBirth, gradeLevel, diagnoses, accommodations } =
    req.body
  const childExists = await Child.findOne({ parentId, name })

  if (childExists) {
    res.status(400)
    throw new Error('Child already exists')
  }

  const child = await Child.create({
    parentId,
    name,
    dateOfBirth,
    gradeLevel,
    diagnoses: diagnoses || [],
    accommodations: accommodations || [],
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

const getChildrenByParentId = async (req, res) => {
  const parentId = req.body
  const children = await Child.find(parentId)
  if (children) {
    res.status(201).json(children)
  } else {
    res.status(400)
    throw new Error('Children not available')
  }
}

const updateChildProfile = asyncHandler(async (req, res) => {
  const child = await Child.findById(req.child._id)

  if (child) {
    child.name = req.body.name || child.name
    child.dateOfBirth = req.body.dateOfBirth || child.dateOfBirth
    child.gradeLevel = req.body.gradeLevel || child.gradeLevel
    child.diagnoses = req.body.diagnoses || child.diagnoses
    child.accommodations = req.body.accommodations || child.accommodations

    const updatedChild = await child.save()

    res.status(200).json({
      _id: updatedChild._id,
      name: updatedChild.name,
      dateOfBirth: updatedChild.dateOfBirth,
      gradeLevel: updatedChild.gradeLevel,
      diagnoses: updatedChild.diagnoses,
      accommodations: updatedChild.accommodations,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }

  res.status(200).json({ message: 'Child profile updated' })
})

export { registerChild, getChildrenByParentId, updateChildProfile }
