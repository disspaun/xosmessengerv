export const removeUndefinedOnes = (data: Record<string, any>) =>
  Object.entries(data)
    .filter(([, value]) => value !== undefined)
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {} as Record<string, any>)
