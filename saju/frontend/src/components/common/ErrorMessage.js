import React from 'react';
import styled from 'styled-components';
import { fadeIn } from '../../styles/animations';

const ErrorContainer = styled.div`
  padding: ${props => props.theme.spacing(2)};
  margin: ${props => props.theme.spacing(2)} 0;
  background-color: ${props => props.theme.colors.error.light}20;
  border: 1px solid ${props => props.theme.colors.error.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.error.main};
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing(1)};
`;

const ErrorIcon = styled.span`
  font-size: 1.2em;
`;

const ErrorText = styled.p`
  margin: 0;
  ${props => props.theme.typography.body2};
`;

const RetryButton = styled.button`
  margin-left: auto;
  padding: ${props => props.theme.spacing(0.5)} ${props => props.theme.spacing(1)};
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.error.main};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.error.main};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};

  &:hover {
    background-color: ${props => props.theme.colors.error.main};
    color: white;
  }
`;

function ErrorMessage({ message, onRetry }) {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorText>{message}</ErrorText>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          다시 시도
        </RetryButton>
      )}
    </ErrorContainer>
  );
}

export default ErrorMessage; 