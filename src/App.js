import "./styles.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button } from "@chakra-ui/react";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import { Alert, AlertIcon, Avatar, Wrap } from "@chakra-ui/react";

export default function App() {
  const [file, setFile] = useState();
  const [isFieldEmpty, setIsFieldEmpty] = useState(false);
  const [isAvatar, setIsAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsFieldEmpty(false);
    }
  }
  async function checkServer() {
    const { data } = await axios.get("https://cerulean-ant-slip.cyclic.app/");
    console.log(data);
  }
  useEffect(() => {
    checkServer();
  }, []);
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
        <FormControl>
          <FormLabel>Profile Upload</FormLabel>
          <Input size="md" onChange={handleChange} type="file" name="profile" />
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
      {isFieldEmpty && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          Please fill in the required field.
        </Alert>
      )}
    </div>
  );
}
