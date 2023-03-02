export function getRandomInt(num1 = Infinity, num2 = 0) {
  const maxNum = Math.max(num1, num2)
  const minNum = Math.min(num1, num2)

  const range = maxNum - minNum

  return Math.floor(Math.random() * range + minNum)
}
