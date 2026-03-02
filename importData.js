const path = require("path");
require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");

const Cutoff = require("./models/Cutoff");

// 🔗 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Import ✅"))
  .catch(err => {
    console.error("MongoDB Connection Error ❌:", err);
    process.exit(1);
  });

const results = [];

// 📂 Correct CSV Path (Backend/data/data.csv)
const filePath = path.join(__dirname, "data", "data.csv");

fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    if (
      row["Institute"] &&
      row["Academic Program Name"] &&
      row["Opening Rank"]
    ) {
      results.push({
        institute: row["Institute"],
        program: row["Academic Program Name"],
        quota: row["Quota"],
        seatType: row["Seat Type"],
        gender: row["Gender"],
        openingRank: parseInt(row["Opening Rank"]),
        closingRank: parseInt(row["Closing Rank"]),
        round: parseInt(row["Round"]),
        year: parseInt(row["Year"]),
      });
    }
  })
  .on("end", async () => {
    console.log("Total rows collected:", results.length);

    const batchSize = 10000; // Insert 10k at a time

    try {
      // 🧹 Clear old data to prevent duplicates
      await Cutoff.deleteMany({});
      console.log("Old data cleared ✅");

      // 📦 Batch Insert
      for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        await Cutoff.insertMany(batch, { ordered: false });
        console.log(`Inserted ${i + batch.length} records`);
      }

      console.log("Data Imported Successfully 🚀");

      // 🔒 Close DB connection properly
      await mongoose.connection.close();
      process.exit(0);

    } catch (err) {
      console.error("Import Error ❌:", err);
      await mongoose.connection.close();
      process.exit(1);
    }
  })
  .on("error", (err) => {
    console.error("CSV Read Error ❌:", err);
  });