import net from 'net'
import vorpal from 'vorpal'

const cli = vorpal()

// cli config
cli
  .delimiter('ftd-chat~$')

// connect mode
let server
let dt = new Date().toLocaleString()

cli
  .mode('connect <username> <host> <port>')
  .delimiter(' ')
  .init(function (args, callback) {
    cli._baseExitMode = cli._exitMode
    cli._exitMode = function (args) {
      return cli._baseExitMode(args)
    }
    server = net.createConnection(args, () => {
      server.write(args.username + '\n')
      const address = server.address()
      this.log(`${args.username} connected to server ${address.address}:${address.port}` + ' ' + dt)
      this.delimiter(`${args.username}:`)
      callback()
    })
    server.on('data', (data, dt) => {
      this.log(data.toString())
    })

    server
    .on('end', () => {
      this.log('${args.username} disconnected from server :(')
    })
    try {
      server.on('error', () => {
        this.log('Server terminated connection.  You...exit.')
      })
    } catch (error) {
      this.log('Bye, Felicia.')
    }
  })
  .action(function (command, callback) {
    if (command === 'exit') {
      server
        .end('goodbye \n')
      try {
        server.on('error', () => {
          this.log('Server terminated connection.  You...should exit.')
        })
      } catch (error) {
        this.log('Bye, Felicia')
      }
      callback()
    } else {
      server.write(command + '\n')
      callback()
    }
  })

export default cli
