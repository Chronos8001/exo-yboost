exports.success = (message, data) => {
    return {message, data};
};

exports.error = (message, data = null) => {
    return {message, data, error: true};
};

