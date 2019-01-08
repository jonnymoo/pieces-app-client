const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "pieces-app-uploads-dev"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.piecenotes.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_rTUVMURAH",
    APP_CLIENT_ID: "4bq76hqvbih63a1prhgu974q77",
    IDENTITY_POOL_ID: "us-east-1:181a9e91-e83e-41d2-88e2-73e9f37c82bf"
  },
  STRIPE_KEY: "pk_test_bHU9ftwsY7MmN3aSHQX6dFFz"
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "pieces-app-uploads-prod"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.piecesnotes.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_P9hBirfg3",
    APP_CLIENT_ID: "7m1g0tv6ef0uvqf551ov43bct9",
    IDENTITY_POOL_ID: "us-east-1:53b0bb69-b0ef-4ccf-b53a-88066c298e30"
  },
  STRIPE_KEY: "pk_test_bHU9ftwsY7MmN3aSHQX6dFFz"
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === "prod" ? prod : dev;

export default {
  // Add common config values here
  ...config
};
