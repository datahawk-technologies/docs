/* DataHawk browser telemetry. Config is public; never supply a personal API key. */
(function (w, d) {
  'use strict';
  if (w.datahawkTelemetry) return;
  var config = w.__DATAHAWK_POSTHOG__ || {};
  var hosts = ['datahawk.co', 'www.datahawk.co', 'analytics.datahawk.co', 'sherlock.datahawk.co', 'docs.datahawk.co'];
  var enabled = config.enabled === true && hosts.indexOf(w.location.hostname) !== -1;
  function identityEpoch() {
    return (d.cookie || '').split('; ').find(function (part) { return part.indexOf('dh_ph_identity_epoch=') === 0; }) || '';
  }
  var epoch = identityEpoch();
  function resetIdentity(ph) {
    ph.reset();
    d.cookie = 'dh_ph_identity_epoch=' + Date.now() + '-' + Math.random().toString(36).slice(2) + '; Path=/; Domain=datahawk.co; Secure; SameSite=Lax; Max-Age=86400';
    epoch = identityEpoch();
  }
  function refreshChangedIdentity() { if (enabled && identityEpoch() !== epoch) w.location.reload(); }
  w.addEventListener('focus', refreshChangedIdentity);
  w.addEventListener('pageshow', refreshChangedIdentity);
  var campaign = {};
  var firstCampaign = {};
  var params = new URLSearchParams(w.location.search);
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
    var value = params.get(key);
    if (value) { campaign[key] = value.slice(0, 200); firstCampaign['$initial_' + key] = value.slice(0, 200); }
  });
  function cleanUrl(value) {
    try { var url = new URL(value, w.location.origin); return url.origin + url.pathname; } catch (_) { return ''; }
  }
  var pending = [];
  function safe(fn) {
    if (!enabled) return;
    if (!w.datahawkTelemetry.ready) { pending.push(fn); return; }
    try { fn(w.posthog); } catch (_) { /* Analytics cannot break the product. */ }
  }
  w.datahawkTelemetry = {
    capture: function (name, properties) { safe(function (ph) { ph.capture(name, properties || {}); }); },
    identify: function (id, workspaceId) { safe(function (ph) {
      if (ph.get_distinct_id && ph.get_property && ph.get_property('$user_id') && ph.get_distinct_id() !== String(id)) resetIdentity(ph);
      var latest = {}, initial = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
        var last = ph.get_property(key), first = ph.get_property('$initial_' + key);
        if (last) latest[key] = last;
        if (first) initial['$initial_' + key] = first;
      });
      ph.identify(String(id), latest, initial);
      ph.register({ is_impersonating: String(id).indexOf("impersonation:") === 0 });
      ph.resetGroups();
      if (workspaceId != null) ph.group('workspace', String(workspaceId));
    }); },
    reset: function () { safe(function (ph) { resetIdentity(ph); }); },
    visibleError: function (code) { safe(function (ph) {
      ph.captureException(new Error(code), { user_visible: true, error_code: code });
    }); }
  };
  if (!enabled || !/^phc_/.test(config.token || '') || !config.host) return;
  if (w.posthog && w.posthog.__loaded) { console.warn('Remove the legacy PostHog/GTM initializer before enabling direct telemetry.'); return; }
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="ki Ci init qi Hi pr ji zi Di capture calculateEventProperties Qi register register_once register_for_session unregister unregister_for_session Ki getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Xi identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty Ji Gi createPersonProfile setInternalOrTestUser Yi Ai rn opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Vi debug mr it getPageViewId captureTraceFeedback captureTraceMetric Oi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  w.addEventListener('datahawk:user-visible-error', function (event) {
    var code = event.detail && event.detail.code;
    if (typeof code === 'string' && /^[a-z_]{1,80}$/.test(code)) w.datahawkTelemetry.visibleError(code);
  });
  if (config.application === 'website') {
    var reportedForms = new WeakSet();
    new MutationObserver(function () {
      d.querySelectorAll('.elementor-message-danger').forEach(function (node) {
        if (node.getClientRects().length && !reportedForms.has(node)) {
          reportedForms.add(node);
          w.datahawkTelemetry.visibleError('website_form_failed');
        }
      });
    }).observe(d.documentElement, { childList: true, subtree: true });
  }
  w.posthog.init(config.token, {
    api_host: config.host,
    defaults: '2026-01-30',
    persistence: 'cookie',
    cross_subdomain_cookie: true,
    secure_cookie: true,
    person_profiles: 'identified_only',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    autocapture: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    capture_performance: { web_vitals: true },
    capture_exceptions: false,
    enable_recording_console_log: false,
    session_recording: { maskAllInputs: true, maskTextSelector: '*' },
    before_send: function (event) {
      if (identityEpoch() !== epoch) return null;
      if (!event || (event.event === '$exception' && event.properties.user_visible !== true)) return null;
      [event.properties, event.properties.$set, event.properties.$set_once].forEach(function (props) {
        Object.keys(props || {}).forEach(function (key) {
          if (/(url|referrer)$/i.test(key) && typeof props[key] === 'string') props[key] = cleanUrl(props[key]);
        });
      });
      event.properties.application = config.application;
      event.properties.environment = 'production';
      event.properties.event_schema_version = event.properties.event_schema_version || 1;
      event.properties.event_origin = 'frontend';
      return event;
    },
    loaded: function (ph) {
      ph.register(campaign);
      ph.register_once(firstCampaign);
      w.datahawkTelemetry.ready = true;
      pending.splice(0).forEach(safe);
      w.dispatchEvent(new Event('datahawk:telemetry-ready'));
    }
  });
})(window, document);
