import React, { useState, useCallback } from 'react';
import { useTransition } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import SajuResult from './SajuResult';
import { fadeIn, scaleIn, pulse } from '../styles/animations';
import ErrorMessage from './common/ErrorMessage';
import debounce from 'lodash/debounce';
import { cacheResult, getCachedResult } from '../utils/cache';
import { media } from '../styles/breakpoints';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(2)};
  padding: ${props => props.theme.spacing(3)};
  border: 2px solid ${props => props.theme.colors.traditional.gold};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-image: linear-gradient(
    to bottom,
    ${props => props.theme.colors.traditional.red}10,
    ${props => props.theme.colors.background.paper}
  );
  box-shadow: ${props => props.theme.shadows.small};
  animation: ${fadeIn} 0.5s ease-out;
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing(3)};
  margin-bottom: ${props => props.theme.spacing(2)};
  
  ${media.md} {
    max-width: 600px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(2)};
  margin-bottom: ${props => props.theme.spacing(2)};
  
  ${media.sm} {
    flex-direction: row;
  }
`;

const InputLabel = styled.label`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  ${media.sm} {
    flex: 1;
  }
  
  span {
    font-size: ${props => props.theme.typography.body2.fontSize};
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: ${props => props.theme.spacing(0.5)};
  }
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing(1)};
  border: 1px solid ${props => props.theme.colors.grey[300]};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.body1.fontSize};
  transition: border-color ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary.light}40;
    animation: ${pulse} 0.3s ease-out;
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing(1.5)};
  background-color: ${props => props.theme.colors.primary.main};
  color: ${props => props.theme.colors.primary.contrastText};
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.body1.fontSize};
  font-weight: 500;
  transition: background-color ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.grey[400]};
    cursor: not-allowed;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const ErrorText = styled.div`
  color: ${props => props.theme.colors.error.main};
  font-size: ${props => props.theme.typography.body2.fontSize};
  margin-top: ${props => props.theme.spacing(0.5)};
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.background.paper}CC;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${props => props.theme.colors.grey[200]};
  border-top: 5px solid ${props => props.theme.colors.primary.main};
  border-radius: 50%;
  animation: ${scaleIn} 0.3s ease-out;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingPlaceholder = styled.div`
  padding: ${props => props.theme.spacing(3)};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  animation: ${fadeIn} 0.3s ease-out;
  margin-top: ${props => props.theme.spacing(2)};
`;

const TimeInputGroup = styled(InputLabel)`
  position: relative;
  
  .unknown-checkbox {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    gap: ${props => props.theme.spacing(0.5)};
    font-size: ${props => props.theme.typography.body2.fontSize};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

function BirthInputForm() {
  const [birthData, setBirthData] = useState({
    name: '',
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: ''
  });
  
  const [unknownTime, setUnknownTime] = useState({
    hour: false,
    minute: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isPending, startTransition] = useTransition();

  const debouncedValidation = useCallback(
    debounce((field, value) => {
      const errors = {};
      
      switch(field) {
        case 'year':
          if (value && (value < 1900 || value > new Date().getFullYear())) {
            errors.year = '유효한 년도를 입력해주세요 (1900-현재)';
          }
          break;
        // ... 다른 필드들에 대한 유효성 검사
      }
      
      setValidationErrors(prev => ({
        ...prev,
        [field]: errors[field]
      }));
    }, 300),
    []
  );

  const validateInput = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    if (!birthData.year) {
      errors.year = '년도를 입력해주세요';
    } else if (birthData.year < 1900 || birthData.year > currentYear) {
      errors.year = '유효한 년도를 입력해주세요 (1900-현재)';
    }

    if (!birthData.month) {
      errors.month = '월을 입력해주세요';
    } else if (birthData.month < 1 || birthData.month > 12) {
      errors.month = '유효한 월을 입력해주세요 (1-12)';
    }

    const maxDays = new Date(birthData.year, birthData.month, 0).getDate();
    if (!birthData.day) {
      errors.day = '일을 입력해주세요';
    } else if (birthData.day < 1 || birthData.day > maxDays) {
      errors.day = `유효한 일을 입력해주세요 (1-${maxDays})`;
    }

    if (!unknownTime.hour) {
      if (!birthData.hour) {
        errors.hour = '시를 입력해주세요';
      } else if (birthData.hour < 0 || birthData.hour > 23) {
        errors.hour = '유효한 시를 입력해주세요 (0-23)';
      }
    }

    if (!unknownTime.minute) {
      if (!birthData.minute) {
        errors.minute = '분을 입력해주세요';
      } else if (birthData.minute < 0 || birthData.minute > 59) {
        errors.minute = '유효한 분을 입력해주세요 (0-59)';
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateInput();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setLoading(true);
    setError(null);

    const cachedResult = getCachedResult(birthData);
    if (cachedResult) {
      setLoading(false);
      setResult(cachedResult);
      return;
    }

    try {
      const response = await axios.post('/api/calculate', birthData);
      cacheResult(birthData, response.data);
      startTransition(() => {
        setResult(response.data);
        setLoading(false);
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || '계산 중 오류가 발생했습니다.';
      const errorCode = err.response?.status;
      
      switch (errorCode) {
        case 400:
          setError(`입력값이 올바르지 않습니다: ${errorMessage}`);
          break;
        case 429:
          setError('너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.');
          break;
        case 500:
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          setError(errorMessage);
      }
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setResult(null);
  };

  const handleInputChange = (field, value) => {
    setBirthData(prev => ({
      ...prev,
      [field]: value
    }));
    
    debouncedValidation(field, value);
  };

  const handleUnknownTimeChange = (field) => {
    setUnknownTime(prev => {
      const newState = {
        ...prev,
        [field]: !prev[field]
      };
      
      // Clear the corresponding field when checkbox is checked
      if (newState[field]) {
        setBirthData(prev => ({
          ...prev,
          [field]: ''
        }));
        // Clear any validation errors for this field
        setValidationErrors(prev => ({
          ...prev,
          [field]: null
        }));
      }
      
      return newState;
    });
  };

  return (
    <FormContainer>
      {(loading || isPending) && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      {error && (
        <ErrorMessage 
          message={error}
          onRetry={handleRetry}
        />
      )}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <InputLabel>
            <span>이름</span>
            <Input
              type="text"
              placeholder="이름을 입력해주세요"
              value={birthData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </InputLabel>
        </InputGroup>
        <InputGroup>
          <InputLabel>
            <span>년도</span>
            <Input
              type="number"
              placeholder="1900-현재"
              value={birthData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              required
            />
            {validationErrors.year && (
              <ErrorText>{validationErrors.year}</ErrorText>
            )}
          </InputLabel>
          <InputLabel>
            <span>월</span>
            <Input
              type="number"
              placeholder="1-12"
              value={birthData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              min="1"
              max="12"
              required
            />
            {validationErrors.month && (
              <ErrorText>{validationErrors.month}</ErrorText>
            )}
          </InputLabel>
          <InputLabel>
            <span>일</span>
            <Input
              type="number"
              placeholder="1-31"
              value={birthData.day}
              onChange={(e) => handleInputChange('day', e.target.value)}
              min="1"
              max="31"
              required
            />
            {validationErrors.day && (
              <ErrorText>{validationErrors.day}</ErrorText>
            )}
          </InputLabel>
        </InputGroup>
        <InputGroup>
          <TimeInputGroup>
            <span>시 (24시간)</span>
            <div className="unknown-checkbox">
              <input
                type="checkbox"
                id="unknown-hour"
                checked={unknownTime.hour}
                onChange={() => handleUnknownTimeChange('hour')}
              />
              <label htmlFor="unknown-hour">모름</label>
            </div>
            <Input
              type="number"
              placeholder="0-23"
              value={birthData.hour}
              onChange={(e) => handleInputChange('hour', e.target.value)}
              min="0"
              max="23"
              required={!unknownTime.hour}
              disabled={unknownTime.hour}
            />
            {validationErrors.hour && (
              <ErrorText>{validationErrors.hour}</ErrorText>
            )}
          </TimeInputGroup>
          <TimeInputGroup>
            <span>분</span>
            <div className="unknown-checkbox">
              <input
                type="checkbox"
                id="unknown-minute"
                checked={unknownTime.minute}
                onChange={() => handleUnknownTimeChange('minute')}
              />
              <label htmlFor="unknown-minute">모름</label>
            </div>
            <Input
              type="number"
              placeholder="0-59"
              value={birthData.minute}
              onChange={(e) => handleInputChange('minute', e.target.value)}
              min="0"
              max="59"
              required={!unknownTime.minute}
              disabled={unknownTime.minute}
            />
            {validationErrors.minute && (
              <ErrorText>{validationErrors.minute}</ErrorText>
            )}
          </TimeInputGroup>
        </InputGroup>
        <Button type="submit" disabled={loading}>
          {loading ? '계산 중...' : '사주팔자 계산하기'}
        </Button>
      </Form>
      <SajuResult result={result} error={error} />
    </FormContainer>
  );
}

export default BirthInputForm; 