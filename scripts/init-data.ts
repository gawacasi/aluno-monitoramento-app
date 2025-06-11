import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/config';
import { initialClasses, initialEnrollments, initialUsers } from '../config/initial-data';
import { saveClass, saveEnrollment, saveUser } from '../services/storage';

export const initializeData = async () => {
  try {
    // Limpar dados existentes
    await AsyncStorage.multiRemove([
      config.storage.users,
      config.storage.classes,
      config.storage.enrollments,
      config.storage.attendances,
      config.storage.grades,
      config.storage.comments,
      config.storage.session,
    ]);

    // Criar usuários
    const professor = await saveUser(initialUsers[0]);
    const aluno = await saveUser(initialUsers[1]);

    if (!professor || !aluno) {
      throw new Error('Erro ao criar usuários');
    }

    // Criar turmas
    const turmaA = await saveClass({
      ...initialClasses[0],
      professorId: professor.id,
    });

    const turmaB = await saveClass({
      ...initialClasses[1],
      professorId: professor.id,
    });

    if (!turmaA || !turmaB) {
      throw new Error('Erro ao criar turmas');
    }

    // Criar matrículas
    await saveEnrollment({
      ...initialEnrollments[0],
      studentId: aluno.id,
      classId: turmaA.id,
    });

    console.log('Dados inicializados com sucesso!');
    console.log('Professor:', professor.email, 'Senha:', initialUsers[0].password);
    console.log('Aluno:', aluno.email, 'Senha:', initialUsers[1].password);
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
}; 