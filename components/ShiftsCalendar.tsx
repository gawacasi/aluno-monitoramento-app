import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { FontAwesome } from '@expo/vector-icons';

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
  hospital: string;
  professor: string;
}

interface ShiftsCalendarProps {
  shifts: Shift[];
}

export function ShiftsCalendar({ shifts }: ShiftsCalendarProps) {
  const { colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => shift.date === formatDate(date));
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentMonth(newDate);
  };

  const renderCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return (
      <View style={[styles.calendar, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <FontAwesome name="chevron-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.monthText}>
            {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </ThemedText>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <FontAwesome name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {weekDays.map((day, index) => (
            <ThemedText key={index} style={[styles.weekDay, { color: colors.text }]}>
              {day}
            </ThemedText>
          ))}
        </View>

        <View style={styles.days}>
          {days.map((day, index) => {
            const dayShifts = day ? getShiftsForDate(day) : [];
            return (
              <View
                key={index}
                style={[
                  styles.day,
                  day && dayShifts.length > 0 && styles.dayWithShift,
                ]}
              >
                {day && (
                  <>
                    <ThemedText style={styles.dayText}>
                      {day.getDate()}
                    </ThemedText>
                    {dayShifts.length > 0 && (
                      <View style={styles.shiftsContainer}>
                        {dayShifts.map((shift, shiftIndex) => (
                          <View key={shiftIndex} style={styles.shiftDot}>
                            <ThemedText style={styles.shiftTime}>
                              {shift.startTime}
                            </ThemedText>
                            <ThemedText style={styles.shiftSpecialty}>
                              {shift.specialty}
                            </ThemedText>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderCalendar()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  calendar: {
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  dayWithShift: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  shiftsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  shiftDot: {
    padding: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    marginBottom: 2,
  },
  shiftTime: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  shiftSpecialty: {
    fontSize: 8,
    textAlign: 'center',
  },
}); 