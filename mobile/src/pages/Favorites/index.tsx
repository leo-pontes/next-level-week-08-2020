import React, { useState } from 'react'
import { View } from 'react-native'
import PageHeader from '../../components/PageHeader';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import TeacherItem, { Teacher } from '../../components/TecharItem';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';


function Favorites() {
    const [favorites, setFavorites] = useState([]);

    async function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const listaFavoritos = JSON.parse(response);
                setFavorites(listaFavoritos);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    return (
        <View style={styles.container}>
            <PageHeader title="Meus proffys favoritos" />
            <ScrollView style={styles.teacherList} contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16
            }}>

                {favorites.map((teacher: Teacher) =>
                    <TeacherItem
                        key={teacher.id}
                        teacher={teacher}
                        favorited />)}

            </ScrollView>
        </View>
    )
}

export default Favorites
