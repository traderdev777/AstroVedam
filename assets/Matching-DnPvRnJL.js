import{g as oa}from"./kundali-BA-k_CTH.js";import{N as sa,R as na,F as W}from"./ephemeris-XGObF-IA.js";import{a as ra}from"./dosha-YuWC33nj.js";import{r as la,f as da}from"./indianPlaces-CBev9HOS.js";import{e as m}from"./escapeHtml-6fqo2KgN.js";function ca(l){return[4,8,12].includes(l)?{name:"Brahmin",nameHi:"ब्राह्मण",rank:4}:[1,5,9].includes(l)?{name:"Kshatriya",nameHi:"क्षत्रिय",rank:3}:[2,6,10].includes(l)?{name:"Vaishya",nameHi:"वैश्य",rank:2}:{name:"Shudra",nameHi:"शूद्र",rank:1}}function pa(l){return[1,2,9,10].includes(l)?"Chatushpada":[3,6,7,11].includes(l)?"Manava":[4,12].includes(l)?"Jalachara":[5].includes(l)?"Vanachara":"Keeta"}const ma={1:"Horse",2:"Elephant",3:"Sheep",4:"Serpent",5:"Serpent",6:"Dog",7:"Cat",8:"Sheep",9:"Cat",10:"Rat",11:"Rat",12:"Cow",13:"Buffalo",14:"Tiger",15:"Buffalo",16:"Tiger",17:"Hare",18:"Hare",19:"Dog",20:"Monkey",21:"Mongoose",22:"Monkey",23:"Lion",24:"Horse",25:"Lion",26:"Cow",27:"Elephant"},ua={Horse:"Buffalo",Buffalo:"Horse",Elephant:"Lion",Lion:"Elephant",Sheep:"Monkey",Monkey:"Sheep",Serpent:"Mongoose",Mongoose:"Serpent",Dog:"Hare",Hare:"Dog",Cat:"Rat",Rat:"Cat",Cow:"Tiger",Tiger:"Cow"};function ga(l){const s=(l-1)%6;return s===0||s===5?"Adi":s===1||s===4?"Madhya":"Antya"}function ya(l,s){var Z,aa,ea;const d=l.planets.find(_=>_.name==="Moon"),J=s.planets.find(_=>_.name==="Moon"),f=d.nakshatra,n=J.nakshatra,g=d.rashi,r=J.rashi,k=sa[f-1],w=sa[n-1],t=na[g-1],i=na[r-1];let o=0;const h=[],y=[],H=ca(g),R=ca(r);let E=0;H.rank>=R.rank?E=1:y.push({id:"varna_dosha",title:"Varna Dosha (वर्ण दोष)",description:`Groom is ${H.name} and Bride is ${R.name}. Traditionally inverted spiritual rank hierarchy.`,severity:"Mild",remedies:["Feed cows with green fodder and jaggery on Wednesdays and Thursdays.","Donate books or yellow stationery to underprivileged students."]}),o+=E,h.push({name:"Varna Koota",nameHi:"वर्ण कूट",max:1,obtained:E,description:"Spiritual inclination & ego balance",boyVal:H.name,girlVal:R.name,status:E===1?"Compatible":"Incompatible"});const b=pa(g),I=pa(r);let x=0;b===I?x=2:b==="Manava"&&I==="Chatushpada"||b==="Chatushpada"&&I==="Manava"||b==="Jalachara"&&I==="Manava"?x=1:x=.5,o+=x,h.push({name:"Vashya Koota",nameHi:"वश्य कूट",max:2,obtained:x,description:"Mutual attraction and natural dominance",boyVal:b,girlVal:I,status:x>=1?"Good":"Average"});const B=(f-n+27)%27%9,N=(n-f+27)%27%9,e=[2,4,6];let D=0;!e.includes(B)&&!e.includes(N)?D=3:!e.includes(B)||!e.includes(N)?D=1.5:(D=0,y.push({id:"tara_dosha",title:"Tara Dosha (तारा दोष)",description:"Adverse Nakshatra count indicating periodic energy draining and health vulnerability.",severity:"Moderate",remedies:["Chant Navagraha Stotram on Saturdays and Tuesdays.","Donate whole wheat, rice, and pulses according to your weight on birth star days."]})),o+=D,h.push({name:"Tara Koota",nameHi:"तारा कूट",max:3,obtained:D,description:"Destiny, health, and mutual well-being",boyVal:k.en,girlVal:w.en,status:D>=1.5?"Favorable":"Dosha present"});const A=ma[f],S=ma[n];let u=2;A===S?u=4:ua[A]===S?(u=0,y.push({id:"yoni_dosha",title:"Yoni Vair Dosha (योनि वैर दोष)",description:`Inimical animal archetypes (${A} vs ${S}) causing physical discord and sexual friction.`,severity:"High",remedies:["Perform Gauri-Shankar Puja before marriage.","Keep two energized Gomti Chakras wrapped in red cloth in the master bedroom."]})):u=2.5,o+=u,h.push({name:"Yoni Koota",nameHi:"योनि कूट",max:4,obtained:u,description:"Physical compatibility and biological harmony",boyVal:A,girlVal:S,status:u===4?"Perfect":u===0?"Yoni Vair (Enemy)":"Neutral"});const v=t.lord,c=i.lord;let p=0;if(v===c)p=5;else{const _=((Z=W[v])==null?void 0:Z.friends)||[],ha=((aa=W[c])==null?void 0:aa.friends)||[],ta=_.includes(c),ia=ha.includes(v);ta&&ia?p=5:ta||ia?p=3.5:(p=1,y.push({id:"graha_maitri_dosha",title:"Graha Maitri Dosha (ग्रह मैत्री दोष)",description:`Planetary discord between Groom's lord (${v}) and Bride's lord (${c}). Causes divergent intellectual outlooks, stubborn ego stands, and differing core values.`,severity:"High",remedies:["Perform Lakshmi-Narayana Puja jointly on Thursdays and Fridays.","Groom and Bride should mutually offer water (Arghya) with red sandalwood and kumkum to the rising Sun every morning.","Keep an energized Surya Yantra and Shukra Yantra in the East quadrant of the living room."]}))}o+=p,h.push({name:"Graha Maitri",nameHi:"ग्रह मैत्री",max:5,obtained:p,description:"Intellectual rapport and psychological friendship",boyVal:`${t.en} (${v})`,girlVal:`${i.en} (${c})`,status:p>=3.5?"Friendly":"Challenging"});const M=k.gana,$=w.gana;let a=0,P=!1;M===$?a=6:M==="Deva"&&$==="Manushya"||M==="Manushya"&&$==="Deva"?a=5:M==="Rakshasa"&&$==="Deva"?(a=1,P=!0):M==="Deva"&&$==="Rakshasa"?(a=0,P=!0):a=1,P&&y.push({id:"gana_dosha",title:"Gana Dosha (गण दोष - देव वर एवं राक्षस कन्या)",description:"Deva Gana Groom and Rakshasa Gana Bride. In classical Jyotish, this is a major temperamental clash: the Bride tends to be commanding, sharp, fiercely assertive and independent, whereas the Groom tends to be diplomatic, idealistic, and peace-seeking. High probability of domestic friction unless tempered.",severity:"Critical",remedies:["Brihaspati (Jupiter) & Shukra (Venus) Shanti: Perform a special Vedic Navagraha Shanti Havan prior to the wedding ceremonies.","Gayatri Mantra Anushthan: Both partners must commit to chanting 24 or 108 Gayatri Mantras daily at sunrise facing East.","Maa Durga / Gauri Vrat: The Bride should worship Goddess Gauri on Fridays and observe fast on Shukla Paksha Ashtami to channel fierce cosmic energy into protective, nurturing grace.","Psychological & Behavioral Discipline: The Groom must cultivate conscious patience and avoid defensive sarcasm; the Bride must consciously moderate temperamental outbursts and avoid public disrespect."]}),o+=a,h.push({name:"Gana Koota",nameHi:"गण कूट",max:6,obtained:a,description:"Temperament and behavioral compatibility",boyVal:M,girlVal:$,status:a>=5?"Harmonious":a===0?"Gana Dosha":"Moderate"});const U=Math.abs(g-r);let F=7,G=!1;([1,11].includes(U)||[5,7].includes(U)||[4,8].includes(U))&&(F=0,G=!0),G&&(v===c||(ea=W[v])!=null&&ea.friends.includes(c))&&(F=7,G=!1),G&&y.push({id:"bhakoot_dosha",title:"Bhakoot Dosha (भकूट दोष)",description:"Adverse relative placement of Moon signs affecting financial accumulation and emotional attachment.",severity:"High",remedies:["Perform Mahavishnu or Shiva Sahasranama chanting.","Observe Ekadashi fasts and donate yellow fruits to Brahmins."]}),o+=F,h.push({name:"Bhakoot Koota",nameHi:"भकूट कूट",max:7,obtained:F,description:"Emotional romance, health, and familial longevity",boyVal:`${g} (${t.en})`,girlVal:`${r} (${i.en})`,status:F===7?"Auspicious (Bhakoot Clean)":"Bhakoot Dosha"});const q=ga(f),X=ga(n);let C=0,z=!1;q!==X?C=8:(z=!0,g===r&&f!==n&&(C=8,z=!1)),z&&y.push({id:"nadi_dosha",title:"Antya Nadi Dosha (नाड़ी दोष - अन्त्य नाड़ी)",description:"Both Groom and Bride share the same Antya (Kapha / Pitru) Nadi. In Vedic genetics and Ayurvedic cosmology, identical Nadis threaten physical vitality, biological compatibility, chronic health depletion, progeny (santan) delays or complications, and genetic afflictions. It carries 8 full points (the heaviest factor in marriage).",severity:"Critical / Mahadosha",remedies:["Suvarna Naag Daan (स्वर्ण नाग दान): Before Vivah Sanskar, donate a pair of consecrated serpents crafted in Gold or Silver along with cow ghee, black sesame seeds, copper vessel, and clothes to an upright Vedic scholar on a Monday or Nag Panchami.",'Maha Mrityunjaya Anushthan (महामृत्युंजय अनुष्ठान): Complete 1,25,000 recitations of the Maha Mrityunjaya Mantra ("ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्...") with full Havan and Bilva samidha.',"Swarna Kanya Daan: The Bride's parents must perform Kanya Daan accompanied by gifting gold to sanctify genetic lineage.","Panchamrit Rudrabhishek: Perform monthly Ekadasha Rudrabhishek of Lord Shiva using milk, honey, curd, ghee, and sugarcane juice.","Go-Daan / Cow Service: Donate a cow or serve cows in a Gau-shala regularly, feeding them fresh green grass and jaggery on Wednesdays."]}),o+=C,h.push({name:"Nadi Koota",nameHi:"नाड़ी कूट",max:8,obtained:C,description:"Genetic compatibility, progeny, and physiological health",boyVal:q,girlVal:X,status:C===8?"Safe (No Nadi Dosha)":`Nadi Dosha (${q} Nadi)`});let V="",T="",L="",O="NO",j="",K="",Y="",Q="";return o>=28&&!z?(V="Excellent Match (Uttam Milan)",T="उत्तम मिलान - अत्यंत शुभ विवाह योग",L="#10B981",O="YES",j="IDEAL FOR MARRIAGE (सर्वोत्तम)",K="YES — Highly Recommended for Auspicious Marriage",Y="This alliance scores exceptionally high across spiritual, mental, genetic, and biological dimensions. Marital longevity, happiness, and prosperity are strongly favored by Sanatan traditions."):o>=18&&!z?(V="Good Match (Madhyam Milan)",T="मध्यम मिलान - सामान्य अनुकूल",L="#F59E0B",O="YES",j="APPROVED WITH MINOR REMEDIES (स्वीकार्य)",K="YES — Permitted with Standard Auspicious Rituals",Y="The alliance crosses the required 18-point threshold without critical Nadi Dosha. Marriage is permitted with standard blessings of Lord Ganesha and Gauri-Shankar."):o>=18&&z?(V="Borderline Match (Madhyam with Nadi Dosha)",T="मध्यम मिलान - नाड़ी दोष निवारण आवश्यक",L="#F59E0B",O="CONDITIONAL",j="CONDITIONAL ON NADI SHANTI (सशर्त)",K="CONDITIONAL — Only Allowed After Mandatory Nadi Shanti",Y="Points exceed 18, but presence of Nadi Dosha requires strict completion of Suvarna Naag Daan and Maha Mrityunjaya Anushthan before wedding ceremonies."):(V="Inauspicious Match (Ashubh Milan)",T="अशुभ मिलान - शास्त्रानुसार वर्जित",L="#EF4444",O="NOT_RECOMMENDED",j="NOT RECOMMENDED FOR MARRIAGE (विवाह वर्जित)",K="NO — Marriage Is NOT Recommended Under Vedic Shastras",Y=`Based on classical Brihat Parashara Hora Shastra, this match scores only ${o} out of 36 Gunas (well below the mandatory 18-point threshold). It suffers from TWO severe Mahadoshas simultaneously: Antya Nadi Dosha (0/8) and Gana Dosha (0/6, Deva Groom + Rakshasa Bride), alongside Graha Maitri enmity (1/5). Under orthodox Sanatan rules, THIS MARRIAGE IS STRONGLY DISCOURAGED due to high risks of constant domestic strife, health complications, ego clashes, and progeny hardships.`,Q=`बृहत्पाराशर होराशास्त्र एवं मुहूर्त चिन्तामणि के अनुसार, यह मिलान ३६ में से केवल ${o} गुण प्राप्त करता है (न्यूनतम १८ से बहुत कम)। इसमें दो प्रमुख महादोष एक साथ विद्यमान हैं: अन्त्य नाड़ी दोष (०/८) तथा गण दोष (०/६ - देव वर एवं राक्षस कन्या), साथ ही ग्रह मैत्री शत्रुता (१/५)। सनातन शास्त्रानुसार यह विवाह सामान्यतः वर्जित है। यदि पारिवारिक या व्यक्तिगत कारणों से विवाह करना अनिवार्य ही हो, तो नीचे उल्लिखित सभी प्रायश्चित्त व शांति विधान विवाह पूर्व सम्पन्न कराना अनिवार्य होगा।`),{totalPoints:o,maxPoints:36,percentage:Math.round(o/36*100),verdict:V,verdictHi:T,color:L,canMarry:O,decisionBadge:j,decisionTitle:K,detailedConclusion:Y,detailedConclusionHi:Q,kootas:h,detectedDoshas:y}}function Ma(l){let s={name:"Amit Brijawasi",date:"1994-06-15",time:"08:30",lat:28.6139,lon:77.209,tz:5.5,city:"New Delhi, Delhi"},d={name:"Mahalaxmi Hajeri",date:"1996-09-22",time:"14:15",lat:19.076,lon:72.8777,tz:5.5,city:"Mumbai, Maharashtra"};function J(){var w;l.innerHTML=`
      <div class="matching-page">
        <!-- Header -->
        <div style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--text-3xl); font-weight: 800; background: var(--gradient-accent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            💍 Kundali Milan: Marriage Decision & Exact Vedic Remedies
          </h2>
          <p style="color: var(--text-secondary); font-size: var(--text-sm);">
            Ashtakoota 36 Gunas, definitive marriage conclusion, and exact classical remedies for each detected dosha.
          </p>
        </div>

        <!-- Inputs Grid -->
        <div class="grid-2" style="margin-bottom: var(--space-8);">
          <!-- Boy Form -->
          <div class="glass-card">
            <h3 class="card-title"><span>🤵 Groom Details (वर)</span></h3>
            <div class="form-group">
              <label class="form-label">Groom's Name</label>
              <input type="text" id="m-boy-name" class="form-input" value="${m(s.name)}" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" id="m-boy-date" class="form-input" value="${m(s.date)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Time of Birth (24h)</label>
                <input type="time" id="m-boy-time" class="form-input" value="${m(s.time)}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>Place of Birth (Search All Indian Places)</span>
                <span style="color: var(--gold-400); font-size: 11px;">150+ Places</span>
              </label>
              <input type="text" id="m-boy-city-input" list="m-boy-places-list" class="form-input" 
                     placeholder="Search city e.g. Bengaluru, Varanasi, Ayodhya, Patna..." 
                     value="${m(s.city)}" autocomplete="off" />
              ${la("m-boy-places-list")}
            </div>
            <div class="form-row" style="font-size: 11px; opacity: 0.85; background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Latitude (°N)</label>
                <input type="number" step="0.0001" id="m-boy-lat" class="form-input" value="${s.lat}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Longitude (°E)</label>
                <input type="number" step="0.0001" id="m-boy-lon" class="form-input" value="${s.lon}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
            </div>
          </div>

          <!-- Girl Form -->
          <div class="glass-card">
            <h3 class="card-title"><span>👰 Bride Details (कन्या)</span></h3>
            <div class="form-group">
              <label class="form-label">Bride's Name</label>
              <input type="text" id="m-girl-name" class="form-input" value="${m(d.name)}" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Date of Birth</label>
                <input type="date" id="m-girl-date" class="form-input" value="${m(d.date)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Time of Birth (24h)</label>
                <input type="time" id="m-girl-time" class="form-input" value="${m(d.time)}" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" style="display: flex; justify-content: space-between;">
                <span>Place of Birth (Search All Indian Places)</span>
                <span style="color: var(--gold-400); font-size: 11px;">150+ Places</span>
              </label>
              <input type="text" id="m-girl-city-input" list="m-girl-places-list" class="form-input" 
                     placeholder="Search city e.g. Mumbai, Mysuru, Ujjain, Jaipur..." 
                     value="${m(d.city)}" autocomplete="off" />
              ${la("m-girl-places-list")}
            </div>
            <div class="form-row" style="font-size: 11px; opacity: 0.85; background: rgba(0,0,0,0.15); padding: 8px; border-radius: 6px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Latitude (°N)</label>
                <input type="number" step="0.0001" id="m-girl-lat" class="form-input" value="${d.lat}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 10px;">Longitude (°E)</label>
                <input type="number" step="0.0001" id="m-girl-lon" class="form-input" value="${d.lon}" style="padding: 4px 8px; font-size: 11px;" />
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center; margin-bottom: var(--space-8);">
          <button id="calculate-match-btn" class="btn btn-primary btn-lg">
            ✨ Calculate Compatibility & Generate Verdict
          </button>
        </div>

        <!-- Results Section -->
        <div id="matching-results-container"></div>
      </div>
    `;const n=document.getElementById("m-boy-city-input"),g=t=>{const i=da(t);i&&(document.getElementById("m-boy-lat").value=i.lat,document.getElementById("m-boy-lon").value=i.lon,s.city=i.name,s.tz=i.tz)};n==null||n.addEventListener("input",t=>g(t.target.value)),n==null||n.addEventListener("change",t=>g(t.target.value));const r=document.getElementById("m-girl-city-input"),k=t=>{const i=da(t);i&&(document.getElementById("m-girl-lat").value=i.lat,document.getElementById("m-girl-lon").value=i.lon,d.city=i.name,d.tz=i.tz)};r==null||r.addEventListener("input",t=>k(t.target.value)),r==null||r.addEventListener("change",t=>k(t.target.value)),(w=document.getElementById("calculate-match-btn"))==null||w.addEventListener("click",f),f()}function f(){const n=document.getElementById("m-boy-name").value,g=document.getElementById("m-boy-date").value,r=document.getElementById("m-boy-time").value,k=document.getElementById("m-boy-city-input").value,w=parseFloat(document.getElementById("m-boy-lat").value),t=parseFloat(document.getElementById("m-boy-lon").value),i=document.getElementById("m-girl-name").value,o=document.getElementById("m-girl-date").value,h=document.getElementById("m-girl-time").value,y=document.getElementById("m-girl-city-input").value,H=parseFloat(document.getElementById("m-girl-lat").value),R=parseFloat(document.getElementById("m-girl-lon").value),E=m(n||"Groom"),b=m(i||"Bride"),I=m(k||"City"),x=m(y||"City"),B=oa(g,r,w,t,s.tz),N=oa(o,h,H,R,d.tz),e=ya(B,N),D=ra(B),A=ra(N),S=D.find(a=>a.id==="manglik"),u=A.find(a=>a.id==="manglik"),v=document.getElementById("matching-results-container");if(!v)return;const c=B.planets.find(a=>a.name==="Moon"),p=N.planets.find(a=>a.name==="Moon"),M=D.filter(a=>a.present),$=A.filter(a=>a.present);v.innerHTML=`
      <!-- ============================================ -->
      <!-- DEFINITIVE MARRIAGE DECISION BOX (विवाह निर्णय) -->
      <!-- ============================================ -->
      <div class="glass-card" style="margin-bottom: var(--space-8); border: 2.5px solid ${e.color}; padding: var(--space-8); background: linear-gradient(135deg, rgba(15,15,46,0.95), ${e.color}15);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
          <div style="font-size: var(--text-xs); color: var(--gold-400); font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
            🕉️ FINAL ASTROLOGICAL VERDICT & MARRIAGE DECISION (विवाह निर्णय)
          </div>
          <span style="padding: 6px 16px; border-radius: 9999px; background: ${e.color}22; color: ${e.color}; border: 1.5px solid ${e.color}; font-weight: 800; font-size: var(--text-xs);">
            ${e.decisionBadge}
          </span>
        </div>

        <h3 style="font-size: var(--text-3xl); font-weight: 900; color: ${e.color}; margin-bottom: var(--space-3); line-height: 1.2;">
          ${e.decisionTitle}
        </h3>

        <div style="font-size: var(--text-xl); font-weight: 700; color: #FFF; margin-bottom: 4px;">
          Guna Milan Score: <span style="color: ${e.color};">${e.totalPoints} / ${e.maxPoints} Gunas</span> 
          <span style="font-size: var(--text-sm); color: var(--text-secondary); font-weight: 400;">(Minimum required by Shastras: 18)</span>
        </div>

        <p style="font-size: var(--text-sm); color: #E2E8F0; line-height: 1.7; margin: var(--space-4) 0; padding: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 4px solid ${e.color};">
          <strong>Vedic Conclusion:</strong> ${e.detailedConclusion}
        </p>

        <p style="font-family: 'Noto Sans Devanagari'; font-size: var(--text-sm); color: var(--gold-300); line-height: 1.8; margin-bottom: 0;">
          <strong>शास्त्रीय निष्कर्ष:</strong> ${e.detailedConclusionHi}
        </p>
      </div>

      <!-- Astrological Profile Alignment Summary -->
      <div class="grid-2" style="margin-bottom: var(--space-8);">
        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-base); margin-bottom: var(--space-3);">
            🤵 Groom Profile (${E})
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: var(--text-xs);">
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Birth Place:</span>
              <strong style="color: #FFF; margin-left: 4px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${I}</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Lagna:</span>
              <strong style="color: #FFF; margin-left: 4px;">${B.lagna.rashiName} (${B.lagna.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Moon Sign:</span>
              <strong style="color: #FFF; margin-left: 4px;">${c.rashiName} (${c.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Nakshatra:</span>
              <strong style="color: #FFF; margin-left: 4px;">${c.nakshatraName} (Pada ${c.pada})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px; grid-column: span 2;">
              <span style="color: var(--text-tertiary);">Manglik Status:</span>
              <strong style="color: ${S.present?"#EF4444":"#10B981"}; margin-left: 4px;">
                ${S.present?S.cancelled?"Mild (Cancelled by Jupiter/Sign)":"Yes (Kuja Dosha)":"No (Clear)"}
              </strong>
            </div>
          </div>
        </div>

        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-base); margin-bottom: var(--space-3);">
            👰 Bride Profile (${b})
          </h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: var(--text-xs);">
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Birth Place:</span>
              <strong style="color: #FFF; margin-left: 4px; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${x}</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Lagna:</span>
              <strong style="color: #FFF; margin-left: 4px;">${N.lagna.rashiName} (${N.lagna.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Moon Sign:</span>
              <strong style="color: #FFF; margin-left: 4px;">${p.rashiName} (${p.rashiNameHi})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
              <span style="color: var(--text-tertiary);">Nakshatra:</span>
              <strong style="color: #FFF; margin-left: 4px;">${p.nakshatraName} (Pada ${p.pada})</strong>
            </div>
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px; grid-column: span 2;">
              <span style="color: var(--text-tertiary);">Manglik Status:</span>
              <strong style="color: ${u.present?"#EF4444":"#10B981"}; margin-left: 4px;">
                ${u.present?u.cancelled?"Mild (Cancelled by Jupiter/Sign)":"Yes (Kuja Dosha)":"No (Clear)"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- EXACT REMEDIES FOR EACH MATCHING DOSHA -->
      <!-- ============================================ -->
      <div class="glass-card" style="margin-bottom: var(--space-8); border-top: 3px solid #EF4444;">
        <h3 class="card-title">
          <span style="color: #EF4444;">🛡️ Exact Shastric Remedies for Detected Matching Doshas</span>
        </h3>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-4);">
          If the couple or families decide to proceed despite the adverse score, the following specific Vedic remedies MUST be undertaken:
        </p>

        <div style="display: flex; flex-direction: column; gap: var(--space-5);">
          ${e.detectedDoshas.map(a=>`
            <div style="padding: var(--space-4); background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <h4 style="color: var(--gold-400); font-size: var(--text-base); margin: 0;">${a.title}</h4>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: rgba(239,68,68,0.2); color: #EF4444; font-weight: 700;">
                  Severity: ${a.severity}
                </span>
              </div>
              <p style="font-size: var(--text-xs); color: #CBD5E1; margin-bottom: var(--space-3); line-height: 1.6;">
                ${a.description}
              </p>
              <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: 6px; border: 1px solid rgba(218,165,32,0.2);">
                <div style="font-size: 11px; font-weight: 700; color: var(--gold-400); margin-bottom: 6px; text-transform: uppercase;">
                  Exact Sanatan Vedic Step-by-Step Remedies:
                </div>
                <ul style="padding-left: 18px; margin: 0; font-size: 11px; color: var(--text-primary); line-height: 1.8;">
                  ${a.remedies.map(P=>`<li>${P}</li>`).join("")}
                </ul>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- ============================================ -->
      <!-- INDIVIDUAL JANAM KUNDALI DOSHAS & REMEDIES -->
      <!-- ============================================ -->
      <div class="grid-2" style="margin-bottom: var(--space-8);">
        <!-- Groom Kundali Doshas -->
        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-sm); font-weight: 700; margin-bottom: var(--space-3);">
            🪐 Groom's Janam Kundali Doshas (${E})
          </h4>
          ${M.length===0?`<p style="color: #10B981; font-size: 12px;">No major natal doshas detected in Groom's chart.</p>`:""}
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${M.map(a=>`
              <div style="padding: 10px; background: rgba(255,255,255,0.02); border-left: 3px solid #F59E0B; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #FFF;">
                  <span>${a.name} (${a.nameHi})</span>
                  <span style="color: ${a.cancelled?"#10B981":"#EF4444"}; font-size: 10px;">${a.intensity}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); margin: 4px 0;">${a.impact}</div>
                <div style="font-size: 10px; color: var(--gold-300); margin-top: 4px;">
                  <strong>Remedy:</strong> ${a.remedies[0]}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Bride Kundali Doshas -->
        <div class="glass-card">
          <h4 style="color: var(--gold-400); font-size: var(--text-sm); font-weight: 700; margin-bottom: var(--space-3);">
            🪐 Bride's Janam Kundali Doshas (${b})
          </h4>
          ${$.length===0?`<p style="color: #10B981; font-size: 12px;">No major natal doshas detected in Bride's chart.</p>`:""}
          <div style="display: flex; flex-direction: column; gap: var(--space-3);">
            ${$.map(a=>`
              <div style="padding: 10px; background: rgba(255,255,255,0.02); border-left: 3px solid #F59E0B; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #FFF;">
                  <span>${a.name} (${a.nameHi})</span>
                  <span style="color: ${a.cancelled?"#10B981":"#EF4444"}; font-size: 10px;">${a.intensity}</span>
                </div>
                <div style="font-size: 11px; color: var(--text-secondary); margin: 4px 0;">${a.impact}</div>
                <div style="font-size: 10px; color: var(--gold-300); margin-top: 4px;">
                  <strong>Remedy:</strong> ${a.remedies[0]}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- 8 Kootas Table -->
      <div class="glass-card" style="margin-bottom: var(--space-8);">
        <h3 class="card-title"><span>📊 Ashtakoota Milan Breakdown (8 Dimensions)</span></h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: var(--text-sm);">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-primary); color: var(--gold-400);">
                <th style="padding: 10px;">Koota Dimension</th>
                <th style="padding: 10px;">Significance</th>
                <th style="padding: 10px;">Groom (${E})</th>
                <th style="padding: 10px;">Bride (${b})</th>
                <th style="padding: 10px;">Score</th>
                <th style="padding: 10px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${e.kootas.map(a=>`
                <tr style="border-bottom: 1px solid var(--border-secondary);">
                  <td style="padding: 10px; font-weight: 700;">${a.name} (${a.nameHi})</td>
                  <td style="padding: 10px; color: var(--text-secondary); font-size: 12px;">${a.description}</td>
                  <td style="padding: 10px; font-weight: 600;">${a.boyVal}</td>
                  <td style="padding: 10px; font-weight: 600;">${a.girlVal}</td>
                  <td style="padding: 10px; font-weight: 800; color: var(--gold-400);">${a.obtained} / ${a.max}</td>
                  <td style="padding: 10px;">
                    <span style="font-size: 11px; padding: 2px 8px; border-radius: 9999px; background: ${a.obtained>=a.max*.5?"rgba(16, 185, 129, 0.15)":"rgba(239, 68, 68, 0.15)"}; color: ${a.obtained>=a.max*.5?"#10B981":"#EF4444"}; font-weight: 600;">
                      ${a.status}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `}J()}export{Ma as renderMatchingPage};
