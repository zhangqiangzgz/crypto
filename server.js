import Koa from 'koa'
import koaStatic from 'koa-static'
import Router from '@koa/router'
import bodyparser from '@koa/bodyparser'
import { fileURLToPath } from 'url'
import path from 'path'
import { Buffer } from 'node:buffer'
const { scryptSync, randomFillSync, createCipheriv, createDecipheriv } = await import('node:crypto')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const algorithm = 'aes-256-cbc'
// 745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf773
// const key = scryptSync('password', 'salt', 32)
const key = Buffer.from('745731af4484f323968969eda289aeee005b5903ac561e64a5aca121797bf773', 'hex')
// 00000000000000000000000000000000
const iv = Buffer.from('00000000000000000000000000000000', 'hex')

const encrypt = (value) => {
  const cipher = createCipheriv(algorithm, key, iv)
  let encryptedValue = cipher.update(value, 'utf-8', 'base64')
  encryptedValue += cipher.final('base64')
  return encryptedValue
}

const decrypt = (value) => {
  console.log('decryptedValue', value)
  const decipher = createDecipheriv(algorithm, key, iv)
  let decryptedValue = decipher.update(value, 'base64', 'utf-8')
  decryptedValue += decipher.final('utf-8')
  return decryptedValue
}

const app = new Koa()
const router = new Router()
app.use(koaStatic(__dirname))
app.use(bodyparser())
app.use(router.routes()).use(router.allowedMethods())

router.post('/crypto', async (ctx, next) => {
  const { content } = ctx.request.body
  const decrypted = decrypt(content)
  if (decrypted) {
    ctx.body = encrypt('你好，客户端...')
  }
  console.log('decrypted', decrypted)
  next()
})

app.listen(3000, () => {
  console.log(`app is running in http://localhost:3000`)
})