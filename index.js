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

				let markdown = '';
				let markdown2 = '';

				markdown = '#Yeah, nah. Don\'t click that link, read the article here\n*****\n';
				markdown += '#' + $('.story_content_top h1').text().trim() + '\n\n';

				let mdCount = markdown.length;

				$('article.story_landing').children().each(function() {
					if($(this).is('p')) {
						if ($(this).text().includes('READ MORE')) {
						} else {
							let string = turndown.turndown($(this).html()) + '\n\n';
							if (mdCount + string.length < 9800 && markdown2.length == 0) {
								markdown += string;
								mdCount = markdown.length;
							} else {
								markdown2 += string;
							}
						}
					} else if ($(this).is('.landscapephoto')) {
						let img = $(this).find('img');
						let string = '[' + img.attr('alt') + '](' + img.attr('src') + ')\n\n';
						if (mdCount + string.length < 9800 && markdown2.length == 0) {
							markdown += string;
							mdCount = markdown.length;
						} else {
							markdown2 += string;
						}
					}
				});

				if (markdown2.length > 0) {
					markdown += '*****\n#Article too long for Reddit comments, continued in thread...\n'
				}

				markdown += '*****\n^Notice ^any ^bugs? ^Want ^your ^subreddit ^blacklisted? ^Contact ^/u/turbotailz';

				sub.reply(markdown)
					.then((reply) => {
						if (markdown2.length > 0) {
							reply.reply(markdown2)
								.then((limitReply) => {
									console.log('Article was too long.')
								})
								.catch((error) => {
									console.log(error);
								})
						}
					})
					.catch((error) => {
						console.log(error);
					})
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