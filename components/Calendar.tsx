import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { darkTheme, lightTheme } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';

interface Class {
  id: string;
  name: string;
  description: string;
  day: number;
  time: string;
  color: string;
}

interface CalendarProps {
  classes: Class[];
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOURS = [
  '7:00', '8:00', '9:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00', '23:00'
];

export default function Calendar({ classes }: CalendarProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const getClassesForDayAndTime = (day: number, time: string) => {
    return classes.filter(c => c.day === day && c.time === time);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Cabeçalho com dias da semana */}
      <View style={styles.header}>
        <View style={styles.timeColumn} />
        {DAYS.map((day, index) => (
          <View key={day} style={styles.dayColumn}>
            <Text style={[styles.dayText, { color: colors.text }]}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Grade de horários */}
      <ScrollView style={styles.grid}>
        {HOURS.map(hour => (
          <View key={hour} style={styles.row}>
            <View style={styles.timeColumn}>
              <Text style={[styles.timeText, { color: colors.text }]}>{hour}</Text>
            </View>
            {DAYS.map((_, dayIndex) => (
              <View key={dayIndex} style={styles.dayColumn}>
                {getClassesForDayAndTime(dayIndex, hour).map(classItem => (
                  <View
                    key={classItem.id}
                    style={[
                      styles.classItem,
                      { backgroundColor: classItem.color },
                      classItem.name.includes('Plantão') && styles.plantaoItem
                    ]}
                  >
                    <Text style={styles.className}>{classItem.name}</Text>
                    <Text style={styles.classDescription}>{classItem.description}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timeColumn: {
    width: 60,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  dayColumn: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeText: {
    fontSize: 12,
  },
  classItem: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  plantaoItem: {
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  className: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  classDescription: {
    color: '#FFFFFF',
    fontSize: 10,
  },
}); 