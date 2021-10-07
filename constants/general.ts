export const console_log = (...arg: any) =>
  console.log(JSON.stringify(arg, null, 2));
