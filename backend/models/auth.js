const User = require("./user");

const BAD_CODE_ERROR = 400;

const SUCCESS_RES = 200;

const ERRORS = {
  username: "Email invalide",
  logName: "Nom d'utilisateur invalide",
  password: "Mot de passe incorrect",
  desk: "Désk invalide",
  profile: "Profile invalide",
  userInExist: "Invalide id",
};

class Auth {
  constructor() {
    this.loggedUsers = [];
    this.users = [];
  }

  async allUsers() {
    const users = await User.find({});

    return {
      code: SUCCESS_RES,
      value: users.map((user) => {
        const userRow = { ...user._doc };

        return userRow;
      }),
    };
  }

  getRandomNumberFromArray(array) {
    // Generate a random index within the range of the array length
    const randomIndex = Math.floor(Math.random() * array.length);

    // Return the element at the randomly generated index
    return array[randomIndex];
  }

  async createUser({
    username,
    logName,
    password,
    imgProfile,
    role = "agent",
  }) {
    if (!username) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "username",
            errors: [ERRORS.username],
          },
        ],
      };
    }

    if (!logName) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "logName",
            errors: [ERRORS.logName],
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

    try {
      const newUser = await User.register(
        new User({
          username,
          logName,
          role,
          email: username,
          imgProfile,
        }),
        password
      );

      delete newUser.hash;

      delete newUser.salt;

      return {
        code: SUCCESS_RES,
        value: newUser,
      };
    } catch (error) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "email",
            errors: [ERRORS.username],
          },
          {
            name: "username",
            errors: [ERRORS.logName],
          },
          {
            name: "password",
            errors: [ERRORS.password],
          },
        ],
      };
    }
  }

  loginFailed() {
    return {
      code: BAD_CODE_ERROR,
      errors: [
        {
          name: "username",
          errors: [ERRORS.username],
        },
        {
          name: "password",
          errors: [ERRORS.password],
        },
      ],
    };
  }

  assignDesk() {
    const deskNumbersAssigned = this.loggedUsers.map((usr) => usr.desk);

    const totalDeskNumbers = Array.from(
      String(process.env.TOTAL_DESKS),
      Number
    );

    const filteredArrayDesk = totalDeskNumbers.filter(
      (num) => !deskNumbersAssigned.includes(num)
    );

    if (!filteredArrayDesk.length) {
      return null;
    }

    return this.getRandomNumberFromArray(filteredArrayDesk);
  }

  getAuthenticatedUser(authUser, isAuthenticated) {
    if (!isAuthenticated) {
      if (authUser && Object.keys(authUser).length) {
        this.loggedUsers.filter((usr) => usr?.username !== authUser?.username);
      }

      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "profile",
            errors: [ERRORS.profile],
          },
        ],
      };
    }

    const existedUser = this.loggedUsers.find(
      (user) => user.username === authUser?.username
    );

    if (existedUser) {
      return {
        code: SUCCESS_RES,
        value: existedUser,
      };
    }

    const randomDeskNumber = this.assignDesk();

    if (!randomDeskNumber) {
      return {
        code: BAD_CODE_ERROR,
        errors: [{ name: "desk", errors: [ERRORS.desk] }],
      };
    }

    const authenticatedUser = {
      id: authUser._id,
      username: authUser.username,
      logName: authUser.logName,
      role: authUser.role,
      imgProfile: authUser.imgProfile,
      desk: randomDeskNumber,
    };

    this.loggedUsers.push(authenticatedUser);

    return {
      code: SUCCESS_RES,
      value: authenticatedUser,
    };
  }

  login(user) {
    const existedUser = this.getAuthenticatedUser(user, true);

    if (existedUser.code === SUCCESS_RES) return existedUser;

    const randomDeskNumber = this.assignDesk();

    if (!randomDeskNumber) {
      return {
        code: BAD_CODE_ERROR,
        errors: [{ name: "desk", errors: [ERRORS.desk] }],
      };
    }

    const updatedUser = {
      username: user.username,
      role: user.role,
      logName: user.logName,
      desk: randomDeskNumber,
      id: user._id,
    };

    this.loggedUsers.push(updatedUser);

    return {
      code: SUCCESS_RES,
      value: updatedUser,
    };
  }

  async getUser(id) {
    try {
      const user = await User.findById(id);

      if (!user) {
        return {
          code: BAD_CODE_ERROR,
          errors: [{ name: "userInExist", errors: [ERRORS.userInExist] }],
        };
      }

      return {
        code: SUCCESS_RES,
        value: user,
      };
    } catch (error) {
      return {
        code: BAD_CODE_ERROR,
        errors: [{ name: "userInExist", errors: [ERRORS.userInExist] }],
      };
    }
  }

  async deleteUser(id) {
    try {
      const deletedUser = await User.findByIdAndRemove(id);

      if (!deletedUser) {
        return {
          code: BAD_CODE_ERROR,
          errors: [{ name: "userInExist", errors: [ERRORS.userInExist] }],
        };
      }

      return {
        code: SUCCESS_RES,
        value: deletedUser,
      };
    } catch (error) {
      return {
        code: BAD_CODE_ERROR,
        errors: [{ name: "userInExist", errors: [ERRORS.userInExist] }],
      };
    }
  }

  async updateUser(userData) {
    try {
      if (userData?.username === process.env.ADMIN_EMAIL) {
        throw new Error("user admin from config");

        return;
      }

      const updatedUser = await User.findByIdAndUpdate(userData.id, userData, {
        new: true,
      });

      if (!updatedUser) {
        return {
          code: BAD_CODE_ERROR,
          errors: [{ name: "userInExist", errors: [ERRORS.userInExist] }],
        };
      }

      return {
        code: SUCCESS_RES,
        value: updatedUser,
      };
    } catch (error) {
      return {
        code: BAD_CODE_ERROR,
        errors: [{ name: "userInExist", errors: [ERRORS.userInExist] }],
      };
    }
  }
}

module.exports = Auth;
