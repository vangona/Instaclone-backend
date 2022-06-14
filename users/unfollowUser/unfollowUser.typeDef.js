import { gql } from "apollo-server-express";

export default gql`
  type UnfollowerUserResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    unfollowUser(username: String!): UnfollowUserResult
  }
`;
