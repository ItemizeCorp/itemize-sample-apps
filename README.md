# Itemize API React Demo App

This repository contains a sample app, built with create-react-app, that showcases a simple integration with the [Itemize API](https://www.itemize.com/api/).

For more information, check out the [Itemize API Documentation](https://apidocs.itemize.com/enterprise/).

## Building the App

First, download or clone the repository.

Then, update the configuration file (```itemize-react-demo-app/src/config.json```) with your Itemize API Key and Account ID:
```
{
  "ITEMIZE_API_KEY": "INSERT_KEY_HERE",
  "ITEMIZE_ACCOUNT_ID": "INSERT_ACCOUNT_ID_HERE",
  "POLLING_INTERVAL": 3000
}
```
If you don't have a key and would like one, you can request one [here](https://www.itemize.com/api/).

Finally, inside the project folder:

#### `npm install && npm run start`

or

#### `yarn && yarn start`

Then open [http://localhost:3000/](http://localhost:3000/) to see the sample app.<br>

## Uploading Documents

Select a valid JPEG, PNG, or PDF to upload.

Upon a successful upload, the app will poll the API until the uploaded document has finished processing.

Once processing is complete, you can explore the formatted data.
