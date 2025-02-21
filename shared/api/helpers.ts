export function simulateApiDelay() {
  const delay = Math.floor(Math.random() * (200 - 80 + 1)) + 80;
  return sleep(delay);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
