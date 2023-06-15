const BAD_CODE_ERROR = 400;

const SUCCESS_RES = 200;

const ERRORS = {
  file: "Error while uploading file",
};

class Photos {
  constructor() {}

  uploadImage(file) {
    if (req.file === undefined)
      return {
        code: BAD_CODE_ERROR,
        errors: [
          {
            name: "file",
            errors: [ERRORS.file],
          },
        ],
      };

    const imgUrl = `http://localhost:${process.env.PORT}/file/${file.filename}`;

    return {
      code: SUCCESS_RES,
      value: imgUrl,
    };
  }
}

module.exports = Photos;
