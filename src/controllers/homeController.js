const getHomepage = (req, res) => {
  res.render("sample.ejs");
};

const getAbout = (req, res) => {
  res.send("About Page");
};

export { getHomepage, getAbout };
