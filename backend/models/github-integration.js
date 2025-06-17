const mongoose = require('mongoose');

const githubIntegrationSchema = new mongoose.Schema({
  userId: String,
  accessToken: String,
  lastSynced: Date,
  syncType: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GithubIntegration', githubIntegrationSchema);