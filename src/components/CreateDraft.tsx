import React, { useState, useEffect, useRef } from 'react';
import { User, DocumentData, DocCategory, Approver, AttachedFile } from '../types';
import { Paperclip, X, Upload } from 'lucide-react';

interface CreateDraftProps {
  onClose: () => void;
  onSave: (doc: Omit<DocumentData, 'id' | 'history' | 'status'>) => void;
  users: User[];
  currentUser: User;
  docCount: number;
}

export default function CreateDraft({ onClose, onSave, users, currentUser, docCount }: CreateDraftProps) {
  const year = new Date().getFullYear();
  const defaultDate = new Date().toISOString().split('T')[0];
  
  const [category, setCategory] = useState<DocCategory>('발송공문');
  const [date, setDate] = useState(defaultDate);
  const [recipient, setRecipient] = useState('');
  const [via, setVia] = useState('');
  const [manager, setManager] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [pages, setPages] = useState('1');
  const [approvalType, setApprovalType] = useState<'1단 결재' | '2단 결재' | '3단 결재'>('2단 결재');
  
  const [line1Role, setLine1Role] = useState('담당');
  const [line1Name, setLine1Name] = useState(currentUser.name);

  const [line2Role, setLine2Role] = useState('대결');
  const [line2Name, setLine2Name] = useState(users[0]?.name || '');

  const [line3Role, setLine3Role] = useState('시설장');
  const [line3Name, setLine3Name] = useState('오병석');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate docNo preview
  const docNoPreview = `예수와 ${String(new Date(date).getFullYear()).slice(2)}-${String(docCount + 1).padStart(4, '0')} (저장 시 연번 자동 생성)`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        // Limit file size to 2MB to prevent local storage quota issues
        if (file.size > 2 * 1024 * 1024) {
          alert(`'${file.name}' 파일이 너무 큽니다. (최대 2MB)`);
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          setAttachedFiles(prev => [...prev, {
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: event.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !recipient) {
      alert("수신처와 제목을 입력해주세요.");
      return;
    }

    const docNo = `예수와 ${String(new Date(date).getFullYear()).slice(2)}-${String(docCount + 1).padStart(4, '0')}`;
    
    const approvers: Approver[] = [];
    if (approvalType === '1단 결재') {
      approvers.push({ name: line3Name, role: line3Role, status: '대기중' });
    } else if (approvalType === '2단 결재') {
      approvers.push({ name: line1Name, role: line1Role, status: '결재완료', date: new Date().toISOString() });
      approvers.push({ name: line3Name, role: line3Role, status: '대기중' });
    } else if (approvalType === '3단 결재') {
      approvers.push({ name: line1Name, role: line1Role, status: '결재완료', date: new Date().toISOString() });
      if (line2Name) {
        approvers.push({ name: line2Name, role: line2Role, status: '대기중' });
      }
      approvers.push({ name: line3Name, role: line3Role, status: '대기중' });
    }

    onSave({
      docNo,
      type: category,
      regDate: date.replace(/-/g, '. '),
      title,
      content,
      attachment,
      attachedFiles,
      drafter: approvalType === '1단 결재' ? currentUser.name : line1Name,
      recipient,
      via,
      manager,
      pages: parseInt(pages) || 1,
      approvalType,
      approvers
    });
  };

  const renderApprovalBox = (step: number, role: string, setRole: (v: string) => void, name: string, setName: (v: string) => void, isFinal: boolean) => (
    <div className="border border-indigo-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
      <div className="bg-indigo-600 p-1">
        <select 
          className="w-full bg-transparent text-white text-center text-sm font-bold tracking-wider outline-none text-center-last px-2" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option className="text-black" value="담당">담당</option>
          <option className="text-black" value="대결">대결</option>
          <option className="text-black" value="전결">전결</option>
          <option className="text-black" value="시설장">시설장</option>
        </select>
      </div>
      <div className="p-4 text-center flex-1 flex flex-col justify-center">
        <select className="w-full border border-gray-300 rounded-md p-1.5 text-sm font-medium focus:outline-none focus:border-indigo-500" value={name} onChange={e => setName(e.target.value)}>
          <option value="">-- 선택 --</option>
          {users.map(u => <option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}
        </select>
        <div className="mt-3">
          {step === 1 && !isFinal ? (
             <div className="text-xs font-semibold text-gray-500 bg-gray-100 py-1 rounded px-3 inline-block">기안 작성</div>
          ) : (
             <div className="text-xs font-semibold text-amber-600 bg-amber-100 py-1 rounded px-3 inline-block">결재 대기</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-indigo-100 bg-indigo-50/50 rounded-t-xl shrink-0">
          <h2 className="text-xl font-bold text-indigo-900">새 기안 작성</h2>
          <button onClick={onClose} className="text-indigo-400 hover:text-indigo-700 p-2 rounded-full hover:bg-indigo-100 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          
          <div className="bg-blue-50 text-blue-700 font-bold text-center py-3 rounded-lg border border-blue-200 mb-8 shadow-sm">
            소중한 한 사람 한 사람이 모여 함께 성장하는 우리
          </div>

          <form id="draftForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">카테고리 <span className="text-red-500">*</span></label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white" value={category} onChange={e => setCategory(e.target.value as DocCategory)}>
                  <option value="발송공문">발송공문</option>
                  <option value="내부기안">내부기안</option>
                  <option value="접수공문">접수공문</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">연번 <span className="text-red-500">*</span></label>
                <input type="text" readOnly className="w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-500 outline-none" value={docNoPreview} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">수신 <span className="text-red-500">*</span></label>
              <input type="text" required placeholder="예) 강남구보건소장, 내부기안" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" value={recipient} onChange={e => setRecipient(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">경유</label>
                <input type="text" placeholder="경유지 (없으면 공란)" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" value={via} onChange={e => setVia(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">주무관</label>
                <input type="text" placeholder="예) 정윤미" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" value={manager} onChange={e => setManager(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">제목 <span className="text-red-500">*</span></label>
              <input type="text" required placeholder="문서 제목을 입력하세요" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium" value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">본문 내용</label>
              <textarea placeholder="본문 내용을 입력하세요..." className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-40 resize-y leading-relaxed" value={content} onChange={e => setContent(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">붙임 (내용)</label>
              <textarea placeholder="붙임 파일/내용 (예: 1. 운영계획서 1부.)" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-20 resize-y leading-relaxed" value={attachment} onChange={e => setAttachment(e.target.value)} />
            </div>

            <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <Paperclip size={16} /> 실제 파일 첨부
                </label>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white border border-gray-300 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-1 text-indigo-600 transition-colors">
                  <Upload size={14} /> 찾아보기
                </button>
                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>
              
              {attachedFiles.length > 0 ? (
                <div className="flex flex-col gap-2 mt-2">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 border border-gray-200 rounded shadow-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                         <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                           <Paperclip size={14} />
                         </div>
                         <div className="truncate text-sm font-medium text-gray-800">{f.name}</div>
                         <div className="text-xs text-gray-400 shrink-0">({formatFileSize(f.size)})</div>
                      </div>
                      <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500 p-1">
                         <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400 text-center py-4">
                  첨부할 파일을 선택해주세요. (최대 2MB)
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">작성일 <span className="text-red-500">*</span></label>
                <input type="date" required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">페이지수</label>
                <input type="number" min="1" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" value={pages} onChange={e => setPages(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">결재 방식 <span className="text-red-500">*</span></label>
              <div className="flex gap-6 items-center">
                <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                  <input type="radio" name="approvalType" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" checked={approvalType === '1단 결재'} onChange={() => setApprovalType('1단 결재')} />
                  <span className="font-medium">1단 결재</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                  <input type="radio" name="approvalType" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" checked={approvalType === '2단 결재'} onChange={() => setApprovalType('2단 결재')} />
                  <span className="font-medium">2단 결재</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                  <input type="radio" name="approvalType" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" checked={approvalType === '3단 결재'} onChange={() => setApprovalType('3단 결재')} />
                  <span className="font-medium">3단 결재</span>
                </label>
              </div>
            </div>

            <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/30">
               <label className="flex justify-between items-center text-sm font-bold text-indigo-900 mb-3">
                 <span>결재 라인 설정</span>
                 <span className="text-xs font-normal text-indigo-600 bg-white px-2 py-0.5 rounded shadow-sm border border-indigo-100">결재칸 제목을 클릭하여 변경할 수 있습니다.</span>
               </label>
               <div className={`grid gap-4 ${approvalType === '3단 결재' ? 'grid-cols-3' : approvalType === '2단 결재' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                 
                 {approvalType !== '1단 결재' && renderApprovalBox(1, line1Role, setLine1Role, line1Name, setLine1Name, false)}
                 {approvalType === '3단 결재' && renderApprovalBox(2, line2Role, setLine2Role, line2Name, setLine2Name, false)}
                 {renderApprovalBox(approvalType === '1단 결재' ? 1 : approvalType === '2단 결재' ? 2 : 3, line3Role, setLine3Role, line3Name, setLine3Name, true)}

               </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl shrink-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors">취소</button>
          <button type="submit" form="draftForm" className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all active:scale-95">기안 등록</button>
        </div>
      </div>
    </div>
  );
}
