javascript:
function crcl(){
  var d=document,
      z=d.createElement('scr'+'ipt'),
      b=d.body,
      l=d.location,
      //development === localhost || production === //www.caracol.azurewebsites.net 
      u='127.0.0.1:3000';
  try{
    if(!b)
      throw(0);

    d.title='(Saving...) '
      +d.title;

    z.setAttribute('src',l.protocol
      +u
      +'/app/' + encodeURIComponent(l.href)
      +'&t=' + (new Date().getTime()));

    b.appendChild(z);
    }
  catch(e){
    alert('Please wait until the page has loaded.');
  }
}crcl();
void(0)