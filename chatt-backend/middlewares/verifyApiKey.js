const verifyApiKey = (req, res, next) => {
  const key = req.header('X-API-Key');
  if (key) {
    if (key === process.env.API_KEY) {
      next();
    } else {
      res.status(403).json({ error: "Invalid API Key" });
    }
  } else {
    res.status(403).json({ error: "No API Key found" });
  }
}

export default verifyApiKey;