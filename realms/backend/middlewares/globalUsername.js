let globalUsername = 'usuario_hardcoded';

const getUsername = () => globalUsername;
const setUsername = (username) => {
    globalUsername = username;
};

module.exports = {
    getUsername,
    setUsername
};