// Lightweight interactions and animations for a premium, static site

// compatibility helper (used by some existing markup)
function scrollToSection(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

document.addEventListener('DOMContentLoaded', function(){
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');

  if(navToggle && navList){
    navToggle.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
      // reflect state for assistive tech
      navList.setAttribute('aria-hidden', String(expanded));
      navList.setAttribute('aria-expanded', String(!expanded));
      if(!expanded){ // just opened
        const first = navList.querySelector('a'); first && first.focus();
      } else { // just closed
        this.focus();
      }
    });

    // close menu when link clicked (mobile)
    navList.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        navList.classList.remove('open');
        navList.setAttribute('aria-hidden','true');
        navList.setAttribute('aria-expanded','false');
        navToggle.setAttribute('aria-expanded','false');
      });
    });
  }

  // Smooth anchor scrolling for in-page links
  // Only focus the target when activation is from keyboard to avoid a visible caret after mouse clicks.
  let lastInteraction = 'mouse';
  window.addEventListener('keydown', ()=> lastInteraction = 'keyboard', {capture:true});
  window.addEventListener('pointerdown', ()=> lastInteraction = 'mouse', {capture:true});

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});

        // Only focus for keyboard users (keeps accessible focus, prevents mouse caret)
        if(lastInteraction === 'keyboard'){
          target.setAttribute('tabindex','-1');
          target.focus({preventScroll:true});
          target.addEventListener('blur', ()=> target.removeAttribute('tabindex'), {once:true});
        }
      }
    });
  });

  // hero headline animation removed (static hero)

  // IntersectionObserver for reveal animations
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -80px 0px'});
  reveals.forEach(r=> io.observe(r));

  // Contact form: simple client-side validation + UX message
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = (form.name.value || '').trim();
      const email = (form.email.value || '').trim();
      const message = (form.message.value || '').trim();
      if(!name || !email || !message){
        return showFormMessage(form, 'Please complete all fields', 'error');
      }
      if(!/^\S+@\S+\.\S+$/.test(email)){
        return showFormMessage(form, 'Please enter a valid email', 'error');
      }
      // simulate success
      showFormMessage(form, 'Thanks — your message has been sent', 'success');
      form.reset();
    });
  }

  function showFormMessage(form, text, type){
    let el = form.querySelector('.form-message');
    if(!el){
      el = document.createElement('div');
      el.className = 'form-message';
      el.setAttribute('role','status');
      form.prepend(el);
    }
    el.textContent = text;
    el.classList.remove('success','error');
    el.classList.add(type);
    // show/hide without animated transitions
    el.style.transition = '';
    el.style.opacity = 1; el.style.transform = 'none';
    setTimeout(()=>{ el.style.opacity = 0; }, 3200);
  }

  // keyboard escape closes mobile nav
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      navList && navList.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded','false');
    }
  });

  /* ------------------
     Scroll progress, Back-to-top, Parallax, Card tilt
     ------------------ */
  const progress = document.getElementById('scroll-progress');
  const backToTop = document.querySelector('.back-to-top');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // set reduced-motion indicator on html for CSS
  if(prefersReduced) document.documentElement.classList.add('reduced-motion');

  // hero headline animation — simple and respectful of reduced-motion and touch
  const heroAnim = document.querySelector('.hero-anim');
  if(heroAnim && !prefersReduced && !('ontouchstart' in window)){
    setTimeout(()=> heroAnim.classList.add('animate'), 420);
  }

  // ensure nav accessibility attributes
  if(navList){ navList.setAttribute('aria-hidden', 'true'); navList.setAttribute('aria-expanded','false'); }
  if(navToggle){ navToggle.setAttribute('aria-expanded','false'); }

  // throttled onScroll using rAF
  let ticking = false;
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(()=>{
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0;
      if(progress) progress.style.width = pct + '%';

      if(backToTop) {
        if(scrollTop > 420) backToTop.classList.add('visible'); else backToTop.classList.remove('visible');
      }

      // active nav link tracking
      const fromTop = scrollTop + 120;
      document.querySelectorAll('.nav-list a').forEach(link=>{
        const href = link.getAttribute('href');
        if(!href || !href.startsWith('#')) return;
        const section = document.querySelector(href);
        if(section){
          const top = section.offsetTop;
          const bottom = top + section.offsetHeight;
          link.classList.toggle('active', fromTop >= top && fromTop < bottom);
        }
      });

      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  if(backToTop){
    backToTop.addEventListener('click', ()=> {
      if(prefersReduced) window.scrollTo(0,0); else window.scrollTo({top:0,behavior:'smooth'});
      backToTop.blur();
    });
  }

  // hero parallax removed — hero background remains static to avoid motion
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  if(hero && heroBg){ heroBg.style.transform = ''; }

  // interactive card tilt removed — keep keyboard activation only
  const cards = document.querySelectorAll('.card.interactive');
  cards.forEach(card=>{
    // keyboard activation (Enter/Space) to follow primary link
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        const link = card.querySelector('.card-link'); if(link) link.click();
      }
    });
    // image links: allow click anywhere on the card to follow the primary link for convenience
    card.addEventListener('click', (e)=>{
      const link = card.querySelector('.card-link'); if(link) link.click();
    });
  });

  // close mobile nav on link click & maintain aria-hidden
  document.querySelectorAll('.nav-list a').forEach(a=>{
    a.addEventListener('click', ()=>{
      navList && navList.classList.remove('open');
      if(navList){ navList.setAttribute('aria-hidden','true'); navList.setAttribute('aria-expanded','false'); }
      if(navToggle) navToggle.setAttribute('aria-expanded','false');
    });
  });

});
