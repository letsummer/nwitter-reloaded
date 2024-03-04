import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import PostTweetForm from "../components/post-tweet-form";
import styled from "styled-components";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  const navigate = useNavigate();
  const logOut = () => {
    auth.signOut();
    navigate("/login");
  };
  return (
    <Wrapper>
      <PostTweetForm></PostTweetForm>
      <Timeline></Timeline>
    </Wrapper>
  );
}
