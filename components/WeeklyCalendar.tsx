import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface Shift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  specialty: string;
  hospital: string;
}

interface WeeklyCalendarProps {
  shifts: Shift[];
}

export function WeeklyCalendar({ shifts }: WeeklyCalendarProps) {
  const { colors } = useTheme();
  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  const groupShiftsByDay = () => {
    const groupedShifts: { [key: string]: Shift[] } = {};
    
    shifts.forEach(shift => {
      const date = new Date(shift.date);
      const dayOfWeek = daysOfWeek[date.getDay()];
      
      if (!groupedShifts[dayOfWeek]) {
        groupedShifts[dayOfWeek] = [];
      }
      
      groupedShifts[dayOfWeek].push(shift);
    });
    
    return groupedShifts;
  };

  const groupedShifts = groupShiftsByDay();

  return (
    <ScrollView style={styles.container}>
      {daysOfWeek.map(day => (
        <ThemedView 
          key={day} 
          style={[
            styles.dayContainer,
            { backgroundColor: colors.card }
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.dayTitle}>
            {day}
          </ThemedText>
          
          {groupedShifts[day]?.map(shift => (
            <ThemedView 
              key={shift.id} 
              style={[
                styles.shiftCard,
                { backgroundColor: colors.shiftCard }
              ]}
            >
              <ThemedText style={[styles.shiftTime, { color: colors.shiftCardText }]}>
                {shift.startTime} - {shift.endTime}
              </ThemedText>
              <ThemedText style={[styles.shiftSpecialty, { color: colors.shiftCardText }]}>
                {shift.specialty}
              </ThemedText>
              <ThemedText style={[styles.shiftHospital, { color: colors.shiftCardSubtext }]}>
                {shift.hospital}
              </ThemedText>
            </ThemedView>
          ))}
          
          {!groupedShifts[day] && (
            <ThemedText style={[styles.noShifts, { color: colors.shiftCardSubtext }]}>
              Nenhum plantão agendado
            </ThemedText>
          )}
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayContainer: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  dayTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  shiftCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  shiftTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shiftSpecialty: {
    fontSize: 14,
    marginBottom: 2,
  },
  shiftHospital: {
    fontSize: 14,
  },
  noShifts: {
    fontStyle: 'italic',
  },
}); 