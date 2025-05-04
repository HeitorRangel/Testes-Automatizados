#!/bin/bash

# Dependências principais do projeto
npm install react react-dom react-scripts typescript

# Dependências de roteamento
npm install react-router-dom @types/react-router-dom

# Dependências de formulário
npm install react-hook-form yup

# Dependências de teste
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest-environment-jsdom
npm install --save-dev @types/jest @types/testing-library__react

# Corrigir específico para jest-dom
npm install --save-dev jest-dom