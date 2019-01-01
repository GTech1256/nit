// jest.enableAutomock();

const res = {
  status(status) {
    return {
      json: (text) => ({
        ['Status Code']: status,
        body: JSON.stringify(text)
      })
    }
  },
  ...jest.fn()
};

module.exports = res;
