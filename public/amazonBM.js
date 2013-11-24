javascript:(function(){
  var w=window,
      l=w.location,
      d=w.document,
      s=d.createElement('script'),
      e=encodeURIComponent,
      o='object',
      n='AUWLBook',
      u='https://www.amazon.com/wishlist/add',
      r='readyState',
      T=setTimeout,
      a='setAttribute',
      g=function(){
        d[r]&&d[r]!='complete'?T(g,200):!w[n]?(s[a]('charset','UTF-8'),
          s[a]('src',
          u+'.js?loc='+e(l)),
          d.body.appendChild(s),
          f()):f()
      },
      f=function(){
        !w[n]?T(f,200):w[n].showPopover()};
        typeof s!=o?l.href=u+'?u='+e(l)+'&t='+e(d.title):g()}())