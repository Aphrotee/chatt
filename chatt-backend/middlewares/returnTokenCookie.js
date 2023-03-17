const returnTokenCookie = (req, res) => {
  res.cookies('X-Token', req.token);
}

export default returnTokenCookie;