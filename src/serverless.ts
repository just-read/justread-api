import { APIGatewayProxyHandler } from 'aws-lambda';
import serverless from 'serverless-http';
import createApp from './app';
import Database from './database';

let serverlessApp: serverless.Handler;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!serverlessApp) {
    const app = await createApp();
    serverlessApp = serverless(app);
  }

  const database = new Database();
  const connection = await database.getConnection();
  const response = await serverlessApp(event, context);

  try {
    await connection.close();
  } catch (error) {
    console.error(error);
  }

  return response;
};
