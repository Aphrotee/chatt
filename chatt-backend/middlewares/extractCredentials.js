const extractCredentials = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(400).json({ error: "Missing Authorization Credentials"})
  } else {
    let details = token.split(' ');

    if (details.length !== 2) {
      res.status(400).json({ error: "There is an error with the Auth Header" });
    } else {
      details = details[1];
      //details = Buffer.from(details, 'base64').toString();

      if (!details.includes(':')) {
        res.status(400).json({ error: "There is an error with the Auth Header" });
      } else {
        details = details.split(':');
        req.email = details[0];
        req.password = details[1];
        next();
      }
    }
  }
}

export default extractCredentials;