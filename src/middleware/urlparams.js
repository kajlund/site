export function forwardQuery() {
  // Makes 'urlParams' available in all .njk files
  return (req, res, next) => {
    res.locals.urlParams = req.query;
    next();
  };
}
