import React, { useState } from 'react'
import { View, Text } from 'react-native'
import PageHeader from '../../components/PageHeader';
import styles from './styles';
import TeacherItem, { Teacher } from '../../components/TecharItem';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';

function TeacherList() {
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject] = useState('');
    const [week_day, setWeek_day] = useState('');
    const [time, setTime] = useState('');

    async function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const listaFavoritos = JSON.parse(response);
                setFavorites(listaFavoritos.map((fav: Teacher) => fav.id));
            }
        });
    }

    function handleToggleFiltersVisible() {
        setIsFilterVisible(!isFilterVisible);
    }

    const handleFilterSubmit = async () => {
        loadFavorites();

        const response = await api.get('classes', { params: { subject, week_day, time } });

        setIsFilterVisible(false);
        setTeachers(response.data);
    }

    return (
        <View style={styles.container}>
            <PageHeader title="Proffys disponíveis" headerRight={(
                <BorderlessButton onPress={handleToggleFiltersVisible}>
                    <Feather name='filter' size={20} color='#FFF' />
                </BorderlessButton>
            )}>
                {isFilterVisible && (<View style={styles.searchForm}>
                    <Text style={styles.label}>Matéria</Text>
                    <TextInput style={styles.input}
                        placeholder="Qual a matéria?"
                        placeholderTextColor='#c1bccc'
                        value={subject}
                        onChangeText={text => setSubject(text)} />

                    <View style={styles.inputGroup}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Dia da semana</Text>
                            <TextInput style={styles.input}
                                placeholder="Qual o dia?"
                                placeholderTextColor='#c1bccc'
                                value={week_day}
                                onChangeText={text => setWeek_day(text)} />
                        </View>

                        <View style={styles.inputBlock}>
                            <Text style={styles.label}>Horário</Text>
                            <TextInput style={styles.input}
                                placeholder="Qual o horário"
                                placeholderTextColor='#c1bccc'
                                value={time}
                                onChangeText={text => setTime(text)} />
                        </View>
                    </View>

                    <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
                        <Text style={styles.submitButtonText}>Filtrar</Text>
                    </RectButton>
                </View>)}
            </PageHeader>

            <ScrollView style={styles.teacherList} contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 16
            }}>
                {teachers.map((teacher: Teacher) =>
                    <TeacherItem
                        key={teacher.id}
                        teacher={teacher}
                        favorited={favorites.includes(teacher.id)} />)}
            </ScrollView>
        </View>
    )
}

export default TeacherList
