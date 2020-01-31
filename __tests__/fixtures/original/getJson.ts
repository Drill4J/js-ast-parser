/* istanbul ignore file */
export const getJSON = <T>(url: string, headers?: { [key: string]: any }) => new Promise<T>((resolve, reject) => {
    const configXhr = new XMLHttpRequest();
    configXhr.open('GET', url, true);
  
    const headersNames = Object.keys(headers);
  
    headersNames.forEach((name) => {
      configXhr.setRequestHeader(name, headers[name]);
    });
    configXhr.setRequestHeader('iii-customer-domain', window.location.host);
  
    configXhr.onreadystatechange = () => {
      if (configXhr.readyState !== 4) {
        return;
      }
      if (configXhr.status === 200) {
        resolve(JSON.parse(configXhr.responseText));
      } else {
        reject();
      }
    };
  
    configXhr.send();
  });
  