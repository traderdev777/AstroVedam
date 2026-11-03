const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./jspdf.es.min-CgHatq18.js","./index-Bw9TiSIN.js","./index-CFPN4POS.css"])))=>i.map(i=>d[i]);
import{g as Ce,a as Be,b as ge}from"./kundali-BA-k_CTH.js";import{g as ze,a as Le,b as Pe,c as Ne,d as Ie,e as Re,f as Te,G as me,R as he,Y as ue,L as Bt,h as ut,i as zt,j as L,P as ot,D as ve,k as be,C as ye,l as xe,M as fe,m as Me,n as $e,o as Oe,p as je,q as Ve,r as Ge,s as He}from"./predictionTranslations-B12Irc6z.js";import{a as Ue}from"./dosha-YuWC33nj.js";import{_ as ke,s as it}from"./index-Bw9TiSIN.js";import{r as _e,f as De}from"./indianPlaces-CBev9HOS.js";import{c as Ke}from"./panchang-gcc3KLuc.js";import{c as qe,g as Ye}from"./dasha-DOZlgJUC.js";import{g as Je,a as Ze}from"./calculator-Dt1xjC0g.js";import{R as we}from"./ephemeris-XGObF-IA.js";import{e as C}from"./escapeHtml-6fqo2KgN.js";function Qe(r,p,x={}){const c=typeof p=="string"?document.getElementById(p):p;if(!c)return;const n=x.theme==="print"||x.theme==="light"||x.isPrint,G=r.houses||{},t={1:{rashi:[240,52],planets:[240,136],anchor:"middle"},2:{rashi:[125,34],planets:[125,75],anchor:"middle"},3:{rashi:[34,125],planets:[75,125],anchor:"middle"},4:{rashi:[52,240],planets:[136,240],anchor:"middle"},5:{rashi:[34,355],planets:[75,355],anchor:"middle"},6:{rashi:[125,446],planets:[125,405],anchor:"middle"},7:{rashi:[240,428],planets:[240,344],anchor:"middle"},8:{rashi:[355,446],planets:[355,405],anchor:"middle"},9:{rashi:[446,355],planets:[405,355],anchor:"middle"},10:{rashi:[428,240],planets:[344,240],anchor:"middle"},11:{rashi:[446,125],planets:[405,125],anchor:"middle"},12:{rashi:[355,34],planets:[355,75],anchor:"middle"}},g=n?{Su:"#C2410C",Mo:"#1E3A8A",Ma:"#B91C1C",Me:"#047857",Ju:"#92400E",Ve:"#BE185D",Sa:"#0F172A",Ra:"#4338CA",Ke:"#6D28D9",As:"#B45309",default:"#0F172A"}:{Su:"#F59E0B",Mo:"#93C5FD",Ma:"#EF4444",Me:"#10B981",Ju:"#FBBF24",Ve:"#F472B6",Sa:"#CBD5E1",Ra:"#C084FC",Ke:"#A78BFA",As:"#DAA520",default:"#F5C842"},R=i=>{if(!i)return"";const $=String(i).match(/^(\d+)°/);return $?`${$[1]}°`:""};let A="";for(let i=1;i<=12;i++){const $=G[i]||{rashi:i,planets:[]},D=t[i],U=$.rashi;let M=[...$.planets||[]];i===1&&!M.some(O=>O.abbr==="As")&&M.unshift({abbr:"As",degree:"",isRetrograde:!1});let tt="";const I=M.length;if(I>0){const O=I===1?0:I===2?20:I===3?18:15,m=I>3?"13":I>2?"15":"17",d=I>2?"10":"11.5";M.forEach((l,u)=>{const Y=D.planets[1]+(u-(I-1)/2)*O,J=g[l.abbr]||g.default,B=l.isRetrograde?'<tspan fill="#DC2626" font-weight="900">®</tspan>':"",rt=R(l.degree);tt+=`
          <text x="${D.planets[0]}" y="${Y+5}" 
                font-family="'Inter', -apple-system, sans-serif" 
                font-size="${m}" 
                font-weight="800" 
                fill="${J}" 
                text-anchor="${D.anchor}"
                style="paint-order: stroke fill; stroke: ${n?"#FFFFFF":"#0B0B1E"}; stroke-width: 3.5px; stroke-linejoin: round;">
            ${l.abbr}${B}${rt?` <tspan font-size="${d}" font-weight="700" fill="${n?"#334155":"#CBD5E1"}">${rt}</tspan>`:""}
          </text>
        `})}const et=n?"#9A3412":"#FBBF24";A+=`
      <!-- House ${i} -->
      <g class="chart-house" data-house="${i}">
        <!-- Large High-Contrast Rashi Number -->
        <text x="${D.rashi[0]}" y="${D.rashi[1]+6}" 
              font-family="'Outfit', 'Inter', sans-serif" 
              font-size="19" 
              font-weight="900" 
              fill="${et}" 
              text-anchor="middle"
              style="paint-order: stroke fill; stroke: ${n?"#FFFFFF":"#0B0B1E"}; stroke-width: 4px; stroke-linejoin: round;">
          ${U}
        </text>
        ${tt}
      </g>
    `}const k=n?"#FFFDF8":"url(#chartBgGrad)",v=n?"#9A3412":"url(#goldBorderGrad)",h=n?"#B45309":"url(#goldBorderGrad)",H=`
    <svg viewBox="0 0 480 480" width="100%" height="100%" class="vedic-chart-svg" style="display: block; margin: 0 auto; max-width: 440px; ${n?"box-shadow: 0 4px 15px rgba(180,83,9,0.12); border-radius: 6px;":"filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));"}">
      <defs>
        ${n?"":`
        <linearGradient id="chartBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0E0E2A" />
          <stop offset="50%" stop-color="#141438" />
          <stop offset="100%" stop-color="#0A0A1F" />
        </linearGradient>
        <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5C842" />
          <stop offset="50%" stop-color="#DAA520" />
          <stop offset="100%" stop-color="#B8860B" />
        </linearGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#DAA520" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#DAA520" stop-opacity="0" />
        </radialGradient>
        `}
      </defs>

      <!-- Background -->
      <rect width="480" height="480" fill="${k}" rx="6" />

      <!-- Outer Frame -->
      <rect x="6" y="6" width="468" height="468" fill="none" stroke="${v}" stroke-width="3" rx="4" />
      <rect x="12" y="12" width="456" height="456" fill="none" stroke="${h}" stroke-width="1.2" stroke-opacity="0.5" />

      <!-- Classical North Indian Diamond Dividing Lines -->
      <!-- Diagonals -->
      <line x1="12" y1="12" x2="468" y2="468" stroke="${h}" stroke-width="2.5" stroke-linecap="round" />
      <line x1="468" y1="12" x2="12" y2="468" stroke="${h}" stroke-width="2.5" stroke-linecap="round" />

      <!-- Central Diamond -->
      <polygon points="240,12 468,240 240,468 12,240" fill="none" stroke="${h}" stroke-width="2.5" stroke-linejoin="round" />

      <!-- Center Glow / Subtle Om -->
      <text x="240" y="258" font-family="'Noto Sans Devanagari', 'Outfit', sans-serif" font-size="56" fill="${n?"#9A3412":"#DAA520"}" fill-opacity="${n?"0.08":"0.12"}" text-anchor="middle" font-weight="900">
        ॐ
      </text>

      <!-- Houses, Planets & Rashi Numbers -->
      ${A}
    </svg>
  `;c.innerHTML=H}function We(r,p,x={}){const c=typeof p=="string"?document.getElementById(p):p;if(!c)return;const n=x.theme==="print"||x.theme==="light"||x.isPrint,G=r.houses||{},t=r.lagnaRashi,e={12:{x:10,y:10},1:{x:125,y:10},2:{x:240,y:10},3:{x:355,y:10},4:{x:355,y:125},5:{x:355,y:240},6:{x:355,y:355},7:{x:240,y:355},8:{x:125,y:355},9:{x:10,y:355},10:{x:10,y:240},11:{x:10,y:125}},o={1:"Aries (1)",2:"Taurus (2)",3:"Gemini (3)",4:"Cancer (4)",5:"Leo (5)",6:"Virgo (6)",7:"Libra (7)",8:"Scorpio (8)",9:"Sagit (9)",10:"Capri (10)",11:"Aquar (11)",12:"Pisces (12)"},A=n?{Su:"#C2410C",Mo:"#1E3A8A",Ma:"#B91C1C",Me:"#047857",Ju:"#92400E",Ve:"#BE185D",Sa:"#0F172A",Ra:"#4338CA",Ke:"#6D28D9",As:"#B45309",default:"#0F172A"}:{Su:"#F59E0B",Mo:"#93C5FD",Ma:"#EF4444",Me:"#10B981",Ju:"#FBBF24",Ve:"#F472B6",Sa:"#CBD5E1",Ra:"#C084FC",Ke:"#A78BFA",As:"#DAA520",default:"#F5C842"},k=i=>{if(!i)return"";const $=String(i).match(/^(\d+)°/);return $?`${$[1]}°`:""},v={};for(let i=1;i<=12;i++)v[i]=[];for(let i=1;i<=12;i++){const $=G[i];if($&&$.rashi){const D=$.rashi;($.planets||[]).forEach(U=>v[D].push(U))}}let h="";for(let i=1;i<=12;i++){const $=e[i],D=i===t,U=v[i]||[];let M="";const tt=U.length,I=tt>3?15:18,et=tt>3?"13":"15";U.forEach((d,l)=>{const u=$.y+38+l*I,Y=A[d.abbr]||A.default,J=d.isRetrograde?'<tspan fill="#DC2626" font-weight="900">®</tspan>':"",B=k(d.degree);M+=`
        <text x="${$.x+12}" y="${u}" 
              font-family="'Inter', sans-serif" 
              font-size="${et}" 
              font-weight="800" 
              fill="${Y}"
              style="paint-order: stroke fill; stroke: ${n?"#FFFFFF":"#0B0B1E"}; stroke-width: 3px;">
          ${d.abbr}${J}${B?` <tspan font-size="11" font-weight="700" fill="${n?"#334155":"#CBD5E1"}">${B}</tspan>`:""}
        </text>
      `});const O=n?D?"#FEF3C7":"#FFFFFF":D?"rgba(218, 165, 32, 0.15)":"rgba(255, 255, 255, 0.02)",m=n?"#B45309":D?"#DAA520":"rgba(218, 165, 32, 0.3)";h+=`
      <!-- Box for Sign ${i} -->
      <g class="south-chart-box" data-rashi="${i}">
        <rect x="${$.x}" y="${$.y}" width="115" height="115" 
              fill="${O}" stroke="${m}" stroke-width="${D?"2.5":"1.5"}" rx="3" />
        <text x="${$.x+8}" y="${$.y+16}" 
              font-family="'Outfit', sans-serif" font-size="12" font-weight="800" 
              fill="${n?"#78350F":"#DAA520"}">
          ${o[i]}
        </text>
        ${D?`
          <text x="${$.x+105}" y="${$.y+16}" 
                font-family="'Inter', sans-serif" font-size="12" font-weight="900" 
                fill="#B45309" text-anchor="end"
                style="paint-order: stroke fill; stroke: #FFFFFF; stroke-width: 2px;">
            LAGNA
          </text>
        `:""}
        ${M}
      </g>
    `}const T=n?"#FFFDF8":"#0A0A1F",f=n?"#9A3412":"#DAA520",H=`
    <svg viewBox="0 0 480 480" width="100%" height="100%" class="vedic-chart-svg" style="display: block; margin: 0 auto; max-width: 440px; ${n?"box-shadow: 0 4px 15px rgba(180,83,9,0.12);":"filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));"}">
      <rect width="480" height="480" fill="${T}" rx="6" />
      <rect x="6" y="6" width="468" height="468" fill="none" stroke="${f}" stroke-width="2.5" rx="4" />

      <!-- Center Box -->
      <rect x="125" y="125" width="230" height="230" 
            fill="${n?"#FFFBEB":"rgba(218,165,32,0.05)"}" 
            stroke="${f}" stroke-width="2" />
      <text x="240" y="235" font-family="'Outfit', sans-serif" font-size="20" font-weight="900" fill="${n?"#9A3412":"#DAA520"}" text-anchor="middle">
        SOUTH INDIAN
      </text>
      <text x="240" y="260" font-family="'Inter', sans-serif" font-size="13" font-weight="700" fill="${n?"#78350F":"#94A3B8"}" text-anchor="middle">
        Fixed Zodiac Kundali
      </text>

      ${h}
    </svg>
  `;c.innerHTML=H}function Lt(r,p,x="north",c={}){x==="south"?We(r,p,c):Qe(r,p,c)}function Xe(r,p,x,c,n={},G="hi"){var xt,ft,$t,kt,Dt,wt,Ct,At,Ft,y,st,dt,gt,It,Rt,Tt,Mt,Ot,jt,Vt,Gt,Ht,Ut,_t,Kt,qt,Yt,Jt,Zt,Qt,Wt,Xt,te,ee,ae,se,ie,ne,oe,re,le,de;const t=["en","hi","kn","mr","te"].includes(G)?G:"hi",e=Ge(t),o=xe[t]||xe.en,g=ze(r,t),R=fe[t]||fe.hi,A=ye[t]||ye.hi,k=ve[t]||ve.en,v=be[t]||be.en,h=r.planets.find(s=>s.name==="Moon"),T=Le(h.nakshatra,h.pada,t),f=Ke(n.date||"1995-10-24",((xt=r.birthDetails)==null?void 0:xt.latitude)||25.3176,((ft=r.birthDetails)==null?void 0:ft.longitude)||82.9739,(($t=r.birthDetails)==null?void 0:$t.timezone)||5.5),H=Pe(r,n),i={...H,attributes:Ne(H.attributes,t,r.lagna.rashiName)},$=Ie(r,n);Re(r,n);const D=Te(r,n),U=(n.name||"Seeker").trim()||"Seeker",M=n.date||"1995-10-24",tt=n.time||"10:30",I=n.city||"New Delhi, Delhi",et=(n.phone||"").trim(),O=!!et,m=qe(h.longitude,M),d=Ye(m),l=Je(U,M,n.phone||""),u=O?Ze(et,l.mulank.number,l.bhagyank.number):null,Y={en:"Not Provided (Optional)",hi:"उपलब्ध नहीं (ऐच्छिक)",kn:"ತಿಳಿಸಿಲ್ಲ (ಐಚ್ಛಿಕ)",mr:"दिलेले नाही (ऐच्छಿಕ)",te:"తెలిಯజేయలేదు (ఐచ్ఛికం)"},J={en:"Not Specified",hi:"निर्दिष्ट नहीं",kn:"ತಿಳಿಸಿಲ್ಲ",mr:"नमूद नाही",te:"తెలిಯజేಯలేదు"},B=C(U),rt=n.fatherName?n.fatherName.trim():J[t]||"Not Specified",mt=C(rt),lt=n.motherName?n.motherName.trim():J[t]||"Not Specified",ht=C(lt),pt=C(I),at=C(M),F=C(tt),P=C(et),_=O?P:C(Y[t]),j=((kt=me[r.lagna.rashiName])==null?void 0:kt[t])||me.Sagittarius[t],a=((Dt=he[r.lagna.lord])==null?void 0:Dt[t])||he.Jupiter[t],E=((wt=ue[r.lagna.lord])==null?void 0:wt[t])||ue.Jupiter[t],vt=D.mantras.lagna.beejMantra||D.mantras.lagna.mantra,Et=D.mantras.bhagya.beejMantra||D.mantras.bhagya.mantra,bt=((Ct=Bt[h.rashi])==null?void 0:Ct[t])||h.rashiName,Z=((At=Bt[r.lagna.rashi])==null?void 0:At[t])||r.lagna.rashiName,nt={en:{tithi:"Tithi:",yoga:"Yoga:",karana:"Karana:",vara:"Vara (Day):",sunrise:"Sunrise:",ritu:"Ritu (Season):"},hi:{tithi:"तिथि:",yoga:"योग:",karana:"करण:",vara:"वार (दिन):",sunrise:"सूर्योदय:",ritu:"ऋतु:"},kn:{tithi:"ತಿಥಿ:",yoga:"ಯೋಗ:",karana:"ಕರಣ:",vara:"ವಾರ (ದಿನ):",sunrise:"ಸೂರ್ಯೋದಯ:",ritu:"ಋತು:"},mr:{tithi:"तिथी:",yoga:"योग:",karana:"करण:",vara:"वार (दिवस):",sunrise:"सूर्योदय:",ritu:"ऋतू:"},te:{tithi:"తిథి:",yoga:"యోగం:",karana:"కరణం:",vara:"వారం (రోజు):",sunrise:"సూర్యోదయం:",ritu:"ఋతువు:"}}[t]||{tithi:"Tithi:",yoga:"Yoga:",karana:"Karana:",vara:"Vara (Day):",sunrise:"Sunrise:",ritu:"Ritu (Season):"},St={en:"Sharad (Autumn)",hi:"शरद ऋतु",kn:"ಶರದ್ ಋತು",mr:"शरद ऋतू",te:"శరద్ ఋతువు"}[t]||"Sharad",yt={en:{d1:`D-1 Lagna Chart (Ascendant - ${Z})`,d9:"D-9 Navamsha Chart (Subtle Destiny)"},hi:{d1:`डी-१ लग्न कुण्डली (${Z})`,d9:"डी-९ नवांश कुण्डली (सूक्ष्म भाग्य)"},kn:{d1:`ಡಿ-೧ ಲಗ್ನ ಕುಂಡಲಿ (${Z})`,d9:"ಡಿ-೯ ನವಾಂಶ ಕುಂಡಲಿ (ಸೂಕ್ಷ್ಮ ಭಾಗ್ಯ)"},mr:{d1:`डी-१ लग्न कुंडली (${Z})`,d9:"डी-९ नवांश कुंडली (सूक्ष्म भाग्य)"},te:{d1:`డి-1 లగ్న కుండలి (${Z})`,d9:"డి-9 నవాంశ కుండలి (సూక్ష్మ భాగ్యం)"}}[t]||{d1:`D-1 Lagna Chart (Ascendant - ${Z})`,d9:"D-9 Navamsha Chart (Subtle Destiny)"},Q={en:{mulank:"Mulank (Birth / Driver Number):",bhagyank:"Bhagyank (Destiny / Conductor):",chaldean:"Chaldean Namank (Name Vibration):",compound:"Compound:",pythagorean:"Pythagorean Expression:",soulUrge:"Soul Urge:",loShuTitle:"3x3 Sacred Lo Shu Magic Square",newSimTitle:"Golden Recommendation for New SIM / Mobile Connection:"},hi:{mulank:"मूलांक (जन्म अंक):",bhagyank:"भाग्यांक (जीवन अंक):",chaldean:"खाल्डियन नामांक (नाम शक्ति):",compound:"संयुक्तांक:",pythagorean:"पाइथागोरियन अभिव्यक्ति अंक:",soulUrge:"आत्म प्रेरणा अंक:",loShuTitle:"३x३ पवित्र लो-शू महायंत्र चक्र",newSimTitle:"नवीन सिम / मोबाइल कनेक्शन हेतु स्वर्ण अनुशंसा:"},kn:{mulank:"ಮೂಲ್ಯಾಂಕ (ಜನ್ಮ ಸಂಖ್ಯೆ):",bhagyank:"ಭಾಗ್ಯಾಂಕ (ಜೀವನ ಸಂಖ್ಯೆ):",chaldean:"ಚಾಲ್ಡಿಯನ್ ನಾಮಾಂಕ (ನಾಮ ಶಕ್ತಿ):",compound:"ಸಂಯುಕ್ತ ಮೊತ್ತ:",pythagorean:"ಪೈಥಾಗೋರಿಯನ್ ಅಭಿವ್ಯಕ್ತಿ ಸಂಖ್ಯೆ:",soulUrge:"ಆತ್ಮ ಪ್ರೇರಣೆ ಸಂಖ್ಯೆ:",loShuTitle:"೩x೩ ಪವಿತ್ರ ಲೋ-ಶೂ ಚಕ್ರ",newSimTitle:"ನೂತನ ಸಿಮ್ / ಮೊಬೈಲ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ ಸುವರ್ಣ ಶಿಫಾರಸು:"},mr:{mulank:"मूलांक (जन्म अंक):",bhagyank:"भाग्यांक (जीवन अंक):",chaldean:"चाल्डियन नामांक (नाव शक्ती):",compound:"संयुक्त बेरीज:",pythagorean:"पायथागोरियन अभिव्यक्ती अंक:",soulUrge:"आत्म प्रेरणा अंक:",loShuTitle:"३x३ पवित्र लो-शू महायंत्र चक्र",newSimTitle:"नवीन सिम / मोबाइल कनेक्शनसाठी सुवर्ण शिफारस:"},te:{mulank:"మూలాంకం (జన్మ సంఖ్య):",bhagyank:"భాగ్యాంకం (జీవన సంఖ్య):",chaldean:"చాల్డియన్ నామాంకం (పేరు శక్తి):",compound:"సంయుక్త మొత్తం:",pythagorean:"పైథాగోరియన్ వ్యక్తీకరణ సంఖ్య:",soulUrge:"ఆత్మ ప్రేరణ సంఖ్య:",loShuTitle:"3x3 పవిత్ర లో-షూ చక్రం",newSimTitle:"కొత్త సిమ్ / మొబైల్ కనెక్షన్ కోసం సువర్ణ సిఫార్సు:"}}[t]||{mulank:"Mulank (Birth / Driver Number):",bhagyank:"Bhagyank (Destiny / Conductor):",chaldean:"Chaldean Namank (Name Vibration):",compound:"Compound:",pythagorean:"Pythagorean Expression:",soulUrge:"Soul Urge:",loShuTitle:"3x3 Sacred Lo Shu Magic Square",newSimTitle:"Golden Recommendation for New SIM / Mobile Connection:"},ct={en:["Q1 (Jan–Mar)","Q2 (Apr–Jun)","Q3 (Jul–Sep)","Q4 (Oct–Dec)"],hi:["प्रथम त्रैमास (जनवरी-मार्च)","द्वितीय त्रैमास (अप्रैल-जून)","तृतीय त्रैमास (जुलाई-सितंबर)","चतुर्थ त्रैमास (अक्टूबर-दिसंबर)"],kn:["ಮೊದಲ ತ್ರೈಮಾಸಿಕ (ಜನವರಿ-ಮಾರ್ಚ್)","ಎರಡನೇ ತ್ರೈಮಾಸಿಕ (ಏಪ್ರಿಲ್-ಜೂನ್)","ಮೂರನೇ ತ್ರೈಮಾಸಿಕ (ಜುಲೈ-ಸೆಪ್ಟೆಂಬರ್)","ನಾಲ್ಕನೇ ತ್ರೈಮಾಸಿಕ (ಅಕ್ಟೋಬರ್-ಡಿಸೆಂಬರ್)"],mr:["पहिली तिमाही (जानेवारी-मार्च)","दुसरी तिमाही (एप्रिल-जून)","तिसरी तिमाही (जुलै-सप्टेंबर)","चौथी तिमाही (ऑक्टोबर-डिसेंबर)"],te:["మొదటి త్రైమాసికం (జనవరి-మార్చి)","రెండవ త్రైమాసికం (ఏప్రిల్-జూన్)","మూడవ త్రైమాసికం (జూలై-సెప్టెంబర్)","నాల్గవ త్రైమాసికం (అక్టోబర్-డిసెంబర్)"]}[t]||["Q1 (Jan–Mar)","Q2 (Apr–Jun)","Q3 (Jul–Sep)","Q4 (Oct–Dec)"],K=(s,S)=>{let b='<span style="color: #94A3B8; font-size: 13px;">—</span>';return S>0&&(b=`<span style="color: #9A3412; font-weight: 900; font-size: 18px;">${String(s).repeat(Math.min(S,4))}</span>`),`
      <div style="border: 1.5px solid #D97706; padding: 8px; text-align: center; background: ${S>0?"#FEF3C7":"#FFFFFF"}; border-radius: 6px; min-height: 52px; display: flex; flex-direction: column; justify-content: center; position: relative;">
        <span style="position: absolute; top: 3px; left: 5px; font-size: 10.5px; color: #92400E; font-weight: 800;">${s}</span>
        ${b}
      </div>
    `};return`
    <div class="patrika-report-wrapper" id="printable-patrika">
      <!-- Print & Share Actions Bar (hidden when printing) -->
      <div class="no-print" style="background: rgba(218,165,32,0.12); border: 2px solid var(--gold-500); padding: 16px 22px; border-radius: var(--radius-lg); margin-bottom: var(--space-6); display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <strong style="color: var(--gold-400); font-size: 16px;">${e.meta.title}</strong>
            <div style="font-size: 12.5px; color: #CBD5E1; margin-top: 2px;">
              ${{kn:"ಮುದ್ರಿಸಬಹುದಾದ ಉನ್ನತ-ರೆಸಲ್ಯೂಶನ್ ಸ್ವರೂಪ • ಸ್ಪಷ್ಟ ಕುಂಡಲಿ ಚಕ್ರಗಳು ಮತ್ತು ಶುದ್ಧ ಕನ್ನಡ ಪಠ್ಯ",hi:"उच्च-रेजोल्यूशन मुद्रण योग्य प्रारूप • स्पष्ट कुंडली चक्र एवं प्रामाणिक हिंदी पाठ",mr:"उच्च दर्जाचे मुद्रण योग्य स्वरूप • स्पष्ट कुंडली चक्रे व अस्खलित मराठी मजकूर",te:"హై-డెఫినిషన్ ప్రింటబుల్ ఫార్మాట్ • స్పష్టమైన జాతక చక్రాలు & స్వచ్ఛమైన తెలుగు",en:"High-Definition 300DPI Printable & Sharable Format • Crystal-Clear Charts & Enhanced Typography"}[t]}
            </div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="trigger-pdf-download-btn" class="btn btn-primary" style="padding: 9px 22px; font-weight: 800; font-size: 13.5px; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(218,165,32,0.4);">
              <span>📥</span> ${{kn:"ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (ಕನ್ನಡ)",hi:"पीडीएफ डाउनलोड करें (हिंदी)",mr:"पीडीएफ डाउनलोड करा (मराठी)",te:"పిడిఎఫ్ డౌన్‌లోడ్ చేయండి (తెలుగు)",en:"Download PDF File (English)"}[t]}
            </button>
            <button id="trigger-pdf-print-btn" class="btn btn-secondary" style="padding: 9px 18px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              <span>🖨️</span> ${{kn:"ಪ್ರಿಂಟ್ / ಪಿಡಿಎಫ್ ಉಳಿಸಿ",hi:"प्रिंट / सेव पीडीएफ",mr:"प्रिंट / सेव्ह पीडीएफ",te:"ప్రింట్ / సేవ్ పిడిఎఫ్",en:"Print / Save as PDF"}[t]}
            </button>
            <button id="trigger-whatsapp-share-btn" class="btn btn-secondary" style="padding: 9px 18px; font-weight: 700; border-color: #25D366; color: #25D366; display: inline-flex; align-items: center; gap: 6px;">
              <span>💬</span> ${{kn:"ವಾಟ್ಸಾಪ್",hi:"व्हाट्सएप",mr:"व्हॉट्सॲप",te:"వాట్సాప్",en:"WhatsApp"}[t]}
            </button>
            <button id="trigger-copy-link-btn" class="btn btn-secondary" style="padding: 9px 18px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
              <span>🔗</span> ${{kn:"ಲಿಂಕ್ ನಕಲಿಸಿ",hi:"लिंक कॉपी करें",mr:"लिंक कॉपी करा",te:"లింక్ కాపీ చేయండి",en:"Copy Link"}[t]}
            </button>
          </div>
        </div>

        <!-- Language Switcher Strip -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding-top: 8px; border-top: 1px dashed rgba(218,165,32,0.3); font-size: 13px;">
          <div style="color: var(--gold-400); font-weight: 700; display: flex; align-items: center; gap: 6px;">
            <span>🌐</span> <strong>${{kn:"ವರದಿ ಮತ್ತು ಪಿಡಿಎಫ್ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:",hi:"रिपोर्ट एवं पीडीएफ भाषा चुनें:",mr:"अहवाल व पीडीएफ भाषा निवडा:",te:"రిపోర్ట్ & పిడిఎఫ్ భాషను ఎంచుకోండి:",en:"Choose Report & PDF Language:"}[t]}</strong>
          </div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${t==="en"?"btn-primary":"btn-secondary"}" data-lang="en" style="padding: 4px 12px; font-weight: 800;">
              English
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${t==="hi"?"btn-primary":"btn-secondary"}" data-lang="hi" style="padding: 4px 12px; font-weight: 800;">
              हिंदी (Hindi)
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${t==="kn"?"btn-primary":"btn-secondary"}" data-lang="kn" style="padding: 4px 12px; font-weight: 800;">
              ಕನ್ನಡ (Kannada)
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${t==="mr"?"btn-primary":"btn-secondary"}" data-lang="mr" style="padding: 4px 12px; font-weight: 800;">
              मराठी (Marathi)
            </button>
            <button type="button" class="btn btn-xs patrika-lang-choice-btn ${t==="te"?"btn-primary":"btn-secondary"}" data-lang="te" style="padding: 4px 12px; font-weight: 800;">
              తెలుగు (Telugu)
            </button>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 1: COVER & SACRED BIRTH PARTICULARS                -->
      <!-- ======================================================== -->
      <div class="patrika-page page-1">
        <div class="patrika-border">
          <div class="patrika-header">
            <div class="patrika-om">${e.meta.om}</div>
            <h1 class="patrika-title">${e.meta.title}</h1>
            <p class="patrika-subtitle">${e.meta.subtitle}</p>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s1}</span>
          </div>

          <table class="patrika-print-table" style="margin-bottom: 14px;">
            <tbody>
              <tr>
                <td style="width: 25%;"><strong>${e.fields.name}:</strong></td>
                <td style="width: 25%;"><strong style="color: #9A3412; font-size: 13.5px;">${B}</strong></td>
                <td style="width: 25%;"><strong>${e.fields.dob}:</strong></td>
                <td style="width: 25%;">${at}</td>
              </tr>
              <tr>
                <td><strong>${e.fields.tob}:</strong></td>
                <td>${F} (24 Hr)</td>
                <td><strong>${e.fields.pob}:</strong></td>
                <td>${pt}</td>
              </tr>
              <tr>
                <td><strong>${e.fields.father}:</strong></td>
                <td>${mt}</td>
                <td><strong>${e.fields.mother}:</strong></td>
                <td>${ht}</td>
              </tr>
              <tr>
                <td><strong>${e.fields.phone}:</strong></td>
                <td>${O?`<strong style="color: #9A3412;">${_}</strong>`:`<span style="color: #64748B;">${_}</span>`}</td>
                <td><strong>${e.fields.coords}:</strong></td>
                <td>${r.birthDetails.latitude}°N, ${r.birthDetails.longitude}°E</td>
              </tr>
              <tr>
                <td><strong>${e.fields.ayanamsa}:</strong></td>
                <td>${r.birthDetails.ayanamsaValue}° (${((Ft=ut.ayanamsa[r.birthDetails.ayanamsaSystem])==null?void 0:Ft[t])||C(r.birthDetails.ayanamsaSystem)})</td>
                <td><strong>${e.fields.tz}:</strong></td>
                <td>UTC +${r.birthDetails.timezone}</td>
              </tr>
            </tbody>
          </table>

          <div style="padding: 12px 16px; background: rgba(218,165,32,0.08); border-left: 4px solid #DAA520; border-radius: 4px; margin-bottom: 14px; font-size: 12.5px; line-height: 1.6;">
            <div style="font-weight: 800; font-size: 13px; color: #9A3412; margin-bottom: 4px;">${e.sections.janamNaamTitle}</div>
            <div>
              <strong>${e.fields.nakshatra}:</strong> ${((y=zt[h.nakshatraName])==null?void 0:y[t])||h.nakshatraName} &bull; 
              <strong>${e.fields.pada}:</strong> ${h.pada} &bull; 
              <strong>${e.fields.prescribedSyllable}:</strong> <strong style="color: #B45309; font-size: 15px;">${T.syllable}</strong>
            </div>
            <div style="font-size: 11.5px; color: #475569; margin-top: 2px;">
              ${T.explanation}
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s2}</span>
          </div>

          <div class="patrika-table-grid" style="grid-template-columns: repeat(2, 1fr); margin-bottom: 14px;">
            <div class="p-cell"><span class="p-lbl">${e.fields.lagna}:</span><strong class="p-val">${Z} (${r.lagna.degreeFormatted})</strong></div>
            <div class="p-cell"><span class="p-lbl">${e.fields.lagnaLord}:</span><strong class="p-val">${((st=L[r.lagna.lord])==null?void 0:st[t])||r.lagna.lord}</strong></div>
            <div class="p-cell"><span class="p-lbl">${e.fields.moonSign}:</span><strong class="p-val">${bt} (${h.degreeFormatted})</strong></div>
            <div class="p-cell"><span class="p-lbl">${e.fields.moonLord}:</span><strong class="p-val">${((dt=L[we[h.rashi-1].lord])==null?void 0:dt[t])||we[h.rashi-1].lord}</strong></div>
            <div class="p-cell"><span class="p-lbl">${e.fields.nakshatra}:</span><strong class="p-val">${((gt=zt[h.nakshatraName])==null?void 0:gt[t])||h.nakshatraName} (${e.fields.pada} ${h.pada})</strong></div>
            <div class="p-cell"><span class="p-lbl">${e.fields.sunSign}:</span><strong class="p-val">${((It=Bt[r.planets.find(s=>s.name==="Sun").rashi])==null?void 0:It[t])||r.planets.find(s=>s.name==="Sun").rashiName}</strong></div>
            <div class="p-cell"><span class="p-lbl">${nt.tithi}</span><strong class="p-val">${((Rt=ut.tithis[f.tithi.name])==null?void 0:Rt[t])||f.tithi.name} (${((Tt=ut.pakshas[f.tithi.paksha])==null?void 0:Tt[t])||f.tithi.paksha})</strong></div>
            <div class="p-cell"><span class="p-lbl">${nt.yoga}</span><strong class="p-val">${((Mt=ut.yogas[f.yoga.name])==null?void 0:Mt[t])||f.yoga.name}</strong></div>
            <div class="p-cell"><span class="p-lbl">${nt.karana}</span><strong class="p-val">${((Ot=ut.karanas[f.karana.name])==null?void 0:Ot[t])||f.karana.name}</strong></div>
            <div class="p-cell"><span class="p-lbl">${nt.vara}</span><strong class="p-val">${((jt=ut.weekdays[f.weekday])==null?void 0:jt[t])||f.weekday}</strong></div>
            <div class="p-cell"><span class="p-lbl">${nt.sunrise}</span><strong class="p-val">${f.sunrise}</strong></div>
            <div class="p-cell"><span class="p-lbl">${nt.ritu}</span><strong class="p-val">${St}</strong></div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","1")} &bull; ${((Vt=ot[t])==null?void 0:Vt.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 2: CHARTS & PLANETARY LONGITUDES                    -->
      <!-- ======================================================== -->
      <div class="patrika-page page-2">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s3}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s3}</span>
          </div>

          <!-- Dual High-Resolution Kundali SVG Charts (Enlarged to 350px for Crisp Readability) -->
          <div style="display: flex; gap: 16px; justify-content: center; margin-bottom: 12px; flex-wrap: wrap;">
            <div style="flex: 1 1 350px; max-width: 350px; text-align: center;">
              <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 6px;">
                ${yt.d1}
              </div>
              <div id="print-lagna-chart" style="width: 350px; height: 350px; margin: 0 auto; background: #FFFDF8; border: 1.5px solid #D97706; border-radius: 8px; box-shadow: 0 4px 15px rgba(217,119,6,0.12);"></div>
            </div>

            <div style="flex: 1 1 350px; max-width: 350px; text-align: center;">
              <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 6px;">
                ${yt.d9}
              </div>
              <div id="print-navamsa-chart" style="width: 350px; height: 350px; margin: 0 auto; background: #FFFDF8; border: 1.5px solid #D97706; border-radius: 8px; box-shadow: 0 4px 15px rgba(217,119,6,0.12);"></div>
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s4}</span>
          </div>

          <table class="patrika-print-table" style="font-size: 12px;">
            <thead>
              <tr>
                <th>${e.fields.planet||"Planet"}</th>
                <th>${e.fields.sign||"Sign"}</th>
                <th>${e.fields.degree||"Degree"}</th>
                <th>${e.fields.nakshatra||"Nakshatra"}</th>
                <th>${e.fields.pada||"Pada"}</th>
                <th>${e.fields.house||"House"}</th>
                <th>${e.fields.status||"Dignity"}</th>
                <th>${e.fields.speed||"Speed"}</th>
              </tr>
            </thead>
            <tbody>
              ${r.planets.map(s=>{var N,W,X;const S=((N=L[s.name])==null?void 0:N[t])||s.name,b=((W=Bt[s.rashi])==null?void 0:W[t])||s.rashiName,w=((X=zt[s.nakshatraName])==null?void 0:X[t])||s.nakshatraName,z=Me(s.name,s.rashi),V=e.dignities[z]||z,q=s.isRetrograde?o.motionRetro||"ವಕ್ರ":o.motionDirect||"ಮಾರ್ಗಿ";return`
                  <tr>
                    <td><strong>${s.symbol} ${S}</strong> ${s.isRetrograde?'<span style="color: #DC2626; font-weight: 800;">(R)</span>':""}</td>
                    <td>${b}</td>
                    <td>${s.degreeFormatted}</td>
                    <td>${w}</td>
                    <td>${s.pada}</td>
                    <td><strong>${s.house}</strong></td>
                    <td><span style="color: ${z==="Exalted"||z==="Own"||z==="Moolatrikona"?"#16A34A":z==="Debilitated"||z==="Enemy"?"#DC2626":"#9A3412"}; font-weight: 700;">${V}</span></td>
                    <td>${q}</td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","2")} &bull; ${((Gt=ot[t])==null?void 0:Gt.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 3: DASHA SYSTEM, YOGAS & DOSHAS                     -->
      <!-- ======================================================== -->
      <div class="patrika-page page-3">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s5}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s5}</span>
          </div>

          <div style="margin: 8px 0; padding: 12px; background: rgba(218,165,32,0.08); border-left: 4px solid #DAA520; font-size: 13px; line-height: 1.6;">
            <strong>${e.fields.activeDasha}:</strong> 
            ${d?`${((Ht=L[d.mahaDasha])==null?void 0:Ht[t])||d.mahaDasha} ${k.mahaDasha} - ${((Ut=L[d.antarDasha])==null?void 0:Ut[t])||d.antarDasha} ${k.antarDasha} (${k.until} ${d.antarEnd})`:k.activeCycle}
            &bull; <strong>${k.startingBalance}</strong> ${((_t=L[m.startingDashaLord])==null?void 0:_t[t])||m.startingDashaLord} (${m.balanceOfDasha} ${k.yrs})
          </div>

          <table class="patrika-print-table" style="margin-bottom: 12px; font-size: 12.5px;">
            <thead>
              <tr>
                <th>${k.dashaLord}</th>
                <th>${k.duration}</th>
                <th>${k.startDate}</th>
                <th>${k.endDate}</th>
                <th>${k.status}</th>
              </tr>
            </thead>
            <tbody>
              ${m.periods.slice(0,9).map(s=>{var b;const S=((b=L[s.lord])==null?void 0:b[t])||s.lord;return`
                  <tr style="${s.isActive?"background: #FEF3C7; font-weight: 800;":""}">
                    <td><strong>${S}</strong></td>
                    <td>${s.balanceYears} ${k.yrs}</td>
                    <td>${s.startDate}</td>
                    <td>${s.endDate}</td>
                    <td>${s.isActive?k.active:new Date(s.endDate)<new Date?k.elapsed:k.upcoming}</td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>

          <div class="patrika-section-title">
            <span>${e.sections.s6}</span>
          </div>
          <div style="margin-bottom: 10px;">
            ${x.slice(0,4).map(s=>{var V;const S=s.name.toLowerCase().replace(/[^a-z]/g,""),b=Object.keys($e).find(q=>{const N=q.toLowerCase().replace(/[^a-z]/g,"");return N===S||N.includes(S)||S.includes(N)}),w=b&&((V=$e[b])==null?void 0:V[t])||{name:s.name,strength:s.strength,desc:s.description,remedy:s.remedy},z=o.enhancementLabel||"ಪರಿಹಾರ / ಶುಭ ಫಲ ವೃದ್ಧಿ:";return`
                <div style="margin-bottom: 8px; font-size: 12.5px; padding: 8px 12px; background: #F0FDF4; border-left: 4px solid #16A34A; border-radius: 4px; line-height: 1.5;">
                  <strong style="color: #15803D; font-size: 13px;">${w.name} &bull; ${w.strength}:</strong> 
                  <div style="color: #1E293B; margin-top: 2px;">${w.desc}</div>
                  <div style="font-size: 11.5px; color: #B45309; margin-top: 4px;"><strong>${z}</strong> ${w.remedy}</div>
                </div>
              `}).join("")}
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s7}</span>
          </div>
          <div>
            ${c.map(s=>{var ce;let S=null;const b=s.name.toLowerCase();b.includes("kaal sarp")||b.includes("कालसर्प")||b.includes("ಕಾಳಸರ್ಪ")||b.includes("కాలసర్ప")?S="Kaal Sarp Dosha":b.includes("manglik")||b.includes("kuja")||b.includes("मांगलिक")||b.includes("ಮಂಗಳ")||b.includes("కుజ")?S="Manglik Dosha (Kuja Dosha)":b.includes("shani")||b.includes("sade sati")||b.includes("शनि")||b.includes("ಶನಿ")||b.includes("శని")?S="Shani Influence (Sade Sati / Dhaiya)":b.includes("pitra")||b.includes("पितृ")||b.includes("ಪಿತೃ")||b.includes("పితృ")?S="Pitra Dosha":(b.includes("guru chandal")||b.includes("गुरु चांडाल")||b.includes("ಗುರು ಚಾಂಡಾಲ"))&&(S="Guru Chandal Dosha");let w=S?(ce=Oe[S])==null?void 0:ce[t]:null;w||(w={name:s.name,clearStatus:t==="kn"?"ದೋಷ ಮುಕ್ತ (ಇಲ್ಲ)":t==="hi"?"दोष मुक्त (अनुपस्थित)":"Clear / Not Present",clearImpact:s.impact,activeStatus:t==="kn"?"ಸಕ್ರಿಯ ಪ್ರಭಾವ":t==="hi"?"सक्रिय प्रभाव":"Active Intensity",activeImpact:s.impact,neutralizedStatus:t==="kn"?"ದೋಷ ಪರಿಹಾರಗೊಂಡಿದೆ":t==="hi"?"दोष शमित":"Neutralized",neutralizedImpact:s.impact});let z=w.name;s.name.includes("Anshik")&&t==="kn"?z=`ಆಂಶಿಕ ${z}`:s.name.includes("Poorna")&&t==="kn"?z=`ಪೂರ್ಣ ${z}`:s.name.includes("Anshik")&&t==="hi"?z=`आंशिक ${z}`:s.name.includes("Poorna")&&t==="hi"&&(z=`पूर्ण ${z}`);let V=w.clearStatus,q=w.clearImpact,N="#15803D",W="#F8FAFC",X="#16A34A";s.id==="shani_influence"?s.valid===!1?(V=w.unavailableStatus||"Assessment Unavailable",q=s.details||w.unavailableImpact,N="#64748B",W="#F8FAFC",X="#94A3B8"):s.present?s.cancelled?(V=w.neutralizedStatus,q=w.neutralizedImpact,N="#B45309",W="#F8FAFC",X="#F59E0B"):s.isDhaiya?(V=w.activeDhaiyaStatus||"Active Dhaiya (Kantaka / Ashtama Shani)",q=s.details||w.activeDhaiyaImpact,N="#B91C1C",W="#FEF2F2",X="#DC2626"):(V=w.activeStatus,q=s.details||w.activeImpact,N="#B91C1C",W="#FEF2F2",X="#DC2626"):(V=w.clearStatus,q=s.details||w.clearImpact,N="#15803D",W="#F8FAFC",X="#16A34A"):s.present&&(s.cancelled?(V=w.neutralizedStatus,q=w.neutralizedImpact,N="#B45309",W="#F8FAFC",X="#F59E0B"):(V=w.activeStatus,q=w.activeImpact,N="#B91C1C",W="#FEF2F2",X="#DC2626"));const Fe={en:"Transit assessment date",hi:"गोचर आकलन तिथि",kn:"ಗೋಚಾರ ಪರಿಶೀಲನಾ ದಿನಾಂಕ",mr:"गोचर मूल्यांकन तारीख",te:"గోచార పరిశీలన తేదీ"}[t]||"Transit assessment date",pe=s.assessmentDate||n.transitDate||n.assessmentDate||null,Ee=s.id==="shani_influence"&&s.valid!==!1&&pe?`<div style="font-size: 11px; color: #64748B; margin-top: 4px;"><strong>${Fe}:</strong> ${C(pe)}</div>`:"",Se=s.endingTimeline&&s.present?`<div style="font-size: 11px; color: #9A3412; margin-top: 3px; font-weight: 600;"><strong>⏳ ${t==="hi"?"समाप्ति / शमन अवधि":t==="kn"?"ಮುಕ್ತಾಯ / ಶಮನ ಅವಧಿ":"Ending / Relief Milestone"}:</strong> ${C(s.endingTimeline)}</div>`:"";return`
                <div style="margin-bottom: 8px; font-size: 12.5px; padding: 8px 12px; background: ${W}; border-left: 4px solid ${X}; border-radius: 4px; line-height: 1.5;">
                  <strong style="color: ${N}; font-size: 13px;">${z}:</strong> 
                  <span style="font-weight: 700; color: ${N};">${V}</span>
                  <div style="font-size: 12px; color: #334155; margin-top: 2px;">${q}</div>
                  ${Se}
                  ${Ee}
                </div>
              `}).join("")}
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","3")} &bull; ${((Kt=ot[t])==null?void 0:Kt.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 4: GOOD/BAD ATTRIBUTES, CAREER & MARRIAGE TIMING    -->
      <!-- ======================================================== -->
      <div class="patrika-page page-4">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s8}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s8}</span>
          </div>

          <table class="patrika-print-table" style="margin-bottom: 12px; font-size: 12.5px;">
            <thead>
              <tr>
                <th style="width: 25%;">${v.category}</th>
                <th style="width: 40%; color: #16A34A;">${v.favorable}</th>
                <th style="width: 35%; color: #DC2626;">${v.inauspicious}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${e.fields.luckyNum}</strong></td>
                <td><strong style="color: #15803D;">${i.attributes.luckyNumbers.join(", ")}</strong></td>
                <td><span style="color: #DC2626;">${i.attributes.unluckyNumbers.join(", ")}</span> ${v.caution}</td>
              </tr>
              <tr>
                <td><strong>${e.fields.luckyColor}</strong></td>
                <td><strong style="color: #15803D;">${i.attributes.luckyColors.join(", ")}</strong></td>
                <td><span style="color: #DC2626;">${i.attributes.unluckyColors.join(", ")}</span></td>
              </tr>
              <tr>
                <td><strong>${v.directions}</strong></td>
                <td>${i.attributes.favorableDirections.join(", ")}</td>
                <td>${i.attributes.unfavorableDirections.join(", ")}</td>
              </tr>
              <tr>
                <td><strong>${e.fields.luckyDay}</strong></td>
                <td>${i.attributes.favorableDays.join(", ")}</td>
                <td>${i.attributes.unfavorableDays.join(", ")}</td>
              </tr>
              <tr>
                <td><strong>${v.lifeGem}</strong></td>
                <td><strong>${i.attributes.lifeGem}</strong></td>
                <td><span style="color: #DC2626; font-weight: 700;">${i.attributes.avoidGem}</span></td>
              </tr>
              <tr>
                <td><strong>${v.rudraksha}</strong></td>
                <td colspan="2"><strong>${i.attributes.rudraksha}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="patrika-section-title">
            <span>${e.sections.s9}</span>
          </div>
          <div style="padding: 12px 16px; background: rgba(0,0,0,0.02); border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; margin-bottom: 12px; line-height: 1.6;">
            <div style="margin-bottom: 5px;"><strong>${v.orientation}</strong> ${A.orientationBusiness}</div>
            <div style="margin-bottom: 5px;"><strong>${v.primeFields}</strong> <strong style="color: #9A3412;">${A.primeFields}</strong></div>
            <div style="margin-bottom: 5px;"><strong>${v.secondaryDomains}</strong> ${A.secondaryDomains}</div>
            <div><strong>${v.professionalStyle}</strong> ${A.workStyle}</div>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s10}</span>
          </div>
          <div style="padding: 12px 16px; background: rgba(218,165,32,0.06); border: 1.5px solid #DAA520; border-radius: 6px; font-size: 12.5px; line-height: 1.6;">
            <div style="margin-bottom: 5px;"><strong>${v.nuptialAge}</strong> <strong style="color: #B45309; font-size: 13.5px;">${A.nuptialAge}</strong></div>
            <div style="margin-bottom: 5px;"><strong>${v.allianceDirections}</strong> ${A.directions}</div>
            <div style="margin-bottom: 5px;"><strong>${v.spouseProfile}</strong> ${A.spouseProfile}</div>
            <div style="margin-bottom: 5px;"><strong>${v.harmonyGuidance}</strong> ${A.matrimonialAdvice}</div>
            <div><strong>${v.rulingLordSign}</strong> ${((qt=L[i.marriage.rulingLord])==null?void 0:qt[t])||i.marriage.rulingLord} (${je(i.marriage.houseSign,t)})</div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","4")} &bull; ${((Yt=ot[t])==null?void 0:Yt.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 5: ADVANCED ASTRO SOLUTIONS & LIFE PREDICTIONS       -->
      <!-- ======================================================== -->
      <div class="patrika-page page-5">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s11}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s11}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 12px;">
            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.healthVitality}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${g.health.constitution} &bull; <strong>${o.vulnerableLabel||"ಸೂಕ್ಷ್ಮ ಅಂಗಗಳು:"}</strong> ${g.health.vulnerableOrgans}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${o.healthRemedy}</strong> ${g.health.ayurvedicAdvice}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.financialProsperity}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${g.wealth.dhanaYogas.join(" • ")}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${o.assetClassesTiming}</strong> ${g.wealth.primeAssetClasses} (${g.wealth.financialTiming})</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.karmicDebts}</strong>
              <div style="margin-top: 3px; color: #1E293B;">
                ${o.activeDebts} <strong>${$.activeDebtsCount}</strong> &bull; 
                ${$.activeDebtsCount>0?$.karmicDebts.filter(s=>s.detected).map(s=>Ve(s.title,t)).join(", "):o.noMajorDebts}
              </div>
              <div style="font-size: 12px; color: #B45309; margin-top: 3px;">
                ${o.defaultPitruRemedy}
              </div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.spiritualAlignment}</strong>
              <div style="font-size: 12px; color: #B45309; margin-top: 3px;"><strong>${o.sacredSadhana}</strong> ${g.spirituality.sadhana}</div>
            </div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","5")} &bull; ${((Jt=ot[t])==null?void 0:Jt.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 6: NUMEROLOGY & ADVANCED MOBILE BLUEPRINTS          -->
      <!-- ======================================================== -->
      <div class="patrika-page page-6">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s13}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s13}</span>
          </div>

          <div style="display: flex; gap: 16px; margin-bottom: 12px; flex-wrap: wrap;">
            <div style="flex: 1 1 280px;">
              <div class="patrika-table-grid" style="grid-template-columns: 1fr; gap: 6px; font-size: 12.5px;">
                <div class="p-cell"><span class="p-lbl">${Q.mulank}</span><strong class="p-val" style="color: #9A3412; font-size: 14px;">${l.mulank.number} (${((Zt=L[l.mulank.planet])==null?void 0:Zt[t])||l.mulank.planet})</strong></div>
                <div class="p-cell"><span class="p-lbl">${Q.bhagyank}</span><strong class="p-val" style="color: #9A3412; font-size: 14px;">${l.bhagyank.number} (${((Qt=L[l.bhagyank.planet])==null?void 0:Qt[t])||l.bhagyank.planet})</strong></div>
                <div class="p-cell"><span class="p-lbl">${Q.chaldean}</span><strong class="p-val">${l.nameNumber.chaldeanSingle} (${Q.compound} ${l.nameNumber.chaldeanCompound} - ${((Wt=L[l.nameNumber.chaldeanPlanet])==null?void 0:Wt[t])||l.nameNumber.chaldeanPlanet})</strong></div>
                <div class="p-cell"><span class="p-lbl">${Q.pythagorean}</span><strong class="p-val">${l.nameNumber.pythagoreanExpression} (${Q.soulUrge} ${l.nameNumber.soulUrge})</strong></div>
              </div>
            </div>
            <div style="flex: 1 1 280px; max-width: 320px; margin: 0 auto;">
              <div style="font-weight: 800; font-size: 13px; color: #9A3412; text-align: center; margin-bottom: 6px;">${Q.loShuTitle}</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: #FEF3C7; padding: 10px; border-radius: 8px; border: 1.5px solid #D97706;">
                ${K(4,l.loShu.counts[4]||0)}
                ${K(9,l.loShu.counts[9]||0)}
                ${K(2,l.loShu.counts[2]||0)}
                ${K(3,l.loShu.counts[3]||0)}
                ${K(5,l.loShu.counts[5]||0)}
                ${K(7,l.loShu.counts[7]||0)}
                ${K(8,l.loShu.counts[8]||0)}
                ${K(1,l.loShu.counts[1]||0)}
                ${K(6,l.loShu.counts[6]||0)}
              </div>
            </div>
          </div>

          ${O&&u?`
          <div class="patrika-section-title">
            <span>${e.sections.s14}</span>
          </div>

          <div style="padding: 12px 16px; background: ${u.isSuitable?"rgba(22,163,74,0.06)":"rgba(220,38,38,0.06)"}; border: 1.5px solid ${u.isSuitable?"#16A34A":"#DC2626"}; border-radius: 8px; margin-bottom: 12px; font-size: 12.5px; line-height: 1.6;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
              <div><strong>${o.testedNumber}</strong> <code style="font-size: 15px; font-weight: 800; color: #0F172A;">${P}</code></div>
              <div style="font-weight: 800; font-size: 12px; padding: 3px 10px; border-radius: 4px; background: ${u.isSuitable?"#DCFCE7":"#FEE2E2"}; color: ${u.isSuitable?"#15803D":"#B91C1C"}; border: 1px solid currentColor;">
                ${u.isSuitable?e.mobile.auspicious:e.mobile.inauspicious}
              </div>
            </div>
            <div style="margin-bottom: 4px;"><strong>${o.sumTotal}</strong> ${u.compoundSum} &bull; <strong>${o.singleRoot}</strong> ${u.singleNumber} (${((Xt=L[u.rulingPlanet])==null?void 0:Xt[t])||u.rulingPlanet}) &bull; <strong>${o.status}</strong> ${u.isSuitable?R.auspiciousStatus:R.inauspiciousStatus}</div>
            <div style="margin-bottom: 6px; color: ${u.isSuitable?"#15803D":"#B91C1C"}; font-weight: 600;">
              ${u.isSuitable?R.adviceSuitable:R.adviceUnsuitable}
            </div>
          </div>

          ${u.suggestions?`
            <div class="patrika-section-title">
              <span>${e.sections.s15}</span>
            </div>
            <div style="padding: 12px 16px; background: #FFFBEB; border: 1.5px solid #D97706; border-radius: 8px; font-size: 12.5px; line-height: 1.6;">
              <div style="font-weight: 800; color: #9A3412; font-size: 13.5px; margin-bottom: 6px;">
                ${Q.newSimTitle}
              </div>
              <div style="margin-bottom: 5px;">
                <strong>${o.primeRoot}</strong> ${u.suggestions.primeSingle} (${((te=L[u.suggestions.primeSinglePlanet])==null?void 0:te[t])||u.suggestions.primeSinglePlanet}) &bull; <strong>${o.secondaryRoot}</strong> ${u.suggestions.secondarySingle} (${((ee=L[u.suggestions.secondarySinglePlanet])==null?void 0:ee[t])||u.suggestions.secondarySinglePlanet}) &bull; <strong>${o.royalCompounds}</strong> ${u.suggestions.recommendedCompounds.map(s=>s.compound).join(", ")}
              </div>
              <div style="margin-bottom: 6px;">
                <strong>${o.blueprintNumbers}</strong>
                <ul style="padding-left: 20px; margin-top: 3px; font-family: monospace; font-size: 13px; font-weight: 700; color: #0F172A;">
                  ${u.suggestions.sampleTemplates.map(s=>`<li>${s.pattern} (${s.category})</li>`).join("")}
                </ul>
              </div>
              <div style="font-size: 11.5px; color: #78350F;">
                <strong>${o.goldenChecklist}</strong> ${R.checklist.join(" • ")}
              </div>
            </div>
          `:""}
`:`
          <div class="patrika-section-title">
            <span>${e.sections.s14}</span>
          </div>
          <div style="padding: 16px 20px; background: #F8FAFC; border: 1.5px dashed #94A3B8; border-radius: 8px; margin-bottom: 12px; font-size: 12.5px; line-height: 1.7; color: #334155;">
            <div style="font-weight: 800; color: #475569; font-size: 13.5px; margin-bottom: 6px;">
              ${{kn:"📱 ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿಲ್ಲ (ಐಚ್ಛಿಕ ಸೇವೆ)",hi:"📱 मोबाइल नंबर दर्ज नहीं किया गया (ऐच्छिक सेवा)",mr:"📱 मोबाईल क्रमांक नोंदवला नाही (ऐच्छिक सेवा)",te:"📱 మొబైల్ నంబర్ నమోదు చేయలేదు (ఐచ్ఛిక సేవ)",en:"📱 Mobile Number Not Provided (Optional Service)"}[t]}
            </div>
            <div>
              ${{kn:"ಜಾತಕ ರಚನೆಯ ಸಮಯದಲ್ಲಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿಲ್ಲವಾದ್ದರಿಂದ ಮೊಬೈಲ್ ಸಂಖ್ಯಾಶಾಸ್ತ್ರ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಅನ್ವಯಿಸಲಾಗಿಲ್ಲ. ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯ ಸಂಖ್ಯಾಬಲ, ಮೂಲಾಂಕ-ಭಾಗ್ಯಾಂಕ ಹೊಂದಾಣಿಕೆ ಮತ್ತು ಅದೃಷ್ಟಶಾಲಿ ಹೊಸ ಸಿಮ್ ಸಂಖ್ಯೆಯ ಶಿಫಾರಸು ಪಡೆಯಲು, ಮುಖಪುಟದ ಫಾರ್ಮ್‌ನಲ್ಲಿ ನಿಮ್ಮ ೧೦ ಅಂಕಿಗಳ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ದಾಖಲಿಸಿ ಕುಂಡಲಿ ಮರು-ರಚಿಸಿ.",hi:"कुंडली निर्माण के समय मोबाइल नंबर उपलब्ध नहीं कराया गया, अतः यह विश्लेषण लागू नहीं हुआ। यदि आप अपने मोबाइल नंबर का अंक ज्योतिष परीक्षण एवं भाग्यशाली सिम अनुशंसा चाहते हैं, तो कृपया फॉर्म में अपना नंबर दर्ज कर पुनः पत्रिका डाउनलोड करें।",mr:"पत्रिका तयार करताना मोबाईल क्रमांक नोंदवला नाही. मोबाईल अंकशास्त्र विश्लेषण व भाग्यशाली नवीन सिम शिफारस मिळवण्यासाठी फॉर्ममध्ये आपला १० अंकी मोबाईल नंबर टाकून पुन्हा पत्रिका तयार करा.",te:"కుండలి తయారీ సమయంలో మొబైల్ నంబరు నమోదు చేయలేదు. మీ మొబైల్ సంఖ్యాశాస్త్ర విశ్లేషణ మరియు శుభప్రదమైన కొత్త సిమ్ సంఖ్యల సూచనల కోసం దయచేసి ఫారంలో మీ మొబైల్ నంబరు నమోదు చేసి మళ్లీ పత్రికను రూపొందించండి.",en:"No mobile number was entered during chart creation. To receive complete mobile numerology resonance analysis and golden SIM recommendations, enter your 10-digit mobile number in the form and regenerate your Patrika."}[t]}
            </div>
          </div>
`}

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","6")} &bull; ${((ae=ot[t])==null?void 0:ae.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 7: COMPREHENSIVE PREDICTIONS & QUARTERLY FORECAST   -->
      <!-- ======================================================== -->
      <div class="patrika-page page-7">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s16}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s16}</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 12px;">
            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.physicalLongevity}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${g.health.constitution} &bull; ${g.health.longevityFactor}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${o.dailyRegimen}</strong> ${g.health.ayurvedicAdvice}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.wealthCapital}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${g.wealth.dhanaYogas.join(" • ")}</div>
              <div style="font-size: 12px; color: #15803D; margin-top: 3px;"><strong>${o.wealthAnchor}</strong> ${g.wealth.primeAssetClasses}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.careerAscent}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${g.career.style}</div>
              <div style="font-size: 12px; color: #B45309; margin-top: 3px;"><strong>${o.goldenTrait}</strong> ${g.career.leadershipTrait}</div>
            </div>

            <div style="padding: 10px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12.5px; line-height: 1.55;">
              <strong style="color: #9A3412; font-size: 13.5px;">${o.domesticBliss}</strong>
              <div style="margin-top: 3px; color: #1E293B;">${g.marriage.ageWindow} &bull; ${g.marriage.spouseNature}</div>
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s17}</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${ct[0]} (${g.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${g.quarterlyForecast.q1}</div>
            </div>
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${ct[1]} (${g.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${g.quarterlyForecast.q2}</div>
            </div>
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${ct[2]} (${g.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${g.quarterlyForecast.q3}</div>
            </div>
            <div style="padding: 10px 12px; background: #FFFDF8; border: 1px solid #D97706; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${ct[3]} (${g.quarterlyForecast.year})</strong>
              <div style="color: #1E293B; margin-top: 3px;">${g.quarterlyForecast.q4}</div>
            </div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","7")} &bull; ${((se=ot[t])==null?void 0:se.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 8: MASTER REMEDIAL BLUEPRINT                        -->
      <!-- ======================================================== -->
      <div class="patrika-page page-8">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s18}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s18}</span>
          </div>

          <!-- 1. Mantra Japa -->
          <div style="padding: 12px 14px; background: rgba(218,165,32,0.06); border: 1.5px solid #DAA520; border-radius: 8px; margin-bottom: 10px; font-size: 12.5px; line-height: 1.6;">
            <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 4px;">
              ${o.primaryMantraTitle}
            </div>
            <div style="font-size: 14.5px; font-weight: 800; color: #B45309; margin-bottom: 4px;">
              ${o.lagnaBeeja} ${vt} (${((ie=L[D.mantras.lagna.planet.split(" ")[0]])==null?void 0:ie[t])||D.mantras.lagna.planet})
            </div>
            <div style="font-size: 12.5px; color: #1E293B;">
              <strong>${o.bhagyaBeeja}</strong> ${Et} &bull; 
              <strong>${o.mahamrityunjaya}</strong> ${D.mantras.mahamrityunjaya.verse}
            </div>
          </div>

          <!-- 2. Gemstone 5-step Protocol -->
          <div style="padding: 12px 14px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; margin-bottom: 10px; font-size: 12.5px; line-height: 1.6;">
            <div style="font-weight: 800; font-size: 13.5px; color: #9A3412; margin-bottom: 4px;">
              ${o.gemstoneProtocol}
            </div>
            <div><strong>${o.recommendedGem}</strong> <strong style="color: #15803D; font-size: 13.5px;">${j.primeGem}</strong> (${j.metal}, ${j.finger}, ${j.wearingDay})</div>
            <div style="font-size: 12px; color: #334155; margin-top: 3px;"><strong>${o.consecrationSteps}</strong> ${j.consecrationSteps?j.consecrationSteps.join(" • "):g.remedies.consecrationSteps.join(" • ")}</div>
            <div style="margin-top: 5px; padding: 6px 10px; background: #FEE2E2; border-left: 4px solid #DC2626; border-radius: 4px; font-size: 12px; color: #991B1B; font-weight: 700;">
              ${o.forbiddenGemsTitle} ${j.forbiddenGems}
            </div>
          </div>

          <!-- 3. Rudraksha & Yantra -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 10px;">
            <div style="padding: 10px 12px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${o.consecratedRudraksha}</strong>
              <div style="color: #0F172A; font-weight: 700; margin-top: 2px;">${a.mukhi}</div>
              <div style="color: #475569; margin-top: 2px;">${a.thread} &bull; ${a.wearingDay}</div>
            </div>
            <div style="padding: 10px 12px; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; font-size: 12px; line-height: 1.5;">
              <strong style="color: #9A3412; font-size: 13px;">${o.shaniShield}</strong>
              <div style="color: #0F172A; font-weight: 700; margin-top: 2px;">${E.name} (${E.direction})</div>
              <div style="color: #475569; margin-top: 2px;">${E.metal} &bull; ${g.remedies.shaniDeepam}</div>
            </div>
          </div>

          <!-- 4. Gau Seva & Charity -->
          <div style="padding: 10px 14px; background: #FFFBEB; border: 1.5px solid #D97706; border-radius: 6px; font-size: 12.5px; line-height: 1.6;">
            <strong style="color: #9A3412; font-size: 13px;">${o.daanGauSeva}</strong>
            <div>${g.remedies.daanSeva.join(" • ")}</div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","8")} &bull; ${((ne=ot[t])==null?void 0:ne.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- PAGE 9: MASTER SUMMARY & ASTROLOGICAL VERDICT           -->
      <!-- ======================================================== -->
      <div class="patrika-page page-9">
        <div class="patrika-border">
          <div class="patrika-header-small">
            <span>AstroVeda &bull; ${e.sections.s19}</span>
            <span>${B}</span>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s19}</span>
          </div>

          <div style="padding: 12px 16px; background: rgba(218,165,32,0.06); border: 2px solid #DAA520; border-radius: 8px; font-size: 13px; line-height: 1.6; margin-bottom: 12px;">
            <div style="font-weight: 800; font-size: 14.5px; color: #9A3412; margin-bottom: 5px;">
              ${o.executiveSummary.replace("{name}",B)}
            </div>
            <div style="color: #1E293B;">
              ${o.executiveDesc.replace("{lagna}",Z).replace("{moon}",bt).replace("{nakshatra}",((oe=zt[h.nakshatraName])==null?void 0:oe[t])||h.nakshatraName).replace("{dasha}",d?(((re=L[d.mahaDasha])==null?void 0:re[t])||d.mahaDasha)+" / "+(((le=L[d.antarDasha])==null?void 0:le[t])||d.antarDasha):"Vimshottari Cycle")}
            </div>
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s20}</span>
          </div>

          <table class="patrika-print-table" style="margin-bottom: 12px; font-size: 12.5px;">
            <thead>
              <tr>
                <th style="width: 30%;">${o.masterParameter}</th>
                <th style="width: 70%;">${o.auspiciousPrescription}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${e.fields.luckyColor}</strong></td>
                <td><strong style="color: #15803D;">${i.attributes.luckyColors.join(", ")}</strong></td>
              </tr>
              <tr>
                <td><strong>${e.fields.luckyNum}</strong></td>
                <td><strong style="color: #15803D;">${i.attributes.luckyNumbers.join(", ")}</strong></td>
              </tr>
              <tr>
                <td><strong>${e.fields.luckyDay}</strong></td>
                <td>${i.attributes.favorableDays.join(", ")}</td>
              </tr>
              <tr>
                <td><strong>${e.fields.ishtaDevata}</strong></td>
                <td><strong>${i.attributes.ishtaDevata}</strong> (${i.attributes.mantra})</td>
              </tr>
              <tr>
                <td><strong>${e.fields.bestCareers}</strong></td>
                <td><strong>${A.primeFields}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="patrika-section-title">
            <span>${e.sections.s21}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px;">
            ${e.dailyRules.map((s,S)=>`
              <div style="padding: 8px 12px; background: #F8FAFC; border-left: 4px solid #DAA520; border-radius: 4px; font-size: 12.5px; line-height: 1.5;">
                <strong style="color: #9A3412;">${S+1}. ${s.title}:</strong> 
                <span style="color: #1E293B;">${s.desc}</span>
              </div>
            `).join("")}
          </div>

          <div class="patrika-section-title">
            <span>${e.sections.s22}</span>
          </div>

          <div style="padding: 14px 18px; background: linear-gradient(135deg, rgba(218,165,32,0.12), rgba(218,165,32,0.03)); border: 2px solid #DAA520; border-radius: 8px; text-align: center;">
            <div style="font-size: 26px; color: #DAA520; line-height: 1; margin-bottom: 4px;">${e.meta.om}</div>
            <div style="font-weight: 800; font-size: 15px; color: #9A3412; margin-bottom: 6px;">
              ${e.verdict.heading}
            </div>
            <div style="font-size: 13px; color: #1E293B; line-height: 1.6; max-width: 680px; margin: 0 auto;">
              ${e.verdict.text}
            </div>
            <div style="font-size: 11px; color: #B45309; margin-top: 8px; font-weight: 700;">
              ॥ शुभं भवतु ॥ ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು ॥ సర్వేజనాః సుఖినోభవంతు ॥
            </div>
          </div>

          <div class="patrika-footer">
            <span>AstroVeda &bull; ${e.meta.pageOf.replace("{p}","9")} &bull; ${((de=ot[t])==null?void 0:de.label)||""}</span>
            <span>${e.meta.helpline}</span>
          </div>
        </div>
      </div>
    </div>
  `}let Pt=null;function ta(){return Pt||(Pt=Promise.all([ke(()=>import("./jspdf.es.min-CgHatq18.js").then(r=>r.j),__vite__mapDeps([0,1,2]),import.meta.url),ke(()=>import("./html2canvas.esm-CBrSDip1.js"),[],import.meta.url)]).then(([r,p])=>({jsPDF:r.jsPDF||r.default,html2canvas:p.default||p}))),Pt}function Nt(r,p,x=0){let c=document.getElementById("astro-pdf-download-status");c||(c=document.createElement("div"),c.id="astro-pdf-download-status",c.className="no-print",c.style.cssText=`
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: #0F172A;
      color: #FFFFFF;
      border: 2px solid #DAA520;
      box-shadow: 0 10px 35px rgba(0,0,0,0.7);
      border-radius: 12px;
      padding: 16px 20px;
      min-width: 320px;
      max-width: 440px;
      font-family: 'Inter', -apple-system, sans-serif;
      transition: all 0.3s ease;
    `,document.body.appendChild(c)),r==="generating"?(c.style.display="block",c.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 18px; height: 18px; border: 2.5px solid rgba(218,165,32,0.3); border-top-color: #DAA520; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <strong style="color: #FBBF24; font-size: 13.5px;">AstroVeda HD PDF Generator</strong>
        </div>
        <span style="font-size: 12px; font-weight: 700; color: #10B981;">${x}%</span>
      </div>
      <div style="font-size: 12px; color: #E2E8F0; margin-bottom: 8px;">${p}</div>
      <div style="background: rgba(255,255,255,0.15); border-radius: 999px; height: 6px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #F59E0B, #10B981); height: 100%; width: ${Math.max(x,8)}%; transition: width 0.25s ease;"></div>
      </div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 6px;">
        Rendering ultra-crisp 9-Page Vedic Mahapatrika directly to your Downloads folder...
      </div>
    `):r==="success"?(c.style.display="block",c.innerHTML=`
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">✅</span>
        <div>
          <strong style="color: #34D399; font-size: 14px;">PDF Downloaded Successfully!</strong>
          <div style="font-size: 12px; color: #E2E8F0; margin-top: 2px;">${p}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Saved to your browser's Downloads folder.</div>
        </div>
      </div>
    `,setTimeout(()=>{c&&(c.style.display="none")},5e3)):(r==="fallback"||r==="error")&&(c.style.display="block",c.innerHTML=`
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 24px;">🖨️</span>
        <div>
          <strong style="color: #FBBF24; font-size: 14px;">Opening Print / Save as PDF</strong>
          <div style="font-size: 12px; color: #E2E8F0; margin-top: 2px;">${p}</div>
          <div style="font-size: 11px; color: #94A3B8; margin-top: 4px;">Destination में "Save as PDF" चुनें।</div>
        </div>
      </div>
    `,setTimeout(()=>{c&&(c.style.display="none")},5e3))}async function Ae(r="printable-patrika",p="Seeker",x=null,c="hi"){const n=(A,k,v=0)=>{if(typeof x=="function")try{x(A,k,v)}catch{}Nt(A,k,v)},G=document.getElementById(r);if(!G){console.warn("Report container not found, triggering window.print()"),n("fallback","Launching Native Print / Save as PDF dialog..."),window.print();return}const t=G.querySelectorAll(".patrika-page");if(!t||t.length===0){n("fallback","Launching Native Print / Save as PDF dialog..."),window.print();return}const e=(p||"Seeker").trim().replace(/[^a-zA-Z0-9_\u0900-\u097F]/g,"_"),g={en:"English",hi:"Hindi",kn:"Kannada",mr:"Marathi",te:"Telugu"}[c]||"Patrika",R=`AstroVeda_Kundali_Patrika_${e}_${g}.pdf`;n("generating",`Preparing 9-Page HD Kundali Patrika (${g})...`,5);try{const{jsPDF:A,html2canvas:k}=await ta(),v=new A({orientation:"portrait",unit:"mm",format:"a4",compress:!0}),h=210,T=297;for(let f=0;f<t.length;f++){const H=Math.round((f+1)/t.length*100);n("generating",`Processing HD Page ${f+1} of ${t.length} (${g})...`,H);const i=t[f],D=(await k(i,{scale:2,useCORS:!0,logging:!1,backgroundColor:"#FFFFFF",windowWidth:1024})).toDataURL("image/jpeg",.95);f>0&&v.addPage("a4","portrait"),v.addImage(D,"JPEG",0,0,h,T,void 0,"FAST")}v.save(R),n("success",`Saved as ${R} in your Downloads folder!`,100)}catch(A){console.warn("Direct canvas download error, launching native Print / Save as PDF:",A),n("fallback","Launching Native Print / Save as PDF dialog..."),setTimeout(()=>{window.print()},200)}}function ma(r){var D,U,M,tt,I,et,O;const p=new URLSearchParams(window.location.search||""),x=it.getSavedBirthDetails();let c=p.get("lang")||"hi";const n=p.get("name")||x.name||"Aarav Sharma",G=p.get("date")||x.date||"1995-10-24",t=p.get("time")||x.time||"10:30",e=p.get("father")||x.fatherName||"",o=p.get("mother")||x.motherName||"";let g=p.get("phone")||x.phone||"";(g.includes("9019088160")||g.includes("901 908 8160")||g.trim()==="+91 901 908 8160")&&(g="");const R=p.get("city")||x.city||"Varanasi (Kashi / Banaras), UP",A=p.get("lat")?parseFloat(p.get("lat")):x.latitude||25.3176,k=p.get("lon")?parseFloat(p.get("lon")):x.longitude||82.9739,v=p.get("tz")?parseFloat(p.get("tz")):x.timezone||5.5,h=p.get("ayanamsa")||x.ayanamsa||"LAHIRI";r.innerHTML=`
    <div class="kundali-page">
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4); margin-bottom: var(--space-6);">
        <div>
          <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            🪐 Janam Kundali & 9-Page Brihat Mahapatrika
          </h2>
          <p style="color: var(--text-secondary); font-size: var(--text-sm);">
            Complete Vedic birth chart, Avakahada Janam Naam, Good/Bad attributes, Career, Marriage Timing & Multilingual HD PDF export.
          </p>
        </div>
        <div style="display: flex; gap: var(--space-2);">
          <button id="view-pdf-tab-btn" class="btn btn-primary" style="font-size: var(--text-xs); font-weight: 700;">
            📥 Calculate & Download 9-Page PDF Patrika
          </button>
        </div>
      </div>

      <!-- Input Form Card -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>✍️ Enter Birth Particulars</span></h3>
        <form id="kundali-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="k-name" class="form-input" value="${C(n)}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Date of Birth</label>
              <input type="date" id="k-date" class="form-input" value="${C(G)}" required />
            </div>
            <div class="form-group">
              <label class="form-label">Time of Birth (24 Hr)</label>
              <input type="time" id="k-time" class="form-input" value="${C(t)}" required />
            </div>
          </div>

          <!-- Optional Parents Names & Phone for Numerology -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Father's Name (पिता का नाम - Optional)</label>
              <input type="text" id="k-father" class="form-input" placeholder="e.g. Pt. Ramakant Sharma" value="${C(e)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Mother's Name (माता का नाम - Optional)</label>
              <input type="text" id="k-mother" class="form-input" placeholder="e.g. Smt. Shanti Devi" value="${C(o)}" />
            </div>
            <div class="form-group">
              <label class="form-label">Mobile Number (अंक ज्योतिष समाधान हेतु - Optional)</label>
              <input type="tel" id="k-phone" class="form-input" placeholder="e.g. 9876543210 (Optional / ಐಚ್ಛಿಕ)" value="${C(g)}" />
            </div>
          </div>

          <!-- Location Selector & Language Selector -->
          <div class="form-row">
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>📍 Place of Birth (Search All Indian Cities, Tirthas & Towns)</span>
                <span style="color: var(--gold-400); font-size: 11px;">350+ Places across India (Including Chirala & AP Towns)</span>
              </label>
              <input type="text" id="k-place-input" list="k-indian-places-list" class="form-input" 
                     placeholder="Type to search e.g. Chirala, Tirupati, Vijayawada, Varanasi, Bengaluru..." 
                     value="${C(R)}" autocomplete="off" />
              ${_e("k-indian-places-list")}
            </div>

            <!-- Multilingual Selector -->
            <div class="form-group">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>🌐 PDF & Report Language (ಭಾಷೆ / भाषा / భాష)</span>
                <span style="color: var(--gold-400); font-size: 11px;">5 Indian Languages</span>
              </label>
              <select id="k-report-lang" class="form-input" style="font-weight: 700; color: var(--gold-400);">
                <option value="en" ${c==="en"?"selected":""}>English (Global Universal)</option>
                <option value="hi" ${c==="hi"?"selected":""}>हिंदी (Hindi - राष्ट्रभाषा)</option>
                <option value="kn" ${c==="kn"?"selected":""}>ಕನ್ನಡ (Kannada - ಕರ್ನಾಟಕ ಶೈಲಿ)</option>
                <option value="mr" ${c==="mr"?"selected":""}>मराठी (Marathi - महाराष्ट्र पद्धती)</option>
                <option value="te" ${c==="te"?"selected":""}>తెలుగు (Telugu - ఆంధ్ర & తెలంగాణ శైలి)</option>
              </select>
            </div>
          </div>

          <!-- Precise Coordinates & Ayanamsa -->
          <div class="form-row" style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-secondary);">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Latitude (°N)</label>
              <input type="number" step="0.0001" id="k-lat" class="form-input" value="${A}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Longitude (°E)</label>
              <input type="number" step="0.0001" id="k-lon" class="form-input" value="${k}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Timezone (UTC)</label>
              <input type="number" step="0.1" id="k-tz" class="form-input" value="${v}" readonly style="background: rgba(0,0,0,0.2); opacity: 0.8;" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label" style="font-size: 11px;">Ayanamsa</label>
              <select id="k-ayanamsa" class="form-input" style="font-size: 12px;">
                <option value="LAHIRI" ${h==="LAHIRI"?"selected":""}>Lahiri (Chitrapaksha - Govt Standard)</option>
                <option value="KP" ${h==="KP"?"selected":""}>KP (Krishnamurti Paddhati)</option>
                <option value="RAMAN" ${h==="RAMAN"?"selected":""}>B.V. Raman</option>
                <option value="YUKTESHWAR" ${h==="YUKTESHWAR"?"selected":""}>Sri Yukteshwar</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-4); flex-wrap: wrap;">
            <button type="button" id="btn-calculate-interactive" class="btn btn-secondary" style="padding: var(--space-3) var(--space-6); font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
              <span>📊</span> Calculate & View Online (स्क्रीन पर देखें)
            </button>
            <button type="submit" id="btn-calculate-download-pdf" class="btn btn-primary" style="padding: var(--space-3) var(--space-8); font-weight: 800; font-size: var(--text-base); display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 20px rgba(218,165,32,0.4);">
              <span>📥</span> Calculate Kundali & Download PDF (पीडीएफ डाउनलोड करें)
            </button>
          </div>
        </form>
      </div>

      <!-- Mode View Tabs: Interactive Dashboard vs 9-Page Full Patrika Report -->
      <div style="display: flex; gap: 8px; margin-bottom: var(--space-6);" class="no-print">
        <button id="view-mode-interactive" class="btn btn-secondary" style="padding: 6px 14px; font-size: var(--text-xs);">
          📊 Interactive Chart Dashboard
        </button>
        <button id="view-mode-pdf" class="btn btn-primary" style="padding: 6px 14px; font-size: var(--text-xs);">
          📜 9-Page Complete Vedic Mahapatrika & Solutions (PDF View)
        </button>
      </div>

      <!-- Main Results Container -->
      <div id="kundali-results-container"></div>
    </div>
  `;let T=p.get("view")==="interactive"?"interactive":"pdf";setTimeout(T==="pdf"?()=>{var m,d;(m=document.getElementById("view-mode-interactive"))==null||m.classList.replace("btn-primary","btn-secondary"),(d=document.getElementById("view-mode-pdf"))==null||d.classList.replace("btn-secondary","btn-primary")}:()=>{var m,d;(m=document.getElementById("view-mode-interactive"))==null||m.classList.replace("btn-secondary","btn-primary"),(d=document.getElementById("view-mode-pdf"))==null||d.classList.replace("btn-primary","btn-secondary")},50),(D=document.getElementById("k-report-lang"))==null||D.addEventListener("change",m=>{c=m.target.value,i(!1)});const f=document.getElementById("k-place-input");f==null||f.addEventListener("input",m=>{const d=m.target.value,l=De(d);l&&(document.getElementById("k-lat").value=l.lat,document.getElementById("k-lon").value=l.lon,document.getElementById("k-tz").value=l.tz)}),f==null||f.addEventListener("change",m=>{const d=m.target.value,l=De(d);l&&(document.getElementById("k-lat").value=l.lat,document.getElementById("k-lon").value=l.lon,document.getElementById("k-tz").value=l.tz,i(!1))});const H=(m=!0)=>{T="pdf";const d=document.getElementById("view-mode-pdf"),l=document.getElementById("view-mode-interactive");d&&l&&(d.className="btn btn-primary",l.className="btn btn-secondary"),i(m)};(U=document.getElementById("kundali-form"))==null||U.addEventListener("submit",m=>{m.preventDefault(),H(!0)}),(M=document.getElementById("btn-calculate-download-pdf"))==null||M.addEventListener("click",m=>{m.preventDefault(),H(!0)}),(tt=document.getElementById("view-pdf-tab-btn"))==null||tt.addEventListener("click",m=>{m.preventDefault(),H(!0)}),(I=document.getElementById("btn-calculate-interactive"))==null||I.addEventListener("click",()=>{T="interactive";const m=document.getElementById("view-mode-pdf"),d=document.getElementById("view-mode-interactive");m&&d&&(d.className="btn btn-primary",m.className="btn btn-secondary"),i(!1)}),(et=document.getElementById("view-mode-interactive"))==null||et.addEventListener("click",()=>{T="interactive",document.getElementById("view-mode-interactive").className="btn btn-primary",document.getElementById("view-mode-pdf").className="btn btn-secondary",i(!1)}),(O=document.getElementById("view-mode-pdf"))==null||O.addEventListener("click",()=>{T="pdf",document.getElementById("view-mode-pdf").className="btn btn-primary",document.getElementById("view-mode-interactive").className="btn btn-secondary",i(!1)}),i(!1);function i(m=!1){var Et,bt,Z,nt,St,yt,Q,ct,K,xt,ft,$t,kt,Dt,wt;const d=(Et=document.getElementById("k-report-lang"))==null?void 0:Et.value;d&&(c=d);const l=((bt=document.getElementById("k-name"))==null?void 0:bt.value)||n,u=((Z=document.getElementById("k-date"))==null?void 0:Z.value)||G,Y=((nt=document.getElementById("k-time"))==null?void 0:nt.value)||t,J=((St=document.getElementById("k-place-input"))==null?void 0:St.value)||R,B=((yt=document.getElementById("k-father"))==null?void 0:yt.value)||e,rt=((Q=document.getElementById("k-mother"))==null?void 0:Q.value)||o,mt=document.getElementById("k-phone")?document.getElementById("k-phone").value.trim():"",lt=parseFloat((ct=document.getElementById("k-lat"))==null?void 0:ct.value)||A,ht=parseFloat((K=document.getElementById("k-lon"))==null?void 0:K.value)||k,pt=parseFloat((xt=document.getElementById("k-tz"))==null?void 0:xt.value)||v,at=((ft=document.getElementById("k-ayanamsa"))==null?void 0:ft.value)||h,F={name:l,date:u,time:Y,city:J,fatherName:B,motherName:rt,phone:mt,latitude:lt,longitude:ht,timezone:pt,ayanamsa:at,lang:c};it.saveBirthDetails(F);const P=Ce(u,Y,lt,ht,pt,at);it.currentKundali=P;const _=Be(P),j=He(P),a=F.transitDate||F.assessmentDate||new Date().toISOString().split("T")[0],E=Ue(P,a),vt=document.getElementById("kundali-results-container");if(vt)if(T==="pdf"){vt.innerHTML=Xe(P,_,j,E,{...F,transitDate:a},c);const Ct=ge(P),At={lagnaRashi:_.lagna.rashi,houses:{}};for(let y=1;y<=12;y++)At.houses[y]={rashi:_.houses[y-1].rashi,rashiSymbol:_.houses[y-1].rashiSymbol,planets:_.houses[y-1].planets.map(st=>({abbr:st.abbr,symbol:st.symbol,color:st.color,degree:""}))};Lt(Ct,"print-lagna-chart",it.chartStyle||"north",{theme:"print"}),Lt(At,"print-navamsa-chart",it.chartStyle||"north",{theme:"print"}),document.querySelectorAll(".patrika-lang-choice-btn").forEach(y=>{y.addEventListener("click",st=>{st.preventDefault();const dt=y.getAttribute("data-lang");if(dt){c=dt;const gt=document.getElementById("k-report-lang");gt&&(gt.value=dt),i(!1)}})}),($t=document.getElementById("trigger-pdf-download-btn"))==null||$t.addEventListener("click",y=>{y.preventDefault(),Ae("printable-patrika",F.name,Nt,c)}),(kt=document.getElementById("trigger-pdf-print-btn"))==null||kt.addEventListener("click",y=>{y.preventDefault(),window.print()});const Ft=()=>{const y=new URLSearchParams({name:F.name,date:F.date,time:F.time,city:F.city,lat:F.latitude,lon:F.longitude,phone:F.phone||"",father:F.fatherName||"",mother:F.motherName||"",lang:c,view:"pdf"});return`${window.location.origin}${window.location.pathname}?${y.toString()}`};(Dt=document.getElementById("trigger-whatsapp-share-btn"))==null||Dt.addEventListener("click",()=>{const y=P.planets.find(gt=>gt.name==="Moon"),st=Ft(),dt=`🕉️ *AstroVeda • 9-Page Comprehensive Vedic Mahapatrika*

👤 *Seeker:* ${F.name}
📅 *DOB:* ${F.date} (${F.time})
📍 *Place:* ${F.city}
♈ *Lagna:* ${P.lagna.rashiName} (${P.lagna.rashiNameHi})
🌙 *Moon Sign:* ${y.rashiName} (${y.rashiNameHi})
⭐ *Nakshatra:* ${y.nakshatraName} (Pada ${y.pada})

📜 *View & Download Full 9-Page Patrika in ${c.toUpperCase()}:*
${st}

📞 *Acharya Helpline:* +91 901 908 8160`;window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(dt)}`,"_blank")}),(wt=document.getElementById("trigger-copy-link-btn"))==null||wt.addEventListener("click",()=>{const y=Ft();navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(y).then(()=>{ea("✨ Sharable Patrika Link copied to clipboard!")}).catch(()=>{prompt("Copy this Sharable Patrika URL:",y)}):prompt("Copy this Sharable Patrika URL:",y)}),m&&setTimeout(()=>{const y=document.getElementById("printable-patrika");y&&y.scrollIntoView({behavior:"smooth",block:"start"}),Ae("printable-patrika",F.name,Nt,c)},300)}else $(vt,P,_,j,E,l,J)}function $(m,d,l,u,Y,J,B){var F,P,_,j;const rt=C(J),mt=C(B);m.innerHTML=`
      <div class="grid-2" style="margin-bottom: var(--space-8);">
        <!-- Chart Render Panel -->
        <div class="glass-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; gap: 8px;">
              <button id="chart-tab-lagna" class="btn btn-primary" style="padding: 4px 12px; font-size: var(--text-xs);">Lagna (D-1)</button>
              <button id="chart-tab-navamsa" class="btn btn-secondary" style="padding: 4px 12px; font-size: var(--text-xs);">Navamsa (D-9)</button>
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="style-north-btn" class="btn ${it.chartStyle==="north"?"btn-primary":"btn-secondary"}" style="padding: 4px 10px; font-size: var(--text-xs);">North Indian</button>
              <button id="style-south-btn" class="btn ${it.chartStyle==="south"?"btn-primary":"btn-secondary"}" style="padding: 4px 10px; font-size: var(--text-xs);">South Indian</button>
            </div>
          </div>

          <div id="chart-viewport" style="display: flex; justify-content: center; align-items: center; min-height: 440px;"></div>
        </div>

        <!-- Lagna & Key Attributes Panel -->
        <div class="glass-card">
          <h3 class="card-title"><span>🌟 Kundali Summary</span></h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-3); margin-bottom: var(--space-4);">
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Seeker Name</div>
              <div style="font-size: var(--text-base); font-weight: 700; color: var(--gold-400);">${rt}</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Place of Birth</div>
              <div style="font-size: 13px; font-weight: 700; color: #FFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${mt}">
                📍 ${mt}
              </div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Ascendant (लग्न)</div>
              <div style="font-size: var(--text-base); font-weight: 700; color: var(--gold-400);">
                ${d.lagna.rashiName} (${d.lagna.rashiNameHi})
              </div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Lagna Degree</div>
              <div style="font-weight: 600;">${d.lagna.degreeFormatted}</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Lagna Nakshatra</div>
              <div style="font-weight: 600;">${d.lagna.nakshatraName} (${d.lagna.nakshatraNameHi})</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Lagna Lord</div>
              <div style="font-weight: 600; color: var(--gold-300);">${d.lagna.lord}</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; grid-column: span 2;">
              <div style="font-size: 11px; color: var(--text-tertiary);">Ayanamsa & Coordinates</div>
              <div style="font-size: 12px; font-weight: 600;">
                ${d.birthDetails.ayanamsaValue}° (${d.birthDetails.ayanamsaSystem}) &bull; Lat: ${d.birthDetails.latitude}°N, Lon: ${d.birthDetails.longitude}°E
              </div>
            </div>
          </div>

          <!-- Quick Dosha Badges -->
          <div style="margin-top: var(--space-4); border-top: 1px solid var(--border-secondary); padding-top: var(--space-3);">
            <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">Core Dosha Scan:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${Y.map(a=>`
                <span style="font-size: 11px; padding: 4px 10px; border-radius: 9999px; font-weight: 600; background: ${a.present?a.cancelled?"rgba(245, 158, 11, 0.15)":"rgba(239, 68, 68, 0.15)":"rgba(16, 185, 129, 0.15)"}; color: ${a.present?a.cancelled?"#F59E0B":"#EF4444":"#10B981"}; border: 1px solid currentColor;">
                  ${a.name}: ${a.present?a.cancelled?"Cancelled / Mild":"Present":"Clear"}
                </span>
              `).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Planetary Positions Table -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>🪐 Planetary Positions (ग्रह स्थिति)</span></h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--text-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-primary); color: var(--gold-400);">
                <th style="padding: 10px;">Planet</th>
                <th style="padding: 10px;">Rashi (Sign)</th>
                <th style="padding: 10px;">Longitude</th>
                <th style="padding: 10px;">Nakshatra & Pada</th>
                <th style="padding: 10px;">Navamsa</th>
                <th style="padding: 10px;">House</th>
                <th style="padding: 10px;">Dignity / Status</th>
              </tr>
            </thead>
            <tbody>
              ${d.planets.map(a=>`
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: 10px; font-weight: 600; color: ${a.color};">
                    ${a.symbol} ${a.name} (${a.nameHi})
                  </td>
                  <td style="padding: 10px;">${a.rashiSymbol} ${a.rashiName} (${a.rashiNameHi})</td>
                  <td style="padding: 10px; font-family: monospace;">${a.degreeFormatted}</td>
                  <td style="padding: 10px;">${a.nakshatraName} (Pada ${a.pada})</td>
                  <td style="padding: 10px;">${a.navamsaName} (${a.navamsaNameHi})</td>
                  <td style="padding: 10px; font-weight: 600; color: var(--gold-400);">House ${a.house}</td>
                  <td style="padding: 10px;">
                    <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.05); border: 1px solid var(--border-secondary);">
                      ${a.strength.status}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Yogas & Doshas Analysis Section -->
      <div class="grid-2">
        <!-- Auspicious Yogas -->
        <div class="glass-card">
          <h3 class="card-title"><span style="color: #10B981;">✨ Auspicious Yogas Detected (${u.length})</span></h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${u.length===0?'<p style="color: var(--text-tertiary);">No major classical yogas detected under primary criteria.</p>':""}
            ${u.map(a=>`
              <div style="padding: var(--space-3); background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: 700; color: var(--gold-400);">${a.name} (${a.nameHi})</span>
                  <span style="font-size: 11px; color: #10B981; font-weight: 600;">${a.strength}</span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 6px; line-height: 1.5;">${a.description}</div>
                <div style="font-size: 11px; color: var(--gold-300);"><strong>Vedic Remedy / Enhancement:</strong> ${a.remedy}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Dosha Analysis, Lifecycles & Remedies with Ending Dates -->
        <div class="glass-card">
          <h3 class="card-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <span style="color: #F59E0B;">🛡️ Dosha Analysis, Ending Dates & Authentic Sanatan Remedies</span>
            <span style="font-size: 11px; color: var(--gold-400); font-weight: 600;">Exact Ending Dates & Milestones Included</span>
          </h3>
          <div style="display: flex; flex-direction: column; gap: var(--space-4);">
            ${Y.filter(a=>a.present).map(a=>`
              <div style="padding: var(--space-4); background: rgba(239, 68, 68, 0.04); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 6px;">
                  <span style="font-weight: 800; font-size: 15px; color: #F59E0B;">${a.name} (${a.nameHi})</span>
                  <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: ${a.cancelled?"rgba(16, 185, 129, 0.2)":"rgba(239, 68, 68, 0.2)"}; color: ${a.cancelled?"#10B981":"#EF4444"}; font-weight: 700; border: 1px solid currentColor;">${a.intensity}</span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: 6px;">${a.details}</div>
                <div style="font-size: 12px; color: #E2E8F0; margin-bottom: 8px; line-height: 1.5;">${a.impact}</div>

                <!-- Ending Date & Lifecycle Banner -->
                ${a.endingTimeline?`
                  <div style="background: rgba(218, 165, 32, 0.08); border: 1px solid rgba(218, 165, 32, 0.35); border-radius: 6px; padding: 10px 12px; margin: 8px 0 10px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: ${a.timelineMilestones&&a.timelineMilestones.length>0?"8px":"0"};">
                      <div style="font-size: 12px; color: var(--gold-300);">
                        <strong>⏳ Ending Date / Relief Milestone:</strong>
                        <span style="font-weight: 700; color: #FFF;"> ${a.endingTimeline}</span>
                      </div>
                      ${a.endDateFormatted&&a.endDateFormatted!=="N/A"?`
                        <span style="font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: rgba(218,165,32,0.25); color: var(--gold-300); border: 1px solid var(--gold-400);">
                          🗓️ ${a.endDateFormatted}
                        </span>
                      `:""}
                    </div>

                    ${a.timelineMilestones&&a.timelineMilestones.length>0?`
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px; margin-top: 6px; font-size: 11px;">
                        ${a.timelineMilestones.map(E=>`
                          <div style="padding: 6px 8px; background: rgba(0,0,0,0.25); border-radius: 4px; border-left: 3px solid var(--gold-400);">
                            <div style="font-weight: 700; color: var(--gold-300);">${E.phase||E.label}</div>
                            <div style="color: #CBD5E1; font-size: 10.5px;">${E.period||E.date||""}</div>
                            ${E.desc?`<div style="color: var(--text-tertiary); font-size: 10px; margin-top: 2px;">${E.desc}</div>`:""}
                          </div>
                        `).join("")}
                      </div>
                    `:""}
                  </div>
                `:""}

                <!-- Structured Remedies Section -->
                ${a.structuredRemedies?`
                  <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
                    <div style="font-weight: 800; font-size: 12px; color: var(--gold-400); margin-bottom: 6px;">Authentic Sanatan Remedies & Vidhi:</div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 8px; font-size: 11.5px; line-height: 1.5;">
                      ${a.structuredRemedies.mantra?`
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #38BDF8;">🕉️ Mantra Sadhana:</strong>
                          <div style="font-style: italic; color: #FFF; margin: 2px 0;">"${a.structuredRemedies.mantra.verse}"</div>
                          <div style="color: var(--text-secondary); font-size: 10.5px;"><strong>Japa:</strong> ${a.structuredRemedies.mantra.japaCount} &bull; <strong>Mala:</strong> ${a.structuredRemedies.mantra.mala}</div>
                        </div>
                      `:""}
                      ${a.structuredRemedies.rudraksha?`
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #F43F5E;">📿 Sacred Rudraksha:</strong>
                          <div style="color: #FFF; font-weight: 600; margin: 2px 0;">${a.structuredRemedies.rudraksha.mukhi}</div>
                          <div style="color: var(--text-secondary); font-size: 10.5px;">${a.structuredRemedies.rudraksha.benefit}</div>
                        </div>
                      `:""}
                      ${a.structuredRemedies.daan?`
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #34D399;">🌾 Daan & Seva (दान):</strong>
                          <div style="color: #E2E8F0; margin: 2px 0;">${a.structuredRemedies.daan.items}</div>
                          <div style="color: var(--text-secondary); font-size: 10.5px;"><strong>Day:</strong> ${a.structuredRemedies.daan.day} &bull; <strong>Recipient:</strong> ${a.structuredRemedies.daan.recipient}</div>
                        </div>
                      `:""}
                      ${a.structuredRemedies.tirthas?`
                        <div style="padding: 8px 10px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid var(--border-secondary);">
                          <strong style="color: #FBBF24;">🏛️ Siddha Tirthas (सिद्ध पीठ):</strong>
                          <ul style="padding-left: 16px; margin: 3px 0 0 0; color: #CBD5E1; font-size: 10.5px;">
                            ${a.structuredRemedies.tirthas.map(E=>`<li>${E}</li>`).join("")}
                          </ul>
                        </div>
                      `:""}
                    </div>
                  </div>
                `:`
                  <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
                    <strong style="font-size: 11px; color: var(--gold-400);">Authentic Sanatan Remedies:</strong>
                    <ul style="padding-left: 18px; margin-top: 4px; font-size: 11px; color: var(--text-secondary); line-height: 1.5;">
                      ${a.remedies.map(E=>`<li>${E}</li>`).join("")}
                    </ul>
                  </div>
                `}
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;let lt="lagna";const ht=ge(d),pt={lagnaRashi:l.lagna.rashi,houses:{}};for(let a=1;a<=12;a++)pt.houses[a]={rashi:l.houses[a-1].rashi,rashiSymbol:l.houses[a-1].rashiSymbol,planets:l.houses[a-1].planets.map(E=>({abbr:E.abbr,symbol:E.symbol,color:E.color,degree:""}))};function at(){Lt(lt==="lagna"?ht:pt,"chart-viewport",it.chartStyle)}at(),(F=document.getElementById("style-north-btn"))==null||F.addEventListener("click",()=>{it.setChartStyle("north"),document.getElementById("style-north-btn").className="btn btn-primary",document.getElementById("style-south-btn").className="btn btn-secondary",at()}),(P=document.getElementById("style-south-btn"))==null||P.addEventListener("click",()=>{it.setChartStyle("south"),document.getElementById("style-south-btn").className="btn btn-primary",document.getElementById("style-north-btn").className="btn btn-secondary",at()}),(_=document.getElementById("chart-tab-lagna"))==null||_.addEventListener("click",()=>{lt="lagna",document.getElementById("chart-tab-lagna").className="btn btn-primary",document.getElementById("chart-tab-navamsa").className="btn btn-secondary",at()}),(j=document.getElementById("chart-tab-navamsa"))==null||j.addEventListener("click",()=>{lt="navamsa",document.getElementById("chart-tab-navamsa").className="btn btn-primary",document.getElementById("chart-tab-lagna").className="btn btn-secondary",at()})}}function ea(r){let p=document.getElementById("astro-toast-notification");p||(p=document.createElement("div"),p.id="astro-toast-notification",p.className="astro-toast",document.body.appendChild(p)),p.textContent=r,p.classList.add("show"),setTimeout(()=>p.classList.remove("show"),3500)}export{ma as renderKundaliPage};
