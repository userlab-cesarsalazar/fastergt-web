import Amplify from 'aws-amplify'

export default Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'us-east-1:ccec3be5-951e-41de-89d5-80251260112b',
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_V3Jt8F0yn',
    identityPoolRegion: 'us-east-1',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '201l4ar6n6pjt13f7rtlqdv6oi',

    authenticationFlowType: 'USER_PASSWORD_AUTH',
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
  },
})
