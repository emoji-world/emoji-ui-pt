
export
function merge(obj1: any, obj2: any) {
  const isObject = (object: any) =>
    Object.prototype.toString.call(object) === '[object Object]';
  if (isObject(obj1) && isObject(obj2)) {
    const result = { ...obj1 };
    Object.entries(obj2).forEach(([key, value]) =>
      result[key] = merge(result[key], value)
    );
    return result;
  }
  return obj2;
}
