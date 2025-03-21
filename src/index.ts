import ServerlessHttp from 'serverless-http'
import express from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import cors from 'cors'
const serverless = ServerlessHttp

const app = express()
app.use(cors())


// Create an S3 client
const s3 = new S3Client({ region: 'us-east-1' })

app.get('/', (req, res) => {
  console.log('HERE IN THE FIRST GET')
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
app.get('/generate-presigned-url', async (req, res) => {
  const { fileName, fileType } = req.query
  // Set up the parameters for the pre-signed URL
  const contentType = typeof fileType === 'string' ? fileType : undefined
  const params = {
    Bucket: 'km-expense-tracker-receipts',
    Key: `uploads/${Date.now()}_${fileName}`,
    ContentType: contentType,
  }
  console.log('Pre-signing Params:', JSON.stringify(params))

  try {
    // Generate a pre-signed URL
    const command = new PutObjectCommand(params)
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }) // URL expires in 60 seconds
    console.log('URL', await url)
    // Send the pre-signed URL to the client
    res.json({ url })
  } catch (error) {
    console.error('Error generating pre-signed URL:', error)
    res.status(500).json({ error: 'Error generating pre-signed URL' })
  }
})

export const handler = async (event:any, context:any) => {
    console.log('Lambda is invoked')
  console.log('Event:', JSON.stringify(event, null, 2)) // Log the event to CloudWatch
  return serverless(app)(event, context)
}
//export const handler = serverless(app)