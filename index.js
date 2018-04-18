require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const r = new Snoowrap({
	userAgent: 'com.turbotailz.yeah-nah-bot',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});

const client = new Snoostorm(r);

const streamOpts = {
	subreddit: 'turbotesting',
	results: 25
}

const submission = client.SubmissionStream(streamOpts);

submission.on('submission', (sub) => {
	if(sub.domain == 'stuff.co.nz') {
		axios.get(sub.url)
			.then((response) => {
				let $ = cheerio.load(response.data);

				let turndown = new TurndownService();
				turndown.remove('script');

				let markdown;
				markdown = '#Yeah, nah. Don\'t click that link, read the article here\n*****\n';
				markdown += turndown.turndown($('article.story_landing').html());

				sub.reply(markdown);
			})
			.catch((error) => {
				console.log(error);
			});
	}
});

// comments.on('comment', (comment) => {
// 	if(comment.link_url.includes('stuff.co.nz')) {
// 		console.log('Stuff');
// 	}
// })