import 'antd/dist/reset.css';
import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import BirthInputForm from './components/BirthInputForm';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import ErrorBoundary from './components/ErrorBoundary';
import { media } from './styles/breakpoints';

const AppContainer = styled.div`
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing(2)};
  ${props => props.theme.typography.h1};

  ${media.sm} {
    margin-bottom: ${props => props.theme.spacing(3)};
  }

  ${media.md} {
    margin-bottom: ${props => props.theme.spacing(4)};
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary>
        <AppContainer>
          <Title>SD컴퍼니 사주팔자 계산기</Title>
          <BirthInputForm />
        </AppContainer>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App; 