export {};
const bar=document.querySelector<HTMLElement>('[data-series-progress]');
const update=()=>{if(!bar)return;const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=`${max>0?Math.min(100,scrollY/max*100):0}%`};
addEventListener('scroll',update,{passive:true});update();
const params=new URLSearchParams(location.search);
let sid=params.get('sid');
if(!sid){sid=sessionStorage.getItem('professorit_longread_sid')||crypto.randomUUID();sessionStorage.setItem('professorit_longread_sid',sid)}
document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link=>link.addEventListener('click',()=>{try{const url=new URL(link.href);if(url.origin!==location.origin)return;['utm_source','utm_medium','utm_campaign','utm_content'].forEach(key=>{const value=params.get(key);if(value&&!url.searchParams.has(key))url.searchParams.set(key,value)});if(!url.searchParams.has('sid'))url.searchParams.set('sid',sid);link.href=url.toString()}catch{}}));
