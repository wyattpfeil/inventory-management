// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const fs = require("fs")
const app = express();



function getItems() {
  var rawItemsContent = fs.readFileSync('items.json');
  var items = JSON.parse(rawItemsContent);
  return items
}

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  var items = getItems()
  var cleanItems = {}

  for (var item in items) {
    console.log(item)
    cleanItems[items[item].itemName] = items[item].stock
  }
  console.log(cleanItems)

  response.json(cleanItems)
});

app.get("/addStock", (request, response) => {
  var itemId = request.query.itemId
  var items = getItems()
  console.log(items[itemId])
  items[itemId].stock = items[itemId].stock + 1
  var stringifiedItems = JSON.stringify(items, null, 2)
  fs.writeFile("items.json", stringifiedItems, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
  response.json("Stock for " + items[itemId].itemName + " is now " + items[itemId].stock)
});

app.get("/addNewItem", (request, response) => {
  var itemId = request.query.itemId
  var item = request.query.item
  var items = getItems()
  items[itemId] = {itemName : item, stock : 0}
  var stringifiedItems = JSON.stringify(items, null, 2)
  fs.writeFile("items.json", stringifiedItems, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
  response.json("Created " + items[itemId].itemName)
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
