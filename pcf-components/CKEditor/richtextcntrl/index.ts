import { constants } from "./constants";
import {IInputs, IOutputs} from "./generated/ManifestTypes";
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const ClassicEditor = require( '@ckeditor/ckeditor5-build-classic' );

//const ClassicEditor = require( '@ckeditor/ckeditor5-editor-classic/src/classiceditor' );

import CustomUploadAdapter from  './CustomUploadAdapter';  
export class richtextcntrl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _divHeadingElement : HTMLDivElement;
	private _divEditorElement : HTMLDivElement;
	private _container: HTMLDivElement;
	private _notifyOutPutChanges:() => void;
	private _context : ComponentFramework.Context<IInputs>;
	private _editorText:string;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
	{
		//initialize variables
		this._context = context;
		this._container = container;
		this._notifyOutPutChanges = notifyOutputChanged;
		this._editorText = "";

		//create elements
		this._divHeadingElement = document.createElement("div");
		this._divHeadingElement.setAttribute("id","heading");
		this._divHeadingElement.innerHTML =  constants.lbl_heading;

		this._divEditorElement = document.createElement("div");
		this._divEditorElement.setAttribute("id","editor");

		//Add Elements to the DOM
		this._container.appendChild(this._divHeadingElement);
		this._container.appendChild(this._divEditorElement);
		
		
		//Convert div to CKEditor
		ClassicEditor
		.create(  document.querySelector( '#editor' ), {
			extraPlugins: [this.CustomUploadAdapterPlugin]   
		})
		.then( (editor: any) => {
			console.log( editor );
			editor.model.document.on('change:data', (evt: any, data: any) => {
				this._editorText = editor.getData();
				console.log(this._editorText);

				//Update the output property
				this._notifyOutPutChanges();
			});
		} )
		.catch( (error: any) => {
			console.error( error );
		} );

		
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this._context = context; 
	}

	/**
	 * It is called by the framework prior to a control receiving new data.
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			editor_text: this._editorText
		};
	}

	/**
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
	public CustomUploadAdapterPlugin(editor: { plugins: { get: (arg0: string) => { (): any; new(): any; createUploadAdapter: (loader: any) => CustomUploadAdapter; }; }; }) {    
		editor.plugins.get('FileRepository').createUploadAdapter = function (loader: any) {    
		  /* Initialize CustomUploadAdapterPlugin class to initiate custom upload adapter */    
		  return new CustomUploadAdapter(loader);    
		};    
	  }   
}
