import React, {useState} from 'react';
import {ArrowRight, BookOpen, Calculator, LineChart} from 'lucide-react';
export default function LearningGuide({onMethodology}) {
 const [amount,setAmount]=useState(20000),[oldIndex,setOldIndex]=useState(100),[newIndex,setNewIndex]=useState(300);
 const valid=[amount,oldIndex,newIndex].every(v=>v!==''&&Number.isFinite(Number(v))&&Number(v)>0);
 const adjusted=valid?Number(amount)*Number(newIndex)/Number(oldIndex):null;
 return <section className="learning-guide" aria-labelledby="guide-title">
  <div className="section-head"><div><div className="eyebrow">START HERE · PEHLE CONCEPT SAMJHEIN</div><h2 id="guide-title">More rupees. But more expensive?</h2><p>Purani aur aaj ki fees ko ek jaisi purchasing power mein compare karein.</p></div><button className="outline" onClick={onMethodology}>Read the method <ArrowRight size={16}/></button></div>
  <div className="learning-steps">
   <article><BookOpen/><span>01 / COLLECT</span><h3>Find the original fee</h3><p>Prospectus se programme, year aur fee lein. Har amount ke saath uska source rakhein.</p></article>
   <article><Calculator/><span>02 / ADJUST</span><h3>Account for inflation</h3><p>PBS price index se purani fee ko selected year ke paison mein convert karein.</p></article>
   <article><LineChart/><span>03 / COMPARE</span><h3>Read the real change</h3><p>Ab dekhein: general prices ke muqable mein education mehngi hui ya sasti?</p></article>
  </div>
  <div className="example-lab"><div><span className="demo-badge">LEARNING EXAMPLE · NOT UNIVERSITY DATA</span><h3>Try the calculation yourself.</h3><p>Yeh sirf example hai. Numbers badlein aur dekhein purchasing power kaise badalti hai.</p><div className="example-inputs">{[["Old fee · PKR",amount,setAmount],["Old price index",oldIndex,setOldIndex],["Reference price index",newIndex,setNewIndex]].map(([label,value,set])=><label key={label}>{label}<input type="number" min="0.01" step="any" value={value} onChange={e=>set(e.target.value)}/></label>)}</div></div><div className="example-result" aria-live="polite"><span>OLD FEE IN REFERENCE-YEAR MONEY</span><strong>{adjusted===null?'Enter valid values':new Intl.NumberFormat('en-PK',{style:'currency',currency:'PKR',maximumFractionDigits:0}).format(adjusted)}</strong><p>{valid?`${Number(amount).toLocaleString()} × ${newIndex} ÷ ${oldIndex}`:'Use positive values in all three fields.'}</p><small>General prices ka asar adjust hua. Yeh aaj ki actual university fee nahi hai.</small></div></div>
 </section>;
}
