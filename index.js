// Imports
const {
  activeWhitelistedTasks,
} = require("./helperFunctions/activeWhitelistedTasks");

const {
  stakingKeyConvertor,
} = require("./helperFunctions/stakingKeyToPublicKey");

require("dotenv").config();
const { Connection, PublicKey } = require("@_koi/web3.js");
const mongoose = require("mongoose");
const Submission = require("./helperFunctions/schema");

const cron = require("node-cron");

class TaskTracker {
  constructor() {
    this.taskLatestRounds = {};
    this.tasksToTrack = [];
    this.connectToDb();
    this.init();
  }

  async init() {
    console.log("Task Tracker is active.");
    await this.getTasksToTrack();
    this.connection = new Connection(process.env.URL_K2);
    cron.schedule("*/15 * * * * *", () => {
      for (const task_id of this.tasksToTrack) {
        console.log("Checking if there is a new round for the task, ", task_id);
        this.fetchSubmission(task_id);
      }
    });

    // Schedule to fetch active whitelisted tasks every 15 minutes
    cron.schedule("0 */15 * * * *", () => {
      console.log("Scheduled run to fetch active whitelisted tasks.");
      this.getTasksToTrack();
    });
  }

  async fetchSubmission(task_id) {
    console.log("Fetching submission");
    const accountInfo = await this.connection.getAccountInfo(
      new PublicKey(task_id)
    );
    const accountInfoData = JSON.parse(accountInfo.data + "");

    const rounds = Object.keys(accountInfoData.submissions);
    const latestRound = Math.max(...rounds);

    if (
      !this.taskLatestRounds[task_id] ||
      this.taskLatestRounds[task_id] < latestRound
    ) {
      console.log(`For ${task_id}, a new round was found.`);
      this.taskLatestRounds[task_id] = latestRound;
      console.log("Waiting 2 minutes to extract all the submissions.");
      setTimeout(() => {
        this.extractSubmissions(task_id, latestRound);
      }, 0.1 * 60 * 1000);
    } else {
      console.log(`For ${task_id}, no new round was found.`);
    }
  }

  async extractSubmissions(task_id, round) {
    console.log("Extracting submissions after waiting.");
    const accountInfo = await this.connection.getAccountInfo(
      new PublicKey(task_id)
    );
    const accountInfoData = JSON.parse(accountInfo.data + "");

    if (accountInfoData.submissions[round]) {
      const latestRoundSubmitters = accountInfoData.submissions[round];
      const id_of_submissions_made_in_round = Object.keys(
        latestRoundSubmitters
      );

      console.log("Task ID:", task_id);
      console.log("Latest Round is", round);
      console.log(id_of_submissions_made_in_round.length, "Submissions made.");
      console.log("Submissions are", id_of_submissions_made_in_round);

      // Convert staking keys to public keys
      const submissions_publicKeys = await stakingKeyConvertor(
        id_of_submissions_made_in_round
      );

      try {
        const submission = new Submission({
          task_id: task_id,
          round: round,
          submissions: id_of_submissions_made_in_round,
          submissions_publicKeys: submissions_publicKeys,
        });
        await submission.save();
        console.log("General whitelisted task data saved to the database.");
      } catch (error) {
        console.error("Failed to save to the database:", error);
      }
    }
  }

  async connectToDb() {
    try {
      await mongoose.connect(process.env.DB_URI_USER);
      console.log("Connected to the database");
    } catch (error) {
      console.error("Database connection error:", error);
    }
  }

  async getTasksToTrack() {
    console.log("Fetching active whitelisted tasks.");
    const tasks = await activeWhitelistedTasks();
    console.log("Active whitelisted tasks are:", tasks);
    this.tasksToTrack = tasks;
  }
}

// Initialize the TaskTracker with the configuration.
new TaskTracker();
