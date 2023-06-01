import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  console.log("Request body", req.body);
  const { bmi, systolic, diastolic, bloodSugar } = req.body;

  try {
    const prompt = generateTreatmentRecommendation(bmi, systolic, diastolic, bloodSugar)
    console.log("prompt:", prompt);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.6,
      max_tokens: 2048
    });
    console.log("completion", completion.data);
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function parseAndGenerateTreatmentRecommendation(input) {
  const [bmi, systolicBloodPressure, diastolicBloodPressure, bloodSugar] = input.split(',').map(item => item.trim())
  return generateTreatmentRecommendation(bmi, systolicBloodPressure, diastolicBloodPressure, bloodSugar);
}

function generateTreatmentRecommendation(bmi, systolicBloodPressure, diastolicBloodPressure, bloodSugar) {
  return `Suggest some recommendations for treating sleep apnea based on the following information:
  
  BMI: ${bmi}
  Systolic Blood Pressure: ${systolicBloodPressure} mm Hg
  Diastolic Blood Pressure: ${diastolicBloodPressure} mm Hg
  Blood Sugar: ${bloodSugar} mg/dL
  `
}
