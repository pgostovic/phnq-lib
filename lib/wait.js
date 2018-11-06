export const wait = async millis =>
  new Promise(resolve => {
    setTimeout(resolve, millis);
  });
