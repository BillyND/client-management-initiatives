/**
 * @param {number} time - The time in milliseconds to sleep.
 * @returns {Promise<void>} - A promise that resolves after the specified time.
 */
export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Timer storage object to keep track of debounce timers
const timerDebounce: { [key: string]: NodeJS.Timeout | undefined } = {};

/**
 * Creates a debounced version of the provided function that delays its execution until after
 * the specified time has elapsed since the last time it was invoked.
 *
 * @param func - The function to debounce.
 * @param time - The number of milliseconds to delay.
 * @returns A debounced version of the provided function.
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  time: number
): ((...args: Parameters<T>) => void) => {
  return (...args: Parameters<T>) => {
    // Clear any existing timer for the given function
    clearTimeout(timerDebounce[func.name]);

    // Define the delayed function
    const delayedFunction = () => {
      // Remove the timer entry after execution
      delete timerDebounce[func.name];
      // Invoke the original function with the provided arguments
      return func(...args);
    };

    // Set a new timer or execute immediately if time is 0
    if (time) {
      timerDebounce[func.name] = setTimeout(delayedFunction, time);
    } else {
      delayedFunction();
    }
  };
};
