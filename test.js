require('dotenv').config();

const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');


axios.get('https://www.stuff.co.nz/travel/news/102821918/how-to-suck-at-yoga-on-a-yoga-retreat')
	.then((response) => {
		let $ = cheerio.load(response.data);

		let turndown = new TurndownService();
		turndown.remove('script');

		let markdown;
		markdown = '#Yeah, nah. Don\'t click that link, read the article here\n*****\n';
		markdown += '#' + $('.story_content_top h1').text().trim() + '\n\n';

		$('article.story_landing').children().each(function() {
			if($(this).is('p')) {
				if ($(this).text().includes('READ MORE')) {
				} else {
					markdown += turndown.turndown($(this).html()) + '\n\n';
				}
			} else if ($(this).is('.landscapephoto')) {
				let img = $(this).find('img');
				markdown += '[' + img.attr('alt') + '](' + img.attr('src') + ')\n\n';
			}
		});
		// markdown += turndown.turndown($('article.story_landing').html());

		console.log(markdown.length);
	})
	.catch((error) => {
		console.log(error);
	});

// comments.on('comment', (comment) => {
// 	if(comment.link_url.includes('stuff.co.nz')) {
// 		console.log('Stuff');
// 	}
// })