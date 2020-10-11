import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  let token = req.cookies['token']
  if (token === undefined) return res.jsend.error('You have not been authenticated!');

  try {
    const user = jwt.decode(token, process.env.SECRET)
    req.user = user
    return next()
  } catch (error) {
    return res.jsend.error({
      message: 'authentication failed',
      data: error,
    });
  }
};
