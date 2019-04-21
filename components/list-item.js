import { Font } from "expo";
import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";

class ListItem extends PureComponent {
  constructor(props) {
    super(props);
    Font.loadAsync({
      "poppins-light": require("../assets/fonts/Poppins-Light.ttf")
    });
  }

  render() {
    const style = StyleSheet.create({
      align: {
        paddingTop: this.props.top ? this.props.top : 0,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        alignContent: "center",
        flexDirection: "row"
      }
    });
    return (
      <View style={[style.align]}>
        <Text style={{ fontFamily: "poppins-light" }}>
          {this.props.damage ? `Dano: ${this.props.damage}` : null}
        </Text>
        <Text style={{ fontFamily: "poppins-light" }}>
          {this.props.damage
            ? this.props.life - this.props.damage >= 0
              ? `Vida Restante: ${this.props.life - this.props.damage}`
              : "POKEMON NOCAUTEADO"
            : null}
        </Text>
      </View>
    );
  }
}

export default ListItem;
