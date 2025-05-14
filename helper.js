const bcrypt = require('bcrypt');

const saltRounds = 10;
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    cryptPassword = await bcrypt.hash(password, salt);

    return cryptPassword;
}

const comparePassword = async (user, password) => {

    cryptPassword = user.password;
    const match = await bcrypt.compare(password , cryptPassword);
    return match;
}

module.exports= {
    hashPassword,
    comparePassword
}