# 완성도 - AI 코딩 가이드

> 이 파일은 Cursor, Copilot, Windsurf 등 다양한 AI 코딩 도구를 위한 프로젝트 규칙입니다.
> 프로젝트의 모든 코딩 규칙은 **CLAUDE.md**에 원본이 관리되며, 이 파일은 이를 참조합니다.

## 규칙 원본

이 프로젝트는 `CLAUDE.md`를 Single Source of Truth로 사용합니다.
모든 AI 도구는 아래 파일들을 읽고 규칙을 따라주세요.

| 파일                              | 내용                                                               |
| --------------------------------- | ------------------------------------------------------------------ |
| `CLAUDE.md`                       | 프로젝트 전체 규칙 (빌드, 검증, 아키텍처, Git 컨벤션, 코드 스타일) |
| `.claude/rules/rendering.md`      | 렌더링 & 캐싱 전략 상세                                            |
| `.claude/rules/tanstack-query.md` | TanStack Query v5 패턴 상세                                        |
| `.claude/rules/code-style.md`     | 코드 스타일 규칙 상세                                              |

규칙 변경 시 `CLAUDE.md` 또는 `.claude/rules/` 파일을 직접 수정하세요.
이 파일은 참조 안내 역할이므로 별도 수정이 필요하지 않습니다.
