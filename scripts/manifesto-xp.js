/* Toggle expand/collapse panels for Cypherpunk manifesto (+ explain / + context) */
function xp(btn, id) {
  var panel = document.getElementById(id);
  if (!panel) return false;
  var opening = !panel.classList.contains('open');
  panel.classList.toggle('open', opening);
  btn.classList.toggle('active', opening);
  var text = btn.textContent.replace(/^\s*[+-]\s*/, '');
  btn.textContent = (opening ? '- ' : '+ ') + text;
  return false;
}
