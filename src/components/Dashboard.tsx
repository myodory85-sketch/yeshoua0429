import React, { useState } from 'react';
import { Search, Calendar, RefreshCcw, FileText, Send, Inbox, Clock, CheckCircle, List, Edit2, Trash2 } from 'lucide-react';
import { DocumentData, User } from '../types';

interface DashboardProps {
  docs: DocumentData[];
  onNewDraft: () => void;
  onEdit: (doc: DocumentData) => void;
  onDelete: (id: number) => void;
  onPreview: (doc: DocumentData) => void;
}

export default function Dashboard({ docs, onNewDraft, onEdit, onDelete, onPreview }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const stats = {
    internal: docs.filter(d => d.type === '내부기안').length,
    sent: docs.filter(d => d.type === '발송공문').length,
    received: docs.filter(d => d.type === '접수공문').length,
    pending: docs.filter(d => d.status === '대기중').length,
    completed: docs.filter(d => d.status === '결재완료').length,
    total: docs.length
  };

  const filteredDocs = docs.filter(d => 
    d.title.includes(searchTerm) || 
    d.drafter.includes(searchTerm) || 
    d.docNo.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Tab Navigation Mock */}
      <div className="flex gap-8 border-b border-gray-200 mb-6 pb-2 px-2 text-sm font-bold">
        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
           <FileText size={16} className="text-orange-400" /> 내부기안 <span className="bg-indigo-600 text-white rounded-full px-2 text-xs py-0.5">{stats.internal}</span>
        </button>
        <button className="flex items-center gap-2 text-indigo-700 border-b-2 border-indigo-600 pb-2 -mb-[10px]">
           <Send size={16} className="text-blue-500"/> 발송공문 <span className="bg-indigo-600 text-white rounded-full px-2 text-xs py-0.5">{stats.sent}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
           <Inbox size={16} className="text-red-400"/> 접수공문 <span className="bg-white border border-gray-300 text-gray-600 rounded-full px-2 text-xs py-0.5">{stats.received}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm">
          <div className="text-3xl font-black text-purple-700">{stats.internal}</div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><FileText size={14} className="text-orange-400"/>내부기안</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm">
          <div className="text-3xl font-black text-emerald-700">{stats.sent}</div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><Send size={14} className="text-blue-500"/>발송공문</div>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm">
          <div className="text-3xl font-black text-pink-700">{stats.received}</div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><Inbox size={14} className="text-red-400"/>접수공문</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm">
           <div className="text-3xl font-black text-amber-700">{stats.pending}</div>
           <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><Clock size={14} className="text-amber-500"/>결재대기</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm">
           <div className="text-3xl font-black text-green-700">{stats.completed}</div>
           <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700"><CheckCircle size={14} className="text-green-500"/>결재완료</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden shadow-sm">
           <div className="absolute right-0 top-0 text-[100px] text-blue-100/50 leading-none mr-2 font-black -mt-4">{stats.total}</div>
           <div className="text-3xl font-black text-blue-700 z-10">{stats.total}</div>
           <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700 z-10 text-center">전체문서</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-white border border-gray-200 rounded-lg flex items-center px-4 py-2 shadow-sm focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
          <Search size={18} className="text-blue-500 mr-2" />
          <input 
            type="text" 
            placeholder="제목, 작성자, 연번으로 검색..." 
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-600">연도-월-일</span>
          <Calendar size={16} className="text-gray-700" />
          <span className="text-gray-400 mx-1">~</span>
          <span className="text-sm text-gray-600">연도-월-일</span>
          <Calendar size={16} className="text-gray-700" />
        </div>
        <button className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-100 flex items-center gap-2 shadow-sm">
          초기화
        </button>
        <button onClick={onNewDraft} className="bg-blue-600 text-white px-6 py-2 text-sm font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm ml-auto">
          + 새 기안 작성
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
            <tr>
              <th className="py-4 px-6 min-w-[120px]">연번</th>
              <th className="py-4 px-6 w-full">제목</th>
              <th className="py-4 px-6">작성일</th>
              <th className="py-4 px-6">작성자</th>
              <th className="py-4 px-6 text-center">페이지수</th>
              <th className="py-4 px-6 text-center">결재상태</th>
              <th className="py-4 px-6 text-center min-w-[140px]">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDocs.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-gray-500 font-medium">검색된 문서가 없습니다.</td></tr>
            ) : (
              filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="py-4 px-6 font-medium text-gray-600 align-top max-w-[140px] whitespace-normal">
                    {doc.docNo.replace(' ', '\n')}
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => onPreview(doc)} className="font-bold text-gray-800 hover:text-blue-600 hover:underline transition-colors whitespace-normal text-left line-clamp-2">
                       {doc.title}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{doc.regDate.replace(/\. /g, '-').replace(/\.$/, '')}</td>
                  <td className="py-4 px-6 text-gray-700">{doc.drafter}</td>
                  <td className="py-4 px-6 text-center text-gray-600">{doc.pages}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      doc.status === '결재완료' ? 'bg-green-100 text-green-700' :
                      doc.status === '대기중' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onEdit(doc)} className="p-1.5 text-gray-400 hover:text-orange-500 border border-gray-200 rounded hover:bg-orange-50 transition-colors" title="수정">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 border border-gray-200 rounded hover:bg-green-50 transition-colors" title="상태변경">
                         <CheckCircle size={16} />
                      </button>
                      <button onClick={() => onDelete(doc.id)} className="p-1.5 text-gray-400 hover:text-red-500 border border-gray-200 rounded hover:bg-red-50 transition-colors" title="삭제">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
