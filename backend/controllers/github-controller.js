const axios = require('axios');
const GithubIntegration = require('../models/githubIntegration');
const GithubData = require('../models/githubData');

const CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GITHUB_CLIENT_SECRET';

exports.getAuthUrl = (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:org,repo&redirect_uri=http://localhost:3000/api/github/callback`;
  res.json({ authUrl });
};

exports.handleCallback = async (req, res) => {
  const { code } = req.query;
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    }, {
      headers: { Accept: 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;
    
    // Get user data
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    // Save integration
    const integration = new GithubIntegration({
      userId: userResponse.data.id,
      accessToken,
      lastSynced: new Date(),
      syncType: 'full'
    });
    await integration.save();

    // Fetch and save GitHub data
    await fetchAndSaveGithubData(accessToken);

    res.redirect('http://localhost:4200/success');
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

async function fetchAndSaveGithubData(accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  
  // Fetch organizations
  const orgs = await axios.get('https://api.github.com/user/orgs', { headers });
  await GithubData.create({ type: 'organizations', data: orgs.data });

  for (const org of orgs.data) {
    // Fetch repos
    const repos = await axios.get(`https://api.github.com/orgs/${org.login}/repos`, { headers });
    await GithubData.create({ type: 'repos', data: repos.data, organizationId: org.id });

    for (const repo of repos.data) {
      // Fetch commits
      const commits = await axios.get(`https://api.github.com/repos/${org.login}/${repo.name}/commits`, { headers });
      await GithubData.create({ type: 'commits', data: commits.data, organizationId: org.id });

      // Fetch pulls
      const pulls = await axios.get(`https://api.github.com/repos/${org.login}/${repo.name}/pulls`, { headers });
      await GithubData.create({ type: 'pulls', data: pulls.data, organizationId: org.id });

      // Fetch issues
      const issues = await axios.get(`https://api.github.com/repos/${org.login}/${repo.name}/issues`, { headers });
      await GithubData.create({ type: 'issues', data: issues.data, organizationId: org.id });
    }

    // Fetch organization users
    const users = await axios.get(`https://api.github.com/orgs/${org.login}/members`, { headers });
    await GithubData.create({ type: 'users', data: users.data, organizationId: org.id });
  }
}

exports.removeIntegration = async (req, res) => {
  try {
    await GithubIntegration.deleteOne({ userId: req.body.userId });
    await GithubData.deleteMany({ userId: req.body.userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove integration' });
  }
};

exports.getIntegrationStatus = async (req, res) => {
  try {
    const integration = await GithubIntegration.findOne({ userId: req.query.userId });
    res.json(integration ? {
      connected: true,
      lastSynced: integration.lastSynced,
      syncType: integration.syncType
    } : { connected: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check integration status' });
  }
};

exports.getGithubData = async (req, res) => {
  try {
    const { type, page = 1, pageSize = 10, search } = req.query;
    const query = { type };
    if (search) {
      query['data.name'] = { $regex: search, $options: 'i' };
    }
    
    const data = await GithubData.find(query)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));
      
    const total = await GithubData.countDocuments(query);
    
    res.json({ data, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
};