import { isValid, parse, format } from 'date-fns'

export const useFormRules = () => {
  const nameRules = [
    (v) => !!v || 'Name is required',
    (v) => (v && v.length >= 3) || 'Name must be at least 3 characters',
    (v) => /^[a-zA-Z ]+$/.test(v) || 'Name must contain only alphabetical letters'
  ]

  const emailRules = [
    (v) => !!v || 'E-mail is required',
    (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
  ]

  const passwordRules = [
    (v) => !!v || 'Password is required',
    (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
    (v) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(v) ||
      'Password must include uppercase, lowercase, number, and special characters'
  ]

  const getConfirmPasswordRules = (password) => [
    (v) => !!v || 'Confirm Password is required',
    (v) => v === password || 'Passwords do not match'
  ]

  const validateBirthDate = (date) => {
    const parsedDate = parse(date, 'M/d/yyyy', new Date())
    return isValid(parsedDate) && date === format(parsedDate, 'M/d/yyyy')
  }

  return {
    nameRules,
    emailRules,
    passwordRules,
    getConfirmPasswordRules,
    validateBirthDate
  }
}
