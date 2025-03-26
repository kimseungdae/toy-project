export const getColorByElement = (element) => {
  const colorMap = {
    '목': 'green',
    '화': 'red',
    '토': 'orange',
    '금': 'gold',
    '수': 'blue'
  };

  const cleanElement = element?.split('(')[0];
  return colorMap[cleanElement] || 'default';
}; 