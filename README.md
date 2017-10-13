# News-Scraper

This project works with MongoDB, Mongoose, Express, Body-Parser, Logger, Express, and Handlebars to provide an application that scrapes a web site (in this case, Towleroad (http://www.towleroad) for articles.  It pulls the headline, summary, byline, URL, and associated image and creates a list of the articles it found, storing the data for those articles in a Mongo database.

Each article can be saved and clicking on the Saved Articles button will show the articles that have been saved.  From the Saved Articles section, you can click on the button to drop the article (which drops it immediately) as well as click on a button to add a note to the article.

This project is not complete and the known issues with it are:

1)  A timing issue during the scrape.  Specifically, the scraping function is working, but the loading of the page after the scrape is happening too soon.  Thus, the functionality to indicate how many articles have been found is not working.  If you perform a scrape, it will tell you that no new articles have been scraped but if you return to the Home page, you will see all the new articles that have been scraped.

2)  Associating notes to articles.  The system does correctly allow you to enter a note, but the connection between the Note table and the Article table has not been established, so you cannot see the notes that have been entered let alone delete them (the note, not the article).
