# RxJS implementation of Jello for Sharepoint Lists
Code here is experimental. Use the master or dev branches for production implementations.

## How to run
- clone the repository
- create `secrets.json` with the following structure
```json
{
  "username" : "<your_user_name>",
  "password" : "<your_user_password>",
  "site" : "<site_you_want_to_upload_to>"
}
```
- run `gulp sharepoint`
