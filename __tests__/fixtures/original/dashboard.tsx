import * as React from 'react';
import { BEM } from '@redneckz/react-bem-helper';

import { usePluginState } from '../store';
import { PluginCard } from './plugin-card';
import { NoPluginsStub } from './no-plugins-stub';
import { CoverageSection, TestsSection, RisksSection, TestsToRunSection } from './sections';
import { Agent } from '../../../types/agent';

import styles from './dashboard.module.scss';

interface Props {
  className?: string;
  agent: Agent;
}

const dashboard = BEM(styles);

export const Dashboard = dashboard(({ className, agent }: Props) => {
  const { id: agentId, plugins = [] } = agent;
  const {
    buildVersion: { id: buildVersion },
  } = usePluginState();

  return (
    <div className={className}>
      <Header>Dashboard</Header>
      <Content>
        {plugins.length > 0 ? (
          <>
            <PluginCard
              label="TEST-TO-CODE MAPPING"
              pluginLink={`/full-page/${agentId}/${buildVersion}/test-to-code-mapping/dashboard`}
            >
              <CoverageSection />
              <TestsSection />
              <RisksSection />
              <TestsToRunSection />
            </PluginCard>
          </>
        ) : (
          <NoPluginsStub agent={agent} />
        )}
      </Content>
    </div>
  );
});

const Header = dashboard.header('div');
const Content = dashboard.content('div');
