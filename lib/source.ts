import { loader } from 'fumadocs-core/source';
import { welcome, helpCenter, troubleshooting, apiReference } from '@/.source/server';

export const welcomeSource = loader({
  baseUrl: '/welcome',
  source: welcome.toFumadocsSource(),
});

export const helpCenterSource = loader({
  baseUrl: '/help-center',
  source: helpCenter.toFumadocsSource(),
});

export const troubleshootingSource = loader({
  baseUrl: '/troubleshooting',
  source: troubleshooting.toFumadocsSource(),
});

export const apiReferenceSource = loader({
  baseUrl: '/api-reference',
  source: apiReference.toFumadocsSource(),
});