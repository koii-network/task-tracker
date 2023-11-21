const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    round: Number,
    submission_stakingKey: String, // A single submission staking key.
    submission_publicKey: String, // A single submission public key.
    referrer_publicKey: String, // A single referrer public key.
    task_id: String, // A single referrer public key.
    reward_processed: Boolean, // A single boolean value.
  },
  { timestamps: true }
); // timestamps will add createdAt and updatedAt fields

const Submission = mongoose.model("affiliatesubmissions", affiliateSchema);

module.exports = Submission;
