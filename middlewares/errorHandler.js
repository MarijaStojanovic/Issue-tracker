module.exports = () => (err, req, res, next) => {
  let message;
  let errorCode;
  let status;
  switch (err.message) {
    case 'No authorization token was found':
      message = 'No authorization token was found';
      status = 401;
      errorCode = 1;
      break;
    case 'MissingParamsError':
      message = 'Missing parameters';
      status = 400;
      errorCode = 2;
      break;
    case 'NotAcceptable':
      status = 406;
      message = 'Not acceptable';
      errorCode = 3;
      break;
    case 'NotFound':
      status = 404;
      message = 'Not Found';
      errorCode = 4;
      break;
    case 'Forbidden':
      status = 403;
      message = 'Insufficient privileges';
      errorCode = 5;
      break;
    case 'BadRequest':
      status = 400;
      message = 'Bad Request';
      errorCode = 6;
      break;
    case 'CredentialsError':
      status = 401;
      message = 'Wrong credentials';
      errorCode = 7;
      break;
    case 'ValidEmailError':
      status = 400;
      message = 'Please fill a valid email address';
      errorCode = 8;
      break;
    case 'DuplicateEmailError':
      status = 406;
      message = 'This email address is already registered';
      errorCode = 0;
      break;
    case 'FileUploadError':
      message = 'Something went wrong during file upload.';
      errorCode = 10;
      status = 400;
      break;
    case 'jwt expired':
      message = 'Token has expired';
      errorCode = 11;
      status = 401;
      break;
    case 'jwt malformed':
      status = 401;
      message = 'Malformed jwt';
      errorCode = 12;
      break;
    default:
      status = 500;
      errorCode = 0;
      message = 'Oops, an error occurred';
      break;
  }

  res.status(status).send({
    status,
    errorCode,
    message,
  });
};
