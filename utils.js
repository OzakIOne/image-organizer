const MAINSTREAM_RATIO = {
  ratio16_9: 16 / 9,
  ratio4_3: 4 / 3,
  ratio1: 1,
  ratio9_16: 9 / 16,
  ratio3_4: 3 / 4,
};

const getKeyByValue = (object, value) =>
  Object.keys(object).find((key) => object[key] === value);

const getClosestRatio = ({ width, height }) =>
  Object.values(MAINSTREAM_RATIO).reduce((a, b) =>
    Math.abs(b - width / height) < Math.abs(a - width / height) ? b : a,
  );

export { getKeyByValue, getClosestRatio, MAINSTREAM_RATIO };
