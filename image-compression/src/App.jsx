import React, { useState } from 'react'

const App = () => {
  const [imgPathList, setImgPathList] = useState([])

  function onFileSelect(evt) {
    var filesArr = evt.target.files
    console.log('filesArr', filesArr)

    for (const file of filesArr) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => calculateImage(e, file)
    }

    if (filesArr === undefined || filesArr.length === 0) return
  }
  const calculateImage = (e, file) => {
    var img = document.createElement('img')
    console.log('e', e)
    img.src = e.target.result
    var canvas = document.createElement('canvas')
    //var ctx = canvas.getContext("2d");
    //ctx.drawImage(img, 0, 0);
    img.onload = function (i) {
      console.log('i', i)
      console.log('img', img.width)
      var MAX_WIDTH = 400
      var MAX_HEIGHT = 400
      var width = img.width ? img.width : MAX_WIDTH //not getting img width so ternary operator
      var height = img.height ? img.height : MAX_HEIGHT //not getting img height so ternary operator

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }
      canvas.width = width
      canvas.height = height
      var ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      var dataurl = canvas.toDataURL(file.type)
      setImgPathList((prev) => {
        console.log('prev', prev)
        return prev.concat(dataurl)
      })
    }
  }
  return (
    <div>
      <div>
        <input
          type='file'
          multiple
          accept='.png,.jpg,.jpeg'
          onChange={onFileSelect}
        />
      </div>
      {imgPathList
        ? imgPathList.map((imgPath, idx) => (
            <img key={idx} src={imgPath} alt='' />
          ))
        : null}
    </div>
  )
}

export default App
