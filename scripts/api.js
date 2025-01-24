const apiKey = chrome.runtime.getManifest().env.GEMINI_API_KEY;

export const testAPICall = async () => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const data = {
    systemInstruction: {
      parts: [
        {
          text: "This is a test message. Keep response limited to 100 words.",
        },
      ],
    },
    contents: [
      {
        parts: [
          {
            text: "Explain how AI works.",
          },
        ],
      },
    ],
  };

  return fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response:", data.candidates[0].content.parts[0].text);
      return data.candidates[0].content.parts[0].text;
    })
    .catch((error) => {
      console.error("Error:", error);
      return { error: error.toString() };
    });
};
