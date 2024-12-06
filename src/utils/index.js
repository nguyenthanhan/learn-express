export const responseFormatter = ({
  success,
  message,
  data,
  rows,
  errorCode,
  errorMessage,
}) => {
  return {
    success,
    message,
    error: errorMessage
      ? {
          code: errorCode || 400,
          message: errorMessage,
        }
      : undefined,
    rows,
    data: data || null,
  };
};

export const returnResponse = (data, rows, message) => {
  return responseFormatter({
    success: true,
    message,
    data,
    rows,
  });
};

export const returnError = (message, code) => {
  return responseFormatter({
    success: false,
    errorMessage: message || "Internal server error",
    errorCode: code || 500,
  });
};
