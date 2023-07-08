import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Heading } from "@chakra-ui/react";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import { Alert, AlertIcon, Avatar, Wrap } from "@chakra-ui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";

export default function App() {
  const [file, setFile] = useState();
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [isAvatar, setIsAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState("");

  async function uploadFile(event) {
    event.preventDefault();
    // console.log(file);
    if (!file) {
      return setIsFieldEmpty(true);
    } else {
      const payload = new FormData();
      payload.append("profile", file);

      try {
        setIsLoading(true);
        const { data } = await axios.post(
          "https://cerulean-ant-slip.cyclic.app/upload/profile",
          payload
        );
        setIsAvatar(data.url);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  }
  function handleChange(e) {
    // console.log(e.target.files);
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      const imgURL = URL.createObjectURL(e.target.files[0]);
      setPreview(imgURL);
      setIsFieldEmpty(false);
    }
  }
  async function checkServer() {
    const { data } = await axios.get("https://cerulean-ant-slip.cyclic.app/");
    console.log(data);
  }
  function handleDragOver(e) {
    e.preventDefault();
  }
  function handleOnDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (files && files.length) {
      const imgUrl = URL.createObjectURL(files[0]);
      setFile(files[0]);
      setPreview(imgUrl);
      setIsFieldEmpty(false);
    }
  }
  useEffect(() => {
    checkServer();
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="App">
      <Wrap
        display="flex"
        alignItems="center"
        justifyContent="center"
        margin="1rem"
      >
        {isAvatar && <Avatar size="2xl" src={isAvatar} />}
      </Wrap>
      {isAvatar && <a href={isAvatar}>Image Link</a>}

      <form onSubmit={uploadFile}>
        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
        >
          <FormLabel>
            <Heading>Profile Upload</Heading>
          </FormLabel>
          <div
            id="box"
            onDragOver={handleDragOver}
            onDrop={handleOnDrop}
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: preview ? `url(${preview})` : "none",
              display: isAvatar && "none"
            }}
          >
            <label htmlFor="fileInput" style={{ display: preview && "none" }}>
              <Input
                accept="image/*"
                hidden
                size="md"
                onChange={handleChange}
                type="file"
                name="profile"
                id="fileInput"
              />
              <AiOutlineCloudUpload
                size="5em"
                style={{ display: preview ? "none" : "" }}
              />
              <div style={{ display: preview ? "none" : "" }}>
                <p>Drag & Drop</p> <p>OR</p> <p>Click here to upload</p>
              </div>
            </label>
          </div>
          <Button
            type="submit"
            colorScheme="teal"
            variant="solid"
            margin="10px"
            isLoading={isLoading}
          >
            Upload
          </Button>
          <FormHelperText>Image will be uploaded to cloudinary.</FormHelperText>
        </FormControl>
      </form>
      {/* {preview && <img src={preview} alt="preview" />} */}
      {isFieldEmpty && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          Please fill in the required field.
        </Alert>
      )}
    </div>
  );
}
