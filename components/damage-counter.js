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
  FlatList
} from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";
import ListItem from "./list-item";
export function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class DamageCounter extends React.Component {
  state = {
    modalVisible: false,
    hasLoaded: false,
    damage: 0,
    modalDamage: "0",
    life: 0,
    modalLife: "0",
    applyWeakness: false,
    isBranchPokemon: false,
    branchList: []
  };

  modalDamageOpen = () => {
    this.setState({ modalVisible: true });
  };

  setPokemonLife = life => {
    this.setState({ modalLife: life });
  };

  setDamage = damage => {
    this.setState({ modalDamage: damage });
  };

  applyModalValues = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
    if (!this.state.isBranchPokemon) {
      this.setActivePokemon();
    } else {
      this.setBranchPokemon();
    }
    this.clearModalConfiguration();
  };

  healPokemon = () => {
    this.setState({ damage: this.state.damage - 10 });
  };

  clearActivePokemonStatus = () => {
    this.setState({ damage: 0 });
    this.setState({ life: 0 });
  };

  setBranchPokemon() {
    const list = this.state.branchList;
    const life = Number(this.state.modalLife);
    let damage = 0;
    if (this.state.applyWeakness) {
      damage = Number(this.state.modalDamage) * 2;
    } else {
      damage = Number(this.state.modalDamage);
    }
    list.push({ life, damage });
    this.setState({ branchList: list });
  }

  clearModalConfiguration() {
    this.setState({ modalDamage: "0" });
    this.setState({ applyWeakness: false });
    this.setState({ isBranchPokemon: false });
  }

  setActivePokemon() {
    this.setState({ life: this.state.modalLife });
    if (this.state.applyWeakness) {
      this.setState({
        damage: this.state.damage + Number(this.state.modalDamage) * 2
      });
    } else {
      this.setState({
        damage: this.state.damage + Number(this.state.modalDamage)
      });
    }
  }

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

        <View style={{ flex: 5 }}>
          {this.state.damage ? (
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
          ) : null}
          <ListItem
            top={this.state.damage ? 40 : 0}
            damage={this.state.damage}
            life={this.state.life}
          />

          {this.state.branchList.length ? (
            <View
              style={[styles.align, { alignItems: "center", marginTop: 20 }]}
            >
              <Text
                style={{
                  fontFamily: "poppins-light",
                  fontSize: 20
                }}
              >
                Pokemon do Banco
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ branchList: [] })}
              >
                <MaterialIcons name="clear-all" size={25} />
              </TouchableOpacity>
            </View>
          ) : null}
          <FlatList
            style={{ width: "100%", flex: 1 }}
            data={this.state.branchList}
            keyExtractor={(item, index) => item.life}
            renderItem={({ item }) => (
              <ListItem
                damage={item.damage}
                life={item.life}
                top={item.damage ? 20 : 0}
              />
            )}
          />
        </View>

        {/* Buttons */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "row",
            margin: 20
          }}
        >
          <TouchableOpacity onPress={this.modalDamageOpen}>
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
        {/* ! Buttons  */}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
        >
          <View style={{ margin: 22 }}>
            <View>
              <Text
                style={{
                  fontFamily: "poppins-bold",
                  fontSize: 25
                }}
              >
                Preencha os campos abaixo:
              </Text>
              <TextInput
                style={{ marginTop: 20 }}
                label="Vida do pokemon ativo"
                mode="outlined"
                value={this.state.modalLife}
                onChangeText={life => this.setPokemonLife(life)}
              />
              <TextInput
                style={{ marginVertical: 20 }}
                label="Dano causado ao pokemon"
                mode="outlined"
                value={this.state.modalDamage}
                onChangeText={damage => this.setDamage(damage)}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Checkbox
                  status={this.state.applyWeakness ? "checked" : "unchecked"}
                  onPress={() => {
                    this.setState({ applyWeakness: !this.state.applyWeakness });
                  }}
                />
                <Text style={{ fontFamily: "poppins-light", marginLeft: 10 }}>
                  Aplicar fraqueza
                </Text>
              </View>

              <View
                style={{
                  marginVertical: 20,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Checkbox
                  status={this.state.isBranchPokemon ? "checked" : "unchecked"}
                  onPress={() => {
                    this.setState({
                      isBranchPokemon: !this.state.isBranchPokemon
                    });
                  }}
                />
                <Text style={{ fontFamily: "poppins-light", marginLeft: 10 }}>
                  Aplicar a pokemon no banco
                </Text>
              </View>

              <Button
                style={{ marginTop: 20 }}
                mode="contained"
                onPress={this.applyModalValues}
              >
                Registrar Dano
              </Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}
