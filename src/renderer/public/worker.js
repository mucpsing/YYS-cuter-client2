const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const count = 10
let i = 0

async function test() {
  while (i < count) {
    await sleep(1000)
    console.log(i)
  }
}
