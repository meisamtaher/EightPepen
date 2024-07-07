
export const batch = async (fns, concurrency = 10, retry = true) => {
  for (let i = 0; i < fns.length; i += concurrency) {
    await Promise.all(fns.slice(i, i + concurrency).map(async fn => {
      do{
        try {
          await fn()
          break
        } catch (e) {}
      }while (retry)
    }))
  }
}
