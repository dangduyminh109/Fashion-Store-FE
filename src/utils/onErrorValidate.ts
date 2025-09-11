export default function getLastError(errorsObj: any): string | undefined {
  let lastMessage: string | undefined;
  function traverse(obj: any) {
    if (!obj) return;
    for (const key of Object.keys(obj)) {
      if (obj[key]?.message) {
        lastMessage = obj[key].message;
      } else if (typeof obj[key] === "object") {
        traverse(obj[key]);
      }
    }
  }
  traverse(errorsObj);
  return lastMessage;
}