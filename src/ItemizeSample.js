import './ItemizeSample.css';

import React, { Component } from 'react';
import TreeView from './components/TreeView'
import Loader from './components/Loader'
import { ITEMIZE_API_KEY, ITEMIZE_ACCOUNT_ID } from './config.json'


class ItemizeSample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formattedData: null,
      file: null,
      loading: false,
    };
  }

  /* Itemize API Integration */

  buildFormData = () => { /* Documents must be uploaded to the Itemize API as Content-Type multipart/form-data */
    const formData = new FormData();

    /* You must include your financial document image file in the document parameter of your form-data */
    const { file } = this.state;
    formData.append('document', file);

    /* You must include the format of your image file in the metadata parameter of your form-data */
    const metadata = {};
    metadata.format = file.type;
    formData.append('metadata', JSON.stringify(metadata));

    return formData;
  }

  postDocumentToItemizeAPI = async () => { /* Make sure to insert your Account ID and API Key into the config.json, they will be used here */
    const itemizeApiUrl = `https://sandbox.proapi.itemize.com/api/enterprise/v1/accounts/${ITEMIZE_ACCOUNT_ID}/documents`;
    const formData = this.buildFormData();

    const init = {
       method: 'POST',
       headers: {
         Authorization: `Basic ${btoa(':' + ITEMIZE_API_KEY)}`,
       },
       body: formData,
     };

     try {
        const response = await fetch(itemizeApiUrl, init);
        if (response.ok) {
          const json = await response.json();
          this.beginPollingForProcessedDocument(json.id);
        } else {
          const { error } = await response.json();
          throw new Error(error);
        }
      } catch (error) {
        this.handleError(error);
      }
  }

  getDocumentFromItemizeAPI = async (documentID) => {
    const itemizeApiUrl = `https://sandbox.proapi.itemize.com/api/enterprise/v1/accounts/${ITEMIZE_ACCOUNT_ID}/documents/${documentID}`;

    const init = {
       method: 'GET',
       headers: {
         Authorization: `Basic ${btoa(':' + ITEMIZE_API_KEY)}`,
       },
     };

     try {
        const response = await fetch(itemizeApiUrl, init)
        if (response.ok) {
          const json = await response.json();
          this.handleGetDocumentSuccess(json);
        } else if (response.status !== 404) {
          const { error } = await response.json();
          throw new Error(error);
        }
      } catch (error) {
        this.handleError(error);
      }
  }

  beginPollingForProcessedDocument = (documentId) => {
    this.pollingInterval = setInterval(
      () => this.getDocumentFromItemizeAPI(documentId),
      3000
    );
  }

  /* Validation */

  isFileTypeValid = () => { /* The Itemize API only accepts paper documents in JPEG, PNG, or PDF format */
    const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (validFileTypes.indexOf(this.state.file.type) !== -1) {
      return true;
    }
    return false;
  }


  /* Event Handling */

  handleGetDocumentSuccess = (json) => {
    clearInterval(this.pollingInterval);

    this.setState({
      formattedData: json,
      file: null,
      loading: false,
    });
  }

  handleError = (error) => {
    alert(error || "There was an error in the response, please make sure you're using a valid document and filled in the correct API Key and Account ID.");

    this.setState({
      formattedData: null,
      file: null,
      loading: false,
    });
  }

  handleUploadDocumentClick = () => {
    if (this.isFileTypeValid()) {
      this.postDocumentToItemizeAPI();
      this.setState({
        loading: true,
        formattedData: null
      });
    } else {
      alert("The file you selected isn't valid, please use a jpeg, png, or pdf");
    }
  }

  handleFileSelect = (files) => this.setState({ file: files[0] });


  /* Render */

  render() {
    const disableUploadButton = !this.state.file || this.state.loading
    return (
      <div className="itemize-sample">
        <header className="itemize-sample__header">
          <h1>Itemize Sample React App</h1>
          <input type="file" onChange={ (e) => this.handleFileSelect(e.target.files) } />
          <button
            disabled={disableUploadButton}
            onClick={this.handleUploadDocumentClick}
            >
              Upload Document Image
            </button>
        </header>
        { this.state.formattedData && <TreeView src={this.state.formattedData} /> }
        { this.state.loading && <Loader /> }
      </div>
    );
  }
}


export default ItemizeSample;
