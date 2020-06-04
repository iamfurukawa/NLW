import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Image, StyleSheet, Text, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
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
    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    const [ufs, setUfs] = useState<string[]>(['0']);
    const [cities, setCities] = useState<string[]>(['0']);

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
        navigation.navigate('Points', {uf, city});
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
                onValueChange={(uf) => setUf(uf)}
                placeholder={{
                  label: "Escolha um estado",
                  value: '0',
                }}
                items={
                  ufs.map(uf => ({value: uf, label: uf, key: uf}))
                }
              />

              <RNPickerSelect
                onValueChange={(city) => setCity(city)}
                placeholder={{
                  label: "Escolha uma cidade",
                  value: '0',
                }}
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
      padding: 32
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
  
    select: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30,
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
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
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;