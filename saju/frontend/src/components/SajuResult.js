import React, { useTransition } from 'react';
import styled, { css } from 'styled-components';
import FiveElementsAnalysis from './FiveElementsAnalysis';
import SajuInterpretation from './SajuInterpretation';
import ErrorMessage from './common/ErrorMessage';
import { fadeIn, slideInRight } from '../styles/animations';
import { media } from '../styles/breakpoints';
import YearlyFortune from './YearlyFortune';
import { Tag } from 'antd';
import { getColorByElement } from '../utils/colorUtils';

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing(2)};
  margin-top: ${props => props.theme.spacing(2)};
`;

const Title = styled.h3`
  ${props => props.theme.typography.h3};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing(3)};
  padding-bottom: ${props => props.theme.spacing(1)};
  border-bottom: 1px solid ${props => props.theme.colors.divider};
`;

const SajuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${props => props.theme.spacing(2)};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.md} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SajuColumn = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing(2)};
  border: 1px solid ${props => props.theme.colors.grey[200]};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.theme.colors.grey[50]};
  animation: ${slideInRight} 0.5s ease-out;
  animation-delay: ${props => props.$index * 0.1}s;
  animation-fill-mode: both;
`;

const ColumnTitle = styled.h4`
  ${props => props.theme.typography.h6};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing(1)};
`;

const Info = styled.div`
  margin-top: ${props => props.theme.spacing(1)};
  font-size: ${props => props.theme.typography.body2.fontSize};
  color: ${props => props.theme.colors.text.secondary};
`;

const ElementTag = styled(Tag)`
  margin: ${props => props.theme.spacing(0.5)};
`;

const LoadingPlaceholder = styled.div`
  padding: ${props => props.theme.spacing(2)};
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
`;

const SajuResult = React.memo(({ result, error }) => {
  const [isPending, startTransition] = useTransition();

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!result) {
    return null;
  }

  const { 사주, 오행분석, 해석, yearlyFortune, name } = result;

  const columns = [
    { label: '년주', data: 사주.년주 },
    { label: '월주', data: 사주.월주 },
    { label: '일주', data: 사주.일주 },
    { label: '시주', data: 사주.시주 }
  ];

  const handleDataUpdate = () => {
    startTransition(() => {
      // 데이터 업데이트 로직
    });
  };

  return (
    <ResultContainer>
      <SajuGrid>
        {columns.map((column, index) => (
          <SajuColumn key={index} $index={index}>
            <ColumnTitle>{column.label}</ColumnTitle>
            <Info>
              {column.data.천간.한글} {column.data.지지.한글} <br />
              <ElementTag color={getColorByElement(column.data.천간.오행)}>
                천간: {column.data.천간.오행}
              </ElementTag>
              <ElementTag color={getColorByElement(column.data.지지.오행)}>
                지지: {column.data.지지.오행}
              </ElementTag>
            </Info>
          </SajuColumn>
        ))}
      </SajuGrid>
      {isPending ? (
        <LoadingPlaceholder>분석 결과 로딩 중...</LoadingPlaceholder>
      ) : (
        <>
          <SajuInterpretation interpretation={해석} />
          <FiveElementsAnalysis analysis={오행분석} />
          <YearlyFortune data={yearlyFortune} name={name} />
        </>
      )}
    </ResultContainer>
  );
});

export default SajuResult; 