export function debounce (func: () => void, delay: number, ctx: any) {
  let timeout: any;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(ctx);
    }, delay);
  };
}
