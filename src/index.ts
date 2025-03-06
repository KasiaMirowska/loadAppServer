// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// import { fromIni } from '@aws-sdk/credential-provider-ini'

// dotenv.config()

// const s3 = new S3Client({
//   region: 'us-east-1',
//   credentials: fromIni(),
// })

// const app = express()

// app.use(cors())
// app.use(express.json()) 

// app.get('/', (req, res) => {
//   res.send({ message: 'Hello from our server!' })

//   //mocked long response:
//   // req.setTimeout(20000, () => {
//   //   res.status(504).send({message:'Request times out'})
//   // })

//   // setTimeout(() => {
//   //   res.send({message:'Hello from our server!'})
//   // }, 15000)

//   //mocked error
//   //res.status(500).send({ error: 'something blew up' })
// })

// app.post(
//   '/generate-upload-url',
//   async (
//     req: Request<{}, {}, { fileName: string; fileType: string }>,
//     res: Response
//   ): Promise<void> => {
//     try {
//       const { fileName, fileType } = req.body

//       if (!fileName || !fileType) {
//         res.status(400).json({ error: 'Missing fileName or fileType' })
//         return;
//       }

//       const command = new PutObjectCommand({
//         Bucket: 'km-expense-tracker-receipts',
//         Key: `uploads/${Date.now()}_${fileName}`,
//         ContentType: fileType,
//         ACL: 'public-read',
//       })

//       const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
//       res.json({ uploadUrl })
//     } catch (error) {
//       console.error('Error generating upload URL:', error)
//       res.status(500).json({ error: 'Internal server error' })
//     }
//   }
// )

// app.listen(8080, () => {
//   console.log('HERE IN SERVER_ HELLO!')
// })


// server.js
import express from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import cors from 'cors'

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080  


// Create an S3 client
const s3 = new S3Client({ region: 'us-east-1' });

app.get('/', (req, res) => {
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
  const { fileName, fileType } = req.query;
  // Set up the parameters for the pre-signed URL
  const params = {
    Bucket: 'km-expense-tracker-receipts',
    Key: `uploads/${Date.now()}_${fileName}`,
    ContentType: fileType,
  }
    console.log('Pre-signing Params:', JSON.stringify(params))

  try {
    // Generate a pre-signed URL
    const command = new PutObjectCommand(params)
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // URL expires in 60 seconds
console.log('URL', await url)
    // Send the pre-signed URL to the client
    res.json({ url });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).json({ error: 'Error generating pre-signed URL' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




//{"url":"https://km-expense-tracker-receipts.s3.us-east-1.amazonaws.com/uploads/1741040673068_test.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAVXG6YLL6KUTM5X6E%2F20250303%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250303T222433Z&X-Amz-Expires=60&X-Amz-Signature=0e5bccafc2ca69d3e1fdd97dc5dd8b64a4015ecb77175e451f67f5cec83cca0e&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject"}%    

//https://km-expense-tracker-receipts.s3.us-east-1.amazonaws.com/uploads/1741040739424_Screenshot%202025-03-01%20at%2012.00.36%E2%80%AFPM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAVXG6YLL6KUTM5X6E%2F20250303%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250303T222539Z&X-Amz-Expires=60&X-Amz-Signature=707fba3004c63797dba9be707ce78814186a3ae836e991d9b4fd183710c591ab&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject
//https://km-expense-tracker-receipts.s3.us-east-1.amazonaws.com/uploads/1741041005702_Screenshot%202025-03-01%20at%2012.00.36%E2%80%AFPM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAVXG6YLL6KUTM5X6E%2F20250303%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250303T223005Z&X-Amz-Expires=60&X-Amz-Signature=9f8176206230b04213c1b740b577fd93048193db632a6de11ed1f2a1a5f185c7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject