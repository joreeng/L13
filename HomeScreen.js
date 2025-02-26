import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://data.gov.sg/api/action/datastore_search?resource_id=42ff9cfe-abe5-4b54-beda-c88f9bb438ee');
            const records = response.data.result.records;
            setData(records);
            setFilteredData(records);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = data.filter(item =>
            item.town.toLowerCase().includes(text.toLowerCase()) ||
            item.flat_type.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBox}
                placeholder="Search by town or flat type..."
                value={search}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => navigation.navigate('Details', { item })}
                    >
                        <Text style={styles.listText}>{item.town} - {item.flat_type}</Text>
                        <Text style={styles.listSubText}>${item.resale_price}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    searchBox: { height: 40, borderWidth: 1, padding: 10, marginBottom: 10 },
    listItem: { padding: 15, borderBottomWidth: 1 },
    listText: { fontSize: 16, fontWeight: 'bold' },
    listSubText: { fontSize: 14, color: 'gray' },
});
