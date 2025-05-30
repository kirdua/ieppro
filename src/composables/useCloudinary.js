import { ref } from 'vue'
import axios from 'axios'
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/constants/index'

// Cloudinary API endpoint using environment variables
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export function useCloudinary() {
  const isUploading = ref(false)
  const uploadError = ref(null)

  /**
   * Uploads a file to Cloudinary and returns the secure URL of the uploaded image.
   * @param {File} file - The file object to be uploaded.
   * @returns {Promise<string|null>} - The secure URL of the uploaded image or null if failed.
   */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET) // Using imported preset

    try {
      isUploading.value = true
      uploadError.value = null

      const response = await axios.post(CLOUDINARY_API_URL, formData)
      return response.data.secure_url
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      uploadError.value = error
      return null
    } finally {
      isUploading.value = false
    }
  }

  return { uploadToCloudinary, isUploading, uploadError }
}
