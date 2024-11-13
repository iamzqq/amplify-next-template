import type { Schema } from "../resource";
import { env } from "$amplify/env/list-groups-for-user";
import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["listGroupsForUser"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  const { userId } = event.arguments;
  const command = new AdminListGroupsForUserCommand({
    Username: userId,
    UserPoolId: env.AWS_ACCESS_KEY,
  });
  const response = await client.send(command);
  return response;
};
