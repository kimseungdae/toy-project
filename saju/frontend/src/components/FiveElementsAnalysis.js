import React from 'react';
import { Card, Typography, List, Tag, Space, Divider } from 'antd';
import { getColorByElement } from '../utils/colorUtils';

const { Title, Text } = Typography;

const FiveElementsAnalysis = ({ analysis }) => {
  if (!analysis) {
    return <Card><Text>오행 분석 데이터가 없습니다.</Text></Card>;
  }

  const { 오행분포, 상생상극 } = analysis;

  const getElementStatus = (개수) => {
    if (개수 > 2) return { text: '과다', color: 'red' };
    if (개수 < 2) return { text: '부족', color: 'blue' };
    return { text: '적정', color: 'green' };
  };

  const renderRelationship = (관계, 제목, 설명) => (
    <div>
      <Title level={4}>{제목}</Title>
      <List
        dataSource={관계}
        renderItem={item => (
          <List.Item>
            <Space align="start">
              <Tag color={getColorByElement(item.from)}>{item.from}</Tag>
              <Text>→</Text>
              <Tag color={getColorByElement(item.to)}>{item.to}</Tag>
              <Space direction="vertical" size="small">
                <Text>{item.설명}</Text>
                {item.의미 && <Text type="secondary">{item.의미}</Text>}
              </Space>
            </Space>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Card title="오행 분석">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={4}>오행 분포</Title>
          <List
            dataSource={Object.entries(오행분포).map(([오행, 개수]) => {
              const status = getElementStatus(개수);
              return {
                오행,
                개수,
                비율: `${(개수 / 8 * 100).toFixed(1)}%`,
                평가: status
              };
            })}
            renderItem={item => (
              <List.Item>
                <Space>
                  <Tag color={getColorByElement(item.오행)}>
                    {item.오행}
                  </Tag>
                  <Text>{item.개수}개 ({item.비율})</Text>
                  <Tag color={item.평가.color}>{item.평가.text}</Tag>
                </Space>
              </List.Item>
            )}
          />
        </div>

        <Divider />

        {renderRelationship(상생상극.상생관계, '상생 관계', '서로 돕는 관계')}
        <Divider />
        {renderRelationship(상생상극.상극관계, '상극 관계', '서로 견제하는 관계')}

        <div style={{ marginTop: '16px' }}>
          <Text type="secondary">
            * 상생(相生)은 서로 돕고 생성하는 관계를, 상극(相剋)은 서로 견제하고 억제하는 관계를 의미합니다.
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default React.memo(FiveElementsAnalysis); 