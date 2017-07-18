import React from "react";
import { FlatList } from "react-native";
import AuthorProfileFooter from "./author-profile-footer";
import AuthorProfileHeader from "./author-profile-header";
import AuthorProfileItem from "./author-profile-item";

const AuthorProfile = props =>
  <FlatList
    data={props.currentPageOfArticles}
    keyExtractor={article => article.id}
    ListHeaderComponent={() => <AuthorProfileHeader {...props} />}
    renderItem={({ item }) => <AuthorProfileItem {...item} />}
    ListFooterComponent={() => <AuthorProfileFooter {...props} />}
  />;

AuthorProfile.propTypes = Object.assign(
  {},
  AuthorProfileFooter.propTypes,
  AuthorProfileHeader.propTypes,
  AuthorProfileItem.propTypes
);

export default AuthorProfile;
