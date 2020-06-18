### Trying out Firebase Auth

This app is just a try-it-out for Firebase Auth and might not follow the best practises for a typical NodeJS app.

#### Trying locally

Get your service account keys from Firebase, and save them as `serviceAccountKey.json` in the project root.

 - Installing dependencies

   `npm install`
  
 - Serving

   `node app.js`

#### The authentication flow

1. User lands on the front end, if the userv isn't signed in(in case when there's no cookie present), the user clicks on Sign In.
2. This example uses Google Auth as the authentication provider, and the user can sign in with his/her Google credentials.

     `var provider = new firebase.auth.GoogleAuthProvider();`
3. Upon entering the Google credentials, use `getIDToken()` to get the ID token(the actual JWT token). Apparently the `accessToken` in the response, does not work with `verifyIdToken()`.
4. Use the token obtained from above and send it to a custom endpoint for session login.

```js
axios.post('/session-login', { token: token }, { "Content-Type": "application/json" }).then((response) => {
          console.log(response)
          }, (error) => {
          console.log(error);
          });
```

ref: [SO answer](https://stackoverflow.com/a/39193057/6793666)

5. The nodeJS app uses the Firebase Admin SDK.
6. The token from the request body is passed to `verifyIDToken()`
7. Upon successful resolution of the promise, a session cookie is created and sent back
8. Since the front end does not have any state knowledge, clearing the cookies for logout does the job just fine.
9. Also, revoking the token is done from Firebase Rules.



#### Key points 

 - Since cookies are being used for session management, do not persist any state on the client side.
   `firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);`


#### Key difference(s) noted between Firebase Auth and Supertokens

 - Refresh token issued by Firebase does not expire unless the user is deleted, disabled, or any adhoc event while supertokens uses rotating refresh tokens.

