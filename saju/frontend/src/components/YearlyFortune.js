import React from 'react';
import { Card, Typography, List, Tag, Space, Divider } from 'antd';
import { getColorByElement } from '../utils/colorUtils';

const { Title, Text } = Typography;

const YearlyFortune = ({ data, name }) => {
  if (!data || Object.keys(data).length === 0) {
    return <Card><Text>운세 데이터가 없습니다.</Text></Card>;
  }

  const years = [2025]; // 2025년만 표시

  const renderYearData = (yearData) => {
    if (!yearData) return null;

    if (yearData.주요오행) return null;

    const characteristics = yearData.yearCharacteristics;
    const fortune = yearData.yearlyFortune;

    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={5}>기본 정보</Title>
          <Tag color={getColorByElement(characteristics.오행.천간오행.split('(')[0])}>
            {characteristics.천간}
          </Tag>
          <Tag color={getColorByElement(characteristics.오행.지지오행.split('(')[0])}>
            {characteristics.지지}
          </Tag>
          <Text>{characteristics.오행.영향}</Text>
        </div>

        <div>
          <Title level={5}>운세 상세</Title>
          <List
            size="small"
            dataSource={[
              { label: '사업/직장', data: fortune.career.general },
              { label: '재물/투자', data: fortune.wealth.general },
              { label: '건강', data: fortune.health.general },
              { label: '인간관계', data: fortune.relationships }
            ]}
            renderItem={item => (
              <List.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text strong>{item.label}</Text>
                  <Text>{item.data.description}</Text>
                  {item.data.strengths && (
                    <div>
                      <Text type="secondary">강점: {item.data.strengths}</Text>
                    </div>
                  )}
                  {item.data.focus && (
                    <div>
                      <Text type="secondary">중점: {item.data.focus}</Text>
                    </div>
                  )}
                </Space>
              </List.Item>
            )}
          />
        </div>

        <div>
          <Title level={5}>길운 정보</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>길방: </Text>
              {characteristics.길방?.map((방위, index) => (
                <Tag key={index}>{방위}</Tag>
              ))}
            </div>
            <div>
              <Text strong>길월: </Text>
              {characteristics.길월?.map((월, index) => (
                <Tag key={index}>{월}</Tag>
              ))}
            </div>
            <div>
              <Text strong>길색: </Text>
              {characteristics.길색?.map((색, index) => (
                <Tag key={index}>{색}</Tag>
              ))}
            </div>
          </Space>
        </div>

        <div>
          <Title level={5}>월별 운세</Title>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={Object.entries(fortune.monthly || {})}
            renderItem={([month, data]) => (
              <List.Item>
                <Card 
                  size="small" 
                  title={`${month}월`}
                  extra={<Tag color={data.운세?.총운평가 === '길' ? 'green' : 'orange'}>
                    {data.운세?.총운평가 || '보통'}
                  </Tag>}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text>{data.운세?.총운}</Text>
                    <div>
                      <Space>
                        <Text type="secondary">사업:</Text>
                        <Text>{data.운세?.사업}</Text>
                      </Space>
                    </div>
                    <div>
                      <Space>
                        <Text type="secondary">금전:</Text>
                        <Text>{data.운세?.금전}</Text>
                      </Space>
                    </div>
                    <div>
                      <Space>
                        <Text type="secondary">애정:</Text>
                        <Text>{data.운세?.애정}</Text>
                      </Space>
                    </div>
                    <Divider />
                    <Space direction="vertical">
                      <Space>
                        <Text type="secondary">길일:</Text>
                        <Text>{data.길일?.join(', ')}</Text>
                      </Space>
                      <Space>
                        <Text type="secondary">길방:</Text>
                        <Tag color="blue">{data.길방}</Tag>
                      </Space>
                      <Space align="start">
                        <Text type="secondary">주의:</Text>
                        <Text type="warning">{data.주의사항}</Text>
                      </Space>
                    </Space>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        </div>

        <Divider />

        <div>
          <Text>{fortune.overall?.summary}</Text>
          <div style={{ marginTop: '8px' }}>
            {fortune.overall?.keywords?.map((keyword, index) => (
              <Tag key={index}>{keyword}</Tag>
            ))}
          </div>
        </div>
      </Space>
    );
  };

  return (
    <Card title={`${name}님의 운세`}>
      <List
        dataSource={years}
        renderItem={year => {
          const yearData = data[year];
          if (!yearData || yearData.주요오행) return null;

          return (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                {renderYearData(yearData)}
              </Space>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default React.memo(YearlyFortune); 