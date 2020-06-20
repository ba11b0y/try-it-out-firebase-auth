### The `idToken` case explained and a comparison

#### Backstory

In my case, I was using Google as my authentication provider and was using the `signInWithPopup`(there are others as well, where the user is redirected, or just shown a nice looking popup in the top right corner.) method.
Upon resolution of any of the methods(which in turn return a  Promise) you might be using in your case, you get a result object.
This result object contains four objects, namely, `user`, `credential`, `additionalUserInfo` and `operationType`
The `credential` object contains an idToken(`result.credential.idToken`), which is a JWT token.
When passing this token to the `verifyIdToken()` for verification, the verification fails and returns the following error.

```js
"Firebase ID token has incorrect "aud" (audience) claim. Expected "test-it-out-d98b7" but got "758694990368-f0hins16cs6kihe425cluh9s2itbei0v.apps.googleusercontent.com". Make sure the ID token comes from the same Firebase project as the service account used to authenticate this SDK. See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token."
```

#### Explanation

Tracing the `verifyIdToken()` method https://github.com/firebase/firebase-admin-node/blob/master/src/auth/token-verifier.ts#L197
Since it is quite evident from the error message, the error is because of project ID mismatch.
But since I have initialized the app with the correct project ID, this probably happens because it never includes the aud claim.

Firebase [docs](https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients) hence, [suggests only](https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients) using the `user.getIdToken()` method to obtain the token.
The token returned from the above method is different and contains the audience claim and works fine with `verifyIdToken()`

#### Supertokens vs Firebase

#### Pros

 - No need of running a separate service.
 - Offers a nice dashboard(console).

#### Cons

 - I personally felt a lot of configuration and one-time-setups were needed to be done, and this attributed to the friction in getting started quickly.
 - Also, I think the Firebase team have added a lot of features which essentially has made Firebase quite a lot more than just a simple Authentication service. (Yes this is a con for me, [Unix philosophy](https://wiki.c2.com/?UnixDesignPhilosophy))
 Would have loved it more, if it were just a simple authentication service.

Also, I personally feel it's difficult to compare Supertokens and Firebase, since Firebase has outgrown into a huge giant.

