import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, Text} from 'react-native';

import {
  Passkeys,
  connect,
  signMessage,
  signTransaction,
  exportPrivateKey,
  shareWallet,
} from '@passkeys/react-native';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [_, setAddresses] = useState();
  const [credentialId, setCredentialId] = useState();

  const disabled = loading || Boolean(errorMessage);

  return (
    <SafeAreaView style={styles.container}>
      {!credentialId && (
        <TouchableOpacity
          disabled={disabled}
          onPress={async () => {
            try {
              const {addresses, credentialId: id} = await connect();
              setAddresses(addresses);
              setCredentialId(id);
              console.log('addresses', addresses);
            } catch (error) {
              console.error(error);
            }
          }}>
          <Text>Connect</Text>
        </TouchableOpacity>
      )}
      {credentialId && (
        <TouchableOpacity
          disabled={disabled}
          onPress={async () => {
            try {
              const signedMessageResponse = await signMessage({
                message: {
                  rawMessage: Buffer.from('Hello World!'),
                },
                baseAssetName: 'ethereum',
                credentialId,
              });
              console.log('signedMessageResponse', signedMessageResponse);
            } catch (error) {
              console.error(error);
            }
          }}>
          <Text>Sign Message</Text>
        </TouchableOpacity>
      )}
      {credentialId && (
        <TouchableOpacity
          disabled={disabled}
          onPress={async () => {
            try {
              const signedMessageResponse = await signMessage({
                message: {
                  EIP712Message: {
                    types: {
                      EIP712Domain: [
                        {name: 'name', type: 'string'},
                        {name: 'version', type: 'string'},
                        {name: 'chainId', type: 'uint256'},
                        {name: 'verifyingContract', type: 'address'},
                      ],
                      DummyType: [{name: 'name', type: 'string'}],
                    },
                    primaryType: 'DummyType',
                    domain: {
                      name: 'Passkeys Network',
                      version: '1',
                      chainId: 1,
                      verifyingContract:
                        '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
                    },
                    message: {
                      name: 'Fred',
                    },
                  },
                },
                baseAssetName: 'ethereum',
                credentialId,
              });
              console.log('signedMessageResponse', signedMessageResponse);
            } catch (error) {
              console.error(error);
            }
          }}>
          <Text>Sign EIP712 Message</Text>
        </TouchableOpacity>
      )}
      {credentialId && (
        <TouchableOpacity
          disabled={disabled}
          onPress={async () => {
            try {
              const signTransactionResponse = await signTransaction({
                transaction: {
                  txData: {
                    transactionBuffer: Buffer.from(
                      'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEDlQMu5tnOGTuT6craZOCkndrjA9o2EJb1rBw/ohlcpypy8Z7Z8rsF8SRaO8FE7vKMoIjCMnrsYrINFR5JNNf2tAbd9uHXZaGT2cvhRs7reawctIXtX1s3kTqM9YV+/wCppgV9A6KWVpt6hEMng2GqzikT9gsGmsvUzYWZIQ6KoPcBAgMBAQAJA0BCDwAAAAAA',
                      'base64',
                    ),
                  },
                  txMeta: Object.create(null),
                },
                baseAssetName: 'solana',
                credentialId,
              });
              console.log('signTransactionResponse', signTransactionResponse);
            } catch (error) {
              console.error(error);
            }
          }}>
          <Text>Sign Transaction</Text>
        </TouchableOpacity>
      )}
      {credentialId && (
        <TouchableOpacity
          disabled={disabled}
          onPress={async () => {
            try {
              const exportPrivateKeyResponse = await exportPrivateKey({
                assetName: 'solana',
                credentialId,
              });
              console.log('exportPrivateKeyResponse', exportPrivateKeyResponse);
            } catch (error) {
              console.error(error);
            }
          }}>
          <Text>Export Private Key</Text>
        </TouchableOpacity>
      )}
      {credentialId && (
        <TouchableOpacity
          disabled={disabled}
          onPress={async () => {
            try {
              const shareWalletResponse = await shareWallet({
                credentialId,
              });
              console.log('shareWalletResponse', shareWalletResponse);
            } catch (error) {
              console.error(error);
            }
          }}>
          <Text>Share Wallet</Text>
        </TouchableOpacity>
      )}
      {errorMessage && <Text style={{color: 'red'}}>{errorMessage}</Text>}

      <Passkeys
        onLoadingUpdate={event => {
          const {isLoading, loadingErrorMessage} = event?.nativeEvent || {};
          setLoading(isLoading);
          setErrorMessage(loadingErrorMessage);
        }}
        appId="test"
        url="https://relay-d.passkeys.network"
        style={styles.passkeys}
      />
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
