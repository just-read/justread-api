import {
  Connection,
  ConnectionManager,
  ConnectionOptions,
  createConnection,
  getConnectionManager
} from 'typeorm';

class Database {
  connectionManager: ConnectionManager;

  constructor() {
    this.connectionManager = getConnectionManager();
  }

  async connect(): Promise<Connection> {
    const connectionOptions: ConnectionOptions = {
      type: 'postgres',
      database: 'justread',
      host: process.env.DB_ENDPOINT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: 5432,
      synchronize: true,
      logging: true,
      entities: [__dirname + '/entities/*{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      cli: {
        entitiesDir: 'entities',
        migrationsDir: 'migrations'
      }
    };
    return createConnection(connectionOptions);
  }

  async getConnection(): Promise<Connection> {
    const CONNECTION_NAME = `default`;
    if (this.connectionManager.has(CONNECTION_NAME)) {
      const connection = this.connectionManager.get(CONNECTION_NAME);
      try {
        if (connection.isConnected) {
          await connection.close();
        }
      } catch (error) {
        console.log(error);
      }
      return connection.connect();
    }
    return this.connect();
  }
}

export default Database;
