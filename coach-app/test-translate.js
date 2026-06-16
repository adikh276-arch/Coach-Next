const apiKey = process.env.GOOGLE_TRANSLATOR_KEY || "AIzaSyCvhEf21CwHRI0F_FO_25IcaUMBwEQPwKI";
const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

async function testTranslation() {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: "hello world",
                source: "en",
                target: "es",
                format: "text"
            })
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error);
    }
}

testTranslation();
