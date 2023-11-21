const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    task_id: String,
    round: Number,
    submissions: [String], // array of submission ids
    submissions_publicKeys: [String], // array of submission pubkeys
  },
  { timestamps: true }
); // timestamps will add createdAt and updatedAt fields
submissionSchema.index({ task_id: 1, round: 1 }, { unique: true });

const Submission = mongoose.model("submissions", submissionSchema);

module.exports = Submission;
