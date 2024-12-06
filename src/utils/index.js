export const responseFormatter = ({
  success,
  message,
  data,
  meta,
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
    meta,
    results: data || null,
  };
};

export const returnResponse = (data, meta, message) => {
  return responseFormatter({
    success: true,
    message,
    data,
    meta,
  });
};

export const returnError = (message, code) => {
  return responseFormatter({
    success: false,
    errorMessage: message || "Internal server error",
    errorCode: code || 500,
  });
};
