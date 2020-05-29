/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import { EuiButton, EuiCode, EuiPageHeader, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui';
import { AuthenticationSequencePanel } from './authentication-sequence-panel';
import { AuthorizationPanel } from './authorization-panel';
import { API_ENDPOINT_SECURITYCONFIG } from '../../constants';
import { AppDependencies } from '../../../types';

function renderInstructionView() {
  return (
    <>
      <EuiTitle size="l">
        <h1>Authentication and authorization</h1>
      </EuiTitle>

      <EuiSpacer size="xxl" />

      <EuiText textAlign="center">
        <h2>You have not set up authentication and authorization</h2>
      </EuiText>

      <EuiText
        textAlign="center"
        size="xs"
        color="subdued"
        style={{ marginLeft: 500, marginRight: 500 }}
      >
        In order to use Security plugin, you must decide on authentication <EuiCode>authc</EuiCode>{' '}
        and authorization backends <EuiCode>authz</EuiCode>. Use{' '}
        <EuiCode>plugins/opendistro_security/securityconfig/config.yml</EuiCode> to define how to
        retrieve and verify the user credentials, and how to fetch additional roles from backend
        system if needed.
      </EuiText>

      <EuiSpacer />

      <div style={{ textAlign: 'center' }}>
        <EuiButton iconType="popout" iconSide="right" fill size="s" fullWidth={false}>
          Create config.yml
        </EuiButton>
      </div>
    </>
  );
}

export function AuthView(props: AppDependencies) {
  const [authentication, setAuthentication] = useState([]);
  const [authorization, setAuthorization] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawSecurityConfig = await props.coreStart.http.get(API_ENDPOINT_SECURITYCONFIG);
        const dynamic = rawSecurityConfig.data.config.dynamic;

        setAuthentication(dynamic.authc);
        setAuthorization(dynamic.authz);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, [props.coreStart.http]);

  if (!authentication) {
    return renderInstructionView();
  }

  return (
    <>
      <EuiPageHeader>
        <EuiTitle size="l">
          <h1>Authentication and authorization</h1>
        </EuiTitle>
        <EuiButton iconType="popout" iconSide="right">
          Manage via config.yml
        </EuiButton>
      </EuiPageHeader>
      <AuthenticationSequencePanel authc={authentication} />
      <EuiSpacer size="m" />
      <AuthorizationPanel authz={authorization} />
    </>
  );
}
