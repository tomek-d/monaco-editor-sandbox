// Import stylesheets
import './style.css';
import { data } from "./data";
import { PersonMarker } from './ace-person-marker';

import ace = require( 'brace' );
import 'brace/mode/json';

const appDiv: HTMLElement = document.getElementById( 'app' );

const editor = ace.edit( appDiv );
const session = editor.getSession();

session.setMode( 'ace/mode/json' );
session.setValue( JSON.stringify( data, null, 2 ) );
session.addDynamicMarker( new PersonMarker(), false );

( window as any ).session = session;