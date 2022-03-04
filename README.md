# Alza.cz scraper

## Assignment
The task is to create a scraper of results from the alza.cz e-shop using the Puppeteer or Playwright library. There will be a search query on the input and a JSON with search results on the output. The output should contain the following attributes:

-  Search query
-  Total number of results
-  List of the 24 best-selling search results
-  List of 24 most expensive search results
-  List of the 24 best rated search results

Each result should contain the following attributes:

-  Product code
-  Name of a product
-  Image URL
-  Price with VAT
-  Number of pieces in stock
-  Rating in percent

The output can be saved to a file or it can be output.

## Installation
Simply clone the repository and run

`npm init`

## Running the project

`npm start <search query>`

