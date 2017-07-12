import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";

import Image from "@times-components/image";
import Markup from "@times-components/markup";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#F9F8F3",
    paddingBottom: 50
  },
  photoContainer: {
    width: 100,
    height: 100,
    bottom: 0,
    position: "absolute"
  },
  roundImage: {
    width: 100,
    height: 100,
    borderColor: "#FFF",
    borderRadius: 50,
    borderWidth: 5
  },
  name: {
    fontFamily: "TimesModern-Bold",
    fontSize: 30,
    lineHeight: 30,
    fontWeight: "400",
    color: "#1D1D1B"
  },
  title: {
    fontFamily: "TimesDigitalW04-RegularSC"
  },
  twitter: {
    fontSize: 15,
    fontFamily: "GillSansMTStd-Medium",
    color: "#069"
  },
  bio: {
    fontFamily: "TimesDigital-Regular",
    textAlign: "center",
    fontSize: 15,
    lineHeight: 25,
    marginTop: 6,
    color: "#333"
  },
  wrapper: {
    alignItems: "center",
    backgroundColor: "transparent",
    display: "flex",
    paddingBottom: 50
  }
});

const AuthorHead = props => {
  const { name, title, twitter, bio, uri } = props;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View accessibilityRole="banner" style={styles.container}>
        <Text accessibilityRole="heading" aria-level="1" style={styles.name}>
          {name}
        </Text>
        <Text accessibilityRole="heading" aria-level="2" style={styles.title}>
          {title.toLowerCase()}
        </Text>
        <Text style={styles.twitter}>
          <Markup ast={twitter} />
        </Text>
        <Text style={styles.bio}>
          <Markup ast={bio} />
        </Text>
      </View>
      <View style={styles.photoContainer}>
        <Image aspectRatio={1} source={{ uri }} style={styles.roundImage} />
      </View>
    </View>
  );
};

AuthorHead.defaultProps = {
  name: "",
  title: "",
  uri: "",
  bio: [],
  twitter: []
};

AuthorHead.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  uri: PropTypes.string,
  bio: Markup.propTypes.ast,
  twitter: Markup.propTypes.ast
};

export default AuthorHead;