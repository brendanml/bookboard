import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

const MyDropzone = () => {
  const [profilePic, setProfilePic] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    setProfilePic({
      ...acceptedFiles[0],
      preview: URL.createObjectURL(acceptedFiles[0]),
    })
    console.log(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className="relative h-64 w-64 ">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed border-gray-300  absolute hover:z-10",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {profilePic && (
        <img
          src={profilePic.preview}
          alt="preview"
          className="absolute rounded-full h-64 w-64 object-cover"
        />
      )}
    </div>
  )
}

export default MyDropzone
