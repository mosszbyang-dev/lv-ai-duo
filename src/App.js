import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  FileText, Search, BookOpen, Database, Plus, Send, ChevronRight, 
  MessageSquare, Edit3, ChevronDown, Clock, LayoutGrid, Trash2, 
  Check, Cpu, FileSearch, Gavel, ShieldCheck, Sparkles, 
  Wand2, FolderOpen, MoreHorizontal, X, Link as LinkIcon, 
  AlertCircle, Globe, ClipboardList, FileUp, Files, Target, 
  Paperclip, Copy, FileDown, BookmarkPlus, RefreshCw, FilePlus, 
  Loader2, Settings, Tags, Zap, Briefcase, FileSignature, Landmark, Scale,
  PanelLeft, PanelRight, Maximize2, ChevronLeft, MinusSquare, Square,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Undo, Redo, Type, ArrowLeft,
  Mic, Shield, CheckCircle, PenTool, LayoutTemplate, Lightbulb,
  ExternalLink, ShoppingCart, Download, Network, TrendingUp,
  User, CalendarDays, Lock
} from 'lucide-react';

const LEGAL_AGENTS = [
  { id: 'research', name: '研究报告', desc: '综合数据研判', icon: <Sparkles size={16} strokeWidth={2} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'writing', name: '文书写作', desc: '起草法律文书', icon: <FileSignature size={16} strokeWidth={2} />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 'contract', name: '合同风控', desc: '解析条款风险', icon: <ShieldCheck size={16} strokeWidth={2} />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { id: 'summary', name: '案情提炼', desc: '摘要争议焦点', icon: <FileSearch size={16} strokeWidth={2} />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 'strategy', name: '诉讼方案', desc: '制定抗辩策略', icon: <Gavel size={16} strokeWidth={2} />, color: 'bg-orange-50 text-orange-600 border-orange-100' }
];

// 将静态的 CHAT_SKILLS 替换为包含更多属性的初始状态常量
const INITIAL_SKILLS = [
  { id: 'pdf_tool', name: 'PDF操作工具包', desc: '综合性PDF创建、合并、拆分、提取及表单处理工具。', icon: <FileText size={16} strokeWidth={2} />, color: 'bg-red-50 text-red-600', installed: true, price: 0 },
  { id: 'word_tool', name: 'Word文档处理器', desc: '全面的Word 文档编辑、批注、修订和分析工具。', icon: <FileSignature size={16} strokeWidth={2} />, color: 'bg-blue-50 text-blue-600', installed: true, price: 0 },
  { id: 'format_converter', name: '文档格式转化器', desc: '统一批量转换文档，高效支持多格式互转。', icon: <RefreshCw size={16} strokeWidth={2} />, color: 'bg-indigo-50 text-indigo-600', installed: true, price: 0 },
  { id: 'data_insight', name: '数据分析与商业洞察', desc: '深入分析数据，生成决策洞察与可视化报告，支持多场景业务分析。', icon: <TrendingUp size={16} strokeWidth={2} />, color: 'bg-purple-50 text-purple-600', installed: true, price: 0 },
  { id: 'excel_tool', name: 'Excel电子表格处理器', desc: '全能的电子表格计算分析、图表生成、数据转换与报表工具。', icon: <LayoutGrid size={16} strokeWidth={2} />, color: 'bg-emerald-50 text-emerald-600', installed: false, price: 0 },
  { id: 'ppt_tool', name: 'PPT生成处理器', desc: '一键生成高可视化PPT，自动提炼内容、设计版式与图表。', icon: <LayoutTemplate size={16} strokeWidth={2} />, color: 'bg-orange-50 text-orange-600', installed: false, price: 0 },
  { id: 'email_gen', name: '智能邮件草稿生成', desc: '自动生成邮件草稿，支持模板管理与语气调整。', icon: <Send size={16} strokeWidth={2} />, color: 'bg-amber-50 text-amber-600', installed: false, price: 0 },
  { id: 'meeting_insight', name: '会议洞察分析', desc: '自动分析会议记录，提炼沟通洞察，提升效率与协作。', icon: <Briefcase size={16} strokeWidth={2} />, color: 'bg-teal-50 text-teal-600', installed: false, price: 0 }
];

/** 技能中心卡片与对话区「选择技能」菜单共用，保证同一 skill 的 icon / 配色一致 */
const SkillMarketIconBox = ({ skill, compact }) => (
  <div
    className={
      compact
        ? `flex shrink-0 items-center justify-center rounded-xl p-2 shadow-sm ${skill.color}`
        : `flex items-center justify-center rounded-2xl p-3 shadow-sm transition-transform group-hover:scale-110 ${skill.color}`
    }
  >
    {skill.icon}
  </div>
);

const INITIAL_WORKSPACES = [
  { id: 1, title: '股权纠纷研判-0520号', description: '针对某半导体公司股权确认及优先购买权争议的深度研判。', sourceCount: 3, conclusionCount: 5, updatedAt: '2小时前', tags: ['股权纠纷'], autoTag: true },
  { id: 2, title: '劳动合同合规审查-2024Q2', description: '全量审查集团总部及下属子公司的竞业限制协议模板。', sourceCount: 12, conclusionCount: 8, updatedAt: '昨天', tags: ['劳动法'], autoTag: false },
  { id: 3, title: '某建筑工程质量违约案', description: '分析工程验收报告、监理日记及相关施工规范，提炼反诉争点。', sourceCount: 45, conclusionCount: 12, updatedAt: '3天前', tags: ['建设工程'], autoTag: true }
];

const MODAL_CANDIDATE_SOURCES = [
  { id: 'm1', title: '《中华人民共和国公司法》2023修订全文', type: 'fb', category: '法规库', detail: '法宝·法律法规' },
  { id: 'm2', title: '股权纠纷典型案例精选 - 北京高院', type: 'pdf', category: '案例库', detail: '兰台知识库' },
  { id: 'm3', title: '某互联网公司股权激励计划协议草案', type: 'pdf', category: '律师实务库', detail: '个人知识库' },
  { id: 'm4', title: '最高院关于有限责任公司股东身份认定意见', type: 'fb', category: '人民法院案例库', detail: '法宝·司法解释' },
  { id: 'm5', title: '最高人民法院关于适用《民法典》合同编通则若干问题的解释', type: 'fb', category: '法规库', detail: '法宝·司法解释' },
  { id: 'm6', title: '指导案例15号：徐工集团等买卖合同纠纷案', type: 'fb', category: '案例库', detail: '法宝·指导案例' },
  { id: 'm7', title: '企业并购重组涉税实务解析与风险防范', type: 'pdf', category: '期刊文章库', detail: '知网·期刊' },
  { id: 'm8', title: '关于股权转让纠纷的实务裁判观点汇总', type: 'url', category: '全网', detail: '微信公众号·法务之家' },
];

const MOCK_KNOWLEDGE_BASES = [
  { id: 'kb1', title: '个人私有知识库', desc: '包含个人上传的所有案卷与研究报告', type: 'private' },
  { id: 'kb2', title: '民商事争议解决团队库', desc: '团队共享的诉讼策略与典型案例', type: 'team' },
  { id: 'kb3', title: '律所标准合同范本库', desc: '经过合规审查的各类型合同标准模板', type: 'public' },
  { id: 'kb4', title: '2024重点尽调项目库', desc: '本年度重点非诉项目的尽职调查资料', type: 'team' }
];

const SUGGESTED_REPORT_FORMATS = [
  { id: 's1', title: '股权纠纷风险评估报告', desc: '基于当前《公司法》最新修订，评估优先购买权行使瑕疵导致的败诉风险。', defaultPrompt: '请基于提供的案卷材料，结合《公司法》最新修订内容，撰写一份股权纠纷风险评估报告。重点评估被告行使优先购买权过程中存在的程序瑕疵，并预测由此可能引发的败诉风险及法律后果。' },
  { id: 's2', title: '目标公司工商变更合规备忘录', desc: '梳理股权转让后配合办理工商变更登记的法定义务及违约责任。', defaultPrompt: '请撰写一份目标公司工商变更合规备忘录。要求梳理股权转让完成后，各方配合办理工商变更登记的法定义务，明确不履行该义务的违约责任及可能面临的行政处罚风险，并提供合规建议。' },
  { id: 's3', title: '指导案例168号类案检索报告', desc: '提取指导案例裁判要旨，对比本案事实，输出类案同判参考意见。', defaultPrompt: '请以最高人民法院指导案例168号为基准，提取其核心裁判要旨。将该指导案例的案件事实、争议焦点与本案进行详细对比分析，最终输出一份关于“类案同判”的参考意见及诉讼策略建议。' },
  { id: 's4', title: '被告抗辩理由预测及应对策略', desc: '预判被告可能提出的“其他股东未过半数同意”抗辩，提供反驳路径。', defaultPrompt: '请基于现有证据材料，预测被告在庭审中可能提出的核心抗辩理由（尤其是针对“其他股东未过半数同意”这一痛点）。针对每项预测的抗辩理由，提供详实的法律反驳路径、证据组织方案及庭审应对策略。' }
];

const PRESET_REPORT_FORMATS = {
  custom: { id: 'custom', title: '自制格式', desc: null, defaultPrompt: '' },
  caseAnalysis: { id: 'case_analysis', title: '案情分析报告', desc: '梳理案件事实与核心法律关系，提炼争议焦点与初步应对策略', defaultPrompt: '请全面梳理本案的案件事实与核心法律关系，精准提炼双方的争议焦点。针对每一个争议焦点，结合相关法律法规及挂载的证据材料，提供初步的应对策略和法律风险提示。' }
};

const MY_WRITING_TEMPLATES = [
  { id: 'free_write', title: '自由写作', desc: '设定篇幅与语气要求，根据您的具体指令从零开始起草文书。', icon: <PenTool size={20} strokeWidth={2.5} /> },
  { id: 'my_tpl_1', title: '标准律师函 (律所版)', desc: '调用律所预设的标准催款/维权律师函模板进行填充。', icon: <FileSignature size={20} strokeWidth={2.5} /> },
  { id: 'my_tpl_2', title: '买卖合同起诉状模板', desc: '专用于买卖合同违约纠纷的标准化起诉状结构。', icon: <FileText size={20} strokeWidth={2.5} /> }
];

const SUGGESTED_WRITING_FORMATS = [
  { id: 'w1', title: '民事起诉状', desc: '根据当前案件事实，自动梳理诉讼请求与事实理由部分。' },
  { id: 'w2', title: '民事答辩状', desc: '针对原告诉状，提炼核心抗辩理由并按法定格式输出。' },
  { id: 'w3', title: '履约催告函', desc: '起草正式函件，催告违约方继续履行合同义务或承担责任。' },
  { id: 'w4', title: '解除合同通知书', desc: '依据法定或约定解除权，生成符合生效要件的解除通知。' }
];

const ALL_WRITING_CATEGORIES = ['刑事', '民事诉讼与仲裁', '行政诉讼与复议', '强制执行与破产', '非诉类文书', '其他'];
const ALL_WRITING_TEMPLATES = [
  // 刑事 (根据截图还原)
  { id: 't_xing_1', title: '取保候审申请书', desc: '申请变更强制措施为取保候审。', category: '刑事' },
  { id: 't_xing_2', title: '羁押必要性审查申请书', desc: '申请检察院审查逮捕后继续羁押的必要性。', category: '刑事' },
  { id: 't_xing_3', title: '法律意见书', desc: '针对案件定性、证据等向办案机关提出专业意见。', category: '刑事' },
  { id: 't_xing_4', title: '辩护词', desc: '庭审中为被告人做无罪或罪轻辩护的发言稿。', category: '刑事' },
  { id: 't_xing_5', title: '刑事上诉状', desc: '不服一审刑事判决/裁定提出上诉。', category: '刑事' },
  { id: 't_xing_6', title: '刑事申诉书', desc: '对已生效的刑事判决/裁定提出申诉。', category: '刑事' },
  { id: 't_xing_7', title: '刑事自诉状', desc: '自诉人向法院提起刑事自诉。', category: '刑事' },
  { id: 't_xing_8', title: '刑事附带民事起诉状', desc: '在刑事诉讼中附带提起民事赔偿请求。', category: '刑事' },
  { id: 't_xing_9', title: '退回补充侦查申请书', desc: '申请检察机关将案件退回公安机关补充侦查。', category: '刑事' },
  { id: 't_xing_10', title: '调取证据申请书', desc: '申请办案机关调取对犯罪嫌疑人/被告人有利的证据。', category: '刑事' },
  
  // 民事诉讼与仲裁 (补充常用实务模板)
  { id: 't_min_1', title: '民事起诉状', desc: '用于向人民法院提起民事诉讼，明确诉讼请求及事实理由。', category: '民事诉讼与仲裁' },
  { id: 't_min_2', title: '民事答辩状', desc: '用于被告针对原告的起诉状提出答辩意见及反驳理由。', category: '民事诉讼与仲裁' },
  { id: 't_min_3', title: '反诉状', desc: '本诉被告对本诉原告提起的诉讼，合并审理。', category: '民事诉讼与仲裁' },
  { id: 't_min_4', title: '民事上诉状', desc: '不服一审民事判决或裁定，向上级法院提出上诉。', category: '民事诉讼与仲裁' },
  { id: 't_min_5', title: '仲裁申请书', desc: '基于仲裁条款向仲裁委员会提起仲裁程序。', category: '民事诉讼与仲裁' },
  { id: 't_min_6', title: '管辖权异议申请书', desc: '被告对受理案件的法院管辖权提出异议。', category: '民事诉讼与仲裁' },

  // 行政诉讼与复议 (补充常用实务模板)
  { id: 't_xingzheng_1', title: '行政起诉状', desc: '不服行政机关的具体行政行为，向法院提起行政诉讼。', category: '行政诉讼与复议' },
  { id: 't_xingzheng_2', title: '行政复议申请书', desc: '不服具体行政行为，向上一级行政机关或本级人民政府申请复议。', category: '行政诉讼与复议' },
  { id: 't_xingzheng_3', title: '行政上诉状', desc: '不服一审行政判决或裁定，向上级法院提出上诉。', category: '行政诉讼与复议' },

  // 强制执行与破产 (补充常用实务模板)
  { id: 't_zhixing_1', title: '强制执行申请书', desc: '依据已生效的法律文书，申请法院强制被执行人履行义务。', category: '强制执行与破产' },
  { id: 't_zhixing_2', title: '恢复执行申请书', desc: '申请恢复此前被中止或终结本次执行的案件。', category: '强制执行与破产' },
  { id: 't_zhixing_3', title: '执行异议申请书', desc: '案外人或当事人对执行标的或执行行为提出异议。', category: '强制执行与破产' },
  { id: 't_zhixing_4', title: '破产清算申请书', desc: '债权人或债务人向法院申请宣告债务人破产清算。', category: '强制执行与破产' },

  // 非诉类文书 (补充常用实务模板)
  { id: 't_feisu_1', title: '律师函', desc: '代表委托方向相对方表达主张、催告或警示的正式函件。', category: '非诉类文书' },
  { id: 't_feisu_2', title: '法律意见书', desc: '针对特定法律事实或行为出具的专业律师意见。', category: '非诉类文书' },
  { id: 't_feisu_3', title: '法律尽职调查报告', desc: '在投融资、并购等项目中对目标公司进行的全面法律风险排查。', category: '非诉类文书' },
  { id: 't_feisu_4', title: '解除合同通知书', desc: '行使法定或约定解除权时发送给相对方的书面通知。', category: '非诉类文书' },
  { id: 't_feisu_5', title: '和解协议', desc: '双方就争议事项达成一致意见，放弃部分或全部诉求。', category: '非诉类文书' },

  // 其他 (补充常用实务模板)
  { id: 't_qita_1', title: '财产保全申请书', desc: '申请法院对被申请人的财产采取查封、扣押、冻结等措施。', category: '其他' },
  { id: 't_qita_2', title: '延期举证申请书', desc: '因客观原因无法在举证期限内提供证据，申请延长举证期限。', category: '其他' },
  { id: 't_qita_3', title: '调查取证申请书', desc: '因客观原因不能自行收集证据，申请法院依法调查收集。', category: '其他' },
];

const UserProfile = () => (
  <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 px-3 rounded-xl transition-all group border border-transparent hover:border-gray-100 font-bold">
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">JD</div>
    <div className="flex flex-col items-start leading-none gap-0.5">
      <span className="text-[13px] font-bold text-gray-700">演示用户</span>
      <span className="text-[10px] text-blue-600/70 font-bold uppercase tracking-tight">合伙人</span>
    </div>
    <ChevronDown size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors ml-1" />
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-bold ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
    <span className={`${active ? 'text-blue-600' : 'text-gray-400'}`}>{icon}</span>
    <span className="text-[13px]">{label}</span>
  </button>
);

// ==== 引用角标与悬浮预览组件 ====
const ReferenceBadge = ({ sourceId, sources, onBadgeClick }) => {
  const source = sources.find(s => s.id === parseInt(sourceId) || s.id === sourceId);
  const [show, setShow] = useState(false);

  if (!source) {
    return <span className="text-blue-400 mx-0.5 font-mono">[{sourceId}]</span>;
  }

  return (
    <span
      className="relative inline-flex items-center justify-center align-text-top ml-0.5 mr-1 cursor-pointer group"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => {
        e.stopPropagation();
        if (onBadgeClick) onBadgeClick(source);
      }}
    >
      <span className="w-[16px] h-[16px] text-[10px] font-extrabold bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 relative -top-[2px]">
        {sourceId}
      </span>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[300px] bg-white border border-slate-100 rounded-2xl shadow-xl z-[99999] p-4 text-left font-normal animate-in fade-in zoom-in-95 cursor-default" onClick={e => e.stopPropagation()}>
           <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl shrink-0 shadow-sm ${source.type === 'pdf' ? 'bg-red-50 text-red-600' : source.type === 'url' ? 'bg-cyan-50 text-cyan-600' : source.type === 'doc' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                {source.type === 'url' ? <LinkIcon size={16} strokeWidth={2.5} /> : source.type === 'doc' ? <FileSignature size={16} strokeWidth={2.5} /> : <FileText size={16} strokeWidth={2.5} />}
              </div>
              <h4 className="text-[14px] font-extrabold text-slate-800 line-clamp-2 leading-snug">{source.title}</h4>
           </div>
           <p className="text-[12px] text-slate-500 line-clamp-3 leading-relaxed font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {source.summary || source.content || '暂无内容预览'}
           </p>
           {/* 底部小三角 */}
           <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-100 rotate-45 z-[-1] rounded-sm"></div>
        </div>
      )}
    </span>
  );
};

// 解析消息内容：处理加粗和角标
const parseMessageContent = (text, sources, onBadgeClick) => {
  // 1. 分割出 [[id]]
  const refParts = text.split(/\[\[(\d+)\]\]/g);
  
  return refParts.map((part, i) => {
    // 奇数索引为匹配到的 id
    if (i % 2 === 1) {
      return <ReferenceBadge key={`ref-${i}`} sourceId={part} sources={sources} onBadgeClick={onBadgeClick} />;
    }
    // 偶数索引为普通文本，进一步处理 **加粗**
    const boldParts = part.split(/\*\*(.*?)\*\*/g);
    return boldParts.map((bPart, j) => {
      if (j % 2 === 1) {
        return <strong key={`bold-${i}-${j}`} className="font-extrabold text-slate-900">{bPart}</strong>;
      }
      return <React.Fragment key={`text-${i}-${j}`}>{bPart}</React.Fragment>;
    });
  });
};

const App = () => {
  // --- 新增：访问限制鉴权状态 ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('lveiduo_auth') === 'true';
  });
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [currentView, setCurrentView] = useState('home'); 
  const [activeMenu, setActiveMenu] = useState('workspace');
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState(INITIAL_WORKSPACES);
  const [shouldAutoOpenUpload, setShouldAutoOpenUpload] = useState(false);
  
  // 全局技能状态管理
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  // 与技能中心「已添加」同一数据源：仅 installed 为 true 的技能进入对话输入框技能列表
  const installedSkillsForWorkspace = useMemo(() => skills.filter(s => s.installed), [skills]);

  // 全局 Toast 状态
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleEnterWorkspace = (ws) => {
    setShouldAutoOpenUpload(false); 
    setSelectedWorkspace(ws);
    setCurrentView('details');
  };

  const handleQuickAdd = () => {
    const newWs = {
      id: Date.now(),
      title: '未命名工作空间',
      description: '暂无描述，请上传案卷资料开始研判。',
      sourceCount: 0,
      conclusionCount: 0,
      updatedAt: '刚刚',
      tags: [],
      autoTag: true
    };
    setWorkspaces([newWs, ...workspaces]);
    setSelectedWorkspace(newWs);
    setShouldAutoOpenUpload(true); 
    setCurrentView('details');
  };

  const handleUpdateWorkspace = (updatedWs) => {
    setWorkspaces(workspaces.map(ws => ws.id === updatedWs.id ? { ...ws, ...updatedWs } : ws));
    if (selectedWorkspace?.id === updatedWs.id) setSelectedWorkspace(prev => ({ ...prev, ...updatedWs }));
  };

  const handleDeleteWorkspace = (id) => {
    setWorkspaces(workspaces.filter(ws => ws.id !== id));
  };

  const handleToggleSkill = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      const newInstalled = !skill.installed;
      setSkills(prev => prev.map(s => s.id === skillId ? { ...s, installed: newInstalled } : s));
      showToast(newInstalled ? `已成功添加「${skill.name}」技能` : `已移除「${skill.name}」技能`);
    }
  };

  const handleBuySkill = (skillId) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      setSkills(prev => prev.map(s => s.id === skillId ? { ...s, purchased: true, installed: true } : s));
      showToast(`已成功购买并添加「${skill.name}」技能`);
    }
  };

  // --- 新增：密码验证界面渲染拦截 ---
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eff3f8] font-bold">
        <div className="bg-white w-[400px] rounded-[32px] shadow-xl p-8 animate-in zoom-in-95 border border-slate-100">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner mb-5">
              <Lock size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">律AI多 - 演示原型</h1>
            <p className="text-[13px] text-slate-500 mt-2 font-medium">当前为受限访问状态，请输入访问密码</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (authPassword === '123456') {
              setIsAuthenticated(true);
              sessionStorage.setItem('lveiduo_auth', 'true');
              setAuthError('');
            } else {
              setAuthError('访问密码错误，请联系管理员获取');
            }
          }} className="space-y-5">
            <div>
              <input
                autoFocus
                type="password"
                value={authPassword}
                onChange={(e) => {
                  setAuthPassword(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="输入访问密码..."
                className={`w-full bg-slate-50 border rounded-2xl py-3.5 px-4 text-[14px] outline-none transition-all font-bold tracking-wider
                  ${authError ? 'border-red-300 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10'}`}
              />
              {authError && <p className="text-red-500 text-[12px] mt-2 ml-1 animate-in slide-in-from-top-1">{authError}</p>}
            </div>
            <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2">
              确认进入 <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-700 font-sans overflow-hidden font-bold">
      {currentView !== 'details' && (
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full z-20">
          <div className="p-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">A</div>
            <span className="font-bold text-lg text-gray-800 tracking-tight">律AI多</span>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 space-y-1 py-4 font-bold custom-scrollbar">
            <div className="text-[10px] font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">主要</div>
            <NavItem active={activeMenu === 'search'} onClick={() => {setActiveMenu('search'); setCurrentView('home');}} icon={<Search size={18}/>} label="智能检索" />
            <NavItem active={activeMenu === 'assistant'} onClick={() => {setActiveMenu('assistant'); setCurrentView('home');}} icon={<MessageSquare size={18}/>} label="问答助手" />
            
            <div className="text-[10px] font-bold text-gray-400 px-3 py-2 mt-4 uppercase tracking-wider">生产力</div>
            <NavItem active={activeMenu === 'workspace'} onClick={() => {setActiveMenu('workspace'); setCurrentView('home');}} icon={<LayoutGrid size={18}/>} label="工作空间" />
            <NavItem active={activeMenu === 'knowledge'} onClick={() => {setActiveMenu('knowledge'); setCurrentView('home');}} icon={<BookOpen size={18}/>} label="知识库" />

            <div className="text-[10px] font-bold text-gray-400 px-3 py-2 mt-4 uppercase tracking-wider">发现</div>
            <NavItem active={activeMenu === 'apps'} onClick={() => {setActiveMenu('apps'); setCurrentView('apps');}} icon={<LayoutTemplate size={18}/>} label="应用中心" />
            <NavItem active={activeMenu === 'skills'} onClick={() => {setActiveMenu('skills'); setCurrentView('skills');}} icon={<Zap size={18}/>} label="技能中心" />
            
            <div className="text-[10px] font-bold text-gray-400 px-3 py-2 mt-4 uppercase tracking-wider">管理</div>
            <NavItem active={activeMenu === 'account'} onClick={() => {setActiveMenu('account'); setCurrentView('account');}} icon={<User size={18}/>} label="我的账户" />
          </nav>
          <div className="p-4 border-t border-gray-100 bg-white">
             <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all group shadow-sm border border-gray-100 font-bold">
               <Clock size={18} className="text-gray-400 group-hover:text-blue-600" />
               <span className="text-[13px]">历史记录</span>
               <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-blue-400" />
             </button>
          </div>
        </aside>
      )}

      {currentView === 'home' ? (
        <WorkspaceHome workspaces={workspaces} onEnter={handleEnterWorkspace} onUpdate={handleUpdateWorkspace} onDelete={handleDeleteWorkspace} onQuickAdd={handleQuickAdd} />
      ) : currentView === 'skills' ? (
        <SkillCenter skills={skills} onToggle={handleToggleSkill} onBuy={handleBuySkill} />
      ) : currentView === 'apps' ? (
        <AppCenter />
      ) : currentView === 'account' ? (
        <AccountCenter />
      ) : (
        <WorkspaceDetails 
          workspace={selectedWorkspace} 
          allWorkspaces={workspaces} 
          installedSkills={installedSkillsForWorkspace}
          onSwitchWorkspace={handleEnterWorkspace} 
          onBack={() => { setCurrentView('home'); setActiveMenu('workspace'); }} 
          autoOpenUpload={shouldAutoOpenUpload}
          onUploadOpened={() => setShouldAutoOpenUpload(false)}
          showToast={showToast}
        />
      )}

      {/* 轻提示 Toast 全局放置 */}
      {toastMsg && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[2000] bg-slate-800 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300 font-bold text-[13px]">
          <CheckCircle size={16} className="text-emerald-400" strokeWidth={2.5} />
          {toastMsg}
        </div>
      )}
    </div>
  );
};

// ==== 技能中心页面组件 ====
const SkillCenter = ({ skills, onToggle, onBuy }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'installed' && skill.installed);
    return matchesSearch && matchesTab;
  });

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc] font-bold animate-in fade-in">
       <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-100 z-50 shadow-sm">
         <div className="flex items-center text-xs font-medium space-x-2 text-slate-500">
           <span>律爱多</span><ChevronRight size={14} /><span>发现</span><ChevronRight size={14} /><span>技能中心</span>
         </div>
         <UserProfile />
       </header>
       <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
             <div className="mb-8 text-slate-800">
                 <h1 className="text-3xl font-bold tracking-tight">技能中心</h1>
                 <p className="text-gray-400 mt-2 font-medium text-[14px]">发现并添加强大的 AI 技能，扩展智能体的能力边界。</p>
             </div>
             
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-100">
                   <button 
                     onClick={() => setActiveTab('all')} 
                     className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     全部技能
                   </button>
                   <button 
                     onClick={() => setActiveTab('installed')} 
                     className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${activeTab === 'installed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                     已添加
                   </button>
                </div>
                
                <div className="relative group w-full md:w-72 shrink-0">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索技能名称或描述..."
                      className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-11 pr-4 text-[13px] font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} strokeWidth={2.5} />
                </div>
             </div>
             
             {filteredSkills.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                  {filteredSkills.map(skill => (
                     <div key={skill.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col hover:shadow-xl hover:border-blue-100 transition-all relative group h-full">
                        <div className="flex justify-between items-start mb-4">
                           <SkillMarketIconBox skill={skill} />
                           {skill.price > 0 && !skill.purchased ? (
                              <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[11px] px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 shadow-sm">
                                ￥{skill.price}
                              </span>
                           ) : skill.price > 0 && skill.purchased ? (
                              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[11px] px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 shadow-sm">
                                <CheckCircle size={12} strokeWidth={3}/>已购
                              </span>
                           ) : (
                              <span className="bg-slate-50 text-slate-500 border border-slate-200 text-[11px] px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 shadow-sm">
                                免费
                              </span>
                           )}
                        </div>
                        <h3 className="text-[16px] font-extrabold text-slate-800 mb-2">{skill.name}</h3>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium mb-8 flex-1">{skill.desc}</p>
                        
                        <div className="mt-auto">
                           {skill.price > 0 && !skill.purchased ? (
                              <button onClick={() => onBuy(skill.id)} className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                                 <ShoppingCart size={16} strokeWidth={2.5}/> 立即购买
                              </button>
                           ) : skill.installed ? (
                              <button onClick={() => onToggle(skill.id)} className="group/btn w-full py-2.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95">
                                 <Check size={16} strokeWidth={2.5} className="group-hover/btn:hidden"/>
                                 <span className="group-hover/btn:hidden">已添加</span>
                                 <Trash2 size={16} strokeWidth={2.5} className="hidden group-hover/btn:block"/>
                                 <span className="hidden group-hover/btn:block">移除</span>
                              </button>
                           ) : (
                              <button onClick={() => onToggle(skill.id)} className="w-full py-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95">
                                 <Plus size={16} strokeWidth={2.5}/> 添加技能
                              </button>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
             ) : (
               <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed animate-in fade-in">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-slate-300">
                    <Search size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-[16px] font-extrabold text-slate-700 mb-1.5">未找到相关技能</h3>
                  <p className="text-[13px] text-slate-400 font-medium">请尝试更换搜索关键词</p>
               </div>
             )}
          </div>
       </div>
    </main>
  );
};

// ==== 应用中心预留页面组件 ====
const AppCenter = () => (
  <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc] font-bold items-center justify-center animate-in fade-in">
    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
       <LayoutTemplate size={40} strokeWidth={2.5} />
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">应用中心</h2>
    <p className="text-slate-500 font-medium">应用中心正在建设中，涵盖更多行业专精应用，敬请期待...</p>
  </main>
);

const mockPurchases = [
  { id: 1, orderNo: '10250318104301', type: '体验版', content: '智能积分', time: '2025-03-18 10:43', expire: '--', amount: '¥ 3' },
  { id: 2, orderNo: '10202409110114', type: '个人版', content: 'VIP', time: '2024-09-11 05:02', expire: '--', amount: '¥ 0.01' },
];

const mockUsages = [
  { id: 1, appName: '问答助手', user: '产品团队', model: 'DeepSeek-V3.2', token: '26911', score: '51', time: '2026-03-23 01:03' },
  { id: 2, appName: '智能检索', user: '产品团队', model: 'DeepSeek-V3.2', token: '15914', score: '30', time: '2026-03-09 11:16' },
];

const AccountCenter = () => {
  const [usageRecords, setUsageRecords] = useState(mockUsages);
  const [filterAppType, setFilterAppType] = useState('全部');
  const [isClearUsageModalOpen, setIsClearUsageModalOpen] = useState(false);

  const displayUsages = usageRecords.filter(u => filterAppType === '全部' || u.appName === filterAppType);

  const handleClearUsages = () => {
     if (filterAppType === '全部') {
        setUsageRecords([]);
     } else {
        setUsageRecords(prev => prev.filter(u => u.appName !== filterAppType));
     }
     setIsClearUsageModalOpen(false);
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#eff3f8] font-bold animate-in fade-in">
       <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-100 z-50 shadow-sm">
         <div className="flex items-center text-xs font-medium space-x-2 text-slate-500">
           <span>律爱多</span><ChevronRight size={14} /><span>管理</span><ChevronRight size={14} /><span>我的账户</span>
         </div>
         <UserProfile />
       </header>

       <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6">
             <div className="bg-white rounded-xl shadow-sm p-6 pb-8 border border-slate-100/60">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-2">
                     <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                     <h2 className="text-[16px] font-extrabold text-slate-800">个人信息</h2>
                   </div>
                   <div className="flex items-center gap-5">
                     <button className="flex items-center gap-1.5 text-blue-600 text-[13px] font-bold relative hover:text-blue-700 transition-colors">
                        <CalendarDays size={16} /> 签到
                        <span className="absolute -top-3.5 -right-10 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-sm shadow-sm whitespace-nowrap">日签+200</span>
                     </button>
                     <button className="flex items-center gap-1.5 text-slate-500 text-[13px] font-bold hover:text-slate-700 transition-colors">
                        <Edit3 size={16} /> 编辑
                     </button>
                   </div>
                </div>

                <div className="flex items-center gap-10 mb-6 pl-2 text-[13px] text-slate-600 font-bold">
                   <span>昵称：律爱多产品团队</span>
                   <span>手机号：132****1345</span>
                </div>

                <div className="flex items-stretch gap-8 bg-[#f8fafc] p-5 rounded-2xl border border-blue-50/50 shadow-inner mt-2">
                   <div className="w-80 bg-gradient-to-r from-[#4d79ff] to-[#254ee8] rounded-xl text-white p-5 flex flex-col justify-between relative overflow-hidden shadow-md shrink-0">
                      <div className="absolute right-0 top-0 opacity-[0.08] pointer-events-none">
                         <div className="text-[120px] leading-none -mt-4 -mr-2 font-black italic">VIP</div>
                      </div>
                      <div className="flex items-center gap-3 relative z-10">
                         <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner">
                           <Sparkles size={20} className="text-white" strokeWidth={2.5}/>
                         </div>
                         <div>
                            <div className="text-[16px] font-extrabold tracking-wide">个人版-VIP</div>
                            <div className="text-[11px] text-white/80 font-medium mt-0.5">2026-10-11 23:59:59到期</div>
                         </div>
                      </div>
                      <button className="absolute right-4 bottom-4 border border-white/40 bg-white/10 backdrop-blur-sm text-white text-[12px] font-bold px-4 py-1.5 rounded-full hover:bg-white/20 transition-all z-10">
                         购买权益
                      </button>
                   </div>

                   <div className="flex-1 grid grid-cols-4 gap-4 items-center pl-2">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 text-[12px] text-slate-500 font-bold">
                           剩余积分
                           <span className="border border-blue-200 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[10px] cursor-pointer hover:bg-blue-100 transition-colors">充值</span>
                           <span className="border border-slate-200 text-slate-500 bg-white px-2 py-0.5 rounded-md text-[10px] cursor-pointer hover:bg-slate-50 transition-colors">规则</span>
                         </div>
                         <div className="text-[20px] font-extrabold text-slate-800 tracking-tight">1,436,951</div>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="text-[12px] text-slate-500 font-bold">知识库用量</div>
                         <div className="text-[16px] font-extrabold text-slate-800 mt-0.5 tracking-tight">259.62 MB<span className="text-[13px] text-slate-400 font-bold">/10 GB</span></div>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="text-[12px] text-slate-500 font-bold">自建知识库数量</div>
                         <div className="text-[16px] font-extrabold text-slate-800 mt-0.5 tracking-tight">38<span className="text-[13px] text-slate-400 font-bold">/100</span></div>
                      </div>
                      <div className="flex flex-col gap-2">
                         <div className="text-[12px] text-slate-500 font-bold">智能体数量</div>
                         <div className="text-[16px] font-extrabold text-slate-800 mt-0.5 tracking-tight">10个</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100/60">
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                   <h2 className="text-[16px] font-extrabold text-slate-800">购买记录</h2>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                         <tr className="text-[13px] text-slate-400 border-b border-slate-100 bg-slate-50/50">
                            <th className="py-4 px-4 font-bold w-16 text-center">序号</th>
                            <th className="py-4 px-4 font-bold">订单号</th>
                            <th className="py-4 px-4 font-bold">购买类型</th>
                            <th className="py-4 px-4 font-bold">购买内容</th>
                            <th className="py-4 px-4 font-bold">购买时间</th>
                            <th className="py-4 px-4 font-bold">到期时间</th>
                            <th className="py-4 px-4 font-bold text-right pr-8">金额</th>
                         </tr>
                      </thead>
                      <tbody className="text-[13px] text-slate-700 font-bold">
                         {[...mockPurchases].map((p, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                               <td className="py-4 px-4 text-center text-slate-500">{p.id}</td>
                               <td className="py-4 px-4">{p.orderNo}</td>
                               <td className="py-4 px-4">{p.type}</td>
                               <td className="py-4 px-4">{p.content}</td>
                               <td className="py-4 px-4 text-slate-500 font-medium">{p.time}</td>
                               <td className="py-4 px-4 text-slate-500 font-medium">{p.expire}</td>
                               <td className="py-4 px-4 text-right pr-8">{p.amount}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="bg-white rounded-xl shadow-sm p-6 pb-8 border border-slate-100/60">
                <div className="flex items-center gap-2 mb-6">
                   <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                   <h2 className="text-[16px] font-extrabold text-slate-800">使用记录</h2>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                   <div className="relative">
                      <select value={filterAppType} onChange={(e) => setFilterAppType(e.target.value)} className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-[13px] text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all font-bold cursor-pointer">
                         <option value="全部">全部</option>
                         <option value="问答助手">问答助手</option>
                         <option value="智能检索">智能检索</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                   </div>
                   <div className="flex items-center border border-slate-200 rounded-lg bg-white px-4 py-2 text-[13px] text-slate-400 w-72 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition-all cursor-pointer">
                      <CalendarDays size={16} className="mr-3 text-slate-300" />
                      <span className="font-bold">开始日期</span>
                      <span className="mx-4 text-slate-300">至</span>
                      <span className="font-bold">结束日期</span>
                   </div>
                   <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[13px] font-bold hover:bg-blue-700 shadow-sm shadow-blue-200 active:scale-95 transition-all">
                      查询
                   </button>
                   <button onClick={() => setIsClearUsageModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-[13px] font-bold transition-all border border-red-100 shadow-sm ml-auto">
                      <Trash2 size={16} strokeWidth={2.5}/> 清空记录
                   </button>
                </div>

                <div className="overflow-x-auto mb-8">
                   <table className="w-full text-left border-collapse min-w-[900px]">
                      <thead>
                         <tr className="text-[13px] text-slate-400 border-b border-slate-100 bg-slate-50/50">
                            <th className="py-4 px-4 font-bold w-16 text-center">序号</th>
                            <th className="py-4 px-4 font-bold">应用名称</th>
                            <th className="py-4 px-4 font-bold">使用者</th>
                            <th className="py-4 px-4 font-bold">使用模型</th>
                            <th className="py-4 px-4 font-bold">Token长度</th>
                            <th className="py-4 px-4 font-bold">消耗积分</th>
                            <th className="py-4 px-4 font-bold">使用时间</th>
                            <th className="py-4 px-4 font-bold text-center">操作</th>
                         </tr>
                      </thead>
                      <tbody className="text-[13px] text-slate-700 font-bold">
                         {displayUsages.map((u, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                               <td className="py-4 px-4 text-center text-slate-500">{u.id}</td>
                               <td className="py-4 px-4">{u.appName}</td>
                               <td className="py-4 px-4">{u.user}</td>
                               <td className="py-4 px-4 text-slate-600 font-medium">{u.model}</td>
                               <td className="py-4 px-4">{u.token}</td>
                               <td className="py-4 px-4">{u.score}</td>
                               <td className="py-4 px-4 text-slate-500 font-medium">{u.time}</td>
                               <td className="py-4 px-4 text-center">
                                  <span className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors px-2 py-1 hover:bg-blue-50 rounded-md">查看</span>
                               </td>
                            </tr>
                         ))}
                         {displayUsages.length === 0 && (
                            <tr>
                               <td colSpan="8" className="py-10 text-center text-slate-400 font-medium">暂无使用记录</td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>

                <div className="flex items-center justify-center gap-2 text-[13px] text-slate-600 mt-6 font-bold">
                   <button className="p-1 hover:text-blue-600 transition-colors text-slate-400"><ChevronLeft size={16} strokeWidth={2.5}/></button>
                   <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-blue-600 text-blue-600 bg-blue-50 shadow-sm">1</button>
                   <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">2</button>
                   <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">3</button>
                   <span className="px-1 text-slate-400 tracking-widest">...</span>
                   <button className="p-1 hover:text-blue-600 transition-colors text-slate-400"><ChevronRight size={16} strokeWidth={2.5}/></button>
                </div>
             </div>
          </div>
       </div>

       {isClearUsageModalOpen && (
         <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsClearUsageModalOpen(false)}>
            <div className="bg-white w-[400px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5"><Trash2 size={32} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">清空使用记录？</h3>
                <p className="text-[13px] text-gray-500 font-bold px-2 leading-relaxed">
                  {filterAppType === '全部' ? '确认是否清除当前所有使用记录？清除后不可恢复。' : `是否删除当前“${filterAppType}”条件下的使用记录？清除后不可恢复。`}
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 font-bold px-2">
                <button onClick={handleClearUsages} className="w-full py-3.5 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                   确认清空
                </button>
                <button onClick={() => setIsClearUsageModalOpen(false)} className="w-full py-2.5 text-gray-400 hover:text-gray-600 rounded-2xl transition-all">
                   取消
                </button>
              </div>
            </div>
         </div>
       )}
    </main>
  );
};

const WorkspaceHome = ({ workspaces, onEnter, onUpdate, onDelete, onQuickAdd }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWs, setEditingWs] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  
  const [formTags, setFormTags] = useState([]); 
  const [tagInput, setTagInput] = useState(''); 

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  const openEditModal = (ws) => {
    setEditingWs(ws);
    setFormTitle(ws.title); 
    setFormDesc(ws.description || ''); 
    setFormTags(ws.tags || []); 
    setTagInput(''); 
    setIsModalOpen(true); 
    setActiveMenuId(null);
  };

  const handleSaveEdit = () => {
    if (editingWs && formTitle.trim()) {
      onUpdate({ ...editingWs, title: formTitle, description: formDesc, tags: formTags });
      setIsModalOpen(false);
      setEditingWs(null);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formTags.includes(newTag) && formTags.length < 3) {
        setFormTags([...formTags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormTags(formTags.filter(tag => tag !== tagToRemove));
  };

  const handleOpenDelete = (e, ws) => {
    e.stopPropagation();
    setWorkspaceToDelete(ws);
    setIsDeleteConfirmOpen(true);
    setActiveMenuId(null);
  };

  const confirmDeleteProject = () => {
    if (workspaceToDelete) {
      onDelete(workspaceToDelete.id);
    }
    setIsDeleteConfirmOpen(false);
    setWorkspaceToDelete(null);
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc] font-bold" onClick={() => setActiveMenuId(null)}>
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-100 z-50 shadow-sm">
        <div className="flex items-center text-xs font-medium space-x-2 text-slate-500">
          <span>律爱多</span><ChevronRight size={14} /><span>生产力</span><ChevronRight size={14} /><span>我的工作空间</span>
        </div>
        <UserProfile />
      </header>

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-slate-800">
            <h1 className="text-3xl font-bold tracking-tight">我的工作空间</h1>
            <p className="text-gray-400 mt-2 font-medium text-[14px]">组织法律素材，启动深度研判，沉淀专业成果。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div onClick={onQuickAdd} className="group border-2 border-dashed border-gray-200 bg-white rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all aspect-[4/5] relative overflow-hidden">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm z-10">
                <Plus size={32} strokeWidth={3} />
              </div>
              <h3 className="text-lg font-bold z-10">新建工作空间</h3>
              <p className="text-xs text-gray-400 mt-2 text-center leading-relaxed font-bold z-10 px-4">快速上传案卷资料，开启全新 AI 协作</p>
            </div>

            {workspaces.map(ws => (
              <div key={ws.id} onClick={() => onEnter(ws)} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col cursor-pointer hover:shadow-xl hover:border-blue-100 transition-all aspect-[4/5] relative group">
                <div onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === ws.id ? null : ws.id); }} className={`absolute top-0 right-0 w-16 h-16 rounded-tr-3xl rounded-bl-[44px] transition-all flex items-center justify-center z-20 ${activeMenuId === ws.id ? 'bg-blue-100 shadow-inner' : 'bg-blue-50/50 hover:bg-blue-100'}`}>
                  <MoreHorizontal size={20} className={activeMenuId === ws.id ? 'text-blue-600' : 'text-blue-400'} />
                  {activeMenuId === ws.id && (
                    <div className="absolute top-14 right-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] py-1.5 text-xs font-bold animate-in slide-in-from-top-2 ring-1 ring-black/5 text-slate-700" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEditModal(ws)} className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-2.5 transition-colors font-bold"><Settings size={14} className="text-gray-400" /> 设置</button>
                      <div className="my-1 border-t border-gray-50 mx-2" />
                      <button onClick={(e) => handleOpenDelete(e, ws)} className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 flex items-center gap-2.5 transition-colors font-bold"><Trash2 size={14} /> 删除项目</button>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl w-fit shadow-lg shadow-blue-100 flex items-center justify-center"><FolderOpen size={20} strokeWidth={2.5} /></div>
                </div>
                <div className="flex-grow flex flex-col relative z-10">
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {ws.tags?.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">{ws.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-auto"> {ws.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4 relative z-10 text-slate-400">
                  <div className="flex items-center space-x-3 text-gray-400 font-bold">
                    <div className="flex items-center space-x-1"><FileText size={14} /><span className="text-[11px]"> {ws.sourceCount}</span></div>
                    <div className="flex items-center space-x-1"><Edit3 size={14} /><span className="text-[11px]"> {ws.conclusionCount}</span></div>
                  </div>
                  <div className="flex items-center text-[10px] text-gray-300 uppercase tracking-tighter font-bold"><Clock size={12} className="mr-1" />{ws.updatedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-[520px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Settings size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800">编辑工作空间</h3>
                <p className="text-xs text-slate-400 mt-1 font-bold">修改项目的基本信息以更好地组织研判任务。</p>
              </div>
            </div>
            <div className="space-y-6 font-bold">
              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest">空间标题</label>
                <input 
                  type="text" 
                  value={formTitle} 
                  onChange={(e) => setFormTitle(e.target.value)} 
                  placeholder="输入一个易于识别的标题"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest">分类标签</label>
                  <span className="text-[11px] text-slate-400">{formTags.length} / 3</span>
                </div>
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 flex flex-wrap gap-2 focus-within:ring-4 focus-within:ring-blue-500/5 focus-within:border-blue-300 transition-all min-h-[56px] items-center">
                  {formTags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 bg-white text-blue-600 px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] font-extrabold shadow-sm">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="p-0.5 -mr-1 rounded-md hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors">
                        <X size={12} strokeWidth={3} />
                      </button>
                    </span>
                  ))}
                  {formTags.length < 3 && (
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={formTags.length === 0 ? "输入标签后按回车添加..." : "继续添加..."}
                      className="flex-1 min-w-[120px] bg-transparent text-[13px] font-bold outline-none text-slate-700 placeholder:text-slate-400"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-extrabold text-slate-400 uppercase tracking-widest">研判简介 (可选)</label>
                <textarea 
                  value={formDesc} 
                  onChange={(e) => setFormDesc(e.target.value)} 
                  placeholder="简单描述一下该空间的研判目标或背景资料"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-300 transition-all resize-none" 
                />
              </div>
            </div>
            <div className="mt-10 flex gap-3 font-bold">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl text-gray-400 hover:bg-slate-50">取消</button>
              <button onClick={handleSaveEdit} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700">保存修改</button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsDeleteConfirmOpen(false)}>
          <div className="bg-white w-[400px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5"><Trash2 size={32} strokeWidth={2.5} /></div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">确认删除此项目？</h3>
              <p className="text-sm text-gray-400 font-bold px-4">您正在操作：<span className="text-slate-600">{workspaceToDelete?.title}</span>。该空间内所有研判数据将无法找回。</p>
            </div>
            <div className="mt-8 flex flex-col gap-2 font-bold px-4">
              <button onClick={confirmDeleteProject} className="w-full py-4 bg-red-500 text-white rounded-2xl shadow-lg hover:bg-red-600">确认删除项目</button>
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="w-full py-3.5 rounded-2xl text-gray-400 hover:bg-slate-50">取消</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const WorkspaceDetails = ({ workspace, allWorkspaces, installedSkills = [], onSwitchWorkspace, onBack, autoOpenUpload, onUploadOpened, showToast }) => {
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [skillMenuOpen, setSkillMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState('conclusions'); 
  
  const [viewingSourceId, setViewingSourceId] = useState(null);
  const [activeSourceMenuId, setActiveSourceMenuId] = useState(null);
  const [activeConclusionMenuId, setActiveConclusionMenuId] = useState(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true); 
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToManage, setItemToManage] = useState(null);
  const [managementTitle, setManagementTitle] = useState("");

  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);

  const [uploadModalStep, setUploadModalStep] = useState('select'); 
  const [uploadLink, setUploadLink] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalStep, setReportModalStep] = useState('select');
  const [selectedReportFormat, setSelectedReportFormat] = useState(null);
  const [reportPrompt, setReportPrompt] = useState('');
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // --- 新增：收录到知识库相关状态 ---
  const [isSaveToKbModalOpen, setIsSaveToKbModalOpen] = useState(false);
  const [selectedKbIds, setSelectedKbIds] = useState([]);
  const [itemToSaveToKb, setItemToSaveToKb] = useState(null);

  const [isWritingModalOpen, setIsWritingModalOpen] = useState(false);
  const [writingModalStep, setWritingModalStep] = useState('select');
  const [selectedWritingFormat, setSelectedWritingFormat] = useState(null);
  const [writingPrompt, setWritingPrompt] = useState('');
  const [writingLength, setWritingLength] = useState('standard');
  const [writingTone, setWritingTone] = useState('professional');
  const [isGeneratingWritingSuggestions, setIsGeneratingWritingSuggestions] = useState(false);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState('刑事');
  
  const [openDocs, setOpenDocs] = useState([]);
  const [activeCenterTab, setActiveCenterTab] = useState('chat');
  const [docCounter, setDocCounter] = useState(1);
  
  const [activeProcessTaskId, setActiveProcessTaskId] = useState(null);
  const activeProcessTaskRef = useRef(null); // 新增：用于在定时器中安全读取当前展开的过程面板ID
  
  const [docMoreMenuOpen, setDocMoreMenuOpen] = useState(false);
  
  const [sourceDrafts, setSourceDrafts] = useState({});
  const [docToClose, setDocToClose] = useState(null);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  
  const [tempFiles, setTempFiles] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGeneratingChat, setIsGeneratingChat] = useState(false);
  const [chatMoreMenuOpen, setChatMoreMenuOpen] = useState(false);
  const [isClearChatModalOpen, setIsClearChatModalOpen] = useState(false);
  const chatEndRef = useRef(null);
  const consoleEndRef = useRef(null); 

  // --- 新增：记录哪些消息的思考过程被展开了 ---
  const [expandedThinkingMsgs, setExpandedThinkingMsgs] = useState({});

  const [expandedTasks, setExpandedTasks] = useState({}); 

  const [sources, setSources] = useState([
    { id: 1, type: 'pdf', title: '民事起诉状_原告版本.pdf', date: '2024-05-20 14:30', checked: true, 
      content: '本案原告张某某诉被告李某某股权转让纠纷一案。事实如下：2023年3月，双方签订《股权转让协议》，约定被告将其持有的某半导体公司15%股权转让给原告。原告已按约支付首期款项300万元，但被告至今未履行工商变更登记义务，导致原告股东权利无法实现。',
      summary: '本案核心为股权转让合同履行争议。张某某作为原告，主要诉求是被告配合办理工商变更。当前关键点：原告已支付首期款，被告拒绝过户。'
    },
    { id: 2, type: 'url', title: '《中华人民共和国公司法》（2023修订）', date: '2024-05-21 09:15', checked: true,
      content: '2023年12月29日，新修订的《中华人民共和国公司法》正式通过。本次修订重点包括：完善公司设立退出制度、优化公司治理结构、加强股东权利保护。特别是对于有限责任公司股权转让的程序进行了进一步细化，明确了股权转让后相关方的配合义务。',
      summary: '该文档提供新公司法的法律背景。特别强调了股权转让后的合规性与变更登记的法定义务，对本案中被告的抗辩理由具有直接法律比对价值。',
      originalUrl: 'https://www.pkulaw.com/chl/8ba805acd08846d7bdfb.html?keyword=%E5%85%AC%E5%8F%B8%E6%B3%95&way=listView'
    },
    { id: 3, type: 'fb', title: '最高院指导性案例168号', date: '2024-06-01 10:05', checked: true,
      content: '【裁判摘要】有限责任公司股东向股东以外的人转让股权，应当经其他股东过半数同意。其他股东在接到通知后三十日内未答复的，视为同意转让。其他股东半数以上不同意转让的，不同意的股东应当购买该转让的股权；不购买的，视为同意转让。本案确立了优先购买权行使的时间窗口与后果。',
      summary: '明确了股东转让股权给第三方时“优先购买权”的行使程序。本案被告若以其他股东不同意为由抗辩，可参考此案例中的程序要件。'
    },
    { id: 4, type: 'fb', title: '最高院关于有限责任公司股东身份认定意见', date: '2026-01-12 11:20', checked: true, content: '内容加载中...', summary: '正在生成 AI 摘要...', status: 'parsing' },
    { id: 5, type: 'pdf', title: '某互联网公司股权激励计划协议草案', date: '2026-01-12 16:45', checked: true, content: '内容加载中...', summary: '正在生成 AI 摘要...' },
  ]);

  const [conclusions, setConclusions] = useState([
    { id: 201, type: '核心争议', title: '优先购买权行使期限起算点', content: '依据新公司法第84条...', status: 'completed', sourceCount: 2, completedAt: '昨天 16:30' },
    { id: 202, type: '报告生成', title: '股权纠纷深度研判报告', progress: 65, status: 'generating', sourceCount: 3 },
    { id: 203, type: '抗辩策略', title: '关于股权质押优先受偿权顺位', progress: 0, status: 'pending', sourceCount: 1 },
    { id: 204, type: '类案检索', title: '指导案例168号适用性分析', progress: 32, status: 'failed', errorMsg: '上下文长度超限，请精简来源文件', sourceCount: 4 },
  ]);

  // installedSkills 与技能中心「已添加」列表同源（App 内对 skills 按 installed 派生）
  const activeChatSkill = installedSkills.find(s => s.id === selectedSkillId);

  useEffect(() => {
    if (!selectedSkillId) return;
    if (!installedSkills.some(s => s.id === selectedSkillId)) {
      setSelectedSkillId(null);
    }
  }, [installedSkills, selectedSkillId]);

  const activeViewingSource = sources.find(s => s.id === viewingSourceId);
  const activeDoc = openDocs.find(d => d.id === activeCenterTab);
  
  const checkedCount = sources.filter(s => s.checked).length;
  const allChecked = sources.length > 0 && checkedCount === sources.length;
  const someChecked = checkedCount > 0 && checkedCount < sources.length;

  const EXPLORE_CATEGORIES = [
    { id: 'all', label: '全部' },
    { id: '全网', label: '全网' },
    { id: '法规库', label: '法规库' },
    { id: '案例库', label: '案例库' },
    { id: '人民法院案例库', label: '人民法院案例库' },
    { id: '律师实务库', label: '律师实务库' },
    { id: '期刊文章库', label: '期刊文章库' },
  ];

  const filteredCandidates = activeCategory === 'all' 
    ? MODAL_CANDIDATE_SOURCES 
    : MODAL_CANDIDATE_SOURCES.filter(m => m.category === activeCategory || (m.detail && m.detail.includes(activeCategory)));


  useEffect(() => {
    if (autoOpenUpload) {
      setIsAddModalOpen(true);
      onUploadOpened(); 
    }
  }, [autoOpenUpload, onUploadOpened]);

  // 新增：模拟 AI 分析案卷并生成推荐格式的拟真等待时间
  useEffect(() => {
    let timer;
    if (isReportModalOpen && reportModalStep === 'select') {
      setIsGeneratingSuggestions(true);
      timer = setTimeout(() => {
        setIsGeneratingSuggestions(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isReportModalOpen, reportModalStep]);

  useEffect(() => {
    let timer;
    if (isWritingModalOpen && writingModalStep === 'select') {
      setIsGeneratingWritingSuggestions(true);
      timer = setTimeout(() => {
        setIsGeneratingWritingSuggestions(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isWritingModalOpen, writingModalStep]);

  // --- 新增逻辑 1：监听任务进度，自动平滑滚动终端日志 ---
  useEffect(() => {
    if (activeProcessTaskId && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [conclusions, activeProcessTaskId]);

  // --- 同步 ref 状态，供定时器安全获取最新展开的面板 ID ---
  useEffect(() => {
    activeProcessTaskRef.current = activeProcessTaskId;
  }, [activeProcessTaskId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setConclusions(prev => {
        let hasChanges = false;
        const nextConclusions = prev.map(c => {
          if (c.status === 'generating') {
            hasChanges = true;
            const newProgress = Math.min(c.progress + 2, 100);
            if (newProgress === 100) {
              const now = new Date();
              const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
              
              // --- 修复：仅在任务跑完的瞬间，判断过程面板是否还开着，如果是，则自动转到结果页 ---
              if (activeProcessTaskRef.current === c.id) {
                const docId = `conclusion-${c.id}`;
                setOpenDocs(prevDocs => {
                  if (prevDocs.some(d => d.id === docId)) return prevDocs;
                  return [...prevDocs, {
                    id: docId,
                    title: c.title,
                    content: c.content || '智能体已完成工作。如需查阅过程，请参考下方分析...',
                    conclusionId: c.id
                  }];
                });
                setActiveCenterTab(docId);
                setActiveProcessTaskId(null); // 收起底部的过程悬浮窗
              }
              
              return { ...c, progress: 100, status: 'completed', completedAt: `今天 ${timeStr}` };
            }
            return { ...c, progress: newProgress };
          }
          return c;
        });
        return hasChanges ? nextConclusions : prev;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const parsingSources = sources.filter(s => s.status === 'parsing');
    if (parsingSources.length > 0) {
      const timer = setTimeout(() => {
        setSources(prev => prev.map(s => {
          if (s.status === 'parsing') {
            return {
              ...s,
              status: 'ready',
              content: s.content === '内容加载中...' ? `【解析完成】${s.title} 的正文内容已经成功提取，随时可用于智能分析与研判。` : s.content,
              summary: '已完成智能摘要提炼，可随时查阅核心要点。'
            };
          }
          return s;
        }));
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [sources]);

  const handleSaveToResults = (content) => {
    const newConclusion = {
      id: Date.now(),
      type: '对话提取',
      title: '从对话保存的结论',
      content: content,
      status: 'completed',
      sourceCount: checkedCount,
      completedAt: '刚刚'
    };
    setConclusions(prev => [newConclusion, ...prev]);
    setActiveRightTab('conclusions');
    setShowRightPanel(true);
    showToast('已保存至右侧结果区，可进行继续编辑');
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setTimeout(() => {
      setUploadModalStep('select');
      setUploadLink('');
      setUploadText('');
      setExploreSearchQuery('');
      setSelectedCandidateIds([]);
      setActiveCategory('all');
    }, 300);
  };

  const handleAddSource = () => {
    if (uploadModalStep === 'link' && !uploadLink.trim()) return;
    if (uploadModalStep === 'text' && !uploadText.trim()) return;

    const newSource = {
      id: `src-added-${Date.now()}`,
      type: uploadModalStep === 'link' ? 'url' : 'doc',
      title: uploadModalStep === 'link' ? uploadLink.trim() : '粘贴的文本资料',
      date: new Date().toLocaleString(),
      checked: true,
      content: uploadModalStep === 'link' ? `网页链接：${uploadLink}` : uploadText,
      summary: '新添资料，等待系统生成摘要...',
      status: 'parsing',
      originalUrl: uploadModalStep === 'link' ? uploadLink.trim() : undefined
    };
    
    setSources(prev => [newSource, ...prev]);
    closeAddModal();
  };

  const handleCreateNewDoc = () => {
    const newId = Date.now();
    const docId = `conclusion-${newId}`;
    
    const newConclusion = {
      id: newId,
      type: '自定义文档',
      title: `未命名文档 ${docCounter}`,
      content: '',
      status: 'completed', 
      sourceCount: checkedCount,
      completedAt: '刚刚'
    };
    
    setConclusions(prev => [newConclusion, ...prev]);
    
    const newDoc = {
      id: docId,
      title: newConclusion.title,
      content: newConclusion.content,
      conclusionId: newId 
    };
    
    setOpenDocs(prev => [...prev, newDoc]);
    setActiveCenterTab(newDoc.id);
    setActiveRightTab('conclusions'); 
    setShowRightPanel(true);
    setDocCounter(prev => prev + 1);
  };

  const handleRetryTask = (e, id) => {
    e.stopPropagation();
    setConclusions(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'generating', errorMsg: undefined } : c
    ));
    setActiveProcessTaskId(id);
    setActiveCenterTab('chat');
  };

  const handleOpenConclusion = (conclusion) => {
    if (conclusion.status === 'failed') return; 

    if (conclusion.status === 'generating' || conclusion.status === 'pending') {
      setActiveProcessTaskId(conclusion.id);
      setActiveCenterTab('chat');
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }

    if (conclusion.status !== 'completed') return;
    
    const docId = `conclusion-${conclusion.id}`;
    const existingDoc = openDocs.find(d => d.id === docId);
    if (existingDoc) {
      setActiveCenterTab(existingDoc.id);
    } else {
      const newDoc = {
        id: docId,
        title: conclusion.title,
        content: conclusion.content || '智能体已完成工作。如需查阅过程，请参考下方分析...',
        conclusionId: conclusion.id
      };
      setOpenDocs([...openDocs, newDoc]);
      setActiveCenterTab(newDoc.id);
    }
  };

  const executeCloseDoc = (docId) => {
    const newDocs = openDocs.filter(d => d.id !== docId);
    setOpenDocs(newDocs);
    if (activeCenterTab === docId) {
      setActiveCenterTab('chat');
    }
  };

  const handleCloseDoc = (e, docId) => {
    e?.stopPropagation();
    
    const targetDoc = openDocs.find(d => d.id === docId);
    if (!targetDoc) return;
    
    if (targetDoc.type !== 'iframe' && !docId.startsWith('conclusion-')) {
      const source = sources.find(s => s.id === targetDoc.sourceId || s.docId === targetDoc.id);
      
      if (source) {
        if (targetDoc.content !== source.content || targetDoc.title !== source.title) {
           setDocToClose(targetDoc);
           setIsUnsavedModalOpen(true);
           return; 
        }
      }
    }
    
    executeCloseDoc(docId);
  };

  const handleUnsavedSaveAndClose = () => {
    if (docToClose) {
      const sourceId = docToClose.sourceId || sources.find(s => s.docId === docToClose.id)?.id;
      if (sourceId) {
        setSources(prev => prev.map(s => s.id === sourceId ? {
          ...s,
          title: docToClose.title,
          content: docToClose.content,
          date: new Date().toLocaleString(),
          status: 'parsing',
          summary: '内容已更新，正在重新生成摘要...'
        } : s));
        
        setSourceDrafts(prev => { const newDrafts = {...prev}; delete newDrafts[sourceId]; return newDrafts; });
      }
    }
    setIsUnsavedModalOpen(false);
    executeCloseDoc(docToClose.id);
    setDocToClose(null);
  };

  const handleUnsavedDiscardAndClose = () => {
    if (docToClose) {
       const sourceId = docToClose.sourceId || sources.find(s => s.docId === docToClose.id)?.id;
       if (sourceId) {
         setSourceDrafts(prev => ({ ...prev, [sourceId]: { title: docToClose.title, content: docToClose.content } }));
       }
    }
    setIsUnsavedModalOpen(false);
    executeCloseDoc(docToClose.id);
    setDocToClose(null);
  };

  const handleUpdateDoc = (docId, updates) => {
    setOpenDocs(prev => prev.map(d => d.id === docId ? { ...d, ...updates } : d));
    
    const doc = openDocs.find(d => d.id === docId);
    if (doc && docId.startsWith('conclusion-')) {
       const concId = parseInt(docId.replace('conclusion-', ''));
       setConclusions(prev => prev.map(c => c.id === concId ? { ...c, ...updates } : c));
    }
  };

  const handleSaveToSource = () => {
    const activeDoc = openDocs.find(d => d.id === activeCenterTab);
    if (!activeDoc) return;

    setSources(prev => {
      const existingSourceIndex = prev.findIndex(s => s.id === activeDoc.sourceId || s.docId === activeDoc.id);
      
      if (existingSourceIndex >= 0) {
        const newSources = [...prev];
        const sourceId = newSources[existingSourceIndex].id;
        
        newSources[existingSourceIndex] = {
          ...newSources[existingSourceIndex],
          title: activeDoc.title || '未命名文档',
          content: activeDoc.content || '',
          date: new Date().toLocaleString(),
          status: 'parsing', 
          summary: '内容已更新，正在重新生成摘要...'
        };
        
        setSourceDrafts(drafts => { const newDrafts = {...drafts}; delete newDrafts[sourceId]; return newDrafts; });
        return newSources;
      } else {
        const newSourceId = `src-doc-${Date.now()}`;
        const newSource = {
          id: newSourceId,
          type: 'doc',
          title: activeDoc.title || '未命名文档',
          date: new Date().toLocaleString(),
          checked: true,
          content: activeDoc.content || '',
          summary: '正在生成 AI 摘要...',
          status: 'parsing',
          docId: activeDoc.id
        };
        setOpenDocs(docs => docs.map(d => d.id === activeDoc.id ? {...d, sourceId: newSourceId} : d));
        return [newSource, ...prev];
      }
    });
  };

  const handleOpenSourceAsDoc = (source) => {
    setViewingSourceId(null);
    
    const docId = source.docId || `doc-from-src-${source.id}`;
    const existingDoc = openDocs.find(d => d.id === docId);
    
    if (existingDoc) {
      setActiveCenterTab(existingDoc.id);
    } else {
      const draft = sourceDrafts[source.id];
      const newDoc = {
        id: docId,
        title: draft ? draft.title : source.title,
        content: draft ? draft.content : source.content,
        sourceId: source.id 
      };
      setOpenDocs([...openDocs, newDoc]);
      setActiveCenterTab(newDoc.id);
    }
  };

  const handleOpenUrlInCenter = (e, source) => {
    e.stopPropagation();
    const docId = `url-${source.id}`;
    const existingDoc = openDocs.find(d => d.id === docId);

    if (existingDoc) {
      setActiveCenterTab(existingDoc.id);
    } else {
      const newDoc = {
        id: docId,
        title: source.title,
        type: 'iframe', 
        url: source.originalUrl
      };
      setOpenDocs([...openDocs, newDoc]);
      setActiveCenterTab(newDoc.id);
    }
  };

  const handleBadgeClick = (source) => {
    if (source.type === 'url' && source.originalUrl) {
      window.open(source.originalUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowLeftPanel(true);
      setViewingSourceId(source.id);
    }
  };

  const handleToggleAll = (e) => {
    e.stopPropagation();
    const nextState = !allChecked; 
    setSources(prev => prev.map(s => ({ ...s, checked: nextState })));
  };

  const handleBatchDeleteTrigger = (e) => {
    if (e) e.stopPropagation();
    if (checkedCount === 0) return;
    setItemToManage({ 
      id: 'batch', 
      title: `选中的 ${checkedCount} 个来源资料`, 
      itemType: 'batch_source' 
    });
    setIsDeleteConfirmOpen(true);
  };

  const handleOpenRename = (e, item, type) => {
    if (e) e.stopPropagation();
    setItemToManage({ ...item, itemType: type });
    setManagementTitle(item.title);
    setIsRenameModalOpen(true);
    setActiveSourceMenuId(null);
    setActiveConclusionMenuId(null);
  };

  const submitRename = () => {
    if (!managementTitle.trim() || !itemToManage) return;
    if (itemToManage.itemType === 'source') {
      setSources(prev => prev.map(s => s.id === itemToManage.id ? { ...s, title: managementTitle } : s));
    } else {
      setConclusions(prev => prev.map(c => c.id === itemToManage.id ? { ...c, title: managementTitle } : c));
      
      setOpenDocs(prev => prev.map(d => d.id === `conclusion-${itemToManage.id}` ? { ...d, title: managementTitle } : d));
    }
    setIsRenameModalOpen(false);
    setTimeout(() => setItemToManage(null), 300);
  };

  const handleOpenDeleteDetail = (e, item, type) => {
    if (e) e.stopPropagation(); 
    setItemToManage({ ...item, itemType: type });
    setIsDeleteConfirmOpen(true);
    setActiveSourceMenuId(null);
    setActiveConclusionMenuId(null);
  };

  const confirmDeleteDetail = () => {
    if (itemToManage.itemType === 'source') {
      setSources(sources.filter(s => s.id !== itemToManage.id));
      if (viewingSourceId === itemToManage.id) setViewingSourceId(null);
    } else if (itemToManage.itemType === 'batch_source') {
      const newSources = sources.filter(s => !s.checked);
      setSources(newSources);
      if (sources.find(s => s.id === viewingSourceId && s.checked)) setViewingSourceId(null);
    } else {
      setConclusions(conclusions.filter(c => c.id !== itemToManage.id));
      const docId = `conclusion-${itemToManage.id}`;
      executeCloseDoc(docId);
    }
    setIsDeleteConfirmOpen(false);
    setItemToManage(null);
  };

  const handleSaveConclusionToSource = (e, conclusion) => {
    e.stopPropagation();
    const newSourceId = `src-conc-${Date.now()}`;
    const newSource = {
      id: newSourceId,
      type: 'doc',
      title: conclusion.title || '未命名结论',
      date: new Date().toLocaleString(),
      checked: true,
      content: conclusion.content || '',
      summary: '正在生成 AI 摘要...',
      status: 'parsing',
      docId: `conclusion-${conclusion.id}`
    };
    setSources(prev => [newSource, ...prev]);
    setActiveConclusionMenuId(null);
    if (showToast) showToast('已成功保存到左侧来源');
  };

  const toggleCandidate = (id) => {
    setSelectedCandidateIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddSelectedCandidates = () => {
    const selectedData = MODAL_CANDIDATE_SOURCES.filter(c => selectedCandidateIds.includes(c.id));
    const newSources = selectedData.map(c => ({
      id: `new-${Date.now()}-${c.id}`,
      type: c.type,
      title: c.title,
      date: new Date().toLocaleString(),
      checked: true,
      content: '内容加载中...',
      summary: '正在生成 AI 摘要...',
      status: 'parsing'
    }));
    setSources(prev => [...prev, ...newSources]);
    closeAddModal();
  };

  // --- 新增：收录到知识库交互逻辑 ---
  const handleOpenSaveToKb = (e, conclusion) => {
    e.stopPropagation();
    setItemToSaveToKb(conclusion);
    setSelectedKbIds([]);
    setIsSaveToKbModalOpen(true);
    setActiveConclusionMenuId(null);
  };

  const toggleKbSelection = (id) => {
    setSelectedKbIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const confirmSaveToKb = () => {
    if (showToast) showToast('已成功收录到所选知识库');
    setIsSaveToKbModalOpen(false);
    setTimeout(() => setItemToSaveToKb(null), 300);
  };

  const handleAgentClick = (agentId) => {
    if (agentId === 'research') {
      setIsReportModalOpen(true);
      setReportModalStep('select');
    } else if (agentId === 'writing') {
      setIsWritingModalOpen(true);
      setWritingModalStep('select');
    } else {
      console.log('触发执行 Agent:', agentId);
    }
  };

  const handleSelectReportFormat = (e, format) => {
    e?.stopPropagation();
    setSelectedReportFormat(format);
    setReportPrompt(format.defaultPrompt || '');
    setReportModalStep('config');
  };

  const handleSimulateUpload = () => {
    const mockNames = ['补充证据材料_2024.pdf', '原告庭审笔录_最终版.docx', '审计报告_附件2.xlsx', '现场勘查照片.jpg'];
    const randomName = mockNames[tempFiles.length % mockNames.length];
    const newFile = {
      id: `temp-${Date.now()}`,
      name: randomName
    };
    setTempFiles(prev => [...prev, newFile]);
  };

  const handleRemoveTempFile = (id) => {
    setTempFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragStart = (e, conclusion) => {
    if (conclusion.status !== 'completed') return;
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'conclusion',
      id: conclusion.id,
      title: conclusion.title
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
    e.dataTransfer.dropEffect = 'copy';
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.type === 'conclusion') {
          if (!tempFiles.find(f => f.sourceId === parsed.id)) {
            setTempFiles(prev => [...prev, {
              id: `temp-conc-${Date.now()}`,
              sourceId: parsed.id,
              name: parsed.title,
              isConclusion: true
            }]);
          }
        }
      }
    } catch (err) {
      console.log('非系统内拖拽数据');
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isGeneratingChat) return;

    const userMsg = { id: Date.now(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsGeneratingChat(true);

    const aiMsgId = Date.now() + 1;

    // 稍微延迟一下，模拟网络请求，然后推入初始“思考”状态的 AI 消息
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: aiMsgId, 
        role: 'ai', 
        content: '', 
        isTyping: true,
        isThinking: true, // 新增：是否处于思考阶段
        thinkingSteps: [], // 新增：思考步骤数组
        currentThinkingProgress: '开始深度分析资料...'
      }]);

      // 自动滚动到底部
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

      // --- 阶段 1：模拟思考过程的时间线 ---
      const thinkingTimeline = [
        { title: '提取核心诉求', desc: '正在读取挂载的《民事起诉状_原告版本.pdf》，提取原告诉讼请求及事实理由...', time: 800 },
        { title: '交叉比对法规', desc: '检索《公司法》及《最高院关于有限责任公司股东身份认定意见》，比对“优先购买权”行使要件...', time: 2000 },
        { title: '匹配指导案例', desc: '检索到“指导案例168号”，对比本案被告行为与指导案例裁判要旨的契合度...', time: 3500 },
        { title: '组织研判意见', desc: '梳理违约事实、程序风险，并开始构建回复策略框架...', time: 4800 }
      ];

      thinkingTimeline.forEach((step, idx) => {
        setTimeout(() => {
          setMessages(prev => prev.map(msg => {
            if (msg.id !== aiMsgId) return msg;
            const newSteps = [...(msg.thinkingSteps || [])];
            // 将上一步的状态标记为完成
            if (newSteps.length > 0) newSteps[newSteps.length - 1].status = 'completed';
            // 推入当前步骤
            newSteps.push({ ...step, status: 'current' });
            return { ...msg, thinkingSteps: newSteps, currentThinkingProgress: step.title };
          }));
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, step.time);
      });

      // --- 阶段 2：思考结束，开始打字回复内容 ---
      setTimeout(() => {
        // 更新最后一步状态为完成，关闭思考中动画
        setMessages(prev => prev.map(msg => {
          if (msg.id !== aiMsgId) return msg;
          const finalSteps = [...msg.thinkingSteps];
          if (finalSteps.length > 0) finalSteps[finalSteps.length - 1].status = 'completed';
          return { ...msg, isThinking: false, currentThinkingProgress: '深度研判完成', thinkingSteps: finalSteps };
        }));

        const fullResponse = `收到您的问题。根据您目前挂载的 **${checkedCount}** 份来源资料（特别是《民事起诉状_原告版本.pdf》及新修订《公司法》），我为您梳理以下初步研判意见：\n\n1. **违约事实明确**：原告已按约支付首期款项 300 万元，被告至今未履行工商变更登记义务，这已构成对《股权转让协议》的实质性违约[[1]]。\n2. **优先购买权程序风险**：根据指导性案例168号[[3]]，向股东以外的人转让股权，应当经其他股东过半数同意[[2]]。建议您优先核查被告是否已按法定程序向其他股东发出书面通知，以及是否已过三十日答复期。\n\n您可以直接在右侧“Agent 工作台”调用**[合同风控]**或**[诉讼方案]**技能，或者要求我为您起草一份《催告函》。`;
        let currentText = "";
        let i = 0;

        const typingInterval = setInterval(() => {
          if (i < fullResponse.length) {
            currentText += fullResponse.charAt(i);
            setMessages(prev => prev.map(msg =>
              msg.id === aiMsgId ? { ...msg, content: currentText } : msg
            ));
            i++;
            // 在打字过程中偶尔修正滚动条
            if (i % 30 === 0) chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          } else {
            clearInterval(typingInterval);
            setMessages(prev => prev.map(msg =>
              msg.id === aiMsgId ? { ...msg, isTyping: false } : msg
            ));
            setIsGeneratingChat(false);
          }
        }, 20); 
      }, 6500); // 在思考流结束之后 (4800ms之后) 启动
    }, 200); 
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setTimeout(() => { setReportModalStep('select'); setReportPrompt(''); }, 300);
  };

  const handleGenerateReport = () => {
    const newTaskId = Date.now();
    const mockReportContent = `基于您的案卷材料（共 ${checkedCount} 份），我为您深度研判生成了这份报告。\n\n一、 核心事实重构\n1. 2023年3月双方签署协议，原告已支付首期款300万元。\n2. 被告未按期履行工商变更登记义务。\n\n二、 法律依据与风险评估\n根据《公司法》第84条，有限责任公司股权转让需遵循相关程序，现被告已构成实质性违约。\n经子智能体比对，若被告主张优先购买权瑕疵，我方可引用指导案例168号作为抗辩依据。\n\n三、 行动建议\n建议立即向其余股东发送书面催告通知，并固定相关违约证据，准备提起违约之诉。\n\n*该内容由智能体自主生成*`;
    
    const newConclusion = {
      id: newTaskId,
      type: '报告生成',
      title: selectedReportFormat?.id === 'custom' ? '自定义研判报告' : (selectedReportFormat?.title || '未命名报告'),
      progress: 0,
      status: 'generating',
      sourceCount: checkedCount,
      content: mockReportContent
    };
    setConclusions(prev => [newConclusion, ...prev]);
    setActiveRightTab('conclusions'); 
    setShowRightPanel(true);
    setActiveProcessTaskId(newTaskId);
    closeReportModal();
  };

  const handleQuickGenerate = (e, format) => {
    e?.stopPropagation();
    if (format.id === 'custom') {
       handleSelectReportFormat(e, format);
       return;
    }
    
    const newTaskId = Date.now();
    const mockReportContent = `基于您的案卷材料（共 ${checkedCount} 份），我为您深度研判生成了这份《${format.title}》。\n\n一、 核心事实重构\n1. 2023年3月双方签署协议，原告已支付首期款300万元。\n2. 被告未按期履行工商变更登记义务。\n\n二、 法律依据与风险评估\n根据《公司法》第84条，有限责任公司股权转让需遵循相关程序，现被告已构成实质性违约。\n经子智能体比对，若被告主张优先购买权瑕疵，我方可引用指导案例168号作为抗辩依据。\n\n三、 行动建议\n建议立即向其余股东发送书面催告通知，并固定相关违约证据，准备提起违约之诉。`;

    const newConclusion = {
      id: newTaskId,
      type: '报告生成',
      title: format.title || '未命名报告',
      progress: 0,
      status: 'generating',
      sourceCount: checkedCount,
      content: mockReportContent
    };
    setConclusions(prev => [newConclusion, ...prev]);
    setActiveRightTab('conclusions'); 
    setShowRightPanel(true);
    setActiveProcessTaskId(newTaskId);
    closeReportModal();
  };

  const closeWritingModal = () => {
    setIsWritingModalOpen(false);
    setTimeout(() => { 
      setWritingModalStep('select'); 
      setWritingPrompt(''); 
      setWritingLength('standard');
      setWritingTone('professional');
    }, 300);
  };

  const handleSelectWritingFormat = (e, format) => {
    e?.stopPropagation();
    setSelectedWritingFormat(format);
    setWritingModalStep('config');
  };

  const handleQuickGenerateWriting = (e, format) => {
    e?.stopPropagation();
    const newTaskId = Date.now();
    const mockContent = `基于您的案卷材料（共 ${checkedCount} 份），我为您起草了这份《${format.title}》。\n\n一、 核心诉求/主张\n（自动生成的相关诉讼请求/声明内容） \n\n二、 事实与理由\n（基于您提供的事实摘要结构化提取的事实论据，并辅以《公司法》相关法规支持）...`;

    const newConclusion = {
      id: newTaskId,
      type: '文书起草',
      title: format.title || '未命名文书',
      progress: 0,
      status: 'generating',
      sourceCount: checkedCount,
      content: mockContent
    };
    setConclusions(prev => [newConclusion, ...prev]);
    setActiveRightTab('conclusions'); 
    setShowRightPanel(true);
    setActiveProcessTaskId(newTaskId);
    closeWritingModal();
  };

  const handleGenerateWriting = () => {
    const newTaskId = Date.now();
    const lengthLabel = { concise: '精简扼要', standard: '标准适中', detailed: '详尽充分' }[writingLength];
    const toneLabel = { professional: '专业客观', firm: '严厉强硬', tactful: '委婉协商' }[writingTone];
    const mockContent = `基于您的自由起草设定（篇幅：${lengthLabel}，语气：${toneLabel}），为您生成以下文书草稿：\n\n【起草指令】：${writingPrompt}\n\n...（根据指令生成的正文内容，语气贴合您的要求）...`;
    
    const newConclusion = {
      id: newTaskId,
      type: '文书起草',
      title: '自定义起草文书',
      progress: 0,
      status: 'generating',
      sourceCount: checkedCount,
      content: mockContent
    };
    setConclusions(prev => [newConclusion, ...prev]);
    setActiveRightTab('conclusions'); 
    setShowRightPanel(true);
    setActiveProcessTaskId(newTaskId);
    closeWritingModal();
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 relative text-slate-700 bg-[#f8fafc] font-bold" onClick={() => { setSkillMenuOpen(false); setActiveSourceMenuId(null); setActiveConclusionMenuId(null); setWorkspaceMenuOpen(false); setDocMoreMenuOpen(false); setChatMoreMenuOpen(false); }}>
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-gray-100 z-50 shadow-sm">
        <div className="flex items-center text-xs">
          <span className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" onClick={onBack}> 工作空间</span>
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <div className="relative">
            <div onClick={(e) => { e.stopPropagation(); setWorkspaceMenuOpen(!workspaceMenuOpen); }} className="flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100 group cursor-pointer hover:bg-blue-100 transition-all shadow-sm">
              <span className="text-blue-600 px-1">{workspace?.title || '未命名工作空间'}</span>
              <ChevronDown size={14} className={`ml-1 text-blue-400 transition-transform ${workspaceMenuOpen ? 'rotate-180' : ''}`} />
            </div>
            {workspaceMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 p-1.5" onClick={e => e.stopPropagation()}>
                {allWorkspaces.map(ws => (
                  <div key={ws.id} onClick={() => { onSwitchWorkspace(ws); setWorkspaceMenuOpen(false); }} className={`flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all ${workspace?.id === ws.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
                    <span className="text-[13px] truncate">{ws.title}</span>
                    {workspace?.id === ws.id && <Check size={16} strokeWidth={3} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <UserProfile />
      </header>

      <div className="flex flex-grow overflow-hidden relative z-10">
        {/* --- 左侧来源面板 --- */}
        <div className={`bg-white border-r border-gray-100 flex flex-col shadow-sm transition-all duration-500 ease-in-out relative ${showLeftPanel ? (viewingSourceId ? 'w-1/2' : 'w-[320px]') : 'w-[72px]'}`}>
          {showLeftPanel ? (
            <div className="flex flex-col h-full overflow-hidden relative">
              {viewingSourceId ? (
                <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-500">
                   <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-20 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg font-bold ${activeViewingSource?.type === 'pdf' ? 'bg-red-50 text-red-600' : activeViewingSource?.type === 'url' ? 'bg-cyan-50 text-cyan-600' : activeViewingSource?.type === 'doc' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-600 text-white'}`}>
                          {activeViewingSource?.type === 'url' ? <LinkIcon size={18} strokeWidth={2.5} /> : activeViewingSource?.type === 'doc' ? <FileSignature size={18} strokeWidth={2.5} /> : <FileText size={18} strokeWidth={2.5} />}
                        </div>
                        <span className="text-[14px] font-extrabold text-slate-800 truncate max-w-[180px]">{activeViewingSource?.title}</span>
                        
                        {activeViewingSource?.type === 'url' && activeViewingSource?.originalUrl && (
                          <button 
                            onClick={(e) => handleOpenUrlInCenter(e, activeViewingSource)}
                            className="ml-1 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100 shadow-sm"
                            title="在工作台新标签页中打开网页"
                          >
                            <ExternalLink size={14} strokeWidth={2.5} />
                          </button>
                        )}

                        {activeViewingSource?.type === 'doc' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleOpenSourceAsDoc(activeViewingSource); }}
                            className="ml-1 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-100 shadow-sm"
                            title="在中央编辑器中打开修改"
                          >
                            <Edit3 size={14} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                      <button onClick={() => setViewingSourceId(null)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-xl transition-all border border-slate-100 font-bold">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider">收起预览</span>
                        <X size={16} strokeWidth={2.5} />
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
                      <div className="p-4 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 rounded-2xl border border-blue-100 shadow-inner">
                        <div className="flex items-center gap-1.5 text-blue-600 mb-3">
                          <Sparkles size={14} strokeWidth={2.5} />
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.1em]">AI 智能摘要提炼</span>
                        </div>
                        <p className="text-[12px] text-slate-600 leading-relaxed text-justify font-bold">
                          {activeViewingSource?.summary || '正在提取文档核心要点...'}
                        </p>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-slate-100" />
                            <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest">全文正文预览</span>
                            <div className="h-px flex-1 bg-slate-100" />
                         </div>
                         <div className="text-[12px] leading-[1.8] text-slate-500 whitespace-pre-wrap text-justify px-1 font-bold">
                            {activeViewingSource?.content || '该文档暂无内容预览数据数据。'}
                         </div>
                      </div>
                   </div>
                   <div className="p-4 border-t border-gray-50 bg-slate-50/30">
                      <button 
                        onClick={() => setSources(prev => prev.map(s => s.id === viewingSourceId ? {...s, checked: !s.checked} : s))}
                        className={`w-full py-3 rounded-xl text-[12px] font-extrabold transition-all ${activeViewingSource?.checked ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-200 text-slate-400 hover:border-blue-400 hover:text-blue-600'}`}
                      >
                        {activeViewingSource?.checked ? '已挂载参与分析' : '挂载到当前研判'}
                      </button>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col h-full animate-in fade-in duration-300">
                  <div className="p-5 border-b border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[11px] uppercase tracking-[0.1em] text-slate-400 font-extrabold">来源管理</h2>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all font-bold">
                      <Plus size={16} strokeWidth={3} /> <span className="text-[13px]">添加来源</span>
                    </button>
                  </div>
                  
                  <div className="px-5 py-3 border-b border-gray-100 bg-white flex items-center justify-between h-12">
                      <div className="flex items-center gap-3 font-bold">
                        <div className="flex-shrink-0 cursor-pointer" onClick={handleToggleAll}>
                           <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${allChecked || someChecked ? 'bg-blue-600 border-blue-600 shadow-sm shadow-blue-100' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                             {allChecked && <Check size={12} className="text-white" strokeWidth={4} />}
                             {someChecked && <MinusSquare size={14} className="text-white" strokeWidth={3} />}
                           </div>
                        </div>
                        <span className={`text-[13px] transition-all duration-300 ${checkedCount > 0 ? 'text-blue-600 font-extrabold' : 'text-slate-500'}`}>
                          已挂载 ({checkedCount}/{sources.length})
                        </span>
                      </div>
                      <div className="flex items-center">
                        {checkedCount > 0 && (
                          <button onClick={(e) => handleBatchDeleteTrigger(e)} className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all animate-in zoom-in-75 duration-300 border border-red-100 shadow-sm" title="批量移除选中的来源">
                            <Trash2 size={16} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                  </div>

                  <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-slate-50/10 no-scrollbar">
                    {sources.map(source => (
                      <div key={source.id} 
                        className={`p-3 rounded-2xl border transition-all relative group flex items-center justify-between 
                          ${source.status === 'parsing' ? 'border-blue-200 bg-blue-50/50' : 
                            source.checked ? 'border-blue-400 bg-white shadow-md ring-1 ring-blue-50 cursor-pointer' : 'border-transparent hover:bg-slate-100 cursor-pointer'}`}
                        onClick={() => {
                          if (source.status === 'parsing') return; 
                          setViewingSourceId(source.id);
                        }}
                      >
                         <div className="flex items-center min-w-0 flex-1">
                            <div className={`w-10 h-10 mr-3 rounded-xl flex items-center justify-center flex-shrink-0 transition-all 
                              ${source.status === 'parsing' ? 'bg-blue-100 text-blue-500' :
                                source.type === 'pdf' ? 'bg-red-50 text-red-600' : 
                                source.type === 'doc' ? 'bg-indigo-50 text-indigo-600' : 
                                source.type === 'url' ? 'bg-cyan-50 text-cyan-600' : 'bg-blue-600 text-white'} 
                              ${!source.checked && source.status !== 'parsing' ? 'opacity-40 grayscale' : 'shadow-sm'}`}>
                              {source.status === 'parsing' ? <Loader2 size={18} className="animate-spin" strokeWidth={2.5} /> :
                               source.type === 'doc' ? <FileSignature size={18} strokeWidth={2.5} /> : 
                               source.type === 'url' ? <LinkIcon size={18} strokeWidth={2.5} /> : 
                               <FileText size={18} strokeWidth={2.5} />}
                            </div>
                            <div className={`min-w-0 flex-1 font-bold ${!source.checked && source.status !== 'parsing' ? 'opacity-40' : ''}`}>
                               <p className="text-[13px] truncate text-slate-800 mb-0.5">{source.title}</p>
                               <p className={`text-[10px] ${source.status === 'parsing' ? 'text-blue-500 animate-pulse font-extrabold' : 'text-slate-400'}`}>
                                 {source.status === 'parsing' ? 'AI 正在深度解析与结构化...' : source.date}
                               </p>
                            </div>
                         </div>
                         <div className="flex items-center gap-1.5 ml-2 relative font-bold">
                            {source.status === 'parsing' ? (
                              <div className="w-5 h-5 flex items-center justify-center mr-1">
                                <Loader2 size={14} className="text-blue-400 animate-spin" strokeWidth={3} />
                              </div>
                            ) : (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); setActiveSourceMenuId(activeSourceMenuId === source.id ? null : source.id); }} className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 ${activeSourceMenuId === source.id ? 'opacity-100 bg-slate-100 text-blue-600' : ''}`}>
                                  <MoreHorizontal size={16} strokeWidth={2.5} />
                                </button>
                                {activeSourceMenuId === source.id && (
                                  <div className="absolute top-full right-8 mt-1 w-32 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[110] p-1 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                                    <button onClick={(e) => handleOpenRename(e, source, 'source')} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-[12px] flex items-center gap-2 rounded-lg transition-colors font-bold"><Edit3 size={14}/> 重命名</button>
                                    <button onClick={(e) => handleOpenDeleteDetail(e, source, 'source')} className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-500 text-[12px] flex items-center gap-2 rounded-lg transition-colors font-bold"><Trash2 size={14}/> 移除来源</button>
                                  </div>
                                )}
                                <div className="flex-shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSources(prev => prev.map(s => s.id === source.id ? {...s, checked: !s.checked} : s))}}>
                                   <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${source.checked ? 'bg-blue-600 border-blue-600' : 'border-gray-200 bg-white group-hover:border-blue-300'}`}>
                                     {source.checked && <Check size={12} className="text-white" strokeWidth={4} />}
                                   </div>
                                </div>
                              </>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full items-center py-6 gap-6">
              <button onClick={() => setIsAddModalOpen(true)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg"><Plus size={20}/></button>
              {sources.map(s => <button key={s.id} onClick={() => {setShowLeftPanel(true); setViewingSourceId(s.id);}} className="p-3 rounded-2xl bg-white shadow-sm ring-1 ring-blue-50 text-blue-600"><FileText size={20}/></button>)}
            </div>
          )}
        </div>

        {/* --- 中央研判区 / 文档编辑区 --- */}
        <div className="flex flex-col bg-[#f8fafc] relative transition-all duration-500 flex-1 min-w-0 border-x border-gray-100/50">
          
          <div className="absolute top-4 right-6 z-[60] flex items-center bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl p-1 shadow-sm hover:shadow-md hover:bg-white transition-all">
            <button onClick={() => setShowLeftPanel(!showLeftPanel)} className={`p-1.5 rounded-lg transition-all ${showLeftPanel ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`} title={showLeftPanel ? "收起来源" : "展开来源"}><PanelLeft size={18} strokeWidth={2.5} /></button>
            <div className="w-[1px] h-4 bg-gray-200 mx-1" />
            <button onClick={() => setShowRightPanel(!showRightPanel)} className={`p-1.5 rounded-lg transition-all ${showRightPanel ? 'text-blue-600 bg-blue-50 shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`} title={showRightPanel ? "收起工作台" : "展开工作台"}><PanelRight size={18} strokeWidth={2.5} /></button>
          </div>

          {openDocs.length > 0 && (
            <div className="flex px-4 pt-4 gap-1 border-b border-gray-200 flex-shrink-0 relative z-20 bg-[#f8fafc]">
              <button
                onClick={() => setActiveCenterTab('chat')}
                className={`px-5 py-2.5 text-[13px] font-bold rounded-t-xl transition-colors border border-b-0 flex items-center gap-2 flex-shrink-0 ${activeCenterTab === 'chat' ? 'bg-white text-blue-600 border-gray-200 relative z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'}`}
                style={activeCenterTab === 'chat' ? { marginBottom: '-1px' } : {}}
              >
                <MessageSquare size={14} strokeWidth={2.5}/> 对话
              </button>
              
              <div className="flex-1 min-w-0 flex gap-1 overflow-x-auto no-scrollbar pr-28">
                {openDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setActiveCenterTab(doc.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-[13px] font-bold rounded-t-xl transition-colors border border-b-0 cursor-pointer group flex-shrink-0 ${activeCenterTab === doc.id ? 'bg-white text-blue-600 border-gray-200 relative z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.02)]' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'}`}
                    style={activeCenterTab === doc.id ? { marginBottom: '-1px' } : {}}
                    title={doc.type === 'iframe' ? `网页地址: ${doc.url}` : doc.title}
                  >
                    {doc.type === 'iframe' ? <Globe size={14} strokeWidth={2.5}/> : <FileText size={14} strokeWidth={2.5}/>}
                    <span className="truncate max-w-[120px]">{doc.title}</span>
                    <button
                      onClick={(e) => handleCloseDoc(e, doc.id)}
                      className={`p-0.5 rounded-md hover:bg-gray-200 transition-colors ${activeCenterTab === doc.id ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-transparent group-hover:text-gray-400'}`}
                    >
                      <X size={14} strokeWidth={3}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            {activeCenterTab === 'chat' ? (
              <>
                <div className="flex-grow overflow-y-auto p-8 lg:px-12 flex flex-col bg-slate-50/50 backdrop-blur-sm relative">
                  
                  {messages.length === 0 ? (
                    <div className="m-auto text-center space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 font-bold">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <Sparkles size={32} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">开始对话</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">律爱多将基于您左侧挂载的案卷资料提供法律建议。</p>
                    </div>
                  ) : (
                    <div className="flex-1 w-full max-w-3xl mx-auto space-y-8 pb-4 animate-in fade-in duration-300 mt-2">
                      {messages.map(msg => {
                        if (msg.type === 'task') {
                          return null; // 隐藏系统任务提示胶囊，后续做站内信
                        }

                        return (
                          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'user' ? (
                              <div className="px-5 py-3.5 rounded-3xl rounded-tr-md max-w-[85%] font-bold text-[14px] leading-relaxed whitespace-pre-wrap bg-[#f0f0f5] text-slate-700">
                                {msg.content}
                              </div>
                            ) : (
                              <div className="w-full max-w-[95%]">
                                
                                {/* --- 新增：类 Gemini 思考过程展示模块 --- */}
                                {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                                  <div className="mb-4 bg-white/80 rounded-2xl border border-slate-200 overflow-hidden w-fit min-w-[280px] max-w-[480px] shadow-sm transition-all duration-300">
                                    <div 
                                       className="px-4 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                                       onClick={() => setExpandedThinkingMsgs(prev => ({...prev, [msg.id]: !prev[msg.id]}))}
                                    >
                                       {msg.isThinking ? <Loader2 className="animate-spin text-slate-400" size={14} strokeWidth={2.5} /> : <Check className="text-slate-400" size={14} strokeWidth={3} />}
                                       <span className={`text-[13px] font-bold text-slate-600 flex-1 truncate ${msg.isThinking && !expandedThinkingMsgs[msg.id] ? 'animate-pulse' : ''}`}>
                                          {msg.isThinking ? msg.currentThinkingProgress : '显示思路'}
                                       </span>
                                       <ChevronDown size={14} className={`text-slate-400 transition-transform ${expandedThinkingMsgs[msg.id] ? 'rotate-180' : ''}`} strokeWidth={2.5}/>
                                    </div>
                                    
                                    {/* 展开的完整思考步骤 */}
                                    {expandedThinkingMsgs[msg.id] && (
                                       <div className="px-5 pb-5 pt-3 relative border-t border-slate-100 bg-slate-50/50">
                                          <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-slate-200 z-0"></div>
                                          <div className="space-y-5 relative z-10 pt-1">
                                             {msg.thinkingSteps.map((step, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                   <div className="mt-1 flex-shrink-0 bg-slate-50 ring-4 ring-slate-50 rounded-full z-10 relative">
                                                      {step.status === 'completed' ? (
                                                         <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center"><Check size={10} className="text-slate-500" strokeWidth={3}/></div>
                                                      ) : (
                                                         <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center"><Loader2 size={10} className="text-blue-600 animate-spin" strokeWidth={3}/></div>
                                                      )}
                                                   </div>
                                                   <div className="flex flex-col">
                                                      <span className={`text-[13px] font-extrabold ${step.status === 'current' ? 'text-blue-600' : 'text-slate-700'}`}>{step.title}</span>
                                                      {step.desc && <span className="text-[12px] text-slate-500 font-medium mt-1.5 leading-relaxed text-justify">{step.desc}</span>}
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}
                                  </div>
                                )}

                                {/* --- AI 正文回复渲染 --- */}
                                {/* 在思考阶段且还没有内容时，隐藏正文的空白外框 */}
                                {(!msg.isThinking || msg.content) && (
                                  <div className={`font-medium text-[15px] leading-[1.8] whitespace-pre-wrap text-slate-800 ${msg.isThinking && !msg.content ? 'hidden' : ''}`}>
                                    {parseMessageContent(msg.content, sources, handleBadgeClick)}
                                    {msg.isTyping && !msg.isThinking && <span className="ml-1 inline-block w-2 h-4 bg-blue-500 animate-pulse align-middle rounded-full"></span>}
                                  </div>
                                )}
                                
                                {!msg.isTyping && !msg.isThinking && (
                                  <div className="mt-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => handleSaveToResults(msg.content)} className="flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all font-bold shadow-sm">
                                        <BookmarkPlus size={14} strokeWidth={2.5} />
                                        保存到结果
                                      </button>
                                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200" title="复制">
                                        <Copy size={16} strokeWidth={2.5} />
                                      </button>
                                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-transparent hover:border-slate-200" title="重新生成">
                                        <RefreshCw size={16} strokeWidth={2.5} />
                                      </button>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 pt-1">
                                      {['被告若以不知情为由抗辩，如何反驳？', '帮我基于以上策略起草一份催告函', '查询最高法相关支持判例'].map((suggestion, idx) => (
                                        <button 
                                          key={idx}
                                          onClick={() => setInputValue(suggestion)}
                                          className="px-3.5 py-1.5 rounded-full border border-blue-100 text-[12px] text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold cursor-pointer bg-blue-50/50 shadow-sm flex items-center gap-1.5 group"
                                        >
                                          <Sparkles size={12} strokeWidth={2.5} className="group-hover:text-blue-200" />
                                          {suggestion}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} className="h-4" />
                    </div>
                  )}
                </div>
                
                <div className="p-6 bg-transparent relative z-20">
                  <div className="max-w-3xl mx-auto relative">
                    {/* --- 删除了原本这里独立悬浮的过程弹窗和基于xx来源的胶囊 --- */}

                    <div 
                      className={`bg-white border rounded-[24px] shadow-2xl flex flex-col p-1.5 transition-all duration-300 relative ${isDraggingOver ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-50 scale-[1.01]' : 'border-gray-200 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-300'}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {/* --- 新增：融合进输入框容器的执行过程展示区 --- */}
                      {activeProcessTaskId && (() => {
                        const task = conclusions.find(c => c.id === activeProcessTaskId);
                        if (!task) return null;

                        const MAIN_STEPS = [
                          '初步研究与基础信息收集',
                          '争议焦点初步提取',
                          '核心事实重构与证据链交叉比对',
                          '相关法律法规检索与法理依据分析',
                          '撰写专业研判报告初稿与格式润色'
                        ];

                        let currentStepIndex = 0;
                        if (task.progress < 15) { currentStepIndex = 0; } 
                        else if (task.progress < 30) { currentStepIndex = 1; } 
                        else if (task.progress < 70) { currentStepIndex = 2; } 
                        else if (task.progress < 85) { currentStepIndex = 3; } 
                        else if (task.progress < 100) { currentStepIndex = 4; } 
                        else { currentStepIndex = 5; }

                        const isTaskCompleted = task.status === 'completed';

                        const executionLogs = [];
                        if (task.progress >= 0) executionLogs.push({ text: '初始化研判任务，分配计算资源...', type: 'info' });
                        if (task.progress >= 2) executionLogs.push({ text: '正在读取案卷资料，提取诉求与答辩...', active: task.progress < 15 });
                        if (task.progress >= 15) executionLogs.push({ text: '读取完成：已提取原告诉求与被告答辩', type: 'success' });
                        if (task.progress >= 18) executionLogs.push({ text: '正在基于诉辩双方主张，归纳争议焦点...', active: task.progress < 30 });
                        if (task.progress >= 30) {
                            executionLogs.push({ text: '提取焦点 1：被告未按期交货的行为是否构成根本违约？', type: 'info' });
                            executionLogs.push({ text: '提取焦点 2：疫情封控是否构成免责的不可抗力事由？', type: 'info' });
                        }
                        if (task.progress >= 35) executionLogs.push({ text: '启动子智能体 [证据链审查] 进行交叉比对...', active: task.progress < 70 });
                        if (task.progress >= 50) executionLogs.push({ text: '发现证据矛盾点：《通知单》日期与合同约定交货日期存在时间差', type: 'warning' });
                        if (task.progress >= 65) executionLogs.push({ text: '形成证据采信建议评述', type: 'info' });
                        if (task.progress >= 70) executionLogs.push({ text: '核心事实重构与证据链交叉比对完成', type: 'success' });
                        if (task.progress >= 72) executionLogs.push({ text: '正在检索相关法规与指导案例...', active: task.progress < 85 });
                        if (task.progress >= 85) executionLogs.push({ text: '完成法理依据分析，匹配指导案例168号', type: 'success' });
                        if (task.progress >= 88) executionLogs.push({ text: '正在组织逻辑，生成专业报告初稿与格式润色...', active: task.progress < 100 });
                        if (task.progress === 100 || isTaskCompleted) executionLogs.push({ text: '报告生成完毕', type: 'success' });

                        return (
                          <div className="w-full bg-slate-50/50 rounded-t-[20px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div className="px-5 py-3 flex items-center justify-between shrink-0">
                               <div className="flex items-center gap-3">
                                 <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                                   <Sparkles size={16} strokeWidth={2.5}/>
                                 </div>
                                 <h3 className="text-[14px] font-extrabold text-slate-800 truncate max-w-[200px] sm:max-w-sm">
                                   {task.title}
                                 </h3>
                                 {task.status === 'generating' && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse font-extrabold">执行中</span>}
                                 {task.status === 'completed' && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold">已完成</span>}
                               </div>
                               <button onClick={() => setActiveProcessTaskId(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                 <X size={16} strokeWidth={3}/>
                               </button>
                             </div>
                             
                             {/* 增加固定高度 h-[260px]，防止容器随内容无限撑开 */}
                             <div className="px-5 pb-5 pt-1 flex flex-col md:flex-row gap-6 relative h-[260px]">
                                {/* 左侧：执行步骤区改为 flex-col 且 overflow-hidden */}
                                <div className="flex-1 relative pr-2 flex flex-col overflow-hidden">
                                    <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4 shrink-0">
                                        <List size={14} className="text-slate-400" />
                                        <span>执行步骤</span>
                                    </div>
                                    {/* 步骤列表容器支持独立滚动 */}
                                    <div className="space-y-4 relative flex-1 overflow-y-auto no-scrollbar pb-2">
                                       <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-slate-100 z-0"></div>
                                       {MAIN_STEPS.map((step, idx) => {
                                          const isCompleted = idx < currentStepIndex || isTaskCompleted;
                                          const isActive = idx === currentStepIndex && !isTaskCompleted;
                                          const isPending = idx > currentStepIndex && !isTaskCompleted;
                                          return (
                                             <div key={idx} className="flex items-start gap-3 relative z-10">
                                                <div className="mt-0.5 flex-shrink-0 bg-transparent shadow-[0_0_0_4px_#f8fafc] rounded-full">
                                                   {isCompleted && <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check size={10} strokeWidth={4}/></div>}
                                                   {isActive && <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Loader2 size={10} strokeWidth={3} className="animate-spin"/></div>}
                                                   {isPending && <div className="w-5 h-5 rounded-full border-2 border-slate-200 text-slate-300 flex items-center justify-center bg-white"><Clock size={8} strokeWidth={3}/></div>}
                                                </div>
                                                <div className={`flex flex-col pt-0.5 ${isActive ? 'text-blue-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                                   <span className="text-[12px] font-extrabold leading-snug line-clamp-1">{idx + 1}. {step}</span>
                                                </div>
                                             </div>
                                          );
                                       })}
                                    </div>
                                </div>

                                {/* 右侧：执行详情区改为 h-full 占满父级高度 */}
                                <div className="flex-1 bg-[#1e293b] rounded-xl p-4 flex flex-col h-full shadow-inner relative overflow-hidden">
                                     <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2 shrink-0">
                                       <div className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                          <Cpu size={12} className="text-emerald-400" />
                                          <span>执行详情</span>
                                       </div>
                                       {(!isTaskCompleted) && <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-extrabold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> 运行中</span>}
                                     </div>
                                     
                                     {/* 终端日志列表容器独立滚动 */}
                                     <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[11px] custom-scrollbar flex flex-col pb-2 pr-1">
                                        {executionLogs.map((log, i) => (
                                           <div key={i} className={`flex items-start gap-2 animate-in fade-in slide-in-from-bottom-1 ${log.active ? 'text-emerald-400 font-bold' : log.type === 'success' ? 'text-blue-400' : log.type === 'warning' ? 'text-amber-400' : 'text-slate-400'}`}>
                                              <span className="opacity-50 select-none mt-0.5">{`>`}</span>
                                              <span className="leading-relaxed whitespace-pre-wrap flex-1">{log.text}</span>
                                              {log.active && <span className="w-1.5 h-3 bg-emerald-400 animate-pulse inline-block align-middle ml-1 mt-0.5 shrink-0"/>}
                                           </div>
                                        ))}
                                        <div className="mt-auto"></div>
                                        <div ref={consoleEndRef} />
                                     </div>
                                </div>
                             </div>

                             {(!isTaskCompleted) && (
                               <div className="h-0.5 w-full bg-slate-100 shrink-0">
                                  <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                               </div>
                             )}
                          </div>
                        );
                      })()}

                      <div className={`px-3 py-1.5 flex flex-wrap items-center gap-2 font-bold relative z-10 ${activeProcessTaskId ? 'border-t border-gray-100 pt-2' : ''}`}>
                        <div className="relative">
                          <button onClick={(e) => { e.stopPropagation(); setSkillMenuOpen(!skillMenuOpen); }} className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-xl transition-all text-[12px] font-bold ${activeChatSkill ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-gray-50 border-gray-100 text-slate-700 hover:bg-gray-100'}`}>
                            {activeChatSkill ? activeChatSkill.icon : <Zap size={12} className="text-blue-600" />}
                            <span>{activeChatSkill ? activeChatSkill.name : '技能'}</span>
                            
                            {activeChatSkill ? (
                              <span 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setSelectedSkillId(null); 
                                  setSkillMenuOpen(false);
                                }} 
                                className="p-0.5 -mr-0.5 rounded-full hover:bg-indigo-200 hover:text-indigo-700 transition-colors"
                                title="清除技能"
                              >
                                <X size={12} strokeWidth={3} />
                              </span>
                            ) : (
                              <ChevronDown size={12} className={`transition-transform duration-300 ${skillMenuOpen ? 'rotate-180' : ''}`} />
                            )}
                          </button>
                          {skillMenuOpen && (
                            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-bottom-2 p-1.5 font-bold flex flex-col max-h-72" onClick={e => e.stopPropagation()}>
                              <div className="text-[10px] text-slate-400 px-3 py-2 uppercase tracking-widest border-b border-gray-50 mb-1 font-bold flex-shrink-0">选择技能</div>
                              <div className="overflow-y-auto custom-scrollbar flex-1 space-y-0.5">
                                {installedSkills.length > 0 ? (
                                  installedSkills.map(skill => (
                                    <button 
                                      key={skill.id} 
                                      onClick={() => { setSelectedSkillId(selectedSkillId === skill.id ? null : skill.id); setSkillMenuOpen(false); }} 
                                      className={`w-full text-left px-3 py-2.5 rounded-xl text-[12px] transition-all flex items-center gap-2.5 ${selectedSkillId === skill.id ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50'}`}
                                    >
                                      <SkillMarketIconBox skill={skill} compact />
                                      <span className="font-bold flex-1">{skill.name}</span>
                                      {selectedSkillId === skill.id && <Check size={14} className="ml-auto flex-shrink-0" strokeWidth={3} />}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-3 py-4 text-center text-[12px] text-slate-400 font-medium">暂无装载的技能，请前往技能中心添加</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {tempFiles.map(file => (
                          <div key={file.id} className={`flex items-center space-x-1.5 border px-3 py-1.5 rounded-xl text-[12px] font-bold animate-in zoom-in-95 duration-200 ${file.isConclusion ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                            {file.isConclusion ? <Sparkles size={12} className="text-indigo-500" /> : <Paperclip size={12} className="text-slate-400" />}
                            <span className="truncate max-w-[120px]">{file.name}</span>
                            <button onClick={() => handleRemoveTempFile(file.id)} className={`transition-colors rounded-full p-0.5 ml-1 ${file.isConclusion ? 'text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}>
                              <X size={12} strokeWidth={3} />
                            </button>
                          </div>
                        ))}

                        {/* --- 新增：收纳到右上角的 更多操作（清空会话） 按钮 --- */}
                        <div className="ml-auto relative flex items-center">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setChatMoreMenuOpen(!chatMoreMenuOpen); }}
                             className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${chatMoreMenuOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                             title="对话操作"
                           >
                             <MoreHorizontal size={16} strokeWidth={2.5} />
                           </button>
                           
                           {chatMoreMenuOpen && (
                             <div className="absolute bottom-full mb-2 right-0 w-40 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-1.5 animate-in zoom-in-95 origin-bottom-right" onClick={e => e.stopPropagation()}>
                               <button 
                                 onClick={() => { setChatMoreMenuOpen(false); setIsClearChatModalOpen(true); }}
                                 className="w-full text-left px-3 py-2.5 hover:bg-red-50 text-[13px] flex items-center gap-2.5 rounded-xl transition-colors font-bold text-red-500"
                               >
                                 <Trash2 size={16} strokeWidth={2.5}/> 清空对话记录
                               </button>
                             </div>
                           )}
                        </div>
                      </div>
                      
                      <div className="flex items-end px-1 py-1 font-bold">
                        <div className="px-3 pb-3 text-gray-400">
                          <Paperclip onClick={handleSimulateUpload} size={18} className="cursor-pointer hover:text-blue-600 transition-colors" strokeWidth={2.5} title="上传临时附件" />
                        </div>
                        <textarea 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="flex-grow bg-transparent border-none focus:ring-0 text-[14px] py-3 px-1 outline-none text-slate-700 font-bold resize-none min-h-[44px]" 
                          placeholder={sources.filter(s => s.checked).length > 0 ? `当前基于 ${sources.filter(s => s.checked).length} 个已选来源提问... (按 Enter 发送)` : "请提问... (按 Enter 发送)"} 
                          rows={1}
                        />
                        <button 
                          onClick={handleSendMessage} 
                          disabled={isGeneratingChat || !inputValue.trim()}
                          className={`p-2.5 rounded-2xl text-white shadow-lg ml-2 transition-all font-bold ${isGeneratingChat || !inputValue.trim() ? 'bg-blue-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 active:scale-95'}`}
                        >
                          {isGeneratingChat ? <Loader2 size={18} className="animate-spin" strokeWidth={2.5} /> : <Send size={18} strokeWidth={2.5} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col bg-[#f1f5f9] relative animate-in fade-in duration-300">
                 
                 {activeDoc?.type !== 'iframe' && (
                   <>
                     <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-1 shadow-sm flex-shrink-0 relative z-10 font-bold overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1 flex-shrink-0">
                          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="撤销"><Undo size={16} strokeWidth={2.5}/></button>
                          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="重做"><Redo size={16} strokeWidth={2.5}/></button>
                        </div>
                        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1 flex-shrink-0">
                          <select className="bg-transparent text-sm text-gray-700 outline-none hover:bg-gray-100 p-1.5 rounded-lg cursor-pointer">
                            <option>正文</option>
                            <option>标题 1</option>
                            <option>标题 2</option>
                            <option>标题 3</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1 flex-shrink-0">
                          <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="加粗"><Bold size={16} strokeWidth={2.5}/></button>
                          <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="斜体"><Italic size={16} strokeWidth={2.5}/></button>
                          <button className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="下划线"><Underline size={16} strokeWidth={2.5}/></button>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors bg-gray-100" title="左对齐"><AlignLeft size={16} strokeWidth={2.5}/></button>
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="居中对齐"><AlignCenter size={16} strokeWidth={2.5}/></button>
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="右对齐"><AlignRight size={16} strokeWidth={2.5}/></button>
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ml-2" title="项目符号"><List size={16} strokeWidth={2.5}/></button>
                        </div>
                        
                        <div className="ml-auto flex items-center pl-2 border-l border-gray-200 flex-shrink-0 sticky right-0 bg-white">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDocMoreMenuOpen(!docMoreMenuOpen); }} 
                            title="更多操作" 
                            className={`flex items-center justify-center p-1.5 rounded-lg transition-colors shadow-sm ${docMoreMenuOpen ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                          >
                            <MoreHorizontal size={16} strokeWidth={2.5} className="flex-shrink-0" /> 
                          </button>
                        </div>
                     </div>
                     
                     {docMoreMenuOpen && (
                        <div className="absolute top-12 right-4 mt-1.5 w-44 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 p-1.5 font-bold" onClick={e => e.stopPropagation()}>
                           <button onClick={() => { handleSaveToSource(); setDocMoreMenuOpen(false); }} className="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors text-slate-700">
                             <BookmarkPlus size={16} className="text-blue-500" strokeWidth={2.5} /> 保存到来源
                           </button>
                           <div className="my-1 border-t border-gray-50 mx-2" />
                           <button onClick={() => setDocMoreMenuOpen(false)} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors text-slate-700">
                             <FileDown size={16} className="text-indigo-400" strokeWidth={2.5} /> 导出为 Word
                           </button>
                           <button onClick={() => setDocMoreMenuOpen(false)} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors text-slate-700">
                             <FileDown size={16} className="text-red-400" strokeWidth={2.5} /> 导出为 PDF
                           </button>
                        </div>
                     )}
                   </>
                 )}
                 
                 {activeDoc?.type === 'iframe' ? (
                   <div className="flex-1 flex flex-col bg-slate-100 p-2 overflow-hidden">
                      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
                         <iframe src={activeDoc.url} className="w-full h-full border-none bg-white" title={activeDoc.title} sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
                      </div>
                   </div>
                 ) : (
                   <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex justify-center custom-scrollbar">
                      <div 
                        className="w-full max-w-[820px] bg-white border border-gray-200 shadow-md min-h-[1100px] p-16 lg:p-20 text-[15px] leading-relaxed text-gray-800 transition-shadow focus-within:ring-4 focus-within:ring-blue-500/10 font-medium rounded-sm"
                      >
                         <h1 
                           className="text-3xl font-bold mb-6 text-gray-800 empty:before:content-['输入文档标题...'] empty:before:text-gray-300 focus:empty:before:content-[''] outline-none" 
                           contentEditable suppressContentEditableWarning 
                           onBlur={(e) => handleUpdateDoc(activeDoc.id, {title: e.target.innerText})}
                         >{activeDoc?.title}</h1>
                         <div 
                           className="empty:before:content-['在此处开始编辑文档正文，或者让 AI 帮您起草...'] empty:before:text-gray-300 focus:empty:before:content-[''] whitespace-pre-wrap outline-none min-h-[500px]" 
                           contentEditable suppressContentEditableWarning 
                           onBlur={(e) => handleUpdateDoc(activeDoc.id, {content: e.target.innerText})}
                         >{activeDoc?.content}</div>
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        </div>

        {/* --- 右侧工作台面板 --- */}
        <div className={`bg-white border-l border-gray-100 flex flex-col shadow-sm transition-all duration-500 ease-in-out font-bold ${showRightPanel ? (viewingSourceId ? 'w-1/5' : 'w-[380px]') : 'w-[72px]'}`}>
          {showRightPanel ? (
            <div className="flex flex-col h-full overflow-hidden relative">
              <div className="flex items-center bg-slate-50/50 p-1 m-4 mb-2 rounded-xl border border-gray-100 font-bold flex-shrink-0">
                <button onClick={() => setActiveRightTab('tools')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeRightTab === 'tools' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Agent 工作台</button>
                <button onClick={() => setActiveRightTab('conclusions')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeRightTab === 'conclusions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>生成结果</button>
              </div>
              
              <div className="flex-1 overflow-hidden relative flex flex-col">
                 {activeRightTab === 'tools' ? (
                    <div className="overflow-y-auto p-5 space-y-3 font-bold h-full no-scrollbar">
                       {LEGAL_AGENTS.map(agent => (
                       <button 
                         key={agent.id} 
                         onClick={() => handleAgentClick(agent.id)}
                         className={`w-full flex items-center p-4 rounded-3xl border transition-all hover:shadow-lg text-left group bg-white border-slate-100 hover:border-blue-200`}
                       >
                          <div className={`p-2.5 rounded-2xl mr-4 group-hover:scale-110 transition-transform ${agent.color.split(' ')[0]} ${agent.color.split(' ')[1]}`}>{agent.icon}</div>
                          <div className="min-w-0 flex-1 text-slate-700">
                             <p className="text-[13px] font-bold">{agent.name}</p>
                             <p className="text-[10px] text-slate-400 truncate">{agent.desc}</p>
                          </div>
                       </button>
                    ))}</div>
                 ) : (
                    <>
                      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-24 no-scrollbar">
                        {conclusions.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => handleOpenConclusion(c)} 
                            draggable={c.status === 'completed'}
                            onDragStart={(e) => handleDragStart(e, c)}
                            className={`bg-white p-4 rounded-2xl border border-gray-100 transition-all relative group ${c.status === 'completed' ? 'cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md' : c.status === 'failed' ? 'hover:border-red-300' : 'hover:border-blue-200'}`}
                          >
                            <div className="flex justify-between items-start mb-2 font-bold">
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${c.status === 'failed' ? 'bg-red-50 text-red-600' : c.type === '自定义文档' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>{c.type}</span>
                              <div className="flex items-center gap-1.5 relative">
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); setActiveConclusionMenuId(activeConclusionMenuId === c.id ? null : c.id); }}
                                   className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${activeConclusionMenuId === c.id ? 'opacity-100 bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-400'}`}
                                 >
                                   <MoreHorizontal size={14} strokeWidth={3} />
                                 </button>
                                 {c.status === 'completed' && <Check size={14} className="text-emerald-500" strokeWidth={3} />}
                                 {c.status === 'generating' && <Loader2 size={14} className="text-blue-500 animate-spin" strokeWidth={3} />}
                                 {c.status === 'pending' && <Clock size={14} className="text-slate-400" strokeWidth={3} />}
                                 {c.status === 'failed' && <AlertCircle size={14} className="text-red-500" strokeWidth={3} />}
                                 
                                 {activeConclusionMenuId === c.id && (
                                   <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[110] p-1.5 animate-in zoom-in-95 origin-top-right" onClick={e => e.stopPropagation()}>
                                      {c.status === 'completed' && (
                                         <button onClick={(e) => { e.stopPropagation(); setActiveProcessTaskId(c.id); setActiveConclusionMenuId(null); setActiveCenterTab('chat'); }} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors font-bold text-slate-700">
                                           <Cpu size={16} className="text-slate-400" strokeWidth={2.5}/> 查看执行过程
                                         </button>
                                      )}
                                      <button onClick={(e) => handleOpenRename(e, c, 'conclusion')} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors font-bold text-slate-700">
                                        <Edit3 size={16} className="text-slate-400" strokeWidth={2.5}/> 重命名
                                      </button>
                                      <button onClick={(e) => handleOpenSaveToKb(e, c)} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors font-bold text-slate-700">
                                        <BookmarkPlus size={16} className="text-slate-400" strokeWidth={2.5}/> 收录到知识库
                                      </button>
                                      <button onClick={(e) => handleSaveConclusionToSource(e, c)} className="w-full text-left px-3 py-2.5 hover:bg-slate-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors font-bold text-slate-700">
                                        <FilePlus size={16} className="text-slate-400" strokeWidth={2.5}/> 保存到来源
                                      </button>
                                      <div className="my-1 border-t border-gray-50 mx-2" />
                                      <button onClick={(e) => handleOpenDeleteDetail(e, c, 'conclusion')} className="w-full text-left px-3 py-2.5 hover:bg-red-50 text-[13px] flex items-center gap-3 rounded-xl transition-colors font-bold text-red-500 font-bold">
                                        <Trash2 size={16} strokeWidth={2.5}/> 删除
                                      </button>
                                   </div>
                                 )}
                              </div>
                            </div>
                            <h3 className="text-[13px] font-bold mt-1">{c.title}</h3>
                            
                            {c.status === 'completed' ? (
                               <div className="mt-2 flex flex-col gap-2">
                                 <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                                   {c.type !== '自定义文档' && (
                                     <span className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                       <Database size={10} className="text-blue-400" /> 基于 {c.sourceCount || 1} 个来源
                                     </span>
                                   )}
                                   <span className="flex items-center gap-1">
                                     <Clock size={10} /> {c.completedAt || '刚刚'}
                                   </span>
                                 </div>
                                 <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{c.content}</p>
                               </div>
                            ) : (
                              <div className="mt-4 space-y-2">
                                 <div className={`flex justify-between text-[10px] font-bold ${c.status === 'failed' ? 'text-red-500' : 'text-blue-600'}`}>
                                    <span>
                                      {c.status === 'generating' && '报告生成中...'}
                                      {c.status === 'pending' && '等待中...'}
                                      {c.status === 'failed' && '执行失败'}
                                    </span>
                                    <span>{c.progress}%</span>
                                 </div>
                                 <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${c.status === 'failed' ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${c.progress}%` }} />
                                 </div>
                                 {c.status === 'failed' && (
                                   <div className="pt-1.5 flex items-center justify-between">
                                     <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{c.errorMsg || '出现未知错误'}</span>
                                     <button onClick={(e) => handleRetryTask(e, c.id)} className="flex items-center gap-1 text-[10px] text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md transition-colors font-bold flex-shrink-0">
                                       <RefreshCw size={10} strokeWidth={3} /> 重试
                                     </button>
                                   </div>
                                 )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* 底部悬浮 新建文档 按钮 */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none z-10 flex justify-center">
                        <button 
                          onClick={handleCreateNewDoc}
                          className="w-[90%] py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-[0_8px_20px_rgb(0,0,0,0.06)] hover:border-blue-400 hover:text-blue-600 transition-all font-extrabold flex items-center justify-center gap-2 pointer-events-auto active:scale-95"
                        >
                          <Plus size={16} strokeWidth={3} /> 新建空白文档
                        </button>
                      </div>
                    </>
                 )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full items-center py-6 gap-6">
              <button onClick={() => { setActiveRightTab('tools'); setShowRightPanel(true); }} className={`p-3 rounded-2xl transition-all ${activeRightTab === 'tools' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}><LayoutGrid size={20} strokeWidth={2.5} /></button>
              <button onClick={() => { setActiveRightTab('conclusions'); setShowRightPanel(true); }} className={`p-3 rounded-2xl transition-all ${activeRightTab === 'conclusions' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}><Sparkles size={20} strokeWidth={2.5} /></button>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsRenameModalOpen(false)}>
          <div className="bg-white w-[480px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Edit3 size={24} strokeWidth={2.5} /></div><h3 className="text-xl font-extrabold text-slate-800">重命名</h3></div>
            <input autoFocus type="text" value={managementTitle} onChange={(e) => setManagementTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submitRename()} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
            <div className="mt-8 flex gap-3 font-bold"><button onClick={() => setIsRenameModalOpen(false)} className="flex-1 py-3.5 rounded-2xl text-gray-400 hover:bg-slate-50">取消</button><button onClick={submitRename} className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700">确认修改</button></div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsDeleteConfirmOpen(false)}>
          <div className="bg-white w-[400px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5"><Trash2 size={32} strokeWidth={2.5} /></div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">确认删除吗？</h3>
              <p className="text-sm text-gray-400 font-bold px-4">您正在操作：<span className="text-slate-600">{itemToManage?.title}</span>。<br/>删除后该资料将从本空间内移除。</p>
            </div>
            <div className="mt-8 flex flex-col gap-2 font-bold px-4 pb-2">
              <button onClick={confirmDeleteDetail} className="w-full py-4 bg-red-500 text-white rounded-2xl shadow-lg hover:bg-red-600 transition-transform">确认彻底删除</button>
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="w-full py-3.5 rounded-2xl text-gray-400 hover:bg-slate-50">我再想想</button>
            </div>
          </div>
        </div>
      )}

      {isUnsavedModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsUnsavedModalOpen(false)}>
          <div className="bg-white w-[420px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-5"><AlertCircle size={32} strokeWidth={2.5} /></div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">保存更改？</h3>
              <p className="text-[13px] text-gray-500 font-bold px-1 leading-relaxed">
                文档 <span className="text-slate-700">"{docToClose?.title}"</span> 已更改。<br/>您需要<b>保存到来源</b>才能使新内容参与最新的 AI 研判，选择<b>暂不保存</b>将仅保留草稿。
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 font-bold px-2">
              <button onClick={handleUnsavedSaveAndClose} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                 <BookmarkPlus size={18} strokeWidth={2.5} /> 保存到来源并关闭
              </button>
              <button onClick={handleUnsavedDiscardAndClose} className="w-full py-3.5 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200">
                 暂不保存 (仅保留草稿)
              </button>
              <button onClick={() => { setIsUnsavedModalOpen(false); setDocToClose(null); }} className="w-full py-2.5 text-gray-400 hover:text-gray-600 rounded-2xl transition-all">
                 取消，留在当前页
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={closeAddModal}>
          <div className={`bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 font-bold relative transition-all duration-300 ${uploadModalStep === 'search' ? 'w-[760px] h-[740px]' : 'w-[580px] min-h-[500px]'}`} onClick={e => e.stopPropagation()}>
             <button onClick={closeAddModal} className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors z-[60]" title="关闭">
               <X size={20} strokeWidth={2.5} />
             </button>

             {uploadModalStep !== 'select' && (
               <button onClick={() => setUploadModalStep('select')} className="absolute top-6 left-6 p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-colors z-[60] animate-in fade-in" title="返回上一步">
                 <ArrowLeft size={20} strokeWidth={2.5} />
               </button>
             )}

             {uploadModalStep === 'select' && (
               <div className="animate-in slide-in-from-left-4 duration-300 w-full h-full flex flex-col pt-4">
                 <div className="px-10 pt-8 pb-4 text-center mt-2 relative">
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-8">添加来源资料</h3>
                    
                    <div className="relative mb-8 text-left group">
                      <input
                        value={exploreSearchQuery}
                        onChange={(e) => setExploreSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && exploreSearchQuery.trim()) setUploadModalStep('search'); }}
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-24 text-[14px] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm font-bold outline-none group-hover:border-blue-200"
                        placeholder="检索全网、法宝数据库、个人知识库..."
                      />
                      <Search className="absolute left-4 top-[18px] text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} strokeWidth={2.5} />
                      <button 
                        onClick={() => { if(exploreSearchQuery.trim()) setUploadModalStep('search'); }}
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-5 rounded-xl text-[13px] font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-1.5"
                      >
                         检索
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="h-px flex-1 bg-slate-100"></div>
                      <span className="text-[11px] text-slate-400 font-extrabold uppercase tracking-widest">或通过以下方式导入</span>
                      <div className="h-px flex-1 bg-slate-100"></div>
                    </div>
                 </div>

                 <div className="px-10 pb-12 space-y-4">
                    <button className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left flex items-center gap-4 group font-bold">
                      <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform"><FileText size={24} className="text-blue-600" strokeWidth={2.5} /></div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[15px] text-slate-800">本地案卷上传</span>
                        <span className="text-[12px] text-slate-400 font-medium leading-relaxed">支持PDF、Word、TXT、图片，单次最多10个文件。</span>
                      </div>
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => setUploadModalStep('link')} className="flex flex-col items-center justify-center gap-2 p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-400 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group font-bold">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><LinkIcon size={20} className="text-blue-600" strokeWidth={2.5} /></div>
                         <span className="text-[13px] text-slate-600 group-hover:text-blue-600">网页链接</span>
                       </button>
                       <button onClick={() => setUploadModalStep('text')} className="flex flex-col items-center justify-center gap-2 p-5 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-400 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group font-bold">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><ClipboardList size={20} className="text-blue-600" strokeWidth={2.5} /></div>
                         <span className="text-[13px] text-slate-600 group-hover:text-blue-600">粘贴文本</span>
                       </button>
                    </div>
                 </div>
               </div>
             )}

             {uploadModalStep === 'search' && (
               <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
                  <div className="p-6 pt-8 pb-4 flex items-center justify-center font-bold shrink-0 relative">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-600 text-white rounded-xl font-bold"><Globe size={20} strokeWidth={2.5} /></div>
                      <h3 className="text-xl font-extrabold text-slate-800">检索新来源</h3>
                    </div>
                  </div>

                  <div className="px-8 pb-4 flex flex-col flex-1 overflow-hidden font-bold">
                     <div className="relative mb-5 flex-shrink-0">
                       <input
                         value={exploreSearchQuery}
                         onChange={(e) => setExploreSearchQuery(e.target.value)}
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[14px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all font-bold outline-none"
                         placeholder="检索全网、法宝数据库、个人知识库..."
                       />
                       <Search className="absolute left-4 top-4 text-slate-400" size={20} strokeWidth={2.5} />
                     </div>

                     <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar shrink-0 pb-1">
                       {EXPLORE_CATEGORIES.map(cat => (
                         <button
                           key={cat.id}
                           onClick={() => setActiveCategory(cat.id)}
                           className={`px-4 py-2 rounded-xl text-[13px] font-extrabold whitespace-nowrap transition-all border ${activeCategory === cat.id ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50 hover:text-slate-700'}`}
                         >
                           {cat.label}
                         </button>
                       ))}
                     </div>

                     <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                        {filteredCandidates.map(m => (
                          <div key={m.id} onClick={() => toggleCandidate(m.id)} className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all group border ${selectedCandidateIds.includes(m.id) ? 'border-blue-400 bg-blue-50/50 shadow-sm ring-1 ring-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white hover:shadow-sm'}`}>
                             <div className="flex items-center gap-4">
                               <div className={`p-2.5 rounded-xl transition-colors ${selectedCandidateIds.includes(m.id) ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                                 {m.type === 'fb' ? <Database size={18} strokeWidth={2.5} /> : m.type === 'url' ? <LinkIcon size={18} strokeWidth={2.5} /> : <FileText size={18} strokeWidth={2.5} />}
                               </div>
                               <div className="flex flex-col gap-1">
                                 <p className={`text-[14px] font-extrabold transition-colors ${selectedCandidateIds.includes(m.id) ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}`}>{m.title}</p>
                                 <div className="flex items-center gap-2">
                                   <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wider">{m.category || m.detail?.split('·')[0] || '默认'}</span>
                                   <span className="text-[11px] text-slate-400 font-bold">{m.detail}</span>
                                 </div>
                               </div>
                             </div>
                             <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedCandidateIds.includes(m.id) ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-200 scale-110' : 'border-slate-200 bg-white group-hover:border-blue-300'}`}>
                               {selectedCandidateIds.includes(m.id) && <Check size={14} className="text-white" strokeWidth={4} />}
                             </div>
                          </div>
                        ))}
                        {filteredCandidates.length === 0 && (
                          <div className="text-center py-10 text-slate-400 text-[13px] font-bold flex flex-col items-center gap-2">
                            <Search size={32} className="text-slate-200" />
                            该分类下暂无相关资料
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-slate-50 flex items-center justify-between flex-shrink-0 font-bold">
                    <span className="text-[13px] text-slate-500">{selectedCandidateIds.length > 0 ? `已选中 ${selectedCandidateIds.length} 项资料` : '请选择需要挂载的资料'}</span>
                    <div className="flex gap-3">
                      <button onClick={closeAddModal} className="px-6 py-2.5 rounded-xl text-slate-500 hover:bg-white border border-transparent hover:border-slate-200 transition-all font-bold">取消</button>
                      <button onClick={handleAddSelectedCandidates} disabled={selectedCandidateIds.length === 0} className={`px-8 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg flex items-center gap-2 ${selectedCandidateIds.length > 0 ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 active:scale-95' : 'bg-slate-300 text-slate-100 cursor-not-allowed shadow-none'}`}>
                        <Plus size={18} strokeWidth={3} /> 添加到来源 {selectedCandidateIds.length > 0 && `(${selectedCandidateIds.length})`}
                      </button>
                    </div>
                  </div>
               </div>
             )}

             {(uploadModalStep === 'link' || uploadModalStep === 'text') && (
               <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
                 <div className="px-10 pt-12 pb-6 text-center mt-2">
                   <div className="flex justify-center mb-5">
                     <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                       {uploadModalStep === 'link' ? <LinkIcon size={30} strokeWidth={2.5} /> : <ClipboardList size={30} strokeWidth={2.5} />}
                     </div>
                   </div>
                   <h3 className="text-2xl font-extrabold text-slate-800">
                     {uploadModalStep === 'link' ? '添加网页链接' : '粘贴文本'}
                   </h3>
                   <p className="text-[13px] text-slate-400 mt-2 font-medium">
                     {uploadModalStep === 'link' ? '请输入以 http:// 或 https:// 开头的有效网址' : '直接将大段文本或文章内容粘贴至下方'}
                   </p>
                 </div>
                 
                 <div className="px-10 pb-10 flex-1 flex flex-col">
                   {uploadModalStep === 'link' ? (
                     <input
                       autoFocus
                       type="url"
                       value={uploadLink}
                       onChange={(e) => setUploadLink(e.target.value)}
                       placeholder="https://"
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all"
                     />
                   ) : (
                     <textarea
                       autoFocus
                       value={uploadText}
                       onChange={(e) => setUploadText(e.target.value)}
                       placeholder="在此处粘贴文本内容..."
                       className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-[14px] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all resize-none min-h-[160px]"
                     />
                   )}

                   <div className="mt-8 flex justify-end">
                     <button
                       onClick={handleAddSource}
                       disabled={uploadModalStep === 'link' ? !uploadLink.trim() : !uploadText.trim()}
                       className={`px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${(uploadModalStep === 'link' ? uploadLink.trim() : uploadText.trim()) ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                     >
                       <Plus size={18} strokeWidth={3} /> 添加到来源
                     </button>
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={closeReportModal}>
          <div className="bg-white w-[960px] max-h-[85vh] h-[800px] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
               <div className="flex items-center gap-3">
                  {reportModalStep === 'config' && (
                    <button onClick={() => setReportModalStep('select')} className="p-1.5 -ml-2 mr-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"><ArrowLeft size={20} strokeWidth={2.5}/></button>
                  )}
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Sparkles size={24} strokeWidth={2.5} /></div>
                  <h3 className="text-xl font-extrabold text-slate-800">创建报告</h3>
               </div>
               <button onClick={closeReportModal} className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"><X size={20} /></button>
             </div>
             
             {reportModalStep === 'select' ? (
               <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white animate-in fade-in duration-300">
                 <div className="mb-10">
                    <h4 className="text-[16px] font-extrabold text-slate-800 mb-5">格式</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                       <div onClick={(e) => handleSelectReportFormat(e, PRESET_REPORT_FORMATS.custom)} className="bg-slate-50 p-5 rounded-2xl cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-slate-100 hover:border-blue-300 group relative flex flex-col h-full">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shadow-sm mb-4"><Settings size={20} strokeWidth={2.5} /></div>
                          <h5 className="text-[15px] font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">自制格式</h5>
                          <p className="text-[13px] text-slate-500 leading-relaxed font-medium mt-auto">通过指定结构、风格、语气等方面，按照自己的方式制作报告</p>
                       </div>
                       <div onClick={(e) => handleQuickGenerate(e, PRESET_REPORT_FORMATS.caseAnalysis)} className="bg-slate-50 p-5 rounded-2xl cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-slate-100 hover:border-blue-300 group relative flex flex-col h-full">
                          <div onClick={(e) => handleSelectReportFormat(e, PRESET_REPORT_FORMATS.caseAnalysis)} className="absolute top-5 right-5 p-1.5 bg-slate-100 text-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:!bg-blue-100 hover:!text-blue-600 z-10"><Edit3 size={14} strokeWidth={2.5} /></div>
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors shadow-sm mb-4"><FileText size={20} strokeWidth={2.5} /></div>
                          <h5 className="text-[15px] font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">案情分析报告</h5>
                          <p className="text-[13px] text-slate-500 leading-relaxed font-medium mt-auto">{PRESET_REPORT_FORMATS.caseAnalysis.desc}</p>
                       </div>
                    </div>
                 </div>

                 <div>
                    <div className="flex items-center gap-2 mb-5">
                       <Wand2 size={18} className="text-blue-600" strokeWidth={2.5}/>
                       <h4 className="text-[16px] font-extrabold text-slate-800">建议的格式</h4>
                       {isGeneratingSuggestions && (
                         <span className="text-[12px] text-blue-500 font-bold ml-2 flex items-center gap-1.5 animate-pulse bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50">
                           <Loader2 size={12} className="animate-spin" /> AI 正在深度分析案卷以推荐合适模板...
                         </span>
                       )}
                    </div>
                    
                    {isGeneratingSuggestions ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(idx => (
                          <div key={`skeleton-${idx}`} className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 flex flex-col h-full min-h-[160px]">
                             <div className="w-3/4 h-4 bg-slate-200/80 rounded-md mb-4 animate-pulse mt-1"></div>
                             <div className="space-y-3 mt-auto mb-1">
                                <div className="w-full h-2.5 bg-slate-200/60 rounded animate-pulse"></div>
                                <div className="w-5/6 h-2.5 bg-slate-200/60 rounded animate-pulse"></div>
                                <div className="w-4/6 h-2.5 bg-slate-200/60 rounded animate-pulse"></div>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-500">
                         {SUGGESTED_REPORT_FORMATS.map(fmt => (
                           <div key={fmt.id} onClick={(e) => handleQuickGenerate(e, fmt)} className="bg-slate-50 p-5 rounded-2xl cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-slate-100 hover:border-blue-300 group relative flex flex-col h-full">
                              <div onClick={(e) => handleSelectReportFormat(e, fmt)} className="absolute top-5 right-5 p-1.5 bg-slate-100 text-slate-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:!bg-blue-100 hover:!text-blue-600 z-10"><Edit3 size={14} strokeWidth={2.5} /></div>
                              <h5 className="text-[15px] font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors pr-6">{fmt.title}</h5>
                              <p className="text-[13px] text-slate-500 leading-relaxed font-medium mt-auto">{fmt.desc}</p>
                           </div>
                         ))}
                      </div>
                    )}
                 </div>
               </div>
             ) : (
               <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white flex flex-col relative animate-in slide-in-from-right-8 duration-300">
                 {selectedReportFormat?.id !== 'custom' && (
                   <div className="bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100 flex-shrink-0">
                      <h4 className="text-[16px] font-bold text-slate-800 mb-2">{selectedReportFormat?.title}</h4>
                      <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{selectedReportFormat?.desc}</p>
                   </div>
                 )}

                 <div className="flex-1 flex flex-col min-h-0">
                    <h4 className="text-[15px] font-bold text-slate-800 mb-3">请描述您要创建什么样的报告</h4>
                    <textarea
                      value={reportPrompt}
                      onChange={(e) => setReportPrompt(e.target.value)}
                      placeholder="请在此处输入生成报告的要求"
                      className="w-full flex-1 bg-white border border-slate-200 rounded-2xl p-5 text-[14px] text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 resize-none font-medium leading-relaxed min-h-[200px] transition-all"
                    />
                 </div>

                 <div className="mt-8 flex justify-end flex-shrink-0">
                    <button
                       onClick={handleGenerateReport}
                       disabled={!reportPrompt.trim()}
                       className={`px-10 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${reportPrompt.trim() ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                    >
                       生成报告
                    </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      {isWritingModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={closeWritingModal}>
          <div className="bg-white w-[960px] max-h-[85vh] h-[800px] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
               <div className="flex items-center gap-3">
                  {writingModalStep === 'config' && (
                    <button onClick={() => setWritingModalStep('select')} className="p-1.5 -ml-2 mr-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors"><ArrowLeft size={20} strokeWidth={2.5}/></button>
                  )}
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><FileSignature size={24} strokeWidth={2.5} /></div>
                  <h3 className="text-xl font-extrabold text-slate-800">起草文书</h3>
               </div>
               <button onClick={closeWritingModal} className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"><X size={20} /></button>
             </div>
             
             {writingModalStep === 'select' ? (
               <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white animate-in fade-in duration-300">
                 <div className="mb-10">
                    <div className="flex items-center justify-between mb-5">
                       <h4 className="text-[16px] font-extrabold text-slate-800">我的格式 / 模板</h4>
                       <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50 transition-all text-[12px] font-bold shadow-sm">
                         <Plus size={14} strokeWidth={2.5} /> 创建模板
                       </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {MY_WRITING_TEMPLATES.map(fmt => (
                         <div 
                           key={fmt.id} 
                           onClick={(e) => fmt.id === 'free_write' ? handleSelectWritingFormat(e, fmt) : handleQuickGenerateWriting(e, fmt)} 
                           className="bg-slate-50 p-5 rounded-2xl cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-slate-100 hover:border-purple-300 group relative flex flex-col h-full"
                         >
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors shadow-sm mb-4">{fmt.icon}</div>
                            <h5 className="text-[15px] font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{fmt.title}</h5>
                            <p className="text-[13px] text-slate-500 leading-relaxed font-medium mt-auto">{fmt.desc}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div>
                    <div className="flex items-center gap-2 mb-5">
                       <Wand2 size={18} className="text-purple-600" strokeWidth={2.5}/>
                       <h4 className="text-[16px] font-extrabold text-slate-800">建议的文书类型</h4>
                       {isGeneratingWritingSuggestions && (
                         <span className="text-[12px] text-purple-500 font-bold ml-2 flex items-center gap-1.5 animate-pulse bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/50">
                           <Loader2 size={12} className="animate-spin" /> AI 正在深度分析案卷以推荐合适文书...
                         </span>
                       )}
                    </div>
                    
                    {isGeneratingWritingSuggestions ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(idx => (
                          <div key={`skeleton-${idx}`} className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50 flex flex-col h-full min-h-[160px]">
                             <div className="w-3/4 h-4 bg-slate-200/80 rounded-md mb-4 animate-pulse mt-1"></div>
                             <div className="space-y-3 mt-auto mb-1">
                                <div className="w-full h-2.5 bg-slate-200/60 rounded animate-pulse"></div>
                                <div className="w-5/6 h-2.5 bg-slate-200/60 rounded animate-pulse"></div>
                                <div className="w-4/6 h-2.5 bg-slate-200/60 rounded animate-pulse"></div>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-500">
                         {SUGGESTED_WRITING_FORMATS.map(fmt => (
                           <div key={fmt.id} onClick={(e) => handleQuickGenerateWriting(e, fmt)} className="bg-slate-50 p-5 rounded-2xl cursor-pointer hover:bg-white hover:shadow-xl transition-all border border-slate-100 hover:border-purple-300 group relative flex flex-col h-full">
                              <h5 className="text-[15px] font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors pr-6">{fmt.title}</h5>
                              <p className="text-[13px] text-slate-500 leading-relaxed font-medium mt-auto">{fmt.desc}</p>
                           </div>
                         ))}
                      </div>
                    )}
                 </div>

                 {/* 全量预置文书模板区 */}
                 <div className="mt-12 pt-10 border-t border-slate-100/80">
                    <div className="flex items-center gap-2 mb-6">
                       <LayoutTemplate size={18} className="text-slate-400" strokeWidth={2.5}/>
                       <h4 className="text-[16px] font-extrabold text-slate-800">全量预置文书模板</h4>
                    </div>
                    
                    <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
                      {ALL_WRITING_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveTemplateCategory(cat)}
                          className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border ${activeTemplateCategory === cat ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {ALL_WRITING_TEMPLATES.filter(t => t.category === activeTemplateCategory).map(fmt => (
                         <div 
                           key={fmt.id} 
                           onClick={(e) => handleQuickGenerateWriting(e, fmt)} 
                           className="bg-white p-5 rounded-2xl cursor-pointer hover:shadow-xl transition-all border border-slate-200 hover:border-purple-300 group relative flex flex-col h-full"
                         >
                            <h5 className="text-[14px] font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors pr-6">{fmt.title}</h5>
                            <p className="text-[12px] text-slate-500 leading-relaxed font-medium mt-auto">{fmt.desc}</p>
                         </div>
                      ))}
                    </div>
                 </div>
               </div>
             ) : (
               <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white flex flex-col relative animate-in slide-in-from-right-8 duration-300">
                 <div className="flex-1 flex flex-col min-h-0 mb-8">
                    <h4 className="text-[15px] font-bold text-slate-800 mb-3">请输入具体的文书写作指令与要求</h4>
                    <textarea
                      value={writingPrompt}
                      onChange={(e) => setWritingPrompt(e.target.value)}
                      placeholder="例如：请帮我起草一份关于原告张某某诉被告李某某股权转让纠纷案的催告函，要求被告于5日内完成工商变更登记，否则将追究违约责任..."
                      className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-[14px] text-slate-700 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 resize-none font-medium leading-relaxed min-h-[200px] transition-all bg-white"
                    />
                 </div>

                 <div className="flex gap-8 mb-8 flex-shrink-0">
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold text-slate-800 mb-3">设定篇幅</h4>
                      <div className="flex gap-2">
                        {[{ id: 'concise', label: '精简扼要' }, { id: 'standard', label: '标准适中' }, { id: 'detailed', label: '详尽充分' }].map(opt => (
                          <button 
                            key={opt.id}
                            onClick={() => setWritingLength(opt.id)}
                            className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border flex-1 ${writingLength === opt.id ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold text-slate-800 mb-3">设定语气</h4>
                      <div className="flex gap-2">
                        {[{ id: 'professional', label: '专业客观' }, { id: 'firm', label: '严厉强硬' }, { id: 'tactful', label: '委婉协商' }].map(opt => (
                          <button 
                            key={opt.id}
                            onClick={() => setWritingTone(opt.id)}
                            className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all border flex-1 ${writingTone === opt.id ? 'bg-purple-50 text-purple-600 border-purple-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>

                 <div className="flex justify-end flex-shrink-0 pt-4 border-t border-slate-100">
                    <button
                       onClick={handleGenerateWriting}
                       disabled={!writingPrompt.trim()}
                       className={`px-10 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${writingPrompt.trim() ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                    >
                       开始起草
                    </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}

      {isClearChatModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsClearChatModalOpen(false)}>
          <div className="bg-white w-[400px] rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
                <Trash2 size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">清空对话记录？</h3>
              <p className="text-[13px] text-gray-500 font-bold px-2 leading-relaxed">
                确定清空当前对话记录吗？未保存的内容将被清除且无法恢复。
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 font-bold px-2">
              <button 
                onClick={() => {
                  setMessages([]); 
                  setIsClearChatModalOpen(false);
                }} 
                className="w-full py-3.5 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
              >
                 确认清空
              </button>
              <button onClick={() => setIsClearChatModalOpen(false)} className="w-full py-2.5 text-gray-400 hover:text-gray-600 rounded-2xl transition-all">
                 取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 新增：收录到知识库弹窗 --- */}
      {isSaveToKbModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setIsSaveToKbModalOpen(false)}>
          <div className="bg-white w-[480px] max-h-[85vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 font-bold" onClick={e => e.stopPropagation()}>
             <div className="p-6 border-b border-gray-100 flex items-center justify-between font-bold shrink-0">
               <div className="flex items-center space-x-3">
                 <div className="p-2 bg-indigo-600 text-white rounded-xl font-bold"><Database size={20} strokeWidth={2.5} /></div>
                 <h3 className="text-lg font-extrabold text-slate-800">收录到知识库</h3>
               </div>
               <button onClick={() => setIsSaveToKbModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={20} strokeWidth={2.5} /></button>
             </div>

             <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-3">
                {MOCK_KNOWLEDGE_BASES.map(kb => (
                  <div key={kb.id} onClick={() => toggleKbSelection(kb.id)} className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all group border ${selectedKbIds.includes(kb.id) ? 'border-indigo-400 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-50' : 'border-slate-100 hover:border-indigo-200 bg-white hover:shadow-sm'}`}>
                     <div className="flex items-center gap-4">
                       <div className={`p-2.5 rounded-xl transition-colors ${selectedKbIds.includes(kb.id) ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                         <Database size={18} strokeWidth={2.5} />
                       </div>
                       <p className={`text-[15px] font-extrabold transition-colors ${selectedKbIds.includes(kb.id) ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>{kb.title}</p>
                     </div>
                     <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedKbIds.includes(kb.id) ? 'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-200 scale-110' : 'border-slate-200 bg-white group-hover:border-indigo-300'}`}>
                       {selectedKbIds.includes(kb.id) && <Check size={14} className="text-white" strokeWidth={4} />}
                     </div>
                  </div>
                ))}
             </div>

             <div className="p-6 border-t border-gray-100 bg-slate-50 flex items-center justify-between flex-shrink-0 font-bold">
               <span className="text-[13px] text-slate-500">{selectedKbIds.length > 0 ? `已选中 ${selectedKbIds.length} 个知识库` : '请选择目标知识库'}</span>
               <div className="flex gap-3">
                 <button onClick={() => setIsSaveToKbModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-500 hover:bg-white border border-transparent hover:border-slate-200 transition-all font-bold">取消</button>
                 <button onClick={confirmSaveToKb} disabled={selectedKbIds.length === 0} className={`px-8 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg flex items-center gap-2 ${selectedKbIds.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 active:scale-95' : 'bg-slate-300 text-slate-100 cursor-not-allowed shadow-none'}`}>
                   <BookmarkPlus size={18} strokeWidth={3} /> 收录 {selectedKbIds.length > 0 && `(${selectedKbIds.length})`}
                 </button>
               </div>
             </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default App;