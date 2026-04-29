import React, { useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { DocumentData, OrgInfo } from '../types';

interface PrintPreviewProps {
  doc: DocumentData;
  org: OrgInfo;
  onBack: () => void;
}

export default function PrintPreview({ doc, org, onBack }: PrintPreviewProps) {
  useEffect(() => {
    // Optionally trigger print automatically or not
  }, []);

  return (
    <div className="print:m-0 print:p-0 min-h-screen bg-slate-100 py-10 relative">
      {/* Tools visible only on screen */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow border border-slate-200">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors">
          <ArrowLeft size={18} /> 이전 화면
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md text-sm font-bold hover:bg-blue-700 shadow-md transition-colors">
          <Printer size={18} /> 인쇄하기
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="w-[210mm] min-h-[297mm] bg-white mx-auto py-[25mm] px-[20mm] shadow-2xl print:shadow-none print:w-full print:min-h-0 print:h-auto print:p-0 relative font-sans text-[11pt] leading-relaxed break-words border border-slate-300">
        
        {/* Slogan */}
        <div className="text-center text-[10pt] text-blue-600 tracking-tight font-bold mb-4">
          {org.slogan}
        </div>
        
        {/* Logo/Header */}
        <div className="text-center mb-10 relative">
           <h1 className="text-[28pt] font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
             <span className="text-blue-500">✚</span> {org.name}
           </h1>
           <div className="absolute right-0 top-0 w-[50px] h-[50px] border border-gray-300 flex items-center justify-center text-[7pt] text-gray-400 bg-gray-50">
             QR코드
           </div>
        </div>

        {/* Header Information */}
        <div className="mb-8 space-y-2 border-y border-gray-300 py-4">
          <div className="flex">
            <div className="w-24 font-bold text-[12pt] text-gray-700">수 신</div>
            <div className="flex-1 text-[12pt] font-medium">{doc.recipient || ''}</div>
          </div>
          <div className="flex">
            <div className="w-24 font-bold text-[12pt] text-gray-700">(경유)</div>
            <div className="flex-1 text-[12pt] font-medium">{doc.via || ''}</div>
          </div>
          <div className="flex mt-3 pt-3 border-t border-gray-100">
            <div className="w-24 font-bold text-[12pt] text-gray-700 mt-1">제 목</div>
            <div className="flex-1 font-bold text-[14pt] text-gray-900 leading-snug">
              {doc.title}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-[350px] whitespace-pre-wrap leading-[1.8] text-[11pt] text-gray-800 text-justify mb-8 px-2">
          {doc.content}
        </div>

        {/* Attachment Section */}
        {doc.attachment && (
          <div className="mb-6 px-2 text-[11pt]">
            <span className="font-bold text-gray-700">붙임</span>
            <span className="ml-4 whitespace-pre-wrap">{doc.attachment}</span>
          </div>
        )}

        {doc.attachedFiles && doc.attachedFiles.length > 0 && (
          <div className="mb-12 px-2 text-[11pt] print:hidden border border-indigo-100 bg-indigo-50/30 p-4 rounded-xl">
            <div className="font-bold text-indigo-900 mb-3 flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
              첨부파일 (클릭하여 다운로드)
            </div>
            <div className="flex flex-col gap-2">
              {doc.attachedFiles.map((f, i) => (
                <a key={i} href={f.dataUrl} download={f.name} className="flex items-center gap-3 text-indigo-700 hover:bg-indigo-100 p-2.5 border border-indigo-200/60 rounded-lg bg-white shadow-sm transition-colors w-fit">
                  <span className="font-bold text-sm tracking-tight">{f.name}</span>
                  <span className="text-xs font-medium text-indigo-400">({(f.size / 1024).toFixed(1)} KB)</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Signature Area (Only for external/official documents usually, but can be on both) */}
        {doc.type === '발송공문' && (
          <div className="my-16 text-center text-[24pt] font-black tracking-[0.2em] relative inline-block left-1/2 -translate-x-1/2 min-w-[300px]">
            {org.name}장
            {/* Stamp mock */}
            <div className="absolute -right-[60px] top-1/2 -translate-y-1/2 w-[60px] h-[60px] border-[3px] border-red-600 rounded-full flex items-center justify-center opacity-90 text-red-600 text-[11pt] font-black leading-none break-all p-2" style={{ writingMode: 'vertical-rl' }}>
              직인
            </div>
          </div>
        )}
        
        {doc.type === '내부기안' && (
          <div className="my-16 text-center text-[24pt] font-black tracking-[0.2em] relative inline-block left-1/2 -translate-x-1/2 min-w-[300px] text-gray-800">
            {org.name}장
          </div>
        )}

        {/* Footer info (placed below signature, effectively at bottom of page) */}
        <div className="mt-auto pt-8">
          {/* Approval Info */}
          <div className="border border-gray-300 p-4 mb-6 bg-gray-50 flex justify-between rounded-sm">
             <div className="flex gap-x-12">
               <div className="flex flex-col">
                 <span className="text-[9pt] text-gray-500 mb-1">담당</span>
                 <span className="font-bold text-[11pt]">{doc.drafter}</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[9pt] text-gray-500 mb-1">협조자</span>
                 <span className="font-bold text-[11pt]">{doc.cooperator || '-'}</span>
               </div>
             </div>
             
             <div className="flex gap-x-12">
               {doc.approvers.map((app, idx) => (
                 <div key={idx} className="flex flex-col text-right">
                   <span className="text-[9pt] text-gray-500 mb-1">{app.role}</span>
                   <span className="font-bold text-[11pt]">{app.name}</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="border-t-[2px] border-gray-800 pt-3 text-[9.5pt] leading-relaxed text-gray-700">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-4 items-center font-medium text-gray-900">
                <span className="border border-gray-300 px-2 py-0.5 rounded text-[8pt] bg-white">시행</span> 
                <span>{doc.docNo}</span>
                <span className="text-gray-500">({doc.regDate.replace(/\./g, '. ')})</span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="border border-gray-300 px-2 py-0.5 rounded text-[8pt] bg-white">접수</span>
                <span className="ml-2 w-24 border-b border-gray-300 inline-block h-4"></span>
              </div>
            </div>
            
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-3">
              <span className="font-bold text-gray-900">우</span> 
              <span>{org.zipCode}</span>
              <span className="ml-1">{org.address}</span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="text-blue-600">{org.homepage}</span>
            </div>
            
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1 text-[9pt]">
              <span>전화 {org.tel}</span>
              <span className="text-gray-300 mx-1">|</span>
              <span>팩스 {org.fax}</span>
              <span className="text-gray-300 mx-1">|</span>
              <span>{org.email}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
