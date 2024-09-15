require("dotenv").config();
console.log("chatgpt api key: ", process.env.CHATGPT_API_KEY);

async function processMessageToChatGPT(emailSubject, emailText) {
  try {
    const prompt = `
        I have an email related to a job application. Please extract the following information:
        
        - Job Title
        - Company Name
        - Job Role
        - Application Status (e.g., Applied, Interviewed, Offered, Rejected)
        - Job Description Link (if any)
        - Application Date
        - Due Date (if any)
        - Last Action Date (if any)
    
        Email Subject: ${emailSubject}
        Email Text: ${emailText}

        Please respond with the fields in a structured JSON format. Here is an example:
        {
          "jobTitle": "Engineer",
          "company": "ALAX",
          "role": "Frontend Developer",
          "status": "Applied",
          "jobDescriptionLink": "https://careers.google.com",
          "applicationDate": "2024-09-01",
          "dueDate": "2024-09-15",
          "lastActionDate": "2024-09-10"
        }

        If this email isn't related to a job application, respond with this JSON format:
        {
          "status": "Unrelated"
        }
      `;

    const apiMessages = [{ role: "user", content: prompt }];

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "I'm an applicant using ChatGPT to parse emails",
        },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.CHATGPT_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });
    const responseResult = await response.json();
    const jsonResult = responseResult["choices"]["0"]["message"]["content"];
    return jsonResult;
  } catch (error) {
    console.error("Could not fetch response: ", error);
  }
  return { status: "Unrelated" };
}

module.exports = { processMessageToChatGPT };
