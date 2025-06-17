const mongoose = require('mongoose');

const githubDataSchema = new mongoose.Schema({
  type: String, // organizations, repos, commits, pulls, issues, users
  data: mongoose.Schema.Types.Mixed,
  organizationId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GithubData', githubDataSchema);