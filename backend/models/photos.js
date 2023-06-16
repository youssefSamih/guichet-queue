const ImageModel = require("./image-schema");

const BAD_CODE_ERROR = 400;

const SUCCESS_RES = 200;

const ERRORS = {
  file: "Error while uploading file",
  notFound: "File not found",
};

class Photos {
  constructor() {}

  async uploadImage(file) {
    if (!file)
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "file",
            errors: [ERRORS.file],
          },
        ],
      };

    try {
      const newImage = new ImageModel({
        name: file.originalname,
        path: file.path,
      });

      const image = await newImage.save();

      return {
        code: SUCCESS_RES,
        value: {
          imgUrl: `http://localhost:4000/file/${image._id}`,
        },
      };
    } catch (error) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "file",
            errors: [ERRORS.file],
          },
        ],
      };
    }
  }

  async getImage(fileId) {
    try {
      const file = await ImageModel.findById(fileId);

      return {
        code: SUCCESS_RES,
        value: file,
      };
    } catch (error) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "notFound",
            errors: [ERRORS.notFound],
          },
        ],
      };
    }
  }

  async deleteImage(fileId) {
    try {
      const file = await ImageModel.findByIdAndRemove(fileId);

      return {
        code: SUCCESS_RES,
        value: file,
      };
    } catch (error) {
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "notFound",
            errors: [ERRORS.notFound],
          },
        ],
      };
    }
  }
}

module.exports = Photos;
