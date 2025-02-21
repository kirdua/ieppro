export const getFirebaseErrorMessage = (errorCode) => {
  const messages = {
    'auth/invalid-email': 'The email address is invalid. Please provide a valid email.',
    'auth/email-already-in-use': 'This email is already in use. Please use a different one.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    default: 'An unexpected error occurred. Please try again.'
  }
  return messages[errorCode] || messages.default
}
