import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../config/misc';
import { StyleSheet, View } from 'react-native';

export const LoadingScreen: React.FC = () => (
    <View style={styles.container}>
        <ActivityIndicator size={40} color={COLORS.primaryLight} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
