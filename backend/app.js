const dotenv = require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const { GoogleGenerativeAI } = require("@google/generative-ai");
const port = process.env.PORT || 5000

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

app.use(cors())

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(image, mimeType) {
  // console.log(Buffer.from(JSON.stringify(image)).toString('base64'))
  // console.log(Buffer.from(image).toString('base64'))
  return {
    inlineData: {
      data: image.buffer.toString('base64'),
      // data: Buffer.from(fs.readFileSync(image)).toString('base64'),
      mimeType
    },
  };
}

async function run(image) {
  // For text-and-image input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const prompt = "generate multiple engaging instagram captions along with max 3 hashtags split in array for this image to be uploaded as a post. generate it in the form of json containing captio field and hashtag field for each object.please don't send any other character in your response that will make it difficult to parse your response into JSON";

  const imageParts = [
    // fileToGenerativePart("C:/Users/raksh/OneDrive/Desktop/image1.jpg", "image/jpeg"),
    fileToGenerativePart(image, "image/jpeg"),
  ];

  var data="";

  await model.generateContent([prompt, ...imageParts])
  .then(async(res)=>await res.response)
  .then(res=> {
    console.log(res.text())
     data = JSON.parse(res.text());
    // console.log(data)
  })
  .catch(err=>console.log(err));
  
  return data
}

app.get('/',(req,res)=>{
  res.status(200).send("Welcome to image-caption generator. Please use /image route for function");
})

app.post('/image', upload.single('file'), async function (req, res) {
  var image = req.file;
  console.log(image)
  if(image===undefined){
    res.status(400).json({"message":"Please send an image first !!"})
    return;
  }
  console.log(image.toString("base64"))
  await run(image).then((re)=>{
    console.log(re)
    res.status(200).json({"captions":re})})
  // console.log("response = ",response)
  
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})























