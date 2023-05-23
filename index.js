const express = require('express');
const {TwitterApi}= require('twitter-api-v2')
const request = require("request");
const fs = require("fs");
var bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
//Third-party middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



 // Define the endpoint
app.post('/handleTweets', async (req, res) => {
    console.log(req)
    const body = req.body;
    console.log(body);
  
    const client = new TwitterApi({
        appKey: '',
        appSecret: '',
      accessToken: body.credential.accessToken ,
      accessSecret: body.credential.accessSecret ,
    });
  
    // Post the image as a tweet
    const twitterClient = client.readWrite;
  
    download(body.image, './image.png', async function () {
      try {
        const mediaId = await twitterClient.v1.uploadMedia('./image.png');
        await twitterClient.v2.tweet({
          text: body.userComment,
          media: {
            media_ids: [mediaId],
          },
        });
        res.status(200).send('Tweet successfully posted!');
      } catch (e) {
        console.log(e);
        res.status(500).send('Error posting tweet.');
      }
    });
  });

  // Function to download the image
function download(uri, filename, callback) {
    // Use your preferred method to download the image
    // For example, using the 'request' module
    request.head(uri, function (err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  }
  
  // Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });