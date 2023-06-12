const users = require("../data/user.json");

const BAD_CODE_ERROR = 400;

const ERRORS = {
  email: "Email invalide",
  name: "Nom d'utilisateur invalide",
  password: "Mot de passe incorrect",
  desk: "Désk invalide",
};

class Auth {
  constructor() {
    this.users = users;
  }

  get allUsers() {
    return {
      code: 200,
      value: this.users.map((user) => {
        const userRow = { ...user };

        delete userRow.password;

        return userRow;
      }),
    };
  }

  createUser(email, name, desk, password) {
    const newUser = { id: this.users.length + 1, email, name, desk, password };

    if (!email) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "email",
            errors: [ERRORS.email],
          },
        ],
      };
    }

    if (!name) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "name",
            errors: [ERRORS.name],
          },
        ],
      };
    }

    if (!desk) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "desk",
            errors: [ERRORS.desk],
          },
        ],
      };
    }

    if (!password) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "password",
            errors: [ERRORS.password],
          },
        ],
      };
    }

    this.user.push(newUser);

    delete newUser.password;

    return {
      code: 200,
      value: newUser,
    };
  }

  login(email, password) {
    const user = this.users.find((user) => user.email === email);
    const passwordError = {
      name: "password",
      errors: [ERRORS.password],
    };

    if (!user) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "email",
            errors: [ERRORS.email],
          },
          passwordError,
        ],
      };
    }

    if (user.password !== password) {
      return {
        code: BAD_CODE_ERROR,
        errors: [passwordError],
      };
    }

    return {
      code: 200,
      value: user,
    };
  }
}

module.exports = Auth;
