# WeGet TODO 애플리케이션 ERD 논리 설계서

## 1. 문서 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | WeGet TODO |
| 문서명 | ERD 논리 설계서 |
| 작성일 | 2026-03-25 |
| 작성자 | Claude |
| 버전 | 1.0 |

---

## 2. 데이터베이스 개요

### 2.1 데이터베이스 목적
WeGet TODO 애플리케이션의 모든 데이터를 로컬에 안전하게 저장하고 관리하기 위한 데이터베이스

### 2.2 데이터베이스 종류
- **DBMS**: SQLite 3
- **암호화**: SQLCipher (AES-256)
- **위치**: 로컬 사용자 디렉토리

### 2.3 주요 특징
- 로컬 파일 기반 경량 데이터베이스
- 전체 DB 파일 암호화
- 트랜잭션 지원
- 외래 키 제약조건 지원

---

## 3. 엔티티 정의

### 3.1 TODO (할 일)
**설명**: 사용자가 완료해야 할 작업 항목을 관리하는 엔티티

**속성**:
| 속성명(영문) | 속성명(한글) | 데이터 타입 | 길이 | NULL 허용 | 기본값 | 설명 |
|-------------|-------------|------------|------|-----------|--------|------|
| id | 할일ID | TEXT | 36 | N | UUID | 기본키, UUID v4 형식 |
| title | 제목 | TEXT | 200 | N | - | 할 일 제목 |
| content | 내용 | TEXT | 5000 | Y | NULL | 할 일 상세 내용 |
| priority | 우선순위 | TEXT | 10 | N | 'medium' | high, medium, low 중 하나 |
| due_date | 마감일 | TEXT | 10 | Y | NULL | YYYY-MM-DD 형식 |
| completed | 완료여부 | INTEGER | 1 | N | 0 | 0: 미완료, 1: 완료 |
| completed_at | 완료일시 | TEXT | 19 | Y | NULL | YYYY-MM-DD HH:MM:SS 형식 |
| created_at | 생성일시 | TEXT | 19 | N | CURRENT_TIMESTAMP | YYYY-MM-DD HH:MM:SS 형식 |
| updated_at | 수정일시 | TEXT | 19 | N | CURRENT_TIMESTAMP | YYYY-MM-DD HH:MM:SS 형식 |

**제약조건**:
- PRIMARY KEY: id
- CHECK: priority IN ('high', 'medium', 'low')
- CHECK: completed IN (0, 1)

---

### 3.2 EVENT (일정)
**설명**: 달력에 등록되는 일정 정보를 관리하는 엔티티

**속성**:
| 속성명(영문) | 속성명(한글) | 데이터 타입 | 길이 | NULL 허용 | 기본값 | 설명 |
|-------------|-------------|------------|------|-----------|--------|------|
| id | 일정ID | TEXT | 36 | N | UUID | 기본키, UUID v4 형식 |
| title | 제목 | TEXT | 200 | N | - | 일정 제목 |
| content | 내용 | TEXT | 5000 | Y | NULL | 일정 상세 내용 |
| start_date | 시작일 | TEXT | 10 | N | - | YYYY-MM-DD 형식 |
| start_time | 시작시간 | TEXT | 5 | Y | NULL | HH:MM 형식 |
| end_date | 종료일 | TEXT | 10 | Y | NULL | YYYY-MM-DD 형식 |
| end_time | 종료시간 | TEXT | 5 | Y | NULL | HH:MM 형식 |
| all_day | 종일여부 | INTEGER | 1 | N | 0 | 0: 아니오, 1: 예 |
| recurrence_type | 반복유형 | TEXT | 20 | N | 'none' | none, daily, weekly, monthly, yearly |
| recurrence_end_date | 반복종료일 | TEXT | 10 | Y | NULL | YYYY-MM-DD 형식 |
| recurrence_rule | 반복규칙 | TEXT | 500 | Y | NULL | JSON 형식으로 저장 |
| created_at | 생성일시 | TEXT | 19 | N | CURRENT_TIMESTAMP | YYYY-MM-DD HH:MM:SS 형식 |
| updated_at | 수정일시 | TEXT | 19 | N | CURRENT_TIMESTAMP | YYYY-MM-DD HH:MM:SS 형식 |

**제약조건**:
- PRIMARY KEY: id
- CHECK: recurrence_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')
- CHECK: all_day IN (0, 1)

**반복규칙 JSON 예시**:
```json
{
  "type": "weekly",
  "interval": 1,
  "daysOfWeek": [1, 3, 5],  // 월, 수, 금
  "endDate": "2026-12-31"
}
```

---

### 3.3 TAG (태그)
**설명**: TODO를 분류하기 위한 태그 정보를 관리하는 엔티티

**속성**:
| 속성명(영문) | 속성명(한글) | 데이터 타입 | 길이 | NULL 허용 | 기본값 | 설명 |
|-------------|-------------|------------|------|-----------|--------|------|
| id | 태그ID | TEXT | 36 | N | UUID | 기본키, UUID v4 형식 |
| name | 태그명 | TEXT | 50 | N | - | # 제외한 태그명 |
| color | 색상 | TEXT | 7 | Y | NULL | 헥사코드 (#RRGGBB) |
| created_at | 생성일시 | TEXT | 19 | N | CURRENT_TIMESTAMP | YYYY-MM-DD HH:MM:SS 형식 |

**제약조건**:
- PRIMARY KEY: id
- UNIQUE: name

---

### 3.4 TODO_TAG (할일-태그 연결)
**설명**: TODO와 TAG의 다대다 관계를 관리하는 연결 테이블

**속성**:
| 속성명(영문) | 속성명(한글) | 데이터 타입 | 길이 | NULL 허용 | 기본값 | 설명 |
|-------------|-------------|------------|------|-----------|--------|------|
| todo_id | 할일ID | TEXT | 36 | N | - | 외래키 (TODO.id 참조) |
| tag_id | 태그ID | TEXT | 36 | N | - | 외래키 (TAG.id 참조) |
| created_at | 생성일시 | TEXT | 19 | N | CURRENT_TIMESTAMP | YYYY-MM-DD HH:MM:SS 형식 |

**제약조건**:
- PRIMARY KEY: (todo_id, tag_id) 복합키
- FOREIGN KEY: todo_id REFERENCES TODO(id) ON DELETE CASCADE
- FOREIGN KEY: tag_id REFERENCES TAG(id) ON DELETE CASCADE

---

### 3.5 APP_SETTINGS (앱 설정)
**설명**: 애플리케이션의 사용자 설정을 관리하는 엔티티

**속성**:
| 속성명(영문) | 속성명(한글) | 데이터 타입 | 길이 | NULL 허용 | 기본값 | 설명 |
|-------------|-------------|------------|------|-----------|--------|------|
| key | 설정키 | TEXT | 100 | N | - | 설정 항목의 고유 키 |
| value | 설정값 | TEXT | 1000 | Y | NULL | 설정 값 (JSON 가능) |
| updated_at | 수정일시 | TEXT | 19 | N | CURRENT_TIMESTAMP | YYYY-MM-DD HH:MM:SS 형식 |

**제약조건**:
- PRIMARY KEY: key

**설정 예시**:
- `window.alwaysOnTop`: "true" | "false"
- `window.opacity`: "0.3" ~ "1.0"
- `window.width`: "800"
- `window.height`: "600"
- `theme`: "light" | "dark"
- `language`: "ko" | "en"

---

## 4. 관계 정의

### 4.1 엔티티 관계 다이어그램 (ERD)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│     TODO     │         │  TODO_TAG    │         │     TAG      │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ PK id        │─────────│ FK todo_id   │─────────│ PK id        │
│    title     │    1    │ FK tag_id    │    N    │    name      │
│    content   │    :    ├──────────────┤    :    │    color     │
│    priority  │    N    │ PK (todo_id, │    1    │ created_at   │
│    due_date  │         │     tag_id)  │         └──────────────┘
│    completed │         │ created_at   │
│ completed_at │         └──────────────┘
│ created_at   │
│ updated_at   │
└──────────────┘

┌──────────────────┐
│      EVENT       │
├──────────────────┤
│ PK id            │
│    title         │
│    content       │
│    start_date    │
│    start_time    │
│    end_date      │
│    end_time      │
│    all_day       │
│    recurrence... │
│    created_at    │
│    updated_at    │
└──────────────────┘

┌──────────────────┐
│   APP_SETTINGS   │
├──────────────────┤
│ PK key           │
│    value         │
│    updated_at    │
└──────────────────┘
```

### 4.2 관계 상세 설명

#### 4.2.1 TODO ↔ TAG (다대다 관계)
- **관계명**: 할일-태그 연결
- **카디널리티**: N:M
- **연결 테이블**: TODO_TAG
- **설명**: 
  - 하나의 TODO는 여러 개의 TAG를 가질 수 있음
  - 하나의 TAG는 여러 개의 TODO에 사용될 수 있음
  - 중간 테이블(TODO_TAG)을 통해 관계 구현
- **참조 무결성**: CASCADE DELETE (TODO 또는 TAG 삭제 시 연결 정보도 함께 삭제)

#### 4.2.2 독립 엔티티
- **EVENT**: 다른 엔티티와 관계 없이 독립적으로 존재
- **APP_SETTINGS**: 다른 엔티티와 관계 없이 독립적으로 존재

---

## 5. 정규화 검토

### 5.1 제1정규형 (1NF)
**검토 결과**: ✅ 충족

- 모든 속성이 원자값(Atomic Value)을 가짐
- 반복 그룹이 없음
- `tags` 속성을 별도 테이블(TAG)로 분리하여 다중값 속성 제거

### 5.2 제2정규형 (2NF)
**검토 결과**: ✅ 충족

- 모든 비키 속성이 기본키에 완전 함수 종속
- 부분 함수 종속이 없음
- TODO_TAG 테이블의 복합키(todo_id, tag_id)에 대해 비키 속성인 created_at만 존재하며, 이는 완전 함수 종속

### 5.3 제3정규형 (3NF)
**검토 결과**: ✅ 충족

- 이행적 함수 종속이 없음
- 모든 비키 속성이 기본키에만 종속

### 5.4 BCNF (Boyce-Codd Normal Form)
**검토 결과**: ✅ 충족

- 모든 결정자가 후보키
- 현재 설계에서는 추가 정규화 불필요

---

## 6. 인덱스 설계

### 6.1 TODO 테이블
```sql
-- 기본키 인덱스 (자동 생성)
PRIMARY KEY (id)

-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_todo_priority ON TODO(priority);
CREATE INDEX idx_todo_due_date ON TODO(due_date);
CREATE INDEX idx_todo_completed ON TODO(completed);
CREATE INDEX idx_todo_created_at ON TODO(created_at);

-- 복합 인덱스 (자주 사용되는 조회 패턴)
CREATE INDEX idx_todo_priority_due ON TODO(priority, due_date);
CREATE INDEX idx_todo_completed_created ON TODO(completed, created_at);
```

### 6.2 EVENT 테이블
```sql
-- 기본키 인덱스 (자동 생성)
PRIMARY KEY (id)

-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_event_start_date ON EVENT(start_date);
CREATE INDEX idx_event_recurrence_type ON EVENT(recurrence_type);
CREATE INDEX idx_event_created_at ON EVENT(created_at);
```

### 6.3 TAG 테이블
```sql
-- 기본키 인덱스 (자동 생성)
PRIMARY KEY (id)

-- 유니크 인덱스
CREATE UNIQUE INDEX idx_tag_name ON TAG(name);
```

### 6.4 TODO_TAG 테이블
```sql
-- 복합 기본키 인덱스 (자동 생성)
PRIMARY KEY (todo_id, tag_id)

-- 역방향 조회를 위한 인덱스
CREATE INDEX idx_todo_tag_tag_id ON TODO_TAG(tag_id);
```

---

## 7. DDL (Data Definition Language)

### 7.1 테이블 생성 스크립트

```sql
-- TODO 테이블 생성
CREATE TABLE IF NOT EXISTS TODO (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high', 'medium', 'low')),
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0 CHECK(completed IN (0, 1)),
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- EVENT 테이블 생성
CREATE TABLE IF NOT EXISTS EVENT (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    start_date TEXT NOT NULL,
    start_time TEXT,
    end_date TEXT,
    end_time TEXT,
    all_day INTEGER NOT NULL DEFAULT 0 CHECK(all_day IN (0, 1)),
    recurrence_type TEXT NOT NULL DEFAULT 'none' CHECK(recurrence_type IN ('none', 'daily', 'weekly', 'monthly', 'yearly')),
    recurrence_end_date TEXT,
    recurrence_rule TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- TAG 테이블 생성
CREATE TABLE IF NOT EXISTS TAG (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- TODO_TAG 테이블 생성
CREATE TABLE IF NOT EXISTS TODO_TAG (
    todo_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    PRIMARY KEY (todo_id, tag_id),
    FOREIGN KEY (todo_id) REFERENCES TODO(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES TAG(id) ON DELETE CASCADE
);

-- APP_SETTINGS 테이블 생성
CREATE TABLE IF NOT EXISTS APP_SETTINGS (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_todo_priority ON TODO(priority);
CREATE INDEX IF NOT EXISTS idx_todo_due_date ON TODO(due_date);
CREATE INDEX IF NOT EXISTS idx_todo_completed ON TODO(completed);
CREATE INDEX IF NOT EXISTS idx_todo_created_at ON TODO(created_at);
CREATE INDEX IF NOT EXISTS idx_todo_priority_due ON TODO(priority, due_date);
CREATE INDEX IF NOT EXISTS idx_todo_completed_created ON TODO(completed, created_at);

CREATE INDEX IF NOT EXISTS idx_event_start_date ON EVENT(start_date);
CREATE INDEX IF NOT EXISTS idx_event_recurrence_type ON EVENT(recurrence_type);
CREATE INDEX IF NOT EXISTS idx_event_created_at ON EVENT(created_at);

CREATE INDEX IF NOT EXISTS idx_todo_tag_tag_id ON TODO_TAG(tag_id);

-- updated_at 자동 갱신 트리거
CREATE TRIGGER IF NOT EXISTS update_todo_timestamp 
AFTER UPDATE ON TODO
BEGIN
    UPDATE TODO SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_event_timestamp 
AFTER UPDATE ON EVENT
BEGIN
    UPDATE EVENT SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_app_settings_timestamp 
AFTER UPDATE ON APP_SETTINGS
BEGIN
    UPDATE APP_SETTINGS SET updated_at = datetime('now', 'localtime') WHERE key = NEW.key;
END;
```

---

## 8. 샘플 데이터

### 8.1 TODO 샘플 데이터
```sql
INSERT INTO TODO (id, title, content, priority, due_date, completed) VALUES
('550e8400-e29b-41d4-a716-446655440001', '프로젝트 기획서 작성', '2차 스프린트 기획서 초안 작성', 'high', '2026-03-30', 0),
('550e8400-e29b-41d4-a716-446655440002', '주간 회의 준비', '발표 자료 및 리포트 준비', 'medium', '2026-03-26', 0),
('550e8400-e29b-41d4-a716-446655440003', 'React 스터디', 'Hooks 심화 학습', 'low', '2026-04-05', 0);
```

### 8.2 TAG 샘플 데이터
```sql
INSERT INTO TAG (id, name, color) VALUES
('650e8400-e29b-41d4-a716-446655440001', '업무', '#FF5733'),
('650e8400-e29b-41d4-a716-446655440002', '개인', '#33FF57'),
('650e8400-e29b-41d4-a716-446655440003', '학습', '#3357FF');
```

### 8.3 TODO_TAG 샘플 데이터
```sql
INSERT INTO TODO_TAG (todo_id, tag_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003');
```

### 8.4 EVENT 샘플 데이터
```sql
INSERT INTO EVENT (id, title, content, start_date, start_time, recurrence_type) VALUES
('750e8400-e29b-41d4-a716-446655440001', '팀 미팅', '주간 팀 회의', '2026-03-26', '10:00', 'weekly'),
('750e8400-e29b-41d4-a716-446655440002', '점심 약속', '친구와 점심', '2026-03-27', '12:00', 'none');
```

### 8.5 APP_SETTINGS 샘플 데이터
```sql
INSERT INTO APP_SETTINGS (key, value) VALUES
('window.alwaysOnTop', 'false'),
('window.opacity', '1.0'),
('window.width', '800'),
('window.height', '600'),
('theme', 'light'),
('language', 'ko');
```

---

## 9. 조회 쿼리 예시

### 9.1 우선순위별 미완료 TODO 조회
```sql
SELECT t.*, GROUP_CONCAT(tag.name) AS tags
FROM TODO t
LEFT JOIN TODO_TAG tt ON t.id = tt.todo_id
LEFT JOIN TAG tag ON tt.tag_id = tag.id
WHERE t.completed = 0
GROUP BY t.id
ORDER BY 
    CASE t.priority 
        WHEN 'high' THEN 1 
        WHEN 'medium' THEN 2 
        WHEN 'low' THEN 3 
    END,
    t.due_date ASC;
```

### 9.2 특정 날짜의 TODO 및 일정 조회
```sql
-- TODO 조회
SELECT * FROM TODO 
WHERE due_date = '2026-03-26' 
ORDER BY priority;

-- 일정 조회
SELECT * FROM EVENT 
WHERE start_date = '2026-03-26' 
   OR (recurrence_type != 'none' AND start_date <= '2026-03-26')
ORDER BY start_time;
```

### 9.3 특정 태그의 TODO 조회
```sql
SELECT t.*
FROM TODO t
INNER JOIN TODO_TAG tt ON t.id = tt.todo_id
INNER JOIN TAG tag ON tt.tag_id = tag.id
WHERE tag.name = '업무'
ORDER BY t.priority, t.due_date;
```

### 9.4 완료율 통계 조회
```sql
SELECT 
    COUNT(*) AS total_todos,
    SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed_todos,
    ROUND(
        CAST(SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS FLOAT) / COUNT(*) * 100, 
        2
    ) AS completion_rate
FROM TODO;
```

---

## 10. 데이터 무결성 규칙

### 10.1 도메인 무결성
- priority 값은 'high', 'medium', 'low' 중 하나만 허용
- completed 값은 0 또는 1만 허용
- recurrence_type 값은 'none', 'daily', 'weekly', 'monthly', 'yearly' 중 하나만 허용
- 날짜 형식은 'YYYY-MM-DD' 준수
- 시간 형식은 'HH:MM' 준수

### 10.2 엔티티 무결성
- 모든 테이블은 PRIMARY KEY를 가짐
- PRIMARY KEY는 NULL 값을 허용하지 않음
- UUID v4 형식의 고유 ID 사용

### 10.3 참조 무결성
- TODO_TAG.todo_id는 TODO.id를 참조
- TODO_TAG.tag_id는 TAG.id를 참조
- 부모 레코드 삭제 시 자식 레코드도 함께 삭제 (CASCADE DELETE)

### 10.4 비즈니스 규칙
- TODO의 due_date는 created_at보다 이후여야 함
- completed = 1일 경우 completed_at은 반드시 값이 있어야 함
- EVENT의 end_date는 start_date보다 이후여야 함
- TAG의 name은 중복될 수 없음

---

## 11. 마이그레이션 전략

### 11.1 버전 관리
```sql
CREATE TABLE IF NOT EXISTS DB_VERSION (
    version TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

INSERT INTO DB_VERSION (version) VALUES ('1.0.0');
```

### 11.2 향후 스키마 변경 시 마이그레이션 스크립트 예시
```sql
-- v1.1.0: TODO에 estimated_time 컬럼 추가
ALTER TABLE TODO ADD COLUMN estimated_time INTEGER; -- 예상 소요 시간(분)

-- v1.2.0: TODO에 actual_time 컬럼 추가
ALTER TABLE TODO ADD COLUMN actual_time INTEGER; -- 실제 소요 시간(분)

-- 버전 업데이트
INSERT INTO DB_VERSION (version) VALUES ('1.1.0');
```

---

## 12. 백업 및 복구 전략

### 12.1 백업 방법
- SQLite 파일 전체를 주기적으로 복사
- 애플리케이션 종료 시 자동 백업
- 사용자가 수동으로 백업 트리거 가능

### 12.2 백업 파일명 규칙
```
weget_todo_backup_YYYYMMDD_HHmmss.db
예: weget_todo_backup_20260325_143022.db
```

### 12.3 복구 절차
1. 백업 파일 선택
2. 현재 DB 파일을 임시 위치로 이동
3. 백업 파일을 원래 위치로 복사
4. 복호화 키로 DB 열기 테스트
5. 성공 시 임시 파일 삭제, 실패 시 롤백

---

## 13. 부록

### 13.1 ERD 표기법
- **사각형**: 엔티티
- **마름모**: 관계
- **타원**: 속성
- **실선**: 식별 관계
- **점선**: 비식별 관계
- **1:N**: 일대다 관계
- **N:M**: 다대다 관계

### 13.2 데이터 타입 선택 근거
- **TEXT**: SQLite는 가변 길이 문자열을 효율적으로 처리
- **INTEGER**: Boolean 값을 0/1로 표현 (SQLite에 Boolean 타입 없음)
- **UUID**: 분산 시스템 확장 가능성 고려 (현재는 단일 사용자지만)
- **날짜/시간을 TEXT로 저장**: ISO 8601 형식 사용, SQLite의 날짜 함수 활용 가능

### 13.3 참고 자료
- SQLite 공식 문서: https://www.sqlite.org/docs.html
- SQLCipher 공식 문서: https://www.zetetic.net/sqlcipher/
- UUID 표준: RFC 4122

---

## 14. 변경 이력

| 버전 | 작성일 | 작성자 | 변경 내용 |
|------|--------|--------|-----------|
| 1.0  | 2026-03-25 | Claude | 초안 작성 |
