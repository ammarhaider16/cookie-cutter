const apiKey = chrome.runtime.getManifest().env.GEMINI_API_KEY;

export const analyzeCookiesWithGemini = async (cookies) => {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const data = {
    systemInstruction: {
      parts: [
        {
          text: "The text will be a string of browser cookies active on a particular webpage, separated by a semi-colon. Analyze the cookies in the array, describing what the cookies are doing and whether the cookies are safe or whether there is a concerning number of third-party cookies tracking user data. Return a two-part semicolon-separated string which must be formatted as follows: '<Less than 100 word description of the functions of cookies>;<Less than 100 word description of whether the browser cookies on the webpage are safe>'. There should be no other semi-colons in the string.",
        },
      ],
    },
    contents: [
      {
        parts: [
          {
            text: cookies,
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
