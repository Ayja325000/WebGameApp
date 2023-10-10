/**
 * 
 * @param {{select:string[]|'*'|string, from: string}} options 
 * @returns 
 */
export const mysqlQuery = options => `select ${options.select.toString()} from ${from}`;