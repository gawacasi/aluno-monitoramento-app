// Configurações do aplicativo
export const appConfig = {
  // Configurações de armazenamento
  storage: {
    prefix: '@aluno_monitoramento:',
    keys: {
      users: '@aluno_monitoramento:users',
      classes: '@aluno_monitoramento:classes',
      enrollments: '@aluno_monitoramento:enrollments',
      attendances: '@aluno_monitoramento:attendances',
      grades: '@aluno_monitoramento:grades',
      comments: '@aluno_monitoramento:comments',
      session: '@aluno_monitoramento:session'
    }
  },

  // Configurações de debug
  debug: false,

  // Configurações de autenticação
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000 // 24 horas em milissegundos
  }
}; 