const useGemini = (apiKey) => {
    const callGemini = async (prompt, imageBase64 = null, retries = 3) => {
        if (!apiKey) {
            throw new Error("API key not configured. Set VITE_GEMINI_API_KEY in your .env file.");
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const parts = [{ text: prompt }];
        if (imageBase64) {
            parts.push({
                inlineData: {
                    mimeType: "image/png",
                    data: imageBase64
                }
            });
        }

        const payload = {
            contents: [{ parts }]
        };

        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const result = await response.json();
                return result.candidates?.[0]?.content?.parts?.[0]?.text;
            } catch (e) {
                if (i === retries - 1) throw e;
                await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
            }
        }
    };

    return { callGemini };
};

export default useGemini;
