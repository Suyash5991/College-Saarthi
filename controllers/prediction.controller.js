const Cutoff = require("../models/Cutoff");

exports.predictCollege = async (req, res) => {
  try {
    const { rank, year, round, quota, seatType, gender } = req.body;

    const userRank = parseInt(rank);

    const filter = {
      year: parseInt(year),
      round: parseInt(round),
      quota: quota,
      seatType: seatType,
      gender: gender,
      closingRank: { $gte: userRank }
    };

    const colleges = await Cutoff.find(filter)
      .sort({ closingRank: 1 })
      .limit(50);

    const results = colleges.map(college => {
      let status = "Dream";

      if (userRank <= college.closingRank) status = "Target";
      if (userRank <= college.closingRank * 0.7) status = "Safe";

      return {
        institute: college.institute,
        program: college.program,
        closingRank: college.closingRank,
        prediction: status
      };
    });

    res.json(results);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};