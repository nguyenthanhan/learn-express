const getHomepage = (req, res) => {
  res.render("home.ejs");
};

const getAbout = (req, res) => {
  res.send("About Page");
};

export { getHomepage, getAbout };
