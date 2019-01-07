export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "pieces-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://oq5lznt7o6.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_4pOo1Sv5j",
    APP_CLIENT_ID: "59enm1p06tojkc9m9bb7g36bre",
    IDENTITY_POOL_ID: "us-east-1:7d7fcfd3-4974-464c-a7b8-7dca59fbe02e"
  }
};
