Feature: Cancelamento de Matrícula

  Scenario: Cancelar matrícula com sucesso
    Given que estou na página de cancelamento
    When preencho o ID do aluno "123e4567-e89b-12d3-a456-426614174000"
    And preencho o motivo "Mudança de cidade"
    And confirmo o cancelamento
    Then devo ver a mensagem de sucesso "Cancelamento realizado com sucesso!"

  Scenario: Tentar cancelar matrícula com ID inválido
    Given que estou na página de cancelamento
    When preencho o ID do aluno "id-invalido"
    And confirmo o cancelamento
    Then devo ver a mensagem de erro "ID do aluno deve ser um UUID válido"