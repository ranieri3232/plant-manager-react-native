import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Alert
} from 'react-native';


import imgWaterDrop from '../assets/waterdrop.png';

import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { loadPlant, PlantProps, removePlant, StoragePlantProps } from '../libs/storage';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();


  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();
      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNorification).getTime(),
        new Date().getTime(),
        { locale: pt }

      );
      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime} horas`
      );
      setMyPlants(plantsStoraged);
      setLoading(false);
    }
    loadStorageData();
  }, []);
  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏',
        style: 'cancel'
      },
      {
        text: 'Sim 😢',
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants((oldData) => (
              oldData.filter((item) => item.id != plant.id)
            ));
          } catch (err) {
            Alert.alert('Não foi possível remover! ');
          }
        }
      }
    ]);
  }

  if (loading)
    return (<Load />)

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={imgWaterDrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>
          {nextWatered}
        </Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantTitle}>
          Próximas regadas:
        </Text>
        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spotlightImage: {
    width: 60,
    height: 60
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
    textAlign: 'justify',
  },
  plants: {
    flex: 1,
    width: '100%'
  },
  plantTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  }
})