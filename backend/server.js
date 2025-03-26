const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const apiRouter = require('./routes/api');
const sajuCalculator = require('./utils/sajuCalculator');
const fiveElementsAnalyzer = require('./utils/fiveElementsAnalyzer');
const sajuInterpreter = require('./utils/sajuInterpreter');

const app = express();

app.use(cors());
app.use(express.json());

// 서버 시작 시 초기화
Promise.all([
  sajuCalculator.initialize(),
  fiveElementsAnalyzer.initialize(),
  sajuInterpreter.initialize()
]).catch(console.error);

// API 라우트 설정
app.use('/api', apiRouter);

const PORT = process.env.PORT || 5000;

// 에러 처리 미들웨어
const errorHandler = (err, req, res, next) => {
  console.error('에러 발생:', err);
  res.status(500).json({
    error: err.message || '서버 내부 오류가 발생했습니다.'
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 