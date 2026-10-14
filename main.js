(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. animated headings: split into letters
  document.querySelectorAll('[data-fx]').forEach(function (h) {
    var text = h.textContent.trim(), i = 0, out = '';
    h.setAttribute('aria-label', text);
    text.split(' ').forEach(function (word, wi, arr) {
      out += '<span class="w" aria-hidden="true">';
      word.split('').forEach(function (c) {
        out += '<span class="ch' + (c === '&' ? ' amp' : '') + '" style="--i:' + (i++) + '">' + (c === '&' ? '&amp;' : c) + '</span>';
      });
      out += '</span>';
      if (wi < arr.length - 1) { out += ' '; i++; }
    });
    h.innerHTML = out;
  });

  // 2. typing line (data-words="one|two|three")
  var typed = document.getElementById('typed');
  if (typed) {
    var words = (typed.getAttribute('data-words') || '').split('|');
    if (reduce) { typed.textContent = words.join(' '); }
    else {
      var w = 0, c = 0, del = false;
      (function tick() {
        var word = words[w];
        c += del ? -1 : 1;
        typed.textContent = word.slice(0, c);
        var d = del ? 40 : 85;
        if (!del && c === word.length) { del = true; d = 1700; }
        else if (del && c === 0) { del = false; w = (w + 1) % words.length; d = 350; }
        setTimeout(tick, d);
      })();
    }
  }

  // 3. scroll reveal
  var items = document.querySelectorAll('.reveal');
  document.querySelectorAll('.rows, .bio, .home-actions').forEach(function (g) {
    g.querySelectorAll('.reveal').forEach(function (el, k) { el.style.setProperty('--d', (k * 90) + 'ms'); });
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // 4. work-history accordion (one open at a time)
  var jobs = document.querySelectorAll('.job');
  jobs.forEach(function (job) {
    var head = job.querySelector('.row');
    head.addEventListener('click', function () {
      var open = !job.classList.contains('open');
      jobs.forEach(function (j) { j.classList.remove('open'); j.querySelector('.row').setAttribute('aria-expanded', 'false'); });
      if (open) { job.classList.add('open'); head.setAttribute('aria-expanded', 'true'); }
    });
  });

  // 5. portrait follows the cursor a little
  var frame = document.querySelector('.portrait-frame2');
  if (frame && !reduce && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 14, y = (e.clientY / window.innerHeight - 0.5) * 10;
      frame.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    });
  }
})();
