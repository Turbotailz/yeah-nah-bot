require('dotenv').config();

const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');


axios.get('https://www.stuff.co.nz/travel/travel-troubles/103193243/passenger-sucked-out-of-plane-window-forcing-emergency-landing-for-us-flight')
	.then((response) => {
		let $ = cheerio.load(response.data);

		let turndown = new TurndownService();
		turndown.remove('script');
		let markdown = turndown.turndown($('article.story_landing').html());
		console.log($('article.story_landing').html());
		console.log(markdown);
	})
	.catch((error) => {
		console.log(error);
	});

// comments.on('comment', (comment) => {
// 	if(comment.link_url.includes('stuff.co.nz')) {
// 		console.log('Stuff');
// 	}
// })