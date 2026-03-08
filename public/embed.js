/**
 * Boltcall Universal Embed Script
 *
 * Usage: <script src="https://tryboltcall.com/embed.js" data-token="YOUR_TOKEN"></script>
 *
 * Automatically activates enabled features:
 * - Chatbot: Injects Retell voice/chat widget
 * - Speed to Lead: Intercepts form submissions, sends to webhook
 * - Reputation Manager: Shows review popup after configurable trigger
 */
(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;

  var token = script.getAttribute('data-token');
  if (!token) {
    console.warn('[Boltcall] Missing data-token attribute');
    return;
  }

  // Config endpoint — works on both tryboltcall.com (Netlify) and localhost
  var host = script.src.replace(/\/embed\.js.*$/, '');
  var configUrl = host + '/.netlify/functions/embed-config?token=' + token;

  // Fetch config and activate features
  fetch(configUrl)
    .then(function (res) { return res.json(); })
    .then(function (cfg) {
      if (cfg.error) {
        console.warn('[Boltcall] Config error:', cfg.error);
        return;
      }
      if (cfg.chatbot) initChatbot(cfg.chatbot);
      if (cfg.speed_to_lead) initSpeedToLead(cfg.speed_to_lead, cfg.workspace_id);
      if (cfg.reputation) initReputation(cfg.reputation);
    })
    .catch(function (err) {
      console.warn('[Boltcall] Failed to load config:', err);
    });

  // ── Chatbot (Retell Widget) ──
  function initChatbot(config) {
    if (!config.retell_agent_id) return;

    var s = document.createElement('script');
    s.id = 'retell-widget';
    s.src = 'https://dashboard.retellai.com/retell-widget.js';
    s.setAttribute('data-agent-id', config.retell_agent_id);
    if (config.retell_public_key) s.setAttribute('data-public-key', config.retell_public_key);
    if (config.color) s.setAttribute('data-color', config.color);
    s.setAttribute('data-position', config.position || 'bottom-right');
    if (config.greeting) s.setAttribute('data-start-message', config.greeting);
    document.body.appendChild(s);
  }

  // ── Speed to Lead (Form Interception) ──
  function initSpeedToLead(config, workspaceId) {
    var webhookUrl = config.webhook_url;
    if (!webhookUrl) return;

    var selector = config.form_selector || 'form';

    // Watch for forms (including dynamically added ones)
    function attachToForms() {
      var forms = document.querySelectorAll(selector);
      forms.forEach(function (form) {
        if (form.dataset.boltcallBound) return;
        form.dataset.boltcallBound = 'true';

        form.addEventListener('submit', function () {
          var formData = new FormData(form);
          var data = { workspace_id: workspaceId, source_url: window.location.href, fields: {} };

          formData.forEach(function (value, key) {
            // Skip sensitive fields
            if (/password|card|cvv|ssn|credit/i.test(key)) return;
            data.fields[key] = value;
          });

          // Fire-and-forget POST to webhook
          navigator.sendBeacon(webhookUrl, JSON.stringify(data));
        });
      });
    }

    // Attach now and observe for new forms
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachToForms);
    } else {
      attachToForms();
    }

    // Watch for dynamically added forms
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length) {
          attachToForms();
          break;
        }
      }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  // ── Reputation Manager (Review Popup) ──
  function initReputation(config) {
    if (!config.google_review_url) return;

    var triggerType = config.trigger || 'delay';
    var delayMs = (config.delay_seconds || 30) * 1000;
    var popupText = config.popup_text || 'Enjoying our service? Leave us a Google review!';
    var buttonText = config.button_text || 'Leave a Review';

    function showPopup() {
      // Don't show if already dismissed this session
      if (sessionStorage.getItem('boltcall_review_dismissed')) return;

      var overlay = document.createElement('div');
      overlay.id = 'boltcall-review-popup';
      overlay.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:#fff;border-radius:16px;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,0.15);max-width:320px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;animation:boltcallSlideIn 0.3s ease';

      overlay.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">' +
          '<span style="font-size:24px">⭐</span>' +
          '<button id="boltcall-review-close" style="background:none;border:none;font-size:18px;cursor:pointer;color:#999">✕</button>' +
        '</div>' +
        '<p style="margin:0 0 16px;color:#333;font-size:15px;line-height:1.4">' + popupText + '</p>' +
        '<a href="' + config.google_review_url + '" target="_blank" rel="noopener" style="display:block;text-align:center;background:#4285F4;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">' + buttonText + '</a>';

      // Add slide-in animation
      var style = document.createElement('style');
      style.textContent = '@keyframes boltcallSlideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}';
      document.head.appendChild(style);

      document.body.appendChild(overlay);

      document.getElementById('boltcall-review-close').addEventListener('click', function () {
        overlay.remove();
        sessionStorage.setItem('boltcall_review_dismissed', '1');
      });
    }

    if (triggerType === 'delay') {
      setTimeout(showPopup, delayMs);
    } else if (triggerType === 'scroll') {
      var triggered = false;
      window.addEventListener('scroll', function () {
        if (!triggered && (window.scrollY + window.innerHeight) >= document.body.scrollHeight * 0.7) {
          triggered = true;
          showPopup();
        }
      });
    } else if (triggerType === 'exit') {
      document.addEventListener('mouseout', function (e) {
        if (e.clientY <= 0) showPopup();
      }, { once: true });
    }
  }
})();
