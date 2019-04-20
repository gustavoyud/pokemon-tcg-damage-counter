import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { AppLoading, Font } from "expo";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput
} from "react-native";

export function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class DamageCounter extends React.Component {
  state = {
    modalVisible: false,
    hasLoaded: false,
    damage: 0,
    life: 0,
    type: ""
  };

  damageRegister = () => {
    this.setState({ damage: this.state.damage + 10 });
    this.setState({ modalVisible: true });
  };

  healPokemon = () => {
    this.setState({ damage: this.state.damage - 10 });
  };

  clearActivePokemonStatus = () => {
    this.setState({ damage: 0 });
    this.setState({ life: 0 });
    this.setState({ type: "" });
  };

  async _cacheResourcesAsync() {
    const fontAssets = cacheFonts([
      {
        "poppins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "poppins-light": require("../assets/fonts/Poppins-Light.ttf")
      }
    ]);

    return Promise.all([...fontAssets]);
  }

  render() {
    const { width } = Dimensions.get("window");
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#f5f5f5"
      },
      image: {
        width: width * 0.5,
        overflow: "visible"
      },
      align: {
        paddingTop: 40,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        alignContent: "center",
        flexDirection: "row"
      }
    });

    if (!this.state.hasLoaded) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ hasLoaded: true })}
          onError={console.warn}
        />
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar hidden={true} />
        <View style={[styles.align, { alignItems: "center" }]}>
          <Text
            style={{
              fontFamily: "poppins-bold",
              fontSize: 25
            }}
          >
            Pokemon Ativo
          </Text>
          <TouchableOpacity onPress={this.clearActivePokemonStatus}>
            <MaterialIcons name="clear-all" size={25} />
          </TouchableOpacity>
        </View>
        <View style={[styles.align, { flex: 5 }]}>
          <Text style={{ fontFamily: "poppins-light" }}>
            {this.state.damage ? `Dano: ${this.state.damage}` : null}
          </Text>
          <Text style={{ fontFamily: "poppins-light" }}>
            {this.state.damage ? `Vida Restante: ${this.state.life}` : null}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "row",
            margin: 20
          }}
        >
          <TouchableOpacity onPress={this.damageRegister}>
            <AntDesign
              name="pluscircle"
              size={40}
              style={{ color: "#F44336" }}
            />
          </TouchableOpacity>
          {this.state.damage ? (
            <TouchableOpacity onPress={this.healPokemon}>
              <MaterialCommunityIcons
                name="stethoscope"
                size={40}
                style={{ marginLeft: 20, color: "#009688" }}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={{ margin: 22 }}>
            <View>
              <Text style={{ fontFamily: "poppins-light" }}>
                Vida do Pokemon ativo
              </Text>
              <TextInput
                style={{ height: 40 }}
                placeholder="Vida"
                onChangeText={life => this.setState({ life })}
              />

              <TouchableOpacity
                onPress={() => {
                  this.setState({ modalVisible: !this.state.modalVisible });
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}
