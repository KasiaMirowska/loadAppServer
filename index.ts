import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors';

const app = express()

app.use(cors());

console.log('AAPPPPP', app)

app.listen(8080, () => {
  console.log('HERE IN SERVER_ HELLO!')
})

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'Hello from our server!' })

  //mocked long response:
  // req.setTimeout(20000, () => {
  //   res.status(504).send({message:'Request times out'})
  // })

  // setTimeout(() => {
  //   res.send({message:'Hello from our server!'})
  // }, 15000)

  //mocked error
  //res.status(500).send({ error: 'something blew up' })
})
