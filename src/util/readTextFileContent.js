export default function readTextFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(evt) {
      resolve(evt.target.result);
    };
    reader.onerror = function(evt) {
      reject(new Error("There was an error reading the file"));
    };
  });
}
