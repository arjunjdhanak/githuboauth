const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/auth', githubController.getAuthUrl);
router.get('/callback', githubController.handleCallback);
router.post('/remove', githubController.removeIntegration);
router.get('/status', githubController.getIntegrationStatus);
router.get('/data', githubController.getGithubData);

module.exports = router;