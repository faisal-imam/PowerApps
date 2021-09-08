/* this is my custom Image file adapter */  
export default class CustomUploadAdapter {  
    loader:any;  
    reader:any;  
    constructor(loader: any) {  
    // The file loader instance to use during the upload.  
    this.loader = loader;  
    }  
    //Starts the upload process.  
    upload() {  
    return this.loader.file  
    .then((file: any) => new Promise((resolve, reject) => {  
    this._initListeners(resolve, reject, file);  
    }));  
    }  
    _initListeners(resolve: { (value: unknown): void; (arg0: { default: string | ArrayBuffer | null; }): void; }, reject: { (reason?: any): void; (arg0: ProgressEvent<FileReader> | undefined): void; }, file: { name: any; }) {  
    console.log(file.name);  
    const reader = this.reader = new FileReader();  
    reader.addEventListener('load', () => {  
    resolve({ default: reader.result });  
    });  
    reader.addEventListener('error', err => {  
    reject(err);  
    });  
    reader.addEventListener('abort', () => {  
    reject();  
    });  
    this.loader.file.then((file: Blob) => {  
    reader.readAsDataURL(file);  
    reader.result  
    });  
    }  
    abort() {  
    this.reader.abort();  
    }  
    }  