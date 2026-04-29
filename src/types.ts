export interface OrgInfo {
  slogan: string;
  name: string;
  englishName: string;
  zipCode: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  homepage: string;
  ceo: string;
  [key: string]: string;
}

export interface DocumentHistory {
  date: string;
  action: string;
  note?: string;
  actor?: string;
}

export type ApproverStatus = '대기중' | '결재완료' | '반려';

export interface Approver {
  name: string;
  role: string;
  status: ApproverStatus;
  date?: string;
}

export type DocCategory = '내부기안' | '발송공문' | '접수공문';

export interface AttachedFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface DocumentData {
  id: number;
  docNo: string;
  type: DocCategory;
  regDate: string;
  title: string;
  content: string;
  attachment?: string; // 붙임
  attachedFiles?: AttachedFile[]; // 실제 첨부파일
  drafter: string;     // 담당 / 기안자
  recipient: string;   // 수신
  via?: string;        // 경유
  manager?: string;    // 주무관
  cooperator?: string; // 협조자
  pages: number;       // 페이지수
  approvalType: '1단 결재' | '2단 결재' | '3단 결재';
  approvers: Approver[]; // 결재 라인
  status: ApproverStatus;
  history: DocumentHistory[];
}

export interface User {
  id: string;
  name: string;
  role: string;
}
