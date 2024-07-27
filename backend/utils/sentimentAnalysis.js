// backend/utils/sentimentAnalysis.js
const { PythonShell } = require("python-shell");

function analyzeSentiment(text) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: "./",
      args: [text],
    };

    PythonShell.run("./test/analyze_sentiment.py", options, (err, results) => {
      if (err) reject(err);
      resolve(results[0]);
    });
  });
}

module.exports = { analyzeSentiment };
