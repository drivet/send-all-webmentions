const fetch = require('node-fetch');
const cheerio = require('cheerio');

const extractLinks = async (url) => {
  try {
    // Fetching HTML
    const response = await fetch(url);
    const html = await response.text();

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(html);

    const linkObjects = $('a');
    // this is a mass object, not an array

    // Collect the "href" and "title" of each link and add them to an array
    const links = [];
    linkObjects.each((index, element) => {
      links.push($(element).attr('href'));
    });

    console.log(links);
    // do something else here with these links, such as writing to a file or saving them to your database
  } catch (error) {
    console.log(error.response.body);
  }
};

(async () => {
  const URL = 'https://desmondrivet.com/2021/11/07/210300';
  await extractLinks(URL);
})();
