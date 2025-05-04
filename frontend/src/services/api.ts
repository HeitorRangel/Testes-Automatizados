import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Adicionar interceptor de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'Erro desconhecido';
    console.error('Erro na requisição:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

export const cancelamentoService = {
  async getCancelamentos() {
    const { data } = await api.get('/cancelamentos');
    return data;
  },
  
  async cancelarMatricula(alunoId: string) {
    const { data } = await api.post('/cancelamentos', { alunoId });
    return data;
  }
};