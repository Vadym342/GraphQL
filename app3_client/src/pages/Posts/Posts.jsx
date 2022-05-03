import React from "react";
import Post from "../../components/Post/Post";
import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query {
    posts {
      title
      content
      user {
        name
      }
  }
  }
`

export default function Posts() {

  const {data, error, loading } = useQuery(GET_POSTS);

  return <div></div>;
}
