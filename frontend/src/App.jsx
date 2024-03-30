import React, { useState } from 'react'
import axios from 'axios'
const App = () => {

  const [image, setImage] = useState({ preview: '', data: '' })
  // const [status, setStatus] = useState('')
  const [captions, setcaptions] = useState([]);
  const[loading,setloading] = useState(false)
  const [err,seterr] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault()
    setloading(true);
    seterr('')
    setcaptions([])
    let formData = new FormData()
    formData.append('file', image.data)
    axios.post('http://localhost:5000/image', formData)
      .then((res) => {
        setloading(false);
        seterr('')
        setcaptions(res.data.captions)
      })
      .catch(err=>{
        setloading(false)
        seterr(err.response.data.message)
      });

  }

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    }
    setImage(img)
  }

  return (
    <>
      <div className='flex justify-center items-center w-full my-10'>
        {image.preview && <img src={image.preview} width='350' height='350' />}

      </div>
      <form onSubmit={handleSubmit}>

        <div className="flex flex-col items-center justify-center w-1/2 mx-auto">
          <label htmlFor="dropzone-file" className="flex flex-col items-center my-5 justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">JPG </p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
          </label>
          <button type="submit" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Submit</button>
          {/* <button type='submit'>Submit</button> */}
        </div>

      </form>

      {/* {loading && <div>Loading !!!</div>} */}

      {
        err && <div className='flex justify-center items-center text-white text-lg my-10'>{err}</div>
      }
      {loading && <div className='flex justify-center items-center'><img src="/animation.gif" alt="" /></div>}

      {captions.length !== 0 &&
        <div className='flex flex-col my-10 justify-start items-center'>
          <div className='text-2xl mb-5 font-bold text-white'>Captions : </div>

          <div className='flex flex-col'>

            {captions.map((cap, i) => (
              <div className='flex flex-col my-2'>
                <div className='text-white'>{i+1}. {cap.caption}</div>
                <div className='flex'>
                  {cap.hashtags.map((hash, i) => (
                    <div className='italic me-4 px-2 py-0 border rounded-xl my-1 bg-gray-300'>#{hash}</div>

                  ))}
                </div>

              </div>
            ))
            }
          </div>
        </div>

      }

    </>
  )
}

export default App