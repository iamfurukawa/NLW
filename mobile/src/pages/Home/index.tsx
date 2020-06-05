import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, StyleSheet, Text, ImageBackground, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
    const navigation = useNavigation();
    const [uf, setUf] = useState('0');
    const [city, setCity] = useState('0');

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    useEffect(() => {
      Axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
          .then(response => {
              const ufInitials = response.data.map(uf => uf.sigla);
              setUfs(ufInitials);
          });
    }, []);

    useEffect(() => {
      if(uf === '0')
          return;

      Axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
          .then(response => {
              const cityNames = response.data.map(uf => uf.nome);
              setCities(cityNames);
          });
    }, [uf]);

    function handleNavigateToPoints(uf: string, city: string) {
      if(city === '0' || uf === '0') {
        Alert.alert('Espere!', 'Selecione uma localidade para continuar.')
        return;
      }
      navigation.navigate('Points', {uf, city});
    }

    function handleChangeUf(uf: string) {
      setUf(uf);
      setCity('0');
      setCities([]);
    }

    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground source={require('../../assets/home-background.png')} imageStyle={{width:274, height: 368}} style={styles.container}>
          <View style={styles.main}>
              <Image source={require('../../assets/logo.png')} />
              <View>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
              </View>
          </View>

          <View style={styles.footer}>
              <RNPickerSelect
                onValueChange={(uf) => handleChangeUf(uf)}
                style={select}
                Icon={() => <Icon name='chevron-down' size={30} color='#777'/>}
                placeholder={{
                  label: "Escolha um estado",
                  value: '0',
                  key: '0'
                }}
                value={uf}
                items={
                  ufs.map(uf => ({value: uf, label: uf, key: uf}))
                }
              />

              <RNPickerSelect
                onValueChange={(city) => setCity(city)}
                style={select}
                Icon={() => <Icon name='chevron-down' size={30} color='#777'/>}
                placeholder={{
                  label: "Escolha uma cidade",
                  value: '0',
                  key: '0'
                }}
                value={city}
                items={
                  cities.map(city => ({value: city, label: city, key: city}))
                }
              />

              <RectButton style={styles.button} onPress={() => handleNavigateToPoints(uf, city)}>
                  <View style={styles.buttonIcon}>
                      <Icon name='arrow-right' color='#FFF' size={24} />
                  </View>
                  <Text style={styles.buttonText}>Entrar</Text>
              </RectButton>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

  const select = StyleSheet.create({
    inputIOS: {
      height: 60,
      backgroundColor: '#FFF',
      marginBottom: 8,
      color: '#777',
      paddingLeft: 10,
      borderRadius: 10,
      overflow: 'hidden'
    },
    inputAndroid: {
      height: 60,
      backgroundColor: '#FFF',
      marginBottom: 8,
      color: '#777',
      paddingLeft: 10
    },
    iconContainer: {
      top: 15,
      right: 10
    },
  });

export default Home;