const { body } = require('express-validator');

module.exports = [
                body('phone_number')
                    .exists()
                    .trim()
                    .escape()
                    .isNumeric({no_symbols: true})
                    .withMessage('Valid phone number is required'),
                body('email')
                    .exists()
                    .trim()
                    .escape()
                    .isEmail()
                    .withMessage('Valid email is required'),
                body('password')
                    .exists()
                    .isString()
                    .trim()
                    .escape()
                    .isLength({ min: 6, max: 16 })
                    .withMessage('Password is required')
];