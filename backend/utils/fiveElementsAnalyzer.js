const fs = require('fs').promises;
const path = require('path');

let 오행데이터 = null;

async function initialize() {
  try {
    const fiveElementsPath = path.join(__dirname, '../data/fiveElements.json');
    const data = await fs.readFile(fiveElementsPath, 'utf8');
    오행데이터 = JSON.parse(data);
    
    console.log('오행 데이터 초기화 완료');
  } catch (error) {
    console.error('오행 데이터 초기화 실패:', error);
    throw error;
  }
}

function analyze오행(사주) {
  if (!오행데이터) {
    throw new Error('오행 데이터가 초기화되지 않았습니다.');
  }

  const 오행분석 = {
    년주: get오행정보(사주.년주),
    월주: get오행정보(사주.월주),
    일주: get오행정보(사주.일주),
    시주: get오행정보(사주.시주),
    오행분포: calculate오행분포(사주),
    상생상극: analyze상생상극(사주)
  };

  return 오행분석;
}

function get오행정보(주) {
  return {
    천간오행: 주.천간.오행,
    지지오행: 주.지지.오행
  };
}

function calculate오행분포(사주) {
  const 분포 = {
    목: 0, 화: 0, 토: 0, 금: 0, 수: 0
  };

  [사주.년주, 사주.월주, 사주.일주, 사주.시주].forEach(주 => {
    분포[주.천간.오행]++;
    분포[주.지지.오행]++;
  });

  return 분포;
}

function analyze상생상극(사주) {
  const 상생관계 = [];
  const 상극관계 = [];
  const 오행순서 = ['목', '화', '토', '금', '수'];

  // 천간과 지지의 오행 관계 분석
  [사주.년주, 사주.월주, 사주.일주, 사주.시주].forEach(주 => {
    const 천간오행 = 주.천간.오행;
    const 지지오행 = 주.지지.오행;

    // 상생 관계 확인
    if (is상생(천간오행, 지지오행)) {
      상생관계.push({
        from: 천간오행,
        to: 지지오행,
        설명: `${천간오행}이(가) ${지지오행}을(를) 생함`
      });
    }

    // 상극 관계 확인
    if (is상극(천간오행, 지지오행)) {
      상극관계.push({
        from: 천간오행,
        to: 지지오행,
        설명: `${천간오행}이(가) ${지지오행}을(를) 극함`
      });
    }
  });

  return {
    상생관계,
    상극관계
  };
}

function is상생(오행1, 오행2) {
  const 상생순서 = {
    목: '화',
    화: '토',
    토: '금',
    금: '수',
    수: '목'
  };

  return 상생순서[오행1] === 오행2;
}

function is상극(오행1, 오행2) {
  const 상극순서 = {
    목: '토',
    토: '수',
    수: '화',
    화: '금',
    금: '목'
  };

  return 상극순서[오행1] === 오행2;
}

module.exports = {
  initialize,
  analyze오행
}; 