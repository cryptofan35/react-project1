

export const getUpdatedValues = (initial, current) => {
  const obj = {};
  
  for (const key in current) {
    
    if (current.hasOwnProperty(key) && initial.hasOwnProperty(key) && !Object.keys(obj).length) {
      
      if (current[key] !== initial[key]) {
        obj[key] = current[key];
      }
    }
  }
  
  return Object.keys(obj).length ? obj : null;
};

export const removeEmptyObject = (obj)=>obj.filter(value => Object.keys(value).length);

export const removeItemFromObject = (key,object) =>{
  const newObj = {...object};
  delete newObj[key];
  
  return newObj;
}