const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "public");
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "results.json");

app.use(express.json());
app.use(express.static(publicDir));

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]", "utf8");
}

function readResults() {
  try {
    const raw = fs.readFileSync(dataFile, "utf8");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeResults(results) {
  fs.writeFileSync(dataFile, JSON.stringify(results, null, 2), "utf8");
}

app.get("/api/results", (req, res) => {
  res.json(readResults());
});

app.post("/api/save-result", (req, res) => {
  try {
    const data = req.body || {};
    const results = readResults();

    results.push({
      ...data,
      createdAt: new Date().toISOString()
    });

    writeResults(results);

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});