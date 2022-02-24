const fetch = require('node-fetch');
const cheerio = require('cheerio');
const webmention = require('send-webmention');
const util = require('util');

const webmentionp = util.promisify(webmention);

const extractLinks = async (url) => {
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  
  let linkObjects = $('.h-entry').first().find('a');
  if (linkObjects.length == 0) {
    linkObjects =  $('a');
  }

  // Collect the "href" of each link and add them to an array
  const links = [];
  linkObjects.each((index, element) => {
    links.push($(element).attr('href'));
  });
  return links;
};

const sendAllWebmentions = async (urls) => {
  if (typeof urls === 'string') {
    urls = [urls];
  }

  const report = {};
  for (const source of urls) {
    report[source] = {}
    const links = await extractLinks(source);
    for (const target of links) {
      if (source === target) {
        continue;
      }
      if (!target.startsWith('https') || !target.startsWith('http')) {
        continue;
      }
      
      report[source][target] = {};
      try {
        console.log(`sending webmention, source: ${source}, target: ${target}`);
        const result = await webmentionp(source, target);
        report[source][target].status_code = result.res.statusCode;
        if (result.success) {
          const location = result.res.headers['location'];
          if (location) {
            report[source][target].location = location;
          }
        } else {
          console.warn(`Unsucessful webmention ${source}, ${target}`);
        }
      } catch(err) {
        console.error(`Error sending webmention: ${source}, ${target}, ${JSON.stringify(err)}`);
      }
      
    };
  };
  return report;
};

module.exports = {
  extractLinks,
  sendAllWebmentions
};

/*
(async () => {
  const URL = 'https://desmondrivet.com/2021/08/25/git-warts';
  const report = await sendAllWebmentions(URL);
  console.log(`${JSON.stringify(report)}`);
})();
*/
