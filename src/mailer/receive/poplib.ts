const net = require('net'),
  tls = require('tls'),
  util = require('util'),
  crypto = require('crypto'),
  events = require('events');

class POP3Client extends events.EventEmitter {
  response = null;
  checkResp = true;
  bufferedData = null;
  state = 0;
  locked = false;
  multiline = false;
  socket = null;
  tlssock = null;

  constructor(port, host, options) {
    super();
    if (options === undefined) options = {};

    // Optional constructor arguments
    const enabletls =
      options.enabletls !== undefined ? options.enabletls : false;
    const ignoretlserrs =
      options.ignoretlserrs !== undefined ? options.ignoretlserrs : false;
    const debug = options.debug || false;

    const tlsDirectOpts = options.tlsopts !== undefined ? options.tlsopts : {};

    // Public variables follow
    this.data = {
      host: host,
      port: port,
      banner: '',
      stls: false,
      apop: false,
      username: '',
      tls: enabletls,
      ignoretlserrs: ignoretlserrs,
    };

    // Privileged methods follow
    this.setCallback = (cb) => {
      this.callback = cb;
    };
    this.getCallback = () => {
      return this.callback;
    };
    this.setState = (val) => {
      this.state = val;
    };
    this.getState = () => {
      return this.state;
    };
    this.setLocked = (val) => {
      this.locked = val;
    };
    this.getLocked = () => {
      return this.locked;
    };
    this.setMultiline = (val) => {
      this.multiline = val;
    };
    this.getMultiline = () => {
      return this.multiline;
    };

    // Writes to remote server socket
    this.write = (command, argument) => {
      let text = command;

      if (argument !== undefined) text = text + ' ' + argument + '\r\n';
      else text = text + '\r\n';

      if (debug) console.log('Client: ' + util.inspect(text));

      this.socket.write(text);
    };

    // Kills the socket connection
    this.end = () => {
      this.socket.end();
    };

    // Upgrades a standard unencrypted TCP connection to use TLS
    // Liberally copied and modified from https://gist.github.com/848444
    // starttls() should be a private function, but I can't figure out
    // how to get a public prototypal method (stls) to talk to private method (starttls)
    // which references private variables without going through a privileged method
    this.starttls = (options) => {
      const s = this.socket;
      s.removeAllListeners('end');
      s.removeAllListeners('data');
      s.removeAllListeners('error');
      this.socket = null;

      const sslcontext = require('crypto').createCredentials(options);
      const pair = tls.createSecurePair(sslcontext, false);
      const pipe = (pair) => {
        pair.encrypted.pipe(s);
        s.pipe(pair.encrypted);

        pair.fd = s.fd;
        const cleartext = pair.cleartext;
        cleartext.socket = s;
        cleartext.encrypted = pair.encrypted;
        cleartext.authorized = false;

        const onerror = (e) => {
          if (cleartext._controlReleased) cleartext.emit('error', e);
        }

        const onclose = () => {
          s.removeListener('error', onerror);
          s.removeListener('close', onclose);
        }

        s.on('error', onerror);
        s.on('close', onclose);
        return cleartext;
      };
      const cleartext = pipe(pair);

      pair.on('secure', () => {
        const verifyError = pair.ssl.verifyError();
        cleartext.authorized = true;

        if (verifyError) {
          cleartext.authorized = false;
          cleartext.authorizationError = verifyError;
        }

        cleartext.on('data', onData);
        cleartext.on('error', onError);
        cleartext.on('end', onEnd);
        this.socket = cleartext;
        this.getCallback()(cleartext.authorized, cleartext.authorizationError);
      });

      cleartext._controlReleased = true;
    };

    // Private methods follow
    // Event handlers follow
    const onData = (data) => {
      this.bufferedData = this.bufferedData
        ? Buffer.concat(
            [this.bufferedData, data],
            this.bufferedData.length + data.length,
          )
        : data;

      if (debug) console.log('Server: ' + util.inspect(data.toString('ascii')));

      if (this.checkResp === true) {
        if (this.bufferedData.toString('ascii', 0, 3) === '+OK') {
          this.checkResp = false;
          this.response = true;
        } else if (this.bufferedData.toString('ascii', 0, 4) === '-ERR') {
          this.checkResp = false;
          this.response = false;

          // The following is only used for SASL
        } else if (this.multiline === false) {
          this.checkResp = false;
          this.response = true;
        }
      }

      if (this.checkResp === false) {
        if (
          this.multiline === true &&
          (this.response === false ||
            this.bufferedData.toString(
              'ascii',
              this.bufferedData.length - 5,
            ) === '\r\n.\r\n')
        ) {
          // Make a copy to avoid race conditions
          const responseCopy = this.response;
          //var bufferedDataCopy = bufferedData;
          const bufferedDataCopy = this.bufferedData;

          this.response = null;
          this.checkResp = true;
          this.multiline = false;
          this.bufferedData = null;

          this.callback(responseCopy, bufferedDataCopy.toString('utf-8'));
        } else if (this.multiline === false) {
          // Make a copy to avoid race conditions
          const responseCopy = this.response;
          //var bufferedDataCopy = bufferedData;
          const bufferedDataCopy = this.bufferedData;

          this.response = null;
          this.checkResp = true;
          this.multiline = false;
          this.bufferedData = null;

          this.callback(responseCopy, bufferedDataCopy.toString('utf-8'));
        }
      }
    };

    const onError = (err) => {
      if (err.errno === 111) this.emit('connect', false, err);
      else this.emit('error', err);
    };

    const onEnd = (data) => {
      this.setState(0);
      this.socket = null;
    };

    const onClose = () => {
      this.emit('close');
    };

    // Constructor code follows
    // Set up EventEmitter constructor function
    events.EventEmitter.call(this);

    // Remote end socket
    if (enabletls === true) {
      this.tlssock = tls.connect(
        {
          host: host,
          port: port,
          rejectUnauthorized: !this.data.ignoretlserrs,
        },
        () => {
          if (
            this.tlssock.authorized === false &&
            this.data['ignoretlserrs'] === false
          )
            this.emit('tls-error', this.tlssock.authorizationError);
        },
      );

      this.socket = this.tlssock;
    } else this.socket = new net.createConnection(port, host);

    this.callback = (resp, data) => {
      if (resp === false) {
        this.locked = false;
        this.callback = () => {};
        this.emit('connect', false, data);
      } else {
        // Checking for APOP support
        const banner = data.trim();
        const bannerComponents = banner.split(' ');

        for (let i = 0; i < bannerComponents.length; i++) {
          if (bannerComponents[i].indexOf('@') > 0) {
            this.data['apop'] = true;
            this.data['apop-timestamp'] = bannerComponents[i];
            break;
          }
        }

        this.state = 1;
        this.data['banner'] = banner;
        this.emit('connect', true, data);
      }
    };

    // Set up event handlers
    this.socket.on('data', onData);
    this.socket.on('error', onError);
    this.socket.on('end', onEnd);
    this.socket.on('close', onClose);
  }

  login(username, password) {
    if (this.getState() !== 1) this.emit('invalid-state', 'login');
    else if (this.getLocked() === true) this.emit('locked', 'login');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        if (resp === false) {
          this.setLocked(false);
          this.setCallback(() => {});
          this.emit('login', false, data);
        } else {
          this.setCallback((resp, data) => {
            this.setLocked(false);
            this.setCallback(() => {});

            if (resp !== false) this.setState(2);
            this.emit('login', resp, data);
          });

          this.setMultiline(false);
          this.write('PASS', password);
        }
      });

      this.setMultiline(false);
      this.write('USER', username);
    }
  }

  auth(type, username, password) {
    type = type.toUpperCase();
    const types = { PLAIN: 1, 'CRAM-MD5': 1 };
    let initialresp = '';

    if (this.getState() !== 1) this.emit('invalid-state', 'auth');
    else if (this.getLocked() === true) this.emit('locked', 'auth');

    if (type in types === false) {
      this.emit('auth', false, 'Invalid auth type', null);
      return;
    }

    const tlsok = () => {
      if (type === 'PLAIN') {
        initialresp =
          ' ' +
          new Buffer(
            username + '\u0000' + username + '\u0000' + password,
          ).toString('base64') +
          '=';
        this.setCallback((resp, data) => {
          if (resp !== false) this.setState(2);
          this.emit('auth', resp, data, data);
        });
      } else if (type === 'CRAM-MD5') {
        this.setCallback((resp, data) => {
          if (resp === false)
            this.emit(
              'auth',
              resp,
              'Server responded -ERR to AUTH CRAM-MD5',
              data,
            );
          else {
            const challenge = new Buffer(
              data.trim().substr(2),
              'base64',
            ).toString();
            const hmac = crypto.createHmac('md5', password);
            const response = new Buffer(
              username + ' ' + hmac.update(challenge).digest('hex'),
            ).toString('base64');

            this.setCallback((resp, data) => {
              let errmsg = null;

              if (resp !== false) this.setState(2);
              else errmsg = 'Server responded -ERR to response';

              this.emit('auth', resp, null, data);
            });

            this.write(response);
          }
        });
      }

      this.write('AUTH ' + type + initialresp);
    };

    if (this.data['tls'] === false && this.data['stls'] === false) {
      // Remove all existing STLS listeners
      this.removeAllListeners('stls');

      this.on('stls', (resp, rawdata) => {
        if (resp === false) {
          // We (optionally) ignore self signed cert errors,
          // in blatant violation of RFC 2595, Section 2.4
          if (
            this.data['ignoretlserrs'] === true &&
            rawdata === 'DEPTH_ZERO_SELF_SIGNED_CERT'
          )
            tlsok();
          else
            this.emit(
              'auth',
              false,
              'Unable to upgrade connection to STLS',
              rawdata,
            );
        } else tlsok();
      });

      this.stls();
    } else tlsok();
  }

  apop(username, password) {
    if (this.getState() !== 1) this.emit('invalid-state', 'apop');
    else if (this.getLocked() === true) this.emit('locked', 'apop');
    else if (this.data['apop'] === false)
      this.emit('apop', false, 'APOP support not detected on remote server');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp === true) this.setState(2);
        this.emit('apop', resp, data);
      });

      this.setMultiline(false);
      this.write(
        'APOP',
        username +
          ' ' +
          crypto
            .createHash('md5')
            .update(this.data['apop-timestamp'] + password)
            .digest('hex'),
      );
    }
  }

  stls() {
    if (this.getState() !== 1) this.emit('invalid-state', 'stls');
    else if (this.getLocked() === true) this.emit('locked', 'stls');
    else if (this.data['tls'] === true)
      this.emit(
        'stls',
        false,
        'Unable to execute STLS as TLS connection already established',
      );
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp === true) {
          this.setCallback((resp, data) => {
            if (
              resp === false &&
              this.data['ignoretlserrs'] === true &&
              data === 'DEPTH_ZERO_SELF_SIGNED_CERT'
            )
              resp = true;

            this.data['stls'] = true;
            this.emit('stls', resp, data);
          });

          this.starttls();
        } else this.emit('stls', false, data);
      });

      this.setMultiline(false);
      this.write('STLS');
    }
  }

  top(msgnumber, lines) {
    if (this.getState() !== 2) this.emit('invalid-state', 'top');
    else if (this.getLocked() === true) this.emit('locked', 'top');
    else {
      this.setCallback((resp, data) => {
        let returnValue = null;
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp !== false) {
          returnValue = '';
          const startOffset = data.indexOf('\r\n', 0) + 2;
          const endOffset = data.indexOf('\r\n.\r\n', 0) + 2;

          if (endOffset > startOffset)
            returnValue = data.substr(startOffset, endOffset - startOffset);
        }

        this.emit('top', resp, msgnumber, returnValue, data);
      });

      this.setMultiline(true);
      this.write('TOP', msgnumber + ' ' + lines);
    }
  }

  list(msgnumber?) {
    if (this.getState() !== 2) this.emit('invalid-state', 'list');
    else if (this.getLocked() === true) this.emit('locked', 'list');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        let returnValue = null;
        let msgcount = 0;
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp !== false) {
          returnValue = [];

          if (msgnumber !== undefined) {
            msgcount = 1;
            const listitem = data.split(' ');
            returnValue[listitem[1]] = listitem[2];
          } else {
            let offset = 0;
            let listitem: any = '';
            let newoffset = 0;
            returnValue = [];
            const startOffset = data.indexOf('\r\n', 0) + 2;
            const endOffset = data.indexOf('\r\n.\r\n', 0) + 2;

            if (endOffset > startOffset) {
              data = data.substr(startOffset, endOffset - startOffset);

              while (true) {
                if (offset > endOffset) break;

                newoffset = data.indexOf('\r\n', offset);

                if (newoffset < 0) break;

                msgcount++;
                listitem = data.substr(offset, newoffset - offset);
                listitem = listitem.split(' ');
                returnValue[listitem[0]] = listitem[1];
                offset = newoffset + 2;
              }
            }
          }
        }

        this.emit('list', resp, msgcount, msgnumber, returnValue, data);
      });

      if (msgnumber !== undefined) this.setMultiline(false);
      else this.setMultiline(true);

      this.write('LIST', msgnumber);
    }
  }

  stat() {
    if (this.getState() !== 2) this.emit('invalid-state', 'stat');
    else if (this.getLocked() === true) this.emit('locked', 'stat');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        let returnValue = null;
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp !== false) {
          const listitem = data.split(' ');
          returnValue = {
            count: listitem[1].trim(),
            octets: listitem[2].trim(),
          };
        }

        this.emit('stat', resp, returnValue, data);
      });

      this.setMultiline(false);
      this.write('STAT', undefined);
    }
  }

  uidl(msgnumber?) {
    if (this.getState() !== 2) this.emit('invalid-state', 'uidl');
    else if (this.getLocked() === true) this.emit('locked', 'uidl');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        let returnValue = null;
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp !== false) {
          returnValue = [];

          if (msgnumber !== undefined) {
            const listitem = data.split(' ');
            returnValue[listitem[1]] = listitem[2].trim();
          } else {
            let offset = 0;
            let listitem: any = '';
            let newoffset = 0;
            returnValue = [];
            const startOffset = data.indexOf('\r\n', 0) + 2;
            let endOffset = data.indexOf('\r\n.\r\n', 0) + 2;

            if (endOffset > startOffset) {
              data = data.substr(startOffset, endOffset - startOffset);
              endOffset -= startOffset;

              while (offset < endOffset) {
                newoffset = data.indexOf('\r\n', offset);
                listitem = data.substr(offset, newoffset - offset);
                listitem = listitem.split(' ');
                returnValue[listitem[0]] = listitem[1];
                offset = newoffset + 2;
              }
            }
          }
        }

        this.emit('uidl', resp, msgnumber, returnValue, data);
      });

      if (msgnumber !== undefined) this.setMultiline(false);
      else this.setMultiline(true);

      this.write('UIDL', msgnumber);
    }
  }

  retr(msgnumber) {
    if (this.getState() !== 2) this.emit('invalid-state', 'retr');
    else if (this.getLocked() === true) this.emit('locked', 'retr');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        let returnValue = null;
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp !== false) {
          const startOffset = data.indexOf('\r\n', 0) + 2;
          const endOffset = data.indexOf('\r\n.\r\n', 0);
          returnValue = data.substr(startOffset, endOffset - startOffset);
        }

        this.emit('retr', resp, msgnumber, returnValue, data);
      });

      this.setMultiline(true);
      this.write('RETR', msgnumber);
    }
  }

  dele(msgnumber) {
    if (this.getState() !== 2) this.emit('invalid-state', 'dele');
    else if (this.getLocked() === true) this.emit('locked', 'dele');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        this.setLocked(false);
        this.setCallback(() => {});
        this.emit('dele', resp, msgnumber, data);
      });

      this.setMultiline(false);
      this.write('DELE', msgnumber);
    }
  }

  noop() {
    if (this.getState() !== 2) this.emit('invalid-state', 'noop');
    else if (this.getLocked() === true) this.emit('locked', 'noop');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        this.setLocked(false);
        this.setCallback(() => {});
        this.emit('noop', resp, data);
      });

      this.setMultiline(false);
      this.write('NOOP', undefined);
    }
  }

  rset() {
    if (this.getState() !== 2) this.emit('invalid-state', 'rset');
    else if (this.getLocked() === true) this.emit('locked', 'rset');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        this.setLocked(false);
        this.setCallback(() => {});
        this.emit('rset', resp, data);
      });

      this.setMultiline(false);
      this.write('RSET', undefined);
    }
  }

  capa() {
    if (this.getState() === 0) this.emit('invalid-state', 'quit');
    else if (this.getLocked() === true) this.emit('locked', 'capa');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        let returnValue = null;
        this.setLocked(false);
        this.setCallback(() => {});

        if (resp === true) {
          const startOffset = data.indexOf('\r\n', 0) + 2;
          const endOffset = data.indexOf('\r\n.\r\n', 0);
          returnValue = data.substr(startOffset, endOffset - startOffset);
          returnValue = returnValue.split('\r\n');
        }

        this.emit('capa', resp, returnValue, data);
      });

      this.setMultiline(true);
      this.write('CAPA', undefined);
    }
  }

  quit() {
    if (this.getState() === 0) this.emit('invalid-state', 'quit');
    else if (this.getLocked() === true) this.emit('locked', 'quit');
    else {
      this.setLocked(true);
      this.setCallback((resp, data) => {
        this.setLocked(false);
        this.setCallback(() => {});

        this.end();
        this.emit('quit', resp, data);
      });

      this.setMultiline(false);
      this.write('QUIT', undefined);
    }
  }
}

// SASL AUTH implementation
// Currently supports SASL PLAIN and CRAM-MD5

export { POP3Client };
