import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import serverless from 'serverless-http';
import createApp from './app';

let serverlessApp: serverless.Handler;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (!serverlessApp) {
    const app = await createApp();
    serverlessApp = serverless(app);
  }
  return serverlessApp(event, context);
};
