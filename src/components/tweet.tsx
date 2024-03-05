import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../routes/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  /* height: 150px; */
  /* grid-template-rows: 2fr 1fr; */
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div`
  &:nth-child(even) {
    justify-self: center;
    align-self: baseline;
    /* place-self: center; */
  }
`;
const Row = styled.div`
  /* display: grid;
  grid-template-rows: 2fr; */
  /* justify-content: space-between; */
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const EditingArea = styled.textarea`
  margin: 10px;
  margin-left: 0px;
  padding: 10px;
  border: 1px solid white;
  border-radius: 10px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  /* height: 100%; */
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  margin-right: 5px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: cadetblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  background-color: cornflowerblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: lightgray;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-right: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const AttachEditedFileButton = styled.label`
  /* width: 100%; */
  /* align-content: end; */
  background-color: seagreen;
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  /* text-align: center; */
  border-radius: 5px;
  cursor: pointer;
`;
const AttachEditedFileInput = styled.input`
  display: none;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [editing, isEditing] = useState(false);
  const [newtweet, setNewTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  //   const [isEdited, setIsEdited] = useState(false);
  //   let isEdited = false;
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onEdit = () => {
    isEditing(true);
    console.log(tweet);
    console.log(`Edit state?: ${editing}`);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };

  const onEditedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(`file: ${file}`);
    const { files } = e?.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmit = async () => {
    // isEdited = true;
    // setIsEdited(true);
    isEditing(false);
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: newtweet ? newtweet : tweet,
        // photo: file ? file : ,
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc(db, "tweets", id), {
          photo: url,
        });
        // await deleteDoc(doc(db, "tweets", id));

        console.log(`photo: `, photo);
        setFile(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    isEditing(false);
    photo ? console.log(`photo: ${photo}`) : null;
  };

  return (
    <Wrapper>
      <Column>
        <Username>
          {username}
          {/* {isEdited ? "수정됨🖋" : ""} */}
        </Username>
        {editing ? (
          <EditingArea
            required
            rows={2}
            maxLength={180}
            onChange={onChange}
            value={newtweet}
            placeholder={tweet}></EditingArea>
        ) : (
          <Payload>{tweet}</Payload>
        )}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
      <Column>
        {editing ? null : user?.uid === userId ? (
          <EditButton onClick={onEdit}>Edit</EditButton>
        ) : null}
        {editing ? null : user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
        {editing ? (
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
        ) : null}
        {editing ? (
          <ConfirmButton onClick={onSubmit}>Confirm</ConfirmButton>
        ) : null}
      </Column>
      <Column>
        {editing ? (
          <>
            <AttachEditedFileButton htmlFor="editfile">
              {file ? "Photo Added ✅" : "Add photo"}
            </AttachEditedFileButton>
            <AttachEditedFileInput
              onChange={onEditedFileChange}
              type="file"
              id="editfile"
              accept="image/*"
            />
          </>
        ) : null}
      </Column>
    </Wrapper>
  );
}
