const Cutoff = require("../models/Cutoff");

exports.getCutoffs = async (req, res) => {
  try {
    const { institute, year, round, quota, seatType } = req.query;

    const filter = {};

    if (institute) filter.institute = institute;
    if (year) filter.year = parseInt(year);
    if (round) filter.round = parseInt(round);
    if (quota) filter.quota = quota;
    if (seatType) filter.seatType = seatType;

    const data = await Cutoff.find(filter).limit(200);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
