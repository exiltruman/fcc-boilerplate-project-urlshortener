require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyparser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

const links = [];

app.use(cors());
app.use(bodyparser.json()); // support json encoded bodies
app.use(express.urlencoded({ extended: true })); // support encoded bodies

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const reqUrl = req.body.url;

  try {
    const parsedUrl = new URL(reqUrl);
    if (parsedUrl.protocol !== 'https:') {
      res.json({error: 'invalid url'})
    } else {
      const originalUrl = reqUrl;
      const newUrl = links.length+1;
      links.push({original: originalUrl, new: newUrl});
      res.json({original_url : originalUrl, short_url : newUrl})    
    }
  } catch(err) {
    res.json({error: 'invalid url'})
  }
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  const short = Number(req.params.shorturl);
 
  const foundShort = links.find((link) => {
    return link.new === short
  });

  if (foundShort) {
    res.redirect(foundShort.original);
  } else {
    res.json({error: 'asdf'});
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
