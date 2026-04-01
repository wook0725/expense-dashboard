/**
 * Firebase에 지출내역 직접 업로드 스크립트
 *
 * 사용법:
 * 1. Firebase 서비스 계정 키 다운로드 (Console → 프로젝트 설정 → 서비스 계정 → 키 생성)
 * 2. 파일을 serviceAccountKey.json으로 저장 (이 파일과 같은 폴더에)
 * 3. node upload-to-firebase.js 실행
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 서비스 계정 키 파일 경로
const keyPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(keyPath)) {
  console.error('❌ serviceAccountKey.json 파일을 찾을 수 없습니다.');
  console.error('Firebase Console에서 서비스 계정 키를 다운로드하세요:');
  console.error('1. https://console.firebase.google.com/');
  console.error('2. 프로젝트 선택: expense-dashboard-fec2d');
  console.error('3. ⚙️ 설정 → 서비스 계정');
  console.error('4. "새 비공개 키 생성" 클릭');
  console.error('5. 다운로드한 JSON 파일을 serviceAccountKey.json으로 이 폴더에 저장');
  process.exit(1);
}

// Firebase Admin SDK 초기화
const serviceAccount = require(keyPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://expense-dashboard-fec2d-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database();

// 지출내역 데이터 (index.html에서 추출)
const recentTransactions = [
  {date:'2026-03-28', name:'모찌이야기', cat:'음식/카페', account:'신한카드', amount:4500},
  {date:'2026-03-28', name:'포토이즘박스 원주무실점', cat:'기타', account:'신한카드', amount:5000},
  {date:'2026-03-27', name:'텐퍼센트커피 원주기업도시점', cat:'음식/카페', account:'신한카드', amount:4200},
  {date:'2026-03-26', name:'빵집오빠 원주 기업도시점', cat:'기타', account:'신한카드', amount:3000},
  {date:'2026-03-26', name:'책읽는루브르아뜰리에원주기업도', cat:'기타', account:'신한카드', amount:60000},
  {date:'2026-03-25', name:'네이버파이낸셜(주)', cat:'택시/교통', account:'신한카드', amount:33900},
  {date:'2026-03-20', name:'문구방구(원주기업도시점)', cat:'기타', account:'신한카드', amount:500},
  {date:'2026-03-20', name:'더까까주까 원주점', cat:'기타', account:'신한카드', amount:1300},
  {date:'2026-03-20', name:'메가엠지씨커피시화(MTV)26로점', cat:'음식/카페', account:'신한카드', amount:33000},
  {date:'2026-03-18', name:'씨유(CU)원주뉴호반점', cat:'쇼핑', account:'신한카드', amount:2400},
  {date:'2026-03-13', name:'FBS출금', cat:'기타', account:'KB은행', amount:362990},
  {date:'2026-03-13', name:'네이버파이낸셜(주)', cat:'택시/교통', account:'신한카드', amount:35850},
  {date:'2026-03-13', name:'씨유(CU)원주뉴호반점', cat:'쇼핑', account:'신한카드', amount:2500},
  {date:'2026-03-13', name:'인터넷입금이체', cat:'주거/유틸', account:'KB은행', amount:0},
  {date:'2026-03-12', name:'책읽는루브르아뜰리에원주기업도', cat:'기타', account:'신한카드', amount:96000},
  {date:'2026-03-12', name:'영신문구', cat:'기타', account:'신한카드', amount:1000},
  {date:'2026-03-12', name:'CMS 공동', cat:'기타', account:'KB은행', amount:500000},
  {date:'2026-03-12', name:'국민카드', cat:'기타', account:'KB은행', amount:3278379},
  {date:'2026-03-11', name:'SK텔레콤', cat:'택시/교통', account:'신한카드', amount:66800},
  {date:'2026-03-10', name:'기일출금', cat:'기타', account:'KB은행', amount:353017},
  {date:'2026-03-10', name:'국민분식', cat:'음식/카페', account:'신한카드', amount:2000},
  {date:'2026-03-10', name:'카드입금', cat:'기타', account:'KB은행', amount:0},
  {date:'2026-03-10', name:'전자금융', cat:'기타', account:'KB은행', amount:0},
  {date:'2026-03-03', name:'타행자동', cat:'기타', account:'KB은행', amount:10000},
  {date:'2026-03-01', name:'엔젤스 코인노래연습장 원주기업', cat:'기타', account:'신한카드', amount:5000},
  {date:'2026-03-01', name:'봉봉스테이션 원주기업도시점', cat:'기타', account:'신한카드', amount:3000},
  {date:'2026-03-01', name:'봉봉스테이션 원주기업도시점', cat:'기타', account:'신한카드', amount:1000},
  {date:'2026-02-27', name:'파리바게뜨원주기업이지더원점', cat:'기타', account:'신한카드', amount:3000},
  {date:'2026-02-26', name:'영신문구', cat:'기타', account:'신한카드', amount:4000},
  {date:'2026-02-25', name:'세븐일레븐 원주골드파크점', cat:'기타', account:'신한카드', amount:1300},
  {date:'2026-02-20', name:'CMS 공동', cat:'기타', account:'KB은행', amount:52501},
  {date:'2026-02-20', name:'CMS 공동', cat:'기타', account:'KB은행', amount:118280},
  {date:'2026-02-20', name:'씨유(CU)원주뉴호반점', cat:'쇼핑', account:'신한카드', amount:4600},
  {date:'2026-02-20', name:'(주)카카오', cat:'기타', account:'신한카드', amount:50000},
  {date:'2026-02-20', name:'CMS 공동', cat:'기타', account:'KB은행', amount:55080}
];

// Firebase 키 정규화 함수
function sanitizeFirebaseKey(key) {
  return key.replace(/[|]/g, '_');
}

// Firebase에 업로드
async function uploadTransactions() {
  try {
    console.log('⏳ 지출내역을 Firebase에 업로드 중...');

    const transactionsObj = {};
    recentTransactions.forEach((tx, idx) => {
      const key = sanitizeFirebaseKey(`${tx.date}|${tx.name}|${tx.amount}`);
      transactionsObj[key] = {
        date: tx.date,
        name: tx.name,
        amount: tx.amount,
        category: tx.cat,
        account: tx.account,
        uploadedAt: new Date().toISOString()
      };
    });

    // Firebase에 데이터 저장
    await db.ref('transactions').set(transactionsObj);

    console.log('✅ 완료! ' + Object.keys(transactionsObj).length + '건의 지출내역이 Firebase에 업로드됨');
    console.log('\n📊 Firebase Console에서 확인: https://console.firebase.google.com/');
    console.log('프로젝트: expense-dashboard-fec2d → Realtime Database → Data 탭\n');

  } catch (error) {
    console.error('❌ 업로드 실패:', error.message);
    process.exit(1);
  }
}

// 실행
uploadTransactions().then(() => {
  process.exit(0);
});
