import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import { TextDocument, Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver-types';
import { JSONWorker } from 'monaco-editor/esm/vs/language/json/jsonWorker';

import { SCHEMA } from './schema';


function traverse( node, level ) {
    const key = node.keyNode;
    const value = node.valueNode;

    if ( key ) {
        console.log( ' '.repeat( level * 2 ) + key.value + ' [', value.type, ']' );
    }

    if ( node.children ) {
        node.children.forEach( c => traverse( c, level + 1 ) );
    }
}


self.onmessage = function () {
    // ignore the first message
    worker.initialize( function ( ctx, createData ) {
        const jsonWorker = new JSONWorker( ctx, createData );

        const baseValidation = jsonWorker.doValidation;

        jsonWorker.doValidation = function ( this: any, uri ) {
            var document = this._getTextDocument( uri );
            if ( document ) {
                const jsonDocument = this._languageService.parseJSONDocument( document );
                const nodesQueue = [ jsonDocument.root ];
                const problems = [];

                let node;
                while ( node = nodesQueue.shift() ) {

                    if ( !Array.isArray( node.children ) || node.children.length === 0 )
                        continue;

                    const typeNode = node.children[ 0 ];
                    // 1. Validate first property is type
                    const hasType = typeNode.keyNode.type === 'string' && typeNode.keyNode.value === 'type';
                    if ( !hasType ) {
                        const range = Range.create( document.positionAt( node.offset ), document.positionAt( node.offset + node.length ) );
                        problems.push( Diagnostic.create( range, 'type property is missing', DiagnosticSeverity.Error ) );
                        continue;
                    }

                    const type = typeNode.valueNode.value;
                    const schema = SCHEMA.get( type );
                    if ( schema == null ) {
                        const range = Range.create( document.positionAt( typeNode.valueNode.offset ), document.positionAt( typeNode.valueNode.offset + typeNode.valueNode.length ) );
                        problems.push( Diagnostic.create( range, `Unknwon type: ${type}`, DiagnosticSeverity.Error ) );
                        continue;
                    }

                    node.children.forEach( c => {
                        if ( c.valueNode.type === 'object' ) {
                            nodesQueue.push( c.valueNode );
                        } else if ( c.valueNode.type === 'array' ) {
                            nodesQueue.push( ...c.valueNode.items );
                        }
                    } );
                }

                return problems;
            }

            return baseValidation.apply( this, [ uri ] );
        }

        console.log( 'Custom JSON Worker is running' );

        return jsonWorker;
    } );
};
