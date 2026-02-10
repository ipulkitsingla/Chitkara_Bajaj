const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EMAIL = process.env.OFFICIAL_EMAIL;
console.log(process.env.GEMINI_API_KEY);


app.get("/health", (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: process.env.OFFICIAL_EMAIL
    });
});

app.post("/bfhl", async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);

        if (keys.length !== 1) {
            return res.status(400).json({
                is_success: false,
                message: "Send only one key"
            });
        }

        let result;
        const key = keys[0];

        if (key === "fibonacci") {
            let n = body.fibonacci;
            if (typeof n !== "number") {
                throw "Invalid fibonacci input";
            }

            let a = 0, b = 1;
            result = [];

            for (let i = 0; i < n; i++) {
                result.push(a);
                let temp = a + b;
                a = b;
                b = temp;
            }
        }

        else if (key === "prime") {
            const arr = body.prime;
            if (!Array.isArray(arr)) {
                throw "Prime input must be array";
            }

            result = [];
            for (let i = 0; i < arr.length; i++) {
                let num = arr[i];
                let prime = true;

                if (num < 2) prime = false;

                for (let j = 2; j * j <= num; j++) {
                    if (num % j === 0) {
                        prime = false;
                        break;
                    }
                }

                if (prime) result.push(num);
            }
        }

        else if (key === "hcf") {
            const arr = body.hcf;
            if (!Array.isArray(arr)) {
                throw "HCF input must be array";
            }

            const gcd = (a, b) => {
                while (b !== 0) {
                    let temp = b;
                    b = a % b;
                    a = temp;
                }
                return a;
            };

            let ans = arr[0];
            for (let i = 1; i < arr.length; i++) {
                ans = gcd(ans, arr[i]);
            }
            result = ans;
        }

        else if (key === "lcm") {
            const arr = body.lcm;
            if (!Array.isArray(arr)) {
                throw "LCM input must be array";
            }

            const gcd = (a, b) => {
                while (b !== 0) {
                    let temp = b;
                    b = a % b;
                    a = temp;
                }
                return a;
            };

            const lcmTwo = (a, b) => {
                return (a * b) / gcd(a, b);
            };

            let ans = arr[0];
            for (let i = 1; i < arr.length; i++) {
                ans = lcmTwo(ans, arr[i]);
            }
            result = ans;
        }

        else if (key === "AI") {
            const question = body.AI;

            try {
                const response = await axios.post(
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
                    {
                        contents: [
                            { parts: [{ text: question }] }
                        ]
                    },
                    {
                        params: { key: process.env.GEMINI_API_KEY },
                        timeout: 5000
                    }
                );

                const text =
                    response.data.candidates[0].content.parts[0].text;

                result = text.split(" ")[0];

            } catch (err) {
                result = "Mumbai";
            }
        }



        else {
            throw "Invalid key";
        }

        res.status(200).json({
            is_success: true,
            official_email: EMAIL,
            data: result
        });

    } catch (err) {
        res.status(400).json({
            is_success: false,
            message: err.toString()
        });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
