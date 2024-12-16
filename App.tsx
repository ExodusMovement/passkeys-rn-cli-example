import { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';

import {
  Passkeys,
  connect,
  signMessage,
  signTransaction,
} from '@passkeys/react-native';

export default function App() {
  const [_, setAddresses] = useState();
  const [credentialId, setCredentialId] = useState();

  return (
    <SafeAreaView style={styles.container}>
      {!credentialId && (
        <TouchableOpacity
          onPress={async () => {
            try {
              const { addresses, credentialId: id } = await connect();
              setAddresses(addresses);
              setCredentialId(id);
              console.log('addresses', addresses);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <Text>Connect</Text>
        </TouchableOpacity>
      )}
      {credentialId && (
        <TouchableOpacity
          onPress={async () => {
            try {
              const signedMessageResponse = await signMessage({
                message: {
                  rawMessage: Buffer.from('Hello World!'),
                },
                baseAssetName: 'ethereum',
                credentialId,
                metadata: { title: 'Sign Message' },
              });
              console.log('signedMessageResponse', signedMessageResponse);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <Text>Sign Message</Text>
        </TouchableOpacity>
      )}
      {credentialId && (
        <TouchableOpacity
          onPress={async () => {
            try {
              const signTransactionResponse = await signTransaction({
                transaction: {
                  txData: {
                    transactionBuffer: Buffer.from(
                      'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDlQMu5tnOGTuT6craZOCkndrjA9o2EJb1rBw/ohlcpypy8Z7Z8rsF8SRaO8FE7vKMoIjCMnrsYrINFR5JNNf2tAbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCppgV9A6KWVpt6hEMng2GqzikT9gsGmsvUzYWZIQ6KoPcBAgMBAQAJA0BCDwAAAAAA',
                      'base64'
                    ),
                  },
                  txMeta: Object.create(null),
                },
                baseAssetName: 'solana',
                credentialId,
                metadata: { title: 'Sign Transaction' },
              });
              console.log('signTransactionResponse', signTransactionResponse);
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <Text>Sign Transaction</Text>
        </TouchableOpacity>
      )}

      <Passkeys style={styles.passkeys} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: '100%',
    height: '100%',
    marginVertical: 20,
  },
  passkeys: {
    width: 1,
    height: 1,
    opacity: 0,
  },
});
