
(function(){
  const $=(s,c=document)=>c.querySelector(s);
  const tbody=$('#cart-body'); const subtotalEl=$('#subtotal'); const emptyEl=$('#cart-empty'); const filledEl=$('#cart-filled');
  function fmt(n){return new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR'}).format(n);} 
  function keyOf(item){ const opts=item.options?JSON.stringify(item.options):''; return `${item.sku}::${item.name}::${opts}`; }
  function group(items){ const m=new Map(); items.forEach(it=>{ const k=keyOf(it); const e=m.get(k)||{item:it,qty:0}; e.qty++; m.set(k,e); }); return [...m.values()]; }
  function render(){ const items=window.EirelignCart.readCart(); if(!items.length){ emptyEl.style.display='block'; filledEl.style.display='none'; window.EirelignCart.updateCartBadge(); return; } emptyEl.style.display='none'; filledEl.style.display='block'; tbody.innerHTML=''; let subtotal=0; group(items).forEach(({item,qty})=>{ const tr=document.createElement('tr'); const opts=item.options||{}; const optsText=[opts.primary?`Primary: ${opts.primary}`:'', opts.accent?`Accent: ${opts.accent}`:'', opts.pattern?`Pattern: ${opts.pattern}`:'', opts.finish?`Finish: ${opts.finish}`:'', opts.engraving?`Engraving: ${opts.engraving}`:''].filter(Boolean).join(' · '); const line=item.price*qty; subtotal+=line; tr.innerHTML=`
      <td><div style="font-weight:700">${item.name}</div><div class="meta">SKU: ${item.sku}${optsText?' — '+optsText:''}</div></td>
      <td>${fmt(item.price)}</td>
      <td><div class="qty"><button aria-label="Decrease quantity">−</button><input type="text" value="${qty}" aria-label="Quantity"/><button aria-label="Increase quantity">+</button></div></td>
      <td style="font-weight:700">${fmt(line)}</td>
      <td><button class="link-remove" style="background:none;border:0;color:#b42318;cursor:pointer;">Remove</button></td>`; const [dec,input,inc]=tr.querySelectorAll('.qty > *');
      dec.addEventListener('click',()=>changeQty(item,-1)); inc.addEventListener('click',()=>changeQty(item,1)); input.addEventListener('change',()=>setQty(item, parseInt(input.value||'1',10))); tr.querySelector('.link-remove').addEventListener('click',()=>setQty(item,0)); tbody.appendChild(tr); }); subtotalEl.textContent=fmt(subtotal); window.EirelignCart.updateCartBadge(); }
  function setQty(item,n){ const items=window.EirelignCart.readCart(); const sig=keyOf(item); const left=items.filter(it=>keyOf(it)!==sig); for(let i=0;i<n;i++) left.push(item); window.EirelignCart.writeCart(left); render(); }
  function changeQty(item,d){ const items=window.EirelignCart.readCart(); if(d>0) items.push(item); else { const idx=items.findIndex(it=>keyOf(it)===keyOf(item)); if(idx>=0) items.splice(idx,1); } window.EirelignCart.writeCart(items); render(); }
  if (tbody) render();
})();
