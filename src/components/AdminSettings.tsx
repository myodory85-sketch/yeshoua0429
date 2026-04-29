import React, { useState } from 'react';
import { OrgInfo, User } from '../types';
import { Users, Building, Plus, Trash2, X } from 'lucide-react';

interface AdminSettingsProps {
  onClose: () => void;
  org: OrgInfo;
  setOrg: (org: OrgInfo) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export default function AdminSettings({ onClose, org, setOrg, users, setUsers }: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'org'>('users');
  
  const [newUser, setNewUser] = useState({ name: '', role: '' });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.role) return;
    setUsers([...users, { id: Date.now().toString(), name: newUser.name, role: newUser.role }]);
    setNewUser({ name: '', role: '' });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900/40 backdrop-blur-sm p-4">
      <div className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-indigo-100 bg-white rounded-t-xl shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            시스템 관리자
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 pt-4 bg-white border-b border-slate-200 gap-6">
          <button 
            className={`pb-3 font-bold text-sm tracking-wide ${activeTab === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center gap-1.5"><Users size={16} /> 사용자 관리</div>
          </button>
          <button 
            className={`pb-3 font-bold text-sm tracking-wide ${activeTab === 'org' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('org')}
          >
            <div className="flex items-center gap-1.5"><Building size={16} /> 기관 정보 설정</div>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 h-full bg-slate-50">
          
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-tight">새 사용자 추가</h3>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="이름 (예: 홍길동)" 
                    className="flex-1 border border-slate-300 rounded p-2 text-sm outline-none focus:border-indigo-500"
                    value={newUser.name}
                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="직책 (예: 사회복지사)" 
                    className="flex-1 border border-slate-300 rounded p-2 text-sm outline-none focus:border-indigo-500"
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                  />
                  <button onClick={handleAddUser} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-1.5 hover:bg-indigo-700">
                    <Plus size={16} /> 추가
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold text-slate-600">이름</th>
                      <th className="py-3 px-4 font-bold text-slate-600">직책</th>
                      <th className="py-3 px-4 font-bold text-slate-600 w-24 text-center">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="py-3 px-4 text-slate-800 font-medium">{u.name}</td>
                        <td className="py-3 px-4 text-slate-600">{u.role}</td>
                        <td className="py-3 px-4 text-center">
                          <button onClick={() => handleDeleteUser(u.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={3} className="py-6 text-center text-slate-500">등록된 사용자가 없습니다.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'org' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">상단 슬로건</label>
                <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.slogan} onChange={e => setOrg({...org, slogan: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">기관명 (한글)</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.name} onChange={e => setOrg({...org, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">기관명 (영문)</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.englishName} onChange={e => setOrg({...org, englishName: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">대표자 성명</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.ceo} onChange={e => setOrg({...org, ceo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">우편번호</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.zipCode} onChange={e => setOrg({...org, zipCode: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">주소</label>
                <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.address} onChange={e => setOrg({...org, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">전화번호</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.tel} onChange={e => setOrg({...org, tel: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">팩스번호</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.fax} onChange={e => setOrg({...org, fax: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">이메일</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.email} onChange={e => setOrg({...org, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">홈페이지</label>
                  <input type="text" className="w-full border border-slate-300 p-2 rounded focus:border-indigo-500 outline-none text-sm" value={org.homepage} onChange={e => setOrg({...org, homepage: e.target.value})} />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
