//MATH HELPERS

 /**
   * Evaluates the passed argument and get its closest unit instead of in decimal points
   * @param {any} quantity The value to be evaluated (e.g. 0.999996966)
   * @returns {string} A string stating its closest unit (e.g just below 1)
   * @this {undefined} 
   * @author Hazel
   * @todo none. complete
   */
export const evalQuantity = function (quantity) {
          if (`${quantity}`.length < 2) return quantity;
          const floorValue = Math.floor(quantity);
          const remainder = `${+quantity.toFixed(1)}`.slice(-1);
          const quotient = `${+quantity.toFixed(1)}`.slice(0,`${floorValue}`.length);
          if (+remainder < 5) {
            if (+quotient > 0) return `just above ${floorValue}`;
            if (+quotient <= 0) return "less than half";
          }
          if (+remainder === 5) {
            if(+quotient > 0) return `${floorValue} and a half`;
            if (+quotient <= 0) return "half";
          }
          if (+remainder > 5) {
            if (+quotient > 0) return `just below ${floorValue + 1}`;
            if (+quotient <= 0) return "just below 1";
          }

        }
        
//AJAX HELPERS

 /**
   * Asyncronous timeout function that resolves after a provided time
   * @param {Number} seconds. the amount of time to wait for
   * @returns {Number} A value that was resolved from the promise
   * @this {undefined} 
   * @author Hazel
   * @todo none. complete
   */
export const wait = function (seconds) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(seconds);
		}, seconds * 1000);
	});
};



import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
