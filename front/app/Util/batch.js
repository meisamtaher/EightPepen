
export let batch = async (fns, concurrency = 10, retry = true) => {
  let semaphore = createSemaphore(concurrency)
  for (let fn of fns) {
    do {
      try {
        await semaphore.wait()
        await fn()
        break
      } catch (e) {
        console.log('error in batch')
        console.log(e)
      } finally {
        semaphore.signal()
      }
    } while (retry)
  }
}

let createSemaphore = count => {
  let resolvers = []
  return {
    wait: async () => {
      if (count > 0)
        count--
      else
        await new Promise(r => resolvers.push(r))
    },
    signal: () => {
      if (resolvers.length)
        resolvers.shift()()
      else
        count++
    }
  }
}
