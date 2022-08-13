
import { DataSourceService } from "./DataSourceService";
import { entities } from "./entities";

let dataSource: DataSourceService | null = null

const nodeEnv = process.env.NODE_ENV

const close = async () => {
    if(dataSource){
        console.log('DATABASE CLOSING')
        await dataSource?.destroy()
        dataSource = null
    }
    
}

const handleExit = async (code: number, sig = 'UNKNOW', timeout = 500): Promise<void> => {
    const isTesting = ['test', 'testing'].includes(nodeEnv);

    // eslint-disable-next-line no-console
    const log = (str = 'nothing') => !isTesting && console.log(str);
    try {
      if (!isTesting) log(`(${sig}) Attempting a graceful shutdown with code ${code}`);

      setTimeout(() => {
        log(`Forcing a shutdown with code ${code}`);
        process.exit(code);
      }, timeout).unref();

      close()

      log(`Exiting gracefully with code ${code}`);
      process.exit(code);
    } finally {
      process.exit(code);
    }
  };

export async function prepareDataSource() {
    const create = async () => {
        console.log('CREATE DATABASE')
        process.on('SIGTERM', () => {
            handleExit(0, 'SIGTERM');
        });
        
        process.on('SIGINT', () => {
           handleExit(0, 'SIGINT');
        });

        dataSource = new DataSourceService({
            type: 'mysql', 
            entities,
            url: process.env.DATABASE_URL, 
            synchronize: false, 
            // logging: ['error'],
            logging: ['error', 'query'],
        })
        
        await dataSource.initialize()
        console.log('DATABASE INITIALIZED')
        return dataSource;
    }

    if (!dataSource) {
        return create()
    } else if (!!dataSource?.isInitialized) {
        await close()
        return create()
    } 

    await dataSource?.initialize()
    return dataSource;
}