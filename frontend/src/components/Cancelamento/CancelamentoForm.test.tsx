import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { cancelamentoService } from '../../services/api';
import { useError } from '../../contexts/ErrorContext';

const schema = yup.object({
  alunoId: yup.string().uuid('ID do aluno deve ser um UUID válido').required('ID do aluno é obrigatório'),
});

type FormData = yup.InferType<typeof schema>;

const CancelamentoForm: React.FC = () => {
  const { setError } = useError();
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await cancelamentoService.cancelarMatricula(data.alunoId);
      alert('Cancelamento realizado com sucesso!');
      reset(); // Limpa o formulário após o sucesso
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar matrícula');
    }
  };

  return (
    <div className="container">
      <h2>Cancelamento de Matrícula</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input 
            type="text" 
            {...register('alunoId')}
            placeholder="ID do Aluno"
          />
          {errors.alunoId && <p className="error">{errors.alunoId.message}</p>}
        </div>
        <button type="submit">Cancelar Matrícula</button>
      </form>
    </div>
  );
};

export default CancelamentoForm;
