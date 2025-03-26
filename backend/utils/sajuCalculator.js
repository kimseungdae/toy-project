const fs = require('fs').promises;
const path = require('path');

let 천간 = [];
let 지지 = [];

async function initialize() {
  try {
    const celestialStemsPath = path.join(__dirname, '../data/celestialStems.json');
    const earthlyBranchesPath = path.join(__dirname, '../data/earthlyBranches.json');
    
    const [celestialStemsData, earthlyBranchesData] = await Promise.all([
      fs.readFile(celestialStemsPath, 'utf8'),
      fs.readFile(earthlyBranchesPath, 'utf8')
    ]);

    const celestialStemsJson = JSON.parse(celestialStemsData);
    const earthlyBranchesJson = JSON.parse(earthlyBranchesData);
    
    천간 = celestialStemsJson.천간 || celestialStemsJson;
    지지 = earthlyBranchesJson.지지 || earthlyBranchesJson;

    if (!Array.isArray(천간) || !Array.isArray(지지)) {
      throw new Error('천간과 지지 데이터가 배열 형태가 아닙니다.');
    }

    console.log('초기화 완료:', {
      천간개수: 천간.length,
      지지개수: 지지.length
    });
  } catch (error) {
    console.error('초기화 중 오류 발생:', error);
    throw error;
  }
}

function calculate사주(year, month, day, hour, minute) {
  if (!Array.isArray(천간) || !Array.isArray(지지)) {
    throw new Error('천간과 지지 데이터가 초기화되지 않았습니다.');
  }

  const 년주 = 계산년주(parseInt(year));
  const 월주 = 계산월주(
    천간.findIndex(간 => 간.한자 === 년주.천간.한자),
    parseInt(month)
  );
  const 일주 = 계산일주(parseInt(year), parseInt(month), parseInt(day));
  const 시주 = 계산시주(
    천간.findIndex(간 => 간.한자 === 일주.천간.한자),
    parseInt(hour)
  );

  return { 년주, 월주, 일주, 시주 };
}

function 계산년주(year) {
  const 간index = (year - 4) % 10;
  const 지index = (year - 4) % 12;
  
  return {
    천간: 천간[간index],
    지지: 지지[지index]
  };
}

function 계산월주(년간index, month) {
  const 간시작점 = (년간index * 2 + 1) % 10;
  const 간index = (간시작점 + month - 1) % 10;
  const 지index = (month + 1) % 12;
  
  return {
    천간: 천간[간index],
    지지: 지지[지index]
  };
}

function 계산일주(year, month, day) {
  // 1900년 1월 1일은 갑자일
  const 기준일 = new Date(1900, 0, 1);
  const 대상일 = new Date(year, month - 1, day);
  const 일수차이 = Math.floor((대상일 - 기준일) / (1000 * 60 * 60 * 24));
  
  const 간index = 일수차이 % 10;
  const 지index = 일수차이 % 12;
  
  return {
    천간: 천간[간index],
    지지: 지지[지index]
  };
}

function 계산시주(일간index, hour) {
  const 간시작점 = (일간index * 2) % 10;
  const 시간간지index = Math.floor((hour + 1) / 2) % 12;
  const 간index = (간시작점 + 시간간지index) % 10;
  
  return {
    천간: 천간[간index],
    지지: 지지[시간간지index]
  };
}

module.exports = {
  initialize,
  calculate사주,
  천간,
  지지,
  계산년주,
  계산월주,
  계산일주,
  계산시주
}; 