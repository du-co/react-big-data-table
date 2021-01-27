const find = (arr: any[], test: any, key?: any) => {
  if (typeof key !== 'undefined' && key !== null) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][key] === test) {
        return arr[i]
      }
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === test) {
        return arr[i]
      }
    }
  }
}

const filter = (arr: any[], fn: (_: any) => boolean) => {
  const results = []
  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i])) {
      results.push(arr[i])
    }
  }
  return results
}

export default {
  find,
  filter,
}
