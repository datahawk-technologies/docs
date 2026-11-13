/* Shared, SDK-independent acquisition context. Never stores identity, query strings or fragments. */
(function (w, d) {
  'use strict';
  var utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var keys = utms.concat(['referring_domain', 'landing_url', 'timestamp', 'channel']);
  function read(touch) {
    try {
      var entry = (d.cookie || '').split('; ').find(function (s) { return s.indexOf('dh_attribution_' + touch + '=') === 0; });
      var value = JSON.parse(decodeURIComponent(entry.slice(entry.indexOf('=') + 1)));
      var result = {};
      keys.forEach(function (key) { if (typeof value[key] === 'string') result[key] = value[key].slice(0, 200); });
      return result;
    } catch (_) { return {}; }
  }
  function write(touch, value) {
    try {
      value = Object.assign({}, value);
      var encoded = encodeURIComponent(JSON.stringify(value));
      // Hard byte budget, including percent-encoding: leave room for auth and other site cookies.
      while (encoded.length > 640) {
        var largest = utms.concat(['landing_url', 'referring_domain']).filter(function (key) { return value[key]; })
          .sort(function (a, b) { return encodeURIComponent(value[b]).length - encodeURIComponent(value[a]).length; })[0];
        if (!largest) return;
        var chars = Array.from(value[largest]);
        value[largest] = chars.slice(0, Math.floor(chars.length / 2)).join('');
        encoded = encodeURIComponent(JSON.stringify(value));
      }
      d.cookie = 'dh_attribution_' + touch + '=' + encoded + '; Path=/; Domain=datahawk.co; Secure; SameSite=Lax; Max-Age=15552000';
    } catch (_) { /* Disabled storage. */ }
  }
  function properties() {
    var result = {};
    ['first', 'latest'].forEach(function (touch) {
      var value = read(touch);
      Object.keys(value).forEach(function (key) { result['attribution_' + touch + '_' + key] = value[key]; });
    });
    return result;
  }
  w.datahawkAttribution = {
    properties: properties,
    collect: function () {
      var current = {}, params = new URLSearchParams(w.location.search);
      utms.forEach(function (key) {
        var value = params.get(key);
        if (value) {
          value = Array.from(value).slice(0, 80).join('');
          while (encodeURIComponent(value).length > 240) value = Array.from(value).slice(0, -1).join('');
          current[key] = value;
        }
      });
      var referral = '';
      try { referral = new URL(d.referrer).hostname; } catch (_) { /* Direct visit. */ }
      var internal = referral === 'datahawk.co' || referral.endsWith('.datahawk.co');
      // Provider redirects are continuations, not new acquisition touches.
      var authReturn = /^(signup|signin)$/.test(params.get('origin') || '');
      var authProvider = /^(accounts\.google\.com|login\.microsoftonline\.com|login\.live\.com)$/.test(referral)
        || (authReturn && /(^|\.)linkedin\.com$/.test(referral));
      var campaign = Object.keys(current).length > 0;
      // Explicit empty values keep a direct first touch from acquiring UTMs on a later device.
      utms.forEach(function (key) { if (!current[key]) current[key] = ''; });
      current.referring_domain = referral && !internal && !authProvider ? referral : '$direct';
      current.channel = campaign ? 'campaign' : current.referring_domain !== '$direct' ? 'referral' : 'direct';
      current.landing_url = (w.location.origin + w.location.pathname).slice(0, 200);
      current.timestamp = new Date().toISOString();
      // Rewrite pre-1.2.1 cookies into the bounded format once a page can load.
      ['first', 'latest'].forEach(function (touch) {
        var saved = read(touch);
        if (saved.timestamp && encodeURIComponent(JSON.stringify(saved)).length > 640) write(touch, saved);
      });
      if (!read('first').timestamp) write('first', current);
      if (!read('latest').timestamp || campaign || current.channel === 'referral') write('latest', current);
      return properties();
    }
  };
})(window, document);

/* DataHawk browser telemetry. Config is public; never supply a personal API key. */
(function (w, d) {
  'use strict';
  if (w.datahawkTelemetry) return;
  var config = w.__DATAHAWK_POSTHOG__ || {};
  var apiHost = config.host === 'https://eu.i.posthog.com' ? 'https://e.datahawk.co' : config.host;
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
  var attribution = enabled ? w.datahawkAttribution.collect() : {};
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
  var awaitingContext = [];
  // Page-local context: never persist the active workspace across tabs/subdomains.
  var context = { actor_type: 'anonymous', is_impersonating: false, identity_context_version: 1 };
  function eventContext() {
    var result = Object.assign({}, context);
    if (config.application !== 'analytics' || /^\/(signin|signup|signout|account|auth)(\/|$)/i.test(w.location.pathname)) delete result.workspace_id;
    return result;
  }
  function safe(fn) {
    if (!enabled) return;
    if (!w.datahawkTelemetry.ready) { pending.push(fn); return; }
    try { fn(w.posthog); } catch (_) { /* Analytics cannot break the product. */ }
  }
  w.datahawkTelemetry = {
    capture: function (name, properties) {
      var captured = Object.assign({}, properties || {}, { __dh_context: eventContext() });
      safe(function (ph) { ph.capture(name, captured); });
    },
    identify: function (id, workspaceId, effectiveUserId) {
      var actor = String(id == null ? '' : id).trim(), effective = String(effectiveUserId == null ? actor : effectiveUserId).trim();
      // Compatibility with the previous frontend while the coordinated deployment rolls out.
      if (actor.indexOf('impersonation:') === 0) { var parts = actor.split(':'); actor = parts[1]; effective = parts[2]; }
      if (!/^[1-9][0-9]*$/.test(actor) || !/^[1-9][0-9]*$/.test(effective)) return;
      context = { user_id: actor, effective_user_id: effective, actor_type: 'user', is_impersonating: actor !== effective, identity_context_version: 1 };
      if (/^[1-9][0-9]*$/.test(String(workspaceId))) context.workspace_id = String(workspaceId);
      if (actor !== effective) context.impersonator_user_id = actor;
      id = actor;
      var identifiedContext = Object.assign({}, context);
      safe(function (ph) {
      if (ph.get_distinct_id && ph.get_property && ph.get_property('$user_id') && ph.get_distinct_id() !== String(id)) resetIdentity(ph);
      var latest = {}, initial = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
        var last = ph.get_property(key), first = ph.get_property('$initial_' + key);
        if (last) latest[key] = last;
        if (first) initial['$initial_' + key] = first;
      });
      Object.keys(attribution).forEach(function (key) { (key.indexOf('attribution_first_') === 0 ? initial : latest)[key] = attribution[key]; });
      ph.identify(String(id), identifiedContext.is_impersonating ? {} : latest, identifiedContext.is_impersonating ? {} : initial);
      // Clear legacy persisted context; current events receive page-local values below.
      ['workspace_id', 'user_id', 'effective_user_id', 'impersonator_user_id', 'is_impersonating'].forEach(function (key) { if (ph.unregister) ph.unregister(key); });
      ph.resetGroups();
      awaitingContext.splice(0).forEach(function (event) {
        delete event.properties.distinct_id;
        delete event.properties.$user_id;
        event.properties.__dh_context = identifiedContext;
        ph.capture(event.event, event.properties, { timestamp: event.timestamp });
      });

    }); },
    reset: function () { awaitingContext = []; context = { actor_type: 'anonymous', is_impersonating: false, identity_context_version: 1 }; safe(function (ph) { resetIdentity(ph); }); },
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
    api_host: apiHost,
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    persistence: 'localStorage+cookie',
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
    session_recording: { maskAllInputs: true, maskTextSelector: '*', maskAllElementAttributes: true },
    before_send: function (event) {
      if (identityEpoch() !== epoch) return null;
      if (!event || (event.event === '$exception' && event.properties.user_visible !== true)) return null;
      // Hold automatic workspace-page events until trusted authentication resolves.
      // Public/auth pages remain anonymous and can later link through identify.
      if (config.application === 'analytics' && !context.user_id
          && !/^\/(signin|signup|signout|account|auth)(\/|$)/i.test(w.location.pathname)
          && /^\$(pageview|pageleave|autocapture|web_vitals|exception|feature_flag_called)$/.test(event.event)) {
        if (awaitingContext.length < 100) awaitingContext.push(event);
        return null;
      }
      [event.properties, event.properties.$set, event.properties.$set_once].forEach(function (props) {
        Object.keys(props || {}).forEach(function (key) {
          if (/(url|referrer)$/i.test(key) && typeof props[key] === 'string') props[key] = cleanUrl(props[key]);
        });
      });
      ['workspace_id', 'user_id', 'effective_user_id', 'impersonator_user_id', '$groups', 'is_impersonating'].forEach(function (key) { delete event.properties[key]; });
      var capturedContext = event.properties.__dh_context || eventContext();
      delete event.properties.__dh_context;
      Object.assign(event.properties, capturedContext);
      if (/^(signin|signup|signout|mfa)_/.test(event.event)) delete event.properties.workspace_id;
      if (!capturedContext.user_id && event.properties.$user_id) {
        event.properties.user_id = String(event.properties.$user_id);
        event.properties.effective_user_id = String(event.properties.$user_id);
        event.properties.actor_type = 'user';
      }
      Object.assign(event.properties, attribution);
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
