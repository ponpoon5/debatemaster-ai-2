import{T as s}from"./vendor-DW66a48r.js";import{j as e,r as h,z as V,R as oe,L as Tt,A as wt}from"./react-vendor-DLdk58NU.js";import{M as We,B as ye,T as Ne,S as vt,a as je,U as me,G as He,b as J,Z as Me,c as St,L as et,d as Qe,C as $e,e as Te,f as _e,P as It,g as Et,h as U,i as Rt,A as tt,j as he,k as ze,W as be,l as Ct,X as ee,H as At,m as Pe,n as we,o as kt,p as Ot,D as Le,R as Gt,q as st,r as rt,s as Bt,F as Mt,t as ge,u as at,v as nt,w as $t,x as _t,y as Lt,z as zt}from"./lucide-icons-BgbkIPPx.js";var ae=(t=>(t.EASY="EASY",t.NORMAL="NORMAL",t.HARD="HARD",t.EXTREME="EXTREME",t))(ae||{}),v=(t=>(t.DEBATE="DEBATE",t.STUDY="STUDY",t.TRAINING="TRAINING",t.DRILL="DRILL",t.FACILITATION="FACILITATION",t.THINKING_GYM="THINKING_GYM",t.STORY="STORY",t.DEMO="DEMO",t.TEXTBOOK="TEXTBOOK",t.MINIGAME="MINIGAME",t))(v||{}),q=(t=>(t.POLICY="POLICY",t.FACT="FACT",t.VALUE="VALUE",t))(q||{}),A=(t=>(t.CLAIM="CLAIM",t.EVIDENCE="EVIDENCE",t.REBUTTAL="REBUTTAL",t.DEFENSE="DEFENSE",t.FALLACY="FALLACY",t.FRAMING="FRAMING",t.CONCESSION="CONCESSION",t.SYNTHESIS="SYNTHESIS",t))(A||{}),I=(t=>(t.MECE="MECE",t.FIVE_WHYS="FIVE_WHYS",t.SWOT="SWOT",t.PEST="PEST",t.LOGIC_TREE="LOGIC_TREE",t.META_COGNITION="META_COGNITION",t))(I||{}),_=(t=>(t.EVIDENCE_FILL="EVIDENCE_FILL",t.FALLACY_QUIZ="FALLACY_QUIZ",t.ISSUE_PUZZLE="ISSUE_PUZZLE",t.COMBO_REBUTTAL="COMBO_REBUTTAL",t.FERMI_ESTIMATION="FERMI_ESTIMATION",t.LATERAL_THINKING="LATERAL_THINKING",t.ACTIVE_INOCULATION="ACTIVE_INOCULATION",t))(_||{});const cr=4,dr="vv3.4.1",ur="debate_archives";var F=(t=>(t.NETWORK_ERROR="NETWORK_ERROR",t.TIMEOUT="TIMEOUT",t.QUOTA_EXCEEDED="QUOTA_EXCEEDED",t.SERVICE_UNAVAILABLE="SERVICE_UNAVAILABLE",t.PARSE_ERROR="PARSE_ERROR",t.VALIDATION_ERROR="VALIDATION_ERROR",t.UNKNOWN="UNKNOWN",t))(F||{});const ne=({children:t,variant:r="primary",fullWidth:a=!1,size:o="md",className:n="",...l})=>{const i="rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 inline-flex items-center justify-center",c={primary:"bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-md hover:shadow-lg",secondary:"bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",danger:"bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-md",ghost:"bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"},d={sm:"px-3 py-1.5 text-sm",md:"px-4 py-2 text-base",lg:"px-6 py-3 text-lg"},x=a?"w-full":"";return e.jsx("button",{className:`${i} ${c[r]} ${d[o]} ${x} ${n}`,...l,children:t})},k=t=>t?t.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi,"").replace(/^\s*THINK:[\s\S]*?(?:\n\n|$)/gim,"").replace(/^\s*Thinking:[\s\S]*?(?:\n\n|$)/gim,"").replace(/^\s*Thinking Process:[\s\S]*?(?:\n\n|$)/gim,"").replace(/^\s*Thinking\.\.\.[\s\S]*?(?:\n\n|$)/gim,"").replace(/\*\*/g,"").trim():"",E="gemini-2.5-flash",Pt=!0,Z="";async function*Ft(t){const r=new TextDecoder;try{for(;;){const{done:a,value:o}=await t.read();if(a)break;const l=r.decode(o).split(`
`);for(const i of l)if(i.startsWith("data: ")){const c=i.slice(6);if(c==="[DONE]")return;let d;try{d=JSON.parse(c)}catch(x){console.warn("Failed to parse SSE chunk:",c,x);continue}if(d.error)throw new Error(d.message||"Stream error");yield d}}}finally{t.releaseLock()}}async function Jt(t,r){var n;const a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!a.ok){const l=await a.json();throw new Error(l.message||"Failed to start stream")}const o=(n=a.body)==null?void 0:n.getReader();if(!o)throw new Error("No reader available from response body");return o}async function*ot(t,r){const a=await Jt(t,r);yield*Ft(a)}class qt{async generateContent(r){const{model:a,contents:o,config:n}=r,l=await fetch(`${Z}/api/gemini/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:a,contents:o,config:n})});if(!l.ok){const c=await l.json();throw new Error(c.message||"Proxy request failed")}const i=await l.json();return{text:i.text,usageMetadata:i.usageMetadata,candidates:i.candidates,response:{text:()=>i.text,usageMetadata:i.usageMetadata,candidates:i.candidates}}}async*generateContentStream(r){const{model:a,contents:o,config:n}=r;yield*ot(`${Z}/api/gemini/generate-stream`,{model:a,contents:o,config:n})}}class Ut{constructor(){this.directClient=null,this.proxyClient=null,this.proxyClient=new qt}async generateContent(r){if(this.proxyClient)return await this.proxyClient.generateContent(r);if(this.directClient)return await this.directClient.models.generateContent(r);throw new Error("No client available")}async generateContentStream(r){if(this.proxyClient)return this.proxyClient.generateContentStream(r);if(this.directClient)return this.directClient.models.generateContentStream(r);throw new Error("No client available")}}class Dt{constructor(r){this.wrapper=r}create(r){var o;return this.wrapper.getGenerativeModel({model:r.model}).startChat({history:r.history,systemInstruction:(o=r.config)==null?void 0:o.systemInstruction,generationConfig:r.config})}}class Yt{constructor(){console.log("🔧 AIClientWrapper constructor called"),this.models=new Ut,this.chats=new Dt(this),console.log("🔧 chats initialized:",!!this.chats)}getGenerativeModel(r){return{generateContent:async a=>{const o=await fetch(`${Z}/api/gemini/generate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:r.model,contents:a.contents,config:a.generationConfig||a.config})});if(!o.ok){const l=await o.json();throw new Error(l.message||"Proxy request failed")}const n=await o.json();return{text:n.text,usageMetadata:n.usageMetadata,response:{text:()=>n.text,usageMetadata:n.usageMetadata}}},startChat:a=>{let o=a.history||[];return{sendMessage:async n=>{const l=await fetch(`${Z}/api/gemini/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:r.model,history:o,message:n.message,config:a.generationConfig})});if(!l.ok){const c=await l.json();throw new Error(c.message||"Chat request failed")}const i=await l.json();return o=[...o,{role:"user",parts:[{text:n.message}]},{role:"model",parts:[{text:i.text}]}],{text:i.text,usageMetadata:i.usageMetadata,response:{text:()=>i.text,usageMetadata:i.usageMetadata}}},sendMessageStream:async n=>{var x;const l=await fetch(`${Z}/api/gemini/chat-stream`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:r.model,history:o,message:n.message,config:a.generationConfig})});if(!l.ok){const b=await l.json();throw new Error(b.message||"Chat stream failed")}const i=(x=l.body)==null?void 0:x.getReader();if(!i)throw new Error("No reader available");const c=new TextDecoder;async function*d(){let b="";try{for(;;){const{done:g,value:y}=await i.read();if(g)break;const N=c.decode(y).split(`
`);for(const j of N)if(j.startsWith("data: ")){const u=j.slice(6);if(u==="[DONE]"){b&&(o=[...o,{role:"user",parts:[{text:n.message}]},{role:"model",parts:[{text:b}]}]);return}try{const p=JSON.parse(u);if(p.error)throw new Error(p.message||"Stream error");const S=p.text||"";b+=S,yield{text:S,usageMetadata:p.usageMetadata}}catch{}}}b&&!o.some(g=>g.role==="model"&&g.parts[0].text===b)&&(o=[...o,{role:"user",parts:[{text:n.message}]},{role:"model",parts:[{text:b}]}])}finally{i.releaseLock()}}return d()}}}}}}const G=new Yt;console.log("🔧 AI Client Mode:","PROXY");console.log("🔧 API_KEY exists:",!0);console.log("🔧 PROXY_URL:",Z);const Y=`
  【出力形式の絶対ルール（全難易度共通）】
  1. **出力言語**: 全ての出力は**必ず日本語**で記述してください。英語や他の言語は一切使用しないでください。
  2. 出力は「ユーザーへの返答」のみを行ってください。
  3. <think>タグ、思考プロセス、内部分析、独り言などは**一切出力しないでください**。これらは内部で完結させ、出力には含めないでください。
  4. "THINK:" や "Thinking Process:" といったヘッダーも出力しないでください。
  5. 太字(**)や見出し(#)などのMarkdown装飾は**絶対に使用せず**、プレーンテキストで出力してください。強調したい場合は「」やかぎ括弧を使用してください。
`,Wt=t=>`あなたは「ディベート実況・解説AI」です。
      ユーザーは議論に参加せず、あなたが生成する2人の熟練ディベーター（肯定側・Alice と 否定側・Bob）の対話を見て学習します。
      
      【テーマ: ${t}】
      
      【役割設定】
      1. 肯定側 (PRO): Alice
         - 論理的かつ情熱的。明確なエビデンスに基づき、現状変革を訴える。
      2. 否定側 (CON): Bob
         - 冷静沈着。現実的なコストやリスク、倫理的な懸念を指摘し、現状維持または別案を支持する。
      
      【タスク】
      ユーザーから「次のターンへ」という合図が送られます。
      そのたびに、議論の流れに沿って「どちらか一方の発言」を1ターン分だけ出力してください。
      また、その発言に対する「教育的な解説（Analysis）」をセットで出力してください。
      
      【重要: 出力フォーマット】
      **必ず以下のJSON形式のみ**を出力してください。Markdownのコードブロック（\`\`\`json）は含めないでください。

      {
        "speaker": "PRO", // または "CON"
        "speakerName": "Alice", // または "Bob"
        "text": "発言内容（150文字程度。具体的かつ論理的に）",
        "analysis": {
          "type": "LOGIC", // LOGIC(論理構成), FALLACY(誤謬指摘), RHETORIC(修辞法), STRATEGY(戦略)
          "highlight": "短い見出し（例：ストローマンの回避、三段論法）",
          "comment": "学習者向けの解説（なぜこの発言が良いのか、またはどのような意図があるのか）",
          "score": 9 // この発言の質（1-10）
        }
      }

      【進行のガイドライン】
      - 初回は必ず肯定側（Alice）の立論から始めてください。
      - 次のターンは否定側、その次は肯定側...と交互に行ってください。
      - 互いに相手の主張を正しく理解し、噛み合った議論を展開してください（水掛け論にしない）。
      - 模範演技ですので、論理的誤謬（Fallacy）は含めない、あるいは含めた場合はanalysisで指摘してください。

      ${Y}（ただしJSON形式を優先する）`,Ht=t=>{const r=t.stakeholders.map(a=>`- [${a.name}] (${a.role}): ${a.standpoint}`).join(`
`);return`あなたはGame Master(GM)兼、この物語の全ての登場人物（NPC）です。
      
      【シナリオ概要】
      世界観: ${t.worldSetting}
      現在の問題: ${t.currentProblem}
      
      【ユーザーの役割】
      役職: ${t.userRole.title}
      任務: ${t.userRole.mission}
      
      【登場人物（あなたが演じる役割）】
      ${r}
      
      【あなたの振る舞い】
      1. ユーザーは意思決定者として振る舞います。あなたはNPCとして、それぞれの立場から意見、懸念、要求をぶつけてください。
      2. 議論の進行に応じて、ランダムイベント（急な状況変化、ニュース速報、新たな問題の発生など）を発生させてください。
         イベント発生時は、行頭に [EVENT] タグをつけて状況描写を行ってください。
         例: [EVENT] 緊急速報です。隣国が国境を閉鎖しました。
      3. NPCが発言する際は、必ず行頭に [名前] タグをつけてください。
         例: [保健省] 医療崩壊が目前です！
      4. ユーザーが最終的な意思決定を下すまで、対立構造を維持し、安易な妥協はしないでください。
      5. 最初の発言で、会議の開始を宣言し、現状の深刻さを各NPCの口から伝えてください。

      ${Y}`},Qt=(t,r)=>{const a=(r==null?void 0:r.aStance)==="PRO",o=a?"肯定側（賛成）":"否定側（反対）",n=a?"否定側（反対）":"肯定側（賛成）";return`あなたはファシリテーションの練習シミュレーターです。
    ユーザーは「ファシリテーター（進行役）」として、対立する2人のキャラクター（AI）の合意形成を目指します。
    あなたは「Aさん」と「Bさん」の2役を同時に演じてください。
    
    【テーマ: ${t}】

    【キャラクター設定】
    1. [Aさん] (感情派・赤): ${o}
       - 性格: 情熱的、感情豊か、主観的。
       - 主張: 個人の感情や体験、倫理観を重視する。論理よりも「気持ち」や「納得感」を大切にする。
       - Bさんの冷徹さが気に入らない。
    
    2. [Bさん] (論理派・青): ${n}
       - 性格: 冷静沈着、効率重視、客観的。
       - 主張: データ、数字、効率、メリット・デメリットを重視する。感情論を「非合理的」と切り捨てる。
       - Aさんの感情論にうんざりしている。

    【あなたの振る舞い】
    - ユーザーが「議論を開始してください」等の指示を出したら、まずはAさんとBさんがそれぞれの立場（${o} vs ${n}）から意見を述べ、対立構造を明確にしてください。
    - ユーザー（ファシリテーター）の発言を受けて、AさんとBさんの反応を出力してください。
    - 常に2人の対立構造を維持してください。簡単には妥協しないでください。
    - ユーザーが「双方の意見を整理」したり「共通のゴールを提示」したり「感情に寄り添う」良い動きをしたら、少しずつ歩み寄ってください。
    - ユーザーが一方に肩入れしたり、命令口調だったりした場合は、もう片方が反発してください。

    【重要：出力フォーマット】
    AさんとBさんの発言をシステムが認識できるよう、以下の形式を厳守してください。
    
    [Aさん]
    発言内容...
    
    [Bさん]
    発言内容...

    ※必ず行頭に [Aさん] または [Bさん] をつけてください。
    ※Markdownの太字(**)や装飾はタグに使わないでください（例: **[Aさん]** は不可）。
    ※1回の出力で、片方だけが喋ることもあれば、双方が言い合うこともあります。

    ${Y}`},Vt=t=>{let r="",a="";switch(t){case I.MECE:r=`
            【MECE (Mutually Exclusive, Collectively Exhaustive)】
            - 目的: モレなくダブりなく分解する。
            - 重要点: 「切り口（軸）」のユニークさと、全体を網羅できているか。`,a=`
            [採点基準 (100点満点)]
            1. 切り口の明確さ (30点): 何を基準に分けたかが明確か。
            2. 網羅性 (40点): 全体をカバーできているか（モレがないか）。
            3. 排他性 (30点): 重複がないか（ダブりがないか）。`;break;case I.FIVE_WHYS:r=`
            【5 Whys (なぜなぜ分析)】
            - 目的: 表面的な事象ではなく、真因（Root Cause）にたどり着く。
            - 重要点: 「なぜ」の連鎖が論理的に繋がっているか（飛躍がないか）。再発防止策に繋がるか。`,a=`
            [採点基準 (100点満点)]
            1. 因果の論理性 (40点): 「AだからB」という繋がりが強固か。
            2. 深掘りの度合い (30点): 5段階まで深く掘り下げられているか。
            3. 真因への到達度 (30点): 解決可能な根本原因に辿り着いたか。`;break;case I.SWOT:r=`
            【SWOT分析】
            - 目的: 内部環境(S/W)と外部環境(O/T)を整理し、戦略を導く。
            - 重要点: 「事実」と「解釈」の区別。強みと機会の混同がないか。`,a=`
            [採点基準 (100点満点)]
            1. 要素の分類精度 (40点): 内部/外部、プラス/マイナスの分類が正しいか。
            2. 具体性 (30点): 抽象的な言葉ではなく具体的な事実に基づいているか。
            3. 分析の鋭さ (30点): 独自の視点やインサイトが含まれているか。`;break;case I.PEST:r=`
            【PEST分析】
            - 目的: 自社を取り巻くマクロ環境を4つの視点で整理する。
            - 重要点: 単なるニュースの羅列ではなく、ビジネスへの「影響」まで洞察できているか。`,a=`
            [採点基準 (100点満点)]
            1. 視点の網羅性 (20点): P,E,S,Tそれぞれの要素が出せているか。
            2. トレンドの的確さ (40点): 現代の重要な潮流を捉えているか。
            3. インパクト評価 (40点): それが対象テーマにどう影響するか示唆があるか。`;break;case I.LOGIC_TREE:r=`
            【ロジックツリー (問題解決ツリー)】
            - 目的: 複雑な問題を分解し、具体的な解決策を導き出す。
            - 重要点: 原因の分解から、実行可能なアクション（How）まで繋がっているか。`,a=`
            [採点基準 (100点満点)]
            1. 階層構造の適切さ (30点): 大項目→中項目→小項目の順序が正しいか。
            2. 具体化のレベル (40点): 末端が具体的なアクションになっているか。
            3. MECE感 (30点): 分解に偏りがないか。`;break;case I.META_COGNITION:r=`
            【メタ認知・バイアスチェック】
            - 目的: 自分の思考の癖（バイアス）に気づき、客観視する。
            - 重要点: 自分の感情と事実を切り離し、別の視点（リフレーミング）を持てるか。`,a=`
            [採点基準 (100点満点)]
            1. 自己客観視度 (40点): 自分の思考を第三者視点で見れているか。
            2. 事実と感情の分離 (30点): 事実ベースで考えられているか。
            3. リフレーミング力 (30点): ネガティブな事象を建設的に捉え直せているか。`;break}return`あなたは思考力を極限まで高める「思考ジム」の鬼トレーナーです。
    ユーザーは今回「${t}」を使って脳を鍛えに来ました。
    
    ${r}
    ${a}

    【セッションの流れ（厳守）】
    このトレーニングは「1テーマにつき必ず2ターン（セット）」で行います。

    ■ フェーズ0: 課題設定（ユーザーがAI課題を求めた場合）
    ユーザーが「課題の自動作成をお願いします。」と送信してきた場合、
    このフレームワークに適した、ビジネスや日常の具体的で少し難しい課題テーマを1つ提示してください。
    例：「テーマ：『若者の車離れ』に対して自動車メーカーが取るべき戦略を分析せよ」
    ※この段階では解説は不要です。テーマのみ提示し「さあ、回答を入力してください」と促してください。

    ■ フェーズ1: 初回回答へのフィードバック
    ユーザーが分析結果（回答）を入力してきたら、以下の構成で出力してください。
    
    ※もしユーザーの入力に「【テーマ: (任意のテーマ)】」が含まれている場合は、そのテーマに対する分析として評価してください。
    ※テーマの指定がなく、かつフェーズ0も経ていない場合は、文脈からテーマを推測するか、テーマが不明確であることを指摘してください。

    1. 【スコア判定】: 上記の採点基準に基づき、各項目の点数と合計点（/100）を表示。
    2. 【鬼コーチの指摘】: なぜその点数なのか、何が足りないのか、辛口かつ論理的に指摘。
    3. 【模範解答 (Model Answer)】: プロが作成したハイレベルな回答例。
    4. 【リライト指令】: **「今のフィードバックを踏まえて、もう一度だけ書き直してください。必ずスコアアップさせてみせろ！」** と強く指示し、再入力を促す。

    ■ フェーズ2: 書き直し（リライト）への評価
    ユーザーが「[GYM_REWRITE]」というヘッダーを含む、または文脈的に書き直しの回答をしてきた場合：
    1. 【改善判定】: 前回の回答と比較し、どこが良くなったか（Before/After）を具体的に褒める。
    2. 【最終スコア】: 修正後のスコアを提示。
    3. 【総評】: セッションのまとめと、日常生活での活かし方アドバイス。
    4. 「トレーニング終了！お疲れ様でした」と締める。

    トーン＆マナー：
    - 非常に厳しく、しかし論理的で、成長を喜ぶ熱血コーチ。
    - 曖昧な回答には「浅い！」「それは単なる感想だ！」と厳しく返すこと。
    
    ${Y}`},Kt=t=>`あなたはディベートの技術指導を行う「鬼教官（ドリル・インストラクター）」です。
    ユーザーは「${t}」という特定の反駁（リバッタル）スキルを集中的に練習したいと考えています。

    【練習するスキル: ${t}】
    このスキルの定義:
    - 根拠の矛盾を突く: 相手の主張内部にある論理的な整合性の欠如や、前後の発言の食い違いを指摘する。
    - カウンターエビデンス: 相手のデータに対抗する、別の証拠や事実を提示して論破する。
    - 証拠の不備指摘 (Source Integrity): データの出典が古い、偏っている、サンプル数が少ないなどの信頼性を攻撃する。
    - 重要性の軽視 (Impact Minimization): 「その問題が発生しても影響は限定的である」「レアケースである」と矮小化する。
    - 現状改良 (Status Quo Improvement): 新しい制度を導入しなくても、現行の運用改善で解決できる（プランは不要）と主張する。

    【トレーニングの流れ】
    1. あなたはランダムな、しかし賛否が分かれる短い「主張（Claim）」と「根拠（Data）」を提示してください。
    2. ユーザーに「さあ、この主張に対して『${t}』のテクニックを使って反論しろ」と指示してください。
    3. ユーザーの回答を待ってください。
    4. ユーザーの回答を評価してください：
       - 指定されたテクニック（${t}）が正しく使われているか？
       - 論理は通っているか？
    5. 評価コメント（合否）と、**完璧な模範解答（Model Answer）**を提示してください。
    6. 「次の問題へ行きますか？」と尋ね、ユーザーが同意したら新しいテーマで繰り返してください。

    トーン＆マナー：
    - 熱血指導員のように、短く、テンポよく話してください。
    - 模範解答は非常に具体的かつ論理的に作成してください。
    
    ${Y}`,Xt=t=>`あなたは論理学とディベートの専門家であり、優秀な家庭教師です。
    ユーザーは「${t}」という特定の詭弁（Logical Fallacy）について学びたいと考えています。
    
    以下のステップで、ユーザーに対話形式でレクチャーを行ってください。
    最初はステップ1から始めてください。一度に全て説明せず、ユーザーの反応を見ながら進めてください。

    【ステップ1: 定義と解説】
    - ${t}とは何か、中学生でもわかるように簡潔に定義してください。
    - なぜそれが論理的に誤りなのか（または不誠実なのか）を説明してください。

    【ステップ2: 具体例】
    - 日常生活、ビジネス、政治などの場面での「よくある使用例」を2〜3個提示してください。

    【ステップ3: 対処法と罠】
    - 相手にこれを使われた時、どう切り返すのが効果的か（具体的なフレーズ例）。
    - 逆に、反論する際に陥りやすい罠（やってはいけない反応）を教えてください。

    【ステップ4: 実践ロールプレイ】
    - ユーザーに「実際にこの詭弁を使った反論を私がしてみましょうか？」と提案してください。
    - ユーザーが承諾したら、適当な軽いテーマ（例：朝食はパンかご飯か）を設定し、あなたが**意図的に${t}を使って**攻撃してください。
    - ユーザーがそれを見抜き、適切に対処できたら褒めてください。

    トーン＆マナー：
    - 親切で、知的で、励ますような口調で話してください。
    - ユーザーからの質問には丁寧に答えてください。
    
    ${Y}`,Zt=t=>`あなたはユーザーの専属ディベートコーチです。
    過去の議論履歴の分析から、ユーザーには以下の「論理的な弱点」や「癖」があることが判明しています。

    【ユーザーの弱点プロファイル】
    ${t||"データ不足のため、一般的な論理構成の甘さを指摘してください。"}

    【タスク】
    今回は「弱点克服特別トレーニング」を行います。
    1. 最初の発言で、上記プロファイルに基づき、ユーザーの弱点が露呈しやすい「特定のテーマ」をあなたが勝手に設定し、提案してください。（例：「あなたの傾向から見て、〇〇というテーマで議論するのが良いでしょう。賛成か反対か選んでください」）
    2. 議論中は、ユーザーがその弱点を克服できるよう、あえてその弱点を突くような攻撃的な質問や反論を行ってください。
    3. ユーザーが良い返しをしたら褒め、また同じミスをしたら厳しく指摘してください。
    4. コーチとしてのメタな発言（アドバイス）と、ディベート相手としての発言を使い分けてください。

    トーン＆マナー：
    - 厳しくも愛のあるスポーツコーチのような口調。
    - 目的は「勝つこと」ではなく「ユーザーを成長させること」です。
    
    ${Y}`,es=(t,r,a,o)=>{let n=`あなたはプロのディベーターです。ユーザーと「${t}」というテーマで議論をしてください。`;if(a){let i="";switch(a){case q.POLICY:i="【論題タイプ: 政策論題】「プランの実効性」や「深刻な副作用（デメリット）」を重視してください。";break;case q.FACT:i="【論題タイプ: 推定論題】客観的な「証拠の信憑性」と「統計的蓋然性」を重視してください。";break;case q.VALUE:i="【論題タイプ: 価値論題】「価値判断の基準（フィロソフィー）」と「優先順位の根拠」を重視してください。";break}n+=`
${i}`}o&&(n+=`
【合意された前提】定義: ${o.definitions} / ゴール: ${o.goal}`);let l="";switch(r){case ae.EASY:l=`
      [難易度: 初級 - コーチングモード]
      - 性格: 非常に親切で励ますような態度。
      - 戦略: ユーザーの意見を必ず「素晴らしい視点です」と称賛してから、優しく別の視点を提示してください。
      - 制約: 難しい用語は使わず、100-150文字で簡潔に。
      - 助言: ユーザーが次に何を言うべきか、思考を促すヒントを最後に一言添えてください。`;break;case ae.NORMAL:l=`
      [難易度: 中級 - スタンダード]
      - 性格: 公平かつ論理的な対話者。
      - 戦略: 建設的で対等な議論を行ってください。
      - 評価: 主張・理由・根拠（Toulmin Model）が揃っているかを確認し、欠けていれば冷静に指摘します。
      - 制約: 200-250文字程度で、誠実に応対してください。`;break;case ae.HARD:l=`
      [難易度: 上級 - 厳格な審判]
      - 性格: 一切の妥協を許さないプロのディベーター。
      - 戦略: わずかな論理の飛躍も逃さず追求してください。
      - 攻撃: 「ソースは何ですか？」「そのデータは最新ですか？」といったエビデンスへの攻撃を強化します。
      - 制約: 300文字以内で、無駄のない鋭い反論を展開してください。`;break;case ae.EXTREME:l=`
      [難易度: 超上級 - 狡猾な論客]
      - 性格: 勝利至上主義。威圧的で、しかし知的な論客。
      - 戦略: 勝つためにあらゆる手段を駆使してください。
      - 戦術: 相手を混乱させるために定義を揺さぶったり、極端な例え話（ストローマン）を織り交ぜ、心理的な圧迫を与えます。
      - 修辞: 反語や比喩を多用し、ユーザーの論理を嘲笑うような高度なレトリックを使用してください。
      - 制約: 400文字以内で、圧倒的な説得力と重圧を持ってください。`;break}return`${n}

${l}

${Y}`},ts=(t,r,a=v.DEBATE,o,n,l,i,c,d)=>a===v.DEMO?Wt(t):a===v.STORY&&d?Ht(d):a===v.THINKING_GYM&&c?Vt(c):a===v.FACILITATION?Qt(t,l):a===v.DRILL?Kt(t):a===v.STUDY?Xt(t):a===v.TRAINING?Zt(o||""):es(t,r,i,n),pr=(t,r,a,o=v.DEBATE,n,l,i,c,d,x)=>{const b={systemInstruction:ts(t,r,o,n,l,i,c,d,x)};o===v.DEMO&&(b.responseMimeType="application/json");const g={model:E,config:b};return a&&a.length>0&&(g.history=a.map(y=>({role:y.role,parts:[{text:y.text}]}))),G.chats.create(g)};function ss(t){return(t==null?void 0:t.usageMetadata)!==null&&(t==null?void 0:t.usageMetadata)!==void 0}function xr(t){return t.structureAnalysis!==null&&t.structureAnalysis!==void 0}const M=t=>{if(!ss(t))return console.warn("usageMetadata is null/undefined in response:",t),{inputTokens:0,outputTokens:0,totalTokens:0};const r=t.usageMetadata;return{inputTokens:r.promptTokenCount??0,outputTokens:r.candidatesTokenCount??0,totalTokens:r.totalTokenCount??0}},rs=t=>{let r="議論（ディベート）のテーマとして適した、興味深く、かつ賛否が分かれるトピック";return t===q.POLICY?r="「政策論題（Policy）」として、具体的な行動、制度変更、社会的ルールの是非を問うトピック（例：～を禁止すべきか、～を導入すべきか）":t===q.FACT?r="「推定論題（Fact/Conjecture）」として、事実の真偽や存在、あるいは未来の予測を問うトピック（例：AIは意識を持つか、宇宙人は存在するか、歴史的解釈など）":t===q.VALUE&&(r="「価値論題（Value）」として、物事の善悪、重要性、優劣といった価値観や倫理を問うトピック（例：自由は安全より重要か、嘘は常に悪か）"),`
  ${r}を日本語で1つだけ提案してください。
  
  【出力の絶対ルール】
  1. トピックの文字列のみを出力してください。
  2. <think>タグや思考プロセスは**絶対に出力しないでください**。
  3. 余計な前置き、挨拶、引用符、Markdown装飾は含めないでください。
  `},as=t=>{let r="多様なジャンル（社会、テクノロジー、倫理、政治、経済など）の論題";return t===q.POLICY&&(r="「政策論題（～すべきか）」に特化した、具体的かつ社会的な論題"),t===q.FACT&&(r="「推定論題（～であるか）」に特化した、事実の真偽や可能性を問う論題"),t===q.VALUE&&(r="「価値論題（～は善か、どちらが重要か）」に特化した、倫理的・哲学的な論題"),`
    ディベートの練習に適した、${r}を5つ提案してください。
    
    条件:
    1. 賛否が明確に分かれるもの。
    2. 日本語で出力する。
    3. JSON配列形式のみを出力する（例: ["テーマ1", "テーマ2"]）。
  `},mr=async t=>{const r=rs(t);try{const a=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:r}]}]});return{topic:k(a.text||""),usage:M(a)}}catch(a){return console.error("Failed to generate topic:",a),{topic:"AIは人間の仕事を奪うか",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},hr=async t=>{const r=as(t),a={type:s.ARRAY,items:{type:s.STRING},description:"5 distinct debate topics"};try{const o=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:r}]}],config:{responseMimeType:"application/json",responseSchema:a}}),n=M(o);if(o.text){const l=k(o.text);return{topics:JSON.parse(l),usage:n}}throw new Error("No response text")}catch(o){return console.error("Failed to generate suggested topics:",o),{topics:["選挙権の定年制を導入すべきか","出生前診断を無条件で認めるべきか","AIに著作権を認めるべきか","ペット売買を禁止すべきか","ギャンブルを完全に違法化すべきか","週休3日制を法制化すべきか","大学の学費を完全無償化すべきか","救急車を有料化すべきか"],usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},ns=t=>`
  あなたは熟練のGame Master兼シナリオライターです。
  テーマ「${t}」に基づいて、ユーザーが意思決定を行うための架空の「ストーリーシナリオ」を作成してください。
  
  以下の要素を含むJSONを生成してください：
  1. title: シナリオの魅力的なタイトル
  2. worldSetting: 国、組織、時代背景などの世界設定（200文字以内）
  3. currentProblem: 現在発生している危機、論争、または解決すべき問題（200文字以内）
  4. userRole: ユーザーが演じる役割（役職、責任、ミッション）
  5. stakeholders: 利害関係者（3〜5名）。名前、役割、立場（主張）を定義。
  6. initialState: 議論開始時の状況描写（導入テキスト）。

  ステークホルダーの例：
  - 名前: 保健省長官
  - 役割: 感染症対策の責任者
  - 立場: 経済より人命を最優先し、ロックダウンを強く主張する。

  注意：
  - 賛否が分かれるジレンマを含めてください。
  - ユーザーは最終決定権を持つリーダー、または重要な調整役です。
  - 【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
  - JSONのみ出力してください。
  `;function $(t){const r=os(t),a=JSON.stringify(t),o=ls(t);return r===429||a.includes("429")||a.includes("quota")?{code:F.QUOTA_EXCEEDED,message:"APIの利用制限を超過しました",status:r,details:t}:r===503||a.includes("503")?{code:F.SERVICE_UNAVAILABLE,message:"AIサービスが一時的に利用できません",status:r,details:t}:o.includes("タイムアウト")||o.includes("timeout")?{code:F.TIMEOUT,message:"通信がタイムアウトしました",status:r,details:t}:{code:F.UNKNOWN,message:o||"不明なエラーが発生しました",status:r,details:t}}function os(t){var r;if(typeof t=="object"&&t!==null)return t.status??((r=t.response)==null?void 0:r.status)}function ls(t){return t instanceof Error?t.message:typeof t=="string"?t:""}function br(t,r){const a=r?`${r}中に`:"";switch(t.code){case F.QUOTA_EXCEEDED:return`${a}APIの利用制限を超過しました。
プランの上限に達したか、リクエスト頻度が高すぎます。
しばらく時間を空けてから再試行してください。`;case F.SERVICE_UNAVAILABLE:return`${a}AIサービスが一時的に混雑しています。
しばらく待ってから再試行してください。`;case F.TIMEOUT:return`${a}通信がタイムアウトしました。
ネットワーク環境を確認し、もう一度お試しください。`;case F.NETWORK_ERROR:return`${a}ネットワークエラーが発生しました。
接続を確認してください。`;case F.PARSE_ERROR:return`${a}応答の解析に失敗しました。
再試行してください。`;default:return`${a}エラーが発生しました: ${t.message}`}}const gr=async t=>{const r=ns(t),a={type:s.OBJECT,properties:{title:{type:s.STRING},worldSetting:{type:s.STRING},currentProblem:{type:s.STRING},userRole:{type:s.OBJECT,properties:{title:{type:s.STRING},description:{type:s.STRING},mission:{type:s.STRING}},required:["title","description","mission"]},stakeholders:{type:s.ARRAY,items:{type:s.OBJECT,properties:{name:{type:s.STRING},role:{type:s.STRING},standpoint:{type:s.STRING}},required:["name","role","standpoint"]}},initialState:{type:s.STRING}},required:["title","worldSetting","currentProblem","userRole","stakeholders","initialState"]};try{const o=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:r}]}],config:{responseMimeType:"application/json",responseSchema:a}}),n=M(o);if(o.text){const l=k(o.text);return{scenario:JSON.parse(l),usage:n}}throw new Error("No text response")}catch(o){const n=$(o);return console.error("scenario failed:",n),{scenario:{title:"生成エラー: デフォルトシナリオ",worldSetting:"架空の都市国家",currentProblem:"AIによるエラーが発生しました",userRole:{title:"管理者",description:"システム管理者",mission:"復旧"},stakeholders:[],initialState:"エラーが発生しました。再試行してください。"},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},is=t=>`
  あなたはクリティカルシンキングの専門家です。
  これからのディベートテーマ「${t}」について、議論が水掛け論にならないよう、事前に合意しておくべき「前提」を提案してください。
  
  以下の2点について、公平かつ建設的な内容を作成してください。
  1. definitions: テーマに含まれる曖昧なキーワードの定義（100文字以内）
  2. goal: この議論における「成功」や「ゴール」の設定（100文字以内。勝ち負けではなく、何を明らかにすれば良いか）

  【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
  出力はJSON形式で行ってください。
  `,fr=async t=>{var o;const r=is(t),a={type:s.OBJECT,properties:{definitions:{type:s.STRING},goal:{type:s.STRING}},required:["definitions","goal"]};try{const n=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:r}]}],config:{responseMimeType:"application/json",responseSchema:a}}),l=M(n);let i="";if(n.text?i=n.text:(o=n.response)!=null&&o.text&&(i=typeof n.response.text=="function"?n.response.text():n.response.text),i){const c=k(i);return{data:JSON.parse(c),usage:l}}throw new Error("No text response")}catch(n){const l=$(n);return console.error("premise failed:",l),{data:{definitions:"用語の定義を明確にする",goal:"多角的な視点から検討する"},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},cs=(t,r)=>`
    以下のファシリテーション（合意形成）シミュレーションの現状を分析し、
    「仮想ホワイトボード」に書き出す内容を整理してください。
    
    テーマ: ${t}
    
    [議論履歴]
    ${r}
    
    [タスク]
    1. Aさん（感情派/赤）とBさん（論理派/青）の現在の主張を整理する。
    2. 双方が合意している点（Agreed Points）と、対立している点（Conflicts）を抽出する。
    3. ファシリテーターへの次のアクション（Hint）を提案する。
    
    JSON形式で出力してください。
  `,ds=async(t,r)=>{var l;const a=r.map(i=>`${i.role==="user"?"Facilitator":"AI Characters"}: ${i.text}`).join(`
`),o=cs(t,a),n={type:s.OBJECT,properties:{currentAgenda:{type:s.STRING,description:"現在議論している具体的な論点（例：コストについて）"},opinionA:{type:s.OBJECT,properties:{summary:{type:s.STRING,description:"Aさんの主張要約"},pros:{type:s.ARRAY,items:{type:s.STRING},description:"Aさんが挙げるメリット/賛成理由"},cons:{type:s.ARRAY,items:{type:s.STRING},description:"Aさんが挙げるデメリット/懸念点"}},required:["summary","pros","cons"]},opinionB:{type:s.OBJECT,properties:{summary:{type:s.STRING,description:"Bさんの主張要約"},pros:{type:s.ARRAY,items:{type:s.STRING},description:"Bさんが挙げるメリット/賛成理由"},cons:{type:s.ARRAY,items:{type:s.STRING},description:"Bさんが挙げるデメリット/懸念点"}},required:["summary","pros","cons"]},agreedPoints:{type:s.ARRAY,items:{type:s.STRING},description:"両者が合意できた点"},conflictingPoints:{type:s.ARRAY,items:{type:s.STRING},description:"意見が食い違っている点"},facilitationHint:{type:s.STRING,description:"合意形成に向けた次のアクション提案"}},required:["currentAgenda","opinionA","opinionB","agreedPoints","conflictingPoints","facilitationHint"]};try{const i=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:o}]}],config:{responseMimeType:"application/json",responseSchema:n}}),c=M(i);let d="";if(i.text?d=i.text:(l=i.response)!=null&&l.text&&(d=typeof i.response.text=="function"?i.response.text():i.response.text),d){const x=k(d);return{board:JSON.parse(x),usage:c}}throw new Error("No response text")}catch(i){return console.error("Facilitation board generation failed:",i),{board:{currentAgenda:"情報の整理中...",opinionA:{summary:"分析中",pros:[],cons:[]},opinionB:{summary:"分析中",pros:[],cons:[]},agreedPoints:[],conflictingPoints:[],facilitationHint:"議論を続けてください。"},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},us=(t,r)=>`
    あなたはディベートの「リアルタイム戦略ナビゲーター」です。
    ユーザーは現在、以下の議論を行っています。
    相手（Opponent）の最新の発言を分析し、ユーザーが次に取るべき戦略をアドバイスしてください。

    テーマ: ${t}
    
    [直近の議論]
    ${r}

    [タスク]
    1. 相手の発言の論理構造（Claim, Evidence, Weakness）を分析してください。
    2. 議論の現在のフェーズを判定してください。
    3. ユーザーが取るべき「3つの異なる戦略（Moves）」を提案してください。
       - 各Moveには、**なぜそのフェーズでその戦略が有効なのかの理由 (reason)** を必ず含めてください。
    
    4. 【新機能: 反論カード生成】
       相手の主張に対する効果的な反論を構成するための「テンプレート」を作成してください。
       以下の4つのフィールドに対し、相手の発言内容に基づいた**具体的なヒント（hint）**を生成してください。
       
       - Field 1: 相手の主張の弱点（Weak Point）
       - Field 2: 反証・対案（Counter-example / Alternative）
       - Field 3: 重要性（Impact / Why it matters）
       - Field 4: 結論（My Conclusion）

    【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
    JSON形式で出力してください。
  `,ps="";async function*xs(t){yield*ot(`${ps}/api/gemini/generate-stream`,t)}async function te(t,r){let a="",o={inputTokens:0,outputTokens:0,totalTokens:0};try{if(Pt){const i=xs(t);for await(const c of i){const d=c.text||"";a+=d,r&&r(a),c.usageMetadata&&(o={inputTokens:c.usageMetadata.inputTokens||0,outputTokens:c.usageMetadata.outputTokens||0,totalTokens:c.usageMetadata.totalTokens||0})}}const n=k(a);return{data:JSON.parse(n),usage:o}}catch(n){if(a.length>0){console.warn("Stream interrupted, attempting partial parse:",n);try{const l=ms(a);return{data:JSON.parse(l),usage:o}}catch{console.error("Could not repair JSON. Partial content:",a.substring(0,200))}}throw n}}function ms(t){let r=t.trim();const a=(r.match(/\{/g)||[]).length,o=(r.match(/\}/g)||[]).length,n=a-o;n>0&&(r+="}".repeat(n));const l=(r.match(/\[/g)||[]).length,i=(r.match(/\]/g)||[]).length,c=l-i;return c>0&&(r+="]".repeat(c)),r=r.replace(/,(\s*[}\]])/,"$1"),(r.match(/"/g)||[]).length%2!==0&&(r+='"'),r}const hs=async(t,r,a)=>{const o=r.slice(-4).map(i=>`${i.role==="user"?"User":"Opponent"}: ${i.text}`).join(`
`),n=us(t,o),l={type:s.OBJECT,properties:{analysis:{type:s.OBJECT,properties:{claim_summary:{type:s.STRING},evidence_summary:{type:s.STRING},weak_point:{type:s.STRING},rhetoric_device:{type:s.STRING},detected_fallacy:{type:s.STRING,nullable:!0}},required:["claim_summary","evidence_summary","weak_point","rhetoric_device"]},currentPhase:{type:s.STRING,enum:[A.CLAIM,A.EVIDENCE,A.REBUTTAL,A.DEFENSE,A.FALLACY,A.FRAMING,A.CONCESSION,A.SYNTHESIS]},moves:{type:s.ARRAY,items:{type:s.OBJECT,properties:{type:{type:s.STRING,enum:["logical_attack","reframing","concession"]},title:{type:s.STRING},summary:{type:s.STRING},expected_effect:{type:s.STRING},reason:{type:s.STRING,description:"Why this is effective now"},template:{type:s.STRING}},required:["type","title","summary","expected_effect","reason","template"]}},rebuttalTemplate:{type:s.OBJECT,properties:{title:{type:s.STRING},fields:{type:s.ARRAY,items:{type:s.OBJECT,properties:{id:{type:s.STRING},label:{type:s.STRING},placeholder:{type:s.STRING},hint:{type:s.STRING,description:"AI suggestion for this field"}},required:["id","label","placeholder","hint"]}}},required:["title","fields"]}},required:["analysis","currentPhase","moves","rebuttalTemplate"]};try{const{data:i,usage:c}=await te({model:E,contents:[{role:"user",parts:[{text:n}]}],config:{responseMimeType:"application/json",responseSchema:l}},a);return{strategy:i,usage:c}}catch(i){const c=$(i);return console.error("Strategy streaming failed:",c),{strategy:{analysis:{claim_summary:"分析失敗",evidence_summary:"不明",weak_point:"不明",rhetoric_device:"不明",detected_fallacy:null},currentPhase:A.REBUTTAL,moves:[]},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},bs=t=>`
  以下のテキストを解析し、「客観的な事実（Fact）」と「主観的な意見（Opinion）」に分類・分割してください。
  
  テキスト: "${t}"
  
  タスク:
  1. テキスト全体を、意味のまとまりごとに分割し、配列に格納する。
  2. 各セグメントが「事実（検証可能、データ、事象）」か「意見（判断、推測、感情）」か、どちらでもない「中立（挨拶、接続詞）」かを判定する。
  3. 全体に対する事実と意見の割合（0.0〜1.0）を算出する。

  【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
  注意: 元のテキストを一文字も漏らさず、順番通りに再構成できるように分割してください。
  `,gs=async t=>{const r=bs(t),a={type:s.OBJECT,properties:{segments:{type:s.ARRAY,items:{type:s.OBJECT,properties:{text:{type:s.STRING},type:{type:s.STRING,enum:["fact","opinion","neutral"]}},required:["text","type"]}},factRatio:{type:s.NUMBER},opinionRatio:{type:s.NUMBER}},required:["segments","factRatio","opinionRatio"]};try{const o=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:r}]}],config:{responseMimeType:"application/json",responseSchema:a}}),n=M(o);if(o.text){const l=k(o.text);return{analysis:JSON.parse(l),usage:n}}throw new Error("No text response")}catch(o){const n=$(o);return console.error("Fact-check analysis failed:",n),{analysis:{segments:[{text:t,type:"neutral"}],factRatio:0,opinionRatio:0},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},fs=(t,r)=>`
    以下のディベートの「現在の状況」と「主な論点」を整理してください。
    
    テーマ: ${t}
    
    [議論履歴]
    ${r}
    
    [タスク]
    現在、互いにどの点で対立しているか、または何が議論の焦点になっているかを分析し、
    **3つ〜5つの短い箇条書き**でまとめてください。
    各項目は30文字以内の簡潔な日本語にしてください。

    【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
    出力はJSON配列形式で行ってください（例: ["コスト面での対立", "倫理的な懸念"]）。
  `,ys=async(t,r,a)=>{const o=r.map(i=>`${i.role==="user"?"User":"Opponent"}: ${i.text}`).join(`
`),n=fs(t,o),l={type:s.ARRAY,items:{type:s.STRING},description:"List of current debate points"};try{const{data:i,usage:c}=await te({model:E,contents:[{role:"user",parts:[{text:n}]}],config:{responseMimeType:"application/json",responseSchema:l}},a);return{points:i,usage:c}}catch(i){return console.error("Summary streaming failed:",i),{points:["論点の抽出に失敗しました"],usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Ns=(t,r,a)=>a.trim()?`
      あなたはディベートの優秀なコーチです。ユーザーは以下の議論において、反論の下書きを作成中です。
      
      テーマ: ${t}
      
      [直近の議論]
      ${r}
      
      [ユーザーの下書き]
      "${a}"
      
      [タスク]
      この下書きを「添削・評価」してください。
      1. 論理的な飛躍や、相手の主張に対する回答漏れがないか確認する。
      2. もし下書きが感情的すぎたり、論理的に弱い場合は具体的に指摘する。
      3. 「こう言い換えると説得力が増す」という改善案を一言添える。
      4. 下書きの感情・トーンを分析し、**センチメントスコア（-1.0〜+1.0）**を算出してください。
      5. 【最重要】ユーザーの下書きに「アンコンシャス・バイアス（無意識の偏見）」が含まれていないか、以下のリストを参考に特に厳しくチェックしてください。{権威バイアス, 集団同調性バイアス, 確証バイアス, ステレオタイプ, 内集団バイアス, 利用可能性ヒューリスティック}。もしバイアスが検出された場合は、その名称(detectedBias)、該当箇所の正確な引用(biasQuote)、なぜそれがバイアスに該当するかの簡単な解説(biasExplanation)を生成してください。解説は、ユーザーに自己認知を促すような、建設的で丁寧なトーンで記述してください。
      
      **120文字以内の日本語**で、コーチとして厳しくも的確なアドバイスを提示してください。

      【重要】出力は**必ず日本語**で行ってください。英語は一切使用しないでください。
      出力はJSON形式で行ってください。
    `:`
      あなたはディベートの優秀なコーチです。ユーザーは以下の議論において、次にどう切り返すか悩んでいます。
      
      テーマ: ${t}
      
      [直近の議論]
      ${r}
      
      [タスク]
      相手（Opponent）の最後の発言を分析し、最も効果的な「反論の切り口」を提案してください。
      
      1. 【重要】相手が「詭弁（Fallacies）」や「心理的説得テクニック（影響力の武器）」を使用しているか厳密にチェックしてください。
         - 詭弁: ストローマン、人身攻撃、論点ずらし、早急な一般化など
         - 心理的テクニック: 返報性（Reciprocity）、社会的証明（Social Proof）、希少性（Scarcity）など
         もしこれらが使われている場合は、その名称を特定してください。
         ※相手の引用テキストに引用符が含まれていないか注意し、原文のまま抽出してください。
      
      2. 詭弁や心理テクニックが検出された場合、相手の発言からその該当する「正確な部分文字列（引用）」を抜き出してください。
         ※重要: ハイライト表示に使用するため、相手の発言に含まれるテキストと**一言一句違わず完全に一致する箇所**を抜き出してください。
      
      3. 検出された場合、なぜそれが論理的に不適切なのか、またはどのような意図があるのか簡潔に解説してください（fallacyExplanation）。
      
      4. その弱点を突くための鋭い質問、またはカウンターの方向性を具体的に指示してください（advice）。

      【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
      出力はJSON形式で行ってください。
    `,js=async(t,r,a,o)=>{const n=r.slice(-4).map(c=>`${c.role==="user"?"User":"Opponent"}: ${c.text}`).join(`
`),l=Ns(t,n,a),i={type:s.OBJECT,properties:{advice:{type:s.STRING},detectedFallacy:{type:s.STRING,nullable:!0},fallacyQuote:{type:s.STRING,nullable:!0},fallacyExplanation:{type:s.STRING,nullable:!0},sentimentScore:{type:s.NUMBER,nullable:!0},detectedBias:{type:s.STRING,nullable:!0},biasQuote:{type:s.STRING,nullable:!0},biasExplanation:{type:s.STRING,nullable:!0}},required:["advice"]};try{const{data:c,usage:d}=await te({model:E,contents:[{role:"user",parts:[{text:l}]}],config:{responseMimeType:"application/json",responseSchema:i}},o);return{advice:c.advice,detectedFallacy:c.detectedFallacy||null,fallacyQuote:c.fallacyQuote||null,fallacyExplanation:c.fallacyExplanation||null,sentimentScore:typeof c.sentimentScore=="number"?c.sentimentScore:null,detectedBias:c.detectedBias||null,biasQuote:c.biasQuote||null,biasExplanation:c.biasExplanation||null,usage:d}}catch(c){const d=$(c);return console.error("Advice streaming failed:",d),{advice:"通信エラーが発生しました。",detectedFallacy:null,fallacyQuote:null,fallacyExplanation:null,sentimentScore:null,detectedBias:null,biasQuote:null,biasExplanation:null,usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Ts=(t,r,a,o,n=!1)=>a?`
    あなたはディベートの審査員兼教育者です。
    ユーザーは模範的なディベート（Alice vs Bob）を視聴しました。
    以下の議論履歴を分析し、学習者向けのフィードバック資料を作成してください。

    テーマ: ${t}

    [分析タスク]
    1. 議論の概要（Summary）: 全体の流れと結末を要約してください。
    2. 論理構造の可視化と衝突分析（Clash Analysis）: 
       最も議論が白熱した「肯定側の主張」と「否定側の反論」のペアを抽出し、以下の要素に分解してください。
       - agenda: 論点
       - pro: 
          - claim (主張)
          - data (根拠)
          - warrant (論拠/つなぎ): なぜその根拠が主張を支えるのか
       - con:
          - counter (反論)
          - evidence (証拠)
          - impact (重要性/深刻さ): なぜその反論が重要なのか
       - synthesis: その対立がどう処理されたか、論理のぶつかり合いの分析
    3. 戦略的ハイライト（Strategy Highlights）:
       AliceやBobが使用した高度なディベートテクニック（例: 争点の明確化、前提の再定義、ストローマンの回避など）を3〜4つ特定し、その効果を記述してください。
    4. 観察者のための学び（Learning Points）:
       この議論を見ていた学生が学ぶべき、「自分がこの場にいたら何を言うべきか」「次の練習で意識すべきポイント」を3つ挙げてください。

    [出力言語]
    全てのテキストは**自然な日本語**で記述してください。

    議論履歴:
    ${o}
    `:`
    以下の「${t}」に関する議論の履歴を分析し、ディベートの振り返りデータを作成してください。
    ${r?"※これは「世界観シナリオ・ディベート（Story Mode）」です。ユーザーの意思決定とその結果を重点的に評価してください。":""}
    ${n?"※これは「合意形成モード（Facilitation Mode）」です。ユーザーはファシリテーターとして、AさんとBさんの対話を促進しています。AさんとBさんの各発言を個別に評価してください。ユーザー（ファシリテーター）の発言も評価対象に含めてください。":""}

    【重要：採点根拠のSBIモデル化】
    detailedReview内の各発言に対する採点コメントは、以下のSBIモデルを厳格に適用して客観化してください。
    1. Situation（状況）: 議論のどの段階で、相手がどう発言した直後だったか。
    2. Behavior（行動）: ユーザーまたはAIが実際に取った具体的な発言内容、論理構成、修辞表現。
    3. Impact（影響）: その行動が、議論の説得力やジャッジへの印象、または議論の展開にどのようなプラス/マイナスの影響を与えたか。

    【重要：論理構造分析 (logicAnalysis) の抽出】
    ${n?"合意形成モードでは、AさんとBさんの主要な対立点を1つ抽出し、Toulminモデルで構造化してください。":"議論全体の中で、特に中核となるユーザーの主張を1〜2つ抽出し、Toulminモデルで構造化してください。"}
    - claim, data, warrant の各要素の記述を充実させてください。
    - 各要素の強弱を判定し(strong, weak, missing)、建設的なコメントを付与してください。

    【重要：質問力分析 (questioningAnalysis) の抽出】
    ${n?"ファシリテーターが行った主要な問いかけ（最大5つ程度）を抽出し、その有効性を評価してください。":"ユーザーが行った全ての「問いかけ」を抽出し、その有効性を評価してください。"}
    - OPEN(広げる), CLOSED(詰める), SUBTLE(誘導) に分類してください。
    - 相手の思考を深めることができたか、議論を前進させたかを評価してください。
    - 全体的な質問力スコア (stats.score) は**10点満点**で評価してください。

    【分析的ルーブリックの適用】
    各評価軸に対し、透明性の高いスコアリングを行ってください。
    1. 各項目（Logic, Evidence等）に「重み（Weight）」を設定してください。合計が100%になるように。
    2. 算出したスコアに対し、その達成レベルが具体的にどのようなパフォーマンスを示すのか（ルーブリック記述）を「descriptor」に詳しく記述してください。

    【アンカー事例（Exemplars）の生成】
    ${n?"合意形成モードでは、「ファシリテーション技術」に関する2つの評価基準（例：中立的な問いかけ、合意形成の促進）のみでベンチマーク事例を作成してください。":"今回のトピック「"+t+"」において、特定の評価基準（例：論理性、根拠の質）における「具体的ベンチマーク（基準事例）」を作成してください。"}
    - Mastery (10点): 理想的な最高レベルの回答例
    - Secure (7点): 十分なレベルだが改善の余地がある例
    - Developing (4点): 初歩で論理に飛躍がある例
    - Error (2点): 一般的に陥りやすいミスや誤謬（詭弁）を含む非模範例
    これらを「exemplars」配列として出力してください。

    【重要：言語指定】
    出力されるJSONデータの全てのテキストフィールドは、**必ず自然な日本語**で記述してください。

    【分析ルール】
    1. 総合スコア (score) について:
       - 100点満点で採点（1点単位）。
    2. 発言ごとの詳細評価 (detailedReview) について:
       ${n?`- **合意形成モードでは、重要な発言（スコアが高いまたは低い、誤謬を含む）のみを厳選してレビューしてください（最大10件程度）。**
       - ファシリテーターの重要な介入、Aさん・Bさんの核心的な主張を優先的に選んでください。`:`- **ユーザーとAI双方の全ての発言を対象にしてください。**
       - **全ての発言に対して、その論理的強度を1-10点でスコアリング(score)してください。**`}
       - sbiオブジェクトを必ず含めてください。
       - ユーザーの発言に対しては、betterResponse（理想的な模範解答）を含めてください。
    3. 全体評価（metrics）について:
       logic, evidence, rebuttal, persuasion, consistency, constructiveness, objectivity, clarity (各10点満点)
    4. 分析的ルーブリック詳細 (rubricDetails)
    5. 行動メトリクス測定 (sessionMetrics)
    6. トレーニング推奨 (TrainingRecommendations)
    7. 論理構造分析 (logicAnalysis): 議論全体の核心的な論理を抽出。
    8. 質問力分析 (questioningAnalysis): 検出された全ての質問を評価。

    ---
    議論履歴:
    ${o}
    ---
  `,Oe={type:s.OBJECT,properties:{text:{type:s.STRING},status:{type:s.STRING,enum:["strong","weak","missing"]},comment:{type:s.STRING}},required:["text","status","comment"]},ws={type:s.OBJECT,properties:{key:{type:s.STRING},label:{type:s.STRING},rate:{type:s.OBJECT,properties:{numerator:{type:s.INTEGER},denominator:{type:s.INTEGER}},required:["numerator","denominator"]},score:{type:s.INTEGER}},required:["key","label","rate","score"]},vs={type:s.OBJECT,properties:{key:{type:s.STRING},label:{type:s.STRING},score:{type:s.NUMBER},weight:{type:s.NUMBER},descriptor:{type:s.STRING}},required:["key","label","score","weight","descriptor"]},Ss={type:s.OBJECT,properties:{level:{type:s.STRING,enum:["Mastery","Secure","Developing","Error"]},label:{type:s.STRING},text:{type:s.STRING},explanation:{type:s.STRING},score:{type:s.NUMBER}},required:["level","label","text","explanation","score"]},Is={type:s.OBJECT,properties:{metricKey:{type:s.STRING},metricLabel:{type:s.STRING},items:{type:s.ARRAY,items:Ss}},required:["metricKey","metricLabel","items"]},Es={type:s.OBJECT,properties:{id:{type:s.STRING},label:{type:s.STRING},description:{type:s.STRING},actionType:{type:s.STRING,enum:["open_minigame","open_textbook","open_thinking_gym","start_drill","start_study"]},actionPayload:{type:s.OBJECT,properties:{minigameType:{type:s.STRING},textbookChapterId:{type:s.INTEGER},thinkingFramework:{type:s.STRING},drillTopic:{type:s.STRING},studyTopic:{type:s.STRING}}}},required:["id","label","description","actionType","actionPayload"]},Rs={type:s.OBJECT,properties:{situation:{type:s.STRING},behavior:{type:s.STRING},impact:{type:s.STRING}},required:["situation","behavior","impact"]},Cs={type:s.OBJECT,properties:{score:{type:s.INTEGER},summary:{type:s.STRING},strengths:{type:s.ARRAY,items:{type:s.STRING}},weaknesses:{type:s.ARRAY,items:{type:s.STRING}},advice:{type:s.STRING},metrics:{type:s.OBJECT,properties:{logic:{type:s.INTEGER},evidence:{type:s.INTEGER},rebuttal:{type:s.INTEGER},persuasion:{type:s.INTEGER},consistency:{type:s.INTEGER},constructiveness:{type:s.INTEGER},objectivity:{type:s.INTEGER},clarity:{type:s.INTEGER}},required:["logic","evidence","rebuttal","persuasion","consistency","constructiveness","objectivity","clarity"]},detailedReview:{type:s.ARRAY,items:{type:s.OBJECT,properties:{messageIndex:{type:s.INTEGER},score:{type:s.INTEGER},critique:{type:s.STRING},sbi:Rs,betterResponse:{type:s.STRING},fallacy:{type:s.STRING,nullable:!0},fallacyQuote:{type:s.STRING},fallacyExplanation:{type:s.STRING}},required:["messageIndex","score","sbi"]}},rubricDetails:{type:s.ARRAY,items:vs,nullable:!0},sessionMetrics:{type:s.ARRAY,items:ws,nullable:!0},trainingRecommendations:{type:s.ARRAY,items:Es,nullable:!0},exemplars:{type:s.ARRAY,items:Is},logicAnalysis:{type:s.ARRAY,items:{type:s.OBJECT,properties:{type:{type:s.STRING},summary:{type:s.STRING},claim:Oe,data:Oe,warrant:Oe},required:["type","summary","claim","data","warrant"]}},rhetoric:{type:s.OBJECT,properties:{ethos:{type:s.INTEGER},pathos:{type:s.INTEGER},logos:{type:s.INTEGER},affirmationScore:{type:s.INTEGER},affirmationComment:{type:s.STRING}},required:["ethos","pathos","logos","affirmationScore","affirmationComment"],nullable:!0},questioningAnalysis:{type:s.OBJECT,properties:{stats:{type:s.OBJECT,properties:{openCount:{type:s.INTEGER},closedCount:{type:s.INTEGER},subtleCount:{type:s.INTEGER},score:{type:s.INTEGER},advice:{type:s.STRING}},required:["openCount","closedCount","subtleCount","score","advice"]},details:{type:s.ARRAY,items:{type:s.OBJECT,properties:{messageIndex:{type:s.INTEGER},questionText:{type:s.STRING},type:{type:s.STRING},effectiveness:{type:s.INTEGER},comment:{type:s.STRING}},required:["messageIndex","questionText","type","effectiveness","comment"]}}},required:["stats","details"]},facilitation:{type:s.OBJECT,properties:{understandingScore:{type:s.INTEGER},organizingScore:{type:s.INTEGER},consensusScore:{type:s.INTEGER},feedback:{type:s.STRING}},required:["understandingScore","organizingScore","consensusScore","feedback"],nullable:!0},storyAnalysis:{type:s.OBJECT,nullable:!0,properties:{decisionScore:{type:s.INTEGER},consensusScore:{type:s.INTEGER},outcome:{type:s.STRING},socialImpact:{type:s.OBJECT,properties:{economic:{type:s.STRING},publicSentiment:{type:s.STRING},ethical:{type:s.STRING}},required:["economic","publicSentiment","ethical"]},alternativeScenario:{type:s.STRING}},required:["decisionScore","consensusScore","outcome","socialImpact","alternativeScenario"]},demoAnalysis:{type:s.OBJECT,nullable:!0,properties:{summary:{type:s.STRING},clashAnalysis:{type:s.OBJECT,properties:{agenda:{type:s.STRING},pro:{type:s.OBJECT,properties:{claim:{type:s.STRING},data:{type:s.STRING},warrant:{type:s.STRING}},required:["claim","data","warrant"]},con:{type:s.OBJECT,properties:{counter:{type:s.STRING},evidence:{type:s.STRING},impact:{type:s.STRING}},required:["counter","evidence","impact"]},synthesis:{type:s.STRING}},required:["agenda","pro","con","synthesis"]},highlights:{type:s.ARRAY,items:{type:s.OBJECT,properties:{technique:{type:s.STRING},description:{type:s.STRING},effect:{type:s.STRING}},required:["technique","description","effect"]}},learningPoints:{type:s.ARRAY,items:{type:s.OBJECT,properties:{point:{type:s.STRING},reason:{type:s.STRING}},required:["point","reason"]}}},required:["summary","clashAnalysis","highlights","learningPoints"]}},required:["score","summary","strengths","weaknesses","advice","metrics","detailedReview","logicAnalysis","questioningAnalysis","exemplars"]},yr=async(t,r,a)=>{const o=r.map((x,b)=>`[ID:${b}] ${x.role==="user"?"User":"AI"}: ${x.text}`).join(`
`),n=t.topic,l=t.mode===v.STORY,i=t.mode===v.DEMO,c=t.mode===v.FACILITATION,d=Ts(n,l,i,o,c);try{return await te({model:E,contents:[{role:"user",parts:[{text:d}]}],config:{responseMimeType:"application/json",responseSchema:Cs}},a)}catch(x){return console.error("Feedback streaming failed:",x),{data:{score:0,summary:"フィードバックの生成中に通信エラーが発生しました。",strengths:["-"],weaknesses:["-"],advice:"ネットワーク接続またはAPIキーを確認し、再度お試しください。",metrics:{logic:0,evidence:0,rebuttal:0,persuasion:0,consistency:0,constructiveness:0,objectivity:0,clarity:0},detailedReview:[]},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},As=(t,r)=>`
    あなたはディベートの進行管理を行う審判AIです。
    以下の議論履歴を分析し、現在議論がどの「フェーズ（段階）」にあるかを判定してください。
    また、**そのフェーズでユーザーが勝つための条件（Win Condition）**を提示してください。

    テーマ: ${t}

    [議論履歴]
    ${r}

    [判定すべきフェーズ定義]
    1. POSITION (立場表明): 議論の初期段階。
    2. GROUNDS (根拠提示): 具体的なデータ、事実、理由を提示している段階。
    3. CLASH (論点衝突): 互いの主張がぶつかり合い、争点が明確になっている段階。
    4. REBUTTAL (再反論): 相手の反論に対して防御したり、さらなる反撃を行っている段階。
    5. WEIGHING (重要度比較): 双方の主張が出揃い、どちらがより重要かを比較している終盤戦。
    6. CLOSING (結論整理): 議論をまとめ、最終的な結論を共有している段階。

    [タスク]
    1. 最新のやり取りに基づき、現在どのフェーズか判定する。
    2. そのフェーズにおいて、ユーザーが優位に立つために「今、何をすべきか」を **winCondition** として出力する。
       - label: 短い見出し（例：「定義を明確化せよ」「相手の根拠を叩け」）
       - description: 30文字程度の具体的な指示。

    【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
    JSON形式で出力してください。
  `,ks=async(t,r)=>{const o=r.slice(-6).map(c=>`${c.role==="user"?"User":"AI"}: ${c.text}`).join(`
`),n=r[r.length-1],l=As(t,o),i={type:s.OBJECT,properties:{phase:{type:s.STRING,enum:["POSITION","GROUNDS","CLASH","REBUTTAL","WEIGHING","CLOSING"]},confidence:{type:s.NUMBER},rationale:{type:s.STRING},winCondition:{type:s.OBJECT,properties:{label:{type:s.STRING},description:{type:s.STRING}},required:["label","description"]}},required:["phase","confidence","rationale","winCondition"]};try{const c=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:l}]}],config:{responseMimeType:"application/json",responseSchema:i}}),d=M(c);if(c.text){const x=k(c.text),b=JSON.parse(x);return{result:{messageId:(n==null?void 0:n.id)||"unknown",speaker:(n==null?void 0:n.role)==="user"?"USER":"AI",phase:b.phase,confidence:b.confidence,rationale:b.rationale,winCondition:b.winCondition},usage:d}}throw new Error("No response text")}catch(c){return console.error("Phase analysis failed:",c),{result:{messageId:(n==null?void 0:n.id)||"unknown",speaker:(n==null?void 0:n.role)==="user"?"USER":"AI",phase:"CLASH",confidence:0,rationale:"Analysis failed",winCondition:{label:"現状分析中",description:"議論を続けてください"}},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Os=t=>`
    以下の発言の「論理構造」をトゥールミンモデルおよびWaltonの議論スキーム（Argumentation Schemes）に基づいて詳細に分析してください。

    発言内容:
    "${t}"

    [分析タスク1: Toulmin Components]
    各要素が含まれている度合いを 0.0〜1.0 でスコアリングし、該当部分の抜粋(snippet)を作成してください。
    1. CLAIM (主張), 2. REASON (理由), 3. EVIDENCE (証拠), 4. WARRANT (論拠), 5. BACKING (裏付け), 6. REBUTTAL (反駁への考慮), 7. QUALIFICATION (限定)

    [分析タスク2: Argumentation Scheme & Critical Questions]
    この発言が採用している「論理の型（議論スキーム）」を特定し、それを評価するための「批判的質問（Critical Questions: CQs）」を提示してください。

    1. scheme: 以下の代表的なスキームから最も近いものを1つ選択し、日本語のラベルと説明を付与してください。
       - Argument from Expert Opinion (専門家の意見)
       - Argument from Analogy (類推)
       - Argument from Cause to Effect (因果関係)
       - Argument from Sign (兆候・指標)
       - Argument from Example (例証)
       - Argument from Consequences (帰結)

    2. criticalQuestions: 特定したスキームを検証するためにAI（あなた）が内部で用いた評価質問を3〜4つリストアップしてください。
       - question: 質問内容
       - isAddressed: この発言内でその質問に対する回答や考慮が含まれているか (boolean)
       - aiComment: なぜそう判断したか、または不十分な点があれば具体的に。

    [サマリー]
    summaryには、この発言の論理性に関する強みと「回答されていないCQ（論理の穴）」を、日本語2文以内で簡潔に記述してください。

    【重要】全ての出力は**必ず日本語**で記述してください。英語は一切使用しないでください。
    JSON形式で出力してください。
  `,Gs=async(t,r)=>{const a=Os(t.text),o={type:s.OBJECT,properties:{scores:{type:s.OBJECT,properties:{CLAIM:{type:s.NUMBER},REASON:{type:s.NUMBER},EVIDENCE:{type:s.NUMBER},WARRANT:{type:s.NUMBER},BACKING:{type:s.NUMBER},REBUTTAL:{type:s.NUMBER},QUALIFICATION:{type:s.NUMBER}},required:["CLAIM","REASON","EVIDENCE","WARRANT","BACKING","REBUTTAL","QUALIFICATION"]},snippets:{type:s.OBJECT,properties:{CLAIM:{type:s.STRING},REASON:{type:s.STRING},EVIDENCE:{type:s.STRING},WARRANT:{type:s.STRING},BACKING:{type:s.STRING},REBUTTAL:{type:s.STRING},QUALIFICATION:{type:s.STRING}}},scheme:{type:s.OBJECT,properties:{id:{type:s.STRING},label:{type:s.STRING},description:{type:s.STRING}},required:["id","label","description"]},criticalQuestions:{type:s.ARRAY,items:{type:s.OBJECT,properties:{question:{type:s.STRING},isAddressed:{type:s.BOOLEAN},aiComment:{type:s.STRING}},required:["question","isAddressed","aiComment"]}},summary:{type:s.STRING}},required:["scores","summary","scheme","criticalQuestions"]};try{const{data:n,usage:l}=await te({model:E,contents:[{role:"user",parts:[{text:a}]}],config:{responseMimeType:"application/json",responseSchema:o}},r);return{result:{messageId:t.id,speaker:t.role==="user"?"USER":"AI",scores:n.scores,snippets:n.snippets,scheme:n.scheme,criticalQuestions:n.criticalQuestions,summary:n.summary},usage:l}}catch(n){const l=$(n);return console.error("Structure analysis streaming failed:",l),{result:{messageId:t.id,speaker:t.role==="user"?"USER":"AI",scores:{CLAIM:0,REASON:0,EVIDENCE:0,WARRANT:0,BACKING:0,REBUTTAL:0,QUALIFICATION:0},summary:"分析失敗"},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Bs={type:s.OBJECT,properties:{burdens:{type:s.ARRAY,items:{type:s.OBJECT,properties:{id:{type:s.STRING,description:"Unique identifier for this burden"},type:{type:s.STRING,enum:["claim","simple_question","counter_claim"],description:"Type of burden"},status:{type:s.STRING,enum:["active","fulfilled","challenged","abandoned"],description:"Current status of the burden"},claimText:{type:s.STRING,description:"The text of the claim"},claimMessageIndex:{type:s.NUMBER,description:"Message index where the claim was made"},claimant:{type:s.STRING,enum:["user","ai"],description:"Who made the claim"},burdenHolder:{type:s.STRING,enum:["user","ai"],description:"Who holds the burden of proof"},evidenceMessageIndices:{type:s.ARRAY,items:{type:s.NUMBER},description:"Message indices containing evidence for this burden"},isCriticalQuestion:{type:s.BOOLEAN,description:"Whether this burden involves a critical question"},criticalQuestionText:{type:s.STRING,description:"The text of the critical question (if applicable)",nullable:!0},criticalQuestionIndex:{type:s.NUMBER,description:"Message index of the critical question",nullable:!0},explanation:{type:s.STRING,description:"Explanation of why this burden exists"},assessment:{type:s.STRING,description:"Assessment of whether the burden has been fulfilled",nullable:!0},createdAt:{type:s.NUMBER,description:"Message index when this burden was created"},resolvedAt:{type:s.NUMBER,description:"Message index when this burden was resolved",nullable:!0}},required:["id","type","status","claimText","claimMessageIndex","claimant","burdenHolder","evidenceMessageIndices","isCriticalQuestion","explanation","createdAt"]}},summary:{type:s.OBJECT,properties:{userActiveBurdens:{type:s.NUMBER,description:"Number of active burdens held by the user"},aiActiveBurdens:{type:s.NUMBER,description:"Number of active burdens held by AI"},totalResolved:{type:s.NUMBER,description:"Total number of resolved burdens"},criticalQuestionsCount:{type:s.NUMBER,description:"Total number of critical questions"}},required:["userActiveBurdens","aiActiveBurdens","totalResolved","criticalQuestionsCount"]}},required:["burdens","summary"]},Ve=async(t,r,a)=>{const o=r.map((l,i)=>`[ID:${i}] ${l.role==="user"?"User":"AI"}: ${l.text}`).join(`
`),n=`
あなたは論理的議論の専門家です。以下の議論における「立証責任（Burden of Proof）」を分析してください。

**重要: 全ての説明文は必ず日本語で出力してください。claim、explanation、reasoning等のテキストフィールドは全て日本語で記述してください。**

テーマ: ${t}

【分析タスク】
1. 各主張（Claim）を特定し、誰が立証責任を負うかを明確にしてください。
2. Critical Question (CQ) が発せられた際、以下を区別してください:
   - 「単なる疑問 (simple_question)」: 主張者の説明不足を指摘するもので、立証責任は元の主張者に残る
   - 「反証を要する指摘 (counter_claim)」: 新たな証拠や論理を提示するもので、質問者が立証責任を負う

3. 各立証責任の状態を評価してください:
   - active: 証拠がまだ提示されていない
   - fulfilled: 十分な証拠が提示された
   - challenged: 争点化されており、さらなる証拠が必要
   - abandoned: 主張が放棄された

【重要な原則】
- 主張を行った者（Claimant）が、その主張を立証する第一義的な責任を負います。
- 単なる疑問提起では立証責任は移転しません。質問者が「あなたの主張は○○だから間違っている」と反証する場合のみ、質問者に立証責任が発生します。
- CQの種類を正確に識別し、burdenHolderを適切に設定してください。

【出力形式】
JSON形式で、以下の構造に従って出力してください:
- burdens: 立証責任のリスト
- summary: 統計情報

**再度確認: claim、explanation、reasoning等の全てのテキストは日本語で記述してください。**

議論履歴:
${o}
`;try{const{data:l,usage:i}=await te({model:E,contents:[{role:"user",parts:[{text:n}]}],config:{responseMimeType:"application/json",responseSchema:Bs}},a);return{data:l,usage:i}}catch(l){return console.error("Burden analysis streaming failed:",l),{data:{burdens:[],summary:{userActiveBurdens:0,aiActiveBurdens:0,totalResolved:0,criticalQuestionsCount:0}},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Nr=async t=>{var n;if(t.length===0)return{profile:"過去のデータがありません。",usage:{inputTokens:0,outputTokens:0,totalTokens:0}};const o=`
    あなたはディベートの分析官です。あるユーザーの過去の議論履歴（フィードバック）を分析し、
    このユーザーが陥りやすい「論理的弱点」や「癖」を特定してください。

    [過去の履歴]
    ${t.slice(-10).map((l,i)=>`
    [議論${i+1}]
    テーマ: ${l.topic}
    スコア: ${l.feedback.score}
    改善点(Weaknesses): ${l.feedback.weaknesses.join(", ")}
    アドバイス: ${l.feedback.advice}
  `).join(`
`)}

    [タスク]
    1. ユーザーの論理構成における共通の欠点（例：感情的になりやすい、根拠が薄い、ストローマン論法に弱い、など）を特定する。
    2. 次回のトレーニングで重点的に鍛えるべきポイントを提案する。
    3. 200文字以内の日本語で、「コーチへの申し送り事項」としてまとめてください。

    出力例:
    「ユーザーは反論されると感情的になり、論点がずれる傾向があります。特に倫理的なテーマでその傾向が強いです。次はあえて理不尽な攻撃を仕掛け、冷静さを保つ訓練が必要です。」
  `;try{const l=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:o}]}],config:{responseMimeType:"text/plain"}});return{profile:k(((n=l.text)==null?void 0:n.trim())||"分析に失敗しました。"),usage:M(l)}}catch(l){const i=$(l);return console.error("Weakness analysis failed:",i),{profile:"エラーにより分析できませんでした。",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},jr=async(t,r)=>{const a=`
  あなたは論理的思考の教育者です。
  教科書の章「${t}」の理解度を確認するための短い練習問題（クイズ）を1つ作成してください。
  
  学習内容の文脈: ${r}
  
  【要件】
  - ユーザーが回答するための具体的な問題文のみを出力してください。
  - 解答や解説は含めないでください。
  - 問題は短く、シンプルに。
  `;try{const o=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:a}]}]});return{problem:k(o.text||""),usage:M(o)}}catch(o){const n=$(o);return console.error("Textbook problem generation failed:",n),{problem:"問題の生成に失敗しました。",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Tr=async(t,r,a)=>{const o=`
  あなたは論理的思考の教育者です。
  以下の練習問題に対するユーザーの回答を採点・解説してください。
  
  章: ${t}
  問題: ${r}
  ユーザーの回答: ${a}
  
  JSON形式で出力してください:
  {
    "isCorrect": boolean, // 正解ならtrue
    "feedback": string // 解説文（正解の理由、または間違いの指摘とアドバイス）
  }
  `,n={type:s.OBJECT,properties:{isCorrect:{type:s.BOOLEAN},feedback:{type:s.STRING}},required:["isCorrect","feedback"]};try{const l=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:o}]}],config:{responseMimeType:"application/json",responseSchema:n}});if(l.text)return{...JSON.parse(k(l.text)),usage:M(l)};throw new Error("No text")}catch(l){const i=$(l);return console.error("Textbook answer evaluation failed:",i),{isCorrect:!1,feedback:"採点エラー",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},wr=async t=>{let r="";t===1&&(r="「理由」という単語を使わずに、論理の欠陥を指摘してください。"),t===2&&(r="「証拠」「データ」「不十分」「ソース」という単語を使わずに、具体的な事実関係で反論してください。"),t===3&&(r="「論理」「飛躍」「前提」という単語を使わずに、具体的に指摘してください。"),t===4&&(r="「定義」という単語を使わずに、言葉の意味の違いを指摘してください。"),t===5&&(r="「比重」「重要」という単語を使わずに、優先順位の違いを指摘してください。"),t===6&&(r="「論点」「話がずれてる」という単語を使わずに、「それはAの話ではなくBの話だ」のように具体的に軌道修正してください。");const a=`
    ディベート教科書の第2章「反論の型（7 Attack Points）」の理解度クイズを作成してください。
    
    以下の7つの反論タイプのうち、ID: ${t} のタイプに該当する「相手の主張」と「反論の例」を生成してください。
    
    攻撃タイプ一覧:
    0: Claim攻撃 (結論そのものを否定)
    1: Reason攻撃 (理由が不適切)
    2: Evidence攻撃 (証拠が不十分・古い)
    3: Warrant攻撃 (論理の飛躍を突く)
    4: 定義攻撃 (言葉の定義を突く)
    5: 比重攻撃 (Weighing: メリットよりデメリットが大きい)
    6: 論点ずらし指摘 (相手が話を逸らしたことを指摘)

    【重要: 出力制約】
    反論の例文（rebuttal）を作成する際、そのタイプ名（「証拠」「定義」「論点」など）や、正解を直接示唆するメタな単語（「不十分」「ずれている」など）は**絶対に使わないでください**。
    ${r}
    学習者が文脈から推測できるように、自然な会話文で作成してください。

    出力形式(JSON):
    {
      "opponentClaim": "相手の短い主張文",
      "rebuttal": "それに対する反論の例文（ID:${t}のテクニックを使用）",
      "correctTypeIndex": ${t}, // 固定
      "explanation": "なぜそのタイプに分類されるのかの簡潔な解説"
    }
    `,o={type:s.OBJECT,properties:{opponentClaim:{type:s.STRING},rebuttal:{type:s.STRING},correctTypeIndex:{type:s.INTEGER},explanation:{type:s.STRING}},required:["opponentClaim","rebuttal","correctTypeIndex","explanation"]};try{const n=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:a}]}],config:{responseMimeType:"application/json",responseSchema:o}}),l=M(n);if(n.text)return{...JSON.parse(k(n.text)),usage:l};throw new Error("No text")}catch(n){const l=$(n);return console.error("Attack point quiz generation failed:",l),{opponentClaim:"生成エラー",rebuttal:"エラー",correctTypeIndex:0,explanation:"生成に失敗しました",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},vr=async()=>{const t=`
    ディベート教科書の第3章「重み付け（Weighing）」の理解度クイズを作成してください。
    
    相反する2つの価値（AとB）が衝突するジレンマ的なシナリオを作成し、
    その対立を解決するために最も重視すべき「比較基準（Criteria）」を1つ選んでください。
    
    比較基準の選択肢:
    - Magnitude (大きさ・影響範囲)
    - Probability (発生確率・確実性)
    - Timeframe (時間軸・即効性vs持続性)
    - Reversibility (可逆性・取り返しがつくか)

    出力形式(JSON):
    {
      "scenario": "ジレンマを含むシナリオ説明",
      "optionA": "選択肢Aの内容",
      "optionB": "選択肢Bの内容",
      "correctCriteria": "Magnitude", "Probability", "Timeframe", "Reversibility" のいずれか,
      "explanation": "なぜその基準で判断するのが適切かの解説"
    }
    `,r={type:s.OBJECT,properties:{scenario:{type:s.STRING},optionA:{type:s.STRING},optionB:{type:s.STRING},correctCriteria:{type:s.STRING,enum:["Magnitude","Probability","Timeframe","Reversibility"]},explanation:{type:s.STRING}},required:["scenario","optionA","optionB","correctCriteria","explanation"]};try{const a=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:t}]}],config:{responseMimeType:"application/json",responseSchema:r}}),o=M(a);if(a.text)return{...JSON.parse(k(a.text)),usage:o};throw new Error("No text")}catch(a){const o=$(a);return console.error("Weighing quiz generation failed:",o),{scenario:"生成エラー",optionA:"-",optionB:"-",correctCriteria:"Magnitude",explanation:"エラー",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Sr=async()=>{const t=`
    ディベート教科書の第4章「定義闘争」の理解度クイズを作成してください。
    
    ある「言葉」に対して、わざと欠陥のある「定義」を設定し、その定義に対する「反例（Counter-example）」を挙げてください。
    そして、その定義がどのような論理的欠陥を持っているか（過包摂、過小包摂、循環定義）を指定してください。

    欠陥の種類:
    - Over-inclusive (過包摂): 定義が広すぎて、本来含まれないものまで含んでしまう（例: 「鳥とは卵を産む動物」→爬虫類も含まれる）
    - Under-inclusive (過小包摂): 定義が狭すぎて、本来含むべきものを除外してしまう（例: 「鳥とは空を飛ぶ動物」→ペンギンが含まれない）
    - Circular (循環定義): 定義の中にその言葉自体や同義語を使ってしまっている

    出力形式(JSON):
    {
      "word": "定義する言葉",
      "definition": "欠陥のある定義",
      "counterExample": "その定義の矛盾を突く反例",
      "flawType": "Over-inclusive", "Under-inclusive", "Circular" のいずれか,
      "explanation": "なぜその欠陥に分類されるのかの解説"
    }
    `,r={type:s.OBJECT,properties:{word:{type:s.STRING},definition:{type:s.STRING},counterExample:{type:s.STRING},flawType:{type:s.STRING,enum:["Over-inclusive","Under-inclusive","Circular"]},explanation:{type:s.STRING}},required:["word","definition","counterExample","flawType","explanation"]};try{const a=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:t}]}],config:{responseMimeType:"application/json",responseSchema:r}}),o=M(a);if(a.text)return{...JSON.parse(k(a.text)),usage:o};throw new Error("No text")}catch(a){const o=$(a);return console.error("Definition quiz generation failed:",o),{word:"エラー",definition:"-",counterExample:"-",flawType:"Over-inclusive",explanation:"生成エラー",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Ir=async(t,r,a)=>{const o=`
    あなたはロジカルシンキングの鬼コーチです。
    ユーザーが構築した以下の「トゥールミンモデル（論理の三角形）」を厳しく審査してください。
    特に、Data（事実）とClaim（主張）を結びつける**Warrant（論拠）の妥当性**を重視してください。

    Claim: ${t}
    Data: ${r}
    Warrant: ${a}

    出力要件（JSON）:
    1. score: 0-100の点数。
    2. critique: 全体の論評（日本語）。論理の飛躍がないか指摘してください。
    3. warrantImprovement: Warrantをより強固にするための具体的な修正案。
    `,n={type:s.OBJECT,properties:{score:{type:s.INTEGER},critique:{type:s.STRING},warrantImprovement:{type:s.STRING}},required:["score","critique","warrantImprovement"]};try{const l=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:o}]}],config:{responseMimeType:"application/json",responseSchema:n}}),i=M(l);if(l.text)return{result:JSON.parse(k(l.text)),usage:i};throw new Error("No text")}catch(l){const i=$(l);return console.error("Toulmin construction analysis failed:",i),{result:{score:0,critique:"エラーが発生しました",warrantImprovement:"-"},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Er=async(t,r)=>{const a=`
    あなたは意地悪なソクラテスです。
    ユーザーが定義した言葉の「抜け穴」を探し、反例（Counter-example）を突きつけてください。

    対象の言葉: ${t}
    ユーザーの定義: ${r}

    タスク:
    ユーザーの定義には当てはまるが、一般的にはその言葉に含まれないもの（過包摂）、
    あるいはその逆（過小包摂）の事例を探し、「反例」として提示してください。
    もし定義が完璧なら褒めてください。

    出力要件（JSON）:
    1. isRobust: 定義が堅牢ならtrue, 穴があればfalse
    2. counterExample: 具体的な反例（例：「あなたの定義だと、ペンギンも魚になりますが？」）
    3. explanation: なぜその定義が不十分なのかの解説
    `,o={type:s.OBJECT,properties:{isRobust:{type:s.BOOLEAN},counterExample:{type:s.STRING},explanation:{type:s.STRING}},required:["isRobust","counterExample","explanation"]};try{const n=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:a}]}],config:{responseMimeType:"application/json",responseSchema:o}}),l=M(n);if(n.text)return{result:JSON.parse(k(n.text)),usage:l};throw new Error("No text")}catch(n){const l=$(n);return console.error("Definition challenge failed:",l),{result:{isRobust:!1,counterExample:"エラー",explanation:"通信エラー"},usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Ge=["ストローマン (藁人形論法)","論点ずらし (Red Herring)","早急な一般化","誤った二分法","人身攻撃 (Ad Hominem)","お前だって論法 (Tu Quoque)","循環論法","権威への訴え","感情に訴える論証","すべり坂論法 (Slippery Slope)"],Rr=async t=>{let r="",a;switch(t){case _.EVIDENCE_FILL:r=`
            不完全な主張（Claim）を1つ生成してください（日本語で）。
            形式: "主張: [主張文]。なぜなら、_________。"
            ユーザーはこの空白部分（根拠）を埋める必要があります。
            JSONで出力: { "incompleteClaim": string }
            `,a={type:s.OBJECT,properties:{incompleteClaim:{type:s.STRING}},required:["incompleteClaim"]};break;case _.FALLACY_QUIZ:{const o=Ge[Math.floor(Math.random()*Ge.length)];r=`
            論理的誤謬（Fallacy）に関する4択クイズを作成してください。
            
            ターゲット誤謬: ${o}
            
            タスク:
            1. 「${o}」を含む短い例文を作成し、questionTextとしてください。
            2. その誤謬名（${o}）を正解（correctFallacy）として設定してください。
            3. 他の誤謬名を3つダミーの選択肢として選び、正解と混ぜてoptions配列（計4つ）を作成してください。
            
            全て日本語で出力してください。
            JSON出力:
            {
              "questionText": "誤謬を含む例文",
              "correctFallacy": "正解の誤謬名",
              "options": ["正解", "ダミー1", "ダミー2", "ダミー3"] // シャッフルして,
              "explanation": "なぜこれがその誤謬なのかの解説と、見抜くためのポイント"
            }
            `,a={type:s.OBJECT,properties:{questionText:{type:s.STRING},correctFallacy:{type:s.STRING},options:{type:s.ARRAY,items:{type:s.STRING}},explanation:{type:s.STRING}},required:["questionText","correctFallacy","options","explanation"]};break}case _.ISSUE_PUZZLE:r=`
            論理的な文章を構成する4つの要素（Claim, Data, Warrant, Conclusion）を日本語で生成し、ランダムな順序で配列に格納してください。
            ユーザーはこれを正しい論理的順序に並べ替えます。
            JSON出力:
            {
               "segments": [
                  { "id": "1", "text": "...", "correctOrder": 1 },
                  ...
               ]
            }
            `,a={type:s.OBJECT,properties:{segments:{type:s.ARRAY,items:{type:s.OBJECT,properties:{id:{type:s.STRING},text:{type:s.STRING},correctOrder:{type:s.INTEGER}},required:["id","text","correctOrder"]}}},required:["segments"]};break;case _.COMBO_REBUTTAL:r=`
             議論における短い「主張」を1つ日本語で生成してください。ユーザーが即座に反論するためのものです。
             JSON出力: { "claim": string }
             `,a={type:s.OBJECT,properties:{claim:{type:s.STRING}},required:["claim"]};break;case _.FERMI_ESTIMATION:r=`
             フェルミ推定の問題を1つ日本語で生成してください。
             
             条件:
             - 日本国内の事象に関するもの（例：ピアノ調律師の数、コンビニの数、マンホールの数など）
             - 答えが直感的には分からないが、論理的に分解して概算できるもの。
             - 一般的な難易度。
             
             JSON出力: { "question": string }
             `,a={type:s.OBJECT,properties:{question:{type:s.STRING}},required:["question"]};break;case _.LATERAL_THINKING:r=`
             水平思考（ラテラルシンキング）パズル、いわゆる「ウミガメのスープ」の問題を1つ作成してください。
             
             タスク:
             1. 不可解だが、理由を聞けば納得できる「状況（Situation）」を作成する。
             2. その背後にある「真相（Hidden Truth）」を作成する。
             
             条件:
             - 状況だけでは意味不明だが、論理と発想の転換で真相にたどり着けるもの。
             - グロテスクすぎたり、不快な内容は避けること。
             
             JSON出力: { "situation": string, "hiddenTruth": string }
             `,a={type:s.OBJECT,properties:{situation:{type:s.STRING},hiddenTruth:{type:s.STRING}},required:["situation","hiddenTruth"]};break;case _.ACTIVE_INOCULATION:r=`
             能動的接種(Active Inoculation)演習の課題を生成してください。

             タスク:
             ユーザーに「特定の詭弁・論理的誤謬を意図的に使って、説得力のあるメールや主張文を書かせる」クリエイティブな課題を作成します。

             課題の構造:
             1. scenario: シナリオ設定(例: 「あなたは成績不振の学生です。教師を説得して合格させてもらう必要があります」)
             2. requiredFallacies: 必ず使用すべき詭弁・誤謬のリスト(最低4つ)
             3. targetAudience: 説得対象(例: 「厳しい教師」「懐疑的な上司」「慎重な顧客」など)
             4. objective: 達成すべき目標(例: 「単位を取得する」「予算を承認してもらう」など)

             条件:
             - requiredFallaciesには、${Ge.join(", ")}から4-6個を選択してください
             - シナリオは倫理的に問題ないが、現実的な説得場面を想定してください
             - ユーザーが創造的に詭弁を組み合わせられるよう、適度に挑戦的な課題にしてください

             JSON出力: {
               "scenario": string,
               "requiredFallacies": string[],
               "targetAudience": string,
               "objective": string
             }
             `,a={type:s.OBJECT,properties:{scenario:{type:s.STRING},requiredFallacies:{type:s.ARRAY,items:{type:s.STRING}},targetAudience:{type:s.STRING},objective:{type:s.STRING}},required:["scenario","requiredFallacies","targetAudience","objective"]};break}try{const o=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:r}]}],config:{responseMimeType:"application/json",responseSchema:a}}),n=M(o);if(o.text)return{data:JSON.parse(k(o.text)),usage:n};throw new Error("No text")}catch(o){const n=$(o);return console.error("Mini game content generation failed:",n),{data:null,usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Cr=async(t,r,a)=>{let o="";switch(t){case _.EVIDENCE_FILL:o="論理性(Logic)、具体性(Specifics)、説得力(Persuasion)。なぜそのスコアなのか、どうすればより良くなるか（改善点）を具体的に。";break;case _.FALLACY_QUIZ:o="正誤判定。なぜその選択肢が正解/不正解なのかの解説。";break;case _.ISSUE_PUZZLE:o="論理的な順序の解説。";break;case _.COMBO_REBUTTAL:o="反論の有効性と改善点。即座の返しとして鋭いか。";break;case _.FERMI_ESTIMATION:o=`
            フェルミ推定の評価:
            1. 分解アプローチ（Logic Breakdown）: 問題を適切な要素に分解できているか（例: 人口×普及率×...）。最終的な数値の正確さよりも、この**プロセスの妥当性**を8割重視して採点してください。
            2. 仮説設定: 各要素に置いた仮定の数値が、常識的な範囲から大きく逸脱していないか。
            3. 計算結果: ロジックに基づいた計算ができているか。
            
            フィードバックには、より良い分解モデルの例（模範解答）を含めてください。
            `;break;case _.LATERAL_THINKING:o=`
            水平思考パズルの評価:
            真相（Hidden Truth）: ${r.hiddenTruth}
            
            ユーザーの推論が、真相にどれだけ迫っているかを評価してください。
            - 核心を突いている場合: 高得点。
            - 良い視点だが不完全: 部分点とヒント。
            - 全く見当違い: 低得点と、思考を広げるためのヒント。
            
            フィードバックは、ユーザーの柔軟な発想を褒めつつ、真相への論理的な繋がりを解説してください。
            `;break;case _.ACTIVE_INOCULATION:o=`
            能動的接種演習の評価:
            必須の詭弁・誤謬: ${r.requiredFallacies.join(", ")}

            評価基準:
            1. **詭弁の使用(60点)**: 指定された詭弁を正確に、かつ自然に使用できているか
               - 各詭弁の使用を個別に確認してください
               - 使用されている詭弁: リスト化
               - 欠けている詭弁: リスト化
               - 各詭弁が15点満点(4つで60点、5つで75点、6つで90点)

            2. **説得力(25点)**: 詭弁を使っているにもかかわらず、表面的には説得力があるか
               - 文章の構成が論理的に見えるか
               - 感情に訴える要素が効果的に使われているか
               - ターゲット(${r.targetAudience})に適した言葉選びか

            3. **創造性(15点)**: 複数の詭弁を巧みに組み合わせているか
               - 詭弁同士のシナジーがあるか
               - 独創的なアプローチが見られるか

            フィードバック構成:
            - 使用された詭弁の詳細な分析(どこでどの詭弁が使われているか)
            - 欠けている詭弁の指摘
            - 詭弁の効果的な組み合わせ方の提案
            - **重要**: この演習の目的は「詭弁を見抜く力を養うこと」であり、実際に詭弁を使うことを推奨するものではないことを明記してください
            `;break}const n=`
    ミニゲームの回答を採点してください。
    Game Type: ${t}
    Question Data: ${JSON.stringify(r)}
    User Answer: ${JSON.stringify(a)}
    
    採点基準:
    ${o}
    
    解説（feedback）は日本語で記述し、学習者のためになる詳しいフィードバックを提供してください。
    **特にスコアの根拠（なぜ減点されたか、どうすれば満点だったか）を詳しく説明してください。**

    JSON出力: { "score": number, "feedback": string }
    `,l={type:s.OBJECT,properties:{score:{type:s.INTEGER},feedback:{type:s.STRING}},required:["score","feedback"]};try{const i=await G.models.generateContent({model:E,contents:[{role:"user",parts:[{text:n}]}],config:{responseMimeType:"application/json",responseSchema:l}}),c=M(i);if(i.text)return{...JSON.parse(k(i.text)),usage:c};throw new Error("No text")}catch(i){const c=$(i);return console.error("Mini game answer evaluation failed:",c),{score:0,feedback:"Error",usage:{inputTokens:0,outputTokens:0,totalTokens:0}}}},Ms=()=>{const t=h.useCallback((i,c=3e3)=>{V.success(i,{duration:c})},[]),r=h.useCallback((i,c=5e3)=>{V.error(i,{duration:c})},[]),a=h.useCallback((i,c=3e3)=>{V(i,{duration:c,icon:"ℹ️"})},[]),o=h.useCallback((i,c=4e3)=>{V(i,{duration:c,icon:"⚠️",style:{background:"#fef3c7",color:"#92400e"}})},[]),n=h.useCallback(i=>V.loading(i),[]),l=h.useCallback(i=>{i?V.dismiss(i):V.dismiss()},[]);return{showSuccess:t,showError:r,showInfo:a,showWarning:o,showLoading:n,dismiss:l}},$s=({data:t})=>{const r=t.speaker==="PRO",a=r?"flex-row":"flex-row-reverse",o=r?"bg-indigo-50 border-indigo-200 text-indigo-900":"bg-rose-50 border-rose-200 text-rose-900",n=r?"bg-indigo-600":"bg-rose-600",l=t.speakerName||(r?"Alice":"Bob");return e.jsxs("div",{className:`flex items-end gap-3 animate-message-in relative ${a} mb-6`,children:[e.jsxs("div",{className:`w-10 h-10 rounded-full flex flex-col items-center justify-center shrink-0 shadow-sm ${n} text-white relative z-10`,children:[r?e.jsx(We,{size:18}):e.jsx(We,{size:18,className:"transform scale-x-[-1]"}),e.jsx("span",{className:"absolute -bottom-5 text-[10px] font-bold text-slate-500 whitespace-nowrap",children:l})]}),e.jsxs("div",{className:"flex flex-col max-w-[85%] md:max-w-[70%] relative gap-2",children:[e.jsx("div",{className:`p-4 rounded-2xl border ${o} shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap rounded-${r?"bl":"br"}-none`,children:t.text}),e.jsxs("div",{className:`mt-2 p-3 rounded-xl border-l-4 shadow-sm text-xs bg-white animate-fade-in ${t.analysis.type==="LOGIC"?"border-l-blue-500":t.analysis.type==="FALLACY"?"border-l-red-500":t.analysis.type==="RHETORIC"?"border-l-purple-500":"border-l-green-500"}`,children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1.5 font-bold",children:[t.analysis.type==="LOGIC"&&e.jsx(ye,{size:14,className:"text-blue-500"}),t.analysis.type==="FALLACY"&&e.jsx(Ne,{size:14,className:"text-red-500"}),t.analysis.type==="RHETORIC"&&e.jsx(vt,{size:14,className:"text-purple-500"}),t.analysis.type==="STRATEGY"&&e.jsx(je,{size:14,className:"text-green-500"}),e.jsx("span",{className:`uppercase tracking-wider ${t.analysis.type==="LOGIC"?"text-blue-700":t.analysis.type==="FALLACY"?"text-red-700":t.analysis.type==="RHETORIC"?"text-purple-700":"text-green-700"}`,children:t.analysis.highlight})]}),e.jsx("p",{className:"text-slate-600 leading-relaxed mb-1.5",children:t.analysis.comment}),t.analysis.score&&e.jsx("div",{className:"flex justify-end",children:e.jsxs("span",{className:"text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold border border-slate-200",children:["Quality: ",t.analysis.score,"/10"]})})]})]})]})},fe=({text:t,highlightQuote:r,detectedFallacy:a,onHighlightClick:o})=>{const n=r==null?void 0:r.trim();if(!n||!t.includes(n))return e.jsx(e.Fragment,{children:t});const l=t.split(n);return e.jsx(e.Fragment,{children:l.map((i,c)=>e.jsxs(oe.Fragment,{children:[i,c<l.length-1&&e.jsx("span",{className:"bg-yellow-100 decoration-amber-500 decoration-wavy underline decoration-2 underline-offset-4 px-1 rounded mx-0.5 font-medium animate-pop-in cursor-help transition-colors hover:bg-yellow-200",title:`検出された詭弁: ${a}`,onClick:d=>{d.stopPropagation(),o&&o()},children:n})]},c))})},xe=[{bg:"bg-rose-50",text:"text-rose-900",border:"border-rose-200",iconColor:"text-rose-600"},{bg:"bg-orange-50",text:"text-orange-900",border:"border-orange-200",iconColor:"text-orange-600"},{bg:"bg-indigo-50",text:"text-indigo-900",border:"border-indigo-200",iconColor:"text-indigo-600"},{bg:"bg-purple-50",text:"text-purple-900",border:"border-purple-200",iconColor:"text-purple-600"},{bg:"bg-cyan-50",text:"text-cyan-900",border:"border-cyan-200",iconColor:"text-cyan-600"},{bg:"bg-lime-50",text:"text-lime-900",border:"border-lime-200",iconColor:"text-lime-600"},{bg:"bg-fuchsia-50",text:"text-fuchsia-900",border:"border-fuchsia-200",iconColor:"text-fuchsia-600"},{bg:"bg-emerald-50",text:"text-emerald-900",border:"border-emerald-200",iconColor:"text-emerald-600"}],_s=(t,r=[])=>{const a=r.findIndex(n=>t.includes(n.name)||n.name.includes(t));if(a!==-1)return xe[a%xe.length];let o=0;for(let n=0;n<t.length;n++)o=t.charCodeAt(n)+((o<<5)-o);return xe[Math.abs(o)%xe.length]},Ls=({text:t,role:r,isStoryMode:a,isFacilitationMode:o,stakeholders:n,highlightQuote:l,detectedFallacy:i,onHighlightClick:c})=>{if(r==="user"){const u=o?"bg-green-600":"bg-teal-600";return e.jsxs("div",{className:"flex flex-row-reverse items-end gap-3 animate-message-in mb-6",children:[e.jsx("div",{className:`w-8 h-8 rounded-full ${u} text-white flex items-center justify-center shrink-0 shadow-sm`,children:e.jsx(me,{size:18})}),e.jsx("div",{className:`max-w-[85%] md:max-w-[75%] ${u} text-white p-4 rounded-2xl rounded-br-none shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap`,children:t})]})}const d=t.match(/^\[EVENT\](.*)/m);let x=null,b=t;if(d&&(x=d[1].trim(),b=t.replace(d[0],"").trim()),!b.includes("[")||!b.includes("]"))return e.jsxs("div",{className:"flex items-end gap-3 animate-message-in relative flex-row mb-6",children:[e.jsx("div",{className:`w-8 h-8 rounded-full ${a?"bg-teal-600":"bg-emerald-600"} text-white flex items-center justify-center shrink-0 shadow-sm self-end`,children:a?e.jsx(He,{size:18}):e.jsx(J,{size:18})}),e.jsxs("div",{className:"flex flex-col gap-4 w-full max-w-[85%] md:max-w-[75%]",children:[x&&e.jsxs("div",{className:"animate-pop-in bg-slate-800 text-yellow-400 p-4 rounded-xl border-l-4 border-yellow-500 shadow-md font-bold text-sm flex items-center gap-3",children:[e.jsx(Me,{size:20,className:"animate-pulse"}),e.jsx("span",{children:x})]}),b&&e.jsx("div",{className:"p-4 bg-white rounded-2xl rounded-bl-none border border-slate-100 text-slate-800 shadow-sm text-sm md:text-base leading-relaxed",children:e.jsx(fe,{text:b,highlightQuote:l,detectedFallacy:i,onHighlightClick:c})})]})]});const g=b.split(`
`),y=[];let m="System",N=[];const j=/^[\s*]*\[([^\]]+)\][:：]?\s*/;return g.forEach(u=>{const p=u.match(j);p?(N.length>0&&(y.push({speaker:m,text:N.join(`
`)}),N=[]),m=p[1],N.push(u.replace(p[0],"").trim())):N.push(u)}),N.length>0&&y.push({speaker:m,text:N.join(`
`)}),e.jsxs("div",{className:"flex items-end gap-3 animate-message-in relative flex-row mb-6",children:[e.jsx("div",{className:`w-8 h-8 rounded-full ${a?"bg-teal-600":"bg-emerald-600"} text-white flex items-center justify-center shrink-0 shadow-sm self-end`,children:a?e.jsx(He,{size:18}):e.jsx(J,{size:18})}),e.jsxs("div",{className:"flex flex-col gap-3 items-start w-full max-w-[85%] md:max-w-[75%]",children:[x&&e.jsxs("div",{className:"animate-pop-in bg-slate-800 text-yellow-400 p-3 rounded-xl border-l-4 border-yellow-500 shadow-md font-bold text-sm flex items-center gap-2 w-full mb-2",children:[e.jsx(Me,{size:18,className:"animate-pulse shrink-0"}),e.jsx("span",{children:x})]}),y.map((u,p)=>{if(!u.text.trim())return null;let S="bg-white text-slate-800 border-slate-100";const B=u.speaker;let f=e.jsx(J,{size:14,className:"text-slate-500"}),T="text-slate-500",C=!0;if(a)if(u.speaker==="System")C=!1,S="bg-slate-50/80 text-slate-600 border-slate-200 italic rounded-bl-none";else if(u.speaker.includes("GM")||u.speaker.includes("Game Master"))S="bg-slate-100 text-slate-800 border-slate-300 rounded-bl-none italic",f=e.jsx(J,{size:14,className:"text-slate-600"}),T="text-slate-600";else{const z=_s(u.speaker,n);S=`${z.bg} ${z.text} ${z.border} rounded-bl-none`,f=e.jsx(me,{size:14,className:z.iconColor}),T=z.iconColor}else o&&(u.speaker.includes("Aさん")||u.speaker.includes("感情")?(S="bg-red-50 text-red-900 border-red-200 rounded-bl-none",f=e.jsx(St,{size:14,className:"text-red-500"}),T="text-red-500"):u.speaker.includes("Bさん")||u.speaker.includes("論理")?(S="bg-blue-50 text-blue-900 border-blue-200 rounded-bl-none",f=e.jsx(ye,{size:14,className:"text-blue-500"}),T="text-blue-500"):u.speaker==="System"&&(C=!1,S="bg-slate-50 text-slate-500 border-slate-100 text-xs"));return e.jsxs("div",{className:"flex flex-col items-start max-w-full",children:[C&&e.jsxs("span",{className:`text-[10px] font-bold mb-1 flex items-center gap-1 ml-1 ${T}`,children:[f," ",B]}),e.jsx("div",{className:`p-4 rounded-2xl border ${S} shadow-sm whitespace-pre-wrap text-sm md:text-base leading-relaxed`,children:e.jsx(fe,{text:u.text,highlightQuote:l,detectedFallacy:i,onHighlightClick:c})})]},p)})]})]})},Ke=[{key:"CLAIM",label:"主張 (Claim)",short:"C",desc:"結論・言いたいこと"},{key:"REASON",label:"理由 (Reason)",short:"R",desc:"なぜそう思うか"},{key:"EVIDENCE",label:"証拠 (Evidence)",short:"E",desc:"客観的な事実・データ"},{key:"WARRANT",label:"論拠 (Warrant)",short:"W",desc:"理由と主張をつなぐ論理"},{key:"BACKING",label:"裏付 (Backing)",short:"B",desc:"論拠を支える証拠"},{key:"REBUTTAL",label:"考慮 (Rebuttal)",short:"Re",desc:"反論への想定・譲歩"},{key:"QUALIFICATION",label:"限定 (Qual.)",short:"Q",desc:"確信度の限定（おそらく等）"}],zs=({score:t,variant:r="compact"})=>{const a=n=>n<.2?"bg-slate-100 text-slate-300":n<.5?"bg-indigo-100 text-indigo-400":n<.8?"bg-indigo-300 text-indigo-700":"bg-indigo-600 text-white shadow-sm",o=n=>Math.max(5,n*100);return r==="detailed"?e.jsxs("div",{className:"mt-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-fade-in space-y-6",children:[e.jsxs("div",{children:[e.jsxs("h4",{className:"text-xs font-black text-slate-400 uppercase mb-3 border-b border-slate-100 pb-2 flex items-center gap-2",children:[e.jsx(et,{size:14})," 構成要素スコア (Toulmin Components)"]}),e.jsx("div",{className:"space-y-3",children:Ke.map(n=>{var c;const l=t.scores[n.key]||0,i=(c=t.snippets)==null?void 0:c[n.key];return e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsxs("span",{className:"font-bold text-slate-700 flex items-center gap-2",children:[n.label,l>.7&&e.jsx("span",{className:"text-indigo-600",children:"●"})]}),e.jsxs("span",{className:"font-mono text-slate-400",children:[Math.round(l*100),"%"]})]}),e.jsx("div",{className:"w-full bg-slate-100 h-1.5 rounded-full overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full transition-all duration-500 ${a(l)}`,style:{width:`${o(l)}%`}})}),i&&e.jsxs("p",{className:"text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100 mt-0.5",children:['"',i,'"']})]},n.key)})})]}),t.scheme&&e.jsxs("div",{className:"pt-4 border-t border-slate-100",children:[e.jsxs("h4",{className:"text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2",children:[e.jsx(Qe,{size:14,className:"text-indigo-500"})," 議論スキームの特定 (Argument Scheme)"]}),e.jsxs("div",{className:"bg-indigo-50 border border-indigo-100 rounded-xl p-3",children:[e.jsxs("span",{className:"text-xs font-black text-indigo-700 block mb-1 uppercase tracking-tighter",children:["Scheme: ",t.scheme.label]}),e.jsx("p",{className:"text-xs text-indigo-900 leading-relaxed",children:t.scheme.description})]})]}),t.criticalQuestions&&t.criticalQuestions.length>0&&e.jsxs("div",{className:"pt-4 border-t border-slate-100",children:[e.jsxs("h4",{className:"text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2",children:[e.jsx($e,{size:14,className:"text-blue-500"})," 批判的質問の検証 (Critical Questions)"]}),e.jsx("div",{className:"space-y-2",children:t.criticalQuestions.map((n,l)=>e.jsx("div",{className:`p-3 rounded-xl border text-xs leading-relaxed transition-all ${n.isAddressed?"bg-emerald-50 border-emerald-100":"bg-rose-50 border-rose-100"}`,children:e.jsxs("div",{className:"flex items-start gap-2",children:[n.isAddressed?e.jsx(Te,{size:14,className:"text-emerald-500 mt-0.5 shrink-0"}):e.jsx(_e,{size:14,className:"text-rose-500 mt-0.5 shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:`font-bold mb-1 ${n.isAddressed?"text-emerald-800":"text-rose-800"}`,children:n.question}),e.jsx("p",{className:"text-slate-600 opacity-90",children:n.aiComment})]})]})},l))})]}),t.summary&&e.jsx("div",{className:"mt-4 pt-3 border-t border-slate-100",children:e.jsxs("p",{className:"text-xs font-bold text-slate-700 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200",children:[e.jsx("span",{className:"text-blue-600 mr-2 font-black",children:"AI分析概要:"}),t.summary]})})]}):e.jsxs("div",{className:"mt-2 animate-fade-in select-none",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsxs("span",{className:"text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1",children:[e.jsx(Qe,{size:10})," Logic Mapping"]}),t.scheme&&e.jsx("span",{className:"text-[8px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-bold uppercase",children:t.scheme.label})]}),e.jsx("div",{className:"flex gap-0.5 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 p-0.5 w-fit",children:Ke.map(n=>{var i;const l=t.scores[n.key]||0;return e.jsx("div",{className:`w-6 h-6 flex items-center justify-center text-[9px] font-bold rounded-sm transition-colors cursor-help ${a(l)}`,title:`${n.label}: ${(l*100).toFixed(0)}%${(i=t.snippets)!=null&&i[n.key]?`
"${t.snippets[n.key]}"`:""}`,children:n.short},n.key)})}),t.summary&&e.jsx("p",{className:"text-[10px] text-slate-500 mt-1 pl-1 max-w-xs leading-tight opacity-80 font-medium",children:t.summary})]})},Ps=oe.memo(({text:t,role:r,analysis:a,structureScore:o,highlightQuote:n,detectedFallacy:l,onHighlightClick:i})=>{const c=r==="user",d=()=>a?e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"whitespace-pre-wrap",children:a.segments.map((x,b)=>e.jsx("span",{className:`${x.type==="fact"?"decoration-blue-400/50 decoration-2 underline underline-offset-4":x.type==="opinion"?"decoration-orange-400/50 decoration-2 underline underline-offset-4":""}`,title:x.type==="fact"?"客観的事実":x.type==="opinion"?"主観的意見":"",children:x.text},b))}),a.opinionRatio>.8&&a.segments.length>2&&e.jsxs("div",{className:"flex items-center gap-2 text-[10px] bg-orange-100/50 text-orange-800 p-2 rounded-lg border border-orange-100 animate-fade-in",children:[e.jsx(Ne,{size:12,className:"shrink-0"}),e.jsx("span",{children:"主観的な意見が多いようです。客観的な事実（データ）を補強すると説得力が増します。"})]})]}):e.jsx(fe,{text:t,highlightQuote:n,detectedFallacy:l,onHighlightClick:i});return e.jsx("div",{className:"flex flex-col w-full mb-6",children:e.jsxs("div",{className:`flex items-end gap-3 animate-message-in relative ${c?"flex-row-reverse":"flex-row"}`,children:[e.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${c?"bg-blue-600 text-white":"bg-white border border-slate-200 text-blue-600"}`,children:c?e.jsx(me,{size:18}):e.jsx(J,{size:18})}),e.jsxs("div",{className:`flex flex-col max-w-[85%] md:max-w-[75%] ${c?"items-end":"items-start"}`,children:[e.jsx("div",{className:`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap relative w-full ${c?"bg-blue-600 text-white rounded-br-none":"bg-white border border-slate-100 text-slate-800 rounded-bl-none"}`,children:c?d():e.jsx(fe,{text:t,highlightQuote:n,detectedFallacy:l,onHighlightClick:i})}),c&&o&&e.jsx(zs,{score:o})]})]})})},(t,r)=>t.text===r.text&&t.role===r.role&&t.analysis===r.analysis&&t.structureScore===r.structureScore&&t.highlightQuote===r.highlightQuote&&t.detectedFallacy===r.detectedFallacy),lt=oe.memo(({msg:t,settings:r,analysis:a,demoParsedData:o,structureScore:n,supportMode:l,detectedFallacy:i,highlightQuote:c,onHighlightClick:d})=>{var y;const x=r.mode===v.DEMO,b=r.mode===v.STORY,g=r.mode===v.FACILITATION;return x?t.role==="user"||!o?null:e.jsx($s,{data:o}):g||b?e.jsx(Ls,{text:t.text,role:t.role,isStoryMode:b,isFacilitationMode:g,stakeholders:(y=r.storyScenario)==null?void 0:y.stakeholders,highlightQuote:c,detectedFallacy:i,onHighlightClick:d}):e.jsx(Ps,{text:t.text,role:t.role,analysis:a,structureScore:n,highlightQuote:c,detectedFallacy:i,onHighlightClick:d})}),it=h.forwardRef(({messages:t,settings:r,analyses:a,demoParsedMessages:o,detectedFallacy:n,highlightQuote:l,onHighlightClick:i,containerHeight:c},d)=>{const[x,b]=Tt(),g=180,y=()=>{x&&t.length>0&&x.scrollToRow(t.length-1,"end")};h.useImperativeHandle(d,()=>({scrollToBottom:y})),h.useEffect(()=>{y()},[t.length,x]);const m=({index:N})=>{const j=t[N];return e.jsx(lt,{msg:j,index:N,settings:r,analysis:a[j.id],demoParsedData:o[j.id],structureScore:j.structureAnalysis,supportMode:!0,detectedFallacy:n,highlightQuote:l,onHighlightClick:i})};return e.jsx(wt,{listRef:b,defaultHeight:c,rowCount:t.length,rowHeight:g,rowComponent:m,overscanCount:5})});it.displayName="VirtualizedMessageList";const Fs=oe.memo(({inputText:t,setInputText:r,isSending:a,supportMode:o,onSendMessage:n,onSendText:l,onGetAdvice:i,isGettingAdvice:c,onGetStrategy:d,isGeneratingStrategy:x,onToggleBuilder:b,onToggleGym:g,isThinkingGymMode:y,isStudyMode:m,isDrillMode:N,isDemoMode:j,hasMessages:u,isAutoPlaying:p,onToggleAutoPlay:S,onNextTurn:B})=>{const f=h.useRef(null);return h.useEffect(()=>{var T;j||(T=f.current)==null||T.focus()},[j]),j?e.jsxs("div",{className:"p-4 bg-white border-t border-slate-200 relative z-20",children:[e.jsxs("div",{className:"max-w-xl mx-auto flex items-center justify-center gap-4",children:[e.jsxs("button",{onClick:S,className:`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md ${p?"bg-amber-100 text-amber-700 border-2 border-amber-300 hover:bg-amber-200":"bg-emerald-600 text-white hover:bg-emerald-700"}`,children:[p?e.jsx(It,{size:20,fill:"currentColor"}):e.jsx(Et,{size:20,fill:"currentColor"}),e.jsx("span",{children:p?"一時停止":"自動再生"})]}),e.jsxs("button",{onClick:B,disabled:a||p,className:"flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-bold hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",children:[a?e.jsx(U,{size:20,className:"animate-spin"}):e.jsx(Rt,{size:20}),e.jsx("span",{children:"次の発言"})]})]}),e.jsx("div",{className:"text-center mt-2 text-xs text-slate-400",children:p?"自動再生中...":"自分のペースで進めることができます"})]}):e.jsx("div",{className:"p-4 bg-white border-t border-slate-200 relative z-20",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[m&&e.jsxs("div",{className:"flex gap-2 mb-2 overflow-x-auto scrollbar-hide pb-1",children:[e.jsxs("button",{type:"button",onClick:()=>l==null?void 0:l("理解しました、次のステップへ進んでください。"),disabled:a,className:"whitespace-nowrap px-4 py-2 bg-purple-600 text-white rounded-full text-xs font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-sm flex items-center gap-1 shrink-0",children:["理解しました ",e.jsx(tt,{size:12})]}),e.jsx("button",{type:"button",onClick:()=>l==null?void 0:l("具体例をもっと教えてください。"),disabled:a,className:"whitespace-nowrap px-4 py-2 bg-white text-purple-600 rounded-full text-xs font-bold hover:bg-purple-50 transition-colors disabled:opacity-50 border border-purple-200 shadow-sm shrink-0",children:"具体例をもっと"}),e.jsx("button",{type:"button",onClick:()=>l==null?void 0:l("なぜそうなるのですか？詳しく教えてください。"),disabled:a,className:"whitespace-nowrap px-4 py-2 bg-white text-purple-600 rounded-full text-xs font-bold hover:bg-purple-50 transition-colors disabled:opacity-50 border border-purple-200 shadow-sm shrink-0",children:"詳しく理由を"})]}),e.jsxs("form",{onSubmit:n,className:"relative flex gap-2 items-center",children:[e.jsxs("div",{className:"flex-1 relative",children:[e.jsx("input",{ref:f,type:"text",value:t,onChange:T=>r(T.target.value),placeholder:"メッセージを入力...",className:"w-full pl-4 pr-20 py-3.5 rounded-2xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm text-base bg-white text-slate-900 placeholder:text-slate-400",disabled:a}),e.jsx("div",{className:"absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1",children:o&&e.jsxs("button",{type:"button",onClick:i,disabled:c,className:"p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group disabled:opacity-70 disabled:cursor-wait",title:"AI添削・分析を実行",children:[c?e.jsx(U,{size:18,className:"animate-spin text-blue-500"}):e.jsx(he,{size:18}),!c&&e.jsx("span",{className:"absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",children:"AI添削"})]})})]}),!m&&!N&&!y&&e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:d,disabled:x||!u,className:"p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-all border border-indigo-200 shadow-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed",title:"戦略ナビゲーター",children:x?e.jsx(U,{size:20,className:"animate-spin"}):e.jsx(ze,{size:20})}),e.jsx("button",{type:"button",onClick:b,className:"p-3.5 rounded-2xl bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-all border border-slate-200 shadow-sm flex-shrink-0",title:"論理構築ビルダーを開く",children:e.jsx(be,{size:20})})]}),y&&e.jsx("button",{type:"button",onClick:g,className:"p-3.5 rounded-2xl bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all border border-indigo-200 shadow-sm flex-shrink-0 animate-pulse",title:"思考フレームワーク入力",children:e.jsx(ye,{size:20})}),e.jsx(ne,{type:"submit",disabled:!t.trim()||a,className:`rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${t.trim()?"bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 active:scale-95":"bg-slate-300"}`,children:a?e.jsx(U,{size:24,className:"animate-spin"}):e.jsx(Ct,{size:24,className:"ml-0.5"})})]})]})})}),Xe={[A.CLAIM]:{color:"bg-blue-500",icon:je,label:"主張"},[A.EVIDENCE]:{color:"bg-orange-500",icon:kt,label:"根拠"},[A.REBUTTAL]:{color:"bg-red-500",icon:we,label:"反論"},[A.DEFENSE]:{color:"bg-emerald-500",icon:Pe,label:"防御"},[A.FALLACY]:{color:"bg-purple-500",icon:Ne,label:"誤謬"},[A.FRAMING]:{color:"bg-indigo-500",icon:ze,label:"論点"},[A.CONCESSION]:{color:"bg-teal-500",icon:At,label:"協調"},[A.SYNTHESIS]:{color:"bg-slate-500",icon:et,label:"整理"}},Js=t=>{switch(t){case"logical_attack":return{label:"論理攻撃",badgeBg:"bg-rose-50",badgeText:"text-rose-700",badgeBorder:"border-rose-200",cardBorder:"border-l-rose-500",cardHover:"hover:bg-rose-50"};case"reframing":return{label:"視点転換",badgeBg:"bg-violet-50",badgeText:"text-violet-700",badgeBorder:"border-violet-200",cardBorder:"border-l-violet-500",cardHover:"hover:bg-violet-50"};case"concession":return{label:"部分同意",badgeBg:"bg-emerald-50",badgeText:"text-emerald-700",badgeBorder:"border-emerald-200",cardBorder:"border-l-emerald-500",cardHover:"hover:bg-emerald-50"};default:return{label:t,badgeBg:"bg-slate-50",badgeText:"text-slate-600",badgeBorder:"border-slate-200",cardBorder:"border-l-slate-400",cardHover:"hover:bg-slate-50"}}},qs=oe.memo(({advice:t,detectedFallacy:r,fallacyExplanation:a,sentimentScore:o,strategyData:n,onClose:l,onUseStrategy:i,onOpenRebuttalCard:c})=>{const d=x=>{const b=(x+1)/2*100;let g="bg-slate-400",y="中立";return x<-.4?(g="bg-red-500",y="攻撃的/ネガティブ"):x>.4?(g="bg-emerald-500",y="建設的/ポジティブ"):(g="bg-blue-400",y="冷静/論理的"),e.jsxs("div",{className:"mt-3 p-3 bg-white/60 rounded-lg border border-blue-100",children:[e.jsxs("div",{className:"flex justify-between items-center mb-1.5",children:[e.jsxs("div",{className:"flex items-center gap-1.5 text-xs font-bold text-slate-600",children:[e.jsx(Ot,{size:14}),e.jsx("span",{children:"感情・トーン分析"})]}),e.jsxs("span",{className:`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${g}`,children:[y," (",x>0?"+":"",x.toFixed(1),")"]})]}),e.jsxs("div",{className:"h-2 w-full bg-slate-200 rounded-full overflow-hidden relative",children:[e.jsx("div",{className:"absolute top-0 bottom-0 left-1/2 w-0.5 bg-white z-10"}),e.jsx("div",{className:`h-full transition-all duration-500 ease-out ${g}`,style:{width:`${b}%`}})]})]})};return e.jsx("div",{className:"w-full bg-gradient-to-b from-blue-50/95 to-white/95 backdrop-blur-md border-t border-blue-200 shadow-2xl animate-fade-in-up max-h-[60vh] overflow-y-auto",children:e.jsxs("div",{className:"w-full p-4 flex items-start gap-4",children:[e.jsx("div",{className:"shrink-0 mt-1 hidden sm:block",children:e.jsx("div",{className:"w-10 h-10 bg-white rounded-full flex items-center justify-center border border-blue-100 shadow-sm text-blue-600",children:e.jsx(J,{size:24})})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex justify-between items-center mb-2",children:[e.jsxs("h3",{className:"font-bold text-blue-900 flex items-center gap-2 text-sm",children:[e.jsx("span",{className:"sm:hidden",children:e.jsx(J,{size:16})}),"AIコーチング"]}),e.jsx("button",{onClick:l,className:"p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors",children:e.jsx(ee,{size:16})})]}),e.jsxs("div",{className:"space-y-4",children:[r&&e.jsxs("div",{className:"bg-red-50 border border-red-100 rounded-xl p-3 animate-pop-in",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold text-red-700 text-sm mb-1",children:[e.jsx(Ne,{size:16}),e.jsxs("span",{className:"break-words",children:["詭弁を検出: ",r]})]}),e.jsx("p",{className:"text-xs text-red-800 leading-relaxed bg-white/50 p-2 rounded-lg break-words whitespace-pre-wrap",children:a})]}),n?e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-full",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-2 flex-wrap",children:[(()=>{const x=Xe[n.currentPhase]||Xe[A.CLAIM],b=x.icon;return e.jsxs("span",{className:`px-2 py-0.5 rounded text-[10px] font-bold text-white ${x.color} flex items-center gap-1`,children:[e.jsx(b,{size:10})," ",x.label]})})(),e.jsx("span",{className:"text-xs font-bold text-slate-700",children:"現在のフェーズ"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-[10px] text-slate-400 block mb-0.5",children:"相手の狙い"}),e.jsx("p",{className:"text-xs text-slate-700 font-medium leading-relaxed break-words whitespace-pre-wrap",children:n.analysis.claim_summary})]}),e.jsxs("div",{className:"bg-red-50 p-2 rounded border border-red-100",children:[e.jsx("span",{className:"text-[10px] text-red-400 block mb-0.5 font-bold",children:"弱点・攻めどころ"}),e.jsx("p",{className:"text-xs text-red-800 leading-relaxed break-words whitespace-pre-wrap",children:n.analysis.weak_point})]})]})]}),n.rebuttalTemplate&&e.jsxs("button",{onClick:c,className:"w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-xl shadow-md flex items-center justify-between hover:from-pink-700 hover:to-rose-600 transition-all group",children:[e.jsxs("span",{className:"font-bold flex items-center gap-2 text-sm",children:[e.jsx(be,{size:18}),"反論カードを作成"]}),e.jsx("span",{className:"bg-white/20 px-2 py-1 rounded text-[10px] font-medium group-hover:bg-white/30",children:"AIヒント付き"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-2",children:[e.jsx(ze,{size:14})," Recommended Moves"]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3",children:n.moves.map((x,b)=>{const g=Js(x.type);return e.jsxs("button",{onClick:()=>i(x.template),className:`w-full text-left bg-white border border-slate-200 p-3 rounded-xl transition-all shadow-sm group active:scale-95 border-l-4 ${g.cardBorder} ${g.cardHover} flex flex-col h-full`,children:[e.jsxs("div",{className:"flex items-start gap-2 mb-2 flex-wrap",children:[e.jsx("span",{className:`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md border ${g.badgeBg} ${g.badgeText} ${g.badgeBorder}`,children:g.label}),e.jsx("span",{className:"font-bold text-slate-800 text-xs group-hover:text-blue-700 leading-tight break-words",children:x.title})]}),x.reason&&e.jsxs("div",{className:"mb-2 text-[10px] bg-slate-50 p-1.5 rounded border border-slate-100 text-slate-600 leading-tight",children:[e.jsx("span",{className:"font-bold text-slate-400 block mb-0.5 text-[9px]",children:"WHY?"}),x.reason]}),e.jsxs("div",{className:"text-[10px] text-blue-600 font-mono bg-blue-50/50 p-2 rounded border border-blue-100 group-hover:bg-blue-100/50 w-full break-words whitespace-pre-wrap mt-auto",children:[e.jsx("span",{className:"opacity-50",children:'"'}),x.template,"...",e.jsx("span",{className:"opacity-50",children:'"'})]})]},b)})})]}):t&&e.jsxs("div",{className:"bg-white rounded-xl p-4 shadow-sm border border-blue-200 relative w-full",children:[e.jsx("p",{className:"text-sm text-slate-700 leading-relaxed font-medium break-words whitespace-pre-wrap w-full",children:t}),o!==null&&d(o)]})]})]})]})})}),Us=({isOpen:t,onClose:r,onSend:a,rebuttalTemplate:o,initialMode:n="builder"})=>{const[l,i]=h.useState(n),[c,d]=h.useState({claim:"",data:"",warrant:""}),[x,b]=h.useState({});if(h.useEffect(()=>{i(n)},[n,t]),h.useEffect(()=>{if(o&&l==="rebuttal"){const m={};o.fields.forEach(N=>{N.hint&&(m[N.id]=N.hint)})}},[o,l]),!t)return null;const g=()=>{if(!c.claim.trim())return;let m=c.claim.trim();m&&!["。","！","？",".","!","?"].includes(m.slice(-1))&&(m+="。"),c.data.trim()&&(m+=`
その理由は、${c.data.trim()}`,["。","！","？"].some(N=>c.data.trim().endsWith(N))||(m+="からです。")),c.warrant.trim()&&(m+=`
すなわち、${c.warrant.trim()}`,["。","！","？"].some(N=>c.warrant.trim().endsWith(N))||(m+="と言えます。")),a(m),d({claim:"",data:"",warrant:""}),r()},y=()=>{if(!o)return;let m="";o.fields.forEach((N,j)=>{var p;const u=(p=x[N.id])==null?void 0:p.trim();u&&(m+=u,["。","！","？",`
`].includes(u.slice(-1))?m+=`
`:m+=`。
`)}),m.trim()&&(a(m.trim()),b({}),r())};return e.jsx("div",{className:"fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-pop-in max-h-[90vh] overflow-y-auto",children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("button",{onClick:()=>i("builder"),className:`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${l==="builder"?"bg-blue-100 text-blue-700":"text-slate-500 hover:bg-slate-100"}`,children:[e.jsx(be,{size:14,className:"inline mr-1"}),"論理構築"]}),e.jsxs("button",{onClick:()=>i("rebuttal"),className:`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${l==="rebuttal"?"bg-pink-100 text-pink-700":"text-slate-500 hover:bg-slate-100"}`,children:[e.jsx(we,{size:14,className:"inline mr-1"}),"反論カード"]})]}),e.jsx("button",{onClick:r,children:e.jsx(ee,{size:20,className:"text-slate-400"})})]}),l==="builder"?e.jsxs("div",{className:"space-y-4",children:[e.jsx("div",{className:"bg-blue-50/50 p-3 rounded-lg text-xs text-slate-600 mb-2 border border-blue-100",children:"各項目を入力すると、AIが自動的に接続詞（その理由は～、すなわち～）を補って自然な文章に整形して送信します。"}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-blue-600 block mb-1",children:"Claim (主張・結論)"}),e.jsx("input",{value:c.claim,onChange:m=>d({...c,claim:m.target.value}),className:"w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white text-slate-900",placeholder:"例：私は、週休3日制を導入すべきだと考えます"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-green-600 block mb-1",children:"Data (理由・事実)"}),e.jsx("input",{value:c.data,onChange:m=>d({...c,data:m.target.value}),className:"w-full p-3 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm bg-white text-slate-900",placeholder:"例：生産性が40%向上したというデータがある"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-amber-600 block mb-1",children:"Warrant (論拠・つなぎ)"}),e.jsx("input",{value:c.warrant,onChange:m=>d({...c,warrant:m.target.value}),className:"w-full p-3 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm bg-white text-slate-900",placeholder:"例：十分な休息こそが、質の高い仕事につながる"})]}),e.jsx(ne,{onClick:g,fullWidth:!0,className:"mt-2 h-12 text-lg font-bold shadow-md",children:"文章を作成して送信"})]}):e.jsx("div",{className:"space-y-4",children:o?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"bg-pink-50/50 p-3 rounded-lg text-xs text-pink-800 mb-2 border border-pink-100",children:[e.jsxs("span",{className:"font-bold block mb-1",children:["🎯 ",o.title]}),"ヒントを参考に、空欄を埋めて反論を完成させましょう。"]}),o.fields.map(m=>e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-slate-600 block mb-1",children:m.label}),m.hint&&e.jsxs("div",{className:"text-[10px] text-pink-600 mb-1 flex items-center gap-1",children:[e.jsx(be,{size:10}),e.jsxs("span",{children:["Hint: ",m.hint]})]}),e.jsx("textarea",{value:x[m.id]||"",onChange:N=>b({...x,[m.id]:N.target.value}),className:"w-full p-3 rounded-lg border border-slate-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none text-sm min-h-[60px] bg-white text-slate-900",placeholder:m.placeholder})]},m.id)),e.jsx(ne,{onClick:y,fullWidth:!0,className:"mt-2 h-12 text-lg font-bold shadow-md bg-gradient-to-r from-pink-600 to-rose-600",children:"反論を送信"})]}):e.jsx("div",{className:"text-center py-8 text-slate-400",children:e.jsxs("p",{children:["現在、利用可能な反論テンプレートがありません。",e.jsx("br",{}),"戦略ナビゲーターを実行してください。"]})})})]})})},Ds=({isOpen:t,onClose:r,onSend:a,framework:o,initialTab:n})=>{const[l,i]=h.useState(n||"ai_topic"),[c,d]=h.useState({}),[x,b]=h.useState(""),[g,y]=h.useState(!1);if(!t)return null;const m=()=>{a("課題の自動作成をお願いします。"),r()},N=()=>{let u="";const p=c,S=g?`[GYM_REWRITE] (再提出)
`:"",B=l==="custom_topic"&&x?`【テーマ: ${x}】
`:"";let f="";switch(o){case I.SWOT:if(!p.swot_s&&!p.swot_w&&!p.swot_o&&!p.swot_t)return;f=`【SWOT分析】

[Strengths (強み)]
${p.swot_s||"-"}

[Weaknesses (弱み)]
${p.swot_w||"-"}

[Opportunities (機会)]
${p.swot_o||"-"}

[Threats (脅威)]
${p.swot_t||"-"}`;break;case I.PEST:if(!p.pest_p&&!p.pest_e&&!p.pest_s&&!p.pest_t)return;f=`【PEST分析】

[Politics (政治)]
${p.pest_p||"-"}

[Economy (経済)]
${p.pest_e||"-"}

[Society (社会)]
${p.pest_s||"-"}

[Technology (技術)]
${p.pest_t||"-"}`;break;case I.FIVE_WHYS:if(!p.why_problem)return;f=`【なぜなぜ分析】

[問題] ${p.why_problem}

1. Why? ${p.why_1||""}
2. Why? ${p.why_2||""}
3. Why? ${p.why_3||""}
4. Why? ${p.why_4||""}
5. Why? ${p.why_5||""}`;break;case I.MECE:if(!p.mece_axis&&!p.mece_1)return;f=`【MECE分解】

[テーマ] ${x||"(AI課題)"}
[切り口・軸] ${p.mece_axis||"-"}

[要素分解]
・${p.mece_1||""}
・${p.mece_2||""}
・${p.mece_3||""}
・${p.mece_4||""}`;break;case I.LOGIC_TREE:if(!p.tree_root)return;f=`【ロジックツリー】

[課題・テーマ] ${p.tree_root}

[分解・解決策]
├ ${p.tree_1||""}
├ ${p.tree_2||""}
└ ${p.tree_3||""}`;break;case I.META_COGNITION:if(!p.meta_thought)return;f=`【メタ認知・バイアスチェック】

[自分の思考・感情] ${p.meta_thought}

[客観的事実] ${p.meta_fact||"-"}

[別の捉え方(リフレーミング)] ${p.meta_reframing||"-"}`;break;default:return}u=S+B+f,a(u),g||(d({}),b("")),r()},j=()=>{switch(o){case I.SWOT:return"SWOT分析";case I.PEST:return"PEST分析";case I.FIVE_WHYS:return"なぜなぜ分析";case I.MECE:return"MECE";case I.LOGIC_TREE:return"ロジックツリー";case I.META_COGNITION:return"メタ認知";default:return""}};return e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-pop-in border border-indigo-200 flex flex-col max-h-[90vh]",children:[e.jsxs("div",{className:"bg-indigo-50 px-6 py-4 flex justify-between items-center border-b border-indigo-100",children:[e.jsxs("div",{children:[e.jsxs("h3",{className:"font-bold text-indigo-800 flex items-center gap-2 text-lg",children:[e.jsx(ye,{size:24}),j()]}),e.jsx("p",{className:"text-xs text-indigo-600 font-medium",children:"思考の筋トレ・ジム"})]}),e.jsx("button",{onClick:r,className:"p-1 hover:bg-indigo-100 rounded-full text-indigo-400 transition-colors",children:e.jsx(ee,{size:20})})]}),e.jsx("div",{className:"flex-1 overflow-y-auto",children:e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex bg-slate-100 p-1 rounded-lg mb-6",children:[e.jsxs("button",{onClick:()=>i("ai_topic"),className:`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${l==="ai_topic"?"bg-white text-indigo-600 shadow-sm":"text-slate-500 hover:text-slate-700"}`,children:[e.jsx(Le,{size:14})," AI課題に挑戦"]}),e.jsxs("button",{onClick:()=>i("custom_topic"),className:`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${l==="custom_topic"?"bg-white text-indigo-600 shadow-sm":"text-slate-500 hover:text-slate-700"}`,children:[e.jsx(he,{size:14})," 自分でテーマ設定"]})]}),l==="ai_topic"&&e.jsxs("div",{className:"bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 text-center mb-4",children:[e.jsx("div",{className:"w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-indigo-500",children:e.jsx(Le,{size:24})}),e.jsx("h4",{className:"font-bold text-slate-800 mb-2",children:"AIが課題を出題します"}),e.jsxs("p",{className:"text-sm text-slate-600 mb-6 leading-relaxed",children:["「",j(),"」の練習に最適なテーマをランダムに生成します。",e.jsx("br",{}),"まずは課題を受け取り、その後に回答を入力しましょう。"]}),e.jsxs(ne,{onClick:m,fullWidth:!0,className:"bg-indigo-600 hover:bg-indigo-700 text-white shadow-md",children:["AIに課題を自動作成してもらう ",e.jsx(tt,{size:16,className:"ml-2"})]})]}),l==="custom_topic"&&e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{className:"block text-xs font-bold text-slate-500 uppercase mb-1",children:"分析するテーマ (Theme)"}),e.jsx("input",{value:x,onChange:u=>b(u.target.value),placeholder:"例：自分自身のキャリア、地元の商店街の再生...",className:"w-full p-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white text-slate-900"})]}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-8 border-t border-slate-100 pt-6",children:[e.jsxs("span",{className:"text-sm font-bold text-slate-800 flex items-center gap-2",children:[e.jsx(he,{size:16,className:"text-indigo-500"}),"分析・回答入力"]}),e.jsxs("label",{className:"flex items-center gap-2 text-xs font-bold text-indigo-600 cursor-pointer select-none bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors",children:[e.jsx("input",{type:"checkbox",checked:g,onChange:u=>y(u.target.checked),className:"accent-indigo-600 rounded"}),e.jsx(Gt,{size:12}),"2回目(書き直し)として提出"]})]}),e.jsxs("div",{className:"space-y-4",children:[o===I.SWOT&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-indigo-600 block mb-1",children:"Strengths (強み・内部要因)"}),e.jsx("input",{placeholder:"他より優れている点、持っている資源...",className:"w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900",onChange:u=>d({...c,swot_s:u.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-rose-600 block mb-1",children:"Weaknesses (弱み・内部要因)"}),e.jsx("input",{placeholder:"不足している点、改善すべき点...",className:"w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-rose-400 transition-colors text-slate-900",onChange:u=>d({...c,swot_w:u.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-emerald-600 block mb-1",children:"Opportunities (機会・外部要因)"}),e.jsx("input",{placeholder:"活用できるトレンド、市場の変化...",className:"w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-emerald-400 transition-colors text-slate-900",onChange:u=>d({...c,swot_o:u.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-amber-600 block mb-1",children:"Threats (脅威・外部要因)"}),e.jsx("input",{placeholder:"障害となる競合、環境変化...",className:"w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-amber-400 transition-colors text-slate-900",onChange:u=>d({...c,swot_t:u.target.value})})]})]}),o===I.PEST&&e.jsxs(e.Fragment,{children:[e.jsx("input",{placeholder:"Politics (政治・法律・規制)",className:"w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900",onChange:u=>d({...c,pest_p:u.target.value})}),e.jsx("input",{placeholder:"Economy (経済・景気・物価)",className:"w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900",onChange:u=>d({...c,pest_e:u.target.value})}),e.jsx("input",{placeholder:"Society (社会・流行・人口)",className:"w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900",onChange:u=>d({...c,pest_s:u.target.value})}),e.jsx("input",{placeholder:"Technology (技術・革新)",className:"w-full p-3 bg-white border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors text-slate-900",onChange:u=>d({...c,pest_t:u.target.value})})]}),o===I.FIVE_WHYS&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"text-xs font-bold text-slate-500 block mb-1",children:"発生している問題 (Problem)"}),e.jsx("input",{placeholder:"例：工場のラインが停止した",className:"w-full p-3 border border-slate-300 rounded-lg text-sm font-bold bg-white text-slate-900",onChange:u=>d({...c,why_problem:u.target.value})})]}),e.jsx("div",{className:"space-y-3 pl-2 border-l-2 border-slate-100",children:[1,2,3,4,5].map(u=>e.jsxs("div",{className:"flex gap-2 items-center",children:[e.jsxs("span",{className:"font-bold text-xs text-indigo-500 w-6 shrink-0 text-right",children:["Why ",u]}),e.jsx("input",{placeholder:`なぜ？ (原因 ${u})`,className:"w-full p-2 bg-white border border-slate-200 rounded text-sm focus:border-indigo-400 text-slate-900",onChange:p=>d({...c,[`why_${u}`]:p.target.value})})]},u))})]}),o===I.MECE&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-indigo-600 block mb-1",children:"切り口・軸 (The Axis)"}),e.jsx("input",{placeholder:"例：年齢別、地域別、プロセス別...",className:"w-full p-2.5 bg-white border border-indigo-200 rounded-lg text-sm font-medium text-slate-900",onChange:u=>d({...c,mece_axis:u.target.value})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-bold text-slate-500 block",children:"分解した要素 (Elements)"}),[1,2,3,4].map(u=>e.jsx("input",{placeholder:`要素 ${u}`,className:"w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900",onChange:p=>d({...c,[`mece_${u}`]:p.target.value})},u))]})]}),o===I.LOGIC_TREE&&e.jsxs(e.Fragment,{children:[e.jsx("input",{placeholder:"Root: 解決したい課題・テーマ",className:"w-full p-3 border border-slate-300 rounded-lg text-sm font-bold bg-white text-slate-900",onChange:u=>d({...c,tree_root:u.target.value})}),e.jsxs("div",{className:"space-y-2 pl-4 border-l-2 border-indigo-100 ml-2 mt-2",children:[e.jsx("span",{className:"text-xs text-indigo-400 font-bold",children:"Branches (分解・解決策)"}),[1,2,3].map(u=>e.jsx("input",{placeholder:`分岐 ${u}`,className:"w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900",onChange:p=>d({...c,[`tree_${u}`]:p.target.value})},u))]})]}),o===I.META_COGNITION&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-rose-600 block mb-1",children:"自分の思考・感情 (Subjective)"}),e.jsx("input",{placeholder:"「最悪だ」「もう無理だ」等...",className:"w-full p-3 bg-white border border-rose-200 rounded-lg text-sm text-slate-900",onChange:u=>d({...c,meta_thought:u.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-slate-600 block mb-1",children:"客観的事実 (Objective Fact)"}),e.jsx("input",{placeholder:"実際に起きていること（数値や事実のみ）",className:"w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900",onChange:u=>d({...c,meta_fact:u.target.value})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs font-bold text-emerald-600 block mb-1",children:"リフレーミング (New Perspective)"}),e.jsx("input",{placeholder:"別の捉え方、ポジティブな解釈",className:"w-full p-3 bg-white border border-emerald-200 rounded-lg text-sm text-slate-900",onChange:u=>d({...c,meta_reframing:u.target.value})})]})]})]}),e.jsx("div",{className:"mt-6",children:e.jsx(ne,{onClick:N,fullWidth:!0,className:"bg-indigo-600 text-white hover:bg-indigo-700 h-12 text-lg shadow-lg",children:g?"修正案を提出 (Challenge)":"分析結果を提出"})})]})})]})})},Ys=({isOpen:t,onClose:r,summaryPoints:a,isGenerating:o})=>t?e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-pop-in flex flex-col max-h-[80vh]",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-slate-100",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold text-slate-800",children:[e.jsx(st,{size:20,className:"text-blue-600"}),"現在の主な論点"]}),e.jsx("button",{onClick:r,children:e.jsx(ee,{size:20,className:"text-slate-400"})})]}),e.jsx("div",{className:"p-6 overflow-y-auto",children:o?e.jsxs("div",{className:"flex flex-col items-center py-8 gap-3 text-slate-400",children:[e.jsx(U,{size:32,className:"animate-spin text-blue-500"})," 分析中..."]}):e.jsx("ul",{className:"space-y-3",children:a.map((n,l)=>e.jsxs("li",{className:"flex items-start gap-3 text-slate-700",children:[e.jsx("span",{className:"shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5",children:l+1}),e.jsx("span",{className:"leading-relaxed font-medium",children:n})]},l))})})]})}):null,Ws=({isOpen:t,onClose:r,boardData:a,isGenerating:o})=>t?e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl max-w-4xl w-full h-[85vh] overflow-hidden animate-pop-in flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-slate-200 bg-green-50/50",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold text-green-800",children:[e.jsx(rt,{size:24,className:"text-green-600"}),e.jsx("span",{children:"仮想ホワイトボード (Live)"})]}),e.jsx("button",{onClick:r,children:e.jsx(ee,{size:24,className:"text-slate-400"})})]}),e.jsx("div",{className:"flex-1 overflow-y-auto bg-slate-50 p-6",children:o?e.jsxs("div",{className:"flex flex-col items-center justify-center h-full gap-4 text-slate-400",children:[e.jsx(U,{size:40,className:"animate-spin text-green-500"}),e.jsx("span",{className:"text-base font-medium",children:"議論を整理中..."})]}):a?e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("h3",{className:"text-xs font-bold text-slate-500 uppercase tracking-wider mb-2",children:"Current Agenda"}),e.jsx("div",{className:"bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-lg font-bold text-slate-800",children:a.currentAgenda})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-red-50 p-5 rounded-2xl border border-red-100",children:[e.jsx("h4",{className:"font-bold text-red-800 mb-2",children:"Aさんの主張"}),e.jsx("p",{className:"text-sm font-bold text-red-900 mb-3",children:a.opinionA.summary}),e.jsx("ul",{className:"list-disc pl-4 text-sm text-slate-700 space-y-1",children:a.opinionA.pros.map((n,l)=>e.jsx("li",{children:n},l))})]}),e.jsxs("div",{className:"bg-blue-50 p-5 rounded-2xl border border-blue-100",children:[e.jsx("h4",{className:"font-bold text-blue-800 mb-2",children:"Bさんの主張"}),e.jsx("p",{className:"text-sm font-bold text-blue-900 mb-3",children:a.opinionB.summary}),e.jsx("ul",{className:"list-disc pl-4 text-sm text-slate-700 space-y-1",children:a.opinionB.pros.map((n,l)=>e.jsx("li",{children:n},l))})]})]}),e.jsxs("div",{className:"bg-emerald-50 p-4 rounded-xl border border-emerald-100",children:[e.jsxs("h4",{className:"flex items-center gap-2 font-bold text-emerald-800 mb-2",children:[e.jsx(Bt,{size:18})," 合意点"]}),e.jsx("ul",{className:"space-y-1 pl-4 list-disc text-sm text-emerald-900",children:a.agreedPoints.map((n,l)=>e.jsx("li",{children:n},l))})]})]}):e.jsx("div",{className:"text-center text-slate-400 mt-20",children:"データがありません"})})]})}):null,Be=[{id:"POSITION",label:"立場表明",desc:"自分のスタンスを明確にする",icon:Mt},{id:"GROUNDS",label:"根拠提示",desc:"理由とデータを提示する",icon:je},{id:"CLASH",label:"論点衝突",desc:"争点が明確になる",icon:we},{id:"REBUTTAL",label:"再反論",desc:"反論への防御と反撃",icon:Pe},{id:"WEIGHING",label:"比較",desc:"重要性の比較を行う",icon:ge},{id:"CLOSING",label:"結論",desc:"議論をまとめる",icon:Te}],Hs=({currentPhase:t,winCondition:r})=>{const a=Be.findIndex(o=>o.id===t);return e.jsxs("div",{className:"w-full bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm flex flex-col",children:[r&&e.jsxs("div",{className:"bg-slate-900 text-white px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm animate-fade-in relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 opacity-50"}),e.jsx(Me,{size:14,className:"text-yellow-400 fill-yellow-400 animate-pulse relative z-10"}),e.jsx("span",{className:"font-bold text-yellow-400 relative z-10 whitespace-nowrap",children:"WIN CONDITION:"}),e.jsx("span",{className:"font-medium truncate relative z-10",children:r.description})]}),e.jsx("div",{className:"px-4 py-3 overflow-x-auto scrollbar-hide",children:e.jsx("div",{className:"flex items-center justify-between min-w-[500px] max-w-4xl mx-auto",children:Be.map((o,n)=>{const l=o.id===t,i=n<a,c=o.icon;return e.jsxs("div",{className:"flex items-center flex-1 last:flex-none group relative",children:[e.jsxs("div",{className:`flex flex-col items-center gap-1 relative z-10 px-2 ${l?"scale-110 transition-transform":""}`,children:[e.jsx("div",{className:`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${l?"bg-blue-600 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100":i?"bg-slate-800 text-white":"bg-slate-100 text-slate-300"}`,children:e.jsx(c,{size:14})}),e.jsx("span",{className:`text-[10px] font-bold whitespace-nowrap transition-colors duration-300 ${l?"text-blue-700":i?"text-slate-600":"text-slate-300"}`,children:o.label}),l&&e.jsxs("div",{className:"absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap animate-fade-in-up z-20",children:[o.desc,e.jsx("div",{className:"absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"})]})]}),n<Be.length-1&&e.jsx("div",{className:"flex-1 h-0.5 mx-2 bg-slate-100 relative",children:e.jsx("div",{className:"absolute top-0 left-0 h-full bg-slate-800 transition-all duration-700 ease-out",style:{width:i?"100%":"0%"}})})]},o.id)})})})]})},Qs=()=>e.jsxs("div",{className:"flex items-end gap-3 animate-message-in mb-6 select-none opacity-80",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-600 flex items-center justify-center shrink-0 shadow-sm animate-pulse",children:e.jsx(J,{size:18})}),e.jsxs("div",{className:"px-4 py-3 rounded-2xl rounded-bl-none bg-white border border-slate-100 shadow-sm flex items-center gap-1 min-w-[60px] justify-center",children:[e.jsx("div",{className:"w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"}),e.jsx("div",{className:"w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"}),e.jsx("div",{className:"w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"})]}),e.jsx("span",{className:"text-xs text-slate-400 animate-pulse font-medium pb-1",children:"Thinking..."})]}),Vs=({burdenAnalysis:t,isVisible:r,onToggle:a})=>{const[o,n]=h.useState(null);if(!t)return e.jsx("div",{className:"bg-white border-l-4 border-indigo-600 rounded-lg shadow-md overflow-hidden",children:e.jsx("div",{className:"px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(ge,{className:"text-indigo-600 animate-pulse",size:20}),e.jsxs("div",{className:"text-left",children:[e.jsx("h3",{className:"text-sm font-bold text-slate-800",children:"立証責任トラッカー"}),e.jsx("p",{className:"text-[10px] text-slate-500",children:"分析中..."})]})]})})});if(t.burdens.length===0)return null;const{burdens:l,summary:i}=t,c=l.filter(m=>m.status==="active"),d=l.filter(m=>m.status==="challenged"),x=m=>{switch(m){case"claim":return"主張";case"simple_question":return"疑問提起";case"counter_claim":return"反証主張"}},b=m=>{switch(m){case"claim":return"bg-blue-100 text-blue-700 border-blue-200";case"simple_question":return"bg-amber-100 text-amber-700 border-amber-200";case"counter_claim":return"bg-rose-100 text-rose-700 border-rose-200"}},g=m=>{switch(m){case"active":return e.jsx(_e,{size:14,className:"text-orange-600"});case"fulfilled":return e.jsx(Te,{size:14,className:"text-emerald-600"});case"challenged":return e.jsx($e,{size:14,className:"text-rose-600"});case"abandoned":return e.jsx(je,{size:14,className:"text-slate-400"})}},y=m=>{switch(m){case"active":return"未履行";case"fulfilled":return"履行済み";case"challenged":return"争点化";case"abandoned":return"放棄"}};return e.jsxs("div",{className:"bg-white border-l-4 border-indigo-600 rounded-lg shadow-md overflow-hidden",children:[e.jsxs("button",{onClick:a,className:"w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white hover:from-indigo-100 transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(ge,{className:"text-indigo-600",size:20}),e.jsxs("div",{className:"text-left",children:[e.jsx("h3",{className:"text-sm font-bold text-slate-800",children:"立証責任トラッカー"}),e.jsx("p",{className:"text-[10px] text-slate-500",children:"Burden of Proof Tracker"})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"flex gap-2 text-[10px] font-bold",children:[e.jsxs("span",{className:"px-2 py-0.5 rounded bg-orange-100 text-orange-700",children:["あなた: ",i.userActiveBurdens]}),e.jsxs("span",{className:"px-2 py-0.5 rounded bg-blue-100 text-blue-700",children:["AI: ",i.aiActiveBurdens]})]}),r?e.jsx(at,{size:18}):e.jsx(nt,{size:18})]})]}),r&&e.jsxs("div",{className:"p-4 space-y-3 max-h-96 overflow-y-auto",children:[c.length>0&&e.jsxs("div",{className:"space-y-2",children:[e.jsxs("h4",{className:"text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2",children:[e.jsx(_e,{size:12})," 立証義務 (Active)"]}),c.map(m=>e.jsx(Ze,{burden:m,isExpanded:o===m.id,onToggle:()=>n(o===m.id?null:m.id),getBurdenTypeLabel:x,getBurdenTypeColor:b,getStatusIcon:g,getStatusLabel:y},m.id))]}),d.length>0&&e.jsxs("div",{className:"space-y-2",children:[e.jsxs("h4",{className:"text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2",children:[e.jsx($e,{size:12})," 争点化された義務"]}),d.map(m=>e.jsx(Ze,{burden:m,isExpanded:o===m.id,onToggle:()=>n(o===m.id?null:m.id),getBurdenTypeLabel:x,getBurdenTypeColor:b,getStatusIcon:g,getStatusLabel:y},m.id))]}),e.jsxs("div",{className:"pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{className:"bg-slate-50 rounded p-2",children:[e.jsx("div",{className:"text-xl font-bold text-slate-800",children:i.totalResolved}),e.jsx("div",{className:"text-[9px] text-slate-500 uppercase font-bold",children:"解決済み"})]}),e.jsxs("div",{className:"bg-slate-50 rounded p-2",children:[e.jsx("div",{className:"text-xl font-bold text-slate-800",children:i.criticalQuestionsCount}),e.jsx("div",{className:"text-[9px] text-slate-500 uppercase font-bold",children:"CQ発生"})]}),e.jsxs("div",{className:"bg-slate-50 rounded p-2",children:[e.jsx("div",{className:"text-xl font-bold text-slate-800",children:l.length}),e.jsx("div",{className:"text-[9px] text-slate-500 uppercase font-bold",children:"総数"})]})]})]})]})},Ze=({burden:t,isExpanded:r,onToggle:a,getBurdenTypeLabel:o,getBurdenTypeColor:n,getStatusIcon:l,getStatusLabel:i})=>e.jsxs("div",{className:`border rounded-lg overflow-hidden transition-all ${t.status==="active"?"border-orange-200 bg-orange-50":t.status==="challenged"?"border-rose-200 bg-rose-50":"border-slate-200 bg-slate-50"}`,children:[e.jsxs("button",{onClick:a,className:"w-full px-3 py-2 flex items-center justify-between hover:bg-white/50 transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-2 flex-1 text-left",children:[t.burdenHolder==="user"?e.jsx(me,{size:14,className:"text-indigo-600"}):e.jsx(J,{size:14,className:"text-blue-600"}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("span",{className:`text-[9px] font-bold px-1.5 py-0.5 rounded border ${n(t.type)}`,children:o(t.type)}),e.jsxs("span",{className:"text-[9px] font-bold text-slate-500 flex items-center gap-1",children:[l(t.status),i(t.status)]})]}),e.jsx("p",{className:"text-xs text-slate-700 font-medium truncate",children:t.claimText})]})]}),r?e.jsx(at,{size:14}):e.jsx(nt,{size:14})]}),r&&e.jsx("div",{className:"px-3 pb-3 pt-1 space-y-2 border-t bg-white/30",children:e.jsxs("div",{className:"text-[10px] space-y-1",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-bold text-slate-600",children:"主張者:"})," ",e.jsxs("span",{className:"text-slate-800",children:[t.claimant==="user"?"あなた":"AI"," (#",t.claimMessageIndex+1,")"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-bold text-slate-600",children:"立証義務:"})," ",e.jsx("span",{className:"text-slate-800",children:t.burdenHolder==="user"?"あなた":"AI"})]}),t.isCriticalQuestion&&t.criticalQuestionText&&e.jsxs("div",{className:"bg-amber-100 border border-amber-200 rounded p-2 mt-2",children:[e.jsx("span",{className:"font-bold text-amber-800 block mb-1",children:"CQ (Critical Question):"}),e.jsxs("p",{className:"text-amber-900 italic",children:['"',t.criticalQuestionText,'"']})]}),e.jsxs("div",{className:"bg-slate-100 rounded p-2 mt-2",children:[e.jsx("span",{className:"font-bold text-slate-600 block mb-1",children:"説明:"}),e.jsx("p",{className:"text-slate-700 leading-relaxed",children:t.explanation})]}),t.assessment&&e.jsxs("div",{className:"bg-emerald-100 rounded p-2 mt-2",children:[e.jsx("span",{className:"font-bold text-emerald-800 block mb-1",children:"評価:"}),e.jsx("p",{className:"text-emerald-900 leading-relaxed",children:t.assessment})]})]})})]}),Ks=({onBackToTop:t,onShowHomework:r,onEndDebate:a,onGenerateSummary:o,onToggleBurdenTracker:n,onGenerateBoard:l,pendingTasks:i,isGeneratingSummary:c,isGeneratingBoard:d,isAnalyzingBurden:x,showBurdenTracker:b,mode:g,messagesCount:y})=>{const m=g==="DEMO",N=g==="STUDY",j=g==="DRILL",u=g==="DEBATE",p=g==="FACILITATION";return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute top-4 left-4 z-30",children:e.jsx("button",{onClick:t,className:"p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200",title:"トップに戻る",children:e.jsx($t,{size:20})})}),e.jsxs("div",{className:"absolute top-4 right-4 z-30 flex flex-col gap-2",children:[e.jsxs("button",{onClick:r,className:"p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-indigo-600 transition-all border border-slate-200 relative group",title:"宿題リスト",children:[e.jsx(_t,{size:20}),i.length>0&&e.jsx("span",{className:"absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm",children:i.length})]}),!m&&!N&&!j&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:o,disabled:c,className:"p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-blue-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed",title:"議論を要約",children:c?e.jsx(U,{size:20,className:"animate-spin text-blue-500"}):e.jsx(st,{size:20})}),u&&e.jsx("button",{onClick:n,disabled:x||y<2,className:`p-2 bg-white/90 backdrop-blur rounded-full shadow-md transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed ${b?"text-indigo-600 bg-indigo-50 border-indigo-300":"text-slate-600 hover:text-indigo-600"}`,title:b?"立証責任トラッカーを閉じる":"立証責任を分析",children:x?e.jsx(U,{size:20,className:"animate-spin text-indigo-500"}):e.jsx(ge,{size:20})}),p&&e.jsx("button",{onClick:l,disabled:d,className:"p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-slate-600 hover:text-green-600 transition-all border border-slate-200 disabled:opacity-70 disabled:cursor-not-allowed",title:"ホワイトボードを表示",children:d?e.jsx(U,{size:20,className:"animate-spin text-green-500"}):e.jsx(rt,{size:20})})]}),e.jsx("button",{onClick:a,className:"p-2 bg-red-500/90 backdrop-blur rounded-full shadow-md text-white hover:bg-red-600 transition-all border border-red-400",title:"議論を終了して分析",children:e.jsx(Lt,{size:20})})]})]})},Xs=({messages:t,settings:r,inputText:a,isSending:o,onTokenUpdate:n})=>{const[l,i]=h.useState({advice:null,detectedFallacy:null,fallacyQuote:null,fallacyExplanation:null,sentimentScore:null}),[c,d]=h.useState(!1),[x,b]=h.useState(!1),g=h.useRef(null),[y,m]=h.useState(null),[N,j]=h.useState(!1),u=h.useRef(null),[p,S]=h.useState([]),[B,f]=h.useState(!1),[T,C]=h.useState(!1),z=h.useRef(-1),[se,le]=h.useState(null),[K,ie]=h.useState(!1),[P,ce]=h.useState(!1),X=h.useRef(-1),de=h.useCallback(async()=>{const R=a.trim(),L=`${t.length}:${R}`;if(g.current&&g.current.key===L){m(null),i(g.current.data),d(!0);return}i({advice:null,detectedFallacy:null,fallacyQuote:null,fallacyExplanation:null,sentimentScore:null}),m(null),d(!1),b(!0);try{const O=await js(r.topic,t,a),H={advice:O.advice,detectedFallacy:O.detectedFallacy||null,fallacyQuote:O.fallacyQuote||null,fallacyExplanation:O.fallacyExplanation||null,sentimentScore:typeof O.sentimentScore=="number"?O.sentimentScore:null};i(H),g.current={key:L,data:H},d(!0),n&&n(O.usage)}catch(O){console.error(O)}finally{b(!1)}},[t,a,r.topic,n]),W=h.useCallback(async()=>{var L;if(t.length===0)return;const R=t.length.toString();if(u.current&&u.current.key===R){d(!1),m(u.current.data);return}j(!0),d(!1);try{const{strategy:O,usage:H}=await hs(r.topic,t);console.log("📊 Strategy generated:",O),console.log("📊 Number of moves:",((L=O.moves)==null?void 0:L.length)||0),m(O),u.current={key:R,data:O},n&&n(H)}catch(O){console.error("Strategy generation failed",O)}finally{j(!1)}},[t,r.topic,n]),ve=h.useCallback(async()=>{if(f(!0),!(t.length===z.current&&p.length>0)){C(!0);try{const R=await ys(r.topic,t);S(R.points),z.current=t.length,n&&n(R.usage)}catch(R){console.error(R),S(["要約の生成に失敗しました"])}finally{C(!1)}}},[t,r.topic,n,p.length]),ue=h.useCallback(async()=>{if(ie(!0),!(t.length===X.current&&se)){ce(!0);try{const R=await ds(r.topic,t);le(R.board),X.current=t.length,n&&n(R.usage)}catch(R){console.error(R)}finally{ce(!1)}}},[t,r.topic,n,se]),Se=h.useCallback(()=>{i({advice:null,detectedFallacy:null,fallacyQuote:null,fallacyExplanation:null,sentimentScore:null}),d(!1),m(null)},[]);return{adviceData:l,showAdvicePanel:c,setShowAdvicePanel:d,isGettingAdvice:x,strategyData:y,setStrategyData:m,isGeneratingStrategy:N,getStrategy:W,summaryState:{points:p,isOpen:B,setIsOpen:f,isGenerating:T,generate:ve},boardState:{data:se,isOpen:K,setIsOpen:ie,isGenerating:P,generate:ue},getAdvice:de,resetTools:Se}},Zs=t=>(typeof t=="object"?t.mode:t)===v.DEMO,er=t=>{const r=typeof t=="object"?t.mode:t;return r===v.DEBATE||r===v.FACILITATION||r===v.STORY},tr=({messages:t,settings:r,onTokenUpdate:a,onStructureAnalysisComplete:o})=>{const{showError:n}=Ms(),[l,i]=h.useState({}),[c,d]=h.useState(new Set),[x,b]=h.useState({}),[g,y]=h.useState({currentPhase:"POSITION",turns:[]}),[m,N]=h.useState(new Set),j=h.useRef(0),u=h.useRef(new Set),p=Zs(r),S=er(r);return h.useEffect(()=>{p&&t.forEach(B=>{if(B.role==="model"&&!x[B.id])try{const f=k(B.text),T=JSON.parse(f);T.speaker&&T.text&&b(C=>({...C,[B.id]:T}))}catch{}})},[t,p]),h.useEffect(()=>{t.filter(f=>f.role==="user"&&!u.current.has(f.id)&&!c.has(f.id)&&f.text.trim().length>10&&!p).forEach(async f=>{u.current.add(f.id),d(T=>new Set(T).add(f.id));try{if(!l[f.id]){const T=await gs(f.text);i(C=>({...C,[f.id]:T.analysis})),a&&a(T.usage)}if(S&&!f.structureAnalysis&&!m.has(f.id)){N(C=>new Set(C).add(f.id));const T=await Gs(f);o&&o(f.id,T.result),a&&a(T.usage)}}catch(T){console.error("❌ Analysis failed for message:",f.id,T),n("メッセージ分析に失敗しました")}finally{d(T=>{const C=new Set(T);return C.delete(f.id),C})}})},[t.length,p,S]),h.useEffect(()=>{(async()=>{if(S&&t.length>=2&&t.length>j.current){j.current=t.length;try{const{result:f,usage:T}=await ks(r.topic,t);y(C=>({currentPhase:f.phase,turns:[...C.turns,f]})),a&&a(T)}catch(f){console.error("❌ Phase analysis failed",f),n("討論フェーズ分析に失敗しました")}}})()},[t.length,S,r.topic]),{analyses:l,demoParsedMessages:x,debateFlowState:g}},sr=()=>{const[t,r]=h.useState(""),[a,o]=h.useState(!1),[n,l]=h.useState("builder"),[i,c]=h.useState(!1),[d,x]=h.useState(!1),[b,g]=h.useState("ai_topic"),[y,m]=h.useState(!1);return{inputText:t,setInputText:r,showBuilder:a,setShowBuilder:o,builderMode:n,setBuilderMode:l,showGymModal:i,setShowGymModal:c,showHomeworkModal:d,setShowHomeworkModal:x,gymInitialTab:b,setGymInitialTab:g,isAutoPlaying:y,setIsAutoPlaying:m}},rr=(t,r,a,o,n,l)=>{const[i,c]=h.useState(null),[d,x]=h.useState(!1),[b,g]=h.useState(!1),y=h.useRef("POSITION"),m=h.useRef(0);return h.useEffect(()=>{if(!o||t.length<2||!d||b||n)return;const j=a!==y.current,u=t.length!==m.current;if(!j&&!u){console.log("📦 Using cached burden analysis (no changes detected)");return}j?(console.log(`🔄 Debate phase changed from ${y.current} to ${a}. Re-analyzing burden...`),y.current=a):console.log("🔄 New message detected. Re-analyzing burden..."),m.current=t.length,g(!0),Ve(r.topic,t).then(({data:p,usage:S})=>{console.log("Burden re-analysis result:",p),c(p),l&&S&&l(S)}).catch(p=>{console.error("Burden re-analysis failed:",p)}).finally(()=>{g(!1)})},[t.length,a,o,d,n,r.topic,l,b]),{burdenAnalysis:i,showBurdenTracker:d,isAnalyzingBurden:b,toggleBurdenTracker:()=>{if(d){x(!1);return}if(i){x(!0);return}t.length<2||b||(g(!0),Ve(r.topic,t).then(({data:j,usage:u})=>{console.log("Burden analysis result:",j),c(j),x(!0),l&&u&&l(u)}).catch(j=>{console.error("Burden analysis failed:",j)}).finally(()=>{g(!1)}))}}},ar=({messages:t,settings:r,isSending:a,onSendMessage:o,onAiStart:n,onEndDebate:l,tokenUsage:i,onTokenUpdate:c,onBackToTop:d,onStructureAnalysisComplete:x,homeworkTasks:b,onCompleteHomework:g,onDeleteHomework:y})=>{const m=sr(),{inputText:N,setInputText:j,showBuilder:u,setShowBuilder:p,builderMode:S,setBuilderMode:B,showGymModal:f,setShowGymModal:T,showHomeworkModal:C,setShowHomeworkModal:z,gymInitialTab:se,setGymInitialTab:le,isAutoPlaying:K,setIsAutoPlaying:ie}=m,{adviceData:P,showAdvicePanel:ce,setShowAdvicePanel:X,isGettingAdvice:de,strategyData:W,setStrategyData:ve,isGeneratingStrategy:ue,getStrategy:Se,summaryState:R,boardState:L,getAdvice:O,resetTools:H}=Xs({messages:t,settings:r,inputText:N,isSending:a,onTokenUpdate:c}),{analyses:Fe,demoParsedMessages:Je,debateFlowState:Ie}=tr({messages:t,settings:r,onTokenUpdate:c,onStructureAnalysisComplete:x}),qe=h.useRef(null),Ue=h.useRef(null),Ee=h.useRef(null),[ct,dt]=h.useState(600),Re=t.length>=50,ut=r.mode===v.STUDY,pt=r.mode===v.DRILL,xt=r.mode===v.FACILITATION,Ce=r.mode===v.THINKING_GYM,Q=r.mode===v.DEMO,re=r.mode===v.DEBATE,mt=r.mode===v.STORY,{burdenAnalysis:De,showBurdenTracker:Ae,isAnalyzingBurden:ht,toggleBurdenTracker:Ye}=rr(t,r,Ie.currentPhase,re,a,c),bt=re||xt||mt,gt=a||de||ue||R.isGenerating||L.isGenerating,pe=b.filter(w=>w.status==="pending"),ft=()=>{var w,D;Re?(w=Ue.current)==null||w.scrollToBottom():(D=qe.current)==null||D.scrollIntoView({behavior:"smooth"})};h.useEffect(()=>{const w=()=>{if(Ee.current){const D=Ee.current.getBoundingClientRect();dt(D.height)}};return w(),window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[]),h.useEffect(()=>{ft()},[t,a]),h.useEffect(()=>{if(!Q||!K)return;let w;return!a&&t.length>0&&(w=setTimeout(()=>{o("次のターンへ")},4e3)),()=>clearTimeout(w)},[t,Q,K,a,o]);const yt=w=>{w.preventDefault(),N.trim()&&!a&&(o(N),j(""),H())},Nt=w=>{j(w)},ke=w=>{o(w),H()},jt=()=>{B("rebuttal"),p(!0)};return e.jsxs("div",{className:"flex flex-col h-full bg-slate-50 animate-fade-in relative",children:[gt&&e.jsx("div",{className:"absolute top-0 left-0 w-full h-1 z-50 bg-transparent overflow-hidden pointer-events-none",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-[50%] animate-[shimmer_1.5s_infinite] -translate-x-full"})}),e.jsx(Ks,{onBackToTop:d,onShowHomework:()=>z(!0),onEndDebate:l,onGenerateSummary:R.generate,onToggleBurdenTracker:Ye,onGenerateBoard:L.generate,pendingTasks:pe,isGeneratingSummary:R.isGenerating,isGeneratingBoard:L.isGenerating,isAnalyzingBurden:ht,showBurdenTracker:Ae,mode:r.mode,messagesCount:t.length}),e.jsxs("div",{className:"flex flex-1 overflow-hidden relative flex-col",children:[bt&&e.jsx(Hs,{currentPhase:Ie.currentPhase,winCondition:Ie.winCondition}),e.jsxs("div",{className:"flex-1 relative w-full overflow-hidden",children:[e.jsxs("div",{ref:Ee,className:"absolute inset-0 overflow-y-auto p-4 scrollbar-hide pb-32",children:[re&&Ae&&De&&e.jsx("div",{className:"mb-4 animate-fade-in",children:e.jsx(Vs,{burdenAnalysis:De,isVisible:Ae,onToggle:Ye})}),t.length===0&&e.jsx("div",{className:"flex flex-col items-center justify-center min-h-[50vh] p-6",children:e.jsx("div",{className:"max-w-md w-full text-center space-y-6 animate-fade-in-up",children:e.jsxs("div",{className:"bg-white p-6 rounded-2xl shadow-lg border border-slate-100",children:[e.jsx("div",{className:"w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx(J,{size:28})}),e.jsx("h3",{className:"text-xl font-bold text-slate-800 mb-2",children:Q?"模範ディベート視聴":"議論を開始しましょう"}),e.jsx("p",{className:"text-sm text-slate-500 mb-6",children:Q?`AI同士のハイレベルな議論を観戦します。
自動再生で流れを見るか、自分のペースで進めてください。`:`AIに先攻（立論）を任せるか、
下の入力欄からあなたが発言して開始してください。`}),!Q&&re&&e.jsxs("div",{className:"grid gap-3",children:[e.jsxs("button",{onClick:()=>n("PRO"),disabled:a,className:"flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left disabled:opacity-50",children:[e.jsx("div",{className:"bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors",children:e.jsx(we,{size:20})}),e.jsxs("div",{children:[e.jsx("span",{className:"block font-bold text-slate-700 group-hover:text-blue-700",children:"AIが肯定側で開始"}),e.jsx("span",{className:"text-xs text-slate-400",children:"AIが先攻で立論を行います"})]})]}),e.jsxs("button",{onClick:()=>n("CON"),disabled:a,className:"flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-red-500 hover:bg-red-50 transition-all group text-left disabled:opacity-50",children:[e.jsx("div",{className:"bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors",children:e.jsx(Pe,{size:20})}),e.jsxs("div",{children:[e.jsx("span",{className:"block font-bold text-slate-700 group-hover:text-red-700",children:"AIが否定側で開始"}),e.jsx("span",{className:"text-xs text-slate-400",children:"AIが先攻で立論を行います"})]})]})]}),Ce&&e.jsxs("div",{className:"grid gap-3",children:[e.jsxs("button",{onClick:()=>o("課題の自動作成をお願いします。"),disabled:a,className:"flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group text-left disabled:opacity-50",children:[e.jsx("div",{className:"bg-indigo-100 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors",children:e.jsx(Le,{size:20})}),e.jsxs("div",{children:[e.jsx("span",{className:"block font-bold text-slate-700 group-hover:text-indigo-700",children:"AIに課題を出してもらう"}),e.jsx("span",{className:"text-xs text-slate-400",children:"ランダムなテーマで練習します"})]})]}),e.jsxs("button",{onClick:()=>{le("custom_topic"),T(!0)},disabled:a,className:"flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 transition-all group text-left disabled:opacity-50",children:[e.jsx("div",{className:"bg-slate-100 text-slate-500 p-2 rounded-lg group-hover:bg-slate-600 group-hover:text-white transition-colors",children:e.jsx(he,{size:20})}),e.jsxs("div",{children:[e.jsx("span",{className:"block font-bold text-slate-700 group-hover:text-slate-800",children:"自分でテーマを決める"}),e.jsx("span",{className:"text-xs text-slate-400",children:"好きな課題で分析します"})]})]})]}),!Q&&!re&&!Ce&&e.jsx("p",{className:"text-sm text-slate-400",children:"下の入力欄から開始してください"})]})})}),Re?e.jsx(it,{ref:Ue,messages:t,settings:r,analyses:Fe,demoParsedMessages:Je,detectedFallacy:P.detectedFallacy,highlightQuote:P.fallacyQuote,onHighlightClick:()=>X(!0),containerHeight:ct-100}):e.jsx(e.Fragment,{children:t.map((w,D)=>e.jsx(lt,{msg:w,index:D,settings:r,analysis:Fe[w.id],demoParsedData:Je[w.id],structureScore:w.structureAnalysis,supportMode:!0,detectedFallacy:P.detectedFallacy,highlightQuote:P.fallacyQuote,onHighlightClick:()=>X(!0)},w.id))}),a&&e.jsx(Qs,{}),!Re&&e.jsx("div",{ref:qe})]}),(ce||W)&&e.jsx("div",{className:"absolute bottom-0 left-0 right-0 z-20 pointer-events-none",children:e.jsx("div",{className:"pointer-events-auto w-full",children:e.jsx(qs,{advice:P.advice,detectedFallacy:P.detectedFallacy,fallacyExplanation:P.fallacyExplanation,sentimentScore:P.sentimentScore,strategyData:W,onClose:()=>{X(!1),ve(null)},onUseStrategy:Nt,onOpenRebuttalCard:jt})})})]}),e.jsx(Fs,{inputText:N,setInputText:j,isSending:a,supportMode:!0,onSendMessage:yt,onSendText:ke,onGetAdvice:O,isGettingAdvice:de,onGetStrategy:Se,isGeneratingStrategy:ue,onToggleBuilder:()=>{B("builder"),p(!u)},onToggleGym:()=>{le("ai_topic"),T(!f)},isThinkingGymMode:Ce,isStudyMode:ut,isDrillMode:pt,isDemoMode:Q,hasMessages:t.length>0,isAutoPlaying:K,onToggleAutoPlay:()=>ie(!K),onNextTurn:()=>o("次のターンへ")})]}),e.jsx(Us,{isOpen:u,onClose:()=>p(!1),onSend:ke,initialMode:S,rebuttalTemplate:W==null?void 0:W.rebuttalTemplate}),e.jsx(Ds,{isOpen:f,onClose:()=>T(!1),onSend:ke,framework:r.thinkingFramework,initialTab:se}),e.jsx(Ys,{isOpen:R.isOpen,onClose:()=>R.setIsOpen(!1),summaryPoints:R.points,isGenerating:R.isGenerating}),e.jsx(Ws,{isOpen:L.isOpen,onClose:()=>L.setIsOpen(!1),boardData:L.data,isGenerating:L.isGenerating}),C&&e.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-pop-in flex flex-col max-h-[80vh]",children:[e.jsxs("div",{className:"bg-indigo-50 px-4 py-3 flex justify-between items-center border-b border-indigo-100",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold text-indigo-800",children:[e.jsx(ClipboardList,{size:20}),e.jsx("span",{children:"宿題リスト"}),e.jsx("span",{className:"bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm",children:pe.length})]}),e.jsx("button",{onClick:()=>z(!1),className:"text-slate-400 hover:text-slate-600",children:e.jsx(ee,{size:20})})]}),e.jsx("div",{className:"p-4 overflow-y-auto",children:pe.length===0?e.jsxs("div",{className:"text-center py-8 text-slate-400",children:[e.jsx(ClipboardList,{size:40,className:"mx-auto mb-2 opacity-50"}),e.jsx("p",{children:"現在、宿題はありません。"}),e.jsx("p",{className:"text-xs mt-1",children:"議論のフィードバックで提案されます。"})]}):e.jsx("div",{className:"space-y-3",children:pe.map(w=>e.jsxs("div",{className:"border border-slate-200 rounded-lg p-3 bg-slate-50 hover:bg-white transition-colors group",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("span",{className:`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${w.difficulty==="hard"?"bg-red-50 text-red-600 border-red-100":w.difficulty==="normal"?"bg-blue-50 text-blue-600 border-blue-100":"bg-green-50 text-green-600 border-green-100"}`,children:w.difficulty}),e.jsx("span",{className:"font-bold text-slate-800 text-sm",children:w.title})]}),e.jsx("p",{className:"text-xs text-slate-600 leading-relaxed mb-2",children:w.description}),e.jsxs("div",{className:"flex justify-end gap-2 pt-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity",children:[e.jsx("button",{onClick:()=>y(w.id),className:"p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors",title:"削除",children:e.jsx(zt,{size:14})}),e.jsxs("button",{onClick:()=>{const D=prompt("完了のメモを残しますか？（任意）");g(w.id,D||"")},className:"flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors",children:[e.jsx(Te,{size:12}),"完了"]})]})]},w.id))})})]})})]})},Ar=Object.freeze(Object.defineProperty({__proto__:null,ChatScreen:ar},Symbol.toStringTag,{value:"Module"}));export{dr as A,ne as B,cr as C,v as D,F as E,_ as M,zs as S,I as T,q as a,ae as b,mr as c,gr as d,hr as e,ur as f,Nr as g,xr as h,br as i,pr as j,k,M as l,yr as m,fr as n,Ir as o,$ as p,Er as q,Tr as r,wr as s,vr as t,Ms as u,Sr as v,jr as w,Rr as x,Cr as y,Ar as z};
