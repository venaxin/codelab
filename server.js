const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Function to execute JavaScript code
const executeJavaScript = (code) => {
  return new Promise((resolve, reject) => {
    exec(`node -e "${code}"`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Function to execute Python code
const executePython = (code) => {
  return new Promise((resolve, reject) => {
    exec(`python3 -c "${code}"`, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};

app.post("/execute", async (req, res) => {
  const { code, language } = req.body;

  try {
    let output;
    if (language === "javascript") {
      output = await executeJavaScript(code);
    } else if (language === "python") {
      output = await executePython(code);
    } else {
      throw new Error("Unsupported language");
    }
    res.json({ output });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
