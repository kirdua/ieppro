import { ref } from 'vue'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.js',
  import.meta.url
).toString()

function useIepParser() {
  const isParsing = ref(false)
  const parseError = ref(null)
  const parsedData = ref({ profile: {}, goals: [], services: [], accommodations: [] })

  const parsePdf = async (file) => {
    isParsing.value = true
    parseError.value = null

    try {
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = async (event) => {
        const arrayBuffer = event.target.result
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

        const textContent = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const pageText = content.items.map((item) => item.str).join(' ')
          textContent.push(pageText)
        }

        extractSections(textContent.join(' '))
      }
    } catch (error) {
      parseError.value = 'Error parsing PDF.'
      console.error(error)
    } finally {
      isParsing.value = false
    }
  }

  // 🏷 Extract Different Sections from the PDF
  const extractSections = (text) => {
    parsedData.value.profile = extractProfile(text)
    parsedData.value.goals = extractGoals(text)
    parsedData.value.services = extractServices(text)
    parsedData.value.accommodations = extractAccommodations(text)
  }

  const extractProfile = (text) => ({
    name: text.match(/Name of Student:(.*?)Grade Level:/s)?.[1]?.trim() || '',
    gradeLevel: text.match(/Grade Level:(.*?)Diagnosis:/s)?.[1]?.trim() || '',
    diagnosis:
      text
        .match(/Diagnosis:(.*?)Goals:/s)?.[1]
        ?.trim()
        .split(/,|;/) || []
  })

  const extractGoals = (text) =>
    (
      text
        .match(/Goals:(.*?)Services:/s)?.[1]
        ?.trim()
        .split(/(?=Objective:|Goal:)/) || []
    ).map((goal) => ({
      description: goal.trim()
    }))

  const extractServices = (text) =>
    (
      text
        .match(/Services:(.*?)Accommodations:/s)?.[1]
        ?.trim()
        .split(/(?=Service:)/) || []
    ).map((service) => ({
      description: service.trim()
    }))

  const extractAccommodations = (text) =>
    (
      text
        .match(/Accommodations:(.*)/s)?.[1]
        ?.trim()
        .split(/(?=Accommodation:)/) || []
    ).map((acc) => ({
      description: acc.trim()
    }))

  return { isParsing, parseError, parsedData, parsePdf }
}

export default useIepParser
