const randomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXY123456789';
  const charactersLength = characters.length;
  const n = length || 15;
  for (let i = 0; i < n; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return `TASK-${result}`;
};

module.exports = randomString;
