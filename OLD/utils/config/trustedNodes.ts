import { NemConfig, BootstrapConfig, NodeMetadata, NodesHttpConfig } from '../nem';

import { ServerConfig, NetworkTypes } from 'nem-library';

interface TrustedConfig {
  testnetNodes: ServerConfig[];
  mainnetNodes: ServerConfig[];
  trustedNodesList: any;
}

export default function(nemConfig: NemConfig) {
  return {
    // TODO: to nem interface
    testnetNodes: [
      { protocol: 'http', domain: '104.128.226.60', port: 7890 } as ServerConfig,
      // TODO: more nodes
    ],
    mainnetNodes: [
      { protocol: 'http', domain: '88.99.192.82', port: 7890 } as ServerConfig,
      // TODO: more nodes
    ],
    get trustedNodesList(): ServerConfig[] {
      let nodes: ServerConfig[] = [];
      if (nemConfig.networkType === NetworkTypes.TEST_NET) {
        nodes = this.testnetNodes;
      } else if (nemConfig.networkType === NetworkTypes.MAIN_NET) {
        nodes = this.mainnetNodes;
      } else {
        throw new Error('Not bootstrapped');
      }
      return nodes;
    },
  } as TrustedConfig;
}
