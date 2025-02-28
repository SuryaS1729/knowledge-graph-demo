require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Fetch details from Google Knowledge Graph
app.get("/search", async (req, res) => {
  const query = req.query.q; // Get search term from request
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://kgsearch.googleapis.com/v1/entities:search?query=${query}$types=Person&key=${apiKey}&limit=1&indent=True`;

  try {
    const response = await axios.get(url);
    const result = response.data.itemListElement[0]?.result;

    if (result) {
      res.json({
        name: result.name || "Unknown",
        description: result.description || "No description available",
        detailedInfo: result.detailedDescription?.articleBody || "No detailed info available",
        sourceUrl: result.detailedDescription?.url || "No source",
        image: result.image?.contentUrl || "No image available",
      });
    } else {
      res.json({ error: "No results found." });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data." });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));