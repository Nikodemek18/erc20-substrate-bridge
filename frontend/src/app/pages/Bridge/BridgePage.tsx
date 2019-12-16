import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import { Grid, Paper, Tabs, Tab, Box } from 'components';
import { EthereumToSubstrate, SubstrateToEthereum } from 'features/tokenTransfer';
import { Messages } from 'features/transfersHistory';

import { routes } from '../../routes';

type SourceChain = 'ethereum' | 'substrate';

const viewIndexBySourceChain: Record<SourceChain, number> = {
  ethereum: 0,
  substrate: 1,
};

function BridgePage(props: RouteComponentProps<{ sourceChain: SourceChain }>) {
  const { match } = props;
  const { sourceChain } = match.params;

  const currentTabIndex = viewIndexBySourceChain[sourceChain] || 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <Tabs
            value={currentTabIndex}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab
              label="Ethereum to Substrate"
              component={Link}
              to={routes.bridge.sourceChain.getRedirectPath({ sourceChain: 'ethereum' })}
            />
            <Tab
              label="Substrate to Ethereum"
              component={Link}
              to={routes.bridge.sourceChain.getRedirectPath({ sourceChain: 'substrate' })}
            />
          </Tabs>
        </Paper>
        <SwipeableViews index={currentTabIndex}>
          <Box p={2}>
            <EthereumToSubstrate />
          </Box>
          <Box p={2}>
            <SubstrateToEthereum />
          </Box>
        </SwipeableViews>
      </Grid>
      <Grid item xs={12}>
        <Messages />
      </Grid>
    </Grid>
  );
}

export { BridgePage };
