const fs = require('fs').promises;
const path = require('path');

let 해석데이터 = null;

async function initialize() {
  try {
    const interpretationPath = path.join(__dirname, '../data/interpretation.json');
    const data = await fs.readFile(interpretationPath, 'utf8');
    해석데이터 = JSON.parse(data);
    
    console.log('해석 데이터 초기화 완료');
  } catch (error) {
    console.error('해석 데이터 초기화 실패:', error);
    throw error;
  }
}

function interpret사주(사주, 오행분석) {
  if (!해석데이터) {
    throw new Error('해석 데이터가 초기화되지 않았습니다.');
  }

  return {
    기본해석: interpret기본사주(사주),
    오행해석: interpret오행(오행분석),
    종합해석: generate종합해석(사주, 오행분석)
  };
}

function interpret기본사주(사주) {
  return {
    년주: {
      설명: `${사주.년주.천간.한글}${사주.년주.지지.한글}년`,
      의미: get기본의미(사주.년주)
    },
    월주: {
      설명: `${사주.월주.천간.한글}${사주.월주.지지.한글}월`,
      의미: get기본의미(사주.월주)
    },
    일주: {
      설명: `${사주.일주.천간.한글}${사주.일주.지지.한글}일`,
      의미: get기본의미(사주.일주)
    },
    시주: {
      설명: `${사주.시주.천간.한글}${사주.시주.지지.한글}시`,
      의미: get기본의미(사주.시주)
    }
  };
}

function get기본의미(주) {
  if (!주 || !주.천간 || !주.지지) {
    return {
      천간: '데이터 없음',
      지지: '데이터 없음'
    };
  }

  const 천간의미 = 해석데이터.천간[주.천간.한자] || {};
  const 지지의미 = 해석데이터.지지[주.지지.한자] || {};

  return {
    천간: {
      기본의미: 천간의미.기본의미 || '해석 데이터 없음',
      설명: 천간의미.설명 || '설명 데이터 없음',
      주요오행: 천간의미.주요오행 || '오행 데이터 없음',
      특성: 천간의미.특성 || []
    },
    지지: {
      기본의미: 지지의미.기본의미 || '해석 데이터 없음',
      설명: 지지의미.설명 || '설명 데이터 없음',
      주요오행: 지지의미.주요오행 || '오행 데이터 없음',
      특성: 지지의미.특성 || []
    }
  };
}

function interpret오행(오행분석) {
  if (!오행분석) {
    return {
      오행분포: [],
      오행관계: { 상생: [], 상극: [] }
    };
  }

  const 분포해석 = analyze오행분포(오행분석.오행분포);
  const 관계해석 = analyze오행관계(오행분석.상생상극);

  return {
    오행분포: 분포해석,
    오행관계: 관계해석
  };
}

function analyze오행분포(분포) {
  if (!분포) {
    return [];
  }

  const 총개수 = Object.values(분포).reduce((a, b) => a + b, 0);
  const 분석결과 = [];

  for (const [오행, 개수] of Object.entries(분포)) {
    const 비율 = (개수 / 총개수 * 100).toFixed(1);
    const 평가 = get오행비율평가(비율);
    
    분석결과.push({
      오행,
      개수,
      비율: `${비율}%`,
      평가,
      설명: 해석데이터.오행관계.기본속성[오행]?.설명 || '설명 없음',
      특성: 해석데이터.오행관계.기본속성[오행]?.특성 || []
    });
  }

  return 분석결과;
}

function get오행비율평가(비율) {
  const 비율값 = parseFloat(비율);
  if (비율값 === 0) return '결핍';
  if (비율값 < 15) return '부족';
  if (비율값 < 25) return '적정';
  if (비율값 < 35) return '양호';
  return '과다';
}

function analyze오행관계(상생상극) {
  if (!상생상극) {
    return {
      상생: [],
      상극: []
    };
  }

  return {
    상생: 상생상극.상생관계.map(관계 => ({
      설명: 관계.설명,
      의미: get상생의미(관계.from, 관계.to)
    })),
    상극: 상생상극.상극관계.map(관계 => ({
      설명: 관계.설명,
      의미: get상극의미(관계.from, 관계.to)
    }))
  };
}

function get상생의미(from, to) {
  return 해석데이터.오행관계?.상생[`${from}-${to}`] || 
         `${from}이(가) ${to}을(를) 생하는 기운`;
}

function get상극의미(from, to) {
  return 해석데이터.오행관계?.상극[`${from}-${to}`] || 
         `${from}이(가) ${to}을(를) 제약하는 기운`;
}

function generate종합해석(사주, 오행분석) {
  const 일주천간 = 사주.일주.천간.한글;
  const 월주지지 = 사주.월주.지지.한글;
  
  return {
    성격: get성격해석(사주, 오행분석),
    운세: get운세해석(사주, 오행분석),
    조언: get조언(오행분석)
  };
}

function get성격해석(사주, 오행분석) {
  // 성격 해석 로직
  return "성격 해석은 준비 중입니다.";
}

function get운세해석(사주, 오행분석) {
  // 운세 해석 로직
  return "운세 해석은 준비 중입니다.";
}

function get조언(오행분석) {
  // 조언 생성 로직
  return "조언은 준비 중입니다.";
}

module.exports = {
  initialize,
  interpret사주
}; 