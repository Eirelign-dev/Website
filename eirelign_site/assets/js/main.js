
(function(){
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero');
  if (header && hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => header.classList.toggle('compact', !e.isIntersecting));
    }, { threshold: 0.2 });
    io.observe(hero);
  } else if (header) {
    window.addEventListener('scroll', ()=>{ header.classList.toggle('compact', window.scrollY > 40); });
  }
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => { if (a.getAttribute('href') === path) a.setAttribute('aria-current','page'); });
  function readCart(){ try { return JSON.parse(localStorage.getItem('eirelign_cart')||'[]'); } catch { return []; } }
  function writeCart(items){ localStorage.setItem('eirelign_cart', JSON.stringify(items)); }
  function addToCart(item){ const items=readCart(); items.push(item); writeCart(items); notify(`${item.name} added to cart`); updateCartBadge(); }
  function clearCart(){ writeCart([]); updateCartBadge(); }
  function updateCartBadge(){ const b=document.querySelector('[data-cart-count]'); if(b) b.textContent = readCart().length; }
  function notify(msg){ let n=document.createElement('div'); n.textContent=msg; n.style.position='fixed'; n.style.right='14px'; n.style.bottom='14px'; n.style.background='#111'; n.style.color='#fff'; n.style.padding='10px 14px'; n.style.borderRadius='10px'; n.style.zIndex=2000; document.body.appendChild(n); setTimeout(()=>n.remove(),1500); }
  window.EirelignCart = { readCart, writeCart, addToCart, clearCart, updateCartBadge };
  updateCartBadge();
})();
