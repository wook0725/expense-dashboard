# Firebase 직접 업로드 가이드

## 🚀 빠른 시작 (3단계)

### 1️⃣ Firebase 서비스 계정 키 다운로드

1. **Firebase Console 접속**
   ```
   https://console.firebase.google.com/
   ```

2. **프로젝트 선택**
   ```
   expense-dashboard-fec2d
   ```

3. **서비스 계정 키 생성**
   ```
   ⚙️ 프로젝트 설정 → 서비스 계정 → 새 비공개 키 생성
   ```

4. **키 파일 저장**
   - 다운로드된 JSON 파일을 `serviceAccountKey.json` 으로 저장
   - 이 폴더 (지출내역) 에 저장할 것

### 2️⃣ Node.js 설치 (처음 1회만)

```bash
# 이미 설치되어 있으면 스킵
node --version

# npm 필요한 패키지 설치
npm install firebase-admin
```

### 3️⃣ 업로드 실행

```bash
node upload-to-firebase.js
```

**결과:**
```
⏳ 지출내역을 Firebase에 업로드 중...
✅ 완료! 217건의 지출내역이 Firebase에 업로드됨

📊 Firebase Console에서 확인: https://console.firebase.google.com/
프로젝트: expense-dashboard-fec2d → Realtime Database → Data 탭
```

---

## 📁 Firebase 저장 구조

업로드 완료 후 Firebase에 저장되는 구조:

```
/transactions/
├─ 2026-03-28_모찌이야기_4500: {
│   "date": "2026-03-28",
│   "name": "모찌이야기",
│   "amount": 4500,
│   "category": "음식/카페",
│   "account": "신한카드",
│   "uploadedAt": "2026-04-01T12:34:56.789Z"
├─ 2026-03-28_포토이즘박스_5000: {...}
├─ 2026-03-27_텐퍼센트커피_4200: {...}
└─ ... (217건)

/categories/  ← 기존 (사용자가 수정한 카테고리)
├─ 2026-03-28_거래항목_금액: "수정된카테고리"
└─ ...
```

---

## ✅ 업로드 확인 방법

### 방법 1: Firebase Console 직접 확인 (추천)

1. https://console.firebase.google.com/
2. 프로젝트: `expense-dashboard-fec2d`
3. **Realtime Database** → **Data** 탭
4. `/transactions/` 클릭 → 217건 확인

### 방법 2: 브라우저 개발자도구 Console 확인

```javascript
// 대시보드 열고 Console 탭에서 실행
console.log('✅ 모든 지출내역이 Firebase에 업로드됨');
```

### 방법 3: 네트워크 탭에서 요청 확인

1. F12 → Network 탭
2. 대시보드 새로고침
3. `firebase...` 요청 확인
4. Response 탭에서 데이터 확인

---

## 🔒 보안 주의사항

⚠️ **serviceAccountKey.json 은 절대 GitHub에 올리지 마세요!**

```bash
# .gitignore에 추가되어야 함
echo "serviceAccountKey.json" >> .gitignore
git add .gitignore
git commit -m "Add serviceAccountKey.json to .gitignore"
git push
```

현재 상태 확인:
```bash
git status
```

---

## 🐛 문제 해결

### 1) "Cannot find module 'firebase-admin'"

```bash
npm install firebase-admin
```

### 2) "serviceAccountKey.json을 찾을 수 없습니다"

- 파일명이 정확한지 확인 (대소문자 구분)
- 이 폴더 (지출내역) 에 있는지 확인

### 3) "Permission denied" 에러

- Firebase Security Rules 확인
- Console → Realtime Database → Rules 탭
- 현재 Rules:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```

### 4) 업로드는 되었는데 대시보드에 안 보임

```javascript
// 브라우저 Console에서 실행
localStorage.removeItem('transactionsUploaded_v1');
location.reload();
```

---

## 📊 데이터 동기화

| 저장소 | 용도 | 동기화 |
|-------|------|--------|
| **Firebase** | 클라우드 (여러 기기 동기화) | ✅ |
| **localStorage** | 브라우저 로컬 저장 | ✅ 자동 |
| **index.html** | 초기 데이터 (하드코딩) | 수동 |

---

## 🚀 고급: 업로드 스크립트 커스터마이징

`upload-to-firebase.js` 수정:

```javascript
// 추가 필드 저장
transactionsObj[key] = {
  date: tx.date,
  name: tx.name,
  amount: tx.amount,
  category: tx.cat,
  account: tx.account,
  uploadedAt: new Date().toISOString(),
  // 추가 필드
  type: '지출',  // 거래 타입
  tags: ['신한카드']  // 태그
};
```

저장 후:
```bash
node upload-to-firebase.js
```

---

## 📞 문의

스크립트 관련 이슈: Console 에러 메시지 확인
Firebase 관련 이슈: https://console.firebase.google.com/ 확인
