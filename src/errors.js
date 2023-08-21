module.exports = {
    usernameRequired: new Error('Username is required'),
    emailRequired: new Error('Email is required'),
    passwordRequired: new Error('Password is required'),
    emailIsUnique: new Error('Email not available'),
    invalidCredentials: new Error('Invalid credentials'),
    invalidID: new Error('Invalid ID'),
    unauthorized: new Error('Unauthorized operation'),
    reserveNotAllowed: new Error('Reserve not allowed'),
    houseNotAvailable: new Error('House is not available')
}