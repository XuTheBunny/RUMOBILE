import React from "react";
import { Text, View, Image } from "react-native";
import CardItem from "./CardItem";

class Header extends React.Component {
  renderProfilePic() {
    if (this.props.showProfilePic) {
      return;
    }
    return;
  }
  render() {
    return (
      <View style={styles.viewStyle}>
        <CardItem>
          <View>
            <Text style={styles.textStyle2}>{this.props.dateText}</Text>
            <View style={styles.containerStyle}>
              <Text style={styles.textStyle}>{this.props.text}</Text>
              {this.props.showProfilePic && (
                <Image
                  style={styles.imageStyle}
                  source={require("../images/ProfilePic.jpg")}
                />
              )}
            </View>
          </View>
        </CardItem>
      </View>
    );
  }
}
const styles = {
  viewStyle: {
    backgroundColor: "white",
    justifyContent: "center",
    //alignItems: 'center',
    height: 115,
    paddingTop: 30,
    paddingLeft: 20,
    elevation: 2,
    position: "relative"
  },
  textStyle: {
    fontSize: 34,
    paddingTop: 4,
    fontWeight: "700",
    paddingRight: 200,
    fontFamily: "System"
  },
  containerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textStyle2: {
    fontSize: 12,
    color: "rgb(142, 142, 147)",
    fontFamily: "System",
    fontWeight: "bold"
  },
  imageStyle: { width: 40, height: 40 }
};

export default Header;
