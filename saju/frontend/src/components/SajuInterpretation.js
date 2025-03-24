import React from 'react';
import { Card, Typography, List, Tag, Space, Divider } from 'antd';
import { getColorByElement } from '../utils/colorUtils';

const { Title, Text } = Typography;

const SajuInterpretation = ({ interpretation }) => {
  if (!interpretation) {
    return <Card><Text>해석 결과가 없습니다.</Text></Card>;
  }

  const { 기본해석, 오행해석, 종합해석 } = interpretation;

  return (
    <Card title="사주 해석">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={4}>기본 해석</Title>
          {Object.entries(기본해석).map(([주, 데이터]) => (
            <div key={주}>
              <Title level={5}>{데이터.설명}</Title>
              <Space direction="vertical">
                <div>
                  <Text strong>천간: </Text>
                  <Text>{데이터.의미.천간.설명}</Text>
                  <div>
                    {데이터.의미.천간.특성.map((특성, index) => (
                      <Tag key={index}>{특성}</Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <Text strong>지지: </Text>
                  <Text>{데이터.의미.지지.설명}</Text>
                  <div>
                    {데이터.의미.지지.특성.map((특성, index) => (
                      <Tag key={index}>{특성}</Tag>
                    ))}
                  </div>
                </div>
              </Space>
            </div>
          ))}
        </div>

        <Divider />

        <div>
          <Title level={4}>종합 해석</Title>
          {Object.entries(종합해석).map(([항목, 내용]) => (
            <div key={항목}>
              <Text strong>{항목}: </Text>
              <Text>{내용}</Text>
            </div>
          ))}
        </div>
      </Space>
    </Card>
  );
};

export default React.memo(SajuInterpretation); 