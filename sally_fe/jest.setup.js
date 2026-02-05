import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web'
import { MessageChannel, MessagePort } from 'worker_threads'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream
global.TransformStream = TransformStream
global.WritableStream = WritableStream 
global.MessageChannel = MessageChannel
global.MessagePort = MessagePort

class BroadcastChannelPolyfill {
  constructor(name) {
    this.name = name
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}
global.BroadcastChannel = BroadcastChannelPolyfill

const { fetch, Headers, Request, Response } = require('undici')

global.fetch = fetch
global.Headers = Headers
global.Request = Request 
global.Response = Response

import '@testing-library/jest-dom'
const { server } = require('./src/mocks/server')

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())