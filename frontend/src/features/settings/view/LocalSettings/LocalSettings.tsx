import React from 'react';
import { Form } from 'react-final-form';
import * as colors from '@material-ui/core/colors';

import { ConnectionStatus } from 'services/api/types';
import { useApi } from 'services/api';
import { useTranslate, tKeys as tKeysAll } from 'services/i18n';
import { TextInputField } from 'components/form';
import { Grid, Button, Typography, Hint, Loading, Chip } from 'components';
import { SUBSTRATE_NODE_URL } from 'env';
import { validateNodeUrl } from 'utils/validators';
import { useSubscribable } from 'utils/react';

import { useStyles } from './LocalSettings.style';

interface IFormData {
  nodeUrl: string;
}

const fieldNames: { [K in keyof IFormData]: K } = {
  nodeUrl: 'nodeUrl',
};

const backgrounds: Record<ConnectionStatus, string> = {
  CONNECTING: colors.yellow[500],
  READY: colors.lightGreen[500],
  ERROR: colors.red[500],
};

const statuses: Record<ConnectionStatus, string> = {
  CONNECTING: 'connecting',
  READY: 'ready',
  ERROR: 'error',
};

const tKeys = tKeysAll.features.localSettings;

function LocalSettings() {
  const { t } = useTranslate();
  const classes = useStyles();
  const api = useApi();

  const [connectionStatus, connectionStatusMeta] = useSubscribable(
    () => api.getConnectionStatus$(),
    [],
  );

  const initialValues = React.useMemo<IFormData>(
    () => ({
      nodeUrl: api.getNodeUrl() || SUBSTRATE_NODE_URL,
    }),
    [],
  );

  const onSubmit = React.useCallback(
    (values: IFormData) => {
      const { nodeUrl } = values;
      api.setNodeUrl(nodeUrl);
      document.location.reload();
    },
    [api],
  );

  const handleResetButtonClick = React.useCallback(() => {
    api.setNodeUrl(SUBSTRATE_NODE_URL);
    document.location.reload();
  }, [api]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      subscription={{ submitting: true, submitError: true }}
    >
      {({ handleSubmit, submitting, submitError }): React.ReactElement<{}> => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {connectionStatus && (
                <Loading meta={connectionStatusMeta}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography>{t(tKeys.connectionStatus.getKey())}</Typography>
                    </Grid>
                    <Grid item>
                      <Chip
                        style={{
                          background: backgrounds[connectionStatus.status],
                          color: '#fff',
                        }}
                        label={statuses[connectionStatus.status].toUpperCase()}
                      />
                    </Grid>
                  </Grid>
                </Loading>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextInputField
                validate={validateNodeUrl}
                label="Enter node url"
                variant="outlined"
                name={fieldNames.nodeUrl}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <Button color="primary" onClick={handleResetButtonClick}>
                      {t(tKeys.resetButton.getKey())}
                    </Button>
                  ),
                  classes: {
                    input: classes.input,
                  },
                }}
                fullWidth
              />
            </Grid>
            {!!submitError && (
              <Grid item xs={12}>
                <Hint>
                  <Typography color="error">{submitError}</Typography>
                </Hint>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                {t(tKeys.saveButton.getKey())}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Form>
  );
}

export { LocalSettings };
