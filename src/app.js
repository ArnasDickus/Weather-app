const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const port = process.env.PORT || 3000;
// Define paths for Express config.
const settings = {
  viewEngine: "hbs",
  publicDirectory: path.join(__dirname, "../public"),
  viewsFolder: path.join(__dirname, `../templates/views`),
  partialsFolder: path.join(__dirname, `../templates/partials`),
  staticFolder: path.join(__dirname, "./src/html")
};

app.set("view engine", settings.viewEngine);
app.set("views", settings.viewsFolder);
hbs.registerPartials(settings.partialsFolder);

app.use(express.static(path.join(settings.publicDirectory)));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather ",
    name: "Arnas Dičkus"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About ",
    name: "Arnas Dičkus"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "This is help message",
    title: "Help",
    name: "Arnas Dičkus"
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Arnas Dičkus",
    errorMessage: "Help article not found."
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide adress"
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        // Returning stops the chain from executing forecast.
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return console.log(error);
        }
        res.send({
          forecast: forecastData,
          location: location,
          address: req.query.address
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }

  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Arnas Dičkus",
    errorMessage: "Page not found"
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
