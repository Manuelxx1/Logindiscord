const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors())

const CLIENT_ID = '1435160999891046460';
const CLIENT_SECRET = 'a79Xnwb83gMWSGddcjvcs8WJipwfIORG';
const REDIRECT_URI = 'http://localhost:3000/callback';

app.get('/', (req, res) => {
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email`;
  res.send(`<a href="${discordAuthUrl}">Login con Discord</a>`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      scope: 'identify email'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    res.json(userResponse.data);
  } catch (error) {
    res.status(500).send('Error en el login con Discord');
  }
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
