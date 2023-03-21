function checkEmailFormat(email) {
    console.log("Email: " + email);
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

module.exports = { checkEmailFormat };
