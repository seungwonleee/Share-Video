import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { dbService, storageService } from "../../fire_module/fireMain";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
// Material UI Imports
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const Section = styled.section`
  max-width: 700px;
  margin: 2rem auto;
  height: 80vh;
`;

const Title = styled.div`
  text-align: center;
  margin: 2rem;
  h1 {
    font-size: ${(props) => props.theme.fontSizes.titleSize};
  }
`;

const DropzoneBox = styled.div`
  width: 300px;
  height: 240px;
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    background: black;
    width: 300px;
    height: 240px;
  }
  video {
    width: 300px;
    height: 240px;
  }
  p {
    font-size: ${(props) => props.theme.fontSizes.base};
  }
`;

const VideoDescription = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 2rem;
  label {
    margin-top: 2rem;
    font-size: ${(props) => props.theme.fontSizes.base};
    margin: 0 2rem;
  }
  input {
    height: 3rem;
    font-size: ${(props) => props.theme.fontSizes.base};
    border: solid 1px lightgray;
    margin: 0 2rem;
    &:focus {
      transition: 0.5s;
      outline: none;
      border: solid 1px #a5292a;
    }
  }
  textArea {
    height: 6rem;
    font-size: ${(props) => props.theme.fontSizes.base};
    border: solid 1px lightgray;
    margin: 0 2rem;
    &:focus {
      transition: 0.5s;
      outline: none;
      border: solid 1px #a5292a;
    }
  }
  div {
    display: flex;
    flex-direction: column;
    max-width: 200px;
  }
  select {
    height: 3rem;
    font-size: ${(props) => props.theme.fontSizes.base};
    border: solid 1px lightgray;
    margin: 0 2rem;
    &:focus {
      transition: 0.5s;
      outline: none;
      border: solid 1px #a5292a;
    }
  }
  Button {
    margin: 3rem 2rem;
    span {
      font-size: ${(props) => props.theme.fontSizes.base};
    }
  }
`;

//?????? ??????
const Catogory = [
  { label: "" },
  { label: "?????????" },
  { label: "???????????????" },
  { label: "??????" },
  { label: "??????" },
  { label: "??????" },
  { label: "?????????" },
  { label: "??????" },
  { label: "SF" },
  { label: "??????" },
];

const VideoUploadPage = () => {
  const breakPoint = useMediaQuery({
    query: "(min-width:768px)",
  });
  let history = useHistory();

  //?????? ???????????? ?????? ??????
  const uid = useSelector((state) => state.auth.uid);
  const email = useSelector((state) => state.auth.email);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [cost, setCost] = useState("");

  // ????????????
  const [preview, setPreview] = useState("");

  const handleChangeTitle = (event) => {
    setTitle(event.currentTarget.value);
  };

  const handleChangeDecsription = (event) => {
    setDescription(event.currentTarget.value);
  };

  const handleChangeCategory = (event) => {
    setGenre(event.currentTarget.value);
  };

  const handleChangeCost = (event) => {
    // console.log(event.currentTarget.value);
    //????????? ?????? ??????
    setCost(Number(event.currentTarget.value.replace(/[^0-9]/g, "")));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (
      title === "" ||
      description === "" ||
      genre === "" ||
      cost === "" ||
      preview === ""
    ) {
      return alert("?????? ????????? ??????????????????.");
    }

    //?????? ???????????? ???????????? ????????? ?????? 2?????? ????????? ???????????? ??????
    const count = await storageService.ref().child(uid).listAll();
    // console.log(count._delegate.items.length);
    if (count._delegate.items.length >= 3) {
      return alert("????????? ?????? 2????????? ????????? ??? ????????????.");
    }

    //?????? ????????? (Firebase Sotrage ??? FireStore DB??? ?????? ?????? ??????)
    try {
      const fileRef = storageService.ref().child(`${uid}/${title}`);
      const response = await fileRef.putString(preview, "data_url");
      // console.log("????????? ??????", response);
      const downloadURL = await response.ref.getDownloadURL();
      // console.log("??????????????? URL", downloadURL);
      if (downloadURL) {
        //FireStore DB??? ????????? video ?????????
        const video = {
          creatorUid: uid,
          email: email,
          title: title,
          description: description,
          genre: genre,
          cost: cost,
          createdAt: Date.now(),
          downloadURL: downloadURL,
        };
        // console.log("FireStore ?????? ?????? ===> ", video);

        await dbService
          .collection(uid)
          .doc("video")
          .collection(uid)
          .doc(title)
          .set(video);
      }
      history.push("/individualwork");
      alert("???????????? ??????????????????.");
    } catch (error) {
      console.log(error);
      return alert("????????? ???????????? ??????????????????. ????????? ??????????????????.");
    }
  };

  const onDrop = (files) => {
    const theFile = files[0];
    // console.log(theFile);

    if (theFile.size >= 200000000) {
      return alert("????????? ?????? ?????? ????????? ???????????? ???????????????.");
    }

    if (theFile.type !== "video/mp4") {
      return alert("mp4 ????????? ????????? ???????????????.");
    }

    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      //????????? ???????????? ??????
      setPreview(finishedEvent.currentTarget.result);
    };
    reader.readAsDataURL(theFile);
  };

  return (
    <Section>
      <Title>
        <h1> ?????? ??????, ????????????</h1>
      </Title>

      <form onSubmit={onSubmit}>
        {breakPoint ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000}>
              {({ getRootProps, getInputProps }) => (
                <DropzoneBox {...getRootProps()}>
                  <input {...getInputProps()} />
                  <AddIcon style={{ fontSize: "3rem" }} />
                </DropzoneBox>
              )}
            </Dropzone>

            {preview && (
              <PreviewBox>
                <div>
                  <video src={preview} controls></video>
                </div>
                <p>?????? ????????????</p>
              </PreviewBox>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {preview ? (
              <></>
            ) : (
              <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000}>
                {({ getRootProps, getInputProps }) => (
                  <DropzoneBox {...getRootProps()}>
                    <input {...getInputProps()} />
                    <AddIcon style={{ fontSize: "3rem" }} />
                  </DropzoneBox>
                )}
              </Dropzone>
            )}

            {preview && (
              <PreviewBox>
                <div>
                  <video src={preview} controls></video>
                </div>
                <p>?????? ????????????</p>
              </PreviewBox>
            )}
          </div>
        )}

        <VideoDescription>
          <label>??????</label>
          <input onChange={handleChangeTitle} value={title} />

          <label>??????</label>
          <textarea onChange={handleChangeDecsription} value={description} />

          <div>
            <label>??????</label>
            <select onChange={handleChangeCategory}>
              {Catogory.map((item, index) => (
                <option key={index} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>

            <label>??????</label>
            <input
              placeholder="??? ????????? ???????????????."
              value={cost}
              onChange={handleChangeCost}
            />
          </div>

          <Button
            variant="contained"
            type="primary"
            size="large"
            onClick={onSubmit}
          >
            <span>????????????</span>
          </Button>
        </VideoDescription>
      </form>
    </Section>
  );
};

export default VideoUploadPage;
