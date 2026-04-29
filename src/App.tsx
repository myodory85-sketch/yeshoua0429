import React, { useState, useEffect } from 'react';
import { Plus, Settings, FileText, Download } from 'lucide-react';
import { OrgInfo, DocumentData, User } from './types';
import Dashboard from './components/Dashboard';
import CreateDraft from './components/CreateDraft';
import PrintPreview from './components/PrintPreview';
import AdminSettings from './components/AdminSettings';

const DEFAULT_USERS: User[] = [
  { id: '1', name: '오병석', role: '시설장' },
  { id: '2', name: '조현이', role: '사회복지사' },
  { id: '3', name: '정윤미', role: '주무관' },
];

export default function App() {
  const [view, setView] = useState<'dashboard' | 'preview'>('dashboard');
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[1]); // Default to 조현이
  const [showSettings, setShowSettings] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  
  const [docs, setDocs] = useState<DocumentData[]>([]);
  const [orgInfo, setOrgInfo] = useState<OrgInfo>({
    slogan: "소중한 한 사람 한 사람이 모여 함께 성장하는 우리",
    name: "예수와주간보호센터",
    englishName: "YESHOUA DAYCARE CENTER",
    zipCode: "06031",
    address: "서울특별시 강남구 압구정로22길 21, 4층",
    tel: "02-549-7766",
    fax: "02-3442-3030",
    email: "pologenius@hanmail.net",
    homepage: "http://cafe.naver.com/yeshoua7766",
    ceo: "오병석"
  });

  // Load from local storage
  useEffect(() => {
    const savedDocs = localStorage.getItem('yeshoua_agency_docs_v2');
    const savedOrg = localStorage.getItem('yeshoua_agency_org_v2');
    const savedUsers = localStorage.getItem('yeshoua_agency_users_v2');

    if (savedDocs) {
      try { setDocs(JSON.parse(savedDocs)); } catch (e) { console.error(e); }
    } else {
      // Mock data
      setDocs([{
        id: 1,
        docNo: '예수와 26-0001',
        type: '발송공문',
        title: '강남구보건소 분소 장애인치과 단체 내소진료 만족도 조사 제출',
        content: '내용입니다.',
        drafter: '조현이',
        recipient: '강남구보건소장',
        pages: 1,
        regDate: '2026. 01. 06.',
        approvalType: '2단 결재',
        status: '결재완료',
        approvers: [],
        history: []
      }]);
    }
    if (savedOrg) {
      try { setOrgInfo(JSON.parse(savedOrg)); } catch(e) { console.error(e); }
    }
    if (savedUsers) {
      try { 
        const parsedUsers = JSON.parse(savedUsers);
        setUsers(parsedUsers); 
        setCurrentUser(parsedUsers[0]); 
      } catch(e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yeshoua_agency_docs_v2', JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem('yeshoua_agency_org_v2', JSON.stringify(orgInfo));
  }, [orgInfo]);

  useEffect(() => {
    localStorage.setItem('yeshoua_agency_users_v2', JSON.stringify(users));
  }, [users]);

  const handleSaveDraft = (docParams: Omit<DocumentData, 'id' | 'history' | 'status'>) => {
    const newDoc: DocumentData = {
      ...docParams,
      id: Date.now(),
      status: docParams.approvalType === '1단 결재' && docParams.approvers[0].name === currentUser.name 
        ? '결재완료' : '대기중',
      history: [{ date: new Date().toLocaleString('ko-KR'), action: '최초 기안 작성', actor: currentUser.name }]
    };
    setDocs([newDoc, ...docs]);
    setIsCreating(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  const handlePreview = (doc: DocumentData) => {
    setSelectedDoc(doc);
    setView('preview');
  };

  const downloadCSV = () => {
    if (docs.length === 0) return alert("다운로드할 문서가 없습니다.");
    
    const headers = ['문서번호', '구분', '제목', '기안/담당자', '수신처', '시행일자', '결재상태'];
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
      headers.join(",") + "\n" +
      docs.map(e => 
        `"${e.docNo}","${e.type}","${e.title.replace(/"/g, '""')}","${e.drafter || ''}","${e.recipient || ''}","${e.regDate}","${e.status}"`
      ).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "문서색인목록.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (view === 'preview' && selectedDoc) {
    return <PrintPreview doc={selectedDoc} org={orgInfo} onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white shadow-md relative z-20 print:hidden">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
               <Plus size={24} className="text-white" />
             </div>
             <div>
               <h1 className="text-xl font-black tracking-tight">{orgInfo.name}</h1>
               <div className="text-blue-200 text-xs font-medium tracking-wider">결재기안 관리 시스템</div>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-100 font-medium">현재 사용자:</span>
                <select 
                  className="bg-blue-700 border border-blue-500 rounded p-1 text-white font-bold outline-none focus:ring-1 focus:ring-white"
                  value={currentUser?.id || ''}
                  onChange={e => {
                    const u = users.find(user => user.id === e.target.value);
                    if (u) setCurrentUser(u);
                  }}
                >
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
             </div>
             <button onClick={() => setShowSettings(true)} className="bg-white/10 hover:bg-white/20 transition-colors border border-white/20 px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5" title="설정">
               <Settings size={16} /> 
             </button>
             <button onClick={downloadCSV} className="bg-white/10 hover:bg-white/20 transition-colors border border-white/20 px-4 py-1.5 rounded text-sm font-bold flex items-center gap-2" title="CSV 다운로드">
               <Download size={16} /> 목록 다운로드
             </button>
          </div>
        </div>
      </div>

      {/* Main App */}
      <Dashboard 
        docs={docs} 
        onNewDraft={() => setIsCreating(true)} 
        onEdit={(doc) => alert("문서 편집 기능 모달 연결 필요 - 현재는 새 기안 작성으로 대체 테스트")} 
        onDelete={handleDelete}
        onPreview={handlePreview}
      />

      {/* Modals */}
      {isCreating && (
        <CreateDraft 
          onClose={() => setIsCreating(false)} 
          onSave={handleSaveDraft}
          users={users}
          currentUser={currentUser}
          docCount={docs.length}
        />
      )}

      {showSettings && (
        <AdminSettings 
          onClose={() => setShowSettings(false)}
          org={orgInfo}
          setOrg={setOrgInfo}
          users={users}
          setUsers={setUsers}
        />
      )}
    </div>
  );
}
