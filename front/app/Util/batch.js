
export const batch = async (fns, concurrency = 10) => {
  for (let i = 0; i < array.length; i += concurrency)
    await Promise.all(array.slice(i, i + concurrency)).map(fn => fn())
}
