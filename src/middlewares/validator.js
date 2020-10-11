import validationHelpers from '../utilities/validationHelpers';
import { emailRegex, passwordRegex, articleRegex } from '../utilities/regexen';

const { checkForEmptyFields, checkPatternedFields } = validationHelpers;

export default {
  auth: (req, res, next) => {
    const errors = [];
    const {
      first_name, phone, password, email, last_name,
    } = req.body;

    if (req.path.includes('signup')) {
      errors.push(...checkForEmptyFields('First Name', first_name));
      errors.push(...checkForEmptyFields('Last Name', last_name));
      errors.push(...checkForEmptyFields('Phone', phone));
      errors.push(...checkForEmptyFields('Email', email));
      errors.push(...checkForEmptyFields('Password', password));
    }
    errors.push(...checkPatternedFields('Email address', email, emailRegex));
    errors.push(...checkPatternedFields('Password', password, passwordRegex));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }
    return next();
  },
  product: (req, res, next) => {
    const errors = [];
    const { name,  imageurl} = req.body;

    errors.push(...checkForEmptyFields('Product name', name));
    errors.push(...checkForEmptyFields('Product image', imageurl));

    if (errors.length) {
      return res.jsend.error({
        message: 'Your request contain errors',
        data: errors,
      });
    }
    return next();
  },
  checkProductIdParams: (req, res, next) => {
    const { params: { productId } } = req;
    const parsedNumber = parseInt(productId, 10);
    const isInteger = Number.isInteger(parsedNumber);
    const isGreaterThanZero = parsedNumber > 0;

    if (isInteger && isGreaterThanZero) return next();
    return res.jsend.error('ID must be an integer greater than zero');
  },
};
